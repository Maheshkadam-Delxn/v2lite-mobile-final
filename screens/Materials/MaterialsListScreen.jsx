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
//               <Ionicons name="add" size={20} color="#0066FF" />
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
//                     <Ionicons name="calendar-outline" size={20} color="#0066FF" />
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
//                 <Ionicons name="add" size={20} color="#0066FF" />
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
//                 <Ionicons name="calendar-outline" size={20} color="#0066FF" />
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
//                 <Ionicons name="add" size={20} color="#0066FF" />
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
//                 <Ionicons name="calendar-outline" size={20} color="#0066FF" />
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
//                 <Ionicons name="add" size={20} color="#0066FF" />
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




import React from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from 'components/Header';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { useState, useEffect, useMemo, useCallback } from 'react';

const BASE_URL = `${process.env.BASE_API_URL}`;
const MATERIALS_API = `${BASE_URL}/api/materials`;
const TOKEN_KEY = 'userToken';

const subTabs = [
  { id: 'Inventory', label: 'Inventory' },
  { id: 'Request', label: 'Request' },
  { id: 'Received', label: 'Received' },
  { id: 'Used', label: 'Used' },
];

const statusOptions = ['pending', 'approved', 'rejected'];

const MaterialsListScreen = ({project}) => {


  console.log("this is id",project._id);
  const navigation = useNavigation();
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [materialActionModalVisible, setMaterialActionModalVisible] = useState(false);
  const [receivedModalVisible, setReceivedModalVisible] = useState(false);
  const [materialLibraryModalVisible, setMaterialLibraryModalVisible] = useState(false);
  const [createNewMaterialModalVisible, setCreateNewMaterialModalVisible] = useState(false);
  const [requestMaterialModalVisible, setRequestMaterialModalVisible] = useState(false);
  const [addMaterialPurchaseModalVisible, setAddMaterialPurchaseModalVisible] = useState(false);
  const [usedModalVisible, setUsedModalVisible] = useState(false);
  const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);

  // Selection Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  // Dates
  const [date, setDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);

  // Forms aligned with schema
  const [receivedForm, setReceivedForm] = useState({
    materialId: '',
    quantity: '',
    vendorName: '',
    challanNo: '',
    vehicleNo: '',
    remarks: ''
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    name: '',
    unit: 'nos',
    quantity: '',
    vendorName: '',
    hsnCode: '',
    remarks: '',
    status: 'pending',
    boqItemId: ''
  });

  const [editMaterialForm, setEditMaterialForm] = useState({
    id: '',
    name: '',
    unit: 'nos',
    quantity: '',
    vendorName: '',
    hsnCode: '',
    remarks: '',
    status: 'pending',
    boqItemId: ''
  });

  const [requestForm, setRequestForm] = useState({
    mrNumber: '',
    date: new Date().toISOString().split('T')[0],
    materialName: '',
    quantity: '',
    itemDescription: '',
    remarks: ''
  });

  const [purchaseForm, setPurchaseForm] = useState({
    materialId: '',
    quantity: '',
    vendorName: '',
    amount: '',
    billTo: '',
    advance: '',
    balance: '',
    invoiceUrl: ''
  });

  const [usedForm, setUsedForm] = useState({
    date: new Date().toISOString().split('T')[0],
    materialId: '',
    quantity: '',
    remarks: ''
  });

  // API State
  const [materials, setMaterials] = useState([]);
  const [libraryMaterials, setLibraryMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Static data for non-dynamic tabs (to be replaced if APIs provided)
  const [requestData, setRequestData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [usedData, setUsedData] = useState([]);

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // Date Handlers
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

  const formatDate = (dateObj) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options).replace(',', '');
  };

  // API Helper - Use the project prop directly
const apiCall = useCallback(async (endpoint, options = {}, useProjectId = true) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
    
    // Add project ID to the endpoint if needed
    let finalEndpoint = endpoint;
    if (useProjectId && project?._id) {
      const separator = endpoint.includes('?') ? '&' : '?';
      finalEndpoint = `${endpoint}${separator}projectId=${project._id}`;
    }
    
    const res = await fetch(finalEndpoint, config);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }
    if (!res.ok) {
      throw new Error(json?.message || `HTTP ${res.status}`);
    }
    return json;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    Alert.alert('Error', err.message || 'Network error');
    throw err;
  }
}, [project?._id]); // Add project._id as dependency


// Helper to get project ID - use the prop directly
const getProjectId = useCallback(() => {
  try {
    if (!project?._id) {
      throw new Error('No project selected');
    }
    return project._id;
  } catch (error) {
    console.error('Error getting project ID:', error);
    Alert.alert('Project Required', 'Project not found');
    return null;
  }
}, [project?._id]);

// Fetch Materials (for Inventory and Library)
const fetchMaterials = useCallback(async (query = '') => {
  setLoading(true);
  try {
    let url = `${MATERIALS_API}?search=${encodeURIComponent(query)}`;
    // Add project ID to URL
    if (project?._id) {
      url += `&projectId=${project._id}`;
    }
    const data = await apiCall(url, {}, false); // Don't auto-add projectId since we already added it
    const list = Array.isArray(data) ? data : data?.data || [];
    setMaterials(list);
    setLibraryMaterials(list.filter(item => item.status === 'approved')); // Only approved for library
  } catch (err) {
    console.error('Fetch Materials Error:', err);
  } finally {
    setLoading(false);
  }
}, [apiCall, project?._id]);

// Create Material
const createNewMaterial = useCallback(async () => {
  if (!newMaterialForm.name.trim() || !newMaterialForm.quantity) {
    Alert.alert('Validation Error', 'Name and quantity are required');
    return;
  }
  setCreating(true);
  try {
    // Use project._id directly from props
    if (!project?._id) {
      Alert.alert('Error', 'No project selected');
      setCreating(false);
      return;
    }
    
    const payload = {
      projectId: project._id, // Use project._id from props
      name: newMaterialForm.name.trim(),
      unit: newMaterialForm.unit,
      quantity: parseFloat(newMaterialForm.quantity) || 0,
      vendorName: newMaterialForm.vendorName || '',
      hsnCode: newMaterialForm.hsnCode || '',
      remarks: newMaterialForm.remarks || '',
      status: newMaterialForm.status,
      boqItemId: newMaterialForm.boqItemId || null,
      purchaseDate: new Date().toISOString(),
    };
    
    const response = await apiCall(MATERIALS_API, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false); // Don't auto-add projectId to URL since we're sending it in body
    
    Alert.alert('Success', 'Material created successfully');
    setCreateNewMaterialModalVisible(false);
    setMaterialLibraryModalVisible(true); // Go back to library modal
    
    // Reset form
    setNewMaterialForm({
      name: '',
      unit: 'nos',
      quantity: '',
      vendorName: '',
      hsnCode: '',
      remarks: '',
      status: 'pending',
      boqItemId: ''
    });
    
    // Refresh materials list
    fetchMaterials(searchQuery);
    
    // Auto-select the newly created material
    if (response && response._id) {
      setSelectedMaterials(prev => [...prev, response._id]);
    }
    
  } catch (err) {
    console.error('Create Error:', err);
    Alert.alert('Error', err.message || 'Failed to create material');
  } finally {
    setCreating(false);
  }
}, [newMaterialForm, project, apiCall, searchQuery, fetchMaterials]);

  // Edit Material
  const handleEditMaterial = useCallback(async () => {
    if (!editMaterialForm.name.trim() || !editMaterialForm.quantity) {
      Alert.alert('Validation Error', 'Name and quantity are required');
      return;
    }
    setUpdating(true);
    try {
      const payload = {
        name: editMaterialForm.name.trim(),
        unit: editMaterialForm.unit,
        quantity: parseFloat(editMaterialForm.quantity) || 0,
        vendorName: editMaterialForm.vendorName || '',
        hsnCode: editMaterialForm.hsnCode || '',
        remarks: editMaterialForm.remarks || '',
        status: editMaterialForm.status,
        boqItemId: editMaterialForm.boqItemId || null,
      };
      await apiCall(`${MATERIALS_API}/${editMaterialForm.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      Alert.alert('Success', 'Material updated successfully');
      setEditMaterialModalVisible(false);
      fetchMaterials(searchQuery);
    } catch (err) {
      console.error('Update Error:', err);
    } finally {
      setUpdating(false);
    }
  }, [editMaterialForm, apiCall, searchQuery, fetchMaterials]);

  // Delete Material
  const handleDeleteMaterial = useCallback(async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await apiCall(`${MATERIALS_API}/${id}`, { method: 'DELETE' });
            Alert.alert('Success', 'Material deleted');
            fetchMaterials(searchQuery);
          } catch (err) {
            console.error('Delete Error:', err);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }, [apiCall, searchQuery, fetchMaterials]);

  // Update Inventory (for Received/Used)
  const updateInventory = useCallback(async (materialId, deltaQuantity, type = 'received') => {
    setLoading(true);
    try {
      const payload = { 
        materialId, 
        quantity: deltaQuantity, 
        type,
        remarks: type === 'received' ? receivedForm.remarks : usedForm.remarks,
        vendorName: type === 'received' ? receivedForm.vendorName : undefined,
      };
      await apiCall(`${MATERIALS_API}/inventory`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      Alert.alert('Success', `${type === 'received' ? '+' : '-'} Updated successfully`);
      fetchMaterials(searchQuery);
      if (type === 'received') setReceivedModalVisible(false);
      if (type === 'used') setUsedModalVisible(false);
    } catch (err) {
      console.error('Inventory Update Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, searchQuery, fetchMaterials, receivedForm, usedForm]);

// Update Purchase
const updatePurchase = useCallback(async () => {
  if (!purchaseForm.materialId || !purchaseForm.quantity) {
    Alert.alert('Validation Error', 'Material and quantity required');
    return;
  }
  setLoading(true);
  try {
    if (!project?._id) {
      Alert.alert('Error', 'No project selected');
      setLoading(false);
      return;
    }
    
    const payload = {
      materialId: purchaseForm.materialId,
      projectId: project._id, // Use project._id from props
      quantity: parseFloat(purchaseForm.quantity),
      vendorName: purchaseForm.vendorName,
      purchaseDate: purchaseDate.toISOString(),
      invoiceUrl: purchaseForm.invoiceUrl || '',
      remarks: `Amount: ${purchaseForm.amount}, Bill To: ${purchaseForm.billTo}, Advance: ${purchaseForm.advance}, Balance: ${purchaseForm.balance}`,
    };
    
    await apiCall(`${MATERIALS_API}/purchase`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, false); // Don't auto-add projectId
    
    Alert.alert('Success', 'Purchase recorded');
    setAddMaterialPurchaseModalVisible(false);
    setPurchaseForm({
      materialId: '',
      quantity: '',
      vendorName: '',
      amount: '',
      billTo: '',
      advance: '',
      balance: '',
      invoiceUrl: ''
    });
    fetchMaterials(searchQuery);
  } catch (err) {
    console.error('Purchase Error:', err);
  } finally {
    setLoading(false);
  }
}, [purchaseForm, purchaseDate, project, apiCall, searchQuery, fetchMaterials]);

// For Request: Placeholder, map to create with status 'pending'
const saveRequest = useCallback(async () => {
  if (!requestForm.materialName || !requestForm.quantity) {
    Alert.alert('Validation Error', 'Material and quantity required');
    return;
  }
  
  setLoading(true);
  try {
    if (!project?._id) {
      Alert.alert('Error', 'No project selected');
      setLoading(false);
      return;
    }
    
    const payload = {
      projectId: project._id, // Use project._id from props
      name: requestForm.materialName,
      quantity: parseFloat(requestForm.quantity),
      remarks: `MR: ${requestForm.mrNumber}, Date: ${requestForm.date}, Description: ${requestForm.itemDescription}, Notes: ${requestForm.notes}`,
      status: 'pending',
    };
    
    await apiCall(MATERIALS_API, { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    }, false); // Don't auto-add projectId
    
    Alert.alert('Success', 'Request created');
    setRequestMaterialModalVisible(false);
    
    // Reset form
    setRequestForm({
      mrNumber: '',
      date: new Date().toISOString().split('T')[0],
      materialName: '',
      quantity: '',
      itemDescription: '',
      notes: ''
    });
    
    fetchMaterials(searchQuery);
    
  } catch (err) {
    console.error('Request Error:', err);
  } finally {
    setLoading(false);
  }
}, [requestForm, project, apiCall, searchQuery, fetchMaterials]);

  // Selection Handlers for Status
  const selectStatus = (status) => {
    setNewMaterialForm({ ...newMaterialForm, status });
    setShowStatusModal(false);
  };

  const selectEditStatus = (status) => {
    setEditMaterialForm({ ...editMaterialForm, status });
    setShowEditStatusModal(false);
  };

  // Effects
  useEffect(() => {
    fetchMaterials(searchQuery);
  }, [fetchMaterials, searchQuery]);

  useEffect(() => {
    // Placeholder fetches for other tabs - replace with actual APIs if provided
    setRequestData([]); // GET /requests
    setReceivedData([]); // GET /received
    setUsedData([]); // GET /used
  }, []);

  // Filtered data
  const filteredInventory = useMemo(() => 
    materials.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [materials, searchQuery]);

  const filteredLibrary = useMemo(() => 
    libraryMaterials.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [libraryMaterials, searchQuery]);

  // Renderers
  const renderSubTab = ({ item }) => (
    <TouchableOpacity
      className={`mx-1.5 px-4 py-1.5 ${activeSubTab === item.id ? 'border-b-2 border-blue-500' : ''}`}
      onPress={() => setActiveSubTab(item.id)}
    >
      <Text className={`text-sm font-medium ${activeSubTab === item.id ? 'text-blue-500' : 'text-gray-600'}`}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const RightActions = (progress, dragX, itemId) => {
    const scale = 1 - dragX / 75;
    return (
      <TouchableOpacity
        className="bg-red-500 justify-center items-center w-20"
        onPress={() => handleDeleteMaterial(itemId)}
      >
        <Ionicons name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const renderInventoryItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => RightActions(progress, dragX, item._id)}>
      <TouchableOpacity
        className="mb-2 rounded-xl bg-white p-3"
        onPress={() => {
          openEditModal(item);
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
              <Text className="mt-0.5 text-sm text-gray-500">Vendor: {item.vendorName || 'N/A'}</Text>
              <Text className="mt-0.5 text-xs text-gray-400">Status: {item.status}</Text>
            </View>
          </View>
          <Text className="text-base font-semibold text-gray-900">{item.quantity || 0} {item.unit}</Text>
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
            <Text className="text-sm text-gray-500">{formatDate(new Date(item.createdAt))}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-gray-900">{item.quantity} {item.unit}</Text>
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
            <Text className="text-sm text-gray-500">{formatDate(new Date(item.purchaseDate || item.createdAt))}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
            <Text className="mt-1 text-xs text-gray-500">{item.vendorName}</Text>
          </View>
        </View>
        <Text className="text-sm font-medium text-green-600">+{item.quantity} {item.unit}</Text>
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
            <Text className="text-sm text-gray-500">{formatDate(new Date(item.createdAt))}</Text>
            <Text className="mt-0.5 text-base font-semibold text-gray-900">{item.name}</Text>
          </View>
        </View>
        <Text className="text-sm font-medium text-red-600">-{item.quantity} {item.unit}</Text>
      </View>
    </View>
  );

  const renderLibraryItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center border-b border-gray-200 py-3"
      onPress={() => {
        setSelectedMaterials(prev => 
          prev.includes(item._id) ? prev.filter(x => x !== item._id) : [...prev, item._id]
        );
      }}
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
        <Text className="mt-0.5 text-xs text-gray-500">Vendor: {item.vendorName}</Text>
      </View>
      <Text className="mr-3 text-sm text-gray-600">Unit: {item.unit}</Text>
      <View className="h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500">
        {selectedMaterials.includes(item._id) && (
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
            <Text className="text-sm font-semibold text-gray-600">Quantity</Text>
          </View>
          {loading ? (
            <ActivityIndicator className="my-4" size="large" color="#0066FF" />
          ) : (
            <GestureHandlerRootView>
              <FlatList
                data={filteredInventory}
                renderItem={renderInventoryItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              />
            </GestureHandlerRootView>
          )}
        </>
      );
    }

    if (activeSubTab === 'Request') {
      return (
        <FlatList
          data={requestData}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item._id || item.id}
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
          keyExtractor={(item) => item._id || item.id}
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
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return null;
  };

  // Handle Library Add (placeholder - integrate with forms)
  const addSelectedFromLibrary = () => {
    if (selectedMaterials.length === 0) {
      Alert.alert('No Selection', 'Please select materials');
      return;
    }
    // Logic to populate form with selected, e.g., for request/received
    Alert.alert('Added', `${selectedMaterials.length} materials selected`);
    setSelectedMaterials([]);
    setMaterialLibraryModalVisible(false);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditMaterialForm({
      id: item._id,
      name: item.name || '',
      unit: item.unit || 'nos',
      quantity: item.quantity?.toString() || '',
      vendorName: item.vendorName || '',
      hsnCode: item.hsnCode || '',
      remarks: item.remarks || '',
      status: item.status || 'pending',
      boqItemId: item.boqItemId || ''
    });
    setEditMaterialModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header - assuming it's there */}
      {/* <Header /> */}

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

      {/* Search */}
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

      {/* Content */}
      <View className="flex-1">{renderContent()}</View>

      {/* Bottom Buttons */}
      <View className="absolute inset-x-0 bottom-16 left-4 right-4 flex-row items-center justify-between px-2" style={{ zIndex: 10 }}>
        <TouchableOpacity 
          className="mx-1 flex-1 rounded-xl bg-red-50 px-4 py-2.5"
          onPress={() => setUsedModalVisible(true)}
          disabled={loading}
        >
          <Text className="text-center text-sm font-semibold text-red-500">- Used</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-blue-100 px-5 py-2.5"
          onPress={() => setMaterialActionModalVisible(true)}
          disabled={loading}
        >
          <Text className="text-center text-sm font-semibold text-gray-900">+ Material</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-1 flex-1 rounded-xl bg-amber-100 px-4 py-2.5"
          onPress={() => setReceivedModalVisible(true)}
          disabled={loading}
        >
          <Text className="text-center text-sm font-semibold text-gray-900">+ Received</Text>
        </TouchableOpacity>
      </View>

      {/* Action Modal */}
      <Modal visible={materialActionModalVisible} transparent animationType="slide" onRequestClose={() => setMaterialActionModalVisible(false)}>
        <TouchableOpacity className="flex-1 justify-end bg-black/50" activeOpacity={1} onPress={() => setMaterialActionModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} className="h-[40%] rounded-t-3xl bg-white p-6 pb-10" onPress={() => {}}>
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
    
    // Reset request form first
    setRequestForm({
      mrNumber: '',
      date: new Date().toISOString().split('T')[0],
      materialName: '',
      quantity: '',
      itemDescription: '',
      notes: ''
    });
    
    // Check if project is available
    if (project?._id) {
      setRequestMaterialModalVisible(true);
    } else {
      Alert.alert('Error', 'No project selected');
    }
  }}
>
  <Text className="text-center text-base font-semibold text-blue-600">+ Request</Text>
</TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-2xl bg-green-50 px-5 py-4"
                  onPress={() => { setMaterialActionModalVisible(false); setReceivedModalVisible(true); }}
                >
                  <Text className="text-center text-base font-semibold text-green-600">+ Received</Text>
                </TouchableOpacity>
              </View>
              <View className="mb-5 flex-row space-x-6">
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-cyan-50 px-5 py-4"
                  onPress={() => { setMaterialActionModalVisible(false); setAddMaterialPurchaseModalVisible(true); }}
                >
                  <Text className="text-center text-base font-semibold text-cyan-600">+ Purchased</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 rounded-2xl bg-red-50 px-5 py-4"
                  onPress={() => { setMaterialActionModalVisible(false); setUsedModalVisible(true); }}
                >
                  <Text className="text-center text-base font-semibold text-red-600">- Used</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Material Library Modal */}
      <Modal visible={materialLibraryModalVisible} transparent animationType="slide" onRequestClose={() => setMaterialLibraryModalVisible(false)}>
        <TouchableOpacity className="flex-1 justify-end bg-black/50" activeOpacity={1} onPress={() => setMaterialLibraryModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} className="max-h-[90%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
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
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
            />
            <TouchableOpacity
  className="mt-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
  onPress={() => {
    // Reset the form first
    setNewMaterialForm({
      name: '',
      unit: 'nos',
      quantity: '',
      vendorName: '',
      hsnCode: '',
      remarks: '',
      status: 'pending',
      boqItemId: ''
    });
    // Close library modal and open create modal
    setMaterialLibraryModalVisible(false);
    setCreateNewMaterialModalVisible(true);
  }}
>
  <Ionicons name="add" size={20} color="#0066FF" />
  <Text className="ml-1 font-medium text-blue-600">Create New Material</Text>
</TouchableOpacity>
            <TouchableOpacity 
              className="mt-3 flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5"
              onPress={addSelectedFromLibrary}
            >
              <Text className="text-base font-semibold text-white">Add Selected</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Create New Material Modal */}
      <Modal visible={createNewMaterialModalVisible} transparent animationType="slide" onRequestClose={() => setCreateNewMaterialModalVisible(false)}>
        <TouchableOpacity className="flex-1 justify-end bg-black/50" activeOpacity={1} onPress={() => setCreateNewMaterialModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} className="h-[85%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Create New Material</Text>
              <TouchableOpacity onPress={() => setCreateNewMaterialModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter name"
                  value={newMaterialForm.name}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, name: text})}
                  editable={!creating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter unit"
                  value={newMaterialForm.unit}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, unit: text})}
                  editable={!creating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter quantity"
                  value={newMaterialForm.quantity}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, quantity: text})}
                  keyboardType="numeric"
                  editable={!creating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Vendor Name</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter vendor name"
                  value={newMaterialForm.vendorName}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, vendorName: text})}
                  editable={!creating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter HSN code"
                  value={newMaterialForm.hsnCode}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, hsnCode: text})}
                  editable={!creating}
                  keyboardType="numeric"
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">BOQ Item ID</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter BOQ item ID"
                  value={newMaterialForm.boqItemId}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, boqItemId: text})}
                  editable={!creating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Status</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => setShowStatusModal(true)}
                  disabled={creating}
                >
                  <Text className="text-base text-gray-900">{newMaterialForm.status}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Remarks</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  placeholder="Enter remarks..."
                  value={newMaterialForm.remarks}
                  onChangeText={(text) => setNewMaterialForm({...newMaterialForm, remarks: text})}
                  multiline
                  editable={!creating}
                />
              </View>
            </ScrollView>
            <TouchableOpacity 
              className={`flex-row items-center justify-center rounded-xl py-4 ${creating ? 'bg-blue-400' : 'bg-blue-600'} mt-4`}
              onPress={createNewMaterial}
              disabled={creating}
            >
              {creating ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-base font-semibold text-white">Create Material</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Edit Material Modal */}
      <Modal visible={editMaterialModalVisible} transparent animationType="slide" onRequestClose={() => setEditMaterialModalVisible(false)}>
        <TouchableOpacity className="flex-1 justify-end bg-black/50" activeOpacity={1} onPress={() => setEditMaterialModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} className="h-[85%] rounded-t-3xl bg-white p-5" onPress={() => {}}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">Edit Material</Text>
              <TouchableOpacity onPress={() => setEditMaterialModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Name *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.name}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, name: text})}
                  editable={!updating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Unit</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.unit}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, unit: text})}
                  editable={!updating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Quantity *</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.quantity}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, quantity: text})}
                  keyboardType="numeric"
                  editable={!updating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Vendor Name</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.vendorName}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, vendorName: text})}
                  editable={!updating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">HSN Code</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.hsnCode}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, hsnCode: text})}
                  editable={!updating}
                  keyboardType="numeric"
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">BOQ Item ID</Text>
                <TextInput
                  className="text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.boqItemId}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, boqItemId: text})}
                  editable={!updating}
                />
              </View>
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">Status</Text>
                <TouchableOpacity 
                  className="flex-row items-center justify-between p-4 border border-gray-300 rounded-xl"
                  onPress={() => setShowEditStatusModal(true)}
                  disabled={updating}
                >
                  <Text className="text-base text-gray-900">{editMaterialForm.status}</Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <View className="mb-6">
                <Text className="mb-2 text-sm font-medium text-gray-700">Remarks</Text>
                <TextInput
                  className="h-32 text-base text-gray-900 p-4 border border-gray-300 rounded-xl"
                  value={editMaterialForm.remarks}
                  onChangeText={(text) => setEditMaterialForm({...editMaterialForm, remarks: text})}
                  multiline
                  editable={!updating}
                />
              </View>
            </ScrollView>
            <TouchableOpacity 
              className={`flex-row items-center justify-center rounded-xl py-4 ${updating ? 'bg-blue-400' : 'bg-blue-600'} mt-4`}
              onPress={handleEditMaterial}
              disabled={updating}
            >
              {updating ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-base font-semibold text-white">Update Material</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Status Selection Modal for Create */}
      <Modal visible={showStatusModal} transparent animationType="slide" onRequestClose={() => setShowStatusModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity className="py-4 border-b border-gray-200" onPress={() => selectStatus(item)}>
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Status Selection Modal for Edit */}
      <Modal visible={showEditStatusModal} transparent animationType="slide" onRequestClose={() => setShowEditStatusModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-1/2 bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Select Status</Text>
              <TouchableOpacity onPress={() => setShowEditStatusModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity className="py-4 border-b border-gray-200" onPress={() => selectEditStatus(item)}>
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Request Modal */}
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
                    <Ionicons name="calendar-outline" size={20} color="#0066FF" />
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
                <Ionicons name="add" size={20} color="#0066FF" />
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
                <Text className="mb-1 text-sm font-medium text-gray-700">Remarks</Text>
                <TextInput
                  className="h-20 text-sm text-gray-900"
                  placeholder="Enter remarks..."
                  placeholderTextColor="#9CA3AF"
                  value={requestForm.notes}
                  onChangeText={(text) => setRequestForm({...requestForm, notes: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5" onPress={saveRequest}>
              <Text className="text-base font-semibold text-white">Save</Text>
              <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Purchase Modal */}
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
                <Ionicons name="calendar-outline" size={20} color="#0066FF" />
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
                <Text className="mb-1 text-sm font-medium text-gray-700">Vendor Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter vendor name"
                  placeholderTextColor="#9CA3AF"
                  value={purchaseForm.vendorName}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, vendorName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => {
                  setAddMaterialPurchaseModalVisible(false);
                  setMaterialLibraryModalVisible(true);
                }}>
                <Ionicons name="add" size={20} color="#0066FF" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Quantity</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={purchaseForm.quantity}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, quantity: text})}
                  keyboardType="numeric"
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

              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Balance</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={purchaseForm.balance}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, balance: text})}
                  keyboardType="numeric"
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>

              <View className="mb-6">
                <Text className="mb-1 text-sm font-medium text-gray-700">Invoice URL</Text>
                <TextInput
                  className="text-base text-gray-900"
                  placeholder="Enter invoice URL"
                  value={purchaseForm.invoiceUrl}
                  onChangeText={(text) => setPurchaseForm({...purchaseForm, invoiceUrl: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
            </ScrollView>

            <TouchableOpacity 
              className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5"
              onPress={updatePurchase}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-base font-semibold text-white">Save</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Received Modal */}
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
                <Ionicons name="calendar-outline" size={20} color="#0066FF" />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Vendor Name</Text>
                <TextInput
                  className="text-base text-gray-900"
                  value={receivedForm.vendorName}
                  onChangeText={(text) => setReceivedForm({...receivedForm, vendorName: text})}
                />
                <View className="mt-1 h-px bg-gray-300" />
              </View>
              <TouchableOpacity
                className="mb-4 flex-row items-center justify-center rounded-xl bg-blue-50 py-3"
                onPress={() => {
                  setReceivedModalVisible(false);
                  setMaterialLibraryModalVisible(true);
                }}>
                <Ionicons name="add" size={20} color="#0066FF" />
                <Text className="ml-1 font-medium text-blue-600">+ Add Material</Text>
              </TouchableOpacity>
              <View className="mb-4">
                <Text className="mb-1 text-sm font-medium text-gray-700">Material Name</Text>
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
                <Text className="mb-1 text-sm font-medium text-gray-700">Remarks</Text>
                <TextInput
                  className="h-20 text-sm text-gray-900"
                  placeholder="Enter remarks..."
                  placeholderTextColor="#9CA3AF"
                  value={receivedForm.remarks}
                  onChangeText={(text) => setReceivedForm({...receivedForm, remarks: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            <TouchableOpacity 
              className="flex-row items-center justify-center rounded-xl bg-blue-600 py-3.5"
              onPress={() => updateInventory(receivedForm.materialId, parseFloat(receivedForm.quantity), 'received')}
              disabled={loading || !receivedForm.materialId || !receivedForm.quantity}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-base font-semibold text-white">Save</Text>
                  <Ionicons name="checkmark" size={20} color="white" style={{ marginLeft: 6 }} />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Used Modal */}
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
              <Text className="text-sm text-gray-600">{formatDate(new Date())}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#0066FF" />
              </TouchableOpacity>
            </View>
            <View className="h-px bg-gray-300 mb-4" />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Material</Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between"
                onPress={() => setMaterialLibraryModalVisible(true)}
              >
                <Text className="text-base text-gray-900">{usedForm.material || 'Select material'}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <View className="h-px bg-gray-300 mt-1" />
            </View>
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Quantity</Text>
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
              <Text className="text-sm font-medium text-gray-700 mb-1">Remarks</Text>
              <TextInput
                className="h-20 text-base text-gray-900"
                placeholder="Enter remarks..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={usedForm.remarks}
                onChangeText={(text) => setUsedForm({...usedForm, remarks: text})}
              />
            </View>
            <TouchableOpacity 
              className="bg-blue-600 rounded-xl py-3.5 flex-row items-center justify-center"
              onPress={() => updateInventory(usedForm.materialId, -parseFloat(usedForm.quantity), 'used')}
              disabled={loading || !usedForm.materialId || !usedForm.quantity}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-white font-semibold text-base mr-2">Save</Text>
                  <Ionicons name="checkmark" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

export default MaterialsListScreen;