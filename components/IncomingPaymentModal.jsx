// import React from 'react'
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
 
// const IncomingPaymentModal = ({ visible, onClose, onSave }) => {
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
//                     Incoming Payment
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
 
//                 {/* Amount Received */}
//                 <InputField
//                   label="Amount Received"
//                   placeholder="₹25,000"
//                   value=""
//                   onChangeText={(text) => console.log(text)}
//                   style={{ marginBottom: 20 }}
//                 />
 
//                 {/* Description */}
//                 <InputField
//                   label="Description"
//                   placeholder="Advance payment for material supply"
//                   value=""
//                   onChangeText={(text) => console.log(text)}
//                   style={{ marginBottom: 20 }}
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
 
// export default IncomingPaymentModal
 

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   FlatList,
//   Alert,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import InputField from '../components/Inputfield';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as ImagePicker from 'expo-image-picker';
// import * as Crypto from 'expo-crypto';

// // ✅ Cloudinary Config
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// // ✅ Generate signature for Cloudinary
// const generateSignature = async (timestamp) => {
//   const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
//   return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
// };

// // ✅ Upload File to Cloudinary
// const uploadToCloudinary = async (fileUri) => {
//   try {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const signature = await generateSignature(timestamp);

//     const filename = fileUri.split('/').pop();
//     const match = /\.(\w+)$/.exec(filename || '');
//     const type = match ? `image/${match[1]}` : 'image/jpeg';

//     const formData = new FormData();
//     formData.append('file', { uri: fileUri, type, name: filename });
//     formData.append('timestamp', timestamp.toString());
//     formData.append('signature', signature);
//     formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

//     const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
//       method: 'POST',
//       body: formData,
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     const result = await response.json();
//     if (response.ok && result.secure_url) {
//       console.log('✅ Uploaded:', result.secure_url);
//       return { success: true, url: result.secure_url };
//     } else {
//       throw new Error(result.error?.message || 'Upload failed');
//     }
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return { success: false, error: error.message };
//   }
// };

// const IncomingPaymentModal = ({ visible, onClose, onSave }) => {
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [selectedValues, setSelectedValues] = useState({
//     vendorName: '',
//     mode: '',
//     bank: '',
//     costCode: '',
//     category: '',
//   });

//   const [dropdownOptions, setDropdownOptions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(null);

//   // 📅 Format Date
//   const formatDate = (date) =>
//     date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

//   const onDateChange = (_, date) => {
//     setShowDatePicker(false);
//     if (date) setSelectedDate(date);
//   };

//   // 📂 Upload Document to Cloudinary
//   const handleDocumentUpload = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') return Alert.alert('Permission Denied', 'Please allow media access.');

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         const uri = result.assets[0].uri;
//         Alert.alert('Uploading', 'Please wait...');
//         const upload = await uploadToCloudinary(uri);

//         if (upload.success) {
//           setUploadedDocs((prev) => [...prev, upload.url]);
//           Alert.alert('Success', 'Document uploaded successfully!');
//         } else {
//           Alert.alert('Upload Failed', upload.error || 'Try again later.');
//         }
//       }
//     } catch (error) {
//       console.error('Upload Error:', error);
//       Alert.alert('Error', 'Failed to upload document.');
//     }
//   };

//   // 📡 Fetch Dropdown Data from Backend
//   const fetchDropdownData = async (type) => {
//     try {
//       const endpoints = {
//         vendorName: 'https://skystruct-lite-backend.vercel.app/api/vendors',
//         bank: 'https://skystruct-lite-backend.vercel.app/api/banks',
//         costCode: 'https://skystruct-lite-backend.vercel.app/api/costcodes',
//         category: 'https://skystruct-lite-backend.vercel.app/api/categories',
//       };

//       const endpoint = endpoints[type];
//       if (type === 'mode') {
//         setDropdownOptions([
//           { label: 'Cash', value: 'cash' },
//           { label: 'Bank Transfer', value: 'bank_transfer' },
//           { label: 'UPI', value: 'upi' },
//           { label: 'Cheque', value: 'cheque' },
//         ]);
//         setShowDropdown(type);
//         return;
//       }

//       if (!endpoint) return;

//       const response = await fetch(endpoint);
//       const text = await response.text();

//       if (text.startsWith('<')) throw new Error('Received HTML instead of JSON');

//       const data = JSON.parse(text);
//       const options = data.data?.map((item) => ({
//         label: item.name || item.title || item.code || 'Unnamed',
//         value: item._id || item.code,
//       })) || [];

//       setDropdownOptions(options);
//       setShowDropdown(type);
//     } catch (error) {
//       console.error(`[Dropdown] ${type} fetch failed:`, error);
//       setDropdownOptions([{ label: 'N/A', value: 'na' }]);
//       setShowDropdown(type);
//     }
//   };

//   const handleSelect = (type, item) => {
//     setSelectedValues((prev) => ({ ...prev, [type]: item.label }));
//     setShowDropdown(null);
//   };

//   // 💾 Save handler — Mapped correctly to schema
//   const handleSave = () => {
//     if (!amount || !selectedValues.vendorName) {
//       Alert.alert('Missing Fields', 'Please fill all required fields.');
//       return;
//     }

//     const payload = {
//       type: 'payment_in',
//       amount: parseFloat(amount),
//       remarks: description,
//       vendorName: selectedValues.vendorName,
//       paymentMode: selectedValues.mode,
//       paymentDate: selectedDate.toISOString(),
//       documents: uploadedDocs,
//       bank: selectedValues.bank,
//       costCode: selectedValues.costCode,
//       category: selectedValues.category,
//     };

//     console.log('✅ Final Payload:', payload);
//     onSave(payload);
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
//         <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//           <View
//             style={{
//               backgroundColor: 'white',
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               paddingTop: 12,
//               paddingBottom: 32,
//               maxHeight: '90%',
//             }}
//           >
//             {/* Header */}
//             <View style={{ alignItems: 'center', marginBottom: 16 }}>
//               <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
//               {/* Title + Date */}
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
//                 <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20 }}>Incoming Payment</Text>
//                 <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: 'row' }}>
//                   <Text style={{ color: '#999', marginRight: 4 }}>{formatDate(selectedDate)}</Text>
//                   <Feather name="chevron-down" size={20} color="#999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Vendor */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>From (Vendor)</Text>
//                 <TouchableOpacity
//                   onPress={() => fetchDropdownData('vendorName')}
//                   style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                   }}
//                 >
//                   <Text>{selectedValues.vendorName || 'Select Vendor'}</Text>
//                   <Feather name="chevron-down" size={20} color="#999" />
//                 </TouchableOpacity>
//               </View>

//               <InputField label="Amount Received" placeholder="₹25,000" value={amount} onChangeText={setAmount} />
//               <InputField
//                 label="Description / Remarks"
//                 placeholder="Advance payment for material supply"
//                 value={description}
//                 onChangeText={setDescription}
//               />

//               {/* Mode */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Mode</Text>
//                 <TouchableOpacity
//                   onPress={() => fetchDropdownData('mode')}
//                   style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                   }}
//                 >
//                   <Text>{selectedValues.mode || 'Select Mode'}</Text>
//                   <Feather name="chevron-down" size={20} color="#999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Uploaded Documents */}
//               {uploadedDocs.length > 0 && (
//                 <View style={{ marginBottom: 16 }}>
//                   <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Uploaded Documents</Text>
//                   {uploadedDocs.map((url, i) => (
//                     <Text key={i} style={{ color: '#0066FF', fontSize: 12 }}>
//                       Document {i + 1}
//                     </Text>
//                   ))}
//                 </View>
//               )}

//               {/* Buttons */}
//               <View style={{ flexDirection: 'row', gap: 12 }}>
//                 <TouchableOpacity
//                   style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
//                   onPress={handleSave}
//                 >
//                   <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={handleDocumentUpload}
//                   style={{
//                     width: 56,
//                     height: 56,
//                     backgroundColor: '#00C896',
//                     borderRadius: 12,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <Feather name="paperclip" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>

//           {/* Dropdown Overlay */}
//           {showDropdown && (
//             <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}>
//               <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDropdown(null)} />
//               <View style={{ backgroundColor: 'white', borderRadius: 16, margin: 20, maxHeight: '50%' }}>
//                 <FlatList
//                   data={dropdownOptions}
//                   keyExtractor={(_, i) => i.toString()}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity onPress={() => handleSelect(showDropdown, item)} style={{ padding: 16 }}>
//                       <Text>{item.label}</Text>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             </View>
//           )}

//           {showDatePicker && (
//             <DateTimePicker value={selectedDate} mode="date" display="spinner" onChange={onDateChange} />
//           )}
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// export default IncomingPaymentModal;


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
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/Inputfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

// ✅ Cloudinary Config
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// ✅ API Configuration
const API_URL = process.env.BASE_API_URL || 'https://skystruct-lite-backend.vercel.app';
const TOKEN_KEY = 'userToken';

// ✅ Generate signature for Cloudinary
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

// ✅ Upload File to Cloudinary
const uploadToCloudinary = async (fileUri) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', { uri: fileUri, type, name: filename });
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const result = await response.json();
    if (response.ok && result.secure_url) {
      console.log('✅ Uploaded:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else {
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};

const IncomingPaymentModal = ({ 
  visible, 
  onClose, 
  onSave, // This will now be callback after success
  editingTransaction = null,
  projectId = null,
  project = null,
  refreshTransactions = null // Optional: callback to refresh list
}) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown values
  const [selectedValues, setSelectedValues] = useState({
    vendorName: '',
    paymentMode: '',
    bank: '',
    costCode: '',
  });

  // User info
  const [userId, setUserId] = useState('');

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);

  // Initialize user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Get user ID from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserId(parsedUser.id || '');
          console.log('[IncomingPayment] Loaded userId:', parsedUser.id);
        }
      } catch (error) {
        console.error('[IncomingPayment] Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  // Initialize form with editing data
  useEffect(() => {
    if (editingTransaction) {
      console.log('[IncomingPaymentModal] Editing transaction:', editingTransaction);
      
      // Set basic fields
      setAmount(editingTransaction.amount?.toString() || '');
      setRemarks(editingTransaction.remarks || '');
      
      // Set dates
      if (editingTransaction.paymentDate) {
        setSelectedDate(new Date(editingTransaction.paymentDate));
      }
      if (editingTransaction.invoiceDate) {
        setInvoiceDate(new Date(editingTransaction.invoiceDate));
      }
      
      // Set document URLs
      setUploadedDocs(editingTransaction.documents || []);
      
      // Set dropdown values
      setSelectedValues({
        vendorName: editingTransaction.vendorName || '',
        paymentMode: editingTransaction.paymentMode || '',
        bank: editingTransaction.bank || '',
        costCode: editingTransaction.costCode || '',
      });
      
      // Set other fields
      setInvoiceNumber(editingTransaction.invoiceNumber || '');
      setReferenceNumber(editingTransaction.referenceNumber || '');
    } else {
      // Reset form for new entry
      resetForm();
    }
  }, [editingTransaction]);

  // Reset form function
  const resetForm = () => {
    setAmount('');
    setRemarks('');
    setSelectedDate(new Date());
    setUploadedDocs([]);
    setInvoiceNumber('');
    setInvoiceDate(new Date());
    setReferenceNumber('');
    setSelectedValues({
      vendorName: '',
      paymentMode: '',
      bank: '',
      costCode: '',
    });
    setIsLoading(false);
  };

  // 📅 Format Date
  const formatDate = (date) =>
    date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const onDateChange = (_, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  // 📂 Upload Document to Cloudinary
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission Denied', 'Please allow media access.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs((prev) => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Try again later.');
        }
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  // 📡 Fetch Dropdown Data with fallbacks
  const fetchDropdownData = async (type) => {
    try {
      // Fallback data for development
      const fallbackData = {
        vendorName: [
          { label: 'ABC Construction Ltd.', value: 'abc' },
          { label: 'XYZ Builders Inc.', value: 'xyz' },
          { label: 'Global Suppliers Co.', value: 'global' },
          { label: 'Metro Contractors', value: 'metro' },
        ],
        paymentMode: [
          { label: 'Cash', value: 'cash' },
          { label: 'Bank Transfer', value: 'bank_transfer' },
          { label: 'UPI', value: 'upi' },
          { label: 'Cheque', value: 'cheque' },
        ],
        bank: [
          { label: 'State Bank of India', value: 'sbi' },
          { label: 'HDFC Bank', value: 'hdfc' },
          { label: 'ICICI Bank', value: 'icici' },
          { label: 'Axis Bank', value: 'axis' },
        ],
        costCode: [
          { label: 'MAT-2024-001', value: 'mat001' },
          { label: 'LAB-2024-002', value: 'lab002' },
          { label: 'EQP-2024-003', value: 'eqp003' },
          { label: 'SVC-2024-004', value: 'svc004' },
        ],
      };

      if (fallbackData[type]) {
        setDropdownOptions(fallbackData[type]);
        setShowDropdown(type);
      }
      
    } catch (error) {
      console.error(`[Dropdown] ${type} fetch failed:`, error);
      // Final fallback with basic options
      const basicFallback = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' },
      ];
      setDropdownOptions(basicFallback);
      setShowDropdown(type);
    }
  };

  const handleSelect = (type, item) => {
    setSelectedValues((prev) => ({ ...prev, [type]: item.value }));
    setShowDropdown(null);
  };

  // ✅ CREATE Transaction (POST to /api/transactions)
  const createTransaction = async (payload) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        Alert.alert('Error', 'User not logged in.');
        return false;
      }

      console.log('📤 Creating transaction:', payload);
      
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('📥 Create response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed with status ${response.status}`);
      }

      Alert.alert('Success', 'Transaction created successfully!');
      return true;
    } catch (error) {
      console.error('❌ Create error:', error);
      Alert.alert('Error', error.message || 'Failed to create transaction');
      return false;
    }
  };

  // ✅ UPDATE Transaction (PUT to /api/transactions/[id])
  const updateTransaction = async (id, payload) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        Alert.alert('Error', 'User not logged in.');
        return false;
      }

      console.log(`📤 Updating transaction ${id}:`, payload);
      
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('📥 Update response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed with status ${response.status}`);
      }

      Alert.alert('Success', 'Transaction updated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Update error:', error);
      Alert.alert('Error', error.message || 'Failed to update transaction');
      return false;
    }
  };

  // 💾 Save handler - Now makes direct API calls
  const handleSave = async () => {
    if (!amount || !selectedValues.vendorName) {
      Alert.alert('Missing Fields', 'Please fill Vendor Name and Amount fields.');
      return;
    }

    // Check if projectId is available
    if (!projectId) {
      Alert.alert('Missing Project', 'No project selected. Please go back and select a project.');
      return;
    }

    // Try to get user ID from AsyncStorage if not already set
    let finalUserId = userId;
    if (!finalUserId) {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          finalUserId = parsedUser.id || '';
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    }

    // Map display labels to actual values for payment mode
    const paymentModeMap = {
      'Cash': 'cash',
      'Bank Transfer': 'bank_transfer', 
      'UPI': 'upi',
      'Cheque': 'cheque'
    };

    // Get actual payment mode value
    const paymentModeValue = paymentModeMap[selectedValues.paymentMode] || selectedValues.paymentMode || 'cash';

    // Build payload according to new schema
    const payload = {
      // Required fields for project association - using projectId from props
      projectId: projectId,
      createdBy: finalUserId || '690d86c4425a1a0b7dfe7d42',
      
      // Required classification fields for new schema
      category: 'payment',
      nature: 'payment_in',
      direction: 'credit',
      
      // Financial details
      amount: parseFloat(amount),
      currency: 'INR',
      paymentMode: paymentModeValue,
      paymentDate: selectedDate.toISOString(),
      referenceNumber: referenceNumber,
      
      // Vendor/Invoice details
      vendorName: selectedValues.vendorName,
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate.toISOString(),
      
      // Other fields
      remarks: remarks,
      documents: uploadedDocs,
      
      // Additional fields if needed
      ...(selectedValues.costCode && { costCode: selectedValues.costCode }),
      ...(selectedValues.bank && { bank: selectedValues.bank }),
      
      // Status for approval flow
      status: 'pending'
    };

    console.log('✅ Incoming Payment Payload:', payload);
    
    setIsLoading(true);
    
    let success = false;
    
    if (editingTransaction) {
      // Update existing transaction
      success = await updateTransaction(editingTransaction._id, payload);
    } else {
      // Create new transaction
      success = await createTransaction(payload);
    }
    
    setIsLoading(false);
    
    if (success) {
      // Clear form
      resetForm();
      
      // Call parent callback if provided
      if (onSave) onSave();
      
      // Call refresh callback if provided
      if (refreshTransactions) refreshTransactions();
      
      // Close modal
      onClose();
    }
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
              {/* Title + Date */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20 }}>
                  {editingTransaction ? 'Edit Incoming Payment' : 'Incoming Payment'}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#999', marginRight: 4 }}>{formatDate(selectedDate)}</Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Project Info Display */}
              {projectId && (
                <View style={{ 
                  backgroundColor: '#E8F5E9', 
                  padding: 10, 
                  borderRadius: 8, 
                  marginBottom: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: '#4CAF50'
                }}>
                  <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600' }}>
                    📁 Project ID: {projectId.substring(0, 8)}...
                  </Text>
                  {project && project.projectName && (
                    <Text style={{ fontSize: 10, color: '#4CAF50', marginTop: 2 }}>
                      Project: {project.projectName}
                    </Text>
                  )}
                </View>
              )}

              {/* Vendor */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>From (Vendor)</Text>
                <TouchableOpacity
                  onPress={() => fetchDropdownData('vendorName')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: selectedValues.vendorName ? '#000' : '#999' }}>
                    {selectedValues.vendorName || 'Select Vendor'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <InputField 
                label="Amount Received" 
                placeholder="₹25,000" 
                value={amount} 
                onChangeText={setAmount}
                keyboardType="numeric"
                editable={!isLoading}
              />
              
              <InputField
                label="Invoice Number"
                placeholder="INV-2024-001"
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                editable={!isLoading}
              />
              
              <InputField
                label="Reference Number"
                placeholder="REF-12345"
                value={referenceNumber}
                onChangeText={setReferenceNumber}
                editable={!isLoading}
              />
              
              <InputField
                label="Remarks / Description"
                placeholder="Advance payment for material supply"
                value={remarks}
                onChangeText={setRemarks}
                multiline
                editable={!isLoading}
              />

              {/* Payment Mode */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Payment Mode</Text>
                <TouchableOpacity
                  onPress={() => fetchDropdownData('paymentMode')}
                  disabled={isLoading}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: selectedValues.paymentMode ? '#000' : '#999' }}>
                    {selectedValues.paymentMode || 'Select Payment Mode'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Bank Name */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Bank Name (Optional)</Text>
                <TouchableOpacity
                  onPress={() => fetchDropdownData('bank')}
                  disabled={isLoading}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: selectedValues.bank ? '#000' : '#999' }}>
                    {selectedValues.bank || 'Select Bank'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Cost Code */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Cost Code (Optional)</Text>
                <TouchableOpacity
                  onPress={() => fetchDropdownData('costCode')}
                  disabled={isLoading}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: selectedValues.costCode ? '#000' : '#999' }}>
                    {selectedValues.costCode || 'Select Cost Code'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Uploaded Documents */}
              {uploadedDocs.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>Uploaded Documents</Text>
                  {uploadedDocs.map((url, i) => (
                    <Text key={i} style={{ color: '#0066FF', fontSize: 12, marginBottom: 4 }}>
                      Document {i + 1}
                    </Text>
                  ))}
                </View>
              )}

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  style={{ 
                    flex: 1, 
                    backgroundColor: projectId && !isLoading ? '#0066FF' : '#CCCCCC',
                    borderRadius: 12, 
                    paddingVertical: 16, 
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onPress={handleSave}
                  disabled={!projectId || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Feather name="loader" size={20} color="white" />
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {editingTransaction ? 'Updating...' : 'Saving...'}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                      {editingTransaction ? 'Update' : 'Save'}
                    </Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleDocumentUpload}
                  disabled={isLoading}
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: isLoading ? '#CCCCCC' : '#00C896',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <Feather name="paperclip" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginBottom: 20,
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Dropdown Overlay */}
          {showDropdown && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDropdown(null)} />
              <View style={{ backgroundColor: 'white', borderRadius: 16, margin: 20, maxHeight: '50%' }}>
                <FlatList
                  data={dropdownOptions}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      onPress={() => handleSelect(showDropdown, item)} 
                      style={{ 
                        padding: 16, 
                        borderBottomWidth: 1, 
                        borderBottomColor: '#f0f0f0' 
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker 
              value={selectedDate} 
              mode="date" 
              display="spinner" 
              onChange={onDateChange} 
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default IncomingPaymentModal;