// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   FlatList,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { useNavigation } from '@react-navigation/native';
// import Header from 'components/Header';
// import BottomNavBar from 'components/BottomNavbar';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Crypto from 'expo-crypto';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const API_URL = 'http://192.168.1.7:3000/api/projects';
// const PROJECT_TYPES_API = 'https://skystruct-lite-backend.vercel.app/api/project-types';
// const TOKEN_KEY = 'userToken';

// // Cloudinary Configuration - Only the three credentials you have
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr', // Your cloud name
//   apiKey: '353369352647425', // Your API key
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI', // Your API secret
// };

// const formatDate = (date) => {
//   if (!date) return '';
//   const d = new Date(date);
//   const day = d.getDate().toString().padStart(2, '0');
//   const month = (d.getMonth() + 1).toString().padStart(2, '0');
//   const year = d.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// const parseDDMMYYYYToISO = (value) => {
//   if (!value) return null;
//   const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
//   if (isoLike) return value;
//   const ddmmyyyy = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
//   const m = value.match(ddmmyyyy);
//   if (m) {
//     const day = parseInt(m[1], 10);
//     const month = parseInt(m[2], 10) - 1;
//     const year = parseInt(m[3], 10);
//     const d = new Date(year, month, day);
//     if (!Number.isNaN(d.getTime())) return d.toISOString();
//   }
//   const fallback = new Date(value);
//   if (!Number.isNaN(fallback.getTime())) return fallback.toISOString();
//   return null;
// };

// const CreateProjectScreen = () => {
//   const navigation = useNavigation();

//   const [formData, setFormData] = useState({
//     projectName: '',
//     projectCode: '',
//     projectDescription: '',
//     projectImages: '', // Single image URL
//     clientName: '',
//     clientEmail: '',
//     clientPhone: '',
//     address: '',
//     startDate: '', 
//     endDate: '',
//     budget: '',
//     projectType: '',
//   });

//   const [projectDocuments, setProjectDocuments] = useState([]); // Array for documents
//   const [projectImage, setProjectImage] = useState(null); // For main project image
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadingType, setUploadingType] = useState(null); // 'image' or 'document'
//   const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [projectTypes, setProjectTypes] = useState([]);
//   const [loadingProjectTypes, setLoadingProjectTypes] = useState(true);

//   // Fetch project types from API
//   useEffect(() => {
//     fetchProjectTypes();
//   }, []);

//   const fetchProjectTypes = async () => {
//     try {
//       setLoadingProjectTypes(true);
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
      
//       const response = await fetch(PROJECT_TYPES_API, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Fetched project types:', data);
        
//         // Handle both array response and object with data property
//         if (Array.isArray(data)) {
//           setProjectTypes(data);
//         } else if (data.data && Array.isArray(data.data)) {
//           setProjectTypes(data.data);
//         } else {
//           console.error('Unexpected project types response format:', data);
//           setProjectTypes([]);
//         }
//       } else {
//         console.error('Failed to fetch project types:', response.status);
//         Alert.alert('Error', 'Failed to load project types');
//         setProjectTypes([]);
//       }
//     } catch (error) {
//       console.error('Error fetching project types:', error);
//       Alert.alert('Network Error', 'Failed to load project types. Please check your connection.');
//       setProjectTypes([]);
//     } finally {
//       setLoadingProjectTypes(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle project type selection
//   const handleProjectTypeSelect = (projectType) => {
//     setFormData((prev) => ({ 
//       ...prev, 
//       projectType: projectType._id 
//     }));
//     setShowProjectTypeDropdown(false);
//   };

//   // Get selected project type name for display
//   const getSelectedProjectTypeName = () => {
//     const selectedType = projectTypes.find(type => type._id === formData.projectType);
//     return selectedType ? selectedType.name : 'Select Project Type';
//   };

//   // Handle date selection
//   const handleStartDateChange = (event, selectedDate) => {
//     setShowStartDatePicker(false);
//     if (selectedDate) {
//       setFormData((prev) => ({ 
//         ...prev, 
//         startDate: selectedDate.toISOString() 
//       }));
//     }
//   };

//   const handleEndDateChange = (event, selectedDate) => {
//     setShowEndDatePicker(false);
//     if (selectedDate) {
//       setFormData((prev) => ({ 
//         ...prev, 
//         endDate: selectedDate.toISOString() 
//       }));
//     }
//   };

//   // Generate SHA1 signature for Cloudinary
//   const generateSignature = async (timestamp) => {
//     try {
//       // The string to sign for Cloudinary
//       const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
      
//       // Generate SHA1 hash using expo-crypto
//       const signature = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA1,
//         stringToSign
//       );
      
//       return signature;
//     } catch (error) {
//       console.error('Error generating signature:', error);
//       throw new Error('Failed to generate signature');
//     }
//   };

//   // Upload image to Cloudinary with signed upload (no upload preset needed)
//   const uploadToCloudinary = async (imageUri, fileType = 'image') => {
//     try {
//       console.log('Starting Cloudinary signed upload...');
      
//       // Generate timestamp and signature
//       const timestamp = Math.round(Date.now() / 1000);
//       const signature = await generateSignature(timestamp);
      
//       const formData = new FormData();
      
//       // Extract file info
//       const filename = imageUri.split('/').pop();
//       const match = /\.(\w+)$/.exec(filename || '');
//       const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;

//       console.log('File info:', { filename, type, timestamp, fileType });

//       // Append file
//       formData.append('file', {
//         uri: imageUri,
//         type: type,
//         name: filename || `${fileType}_${Date.now()}.${fileType === 'image' ? 'jpg' : 'pdf'}`,
//       });
      
//       // Required parameters for signed upload
//       formData.append('timestamp', timestamp.toString());
//       formData.append('signature', signature);
//       formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

//       console.log('Uploading with signature...', {
//         timestamp,
//         signature: signature.substring(0, 10) + '...', // Log only first 10 chars for security
//         apiKey: CLOUDINARY_CONFIG.apiKey.substring(0, 10) + '...'
//       });

//       const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;
//       console.log('Upload URL:', uploadUrl);

//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Cloudinary response status:', response.status);

//       const responseText = await response.text();
//       console.log('Cloudinary raw response:', responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Failed to parse Cloudinary response:', e);
//         return {
//           success: false,
//           error: 'Invalid response from Cloudinary',
//           details: responseText
//         };
//       }
      
//       if (response.ok && data.secure_url) {
//         console.log('✅ Cloudinary upload successful:', data.secure_url);
//         return {
//           success: true,
//           url: data.secure_url,
//           publicId: data.public_id,
//         };
//       } else {
//         console.error('❌ Cloudinary upload failed:', data);
//         return {
//           success: false,
//           error: data.error?.message || `Upload failed with status ${response.status}`,
//           details: data
//         };
//       }
//     } catch (error) {
//       console.error('❌ Cloudinary upload error:', error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   };

//   // Handle project image selection (single image)
//   const handleProjectImageSelect = async () => {
//     // Request permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.7,
//     });

//     console.log('Project image picker result:', result);

//     if (!result.canceled && result.assets && result.assets[0]) {
//       const localImage = {
//         id: Date.now(),
//         name: `project_image_${Date.now()}.jpg`,
//         url: result.assets[0].uri,
//         icon: '🖼️',
//         color: 'bg-blue-500',
//         progress: 0,
//         isLocal: true,
//         isUploading: true,
//       };
      
//       setProjectImage(localImage);
//       setUploadingType('image');
//       setIsUploading(true);

//       // Upload to Cloudinary
//       const uploadResult = await uploadToCloudinary(result.assets[0].uri, 'image');
      
//       setIsUploading(false);
//       setUploadingType(null);

//       if (uploadResult.success) {
//         // Update project image with Cloudinary URL
//         const updatedImage = {
//           ...localImage,
//           url: uploadResult.url,
//           cloudinaryUrl: uploadResult.url,
//           publicId: uploadResult.publicId,
//           progress: 100,
//           isUploading: false,
//           color: 'bg-green-500'
//         };
//         setProjectImage(updatedImage);
        
//         // Update form data with the image URL
//         setFormData((prev) => ({
//           ...prev,
//           projectImages: uploadResult.url
//         }));
        
//         Alert.alert('Success', 'Project image uploaded to Cloudinary successfully!');
//       } else {
//         // Mark upload as failed
//         const failedImage = {
//           ...localImage,
//           progress: 0,
//           isUploading: false,
//           color: 'bg-red-500',
//           error: uploadResult.error
//         };
//         setProjectImage(failedImage);
//         Alert.alert(
//           'Upload Failed', 
//           `Failed to upload project image: ${uploadResult.error}`,
//           [{ text: 'OK' }]
//         );
//       }
//     }
//   };

//   // Handle project documents selection (multiple documents)
//   const handleProjectDocumentsSelect = async () => {
//     // Request permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: false,
//       aspect: [4, 3],
//       quality: 0.7,
//       allowsMultipleSelection: true,
//     });

//     console.log('Project documents picker result:', result);

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       for (const asset of result.assets) {
//         const localDocument = {
//           id: Date.now() + Math.random(),
//           name: `document_${Date.now()}.${asset.type === 'image' ? 'jpg' : 'pdf'}`,
//           url: asset.uri,
//           icon: asset.type === 'image' ? '🖼️' : '📄',
//           color: 'bg-blue-500',
//           progress: 0,
//           isLocal: true,
//           isUploading: true,
//           type: asset.type
//         };
        
//         // Add document to list
//         setProjectDocuments(prev => [localDocument, ...prev]);
//         setUploadingType('document');
//         setIsUploading(true);

//         // Upload to Cloudinary
//         const uploadResult = await uploadToCloudinary(asset.uri, asset.type === 'image' ? 'image' : 'raw');
        
//         setIsUploading(false);
//         setUploadingType(null);

//         if (uploadResult.success) {
//           // Update document with Cloudinary URL
//           setProjectDocuments(prev => 
//             prev.map(doc => 
//               doc.id === localDocument.id 
//                 ? { 
//                     ...doc, 
//                     url: uploadResult.url,
//                     cloudinaryUrl: uploadResult.url,
//                     publicId: uploadResult.publicId,
//                     progress: 100,
//                     isUploading: false,
//                     color: 'bg-green-500'
//                   } 
//                 : doc
//             )
//           );
//         } else {
//           // Mark upload as failed
//           setProjectDocuments(prev => 
//             prev.map(doc => 
//               doc.id === localDocument.id 
//                 ? { 
//                     ...doc, 
//                     progress: 0,
//                     isUploading: false,
//                     color: 'bg-red-500',
//                     error: uploadResult.error
//                   } 
//                 : doc
//             )
//           );
//           Alert.alert(
//             'Upload Failed', 
//             `Failed to upload document: ${uploadResult.error}`,
//             [{ text: 'OK' }]
//           );
//         }
//       }
//     }
//   };

//   const handleRemoveProjectImage = () => {
//     setProjectImage(null);
//     setFormData((prev) => ({
//       ...prev,
//       projectImages: ''
//     }));
//   };

//   const handleRemoveDocument = (documentId) => {
//     setProjectDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
//   };

//   const buildRequestBody = () => {
//     const startISO = parseDDMMYYYYToISO(formData.startDate) || new Date().toISOString();
//     const endISO = parseDDMMYYYYToISO(formData.endDate) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

//     // Get project image URL
//     const projectImageUrl = projectImage?.cloudinaryUrl || '';

//     // Get project documents URLs (filter out failed uploads and still uploading)
//     const projectDocumentsUrls = projectDocuments
//       .filter(doc => doc.cloudinaryUrl && !doc.isUploading && !doc.error)
//       .map(doc => doc.cloudinaryUrl);

//     const body = {
//       name: formData.projectName,
//       projectCode: formData.projectCode,
//       location: formData.address,
//       description: formData.projectDescription,
//       startDate: startISO,
//       endDate: endISO,
//       projectType: formData.projectType,
//       projectImages: projectImageUrl, // Single image URL
//       projectDocuments: projectDocumentsUrls, // Array of document URLs
//       clientName: formData.clientName,
//       budget:formData.budget,
//     clientEmail: formData.clientEmail,
//     clientPhone: formData.clientPhone,
//       versionDetails: {
//         currentVersion: 'v1.0.0',
//         lastUpdated: new Date().toISOString(),
//         history: [
//           {
//             version: 'v0.9.0',
//             updatedBy: '672e9f1a5e3a2d46a73b3b9f',
//             updatedAt: '2025-10-25T09:00:00.000Z',
//             notes: 'Initial setup and design draft completed.',
//           },
//         ],
//       },
//     };

//     return body;
//   };

//   const handleCreateProject = async () => {
//     // Check if project image is still uploading
//     if (projectImage?.isUploading) {
//       Alert.alert('Please Wait', 'Project image is still uploading. Please wait until upload completes.');
//       return;
//     }

//     // Check if any documents are still uploading
//     const stillUploadingDocuments = projectDocuments.some(doc => doc.isUploading);
//     if (stillUploadingDocuments) {
//       Alert.alert('Please Wait', 'Some documents are still uploading. Please wait until all uploads complete.');
//       return;
//     }

//     // Check for failed uploads
//     const failedImage = projectImage?.error;
//     const failedDocuments = projectDocuments.filter(doc => doc.error);
    
//     if (failedImage) {
//       Alert.alert('Upload Issues', 'Project image failed to upload. Please remove it or try uploading again.');
//       return;
//     }

//     if (failedDocuments.length > 0) {
//       Alert.alert('Upload Issues', 'Some documents failed to upload. Please remove them or try uploading again.');
//       return;
//     }

//     if (!formData.projectName) {
//       Alert.alert('Validation', 'Project name is required.');
//       return;
//     }

//     if (!formData.projectCode) {
//       Alert.alert('Validation', 'Project code is required.');
//       return;
//     }

//     if (!formData.projectType) {
//       Alert.alert('Validation', 'Please select a project type.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       console.log('[CreateProject] token present:', !!token);

//       const body = buildRequestBody();
//       console.log('[CreateProject] POST body:', body);

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(body),
//       });

//       const json = await response.json().catch((e) => {
//         console.warn('[CreateProject] failed to parse JSON response', e);
//         return {};
//       });

//       if (response.ok) {
//         Alert.alert('Success', 'Project created successfully.');
//         navigation.goBack();
//       } else {
//         const msg = json?.message || `Server returned ${response.status}`;
//         Alert.alert('Create Failed', msg);
//       }
//     } catch (err) {
//       console.error('[CreateProject] network error:', err);
//       Alert.alert('Network Error', 'Failed to create project. Check console for details.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Project Type Dropdown Item
//   const ProjectTypeItem = ({ item }) => (
//     <TouchableOpacity
//       className="px-4 py-3 border-b border-gray-200"
//       onPress={() => handleProjectTypeSelect(item)}
//     >
//       <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-base text-black">
//         {item.name}
//       </Text>
//       <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-sm text-gray-500 mt-1">
//         {item.category} • {item.description}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <View className="flex-1">
//         <Header
//           title="Create New Project"
//           showBackButton={true}
//           onRightIconPress={() => console.log('header right pressed')}
//           backgroundColor="#0066FF"
//           titleColor="white"
//           iconColor="white"
//         />

//         <ScrollView
//           className="flex-1 px-6 pt-8"
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 100 }}
//         >
//           {/* Project Image */}
//           <View className="mb-8 items-center">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black text-center">
//               Project Image
//             </Text>
//             <View className="relative h-32 w-32 overflow-hidden rounded-2xl">
//               <View className="h-full w-full items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
//                 <View className="h-44 w-32 overflow-hidden rounded-2xl border-2 border-white/30 bg-white shadow-2xl shadow-blue-900/50">
//                   <Image
//                     source={{
//                       uri: projectImage?.cloudinaryUrl || projectImage?.url || 'https://t4.ftcdn.net/jpg/02/81/89/73/360_F_281897358_3rj9ZBSZHo5s0L1ug7uuIHadSxh9Cc75.jpg',
//                     }}
//                     className="h-full w-full"
//                     resizeMode="cover"
//                     onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
//                   />
//                   <View className="shadow-inner absolute inset-0 rounded-2xl border border-white/20" />
//                 </View>
//               </View>
//               <TouchableOpacity 
//                 className="absolute bottom-2 right-2 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#235DFF]"
//                 onPress={handleProjectImageSelect}
//                 disabled={isUploading && uploadingType === 'image'}
//               >
//                 {isUploading && uploadingType === 'image' ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text className="text-xs text-white" style={{ fontFamily: 'Urbanist-Regular' }}>Edit</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//             {isUploading && uploadingType === 'image' && (
//               <Text className="mt-2 text-xs text-blue-600" style={{ fontFamily: 'Urbanist-Regular' }}>
//                 Uploading project image...
//               </Text>
//             )}
//             {projectImage && (
//               <View className="mt-4 w-full">
//                 <View className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg">
//                   <View className="flex-row items-center flex-1">
//                     <View className={`h-10 w-10 rounded-lg ${projectImage.color} mr-3 items-center justify-center`}>
//                       {projectImage.isUploading ? (
//                         <ActivityIndicator size="small" color="#fff" />
//                       ) : (
//                         <Text className="text-white" style={{ fontFamily: 'Urbanist-Regular' }}>
//                           {projectImage.icon}
//                         </Text>
//                       )}
//                     </View>
//                     <View className="flex-1">
//                       <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-black">
//                         {projectImage.name}
//                       </Text>
//                       {projectImage.error && (
//                         <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500">
//                           Upload failed
//                         </Text>
//                       )}
//                       {projectImage.cloudinaryUrl && (
//                         <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-green-500">
//                           Cloudinary ✓
//                         </Text>
//                       )}
//                     </View>
//                   </View>
//                   <TouchableOpacity
//                     className="h-6 w-6 items-center justify-center rounded-full bg-red-50"
//                     onPress={handleRemoveProjectImage}
//                     disabled={projectImage.isUploading}
//                   >
//                     <Text className="text-xs text-red-500" style={{ fontFamily: 'Urbanist-Regular' }}>X</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <View className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200">
//                   <View
//                     className="h-full rounded-full bg-[#235DFF]"
//                     style={{ width: `${projectImage.progress}%` }}
//                   />
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Project Name */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Project Name
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter project name"
//               placeholderTextColor="#9CA3AF"
//               value={formData.projectName}
//               onChangeText={(text) => handleInputChange('projectName', text)}
//             />
//           </View>

//           {/* Project Code */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Project Code
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter project code"
//               placeholderTextColor="#9CA3AF"
//               value={formData.projectCode}
//               onChangeText={(text) => handleInputChange('projectCode', text)}
//             />
//           </View>

//           {/* Project Type Dropdown */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Project Type
//             </Text>
//             <TouchableOpacity
//               className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
//               onPress={() => setShowProjectTypeDropdown(true)}
//               disabled={loadingProjectTypes}
//             >
//               {loadingProjectTypes ? (
//                 <View className="flex-row items-center">
//                   <ActivityIndicator size="small" color="#235DFF" />
//                   <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-500 ml-2">
//                     Loading project types...
//                   </Text>
//                 </View>
//               ) : (
//                 <>
//                   <Text
//                     style={{ fontFamily: 'Urbanist-Regular' }}
//                     className={`text-base ${formData.projectType ? 'text-black' : 'text-gray-500'}`}
//                   >
//                     {getSelectedProjectTypeName()}
//                   </Text>
//                   <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
//                     ▼
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//             {projectTypes.length === 0 && !loadingProjectTypes && (
//               <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500 mt-1">
//                 No project types available. Please check your connection.
//               </Text>
//             )}
//           </View>

//           {/* Project Description */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Project Description
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
//               placeholder="Enter project description"
//               placeholderTextColor="#9CA3AF"
//               multiline
//               textAlignVertical="top"
//               value={formData.projectDescription}
//               onChangeText={(text) => handleInputChange('projectDescription', text)}
//             />
//           </View>

//           {/* Client Name */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Client Name
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter client name"
//               placeholderTextColor="#9CA3AF"
//               value={formData.clientName}
//               onChangeText={(text) => handleInputChange('clientName', text)}
//             />
//           </View>

//           {/* Client Email */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Client Email
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter client email"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="email-address"
//               value={formData.clientEmail}
//               onChangeText={(text) => handleInputChange('clientEmail', text)}
//             />
//           </View>

//           {/* Client Phone */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Client Phone
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter client phone"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="phone-pad"
//               value={formData.clientPhone}
//               onChangeText={(text) => handleInputChange('clientPhone', text)}
//             />
//           </View>

//           {/* Address / Location */}
//           <View className="mb-6">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Address / Location
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
//               placeholder="Enter project address"
//               placeholderTextColor="#9CA3AF"
//               multiline
//               textAlignVertical="top"
//               value={formData.address}
//               onChangeText={(text) => handleInputChange('address', text)}
//             />
//           </View>

//           {/* Dates with Date Pickers */}
//           <View className="mb-6 flex-row gap-5">
//             <View className="flex-1">
//               <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//                 Start Date
//               </Text>
//               <TouchableOpacity
//                 className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
//                 onPress={() => setShowStartDatePicker(true)}
//               >
//                 <Text
//                   style={{ fontFamily: 'Urbanist-Regular' }}
//                   className={`text-base ${formData.startDate ? 'text-black' : 'text-gray-500'}`}
//                 >
//                   {formData.startDate ? formatDate(formData.startDate) : 'Select Start Date'}
//                 </Text>
//                 <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
//                   📅
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View className="flex-1">
//               <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//                 End Date
//               </Text>
//               <TouchableOpacity
//                 className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
//                 onPress={() => setShowEndDatePicker(true)}
//               >
//                 <Text
//                   style={{ fontFamily: 'Urbanist-Regular' }}
//                   className={`text-base ${formData.endDate ? 'text-black' : 'text-gray-500'}`}
//                 >
//                   {formData.endDate ? formatDate(formData.endDate) : 'Select End Date'}
//                 </Text>
//                 <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
//                   📅
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Budget Amount */}
//           <View className="mb-8">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
//               Budget Amount
//             </Text>
//             <TextInput
//               style={{ fontFamily: 'Urbanist-Regular' }}
//               className="border-b border-[#235DFF] pb-3 text-base text-black"
//               placeholder="Enter budget amount"
//               placeholderTextColor="#9CA3AF"
//               keyboardType="numeric"
//               value={formData.budget}
//               onChangeText={(text) => handleInputChange('budget', text)}
//             />
//           </View>

//           {/* Project Documents */}
//           <View className="mb-8">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-5 text-base text-black">
//               Project Documents
//             </Text>

//             <TouchableOpacity
//               className="mb-6 items-center justify-center rounded-2xl border-2 border-dashed border-[#235DFF] py-12"
//               onPress={handleProjectDocumentsSelect}
//               disabled={isUploading && uploadingType === 'document'}
//             >
//               <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white">
//                 {isUploading && uploadingType === 'document' ? (
//                   <ActivityIndicator size="small" color="#235DFF" />
//                 ) : (
//                   <Text className="text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>Folder</Text>
//                 )}
//               </View>
//               <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-500">
//                 {isUploading && uploadingType === 'document' ? 'Uploading...' : 'Browse documents to upload'}
//               </Text>
//             </TouchableOpacity>

//             {projectDocuments.length > 0 && (
//               <>
//                 <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-4 text-sm text-black">
//                   Uploaded {projectDocuments.filter(doc => doc.cloudinaryUrl).length}/{projectDocuments.length} documents to Cloudinary
//                 </Text>

//                 {projectDocuments.map((doc) => (
//                   <View key={doc.id} className="mb-4">
//                     <View className="mb-2 flex-row items-center justify-between">
//                       <View className="flex-1 flex-row items-center">
//                         <View
//                           className={`h-12 w-12 rounded-xl ${doc.color} mr-4 items-center justify-center`}
//                         >
//                           {doc.isUploading ? (
//                             <ActivityIndicator size="small" color="#fff" />
//                           ) : (
//                             <Text className="text-lg text-white" style={{ fontFamily: 'Urbanist-Regular' }}>
//                               {doc.error ? '!' : doc.icon}
//                             </Text>
//                           )}
//                         </View>
//                         <View className="flex-1">
//                           <Text
//                             style={{ fontFamily: 'Urbanist-Medium' }}
//                             className="text-sm text-black"
//                           >
//                             {doc.name}
//                           </Text>
//                           {doc.error && (
//                             <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500">
//                               Upload failed
//                             </Text>
//                           )}
//                           {doc.cloudinaryUrl && (
//                             <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-green-500">
//                               Cloudinary ✓
//                             </Text>
//                           )}
//                         </View>
//                       </View>
//                       <TouchableOpacity
//                         className="h-7 w-7 items-center justify-center rounded-full bg-red-50"
//                         onPress={() => handleRemoveDocument(doc.id)}
//                         disabled={doc.isUploading}
//                       >
//                         <Text className="text-sm text-red-500" style={{ fontFamily: 'Urbanist-Regular' }}>X</Text>
//                       </TouchableOpacity>
//                     </View>
//                     <View className="ml-16 h-2 overflow-hidden rounded-full bg-gray-200">
//                       <View
//                         className="h-full rounded-full bg-[#235DFF]"
//                         style={{ width: `${doc.progress}%` }}
//                       />
//                     </View>
//                   </View>
//                 ))}
//               </>
//             )}
//           </View>

//           {/* Create Project Button */}
//           <TouchableOpacity
//             className="mb-6 items-center rounded-xl bg-[#235DFF] py-4"
//             onPress={handleCreateProject}
//             disabled={isSubmitting || isUploading || projectTypes.length === 0}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-white">
//                 {isUploading ? 'Uploading Files...' : 'Create Project'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>

//         {/* Project Type Dropdown Modal */}
//         <Modal
//           visible={showProjectTypeDropdown}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowProjectTypeDropdown(false)}
//         >
//           <View className="flex-1 justify-center bg-black/50">
//             <View className="mx-6 bg-white rounded-2xl max-h-80">
//               <View className="px-6 py-4 border-b border-gray-200">
//                 <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-lg text-black">
//                   Select Project Type
//                 </Text>
//               </View>
//               {loadingProjectTypes ? (
//                 <View className="py-8">
//                   <ActivityIndicator size="large" color="#235DFF" />
//                   <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-center text-gray-500 mt-2">
//                     Loading project types...
//                   </Text>
//                 </View>
//               ) : projectTypes.length === 0 ? (
//                 <View className="py-8">
//                   <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-center text-gray-500">
//                     No project types available
//                   </Text>
//                 </View>
//               ) : (
//                 <FlatList
//                   data={projectTypes}
//                   renderItem={ProjectTypeItem}
//                   keyExtractor={(item) => item._id}
//                   showsVerticalScrollIndicator={false}
//                 />
//               )}
//               <TouchableOpacity
//                 className="px-6 py-4 border-t border-gray-200"
//                 onPress={() => setShowProjectTypeDropdown(false)}
//               >
//                 <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-center text-red-500 text-base">
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* Date Pickers */}
//         {showStartDatePicker && (
//           <DateTimePicker
//             value={formData.startDate ? new Date(formData.startDate) : new Date()}
//             mode="date"
//             display="default"
//             onChange={handleStartDateChange}
//           />
//         )}

//         {showEndDatePicker && (
//           <DateTimePicker
//             value={formData.endDate ? new Date(formData.endDate) : new Date()}
//             mode="date"
//             display="default"
//             onChange={handleEndDateChange}
//           />
//         )}

       
//       </View>
//     </SafeAreaView>
//   );
// };

// export default CreateProjectScreen;

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = `${process.env.BASE_API_URL}/api/projects`;
const PROJECT_TYPES_API = `${process.env.BASE_API_URL}/api/project-types`;
const TOKEN_KEY = 'userToken';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDDMMYYYYToISO = (value) => {
  if (!value) return null;
  const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
  if (isoLike) return value;
  const ddmmyyyy = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
  const m = value.match(ddmmyyyy);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const year = parseInt(m[3], 10);
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) return fallback.toISOString();
  return null;
};

const CreateProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Check if we're in edit mode
  const isEditMode = route.params?.project ? true : false;
  const existingProject = route.params?.project || null;

  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    projectDescription: '',
    projectImages: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    startDate: '',
    endDate: '',
    budget: '',
    projectType: '',
  });

  const [projectDocuments, setProjectDocuments] = useState([]);
  const [projectImage, setProjectImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState(null);
  const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loadingProjectTypes, setLoadingProjectTypes] = useState(true);

  // Initialize form with existing project data if in edit mode
  useEffect(() => {
    if (isEditMode && existingProject) {
      initializeFormWithExistingData();
    }
  }, [isEditMode, existingProject]);

  const initializeFormWithExistingData = () => {
    if (!existingProject) return;

    setFormData({
      projectName: existingProject.name || '',
      projectCode: existingProject.projectCode || '',
      projectDescription: existingProject.description || '',
      projectImages: existingProject.projectImages || '',
      clientName: existingProject.clientName || '',
      clientEmail: existingProject.clientEmail || '',
      clientPhone: existingProject.clientPhone || '',
      address: existingProject.location || '',
      startDate: existingProject.startDate || '',
      endDate: existingProject.endDate || '',
      budget: existingProject.budget?.toString() || '',
      projectType: existingProject.projectType || '',
    });

    // Set project image if exists
    if (existingProject.projectImages) {
      setProjectImage({
        id: 'existing-image',
        name: 'Project Image',
        url: existingProject.projectImages,
        cloudinaryUrl: existingProject.projectImages,
        icon: '🖼️',
        color: 'bg-green-500',
        progress: 100,
        isLocal: false,
        isUploading: false,
      });
    }

    // Set project documents if exist
    if (existingProject.projectDocuments && Array.isArray(existingProject.projectDocuments)) {
      const existingDocs = existingProject.projectDocuments.map((docUrl, index) => ({
        id: `existing-doc-${index}`,
        name: `Document ${index + 1}`,
        url: docUrl,
        cloudinaryUrl: docUrl,
        icon: docUrl.includes('.pdf') ? '📄' : '🖼️',
        color: 'bg-green-500',
        progress: 100,
        isLocal: false,
        isUploading: false,
        type: docUrl.includes('.pdf') ? 'raw' : 'image'
      }));
      setProjectDocuments(existingDocs);
    }
  };

  // Fetch project types from API
  useEffect(() => {
    fetchProjectTypes();

  }, []);

  const fetchProjectTypes = async () => {
    try {
      setLoadingProjectTypes(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(PROJECT_TYPES_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched project types:', data);
        
        if (Array.isArray(data)) {
          setProjectTypes(data);
        } else if (data.data && Array.isArray(data.data)) {
          setProjectTypes(data.data);
        } else {
          console.error('Unexpected project types response format:', data);
          setProjectTypes([]);
        }
      } else {
        console.error('Failed to fetch project types:', response.status);
        Alert.alert('Error', 'Failed to load project types');
        setProjectTypes([]);
      }
    } catch (error) {
      console.error('Error fetching project types:', error);
      Alert.alert('Network Error', 'Failed to load project types. Please check your connection.');
      setProjectTypes([]);
    } finally {
      setLoadingProjectTypes(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectTypeSelect = (projectType) => {
    setFormData((prev) => ({ 
      ...prev, 
      projectType: projectType._id 
    }));
    setShowProjectTypeDropdown(false);
  };

  const getSelectedProjectTypeName = () => {
    const selectedType = projectTypes.find(type => type._id === formData.projectType);
    return selectedType ? selectedType.name : 'Select Project Type';
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ 
        ...prev, 
        startDate: selectedDate.toISOString() 
      }));
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ 
        ...prev, 
        endDate: selectedDate.toISOString() 
      }));
    }
  };

  const generateSignature = async (timestamp) => {
    try {
      const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
      const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA1,
        stringToSign
      );
      return signature;
    } catch (error) {
      console.error('Error generating signature:', error);
      throw new Error('Failed to generate signature');
    }
  };

  const uploadToCloudinary = async (imageUri, fileType = 'image') => {
    try {
      console.log('Starting Cloudinary signed upload...');
      
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);
      
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;

      formData.append('file', {
        uri: imageUri,
        type: type,
        name: filename || `${fileType}_${Date.now()}.${fileType === 'image' ? 'jpg' : 'pdf'}`,
      });
      
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Cloudinary response:', e);
        return {
          success: false,
          error: 'Invalid response from Cloudinary',
          details: responseText
        };
      }
      
      if (response.ok && data.secure_url) {
        console.log('✅ Cloudinary upload successful:', data.secure_url);
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
        };
      } else {
        console.error('❌ Cloudinary upload failed:', data);
        return {
          success: false,
          error: data.error?.message || `Upload failed with status ${response.status}`,
          details: data
        };
      }
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleProjectImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    console.log('Project image picker result:', result);

    if (!result.canceled && result.assets && result.assets[0]) {
      const localImage = {
        id: Date.now(),
        name: `project_image_${Date.now()}.jpg`,
        url: result.assets[0].uri,
        icon: '🖼️',
        color: 'bg-blue-500',
        progress: 0,
        isLocal: true,
        isUploading: true,
      };
      
      setProjectImage(localImage);
      setUploadingType('image');
      setIsUploading(true);

      const uploadResult = await uploadToCloudinary(result.assets[0].uri, 'image');
      
      setIsUploading(false);
      setUploadingType(null);

      if (uploadResult.success) {
        const updatedImage = {
          ...localImage,
          url: uploadResult.url,
          cloudinaryUrl: uploadResult.url,
          publicId: uploadResult.publicId,
          progress: 100,
          isUploading: false,
          color: 'bg-green-500'
        };
        setProjectImage(updatedImage);
        
        setFormData((prev) => ({
          ...prev,
          projectImages: uploadResult.url
        }));
        
        Alert.alert('Success', 'Project image uploaded to Cloudinary successfully!');
      } else {
        const failedImage = {
          ...localImage,
          progress: 0,
          isUploading: false,
          color: 'bg-red-500',
          error: uploadResult.error
        };
        setProjectImage(failedImage);
        Alert.alert(
          'Upload Failed', 
          `Failed to upload project image: ${uploadResult.error}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleProjectDocumentsSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    console.log('Project documents picker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      for (const asset of result.assets) {
        const localDocument = {
          id: Date.now() + Math.random(),
          name: `document_${Date.now()}.${asset.type === 'image' ? 'jpg' : 'pdf'}`,
          url: asset.uri,
          icon: asset.type === 'image' ? '🖼️' : '📄',
          color: 'bg-blue-500',
          progress: 0,
          isLocal: true,
          isUploading: true,
          type: asset.type
        };
        
        setProjectDocuments(prev => [localDocument, ...prev]);
        setUploadingType('document');
        setIsUploading(true);

        const uploadResult = await uploadToCloudinary(asset.uri, asset.type === 'image' ? 'image' : 'raw');
        
        setIsUploading(false);
        setUploadingType(null);

        if (uploadResult.success) {
          setProjectDocuments(prev => 
            prev.map(doc => 
              doc.id === localDocument.id 
                ? { 
                    ...doc, 
                    url: uploadResult.url,
                    cloudinaryUrl: uploadResult.url,
                    publicId: uploadResult.publicId,
                    progress: 100,
                    isUploading: false,
                    color: 'bg-green-500'
                  } 
                : doc
            )
          );
        } else {
          setProjectDocuments(prev => 
            prev.map(doc => 
              doc.id === localDocument.id 
                ? { 
                    ...doc, 
                    progress: 0,
                    isUploading: false,
                    color: 'bg-red-500',
                    error: uploadResult.error
                  } 
                : doc
            )
          );
          Alert.alert(
            'Upload Failed', 
            `Failed to upload document: ${uploadResult.error}`,
            [{ text: 'OK' }]
          );
        }
      }
    }
  };

  const handleRemoveProjectImage = () => {
    setProjectImage(null);
    setFormData((prev) => ({
      ...prev,
      projectImages: ''
    }));
  };

  const handleRemoveDocument = (documentId) => {
    setProjectDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const buildRequestBody = () => {
    const startISO = parseDDMMYYYYToISO(formData.startDate) || new Date().toISOString();
    const endISO = parseDDMMYYYYToISO(formData.endDate) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const projectImageUrl = projectImage?.cloudinaryUrl || formData.projectImages || '';

    const projectDocumentsUrls = projectDocuments
      .filter(doc => doc.cloudinaryUrl && !doc.isUploading && !doc.error)
      .map(doc => doc.cloudinaryUrl);

    const body = {
      name: formData.projectName,
      projectCode: formData.projectCode,
      location: formData.address,
      description: formData.projectDescription,
      startDate: startISO,
      endDate: endISO,
      projectType: formData.projectType,
      projectImages: projectImageUrl,
      projectDocuments: projectDocumentsUrls,
      clientName: formData.clientName,
      budget: formData.budget,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
    };

    // Only include versionDetails for new projects
    if (!isEditMode) {
      body.versionDetails = {
        currentVersion: 'v1.0.0',
        lastUpdated: new Date().toISOString(),
        history: [
          {
            version: 'v0.9.0',
            updatedBy: '672e9f1a5e3a2d46a73b3b9f',
            updatedAt: '2025-10-25T09:00:00.000Z',
            notes: 'Initial setup and design draft completed.',
          },
        ],
      };
    }

    return body;
  };

  const handleSubmit = async () => {
    // Check if project image is still uploading
    if (projectImage?.isUploading) {
      Alert.alert('Please Wait', 'Project image is still uploading. Please wait until upload completes.');
      return;
    }

    // Check if any documents are still uploading
    const stillUploadingDocuments = projectDocuments.some(doc => doc.isUploading);
    if (stillUploadingDocuments) {
      Alert.alert('Please Wait', 'Some documents are still uploading. Please wait until all uploads complete.');
      return;
    }

    // Check for failed uploads
    const failedImage = projectImage?.error;
    const failedDocuments = projectDocuments.filter(doc => doc.error);
    
    if (failedImage) {
      Alert.alert('Upload Issues', 'Project image failed to upload. Please remove it or try uploading again.');
      return;
    }

    if (failedDocuments.length > 0) {
      Alert.alert('Upload Issues', 'Some documents failed to upload. Please remove them or try uploading again.');
      return;
    }

    if (!formData.projectName) {
      Alert.alert('Validation', 'Project name is required.');
      return;
    }

    if (!formData.projectCode) {
      Alert.alert('Validation', 'Project code is required.');
      return;
    }

    if (!formData.projectType) {
      Alert.alert('Validation', 'Please select a project type.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log(`[${isEditMode ? 'UpdateProject' : 'CreateProject'}] token present:`, !!token);

      const body = buildRequestBody();
      console.log(`[${isEditMode ? 'UpdateProject' : 'CreateProject'}] ${isEditMode ? 'PUT' : 'POST'} body:`, body);

      const url = isEditMode ? `${API_URL}/${existingProject._id}` : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      const json = await response.json().catch((e) => {
        console.warn(`[${isEditMode ? 'UpdateProject' : 'CreateProject'}] failed to parse JSON response`, e);
        return {};
      });

      if (response.ok) {
        Alert.alert('Success', `Project ${isEditMode ? 'updated' : 'created'} successfully.`);
        navigation.goBack();
      } else {
        const msg = json?.message || `Server returned ${response.status}`;
        Alert.alert(`${isEditMode ? 'Update' : 'Create'} Failed`, msg);
      }
    } catch (err) {
      console.error(`[${isEditMode ? 'UpdateProject' : 'CreateProject'}] network error:`, err);
      Alert.alert('Network Error', `Failed to ${isEditMode ? 'update' : 'create'} project. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project Type Dropdown Item
  const ProjectTypeItem = ({ item }) => (
    <TouchableOpacity
      className="px-4 py-3 border-b border-gray-200"
      onPress={() => handleProjectTypeSelect(item)}
    >
      <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-base text-black">
        {item.name}
      </Text>
      <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-sm text-gray-500 mt-1">
        {item.category} • {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <Header
          title={isEditMode ? "Edit Project" : "Create New Project"}
          showBackButton={true}
          onRightIconPress={() => console.log('header right pressed')}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Project Image */}
          <View className="mb-8 items-center">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black text-center">
              Project Image
            </Text>
            <View className="relative h-32 w-32 overflow-hidden rounded-2xl">
              <View className="h-full w-full items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
                <View className="h-44 w-32 overflow-hidden rounded-2xl border-2 border-white/30 bg-white shadow-2xl shadow-blue-900/50">
                  <Image
                    source={{
                      uri: projectImage?.cloudinaryUrl || projectImage?.url || formData.projectImages || 'https://t4.ftcdn.net/jpg/02/81/89/73/360_F_281897358_3rj9ZBSZHo5s0L1ug7uuIHadSxh9Cc75.jpg',
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                  <View className="shadow-inner absolute inset-0 rounded-2xl border border-white/20" />
                </View>
              </View>
              <TouchableOpacity 
                className="absolute bottom-2 right-2 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#235DFF]"
                onPress={handleProjectImageSelect}
                disabled={isUploading && uploadingType === 'image'}
              >
                {isUploading && uploadingType === 'image' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-xs text-white" style={{ fontFamily: 'Urbanist-Regular' }}>Edit</Text>
                )}
              </TouchableOpacity>
            </View>
            {isUploading && uploadingType === 'image' && (
              <Text className="mt-2 text-xs text-blue-600" style={{ fontFamily: 'Urbanist-Regular' }}>
                Uploading project image...
              </Text>
            )}
            {projectImage && (
              <View className="mt-4 w-full">
                <View className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <View className="flex-row items-center flex-1">
                    <View className={`h-10 w-10 rounded-lg ${projectImage.color} mr-3 items-center justify-center`}>
                      {projectImage.isUploading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white" style={{ fontFamily: 'Urbanist-Regular' }}>
                          {projectImage.icon}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-black">
                        {projectImage.name}
                      </Text>
                      {projectImage.error && (
                        <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500">
                          Upload failed
                        </Text>
                      )}
                      {projectImage.cloudinaryUrl && (
                        <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-green-500">
                          Cloudinary ✓
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    className="h-6 w-6 items-center justify-center rounded-full bg-red-50"
                    onPress={handleRemoveProjectImage}
                    disabled={projectImage.isUploading}
                  >
                    <Text className="text-xs text-red-500" style={{ fontFamily: 'Urbanist-Regular' }}>X</Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200">
                  <View
                    className="h-full rounded-full bg-[#235DFF]"
                    style={{ width: `${projectImage.progress}%` }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Project Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Name
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter project name"
              placeholderTextColor="#9CA3AF"
              value={formData.projectName}
              onChangeText={(text) => handleInputChange('projectName', text)}
            />
          </View>

          {/* Project Code */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Code
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter project code"
              placeholderTextColor="#9CA3AF"
              value={formData.projectCode}
              onChangeText={(text) => handleInputChange('projectCode', text)}
            />
          </View>

          {/* Project Type Dropdown */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Type
            </Text>
            <TouchableOpacity
              className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
              onPress={() => setShowProjectTypeDropdown(true)}
              disabled={loadingProjectTypes}
            >
              {loadingProjectTypes ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#235DFF" />
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-500 ml-2">
                    Loading project types...
                  </Text>
                </View>
              ) : (
                <>
                  <Text
                    style={{ fontFamily: 'Urbanist-Regular' }}
                    className={`text-base ${formData.projectType ? 'text-black' : 'text-gray-500'}`}
                  >
                    {getSelectedProjectTypeName()}
                  </Text>
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
                    ▼
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {projectTypes.length === 0 && !loadingProjectTypes && (
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500 mt-1">
                No project types available. Please check your connection.
              </Text>
            )}
          </View>

          {/* Project Description */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Description
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="Enter project description"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.projectDescription}
              onChangeText={(text) => handleInputChange('projectDescription', text)}
            />
          </View>

          {/* Client Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Name
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client name"
              placeholderTextColor="#9CA3AF"
              value={formData.clientName}
              onChangeText={(text) => handleInputChange('clientName', text)}
            />
          </View>

          {/* Client Email */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Email
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={formData.clientEmail}
              onChangeText={(text) => handleInputChange('clientEmail', text)}
            />
          </View>

          {/* Client Phone */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Phone
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client phone"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={formData.clientPhone}
              onChangeText={(text) => handleInputChange('clientPhone', text)}
            />
          </View>

          {/* Address / Location */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Address / Location
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="Enter project address"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          {/* Dates with Date Pickers */}
          <View className="mb-6 flex-row gap-5">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
                Start Date
              </Text>
              <TouchableOpacity
                className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text
                  style={{ fontFamily: 'Urbanist-Regular' }}
                  className={`text-base ${formData.startDate ? 'text-black' : 'text-gray-500'}`}
                >
                  {formData.startDate ? formatDate(formData.startDate) : 'Select Start Date'}
                </Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
                  📅
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
                End Date
              </Text>
              <TouchableOpacity
                className="border-b border-[#235DFF] pb-3 flex-row justify-between items-center"
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text
                  style={{ fontFamily: 'Urbanist-Regular' }}
                  className={`text-base ${formData.endDate ? 'text-black' : 'text-gray-500'}`}
                >
                  {formData.endDate ? formatDate(formData.endDate) : 'Select End Date'}
                </Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-lg text-gray-500">
                  📅
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Budget Amount */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Budget Amount
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter budget amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.budget}
              onChangeText={(text) => handleInputChange('budget', text)}
            />
          </View>

          {/* Project Documents */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-5 text-base text-black">
              Project Documents
            </Text>

            <TouchableOpacity
              className="mb-6 items-center justify-center rounded-2xl border-2 border-dashed border-[#235DFF] py-12"
              onPress={handleProjectDocumentsSelect}
              disabled={isUploading && uploadingType === 'document'}
            >
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white">
                {isUploading && uploadingType === 'document' ? (
                  <ActivityIndicator size="small" color="#235DFF" />
                ) : (
                  <Text className="text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>Folder</Text>
                )}
              </View>
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-500">
                {isUploading && uploadingType === 'document' ? 'Uploading...' : 'Browse documents to upload'}
              </Text>
            </TouchableOpacity>

            {projectDocuments.length > 0 && (
              <>
                <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-4 text-sm text-black">
                  Uploaded {projectDocuments.filter(doc => doc.cloudinaryUrl).length}/{projectDocuments.length} documents to Cloudinary
                </Text>

                {projectDocuments.map((doc) => (
                  <View key={doc.id} className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <View
                          className={`h-12 w-12 rounded-xl ${doc.color} mr-4 items-center justify-center`}
                        >
                          {doc.isUploading ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text className="text-lg text-white" style={{ fontFamily: 'Urbanist-Regular' }}>
                              {doc.error ? '!' : doc.icon}
                            </Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <Text
                            style={{ fontFamily: 'Urbanist-Medium' }}
                            className="text-sm text-black"
                          >
                            {doc.name}
                          </Text>
                          {doc.error && (
                            <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-red-500">
                              Upload failed
                            </Text>
                          )}
                          {doc.cloudinaryUrl && (
                            <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs text-green-500">
                              Cloudinary ✓
                            </Text>
                          )}
                        </View>
                      </View>
                      <TouchableOpacity
                        className="h-7 w-7 items-center justify-center rounded-full bg-red-50"
                        onPress={() => handleRemoveDocument(doc.id)}
                        disabled={doc.isUploading}
                      >
                        <Text className="text-sm text-red-500" style={{ fontFamily: 'Urbanist-Regular' }}>X</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="ml-16 h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-full rounded-full bg-[#235DFF]"
                        style={{ width: `${doc.progress}%` }}
                      />
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="mb-6 items-center rounded-xl bg-[#235DFF] py-4"
            onPress={handleSubmit}
            disabled={isSubmitting || isUploading || projectTypes.length === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-white">
                {isUploading ? 'Uploading Files...' : (isEditMode ? 'Update Project' : 'Create Project')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Project Type Dropdown Modal */}
        <Modal
          visible={showProjectTypeDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowProjectTypeDropdown(false)}
        >
          <View className="flex-1 justify-center bg-black/50">
            <View className="mx-6 bg-white rounded-2xl max-h-80">
              <View className="px-6 py-4 border-b border-gray-200">
                <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-lg text-black">
                  Select Project Type
                </Text>
              </View>
              {loadingProjectTypes ? (
                <View className="py-8">
                  <ActivityIndicator size="large" color="#235DFF" />
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-center text-gray-500 mt-2">
                    Loading project types...
                  </Text>
                </View>
              ) : projectTypes.length === 0 ? (
                <View className="py-8">
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-center text-gray-500">
                    No project types available
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={projectTypes}
                  renderItem={ProjectTypeItem}
                  keyExtractor={(item) => item._id}
                  showsVerticalScrollIndicator={false}
                />
              )}
              <TouchableOpacity
                className="px-6 py-4 border-t border-gray-200"
                onPress={() => setShowProjectTypeDropdown(false)}
              >
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-center text-red-500 text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={formData.startDate ? new Date(formData.startDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={formData.endDate ? new Date(formData.endDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CreateProjectScreen;