

// import React, { useState, useEffect, useCallback } from 'react';
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
//   StyleSheet,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { useSurvey } from '../../context/StoreProvider';
// import * as Crypto from 'expo-crypto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Header from '../../components/Header';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import debounce from 'lodash/debounce';

// /* -------------------- Cloudinary config -------------------- */
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };


// const API_URL = `${process.env.BASE_API_URL}`;

// const CreateTemplate = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
  
//   // Zustand store
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
//     saveAll,
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
//     siteSurvey: null,
//     createdAt: new Date().toISOString().split('T')[0]
//   });
  
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState(null);
  
//   // Material fields state
//   const [materialName, setMaterialName] = useState('');
//   const [materialUnits, setMaterialUnits] = useState('');
//   const [materialQuantity, setMaterialQuantity] = useState('');

//   // Check if edit mode
//   const isEditMode = mode === 'edit';

//   // Initialize component from store and route params
//   useEffect(() => {
//     console.log("🔄 Initializing CreateTemplate...");
    
//     // Get data from route params (highest priority)
//     const routeParams = route.params || {};
//     const routeSurveyData = routeParams.siteSurveyData;
//     const routeFormData = routeParams.formData;
//     const routeMode = routeParams.mode;
//     const routeInitialData = routeParams.initialData;
    
//     // Priority: Route params > Store data > Defaults
//     const finalMode = routeMode || mode || 'create';
//     const finalInitialData = routeInitialData || initialData;
//     const finalSurveyData = routeSurveyData || surveyData;
//     const finalFormData = routeFormData || templateFormData;
    
//     // Update store with route params if provided
//     if (routeMode && routeMode !== mode) {
//       setMode(routeMode);
//     }
//     if (routeInitialData && JSON.stringify(routeInitialData) !== JSON.stringify(initialData)) {
//       setInitialData(routeInitialData);
//     }
//     if (routeSurveyData && JSON.stringify(routeSurveyData) !== JSON.stringify(surveyData)) {
//       setSurveyData(routeSurveyData);
//     }
//     if (routeFormData && JSON.stringify(routeFormData) !== JSON.stringify(templateFormData)) {
//       setTemplateFormData(routeFormData);
//     }
    
//     // Set local form state
//     let initialFormData = {};
    
//     if (finalMode === 'edit' && finalInitialData) {
//       // Edit mode: populate from initialData
//       initialFormData = {
//         projectTypeName: finalInitialData.projectTypeName || finalInitialData.name || '',
//         category: finalInitialData.category || '',
//         description: finalInitialData.description || '',
//         image: finalInitialData.image || null,
//         landArea: finalInitialData.landArea || '',
//         estimated_days: finalInitialData.estimated_days ? String(finalInitialData.estimated_days) : '',
//         budgetMinRange: finalInitialData.budgetMinRange || '',
//         budgetMaxRange: finalInitialData.budgetMaxRange || '',
//         material: finalInitialData.material || [],
//         siteSurvey: finalInitialData?.siteSurvey || null,
//         createdAt: finalInitialData.createdAt || new Date().toISOString().split('T')[0]
//       };
      
//       // Set image if exists
//       if (finalInitialData.image) {
//         setSelectedImage({ uri: finalInitialData.image });
//         setUploadProgress(100);
//       }
//     } else if (finalFormData) {
//       // Use stored form data
//       initialFormData = finalFormData;
//       if (finalFormData.image) {
//         setSelectedImage({ uri: finalFormData.image });
//         setUploadProgress(100);
//       }
//     }
    
//     // Merge with survey data if available
//     if (finalSurveyData) {
//       initialFormData.siteSurvey = finalSurveyData;
//       console.log("✅ Setting survey data from store:", finalSurveyData);
//     }
    
//     // Set the form data
//     setFormData(initialFormData);
    
//     // Update last saved time
//     if (finalFormData || finalSurveyData) {
//       setLastSaved('Just now');
//     }
    
//   }, [route.params]);

//   // Auto-save form data to store with debouncing
//   const debouncedSave = useCallback(
//     debounce(async (data) => {
//       if (!data.projectTypeName && !data.category) {
//         return; // Don't save empty forms
//       }
      
//       setIsSaving(true);
//       try {
//         await setTemplateFormData(data);
//         setIsSaving(false);
//         setLastSaved(new Date().toLocaleTimeString([], { 
//           hour: '2-digit', 
//           minute: '2-digit'
//         }));
//       } catch (error) {
//         console.error('Error saving to store:', error);
//         setIsSaving(false);
//       }
//     }, 1500),
//     []
//   );

//   // Trigger auto-save on form changes
//   useEffect(() => {
//     debouncedSave(formData);
    
//     // Cleanup
//     return () => {
//       debouncedSave.cancel();
//     };
//   }, [formData, debouncedSave]);

//   // Cloudinary functions
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
//         const updatedFormData = { ...formData, image: uploaded.url };
//         setFormData(updatedFormData);
//         setTemplateFormData(updatedFormData); // Save immediately
//       } else {
//         Alert.alert('Upload failed', uploaded.error || 'Unknown error');
//         setSelectedImage(null);
//         const updatedFormData = { ...formData, image: null };
//         setFormData(updatedFormData);
//         setUploadProgress(0);
//       }
//     }
//   };

//   const removeSelectedImage = () => {
//     setSelectedImage(null);
//     const updatedFormData = { ...formData, image: null };
//     setFormData(updatedFormData);
//     setTemplateFormData(updatedFormData); // Save immediately
//     setUploadProgress(0);
//   };

//   // Material functions
//   const addMaterial = () => {
//     if (!materialName.trim() || !materialUnits.trim() || !materialQuantity.trim()) {
//       Alert.alert('Validation', 'Please fill all material fields');
//       return;
//     }

//     const newMaterial = {
//       material_name: materialName.trim(),
//       units: materialUnits.trim(),
//       quantity: Number(materialQuantity) || 0
//     };

//    const currentMaterial = Array.isArray(formData.material) ? formData.material : [];
  
//   const updatedFormData = {
//     ...formData,
//     material: [...currentMaterial, newMaterial]
//   };
    
//     setFormData(updatedFormData);
//     setTemplateFormData(updatedFormData); // Save immediately

//     // Clear material fields
//     setMaterialName('');
//     setMaterialUnits('');
//     setMaterialQuantity('');
//   };

//   const removeMaterial = (index) => {
//     const updatedFormData = {
//       ...formData,
//       material: formData.material.filter((_, i) => i !== index)
//     };
    
//     setFormData(updatedFormData);
//     setTemplateFormData(updatedFormData); // Save immediately
//   };

//   // Validation
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
//     if (formData.material?.length === 0) { 
//       Alert.alert('Validation', 'At least one material is required'); 
//       return false; 
//     }
//     return true;
//   };

//   // Handle save
//   // const handleSave = async () => {
//   //   if (!validate()) return;
//   //   if (isUploading) { 
//   //     Alert.alert('Please wait', 'Image is still uploading.'); 
//   //     return; 
//   //   }

//   //   setIsSubmitting(true);
//   //   try {
//   //     const token = await AsyncStorage.getItem('userToken');
//   //     const requestData = {
//   //       projectTypeName: formData.projectTypeName.trim(),
//   //       category: formData.category.trim(),
//   //       description: formData.description.trim(),
//   //       image: formData.image,
//   //       landArea: formData.landArea.trim(),
//   //       estimated_days: Number(formData.estimated_days),
//   //       budgetMinRange: formData.budgetMinRange.trim(),
//   //       budgetMaxRange: formData.budgetMaxRange.trim(),
//   //       material: formData.material || [],
//   //       siteSurvey: surveyData, // Use from store
//   //       createdAt: formData.createdAt
//   //     };
      
//   //     console.log("📤 Submitting data:", requestData);

//   //     // Your API call logic here...
//   //     // ...

//   //     // Clear store after successful save
//   //     clearStore();
      
//   //     Alert.alert(
//   //       'Success', 
//   //       isEditMode ? 'Template updated successfully!' : 'Project type created successfully!'
//   //     );
      
//   //     navigation.goBack();
      
//   //   } catch (err) {
//   //     Alert.alert('Network error', 'Unable to save. Check your connection.');
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };



//   const handleSave = async () => {
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
//       siteSurvey: surveyData, // ✅ FULL survey object
//     };

//     console.log("📤 Submitting data:", requestData);

//     const response = await fetch(
//       `${process.env.BASE_API_URL}/api/project-type-with-survey`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       console.log("❌ API Error:", result);
//       Alert.alert(
//         "Error",
//         result.message || "Failed to save project type"
//       );
//       return;
//     }

//     console.log("✅ Saved successfully:", result);

//     // 🧹 Clear local store after success
//     clearStore();

//     Alert.alert(
//       "Success",
//       "Project type & site survey created successfully!"
//     );

//     // navigation.goBack();
//     navigation.navigate("ProposalsList");

//   } catch (error) {
//     console.error("❌ Network error:", error);
//     Alert.alert(
//       "Network error",
//       "Unable to save. Please check your internet connection."
//     );
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   // Handle cancel
//   const handleCancel = () => {
//     if (formData.projectTypeName || formData.category || surveyData) {
//       Alert.alert(
//         'Discard Changes?',
//         'You have unsaved changes. Are you sure you want to discard them?',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Discard', 
//             style: 'destructive',
//             onPress: () => {
//               clearStore();
//               navigation.goBack();
//             }
//           },
//         ]
//       );
//     } else {
//       clearStore();
//       navigation.goBack();
//     }
//   };

//   // Navigate to Site Survey
//   const goToSiteSurvey = () => {
//     // Save current form data before navigating
//     setTemplateFormData(formData);
    
//     navigation.navigate('SiteSurveyTemplate', {
//       source: 'CreateTemplate',
//       timestamp: Date.now(),
//     });
//   };

//   // Update form field
//   const updateField = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Save indicator component
//   const renderSaveIndicator = () => (
//     <View style={styles.saveIndicator}>
//       {isSaving ? (
//         <View style={[styles.indicatorBox, { backgroundColor: '#FFA500' }]}>
//           <ActivityIndicator size={12} color="white" style={{ marginRight: 4 }} />
//           <Text style={styles.indicatorText}>Saving...</Text>
//         </View>
//       ) : lastSaved ? (
//         <View style={[styles.indicatorBox, { backgroundColor: '#4CAF50' }]}>
//           <Feather name="check" size={12} color="white" style={{ marginRight: 4 }} />
//           <Text style={styles.indicatorText}>Saved {lastSaved}</Text>
//         </View>
//       ) : null}
//     </View>
//   );

//   // Survey status indicator
//   const renderSurveyStatus = () => {
//     if (!surveyData) return null;
    
//     return (
//       <View style={styles.surveyStatus}>
//         <Feather name="check-circle" size={14} color="#00C851" style={{ marginRight: 4 }} />
//         <Text style={styles.surveyStatusText}>
//           Survey {surveyData.reviewStatus === 'completed' ? 'completed' : 'in draft'}
//         </Text>
//       </View>
//     );
//   };

//   // Site survey button
//   const renderSiteSurveyButton = () => (
//     <TouchableOpacity
//       onPress={goToSiteSurvey}
//       style={styles.siteSurveyButton}
//     >
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <Feather name="map-pin" size={20} color="#0066FF" style={{ marginRight: 10 }} />
//         <View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Text style={styles.siteSurveyTitle}>
//               {surveyData ? '✓ Site Survey Added' : 'Include Site Survey'}
//             </Text>
//             {renderSurveyStatus()}
//           </View>
//           <Text style={styles.siteSurveySubtitle}>
//             Add site location and survey details
//           </Text>
//         </View>
//       </View>
//       <Feather name="chevron-right" size={20} color="#0066FF" />
//     </TouchableOpacity>
//   );

//   // Check if save button should be enabled
//   const isSaveEnabled = () => {
//     if (isSubmitting || isUploading) return false;
//     if (!formData.projectTypeName || !formData.category || !formData.description) return false;
//     if (!formData.image || !formData.landArea || !formData.estimated_days) return false;
//     if (!formData.budgetMinRange || !formData.budgetMaxRange) return false;
//     if (formData.material?.length === 0) return false;
//     return true;
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

//       {renderSaveIndicator()}

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
//             <Text style={styles.label}>Project Type Name *</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 formData.projectTypeName ? styles.inputFocused : styles.inputDefault
//               ]}
//               placeholder="Enter project type name"
//               placeholderTextColor="#999999"
//               value={formData.projectTypeName}
//               onChangeText={(v) => updateField('projectTypeName', v)}
//               editable={!isSubmitting}
//               returnKeyType="next"
//               blurOnSubmit={false}
//             />
//           </View>

//           {/* Category */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Category *</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 formData.category ? styles.inputFocused : styles.inputDefault
//               ]}
//               placeholder="e.g., Residential, Commercial, Office"
//               placeholderTextColor="#999999"
//               value={formData.category}
//               onChangeText={(v) => updateField('category', v)}
//               editable={!isSubmitting}
//               returnKeyType="next"
//             />
//           </View>

//           {/* Description */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Description *</Text>
//             <TextInput
//               style={[
//                 styles.textArea,
//                 formData.description ? styles.inputFocused : styles.inputDefault
//               ]}
//               placeholder="Enter project type description"
//               placeholderTextColor="#999999"
//               value={formData.description}
//               onChangeText={(v) => updateField('description', v)}
//               multiline
//               numberOfLines={4}
//               editable={!isSubmitting}
//               returnKeyType="done"
//             />
//           </View>

//           {/* Land Area */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Land Area *</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 formData.landArea ? styles.inputFocused : styles.inputDefault
//               ]}
//               placeholder="e.g., 1000 sq ft"
//               placeholderTextColor="#999999"
//               value={formData.landArea}
//               onChangeText={(v) => updateField('landArea', v)}
//               editable={!isSubmitting}
//               keyboardType="default"
//             />
//           </View>

//           {/* Estimated Days */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Estimated Days *</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 formData.estimated_days ? styles.inputFocused : styles.inputDefault
//               ]}
//               placeholder="e.g., 30"
//               placeholderTextColor="#999999"
//               value={formData.estimated_days}
//               onChangeText={(v) => updateField('estimated_days', v)}
//               editable={!isSubmitting}
//               keyboardType="numeric"
//             />
//           </View>

//           {/* Budget Range */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Budget Range *</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//               <TextInput
//                 style={[
//                   styles.budgetInput,
//                   formData.budgetMinRange ? styles.inputFocused : styles.inputDefault,
//                   { marginRight: 8 }
//                 ]}
//                 placeholder="Min (₹)"
//                 placeholderTextColor="#999999"
//                 value={formData.budgetMinRange}
//                 onChangeText={(v) => updateField('budgetMinRange', v)}
//                 editable={!isSubmitting}
//                 keyboardType="numeric"
//               />
//               <TextInput
//                 style={[
//                   styles.budgetInput,
//                   formData.budgetMaxRange ? styles.inputFocused : styles.inputDefault,
//                   { marginLeft: 8 }
//                 ]}
//                 placeholder="Max (₹)"
//                 placeholderTextColor="#999999"
//                 value={formData.budgetMaxRange}
//                 onChangeText={(v) => updateField('budgetMaxRange', v)}
//                 editable={!isSubmitting}
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>

//           {/* Materials Section */}
//           <View style={{ marginBottom: 16 }}>
//             <Text style={styles.label}>Materials *</Text>
            
//             {/* Add Material Form */}
//             <View style={styles.materialForm}>
//               <Text style={styles.materialFormTitle}>Add New Material</Text>
              
//               <TextInput
//                 style={styles.materialInput}
//                 placeholder="Material Name"
//                 placeholderTextColor="#999999"
//                 value={materialName}
//                 onChangeText={setMaterialName}
//                 editable={!isSubmitting}
//               />
              
//               <View style={{ flexDirection: 'row', marginBottom: 8 , marginTop:4 }}>
//                 <TextInput
//                   style={[styles.materialInput, { flex: 1, marginRight: 8 }]}
//                   placeholder="Units"
//                   placeholderTextColor="#999999"
//                   value={materialUnits}
//                   onChangeText={setMaterialUnits}
//                   editable={!isSubmitting}
//                 />
//                 <TextInput
//                   style={[styles.materialInput, { flex: 1, marginLeft: 8 }]}
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
//                 style={styles.addMaterialButton}
//                 disabled={isSubmitting}
//               >
//                 <Text style={styles.addMaterialButtonText}>Add Material</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Materials List */}
//             {formData.material?.length > 0 ? (
//               <View>
//                 <Text style={styles.materialCount}>
//                   Added Materials ({formData.material?.length})
//                 </Text>
//                 {formData.material.map((item, index) => (
//                   <View key={index} style={styles.materialItem}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.materialName}>
//                         {item.material_name}
//                       </Text>
//                       <Text style={styles.materialDetails}>
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
//               <Text style={styles.noMaterialsText}>
//                 No materials added yet
//               </Text>
//             )}
//           </View>

//           {/* Image */}
//           <View style={{ marginBottom: 24 }}>
//             <Text style={styles.label}>Image *</Text>

//             {selectedImage ? (
//               <View style={{ marginBottom: 12 }}>
//                 <Image 
//                   source={{ uri: selectedImage.uri }} 
//                   style={styles.selectedImage} 
//                   resizeMode="cover" 
//                 />
//                 {isUploading && (
//                   <View style={{ marginBottom: 8 }}>
//                     <View style={styles.uploadProgressHeader}>
//                       <Text style={styles.uploadProgressText}>Uploading...</Text>
//                       <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
//                     </View>
//                     <View style={styles.progressBar}>
//                       <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
//                     </View>
//                   </View>
//                 )}
//                 {formData.image && !isUploading && (
//                   <Text style={styles.uploadSuccessText}>
//                     ✓ Image uploaded successfully to Cloudinary
//                   </Text>
//                 )}
//                 <TouchableOpacity 
//                   onPress={removeSelectedImage} 
//                   style={styles.removeImageButton}
//                   disabled={isUploading}
//                 >
//                   <Text style={styles.removeImageButtonText}>Remove Image</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 onPress={pickImage} 
//                 disabled={isUploading} 
//                 style={styles.imagePicker}
//               >
//                 {isUploading ? (
//                   <ActivityIndicator size="large" color="#0066FF" />
//                 ) : (
//                   <>
//                     <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
//                     <Text style={styles.imagePickerText}>Select Image</Text>
//                     <Text style={styles.imagePickerSubtext}>
//                       Tap to choose an image from your gallery
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
          
//           {/* Site Survey Button */}
//           {renderSiteSurveyButton()}
//         </ScrollView>

//         {/* Footer Buttons */}
//         <View style={styles.footer}>
//           <TouchableOpacity
//             onPress={handleCancel}
//             style={[styles.cancelButton, isSubmitting && styles.disabledButton]}
//             disabled={isSubmitting}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleSave}
//             style={[
//               styles.saveButton,
//               (!isSaveEnabled() || isSubmitting) && styles.disabledButton
//             ]}
//             disabled={!isSaveEnabled() || isSubmitting}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator size="small" color="white" />
//             ) : (
//               <Text style={styles.saveButtonText}>
//                 {isEditMode ? 'Save Changes' : 'Create Project Type'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   label: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: '#000000',
//     marginBottom: 8
//   },
//   input: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 14,
//     color: '#000000',
//     borderWidth: 1,
//   },
//   inputDefault: {
//     borderColor: '#E0E0E0',
//   },
//   inputFocused: {
//     borderColor: '#0066FF',
//   },
//   textArea: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 14,
//     color: '#000000',
//     borderWidth: 1,
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   budgetInput: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 14,
//     color: '#000000',
//     borderWidth: 1,
//   },
//   materialForm: {
//     backgroundColor: '#F8FAFF',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   materialFormTitle: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 13,
//     color: '#0066FF',
//     marginBottom: 8,
//   },
//   materialInput: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom:4,
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 14,
//     color: '#000000',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   addMaterialButton: {
//     backgroundColor: '#0066FF',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   addMaterialButtonText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: 'white',
//   },
//   materialCount: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 13,
//     color: '#666666',
//     marginBottom: 8,
//   },
//   materialItem: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#F0F0F0',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   materialName: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: '#000000',
//   },
//   materialDetails: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#666666',
//   },
//   noMaterialsText: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 13,
//     color: '#999999',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   selectedImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   uploadProgressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   uploadProgressText: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#666666',
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 2,
//   },
//   progressFill: {
//     height: 4,
//     backgroundColor: '#0066FF',
//     borderRadius: 2,
//   },
//   uploadSuccessText: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#00C851',
//     marginBottom: 8,
//   },
//   removeImageButton: {
//     backgroundColor: '#FF4444',
//     borderRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//   },
//   removeImageButtonText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: 'white',
//   },
//   imagePicker: {
//     borderWidth: 2,
//     borderColor: '#0066FF',
//     borderStyle: 'dashed',
//     borderRadius: 12,
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F8FAFF',
//   },
//   imagePickerText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 16,
//     color: '#0066FF',
//   },
//   imagePickerSubtext: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#666666',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   siteSurveyButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F8FAFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#0066FF',
//     marginBottom: 24,
//   },
//   siteSurveyTitle: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 16,
//     color: '#000000',
//   },
//   siteSurveySubtitle: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#666666',
//     marginTop: 2,
//   },
//   saveIndicator: {
//     position: 'absolute',
//     top: 60,
//     right: 20,
//     zIndex: 1000,
//   },
//   indicatorBox: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   indicatorText: {
//     color: 'white',
//     fontSize: 10,
//     fontFamily: 'Urbanist-Medium',
//   },
//   surveyStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   surveyStatusText: {
//     fontSize: 12,
//     color: '#00C851',
//     fontFamily: 'Urbanist-Medium',
//   },
//   footer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   cancelButtonText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 15,
//     color: '#666666',
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: '#0066FF',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 15,
//     color: 'white',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

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
  
  const defaultBoqVersion = {
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    materials: [],
    status: 'draft',
    rejectionReason: '',
    laborCost: 0,
    totalMaterialCost: 0,
    totalCost: 0
  };

  const defaultBoq = {
    boqName: '',
    builtUpArea: 0,
    structuralType: '',
    foundationType: '',
    boqVersion: [defaultBoqVersion],
    status: 'draft'
  };
  
  const [formData, setFormData] = useState({ 
    projectTypeName: '', 
    category: '', 
    description: '', 
    image: null,
    landArea: '',
    estimated_days: '',
    budgetMinRange: '',
    budgetMaxRange: '',
    boqs: [],
    siteSurvey: null,
    planData: null,
    milestoneData: null, // Added milestone data field
    createdAt: new Date().toISOString().split('T')[0]
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Per-BOQ material input states
  const [boqMaterialStates, setBoqMaterialStates] = useState({});

  // Check if edit mode
  const isEditMode = mode === 'edit';

  // Helper to ensure boq structure
  const ensureBoqStructure = (boqData) => {
    if (!boqData) return defaultBoq;
    const boq = { ...defaultBoq, ...boqData };
    if (!boq.boqVersion || boq.boqVersion.length === 0) {
      boq.boqVersion = [defaultBoqVersion];
    } else {
      boq.boqVersion = boq.boqVersion.map(v => ({ ...defaultBoqVersion, ...v }));
    }
    return boq;
  };

  // Helper to ensure boqs array structure
  const ensureBoqsStructure = (boqsData) => {
    if (!Array.isArray(boqsData)) return [];
    return boqsData.map(ensureBoqStructure);
  };

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
    
    // Set local form state, starting with current defaults
    let initialFormData = { ...formData };
    
    if (finalMode === 'edit' && finalInitialData) {
      // Edit mode: populate from initialData, preserving defaults where missing
      initialFormData = {
        ...formData,
        projectTypeName: finalInitialData.projectTypeName || finalInitialData.name || formData.projectTypeName,
        category: finalInitialData.category || formData.category,
        description: finalInitialData.description || formData.description,
        image: finalInitialData.image || formData.image,
        landArea: finalInitialData.landArea || formData.landArea,
        estimated_days: finalInitialData.estimated_days ? String(finalInitialData.estimated_days) : formData.estimated_days,
        budgetMinRange: finalInitialData.budgetMinRange || formData.budgetMinRange,
        budgetMaxRange: finalInitialData.budgetMaxRange || formData.budgetMaxRange,
        boqs: ensureBoqsStructure(finalInitialData.boqs || (finalInitialData.boq ? [finalInitialData.boq] : [])),
        siteSurvey: finalInitialData?.siteSurvey || formData.siteSurvey,
        planData: finalInitialData?.planData || formData.planData,
        milestoneData: finalInitialData?.milestoneData || formData.milestoneData, // Added milestone data
        createdAt: finalInitialData.createdAt || formData.createdAt
      };
      
      // Set image if exists
      if (finalInitialData.image) {
        setSelectedImage({ uri: finalInitialData.image });
        setUploadProgress(100);
      }
    } else if (finalFormData) {
      // Use stored form data, merging with defaults
      initialFormData = { ...formData, ...finalFormData };
      initialFormData.boqs = ensureBoqsStructure(finalFormData.boqs || (finalFormData.boq ? [finalFormData.boq] : []));
      initialFormData.planData = finalFormData.planData || formData.planData;
      initialFormData.milestoneData = finalFormData.milestoneData || formData.milestoneData; // Added milestone data
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
    
    // Initialize boqMaterialStates
    if (initialFormData.boqs && initialFormData.boqs.length > 0) {
      const states = {};
      initialFormData.boqs.forEach((_, i) => {
        states[i] = { materialName: '', materialQty: '', materialUnit: '', materialRate: '' };
      });
      setBoqMaterialStates(states);
    }
    
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

  // BOQ functions
  const addNewBoq = () => {
    const versionNumber = formData.boqs.length + 1;
    const newVersion = {
      ...defaultBoqVersion,
      versionNumber
    };
    const newBoq = {
      ...defaultBoq,
      boqVersion: [newVersion]
    };
    const updatedBoqs = [...formData.boqs, newBoq];
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
    const newIndex = updatedBoqs.length - 1;
    setBoqMaterialStates(prev => ({
      ...prev,
      [newIndex]: { materialName: '', materialQty: '', materialUnit: '', materialRate: '' }
    }));
  };

  const updateBoqField = (index, field, value) => {
    const updatedBoqs = [...formData.boqs];
    if (field === 'builtUpArea') {
      updatedBoqs[index][field] = Number(value) || 0;
    } else {
      updatedBoqs[index][field] = value;
    }
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
  };

  const setBoqMaterialState = (index, key, value) => {
    setBoqMaterialStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value
      }
    }));
  };

  const addMaterialToBoq = (index) => {
    const state = boqMaterialStates[index] || {};
    if (!state.materialName?.trim() || !state.materialQty?.trim() || !state.materialUnit?.trim() || !state.materialRate?.trim()) {
      Alert.alert('Validation', 'Please fill all material fields');
      return;
    }
    const qty = Number(state.materialQty);
    const rate = Number(state.materialRate);
    if (qty <= 0 || rate <= 0) {
      Alert.alert('Validation', 'Quantity and Rate must be greater than 0');
      return;
    }
    const newMaterial = {
      name: state.materialName.trim(),
      qty,
      unit: state.materialUnit.trim(),
      rate,
      amount: qty * rate
    };
    const updatedBoqs = [...formData.boqs];
    const currentVersion = updatedBoqs[index].boqVersion[0] || defaultBoqVersion;
    currentVersion.materials = [...(currentVersion.materials || []), newMaterial];
    updateTotal(index, updatedBoqs);
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
    // Clear state
    setBoqMaterialStates(prev => ({
      ...prev,
      [index]: { materialName: '', materialQty: '', materialUnit: '', materialRate: '' }
    }));
  };

  const removeMaterialFromBoq = (index, matIndex) => {
    const updatedBoqs = [...formData.boqs];
    const currentVersion = updatedBoqs[index].boqVersion[0] || defaultBoqVersion;
    currentVersion.materials = (currentVersion.materials || []).filter((_, i) => i !== matIndex);
    updateTotal(index, updatedBoqs);
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
  };

  const updateLaborCost = (index, value) => {
    const updatedBoqs = [...formData.boqs];
    const currentVersion = updatedBoqs[index].boqVersion[0] || defaultBoqVersion;
    currentVersion.laborCost = Number(value) || 0;
    updateTotal(index, updatedBoqs);
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
  };

  const updateTotal = (index, updatedBoqs) => {
    const version = updatedBoqs[index].boqVersion[0] || defaultBoqVersion;
    let materialTotal = 0;
    (version.materials || []).forEach(material => {
      material.amount = material.qty * material.rate;
      materialTotal += material.amount;
    });
    version.totalMaterialCost = materialTotal;
    version.totalCost = materialTotal + version.laborCost;
  };

  const removeBoq = (index) => {
    const updatedBoqs = formData.boqs.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
    // Remove state
    const { [index]: removed, ...rest } = boqMaterialStates;
    setBoqMaterialStates(rest);
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
    // BOQ validation
    if (formData.boqs.length === 0) {
      Alert.alert('Validation', 'At least one BOQ is required');
      return false;
    }
    for (let i = 0; i < formData.boqs.length; i++) {
      const boq = formData.boqs[i];
      if (!boq.boqName?.trim()) {
        Alert.alert('Validation', `BOQ ${i + 1} Name is required`);
        return false;
      }
      if (!boq.builtUpArea || boq.builtUpArea <= 0) {
        Alert.alert('Validation', `BOQ ${i + 1} Built Up Area is required and must be positive`);
        return false;
      }
      if (!boq.structuralType?.trim()) {
        Alert.alert('Validation', `BOQ ${i + 1} Structural Type is required`);
        return false;
      }
      if (!boq.foundationType?.trim()) {
        Alert.alert('Validation', `BOQ ${i + 1} Foundation Type is required`);
        return false;
      }
      const version = boq.boqVersion?.[0];
      if (!version || (version.materials || []).length === 0) {
        Alert.alert('Validation', `At least one material is required in BOQ ${i + 1}`);
        return false;
      }
      if (version.laborCost < 0) {
        Alert.alert('Validation', `Labor Cost for BOQ ${i + 1} must be non-negative`);
        return false;
      }
    }
    return true;
  };

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
        boqs: formData.boqs.map(boq => ({
          boqName: boq.boqName?.trim() || '',
          builtUpArea: Number(boq.builtUpArea) || 0,
          structuralType: boq.structuralType?.trim() || '',
          foundationType: boq.foundationType?.trim() || '',
          boqVersion: (boq.boqVersion || []).map(version => ({
            versionNumber: version.versionNumber || 1,
            createdAt: version.createdAt || new Date().toISOString(),
            materials: version.materials || [],
            status: version.status || 'draft',
            rejectionReason: version.rejectionReason || '',
            laborCost: Number(version.laborCost) || 0,
            totalMaterialCost: Number(version.totalMaterialCost) || 0,
            totalCost: Number(version.totalCost) || 0
          })),
          status: boq.status || 'draft'
        })),
        siteSurvey: surveyData,
        planData: formData.planData,
        milestoneData: formData.milestoneData, // Added milestone data
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
    if (formData.projectTypeName || formData.category || surveyData || formData.boqs.length > 0) {
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

  // Navigate to Template Plan Screen
  const goToTemplatePlan = () => {
    // Save current form data before navigating
    setTemplateFormData(formData);
    
    navigation.navigate('TemplatePlanScreen', {
      source: 'CreateTemplate',
      timestamp: Date.now(),
      formData: formData,
      mode: mode,
    });
  };

  // Navigate to Milestone Screen
  const goToMilestone = () => {
    // Save current form data before navigating
    setTemplateFormData(formData);
    
    navigation.navigate('MilestoneScreen', {
      source: 'CreateTemplate',
      timestamp: Date.now(),
      formData: formData,
      mode: mode,
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

  // Add Plan button
  const renderAddPlanButton = () => {
    // Check if plan data exists
    const hasPlan = formData.planData && Object.keys(formData.planData).length > 0;
    
    return (
      <TouchableOpacity
        onPress={goToTemplatePlan}
        style={styles.addPlanButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather 
            name={hasPlan ? "check-circle" : "file-text"} 
            size={20} 
            color={hasPlan ? "#00C851" : "#0066FF"} 
            style={{ marginRight: 10 }} 
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.addPlanTitle}>
                {hasPlan ? '✓ Project Plan Added' : 'Add Project Plan'}
              </Text>
              {hasPlan && (
                <View style={styles.planStatus}>
                  <Feather name="check" size={12} color="#00C851" />
                  <Text style={styles.planStatusText}>
                    Plan ready
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.addPlanSubtitle}>
              Add project phases, milestones, and timelines
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#0066FF" />
      </TouchableOpacity>
    );
  };

  // Add Milestone button
  const renderAddMilestoneButton = () => {
    // Check if milestone data exists
    const hasMilestone = formData.milestoneData && Object.keys(formData.milestoneData).length > 0;
    
    return (
      <TouchableOpacity
        onPress={goToMilestone}
        style={styles.addMilestoneButton}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather 
            name={hasMilestone ? "check-circle" : "flag"} 
            size={20} 
            color={hasMilestone ? "#00C851" : "#0066FF"} 
            style={{ marginRight: 10 }} 
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.addMilestoneTitle}>
                {hasMilestone ? '✓ Milestones Added' : 'Add Milestones'}
              </Text>
              {hasMilestone && (
                <View style={styles.milestoneStatus}>
                  <Feather name="check" size={12} color="#00C851" />
                  <Text style={styles.milestoneStatusText}>
                    {formData.milestoneData?.milestones?.length || 0} milestones
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.addMilestoneSubtitle}>
              Define project milestones and delivery dates
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color="#0066FF" />
      </TouchableOpacity>
    );
  };

  // Check if save button should be enabled
  const isSaveEnabled = () => {
    if (isSubmitting || isUploading) return false;
    if (!formData.projectTypeName.trim() || !formData.category.trim() || !formData.description.trim()) return false;
    if (!formData.image || !formData.landArea.trim() || !formData.estimated_days.trim()) return false;
    if (!formData.budgetMinRange.trim() || !formData.budgetMaxRange.trim()) return false;
    if (formData.boqs.length === 0) return false;
    const isBoqValid = (boq) => {
      if (!boq.boqName?.trim() || !boq.builtUpArea || boq.builtUpArea <= 0 || !boq.structuralType?.trim() || !boq.foundationType?.trim()) return false;
      const version = boq.boqVersion?.[0];
      if (!version || (version.materials || []).length === 0 || version.laborCost < 0) return false;
      return true;
    };
    return formData.boqs.every(isBoqValid);
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

          {/* BOQs Section */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Bill of Quantities (BOQs) *</Text>
            {formData.boqs.map((boq, index) => {
              const version = boq.boqVersion?.[0] || defaultBoqVersion;
              return (
                <View key={index} style={styles.boqContainer}>
                  <View style={styles.boqHeader}>
                    <Text style={styles.boqTitle}>{boq.boqName || `BOQ ${index + 1}`}</Text>
                    <TouchableOpacity onPress={() => removeBoq(index)} disabled={isSubmitting}>
                      <Feather name="trash-2" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                  {/* BOQ General Fields */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>BOQ Name *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        boq.boqName ? styles.inputFocused : styles.inputDefault
                      ]}
                      placeholder="Enter BOQ name"
                      placeholderTextColor="#999999"
                      value={boq.boqName || ''}
                      onChangeText={(v) => updateBoqField(index, 'boqName', v)}
                      editable={!isSubmitting}
                    />
                  </View>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>Built Up Area (sq ft) *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        boq.builtUpArea ? styles.inputFocused : styles.inputDefault
                      ]}
                      placeholder="e.g., 1000"
                      placeholderTextColor="#999999"
                      value={String(boq.builtUpArea || '')}
                      onChangeText={(v) => updateBoqField(index, 'builtUpArea', v)}
                      editable={!isSubmitting}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>Structural Type *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        boq.structuralType ? styles.inputFocused : styles.inputDefault
                      ]}
                      placeholder="e.g., RCC, Steel"
                      placeholderTextColor="#999999"
                      value={boq.structuralType || ''}
                      onChangeText={(v) => updateBoqField(index, 'structuralType', v)}
                      editable={!isSubmitting}
                    />
                  </View>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>Foundation Type *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        boq.foundationType ? styles.inputFocused : styles.inputDefault
                      ]}
                      placeholder="e.g., Isolated, Raft"
                      placeholderTextColor="#999999"
                      value={boq.foundationType || ''}
                      onChangeText={(v) => updateBoqField(index, 'foundationType', v)}
                      editable={!isSubmitting}
                    />
                  </View>
                  {/* Add Material Form */}
                  <View style={styles.materialForm}>
                    <Text style={styles.materialFormTitle}>Add New Material</Text>
                    <TextInput
                      style={styles.materialInput}
                      placeholder="Material Name"
                      placeholderTextColor="#999999"
                      value={boqMaterialStates[index]?.materialName || ''}
                      onChangeText={(v) => setBoqMaterialState(index, 'materialName', v)}
                      editable={!isSubmitting}
                    />
                    <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 4 }}>
                      <TextInput
                        style={[styles.materialInput, { flex: 1, marginRight: 4 }]}
                        placeholder="Qty"
                        placeholderTextColor="#999999"
                        value={boqMaterialStates[index]?.materialQty || ''}
                        onChangeText={(v) => setBoqMaterialState(index, 'materialQty', v)}
                        editable={!isSubmitting}
                        keyboardType="numeric"
                      />
                      <TextInput
                        style={[styles.materialInput, { flex: 1, marginRight: 4, marginLeft: 4 }]}
                        placeholder="Unit"
                        placeholderTextColor="#999999"
                        value={boqMaterialStates[index]?.materialUnit || ''}
                        onChangeText={(v) => setBoqMaterialState(index, 'materialUnit', v)}
                        editable={!isSubmitting}
                      />
                      <TextInput
                        style={[styles.materialInput, { flex: 1, marginLeft: 4 }]}
                        placeholder="Rate (₹)"
                        placeholderTextColor="#999999"
                        value={boqMaterialStates[index]?.materialRate || ''}
                        onChangeText={(v) => setBoqMaterialState(index, 'materialRate', v)}
                        editable={!isSubmitting}
                        keyboardType="numeric"
                      />
                    </View>
                    <TouchableOpacity 
                      onPress={() => addMaterialToBoq(index)}
                      style={styles.addMaterialButton}
                      disabled={isSubmitting}
                    >
                      <Text style={styles.addMaterialButtonText}>Add Material</Text>
                    </TouchableOpacity>
                  </View>
                  {/* Materials List */}
                  {(version.materials || []).length > 0 ? (
                    <View>
                      <Text style={styles.materialCount}>
                        Added Materials ({(version.materials || []).length})
                      </Text>
                      {(version.materials || []).map((item, matIndex) => (
                        <View key={matIndex} style={styles.materialItem}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.materialName}>
                              {item.name}
                            </Text>
                            <Text style={styles.materialDetails}>
                              {item.qty} {item.unit} @ ₹{item.rate}/unit = ₹{item.amount?.toFixed(2) || '0.00'}
                            </Text>
                          </View>
                          <TouchableOpacity 
                            onPress={() => removeMaterialFromBoq(index, matIndex)}
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
                  {/* Labor Cost */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.label}>Labor Cost (₹) *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        version.laborCost ? styles.inputFocused : styles.inputDefault
                      ]}
                      placeholder="Enter labor cost"
                      placeholderTextColor="#999999"
                      value={String(version.laborCost || '')}
                      onChangeText={(v) => updateLaborCost(index, v)}
                      editable={!isSubmitting}
                      keyboardType="numeric"
                    />
                  </View>
                  {/* Totals */}
                  <View style={styles.totalsContainer}>
                    <Text style={styles.totalText}>Total Material Cost: ₹{version.totalMaterialCost?.toFixed(2) || '0.00'}</Text>
                    <Text style={styles.totalText}>Total Cost: ₹{version.totalCost?.toFixed(2) || '0.00'}</Text>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity
              onPress={addNewBoq}
              style={styles.addBoqButton}
              disabled={isSubmitting}
            >
              <Feather name="plus" size={20} color="#0066FF" style={{ marginRight: 8 }} />
              <Text style={styles.addBoqButtonText}>Add New BOQ</Text>
            </TouchableOpacity>
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

          {/* Add Plan Button */}
          {renderAddPlanButton()}

          {/* Add Milestone Button */}
          {renderAddMilestoneButton()}
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
  boqContainer: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  boqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  boqTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  materialForm: {
    backgroundColor: 'white',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
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
    backgroundColor: '#F5F5F5',
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
  totalsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  totalText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#0066FF',
    marginBottom: 4,
  },
  addBoqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#0066FF',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  addBoqButtonText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#0066FF',
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
    marginBottom: 16,
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
  addPlanButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0066FF',
    marginBottom: 16,
  },
  addPlanTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  addPlanSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  addMilestoneButton: {
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
  addMilestoneTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  addMilestoneSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  planStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  planStatusText: {
    fontSize: 10,
    color: '#00C851',
    fontFamily: 'Urbanist-Medium',
    marginLeft: 2,
  },
  milestoneStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  milestoneStatusText: {
    fontSize: 10,
    color: '#00C851',
    fontFamily: 'Urbanist-Medium',
    marginLeft: 2,
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