// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'
// import InputField from '../components/Inputfield'

// const MaterialPurchaseModal = ({ visible, onClose, onSave }) => {
//   const [partyName, setPartyName] = useState('Arun Mishra');
//   const [unitRate, setUnitRate] = useState('120.0');
//   const [quantity, setQuantity] = useState('10.0');

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={onClose}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 8
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000'
//                   }}>
//                     Material Purchase
//                   </Text>
//                   <TouchableOpacity>
//                     <Feather name="edit-2" size={20} color="#0066FF" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Date */}
//                 <View style={{ marginBottom: 24 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 12,
//                     color: '#999999',
//                     marginBottom: 4
//                   }}>
//                     Material Purchase
//                   </Text>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     01 Apr 2025
//                   </Text>
//                 </View>

//                 {/* Party Name */}
//                 <InputField
//                   label="Party Name"
//                   placeholder="Arun Mishra"
//                   value={partyName}
//                   onChangeText={setPartyName}
//                   style={{ marginBottom: 20 }}
//                 />

//                 {/* Add Material Button */}
//                 <TouchableOpacity
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#0066FF',
//                     borderStyle: 'dashed',
//                     borderRadius: 8,
//                     paddingVertical: 12,
//                     alignItems: 'center',
//                     marginBottom: 16
//                   }}
//                 >
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#0066FF'
//                   }}>
//                     + Add Material
//                   </Text>
//                 </TouchableOpacity>

//                 {/* Material Item Card */}
//                 <View style={{
//                   backgroundColor: '#FAFAFA',
//                   borderRadius: 12,
//                   padding: 14,
//                   marginBottom: 20
//                 }}>
//                   {/* Item Header */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       Test Material
//                     </Text>
//                     <TouchableOpacity>
//                       <Feather name="trash-2" size={18} color="#FF4444" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Unit Dropdown */}
//                   <View style={{ marginBottom: 12 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 12,
//                       color: '#999999',
//                       marginBottom: 4
//                     }}>
//                       Unit
//                     </Text>
//                     <TouchableOpacity style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 8,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         no.s
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#999999" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Labels Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 8
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 12,
//                       color: '#999999',
//                       flex: 1
//                     }}>
//                       Unit Rate(₹)
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 12,
//                       color: '#999999',
//                       flex: 1,
//                       textAlign: 'right'
//                     }}>
//                       Quantity
//                     </Text>
//                   </View>

//                   {/* Input Fields Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 12
//                   }}>
//                     {/* Unit Rate */}
//                     <View style={{ flex: 1 }}>
//                       <InputField
//                         label=""
//                         placeholder="120.0"
//                         value={unitRate}
//                         onChangeText={setUnitRate}
//                         style={{ marginBottom: 0 }}
//                       />
//                     </View>

//                     {/* Quantity */}
//                     <View style={{ flex: 1 }}>
//                       <InputField
//                         label=""
//                         placeholder="10.0"
//                         value={quantity}
//                         onChangeText={setQuantity}
//                         style={{
//                           marginBottom: 0,
//                           textAlign: 'right'
//                         }}
//                       />
//                     </View>
//                   </View>

//                   {/* Amount and GST Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 11,
//                       color: '#999999'
//                     }}>
//                       +18.0% GST
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Summary */}
//                 <View style={{ marginBottom: 20 }}>
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#666666'
//                     }}>
//                       Item Subtotal
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                   </View>
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 16
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Total Amount
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Cost Code - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Cost Code
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       PM-001
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Bill To / Ship To */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 30
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000'
//                   }}>
//                     Bill To / Ship To
//                   </Text>
//                   <TouchableOpacity>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#0066FF'
//                     }}>
//                       + Add Address
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center'
//                     }}
//                     onPress={onSave}
//                   >
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 16,
//                       color: 'white'
//                     }}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={{
//                       width: 56,
//                       height: 56,
//                       backgroundColor: '#00C896',
//                       borderRadius: 12,
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <Feather name="paperclip" size={24} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </Modal>
//   )
// }

// export default MaterialPurchaseModal

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../components/Inputfield';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import DateTimePicker from '@react-native-community/datetimepicker';

// ✅ Cloudinary Config
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// ✅ Generate signature for Cloudinary
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

// ✅ Upload to Cloudinary
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

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const result = await res.json();
    if (res.ok && result.secure_url) {
      console.log('✅ Uploaded:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else throw new Error(result.error?.message || 'Upload failed');
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return { success: false, error: err.message };
  }
};

// ✅ API Endpoint
const API_URL = 'https://skystruct-lite-backend.vercel.app/api/transactions';

// Dropdown options
const UNIT_OPTIONS = ['no.s', 'kg', 'meter', 'litre', 'piece', 'box', 'set'];
const COST_CODE_OPTIONS = ['PM-001', 'PM-002', 'PM-003', 'PM-004', 'PM-005'];
const GST_OPTIONS = ['0', '5', '12', '18', '28'];

const MaterialPurchaseModal = ({ visible, onClose, onSave, editData }) => {
  const [partyName, setPartyName] = useState('Arun Mishra');
  const [unitRate, setUnitRate] = useState('120.0');
  const [quantity, setQuantity] = useState('10.0');
  const [gstPercentage, setGstPercentage] = useState('18');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('no.s');
  const [selectedCostCode, setSelectedCostCode] = useState('PM-001');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCostCodeDropdown, setShowCostCodeDropdown] = useState(false);
  const [showGstDropdown, setShowGstDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [materialName, setMaterialName] = useState('Material');

  // Initialize or update data when editData changes
  useEffect(() => {
    if (editData) {
      // Populate fields with existing data for editing
      setPartyName(editData.vendorName || 'Arun Mishra');
      setUnitRate(editData.items?.[0]?.unitPrice?.toString() || '120.0');
      setQuantity(editData.items?.[0]?.quantity?.toString() || '10.0');
      
      // Calculate GST percentage from existing data
      const itemTotal = editData.items?.[0]?.total || 0;
      const itemSubtotal = parseFloat(unitRate) * parseFloat(quantity) || 0;
      const calculatedGst = itemTotal > 0 ? ((itemTotal - itemSubtotal) / itemSubtotal) * 100 : 18;
      setGstPercentage(calculatedGst.toFixed(0) || '18');
      
      setUploadedDocs(editData.documents || []);
      setSelectedDate(editData.invoiceDate ? new Date(editData.invoiceDate) : new Date());
      setMaterialName(editData.items?.[0]?.itemName || 'Material');
    } else {
      // Reset to default for new purchase
      setPartyName('Arun Mishra');
      setUnitRate('120.0');
      setQuantity('10.0');
      setGstPercentage('18');
      setUploadedDocs([]);
      setSelectedDate(new Date());
      setMaterialName('Material');
    }
  }, [editData, visible]);

  // Calculate amounts dynamically
  const subtotal = parseFloat(unitRate) * parseFloat(quantity) || 0;
  const gstAmount = subtotal * (parseFloat(gstPercentage) / 100) || 0;
  const totalAmount = subtotal + gstAmount;

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // 📂 Upload Document Handler
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted')
        return Alert.alert('Permission Denied', 'Please allow media access.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs((prev) => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Try again later.');
        }
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // 💾 Save/Update Material Purchase → API Integration
  const handleSave = async () => {
    try {
      const projectId =
        (await AsyncStorage.getItem('activeProjectId')) ||
        (await AsyncStorage.getItem('projectId'));
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!projectId || !userId || !token) {
        Alert.alert('Error', 'Missing project or user info. Please re-login.');
        return;
      }

      const payload = {
        projectId,
        createdBy: userId,
        type: 'purchase',
        vendorName: partyName,
        invoiceNumber: editData?.invoiceNumber || `PUR-${Date.now()}`,
        invoiceDate: selectedDate.toISOString(),
        items: [
          {
            itemName: materialName,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitRate),
            total: totalAmount, // Use total amount including GST
            remarks: '',
          },
        ],
        amount: totalAmount,
        remarks: `Purchased ${quantity} ${selectedUnit} at ₹${unitRate} per ${selectedUnit} with ${gstPercentage}% GST`,
        documents: uploadedDocs,
      };

      // If editing, include the _id for update
      if (editData && editData._id) {
        payload._id = editData._id;
      }

      console.log('📤 Sending Purchase Payload:', payload);

      const url = editData && editData._id ? `${API_URL}/${editData._id}` : API_URL;
      const method = editData && editData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      console.log('📩 API Response:', result);

      if (response.ok) {
        Alert.alert('Success', `Material purchase ${editData ? 'updated' : 'saved'} successfully!`);
        onClose();
        onSave(); // Refresh parent data
      } else {
        console.error('❌ API Error:', result);
        Alert.alert('Error', result.message || `Failed to ${editData ? 'update' : 'save'} material purchase.`);
      }
    } catch (error) {
      console.error('❌ Save Error:', error);
      Alert.alert('Error', `Something went wrong while ${editData ? 'updating' : 'saving'} purchase.`);
    }
  };

  // Handle material name edit
  const handleMaterialNameEdit = () => {
    Alert.prompt(
      'Edit Material Name',
      'Enter new material name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (text) => {
            if (text && text.trim()) {
              setMaterialName(text.trim());
            }
          },
        },
      ],
      'plain-text',
      materialName
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 32,
                maxHeight: '90%',
              }}>
              {/* Handle Bar */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#E0E0E0',
                    borderRadius: 2,
                  }}
                />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 20,
                      color: '#000000',
                    }}>
                    {editData ? 'Edit Purchase' : 'Material Purchase'}
                  </Text>
                  <TouchableOpacity onPress={handleMaterialNameEdit}>
                    <Feather name="edit-2" size={20} color="#0066FF" />
                  </TouchableOpacity>
                </View>

                {/* Date with Calendar */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 12,
                      color: '#999999',
                      marginBottom: 4,
                    }}>
                    Purchase Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 15,
                        color: '#000000',
                        marginRight: 8,
                      }}>
                      {formatDate(selectedDate)}
                    </Text>
                    <Feather name="calendar" size={16} color="#666666" />
                  </TouchableOpacity>
                </View>

                {/* Party Name */}
                <InputField
                  label="Party Name"
                  placeholder="Arun Mishra"
                  value={partyName}
                  onChangeText={setPartyName}
                  style={{ marginBottom: 20 }}
                />

                {/* Add Material Button */}
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#0066FF',
                    borderStyle: 'dashed',
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#0066FF',
                    }}>
                    + Add Material
                  </Text>
                </TouchableOpacity>

                {/* Material Item Card */}
                <View
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}>
                  {/* Item Header */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#000000',
                      }}>
                      {materialName}
                    </Text>
                    <TouchableOpacity>
                      <Feather name="trash-2" size={18} color="#FF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Unit Dropdown */}
                  <View style={{ marginBottom: 12 }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 12,
                        color: '#999999',
                        marginBottom: 4,
                      }}>
                      Unit
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        paddingVertical: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 14,
                          color: '#000000',
                        }}>
                        {selectedUnit}
                      </Text>
                      <Feather name="chevron-down" size={16} color="#999999" />
                    </TouchableOpacity>

                    {/* Unit Dropdown List */}
                    {showUnitDropdown && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 40,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          zIndex: 1000,
                          elevation: 5,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        }}>
                        {UNIT_OPTIONS.map((unit) => (
                          <TouchableOpacity
                            key={unit}
                            onPress={() => {
                              setSelectedUnit(unit);
                              setShowUnitDropdown(false);
                            }}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth: 1,
                              borderBottomColor: '#F0F0F0',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Urbanist-Regular',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              {unit}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Labels Row */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 12,
                        color: '#999999',
                        flex: 1,
                      }}>
                      Unit Rate(₹)
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 12,
                        color: '#999999',
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      Quantity
                    </Text>
                  </View>

                  {/* Input Fields Row */}
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 12,
                      marginBottom: 12,
                    }}>
                    {/* Unit Rate */}
                    <View style={{ flex: 1 }}>
                      <InputField
                        label=""
                        placeholder="120.0"
                        value={unitRate}
                        onChangeText={setUnitRate}
                        style={{ marginBottom: 0 }}
                        keyboardType="numeric"
                      />
                    </View>

                    {/* Quantity */}
                    <View style={{ flex: 1 }}>
                      <InputField
                        label=""
                        placeholder="10.0"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={{
                          marginBottom: 0,
                          textAlign: 'right',
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* GST Dropdown */}
                  <View style={{ marginBottom: 12 }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 12,
                        color: '#999999',
                        marginBottom: 4,
                      }}>
                      GST Percentage
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowGstDropdown(!showGstDropdown)}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        paddingVertical: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 14,
                          color: '#000000',
                        }}>
                        {gstPercentage}%
                      </Text>
                      <Feather name="chevron-down" size={16} color="#999999" />
                    </TouchableOpacity>

                    {/* GST Dropdown List */}
                    {showGstDropdown && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 40,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          borderWidth: 1,
                          borderColor: '#E0E0E0',
                          borderRadius: 8,
                          zIndex: 1000,
                          elevation: 5,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        }}>
                        {GST_OPTIONS.map((gst) => (
                          <TouchableOpacity
                            key={gst}
                            onPress={() => {
                              setGstPercentage(gst);
                              setShowGstDropdown(false);
                            }}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth: 1,
                              borderBottomColor: '#F0F0F0',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Urbanist-Regular',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                              {gst}%
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Amount and GST Row */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Bold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      ₹ {subtotal.toLocaleString()}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 11,
                        color: '#999999',
                      }}>
                      +{gstPercentage}% GST
                    </Text>
                  </View>
                </View>

                {/* Summary */}
                <View style={{ marginBottom: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#666666',
                      }}>
                      Item Subtotal
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#000000',
                      }}>
                      ₹ {subtotal.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#666666',
                      }}>
                      GST ({gstPercentage}%)
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#000000',
                      }}>
                      ₹ {gstAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: '#E0E0E0',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Bold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      ₹ {totalAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Cost Code - Dropdown */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 13,
                      color: '#000000',
                      marginBottom: 8,
                    }}>
                    Cost Code
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCostCodeDropdown(!showCostCodeDropdown)}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      {selectedCostCode}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>

                  {/* Cost Code Dropdown List */}
                  {showCostCodeDropdown && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 40,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 8,
                        zIndex: 1000,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                      }}>
                      {COST_CODE_OPTIONS.map((code) => (
                        <TouchableOpacity
                          key={code}
                          onPress={() => {
                            setSelectedCostCode(code);
                            setShowCostCodeDropdown(false);
                          }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F0F0F0',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Urbanist-Regular',
                              fontSize: 14,
                              color: '#000000',
                            }}>
                            {code}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Bill To / Ship To */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 30,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 13,
                      color: '#000000',
                    }}>
                    Bill To / Ship To
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#0066FF',
                      }}>
                      + Add Address
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0066FF',
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: 'center',
                    }}
                    onPress={handleSave}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 16,
                        color: 'white',
                      }}>
                      {editData ? 'Update' : 'Save'}
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
                    }}>
                    <Feather name="paperclip" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            style={{ backgroundColor: 'white' }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default MaterialPurchaseModal;