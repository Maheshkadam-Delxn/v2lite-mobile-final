// MaterialDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${process.env.BASE_API_URL}`;
const TOKEN_KEY = 'userToken';

const MaterialDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState('All Entries');
  const [materialDetails, setMaterialDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [usedModalVisible, setUsedModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);

  // Sample entries with Doha-based names
  const entries = [
    {
      id: '1',
      date: '30 Apr 2025',
      party: 'Al-Thani Trading Co.',
      qty: '+150',
      type: 'received',
    },
    {
      id: '2',
      date: '28 Apr 2025',
      party: 'Site A - Foundation Work',
      qty: '-75',
      type: 'used',
    },
    {
      id: '3',
      date: '25 Apr 2025',
      party: 'Qatar Building Materials',
      qty: '+200',
      type: 'received',
    },
    {
      id: '4',
      date: '22 Apr 2025',
      party: 'Site B - Masonry',
      qty: '-50',
      type: 'used',
    },
  ];

  // Forms for modals
  const [usedForm, setUsedForm] = useState({
    date: new Date().toLocaleDateString('en-GB'),
    material: '',
    quantity: '',
    notes: ''
  });

  const [receivedForm, setReceivedForm] = useState({
    partyName: '',
    materialName: '',
    quantity: '',
    challanNo: '',
    vehicleNo: '',
    notes: ''
  });

  // Sub tabs array
  const subTabs = [
    { id: 'All Entries', label: 'All' },
    { id: 'Received Entries', label: 'Received' },
    { id: 'Used Entries', label: 'Used' },
  ];

  // Fetch Material Details
  const fetchMaterialDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const materialId = item._id || item.id;

      if (!materialId) {
        throw new Error('Material ID not found');
      }

      const res = await fetch(`${BASE_URL}/api/materials/${materialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      if (!res.ok) {
        throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with status ${res.status}`);
      }

      setMaterialDetails(json.data || json);

    } catch (err) {
      console.error('[Material Details] GET error:', err);
      Alert.alert('Error', `Failed to fetch material details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialDetails();
  }, [item]);

  const filteredEntries = activeTab === 'All Entries'
    ? entries
    : activeTab === 'Received Entries'
    ? entries.filter(e => e.type === 'received')
    : entries.filter(e => e.type === 'used');

  const renderEntry = ({ item }) => (
    <View className="mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-slate-900">{item.date}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">{item.party}</Text>
        </View>
        <View 
          style={{
            backgroundColor: item.type === 'received' ? '#10b98115' : '#ef444415'
          }}
          className="px-3 py-1.5 rounded-full"
        >
          <Text
            style={{
              color: item.type === 'received' ? '#10b981' : '#ef4444'
            }}
            className="text-sm font-bold"
          >
            {item.qty}
          </Text>
        </View>
      </View>
      <View className="h-px bg-slate-100" />
    </View>
  );

  const renderSubTab = ({ item }) => (
    <TouchableOpacity
      style={activeTab === item.id ? { backgroundColor: '#0066FF' } : { backgroundColor: '#f8fafc' }}
      className="mx-1 px-5 py-2.5 rounded-full"
      onPress={() => setActiveTab(item.id)}
    >
      <Text
        className={`text-sm font-semibold ${
          activeTab === item.id ? 'text-white' : 'text-slate-600'
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const handleSaveUsed = () => {
    // TODO: Add API call to save used material
    Alert.alert('Success', 'Material usage recorded successfully');
    setUsedModalVisible(false);
    setUsedForm({ date: new Date().toLocaleDateString('en-GB'), material: '', quantity: '', notes: '' });
  };

  const handleSaveReceived = () => {
    // TODO: Add API call to save received material
    Alert.alert('Success', 'Material receipt recorded successfully');
    setReceivedModalVisible(false);
    setReceivedForm({ partyName: '', materialName: '', quantity: '', challanNo: '', vehicleNo: '', notes: '' });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="Material Details"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Material Info Card */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-5">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900">
                {materialDetails?.name || item?.name || 'Steel Rebar'}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {materialDetails?.category || 'Raw Materials'}
              </Text>
            </View>
            <View 
              style={{ backgroundColor: '#10b98115' }}
              className="px-3 py-1.5 rounded-full"
            >
              <Text style={{ color: '#10b981' }} className="text-xs font-semibold">
                Active
              </Text>
            </View>
          </View>
          
          {/* Stock Info */}
          {/* <View className="bg-slate-50 rounded-xl p-4 mb-4">
            <Text className="text-xs text-slate-500 mb-1">Current Stock</Text>
            <Text className="text-3xl font-bold text-slate-900">
              {materialDetails?.stock || item?.stock || '15,000'} 
              <Text className="text-xl text-slate-500"> {materialDetails?.unit || item?.unit || 'kg'}</Text>
            </Text>
          </View> */}

          {/* Details Grid */}
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-2 mb-3">
              <Text className="text-xs text-slate-500 mb-1">Cost Code</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {materialDetails?.costCode || 'MTL-001'}
              </Text>
            </View>
            <View className="w-1/2 pl-2 mb-3">
              <Text className="text-xs text-slate-500 mb-1">HSN Code</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {materialDetails?.hsnCode || '7213'}
              </Text>
            </View>
            <View className="w-1/2 pr-2">
              <Text className="text-xs text-slate-500 mb-1">GST Rate</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {materialDetails?.gst || '18'}%
              </Text>
            </View>
            <View className="w-1/2 pl-2">
              <Text className="text-xs text-slate-500 mb-1">Unit Price</Text>
              <Text className="text-sm font-semibold text-slate-900">
                QAR {materialDetails?.unitPrice || '45.00'}
              </Text>
            </View>
          </View>
        </View>

        {/* Sub Tabs */}
        <View className="mt-4 mb-3 px-4">
          <FlatList
            data={subTabs}
            renderItem={renderSubTab}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 4 }}
          />
        </View>

        {/* Entries List */}
        <View className="mx-4 rounded-2xl bg-white p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-slate-900">Transaction History</Text>
            <Text className="text-sm text-slate-500">{filteredEntries.length} entries</Text>
          </View>

          {filteredEntries.length > 0 ? (
            <FlatList
              data={filteredEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View className="py-12 items-center">
              <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
              <Text className="text-slate-400 text-sm mt-3">No {activeTab.toLowerCase()} found</Text>
            </View>
          )}
        </View>

        {/* Summary Stats */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-4 mb-24">
          <Text className="text-base font-bold text-slate-900 mb-4">Summary</Text>
          
          <View className="flex-row mb-3">
            <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2">
              <Text className="text-xs text-green-700 mb-1">Total Received</Text>
              <Text className="text-xl font-bold text-green-600">+350</Text>
            </View>
            <View className="flex-1 bg-red-50 rounded-xl p-3 ml-2">
              <Text className="text-xs text-red-700 mb-1">Total Used</Text>
              <Text className="text-xl font-bold text-red-600">-125</Text>
            </View>
          </View>

          <View className="h-px bg-slate-100 my-3" />

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-slate-600">Last Updated</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {materialDetails?.updatedAt ? 
                new Date(materialDetails.updatedAt).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                }) : '30 Apr 2025'
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4" style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
        <View className="flex-row">
          <TouchableOpacity 
            className="flex-1 flex-row items-center justify-center rounded-2xl bg-red-50 py-4 mr-2"
            onPress={() => setUsedModalVisible(true)}
          >
            <Ionicons name="remove-circle" size={20} color="#ef4444" />
            <Text className="text-sm font-semibold text-red-600 ml-2">Material Used</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 flex-row items-center justify-center rounded-2xl bg-green-50 py-4 ml-2"
            onPress={() => setReceivedModalVisible(true)}
          >
            <Ionicons name="add-circle" size={20} color="#10b981" />
            <Text className="text-sm font-semibold text-green-600 ml-2">Received</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* USED MODAL */}
      <Modal
        visible={usedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUsedModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-[90%]">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 bg-slate-200 rounded-full" />
            </View>
            
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-slate-900">Material Used</Text>
              <TouchableOpacity onPress={() => setUsedModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-slate-50 rounded-xl p-4 mb-4">
                <Text className="text-sm text-slate-600">Material</Text>
                <Text className="text-base font-semibold text-slate-900 mt-1">
                  {materialDetails?.name || item?.name || 'Steel Rebar'}
                </Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Date</Text>
                <View className="flex-row items-center justify-between bg-slate-50 rounded-xl p-4">
                  <Text className="text-base text-slate-900">{usedForm.date}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#64748b" />
                </View>
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Quantity ({materialDetails?.unit || 'kg'})</Text>
                <TextInput
                  className="text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                  placeholder="Enter quantity"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={usedForm.quantity}
                  onChangeText={(text) => setUsedForm({...usedForm, quantity: text})}
                />
              </View>
              
              <View className="mb-6">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</Text>
                <TextInput
                  className="h-24 text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                  placeholder="Add notes here..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                  value={usedForm.notes}
                  onChangeText={(text) => setUsedForm({...usedForm, notes: text})}
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={{ backgroundColor: '#0066FF' }}
              className="rounded-2xl py-4 flex-row items-center justify-center"
              onPress={handleSaveUsed}
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text className="text-white font-bold text-base ml-2">Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RECEIVED MODAL */}
      <Modal
        visible={receivedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReceivedModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-[90%]">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 bg-slate-200 rounded-full" />
            </View>
            
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-slate-900">Material Received</Text>
              <TouchableOpacity onPress={() => setReceivedModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-slate-50 rounded-xl p-4 mb-4">
                <Text className="text-sm text-slate-600">Material</Text>
                <Text className="text-base font-semibold text-slate-900 mt-1">
                  {materialDetails?.name || item?.name || 'Steel Rebar'}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Party Name</Text>
                <TextInput
                  className="text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                  placeholder="Enter supplier name"
                  placeholderTextColor="#94a3b8"
                  value={receivedForm.partyName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, partyName: text})}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Quantity ({materialDetails?.unit || 'kg'})</Text>
                <TextInput
                  className="text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                  placeholder="Enter quantity"
                  placeholderTextColor="#94a3b8"
                  value={receivedForm.quantity}
                  onChangeText={(text) => setReceivedForm({...receivedForm, quantity: text})}
                  keyboardType="numeric"
                />
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-semibold text-slate-700 mb-2">Challan No.</Text>
                  <TextInput
                    className="text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                    placeholder="Challan"
                    placeholderTextColor="#94a3b8"
                    value={receivedForm.challanNo}
                    onChangeText={(text) => setReceivedForm({...receivedForm, challanNo: text})}
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-semibold text-slate-700 mb-2">Vehicle No.</Text>
                  <TextInput
                    className="text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                    placeholder="Vehicle"
                    placeholderTextColor="#94a3b8"
                    value={receivedForm.vehicleNo}
                    onChangeText={(text) => setReceivedForm({...receivedForm, vehicleNo: text})}
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</Text>
                <TextInput
                  className="h-24 text-base text-slate-900 p-4 bg-slate-50 rounded-xl"
                  placeholder="Add notes here..."
                  placeholderTextColor="#94a3b8"
                  value={receivedForm.notes}
                  onChangeText={(text) => setReceivedForm({...receivedForm, notes: text})}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={{ backgroundColor: '#0066FF' }}
              className="flex-row items-center justify-center rounded-2xl py-4"
              onPress={handleSaveReceived}
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text className="text-base font-bold text-white ml-2">Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MaterialDetailScreen;