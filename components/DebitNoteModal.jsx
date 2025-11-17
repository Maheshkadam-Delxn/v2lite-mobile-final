// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   TextInput
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'
// import InputField from '../components/Inputfield'
// import AddItemModal from './AddItemModal'

// const DebitNoteModal = ({ visible, onClose, onSave }) => {
//   const [notes, setNotes] = useState('');
//   const [showAddItemModal, setShowAddItemModal] = useState(false);

//   return (
//     <>
//       <Modal
//         visible={visible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={onClose}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={onClose}
//           >
//             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   backgroundColor: 'white',
//                   borderTopLeftRadius: 24,
//                   borderTopRightRadius: 24,
//                   paddingTop: 12,
//                   paddingBottom: 32,
//                   maxHeight: '90%'
//                 }}
//               >
//                 {/* Handle Bar */}
//                 <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{
//                     width: 40,
//                     height: 4,
//                     backgroundColor: '#E0E0E0',
//                     borderRadius: 2
//                   }} />
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   style={{ paddingHorizontal: 20 }}
//                 >
//                   {/* Header */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 24
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#000000'
//                     }}>
//                       Debit Note
//                     </Text>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#999999',
//                         marginRight: 4
//                       }}>
//                         01-04-25
//                       </Text>
//                       <Feather name="chevron-down" size={20} color="#999999" />
//                     </View>
//                   </View>

//                   {/* From Field - Dropdown */}
//                   <View style={{ marginBottom: 24 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       From
//                     </Text>
//                     <TouchableOpacity style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         XYZ Constructions Ltd.
//                       </Text>
//                       <Feather name="chevron-down" size={20} color="#999999" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Items Section */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 16
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Items (1)
//                     </Text>
//                     <TouchableOpacity onPress={() => setShowAddItemModal(true)}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#0066FF'
//                       }}>
//                         + New Item
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Item Card */}
//                   <View style={{
//                     backgroundColor: '#FAFAFA',
//                     borderRadius: 12,
//                     padding: 16,
//                     marginBottom: 24
//                   }}>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       marginBottom: 16
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000',
//                         flex: 1
//                       }}>
//                         Defective Cement Return
//                       </Text>
//                       <View style={{ alignItems: 'flex-end' }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Bold',
//                           fontSize: 15,
//                           color: '#000000'
//                         }}>
//                           ₹ 1000
//                         </Text>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999'
//                         }}>
//                           +18.0% GST
//                         </Text>
//                       </View>
//                       <TouchableOpacity style={{ marginLeft: 12 }}>
//                         <Feather name="edit-2" size={18} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>

//                     <View style={{ flexDirection: 'row', gap: 12 }}>
//                       <View style={{ flex: 1 }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999',
//                           marginBottom: 4
//                         }}>
//                           Unit Rate
//                         </Text>
//                         <TextInput
//                           placeholder="100"
//                           placeholderTextColor="#000000"
//                           style={{
//                             fontFamily: 'Urbanist-Regular',
//                             fontSize: 14,
//                             color: '#000000',
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0',
//                             paddingVertical: 8
//                           }}
//                         />
//                       </View>
//                       <View style={{ flex: 1 }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999',
//                           marginBottom: 4
//                         }}>
//                           Quantity
//                         </Text>
//                         <TextInput
//                           placeholder="10"
//                           placeholderTextColor="#000000"
//                           style={{
//                             fontFamily: 'Urbanist-Regular',
//                             fontSize: 14,
//                             color: '#000000',
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0',
//                             paddingVertical: 8
//                           }}
//                         />
//                       </View>
//                     </View>
//                   </View>

//                   {/* Summary Section */}
//                   <View style={{ marginBottom: 24 }}>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginBottom: 12
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#666666'
//                       }}>
//                         Item Subtotal
//                       </Text>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         ₹ 1000
//                       </Text>
//                     </View>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginBottom: 16
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         Total Amount
//                       </Text>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Bold',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         ₹ 1,180
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Notes */}
//                   <InputField
//                     label="Notes"
//                     placeholder="Advance payment for material supply"
//                     value={notes}
//                     onChangeText={setNotes}
//                     style={{ marginBottom: 30 }}
//                   />

//                   {/* Action Buttons */}
//                   <View style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 20
//                   }}>
//                     <TouchableOpacity
//                       style={{
//                         flex: 1,
//                         backgroundColor: '#0066FF',
//                         borderRadius: 12,
//                         paddingVertical: 16,
//                         alignItems: 'center'
//                       }}
//                       onPress={onSave}
//                     >
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 16,
//                         color: 'white'
//                       }}>
//                         Save
//                       </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: '#00C896',
//                         borderRadius: 12,
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                       }}
//                     >
//                       <Feather name="paperclip" size={24} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </ScrollView>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>

//       {/* Add Item Modal - Nested inside Debit Note */}
//       <AddItemModal
//         visible={showAddItemModal}
//         onClose={() => setShowAddItemModal(false)}
//         onSave={() => setShowAddItemModal(false)}
//       />
//     </>
//   )
// }

// export default DebitNoteModal

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   TextInput,
//   Alert
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import InputField from '../components/Inputfield';
// import AddItemModal from './AddItemModal';
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

// // ✅ Upload to Cloudinary
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

// const DebitNoteModal = ({ visible, onClose, onSave }) => {
//   const [notes, setNotes] = useState('');
//   const [uploadedDocs, setUploadedDocs] = useState([]);
//   const [showAddItemModal, setShowAddItemModal] = useState(false);

//   // For simplicity, we assume one hardcoded item (you can expand dynamically)
//   const [items, setItems] = useState([
//     {
//       itemName: 'Defective Cement Return',
//       quantity: 10,
//       unitPrice: 100,
//       total: 1000,
//       remarks: 'Defective batch returned',
//     },
//   ]);

//   // 📂 Handle Cloudinary Upload
//   const handleDocumentUpload = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Required', 'Please allow access to media.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         const uri = result.assets[0].uri;
//         Alert.alert('Uploading', 'Please wait while the document uploads...');
//         const upload = await uploadToCloudinary(uri);

//         if (upload.success) {
//           setUploadedDocs((prev) => [...prev, upload.url]);
//           Alert.alert('Success', 'Document uploaded successfully!');
//         } else {
//           Alert.alert('Upload Failed', upload.error || 'Something went wrong.');
//         }
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       Alert.alert('Error', 'Failed to upload document.');
//     }
//   };

//   // 💾 Handle Save (API Integration)
//   const handleSave = async () => {
//     try {
//       const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
//       const gst = totalAmount * 0.18;
//       const finalAmount = totalAmount + gst;

//       const payload = {
//         projectId: '672b76ff67b02c9be15f5678', // ✅ Replace with actual project ID
//         createdBy: '672b778567b02c9be15f5699', // ✅ Replace with actual user ID
//         type: 'debit_note',
//         vendorName: 'XYZ Constructions Ltd.',
//         paymentDate: new Date().toISOString(),
//         items: items,
//         amount: finalAmount,
//         remarks: notes,
//         documents: uploadedDocs,
//       };

//       console.log('📤 Sending Payload:', payload);

//       const response = await fetch('https://skystruct-lite-backend.vercel.app/api/transactions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         Alert.alert('Success', 'Debit Note saved successfully!');
//         console.log('✅ Transaction created:', result);
//         onSave(result);
//         onClose();
//       } else {
//         console.error('❌ API Error:', result);
//         Alert.alert('Error', result.message || 'Failed to save transaction.');
//       }
//     } catch (error) {
//       console.error('❌ Save Error:', error);
//       Alert.alert('Error', 'Something went wrong while saving.');
//     }
//   };

//   return (
//     <>
//       <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
//             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   backgroundColor: 'white',
//                   borderTopLeftRadius: 24,
//                   borderTopRightRadius: 24,
//                   paddingTop: 12,
//                   paddingBottom: 32,
//                   maxHeight: '90%',
//                 }}
//               >
//                 {/* Header */}
//                 <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
//                 </View>

//                 <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
//                   {/* Header Title */}
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, color: '#000' }}>Debit Note</Text>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <Text style={{ color: '#999', fontSize: 14, marginRight: 4 }}>
//                         {new Date().toLocaleDateString('en-GB')}
//                       </Text>
//                       <Feather name="chevron-down" size={20} color="#999" />
//                     </View>
//                   </View>

//                   {/* Static UI — unchanged */}
//                   {/* ... (From, Items, Summary, Notes, etc.) ... */}

//                   {/* Action Buttons */}
//                   <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//                     <TouchableOpacity
//                       style={{
//                         flex: 1,
//                         backgroundColor: '#0066FF',
//                         borderRadius: 12,
//                         paddingVertical: 16,
//                         alignItems: 'center',
//                       }}
//                       onPress={handleSave}
//                     >
//                       <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>Save</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={handleDocumentUpload}
//                       style={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: '#00C896',
//                         borderRadius: 12,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <Feather name="paperclip" size={24} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </ScrollView>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>

//       {/* Add Item Modal */}
//       <AddItemModal
//         visible={showAddItemModal}
//         onClose={() => setShowAddItemModal(false)}
//         onSave={(newItem) => {
//           setItems((prev) => [...prev, newItem]);
//           setShowAddItemModal(false);
//         }}
//       />
//     </>
//   );
// };

// export default DebitNoteModal;

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../components/Inputfield';
import AddItemModal from './AddItemModal';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
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

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

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

const DebitNoteModal = ({ visible, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Dropdown states
  const [showDropdown, setShowDropdown] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('XYZ Constructions Ltd.');
  const [projectId, setProjectId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadStorageAndProject = async () => {
      try {
        let storedProject = await AsyncStorage.getItem('projectId');
        let storedUser = await AsyncStorage.getItem('userId');
        let storedToken = await AsyncStorage.getItem('userToken');

        // Fetch latest project if none saved
        if (!storedProject) {
          const projectRes = await fetch('https://skystruct-lite-backend.vercel.app/api/projects');
          const projectData = await projectRes.json();
          if (projectData?.data?.length > 0) {
            storedProject = projectData.data[0]._id;
            await AsyncStorage.setItem('projectId', storedProject);
            console.log('📦 Auto-selected project ID:', storedProject);
          } else {
            console.warn('⚠️ No projects found in backend.');
          }
        }

        if (!storedUser) {
          storedUser = '672b778567b02c9be15f5699'; // fallback user ID
          await AsyncStorage.setItem('userId', storedUser);
        }

        if (!storedToken) {
          storedToken = 'test-token';
          await AsyncStorage.setItem('userToken', storedToken);
        }

        setProjectId(storedProject);
        setUserId(storedUser);
        setToken(storedToken);

        console.log('🧩 Stored IDs (ready):', { storedProject, storedUser, storedToken });
      } catch (err) {
        console.error('AsyncStorage / Project load error:', err);
      }
    };

    loadStorageAndProject();
  }, []);

  // Items state with editable fields
  const [items, setItems] = useState([
    {
      id: 1,
      itemName: 'Defective Cement Return',
      quantity: 10,
      unitPrice: 100,
      total: 1000,
      remarks: 'Defective batch returned',
    },
  ]);

  // Vendor dropdown data
  const vendorOptions = [
    { label: 'XYZ Constructions Ltd.', value: 'xyz' },
    { label: 'ABC Builders Inc.', value: 'abc' },
    { label: 'Global Suppliers Co.', value: 'global' },
    { label: 'Metro Contractors', value: 'metro' },
  ];

  // 📂 Handle Cloudinary Upload
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to media.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait while the document uploads...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs((prev) => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Something went wrong.');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  // Handle dropdown opening
  const handleOpenDropdown = (type) => {
    if (type === 'vendor') {
      setDropdownOptions(vendorOptions);
      setShowDropdown('vendor');
    }
  };

  // Handle dropdown selection
  const handleSelectDropdown = (item) => {
    if (showDropdown === 'vendor') {
      setSelectedVendor(item.label);
    }
    setShowDropdown(null);
  };

  // Handle item field changes
  const handleItemFieldChange = (itemId, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate total if unitPrice or quantity changes
          if (field === 'unitPrice' || field === 'quantity') {
            const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice;
            const quantity = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
            updatedItem.total = unitPrice * quantity;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };
const handleSave = async () => {
  try {
    const projectId = await AsyncStorage.getItem('activeProjectId') || await AsyncStorage.getItem('projectId');
    const userId = await AsyncStorage.getItem('userId');

    if (!projectId || !userId) {
      Alert.alert('Error', 'Missing user or project info. Please re-login.');
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const gst = totalAmount * 0.18;
    const finalAmount = totalAmount + gst;

    const payload = {
      projectId,
      createdBy: userId,
      type: 'debit_note', // ✅ ensures only debit_note type
      vendorName: selectedVendor,
      paymentDate: new Date().toISOString(),
      items,
      amount: finalAmount,
      remarks: notes,
      documents: uploadedDocs,
    };

    console.log('📤 Sending Payload to parent:', payload);

    // ✅ Only pass data to parent (don't call API here)
    onSave(payload);
    onClose();

  } catch (error) {
    console.error('❌ Save Error:', error);
    Alert.alert('Error', 'Something went wrong while preparing data.');
  }
};


  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
              }}>
              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }}
                />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
                {/* Header Title */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, color: '#000' }}>
                    Debit Note
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#999', fontSize: 14, marginRight: 4 }}>
                      {new Date().toLocaleDateString('en-GB')}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999" />
                  </View>
                </View>

                {/* From Field - Dropdown */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 13,
                      color: '#000000',
                      marginBottom: 8,
                    }}>
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
                    onPress={() => handleOpenDropdown('vendor')}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      {selectedVendor}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>

                {/* Items Section */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 15,
                      color: '#000000',
                    }}>
                    Items ({items.length})
                  </Text>
                  <TouchableOpacity onPress={() => setShowAddItemModal(true)}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#0066FF',
                      }}>
                      + New Item
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Item Card */}
                {items.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: '#FAFAFA',
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 24,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 16,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: '#000000',
                          flex: 1,
                        }}>
                        {item.itemName}
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Bold',
                            fontSize: 15,
                            color: '#000000',
                          }}>
                          ₹ {item.total}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 11,
                            color: '#999999',
                          }}>
                          +18.0% GST
                        </Text>
                      </View>
                      <TouchableOpacity style={{ marginLeft: 12 }}>
                        <Feather name="edit-2" size={18} color="#0066FF" />
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 11,
                            color: '#999999',
                            marginBottom: 4,
                          }}>
                          Unit Rate
                        </Text>
                        <TextInput
                          value={item.unitPrice.toString()}
                          onChangeText={(value) =>
                            handleItemFieldChange(item.id, 'unitPrice', value)
                          }
                          placeholderTextColor="#000000"
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 14,
                            color: '#000000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E0E0E0',
                            paddingVertical: 8,
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 11,
                            color: '#999999',
                            marginBottom: 4,
                          }}>
                          Quantity
                        </Text>
                        <TextInput
                          value={item.quantity.toString()}
                          onChangeText={(value) =>
                            handleItemFieldChange(item.id, 'quantity', value)
                          }
                          placeholderTextColor="#000000"
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 14,
                            color: '#000000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E0E0E0',
                            paddingVertical: 8,
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                ))}

                {/* Summary Section */}
                <View style={{ marginBottom: 24 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#666666',
                      }}>
                      Item Subtotal
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#000000',
                      }}>
                      ₹ {items.reduce((sum, item) => sum + item.total, 0)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Bold',
                        fontSize: 15,
                        color: '#000000',
                      }}>
                      ₹ {Math.round(items.reduce((sum, item) => sum + item.total, 0) * 1.18)}
                    </Text>
                  </View>
                </View>

                {/* Notes */}
                <InputField
                  label="Notes"
                  placeholder="Advance payment for material supply"
                  value={notes}
                  onChangeText={setNotes}
                  style={{ marginBottom: 30 }}
                />

                {/* Uploaded Documents */}
                {uploadedDocs.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 13, color: '#000', marginBottom: 8 }}>
                      Uploaded Documents
                    </Text>
                    {uploadedDocs.map((url, i) => (
                      <Text key={i} style={{ color: '#0066FF', fontSize: 12 }}>
                        Document {i + 1}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0066FF',
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: 'center',
                    }}
                    onPress={handleSave}>
                    <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDocumentUpload}
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: '#00C896',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Feather name="paperclip" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {/* Dropdown Overlay */}
            {showDropdown && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDropdown(null)} />
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    margin: 20,
                    maxHeight: '50%',
                  }}>
                  <FlatList
                    data={dropdownOptions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectDropdown(item)}
                        style={{
                          padding: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                        }}>
                        <Text style={{ fontSize: 16 }}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Item Modal */}
      <AddItemModal
        visible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSave={(newItem) => {
          setItems((prev) => [...prev, { ...newItem, id: Date.now() }]);
          setShowAddItemModal(false);
        }}
      />
    </>
  );
};

export default DebitNoteModal;
