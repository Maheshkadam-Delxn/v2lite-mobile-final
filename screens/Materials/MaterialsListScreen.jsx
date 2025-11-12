// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   FlatList,
//   Modal,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNavigation } from '@react-navigation/native';

// const MaterialsListScreen = () => {
//   const navigation = useNavigation();
//   const [activeSubTab, setActiveSubTab] = useState('Inventory');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
//   const [receivedModalVisible, setReceivedModalVisible] = useState(false);
//   const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
//   const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
//   const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
//   const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
//   const [usedModalVisible, setUsedModalVisible] = useState(false);

//   const [date, setDate] = useState(new Date());
//   const [purchaseDate, setPurchaseDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

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
//     gst: '18.0 %',
//     hsnCode: '',
//     category: 'Select category',
//     description: ''
//   });

//   const [requestForm, setRequestForm] = useState({
//     mrNumber: 'MR-2',
//     date: '01-04-2025',
//     materialName: 'Test Material',
//     quantity: '',
//     itemDescription: '',
//     notes: ''
//   });

//   const [purchaseForm, setPurchaseForm] = useState({
//     partyName: '',
//     quantity: '10 nos',
//     amount: '₹ 1,900',
//     billTo: '',
//     advance: '',
//     balance: '₹ 0'
//   });

//   const [usedForm, setUsedForm] = useState({
//     date: '01-04-25',
//     material: '',
//     quantity: '',
//     notes: ''
//   });

//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowDatePicker(Platform.OS === 'ios');
//     setDate(currentDate);
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

//   const subTabs = [
//     { id: 'Inventory', label: 'Inventory' },
//     { id: 'Request', label: 'Request' },
//     { id: 'Received', label: 'Received' },
//     { id: 'Used', label: 'Used' },
//   ];

//   const inventoryData = [
//     { id: '1', name: 'Test Material', date: '30 v04', stock: 15 },
//     { id: '2', name: 'Test2 Material', date: '12 v02', stock: 10 },
//     { id: '3', name: 'Test2 Material', date: '01 v01', stock: 10 },
//     { id: '4', name: '1R Material', date: '11 v00', stock: 10 },
//   ];

//   const requestData = [
//     { id: '1', date: '03 Apr', name: 'Milk 1 Test', qty: '10 nos', status: 'Requested' },
//     { id: '2', date: '03 Apr', name: 'Milk 1 Test', qty: '10 nos', status: 'Requested' },
//   ];

//   const receivedData = [
//     { id: '1', date: '03 Apr 2025', name: 'Test Material', qty: '+10 nos', party: 'Party ABC' },
//     { id: '2', date: '03 Apr 2025', name: 'Test Material', qty: '+10 nos', party: 'Party ABC' },
//   ];

//   const usedData = [
//     { id: '1', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
//     { id: '2', date: '03 Apr 2025', name: 'Test Material', qty: '-5 nos' },
//   ];

//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const materialLibraryData = [
//     { id: '1', name: 'Test material', category: 'Cement', unit: 'nos' },
//     { id: '2', name: 'Test material', category: 'Cement', unit: 'nos' },
//     { id: '3', name: 'Test material', category: 'Cement', unit: 'nos' },
//     { id: '4', name: 'Test material', category: 'Cement', unit: 'nos' },
//   ];

//   const filteredLibrary = materialLibraryData.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const toggleMaterial = (id) => {
//     setSelectedMaterials((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const renderLibraryItem = ({ item }) => (
//     <TouchableOpacity
//       className="flex-row items-center border-b border-gray-200 py-3"
//       onPress={() => toggleMaterial(item.id)}>
//       <View className="flex-1">
//         <Text className="text-base font-medium text-gray-900">{item.name}</Text>
//         <Text className="mt-0.5 text-xs text-gray-500">Category: {item.category}</Text>
//       </View>
//       <Text className="mr-3 text-sm text-gray-600">Unit: {item.unit}</Text>
//       <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
//         {selectedMaterials.includes(item.id) && (
//           <View className="h-3 w-3 rounded-full bg-blue-500" />
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const filteredInventory = inventoryData.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderSubTab = ({ item }) => (
//     <TouchableOpacity
//       className={`mx-1.5 px-4 py-1.5 ${
//         activeSubTab === item.id ? 'border-b-2 border-blue-500' : ''
//       }`}
//       onPress={() => setActiveSubTab(item.id)}>
//       <Text
//         className={`text-sm font-medium ${
//           activeSubTab === item.id ? 'text-blue-500' : 'text-gray-600'
//         }`}>
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderInventoryItem = ({ item }) => (
//     <TouchableOpacity
//       className="mb-2 rounded-xl bg-white p-3"
//       onPress={() => navigation.navigate('MaterialDetailScreen', { item })}
//     >
//       <View className="flex-row items-center justify-between">
//         <View className="flex-1 flex-row items-center">
//           <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
//             <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
//           </View>
//           <View>
//             <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
//             <Text className="mt-0.5 text-sm text-gray-500">{item.date}</Text>
//           </View>
//         </View>
//         <Text className="text-base font-semibold text-gray-900">{item.stock}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//  const renderRequestItem = ({ item }) => (
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
//           <Text className="text-sm font-semibold text-gray-900">{item.qty}</Text>
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
//             <Text className="text-sm text-gray-500">{item.date}</Text>
//             <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
//             <Text className="mt-1 text-xs text-gray-500">{item.party}</Text>
//           </View>
//         </View>
//         <Text className="text-sm font-medium text-green-600">{item.qty}</Text>
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
//         <Text className="text-sm font-medium text-red-600">{item.qty}</Text>
//       </View>
//     </View>
//   );

//   const renderContent = () => {
//     if (activeSubTab === 'Inventory') {
//       return (
//         <>
//           <View className="mb-2 mt-4 flex-row justify-between px-4">
//             <Text className="text-sm font-semibold text-gray-600">Material</Text>
//             <Text className="text-sm font-semibold text-gray-600">In Stock</Text>
//           </View>
//           <FlatList
//             data={filteredInventory}
//             renderItem={renderInventoryItem}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
//             showsVerticalScrollIndicator={false}
//           />
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
//     <SafeAreaView className="flex-1 bg-gray-50">
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

//       <View className="flex-1">{renderContent()}</View>

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
//             onPress={() => {}}
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

//       {/* === MATERIAL LIBRARY MODAL === */}
//       <Modal
//         visible={materialLibraryModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setMaterialLibraryModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setMaterialLibraryModalVisible(false)}
//         >
//           <TouchableOpacity
//             activeOpacity={1}
//             className="max-h-[90%] rounded-t-3xl bg-white p-5"
//             onPress={() => {}}
//           >
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Material Library</Text>
//               <TouchableOpacity onPress={() => setMaterialLibraryModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <View className="mb-3 h-12 flex-row items-center rounded-xl bg-gray-100 px-3">
//               <Ionicons name="search" size={20} color="#9CA3AF" />
//               <TextInput
//                 className="ml-2 flex-1 text-base text-gray-900"
//                 placeholder="Search materials..."
//                 placeholderTextColor="#9CA3AF"
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>

//             <FlatList
//               data={filteredLibrary}
//               renderItem={renderLibraryItem}
//               keyExtractor={(item) => item.id}
//               showsVerticalScrollIndicator={false}
//               style={{ maxHeight: 400 }}
//             />

//             <TouchableOpacity
//               className="mt-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//               onPress={() => {
//                 setMaterialLibraryModalVisible(false);
//                 setCreateNewMaterialModalVisible(true);
//               }}
//             >
//               <Ionicons name="add" size={20} color="#3B82F6" />
//               <Text className="ml-1 font-medium text-blue-600">Create New Material</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               className="mt-3 flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5"
//               onPress={() => setMaterialLibraryModalVisible(false)}
//             >
//               <Text className="text-base font-semibold text-white">Add Selected</Text>
//               <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === CREATE NEW MATERIAL MODAL === */}
//       <Modal
//         visible={createNewMaterialModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setCreateNewMaterialModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setCreateNewMaterialModalVisible(false)}
//         >
//           <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Create New Material</Text>
//               <TouchableOpacity onPress={() => setCreateNewMaterialModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Material Name</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter material name"
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.materialName}
//                   onChangeText={(text) => setNewMaterialForm({...newMaterialForm, materialName: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Unit</Text>
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-base text-gray-900">{newMaterialForm.unit}</Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </View>
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">GST %</Text>
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-base text-gray-900">{newMaterialForm.gst}</Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </View>
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">HSN Code</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter HSN code"
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.hsnCode}
//                   onChangeText={(text) => setNewMaterialForm({...newMaterialForm, hsnCode: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Category</Text>
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-base text-gray-400">{newMaterialForm.category}</Text>
//                   <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//                 </View>
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-6">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Description</Text>
//                 <TextInput
//                   className="h-20 text-base text-gray-900"
//                   placeholder="Enter description..."
//                   placeholderTextColor="#9CA3AF"
//                   value={newMaterialForm.description}
//                   onChangeText={(text) => setNewMaterialForm({...newMaterialForm, description: text})}
//                   multiline
//                 />
//               </View>
//             </ScrollView>

//             <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
//               <Text className="text-base font-semibold text-white">Create Material</Text>
//               <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === REQUEST MATERIAL MODAL === */}
//       <Modal
//         visible={requestMaterialModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setRequestMaterialModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setRequestMaterialModalVisible(false)}
//         >
//           <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Material Request</Text>
//               <TouchableOpacity onPress={() => setRequestMaterialModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">MR Number</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={requestForm.mrNumber}
//                   onChangeText={(text) => setRequestForm({...requestForm, mrNumber: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-base text-gray-900">{requestForm.date}</Text>
//                   <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                     <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
//                   </TouchableOpacity>
//                 </View>
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <TouchableOpacity
//                 className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                 onPress={() => {
//                   setRequestMaterialModalVisible(false);
//                   setMaterialLibraryModalVisible(true);
//                 }}>
//                 <Ionicons name="add" size={20} color="#3B82F6" />
//                 <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//               </TouchableOpacity>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Material Name</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={requestForm.materialName}
//                   onChangeText={(text) => setRequestForm({...requestForm, materialName: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter quantity"
//                   placeholderTextColor="#9CA3AF"
//                   value={requestForm.quantity}
//                   onChangeText={(text) => setRequestForm({...requestForm, quantity: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Item Description</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter description"
//                   placeholderTextColor="#9CA3AF"
//                   value={requestForm.itemDescription}
//                   onChangeText={(text) => setRequestForm({...requestForm, itemDescription: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-6">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
//                 <TextInput
//                   className="h-20 text-sm text-gray-900"
//                   placeholder="Enter notes..."
//                   placeholderTextColor="#9CA3AF"
//                   value={requestForm.notes}
//                   onChangeText={(text) => setRequestForm({...requestForm, notes: text})}
//                   multiline
//                   numberOfLines={4}
//                 />
//               </View>
//             </ScrollView>

//             <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
//               <Text className="text-base font-semibold text-white">Save</Text>
//               <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === PURCHASED MODAL === */}
//       <Modal
//         visible={addMaterialPurchaseModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setAddMaterialPurchaseModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setAddMaterialPurchaseModalVisible(false)}
//         >
//           <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Material Purchase</Text>
//               <TouchableOpacity onPress={() => setAddMaterialPurchaseModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
            
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-sm text-gray-600">{formatDate(purchaseDate)}</Text>
//               <TouchableOpacity onPress={() => setShowPurchaseDatePicker(true)}>
//                 <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
//               </TouchableOpacity>
//             </View>
//             {showPurchaseDatePicker && (
//               <DateTimePicker 
//                 value={purchaseDate} 
//                 mode="date" 
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
//                 onChange={onPurchaseDateChange} 
//               />
//             )}

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter party name"
//                   placeholderTextColor="#9CA3AF"
//                   value={purchaseForm.partyName}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, partyName: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <TouchableOpacity
//                 className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                 onPress={() => {
//                   setAddMaterialPurchaseModalVisible(false);
//                   setMaterialLibraryModalVisible(true);
//                 }}>
//                 <Ionicons name="add" size={20} color="#3B82F6" />
//                 <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//               </TouchableOpacity>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Quantity</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={purchaseForm.quantity}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, quantity: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Amount</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={purchaseForm.amount}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, amount: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Bill To</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter bill to"
//                   placeholderTextColor="#9CA3AF"
//                   value={purchaseForm.billTo}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, billTo: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Advance</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter advance amount"
//                   placeholderTextColor="#9CA3AF"
//                   value={purchaseForm.advance}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, advance: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>

//               <View className="mb-6">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Balance</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={purchaseForm.balance}
//                   onChangeText={(text) => setPurchaseForm({...purchaseForm, balance: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//             </ScrollView>

//             <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
//               <Text className="text-base font-semibold text-white">Save</Text>
//               <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === RECEIVED MODAL === */}
//       <Modal
//         visible={receivedModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setReceivedModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setReceivedModalVisible(false)}
//         >
//           <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-lg font-bold text-gray-900">Material Received</Text>
//               <TouchableOpacity onPress={() => setReceivedModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#6B7280" />
//               </TouchableOpacity>
//             </View>
//             <View className="mb-4 flex-row items-center justify-between">
//               <Text className="text-sm text-gray-600">{formatDate(date)}</Text>
//               <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                 <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
//               </TouchableOpacity>
//             </View>
//             {showDatePicker && (
//               <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
//             )}
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={receivedForm.partyName}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, partyName: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//               <TouchableOpacity
//                 className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
//                 onPress={() => {
//                   setReceivedModalVisible(false);
//                   setMaterialLibraryModalVisible(true);
//                 }}>
//                 <Ionicons name="add" size={20} color="#3B82F6" />
//                 <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
//               </TouchableOpacity>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Test Material</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={receivedForm.materialName}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, materialName: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   placeholder="Enter quantity"
//                   placeholderTextColor="#9CA3AF"
//                   value={receivedForm.quantity}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, quantity: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Challan No.</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={receivedForm.challanNo}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, challanNo: text})}
//                   keyboardType="numeric"
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//               <View className="mb-4">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Vehicle No.</Text>
//                 <TextInput
//                   className="text-base text-gray-900"
//                   value={receivedForm.vehicleNo}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, vehicleNo: text})}
//                 />
//                 <View className="mt-1 h-px bg-gray-300" />
//               </View>
//               <View className="mb-6">
//                 <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
//                 <TextInput
//                   className="h-20 text-sm text-gray-900"
//                   placeholder="Enter notes..."
//                   placeholderTextColor="#9CA3AF"
//                   value={receivedForm.notes}
//                   onChangeText={(text) => setReceivedForm({...receivedForm, notes: text})}
//                   multiline
//                   numberOfLines={4}
//                 />
//               </View>
//             </ScrollView>
//             <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
//               <Text className="text-base font-semibold text-white">Save</Text>
//               <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* === USED MODAL === */}
//       <Modal
//         visible={usedModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setUsedModalVisible(false)}>
//         <TouchableOpacity
//           className="flex-1 justify-end bg-black/50"
//           activeOpacity={1}
//           onPress={() => setUsedModalVisible(false)}
//         >
//           <TouchableOpacity activeOpacity={1} className="bg-white rounded-t-3xl p-5" onPress={() => {}}>
//             <View className="items-center pt-3 pb-2">
//               <View className="h-1 w-10 bg-gray-300 rounded-full" />
//             </View>
//             <Text className="text-lg font-bold text-gray-900 mb-4">Material Used</Text>
//             <View className="flex-row items-center justify-between mb-4">
//               <Text className="text-sm text-gray-600">01-04-25</Text>
//               <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//             </View>
//             <View className="h-px bg-gray-300 mb-4" />
//             <View className="mb-4">
//               <Text className="text-sm font-medium text-gray-700 mb-1">Material</Text>
//               <View className="flex-row items-center justify-between">
//                 <Text className="text-base text-gray-900"></Text>
//                 <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
//               </View>
//               <View className="h-px bg-gray-300 mt-1" />
//             </View>
//             <View className="mb-4">
//               <Text className="text-sm text-gray-500 mb-1">Quantity in numbers</Text>
//               <TextInput
//                 className="text-base text-gray-900"
//                 placeholder="0"
//                 placeholderTextColor="#9CA3AF"
//                 keyboardType="numeric"
//                 value={usedForm.quantity}
//                 onChangeText={(text) => setUsedForm({...usedForm, quantity: text})}
//               />
//               <View className="h-px bg-gray-300 mt-1" />
//             </View>
//             <View className="mb-6">
//               <Text className="text-sm font-medium text-gray-700 mb-1">Notes</Text>
//               <TextInput
//                 className="h-20 text-base text-gray-900"
//                 placeholder="Enter notes..."
//                 placeholderTextColor="#9CA3AF"
//                 multiline
//                 value={usedForm.notes}
//                 onChangeText={(text) => setUsedForm({...usedForm, notes: text})}
//               />
//             </View>
//             <TouchableOpacity className="bg-blue-600 rounded-xl py-3.5 flex-row items-center justify-center">
//               <Text className="text-white font-semibold text-base mr-2">Save</Text>
//               <Ionicons name="checkmark" size={20} color="white" />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//     </SafeAreaView>
//   );
// };

// export default MaterialsListScreen;



import React, { useState, useEffect, useMemo } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

const BASE_URL = 'https://skystruct-lite-backend.vercel.app';
const MATERIALS_API = `${BASE_URL}/api/materials`;
const TOKEN_KEY = 'userToken';

// === Constant arrays ===
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

const MaterialsListScreen = () => {
  const navigation = useNavigation();
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // === Modals ===
  const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
  const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
  const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
  const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
  const [usedModalVisible, setUsedModalVisible] = useState(false);
  const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);

  // === Selection Modals ===
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showGstModal, setShowGstModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [showEditGstModal, setShowEditGstModal] = useState(false);

  // === Dates ===
  const [date, setDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

  // === Forms ===
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

  // === API State ===
  const [inventoryApi, setInventoryApi] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [creatingMaterial, setCreatingMaterial] = useState(false);
  const [updatingMaterial, setUpdatingMaterial] = useState(false);

  // === Static data for non-Inventory tabs ===
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

  // === Date Handlers ===
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

  // === API Functions ===
  const fetchMaterials = async () => {
    try {
      setLoadingInventory(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const res = await fetch(MATERIALS_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      console.log('[Materials] GET status:', res.status);
      console.log('[Materials] GET body:', json);

      if (!res.ok) {
        throw new Error(typeof json === 'object' && json?.message ? json.message : `Failed with ${res.status}`);
      }

      const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
      setInventoryApi(list);
    } catch (err) {
      console.error('[Materials] GET error:', err);
      Alert.alert('Error', 'Failed to fetch materials');
    } finally {
      setLoadingInventory(false);
    }
  };

  // === CREATE NEW MATERIAL API ===
  const createNewMaterial = async () => {
    try {
      if (!newMaterialForm.materialName.trim()) {
        Alert.alert('Error', 'Please enter material name');
        return;
      }

      if (!newMaterialForm.category.trim()) {
        Alert.alert('Error', 'Please select a category');
        return;
      }

      setCreatingMaterial(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      let projectId = await AsyncStorage.getItem("activeProjectId");

      if (!projectId) {
        projectId = "691189346522d6945d920bac";
        await AsyncStorage.setItem("activeProjectId", projectId);
        console.log("[Create Material] ⚙️ Using fallback projectId:", projectId);
      }

      const materialData = {
        name: newMaterialForm.materialName.trim(),
        unit: newMaterialForm.unit,
        gst: parseFloat(newMaterialForm.gst) || 0,
        hsnCode: newMaterialForm.hsnCode.trim(),
        category: newMaterialForm.category,
        description: newMaterialForm.description.trim(),
        quantity: parseFloat(newMaterialForm.quantity) || 0,
        stock: parseFloat(newMaterialForm.stock) || parseFloat(newMaterialForm.quantity) || 0,
        price: parseFloat(newMaterialForm.price) || 0,
        minStock: parseFloat(newMaterialForm.minStock) || 0,
        projectId
      };

      console.log("[Create Material] 🚀 Sending data:", materialData);

      const res = await fetch(`${BASE_URL}/api/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(materialData),
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      console.log("[Create Material] POST status:", res.status);
      console.log("[Create Material] Response:", json);

      if (!res.ok) {
        throw new Error(
          typeof json === "object" && json?.message
            ? json.message
            : `Request failed with ${res.status}`
        );
      }

      Alert.alert("Success", "Material created successfully!");
      setCreateNewMaterialModalVisible(false);

      setNewMaterialForm({
        materialName: "",
        unit: "nos",
        gst: "18.0",
        hsnCode: "",
        category: "",
        quantity: "",
        stock: "",
        price: "",
        minStock: "",
        description: "",
      });

      fetchMaterials();
    } catch (err) {
      console.error("[Create Material] ❌ Error:", err);
      Alert.alert("Error", err.message || "Failed to create material");
    } finally {
      setCreatingMaterial(false);
    }
  };

  // === DELETE MATERIAL API ===
  const deleteMaterial = async (id) => {
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
              const token = await AsyncStorage.getItem(TOKEN_KEY);
              const res = await fetch(`${BASE_URL}/api/materials/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              });

              const text = await res.text();
              let json;
              try { json = JSON.parse(text); } catch { json = text; }

              console.log('[Delete Material] 🗑️ Status:', res.status, json);

              if (!res.ok) throw new Error(json?.message || 'Failed to delete');

              Alert.alert('Deleted', 'Material deleted successfully.');
              fetchMaterials();
            },
          },
        ]
      );
    } catch (err) {
      console.error('[Delete Material] ❌', err);
      Alert.alert('Error', err.message || 'Failed to delete material');
    }
  };

  // === UPDATE MATERIAL API ===
  const updateMaterial = async (id, updatedData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const res = await fetch(`${BASE_URL}/api/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      console.log('[Update Material] ✏️ Status:', res.status, json);

      if (!res.ok) throw new Error(json?.message || 'Failed to update material');

      Alert.alert('Updated', 'Material updated successfully.');
      fetchMaterials();
    } catch (err) {
      console.error('[Update Material] ❌', err);
      Alert.alert('Error', err.message || 'Failed to update material');
    }
  };

  // === EDIT MATERIAL FUNCTIONS ===
  const openEditModal = (material) => {
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
  };

  const handleEditMaterial = async () => {
    try {
      if (!editMaterialForm.materialName.trim()) {
        Alert.alert('Error', 'Please enter material name');
        return;
      }

      if (!editMaterialForm.category.trim()) {
        Alert.alert('Error', 'Please select a category');
        return;
      }

      setUpdatingMaterial(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      let projectId = await AsyncStorage.getItem("activeProjectId");

      if (!projectId) {
        projectId = "691189346522d6945d920bac";
        await AsyncStorage.setItem("activeProjectId", projectId);
      }

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
        projectId
      };

      console.log("[Edit Material] 🚀 Sending data:", materialData);

      const res = await fetch(`${BASE_URL}/api/materials/${editMaterialForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(materialData),
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      console.log("[Edit Material] PUT status:", res.status);
      console.log("[Edit Material] Response:", json);

      if (!res.ok) {
        throw new Error(
          typeof json === "object" && json?.message
            ? json.message
            : `Request failed with ${res.status}`
        );
      }

      Alert.alert("Success", "Material updated successfully!");
      setEditMaterialModalVisible(false);
      fetchMaterials();
    } catch (err) {
      console.error("[Edit Material] ❌ Error:", err);
      Alert.alert("Error", err.message || "Failed to update material");
    } finally {
      setUpdatingMaterial(false);
    }
  };

  const selectEditCategory = (category) => {
    setEditMaterialForm({...editMaterialForm, category});
    setShowEditCategoryModal(false);
  };

  const selectEditUnit = (unit) => {
    setEditMaterialForm({...editMaterialForm, unit});
    setShowEditUnitModal(false);
  };

  const selectEditGst = (gst) => {
    setEditMaterialForm({...editMaterialForm, gst});
    setShowEditGstModal(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const formatItemDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: undefined }).replace(',', '');
  };

  const mappedInventory = useMemo(() => {
    return (inventoryApi || []).map((m) => {
      const id = m._id || m.id || String(Math.random());
      return {
        _id: id,
        name: m.name || m.title || 'Unknown Material',
        date: formatItemDate(m.createdAt || m.updatedAt || new Date()),
        stock: typeof m.stock === 'number' 
          ? m.stock 
          : (typeof m.quantity === 'number' ? m.quantity : 0),
        unit: m.unit || 'nos',
        __raw: m,
      };
    });
  }, [inventoryApi]);

  const filteredInventory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mappedInventory;
    return mappedInventory.filter((item) => item.name.toLowerCase().includes(q));
  }, [mappedInventory, searchQuery]);

  const filteredLibrary = materialLibraryData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectCategory = (category) => {
    setNewMaterialForm({...newMaterialForm, category});
    setShowCategoryModal(false);
  };

  const selectUnit = (unit) => {
    setNewMaterialForm({...newMaterialForm, unit});
    setShowUnitModal(false);
  };

  const selectGst = (gst) => {
    setNewMaterialForm({...newMaterialForm, gst});
    setShowGstModal(false);
  };

  const toggleMaterial = (id) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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

  // === Swipeable Right Actions (Delete) ===
  const renderRightActions = (item) => (
    <View className="bg-red-500 justify-center items-center w-[80px] rounded-r-xl mb-2">
      <TouchableOpacity
        className="flex-1 justify-center items-center w-full"
        onPress={() => deleteMaterial(item._id)}
      >
        <Ionicons name="trash" size={22} color="white" />
        <Text className="text-white text-xs mt-1">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // === Inventory Item Renderer ===
  const renderInventoryItem = ({ item }) => (
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
            {loadingInventory ? '...' : `${item.stock} ${item.unit}`}
          </Text>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
          >
            <Text className="text-xs text-blue-600 mt-2">Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderRequestItem = ({ item }) => (
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
          <Text className="text-sm font-semibold text-gray-900">{item.qty}</Text>
          <View className="mt-1 rounded bg-orange-100 px-2 py-1">
            <Text className="text-xs font-medium text-orange-700">{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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

  const renderContent = () => {
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

      {/* === MATERIAL LIBRARY MODAL === */}
      <Modal
        visible={materialLibraryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMaterialLibraryModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setMaterialLibraryModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="max-h-[90%] rounded-t-3xl bg-white p-5"
            onPress={() => {}}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Material Library</Text>
              <TouchableOpacity onPress={() => setMaterialLibraryModalVisible(false)}>
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
              />
            </View>

            <FlatList
              data={filteredLibrary}
              renderItem={renderLibraryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
            />

            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
              onPress={() => {
                setMaterialLibraryModalVisible(false);
                setCreateNewMaterialModalVisible(true);
              }}
            >
              <Ionicons name="add" size={20} color="#3B82F6" />
              <Text className="ml-1 font-medium text-blue-600">Create New Material</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-3 flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5"
              onPress={() => setMaterialLibraryModalVisible(false)}
            >
              <Text className="text-base font-semibold text-white">Add Selected</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === CREATE NEW MATERIAL MODAL === */}
      <Modal
        visible={createNewMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            className="h-[85%] rounded-t-3xl bg-white p-5" 
            onPress={() => {}}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Create New Material</Text>
              <TouchableOpacity 
                onPress={() => !creatingMaterial && setCreateNewMaterialModalVisible(false)}
                disabled={creatingMaterial}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Material Name Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter material name"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.materialName}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, materialName: text})}
                  editable={!creatingMaterial}
                />
              </View>

              {/* Unit Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !creatingMaterial && setShowUnitModal(true)}
                  disabled={creatingMaterial}
                >
                  <Text className={`text-base ${newMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
                    {newMaterialForm.unit || 'Select unit'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* GST Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !creatingMaterial && setShowGstModal(true)}
                  disabled={creatingMaterial}
                >
                  <Text className="text-base text-gray-900">{newMaterialForm.gst}%</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* HSN Code Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter HSN/SAC code"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.hsnCode}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, hsnCode: text})}
                  editable={!creatingMaterial}
                  keyboardType="numeric"
                />
              </View>

              {/* Category Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !creatingMaterial && setShowCategoryModal(true)}
                  disabled={creatingMaterial}
                >
                  <Text className={`text-base ${newMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
                    {newMaterialForm.category || 'Select category'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Quantity Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.quantity}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, quantity: text})}
                  keyboardType="numeric"
                  editable={!creatingMaterial}
                />
              </View>

              {/* Stock Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Current Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter current stock"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.stock}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, stock: text})}
                  keyboardType="numeric"
                  editable={!creatingMaterial}
                />
              </View>

              {/* Price Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Price</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter price"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.price}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, price: text})}
                  keyboardType="numeric"
                  editable={!creatingMaterial}
                />
              </View>

              {/* Minimum Stock Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Minimum Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter minimum stock"
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.minStock}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, minStock: text})}
                  keyboardType="numeric"
                  editable={!creatingMaterial}
                />
              </View>

              {/* Description Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter description..."
                  placeholderTextColor="#9CA3AF"
                  value={newMaterialForm.description}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, description: text})}
                  multiline
                  editable={!creatingMaterial}
                  textAlignVertical="top"
                  numberOfLines={5}
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              className={`flex-row items-center justify-center rounded-xl py-4 ${
                creatingMaterial ? 'bg-blue-400' : 'bg-blue-600'
              } mt-4`}
              onPress={createNewMaterial}
              disabled={creatingMaterial}
            >
              {creatingMaterial ? (
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
        onRequestClose={() => !updatingMaterial && setEditMaterialModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => !updatingMaterial && setEditMaterialModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            className="h-[85%] rounded-t-3xl bg-white p-5" 
            onPress={() => {}}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Edit Material</Text>
              <TouchableOpacity 
                onPress={() => !updatingMaterial && setEditMaterialModalVisible(false)}
                disabled={updatingMaterial}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Material Name Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Material Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter material name"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.materialName}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, materialName: text})}
                  editable={!updatingMaterial}
                />
              </View>

              {/* Unit Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !updatingMaterial && setShowEditUnitModal(true)}
                  disabled={updatingMaterial}
                >
                  <Text className={`text-base ${editMaterialForm.unit ? 'text-gray-900' : 'text-gray-400'}`}>
                    {editMaterialForm.unit || 'Select unit'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* GST Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">GST % *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !updatingMaterial && setShowEditGstModal(true)}
                  disabled={updatingMaterial}
                >
                  <Text className="text-base text-gray-900">{editMaterialForm.gst}%</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* HSN Code Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN/SAC Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter HSN/SAC code"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.hsnCode}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, hsnCode: text})}
                  editable={!updatingMaterial}
                  keyboardType="numeric"
                />
              </View>

              {/* Category Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Category *</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => !updatingMaterial && setShowEditCategoryModal(true)}
                  disabled={updatingMaterial}
                >
                  <Text className={`text-base ${editMaterialForm.category ? 'text-gray-900' : 'text-gray-400'}`}>
                    {editMaterialForm.category || 'Select category'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Quantity Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.quantity}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, quantity: text})}
                  keyboardType="numeric"
                  editable={!updatingMaterial}
                />
              </View>

              {/* Stock Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Current Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter current stock"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.stock}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, stock: text})}
                  keyboardType="numeric"
                  editable={!updatingMaterial}
                />
              </View>

              {/* Price Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Price</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter price"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.price}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, price: text})}
                  keyboardType="numeric"
                  editable={!updatingMaterial}
                />
              </View>

              {/* Minimum Stock Field */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Minimum Stock</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter minimum stock"
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.minStock}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, minStock: text})}
                  keyboardType="numeric"
                  editable={!updatingMaterial}
                />
              </View>

              {/* Description Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Description</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter description..."
                  placeholderTextColor="#9CA3AF"
                  value={editMaterialForm.description}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, description: text})}
                  multiline
                  editable={!updatingMaterial}
                  textAlignVertical="top"
                  numberOfLines={5}
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              className={`flex-row items-center justify-center rounded-xl py-4 ${
                updatingMaterial ? 'bg-blue-400' : 'bg-blue-600'
              } mt-4`}
              onPress={handleEditMaterial}
              disabled={updatingMaterial}
            >
              {updatingMaterial ? (
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

      {/* === REQUEST MATERIAL MODAL === */}
      <Modal
        visible={requestMaterialModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRequestMaterialModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setRequestMaterialModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Material Request</Text>
              <TouchableOpacity onPress={() => setRequestMaterialModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">MR Number</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={requestForm.mrNumber}
                  onChangeText={(text) => setRequestForm({...requestForm, mrNumber: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Date</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-gray-900">{requestForm.date}</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => {
                  setRequestMaterialModalVisible(false);
                  setMaterialLibraryModalVisible(true);
                }}>
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Material Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={requestForm.materialName}
                  onChangeText={(text) => setRequestForm({...requestForm, materialName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Enter Quantity</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter quantity"
                  placeholderTextColor="#9CA3AF"
                  value={requestForm.quantity}
                  onChangeText={(text) => setRequestForm({...requestForm, quantity: text})}
                  keyboardType="numeric"
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
                  onChangeText={(text) => setRequestForm({...requestForm, itemDescription: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-sm font-medium text-gray-700">Notes</Text>
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

            <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
              <Text className="text-base font-semibold text-white">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* === PURCHASED MODAL === */}
      <Modal
        visible={addMaterialPurchaseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddMaterialPurchaseModalVisible(false)}>
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setAddMaterialPurchaseModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Material Purchase</Text>
              <TouchableOpacity onPress={() => setAddMaterialPurchaseModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
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

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Party Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter party name"
                  placeholderTextColor="#9CA3AF"
                  value={purchaseForm.partyName}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, partyName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => {
                  setAddMaterialPurchaseModalVisible(false);
                  setMaterialLibraryModalVisible(true);
                }}>
                <Ionicons name="add" size={20} color="#3B82F6" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Quantity</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={purchaseForm.quantity}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, quantity: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Amount</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={purchaseForm.amount}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, amount: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Bill To</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter bill to"
                  placeholderTextColor="#9CA3AF"
                  value={purchaseForm.billTo}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, billTo: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Advance</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter advance amount"
                  placeholderTextColor="#9CA3AF"
                  value={purchaseForm.advance}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, advance: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-sm font-medium text-gray-700">Balance</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={purchaseForm.balance}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, balance: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
            </ScrollView>

            <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5">
              <Text className="text-base font-semibold text-white">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
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
                onPress={() => {
                  setReceivedModalVisible(false);
                  setMaterialLibraryModalVisible(true);
                }}>
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