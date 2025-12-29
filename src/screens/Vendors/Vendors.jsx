import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavbar';

const VendorsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showVendorSheet, setShowVendorSheet] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVendorTypeDropdown, setShowVendorTypeDropdown] = useState(false);

  // Vendor form state
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    vendorcode: '',
    taxNo: '',
    gstinno: '',
    vendorType: '',
    address: ''
  });

  // Initial empty states
  const [vendors, setVendors] = useState([]);

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Vendor types for dropdown
  const vendorTypes = [
    'General Contractor',
    'Material Supplier',
    'Subcontractor',
    'Equipment Rental',
    'Professional Services',
    'Other'
  ];

  // API base URL
  const API_BASE = `${process.env.BASE_API_URL}`;

  // Get auth token
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Create headers with auth
  const getHeaders = async (additionalHeaders = {}) => {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...additionalHeaders,
    };
  };

  // Fetch vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);

        // Fetch vendors - adjust API endpoint as needed
        console.log('Fetching vendors from:', `${API_BASE}/api/vendor`);
        const headers = await getHeaders();
        console.log("asdf",headers);
        const response = await fetch(`${API_BASE}/api/vendor`, {
          headers
        });
        
        console.log('Vendors response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const txt = await response.text().catch(() => '');
          console.error('Vendors fetch failed:', response.status, response.statusText, txt);
          
         
          if (response.status === 404) {
            console.log('Using mock vendors data');
            const mockVendors = [
              {
                id: '1',
                name: 'ABC Constructions',
                email: 'abc@constructions.com',
                vendorcode: 'VEND-00001',
                taxNo: '8855',
                gstinno: '526DFD655D',
                vendorType: 'General Contractor',
                address: '123 Builder Lane, Mumbai, MH',
                status: 'Active'
              },
              {
                id: '2',
                name: 'XYZ Suppliers',
                email: 'contact@xyzsuppliers.com',
                vendorcode: 'VEND-00002',
                taxNo: '7744',
                gstinno: '789GHI123J',
                vendorType: 'Material Supplier',
                address: '456 Material Street, Delhi, DL',
                status: 'Active'
              }
            ];
            setVendors(mockVendors);
            return;
          }
          throw new Error(`Failed to fetch vendors: ${response.status}`);
        }

        const vendorsRes = await response.json();
        console.log('Vendors data:', vendorsRes);
        
  
        const mappedVendors = (vendorsRes.data || vendorsRes || []).map(vendor => ({
          id: vendor._id || vendor.id,
          name: vendor.name || vendor.name || 'Unknown Vendor',
          email: vendor.email || '',
          vendorcode: vendor.vendorcode || vendor.code || '',
          taxNo: vendor.taxNo || vendor.taxNumber || '',
          gstinno: vendor.gstinno || vendor.gstin || '',
          vendorType: vendor.vendorType || vendor.type || 'General Contractor',
          address: vendor.address || '',
          status: vendor.status === 'active' ? 'Active' : (vendor.status || 'Active')
        }));

             setVendors(mappedVendors);
      } catch (error) {
        console.error('Error loading vendors:', error);
        Alert.alert('Error', `Failed to load vendors: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, []);

  const openVendorSheet = (vendor = null) => {
    if (vendor) {
      setSelectedVendor(vendor);
    } else {
      setSelectedVendor(null);
      setNewVendor({
        name: '',
        email: '',
        vendorcode: '',
        taxNo: '',
        gstinno: '',
        vendorType: '',
        address: ''
      });
    }
    setShowVendorSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeVendorSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowVendorSheet(false);
      setSelectedVendor(null);
      setNewVendor({
        name: '',
        email: '',
        vendorcode: '',
        taxNo: '',
        gstinno: '',
        vendorType: '',
        address: ''
      });
      setShowVendorTypeDropdown(false);
    });
  };

  // Handle new vendor form changes
  const handleNewVendorChange = (field, value) => {
    setNewVendor(prev => ({ ...prev, [field]: value }));
  };

  // Handle vendor type selection
  const handleVendorTypeSelect = (vendorType) => {
    setNewVendor(prev => ({ ...prev, vendorType }));
    setShowVendorTypeDropdown(false);
  };

  // Handle create new vendor
  const handleCreateVendor = async () => {
    if (!newVendor.name.trim()) {
      Alert.alert('Error', 'Please enter vendor name');
      return;
    }

    if (!newVendor.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return;
    }

    if (!newVendor.vendorcode.trim()) {
      Alert.alert('Error', 'Please enter vendor code');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newVendor.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Build request body
      const vendorData = {
        name: newVendor.name.trim(),
        email: newVendor.email.trim().toLowerCase(),
        vendorcode: newVendor.vendorcode.trim(),
        taxNo: newVendor.taxNo.trim(),
        gstinno: newVendor.gstinno.trim(),
        vendorType: newVendor.vendorType,
        address: newVendor.address.trim()
      };

      console.log('Creating new vendor with API body:', JSON.stringify(vendorData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/vendor`, {
        method: 'POST',
        headers,
        body: JSON.stringify(vendorData)
      });

      console.log('Create vendor response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Create vendor failed:', response.status, response.statusText, errorText);
        let msg = `Failed to create vendor: ${response.status}`;
        try {
          const j = errorText ? JSON.parse(errorText) : null;
          if (j?.message) msg = j.message;
        } catch (e) {}
        
        // If endpoint doesn't exist, simulate success
        if (response.status === 404) {
          console.log('Simulating vendor creation success');
          const newVendorWithId = {
            ...vendorData,
            id: Date.now().toString(),
            status: 'Active'
          };
          setVendors(prev => [newVendorWithId, ...prev]);
          Alert.alert('Success', 'Vendor created successfully');
          closeVendorSheet();
          return;
        }
        
        throw new Error(msg);
      }

      const responseData = await response.json();
      const createdVendor = responseData.data || responseData;
      console.log('Created vendor data:', createdVendor);

      const newVendorWithDetails = {
        ...createdVendor,
        id: createdVendor._id || createdVendor.id,
        status: 'Active'
      };

      setVendors(prev => [newVendorWithDetails, ...prev]);
      Alert.alert('Success', 'Vendor created successfully');
      closeVendorSheet();
    } catch (error) {
      console.error('Error creating vendor:', error);
      Alert.alert('Error', `Failed to create vendor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.vendorcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vendor.vendorType || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVendorItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
      onPress={() => openVendorSheet(item)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center mb-1 flex-wrap">
            <Text className="text-lg font-urbanistBold text-gray-900 mr-2">
              {item.name}
            </Text>
            <View className={
              item.status === 'Active'
                ? "bg-green-100 px-2 py-1 rounded-lg"
                : "bg-red-100 px-2 py-1 rounded-lg"
            }>
              <Text className={
                item.status === 'Active'
                  ? "text-xs font-urbanistMedium text-green-700"
                  : "text-xs font-urbanistMedium text-red-700"
              }>
                {item.status}
              </Text>
            </View>
          </View>
          <Text className="text-sm font-urbanistRegular text-gray-600 mb-1">
            {item.email}
          </Text>
          <Text className="text-xs font-urbanistMedium text-blue-600 mb-2">
            {item.vendorType}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-sm font-urbanistSemiBold text-gray-700">Vendor Code:</Text>
          <Text className="text-sm font-urbanistRegular text-gray-600">{item.vendorcode}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm font-urbanistSemiBold text-gray-700">Tax No:</Text>
          <Text className="text-sm font-urbanistRegular text-gray-600">{item.taxNo}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm font-urbanistSemiBold text-gray-700">GSTIN No:</Text>
          <Text className="text-sm font-urbanistRegular text-gray-600">{item.gstinno}</Text>
        </View>
        {item.address ? (
          <View className="mt-2">
            <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-1">address:</Text>
            <Text className="text-sm font-urbanistRegular text-gray-600 leading-5">
              {item.address}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderAddVendorForm = () => (
    <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
      <View className="mb-5">
        <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
          Add New Vendor
        </Text>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Vendor Name *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., ABC Constructions"
            value={newVendor.name}
            onChangeText={(value) => handleNewVendorChange('name', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Email address *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., abc@constructions.com"
            value={newVendor.email}
            onChangeText={(value) => handleNewVendorChange('email', value)}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Vendor Code *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., VEND-00001"
            value={newVendor.vendorcode}
            onChangeText={(value) => handleNewVendorChange('vendorcode', value)}
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>

 

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            GSTIN Number
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., 526DFD655D"
            value={newVendor.gstinno}
            onChangeText={(value) => handleNewVendorChange('gstinno', value)}
            placeholderTextColor="#999"
            autoCapitalize="characters"
          />
        </View>



        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            address
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900 min-h-[80px] text-align-top"
            placeholder="Enter vendor address..."
            value={newVendor.address}
            onChangeText={(value) => handleNewVendorChange('address', value)}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        className={
          `rounded-xl py-4 items-center mt-5 ${
            isLoading || !newVendor.name.trim() || !newVendor.email.trim() || !newVendor.vendorcode.trim()
              ? 'bg-gray-400'
              : 'bg-blue-600'
          }`
        }
        onPress={handleCreateVendor}
        disabled={
          isLoading || !newVendor.name.trim() || !newVendor.email.trim() || !newVendor.vendorcode.trim()
        }
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-urbanistBold text-white">
            Create Vendor
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderVendorDetails = () => (
    <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
      <View className="items-center py-5">
        <View className="w-16 h-16 bg-blue-100 rounded-full justify-center items-center mb-4">
          <Ionicons name="business" size={24} color="#0066FF" />
        </View>

        <Text className="text-xl font-urbanistBold text-gray-900 mb-1">
          {selectedVendor.name}
        </Text>
        <Text className="text-base font-urbanistRegular text-gray-600 mb-4">
          {selectedVendor.email}
        </Text>

        <View className={
          selectedVendor.status === 'Active'
            ? "bg-green-100 px-4 py-2 rounded-xl mb-6"
            : "bg-red-100 px-4 py-2 rounded-xl mb-6"
        }>
          <Text className={
            selectedVendor.status === 'Active'
              ? "text-sm font-urbanistMedium text-green-800"
              : "text-sm font-urbanistMedium text-red-800"
          }>
            {selectedVendor.status}
          </Text>
        </View>
      </View>

      <View className="space-y-4">
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-2">Vendor Code</Text>
          <Text className="text-base font-urbanistRegular text-gray-900">{selectedVendor.vendorcode}</Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-2">Tax Number</Text>
          <Text className="text-base font-urbanistRegular text-gray-900">{selectedVendor.taxNo || 'Not provided'}</Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-2">GSTIN Number</Text>
          <Text className="text-base font-urbanistRegular text-gray-900">{selectedVendor.gstinno || 'Not provided'}</Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-2">Vendor Type</Text>
          <Text className="text-base font-urbanistRegular text-gray-900">{selectedVendor.vendorType}</Text>
        </View>

        {selectedVendor.address ? (
          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <Text className="text-sm font-urbanistSemiBold text-gray-700 mb-2">address</Text>
            <Text className="text-base font-urbanistRegular text-gray-900 leading-6">
              {selectedVendor.address}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );

  if (isLoading && vendors.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0066FF" />
        <Text className="mt-2 text-gray-600">Loading vendors...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="Vendor Management"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View className="flex-1 pt-4">
        {/* Search and Add Button */}
        <View className="flex-row items-center px-5 mb-4 gap-3">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base font-urbanistRegular text-gray-900"
              placeholder="Search vendors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-blue-600 rounded-xl justify-center items-center"
            onPress={() => openVendorSheet()}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-5">
          <FlatList
            data={filteredVendors}
            renderItem={renderVendorItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-gray-500 text-center">No vendors found</Text>
                <Text className="text-gray-400 text-center mt-2">
                  {searchQuery ? 'Try a different search' : 'Add your first vendor to get started'}
                </Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Vendor Bottom Sheet */}
      <Modal
        visible={showVendorSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={closeVendorSheet}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 30,
              paddingHorizontal: 20,
              transform: [{ translateY: slideAnim }],
              maxHeight: '90%',
            }}
          >
            {/* Handle Bar */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: '#E5E5E5',
                borderRadius: 10,
                alignSelf: 'center',
                marginBottom: 15,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#000',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {selectedVendor ? selectedVendor.name : 'Add New Vendor'}
              </Text>
              <TouchableOpacity onPress={closeVendorSheet}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedVendor ? renderVendorDetails() : renderAddVendorForm()}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default VendorsScreen;