import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header'; // Assuming Header exists

const BASE_URL = `${process.env.BASE_API_URL}`;

const CreatePOScreen = ({ route, navigation }) => {
  const { requestItem } = route.params || {};
  
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    poNumber: `PO-${Math.floor(Date.now() / 1000)}`,
    vendorId: '',
    vendorName: '',
    materialName: requestItem?.name || '',
    quantity: requestItem?.qty?.toString() || '',
    rate: '',
    advanceAmount: '',
    expectedDate: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Load Vendors
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Mocking fetch if API not ready, or use real endpoint
      const response = await fetch(`${BASE_URL}/api/vendor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success || Array.isArray(json.data)) {
        setVendors(json.data || []);
      }
    } catch (err) {
      console.log('Error fetching vendors', err);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    return (qty * rate).toFixed(2);
  };

  const calculateBalance = () => {
    const total = parseFloat(calculateTotal());
    const advance = parseFloat(formData.advanceAmount) || 0;
    return (total - advance).toFixed(2);
  };

  const  handleCreatePO = async () => {
    if (!formData.vendorId || !formData.rate || !formData.quantity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const payload = {
        items: [{
          materialName: formData.materialName,
          quantity: parseFloat(formData.quantity),
          rate: parseFloat(formData.rate),
          amount: parseFloat(calculateTotal())
        }],
        totalAmount: parseFloat(calculateTotal()),
        advanceAmount: parseFloat(formData.advanceAmount) || 0,
        projectId: requestItem?.projectId || 'current-project-id', // Needs valid ID
        vendorId: formData.vendorId,
        poNumber: formData.poNumber,
        indentRef: requestItem?.id
      };

      // Call Backend API (to be implemented on server)
      const res = await fetch(`${BASE_URL}/api/materials/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        Alert.alert('Success', 'Purchase Order Created Successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Fallback for demo if backend route missing
        Alert.alert('Info', 'Backend endpoint /api/materials/purchase needed. Payload prepared.');
        navigation.goBack();
      }

    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header title="Create Purchase Order" showBackButton={true} onBackPress={() => navigation.goBack()} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView className="p-4">
          
          {/* Item Details Card */}
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <Text className="text-gray-500 text-xs mb-1">Request Ref</Text>
            <Text className="font-bold text-lg text-slate-800">{formData.materialName}</Text>
            <Text className="text-slate-500">Requested Qty: {requestItem?.qty || '-'}</Text>
          </View>

          {/* PO Number */}
          <View className="mb-4">
            <Text className="text-slate-700 font-medium mb-1">PO Number</Text>
            <TextInput
              value={formData.poNumber}
              editable={false}
              className="bg-slate-100 p-3 rounded-lg text-slate-500"
            />
          </View>

          {/* Vendor Selection */}
          <View className="mb-4">
            <Text className="text-slate-700 font-medium mb-1">Select Vendor</Text>
            <TouchableOpacity 
              onPress={() => setShowVendorModal(true)}
              className="bg-white p-3 rounded-lg border border-slate-200 flex-row justify-between items-center"
            >
              <Text className={formData.vendorName ? "text-slate-800" : "text-slate-400"}>
                {formData.vendorName || "Tap to select vendor"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#cbd5e1" />
            </TouchableOpacity>
            
            {/* Simple Vendor Dropdown/List for Demo */}
            {showVendorModal && (
                <View className="mt-2 bg-white rounded-lg shadow-lg max-h-40">
                    <ScrollView nestedScrollEnabled>
                        {vendors.map(v => (
                            <TouchableOpacity 
                                key={v._id || v.id} 
                                className="p-3 border-b border-slate-100"
                                onPress={() => {
                                    setFormData({ ...formData, vendorId: v._id || v.id, vendorName: v.name });
                                    setShowVendorModal(false);
                                }}
                            >
                                <Text>{v.name}</Text>
                            </TouchableOpacity>
                        ))}
                        {vendors.length === 0 && <Text className="p-3 text-slate-400">No vendors found</Text>}
                         <TouchableOpacity onPress={() => setShowVendorModal(false)} className="p-2 bg-slate-50 items-center"><Text className="text-blue-500">Close</Text></TouchableOpacity>
                    </ScrollView>
                </View>
            )}
          </View>

          {/* Financials */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
                <Text className="text-slate-700 font-medium mb-1">Quantity</Text>
                <TextInput
                    value={formData.quantity}
                    onChangeText={t => setFormData({...formData, quantity: t})}
                    keyboardType="numeric"
                    className="bg-white p-3 rounded-lg border border-slate-200"
                    placeholder="0.00"
                />
            </View>
            <View className="flex-1">
                <Text className="text-slate-700 font-medium mb-1">Rate (QAR)</Text>
                <TextInput
                    value={formData.rate}
                    onChangeText={t => setFormData({...formData, rate: t})}
                    keyboardType="numeric"
                    className="bg-white p-3 rounded-lg border border-slate-200"
                    placeholder="0.00"
                />
            </View>
          </View>
            
          <View className="mb-4">
             <Text className="text-slate-700 font-medium mb-1">Advance Amount (Optional)</Text>
             <TextInput
                value={formData.advanceAmount}
                onChangeText={t => setFormData({...formData, advanceAmount: t})}
                keyboardType="numeric"
                className="bg-white p-3 rounded-lg border border-slate-200"
                placeholder="0.00"
             />
          </View>

          {/* Summary Box */}
          <View className="bg-slate-50 p-4 rounded-xl mb-6">
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500">Total Amount</Text>
                <Text className="font-bold text-slate-800">QAR {calculateTotal()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500">Advance Pay</Text>
                <Text className="font-bold text-green-600">- QAR {formData.advanceAmount || '0.00'}</Text>
            </View>
            <View className="h-px bg-slate-200 my-2" />
            <View className="flex-row justify-between">
                <Text className="text-slate-500 font-medium">Balance Due</Text>
                <Text className="font-bold text-red-500">QAR {calculateBalance()}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCreatePO}
            disabled={loading}
            className={`p-4 rounded-xl items-center ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
          >
            <Text className="text-white font-bold text-lg">{loading ? 'Processing...' : 'Generate PO & Invoice'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePOScreen;
