// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Header from 'components/Header';
// import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
// import { useState, useEffect, useMemo } from 'react';


// //const BASE_URL = 'https://skystruct-lite-backend.vercel.app';
// const BASE_URL = `${process.env.BASE_API_URL}`;
// const MATERIALS_API = `${BASE_URL}/api/materials`;
// const TOKEN_KEY = 'userToken';

// // === Constant arrays ===
// const subTabs = [
//   { id: 'Inventory', label: 'Inventory' },
//   { id: 'Request', label: 'Request' },
//   { id: 'Received', label: 'Received' },
//   { id: 'Used', label: 'Used' },
// ];

// const categories = [
//   'Cement',
//   'Steel',
//   'Bricks',
//   'Sand',
//   'Aggregate',
//   'Wood',
//   'Electrical',
//   'Plumbing',
//   'Paint',
//   'Tools',
//   'Other'
// ];

// const units = [
//   'nos',
//   'kg',
//   'ton',
//   'm',
//   'sqm',
//   'cum',
//   'ltr',
//   'set',
//   'box',
//   'packet'
// ];

// const gstRates = ['0', '5.0', '12.0', '18.0', '28.0'];

// const MaterialsListScreen = ({ project }) => {
//   const navigation = useNavigation();
//   const [activeSubTab, setActiveSubTab] = useState('Inventory');
//   const [searchQuery, setSearchQuery] = useState('');

//   // === Modals ===
//   const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
//   const [receivedModalVisible, setReceivedModalVisible] = useState(false);
//   const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
//   const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
//   const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
//   const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
//   const [usedModalVisible, setUsedModalVisible] = useState(false);
//   const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);

//   // === Selection Modals ===
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showUnitModal, setShowUnitModal] = useState(false);
//   const [showGstModal, setShowGstModal] = useState(false);
//   const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
//   const [showEditUnitModal, setShowEditUnitModal] = useState(false);
//   const [showEditGstModal, setShowEditGstModal] = useState(false);

//   // === Dates ===
//   const [date, setDate] = useState(new Date());
//   const [purchaseDate, setPurchaseDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
//   const [showMaterialListInReceived, setShowMaterialListInReceived] = useState(false);
//   const [selectedReceivedMaterial, setSelectedReceivedMaterial] = useState(null);
//   const clearReceivedForm = () => {
//     setReceivedForm({
//       partyName: '',
//       materialName: '',
//       quantity: '',
//       challanNo: '10',
//       vehicleNo: '₹ 1,900',
//       notes: ''
//     });
//     setSelectedReceivedMaterial(null);
//     setShowMaterialListInReceived(false);
//   };


//   // For Used Modal

//   const [showMaterialListInUsed, setShowMaterialListInUsed] = useState(false);
//   const [selectedUsedMaterial, setSelectedUsedMaterial] = useState(null);

//   // Used Form
//   const [usedForm, setUsedForm] = useState({
//     date: new Date().toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).split('/').join('-'),
//     quantity: '',
//     notes: ''
//   });

//   // Clear form function
//   const clearUsedForm = () => {
//     setUsedForm({
//       date: new Date().toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       }).split('/').join('-'),
//       quantity: '',
//       notes: ''
//     });
//     setSelectedUsedMaterial(null);
//     setShowMaterialListInUsed(false);
//     setSelectedMaterials([]); // Clear selected material IDs
//   };
//   // === Forms ===
//   const [receivedForm, setReceivedForm] = useState({
//     partyName: 'XYZ Constructions Ltd.',
//     materialName: 'Test Material',
//     quantity: '',
//     challanNo: '10',
//     vehicleNo: '₹ 1,900',
//     notes: ''
//   });

//   const [newMaterialForm, setNewMaterialForm] = useState({
//     materialName: '',
//     unit: 'nos',
//     gst: '18.0',
//     hsnCode: '',
//     category: '',
//     quantity: '',
//     stock: '',
//     price: '',
//     minStock: '',
//     description: ''
//   });

//   const [editMaterialForm, setEditMaterialForm] = useState({
//     id: '',
//     materialName: '',
//     unit: 'nos',
//     gst: '18.0',
//     hsnCode: '',
//     category: '',
//     quantity: '',
//     stock: '',
//     price: '',
//     minStock: '',
//     description: ''
//   });

//   const [requestForm, setRequestForm] = useState({
//     mrNumber: 'MR-2',
//     date: new Date().toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).split('/').join('-'),
//     materialName: '',
//     quantity: '',
//     itemDescription: '',
//     notes: ''
//   });

//   const [purchaseForm, setPurchaseForm] = useState({
//     partyName: '',
//     quantity: '',
//     rate: '',          // NEW: Rate per unit
//     totalAmount: '',   // Auto-calculated
//     advance: '',
//     balance: '',       // Auto-calculated
//     billTo: '',
//   });


//   useEffect(() => {
//     const qty = parseFloat(purchaseForm.quantity) || 0;
//     const rate = parseFloat(purchaseForm.rate) || 0;
//     const advance = parseFloat(purchaseForm.advance) || 0;

//     const total = qty * rate;
//     const balance = total - advance;

//     setPurchaseForm(prev => ({
//       ...prev,
//       totalAmount: isNaN(total) ? '' : total.toFixed(2),
//       balance: isNaN(balance) ? '' : balance.toFixed(2),
//     }));
//   }, [purchaseForm.quantity, purchaseForm.rate, purchaseForm.advance]);

//   useEffect(() => {
//     if (!usedModalVisible) {
//       clearUsedForm();
//     }
//   }, [usedModalVisible]);

//   // === API State ===
//   const [inventoryApi, setInventoryApi] = useState([]);
//   const [loadingInventory, setLoadingInventory] = useState(false);
//   const [creatingMaterial, setCreatingMaterial] = useState(false);
//   const [updatingMaterial, setUpdatingMaterial] = useState(false);

//   // === Static data for non-Inventory tabs ===
//   const [requestData, setRequestData] = useState([

//   ]);
//   const [receivedData, setReceivedData] = useState([

//   ]);
//   const [usedData, setUsedData] = useState([
//     { id: '1', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
//     { id: '2', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
//   ]);

//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [materialLibraryData, setMaterialLibraryData] = useState([]);
//   const [selectedRequestMaterial, setSelectedRequestMaterial] = useState(null);

//   // NEW STATE: Control whether to show material list in request modal
//   const [showMaterialListInRequest, setShowMaterialListInRequest] = useState(false);
//   const handleSaveReceived = async () => {
//     // Validation
//     if (!selectedReceivedMaterial) {
//       Alert.alert('Error', 'Please select a material');
//       return;
//     }

//     if (!receivedForm.quantity.trim()) {
//       Alert.alert('Error', 'Please enter quantity');
//       return;
//     }

//     if (!receivedForm.partyName.trim()) {
//       Alert.alert('Error', 'Please enter party name');
//       return;
//     }

//     // Get the selected material ID
//     const selectedMaterialId = selectedMaterials[0];

//     // Prepare received data


//     const existingVendor = vendors.find(v => v.name === receivedForm.partyName);
//     const receivedData = {
//       date: date.toISOString(),
//       vendorId: existingVendor.id,
//       materialId: selectedMaterialId,
//       quantity: receivedForm.quantity,
//       challanNo: receivedForm.challanNo,
//       vehicleNo: receivedForm.vehicleNo,
//       notes: receivedForm.notes,
//       projectId: project._id,
//     };

//     const token = await AsyncStorage.getItem("userToken");

//     const res = await fetch(`${BASE_URL}/api/materials/materialReceived`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(receivedData),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       throw new Error(json?.message || "Failed to save purchase");
//     }

//     Alert.alert(
//       'Received Data Logged',
//       `Material: ${receivedData.materialName}\nQuantity: ${receivedData.quantity}\nParty: ${receivedData.partyName}`,
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             setReceivedModalVisible(false);
//             // Clear selection
//             setSelectedMaterials([]);
//             setSelectedReceivedMaterial(null);
//             setShowMaterialListInReceived(false);
//           }
//         }
//       ]
//     );

//     fetchMaterialReceived();
//     fetchMaterials();
//   };

//   useEffect(() => {
//     if (!receivedModalVisible) {
//       clearReceivedForm();
//     }
//   }, [receivedModalVisible]);
//   // === Date Handlers ===
//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowDatePicker(Platform.OS === 'ios');
//     setDate(currentDate);

//     // Update request form date when date picker changes
//     if (requestMaterialModalVisible) {
//       const formattedDate = currentDate.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       }).split('/').join('-');

//       setRequestForm(prev => ({
//         ...prev,
//         date: formattedDate
//       }));
//     }
//   };

//   const onPurchaseDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || purchaseDate;
//     setShowPurchaseDatePicker(Platform.OS === 'ios');
//     setPurchaseDate(currentDate);
//   };

//   const formatDate = (date) => {
//     const options = { day: '2-digit', month: 'long', year: 'numeric' };
//     return date.toLocaleDateString('en-GB', options).replace(',', '');
//   };
//   const fetchMaterials = async () => {
//     try {
//       setLoadingInventory(true);
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
      

//       const res = await fetch(`${MATERIALS_API}/project/${project._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       const text = await res.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = text; }

      

//       if (!res.ok) {
//         throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with ${res.status}`);
//       }

//       const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
//       setInventoryApi(list);

//       // Update material library data with the same API data
//       const libraryList = list.map((item, index) => ({
//         id: item._id || item.id || `lib-${index}`,
//         name: item.materialName || item.name || 'Unknown Material',
//         category: item.category || 'Other',
//         unit: item.unit || 'nos',
//         __raw: item, // Keep reference to original data
//       }));
//       setMaterialLibraryData(libraryList);

//     } catch (err) {
//       console.error('[Materials] GET error:', err);
//       Alert.alert('Error', 'Failed to fetch materials');
//     } finally {
//       setLoadingInventory(false);
//     }
//   };
//   const fetchMaterialRequests = async () => {
//     try {
//       setLoadingInventory(true);
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       const res = await fetch(`${MATERIALS_API}/materialRequest/${project._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       const text = await res.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = text; }
//       if (!res.ok) {
//         throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with ${res.status}`);
//       }

    
//       const list = Array.isArray(json) ? json : Array.isArray(json?.data?.materialrequest) ? json.data.materialrequest : [];
//       // Update material library data with the same API data
//       const libraryList = list.map((item, index) => ({
//         id: item._id || item.id || `lib-${index}`,
//         name: item.materialId.materialName || item.name || 'Unknown Material',
//         qty: item.quantity || 0,
//         date: item.date || '',
//         status: item.status || 'Requested',

//         unit: item.materialId.unit || 'nos',

//       }));
//       setRequestData(libraryList);

//     } catch (err) {
//       console.error('[Materials] GET error:', err);
//       Alert.alert('Error', 'Failed to fetch materials');
//     } finally {
//       setLoadingInventory(false);
//     }
//   };
//   const fetchMaterialReceived = async () => {
//     try {
//       setLoadingInventory(true);
//       const token = await AsyncStorage.getItem(TOKEN_KEY);

//       const res = await fetch(`${MATERIALS_API}/materialReceived/${project._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       const text = await res.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = text; }


//       if (!res.ok) {
//         throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with ${res.status}`);
//       }

//       const list = Array.isArray(json) ? json : Array.isArray(json?.data?.materialreceived) ? json.data.materialreceived : [];

//       const libraryList = list.map((item, index) => ({
//         id: item._id || item.id || `lib-${index}`,
//         name: item.materialId.materialName || item.name || 'Unknown Material',
//         qty: item.quantity || 0,
//         date: item.date || '',
//         status: item.status || 'Received',
//         party: item.vendorId?.name || 'Unknown Party',

//         unit: item.materialId.unit || 'nos',

//       }));
//       setReceivedData(libraryList);



//     } catch (err) {
//       console.error('[Materials] GET error:', err);
//       Alert.alert('Error', 'Failed to fetch materials');
//     } finally {
//       setLoadingInventory(false);
//     }
//   };


//   const fetchMaterialUsed = async () => {
//     try {
//       setLoadingInventory(true);
//       const token = await AsyncStorage.getItem(TOKEN_KEY);

//       const res = await fetch(`${MATERIALS_API}/materialUsed/${project._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });

//       const text = await res.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = text; }


//       if (!res.ok) {
//         throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with ${res.status}`);
//       }
//       const list = Array.isArray(json) ? json : Array.isArray(json?.data?.materialused) ? json.data.materialused : [];
    
//       // Update material library data with the same API data
//       const libraryList = list.map((item, index) => ({
//         id: item._id || item.id || `lib-${index}`,
//         name: item.materialId.materialName || item.name || 'Unknown Material',
//         qty: item.quantity || 0,
//         date: item.date || '',
//         status: item.status || 'Used',


//         unit: item.materialId.unit || 'nos',

//       }));
     
//       setUsedData(libraryList);



//     } catch (err) {
//       console.error('[Materials] GET error:', err);
//       Alert.alert('Error', 'Failed to fetch materials');
//     } finally {
//       setLoadingInventory(false);
//     }
//   };





//   const createNewMaterial = async () => {
//     try {
//       if (!newMaterialForm.materialName.trim()) {
//         Alert.alert("Error", "Please enter material name");
//         return;
//       }

//       if (!newMaterialForm.category.trim()) {
//         Alert.alert("Error", "Please select a category");
//         return;
//       }

//       setCreatingMaterial(true);

//       const token = await AsyncStorage.getItem(TOKEN_KEY);

//       if (!project?._id) {
//         Alert.alert("Error", "Project ID is missing");
//         return;
//       }

//       const materialData = {
//         materialName: newMaterialForm.materialName.trim(),
//         unit: newMaterialForm.unit,
//         gst: parseFloat(newMaterialForm.gst) || 0,
//         hsnCode: newMaterialForm.hsnCode.trim(),
//         category: newMaterialForm.category,
//         description: newMaterialForm.description.trim(),
//         quantity: 0,
//         projectId: project._id,
//       };


//       const response = await fetch(
//         `${BASE_URL}/api/materials`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(materialData),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to create material");
//       }

//       Alert.alert("Success", "Material created successfully!");

//       setCreateNewMaterialModalVisible(false);

//       setNewMaterialForm({
//         materialName: "",
//         unit: "nos",
//         gst: "18.0",
//         hsnCode: "",
//         category: "",
//         description: "",
//       });

//       fetchMaterials();
//     } catch (err) {
//       console.error("[Create Material] ❌ Error:", err);
//       Alert.alert("Error", err.message || "Failed to create material");
//     } finally {
//       setCreatingMaterial(false);
//     }
//   };

//   // === DELETE MATERIAL API ===
//   const deleteMaterial = async (id) => {
//     try {
//       if (!id) return Alert.alert('Error', 'Invalid material ID');
//       Alert.alert(
//         'Confirm Delete',
//         'Are you sure you want to delete this material?',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           {
//             text: 'Delete',
//             style: 'destructive',
//             onPress: async () => {
//               const token = await AsyncStorage.getItem(TOKEN_KEY);
//               const res = await fetch(`${BASE_URL}/api/materials/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                   'Content-Type': 'application/json',
//                   ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//               });

//               const text = await res.text();
//               let json;
//               try { json = JSON.parse(text); } catch { json = text; }


//               if (!res.ok) throw new Error(json?.message || 'Failed to delete');

//               Alert.alert('Deleted', 'Material deleted successfully.');
//               fetchMaterials();
//             },
//           },
//         ]
//       );
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Failed to delete material');
//     }
//   };
//   // Add with your other state variables
//   const [showPartyDropdown, setShowPartyDropdown] = useState(false);
//   const [partySearch, setPartySearch] = useState('');
//   const [vendors, setVendors] = useState([]); // Add this if not already there

//   useEffect(() => {
//     const loadVendors = async () => {
//       try {

//         const token = await AsyncStorage.getItem(TOKEN_KEY);
      

//         const response = await fetch(`${process.env.BASE_API_URL}/api/vendor`, {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           }
//         });



//         if (!response.ok) {
//           const txt = await response.text().catch(() => '');
//           console.error('Vendors fetch failed:', response.status, response.statusText, txt);


//           throw new Error(`Failed to fetch vendors: ${response.status}`);
//         }

//         const vendorsRes = await response.json();



//         const mappedVendors = (vendorsRes.data || vendorsRes || []).map(vendor => ({
//           id: vendor._id || vendor.id,
//           name: vendor.name || vendor.name || 'Unknown Vendor',
//           email: vendor.email || '',
//           vendorcode: vendor.vendorcode || vendor.code || '',
//           taxNo: vendor.taxNo || vendor.taxNumber || '',
//           gstinno: vendor.gstinno || vendor.gstin || '',
//           vendorType: vendor.vendorType || vendor.type || 'General Contractor',
//           address: vendor.address || '',
//           status: vendor.status === 'active' ? 'Active' : (vendor.status || 'Active')
//         }));

//         setVendors(mappedVendors);
//       } catch (error) {
//         console.error('Error loading vendors:', error);
//         Alert.alert('Error', `Failed to load vendors: ${error.message}`);
//       }
//     };

//     loadVendors();
//   }, []);
//   const selectParty = (vendor, context = 'purchase') => {

//     if (context === 'purchase') {
//       setPurchaseForm(prev => ({ ...prev, partyName: vendor.name }));
//     } else if (context === 'received') {
//       setReceivedForm(prev => ({ ...prev, partyName: vendor.name }));
//     }

//     setShowPartyDropdown(false);
//     setPartySearch('');

//     // Also update the search field if it's open
//     if (context === 'purchase') {
//       setPartySearch(vendor.name);
//     } else if (context === 'received') {
//       // For received form, we need to update the text input
//       setTimeout(() => {
//         setReceivedForm(prev => ({ ...prev, partyName: vendor.name }));
//       }, 100);
//     }
//   };

//   const filteredParties = useMemo(() => {
//     const searchTerm = partySearch.trim().toLowerCase();
//     if (!searchTerm) return vendors.slice(0, 5);

//     return vendors.filter(vendor =>
//       (vendor.name || '').toLowerCase().includes(searchTerm) ||
//       (vendor.vendorcode || '').toLowerCase().includes(searchTerm)
//     ).slice(0, 5);
//   }, [vendors, partySearch]);
//   const openEditModal = (material) => {
//     const rawMaterial = material.__raw || material;
//     setEditMaterialForm({
//       id: rawMaterial._id || rawMaterial.id,
//       materialName: rawMaterial.name || '',
//       unit: rawMaterial.unit || 'nos',
//       gst: String(rawMaterial.gst || '18.0'),
//       hsnCode: rawMaterial.hsnCode || '',
//       category: rawMaterial.category || '',
//       quantity: String(rawMaterial.quantity || ''),
//       stock: String(rawMaterial.stock || ''),
//       price: String(rawMaterial.price || ''),
//       minStock: String(rawMaterial.minStock || ''),
//       description: rawMaterial.description || ''
//     });
//     setEditMaterialModalVisible(true);
//   };

//   const handleEditMaterial = async () => {
//     try {
//       if (!editMaterialForm.materialName.trim()) {
//         Alert.alert('Error', 'Please enter material name');
//         return;
//       }

//       if (!editMaterialForm.category.trim()) {
//         Alert.alert('Error', 'Please select a category');
//         return;
//       }

//       setUpdatingMaterial(true);

//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       let projectId = await AsyncStorage.getItem("activeProjectId");

//       if (!projectId) {
//         projectId = "691189346522d6945d920bac";
//         await AsyncStorage.setItem("activeProjectId", projectId);
//       }

//       const materialData = {
//         name: editMaterialForm.materialName.trim(),
//         unit: editMaterialForm.unit,
//         gst: parseFloat(editMaterialForm.gst) || 0,
//         hsnCode: editMaterialForm.hsnCode.trim(),
//         category: editMaterialForm.category,
//         description: editMaterialForm.description.trim(),
//         quantity: parseFloat(editMaterialForm.quantity) || 0,
//         stock: parseFloat(editMaterialForm.stock) || 0,
//         price: parseFloat(editMaterialForm.price) || 0,
//         minStock: parseFloat(editMaterialForm.minStock) || 0,
//         projectId
//       };


//       const res = await fetch(`${BASE_URL}/api/materials/${editMaterialForm.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(materialData),
//       });

//       const text = await res.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = text; }


//       if (!res.ok) {
//         throw new Error(
//           typeof json === "object" && json?.message
//             ? json.message
//             : `Request failed with ${res.status}`
//         );
//       }

//       Alert.alert("Success", "Material updated successfully!");
//       setEditMaterialModalVisible(false);
//       fetchMaterials();
//     } catch (err) {
//       console.error("[Edit Material] ❌ Error:", err);
//       Alert.alert("Error", err.message || "Failed to update material");
//     } finally {
//       setUpdatingMaterial(false);
//     }
//   };

//   // === SELECTION HANDLERS ===
//   const selectEditCategory = (category) => {
//     setEditMaterialForm({ ...editMaterialForm, category });
//     setShowEditCategoryModal(false);
//   };

//   const selectEditUnit = (unit) => {
//     setEditMaterialForm({ ...editMaterialForm, unit });
//     setShowEditUnitModal(false);
//   };

//   const selectEditGst = (gst) => {
//     setEditMaterialForm({ ...editMaterialForm, gst });
//     setShowEditGstModal(false);
//   };

//   const selectCategory = (category) => {
//     setNewMaterialForm({ ...newMaterialForm, category });
//     setShowCategoryModal(false);
//   };

//   const selectUnit = (unit) => {
//     setNewMaterialForm({ ...newMaterialForm, unit });
//     setShowUnitModal(false);
//   };

//   const selectGst = (gst) => {
//     setNewMaterialForm({ ...newMaterialForm, gst });
//     setShowGstModal(false);
//   };

//   // === MATERIAL SELECTION HANDLERS ===
//   const toggleMaterial = (id) => {
//     setSelectedMaterials([id]); // Single selection only

//     const material = materialLibraryData.find(item => item.id === id);
//     if (!material) return;

//     if (showMaterialListInRequest) {
//       setSelectedRequestMaterial(material);
//       setRequestForm(prev => ({ ...prev, materialName: material.name }));
//       setShowMaterialListInRequest(false);
//     } else if (showMaterialListInPurchase) {
//       setSelectedPurchaseMaterial(material);
//       setShowMaterialListInPurchase(false);
//     } else if (showMaterialListInReceived) {
//       setSelectedReceivedMaterial(material);
//       setReceivedForm(prev => ({ ...prev, materialName: material.name }));
//       setShowMaterialListInReceived(false);
//     } else if (showMaterialListInUsed) {
//       setSelectedUsedMaterial(material);
//       setShowMaterialListInUsed(false);
//     }
//   };
//   // === Add these state variables ===
//   const [showMaterialListInPurchase, setShowMaterialListInPurchase] = useState(false);
//   const [selectedPurchaseMaterial, setSelectedPurchaseMaterial] = useState(null);

//   // === Add this function to clear purchase form ===
//   const clearPurchaseForm = () => {
//     setPurchaseForm({
//       partyName: '',
//       quantity: '',
//       amount: '',
//       billTo: '',
//       advance: '',
//       balance: ''
//     });
//     setSelectedPurchaseMaterial(null);
//     setShowMaterialListInPurchase(false);
//   };


//   const handleSaveUsed = async () => {
//     if (!selectedUsedMaterial) {
//       Alert.alert('Error', 'Please select a material');
//       return;
//     }
//     if (!usedForm.quantity.trim()) {
//       Alert.alert('Error', 'Please enter quantity');
//       return;
//     }

//     const selectedMaterialId = selectedMaterials[0];

//     const usedData = {
//       date: usedForm.date,
//       materialId: selectedMaterialId,
//       quantity: parseFloat(usedForm.quantity),
//       notes: usedForm.notes,
//       projectId: project._id,
//     };

   

//     try {
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       const response = await fetch(`${BASE_URL}/api/materials/materialUsed`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(usedData),
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to record material used');
//       }

//       Alert.alert('Success', 'Material usage recorded successfully!');

//       // Close modal and clear form
//       setUsedModalVisible(false);
//       fetchMaterialUsed();
//       fetchMaterials();
//       clearUsedForm();
//     } catch (err) {
//       console.error('[Material Used] Error:', err);
//       Alert.alert('Error', err.message || 'Failed to record usage');
//     }
//   };

//   const handleSavePurchase = async () => {
//     if (!selectedPurchaseMaterial) {
//       Alert.alert('Error', 'Please select a material');
//       return;
//     }
//     if (!purchaseForm.quantity.trim() || !purchaseForm.rate.trim()) {
//       Alert.alert('Error', 'Please enter quantity and rate');
//       return;
//     }
//     if (!purchaseForm.partyName.trim()) {
//       Alert.alert('Error', 'Please enter party name');
//       return;
//     }
//     const existingVendor = vendors.find(v => v.name === purchaseForm.partyName);
  
//     const purchaseData = {
//       date: purchaseDate.toISOString(),
//       vendorId: existingVendor.id,
//       materialId: selectedMaterials[0],
//       quantity: parseFloat(purchaseForm.quantity),
//       rate: parseFloat(purchaseForm.rate),
//       totalAmount: parseFloat(purchaseForm.totalAmount),
//       advance: parseFloat(purchaseForm.advance) || 0,
//       balance: parseFloat(purchaseForm.balance) || 0,

//       projectId: project._id,
//     };




//     const token = await AsyncStorage.getItem("userToken");

//     const res = await fetch(`${BASE_URL}/api/materials/materialPurchase`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(purchaseData),
//     });

//     const json = await res.json();


//     if (!res.ok) {
//       throw new Error(json?.message || "Failed to save purchase");
//     }

//     Alert.alert("Success", "Purchase saved successfully!");

//     // ✅ Clear form / close modal
//     setPurchaseForm({
//       quantity: "",
//       rate: "",
//       totalAmount: "",
//       advance: "",
//       balance: "",
//       partyName: "",
//     });

//     setAddMaterialPurchaseModalVisible(false);

//   };
//   // === REQUEST FORM HANDLER (Logs only Material ID) ===
//   const handleSaveRequest = async () => {
//     // Validation
//     if (selectedMaterials.length === 0) {
//       Alert.alert('Error', 'Please select a material');
//       return;
//     }

//     if (!requestForm.quantity.trim()) {
//       Alert.alert('Error', 'Please enter quantity');
//       return;
//     }
//     const selectedMaterialId = selectedMaterials[0];

//     // Prepare request data with only the ID
//     const requestData = {

//       date: requestForm.date,
//       materialId: selectedMaterialId, // Only storing the ID
//       quantity: requestForm.quantity,
//       itemDescription: requestForm.itemDescription,
//       notes: requestForm.notes,
//       projectId: project._id,

//     };

//     const token = await AsyncStorage.getItem("userToken");

//     const response = await fetch(
//       `${process.env.BASE_API_URL}/api/materials/materialRequest`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(requestData)
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to create request");
//     }


//     // Show alert with ID
//     Alert.alert(
//       'Request Data Logged',
//       `Material ID: ${requestData.materialId}\nQuantity: ${requestData.quantity}`,
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             setRequestMaterialModalVisible(false);
//             // Clear selection
//             setSelectedMaterials([]);
//             setSelectedRequestMaterial(null);
//             setShowMaterialListInRequest(false);
//           }
//         }
//       ]
//     );
//     fetchMaterialRequests();
//   };

//   // === CLEAR REQUEST FORM ===
//   const clearRequestForm = () => {
//     setRequestForm({
//       mrNumber: 'MR-' + (Math.floor(Math.random() * 100) + 1),
//       date: new Date().toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       }).split('/').join('-'),
//       materialName: '',
//       quantity: '',
//       itemDescription: '',
//       notes: ''
//     });
//     setSelectedRequestMaterial(null);
//     setSelectedMaterials([]);
//     setShowMaterialListInRequest(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//     fetchMaterialRequests();
//     fetchMaterialReceived();
//     fetchMaterialUsed();
//   }, []);
//   useEffect(() => {
//     if (!addMaterialPurchaseModalVisible) {
//       setShowPartyDropdown(false);
//       setPartySearch('');
//     }
//   }, [addMaterialPurchaseModalVisible]);
//   // Clear form when modal closes
//   useEffect(() => {
//     if (!requestMaterialModalVisible) {
//       clearRequestForm();
//     }
//   }, [requestMaterialModalVisible]);

//   const formatItemDate = (d) => {
//     if (!d) return '';
//     const date = new Date(d);
//     if (isNaN(date.getTime())) return '';
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: undefined }).replace(',', '');
//   };

//   const mappedInventory = useMemo(() => {
//     return (inventoryApi || []).map((m) => {
//       const id = m._id || m.id || String(Math.random());
//       return {
//         _id: id,
//         name: m.materialName || m.name || 'Unknown Material',
//         date: formatItemDate(m.createdAt || m.updatedAt || new Date()),
//         stock: typeof m.stock === 'number'
//           ? m.stock
//           : (typeof m.quantity === 'number' ? m.quantity : 0),
//         unit: m.unit || 'nos',
//         __raw: m,
//       };
//     });
//   }, [inventoryApi]);

//   const filteredInventory = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return mappedInventory;
//     return mappedInventory.filter((item) => item.name.toLowerCase().includes(q));
//   }, [mappedInventory, searchQuery]);

//   const filteredLibrary = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     if (!q) return materialLibraryData;
//     return materialLibraryData.filter((item) =>
//       (item.name || '').toLowerCase().includes(q)
//     );
//   }, [materialLibraryData, searchQuery]);

//   // === RENDER FUNCTIONS ===
//   const renderSubTab = ({ item }) => (
//     <TouchableOpacity
//       className={`mx-1.5 px-4 py-1.5 ${activeSubTab === item.id ? 'border-b-2 border-blue-500' : ''
//         }`}
//       onPress={() => setActiveSubTab(item.id)}>
//       <Text
//         className={`text-sm font-medium ${activeSubTab === item.id ? 'text-blue-500' : 'text-gray-600'
//           }`}>
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderRightActions = (item) => (
//     <View className="bg-red-500 justify-center items-center w-[80px] rounded-r-xl mb-2">
//       <TouchableOpacity
//         className="flex-1 justify-center items-center w-full"
//         onPress={() => deleteMaterial(item._id)}
//       >
//         <Ionicons name="trash" size={22} color="white" />
//         <Text className="text-white text-xs mt-1">Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderInventoryItem = ({ item }) => (
//     <Swipeable renderRightActions={() => renderRightActions(item)}>
//       <TouchableOpacity
//         className="mb-2 rounded-xl bg-white p-3 flex-row justify-between items-center"
//         onPress={() => {
//           const materialId = item.__raw?._id || item._id;
//           if (!materialId || materialId.includes('random')) {
//             Alert.alert('Error', 'Invalid material selected');
//             return;
//           }

//           navigation.navigate('Materials', {
//             screen: 'MaterialDetailScreen',
//             params: {
//               materialId,
//               item: item.__raw,
//             },
//           });
//         }}
//       >
//         <View className="flex-row items-center flex-1">
//           <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//             <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
//           </View>
//           <View>
//             <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
//             <Text className="mt-0.5 text-sm text-gray-500">{item.date}</Text>
//           </View>
//         </View>

//         <View className="items-end">
//           <Text className="text-base font-semibold text-gray-900">
//             {loadingInventory ? '...' : `${item.stock} ${item.unit}`}
//           </Text>
//           <TouchableOpacity
//             onPress={() => openEditModal(item)}
//           >
//             <Text className="text-xs text-blue-600 mt-2">Edit</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </Swipeable>
//   );

//   const renderRequestItem = ({ item }) => (
//     <TouchableOpacity
//       className="mb-2 rounded-xl bg-white p-3"
//       onPress={() => navigation.navigate('RequestDetailsScreen', { request: item })}
//     >
//       <View className="flex-row items-center justify-between">
//         <View className="flex-1 flex-row items-center">
//           <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//             <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
//           </View>
//           <View>
//             <Text className="text-sm text-gray-500">{item.date}</Text>
//             <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
//           </View>
//         </View>
//         <View className="items-end">
//           <Text className="text-sm font-semibold text-gray-900">{item.qty} {item.unit}</Text>
//           <View className="mt-1 rounded bg-orange-100 px-2 py-1">
//             <Text className="text-xs font-medium text-orange-700">{item.status}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderReceivedItem = ({ item }) => (
//     <View className="mb-2 rounded-xl bg-white p-3">
//       <View className="flex-row items-center justify-between">
//         <View className="flex-1 flex-row items-center">
//           <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//             <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
//           </View>
//           <View>
//             <Text className="text-sm text-gray-500">
//               {new Date(item.date).toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </Text>

//             <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
//             <Text className="mt-1 text-xs text-gray-500">{item.party}</Text>
//           </View>
//         </View>
//         <Text className="text-sm font-medium text-green-600">{item.qty} {item.unit}</Text>
//       </View>
//     </View>
//   );

//   const renderUsedItem = ({ item }) => (
//     <View className="mb-2 rounded-xl bg-white p-3">
//       <View className="flex-row items-center justify-between">
//         <View className="flex-1 flex-row items-center">
//           <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//             <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
//           </View>
//           <View>
//             <Text className="text-sm text-gray-500">{item.date}</Text>
//             <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
//           </View>
//         </View>
//         <Text className="text-sm font-medium text-red-600">-{item.qty} {item.unit}</Text>
//       </View>
//     </View>
//   );

//   const renderLibraryItem = ({ item }) => (
//     <TouchableOpacity
//       className="flex-row items-center border-b border-gray-200 py-3"
//       onPress={() => toggleMaterial(item.id)}>
//       <View className="flex-1">
//         <Text className="text-base font-medium text-gray-900">{item.name}</Text>
//         <Text className="mt-0.5 text-xs text-gray-500">Category: {item.category}</Text>
//         <Text className="text-xs text-gray-500">ID: {item.id}</Text>
//       </View>
//       <Text className="mr-3 text-sm text-gray-600">Unit: {item.unit}</Text>
//       <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
//         {selectedMaterials.includes(item.id) && (
//           <View className="h-3 w-3 rounded-full bg-blue-500" />
//         )}
//       </View>
//     </TouchableOpacity>
//   );
//   const renderContent = () => {
//     if (activeSubTab === 'Inventory') {
//       return (
//         <>
//           <View className="mb-2 mt-4 flex-row justify-between px-4">
//             <Text className="text-sm font-semibold text-gray-600">Material</Text>
//             <Text className="text-sm font-semibold text-gray-600">In Stock</Text>
//           </View>
//           <GestureHandlerRootView style={{ flex: 1 }}>
//             <FlatList
//               data={filteredInventory}
//               renderItem={renderInventoryItem}
//               keyExtractor={(item) => item._id || item.id}
//               contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
//               showsVerticalScrollIndicator={false}
//             />
//           </GestureHandlerRootView>
//         </>
//       );
//     }

//     if (activeSubTab === 'Request') {
//       return (
//         <FlatList
//           data={requestData}
//           renderItem={renderRequestItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//         />
//       );
//     }

//     if (activeSubTab === 'Received') {
//       return (
//         <FlatList
//           data={receivedData}
//           renderItem={renderReceivedItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//         />
//       );
//     }

//     if (activeSubTab === 'Used') {
//       return (
//         <FlatList
//           data={usedData}
//           renderItem={renderUsedItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//         />
//       );
//     }

//     return null;
//   };



//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* === Sub Tabs === */}
//       <View className="mb-1 mt-3 flex-row px-4">
//         <FlatList
//           data={subTabs}
//           renderItem={renderSubTab}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 0 }}
//         />
//       </View>

//       {/* === Search === */}
//       <View className="mx-4 mt-1 h-12 flex-row items-center rounded-xl bg-white px-3">
//         <Ionicons name="search" size={20} color="#9CA3AF" className="mr-2" />
//         <TextInput
//           className="flex-1 text-base text-gray-900"
//           placeholder="Search..."
//           placeholderTextColor="#9CA3AF"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* === Content === */}
//       <View className="flex-1">{renderContent()}</View>

//       {/* === Bottom Buttons === */}
//       <View
//         className="absolute inset-x-0 bottom-16 left-4 right-4 flex-row items-center justify-between px-2"
//         style={{ zIndex: 10 }}>
//         <TouchableOpacity
//           className="mx-1 flex-1 rounded-xl bg-red-50 px-4 py-2.5"
//           onPress={() => setUsedModalVisible(true)}
//         >
//           <Text className="text-center text-sm font-semibold text-red-500">- Used</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="mx-1 flex-1 rounded-xl bg-blue-100 px-5 py-2.5"
//           onPress={() => setMaterialActionModalVisible(true)}>
//           <Text className="text-center text-sm font-semibold text-gray-900">+ Material</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="mx-1 flex-1 rounded-xl bg-amber-100 px-4 py-2.5"
//           onPress={() => setReceivedModalVisible(true)}>
//           <Text className="text-center text-sm font-semibold text-gray-900">+ Received</Text>
//         </TouchableOpacity>
//       </View>

//       {/* === ACTION MODAL === */}
//       <Modal
//         visible={materialActionModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setMaterialActionModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setMaterialActionModalVisible(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="h-[40%] rounded-t-3xl bg-white p-6 pb-10"
//             onPress={() => { }}
//           >
//             <View className="mb-5 items-center">
//               <View className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </View>
//             <Text className="mb-12 text-center text-xl font-bold text-gray-900">Material</Text>
//             <View className="space-y-6">
//               <View className="mb-8 flex-row space-x-6">
//                 <TouchableOpacity
//                   className="flex-1 rounded-2xl bg-blue-50 px-3 py-4"
//                   onPress={() => {
//                     setMaterialActionModalVisible(false);
//                     setRequestMaterialModalVisible(true);
//                   }}
//                 >
//                   <Text className="text-center text-base font-semibold text-blue-600">+ Request</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="flex-1 rounded-2xl bg-green-50 px-5 py-4"
//                   onPress={() => {
//                     setMaterialActionModalVisible(false);
//                     setReceivedModalVisible(true);
//                   }}>
//                   <Text className="text-center text-base font-semibold text-green-600">+ Received</Text>
//                 </TouchableOpacity>
//               </View>
//               <View className="mb-5 flex-row space-x-6">
//                 <TouchableOpacity
//                   className="flex-1 rounded-2xl bg-cyan-50 px-5 py-4"
//                   onPress={() => {
//                     setMaterialActionModalVisible(false);
//                     setAddMaterialPurchaseModalVisible(true);
//                   }}>
//                   <Text className="text-center text-base font-semibold text-cyan-600">+ Purchased</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   className="flex-1 rounded-2xl bg-red-50 px-5 py-4"
//                   onPress={() => {
//                     setMaterialActionModalVisible(false);
//                     setUsedModalVisible(true);
//                   }}>
//                   <Text className="text-center text-base font-semibold text-red-600">- Used</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>


//       {/* {/* === REQUEST MATERIAL MODAL (UPDATED) === */}
//       <Modal
//         visible={requestMaterialModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setRequestMaterialModalVisible(false);
//           setShowMaterialListInRequest(false);
//           clearRequestForm();
//         }}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => {
//             setRequestMaterialModalVisible(false);
//             setShowMaterialListInRequest(false);
//             clearRequestForm();
//           }}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="rounded-t-3xl bg-white"
//             onPress={() => { }}
//             style={{
//               height: showMaterialListInRequest ? '85%' : '75%', // Increased height
//               maxHeight: '90%',
//             }}
//           >
//             {/* Drag handle */}
//             <View className="items-center pt-3 pb-1">
//               <View className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </View>

//             {/* Render either material list OR request form */}
//             {showMaterialListInRequest ? (
//               // === MATERIAL LIST VIEW ===
//               <View className="flex-1 px-5">
//                 <View className="flex-row items-center justify-between mb-4">
//                   <TouchableOpacity
//                     onPress={() => setShowMaterialListInRequest(false)}
//                     className="p-2"
//                   >
//                     <Ionicons name="arrow-back" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text className="text-lg font-bold text-gray-900">Select Material</Text>
//                    <TouchableOpacity
//           onPress={() => {
//             setRequestMaterialModalVisible(false);
//             setShowMaterialListInRequest(false);
//             setCreateNewMaterialModalVisible(true);
//           }}
//           className="mr-3 p-2"
//         >
//           <Text className="text-blue-600 font-medium">New +</Text>
//         </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setRequestMaterialModalVisible(false);
//                       setShowMaterialListInRequest(false);
//                       clearRequestForm();
//                     }}
//                     className="p-2"
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Search in material list */}
//                 <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
//                   <Ionicons name="search" size={20} color="#9CA3AF" />
//                   <TextInput
//                     className="ml-2 flex-1 text-base text-gray-900"
//                     placeholder="Search materials..."
//                     placeholderTextColor="#9CA3AF"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                   />
//                 </View>

//                 {/* Material List */}
//                 <FlatList
//                   data={filteredLibrary}
//                   renderItem={renderLibraryItem}
//                   keyExtractor={(item) => item.id}
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                   ListEmptyComponent={
//                     <View className="py-8 items-center">
//                       <Text className="text-gray-500">No materials found</Text>
//                       <TouchableOpacity
//                         onPress={fetchMaterials}
//                         className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
//                       >
//                         <Text className="text-blue-600">Refresh</Text>
//                       </TouchableOpacity>
//                     </View>
//                   }
//                 />
//               </View>
//             ) : (
//               // === REQUEST FORM VIEW ===
//               <View className="flex-1 px-5">
//                 <View className="mb-4 flex-row items-center justify-between">
//                   <Text className="text-lg font-bold text-gray-900">Material Request</Text>
//                   <TouchableOpacity onPress={() => {
//                     setRequestMaterialModalVisible(false);
//                     setShowMaterialListInRequest(false);
//                     clearRequestForm();
//                   }}>
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   className="flex-1"
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                 >
//                   {/* Date Field */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
//                     <View className="flex-row items-center justify-between">
//                       <Text className="text-base text-gray-900">{requestForm.date}</Text>
//                       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                         <Ionicons name="calendar-outline" size={20} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Material Selection - Show button or selected material */}
//                   {selectedRequestMaterial ? (
//                     <View className="mb-4">
//                       <View className="flex-row items-center justify-between mb-2">
//                         <Text className="text-sm font-medium text-gray-700">Selected Material</Text>
//                         <TouchableOpacity
//                           onPress={() => setShowMaterialListInRequest(true)}
//                           className="p-1"
//                         >
//                           <Text className="text-blue-600 text-sm">Change</Text>
//                         </TouchableOpacity>
//                       </View>
//                       <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <Text className="text-base font-medium text-gray-900">{selectedRequestMaterial.name}</Text>
//                         <View className="flex-row mt-1">
//                           <Text className="text-xs text-gray-500 mr-3">Category: {selectedRequestMaterial.category}</Text>
//                           <Text className="text-xs text-gray-500">Unit: {selectedRequestMaterial.unit}</Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">ID: {selectedRequestMaterial.id}</Text>
//                       </View>
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                       onPress={() => setShowMaterialListInRequest(true)}
//                     >
//                       <Ionicons name="add" size={20} color="#0066FF" />
//                       <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Quantity Field */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter quantity"
//                       placeholderTextColor="#9CA3AF"
//                       value={requestForm.quantity}
//                       onChangeText={(text) => setRequestForm({ ...requestForm, quantity: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Item Description Field */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Item Description</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter description"
//                       placeholderTextColor="#9CA3AF"
//                       value={requestForm.itemDescription}
//                       onChangeText={(text) => setRequestForm({ ...requestForm, itemDescription: text })}
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Notes Field */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
//                     <TextInput
//                       className="h-24 text-sm text-gray-900"
//                       placeholder="Enter notes..."
//                       placeholderTextColor="#9CA3AF"
//                       value={requestForm.notes}
//                       onChangeText={(text) => setRequestForm({ ...requestForm, notes: text })}
//                       multiline
//                       numberOfLines={4}
//                       textAlignVertical="top"
//                     />
//                   </View>
//                 </ScrollView>

//                 {/* Save Button - Moved outside ScrollView */}
//                 <TouchableOpacity
//                   className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5 mb-4"
//                   onPress={handleSaveRequest}
//                 >
//                   <Text className="text-base font-semibold text-white">Save & Log ID</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//       {/* === CREATE NEW MATERIAL MODAL === */}
//       <Modal
//         visible={createNewMaterialModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="h-[85%] rounded-t-3xl bg-white p-5"
//             onPress={() => { }}
//           >
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Create New Material</Text>
//               <TouchableOpacity
//                 onPress={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}
//                 disabled={creatingMaterial}
//               >
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
//               {/* Material Name Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter material name"
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.materialName}
//                   onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, materialName: text })}
//                   editable={!creatingMaterial}
//                 />
//               </View>

//               {/* Unit Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !creatingMaterial && setShowUnitModal(true)}
//                   disabled={creatingMaterial}
//                 >
//                   <Text className={`text-base ${newMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {newMaterialForm.unit || 'Select unit'}
//                   </Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* GST Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !creatingMaterial && setShowGstModal(true)}
//                   disabled={creatingMaterial}
//                 >
//                   <Text className="text-base text-gray-900">{newMaterialForm.gst}%</Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* HSN Code Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter HSN/SAC code"
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.hsnCode}
//                   onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, hsnCode: text })}
//                   editable={!creatingMaterial}
//                   keyboardType="numeric"
//                 />
//               </View>

//               {/* Category Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !creatingMaterial && setShowCategoryModal(true)}
//                   disabled={creatingMaterial}
//                 >
//                   <Text className={`text-base ${newMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {newMaterialForm.category || 'Select category'}
//                   </Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* Description Field */}
//               <View className="mb-6">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
//                 <TextInput
//                   className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter description..."
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.description}
//                   onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, description: text })}
//                   multiline
//                   editable={!creatingMaterial}
//                   textAlignVertical="top"
//                   numberOfLines={5}
//                 />
//               </View>
//             </ScrollView>

//             <TouchableOpacity
//               className={`flex-row items-center justify-center rounded-xl py-4 ${creatingMaterial ? 'bg-blue-400' : 'bg-blue-600'
//                 } mt-4`}
//               onPress={createNewMaterial}
//               disabled={creatingMaterial}
//             >
//               {creatingMaterial ? (
//                 <Text className="text-base font-semibold text-white">Creating...</Text>
//               ) : (
//                 <>
//                   <Text className="text-base font-semibold text-white">Create Material</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </>
//               )}
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === EDIT MATERIAL MODAL === */}
//       <Modal
//         visible={editMaterialModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => !updatingMaterial && setEditMaterialModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => !updatingMaterial && setEditMaterialModalVisible(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="h-[85%] rounded-t-3xl bg-white p-5"
//             onPress={() => { }}
//           >
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Edit Material</Text>
//               <TouchableOpacity
//                 onPress={() => !updatingMaterial && setEditMaterialModalVisible(false)}
//                 disabled={updatingMaterial}
//               >
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
//               {/* Material Name Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter material name"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.materialName}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, materialName: text })}
//                   editable={!updatingMaterial}
//                 />
//               </View>

//               {/* Unit Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !updatingMaterial && setShowEditUnitModal(true)}
//                   disabled={updatingMaterial}
//                 >
//                   <Text className={`text-base ${editMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {editMaterialForm.unit || 'Select unit'}
//                   </Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* GST Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !updatingMaterial && setShowEditGstModal(true)}
//                   disabled={updatingMaterial}
//                 >
//                   <Text className="text-base text-gray-900">{editMaterialForm.gst}%</Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* HSN Code Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter HSN/SAC code"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.hsnCode}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, hsnCode: text })}
//                   editable={!updatingMaterial}
//                   keyboardType="numeric"
//                 />
//               </View>

//               {/* Category Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
//                 <TouchableOpacity
//                   className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
//                   onPress={() => !updatingMaterial && setShowEditCategoryModal(true)}
//                   disabled={updatingMaterial}
//                 >
//                   <Text className={`text-base ${editMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
//                     {editMaterialForm.category || 'Select category'}
//                   </Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </TouchableOpacity>
//               </View>

//               {/* Quantity Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter quantity"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.quantity}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, quantity: text })}
//                   keyboardType="numeric"
//                   editable={!updatingMaterial}
//                 />
//               </View>

//               {/* Stock Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Current Stock</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter current stock"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.stock}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, stock: text })}
//                   keyboardType="numeric"
//                   editable={!updatingMaterial}
//                 />
//               </View>

//               {/* Price Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Price</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter price"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.price}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, price: text })}
//                   keyboardType="numeric"
//                   editable={!updatingMaterial}
//                 />
//               </View>

//               {/* Minimum Stock Field */}
//               <View className="mb-4">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Minimum Stock</Text>
//                 <TextInput
//                   className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter minimum stock"
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.minStock}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, minStock: text })}
//                   keyboardType="numeric"
//                   editable={!updatingMaterial}
//                 />
//               </View>

//               {/* Description Field */}
//               <View className="mb-6">
//                 <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
//                 <TextInput
//                   className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
//                   placeholder="Enter description..."
//                   placeholderTextColor="#9CA3AF"
//                   value={editMaterialForm.description}
//                   onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, description: text })}
//                   multiline
//                   editable={!updatingMaterial}
//                   textAlignVertical="top"
//                   numberOfLines={5}
//                 />
//               </View>
//             </ScrollView>

//             <TouchableOpacity
//               className={`flex-row items-center justify-center rounded-xl py-4 ${updatingMaterial ? 'bg-blue-400' : 'bg-blue-600'
//                 } mt-4`}
//               onPress={handleEditMaterial}
//               disabled={updatingMaterial}
//             >
//               {updatingMaterial ? (
//                 <Text className="text-base font-semibold text-white">Updating...</Text>
//               ) : (
//                 <>
//                   <Text className="text-base font-semibold text-white">Update Material</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </>
//               )}
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === DROPDOWN SELECTION MODALS === */}

//       {/* Category Selection Modal */}
//       <Modal
//         visible={showCategoryModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowCategoryModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select Category</Text>
//               <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={categories}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectCategory(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Unit Selection Modal */}
//       <Modal
//         visible={showUnitModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowUnitModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select Unit</Text>
//               <TouchableOpacity onPress={() => setShowUnitModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={units}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectUnit(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* GST Selection Modal */}
//       <Modal
//         visible={showGstModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowGstModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select GST Rate</Text>
//               <TouchableOpacity onPress={() => setShowGstModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={gstRates}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectGst(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}%</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Category Selection Modal */}
//       <Modal
//         visible={showEditCategoryModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowEditCategoryModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select Category</Text>
//               <TouchableOpacity onPress={() => setShowEditCategoryModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={categories}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectEditCategory(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Unit Selection Modal */}
//       <Modal
//         visible={showEditUnitModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowEditUnitModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select Unit</Text>
//               <TouchableOpacity onPress={() => setShowEditUnitModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={units}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectEditUnit(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>

//       {/* Edit GST Selection Modal */}
//       <Modal
//         visible={showEditGstModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowEditGstModal(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="h-1/2 bg-white rounded-t-3xl p-5">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-lg font-bold text-gray-900">Select GST Rate</Text>
//               <TouchableOpacity onPress={() => setShowEditGstModal(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={gstRates}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   className="py-4 border-b border-gray-200"
//                   onPress={() => selectEditGst(item)}
//                 >
//                   <Text className="text-base text-gray-900">{item}%</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>
//       </Modal>



//       <Modal
//         visible={addMaterialPurchaseModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setAddMaterialPurchaseModalVisible(false);
//           setShowMaterialListInPurchase(false);
//           clearPurchaseForm();
//         }}
//       >
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => {
//             setAddMaterialPurchaseModalVisible(false);
//             setShowMaterialListInPurchase(false);
//             clearPurchaseForm();
//           }}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="rounded-t-3xl bg-white"
//             style={{
//               height: showMaterialListInPurchase ? '85%' : '75%',
//               maxHeight: '90%',
//             }}
//             onPress={() => { }}
//           >
//             {/* Drag handle */}
//             <View className="items-center pt-3 pb-1">
//               <View className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </View>

//             {showMaterialListInPurchase ? (
//               // Material selection list (unchanged)
//               <View className="flex-1 px-5">
//                 <View className="flex-row items-center justify-between mb-4">
//                   <TouchableOpacity onPress={() => setShowMaterialListInPurchase(false)} className="p-2">
//                     <Ionicons name="arrow-back" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text className="text-lg font-bold text-gray-900">Select Material</Text>
//                   <TouchableOpacity
//           onPress={() => {
//             setAddMaterialPurchaseModalVisible(false);
//             setShowMaterialListInPurchase(false);
//             setCreateNewMaterialModalVisible(true);
//           }}
//           className="mr-3 p-2"
//         >
//           <Text className="text-blue-600 font-medium">New +</Text>
//         </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setAddMaterialPurchaseModalVisible(false);
//                       setShowMaterialListInPurchase(false);
//                       clearPurchaseForm();
//                     }}
//                     className="p-2"
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
//                   <Ionicons name="search" size={20} color="#9CA3AF" />
//                   <TextInput
//                     className="ml-2 flex-1 text-base text-gray-900"
//                     placeholder="Search materials..."
//                     placeholderTextColor="#9CA3AF"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                   />
//                 </View>

//                 <FlatList
//                   data={filteredLibrary}
//                   renderItem={renderLibraryItem}
//                   keyExtractor={(item) => item.id}
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                   ListEmptyComponent={
//                     <View className="py-8 items-center">
//                       <Text className="text-gray-500">No materials found</Text>
//                       <TouchableOpacity onPress={fetchMaterials} className="mt-2 px-4 py-2 bg-blue-100 rounded-lg">
//                         <Text className="text-blue-600">Refresh</Text>
//                       </TouchableOpacity>
//                     </View>
//                   }
//                 />
//               </View>
//             ) : (
//               // === PURCHASE FORM VIEW ===
//               <View className="flex-1 px-5 relative">
//                 <View className="mb-4 flex-row items-center justify-between">
//                   <Text className="text-lg font-bold text-gray-900">Material Purchase</Text>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setAddMaterialPurchaseModalVisible(false);
//                       setShowMaterialListInPurchase(false);
//                       clearPurchaseForm();
//                     }}
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   className="flex-1"
//                   contentContainerStyle={{ paddingBottom: 140 }} // Extra space for button + dropdown
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {/* Date */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
//                     <View className="flex-row items-center justify-between">
//                       <Text className="text-base text-gray-900">{formatDate(purchaseDate)}</Text>
//                       <TouchableOpacity onPress={() => setShowPurchaseDatePicker(true)}>
//                         <Ionicons name="calendar-outline" size={20} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>
//                     <View className="mt-1 h-px bg-gray-300" />
//                     {showPurchaseDatePicker && (
//                       <DateTimePicker
//                         value={purchaseDate}
//                         mode="date"
//                         display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                         onChange={onPurchaseDateChange}
//                       />
//                     )}
//                   </View>

//                   {/* Party Name */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
//                     <View className="flex-row items-center border-b border-gray-300 pb-1">
//                       <TextInput
//                         className="flex-1 text-base text-gray-900"
//                         placeholder="Select or enter party name"
//                         placeholderTextColor="#9CA3AF"
//                         value={purchaseForm.partyName}
//                         onChangeText={(text) => setPurchaseForm({ ...purchaseForm, partyName: text })}
//                         onFocus={() => {
//                           setShowPartyDropdown(true);
//                           setPartySearch(purchaseForm.partyName || '');
//                         }}
//                       />
//                       <TouchableOpacity onPress={() => setShowPartyDropdown(!showPartyDropdown)}>
//                         <Ionicons name={showPartyDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
//                       </TouchableOpacity>
//                     </View>
//                     {purchaseForm.partyName && !showPartyDropdown && vendors.find(v => v.name === purchaseForm.partyName) && (
//                       <Text className="mt-1 text-xs text-gray-600">
//                         Selected: {purchaseForm.partyName}
//                         {vendors.find(v => v.name === purchaseForm.partyName)?.vendorcode && ` • Code: ${vendors.find(v => v.name === purchaseForm.partyName)?.vendorcode}`}
//                       </Text>
//                     )}
//                   </View>

//                   {/* Material Selection */}
//                   {selectedPurchaseMaterial ? (
//                     <View className="mb-4">
//                       <View className="flex-row items-center justify-between mb-2">
//                         <Text className="text-sm font-medium text-gray-700">Material</Text>
//                         <TouchableOpacity onPress={() => setShowMaterialListInPurchase(true)} className="p-1">
//                           <Text className="text-blue-600 text-sm">Change</Text>
//                         </TouchableOpacity>
//                       </View>
//                       <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <Text className="text-base font-medium text-gray-900">{selectedPurchaseMaterial.name}</Text>
//                         <View className="flex-row mt-1">
//                           <Text className="text-xs text-gray-500 mr-3">Category: {selectedPurchaseMaterial.category}</Text>
//                           <Text className="text-xs text-gray-500">Unit: {selectedPurchaseMaterial.unit}</Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">ID: {selectedPurchaseMaterial.id}</Text>
//                       </View>
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                       onPress={() => setShowMaterialListInPurchase(true)}
//                     >
//                       <Ionicons name="add" size={20} color="#0066FF" />
//                       <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Quantity */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Quantity ({selectedPurchaseMaterial?.unit || 'units'})</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter quantity"
//                       placeholderTextColor="#9CA3AF"
//                       value={purchaseForm.quantity}
//                       onChangeText={(text) => setPurchaseForm({ ...purchaseForm, quantity: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Rate per Unit */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Rate per Unit (₹)</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter rate per unit"
//                       placeholderTextColor="#9CA3AF"
//                       value={purchaseForm.rate}
//                       onChangeText={(text) => setPurchaseForm({ ...purchaseForm, rate: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Total Amount (Auto-calculated) */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Total Amount (₹)</Text>
//                     <Text className="text-base font-semibold text-gray-900">
//                       {purchaseForm.totalAmount ? `₹ ${purchaseForm.totalAmount}` : '—'}
//                     </Text>
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Advance */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Advance (₹)</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter advance amount"
//                       placeholderTextColor="#9CA3AF"
//                       value={purchaseForm.advance}
//                       onChangeText={(text) => setPurchaseForm({ ...purchaseForm, advance: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Balance (Auto-calculated) */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Balance (₹)</Text>
//                     <Text className="text-base font-semibold text-gray-900">
//                       {purchaseForm.balance ? `₹ ${purchaseForm.balance}` : '—'}
//                     </Text>
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>


//                 </ScrollView>

//                 {/* Save Button */}
//                 <TouchableOpacity
//                   className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5 mb-4"
//                   onPress={handleSavePurchase}
//                 >
//                   <Text className="text-base font-semibold text-white">Save Purchase</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </TouchableOpacity>

//                 {/* Party Dropdown (absolute positioned) */}
//                 {showPartyDropdown && (
//                   <View
//                     className="absolute bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden z-50"
//                     style={{
//                       top: 140,
//                       left: 20,
//                       right: 20,
//                       maxHeight: 300,
//                       elevation: 10,
//                       shadowColor: '#000',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.3,
//                       shadowRadius: 8,
//                     }}
//                   >
//                     <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" className="max-h-[300px]">
//                       {filteredParties.length > 0 ? (
//                         filteredParties.map((vendor) => (
//                           <TouchableOpacity
//                             key={vendor.id}
//                             className="px-4 py-3 border-b border-gray-100 active:bg-blue-50"
//                             onPress={() => selectParty(vendor, 'purchase')}
//                           >
//                             <Text className="text-base font-medium text-gray-900">{vendor.name}</Text>
//                             <View className="flex-row justify-between mt-1">
//                               {vendor.vendorcode && <Text className="text-xs text-gray-500">Code: {vendor.vendorcode}</Text>}
//                               {vendor.vendorType && <Text className="text-xs text-gray-500">{vendor.vendorType}</Text>}
//                             </View>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <View className="px-4 py-3">
//                           <Text className="text-gray-500 text-center">
//                             {partySearch ? 'No vendors found' : 'Type to search vendors'}
//                           </Text>
//                         </View>
//                       )}

//                       {partySearch && !vendors.some(v => v.name.toLowerCase() === partySearch.toLowerCase()) && (
//                         <TouchableOpacity
//                           className="px-4 py-3 border-t border-gray-200 bg-blue-50"
//                           onPress={() => {
//                             setPurchaseForm({ ...purchaseForm, partyName: partySearch });
//                             setShowPartyDropdown(false);
//                             setPartySearch('');
//                           }}
//                         >
//                           <Text className="text-blue-600 font-medium">+ Add "{partySearch}" as new vendor</Text>
//                         </TouchableOpacity>
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//       <Modal
//         visible={receivedModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setReceivedModalVisible(false);
//           setShowMaterialListInReceived(false);
//           clearReceivedForm();
//         }}
//       >
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => {
//             setReceivedModalVisible(false);
//             setShowMaterialListInReceived(false);
//             clearReceivedForm();
//           }}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="rounded-t-3xl bg-white"
//             style={{
//               height: showMaterialListInReceived ? '85%' : '75%',
//               maxHeight: '90%',
//             }}
//             onPress={() => { }}
//           >
//             {/* Drag handle */}
//             <View className="items-center pt-3 pb-1">
//               <View className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </View>

//             {showMaterialListInReceived ? (
//               // Material selection list
//               <View className="flex-1 px-5">
//                 <View className="flex-row items-center justify-between mb-4">
//                   <TouchableOpacity onPress={() => setShowMaterialListInReceived(false)} className="p-2">
//                     <Ionicons name="arrow-back" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text className="text-lg font-bold text-gray-900">Select Material</Text>
//                   <TouchableOpacity
//           onPress={() => {
//             setReceivedModalVisible(false);
//             setShowMaterialListInReceived(false);
//             setCreateNewMaterialModalVisible(true);
//           }}
//           className="mr-3 p-2"
//         >
//           <Text className="text-blue-600 font-medium">New +</Text>
//         </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setReceivedModalVisible(false);
//                       setShowMaterialListInReceived(false);
//                       clearReceivedForm();
//                     }}
//                     className="p-2"
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
//                   <Ionicons name="search" size={20} color="#9CA3AF" />
//                   <TextInput
//                     className="ml-2 flex-1 text-base text-gray-900"
//                     placeholder="Search materials..."
//                     placeholderTextColor="#9CA3AF"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                   />
//                 </View>

//                 <FlatList
//                   data={filteredLibrary}
//                   renderItem={renderLibraryItem}
//                   keyExtractor={(item) => item.id}
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                   ListEmptyComponent={
//                     <View className="py-8 items-center">
//                       <Text className="text-gray-500">No materials found</Text>
//                       <TouchableOpacity onPress={fetchMaterials} className="mt-2 px-4 py-2 bg-blue-100 rounded-lg">
//                         <Text className="text-blue-600">Refresh</Text>
//                       </TouchableOpacity>
//                     </View>
//                   }
//                 />
//               </View>
//             ) : (
//               // === RECEIVED FORM VIEW ===
//               <View className="flex-1 px-5 relative">
//                 <View className="mb-4 flex-row items-center justify-between">
//                   <Text className="text-lg font-bold text-gray-900">Material Received</Text>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setReceivedModalVisible(false);
//                       setShowMaterialListInReceived(false);
//                       clearReceivedForm();
//                     }}
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   className="flex-1"
//                   contentContainerStyle={{ paddingBottom: 140 }}
//                   keyboardShouldPersistTaps="handled"
//                 >
//                   {/* Date */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
//                     <View className="flex-row items-center justify-between">
//                       <Text className="text-base text-gray-900">{formatDate(date)}</Text>
//                       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                         <Ionicons name="calendar-outline" size={20} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>
//                     <View className="mt-1 h-px bg-gray-300" />
//                     {showDatePicker && (
//                       <DateTimePicker
//                         value={date}
//                         mode="date"
//                         display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                         onChange={onDateChange}
//                       />
//                     )}
//                   </View>

//                   {/* Party Name Dropdown */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
//                     <View className="flex-row items-center border-b border-gray-300 pb-1">
//                       <TextInput
//                         className="flex-1 text-base text-gray-900"
//                         placeholder="Select or enter party name"
//                         placeholderTextColor="#9CA3AF"
//                         value={receivedForm.partyName}
//                         onChangeText={(text) => setReceivedForm({ ...receivedForm, partyName: text })}
//                         onFocus={() => {
//                           setShowPartyDropdown(true);
//                           setPartySearch(receivedForm.partyName || '');
//                         }}
//                       />
//                       <TouchableOpacity onPress={() => setShowPartyDropdown(!showPartyDropdown)}>
//                         <Ionicons name={showPartyDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
//                       </TouchableOpacity>
//                     </View>
//                     {receivedForm.partyName && !showPartyDropdown && vendors.find(v => v.name === receivedForm.partyName) && (
//                       <Text className="mt-1 text-xs text-gray-600">
//                         Selected: {receivedForm.partyName}
//                         {vendors.find(v => v.name === receivedForm.partyName)?.vendorcode &&
//                           ` • Code: ${vendors.find(v => v.name === receivedForm.partyName)?.vendorcode}`}
//                       </Text>
//                     )}
//                   </View>

//                   {/* Material Selection */}
//                   {selectedReceivedMaterial ? (
//                     <View className="mb-4">
//                       <View className="flex-row items-center justify-between mb-2">
//                         <Text className="text-sm font-medium text-gray-700">Material</Text>
//                         <TouchableOpacity onPress={() => setShowMaterialListInReceived(true)} className="p-1">
//                           <Text className="text-blue-600 text-sm">Change</Text>
//                         </TouchableOpacity>
//                       </View>
//                       <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <Text className="text-base font-medium text-gray-900">{selectedReceivedMaterial.name}</Text>
//                         <View className="flex-row mt-1">
//                           <Text className="text-xs text-gray-500 mr-3">Category: {selectedReceivedMaterial.category}</Text>
//                           <Text className="text-xs text-gray-500">Unit: {selectedReceivedMaterial.unit}</Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">ID: {selectedReceivedMaterial.id}</Text>
//                       </View>
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                       onPress={() => setShowMaterialListInReceived(true)}
//                     >
//                       <Ionicons name="add" size={20} color="#0066FF" />
//                       <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Quantity */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter quantity"
//                       placeholderTextColor="#9CA3AF"
//                       value={receivedForm.quantity}
//                       onChangeText={(text) => setReceivedForm({ ...receivedForm, quantity: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Challan No. */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Challan No.</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       value={receivedForm.challanNo}
//                       onChangeText={(text) => setReceivedForm({ ...receivedForm, challanNo: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Vehicle No. */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       value={receivedForm.vehicleNo}
//                       onChangeText={(text) => setReceivedForm({ ...receivedForm, vehicleNo: text })}
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Notes */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
//                     <TextInput
//                       className="h-20 text-sm text-gray-900"
//                       placeholder="Enter notes..."
//                       placeholderTextColor="#9CA3AF"
//                       value={receivedForm.notes}
//                       onChangeText={(text) => setReceivedForm({ ...receivedForm, notes: text })}
//                       multiline
//                       numberOfLines={4}
//                       textAlignVertical="top"
//                     />
//                   </View>
//                 </ScrollView>

//                 {/* Save Button */}
//                 <TouchableOpacity
//                   className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5 mb-4"
//                   onPress={handleSaveReceived}
//                 >
//                   <Text className="text-base font-semibold text-white">Save Received</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </TouchableOpacity>

//                 {/* Party Dropdown */}
//                 {showPartyDropdown && (
//                   <View
//                     className="absolute bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden z-50"
//                     style={{
//                       top: 140,
//                       left: 20,
//                       right: 20,
//                       maxHeight: 300,
//                       elevation: 10,
//                       shadowColor: '#000',
//                       shadowOffset: { width: 0, height: 4 },
//                       shadowOpacity: 0.3,
//                       shadowRadius: 8,
//                     }}
//                   >
//                     <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" className="max-h-[300px]">
//                       {filteredParties.length > 0 ? (
//                         filteredParties.map((vendor) => (
//                           <TouchableOpacity
//                             key={vendor.id}
//                             className="px-4 py-3 border-b border-gray-100 active:bg-blue-50"
//                             onPress={() => selectParty(vendor, 'received')}
//                           >
//                             <Text className="text-base font-medium text-gray-900">{vendor.name}</Text>
//                             <View className="flex-row justify-between mt-1">
//                               {vendor.vendorcode && <Text className="text-xs text-gray-500">Code: {vendor.vendorcode}</Text>}
//                               {vendor.vendorType && <Text className="text-xs text-gray-500">{vendor.vendorType}</Text>}
//                             </View>
//                           </TouchableOpacity>
//                         ))
//                       ) : (
//                         <View className="px-4 py-3">
//                           <Text className="text-gray-500 text-center">
//                             {partySearch ? 'No vendors found' : 'Type to search vendors'}
//                           </Text>
//                         </View>
//                       )}

//                       {partySearch && !vendors.some(v => v.name.toLowerCase() === partySearch.toLowerCase()) && (
//                         <TouchableOpacity
//                           className="px-4 py-3 border-t border-gray-200 bg-blue-50"
//                           onPress={() => {
//                             setReceivedForm({ ...receivedForm, partyName: partySearch });
//                             setShowPartyDropdown(false);
//                             setPartySearch('');
//                           }}
//                         >
//                           <Text className="text-blue-600 font-medium">+ Add "{partySearch}" as new vendor</Text>
//                         </TouchableOpacity>
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === USED MODAL === */}
//       <Modal
//         visible={usedModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setUsedModalVisible(false)}
//       >
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setUsedModalVisible(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="rounded-t-3xl bg-white"
//             style={{
//               height: showMaterialListInUsed ? '85%' : '75%',
//               maxHeight: '90%',
//             }}
//             onPress={() => { }}
//           >
//             {/* Drag handle */}
//             <View className="items-center pt-3 pb-1">
//               <View className="h-1.5 w-12 rounded-full bg-gray-300" />
//             </View>

//             {showMaterialListInUsed ? (
//               // Material List View
//               <View className="flex-1 px-5">
//                 <View className="flex-row items-center justify-between mb-4">
//                   <TouchableOpacity
//                     onPress={() => setShowMaterialListInUsed(false)}
//                     className="p-2"
//                   >
//                     <Ionicons name="arrow-back" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text className="text-lg font-bold text-gray-900">Select Material</Text>
//                    <TouchableOpacity
//           onPress={() => {
//             setUsedModalVisible(false);
//             setShowMaterialListInUsed(false);
//             setCreateNewMaterialModalVisible(true);
//           }}
//           className="mr-3 p-2"
//         >
//           <Text className="text-blue-600 font-medium">New +</Text>
//         </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setUsedModalVisible(false);
//                       setShowMaterialListInUsed(false);
//                       clearUsedForm();
//                     }}
//                     className="p-2"
//                   >
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Search */}
//                 <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
//                   <Ionicons name="search" size={20} color="#9CA3AF" />
//                   <TextInput
//                     className="ml-2 flex-1 text-base text-gray-900"
//                     placeholder="Search materials..."
//                     placeholderTextColor="#9CA3AF"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                   />
//                 </View>

//                 <FlatList
//                   data={filteredLibrary}
//                   renderItem={renderLibraryItem}
//                   keyExtractor={(item) => item.id}
//                   showsVerticalScrollIndicator={false}
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                   ListEmptyComponent={
//                     <View className="py-8 items-center">
//                       <Text className="text-gray-500">No materials found</Text>
//                       <TouchableOpacity
//                         onPress={fetchMaterials}
//                         className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
//                       >
//                         <Text className="text-blue-600">Refresh</Text>
//                       </TouchableOpacity>
//                     </View>
//                   }
//                 />
//               </View>
//             ) : (
//               // Used Form View
//               <View className="flex-1 px-5">
//                 <View className="mb-4 flex-row items-center justify-between">
//                   <Text className="text-lg font-bold text-gray-900">Material Used</Text>
//                   <TouchableOpacity onPress={() => setUsedModalVisible(false)}>
//                     <Ionicons name="close" size={24} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   className="flex-1"
//                   contentContainerStyle={{ paddingBottom: 20 }}
//                 >
//                   {/* Date */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
//                     <View className="flex-row items-center justify-between">
//                       <Text className="text-base text-gray-900">{usedForm.date}</Text>
//                       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                         <Ionicons name="calendar-outline" size={20} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Material Selection */}
//                   {selectedUsedMaterial ? (
//                     <View className="mb-4">
//                       <View className="flex-row items-center justify-between mb-2">
//                         <Text className="text-sm font-medium text-gray-700">Material</Text>
//                         <TouchableOpacity
//                           onPress={() => setShowMaterialListInUsed(true)}
//                           className="p-1"
//                         >
//                           <Text className="text-blue-600 text-sm">Change</Text>
//                         </TouchableOpacity>
//                       </View>
//                       <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <Text className="text-base font-medium text-gray-900">
//                           {selectedUsedMaterial.name}
//                         </Text>
//                         <View className="flex-row mt-1">
//                           <Text className="text-xs text-gray-500 mr-3">
//                             Category: {selectedUsedMaterial.category}
//                           </Text>
//                           <Text className="text-xs text-gray-500">
//                             Unit: {selectedUsedMaterial.unit}
//                           </Text>
//                         </View>
//                         <Text className="text-xs text-gray-500 mt-1">
//                           ID: {selectedUsedMaterial.id}
//                         </Text>
//                       </View>
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                       onPress={() => setShowMaterialListInUsed(true)}
//                     >
//                       <Ionicons name="add" size={20} color="#0066FF" />
//                       <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Quantity */}
//                   <View className="mb-4">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">
//                       Quantity ({selectedUsedMaterial?.unit || 'units'})
//                     </Text>
//                     <TextInput
//                       className="text-base text-gray-900"
//                       placeholder="Enter quantity"
//                       placeholderTextColor="#9CA3AF"
//                       value={usedForm.quantity}
//                       onChangeText={(text) => setUsedForm({ ...usedForm, quantity: text })}
//                       keyboardType="numeric"
//                     />
//                     <View className="mt-1 h-px bg-gray-300" />
//                   </View>

//                   {/* Notes */}
//                   <View className="mb-6">
//                     <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
//                     <TextInput
//                       className="h-24 text-sm text-gray-900"
//                       placeholder="Enter notes..."
//                       placeholderTextColor="#9CA3AF"
//                       value={usedForm.notes}
//                       onChangeText={(text) => setUsedForm({ ...usedForm, notes: text })}
//                       multiline
//                       numberOfLines={4}
//                       textAlignVertical="top"
//                     />
//                   </View>
//                 </ScrollView>

//                 {/* Save Button */}
//                 <TouchableOpacity
//                   className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5 mb-4"
//                   onPress={handleSaveUsed}
//                 >
//                   <Text className="text-base font-semibold text-white">Save Used</Text>
//                   <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//     </View>
//   );
// };

// export default MaterialsListScreen;


import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

// API Configuration
const BASE_URL = `${process.env.BASE_API_URL}`;
const MATERIALS_API = `${BASE_URL}/api/materials`;
const TOKEN_KEY = 'userToken';

// Constant arrays
const subTabs = [
  { id: 'Inventory', label: 'Inventory' },
  { id: 'Request', label: 'Request' },
  { id: 'Received', label: 'Received' },
  { id: 'Used', label: 'Used' },
];

const categories = [
  'Cement',
  'Steel',
  'Bricks',
  'Sand',
  'Aggregate',
  'Wood',
  'Electrical',
  'Plumbing',
  'Paint',
  'Tools',
  'Other'
];

const units = [
  'nos',
  'kg',
  'ton',
  'm',
  'sqm',
  'cum',
  'ltr',
  'set',
  'box',
  'packet'
];

const gstRates = ['0', '5.0', '12.0', '18.0', '28.0'];

const MaterialsListScreen = ({ project }) => {
  const navigation = useNavigation();
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals
  const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
  const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
  const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
  const [usedModalVisible, setUsedModalVisible] = useState(false);
  const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);

  // Selection Modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [showEditGstModal, setShowEditGstModal] = useState(false);

  // Dates
  const [date, setDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showMaterialListInReceived, setShowMaterialListInReceived] = useState(false);
  const [showMaterialListInRequest, setShowMaterialListInRequest] = useState(false);
  const [showMaterialListInPurchase, setShowMaterialListInPurchase] = useState(false);
  const [showMaterialListInUsed, setShowMaterialListInUsed] = useState(false);

  // Selected materials
  const [selectedReceivedMaterial, setSelectedReceivedMaterial] = useState(null);
  const [selectedRequestMaterial, setSelectedRequestMaterial] = useState(null);
  const [selectedPurchaseMaterial, setSelectedPurchaseMaterial] = useState(null);
  const [selectedUsedMaterial, setSelectedUsedMaterial] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Forms
  const [receivedForm, setReceivedForm] = useState({
    partyName: '',
    materialName: '',
    quantity: '',
    challanNo: '',
    vehicleNo: '',
    notes: ''
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    materialName: '',
    unit: 'nos',
    gst: '18.0',
    hsnCode: '',
    category: '',
    quantity: '',
    stock: '',
    price: '',
    minStock: '',
    description: ''
  });

  const [editMaterialForm, setEditMaterialForm] = useState({
    id: '',
    materialName: '',
    unit: 'nos',
    gst: '18.0',
    hsnCode: '',
    category: '',
    quantity: '',
    stock: '',
    price: '',
    minStock: '',
    description: ''
  });

  const [requestForm, setRequestForm] = useState({
    mrNumber: `MR-${Math.floor(Math.random() * 100) + 1}`,
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-'),
    materialName: '',
    quantity: '',
    itemDescription: '',
    notes: ''
  });

  const [purchaseForm, setPurchaseForm] = useState({
    partyName: '',
    quantity: '',
    rate: '',
    totalAmount: '',
    advance: '',
    balance: '',
    billTo: '',
  });

  const [usedForm, setUsedForm] = useState({
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-'),
    quantity: '',
    notes: ''
  });

  // API State
  const [inventoryApi, setInventoryApi] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [usedData, setUsedData] = useState([]);
  const [materialLibraryData, setMaterialLibraryData] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Loading states
  const [apiLoadingStates, setApiLoadingStates] = useState({
    inventory: false,
    requests: false,
    received: false,
    used: false,
    vendors: false,
    creating: false,
    updating: false,
    saving: false
  });

  // Party dropdown
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);
  const [partySearch, setPartySearch] = useState('');

  // Ref for abort controllers and mounted state
  const abortControllers = useRef(new Map());
  const isMounted = useRef(true);
  const dataFetchedRef = useRef(false);

  // === Debounced Search ===
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // === Auto-calculations ===
  useEffect(() => {
    const qty = parseFloat(purchaseForm.quantity) || 0;
    const rate = parseFloat(purchaseForm.rate) || 0;
    const advance = parseFloat(purchaseForm.advance) || 0;

    const total = qty * rate;
    const balance = total - advance;

    setPurchaseForm(prev => ({
      ...prev,
      totalAmount: isNaN(total) ? '' : total.toFixed(2),
      balance: isNaN(balance) ? '' : balance.toFixed(2),
    }));
  }, [purchaseForm.quantity, purchaseForm.rate, purchaseForm.advance]);

  // === Cleanup on unmount ===
  useEffect(() => {
    return () => {
      isMounted.current = false;
      // Cancel all pending requests
      abortControllers.current.forEach((controller) => {
        controller.abort();
      });
      abortControllers.current.clear();
    };
  }, []);

  // === Generic API Call Function ===
  const makeApiCall = useCallback(async (endpoint, method = 'GET', body = null, requestKey) => {
    if (!isMounted.current) return null;

    // Cancel previous request with same key
    if (abortControllers.current.has(requestKey)) {
      abortControllers.current.get(requestKey).abort();
      abortControllers.current.delete(requestKey);
    }

    const controller = new AbortController();
    abortControllers.current.set(requestKey, controller);

    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const options = {
        method,
        headers,
        signal: controller.signal,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(endpoint, options);

      // Remove controller from map
      abortControllers.current.delete(requestKey);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Request ${requestKey} was cancelled`);
        return null;
      }
      console.error(`API call failed (${requestKey}):`, error);
      throw error;
    }
  }, []);

  // === Fetch Materials (Inventory) ===
  const fetchMaterials = useCallback(async (forceRefresh = false) => {
    if ((apiLoadingStates.inventory && !forceRefresh) || !project?._id) return;

    try {
      setApiLoadingStates(prev => ({ ...prev, inventory: true }));

      const data = await makeApiCall(
        `${MATERIALS_API}/project/${project._id}`,
        'GET',
        null,
        'fetchMaterials'
      );

      if (!isMounted.current) return;

      const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setInventoryApi(list);

      // Update material library
      const libraryList = list.map((item, index) => ({
        id: item._id || item.id || `lib-${index}`,
        name: item.materialName || item.name || 'Unknown Material',
        category: item.category || 'Other',
        unit: item.unit || 'nos',
        __raw: item,
      }));
      setMaterialLibraryData(libraryList);

    } catch (err) {
      if (isMounted.current) {
        Alert.alert('Error', 'Failed to fetch materials');
      }
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, inventory: false }));
      }
    }
  }, [project?._id, apiLoadingStates.inventory, makeApiCall]);

  // === Fetch Material Requests ===
  const fetchMaterialRequests = useCallback(async () => {
    if (apiLoadingStates.requests || !project?._id) return;

    try {
      setApiLoadingStates(prev => ({ ...prev, requests: true }));

      const data = await makeApiCall(
        `${MATERIALS_API}/materialRequest/${project._id}`,
        'GET',
        null,
        'fetchMaterialRequests'
      );

      if (!isMounted.current) return;

      const list = Array.isArray(data) ? data : Array.isArray(data?.data?.materialrequest) ? data.data.materialrequest : [];
      const libraryList = list.map((item, index) => ({
        id: item._id || item.id || `lib-${index}`,
        name: item.materialId?.materialName || item.name || 'Unknown Material',
        qty: item.quantity || 0,
        date: item.date || '',
        status: item.status || 'Requested',
        unit: item.materialId?.unit || 'nos',
      }));

      setRequestData(libraryList);

    } catch (err) {
      console.error('[fetchMaterialRequests] Error:', err);
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, requests: false }));
      }
    }
  }, [project?._id, apiLoadingStates.requests, makeApiCall]);

  // === Fetch Material Received ===
  const fetchMaterialReceived = useCallback(async () => {
    if (apiLoadingStates.received || !project?._id) return;

    try {
      setApiLoadingStates(prev => ({ ...prev, received: true }));

      const data = await makeApiCall(
        `${MATERIALS_API}/materialReceived/${project._id}`,
        'GET',
        null,
        'fetchMaterialReceived'
      );

      if (!isMounted.current) return;

      const list = Array.isArray(data) ? data : Array.isArray(data?.data?.materialreceived) ? data.data.materialreceived : [];
      const libraryList = list.map((item, index) => ({
        id: item._id || item.id || `lib-${index}`,
        name: item.materialId?.materialName || item.name || 'Unknown Material',
        qty: item.quantity || 0,
        date: item.date || '',
        status: item.status || 'Received',
        party: item.vendorId?.name || 'Unknown Party',
        unit: item.materialId?.unit || 'nos',
      }));

      setReceivedData(libraryList);

    } catch (err) {
      console.error('[fetchMaterialReceived] Error:', err);
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, received: false }));
      }
    }
  }, [project?._id, apiLoadingStates.received, makeApiCall]);

  // === Fetch Material Used ===
  const fetchMaterialUsed = useCallback(async () => {
    if (apiLoadingStates.used || !project?._id) return;

    try {
      setApiLoadingStates(prev => ({ ...prev, used: true }));

      const data = await makeApiCall(
        `${MATERIALS_API}/materialUsed/${project._id}`,
        'GET',
        null,
        'fetchMaterialUsed'
      );

      if (!isMounted.current) return;

      const list = Array.isArray(data) ? data : Array.isArray(data?.data?.materialused) ? data.data.materialused : [];
      const libraryList = list.map((item, index) => ({
        id: item._id || item.id || `lib-${index}`,
        name: item.materialId?.materialName || item.name || 'Unknown Material',
        qty: item.quantity || 0,
        date: item.date || '',
        status: item.status || 'Used',
        unit: item.materialId?.unit || 'nos',
      }));

      setUsedData(libraryList);

    } catch (err) {
      console.error('[fetchMaterialUsed] Error:', err);
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, used: false }));
      }
    }
  }, [project?._id, apiLoadingStates.used, makeApiCall]);

  // === Load Vendors ===
  const loadVendors = useCallback(async () => {
    if (apiLoadingStates.vendors || vendors.length > 0) return;

    try {
      setApiLoadingStates(prev => ({ ...prev, vendors: true }));

      const data = await makeApiCall(
        `${BASE_URL}/api/vendor`,
        'GET',
        null,
        'loadVendors'
      );

      if (!isMounted.current) return;

      const vendorsRes = data?.data || data || [];
      const mappedVendors = vendorsRes.map(vendor => ({
        id: vendor._id || vendor.id,
        name: vendor.name || 'Unknown Vendor',
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
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, vendors: false }));
      }
    }
  }, [vendors.length, apiLoadingStates.vendors, makeApiCall]);

  // === Combined Data Fetching ===
  const fetchAllMaterialData = useCallback(async () => {
    if (!project?._id || dataFetchedRef.current) return;

    try {
      dataFetchedRef.current = true;
      
      // Load vendors first
      await loadVendors();
      
      // Fetch materials data sequentially
      await fetchMaterials();
      await fetchMaterialRequests();
      await fetchMaterialReceived();
      await fetchMaterialUsed();
      
    } catch (error) {
      console.error('Error fetching all material data:', error);
      dataFetchedRef.current = false;
    }
  }, [project?._id, loadVendors, fetchMaterials, fetchMaterialRequests, fetchMaterialReceived, fetchMaterialUsed]);

  // === Initial Data Fetch ===
  useEffect(() => {
    if (!project?._id) return;

    // Small delay to prevent immediate load on screen mount
    const timer = setTimeout(() => {
      fetchAllMaterialData();
    }, 200);

    return () => clearTimeout(timer);
  }, [project?._id, fetchAllMaterialData]);

  // === Refresh Control Handler ===
  const handleRefresh = useCallback(() => {
    dataFetchedRef.current = false;
    fetchAllMaterialData();
  }, [fetchAllMaterialData]);

  // === Date Handlers ===
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (requestMaterialModalVisible) {
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-');

      setRequestForm(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
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

  // === Material Creation ===
  const createNewMaterial = useCallback(async () => {
    try {
      if (!newMaterialForm.materialName.trim()) {
        Alert.alert("Error", "Please enter material name");
        return;
      }

      if (!newMaterialForm.category.trim()) {
        Alert.alert("Error", "Please select a category");
        return;
      }

      setApiLoadingStates(prev => ({ ...prev, creating: true }));

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!project?._id) {
        Alert.alert("Error", "Project ID is missing");
        return;
      }

      const materialData = {
        materialName: newMaterialForm.materialName.trim(),
        unit: newMaterialForm.unit,
        gst: parseFloat(newMaterialForm.gst) || 0,
        hsnCode: newMaterialForm.hsnCode.trim(),
        category: newMaterialForm.category,
        description: newMaterialForm.description.trim(),
        quantity: 0,
        projectId: project._id,
      };

      const result = await makeApiCall(
        `${BASE_URL}/api/materials`,
        'POST',
        materialData,
        'createMaterial'
      );

      if (!isMounted.current) return;

      Alert.alert("Success", "Material created successfully!");

      setCreateNewMaterialModalVisible(false);

      setNewMaterialForm({
        materialName: "",
        unit: "nos",
        gst: "18.0",
        hsnCode: "",
        category: "",
        description: "",
      });

      // Refresh materials list
      dataFetchedRef.current = false;
      fetchMaterials(true);

    } catch (err) {
      console.error("[Create Material] ❌ Error:", err);
      Alert.alert("Error", err.message || "Failed to create material");
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, creating: false }));
      }
    }
  }, [newMaterialForm, project?._id, makeApiCall, fetchMaterials]);

  // === Delete Material ===
  const deleteMaterial = useCallback(async (id) => {
    try {
      if (!id) return Alert.alert('Error', 'Invalid material ID');
      
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this material?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await makeApiCall(
                `${BASE_URL}/api/materials/${id}`,
                'DELETE',
                null,
                `deleteMaterial-${id}`
              );

              Alert.alert('Deleted', 'Material deleted successfully.');
              dataFetchedRef.current = false;
              fetchMaterials(true);
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to delete material');
    }
  }, [makeApiCall, fetchMaterials]);

  // === Edit Material ===
  const openEditModal = useCallback((material) => {
    const rawMaterial = material.__raw || material;
    setEditMaterialForm({
      id: rawMaterial._id || rawMaterial.id,
      materialName: rawMaterial.name || '',
      unit: rawMaterial.unit || 'nos',
      gst: String(rawMaterial.gst || '18.0'),
      hsnCode: rawMaterial.hsnCode || '',
      category: rawMaterial.category || '',
      quantity: String(rawMaterial.quantity || ''),
      stock: String(rawMaterial.stock || ''),
      price: String(rawMaterial.price || ''),
      minStock: String(rawMaterial.minStock || ''),
      description: rawMaterial.description || ''
    });
    setEditMaterialModalVisible(true);
  }, []);

  const handleEditMaterial = useCallback(async () => {
    try {
      if (!editMaterialForm.materialName.trim()) {
        Alert.alert('Error', 'Please enter material name');
        return;
      }

      if (!editMaterialForm.category.trim()) {
        Alert.alert('Error', 'Please select a category');
        return;
      }

      setApiLoadingStates(prev => ({ ...prev, updating: true }));

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const materialData = {
        name: editMaterialForm.materialName.trim(),
        unit: editMaterialForm.unit,
        gst: parseFloat(editMaterialForm.gst) || 0,
        hsnCode: editMaterialForm.hsnCode.trim(),
        category: editMaterialForm.category,
        description: editMaterialForm.description.trim(),
        quantity: parseFloat(editMaterialForm.quantity) || 0,
        stock: parseFloat(editMaterialForm.stock) || 0,
        price: parseFloat(editMaterialForm.price) || 0,
        minStock: parseFloat(editMaterialForm.minStock) || 0,
        projectId: project._id,
      };

      await makeApiCall(
        `${BASE_URL}/api/materials/${editMaterialForm.id}`,
        'PUT',
        materialData,
        `editMaterial-${editMaterialForm.id}`
      );

      Alert.alert("Success", "Material updated successfully!");
      setEditMaterialModalVisible(false);
      dataFetchedRef.current = false;
      fetchMaterials(true);
      
    } catch (err) {
      console.error("[Edit Material] ❌ Error:", err);
      Alert.alert("Error", err.message || "Failed to update material");
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, updating: false }));
      }
    }
  }, [editMaterialForm, project?._id, makeApiCall, fetchMaterials]);

  // === Selection Handlers ===
  const selectEditCategory = useCallback((category) => {
    setEditMaterialForm(prev => ({ ...prev, category }));
    setShowEditCategoryModal(false);
  }, []);

  const selectEditUnit = useCallback((unit) => {
    setEditMaterialForm(prev => ({ ...prev, unit }));
    setShowEditUnitModal(false);
  }, []);

  const selectEditGst = useCallback((gst) => {
    setEditMaterialForm(prev => ({ ...prev, gst }));
    setShowEditGstModal(false);
  }, []);

  const selectCategory = useCallback((category) => {
    setNewMaterialForm(prev => ({ ...prev, category }));
    setShowCategoryModal(false);
  }, []);

  const selectUnit = useCallback((unit) => {
    setNewMaterialForm(prev => ({ ...prev, unit }));
    setShowUnitModal(false);
  }, []);

  const selectGst = useCallback((gst) => {
    setNewMaterialForm(prev => ({ ...prev, gst }));
    setShowGstModal(false);
  }, []);

  // === Material Selection ===
  const toggleMaterial = useCallback((id) => {
    setSelectedMaterials([id]); // Single selection only

    const material = materialLibraryData.find(item => item.id === id);
    if (!material) return;

    if (showMaterialListInRequest) {
      setSelectedRequestMaterial(material);
      setRequestForm(prev => ({ ...prev, materialName: material.name }));
      setShowMaterialListInRequest(false);
    } else if (showMaterialListInPurchase) {
      setSelectedPurchaseMaterial(material);
      setShowMaterialListInPurchase(false);
    } else if (showMaterialListInReceived) {
      setSelectedReceivedMaterial(material);
      setReceivedForm(prev => ({ ...prev, materialName: material.name }));
      setShowMaterialListInReceived(false);
    } else if (showMaterialListInUsed) {
      setSelectedUsedMaterial(material);
      setShowMaterialListInUsed(false);
    }
  }, [materialLibraryData, showMaterialListInRequest, showMaterialListInPurchase, showMaterialListInReceived, showMaterialListInUsed]);

  // === Form Clearing Functions ===
  const clearReceivedForm = useCallback(() => {
    setReceivedForm({
      partyName: '',
      materialName: '',
      quantity: '',
      challanNo: '',
      vehicleNo: '',
      notes: ''
    });
    setSelectedReceivedMaterial(null);
    setShowMaterialListInReceived(false);
  }, []);

  const clearUsedForm = useCallback(() => {
    setUsedForm({
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-'),
      quantity: '',
      notes: ''
    });
    setSelectedUsedMaterial(null);
    setShowMaterialListInUsed(false);
    setSelectedMaterials([]);
  }, []);

  const clearPurchaseForm = useCallback(() => {
    setPurchaseForm({
      partyName: '',
      quantity: '',
      rate: '',
      totalAmount: '',
      advance: '',
      balance: '',
      billTo: '',
    });
    setSelectedPurchaseMaterial(null);
    setShowMaterialListInPurchase(false);
  }, []);

  const clearRequestForm = useCallback(() => {
    setRequestForm({
      mrNumber: `MR-${Math.floor(Math.random() * 100) + 1}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).split('/').join('-'),
      materialName: '',
      quantity: '',
      itemDescription: '',
      notes: ''
    });
    setSelectedRequestMaterial(null);
    setSelectedMaterials([]);
    setShowMaterialListInRequest(false);
  }, []);

  // === Modal Cleanup Effects ===
  useEffect(() => {
    if (!receivedModalVisible) {
      clearReceivedForm();
      setShowPartyDropdown(false);
      setPartySearch('');
    }
  }, [receivedModalVisible, clearReceivedForm]);

  useEffect(() => {
    if (!usedModalVisible) {
      clearUsedForm();
    }
  }, [usedModalVisible, clearUsedForm]);

  useEffect(() => {
    if (!addMaterialPurchaseModalVisible) {
      clearPurchaseForm();
      setShowPartyDropdown(false);
      setPartySearch('');
    }
  }, [addMaterialPurchaseModalVisible, clearPurchaseForm]);

  useEffect(() => {
    if (!requestMaterialModalVisible) {
      clearRequestForm();
    }
  }, [requestMaterialModalVisible, clearRequestForm]);

  // === Party Selection ===
  const selectParty = useCallback((vendor, context = 'purchase') => {
    if (context === 'purchase') {
      setPurchaseForm(prev => ({ ...prev, partyName: vendor.name }));
    } else if (context === 'received') {
      setReceivedForm(prev => ({ ...prev, partyName: vendor.name }));
    }

    setShowPartyDropdown(false);
    setPartySearch('');
  }, []);

  const filteredParties = useMemo(() => {
    const searchTerm = partySearch.trim().toLowerCase();
    if (!searchTerm) return vendors.slice(0, 5);

    return vendors.filter(vendor =>
      (vendor.name || '').toLowerCase().includes(searchTerm) ||
      (vendor.vendorcode || '').toLowerCase().includes(searchTerm)
    ).slice(0, 5);
  }, [vendors, partySearch]);

  // === Save Handlers ===
  const handleSaveReceived = useCallback(async () => {
    if (!selectedReceivedMaterial) {
      Alert.alert('Error', 'Please select a material');
      return;
    }

    if (!receivedForm.quantity.trim()) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }

    if (!receivedForm.partyName.trim()) {
      Alert.alert('Error', 'Please enter party name');
      return;
    }

    const selectedMaterialId = selectedMaterials[0];
    const existingVendor = vendors.find(v => v.name === receivedForm.partyName);

    if (!existingVendor) {
      Alert.alert('Error', 'Selected vendor not found');
      return;
    }

    const receivedData = {
      date: date.toISOString(),
      vendorId: existingVendor.id,
      materialId: selectedMaterialId,
      quantity: receivedForm.quantity,
      challanNo: receivedForm.challanNo,
      vehicleNo: receivedForm.vehicleNo,
      notes: receivedForm.notes,
      projectId: project._id,
    };

    try {
      setApiLoadingStates(prev => ({ ...prev, saving: true }));

      await makeApiCall(
        `${BASE_URL}/api/materials/materialReceived`,
        'POST',
        receivedData,
        'saveReceived'
      );

      Alert.alert(
        'Success',
        'Material received logged successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setReceivedModalVisible(false);
              dataFetchedRef.current = false;
              fetchMaterialReceived();
              fetchMaterials(true);
            }
          }
        ]
      );

    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save received material');
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, saving: false }));
      }
    }
  }, [selectedReceivedMaterial, receivedForm, selectedMaterials, vendors, date, project?._id, makeApiCall, fetchMaterialReceived, fetchMaterials]);

  const handleSaveUsed = useCallback(async () => {
    if (!selectedUsedMaterial) {
      Alert.alert('Error', 'Please select a material');
      return;
    }
    
    if (!usedForm.quantity.trim()) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }

    const selectedMaterialId = selectedMaterials[0];

    const usedData = {
      date: usedForm.date,
      materialId: selectedMaterialId,
      quantity: parseFloat(usedForm.quantity),
      notes: usedForm.notes,
      projectId: project._id,
    };

    try {
      setApiLoadingStates(prev => ({ ...prev, saving: true }));

      await makeApiCall(
        `${BASE_URL}/api/materials/materialUsed`,
        'POST',
        usedData,
        'saveUsed'
      );

      Alert.alert('Success', 'Material usage recorded successfully!');
      setUsedModalVisible(false);
      dataFetchedRef.current = false;
      fetchMaterialUsed();
      fetchMaterials(true);

    } catch (err) {
      console.error('[Material Used] Error:', err);
      Alert.alert('Error', err.message || 'Failed to record usage');
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, saving: false }));
      }
    }
  }, [selectedUsedMaterial, usedForm, selectedMaterials, project?._id, makeApiCall, fetchMaterialUsed, fetchMaterials]);

  const handleSavePurchase = useCallback(async () => {
    if (!selectedPurchaseMaterial) {
      Alert.alert('Error', 'Please select a material');
      return;
    }
    
    if (!purchaseForm.quantity.trim() || !purchaseForm.rate.trim()) {
      Alert.alert('Error', 'Please enter quantity and rate');
      return;
    }
    
    if (!purchaseForm.partyName.trim()) {
      Alert.alert('Error', 'Please enter party name');
      return;
    }
    
    const existingVendor = vendors.find(v => v.name === purchaseForm.partyName);
    
    if (!existingVendor) {
      Alert.alert('Error', 'Selected vendor not found');
      return;
    }

    const purchaseData = {
      date: purchaseDate.toISOString(),
      vendorId: existingVendor.id,
      materialId: selectedMaterials[0],
      quantity: parseFloat(purchaseForm.quantity),
      rate: parseFloat(purchaseForm.rate),
      totalAmount: parseFloat(purchaseForm.totalAmount),
      advance: parseFloat(purchaseForm.advance) || 0,
      balance: parseFloat(purchaseForm.balance) || 0,
      projectId: project._id,
    };

    try {
      setApiLoadingStates(prev => ({ ...prev, saving: true }));

      await makeApiCall(
        `${BASE_URL}/api/materials/materialPurchase`,
        'POST',
        purchaseData,
        'savePurchase'
      );

      Alert.alert("Success", "Purchase saved successfully!");
      setAddMaterialPurchaseModalVisible(false);
      dataFetchedRef.current = false;
      fetchMaterials(true);

    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save purchase');
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, saving: false }));
      }
    }
  }, [selectedPurchaseMaterial, purchaseForm, selectedMaterials, vendors, purchaseDate, project?._id, makeApiCall, fetchMaterials]);

  const handleSaveRequest = useCallback(async () => {
    if (selectedMaterials.length === 0) {
      Alert.alert('Error', 'Please select a material');
      return;
    }

    if (!requestForm.quantity.trim()) {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }
    
    const selectedMaterialId = selectedMaterials[0];

    const requestData = {
      date: requestForm.date,
      materialId: selectedMaterialId,
      quantity: requestForm.quantity,
      itemDescription: requestForm.itemDescription,
      notes: requestForm.notes,
      projectId: project._id,
    };

    try {
      setApiLoadingStates(prev => ({ ...prev, saving: true }));

      await makeApiCall(
        `${BASE_URL}/api/materials/materialRequest`,
        'POST',
        requestData,
        'saveRequest'
      );

      Alert.alert(
        'Success',
        'Material request created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setRequestMaterialModalVisible(false);
              dataFetchedRef.current = false;
              fetchMaterialRequests();
            }
          }
        ]
      );

    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create request');
    } finally {
      if (isMounted.current) {
        setApiLoadingStates(prev => ({ ...prev, saving: false }));
      }
    }
  }, [selectedMaterials, requestForm, project?._id, makeApiCall, fetchMaterialRequests]);

  // === Data Formatting ===
  const formatItemDate = useCallback((d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: undefined }).replace(',', '');
  }, []);

  const mappedInventory = useMemo(() => {
    return (inventoryApi || []).map((m) => {
      const id = m._id || m.id || String(Math.random());
      return {
        _id: id,
        name: m.materialName || m.name || 'Unknown Material',
        date: formatItemDate(m.createdAt || m.updatedAt || new Date()),
        stock: typeof m.stock === 'number'
          ? m.stock
          : (typeof m.quantity === 'number' ? m.quantity : 0),
        unit: m.unit || 'nos',
        __raw: m,
      };
    });
  }, [inventoryApi, formatItemDate]);

  // === Filtered Data ===
  const filteredInventory = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return mappedInventory;
    return mappedInventory.filter((item) => item.name.toLowerCase().includes(q));
  }, [mappedInventory, debouncedSearch]);

  const filteredLibrary = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return materialLibraryData;
    return materialLibraryData.filter((item) =>
      (item.name || '').toLowerCase().includes(q)
    );
  }, [materialLibraryData, debouncedSearch]);

  // === Render Functions ===
  const renderSubTab = useCallback(({ item }) => (
    <TouchableOpacity
      className={`mx-1.5 px-4 py-1.5 ${activeSubTab === item.id ? 'border-b-2 border-blue-500' : ''
        }`}
      onPress={() => setActiveSubTab(item.id)}>
      <Text
        className={`text-sm font-medium ${activeSubTab === item.id ? 'text-blue-500' : 'text-gray-600'
          }`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  ), [activeSubTab]);

  const renderRightActions = useCallback((item) => (
    <View className="bg-red-500 justify-center items-center w-[80px] rounded-r-xl mb-2">
      <TouchableOpacity
        className="flex-1 justify-center items-center w-full"
        onPress={() => deleteMaterial(item._id)}
      >
        <Ionicons name="trash" size={22} color="white" />
        <Text className="text-white text-xs mt-1">Delete</Text>
      </TouchableOpacity>
    </View>
  ), [deleteMaterial]);

  const renderInventoryItem = useCallback(({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity
        className="mb-2 rounded-xl bg-white p-3 flex-row justify-between items-center"
        onPress={() => {
          const materialId = item.__raw?._id || item._id;
          if (!materialId || materialId.includes('random')) {
            Alert.alert('Error', 'Invalid material selected');
            return;
          }

          navigation.navigate('Materials', {
            screen: 'MaterialDetailScreen',
            params: {
              materialId,
              item: item.__raw,
            },
          });
        }}
      >
        <View className="flex-row items-center flex-1">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
            <Text className="mt-0.5 text-sm text-gray-500">{item.date}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-base font-semibold text-gray-900">
            {apiLoadingStates.inventory ? '...' : `${item.stock} ${item.unit}`}
          </Text>
          <TouchableOpacity onPress={() => openEditModal(item)}>
            <Text className="text-xs text-blue-600 mt-2">Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  ), [renderRightActions, openEditModal, apiLoadingStates.inventory, navigation]);

  const renderRequestItem = useCallback(({ item }) => (
    <TouchableOpacity
      className="mb-2 rounded-xl bg-white p-3"
      onPress={() => navigation.navigate('RequestDetailsScreen', { request: item })}
    >
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
          <Text className="text-sm font-semibold text-gray-900">{item.qty} {item.unit}</Text>
          <View className="mt-1 rounded bg-orange-100 px-2 py-1">
            <Text className="text-xs font-medium text-orange-700">{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const renderReceivedItem = useCallback(({ item }) => (
    <View className="mb-2 rounded-xl bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
            <Text className="mt-1 text-xs text-gray-500">{item.party}</Text>
          </View>
        </View>
        <Text className="text-sm font-medium text-green-600">{item.qty} {item.unit}</Text>
      </View>
    </View>
  ), []);

  const renderUsedItem = useCallback(({ item }) => (
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
        <Text className="text-sm font-medium text-red-600">-{item.qty} {item.unit}</Text>
      </View>
    </View>
  ), []);

  const renderLibraryItem = useCallback(({ item }) => (
    <TouchableOpacity
      className="flex-row items-center border-b border-gray-200 py-3"
      onPress={() => toggleMaterial(item.id)}>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
        <Text className="mt-0.5 text-xs text-gray-500">Category: {item.category}</Text>
        <Text className="text-xs text-gray-500">ID: {item.id}</Text>
      </View>
      <Text className="mr-3 text-sm text-gray-600">Unit: {item.unit}</Text>
      <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
        {selectedMaterials.includes(item.id) && (
          <View className="h-3 w-3 rounded-full bg-blue-500" />
        )}
      </View>
    </TouchableOpacity>
  ), [toggleMaterial, selectedMaterials]);

  // === Content Renderer ===
  const renderContent = useCallback(() => {
    if (activeSubTab === 'Inventory') {
      return (
        <>
          <View className="mb-2 mt-4 flex-row justify-between px-4">
            <Text className="text-sm font-semibold text-gray-600">Material</Text>
            <Text className="text-sm font-semibold text-gray-600">In Stock</Text>
          </View>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
              data={filteredInventory}
              renderItem={renderInventoryItem}
              keyExtractor={(item) => item._id || item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={apiLoadingStates.inventory}
                  onRefresh={handleRefresh}
                  colors={['#0066FF']}
                />
              }
              ListEmptyComponent={
                <View className="py-10 items-center">
                  <MaterialCommunityIcons name="cube-off" size={48} color="#9CA3AF" />
                  <Text className="mt-4 text-gray-500">
                    {apiLoadingStates.inventory ? 'Loading materials...' : 'No materials found'}
                  </Text>
                </View>
              }
            />
          </GestureHandlerRootView>
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
          refreshControl={
            <RefreshControl
              refreshing={apiLoadingStates.requests}
              onRefresh={handleRefresh}
              colors={['#0066FF']}
            />
          }
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
          refreshControl={
            <RefreshControl
              refreshing={apiLoadingStates.received}
              onRefresh={handleRefresh}
              colors={['#0066FF']}
            />
          }
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
          refreshControl={
            <RefreshControl
              refreshing={apiLoadingStates.used}
              onRefresh={handleRefresh}
              colors={['#0066FF']}
            />
          }
        />
      );
    }

    return null;
  }, [activeSubTab, filteredInventory, renderInventoryItem, apiLoadingStates, handleRefresh, requestData, renderRequestItem, receivedData, renderReceivedItem, usedData, renderUsedItem]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* === Sub Tabs === */}
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

      {/* === Search === */}
      <View className="mx-4 mt-1 h-12 flex-row items-center rounded-xl bg-white px-3">
        <Ionicons name="search" size={20} color="#9CA3AF" className="mr-2" />
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {apiLoadingStates.inventory && (
          <Ionicons name="refresh" size={20} color="#0066FF" />
        )}
      </View>

      {/* === Content === */}
      <View className="flex-1">{renderContent()}</View>

      {/* === Bottom Buttons === */}
      <View
        className="absolute inset-x-0 bottom-16 left-4 right-4 flex-row items-center justify-between px-2"
        style={{ zIndex: 10 }}>
        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-red-50 px-4 py-2.5"
          onPress={() => setUsedModalVisible(true)}
          disabled={apiLoadingStates.saving}
        >
          <Text className="text-center text-sm font-semibold text-red-500">- Used</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-blue-100 px-5 py-2.5"
          onPress={() => setMaterialActionModalVisible(true)}
          disabled={apiLoadingStates.saving}
        >
          <Text className="text-center text-sm font-semibold text-gray-900">+ Material</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-amber-100 px-4 py-2.5"
          onPress={() => setReceivedModalVisible(true)}
          disabled={apiLoadingStates.saving}
        >
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
          disabled={apiLoadingStates.saving}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[40%] rounded-t-3xl bg-white p-6 pb-10"
            onPress={() => { }}
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
                  disabled={apiLoadingStates.saving}
                >
                  <Text className="text-center text-base font-semibold text-blue-600">+ Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-green-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setReceivedModalVisible(true);
                  }}
                  disabled={apiLoadingStates.saving}
                >
                  <Text className="text-center text-base font-semibold text-green-600">+ Received</Text>
                </TouchableOpacity>
              </View>
              <View className="mb-5 flex-row space-x-6">
                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-cyan-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setAddMaterialPurchaseModalVisible(true);
                  }}
                  disabled={apiLoadingStates.saving}
                >
                  <Text className="text-center text-base font-semibold text-cyan-600">+ Purchased</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-red-50 px-5 py-4"
                  onPress={() => {
                    setMaterialActionModalVisible(false);
                    setUsedModalVisible(true);
                  }}
                  disabled={apiLoadingStates.saving}
                >
                  <Text className="text-center text-base font-semibold text-red-600">- Used</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === REQUEST MATERIAL MODAL === */}
      <Modal
        visible={requestMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (apiLoadingStates.saving) return;
          setRequestMaterialModalVisible(false);
          setShowMaterialListInRequest(false);
          clearRequestForm();
        }}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => {
            if (apiLoadingStates.saving) return;
            setRequestMaterialModalVisible(false);
            setShowMaterialListInRequest(false);
            clearRequestForm();
          }}
          disabled={apiLoadingStates.saving}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-t-3xl bg-white"
            onPress={() => { }}
            style={{
              height: showMaterialListInRequest ? '85%' : '75%',
              maxHeight: '90%',
            }}
          >
            <View className="items-center pt-3 pb-1">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            {showMaterialListInRequest ? (
              <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity
                    onPress={() => setShowMaterialListInRequest(false)}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-900">Select Material</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setRequestMaterialModalVisible(false);
                      setShowMaterialListInRequest(false);
                      setCreateNewMaterialModalVisible(true);
                    }}
                    className="mr-3 p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Text className="text-blue-600 font-medium">New +</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setRequestMaterialModalVisible(false);
                      setShowMaterialListInRequest(false);
                      clearRequestForm();
                    }}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1 text-base text-gray-900"
                    placeholder="Search materials..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={!apiLoadingStates.saving}
                  />
                </View>

                <FlatList
                  data={filteredLibrary}
                  renderItem={renderLibraryItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View className="py-8 items-center">
                      <Text className="text-gray-500">No materials found</Text>
                      <TouchableOpacity
                        onPress={() => fetchMaterials(true)}
                        className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
                        disabled={apiLoadingStates.saving}
                      >
                        <Text className="text-blue-600">Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
            ) : (
              <View className="flex-1 px-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Material Request</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setRequestMaterialModalVisible(false);
                      setShowMaterialListInRequest(false);
                      clearRequestForm();
                    }}
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-gray-900">{requestForm.date}</Text>
                      <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                      </TouchableOpacity>
                    </View>
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  {selectedRequestMaterial ? (
                    <View className="mb-4">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Selected Material</Text>
                        <TouchableOpacity
                          onPress={() => setShowMaterialListInRequest(true)}
                          className="p-1"
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 text-sm">Change</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-base font-medium text-gray-900">{selectedRequestMaterial.name}</Text>
                        <View className="flex-row mt-1">
                          <Text className="text-xs text-gray-500 mr-3">Category: {selectedRequestMaterial.category}</Text>
                          <Text className="text-xs text-gray-500">Unit: {selectedRequestMaterial.unit}</Text>
                        </View>
                        <Text className="text-xs text-gray-500 mt-1">ID: {selectedRequestMaterial.id}</Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                      onPress={() => setShowMaterialListInRequest(true)}
                      disabled={apiLoadingStates.saving}
                    >
                      <Ionicons name="add" size={20} color="#0066FF" />
                      <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
                    </TouchableOpacity>
                  )}

                  <View className="mb-4">
                    <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter quantity"
                      placeholderTextColor="#9CA3AF"
                      value={requestForm.quantity}
                      onChangeText={(text) => setRequestForm({ ...requestForm, quantity: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Item Description</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter description"
                      placeholderTextColor="#9CA3AF"
                      value={requestForm.itemDescription}
                      onChangeText={(text) => setRequestForm({ ...requestForm, itemDescription: text })}
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
                    <TextInput
                      className="h-24 text-sm text-gray-900"
                      placeholder="Enter notes..."
                      placeholderTextColor="#9CA3AF"
                      value={requestForm.notes}
                      onChangeText={(text) => setRequestForm({ ...requestForm, notes: text })}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      editable={!apiLoadingStates.saving}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  className={`flex-row items-center justify-center rounded-xl py-3.5 mb-4 ${apiLoadingStates.saving ? 'bg-blue-400' : 'bg-blue-600'}`}
                  onPress={handleSaveRequest}
                  disabled={apiLoadingStates.saving}
                >
                  {apiLoadingStates.saving ? (
                    <Text className="text-base font-semibold text-white">Saving...</Text>
                  ) : (
                    <>
                      <Text className="text-base font-semibold text-white">Save & Log ID</Text>
                      <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === CREATE NEW MATERIAL MODAL === */}
      <Modal
        visible={createNewMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !apiLoadingStates.creating && setCreateNewMaterialModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => !apiLoadingStates.creating && setCreateNewMaterialModalVisible(false)}
          disabled={apiLoadingStates.creating}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[85%] rounded-t-3xl bg-white p-5"
            onPress={() => { }}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Create New Material</Text>
              <TouchableOpacity
                onPress={() => !apiLoadingStates.creating && setCreateNewMaterialModalVisible(false)}
                disabled={apiLoadingStates.creating}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter material name"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.materialName}
                  onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, materialName: text })}
                  editable={!apiLoadingStates.creating}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.creating && setShowUnitModal(true)}
                  disabled={apiLoadingStates.creating}
                >
                  <Text className={`text-base ${newMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
                    {newMaterialForm.unit || 'Select unit'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.creating && setShowGstModal(true)}
                  disabled={apiLoadingStates.creating}
                >
                  <Text className="text-base text-gray-900">{newMaterialForm.gst}%</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter HSN/SAC code"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.hsnCode}
                  onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, hsnCode: text })}
                  editable={!apiLoadingStates.creating}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.creating && setShowCategoryModal(true)}
                  disabled={apiLoadingStates.creating}
                >
                  <Text className={`text-base ${newMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
                    {newMaterialForm.category || 'Select category'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter description..."
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.description}
                  onChangeText={(text) => setNewMaterialForm({ ...newMaterialForm, description: text })}
                  multiline
                  editable={!apiLoadingStates.creating}
                  textAlignVertical="top"
                  numberOfLines={5}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-xl py-4 ${apiLoadingStates.creating ? 'bg-blue-400' : 'bg-blue-600'
                } mt-4`}
              onPress={createNewMaterial}
              disabled={apiLoadingStates.creating}
            >
              {apiLoadingStates.creating ? (
                <Text className="text-base font-semibold text-white">Creating...</Text>
              ) : (
                <>
                  <Text className="text-base font-semibold text-white">Create Material</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === EDIT MATERIAL MODAL === */}
      <Modal
        visible={editMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !apiLoadingStates.updating && setEditMaterialModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => !apiLoadingStates.updating && setEditMaterialModalVisible(false)}
          disabled={apiLoadingStates.updating}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[85%] rounded-t-3xl bg-white p-5"
            onPress={() => { }}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Edit Material</Text>
              <TouchableOpacity
                onPress={() => !apiLoadingStates.updating && setEditMaterialModalVisible(false)}
                disabled={apiLoadingStates.updating}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter material name"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.materialName}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, materialName: text })}
                  editable={!apiLoadingStates.updating}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.updating && setShowEditUnitModal(true)}
                  disabled={apiLoadingStates.updating}
                >
                  <Text className={`text-base ${editMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
                    {editMaterialForm.unit || 'Select unit'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.updating && setShowEditGstModal(true)}
                  disabled={apiLoadingStates.updating}
                >
                  <Text className="text-base text-gray-900">{editMaterialForm.gst}%</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter HSN/SAC code"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.hsnCode}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, hsnCode: text })}
                  editable={!apiLoadingStates.updating}
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !apiLoadingStates.updating && setShowEditCategoryModal(true)}
                  disabled={apiLoadingStates.updating}
                >
                  <Text className={`text-base ${editMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
                    {editMaterialForm.category || 'Select category'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.quantity}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, quantity: text })}
                  keyboardType="numeric"
                  editable={!apiLoadingStates.updating}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Current Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter current stock"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.stock}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, stock: text })}
                  keyboardType="numeric"
                  editable={!apiLoadingStates.updating}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Price</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter price"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.price}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, price: text })}
                  keyboardType="numeric"
                  editable={!apiLoadingStates.updating}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Minimum Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter minimum stock"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.minStock}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, minStock: text })}
                  keyboardType="numeric"
                  editable={!apiLoadingStates.updating}
                />
              </View>

              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter description..."
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.description}
                  onChangeText={(text) => setEditMaterialForm({ ...editMaterialForm, description: text })}
                  multiline
                  editable={!apiLoadingStates.updating}
                  textAlignVertical="top"
                  numberOfLines={5}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-xl py-4 ${apiLoadingStates.updating ? 'bg-blue-400' : 'bg-blue-600'
                } mt-4`}
              onPress={handleEditMaterial}
              disabled={apiLoadingStates.updating}
            >
              {apiLoadingStates.updating ? (
                <Text className="text-base font-semibold text-white">Updating...</Text>
              ) : (
                <>
                  <Text className="text-base font-semibold text-white">Update Material</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === DROPDOWN SELECTION MODALS === */}
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectCategory(item)}
                >
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Unit Selection Modal */}
      <Modal
        visible={showUnitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Unit</Text>
              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={units}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectUnit(item)}
                >
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* GST Selection Modal */}
      <Modal
        visible={showGstModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGstModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select GST Rate</Text>
              <TouchableOpacity onPress={() => setShowGstModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={gstRates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectGst(item)}
                >
                  <Text className="text-base text-gray-900">{item}%</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Category Selection Modal */}
      <Modal
        visible={showEditCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditCategoryModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Category</Text>
              <TouchableOpacity onPress={() => setShowEditCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectEditCategory(item)}
                >
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Unit Selection Modal */}
      <Modal
        visible={showEditUnitModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditUnitModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Unit</Text>
              <TouchableOpacity onPress={() => setShowEditUnitModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={units}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectEditUnit(item)}
                >
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Edit GST Selection Modal */}
      <Modal
        visible={showEditGstModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditGstModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select GST Rate</Text>
              <TouchableOpacity onPress={() => setShowEditGstModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={gstRates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => selectEditGst(item)}
                >
                  <Text className="text-base text-gray-900">{item}%</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* === PURCHASE MODAL === */}
      <Modal
        visible={addMaterialPurchaseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (apiLoadingStates.saving) return;
          setAddMaterialPurchaseModalVisible(false);
          setShowMaterialListInPurchase(false);
          clearPurchaseForm();
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => {
            if (apiLoadingStates.saving) return;
            setAddMaterialPurchaseModalVisible(false);
            setShowMaterialListInPurchase(false);
            clearPurchaseForm();
          }}
          disabled={apiLoadingStates.saving}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-t-3xl bg-white"
            style={{
              height: showMaterialListInPurchase ? '85%' : '75%',
              maxHeight: '90%',
            }}
            onPress={() => { }}
          >
            <View className="items-center pt-3 pb-1">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            {showMaterialListInPurchase ? (
              <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity 
                    onPress={() => setShowMaterialListInPurchase(false)} 
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-900">Select Material</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setAddMaterialPurchaseModalVisible(false);
                      setShowMaterialListInPurchase(false);
                      setCreateNewMaterialModalVisible(true);
                    }}
                    className="mr-3 p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Text className="text-blue-600 font-medium">New +</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setAddMaterialPurchaseModalVisible(false);
                      setShowMaterialListInPurchase(false);
                      clearPurchaseForm();
                    }}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1 text-base text-gray-900"
                    placeholder="Search materials..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={!apiLoadingStates.saving}
                  />
                </View>

                <FlatList
                  data={filteredLibrary}
                  renderItem={renderLibraryItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View className="py-8 items-center">
                      <Text className="text-gray-500">No materials found</Text>
                      <TouchableOpacity 
                        onPress={() => fetchMaterials(true)} 
                        className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
                        disabled={apiLoadingStates.saving}
                      >
                        <Text className="text-blue-600">Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
            ) : (
              <View className="flex-1 px-5 relative">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Material Purchase</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setAddMaterialPurchaseModalVisible(false);
                      setShowMaterialListInPurchase(false);
                      clearPurchaseForm();
                    }}
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 140 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-gray-900">{formatDate(purchaseDate)}</Text>
                      <TouchableOpacity 
                        onPress={() => setShowPurchaseDatePicker(true)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                      </TouchableOpacity>
                    </View>
                    <View className="mt-1 h-px bg-gray-300" />
                    {showPurchaseDatePicker && (
                      <DateTimePicker
                        value={purchaseDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onPurchaseDateChange}
                      />
                    )}
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                    <View className="flex-row items-center border-b border-gray-300 pb-1">
                      <TextInput
                        className="flex-1 text-base text-gray-900"
                        placeholder="Select or enter party name"
                        placeholderTextColor="#9CA3AF"
                        value={purchaseForm.partyName}
                        onChangeText={(text) => setPurchaseForm({ ...purchaseForm, partyName: text })}
                        onFocus={() => {
                          setShowPartyDropdown(true);
                          setPartySearch(purchaseForm.partyName || '');
                        }}
                        editable={!apiLoadingStates.saving}
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPartyDropdown(!showPartyDropdown)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name={showPartyDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    {purchaseForm.partyName && !showPartyDropdown && vendors.find(v => v.name === purchaseForm.partyName) && (
                      <Text className="mt-1 text-xs text-gray-600">
                        Selected: {purchaseForm.partyName}
                        {vendors.find(v => v.name === purchaseForm.partyName)?.vendorcode && ` • Code: ${vendors.find(v => v.name === purchaseForm.partyName)?.vendorcode}`}
                      </Text>
                    )}
                  </View>

                  {selectedPurchaseMaterial ? (
                    <View className="mb-4">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Material</Text>
                        <TouchableOpacity 
                          onPress={() => setShowMaterialListInPurchase(true)} 
                          className="p-1"
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 text-sm">Change</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-base font-medium text-gray-900">{selectedPurchaseMaterial.name}</Text>
                        <View className="flex-row mt-1">
                          <Text className="text-xs text-gray-500 mr-3">Category: {selectedPurchaseMaterial.category}</Text>
                          <Text className="text-xs text-gray-500">Unit: {selectedPurchaseMaterial.unit}</Text>
                        </View>
                        <Text className="text-xs text-gray-500 mt-1">ID: {selectedPurchaseMaterial.id}</Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                      onPress={() => setShowMaterialListInPurchase(true)}
                      disabled={apiLoadingStates.saving}
                    >
                      <Ionicons name="add" size={20} color="#0066FF" />
                      <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
                    </TouchableOpacity>
                  )}

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Quantity ({selectedPurchaseMaterial?.unit || 'units'})</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter quantity"
                      placeholderTextColor="#9CA3AF"
                      value={purchaseForm.quantity}
                      onChangeText={(text) => setPurchaseForm({ ...purchaseForm, quantity: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Rate per Unit (₹)</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter rate per unit"
                      placeholderTextColor="#9CA3AF"
                      value={purchaseForm.rate}
                      onChangeText={(text) => setPurchaseForm({ ...purchaseForm, rate: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Total Amount (₹)</Text>
                    <Text className="text-base font-semibold text-gray-900">
                      {purchaseForm.totalAmount ? `₹ ${purchaseForm.totalAmount}` : '—'}
                    </Text>
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Advance (₹)</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter advance amount"
                      placeholderTextColor="#9CA3AF"
                      value={purchaseForm.advance}
                      onChangeText={(text) => setPurchaseForm({ ...purchaseForm, advance: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Balance (₹)</Text>
                    <Text className="text-base font-semibold text-gray-900">
                      {purchaseForm.balance ? `₹ ${purchaseForm.balance}` : '—'}
                    </Text>
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  className={`flex-row items-center justify-center rounded-xl py-3.5 mb-4 ${apiLoadingStates.saving ? 'bg-blue-400' : 'bg-blue-600'}`}
                  onPress={handleSavePurchase}
                  disabled={apiLoadingStates.saving}
                >
                  {apiLoadingStates.saving ? (
                    <Text className="text-base font-semibold text-white">Saving...</Text>
                  ) : (
                    <>
                      <Text className="text-base font-semibold text-white">Save Purchase</Text>
                      <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>

                {showPartyDropdown && (
                  <View
                    className="absolute bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{
                      top: 140,
                      left: 20,
                      right: 20,
                      maxHeight: 300,
                      elevation: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" className="max-h-[300px]">
                      {filteredParties.length > 0 ? (
                        filteredParties.map((vendor) => (
                          <TouchableOpacity
                            key={vendor.id}
                            className="px-4 py-3 border-b border-gray-100 active:bg-blue-50"
                            onPress={() => selectParty(vendor, 'purchase')}
                            disabled={apiLoadingStates.saving}
                          >
                            <Text className="text-base font-medium text-gray-900">{vendor.name}</Text>
                            <View className="flex-row justify-between mt-1">
                              {vendor.vendorcode && <Text className="text-xs text-gray-500">Code: {vendor.vendorcode}</Text>}
                              {vendor.vendorType && <Text className="text-xs text-gray-500">{vendor.vendorType}</Text>}
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View className="px-4 py-3">
                          <Text className="text-gray-500 text-center">
                            {partySearch ? 'No vendors found' : 'Type to search vendors'}
                          </Text>
                        </View>
                      )}

                      {partySearch && !vendors.some(v => v.name.toLowerCase() === partySearch.toLowerCase()) && (
                        <TouchableOpacity
                          className="px-4 py-3 border-t border-gray-200 bg-blue-50"
                          onPress={() => {
                            setPurchaseForm({ ...purchaseForm, partyName: partySearch });
                            setShowPartyDropdown(false);
                            setPartySearch('');
                          }}
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 font-medium">+ Add "{partySearch}" as new vendor</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === RECEIVED MODAL === */}
      <Modal
        visible={receivedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (apiLoadingStates.saving) return;
          setReceivedModalVisible(false);
          setShowMaterialListInReceived(false);
          clearReceivedForm();
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => {
            if (apiLoadingStates.saving) return;
            setReceivedModalVisible(false);
            setShowMaterialListInReceived(false);
            clearReceivedForm();
          }}
          disabled={apiLoadingStates.saving}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-t-3xl bg-white"
            style={{
              height: showMaterialListInReceived ? '85%' : '75%',
              maxHeight: '90%',
            }}
            onPress={() => { }}
          >
            <View className="items-center pt-3 pb-1">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            {showMaterialListInReceived ? (
              <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity 
                    onPress={() => setShowMaterialListInReceived(false)} 
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-900">Select Material</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setReceivedModalVisible(false);
                      setShowMaterialListInReceived(false);
                      setCreateNewMaterialModalVisible(true);
                    }}
                    className="mr-3 p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Text className="text-blue-600 font-medium">New +</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setReceivedModalVisible(false);
                      setShowMaterialListInReceived(false);
                      clearReceivedForm();
                    }}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1 text-base text-gray-900"
                    placeholder="Search materials..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={!apiLoadingStates.saving}
                  />
                </View>

                <FlatList
                  data={filteredLibrary}
                  renderItem={renderLibraryItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View className="py-8 items-center">
                      <Text className="text-gray-500">No materials found</Text>
                      <TouchableOpacity 
                        onPress={() => fetchMaterials(true)} 
                        className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
                        disabled={apiLoadingStates.saving}
                      >
                        <Text className="text-blue-600">Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
            ) : (
              <View className="flex-1 px-5 relative">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Material Received</Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setReceivedModalVisible(false);
                      setShowMaterialListInReceived(false);
                      clearReceivedForm();
                    }}
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 140 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-gray-900">{formatDate(date)}</Text>
                      <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                      </TouchableOpacity>
                    </View>
                    <View className="mt-1 h-px bg-gray-300" />
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                      />
                    )}
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                    <View className="flex-row items-center border-b border-gray-300 pb-1">
                      <TextInput
                        className="flex-1 text-base text-gray-900"
                        placeholder="Select or enter party name"
                        placeholderTextColor="#9CA3AF"
                        value={receivedForm.partyName}
                        onChangeText={(text) => setReceivedForm({ ...receivedForm, partyName: text })}
                        onFocus={() => {
                          setShowPartyDropdown(true);
                          setPartySearch(receivedForm.partyName || '');
                        }}
                        editable={!apiLoadingStates.saving}
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPartyDropdown(!showPartyDropdown)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name={showPartyDropdown ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    {receivedForm.partyName && !showPartyDropdown && vendors.find(v => v.name === receivedForm.partyName) && (
                      <Text className="mt-1 text-xs text-gray-600">
                        Selected: {receivedForm.partyName}
                        {vendors.find(v => v.name === receivedForm.partyName)?.vendorcode &&
                          ` • Code: ${vendors.find(v => v.name === receivedForm.partyName)?.vendorcode}`}
                      </Text>
                    )}
                  </View>

                  {selectedReceivedMaterial ? (
                    <View className="mb-4">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Material</Text>
                        <TouchableOpacity 
                          onPress={() => setShowMaterialListInReceived(true)} 
                          className="p-1"
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 text-sm">Change</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-base font-medium text-gray-900">{selectedReceivedMaterial.name}</Text>
                        <View className="flex-row mt-1">
                          <Text className="text-xs text-gray-500 mr-3">Category: {selectedReceivedMaterial.category}</Text>
                          <Text className="text-xs text-gray-500">Unit: {selectedReceivedMaterial.unit}</Text>
                        </View>
                        <Text className="text-xs text-gray-500 mt-1">ID: {selectedReceivedMaterial.id}</Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                      onPress={() => setShowMaterialListInReceived(true)}
                      disabled={apiLoadingStates.saving}
                    >
                      <Ionicons name="add" size={20} color="#0066FF" />
                      <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
                    </TouchableOpacity>
                  )}

                  <View className="mb-4">
                    <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter quantity"
                      placeholderTextColor="#9CA3AF"
                      value={receivedForm.quantity}
                      onChangeText={(text) => setReceivedForm({ ...receivedForm, quantity: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Challan No.</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      value={receivedForm.challanNo}
                      onChangeText={(text) => setReceivedForm({ ...receivedForm, challanNo: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
                    <TextInput
                      className="text-base text-gray-900"
                      value={receivedForm.vehicleNo}
                      onChangeText={(text) => setReceivedForm({ ...receivedForm, vehicleNo: text })}
                      editable={!apiLoadingStates.saving}
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
                      onChangeText={(text) => setReceivedForm({ ...receivedForm, notes: text })}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      editable={!apiLoadingStates.saving}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  className={`flex-row items-center justify-center rounded-xl py-3.5 mb-4 ${apiLoadingStates.saving ? 'bg-blue-400' : 'bg-blue-600'}`}
                  onPress={handleSaveReceived}
                  disabled={apiLoadingStates.saving}
                >
                  {apiLoadingStates.saving ? (
                    <Text className="text-base font-semibold text-white">Saving...</Text>
                  ) : (
                    <>
                      <Text className="text-base font-semibold text-white">Save Received</Text>
                      <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>

                {showPartyDropdown && (
                  <View
                    className="absolute bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{
                      top: 140,
                      left: 20,
                      right: 20,
                      maxHeight: 300,
                      elevation: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }}
                  >
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" className="max-h-[300px]">
                      {filteredParties.length > 0 ? (
                        filteredParties.map((vendor) => (
                          <TouchableOpacity
                            key={vendor.id}
                            className="px-4 py-3 border-b border-gray-100 active:bg-blue-50"
                            onPress={() => selectParty(vendor, 'received')}
                            disabled={apiLoadingStates.saving}
                          >
                            <Text className="text-base font-medium text-gray-900">{vendor.name}</Text>
                            <View className="flex-row justify-between mt-1">
                              {vendor.vendorcode && <Text className="text-xs text-gray-500">Code: {vendor.vendorcode}</Text>}
                              {vendor.vendorType && <Text className="text-xs text-gray-500">{vendor.vendorType}</Text>}
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View className="px-4 py-3">
                          <Text className="text-gray-500 text-center">
                            {partySearch ? 'No vendors found' : 'Type to search vendors'}
                          </Text>
                        </View>
                      )}

                      {partySearch && !vendors.some(v => v.name.toLowerCase() === partySearch.toLowerCase()) && (
                        <TouchableOpacity
                          className="px-4 py-3 border-t border-gray-200 bg-blue-50"
                          onPress={() => {
                            setReceivedForm({ ...receivedForm, partyName: partySearch });
                            setShowPartyDropdown(false);
                            setPartySearch('');
                          }}
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 font-medium">+ Add "{partySearch}" as new vendor</Text>
                        </TouchableOpacity>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === USED MODAL === */}
      <Modal
        visible={usedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (apiLoadingStates.saving) return;
          setUsedModalVisible(false);
          setShowMaterialListInUsed(false);
          clearUsedForm();
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => {
            if (apiLoadingStates.saving) return;
            setUsedModalVisible(false);
            setShowMaterialListInUsed(false);
            clearUsedForm();
          }}
          disabled={apiLoadingStates.saving}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-t-3xl bg-white"
            style={{
              height: showMaterialListInUsed ? '85%' : '75%',
              maxHeight: '90%',
            }}
            onPress={() => { }}
          >
            <View className="items-center pt-3 pb-1">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>

            {showMaterialListInUsed ? (
              <View className="flex-1 px-5">
                <View className="flex-row items-center justify-between mb-4">
                  <TouchableOpacity
                    onPress={() => setShowMaterialListInUsed(false)}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-900">Select Material</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setUsedModalVisible(false);
                      setShowMaterialListInUsed(false);
                      setCreateNewMaterialModalVisible(true);
                    }}
                    className="mr-3 p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Text className="text-blue-600 font-medium">New +</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setUsedModalVisible(false);
                      setShowMaterialListInUsed(false);
                      clearUsedForm();
                    }}
                    className="p-2"
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1 text-base text-gray-900"
                    placeholder="Search materials..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    editable={!apiLoadingStates.saving}
                  />
                </View>

                <FlatList
                  data={filteredLibrary}
                  renderItem={renderLibraryItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View className="py-8 items-center">
                      <Text className="text-gray-500">No materials found</Text>
                      <TouchableOpacity
                        onPress={() => fetchMaterials(true)}
                        className="mt-2 px-4 py-2 bg-blue-100 rounded-lg"
                        disabled={apiLoadingStates.saving}
                      >
                        <Text className="text-blue-600">Refresh</Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
            ) : (
              <View className="flex-1 px-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Material Used</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      if (apiLoadingStates.saving) return;
                      setUsedModalVisible(false);
                      setShowMaterialListInUsed(false);
                      clearUsedForm();
                    }}
                    disabled={apiLoadingStates.saving}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-gray-900">{usedForm.date}</Text>
                      <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        disabled={apiLoadingStates.saving}
                      >
                        <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                      </TouchableOpacity>
                    </View>
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  {selectedUsedMaterial ? (
                    <View className="mb-4">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Material</Text>
                        <TouchableOpacity
                          onPress={() => setShowMaterialListInUsed(true)}
                          className="p-1"
                          disabled={apiLoadingStates.saving}
                        >
                          <Text className="text-blue-600 text-sm">Change</Text>
                        </TouchableOpacity>
                      </View>
                      <View className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-base font-medium text-gray-900">
                          {selectedUsedMaterial.name}
                        </Text>
                        <View className="flex-row mt-1">
                          <Text className="text-xs text-gray-500 mr-3">
                            Category: {selectedUsedMaterial.category}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            Unit: {selectedUsedMaterial.unit}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-500 mt-1">
                          ID: {selectedUsedMaterial.id}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                      onPress={() => setShowMaterialListInUsed(true)}
                      disabled={apiLoadingStates.saving}
                    >
                      <Ionicons name="add" size={20} color="#0066FF" />
                      <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
                    </TouchableOpacity>
                  )}

                  <View className="mb-4">
                    <Text className="mb-1 text-sm font-medium text-gray-700">
                      Quantity ({selectedUsedMaterial?.unit || 'units'})
                    </Text>
                    <TextInput
                      className="text-base text-gray-900"
                      placeholder="Enter quantity"
                      placeholderTextColor="#9CA3AF"
                      value={usedForm.quantity}
                      onChangeText={(text) => setUsedForm({ ...usedForm, quantity: text })}
                      keyboardType="numeric"
                      editable={!apiLoadingStates.saving}
                    />
                    <View className="mt-1 h-px bg-gray-300" />
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
                    <TextInput
                      className="h-24 text-sm text-gray-900"
                      placeholder="Enter notes..."
                      placeholderTextColor="#9CA3AF"
                      value={usedForm.notes}
                      onChangeText={(text) => setUsedForm({ ...usedForm, notes: text })}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      editable={!apiLoadingStates.saving}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity
                  className={`flex-row items-center justify-center rounded-xl py-3.5 mb-4 ${apiLoadingStates.saving ? 'bg-blue-400' : 'bg-blue-600'}`}
                  onPress={handleSaveUsed}
                  disabled={apiLoadingStates.saving}
                >
                  {apiLoadingStates.saving ? (
                    <Text className="text-base font-semibold text-white">Saving...</Text>
                  ) : (
                    <>
                      <Text className="text-base font-semibold text-white">Save Used</Text>
                      <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MaterialsListScreen;