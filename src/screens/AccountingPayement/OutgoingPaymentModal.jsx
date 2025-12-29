
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../../components/Inputfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// Generate signature for Cloudinary
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

// Upload to Cloudinary
const uploadToCloudinary = async (fileUri) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', { uri: fileUri, type, name: filename });
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const result = await response.json();
    if (response.ok && result.secure_url) {
      console.log('✅ Uploaded:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};

const OutgoingPaymentModal = ({ visible, onClose, onSave, editingTransaction, project }) => {
  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // Dropdown data states
  const [vendorNames, setVendorNames] = useState([]);
   const [modeOptions, setModeOptions] = useState([
      { name: 'Cash', value: 'cash' },
      { name: 'Bank Transfer', value: 'bank_transfer' },
      { name: 'UPI', value: 'upi' },
      { name: 'Cheque', value: 'cheque' },
    ]);
  
    const [bankOptions, setBankOptions] = useState([
      { name: 'State Bank of India', value: 'sbi' },
      { name: 'HDFC Bank', value: 'hdfc' },
      { name: 'ICICI Bank', value: 'icici' },
      { name: 'Axis Bank', value: 'axis' },
    ]);
  
    const [costCodeOptions, setCostCodeOptions] = useState([
      { name: 'MAT-2024-001', value: 'mat001' },
      { name: 'LAB-2024-002', value: 'lab002' },
      { name: 'EQP-2024-003', value: 'eqp003' },
      { name: 'SVC-2024-004', value: 'svc004' },
    ]);
  
    const [categoryOptions, setCategoryOptions] = useState([
      { name: 'Material Purchase', value: 'material' },
      { name: 'Labor Charges', value: 'labor' },
      { name: 'Equipment Rental', value: 'equipment' },
      { name: 'Service Charges', value: 'service' },
    ]);

  // Selected values
  const [selectedValues, setSelectedValues] = useState({
    vendorId: '',
    vendorName: '',
    mode: '',
    bank: '',
    costCode: '',
    category: '',
  });

  // UI states
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  // Format date
  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

  // Fetch vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${process.env.BASE_API_URL}/api/vendor`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch vendors');

        const vendorsRes = await response.json();
        const mapped = (vendorsRes.data || vendorsRes || []).map(v => ({
          id: v._id || v.id,
          name: v.name || 'Unknown Vendor',
        }));

        setVendorNames(mapped);
      } catch (error) {
        console.error('Error loading vendors:', error);
        Alert.alert('Error', 'Failed to load vendors');
      }
    };

    loadVendors();
  }, []);

  // Initialize form for editing
  useEffect(() => {
    if (editingTransaction && visible) {
      setAmount(editingTransaction.amount?.toString() || '');
      setDescription(editingTransaction.description || editingTransaction.remarks || '');
      if (editingTransaction.paymentDate) {
        setSelectedDate(new Date(editingTransaction.paymentDate));
      }
      setSelectedValues({
        vendorId: editingTransaction.vendorId || '',
        vendorName: editingTransaction.vendorName || '',
        mode: editingTransaction.paymentMode || '',
        bank: editingTransaction.bankName || '',
        costCode: editingTransaction.costCode || '',
        category: editingTransaction.category || '',
      });
      setUploadedDocs(editingTransaction.documents || []);
    } else if (!visible) {
      // Reset when modal closes
      setAmount('');
      setDescription('');
      setSelectedDate(new Date());
      setSelectedValues({
        vendorId: '',
        vendorName: '',
        mode: '',
        bank: '',
        costCode: '',
        category: '',
      });
      setUploadedDocs([]);
      setShowDropdown(null);
    }
  }, [editingTransaction, visible]);

  const showDropdownMenu = (type) => {
    let options = [];
    switch (type) {
      case 'vendorName':
        options = vendorNames;
        break;
      case 'mode':
        options = modeOptions;
        break;
      case 'bank':
        options = bankOptions;
        break;
      case 'costCode':
        options = costCodeOptions;
        break;
      case 'category':
        options = categoryOptions;
        break;
      default:
        options = [];
    }
    setDropdownOptions(options);
    setShowDropdown(type);
  };

  const handleSelect = (type, item) => {
    if (type === 'vendorName') {
      setSelectedValues(prev => ({
        ...prev,
        vendorId: item.id,
        vendorName: item.name,
      }));
    } else {
      setSelectedValues(prev => ({
        ...prev,
        [type]: item.name || item.label || item.value,
      }));
    }
    setShowDropdown(null);
  };

  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow media access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs(prev => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Try again.');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  const handleSave = () => {
    if (!amount || !selectedValues.vendorId) {
      Alert.alert('Missing Fields', 'Please select a vendor and enter amount.');
      return;
    }

    const paymentModeMap = {
      'Cash': 'cash',
      'Bank Transfer': 'bank_transfer',
      'UPI': 'upi',
      'Cheque': 'cheque',
    };

    const payload = {
      type: 'payment_out',
      amount: parseFloat(amount),
      description,
      vendorId: selectedValues.vendorId,
      paymentMode: paymentModeMap[selectedValues.mode] || 'cash',
      date: selectedDate.toISOString(),
      documents: uploadedDocs,
      bankName: selectedValues.bank,
      costCode: selectedValues.costCode,
      category: selectedValues.category,
      projectId: project?._id, // optional - remove if not needed
    };

    console.log('Outgoing Payment Payload:', payload);
     onSave(payload);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 32,
              maxHeight: '90%',
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
              {/* Title + Date */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20 }}>Outgoing Payment</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#999', marginRight: 4 }}>{formatDate(selectedDate)}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* To (Vendor) */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>To (Vendor)</Text>
                <TouchableOpacity
                  onPress={() => showDropdownMenu('vendorName')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{selectedValues.vendorName || 'Select Vendor'}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <InputField
                label="Amount Paid"
                placeholder="₹25,000"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <InputField
                label="Description / Remarks"
                placeholder="Payment for concrete supply"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              {/* Mode */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Mode</Text>
                <TouchableOpacity
                  onPress={() => showDropdownMenu('mode')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{selectedValues.mode || 'Select Mode'}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Bank Name */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Bank Name</Text>
                <TouchableOpacity
                  onPress={() => showDropdownMenu('bank')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{selectedValues.bank || 'Select Bank'}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Cost Code */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Cost Code</Text>
                <TouchableOpacity
                  onPress={() => showDropdownMenu('costCode')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{selectedValues.costCode || 'Select Cost Code'}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Category */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Category</Text>
                <TouchableOpacity
                  onPress={() => showDropdownMenu('category')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{selectedValues.category || 'Select Category'}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Uploaded Documents */}
              {uploadedDocs.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Uploaded Documents</Text>
                  {uploadedDocs.map((url, i) => (
                    <Text key={i} style={{ color: '#0066FF', fontSize: 12 }}>
                      Document {i + 1}
                    </Text>
                  ))}
                </View>
              )}

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0066FF',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                  onPress={handleSave}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {editingTransaction ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDocumentUpload}
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#00C896',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="paperclip" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Dropdown */}
          {showDropdown && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDropdown(null)} />
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  margin: 20,
                  maxHeight: '50%',
                }}
              >
                <FlatList
                  data={dropdownOptions}
                  keyExtractor={(item, index) => `${item.id || item.value}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(showDropdown, item)}
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.name || item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          )}

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OutgoingPaymentModal;