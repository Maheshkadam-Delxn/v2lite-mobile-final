// // MaterialDetailsScreen.js
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Header from '../../components/Header';

// const MaterialDetailsScreen = ({ route, navigation }) => {
//   const { item } = route.params;
//   const [activeTab, setActiveTab] = useState('All Entries');

//   // Mock entries
//   const entries = [
//     {
//       id: '1',
//       date: '30 Apr 2025',
//       party: 'Party: Others',
//       qty: '+10',
//       type: 'received',
//     },
//     {
//       id: '2',
//       date: 'On Arc 2025',
//       party: 'Party: Aura Mishra',
//       qty: '5',
//       type: 'used',
//     },
//   ];

//   const filteredEntries = activeTab === 'All Entries'
//     ? entries
//     : activeTab === 'Received Entries'
//     ? entries.filter(e => e.type === 'received')
//     : entries.filter(e => e.type === 'used');

//   const renderEntry = ({ item }) => (
//     <View className="mb-4">
//       <View className="flex-row justify-between items-start">
//         <View className="flex-1">
//           <Text className="text-sm font-medium text-gray-900">{item.date}</Text>
//           <Text className="text-xs text-gray-500 mt-1">{item.party}</Text>
//         </View>
//         <Text
//           className={`text-sm font-medium ${
//             item.type === 'received' ? 'text-green-600' : 'text-red-600'
//           }`}
//         >
//           {item.qty}
//         </Text>
//       </View>
//       <View className="h-px bg-gray-200 mt-3" />
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <Header
//         title="Details"
//         showBackButton={true}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//         onBackPress={() => navigation.goBack()}
//       />

//       <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
//         {/* Material Info Card */}
//         <View className="mx-4 mt-4 rounded-xl bg-white p-4">
//           <Text className="text-lg font-bold text-gray-900">Test Material</Text>
//           <Text className="mt-2 text-sm text-gray-500">Cost Code: 123</Text>
//           <Text className="mt-1 text-sm text-gray-500">Category:</Text>
          
//           {/* Quantity Section */}
//           <View className="mt-4">
//             <Text className="text-sm font-medium text-gray-700 mb-2">15,000 m</Text>
//             <View className="flex-row justify-between border-b border-gray-200 pb-2">
//               <Text className="text-xs text-gray-500">Quantity</Text>
//               <Text className="text-xs text-gray-500">NETEGIES ID</Text>
//               <Text className="text-xs text-gray-500">TEMA ADD</Text>
//             </View>
//             <View className="flex-row justify-between mt-2">
//               <Text className="text-sm font-medium text-gray-900">0</Text>
//               <Text className="text-sm font-medium text-gray-900">20</Text>
//               <Text className="text-sm font-medium text-gray-900">5</Text>
//             </View>
//           </View>
//         </View>

//         {/* Entries Container */}
//         <View className="mx-4 mt-4 rounded-xl bg-white p-4">
//           {/* Entries List Header */}
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-sm font-medium text-gray-700">Amount</Text>
//             <Text className="text-sm font-medium text-gray-700">No Stock</Text>
//           </View>

//           {/* Entries List */}
//           <FlatList
//             data={filteredEntries}
//             renderItem={renderEntry}
//             keyExtractor={(item) => item.id}
//             showsVerticalScrollIndicator={false}
//             scrollEnabled={false}
//           />

//           {/* Empty State for Other Tabs */}
//           {filteredEntries.length === 0 && (
//             <View className="py-8 items-center">
//               <Text className="text-gray-500 text-sm">No {activeTab.toLowerCase()} found</Text>
//             </View>
//           )}
//         </View>

//         {/* Additional Containers Section */}
//         <View className="mx-4 mt-4 rounded-xl bg-white p-4">
//           <Text className="text-sm font-medium text-gray-700 mb-3">Other Information</Text>
//           <View className="space-y-3">
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-600">Total Transactions</Text>
//               <Text className="text-sm font-medium text-gray-900">2</Text>
//             </View>
//             <View className="h-px bg-gray-200" />
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-600">Last Updated</Text>
//               <Text className="text-sm font-medium text-gray-900">30 Apr 2025</Text>
//             </View>
//             <View className="h-px bg-gray-200" />
//             <View className="flex-row justify-between items-center">
//               <Text className="text-sm text-gray-600">Status</Text>
//               <View className="bg-green-100 px-2 py-1 rounded-full">
//                 <Text className="text-xs font-medium text-green-800">Active</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Action Buttons */}
//       <View className="absolute bottom-16 left-0 right-0 flex-row px-4">
//         <TouchableOpacity className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-red-50 py-3">
//           <Text className="text-sm font-semibold text-red-600">Used</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-green-50 py-3">
//           <Text className="text-sm font-semibold text-green-600">Received</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default MaterialDetailsScreen;


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

//const BASE_URL = 'https://skystruct-lite-backend.vercel.app';
const BASE_URL = `${process.env.BASE_API_URL}`;
const TOKEN_KEY = 'userToken';

const MaterialDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState('All Entries');
  const [materialDetails, setMaterialDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // === Modal States for MaterialDetailScreen ===
  const [usedModalVisible, setUsedModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);

  // Mock entries
  const entries = [
    {
      id: '1',
      date: '30 Apr 2025',
      party: 'Party: Others',
      qty: '+10',
      type: 'received',
    },
    {
      id: '2',
      date: 'On Arc 2025',
      party: 'Party: Aura Mishra',
      qty: '5',
      type: 'used',
    },
  ];

  // Forms for modals in MaterialDetailScreen
  const [usedForm, setUsedForm] = useState({
    date: '01-04-25',
    material: '',
    quantity: '',
    notes: ''
  });

  const [receivedForm, setReceivedForm] = useState({
    partyName: 'XYZ Constructions Ltd.',
    materialName: 'Test Material',
    quantity: '',
    challanNo: '10',
    vehicleNo: '₹ 1,900',
    notes: ''
  });

  // Sub tabs array
  const subTabs = [
    { id: 'All Entries', label: 'All Entries' },
    { id: 'Received Entries', label: 'Received' },
    { id: 'Used Entries', label: 'Used' },
  ];

  // === API Function to Fetch Material Details ===
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

      console.log('[Material Details] GET status:', res.status);
      console.log('[Material Details] GET response:', json);

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
    <View className="mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">{item.date}</Text>
          <Text className="text-xs text-gray-500 mt-1">{item.party}</Text>
        </View>
        <Text
          className={`text-sm font-medium ${
            item.type === 'received' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {item.qty}
        </Text>
      </View>
      <View className="h-px bg-gray-200 mt-3" />
    </View>
  );

  const renderSubTab = ({ item }) => (
    <TouchableOpacity
      className={`mx-1.5 px-4 py-1.5 ${
        activeTab === item.id ? 'border-b-2 border-blue-500' : ''
      }`}
      onPress={() => setActiveTab(item.id)}>
      <Text
        className={`text-sm font-medium ${
          activeTab === item.id ? 'text-blue-500' : 'text-gray-600'
        }`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="Details"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Material Info Card */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-lg font-bold text-gray-900">
            {materialDetails?.name || item?.name || 'Test Material'}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Cost Code: {materialDetails?.costCode || '123'}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Category: {materialDetails?.category || 'Not specified'}
          </Text>
          
          {/* Quantity Section */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {materialDetails?.stock || item?.stock || '15,000'} {materialDetails?.unit || item?.unit || 'm'}
            </Text>
            <View className="flex-row justify-between border-b border-gray-200 pb-2">
              <Text className="text-xs text-gray-500">Quantity</Text>
              <Text className="text-xs text-gray-500">NETEGIES ID</Text>
              <Text className="text-xs text-gray-500">TEMA ADD</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm font-medium text-gray-900">0</Text>
              <Text className="text-sm font-medium text-gray-900">20</Text>
              <Text className="text-sm font-medium text-gray-900">5</Text>
            </View>
          </View>
        </View>

        {/* Sub Tabs */}
        <View className="mb-1 mt-3 flex-row px-4">
          <FlatList
            data={subTabs}
            renderItem={renderSubTab}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        </View>

        {/* Entries Container */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          {/* Entries List Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-medium text-gray-700">Amount</Text>
            <Text className="text-sm font-medium text-gray-700">No Stock</Text>
          </View>

          {/* Entries List */}
          <FlatList
            data={filteredEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />

          {/* Empty State for Other Tabs */}
          {filteredEntries.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-sm">No {activeTab.toLowerCase()} found</Text>
            </View>
          )}
        </View>

        {/* Additional Containers Section */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-sm font-medium text-gray-700 mb-3">Other Information</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">HSN Code</Text>
              <Text className="text-sm font-medium text-gray-900">
                {materialDetails?.hsnCode || '-'}
              </Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">GST (%)</Text>
              <Text className="text-sm font-medium text-gray-900">
                {materialDetails?.gst || 0}%
              </Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Total Transactions</Text>
              <Text className="text-sm font-medium text-gray-900">2</Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Last Updated</Text>
              <Text className="text-sm font-medium text-gray-900">
                {materialDetails?.updatedAt ? 
                  new Date(materialDetails.updatedAt).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  }) : '30 Apr 2025'
                }
              </Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Status</Text>
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-800">Active</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons - Updated to open modals */}
      <View className="absolute bottom-16 left-0 right-0 flex-row px-4">
        <TouchableOpacity 
          className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-red-50 py-3"
          onPress={() => setUsedModalVisible(true)}
        >
          <Text className="text-sm font-semibold text-red-600">Used</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-green-50 py-3"
          onPress={() => setReceivedModalVisible(true)}
        >
          <Text className="text-sm font-semibold text-green-600">Received</Text>
        </TouchableOpacity>
      </View>

      {/* === USED MODAL in MaterialDetailScreen === */}
      <Modal
        visible={usedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUsedModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setUsedModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-5" onPress={() => {}}>
            <View className="items-center pt-3 pb-2">
              <View className="h-1 w-10 bg-gray-300 rounded-full" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-4">Material Used</Text>
            <Text className="text-sm text-gray-600 mb-4">Material: {materialDetails?.name || 'Current Material'}</Text>
            
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-600">01-04-25</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </View>
            <View className="h-px bg-gray-300 mb-4" />
            
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Quantity in numbers</Text>
              <TextInput
                className="text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={usedForm.quantity}
                onChangeText={(text) => setUsedForm({...usedForm, quantity: text})}
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
              <TextInput
                className="h-20 text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                placeholder="Enter notes..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={usedForm.notes}
                onChangeText={(text) => setUsedForm({...usedForm, notes: text})}
              />
            </View>
            
            <TouchableOpacity className="bg-blue-600 rounded-xl py-3.5 flex-row items-center justify-center">
              <Text className="text-white font-semibold text-base mr-2">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === RECEIVED MODAL in MaterialDetailScreen === */}
      <Modal
        visible={receivedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReceivedModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setReceivedModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Material Received</Text>
              <TouchableOpacity onPress={() => setReceivedModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-sm text-gray-600 mb-4">Material: {materialDetails?.name || 'Current Material'}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                <TextInput
                  className="text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                  value={receivedForm.partyName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, partyName: text})}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
                <TextInput
                  className="text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={receivedForm.quantity}
                  onChangeText={(text) => setReceivedForm({...receivedForm, quantity: text})}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Challan No.</Text>
                <TextInput
                  className="text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                  value={receivedForm.challanNo}
                  onChangeText={(text) => setReceivedForm({...receivedForm, challanNo: text})}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
                <TextInput
                  className="text-base text-gray-900 p-3 border border-gray-300 rounded-lg"
                  value={receivedForm.vehicleNo}
                  onChangeText={(text) => setReceivedForm({...receivedForm, vehicleNo: text})}
                />
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
                <TextInput
                  className="h-20 text-sm text-gray-900 p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter notes..."
                  placeholderTextColor="#9CA3AF"
                  value={receivedForm.notes}
                  onChangeText={(text) => setReceivedForm({...receivedForm, notes: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
              <Text className="text-base font-semibold text-white">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default MaterialDetailScreen;