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
 
// const OutgoingPaymentModal = ({ visible, onClose, onSave }) => {
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
 
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
//                   marginBottom: 24
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000'
//                   }}>
//                     Outgoing Payment
//                   </Text>
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#999999',
//                       marginRight: 4
//                     }}>
//                       01-04-25
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </View>
//                 </View>
 
//                 {/* From Field - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     From
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
//                       XYZ Constructions Ltd.
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>
 
//                 {/* Amount Given */}
//                 <InputField
//                   label="Amount Given"
//                   placeholder="₹25,000"
//                   value={amount}
//                   onChangeText={setAmount}
//                 />
 
//                 {/* Description */}
//                 <InputField
//                   label="Description"
//                   placeholder="Advance payment for material supply"
//                   value={description}
//                   onChangeText={setDescription}
//                 />
 
//                 {/* Mode - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Mode
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
//                       Bank Transfer
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>
 
//                 {/* Bank Name - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Bank Name
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
//                       Bank of America
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
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
//                       MAT-2025-001
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>
 
//                 {/* Category - Dropdown */}
//                 <View style={{ marginBottom: 30 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Category
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
//                       Material
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
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
 
// export default OutgoingPaymentModal

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import InputField from '../components/Inputfield';

// const API_URLS = {
//   suppliers: 'https://skystruct-lite-backend.vercel.app/api/suppliers',
//   banks: 'https://skystruct-lite-backend.vercel.app/api/banks',
//   costCodes: 'https://skystruct-lite-backend.vercel.app/api/cost-codes',
//   categories: 'https://skystruct-lite-backend.vercel.app/api/categories',
// };

// const OutgoingPaymentModal = ({ visible, onClose, onSave }) => {
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');

//   const [showDropdown, setShowDropdown] = useState(null);
//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [selectedValues, setSelectedValues] = useState({
//     from: '',
//     mode: '',
//     bank: '',
//     costCode: '',
//     category: '',
//   });

// const fetchDropdownData = async (type) => {
//   try {
//     let endpoint;
//     switch (type) {
//       case 'from':
//         endpoint = 'https://skystruct-lite-backend.vercel.app/api/vendors';
//         break;
//       case 'bank':
//         endpoint = 'https://skystruct-lite-backend.vercel.app/api/banks';
//         break;
//       case 'costCode':
//         endpoint = 'https://skystruct-lite-backend.vercel.app/api/costcodes';
//         break;
//       case 'category':
//         endpoint = 'https://skystruct-lite-backend.vercel.app/api/categories';
//         break;
//       default:
//         endpoint = null;
//     }

//     if (!endpoint) {
//       if (type === 'mode') {
//         setDropdownOptions([
//           { label: 'Cash', value: 'cash' },
//           { label: 'Bank Transfer', value: 'bank_transfer' },
//           { label: 'UPI', value: 'upi' },
//         ]);
//         setShowDropdown(type);
//       }
//       return;
//     }

//     const response = await fetch(endpoint);
//     const text = await response.text(); // First get raw text

//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch {
//       console.warn(`[Dropdown] ${type} returned non-JSON, using fallback data`);
//       data = { data: [] }; // fallback
//     }

//     const options = Array.isArray(data.data)
//       ? data.data.map((item) => ({
//           label: item.name || item.title || item.code || 'Unnamed',
//           value: item._id || item.code,
//         }))
//       : [];

//     if (options.length === 0) {
//       // fallback mock list
//       const fallback = {
//         from: [
//           { label: 'XYZ Constructions', value: 'xyz' },
//           { label: 'Alpha Builders', value: 'alpha' },
//         ],
//         bank: [
//           { label: 'Bank of America', value: 'boa' },
//           { label: 'HDFC Bank', value: 'hdfc' },
//         ],
//         costCode: [
//           { label: 'MAT-2025-001', value: 'mat001' },
//           { label: 'LAB-2025-002', value: 'lab002' },
//         ],
//         category: [
//           { label: 'Material', value: 'material' },
//           { label: 'Labour', value: 'labour' },
//         ],
//       };
//       setDropdownOptions(fallback[type] || []);
//     } else {
//       setDropdownOptions(options);
//     }

//     setShowDropdown(type);
//   } catch (error) {
//     console.error(`[Dropdown] Failed to fetch ${type}:`, error);
//     // Fallback on failure too
//     const fallback = {
//       from: [
//         { label: 'XYZ Constructions', value: 'xyz' },
//         { label: 'Alpha Builders', value: 'alpha' },
//       ],
//       bank: [
//         { label: 'Bank of America', value: 'boa' },
//         { label: 'HDFC Bank', value: 'hdfc' },
//       ],
//       costCode: [
//         { label: 'MAT-2025-001', value: 'mat001' },
//         { label: 'LAB-2025-002', value: 'lab002' },
//       ],
//       category: [
//         { label: 'Material', value: 'material' },
//         { label: 'Labour', value: 'labour' },
//       ],
//     };
//     setDropdownOptions(fallback[type] || []);
//     setShowDropdown(type);
//   }
// };


//   const handleSelect = (type, item) => {
//     setSelectedValues((prev) => ({ ...prev, [type]: item.label }));
//     setShowDropdown(null);
//   };

//   const handleSave = () => {
//     const payload = {
//       amount,
//       description,
//       ...selectedValues,
//     };
//     onSave(payload);
//   };

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
//           onPress={() => {
//             if (showDropdown) setShowDropdown(null);
//             else onClose();
//           }}
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
//                 maxHeight: '90%',
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View
//                   style={{
//                     width: 40,
//                     height: 4,
//                     backgroundColor: '#E0E0E0',
//                     borderRadius: 2,
//                   }}
//                 />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 24,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#000000',
//                     }}
//                   >
//                     Outgoing Payment
//                   </Text>
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#999999',
//                         marginRight: 4,
//                       }}
//                     >
//                       01-04-25
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </View>
//                 </View>

//                 {/* From Field - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     From
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => fetchDropdownData('from')}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000',
//                       }}
//                     >
//                       {selectedValues.from || 'Select Vendor'}
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Amount */}
//                 <InputField
//                   label="Amount Given"
//                   placeholder="₹25,000"
//                   value={amount}
//                   onChangeText={setAmount}
//                 />

//                 {/* Description */}
//                 <InputField
//                   label="Description"
//                   placeholder="Advance payment for material supply"
//                   value={description}
//                   onChangeText={setDescription}
//                 />

//                 {/* Mode - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     Mode
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => fetchDropdownData('mode')}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000',
//                       }}
//                     >
//                       {selectedValues.mode || 'Select Mode'}
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Bank Name */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     Bank Name
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => fetchDropdownData('bank')}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000',
//                       }}
//                     >
//                       {selectedValues.bank || 'Select Bank'}
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Cost Code */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     Cost Code
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => fetchDropdownData('costCode')}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000',
//                       }}
//                     >
//                       {selectedValues.costCode || 'Select Cost Code'}
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Category */}
//                 <View style={{ marginBottom: 30 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     Category
//                   </Text>
//                   <TouchableOpacity
//                     style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => fetchDropdownData('category')}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000',
//                       }}
//                     >
//                       {selectedValues.category || 'Select Category'}
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Action Buttons */}
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 20,
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center',
//                     }}
//                     onPress={handleSave}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 16,
//                         color: 'white',
//                       }}
//                     >
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
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <Feather name="paperclip" size={24} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>

//         {/* Dropdown Overlay */}
//         {showDropdown && (
//           <View
//             style={{
//               position: 'absolute',
//               bottom: 100,
//               left: 20,
//               right: 20,
//               backgroundColor: 'white',
//               borderRadius: 12,
//               elevation: 10,
//               maxHeight: 250,
//             }}
//           >
//             <FlatList
//               data={dropdownOptions}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => handleSelect(showDropdown, item)}
//                   style={{
//                     padding: 14,
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#EEE',
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000',
//                     }}
//                   >
//                     {item.label}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         )}
//       </SafeAreaView>
//     </Modal>
//   );
// };

// export default OutgoingPaymentModal;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../components/Inputfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

const API_URLS = {
  suppliers: 'https://skystruct-lite-backend.vercel.app/api/suppliers',
  banks: 'https://skystruct-lite-backend.vercel.app/api/banks',
  costCodes: 'https://skystruct-lite-backend.vercel.app/api/cost-codes',
  categories: 'https://skystruct-lite-backend.vercel.app/api/categories',
};

// ✅ Cloudinary setup
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// ✅ Generate SHA1 signature
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
  return signature;
};

// ✅ Upload function
const uploadToCloudinary = async (fileUri) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type,
      name: filename || `upload_${Date.now()}.jpg`,
    });
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const result = await response.json();
    if (response.ok && result.secure_url) {
      console.log('✅ Uploaded to Cloudinary:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else {
      console.error('❌ Cloudinary upload failed:', result);
      return { success: false, error: result.error?.message || 'Upload failed' };
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    return { success: false, error: error.message };
  }
};

const OutgoingPaymentModal = ({ visible, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showDropdown, setShowDropdown] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState({
    from: '',
    mode: '',
    bank: '',
    costCode: '',
    category: '',
  });

  const [uploadedDocs, setUploadedDocs] = useState([]); // ✅ store Cloudinary URLs

  // ✅ Upload handler (paperclip button)
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow media access to upload files.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait while your document uploads...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs((prev) => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Something went wrong.');
        }
      }
    } catch (error) {
      console.error('Document upload error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  // Format date to display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const fetchDropdownData = async (type) => {
    try {
      let endpoint;
      switch (type) {
        case 'from':
          endpoint = 'https://skystruct-lite-backend.vercel.app/api/vendors';
          break;
        case 'bank':
          endpoint = 'https://skystruct-lite-backend.vercel.app/api/banks';
          break;
        case 'costCode':
          endpoint = 'https://skystruct-lite-backend.vercel.app/api/costcodes';
          break;
        case 'category':
          endpoint = 'https://skystruct-lite-backend.vercel.app/api/categories';
          break;
        default:
          endpoint = null;
      }

      if (!endpoint) {
        if (type === 'mode') {
          setDropdownOptions([
            { label: 'Cash', value: 'cash' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'UPI', value: 'upi' },
          ]);
          setShowDropdown(type);
        }
        return;
      }

      const response = await fetch(endpoint);
      const text = await response.text(); // First get raw text

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.warn(`[Dropdown] ${type} returned non-JSON, using fallback data`);
        data = { data: [] }; // fallback
      }

      const options = Array.isArray(data.data)
        ? data.data.map((item) => ({
            label: item.name || item.title || item.code || 'Unnamed',
            value: item._id || item.code,
          }))
        : [];

      if (options.length === 0) {
        // fallback mock list
        const fallback = {
          from: [
            { label: 'XYZ Constructions', value: 'xyz' },
            { label: 'Alpha Builders', value: 'alpha' },
          ],
          bank: [
            { label: 'Bank of America', value: 'boa' },
            { label: 'HDFC Bank', value: 'hdfc' },
          ],
          costCode: [
            { label: 'MAT-2025-001', value: 'mat001' },
            { label: 'LAB-2025-002', value: 'lab002' },
          ],
          category: [
            { label: 'Material', value: 'material' },
            { label: 'Labour', value: 'labour' },
          ],
        };
        setDropdownOptions(fallback[type] || []);
      } else {
        setDropdownOptions(options);
      }

      setShowDropdown(type);
    } catch (error) {
      console.error(`[Dropdown] Failed to fetch ${type}:`, error);
      // Fallback on failure too
      const fallback = {
        from: [
          { label: 'XYZ Constructions', value: 'xyz' },
          { label: 'Alpha Builders', value: 'alpha' },
        ],
        bank: [
          { label: 'Bank of America', value: 'boa' },
          { label: 'HDFC Bank', value: 'hdfc' },
        ],
        costCode: [
          { label: 'MAT-2025-001', value: 'mat001' },
          { label: 'LAB-2025-002', value: 'lab002' },
        ],
        category: [
          { label: 'Material', value: 'material' },
          { label: 'Labour', value: 'labour' },
        ],
      };
      setDropdownOptions(fallback[type] || []);
      setShowDropdown(type);
    }
  };

  const handleSelect = (type, item) => {
    setSelectedValues((prev) => ({ ...prev, [type]: item.label }));
    setShowDropdown(null);
  };

  const handleSave = () => {
    const payload = {
      amount,
      description,
      paymentDate: selectedDate.toISOString(),
      ...selectedValues,
      documents: uploadedDocs, // ✅ include Cloudinary URLs
    };
    onSave(payload);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {/* Main Modal Content */}
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 32,
              maxHeight: '90%',
            }}
          >
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

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingHorizontal: 20 }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 20,
                    color: '#000000',
                  }}
                >
                  Outgoing Payment
                </Text>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#999999',
                      marginRight: 4,
                    }}
                  >
                    {formatDate(selectedDate)}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* From Field - Dropdown */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  From
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => fetchDropdownData('from')}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}
                  >
                    {selectedValues.from || 'Select Vendor'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* Amount */}
              <InputField
                label="Amount Given"
                placeholder="₹25,000"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Description */}
              <InputField
                label="Description"
                placeholder="Advance payment for material supply"
                value={description}
                onChangeText={setDescription}
              />

              {/* Mode - Dropdown */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  Mode
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => fetchDropdownData('mode')}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}
                  >
                    {selectedValues.mode || 'Select Mode'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* Bank Name */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  Bank Name
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => fetchDropdownData('bank')}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}
                  >
                    {selectedValues.bank || 'Select Bank'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* Cost Code */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  Cost Code
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => fetchDropdownData('costCode')}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}
                  >
                    {selectedValues.costCode || 'Select Cost Code'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* Category */}
              <View style={{ marginBottom: 30 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  Category
                </Text>
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => fetchDropdownData('category')}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}
                  >
                    {selectedValues.category || 'Select Category'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>

              {/* Uploaded Documents Preview */}
              {uploadedDocs.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 13,
                      color: '#000000',
                      marginBottom: 8,
                    }}
                  >
                    Uploaded Documents
                  </Text>
                  {uploadedDocs.map((url, index) => (
                    <Text
                      key={index}
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 12,
                        color: '#0066FF',
                        marginBottom: 4,
                      }}
                      numberOfLines={1}
                    >
                      Document {index + 1}
                    </Text>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#0066FF',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                  onPress={handleSave}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 16,
                      color: 'white',
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#00C896',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={handleDocumentUpload}
                >
                  <Feather name="paperclip" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Dropdown Overlay - Fixed Position */}
          {showDropdown && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'flex-end',
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={() => setShowDropdown(null)}
              />
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: '50%',
                  marginHorizontal: 20,
                  marginBottom: 20,
                }}
              >
                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 18,
                      color: '#000000',
                      marginBottom: 16,
                    }}
                  >
                    Select {showDropdown.charAt(0).toUpperCase() + showDropdown.slice(1)}
                  </Text>
                  <FlatList
                    data={dropdownOptions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSelect(showDropdown, item)}
                        style={{
                          paddingVertical: 14,
                          paddingHorizontal: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 16,
                            color: '#000',
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              style={{
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginBottom: 20,
                borderRadius: 12,
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OutgoingPaymentModal;