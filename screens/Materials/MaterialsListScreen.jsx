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

const MaterialsListScreen = () => {
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
  const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
  const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
  const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
  const [usedModalVisible, setUsedModalVisible] = useState(false); // ← NEW

  // === Date Picker State ===
  const [date, setDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

  // === Form States ===
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

  // === NEW: Used Form State ===
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

  // === Mock Data ===
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

  // === Material Library State ===
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

  // === Render Sub Tab ===
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

  // === INVENTORY ITEM ===
  const renderInventoryItem = ({ item }) => (
    <View className="mb-2 rounded-xl bg-white p-3">
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
    </View>
  );

  // === REQUEST ITEM ===
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

  // === RECEIVED ITEM ===
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

  // === USED ITEM ===
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

  // === Render Content Based on Active Tab ===
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
      {/* Sub Tabs – Above Search */}
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

      {/* Search Bar */}
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

      {/* Dynamic Content */}
      <View className="flex-1">{renderContent()}</View>

      {/* FAB Buttons - Fixed at Bottom */}
      <View
        className="absolute inset-x-0 bottom-16 left-4 right-4 flex-row items-center justify-between px-2"
        style={{ zIndex: 10 }}>
        <TouchableOpacity 
          className="mx-1 flex-1 rounded-xl bg-red-50 px-4 py-2.5"
          onPress={() => setUsedModalVisible(true)} // ← OPENS USED MODAL
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

      {/* === ACTION MODAL (Material) === */}
      <Modal
        visible={materialActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMaterialActionModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-[40%] rounded-t-3xl bg-white p-6 pb-10">
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
                  <Text className="text-center text-base font-semibold text-blue-600">
                    + Request
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-green-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setReceivedModalVisible(true);
                  }}>
                  <Text className="text-center text-base font-semibold text-green-600">
                    + Received
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mb-5 flex-row space-x-6">
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-cyan-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setAddMaterialPurchaseModalVisible(true);
                  }}>
                  <Text className="text-center text-base font-semibold text-cyan-600">
                    + Purchased
                  </Text>
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
          </View>
        </View>
      </Modal>

      {/* === RECEIVED FORM MODAL === */}
      <Modal
        visible={receivedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReceivedModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[90%] rounded-t-3xl bg-white p-5">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Material Received</Text>
              <TouchableOpacity onPress={() => setReceivedModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Date with Calendar Icon */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">{formatDate(date)}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Party Name */}
              <View className="mb-4 TOTAL">
                <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.partyName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, partyName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              {/* Add Material Button */}
              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => setMaterialLibraryModalVisible(true)}>
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>

              {/* Material Name */}
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Test Material</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.materialName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, materialName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              {/* Quantity */}
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

              {/* Challan No. */}
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

              {/* Vehicle No. */}
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.vehicleNo}
                  onChangeText={(text) => setReceivedForm({...receivedForm, vehicleNo: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              {/* Notes */}
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
          </View>
        </View>
      </Modal>

      {/* === MATERIAL LIBRARY MODAL === */}
      <Modal
        visible={materialLibraryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMaterialLibraryModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="flex h-[85%] flex-col rounded-t-3xl bg-white">
            <View className="items-center pb-2 pt-3">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            <View className="items-center justify-center px-4 pb-2 mb-3">
              <Text className="text-xl font-bold text-gray-900">Material Library</Text>
            </View>

            <View className="mx-4 mb-3">
              <View className="h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  className="ml-2 flex-1 text-base"
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View className="mb-5 mt-5 flex-row items-center justify-between px-4">
              <Text className="text-lg font-bold text-gray-700">
                Selected ({selectedMaterials.length}/40)
              </Text>
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => setCreateNewMaterialModalVisible(true)}
              >
                <Text className="mr-1 text-lg font-bold text-blue-600">+ New Material</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredLibrary}
              renderItem={renderLibraryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            />

            <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
              <View className="px-4 pb-2 pt-3">
                <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
                  <Text className="text-base font-semibold text-white">Next</Text>
                </TouchableOpacity>
              </View>

              <View className="h-16 flex-row items-center justify-around border-t border-gray-200">
                <TouchableOpacity className="items-center">
                  <Ionicons name="home-outline" size={24} color="#9CA3AF" />
                  <Text className="mt-1 text-xs text-gray-500">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Ionicons name="folder-outline" size={24} color="#9CA3AF" />
                  <Text className="mt-1 text-xs text-gray-500">Projects</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Ionicons name="card-outline" size={24} color="#3B82F6" />
                  <Text className="mt-1 text-xs text-blue-600">Payments</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Ionicons name="document-text-outline" size={24} color="#9CA3AF" />
                  <Text className="mt-1 text-xs text-gray-500">Tasks</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* === CREATE NEW MATERIAL MODAL === */}
      <Modal
        visible={createNewMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreateNewMaterialModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 h-[92%]">
            <View className="items-center pb-4">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center mb-6">
              Create New Material
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Material Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Material Name</Text>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-3 text-base text-gray-900"
                  placeholder="Enter material name"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.materialName}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, materialName: text})}
                />
              </View>

              {/* Unit & GST */}
              <View className="flex-row space-x-4 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">Unit</Text>
                  <TouchableOpacity className="h-12 rounded-lg border border-gray-300 px-3 flex-row items-center justify-between">
                    <Text className="text-base text-gray-900">{newMaterialForm.unit}</Text>
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">GST</Text>
                  <TouchableOpacity className="h-12 rounded-lg border border-gray-300 px-3 flex-row items-center justify-between">
                    <Text className="text-base text-gray-900">{newMaterialForm.gst}</Text>
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* HSN / SAC Code */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">HSN / SAC Code</Text>
                <TextInput
                  className="h-12 rounded-lg border border-gray-300 px-3 text-base text-gray-900"
                  placeholder="Enter code"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.hsnCode}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, hsnCode: text})}
                />
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Category</Text>
                <TouchableOpacity className="h-12 rounded-lg border border-gray-300 px-3 flex-row items-center justify-between">
                  <Text className="text-base text-gray-900">{newMaterialForm.category}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
                <TextInput
                  className="h-32 rounded-lg border border-gray-300 p-3 text-base text-gray-900"
                  placeholder="Enter description..."
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.description}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, description: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <TouchableOpacity className="bg-blue-600 py-3.5 rounded-xl flex-row justify-center items-center">
              <Text className="text-white font-semibold text-base">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* === REQUEST FOR MATERIAL MODAL === */}
      <Modal
        visible={requestMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRequestMaterialModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 h-[95%]">
            {/* Drag Handle */}
            <View className="items-center pb-4">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center mb-6">
              Request For Material
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* MR No. & Date */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">MR-2</Text>
                  <TextInput
                    className="text-base text-gray-900"
                    value={requestForm.mrNumber}
                    onChangeText={(text) => setRequestForm({...requestForm, mrNumber: text})}
                  />
                  <View className="h-px bg-gray-300" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">01-04-2025</Text>
                  <TextInput
                    className="text-base text-gray-900"
                    value={requestForm.date}
                    onChangeText={(text) => setRequestForm({...requestForm, date: text})}
                  />
                  <View className="h-px bg-gray-300" />
                </View>
              </View>

              {/* Materials Section */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Materials (1)
                </Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-center rounded-xl bg-blue-50 py-3 mb-3"
                  onPress={() => {
                    setRequestMaterialModalVisible(false);
                    setAddMaterialPurchaseModalVisible(true);
                  }}
                >
                  <Ionicons name="add" size={20} color="#3B82F6" />
                  <Text className="ml-1 font-medium text-blue-600">Add Material</Text>
                </TouchableOpacity>

                {/* Material Entry */}
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700">Test Material</Text>
                  <TextInput
                    className="text-base text-gray-900"
                    value={requestForm.materialName}
                    onChangeText={(text) => setRequestForm({...requestForm, materialName: text})}
                  />
                  <View className="h-px bg-gray-300 mt-1" />
                </View>

                <View className="mb-3">
                  <Text className="text-sm text-gray-500">Enter Quantity</Text>
                  <TextInput
                    className="text-base text-gray-900"
                    placeholder="Enter quantity"
                    placeholderTextColor="#9CA3AF"
                    value={requestForm.quantity}
                    onChangeText={(text) => setRequestForm({...requestForm, quantity: text})}
                    keyboardType="numeric"
                  />
                  <View className="h-px bg-gray-300 mt-1" />
                </View>

                <View className="mb-4">
                  <Text className="text-sm text-gray-500">Item Description</Text>
                  <TextInput
                    className="text-base text-gray-900"
                    placeholder="Enter item description"
                    placeholderTextColor="#9CA3AF"
                    value={requestForm.itemDescription}
                    onChangeText={(text) => setRequestForm({...requestForm, itemDescription: text})}
                  />
                  <View className="h-px bg-gray-300 mt-1" />
                </View>
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
                <TextInput
                  className="h-20 text-sm text-gray-900"
                  placeholder="Enter notes..."
                  placeholderTextColor="#9CA3AF"
                  value={requestForm.notes}
                  onChangeText={(text) => setRequestForm({...requestForm, notes: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <TouchableOpacity className="bg-blue-600 py-3.5 rounded-xl flex-row justify-center items-center">
              <Text className="text-white font-semibold text-base">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* === ADD MATERIAL PURCHASE MODAL === */}
      <Modal
        visible={addMaterialPurchaseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddMaterialPurchaseModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 h-[92%]">
            {/* Drag Handle */}
            <View className="items-center pb-4">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center mb-6">
              Add Material Purchase
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date & Calendar */}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">{formatDate(purchaseDate)}</Text>
                <TouchableOpacity onPress={() => setShowPurchaseDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              {showPurchaseDatePicker && (
                <DateTimePicker
                  value={purchaseDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onPurchaseDateChange}
                />
              )}

              {/* Party Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Party Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter party name"
                  placeholderTextColor="#9CA3AF"
                  value={purchaseForm.partyName}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, partyName: text})}
                />
                <View className="h-px bg-gray-300 mt-1" />
              </View>

              {/* Add Material Button */}
              <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-50 py-3 mb-4">
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="ml-1 font-medium text-blue-600">Add Material</Text>
              </TouchableOpacity>

              {/* Material Row */}
              <View className="mb-4 p-3 bg-gray-50 rounded-xl">
                <Text className="text-sm font-medium text-gray-700">Test Material</Text>
                <View className="flex-row justify-between mt-2">
                  <TextInput
                    className="text-sm text-gray-500"
                    value={purchaseForm.quantity}
                    onChangeText={(text) => setPurchaseForm({...purchaseForm, quantity: text})}
                    keyboardType="default"
                  />
                  <Text className="text-sm text-gray-900">₹ 1,900</Text>
                </View>
              </View>

              {/* Totals */}
              <View className="mb-4">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Item Subtotal</Text>
                  <Text className="text-sm text-gray-900">₹ 1,416</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-sm text-gray-600">Total Amount</Text>
                  <Text className="text-sm font-semibold text-gray-900">₹ 1,416</Text>
                </View>
              </View>

              {/* Bill To */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Bill To</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={purchaseForm.billTo}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, billTo: text})}
                />
                <View className="h-px bg-gray-300 mt-1" />
              </View>

              {/* Advance */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Advance</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="₹ 0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={purchaseForm.advance}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, advance: text})}
                />
                <View className="h-px bg-gray-300 mt-1" />
              </View>

              {/* Balance */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-1">Balance</Text>
                <Text className="text-base text-gray-900">₹ 0</Text>
                <View className="h-px bg-gray-300 mt-1" />
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-gray-100 py-3.5 rounded-xl">
                <Text className="text-center text-base font-semibold text-gray-700">Bill To / Sh To</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-gray-100 py-3.5 rounded-xl">
                <Text className="text-center text-base font-semibold text-gray-700">+ Add Address</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="mt-3 bg-blue-600 py-3.5 rounded-xl">
              <Text className="text-center text-base font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* === MATERIAL USED MODAL (NEW) === */}
      <Modal
        visible={usedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUsedModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            {/* Drag Handle */}
            <View className="items-center pt-3 pb-2">
              <View className="h-1 w-10 bg-gray-300 rounded-full" />
            </View>

            {/* Title */}
            <Text className="text-lg font-bold text-gray-900 mb-4">Material Used</Text>

            {/* Date */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-600">01-04-25</Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </View>
            <View className="h-px bg-gray-300 mb-4" />

            {/* Material */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Material</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-900"></Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </View>
              <View className="h-px bg-gray-300 mt-1" />
            </View>

            {/* Quantity */}
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

            {/* Notes */}
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

            {/* Save Button */}
            <TouchableOpacity className="bg-blue-600 rounded-xl py-3.5 flex-row items-center justify-center">
              <Text className="text-white font-semibold text-base mr-2">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MaterialsListScreen;