import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const MaterialsListScreen = () => {
  const navigation = useNavigation();
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
  const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
  const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
  const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
  const [usedModalVisible, setUsedModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

  const [receivedForm, setReceivedForm] = useState({
    partyName: 'XYZ Constructions Ltd.',
    materialName: 'Test Material',
    quantity: '',
    challanNo: '10',
    vehicleNo: '₹ 1,900',
    notes: ''
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    materialName: '',
    unit: 'nos',
    gst: '18.0 %',
    hsnCode: '',
    category: 'Select category',
    description: ''
  });

  const [requestForm, setRequestForm] = useState({
    mrNumber: 'MR-2',
    date: '01-04-2025',
    materialName: 'Test Material',
    quantity: '',
    itemDescription: '',
    notes: ''
  });

  const [purchaseForm, setPurchaseForm] = useState({
    partyName: '',
    quantity: '10 nos',
    amount: '₹ 1,900',
    billTo: '',
    advance: '',
    balance: '₹ 0'
  });

  const [usedForm, setUsedForm] = useState({
    date: '01-04-25',
    material: '',
    quantity: '',
    notes: ''
  });

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onPurchaseDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || purchaseDate;
    setShowPurchaseDatePicker(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  };

  const subTabs = [
    { id: 'Inventory', label: 'Inventory' },
    { id: 'Request', label: 'Request' },
    { id: 'Received', label: 'Received' },
    { id: 'Used', label: 'Used' },
  ];

  const inventoryData = [
    { id: '1', name: 'Test Material', date: '30 v04', stock: 15 },
    { id: '2', name: 'Test2 Material', date: '12 v02', stock: 10 },
    { id: '3', name: 'Test2 Material', date: '01 v01', stock: 10 },
    { id: '4', name: '1R Material', date: '11 v00', stock: 10 },
  ];

  const requestData = [
    { id: '1', date: '03 Apr', name: 'Milk 1 Test', qty: '10 nos', status: 'Requested' },
    { id: '2', date: '03 Apr', name: 'Milk 1 Test', qty: '10 nos', status: 'Requested' },
  ];

  const receivedData = [
    { id: '1', date: '03 Apr 2025', name: 'Test Material', qty: '+10 nos', party: 'Party ABC' },
    { id: '2', date: '03 Apr 2025', name: 'Test Material', qty: '+10 nos', party: 'Party ABC' },
  ];

  const usedData = [
    { id: '1', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
    { id: '2', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
  ];

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const materialLibraryData = [
    { id: '1', name: 'Test material', category: 'Cement', unit: 'nos' },
    { id: '2', name: 'Test material', category: 'Cement', unit: 'nos' },
    { id: '3', name: 'Test material', category: 'Cement', unit: 'nos' },
    { id: '4', name: 'Test material', category: 'Cement', unit: 'nos' },
  ];

  const filteredLibrary = materialLibraryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMaterial = (id) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderLibraryItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center border-b border-gray-200 py-3"
      onPress={() => toggleMaterial(item.id)}>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
        <Text className="mt-0.5 text-xs text-gray-500">Category: {item.category}</Text>
      </View>
      <Text className="mr-3 text-sm text-gray-600">Unit: {item.unit}</Text>
      <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
        {selectedMaterials.includes(item.id) && (
          <View className="h-3 w-3 rounded-full bg-blue-500" />
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredInventory = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSubTab = ({ item }) => (
    <TouchableOpacity
      className={`mx-1.5 px-4 py-1.5 ${
        activeSubTab === item.id ? 'border-b-2 border-blue-500' : ''
      }`}
      onPress={() => setActiveSubTab(item.id)}>
      <Text
        className={`text-sm font-medium ${
          activeSubTab === item.id ? 'text-blue-500' : 'text-gray-600'
        }`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderInventoryItem = ({ item }) => (
    <TouchableOpacity
      className="mb-2 rounded-xl bg-white p-3"
      onPress={() => navigation.navigate('MaterialDetailScreen', { item })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
            <Text className="mt-0.5 text-sm text-gray-500">{item.date}</Text>
          </View>
        </View>
        <Text className="text-base font-semibold text-gray-900">{item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item }) => (
    <View className="mb-2 rounded-xl bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">{item.date}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-gray-900">{item.qty}</Text>
          <View className="mt-1 rounded bg-orange-100 px-2 py-1">
            <Text className="text-xs font-medium text-orange-700">{item.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderReceivedItem = ({ item }) => (
    <View className="mb-2 rounded-xl bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">{item.date}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
            <Text className="mt-1 text-xs text-gray-500">{item.party}</Text>
          </View>
        </View>
        <Text className="text-sm font-medium text-green-600">{item.qty}</Text>
      </View>
    </View>
  );

  const renderUsedItem = ({ item }) => (
    <View className="mb-2 rounded-xl bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">{item.date}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
          </View>
        </View>
        <Text className="text-sm font-medium text-red-600">{item.qty}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (activeSubTab === 'Inventory') {
      return (
        <>
          <View className="mb-2 mt-4 flex-row justify-between px-4">
            <Text className="text-sm font-semibold text-gray-600">Material</Text>
            <Text className="text-sm font-semibold text-gray-600">In Stock</Text>
          </View>
          <FlatList
            data={filteredInventory}
            renderItem={renderInventoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      );
    }

    if (activeSubTab === 'Request') {
      return (
        <FlatList
          data={requestData}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (activeSubTab === 'Received') {
      return (
        <FlatList
          data={receivedData}
          renderItem={renderReceivedItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    if (activeSubTab === 'Used') {
      return (
        <FlatList
          data={usedData}
          renderItem={renderUsedItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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

      <View className="mx-4 mt-1 h-12 flex-row items-center rounded-xl bg-white px-3">
        <Ionicons name="search" size={20} color="#9CA3AF" className="mr-2" />
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View className="flex-1">{renderContent()}</View>

      <View
        className="absolute inset-x-0 bottom-16 left-4 right-4 flex-row items-center justify-between px-2"
        style={{ zIndex: 10 }}>
        <TouchableOpacity 
          className="mx-1 flex-1 rounded-xl bg-red-50 px-4 py-2.5"
          onPress={() => setUsedModalVisible(true)}
        >
          <Text className="text-center text-sm font-semibold text-red-500">- Used</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-blue-100 px-5 py-2.5"
          onPress={() => setMaterialActionModalVisible(true)}>
          <Text className="text-center text-sm font-semibold text-gray-900">+ Material</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-amber-100 px-4 py-2.5"
          onPress={() => setReceivedModalVisible(true)}>
          <Text className="text-center text-sm font-semibold text-gray-900">+ Received</Text>
        </TouchableOpacity>
      </View>

      {/* === ACTION MODAL === */}
      <Modal
        visible={materialActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMaterialActionModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setMaterialActionModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[40%] rounded-t-3xl bg-white p-6 pb-10"
            onPress={() => {}}
          >
            <View className="mb-5 items-center">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>
            <Text className="mb-12 text-center text-xl font-bold text-gray-900">Material</Text>
            <View className="space-y-6">
              <View className="mb-8 flex-row space-x-6">
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-blue-50 px-3 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setRequestMaterialModalVisible(true);
                  }}
                >
                  <Text className="text-center text-base font-semibold text-blue-600">+ Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-green-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setReceivedModalVisible(true);
                  }}>
                  <Text className="text-center text-base font-semibold text-green-600">+ Received</Text>
                </TouchableOpacity>
              </View>
              <View className="mb-5 flex-row space-x-6">
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-cyan-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setAddMaterialPurchaseModalVisible(true);
                  }}>
                  <Text className="text-center text-base font-semibold text-cyan-600">+ Purchased</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-red-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setUsedModalVisible(true);
                  }}>
                  <Text className="text-center text-base font-semibold text-red-600">- Used</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === RECEIVED MODAL === */}
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
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">{formatDate(date)}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.partyName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, partyName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => setMaterialLibraryModalVisible(true)}>
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Test Material</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.materialName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, materialName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={receivedForm.quantity}
                  onChangeText={(text) => setReceivedForm({...receivedForm, quantity: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Challan No.</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.challanNo}
                  onChangeText={(text) => setReceivedForm({...receivedForm, challanNo: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.vehicleNo}
                  onChangeText={(text) => setReceivedForm({...receivedForm, vehicleNo: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <View className="mb-6">
                <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
                <TextInput
                  className="h-20 text-sm text-gray-900"
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

      {/* === USED MODAL === */}
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
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-600">01-04-25</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </View>
            <View className="h-px bg-gray-300 mb-4" />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Material</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-900"></Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </View>
              <View className="h-px bg-gray-300 mt-1" />
            </View>
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Quantity in numbers</Text>
              <TextInput
                className="text-base text-gray-900"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={usedForm.quantity}
                onChangeText={(text) => setUsedForm({...usedForm, quantity: text})}
              />
              <View className="h-px bg-gray-300 mt-1" />
            </View>
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
              <TextInput
                className="h-20 text-base text-gray-900"
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

    </SafeAreaView>
  );
};

export default MaterialsListScreen;