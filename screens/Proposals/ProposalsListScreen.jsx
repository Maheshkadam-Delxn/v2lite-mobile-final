// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as Crypto from 'expo-crypto';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../../components/Header';
// import { useNavigation } from '@react-navigation/native';

// /* -------------------- Cloudinary config -------------------- */
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// /* -------------------- Helper: category color -------------------- */
// const getCategoryColor = (category) => {
//   const key = (category || '').toString().toLowerCase();
//   const colorMap = {
//     residential: '#00D4FF',
//     office: '#0066FF',
//     home: '#00D4FF',
//     business: '#0066FF',
//     commercial: '#FF6B00',
//     industrial: '#8B4513',
//     general: '#666666',
//   };
//   return colorMap[key] || '#0066FF';
// };

// /* -------------------- CreateProposalModal (memoized, self-contained) -------------------- */
// const CreateProposalModal = React.memo(({ visible, onClose, onCreated }) => {
//   const [formData, setFormData] = useState({ name: '', category: '', description: '', image: null });
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (!visible) {
//       setFormData({ name: '', category: '', description: '', image: null });
//       setSelectedImage(null);
//       setUploadProgress(0);
//       setIsUploading(false);
//       setIsSubmitting(false);
//     }
//   }, [visible]);

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

//   const validate = () => {
//     if (!formData.name.trim()) { Alert.alert('Validation', 'Name is required'); return false; }
//     if (!formData.category.trim()) { Alert.alert('Validation', 'Category is required'); return false; }
//     if (!formData.description.trim()) { Alert.alert('Validation', 'Description is required'); return false; }
//     if (!formData.image) { Alert.alert('Validation', 'Image is required'); return false; }
//     return true;
//   };

//   const handleCreate = async () => {
//     if (!validate()) return;
//     if (isUploading) { Alert.alert('Please wait', 'Image is still uploading.'); return; }

//     setIsSubmitting(true);
//     try {
//       // include token if required
//       const token = await AsyncStorage.getItem('userToken');
//       const requestData = {
//         name: formData.name.trim(),
//         category: formData.category.trim(),
//         description: formData.description.trim(),
//         image: formData.image,
//       };

//       const resp = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(requestData),
//       });

//       if (resp.ok) {
//         const created = await resp.json();
//         const mapped = {
//           id: created._id || created.id || Math.random().toString(36).slice(2),
//           name: created.name || requestData.name,
//           category: (created.category || requestData.category).toString().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
//           categoryColor: getCategoryColor(created.category || requestData.category),
//           lastModified: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
//           image: created.image || requestData.image,
//           description: created.description || requestData.description,
//           raw: created,
//         };
//         onCreated?.(mapped);
//         onClose?.();
//         Alert.alert('Success', 'Proposal template created successfully!');
//       } else {
//         const txt = await resp.text();
//         let errMsg = 'Failed to create proposal template. Please try again.';
//         try { const j = JSON.parse(txt); errMsg = j.message || errMsg; } catch(e) { if (txt) errMsg = txt; }
//         Alert.alert('Error', errMsg);
//       }
//     } catch (err) {
//       Alert.alert('Network error', 'Unable to create proposal. Check your connection.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       visible={!!visible}
//       transparent
//       animationType="none"
//       onRequestClose={() => { if (!isSubmitting) onClose?.(); }}
//       statusBarTranslucent
//     >
//       <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
//         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} style={{ width: '100%' }}>
//           <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' }}>
//             <View style={{ paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
//               <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
//               <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Create New Proposal Template</Text>

//               <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="none" showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
//                 {/* Name */}
//                 <View style={{ marginBottom: 16 }}>
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Name *</Text>
//                   <TextInput
//                     style={{
//                       backgroundColor: '#F5F5F5',
//                       borderRadius: 12,
//                       paddingHorizontal: 16,
//                       paddingVertical: 14,
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#000000',
//                       borderWidth: 1,
//                       borderColor: formData.name ? '#0066FF' : '#E0E0E0',
//                     }}
//                     placeholder="Enter template name"
//                     placeholderTextColor="#999999"
//                     value={formData.name}
//                     onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
//                     editable={!isSubmitting}
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                   />
//                 </View>

//                 {/* Category */}
//                 <View style={{ marginBottom: 16 }}>
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Category *</Text>
//                   <TextInput
//                     style={{
//                       backgroundColor: '#F5F5F5',
//                       borderRadius: 12,
//                       paddingHorizontal: 16,
//                       paddingVertical: 14,
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#000000',
//                       borderWidth: 1,
//                       borderColor: formData.category ? '#0066FF' : '#E0E0E0',
//                     }}
//                     placeholder="e.g., Residential, Commercial, Office"
//                     placeholderTextColor="#999999"
//                     value={formData.category}
//                     onChangeText={(v) => setFormData(p => ({ ...p, category: v }))}
//                     editable={!isSubmitting}
//                     returnKeyType="next"
//                   />
//                 </View>

//                 {/* Description */}
//                 <View style={{ marginBottom: 16 }}>
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Description *</Text>
//                   <TextInput
//                     style={{
//                       backgroundColor: '#F5F5F5',
//                       borderRadius: 12,
//                       paddingHorizontal: 16,
//                       paddingVertical: 14,
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#000000',
//                       borderWidth: 1,
//                       borderColor: formData.description ? '#0066FF' : '#E0E0E0',
//                       minHeight: 100,
//                       textAlignVertical: 'top',
//                     }}
//                     placeholder="Enter template description"
//                     placeholderTextColor="#999999"
//                     value={formData.description}
//                     onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
//                     multiline
//                     numberOfLines={4}
//                     editable={!isSubmitting}
//                     returnKeyType="done"
//                   />
//                 </View>

//                 {/* Image */}
//                 <View style={{ marginBottom: 24 }}>
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Image *</Text>

//                   {selectedImage ? (
//                     <View style={{ marginBottom: 12 }}>
//                       <Image source={{ uri: selectedImage.uri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
//                       {isUploading && (
//                         <View style={{ marginBottom: 8 }}>
//                           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
//                             <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>Uploading...</Text>
//                             <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>{uploadProgress}%</Text>
//                           </View>
//                           <View style={{ height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 }}>
//                             <View style={{ height: 4, backgroundColor: '#0066FF', borderRadius: 2, width: `${uploadProgress}%` }} />
//                           </View>
//                         </View>
//                       )}
//                       {formData.image && !isUploading && (
//                         <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#00C851', marginBottom: 8 }}>✓ Image uploaded successfully to Cloudinary</Text>
//                       )}
//                       <TouchableOpacity onPress={removeSelectedImage} style={{ backgroundColor: '#FF4444', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }} disabled={isUploading}>
//                         <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Remove Image</Text>
//                       </TouchableOpacity>
//                     </View>
//                   ) : (
//                     <TouchableOpacity onPress={pickImage} disabled={isUploading} style={{ borderWidth: 2, borderColor: '#0066FF', borderStyle: 'dashed', borderRadius: 12, padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFF' }}>
//                       {isUploading ? <ActivityIndicator size="large" color="#0066FF" /> : (
//                         <>
//                           <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
//                           <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, color: '#0066FF' }}>Select Image</Text>
//                           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>Tap to choose an image from your gallery</Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </ScrollView>

//               <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
//                 <TouchableOpacity onPress={() => { if (!isSubmitting) onClose?.(); }} style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: isSubmitting ? 0.6 : 1 }} disabled={isSubmitting}>
//                   <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#666666' }}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={handleCreate} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: (isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image) ? 0.6 : 1 }} disabled={isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image}>
//                   {isSubmitting ? <ActivityIndicator size="small" color="white" /> : <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Create</Text>}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </Modal>
//   );
// });

// /* -------------------- Parent screen -------------------- */
// const ProposalsListScreen = () => {
//   const navigation = useNavigation();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [showActionsModal, setShowActionsModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [proposals, setProposals] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDeletingId, setIsDeletingId] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     const fetchProposals = async () => {
//       setIsLoading(true);
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });

//         let json = {};
//         try {
//           json = await response.json();
//         } catch (err) {
//           console.warn('Response JSON parse failed', err);
//         }

//         const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

//         const mappedProposals = items.map((item) => {
//           const rawDate = item.updatedAt || item.createdAt || null;
//           const lastModified = rawDate
//             ? new Date(rawDate).toLocaleString('en-GB', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })
//             : '';

//           const categoryRaw = item.category || 'General';
//           const categoryNormalized = categoryRaw
//             .toString()
//             .toLowerCase()
//             .replace(/\b\w/g, (c) => c.toUpperCase());

//           return {
//             id: item._id || item.id || Math.random().toString(36).slice(2),
//             name: item.name || 'Unnamed Template',
//             category: categoryNormalized,
//             categoryColor: getCategoryColor(categoryNormalized),
//             lastModified,
//             image: item.image || null,
//             description: item.description || '',
//             raw: item,
//           };
//         });

//         if (mounted) setProposals(mappedProposals);
//       } catch (error) {
//         console.error('Network error fetching proposals:', error);
//         if (mounted) setProposals([]);
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     fetchProposals();
//     return () => { mounted = false; };
//   }, []);

//   // Keep search local
//   const filteredProposals = useMemo(() => {
//     if (!searchQuery) return proposals;
//     const q = searchQuery.trim().toLowerCase();
//     return proposals.filter(
//       (p) =>
//         (p.name || '').toLowerCase().includes(q) ||
//         (p.category || '').toLowerCase().includes(q)
//     );
//   }, [searchQuery, proposals]);

//   const handlePreview = (proposal) => navigation.navigate('PreviewProposalScreen', { id: proposal.id, proposal });
//   const handleEdit = (proposal) => navigation.navigate('EditProposalScreen', { id: proposal.id, proposal });

//   const confirmDelete = async (id) => {
//     setIsDeletingId(id);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await fetch(`https://skystruct-lite-backend.vercel.app/api/project-types/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (response.ok) {
//         setProposals((prev) => prev.filter((p) => p.id !== id));
//         Alert.alert('Success', 'Template deleted successfully!');
//       } else {
//         const body = await response.text();
//         console.warn('Delete failed', response.status, body);
//         Alert.alert('Delete failed', 'Could not delete template. Try again.');
//       }
//     } catch (err) {
//       console.error('Delete error', err);
//       Alert.alert('Network error', 'Unable to delete. Check your connection.');
//     } finally {
//       setIsDeletingId(null);
//     }
//   };

//   const handleDelete = (proposal) => {
//     Alert.alert(
//       'Delete Template',
//       `Are you sure you want to delete "${proposal.name}"? This cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(proposal.id) },
//       ]
//     );
//   };

//   const renderProposal = ({ item }) => (
//     <View
//       style={{
//         backgroundColor: 'white',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         borderLeftWidth: 4,
//         borderLeftColor: item.categoryColor,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//       }}
//     >
//       <View style={{ marginBottom: 12 }}>
//         {item.image && (
//           <Image
//             source={{ uri: item.image }}
//             style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 12 }}
//             resizeMode="cover"
//           />
//         )}
//         <View style={{ flexDirection: 'row', marginBottom: 4 }}>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Name :</Text>
//           <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: '#000000', flex: 1 }}>{item.name}</Text>
//         </View>

//         <View style={{ flexDirection: 'row', marginBottom: 4 }}>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Category :</Text>
//           <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: item.categoryColor }}>{item.category}</Text>
//         </View>

//         <View style={{ flexDirection: 'row', marginBottom: 4 }}>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Description :</Text>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000', flex: 1 }} numberOfLines={2}>
//             {item.description}
//           </Text>
//         </View>

//         <View style={{ flexDirection: 'row' }}>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Last Modified :</Text>
//           <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.lastModified}</Text>
//         </View>
//       </View>

//       <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
//         <TouchableOpacity onPress={() => handlePreview(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
//           <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginRight: 6 }} />
//           <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Preview</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => handleEdit(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
//           <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
//           <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Edit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => handleDelete(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
//           <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
//           <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>
//             {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const handleCreated = useCallback((newProposal) => {
//     setProposals((prev) => [newProposal, ...prev]);
//   }, []);

//   if (isLoading) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0066FF" />
//         <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#666666', marginTop: 16 }}>Loading templates...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//       <View style={{ flex: 1 }}>
//         <Header
//           title="Proposals Templates"
//           rightIcon="filter"
//           onRightIconPress={() => setShowFilterModal(true)}
//           backgroundColor="#0066FF"
//           titleColor="white"
//           iconColor="white"
//         />

//         <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
//           <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 48, marginRight: 12 }}>
//             <Feather name="search" size={20} color="#999999" />
//             <TextInput
//               style={{ flex: 1, marginLeft: 8, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}
//               placeholder="Enter Template Name.."
//               placeholderTextColor="#999999"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               returnKeyType="search"
//             />
//           </View>

//           <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center' }} onPress={() => setShowCreateModal(true)}>
//             <Feather name="plus" size={24} color="white" />
//           </TouchableOpacity>
//         </View>

//         <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
//           <TouchableOpacity onPress={() => setShowActionsModal(true)} style={{ backgroundColor: '#0066FF', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//             <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
//             <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Manage Proposals</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
//           <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Template List ({filteredProposals.length})</Text>
//         </View>

//         <FlatList
//           data={filteredProposals}
//           keyExtractor={(item) => item.id}
//           renderItem={renderProposal}
//           contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
//           ListEmptyComponent={
//             <View style={{ alignItems: 'center', marginTop: 50 }}>
//               <Feather name="file-text" size={48} color="#CCCCCC" />
//               <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 16 }}>No templates found.</Text>
//               <Text style={{ textAlign: 'center', color: '#999999', fontSize: 14, marginTop: 8 }}>Create your first template by tapping the + button</Text>
//             </View>
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       </View>

//       {/* Filter Modal */}
//       <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
//         <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
//           <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
//             <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
//             <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Filter</Text>

//             <View style={{ flexDirection: 'row', gap: 12 }}>
//               <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
//                 <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
//                 <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Apply</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Actions Modal */}
//       <Modal visible={showActionsModal} transparent animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
//         <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
//           <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
//             <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
//             <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Actions</Text>

//             <TouchableOpacity
//               style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
//               onPress={() => {
//                 setShowActionsModal(false);
//                 navigation.navigate('ViewProposal');
//               }}
//             >
//               <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>View Proposal</Text>
//               <Feather name="arrow-right" size={20} color="white" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
//               onPress={() => {
//                 setShowActionsModal(false);
//                 navigation.navigate('ChooseTemplate');
//               }}
//             >
//               <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Choose Template</Text>
//               <Feather name="arrow-right" size={20} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Create Proposal Modal (memoized child) */}
//       <CreateProposalModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
//     </View>
//   );
// };

// export default ProposalsListScreen;
// ProposalsListScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

/* -------------------- Cloudinary config -------------------- */
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

/* -------------------- Helper: category color -------------------- */
const getCategoryColor = (category) => {
  const key = (category || '').toString().toLowerCase();
  const colorMap = {
    residential: '#00D4FF',
    office: '#0066FF',
    home: '#00D4FF',
    business: '#0066FF',
    commercial: '#FF6B00',
    industrial: '#8B4513',
    general: '#666666',
  };
  return colorMap[key] || '#0066FF';
};

/* -------------------- CreateProposalModal (memoized, self-contained) -------------------- */
const CreateProposalModal = React.memo(({ visible, onClose, onCreated, onUpdated, initialData = null }) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({ name: '', category: '', description: '', image: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      // reset when modal closes
      setFormData({ name: '', category: '', description: '', image: null });
      setSelectedImage(null);
      setUploadProgress(0);
      setIsUploading(false);
      setIsSubmitting(false);
    } else {
      // if opened in edit mode, populate fields
      if (isEditMode) {
        setFormData({
          name: initialData.name || '',
          category: initialData.category || '',
          description: initialData.description || '',
          image: initialData.image || null,
        });
        setSelectedImage(initialData.image ? { uri: initialData.image } : null);
        setUploadProgress(initialData.image ? 100 : 0);
      }
    }
  }, [visible, initialData, isEditMode]);

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
        setFormData((p) => ({ ...p, image: uploaded.url }));
      } else {
        Alert.alert('Upload failed', uploaded.error || 'Unknown error');
        setSelectedImage(null);
        setFormData((p) => ({ ...p, image: null }));
        setUploadProgress(0);
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setFormData((p) => ({ ...p, image: null }));
    setUploadProgress(0);
  };

  const validate = () => {
    if (!formData.name.trim()) { Alert.alert('Validation', 'Name is required'); return false; }
    if (!formData.category.trim()) { Alert.alert('Validation', 'Category is required'); return false; }
    if (!formData.description.trim()) { Alert.alert('Validation', 'Description is required'); return false; }
    if (!formData.image) { Alert.alert('Validation', 'Image is required'); return false; }
    return true;
  };

  // Handles both create and update
  const handleSave = async () => {
    if (!validate()) return;
    if (isUploading) { Alert.alert('Please wait', 'Image is still uploading.'); return; }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const requestData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        image: formData.image,
      };

      let resp;
      if (isEditMode) {
        // update flow
        resp = await fetch(`https://skystruct-lite-backend.vercel.app/api/project-types/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // create flow
        resp = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        });
      }

      if (resp.ok) {
        const createdOrUpdated = await resp.json();
        const mapped = {
          id: createdOrUpdated._id || createdOrUpdated.id || (isEditMode ? initialData.id : Math.random().toString(36).slice(2)),
          name: createdOrUpdated.name || requestData.name,
          category: (createdOrUpdated.category || requestData.category).toString().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
          categoryColor: getCategoryColor(createdOrUpdated.category || requestData.category),
          lastModified: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          image: createdOrUpdated.image || requestData.image,
          description: createdOrUpdated.description || requestData.description,
          raw: createdOrUpdated,
        };

        if (isEditMode) {
          onUpdated?.(mapped);
          Alert.alert('Success', 'Template updated successfully!');
        } else {
          onCreated?.(mapped);
          Alert.alert('Success', 'Proposal template created successfully!');
        }
        onClose?.();
      } else {
        const txt = await resp.text();
        let errMsg = 'Failed to save template. Please try again.';
        try { const j = JSON.parse(txt); errMsg = j.message || errMsg; } catch(e) { if (txt) errMsg = txt; }
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      Alert.alert('Network error', 'Unable to save. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="slide"
      onRequestClose={() => { if (!isSubmitting) onClose?.(); }}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
          style={{ width: '100%' }}
        >
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            width: '100%',
            maxHeight: '90%',
            overflow: 'hidden',
          }}>
            <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
              <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 12 }} />
              <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 12 }}>
                {isEditMode ? 'Edit Proposal Template' : 'Create New Proposal Template'}
              </Text>
            </View>

            {/* Scrollable body */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 12 }}
            >
              {/* Name */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Name *</Text>
                <TextInput
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    borderWidth: 1,
                    borderColor: formData.name ? '#0066FF' : '#E0E0E0',
                  }}
                  placeholder="Enter template name"
                  placeholderTextColor="#999999"
                  value={formData.name}
                  onChangeText={(v) => setFormData(p => ({ ...p, name: v }))}
                  editable={!isSubmitting}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              {/* Category */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Category *</Text>
                <TextInput
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    borderWidth: 1,
                    borderColor: formData.category ? '#0066FF' : '#E0E0E0',
                  }}
                  placeholder="e.g., Residential, Commercial, Office"
                  placeholderTextColor="#999999"
                  value={formData.category}
                  onChangeText={(v) => setFormData(p => ({ ...p, category: v }))}
                  editable={!isSubmitting}
                  returnKeyType="next"
                />
              </View>

              {/* Description */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Description *</Text>
                <TextInput
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    borderWidth: 1,
                    borderColor: formData.description ? '#0066FF' : '#E0E0E0',
                    minHeight: 100,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Enter template description"
                  placeholderTextColor="#999999"
                  value={formData.description}
                  onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
                  multiline
                  numberOfLines={4}
                  editable={!isSubmitting}
                  returnKeyType="done"
                />
              </View>

              {/* Image */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Image *</Text>

                {selectedImage ? (
                  <View style={{ marginBottom: 12 }}>
                    <Image source={{ uri: selectedImage.uri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
                    {isUploading && (
                      <View style={{ marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>Uploading...</Text>
                          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>{uploadProgress}%</Text>
                        </View>
                        <View style={{ height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 }}>
                          <View style={{ height: 4, backgroundColor: '#0066FF', borderRadius: 2, width: `${uploadProgress}%` }} />
                        </View>
                      </View>
                    )}
                    {formData.image && !isUploading && (
                      <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#00C851', marginBottom: 8 }}>✓ Image uploaded successfully to Cloudinary</Text>
                    )}
                    <TouchableOpacity onPress={removeSelectedImage} style={{ backgroundColor: '#FF4444', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }} disabled={isUploading}>
                      <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Remove Image</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={pickImage} disabled={isUploading} style={{ borderWidth: 2, borderColor: '#0066FF', borderStyle: 'dashed', borderRadius: 12, padding: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFF' }}>
                    {isUploading ? <ActivityIndicator size="large" color="#0066FF" /> : (
                      <>
                        <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
                        <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, color: '#0066FF' }}>Select Image</Text>
                        <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>Tap to choose an image from your gallery</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* Footer (pinned) */}
            <View style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Platform.OS === 'ios' ? 24 : 16,
              backgroundColor: 'white'
            }}>
              <TouchableOpacity
                onPress={() => { if (!isSubmitting) onClose?.(); }}
                style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginRight: 12, opacity: isSubmitting ? 0.6 : 1 }}
                disabled={isSubmitting}
              >
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#666666' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: (isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image) ? 0.6 : 1 }}
                disabled={isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image}
              >
                {isSubmitting ? <ActivityIndicator size="small" color="white" /> : <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>{isEditMode ? 'Save' : 'Create'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

/* -------------------- Parent screen -------------------- */
const ProposalsListScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // editing proposal (for modal)
  const [editingProposal, setEditingProposal] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        let json = {};
        try {
          json = await response.json();
        } catch (err) {
          console.warn('Response JSON parse failed', err);
        }

        const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

        const mappedProposals = items.map((item) => {
          const rawDate = item.updatedAt || item.createdAt || null;
          const lastModified = rawDate
            ? new Date(rawDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          const categoryRaw = item.category || 'General';
          const categoryNormalized = categoryRaw
            .toString()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            id: item._id || item.id || Math.random().toString(36).slice(2),
            name: item.name || 'Unnamed Template',
            category: categoryNormalized,
            categoryColor: getCategoryColor(categoryNormalized),
            lastModified,
            image: item.image || null,
            description: item.description || '',
            raw: item,
          };
        });

        if (mounted) setProposals(mappedProposals);
      } catch (error) {
        console.error('Network error fetching proposals:', error);
        if (mounted) setProposals([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => { mounted = false; };
  }, []);

  // Keep search local
  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    const q = searchQuery.trim().toLowerCase();
    return proposals.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [searchQuery, proposals]);

  const handlePreview = (proposal) => navigation.navigate('PreviewProposalScreen', { id: proposal.id, proposal });

  // instead of navigate to edit screen -> open modal with data
  const handleEdit = (proposal) => {
    setEditingProposal(proposal);
    setShowCreateModal(true);
  };

  const confirmDelete = async (id) => {
    setIsDeletingId(id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://skystruct-lite-backend.vercel.app/api/project-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id));
        Alert.alert('Success', 'Template deleted successfully!');
      } else {
        const body = await response.text();
        console.warn('Delete failed', response.status, body);
        Alert.alert('Delete failed', 'Could not delete template. Try again.');
      }
    } catch (err) {
      console.error('Delete error', err);
      Alert.alert('Network error', 'Unable to delete. Check your connection.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleDelete = (proposal) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${proposal.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(proposal.id) },
      ]
    );
  };

  const renderProposal = ({ item }) => (
    <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: item.categoryColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
      <View style={{ marginBottom: 12 }}>
        {item.image && (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 12 }} resizeMode="cover" />
        )}
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Name :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: '#000000', flex: 1 }}>{item.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Category :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: item.categoryColor }}>{item.category}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Description :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000', flex: 1 }} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Last Modified :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.lastModified}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <TouchableOpacity onPress={() => handlePreview(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleEdit(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>{isDeletingId === item.id ? 'Deleting...' : 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCreated = useCallback((newProposal) => {
    setProposals((prev) => [newProposal, ...prev]);
  }, []);

  const handleUpdated = useCallback((updatedProposal) => {
    setProposals((prev) => prev.map(p => (p.id === updatedProposal.id ? updatedProposal : p)));
    // clear editing state
    setEditingProposal(null);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#666666', marginTop: 16 }}>Loading templates...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header
          title="Proposals Templates"
          rightIcon="filter"
          onRightIconPress={() => setShowFilterModal(true)}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 48, marginRight: 12 }}>
            <Feather name="search" size={20} color="#999999" />
            <TextInput
              style={{ flex: 1, marginLeft: 8, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}
              placeholder="Enter Template Name.."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center' }} onPress={() => { setEditingProposal(null); setShowCreateModal(true); }}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => setShowActionsModal(true)} style={{ backgroundColor: '#0066FF', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Manage Proposals</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Template List ({filteredProposals.length})</Text>
        </View>

        <FlatList
          data={filteredProposals}
          keyExtractor={(item) => item.id}
          renderItem={renderProposal}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Feather name="file-text" size={48} color="#CCCCCC" />
              <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 16 }}>No templates found.</Text>
              <Text style={{ textAlign: 'center', color: '#999999', fontSize: 14, marginTop: 8 }}>Create your first template by tapping the + button</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Filter</Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Actions Modal */}
      <Modal visible={showActionsModal} transparent animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Actions</Text>

            <TouchableOpacity
              style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
              onPress={() => {
                setShowActionsModal(false);
                navigation.navigate('ViewProposal');
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>View Proposal</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
              onPress={() => {
                setShowActionsModal(false);
                navigation.navigate('ChooseTemplate');
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Choose Template</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create/Edit Proposal Modal (memoized child) */}
      <CreateProposalModal
        visible={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditingProposal(null); }}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        initialData={editingProposal}
      />
    </SafeAreaView>
  );
};

export default ProposalsListScreen;
