// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { useSurvey } from '../../context/StoreProvider';
// import * as Crypto from 'expo-crypto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../../components/Header';
// import { useNavigation, useRoute } from '@react-navigation/native';

// /* -------------------- Cloudinary config -------------------- */
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// /* -------------------- Helper: category color -------------------- */


// const API_URL = `${process.env.BASE_API_URL}`;

// const CreateTemplate = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   const {
//     surveyData,
//     templateFormData,
//     mode,
//     initialData,
//     setSurveyData,
//     setTemplateFormData,
//     setMode,
//     setInitialData,
//     clearStore,
//   } = useSurvey();
  
//   const [formData, setFormData] = useState({ 
//     projectTypeName: '', 
//     category: '', 
//     description: '', 
//     image: null,
//     landArea: '',
//     estimated_days: '',
//     budgetMinRange: '',
//     budgetMaxRange: '',
//     material: [],
//     siteSurvey: '',
//     createdAt: new Date().toISOString().split('T')[0]
//   });
//   const [siteSurveyData, setSiteSurveyData] = useState(null);

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Material fields state
//   const [materialName, setMaterialName] = useState('');
//   const [materialUnits, setMaterialUnits] = useState('');
//   const [materialQuantity, setMaterialQuantity] = useState('');

//   useEffect(() => {
//     // If editing, populate fields with initial data
//     if (isEditMode && initialData) {
//       setFormData({
//         projectTypeName: initialData.projectTypeName || initialData.name || '',
//         category: initialData.category || '',
//         description: initialData.description || '',
//         image: initialData.image || null,
//         landArea: initialData.landArea || '',
//         estimated_days: initialData.estimated_days ? String(initialData.estimated_days) : '',
//         budgetMinRange: initialData.budgetMinRange || '',
//         budgetMaxRange: initialData.budgetMaxRange || '',
//         material: initialData.material || [],
//       siteSurvey: initialData?.siteSurvey || null,

//         createdAt: initialData.createdAt || new Date().toISOString().split('T')[0]
//       });
//       setSelectedImage(initialData.image ? { uri: initialData.image } : null);
//       setUploadProgress(initialData.image ? 100 : 0);
//     }
//   }, [initialData, isEditMode]);
// useEffect(() => {
//   // Restore full form data
//   if (route.params?.formData) {
//     setFormData(route.params.formData);
//   }

//   // Restore site survey data & merge into form
//   if (route.params?.siteSurveyData) {
//     setSiteSurveyData(route.params.siteSurveyData);
//     setFormData(prev => ({
//       ...prev,
//       siteSurvey: route.params.siteSurveyData,
//     }));
//   }
// }, [route.params]);

// useEffect(() => {
//   if (!route.params?.siteSurveyData) {
//     console.log("🟡 Survey data not yet available");
//     return;
//   }

//   console.log("🟢 Survey data received in CreateTemplate:");
//   console.log(route.params.siteSurveyData);
// }, [route.params?.siteSurveyData]);

//   const generateSignature = async (timestamp) => {
//     const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
//     return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
//   };

//   const uploadToCloudinary = async (imageUri) => {
//     try {
//       setIsUploading(true);
//       setUploadProgress(10);
//       const timestamp = Math.round(Date.now() / 1000);
//       const signature = await generateSignature(timestamp);

//       const form = new FormData();
//       const filename = imageUri.split('/').pop();
//       const match = /\.(\w+)$/.exec(filename || '');
//       const type = match ? `image/${match[1]}` : `image/jpeg`;

//       form.append('file', {
//         uri: imageUri,
//         type,
//         name: filename || `image_${Date.now()}.jpg`,
//       });
//       form.append('timestamp', timestamp.toString());
//       form.append('signature', signature);
//       form.append('api_key', CLOUDINARY_CONFIG.apiKey);

//       setUploadProgress(40);

//       const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         body: form,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setUploadProgress(80);
//       const text = await response.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         return { success: false, error: 'Invalid Cloudinary response', details: text };
//       }

//       if (response.ok && data.secure_url) {
//         setUploadProgress(100);
//         return { success: true, url: data.secure_url, publicId: data.public_id };
//       } else {
//         return { success: false, error: data.error?.message || `Status ${response.status}`, details: data };
//       }
//     } catch (err) {
//       return { success: false, error: err.message || String(err) };
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'We need gallery access to select an image.');
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.8,
//     });

//     if (!res.canceled && res.assets && res.assets[0]) {
//       const asset = res.assets[0];
//       setSelectedImage({ uri: asset.uri });
//       setUploadProgress(0);
//       setIsUploading(true);
//       const uploaded = await uploadToCloudinary(asset.uri);
//       setIsUploading(false);

//       if (uploaded.success) {
//         setFormData((p) => ({ ...p, image: uploaded.url }));
//       } else {
//         Alert.alert('Upload failed', uploaded.error || 'Unknown error');
//         setSelectedImage(null);
//         setFormData((p) => ({ ...p, image: null }));
//         setUploadProgress(0);
//       }
//     }
//   };

//   const removeSelectedImage = () => {
//     setSelectedImage(null);
//     setFormData((p) => ({ ...p, image: null }));
//     setUploadProgress(0);
//   };

//   const addMaterial = () => {
//     if (!materialName.trim() || !materialUnits.trim() || !materialQuantity.trim()) {
//       Alert.alert('Validation', 'Please fill all material fields');
//       return;
//     }

//     const newMaterial = {
//       material_name: materialName.trim(),
//       units: materialUnits.trim(),
//       quantity: Number(materialQuantity)
//     };

//     setFormData(prev => ({
//       ...prev,
//       material: [...prev.material, newMaterial]
//     }));

//     // Clear material fields
//     setMaterialName('');
//     setMaterialUnits('');
//     setMaterialQuantity('');
//   };

//   const removeMaterial = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       material: prev.material.filter((_, i) => i !== index)
//     }));
//   };

//   const validate = () => {
//     if (!formData.projectTypeName.trim()) { 
//       Alert.alert('Validation', 'Project Type Name is required'); 
//       return false; 
//     }
//     if (!formData.category.trim()) { 
//       Alert.alert('Validation', 'Category is required'); 
//       return false; 
//     }
//     if (!formData.description.trim()) { 
//       Alert.alert('Validation', 'Description is required'); 
//       return false; 
//     }
//     if (!formData.image) { 
//       Alert.alert('Validation', 'Image is required'); 
//       return false; 
//     }
//     if (!formData.landArea.trim()) { 
//       Alert.alert('Validation', 'Land Area is required'); 
//       return false; 
//     }
//     if (!formData.estimated_days.trim()) { 
//       Alert.alert('Validation', 'Estimated Days is required'); 
//       return false; 
//     }
//     if (!formData.budgetMinRange.trim()) { 
//       Alert.alert('Validation', 'Budget Min Range is required'); 
//       return false; 
//     }
//     if (!formData.budgetMaxRange.trim()) { 
//       Alert.alert('Validation', 'Budget Max Range is required'); 
//       return false; 
//     }
//     if (formData.material.length === 0) { 
//       Alert.alert('Validation', 'At least one material is required'); 
//       return false; 
//     }
//     return true;
//   };

//   const handleSave = async () => {
//     if (!validate()) return;
//     if (isUploading) { 
//       Alert.alert('Please wait', 'Image is still uploading.'); 
//       return; 
//     }

//     setIsSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const requestData = {
//         projectTypeName: formData.projectTypeName.trim(),
//         category: formData.category.trim(),
//         description: formData.description.trim(),
//         image: formData.image,
//         landArea: formData.landArea.trim(),
//         estimated_days: Number(formData.estimated_days),
//         budgetMinRange: formData.budgetMinRange.trim(),
//         budgetMaxRange: formData.budgetMaxRange.trim(),
//         material: formData.material,
//         siteSurvey: siteSurveyData,
//         createdAt: formData.createdAt
//       };
// console.log("requested data",requestData);
//       // let resp;
//       // if (isEditMode) {
//       //   // update flow
//       //   resp = await fetch(`${API_URL}/api/project-types/${initialData.id}`, {
//       //     method: 'PUT',
//       //     headers: {
//       //       'Content-Type': 'application/json',
//       //       ...(token && { Authorization: `Bearer ${token}` }),
//       //     },
//       //     body: JSON.stringify(requestData),
//       //   });
//       // } else {
//       //   // create flow
//       //   resp = await fetch(`${API_URL}/api/project-types`, {
//       //     method: 'POST',
//       //     headers: {
//       //       'Content-Type': 'application/json',
//       //       ...(token && { Authorization: `Bearer ${token}` }),
//       //     },
//       //     body: JSON.stringify(requestData),
//       //   });
//       // }

//       // if (resp.ok) {
//       //   const createdOrUpdated = await resp.json();
//       //   const mapped = {
//       //     id: createdOrUpdated._id || createdOrUpdated.id || (isEditMode ? initialData.id : Math.random().toString(36).slice(2)),
//       //     projectTypeName: createdOrUpdated.projectTypeName || requestData.projectTypeName,
//       //     name: createdOrUpdated.projectTypeName || requestData.projectTypeName,
//       //     category: (createdOrUpdated.category || requestData.category).toString().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
//       //     categoryColor: getCategoryColor(createdOrUpdated.category || requestData.category),
//       //     lastModified: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
//       //     image: createdOrUpdated.image || requestData.image,
//       //     description: createdOrUpdated.description || requestData.description,
//       //     landArea: createdOrUpdated.landArea || requestData.landArea,
//       //     estimated_days: createdOrUpdated.estimated_days || requestData.estimated_days,
//       //     budgetMinRange: createdOrUpdated.budgetMinRange || requestData.budgetMinRange,
//       //     budgetMaxRange: createdOrUpdated.budgetMaxRange || requestData.budgetMaxRange,
//       //     material: createdOrUpdated.material || requestData.material,
//       //     createdAt: createdOrUpdated.createdAt || requestData.createdAt,
//       //     raw: createdOrUpdated,
//       //   };

//       //   if (isEditMode) {
//       //     Alert.alert('Success', 'Template updated successfully!');
//       //   } else {
//       //     Alert.alert('Success', 'Project type created successfully!');
//       //   }
        
//       //   // Navigate back to ProposalsListScreen
//       //   navigation.goBack();
//       // } else {
//       //   const txt = await resp.text();
//       //   let errMsg = 'Failed to save template. Please try again.';
//       //   try { 
//       //     const j = JSON.parse(txt); 
//       //     errMsg = j.message || errMsg; 
//       //   } catch(e) { 
//       //     if (txt) errMsg = txt; 
//       //   }
//       //   Alert.alert('Error', errMsg);
//       // }
//     } catch (err) {
//       Alert.alert('Network error', 'Unable to save. Check your connection.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
//       <Header
//         title={isEditMode ? "Edit Project Type" : "Create Project Type"}
//         leftIcon="arrow-left"
//         onLeftIconPress={handleCancel}
//         rightIcon={null}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Project Type Name */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Project Type Name *</Text>
//             <TextInput
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 14,
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#000000',
//                 borderWidth: 1,
//                 borderColor: formData.projectTypeName ? '#0066FF' : '#E0E0E0',
//               }}
//               placeholder="Enter project type name"
//               placeholderTextColor="#999999"
//               value={formData.projectTypeName}
//               onChangeText={(v) => setFormData(p => ({ ...p, projectTypeName: v }))}
//               editable={!isSubmitting}
//               returnKeyType="next"
//               blurOnSubmit={false}
//             />
//           </View>

//           {/* Category */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Category *</Text>
//             <TextInput
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 14,
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#000000',
//                 borderWidth: 1,
//                 borderColor: formData.category ? '#0066FF' : '#E0E0E0',
//               }}
//               placeholder="e.g., Residential, Commercial, Office"
//               placeholderTextColor="#999999"
//               value={formData.category}
//               onChangeText={(v) => setFormData(p => ({ ...p, category: v }))}
//               editable={!isSubmitting}
//               returnKeyType="next"
//             />
//           </View>

//           {/* Description */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Description *</Text>
//             <TextInput
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 14,
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#000000',
//                 borderWidth: 1,
//                 borderColor: formData.description ? '#0066FF' : '#E0E0E0',
//                 minHeight: 100,
//                 textAlignVertical: 'top',
//               }}
//               placeholder="Enter project type description"
//               placeholderTextColor="#999999"
//               value={formData.description}
//               onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
//               multiline
//               numberOfLines={4}
//               editable={!isSubmitting}
//               returnKeyType="done"
//             />
//           </View>

//           {/* Land Area */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Land Area *</Text>
//             <TextInput
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 14,
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#000000',
//                 borderWidth: 1,
//                 borderColor: formData.landArea ? '#0066FF' : '#E0E0E0',
//               }}
//               placeholder="e.g., 1000 sq ft"
//               placeholderTextColor="#999999"
//               value={formData.landArea}
//               onChangeText={(v) => setFormData(p => ({ ...p, landArea: v }))}
//               editable={!isSubmitting}
//               keyboardType="default"
//             />
//           </View>

//           {/* Estimated Days */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Estimated Days *</Text>
//             <TextInput
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 14,
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#000000',
//                 borderWidth: 1,
//                 borderColor: formData.estimated_days ? '#0066FF' : '#E0E0E0',
//               }}
//               placeholder="e.g., 30"
//               placeholderTextColor="#999999"
//               value={formData.estimated_days}
//               onChangeText={(v) => setFormData(p => ({ ...p, estimated_days: v }))}
//               editable={!isSubmitting}
//               keyboardType="numeric"
//             />
//           </View>

//           {/* Budget Range */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Budget Range *</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//               <TextInput
//                 style={{
//                   flex: 1,
//                   backgroundColor: '#F5F5F5',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 14,
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 14,
//                   color: '#000000',
//                   borderWidth: 1,
//                   borderColor: formData.budgetMinRange ? '#0066FF' : '#E0E0E0',
//                   marginRight: 8,
//                 }}
//                 placeholder="Min (₹)"
//                 placeholderTextColor="#999999"
//                 value={formData.budgetMinRange}
//                 onChangeText={(v) => setFormData(p => ({ ...p, budgetMinRange: v }))}
//                 editable={!isSubmitting}
//                 keyboardType="numeric"
//               />
//               <TextInput
//                 style={{
//                   flex: 1,
//                   backgroundColor: '#F5F5F5',
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 14,
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 14,
//                   color: '#000000',
//                   borderWidth: 1,
//                   borderColor: formData.budgetMaxRange ? '#0066FF' : '#E0E0E0',
//                   marginLeft: 8,
//                 }}
//                 placeholder="Max (₹)"
//                 placeholderTextColor="#999999"
//                 value={formData.budgetMaxRange}
//                 onChangeText={(v) => setFormData(p => ({ ...p, budgetMaxRange: v }))}
//                 editable={!isSubmitting}
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>

//           {/* Materials Section */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Materials *</Text>
            
//             {/* Add Material Form */}
//             <View style={{ backgroundColor: '#F8FAFF', borderRadius: 12, padding: 12, marginBottom: 12 }}>
//               <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#0066FF', marginBottom: 8 }}>Add New Material</Text>
              
//               <TextInput
//                 style={{
//                   backgroundColor: 'white',
//                   borderRadius: 8,
//                   paddingHorizontal: 12,
//                   paddingVertical: 10,
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 14,
//                   color: '#000000',
//                   borderWidth: 1,
//                   borderColor: '#E0E0E0',
//                   marginBottom: 8,
//                 }}
//                 placeholder="Material Name"
//                 placeholderTextColor="#999999"
//                 value={materialName}
//                 onChangeText={setMaterialName}
//                 editable={!isSubmitting}
//               />
              
//               <View style={{ flexDirection: 'row', marginBottom: 8 }}>
//                 <TextInput
//                   style={{
//                     flex: 1,
//                     backgroundColor: 'white',
//                     borderRadius: 8,
//                     paddingHorizontal: 12,
//                     paddingVertical: 10,
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 14,
//                     color: '#000000',
//                     borderWidth: 1,
//                     borderColor: '#E0E0E0',
//                     marginRight: 8,
//                   }}
//                   placeholder="Units"
//                   placeholderTextColor="#999999"
//                   value={materialUnits}
//                   onChangeText={setMaterialUnits}
//                   editable={!isSubmitting}
//                 />
//                 <TextInput
//                   style={{
//                     flex: 1,
//                     backgroundColor: 'white',
//                     borderRadius: 8,
//                     paddingHorizontal: 12,
//                     paddingVertical: 10,
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 14,
//                     color: '#000000',
//                     borderWidth: 1,
//                     borderColor: '#E0E0E0',
//                     marginLeft: 8,
//                   }}
//                   placeholder="Quantity"
//                   placeholderTextColor="#999999"
//                   value={materialQuantity}
//                   onChangeText={setMaterialQuantity}
//                   editable={!isSubmitting}
//                   keyboardType="numeric"
//                 />
//               </View>
              
//               <TouchableOpacity 
//                 onPress={addMaterial}
//                 style={{ backgroundColor: '#0066FF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
//                 disabled={isSubmitting}
//               >
//                 <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Add Material</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Materials List */}
//             {formData.material.length > 0 ? (
//               <View>
//                 <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#666666', marginBottom: 8 }}>
//                   Added Materials ({formData.material.length})
//                 </Text>
//                 {formData.material.map((item, index) => (
//                   <View key={index} style={{ 
//                     backgroundColor: 'white', 
//                     borderRadius: 8, 
//                     padding: 12, 
//                     marginBottom: 8,
//                     borderWidth: 1,
//                     borderColor: '#F0F0F0',
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000' }}>
//                         {item.material_name}
//                       </Text>
//                       <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>
//                         {item.quantity} {item.units}
//                       </Text>
//                     </View>
//                     <TouchableOpacity 
//                       onPress={() => removeMaterial(index)}
//                       disabled={isSubmitting}
//                     >
//                       <Feather name="trash-2" size={16} color="#FF4444" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             ) : (
//               <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#999999', textAlign: 'center', marginTop: 8 }}>
//                 No materials added yet
//               </Text>
//             )}
//           </View>

//           {/* Image */}
//           <View style={{ marginBottom: 24 }}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Image *</Text>

//             {selectedImage ? (
//               <View style={{ marginBottom: 12 }}>
//                 <Image source={{ uri: selectedImage.uri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
//                 {isUploading && (
//                   <View style={{ marginBottom: 8 }}>
//                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
//                       <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>Uploading...</Text>
//                       <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>{uploadProgress}%</Text>
//                     </View>
//                     <View style={{ height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 }}>
//                       <View style={{ height: 4, backgroundColor: '#0066FF', borderRadius: 2, width: `${uploadProgress}%` }} />
//                     </View>
//                   </View>
//                 )}
//                 {formData.image && !isUploading && (
//                   <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#00C851', marginBottom: 8 }}>✓ Image uploaded successfully to Cloudinary</Text>
//                 )}
//                 <TouchableOpacity 
//                   onPress={removeSelectedImage} 
//                   style={{ backgroundColor: '#FF4444', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }} 
//                   disabled={isUploading}
//                 >
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Remove Image</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 onPress={pickImage} 
//                 disabled={isUploading} 
//                 style={{ 
//                   borderWidth: 2, 
//                   borderColor: '#0066FF', 
//                   borderStyle: 'dashed', 
//                   borderRadius: 12, 
//                   padding: 40, 
//                   alignItems: 'center', 
//                   justifyContent: 'center', 
//                   backgroundColor: '#F8FAFF' 
//                 }}
//               >
//                 {isUploading ? (
//                   <ActivityIndicator size="large" color="#0066FF" />
//                 ) : (
//                   <>
//                     <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
//                     <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, color: '#0066FF' }}>Select Image</Text>
//                     <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>
//                       Tap to choose an image from your gallery
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//            <TouchableOpacity
//           onPress={()=>navigation.navigate('SiteSurveyTemplate',{
//       siteSurveyData,
//        formData, // pass existing data if editing
//     })}
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 padding: 16,
//                 backgroundColor: '#F8FAFF',
//                 borderRadius: 12,
//                 borderWidth: 1,
//                 borderColor: '#0066FF',
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <Feather name="map-pin" size={20} color="#0066FF" style={{ marginRight: 10 }} />
//                 <View>
//                  <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
//   {siteSurveyData ? 'Site Survey Added' : 'Include Site Survey'}
// </Text>
// {siteSurveyData && (
//   <Text style={{ fontSize: 12, color: '#00C851' }}>
//     ✓ Survey completed
//   </Text>
// )}
//                   <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 2 }}>
//                     Add site location and survey details
//                   </Text>
//                 </View>
//               </View>
//               <Feather 
//                 name={"chevron-up" } 
//                 size={20} 
//                 color="#0066FF" 
//               />
//             </TouchableOpacity>
//         </ScrollView>
        

//         {/* Footer Buttons */}
//         <View style={{
//           flexDirection: 'row',
//           paddingHorizontal: 20,
//           paddingVertical: 16,
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderTopColor: '#F0F0F0'
//         }}>
//           <TouchableOpacity
//             onPress={handleCancel}
//             style={{ 
//               flex: 1, 
//               backgroundColor: '#F5F5F5', 
//               borderRadius: 12, 
//               paddingVertical: 14, 
//               alignItems: 'center', 
//               marginRight: 12,
//               opacity: isSubmitting ? 0.6 : 1 
//             }}
//             disabled={isSubmitting}
//           >
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#666666' }}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleSave}
//             style={{ 
//               flex: 1, 
//               backgroundColor: '#0066FF', 
//               borderRadius: 12, 
//               paddingVertical: 14, 
//               alignItems: 'center',
//               opacity: (isSubmitting || isUploading || !formData.projectTypeName || !formData.category || !formData.description || !formData.image || !formData.landArea || !formData.estimated_days || !formData.budgetMinRange || !formData.budgetMaxRange || formData.material.length === 0) ? 0.6 : 1 
//             }}
//             disabled={isSubmitting || isUploading || !formData.projectTypeName || !formData.category || !formData.description || !formData.image || !formData.landArea || !formData.estimated_days || !formData.budgetMinRange || !formData.budgetMaxRange || formData.material.length === 0}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>
//                 {isEditMode ? 'Save Changes' : 'Create Project Type'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default CreateTemplate;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSurvey } from '../../context/StoreProvider';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import debounce from 'lodash/debounce';

/* -------------------- Cloudinary config -------------------- */
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};


const API_URL = `${process.env.BASE_API_URL}`;

const CreateTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Zustand store
  const {
    surveyData,
    templateFormData,
    mode,
    initialData,
    setSurveyData,
    setTemplateFormData,
    setMode,
    setInitialData,
    clearStore,
    saveAll,
  } = useSurvey();
  
  const [formData, setFormData] = useState({ 
    projectTypeName: '', 
    category: '', 
    description: '', 
    image: null,
    landArea: '',
    estimated_days: '',
    budgetMinRange: '',
    budgetMaxRange: '',
    material: [],
    siteSurvey: null,
    createdAt: new Date().toISOString().split('T')[0]
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Material fields state
  const [materialName, setMaterialName] = useState('');
  const [materialUnits, setMaterialUnits] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');

  // Check if edit mode
  const isEditMode = mode === 'edit';

  // Initialize component from store and route params
  useEffect(() => {
    console.log("🔄 Initializing CreateTemplate...");
    
    // Get data from route params (highest priority)
    const routeParams = route.params || {};
    const routeSurveyData = routeParams.siteSurveyData;
    const routeFormData = routeParams.formData;
    const routeMode = routeParams.mode;
    const routeInitialData = routeParams.initialData;
    
    // Priority: Route params > Store data > Defaults
    const finalMode = routeMode || mode || 'create';
    const finalInitialData = routeInitialData || initialData;
    const finalSurveyData = routeSurveyData || surveyData;
    const finalFormData = routeFormData || templateFormData;
    
    // Update store with route params if provided
    if (routeMode && routeMode !== mode) {
      setMode(routeMode);
    }
    if (routeInitialData && JSON.stringify(routeInitialData) !== JSON.stringify(initialData)) {
      setInitialData(routeInitialData);
    }
    if (routeSurveyData && JSON.stringify(routeSurveyData) !== JSON.stringify(surveyData)) {
      setSurveyData(routeSurveyData);
    }
    if (routeFormData && JSON.stringify(routeFormData) !== JSON.stringify(templateFormData)) {
      setTemplateFormData(routeFormData);
    }
    
    // Set local form state
    let initialFormData = {};
    
    if (finalMode === 'edit' && finalInitialData) {
      // Edit mode: populate from initialData
      initialFormData = {
        projectTypeName: finalInitialData.projectTypeName || finalInitialData.name || '',
        category: finalInitialData.category || '',
        description: finalInitialData.description || '',
        image: finalInitialData.image || null,
        landArea: finalInitialData.landArea || '',
        estimated_days: finalInitialData.estimated_days ? String(finalInitialData.estimated_days) : '',
        budgetMinRange: finalInitialData.budgetMinRange || '',
        budgetMaxRange: finalInitialData.budgetMaxRange || '',
        material: finalInitialData.material || [],
        siteSurvey: finalInitialData?.siteSurvey || null,
        createdAt: finalInitialData.createdAt || new Date().toISOString().split('T')[0]
      };
      
      // Set image if exists
      if (finalInitialData.image) {
        setSelectedImage({ uri: finalInitialData.image });
        setUploadProgress(100);
      }
    } else if (finalFormData) {
      // Use stored form data
      initialFormData = finalFormData;
      if (finalFormData.image) {
        setSelectedImage({ uri: finalFormData.image });
        setUploadProgress(100);
      }
    }
    
    // Merge with survey data if available
    if (finalSurveyData) {
      initialFormData.siteSurvey = finalSurveyData;
      console.log("✅ Setting survey data from store:", finalSurveyData);
    }
    
    // Set the form data
    setFormData(initialFormData);
    
    // Update last saved time
    if (finalFormData || finalSurveyData) {
      setLastSaved('Just now');
    }
    
  }, [route.params]);

  // Auto-save form data to store with debouncing
  const debouncedSave = useCallback(
    debounce(async (data) => {
      if (!data.projectTypeName && !data.category) {
        return; // Don't save empty forms
      }
      
      setIsSaving(true);
      try {
        await setTemplateFormData(data);
        setIsSaving(false);
        setLastSaved(new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit'
        }));
      } catch (error) {
        console.error('Error saving to store:', error);
        setIsSaving(false);
      }
    }, 1500),
    []
  );

  // Trigger auto-save on form changes
  useEffect(() => {
    debouncedSave(formData);
    
    // Cleanup
    return () => {
      debouncedSave.cancel();
    };
  }, [formData, debouncedSave]);

  // Cloudinary functions
  const generateSignature = async (timestamp) => {
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const form = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      form.append('file', {
        uri: imageUri,
        type,
        name: filename || `image_${Date.now()}.jpg`,
      });
      form.append('timestamp', timestamp.toString());
      form.append('signature', signature);
      form.append('api_key', CLOUDINARY_CONFIG.apiKey);

      setUploadProgress(40);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadProgress(80);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return { success: false, error: 'Invalid Cloudinary response', details: text };
      }

      if (response.ok && data.secure_url) {
        setUploadProgress(100);
        return { success: true, url: data.secure_url, publicId: data.public_id };
      } else {
        return { success: false, error: data.error?.message || `Status ${response.status}`, details: data };
      }
    } catch (err) {
      return { success: false, error: err.message || String(err) };
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need gallery access to select an image.');
      return;
    }
    
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!res.canceled && res.assets && res.assets[0]) {
      const asset = res.assets[0];
      setSelectedImage({ uri: asset.uri });
      setUploadProgress(0);
      setIsUploading(true);
      
      const uploaded = await uploadToCloudinary(asset.uri);
      setIsUploading(false);

      if (uploaded.success) {
        const updatedFormData = { ...formData, image: uploaded.url };
        setFormData(updatedFormData);
        setTemplateFormData(updatedFormData); // Save immediately
      } else {
        Alert.alert('Upload failed', uploaded.error || 'Unknown error');
        setSelectedImage(null);
        const updatedFormData = { ...formData, image: null };
        setFormData(updatedFormData);
        setUploadProgress(0);
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    const updatedFormData = { ...formData, image: null };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData); // Save immediately
    setUploadProgress(0);
  };

  // Material functions
  const addMaterial = () => {
    if (!materialName.trim() || !materialUnits.trim() || !materialQuantity.trim()) {
      Alert.alert('Validation', 'Please fill all material fields');
      return;
    }

    const newMaterial = {
      material_name: materialName.trim(),
      units: materialUnits.trim(),
      quantity: Number(materialQuantity) || 0
    };

   const currentMaterial = Array.isArray(formData.material) ? formData.material : [];
  
  const updatedFormData = {
    ...formData,
    material: [...currentMaterial, newMaterial]
  };
    
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData); // Save immediately

    // Clear material fields
    setMaterialName('');
    setMaterialUnits('');
    setMaterialQuantity('');
  };

  const removeMaterial = (index) => {
    const updatedFormData = {
      ...formData,
      material: formData.material.filter((_, i) => i !== index)
    };
    
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData); // Save immediately
  };

  // Validation
  const validate = () => {
    if (!formData.projectTypeName.trim()) { 
      Alert.alert('Validation', 'Project Type Name is required'); 
      return false; 
    }
    if (!formData.category.trim()) { 
      Alert.alert('Validation', 'Category is required'); 
      return false; 
    }
    if (!formData.description.trim()) { 
      Alert.alert('Validation', 'Description is required'); 
      return false; 
    }
    if (!formData.image) { 
      Alert.alert('Validation', 'Image is required'); 
      return false; 
    }
    if (!formData.landArea.trim()) { 
      Alert.alert('Validation', 'Land Area is required'); 
      return false; 
    }
    if (!formData.estimated_days.trim()) { 
      Alert.alert('Validation', 'Estimated Days is required'); 
      return false; 
    }
    if (!formData.budgetMinRange.trim()) { 
      Alert.alert('Validation', 'Budget Min Range is required'); 
      return false; 
    }
    if (!formData.budgetMaxRange.trim()) { 
      Alert.alert('Validation', 'Budget Max Range is required'); 
      return false; 
    }
    if (formData.material?.length === 0) { 
      Alert.alert('Validation', 'At least one material is required'); 
      return false; 
    }
    return true;
  };

  // Handle save
  // const handleSave = async () => {
  //   if (!validate()) return;
  //   if (isUploading) { 
  //     Alert.alert('Please wait', 'Image is still uploading.'); 
  //     return; 
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const requestData = {
  //       projectTypeName: formData.projectTypeName.trim(),
  //       category: formData.category.trim(),
  //       description: formData.description.trim(),
  //       image: formData.image,
  //       landArea: formData.landArea.trim(),
  //       estimated_days: Number(formData.estimated_days),
  //       budgetMinRange: formData.budgetMinRange.trim(),
  //       budgetMaxRange: formData.budgetMaxRange.trim(),
  //       material: formData.material || [],
  //       siteSurvey: surveyData, // Use from store
  //       createdAt: formData.createdAt
  //     };
      
  //     console.log("📤 Submitting data:", requestData);

  //     // Your API call logic here...
  //     // ...

  //     // Clear store after successful save
  //     clearStore();
      
  //     Alert.alert(
  //       'Success', 
  //       isEditMode ? 'Template updated successfully!' : 'Project type created successfully!'
  //     );
      
  //     navigation.goBack();
      
  //   } catch (err) {
  //     Alert.alert('Network error', 'Unable to save. Check your connection.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };



  const handleSave = async () => {
  if (!validate()) return;

  if (isUploading) {
    Alert.alert('Please wait', 'Image is still uploading.');
    return;
  }

  setIsSubmitting(true);

  try {
    const token = await AsyncStorage.getItem('userToken');

    const requestData = {
      projectTypeName: formData.projectTypeName.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image,
      landArea: formData.landArea.trim(),
      estimated_days: Number(formData.estimated_days),
      budgetMinRange: formData.budgetMinRange.trim(),
      budgetMaxRange: formData.budgetMaxRange.trim(),
      material: formData.material || [],
      siteSurvey: surveyData, // ✅ FULL survey object
    };

    console.log("📤 Submitting data:", requestData);

    const response = await fetch(
      `${process.env.BASE_API_URL}/api/project-type-with-survey`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.log("❌ API Error:", result);
      Alert.alert(
        "Error",
        result.message || "Failed to save project type"
      );
      return;
    }

    console.log("✅ Saved successfully:", result);

    // 🧹 Clear local store after success
    clearStore();

    Alert.alert(
      "Success",
      "Project type & site survey created successfully!"
    );

    // navigation.goBack();
    navigation.navigate("ProposalsList");

  } catch (error) {
    console.error("❌ Network error:", error);
    Alert.alert(
      "Network error",
      "Unable to save. Please check your internet connection."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle cancel
  const handleCancel = () => {
    if (formData.projectTypeName || formData.category || surveyData) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              clearStore();
              navigation.goBack();
            }
          },
        ]
      );
    } else {
      clearStore();
      navigation.goBack();
    }
  };

  // Navigate to Site Survey
  const goToSiteSurvey = () => {
    // Save current form data before navigating
    setTemplateFormData(formData);
    
    navigation.navigate('SiteSurveyTemplate', {
      source: 'CreateTemplate',
      timestamp: Date.now(),
    });
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Save indicator component
  const renderSaveIndicator = () => (
    <View style={styles.saveIndicator}>
      {isSaving ? (
        <View style={[styles.indicatorBox, { backgroundColor: '#FFA500' }]}>
          <ActivityIndicator size={12} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.indicatorText}>Saving...</Text>
        </View>
      ) : lastSaved ? (
        <View style={[styles.indicatorBox, { backgroundColor: '#4CAF50' }]}>
          <Feather name="check" size={12} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.indicatorText}>Saved {lastSaved}</Text>
        </View>
      ) : null}
    </View>
  );

  // Survey status indicator
  const renderSurveyStatus = () => {
    if (!surveyData) return null;
    
    return (
      <View style={styles.surveyStatus}>
        <Feather name="check-circle" size={14} color="#00C851" style={{ marginRight: 4 }} />
        <Text style={styles.surveyStatusText}>
          Survey {surveyData.reviewStatus === 'completed' ? 'completed' : 'in draft'}
        </Text>
      </View>
    );
  };

  // Site survey button
  const renderSiteSurveyButton = () => (
    <TouchableOpacity
      onPress={goToSiteSurvey}
      style={styles.siteSurveyButton}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Feather name="map-pin" size={20} color="#0066FF" style={{ marginRight: 10 }} />
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.siteSurveyTitle}>
              {surveyData ? '✓ Site Survey Added' : 'Include Site Survey'}
            </Text>
            {renderSurveyStatus()}
          </View>
          <Text style={styles.siteSurveySubtitle}>
            Add site location and survey details
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#0066FF" />
    </TouchableOpacity>
  );

  // Check if save button should be enabled
  const isSaveEnabled = () => {
    if (isSubmitting || isUploading) return false;
    if (!formData.projectTypeName || !formData.category || !formData.description) return false;
    if (!formData.image || !formData.landArea || !formData.estimated_days) return false;
    if (!formData.budgetMinRange || !formData.budgetMaxRange) return false;
    if (formData.material?.length === 0) return false;
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Header
        title={isEditMode ? "Edit Project Type" : "Create Project Type"}
        leftIcon="arrow-left"
        onLeftIconPress={handleCancel}
        rightIcon={null}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {renderSaveIndicator()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Project Type Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Project Type Name *</Text>
            <TextInput
              style={[
                styles.input,
                formData.projectTypeName ? styles.inputFocused : styles.inputDefault
              ]}
              placeholder="Enter project type name"
              placeholderTextColor="#999999"
              value={formData.projectTypeName}
              onChangeText={(v) => updateField('projectTypeName', v)}
              editable={!isSubmitting}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          {/* Category */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={[
                styles.input,
                formData.category ? styles.inputFocused : styles.inputDefault
              ]}
              placeholder="e.g., Residential, Commercial, Office"
              placeholderTextColor="#999999"
              value={formData.category}
              onChangeText={(v) => updateField('category', v)}
              editable={!isSubmitting}
              returnKeyType="next"
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[
                styles.textArea,
                formData.description ? styles.inputFocused : styles.inputDefault
              ]}
              placeholder="Enter project type description"
              placeholderTextColor="#999999"
              value={formData.description}
              onChangeText={(v) => updateField('description', v)}
              multiline
              numberOfLines={4}
              editable={!isSubmitting}
              returnKeyType="done"
            />
          </View>

          {/* Land Area */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Land Area *</Text>
            <TextInput
              style={[
                styles.input,
                formData.landArea ? styles.inputFocused : styles.inputDefault
              ]}
              placeholder="e.g., 1000 sq ft"
              placeholderTextColor="#999999"
              value={formData.landArea}
              onChangeText={(v) => updateField('landArea', v)}
              editable={!isSubmitting}
              keyboardType="default"
            />
          </View>

          {/* Estimated Days */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Estimated Days *</Text>
            <TextInput
              style={[
                styles.input,
                formData.estimated_days ? styles.inputFocused : styles.inputDefault
              ]}
              placeholder="e.g., 30"
              placeholderTextColor="#999999"
              value={formData.estimated_days}
              onChangeText={(v) => updateField('estimated_days', v)}
              editable={!isSubmitting}
              keyboardType="numeric"
            />
          </View>

          {/* Budget Range */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Budget Range *</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={[
                  styles.budgetInput,
                  formData.budgetMinRange ? styles.inputFocused : styles.inputDefault,
                  { marginRight: 8 }
                ]}
                placeholder="Min (₹)"
                placeholderTextColor="#999999"
                value={formData.budgetMinRange}
                onChangeText={(v) => updateField('budgetMinRange', v)}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
              <TextInput
                style={[
                  styles.budgetInput,
                  formData.budgetMaxRange ? styles.inputFocused : styles.inputDefault,
                  { marginLeft: 8 }
                ]}
                placeholder="Max (₹)"
                placeholderTextColor="#999999"
                value={formData.budgetMaxRange}
                onChangeText={(v) => updateField('budgetMaxRange', v)}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Materials Section */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Materials *</Text>
            
            {/* Add Material Form */}
            <View style={styles.materialForm}>
              <Text style={styles.materialFormTitle}>Add New Material</Text>
              
              <TextInput
                style={styles.materialInput}
                placeholder="Material Name"
                placeholderTextColor="#999999"
                value={materialName}
                onChangeText={setMaterialName}
                editable={!isSubmitting}
              />
              
              <View style={{ flexDirection: 'row', marginBottom: 8 , marginTop:4 }}>
                <TextInput
                  style={[styles.materialInput, { flex: 1, marginRight: 8 }]}
                  placeholder="Units"
                  placeholderTextColor="#999999"
                  value={materialUnits}
                  onChangeText={setMaterialUnits}
                  editable={!isSubmitting}
                />
                <TextInput
                  style={[styles.materialInput, { flex: 1, marginLeft: 8 }]}
                  placeholder="Quantity"
                  placeholderTextColor="#999999"
                  value={materialQuantity}
                  onChangeText={setMaterialQuantity}
                  editable={!isSubmitting}
                  keyboardType="numeric"
                />
              </View>
              
              <TouchableOpacity 
                onPress={addMaterial}
                style={styles.addMaterialButton}
                disabled={isSubmitting}
              >
                <Text style={styles.addMaterialButtonText}>Add Material</Text>
              </TouchableOpacity>
            </View>

            {/* Materials List */}
            {formData.material?.length > 0 ? (
              <View>
                <Text style={styles.materialCount}>
                  Added Materials ({formData.material?.length})
                </Text>
                {formData.material.map((item, index) => (
                  <View key={index} style={styles.materialItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.materialName}>
                        {item.material_name}
                      </Text>
                      <Text style={styles.materialDetails}>
                        {item.quantity} {item.units}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeMaterial(index)}
                      disabled={isSubmitting}
                    >
                      <Feather name="trash-2" size={16} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noMaterialsText}>
                No materials added yet
              </Text>
            )}
          </View>

          {/* Image */}
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>Image *</Text>

            {selectedImage ? (
              <View style={{ marginBottom: 12 }}>
                <Image 
                  source={{ uri: selectedImage.uri }} 
                  style={styles.selectedImage} 
                  resizeMode="cover" 
                />
                {isUploading && (
                  <View style={{ marginBottom: 8 }}>
                    <View style={styles.uploadProgressHeader}>
                      <Text style={styles.uploadProgressText}>Uploading...</Text>
                      <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                    </View>
                  </View>
                )}
                {formData.image && !isUploading && (
                  <Text style={styles.uploadSuccessText}>
                    ✓ Image uploaded successfully to Cloudinary
                  </Text>
                )}
                <TouchableOpacity 
                  onPress={removeSelectedImage} 
                  style={styles.removeImageButton}
                  disabled={isUploading}
                >
                  <Text style={styles.removeImageButtonText}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={pickImage} 
                disabled={isUploading} 
                style={styles.imagePicker}
              >
                {isUploading ? (
                  <ActivityIndicator size="large" color="#0066FF" />
                ) : (
                  <>
                    <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
                    <Text style={styles.imagePickerText}>Select Image</Text>
                    <Text style={styles.imagePickerSubtext}>
                      Tap to choose an image from your gallery
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
          
          {/* Site Survey Button */}
          {renderSiteSurveyButton()}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.cancelButton, isSubmitting && styles.disabledButton]}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.saveButton,
              (!isSaveEnabled() || isSubmitting) && styles.disabledButton
            ]}
            disabled={!isSaveEnabled() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Save Changes' : 'Create Project Type'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#000000',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
  },
  inputDefault: {
    borderColor: '#E0E0E0',
  },
  inputFocused: {
    borderColor: '#0066FF',
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  budgetInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
  },
  materialForm: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  materialFormTitle: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
    color: '#0066FF',
    marginBottom: 8,
  },
  materialInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom:4,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addMaterialButton: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addMaterialButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  materialCount: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  materialItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialName: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  materialDetails: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
  },
  noMaterialsText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  uploadProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  uploadProgressText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#0066FF',
    borderRadius: 2,
  },
  uploadSuccessText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#00C851',
    marginBottom: 8,
  },
  removeImageButton: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  removeImageButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: '#0066FF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFF',
  },
  imagePickerText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#0066FF',
  },
  imagePickerSubtext: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  siteSurveyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0066FF',
    marginBottom: 24,
  },
  siteSurveyTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  siteSurveySubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  saveIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  indicatorBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Urbanist-Medium',
  },
  surveyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  surveyStatusText: {
    fontSize: 12,
    color: '#00C851',
    fontFamily: 'Urbanist-Medium',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: 'white',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CreateTemplate;