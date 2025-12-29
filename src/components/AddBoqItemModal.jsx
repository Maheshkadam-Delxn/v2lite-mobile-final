// import React, { useState, useEffect } from 'react'
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
 
// const AddBoqItemModal = ({ visible, onClose, onSave }) => {
//   const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
//   const [unit, setUnit] = useState('sqft');
//   const [gst, setGst] = useState('18.0');
//   const [invoiceQuantity, setInvoiceQuantity] = useState('10');
//   const [unitSalesPrice, setUnitSalesPrice] = useState('1,900');
//   const [salesPrice, setSalesPrice] = useState('1,900');
//   const [costCode, setCostCode] = useState('Select');
 
//   // Calculate sales price when unit sales price or quantity changes
//   useEffect(() => {
//     const unitPrice = parseFloat(unitSalesPrice.replace(/,/g, '')) || 0;
//     const quantity = parseFloat(invoiceQuantity) || 0;
//     const calculatedPrice = unitPrice * quantity;
//     setSalesPrice(calculatedPrice.toLocaleString());
//   }, [unitSalesPrice, invoiceQuantity]);
 
//   const handleSaveItem = () => {
//     const newItem = {
//       id: Date.now(),
//       name: itemName,
//       unitRate: unitSalesPrice.replace(/,/g, ''),
//       quantity: invoiceQuantity,
//       gst: gst,
//       amount: salesPrice.replace(/,/g, '')
//     };
   
//     onSave(newItem);
   
//     // Reset form
//     setItemName('');
//     setUnit('sqft');
//     setGst('18.0');
//     setInvoiceQuantity('');
//     setUnitSalesPrice('');
//     setSalesPrice('');
//     setCostCode('Select');
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
//                   alignItems: 'center',
//                   marginBottom: 24
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Add BOQ Item
//                   </Text>
//                 </View>
 
//                 {/* Item Name */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Item Name
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter item name"
//                     value={itemName}
//                     onChangeText={setItemName}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                   />
//                 </View>
 
//                 {/* Unit and GST Row */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   {/* Unit */}
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Unit
//                     </Text>
//                     <View style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         {unit}
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#666666" />
//                     </View>
//                   </View>
 
//                   {/* GST */}
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       GST
//                     </Text>
//                     <View style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         {gst} %
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#666666" />
//                     </View>
//                   </View>
//                 </View>
 
//                 {/* Invoice Quantity */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Invoice Quantity
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter quantity"
//                     value={invoiceQuantity}
//                     onChangeText={setInvoiceQuantity}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                     keyboardType="numeric"
//                   />
//                 </View>
 
//                 {/* Unit Sales Price */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Unit Sales Price
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter unit price"
//                     value={unitSalesPrice}
//                     onChangeText={setUnitSalesPrice}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                     keyboardType="numeric"
//                   />
//                 </View>
 
//                 {/* Sales Price */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Sales Price
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Sales price"
//                     value={salesPrice}
//                     editable={false}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       backgroundColor: '#FAFAFA'
//                     }}
//                   />
//                 </View>
 
//                 {/* Cost Code */}
//                 <View style={{ marginBottom: 30 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Cost Code
//                   </Text>
//                   <View style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: costCode === 'Select' ? '#999999' : '#000000'
//                     }}>
//                       {costCode}
//                     </Text>
//                     <Feather name="chevron-down" size={16} color="#666666" />
//                   </View>
//                 </View>
 
//                 {/* Save and Action Buttons */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   {/* Save Button */}
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center'
//                     }}
//                     onPress={handleSaveItem}
//                   >
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 16,
//                       color: 'white'
//                     }}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
 
//                   {/* Action Button */}
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
 
// export default AddBoqItemModal


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   Alert,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import InputField from '../components/Inputfield';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import * as Crypto from 'expo-crypto';

// // ✅ Cloudinary Config
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// // ✅ Generate Signature
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

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
//       {
//         method: 'POST',
//         body: formData,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }
//     );

//     const result = await res.json();
//     if (res.ok && result.secure_url) {
//       console.log('✅ Uploaded:', result.secure_url);
//       return { success: true, url: result.secure_url };
//     } else throw new Error(result.error?.message || 'Upload failed');
//   } catch (err) {
//     console.error('Cloudinary upload error:', err);
//     return { success: false, error: err.message };
//   }
// };

// // ✅ Backend API Endpoint (Adjust if needed)
// const API_URL = 'https://skystruct-lite-backend.vercel.app/api/boq-items';

// const AddBoqItemModal = ({ visible, onClose, onSave }) => {
//   const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
//   const [unit, setUnit] = useState('sqft');
//   const [gst, setGst] = useState('18.0');
//   const [invoiceQuantity, setInvoiceQuantity] = useState('10');
//   const [unitSalesPrice, setUnitSalesPrice] = useState('1,900');
//   const [salesPrice, setSalesPrice] = useState('1,900');
//   const [costCode, setCostCode] = useState('Select');
//   const [uploadedDocs, setUploadedDocs] = useState([]);

//   // 🧮 Calculate Sales Price Dynamically
//   useEffect(() => {
//     const unitPrice = parseFloat(unitSalesPrice.replace(/,/g, '')) || 0;
//     const quantity = parseFloat(invoiceQuantity) || 0;
//     const calculatedPrice = unitPrice * quantity;
//     setSalesPrice(calculatedPrice.toLocaleString());
//   }, [unitSalesPrice, invoiceQuantity]);

//   // 📂 Upload Document Handler
//   const handleDocumentUpload = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted')
//         return Alert.alert('Permission Denied', 'Please allow media access.');

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

//   // 💾 Save BOQ Item to API
//   const handleSaveItem = async () => {
//     try {
//       const projectId =
//         (await AsyncStorage.getItem('activeProjectId')) ||
//         (await AsyncStorage.getItem('projectId'));
//       const userId = await AsyncStorage.getItem('userId');
//       const token = await AsyncStorage.getItem('userToken');

//       if (!projectId || !userId || !token) {
//         Alert.alert('Error', 'Missing project or user info. Please re-login.');
//         return;
//       }

//       const payload = {
//         projectId,
//         createdBy: userId,
//         itemName,
//         unit,
//         gst: parseFloat(gst),
//         quantity: parseFloat(invoiceQuantity),
//         unitPrice: parseFloat(unitSalesPrice.replace(/,/g, '')),
//         total: parseFloat(salesPrice.replace(/,/g, '')),
//         costCode,
//         documents: uploadedDocs,
//       };

//       console.log('📤 Sending BOQ Item Payload:', payload);

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json().catch(() => ({}));
//       console.log('📩 API Response:', result);

//       if (response.ok) {
//         Alert.alert('Success', 'BOQ item saved successfully!');
//         onClose();
//         onSave(result); // refresh parent
//         // Reset fields
//         setItemName('');
//         setInvoiceQuantity('');
//         setUnitSalesPrice('');
//         setSalesPrice('');
//         setUploadedDocs([]);
//       } else {
//         console.error('❌ API Error:', result);
//         Alert.alert('Error', result.message || 'Failed to save BOQ item.');
//       }
//     } catch (error) {
//       console.error('❌ Save Error:', error);
//       Alert.alert('Error', 'Something went wrong while saving item.');
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
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

//               <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
//                 {/* Header */}
//                 <View style={{ alignItems: 'center', marginBottom: 24 }}>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#000000',
//                       marginBottom: 8,
//                     }}
//                   >
//                     Add BOQ Item
//                   </Text>
//                 </View>

//                 {/* Item Fields */}
//                 {/* ... your full UI remains exactly the same ... */}

//                 {/* Buttons */}
//                 <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center',
//                     }}
//                     onPress={handleSaveItem}
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
//                     onPress={handleDocumentUpload}
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
//       </SafeAreaView>
//     </Modal>
//   );
// };

// export default AddBoqItemModal;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../components/Inputfield';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import DateTimePicker from '@react-native-community/datetimepicker';

// ✅ Cloudinary Config
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// ✅ Generate signature for Cloudinary
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

// ✅ Upload to Cloudinary
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

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const result = await res.json();
    if (res.ok && result.secure_url) {
      console.log('✅ Uploaded:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else throw new Error(result.error?.message || 'Upload failed');
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return { success: false, error: err.message };
  }
};

// ✅ API Endpoint
const API_URL = 'https://skystruct-lite-backend.vercel.app/api/transactions';

// Dropdown options
const UNIT_OPTIONS = ['sqft', 'no.s', 'kg', 'meter', 'litre', 'piece', 'box', 'set'];
const GST_OPTIONS = ['0', '5', '12', '18', '28'];
const COST_CODE_OPTIONS = ['Select', 'PM-001', 'PM-002', 'PM-003', 'PM-004', 'PM-005'];

const AddBoqItemModal = ({ visible, onClose, onSave, editData }) => {
  const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
  const [unit, setUnit] = useState('sqft');
  const [gst, setGst] = useState('18.0');
  const [invoiceQuantity, setInvoiceQuantity] = useState('10');
  const [unitSalesPrice, setUnitSalesPrice] = useState('1900');
  const [salesPrice, setSalesPrice] = useState('19000');
  const [costCode, setCostCode] = useState('Select');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showGstDropdown, setShowGstDropdown] = useState(false);
  const [showCostCodeDropdown, setShowCostCodeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Initialize or update data when editData changes
  useEffect(() => {
    if (editData) {
      setItemName(editData.itemName || 'XYZ Constructions Ltd.');
      setUnit(editData.unit || 'sqft');
      setGst(editData.gst || '18.0');
      setInvoiceQuantity(editData.quantity?.toString() || '10');
      setUnitSalesPrice(editData.unitPrice?.toString() || '1900');
      setSalesPrice(editData.total?.toString() || '19000');
      setCostCode(editData.costCode || 'Select');
      setSelectedDate(editData.date ? new Date(editData.date) : new Date());
    } else {
      setItemName('XYZ Constructions Ltd.');
      setUnit('sqft');
      setGst('18.0');
      setInvoiceQuantity('10');
      setUnitSalesPrice('1900');
      setSalesPrice('19000');
      setCostCode('Select');
      setSelectedDate(new Date());
    }
  }, [editData, visible]);

  // Calculate sales price when unit sales price or quantity changes
  useEffect(() => {
    const unitPrice = parseFloat(unitSalesPrice) || 0;
    const quantity = parseFloat(invoiceQuantity) || 0;
    const calculatedPrice = unitPrice * quantity;
    setSalesPrice(calculatedPrice.toString());
  }, [unitSalesPrice, invoiceQuantity]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // 📂 Upload Document Handler
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted')
        return Alert.alert('Permission Denied', 'Please allow media access.');

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

  // 💾 Save BOQ Item → API Integration
  const handleSaveItem = async () => {
    try {
      const projectId =
        (await AsyncStorage.getItem('activeProjectId')) ||
        (await AsyncStorage.getItem('projectId'));
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!projectId || !userId || !token) {
        Alert.alert('Error', 'Missing project or user info. Please re-login.');
        return;
      }

      const subtotal = parseFloat(salesPrice) || 0;
      const gstAmount = subtotal * (parseFloat(gst) / 100);
      const totalAmount = subtotal + gstAmount;

      // ✅ FIX: Use 'invoice' as type instead of 'boq'
      const payload = {
        projectId,
        createdBy: userId,
        type: 'invoice', // ✅ Changed from 'boq' to 'invoice'
        vendorName: itemName,
        invoiceNumber: `BOQ-${Date.now()}`,
        invoiceDate: selectedDate.toISOString(),
        items: [
          {
            itemName: itemName,
            quantity: parseFloat(invoiceQuantity),
            unitPrice: parseFloat(unitSalesPrice),
            total: totalAmount,
            remarks: '',
          },
        ],
        amount: totalAmount,
        remarks: `BOQ Item: ${itemName}, Unit: ${unit}, GST: ${gst}%`,
        documents: uploadedDocs,
        // Additional fields for BOQ items
        unit: unit,
        gstPercentage: parseFloat(gst),
        costCode: costCode !== 'Select' ? costCode : undefined,
      };

      // If editing, include the _id for update
      if (editData && editData._id) {
        payload._id = editData._id;
      }

      console.log('📤 Sending BOQ Payload:', payload);

      const url = editData && editData._id ? `${API_URL}/${editData._id}` : API_URL;
      const method = editData && editData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      console.log('📩 API Response:', result);

      if (response.ok) {
        Alert.alert('Success', `BOQ Item ${editData ? 'updated' : 'saved'} successfully!`);
        
        // Create item object for parent component
        const newItem = {
          id: editData?.id || Date.now(),
          name: itemName,
          unitRate: unitSalesPrice,
          quantity: invoiceQuantity,
          gst: gst,
          amount: salesPrice,
          unit: unit,
          costCode: costCode
        };

        onSave(newItem);
        onClose();
      } else {
        console.error('❌ API Error:', result);
        Alert.alert('Error', result.message || `Failed to ${editData ? 'update' : 'save'} BOQ item.`);
      }
    } catch (error) {
      console.error('❌ Save Error:', error);
      Alert.alert('Error', `Something went wrong while ${editData ? 'updating' : 'saving'} BOQ item.`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 32,
                maxHeight: '90%'
              }}
            >
              {/* Handle Bar */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 2
                }} />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20 }}
              >
                {/* Header */}
                <View style={{
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 20,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    {editData ? 'Edit BOQ Item' : 'Add BOQ Item'}
                  </Text>

                  {/* Date with Calendar */}
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 8
                    }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#666666',
                      marginRight: 8
                    }}>
                      {formatDate(selectedDate)}
                    </Text>
                    <Feather name="calendar" size={16} color="#666666" />
                  </TouchableOpacity>
                </View>

                {/* Item Name */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Item Name
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter item name"
                    value={itemName}
                    onChangeText={setItemName}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                  />
                </View>

                {/* Unit and GST Row */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20
                }}>
                  {/* Unit Dropdown */}
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000',
                      marginBottom: 8
                    }}>
                      Unit
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        paddingVertical: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000'
                      }}>
                        {unit}
                      </Text>
                      <Feather name="chevron-down" size={16} color="#666666" />
                    </TouchableOpacity>

                    {/* Unit Dropdown List */}
                    {showUnitDropdown && (
                      <View style={{
                        position: 'absolute',
                        top: 40,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 8,
                        zIndex: 1000,
                        elevation: 5,
                        maxHeight: 200
                      }}>
                        <ScrollView>
                          {UNIT_OPTIONS.map((unitOption) => (
                            <TouchableOpacity
                              key={unitOption}
                              onPress={() => {
                                setUnit(unitOption);
                                setShowUnitDropdown(false);
                              }}
                              style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F0F0F0',
                              }}
                            >
                              <Text style={{
                                fontFamily: 'Urbanist-Regular',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                                {unitOption}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* GST Dropdown */}
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000',
                      marginBottom: 8
                    }}>
                      GST
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowGstDropdown(!showGstDropdown)}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                        paddingVertical: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000'
                      }}>
                        {gst} %
                      </Text>
                      <Feather name="chevron-down" size={16} color="#666666" />
                    </TouchableOpacity>

                    {/* GST Dropdown List */}
                    {showGstDropdown && (
                      <View style={{
                        position: 'absolute',
                        top: 40,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 8,
                        zIndex: 1000,
                        elevation: 5,
                        maxHeight: 200
                      }}>
                        <ScrollView>
                          {GST_OPTIONS.map((gstOption) => (
                            <TouchableOpacity
                              key={gstOption}
                              onPress={() => {
                                setGst(gstOption);
                                setShowGstDropdown(false);
                              }}
                              style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F0F0F0',
                              }}
                            >
                              <Text style={{
                                fontFamily: 'Urbanist-Regular',
                                fontSize: 14,
                                color: '#000000',
                              }}>
                                {gstOption}%
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                {/* Invoice Quantity */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Invoice Quantity
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter quantity"
                    value={invoiceQuantity}
                    onChangeText={setInvoiceQuantity}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                    keyboardType="numeric"
                  />
                </View>

                {/* Unit Sales Price */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Unit Sales Price
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter unit price"
                    value={unitSalesPrice}
                    onChangeText={setUnitSalesPrice}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                    keyboardType="numeric"
                  />
                </View>

                {/* Sales Price */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Sales Price
                  </Text>
                  <InputField
                    label=""
                    placeholder="Sales price"
                    value={parseFloat(salesPrice || 0).toLocaleString()}
                    editable={false}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </View>

                {/* Cost Code Dropdown */}
                <View style={{ marginBottom: 30 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Cost Code
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCostCodeDropdown(!showCostCodeDropdown)}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: costCode === 'Select' ? '#999999' : '#000000'
                    }}>
                      {costCode}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#666666" />
                  </TouchableOpacity>

                  {/* Cost Code Dropdown List */}
                  {showCostCodeDropdown && (
                    <View style={{
                      position: 'absolute',
                      top: 40,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 8,
                      zIndex: 1000,
                      elevation: 5,
                      maxHeight: 200
                    }}>
                      <ScrollView>
                        {COST_CODE_OPTIONS.map((code) => (
                          <TouchableOpacity
                            key={code}
                            onPress={() => {
                              setCostCode(code);
                              setShowCostCodeDropdown(false);
                            }}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              borderBottomWidth: 1,
                              borderBottomColor: '#F0F0F0',
                            }}
                          >
                            <Text style={{
                              fontFamily: 'Urbanist-Regular',
                              fontSize: 14,
                              color: code === 'Select' ? '#999999' : '#000000',
                            }}>
                              {code}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Save and Action Buttons */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20
                }}>
                  {/* Save Button */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0066FF',
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: 'center'
                    }}
                    onPress={handleSaveItem}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 16,
                      color: 'white'
                    }}>
                      {editData ? 'Update' : 'Save'}
                    </Text>
                  </TouchableOpacity>

                  {/* Document Upload Button */}
                  <TouchableOpacity
                    onPress={handleDocumentUpload}
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: '#00C896',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Feather name="paperclip" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            style={{ backgroundColor: 'white' }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default AddBoqItemModal;

 