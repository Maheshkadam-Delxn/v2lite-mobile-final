

// import React, { useState, useEffect, useRef } from 'react';

// import * as Crypto from "expo-crypto";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Modal,
//   FlatList,
//   TouchableWithoutFeedback,
//   Dimensions,
//   ActivityIndicator,
//   TextInput,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Header from '@/components/Header';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system/legacy';
// import * as ImagePicker from 'expo-image-picker';
// import { Audio } from 'expo-av';

// const { width } = Dimensions.get('window');
// const CLOUDINARY_CONFIG = {
//   cloudName: 'dmlsgazvr',
//   apiKey: '353369352647425',
//   apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
// };

// const ViewDocument = ({ navigation, route }) => {
//   const { document, folderId } = route.params;
//   console.log("Viewing document:", document, folderId);
//   const [addVersionModal, setAddVersionModal] = useState(false);
//   const [newVersionImage, setNewVersionImage] = useState(null);
//   const [creatingVersion, setCreatingVersion] = useState(false);
// const [rejectModalVisible, setRejectModalVisible] = useState(false);
// const [rejectionReason, setRejectionReason] = useState("");
// const handleApproveVersion = async (versionId) => {
//   try {
//     const token = await AsyncStorage.getItem("userToken");

//     const res = await fetch(
//       `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions/status/${versionId}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: "approved" }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       Alert.alert("Error", data.message);
//       return;
//     }

//     selectedVersion.status = "approved";
//     Alert.alert("Approved", "Version approved successfully");
//   } catch (err) {
//     Alert.alert("Error", "Approval failed");
//   }
// };
// const handleRejectVersion = () => {
//   setRejectionReason("");
//   setRejectModalVisible(true);
// };
// const confirmRejectVersion = async () => {
//   if (!rejectionReason.trim()) {
//     Alert.alert("Required", "Please enter rejection reason");
//     return;
//   }

//   try {
//     const token = await AsyncStorage.getItem("userToken");

//     const res = await fetch(
//       `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions/status/${selectedVersion._id}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           status: "rejected",
//           rejectionReason,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       Alert.alert("Error", data.message);
//       return;
//     }

//     selectedVersion.status = "rejected";
//     selectedVersion.rejectionReason = rejectionReason;

//     setRejectModalVisible(false);
//     Alert.alert("Rejected", "Version rejected successfully");
//   } catch (err) {
//     Alert.alert("Error", "Rejection failed");
//   }
// };

//   const [selectedVersion, setSelectedVersion] = useState(
//     document?.versions?.[0]
//   );

//   /* ---------------- ZOOM ---------------- */
//   const [scale, setScale] = useState(1);

//   /* ---------------- ANNOTATIONS WITH HISTORY ---------------- */
//   const [annotations, setAnnotations] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);

//   const [annotationMode, setAnnotationMode] = useState(false);
//   const [annotationModal, setAnnotationModal] = useState(false);
//   const [currentPoint, setCurrentPoint] = useState(null);

//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [annotationToDelete, setAnnotationToDelete] = useState(null);

//   // NEW: Annotation View Modal
//   const [viewAnnotationModal, setViewAnnotationModal] = useState(false);
//   const [selectedAnnotation, setSelectedAnnotation] = useState(null);

//   const [imageLayout, setImageLayout] = useState({ width: 1, height: 1 });
//   const [versionModalVisible, setVersionModalVisible] = useState(false);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   // For audio recording and playback
//   const [recording, setRecording] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentPlayingId, setCurrentPlayingId] = useState(null);
//   const uploadToCloudinary = async ({
//     uri,
//     folder = "annotations",
//     resourceType = "image", // image | video (audio)
//   }) => {
//     const timestamp = Math.floor(Date.now() / 1000);

//     const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

//     const signature = await Crypto.digestStringAsync(
//       Crypto.CryptoDigestAlgorithm.SHA1,
//       paramsToSign + CLOUDINARY_CONFIG.apiSecret
//     );

//     const formData = new FormData();

//     formData.append("file", {
//       uri,
//       type:
//         resourceType === "video"
//           ? "audio/m4a"
//           : "image/jpeg",
//       name:
//         resourceType === "video"
//           ? "annotation.m4a"
//           : "annotation.jpg",
//     });

//     formData.append("api_key", CLOUDINARY_CONFIG.apiKey);
//     formData.append("timestamp", timestamp);
//     formData.append("signature", signature);
//     formData.append("folder", folder);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();

//     if (!data.secure_url) {
//       throw new Error("Cloudinary upload failed");
//     }

//     return data.secure_url;
//   };
//   // For new annotation data
//   const [annotationData, setAnnotationData] = useState({
//     text: '',
//     imageUri: null,
//     audioUri: null,
//     audioDuration: 0,
//   });

//   // Refs
//   const recordingIntervalRef = useRef(null);
//   const soundRef = useRef(null);

//   // Save current state to history
//   const saveToHistory = (newAnnotations) => {
//     setHistory((prev) => {
//       const newHistory = prev.slice(0, historyIndex + 1);
//       return [...newHistory, newAnnotations];
//     });
//     setHistoryIndex((prev) => prev + 1);
//     setHasUnsavedChanges(true);
//   };

//   /* ---------------- UNDO / REDO ---------------- */
//   const undo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setAnnotations(history[historyIndex - 1]);
//       setHasUnsavedChanges(true);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setAnnotations(history[historyIndex + 1]);
//       setHasUnsavedChanges(true);
//     }
//   };

//   const canUndo = historyIndex > 0;
//   const canRedo = historyIndex < history.length - 1;

//   /* ---------------- IMAGE TAP (START ANNOTATION) ---------------- */
//   const handleImagePress = (event) => {
//     if (!annotationMode) return;

//     const { locationX, locationY } = event.nativeEvent;
//     const x = locationX / imageLayout.width;
//     const y = locationY / imageLayout.height;

//     setCurrentPoint({ x, y });

//     // Reset annotation data for new annotation
//     setAnnotationData({
//       text: '',
//       imageUri: null,
//       audioUri: null,
//       audioDuration: 0,
//     });

//     setAnnotationModal(true);
//   };

//   /* ---------------- VIEW ANNOTATION DETAILS ---------------- */
//   const viewAnnotationDetails = (annotation) => {
//     setSelectedAnnotation(annotation);
//     setViewAnnotationModal(true);
//   };

//   const closeViewAnnotationModal = async () => {
//     // Stop audio if playing
//     if (currentPlayingId === selectedAnnotation?.id && isPlaying) {
//       await stopAudio();
//     }
//     setViewAnnotationModal(false);
//     setSelectedAnnotation(null);
//   };

//   /* ---------------- AUDIO RECORDING FUNCTIONS ---------------- */
//   const startRecording = async () => {
//     try {
//       console.log('Requesting audio permissions...');

//       const permission = await Audio.requestPermissionsAsync();
//       console.log('Audio permission status:', permission.status);

//       if (permission.status !== 'granted') {
//         Alert.alert('Permission Required', 'Permission to access microphone is required for voice annotations!');
//         return;
//       }

//       // Configure audio mode for recording
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//         staysActiveInBackground: false,
//         shouldDuckAndroid: true,
//         playThroughEarpieceAndroid: false,
//       });

//       console.log('Starting recording...');

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//       setIsRecording(true);
//       setRecordingDuration(0);

//       // Start timer for recording duration
//       recordingIntervalRef.current = setInterval(() => {
//         setRecordingDuration(prev => prev + 1);
//       }, 1000);

//       console.log('Recording started successfully');

//     } catch (err) {
//       console.error('Failed to start recording', err);
//       Alert.alert('Recording Failed', 'Failed to start recording: ' + err.message);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       console.log('Stopping recording...');

//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current);
//         recordingIntervalRef.current = null;
//       }

//       setIsRecording(false);

//       if (recording) {
//         await recording.stopAndUnloadAsync();

//         // Reset audio mode for playback
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: false,
//           playsInSilentModeIOS: true,
//           staysActiveInBackground: false,
//           shouldDuckAndroid: true,
//           playThroughEarpieceAndroid: false,
//         });

//         const uri = recording.getURI();
//         console.log('Recording saved to:', uri);
//         console.log('Recording duration:', recordingDuration, 'seconds');

//         setAnnotationData(prev => ({
//           ...prev,
//           audioUri: uri,
//           audioDuration: recordingDuration,
//         }));

//         setRecording(null);
//         console.log('Recording stopped successfully');
//       }
//     } catch (err) {
//       console.error('Failed to stop recording', err);
//       Alert.alert('Recording Error', 'Failed to stop recording');
//     }
//   };

//   /* ---------------- AUDIO PLAYBACK FUNCTIONS ---------------- */
//   // const playAudio = async (audioUri, annotationId) => {
//   //   try {
//   //     console.log('=== PLAY AUDIO DEBUG ===');
//   //     console.log('Audio URI:', audioUri);
//   //     console.log('Annotation ID:', annotationId);

//   //     // Check if file exists
//   //     const fileInfo = await FileSystem.getInfoAsync(audioUri);
//   //     console.log('File exists:', fileInfo.exists);

//   //     if (!fileInfo.exists) {
//   //       Alert.alert('Audio Error', 'Audio file not found');
//   //       return;
//   //     }

//   //     // Stop any currently playing audio
//   //     if (soundRef.current) {
//   //       await soundRef.current.stopAsync();
//   //       await soundRef.current.unloadAsync();
//   //       soundRef.current = null;
//   //       setIsPlaying(false);
//   //     }

//   //     // Set audio mode for playback
//   //     await Audio.setAudioModeAsync({
//   //       allowsRecordingIOS: false,
//   //       playsInSilentModeIOS: true,
//   //       staysActiveInBackground: false,
//   //       shouldDuckAndroid: true,
//   //       playThroughEarpieceAndroid: false,
//   //     });

//   //     // Set loading state
//   //     setCurrentPlayingId(annotationId);
//   //     setIsPlaying(true);

//   //     // Load the audio file
//   //     const { sound } = await Audio.Sound.createAsync(
//   //       { uri: audioUri },
//   //       {
//   //         shouldPlay: true,
//   //         isLooping: false
//   //       },
//   //       onPlaybackStatusUpdate
//   //     );

//   //     soundRef.current = sound;

//   //     // Play the audio
//   //     await sound.playAsync();

//   //   } catch (err) {
//   //     console.error('=== PLAY AUDIO ERROR ===', err);
//   //     console.error('Error details:', err.message);
//   //     setIsPlaying(false);
//   //     setCurrentPlayingId(null);
//   //     Alert.alert('Playback Error', 'Failed to play audio: ' + err.message);
//   //   }
//   // };
//   /* ---------------- AUDIO PLAYBACK FUNCTIONS ---------------- */
//   const playAudio = async (audioUri, annotationId) => {
//     try {
//       console.log('=== PLAY AUDIO DEBUG ===');
//       console.log('Audio URI:', audioUri);
//       console.log('Annotation ID:', annotationId);

//       // Skip file existence check for Cloudinary/remote URLs
//       if (audioUri && audioUri.startsWith('http')) {
//         console.log('Playing Cloudinary/remote audio URL');
//         // Cloudinary URLs are remote, skip local file check
//       } else if (audioUri) {
//         // For local files only, check if they exist
//         const fileInfo = await FileSystem.getInfoAsync(audioUri);
//         console.log('Local file exists:', fileInfo.exists);

//         if (!fileInfo.exists) {
//           Alert.alert('Audio Error', 'Audio file not found');
//           return;
//         }
//       } else {
//         Alert.alert('Audio Error', 'No audio URL provided');
//         return;
//       }

//       // Stop any currently playing audio
//       if (soundRef.current) {
//         await soundRef.current.stopAsync();
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//         setIsPlaying(false);
//       }

//       // Set audio mode for playback
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: false,
//         playsInSilentModeIOS: true,
//         staysActiveInBackground: false,
//         shouldDuckAndroid: true,
//         playThroughEarpieceAndroid: false,
//       });

//       // Set loading state
//       setCurrentPlayingId(annotationId);
//       setIsPlaying(true);

//       console.log('Loading audio from URI:', audioUri);

//       // Load the audio file - works for both local files and Cloudinary URLs
//       const { sound } = await Audio.Sound.createAsync(
//         { uri: audioUri },
//         {
//           shouldPlay: true,
//           isLooping: false,
//           // Additional options for better compatibility
//           progressUpdateIntervalMillis: 500,
//           volume: 1.0,
//           rate: 1.0,
//           pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
//         },
//         onPlaybackStatusUpdate
//       );

//       soundRef.current = sound;

//       console.log('Audio loaded successfully, starting playback...');

//       // Play the audio
//       await sound.playAsync();

//     } catch (err) {
//       console.error('=== PLAY AUDIO ERROR ===', err);
//       console.error('Error details:', err.message);
//       setIsPlaying(false);
//       setCurrentPlayingId(null);

//       // Check for specific audio format issues
//       if (err.message.includes('format') || err.message.includes('codec')) {
//         Alert.alert('Playback Error', 'Audio format not supported. Try recording again.');
//       } else {
//         Alert.alert('Playback Error', 'Failed to play audio: ' + err.message);
//       }
//     }
//   };
//   const onPlaybackStatusUpdate = (status) => {
//     console.log('Playback status update:', status);

//     if (status.isLoaded) {
//       if (status.isPlaying) {
//         setIsPlaying(true);
//       } else {
//         setIsPlaying(false);
//       }

//       if (status.didJustFinish) {
//         // Audio finished playing
//         console.log('Playback finished');
//         setIsPlaying(false);
//         setCurrentPlayingId(null);
//         if (soundRef.current) {
//           soundRef.current.unloadAsync();
//           soundRef.current = null;
//         }
//       }
//     }

//     if (status.error) {
//       console.error('Playback error:', status.error);
//       Alert.alert('Playback Error', 'Error playing audio');
//       setIsPlaying(false);
//       setCurrentPlayingId(null);
//     }
//   };

//   const stopAudio = async () => {
//     try {
//       if (soundRef.current) {
//         await soundRef.current.stopAsync();
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//       setIsPlaying(false);
//       setCurrentPlayingId(null);
//     } catch (err) {
//       console.error('Error stopping audio:', err);
//     }
//   };

//   /* ---------------- AUDIO CLEANUP ---------------- */
//   const cleanupAudio = async () => {
//     try {
//       if (soundRef.current) {
//         await soundRef.current.stopAsync();
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }
//       if (recording) {
//         await recording.stopAndUnloadAsync();
//         setRecording(null);
//       }
//       if (recordingIntervalRef.current) {
//         clearInterval(recordingIntervalRef.current);
//         recordingIntervalRef.current = null;
//       }
//       setIsPlaying(false);
//       setIsRecording(false);
//       setCurrentPlayingId(null);
//     } catch (err) {
//       console.error('Error cleaning up audio:', err);
//     }
//   };

//   /* ---------------- IMAGE PICKER ---------------- */
//   const pickImage = async () => {
//     try {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (permission.status !== 'granted') {
//         Alert.alert('Permission Required', 'Permission to access gallery is required!');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets && result.assets[0]) {
//         setAnnotationData(prev => ({
//           ...prev,
//           imageUri: result.assets[0].uri,
//         }));
//       }
//     } catch (err) {
//       console.error('Error picking image', err);
//       Alert.alert('Image Error', 'Failed to pick image');
//     }
//   };

//   const saveAnnotation = async () => {
//     const hasText = annotationData.text.trim();
//     const hasImage = annotationData.imageUri;
//     const hasAudio = annotationData.audioUri;

//     if (!hasText && !hasImage && !hasAudio) {
//       Alert.alert("No Content", "Add text, image or audio");
//       return;
//     }

//     let imageUrl = null;
//     let audioUrl = null;

//     try {
//       if (hasImage) {
//         imageUrl = await uploadToCloudinary({
//           uri: annotationData.imageUri,
//           folder: "annotations/images",
//           resourceType: "image",
//         });
//       }

//       if (hasAudio) {
//         audioUrl = await uploadToCloudinary({
//           uri: annotationData.audioUri,
//           folder: "annotations/audio",
//           resourceType: "video", // audio = video in Cloudinary
//         });
//       }
//     } catch (err) {
//       Alert.alert("Upload Failed", err.message);
//       return;
//     }

//     const newAnnotation = {
//       id: `anno_${Date.now()}`,
//       x: currentPoint.x,
//       y: currentPoint.y,
//       text: annotationData.text,
//       imageUri: imageUrl,
//       audioUri: audioUrl,
//       audioDuration: annotationData.audioDuration,
//       versionId: selectedVersion._id,
//       createdAt: new Date().toISOString(),
//     };

//     const newAnnotations = [...annotations, newAnnotation];
//     console.log('New Annotation:', newAnnotation);
//     setAnnotations(newAnnotations);
//     saveToHistory(newAnnotations);

//     setAnnotationModal(false);
//     setCurrentPoint(null);
//     setAnnotationData({
//       text: "",
//       imageUri: null,
//       audioUri: null,
//       audioDuration: 0,
//     });

//     Alert.alert("Success", "Annotation uploaded to Cloudinary");
//   };

//   /* ---------------- CANCEL ANNOTATION ---------------- */
//   const cancelAnnotation = async () => {
//     // Stop recording if in progress
//     if (isRecording) {
//       await stopRecording();
//     }

//     // Clean up audio resources
//     await cleanupAudio();

//     // Reset states
//     setAnnotationData({
//       text: '',
//       imageUri: null,
//       audioUri: null,
//       audioDuration: 0,
//     });

//     setAnnotationModal(false);
//     setCurrentPoint(null);
//   };

//   /* ---------------- DELETE ANNOTATION ---------------- */
//   const openDeleteModal = (annotation) => {
//     setAnnotationToDelete(annotation);
//     setDeleteModalVisible(true);
//   };

//   const confirmDelete = async () => {
//     if (annotationToDelete) {
//       // Stop audio if playing this annotation
//       if (currentPlayingId === annotationToDelete.id) {
//         await stopAudio();
//       }

//       // Delete associated files
//       if (annotationToDelete.audioUri) {
//         try {
//           await FileSystem.deleteAsync(annotationToDelete.audioUri);
//         } catch (err) {
//           console.error('Error deleting audio file:', err);
//         }
//       }

//       if (annotationToDelete.imageUri) {
//         try {
//           await FileSystem.deleteAsync(annotationToDelete.imageUri);
//         } catch (err) {
//           console.error('Error deleting image file:', err);
//         }
//       }

//       const newAnnotations = annotations.filter((a) => a.id !== annotationToDelete.id);
//       setAnnotations(newAnnotations);
//       saveToHistory(newAnnotations);

//       Alert.alert('Deleted', 'Annotation deleted successfully');
//     }
//     setDeleteModalVisible(false);
//     setAnnotationToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteModalVisible(false);
//     setAnnotationToDelete(null);
//   };

//   /* ---------------- ZOOM CONTROLS ---------------- */
//   const zoomIn = () => setScale((p) => Math.min(p + 0.2, 3));
//   const zoomOut = () => setScale((p) => Math.max(p - 0.2, 1));
//   const resetZoom = () => setScale(1);

//   const versionAnnotations = annotations.filter(
//     (a) => a.versionId === selectedVersion._id
//   );
//   const handleAddVersion = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       if (!token) {
//         Alert.alert("Auth Error", "User not authenticated");
//         return;
//       }

//       const res = await fetch(
//         `${process.env.BASE_API_URL}/api/documents/${document._id}/versions`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         Alert.alert("Failed", data.message || "Failed to create version");
//         return;
//       }

//       // ✅ Update versions locally
//       const updatedVersions = [...document.versions, data];

//       document.versions = updatedVersions; // keep in sync

//       // ✅ Select new version
//       setSelectedVersion(data);
//       setAnnotations([]);
//       setHistory([]);
//       setHistoryIndex(-1);
//       setScale(1);

//       setVersionModalVisible(false);

//       Alert.alert("Success", `Version ${data.versionNumber} added`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   /* ---------------- SAVE TO BACKEND ---------------- */
//   const handleSave = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       if (!token) {
//         Alert.alert('Authentication Error', "User not authenticated");
//         return;
//       }


//       console.log("files", versionAnnotations)
//       const payload = {
//         documentId: document._id,
//         versionId: selectedVersion._id,
//         annotations: versionAnnotations.map(a => ({
//           x: a.x,
//           y: a.y,
//           text: a.text || "",

//           imageUri: a.imageUri || null,   // ✅ Cloudinary image URL
//           audioUri: a.audioUri || null,   // ✅ Cloudinary audio URL
//           audioDuration: a.audioDuration || 0,
//         })),
//       };


//       const res = await fetch(
//         `${process.env.BASE_API_URL}/api/plan-folders/annotations/${folderId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("❌ Save failed:", data);
//         Alert.alert('Save Failed', data.message || "Failed to save annotations");
//         return;
//       }

//       console.log("✅ SAVE SUCCESS:", data);
//       setHasUnsavedChanges(false);
//       Alert.alert('Success', "Annotations saved successfully");
//     } catch (err) {
//       console.error("❌ Error saving annotations:", err);
//       Alert.alert('Error', "Something went wrong");
//     }
//   };

//   /* ---------------- FETCH ANNOTATIONS ---------------- */
//   const fetchAnnotations = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       const url =
//         `${process.env.BASE_API_URL}` +
//         `/api/plan-folders/annotations/${folderId}/` +
//         `?documentId=${document._id}` +
//         `&versionId=${selectedVersion._id}`;

//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("❌ Fetch failed:", data);
//         return;
//       }

//       // Note: For production, you'd need to download files from server
//       const mappedAnnotations = (data.annotations || []).map(a => ({
//         id: a._id,
//         x: a.x,
//         y: a.y,
//         text: a.text,
//         imageUri: a.imageUri || null,
//         audioUri: a.audioUri || null,
//         audioDuration: a.audioDuration || 0,
//         versionId: selectedVersion._id,
//       }));

//       setAnnotations(mappedAnnotations);
//       setHistory([mappedAnnotations]);
//       setHistoryIndex(0);
//       setHasUnsavedChanges(false);
//     } catch (err) {
//       console.error("❌ Error fetching annotations:", err);
//     }
//   };



//   /* ---------------- EFFECTS ---------------- */
//   useEffect(() => {
//     if (!selectedVersion?._id) return;
//     fetchAnnotations();
//   }, [selectedVersion]);
// const [user, setUser] = useState(null);
//   // Cleanup on unmount
//  useEffect(() => {
//   // Define async function inside useEffect
//   const fetchUserData = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         setUser(parsedUserData);
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       // Handle error appropriately
//     }
//   };

//   fetchUserData(); // Call the async function

//   return () => {
//     cleanupAudio();
//   };
// }, []);
//   console.log("Current user in ViewDocument:", user);
//   const pickVersionImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permission.status !== "granted") {
//       Alert.alert("Permission Required", "Gallery access is required");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [16, 9],
//       quality: 0.9,
//     });

//     if (!result.canceled) {
//       setNewVersionImage(result.assets[0].uri);
//     }
//   };
//   const handleCreateVersion = async () => {
//     if (!newVersionImage) {
//       Alert.alert("Missing Image", "Please upload plan image");
//       return;
//     }

//     try {
//       setCreatingVersion(true);
//       const token = await AsyncStorage.getItem("userToken");

//       // 1️⃣ Upload image to Cloudinary
//       const imageUrl = await uploadToCloudinary({
//         uri: newVersionImage,
//         folder: "document-versions",
//         resourceType: "image",
//       });
//       console.log("Uploaded image URL:", imageUrl);

//       // 2️⃣ Create version in backend
//       const res = await fetch(
//         `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             image: imageUrl,
//           }),
//         }
//       );

//       const data = await res.json();
//       console.log("Create version response:", data);

//       if (!res.ok) {
//         Alert.alert("Failed", data.message || "Version creation failed");
//         return;
//       }

//       // 3️⃣ Update UI
//       document.versions.push(data);
//       setSelectedVersion(data);
//       setAnnotations([]);
//       setHistory([]);
//       setHistoryIndex(-1);
//       setScale(1);

//       setAddVersionModal(false);
//       setNewVersionImage(null);

//       Alert.alert("Success", `Version created`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Something went wrong");
//     } finally {
//       setCreatingVersion(false);
//     }
//   };


//   /* ---------------- RENDER ANNOTATION MARKER ---------------- */
//   const renderAnnotationMarker = (item) => {
//     const hasText = item.text && item.text.length > 0;

//     return (
//       <TouchableOpacity
//         key={item.id}
//         activeOpacity={0.7}
//         onPress={() => viewAnnotationDetails(item)}
//         onLongPress={() => openDeleteModal(item)}
//         style={{
//           position: 'absolute',
//           left: item.x * imageLayout.width - 20,
//           top: item.y * imageLayout.height - 20,
//           alignItems: 'center',
//           zIndex: 1000,
//         }}
//       >
//         {/* Marker Icon - Simple red pin without badges */}
//         <View className="relative">
//           <Icon
//             name="map-marker"
//             size={40}
//             color="#EF4444"  // Always red, no color coding based on content
//           />

//           {/* REMOVED: Small badge icons on marker */}
//         </View>

//         {/* SIMPLE TOOLTIP - Only shows text preview */}
//         <View className="bg-black/90 px-3 py-1 rounded-lg mt-1">
//           <Text className="text-white text-xs">
//             {hasText ? (item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text) : 'Annotation'}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#F9FAFB", position: "relative" }}>

//       {/* ---------------- HEADER ---------------- */}
//       <Header
//         title={`View Document: ${document.name}`}
//         showBackButton
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"

//       />
//       {/* ---------------- SAVE BUTTON BELOW HEADER ---------------- */}
//       {hasUnsavedChanges && (
//         <View
//           style={{
//             paddingHorizontal: 16,
//             paddingVertical: 10,
//             backgroundColor: "#F9FAFB",
//             borderBottomWidth: 1,
//             borderBottomColor: "#E5E7EB",
//           }}
//         >
//           <TouchableOpacity
//             onPress={handleSave}
//             activeOpacity={0.85}
//             style={{
//               backgroundColor: "#2563EB",
//               paddingVertical: 14,
//               borderRadius: 12,
//               flexDirection: "row",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Icon name="content-save" size={22} color="#fff" />
//             <Text
//               style={{
//                 color: "#fff",
//                 marginLeft: 10,
//                 fontSize: 16,
//                 fontWeight: "600",
//               }}
//             >
//               Save Changes
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//    {
//   user?.role === "client" && selectedVersion?.status === "pending" && (
//     <View
//       style={{
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: "#F9FAFB",
//         borderBottomWidth: 1,
//         borderBottomColor: "#E5E7EB",
//       }}
//     >
//       <View style={{ flexDirection: "row", gap: 12 }}>
//         {/* Reject Button with confirmation */}
//         <TouchableOpacity
//           onPress={() => {
//             Alert.alert(
//               "Reject Version",
//               `Are you sure you want to reject Version ${selectedVersion.versionNumber}?`,
//               [
//                 { text: "Cancel", style: "cancel" },
//                 { 
//                   text: "Reject", 
//                   style: "destructive",
//                   onPress: () => handleRejectVersion(selectedVersion._id)
//                 }
//               ]
//             );
//           }}
//           activeOpacity={0.85}
//           style={{
//             flex: 1,
//             backgroundColor: "#FFFFFF",
//             paddingVertical: 14,
//             borderRadius: 12,
//             borderWidth: 1.5,
//             borderColor: "#EF4444",
//             justifyContent: "center",
//             alignItems: "center",
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.05,
//             shadowRadius: 2,
//             elevation: 2,
//           }}
//         >
//           <Text
//             style={{
//               color: "#EF4444",
//               fontSize: 16,
//               fontWeight: "600",
//             }}
//           >
//             Reject
//           </Text>
//         </TouchableOpacity>

//         {/* Approve Button with confirmation */}
//         <TouchableOpacity
//           onPress={() => {
//             Alert.alert(
//               "Approve Version",
//               `Are you sure you want to approve Version ${selectedVersion.versionNumber}?`,
//               [
//                 { text: "Cancel", style: "cancel" },
//                 { 
//                   text: "Approve", 
//                   style: "default",
//                   onPress: () => handleApproveVersion(selectedVersion._id)
//                 }
//               ]
//             );
//           }}
//           activeOpacity={0.85}
//           style={{
//             flex: 1,
//             backgroundColor: "#10B981",
//             paddingVertical: 14,
//             borderRadius: 12,
//             justifyContent: "center",
//             alignItems: "center",
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//             elevation: 2,
//           }}
//         >
//           <Text
//             style={{
//               color: "#FFFFFF",
//               fontSize: 16,
//               fontWeight: "600",
//             }}
//           >
//             Approve
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

//       {/* ---------------- IMAGE WITH ANNOTATIONS ---------------- */}
//       <View className="flex-1 justify-center items-center px-4">
//         <View
//           style={{
//             width: width - 32,
//             maxWidth: 420,
//             aspectRatio: 16 / 9,
//             borderRadius: 16,
//             overflow: 'hidden',
//             backgroundColor: '#fff',
//             elevation: 4,
//           }}
//         >
//           <TouchableWithoutFeedback onPress={handleImagePress}>
//             <View
//               style={{ flex: 1 }}
//               onLayout={(e) => {
//                 const { width, height } = e.nativeEvent.layout;
//                 setImageLayout({ width, height });
//               }}
//             >
//               {imageLoading && (
//                 <ActivityIndicator
//                   style={{
//                     position: 'absolute',
//                     top: '45%',
//                     left: '45%',
//                     zIndex: 10,
//                   }}
//                   size="large"
//                   color="#0066FF"
//                 />
//               )}

//               <View style={{ flex: 1, transform: [{ scale }] }}>
//                 <Image
//                   source={{ uri: selectedVersion.image }}
//                   style={{ width: '100%', height: '100%' }}
//                   resizeMode="contain"
//                   onLoadEnd={() => setImageLoading(false)}
//                   onError={() => {
//                     setImageLoading(false);
//                     Alert.alert('Image Error', 'Failed to load document image');
//                   }}
//                 />

//                 {/* ANNOTATIONS */}
//                 {versionAnnotations.map(renderAnnotationMarker)}
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>

//         <Text className="mt-3 text-gray-600">
//           Version {selectedVersion.versionNumber}
//           {hasUnsavedChanges && <Text className="text-red-500"> • Unsaved changes</Text>}
//         </Text>

//         {annotationMode && (
//           <View className="mt-2 flex-row items-center">
//             <Icon name="map-marker-plus" size={16} color="#0066FF" />
//             <Text className="text-blue-600 ml-1 text-sm">
//               Tap on the image to add an annotation (text, voice, or image)
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* ---------------- BOTTOM ACTION PANEL ---------------- */}
//       <View className="flex-row justify-around items-center bg-white py-3 border-t">
//         <ActionButton icon="undo" onPress={undo} disabled={!canUndo} />
//         <ActionButton icon="redo" onPress={redo} disabled={!canRedo} />

//         <ActionButton icon="plus" onPress={zoomIn} />
//         <ActionButton icon="minus" onPress={zoomOut} />
//         <ActionButton icon="crop-free" onPress={resetZoom} />

//         <ActionButton
//           icon="map-marker-plus"
//           active={annotationMode}
//           onPress={() => setAnnotationMode((p) => !p)}
//         />
//       </View>

//       {/* ---------------- CHANGE VERSION ---------------- */}
//       <View className="p-4 bg-white border-t">
//         <TouchableOpacity
//           onPress={() => setVersionModalVisible(true)}
//           className="bg-blue-600 py-3 rounded-xl flex-row justify-center"
//         >
//           <Icon name="layers-outline" size={18} color="#fff" />
//           <Text className="text-white ml-2 font-semibold">Change Version</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ---------------- ANNOTATION CREATION MODAL ---------------- */}
//       <Modal
//         transparent
//         visible={annotationModal}
//         animationType="fade"
//         onRequestClose={cancelAnnotation}
//       >
//         <View className="flex-1 bg-black/50 justify-center px-6">
//           <ScrollView className="max-h-[80%]" keyboardShouldPersistTaps="handled">
//             <View className="bg-white rounded-xl p-4">
//               <View className="flex-row justify-between items-center mb-4">
//                 <Text className="text-lg font-semibold">Add Annotation</Text>
//                 <TouchableOpacity onPress={cancelAnnotation}>
//                   <Icon name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {/* Text Input Section */}
//               <View className="mb-4">
//                 <Text className="text-gray-700 font-medium mb-2">Text Note</Text>
//                 <TextInput
//                   value={annotationData.text}
//                   onChangeText={(text) => setAnnotationData(prev => ({ ...prev, text }))}
//                   placeholder="Enter your annotation text..."
//                   className="border border-gray-300 rounded-lg px-4 py-3 text-base"
//                   placeholderTextColor="#999"
//                   multiline={true}
//                   numberOfLines={4}
//                   textAlignVertical="top"
//                 />
//               </View>

//               {/* Voice Recording Section */}
//               <View className="mb-4">
//                 <Text className="text-gray-700 font-medium mb-2">Voice Note</Text>
//                 <View className="flex-row items-center justify-between">
//                   {annotationData.audioUri ? (
//                     <View className="flex-1 flex-row items-center bg-green-50 p-3 rounded-lg">
//                       <Icon name="check-circle" size={20} color="#10B981" />
//                       <Text className="text-green-600 ml-2">
//                         Recorded ({annotationData.audioDuration}s)
//                       </Text>
//                       <TouchableOpacity
//                         onPress={() => {
//                           if (currentPlayingId === 'new' && isPlaying) {
//                             stopAudio();
//                           } else {
//                             playAudio(annotationData.audioUri, 'new');
//                           }
//                         }}
//                         className="ml-auto bg-green-100 p-2 rounded-full"
//                       >
//                         <Icon
//                           name={currentPlayingId === 'new' && isPlaying ? "pause" : "play"}
//                           size={20}
//                           color="#10B981"
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         onPress={() => setAnnotationData(prev => ({ ...prev, audioUri: null, audioDuration: 0 }))}
//                         className="ml-2 bg-red-100 p-2 rounded-full"
//                       >
//                         <Icon name="delete" size={18} color="#EF4444" />
//                       </TouchableOpacity>
//                     </View>
//                   ) : isRecording ? (
//                     <View className="flex-1 flex-row items-center bg-red-50 p-3 rounded-lg">
//                       <View className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//                       <Text className="text-red-600 ml-2 font-medium">
//                         Recording... {recordingDuration}s
//                       </Text>
//                       <TouchableOpacity
//                         onPress={stopRecording}
//                         className="ml-auto bg-red-100 p-2 rounded-full"
//                       >
//                         <Icon name="stop" size={20} color="#EF4444" />
//                       </TouchableOpacity>
//                     </View>
//                   ) : (
//                     <TouchableOpacity
//                       onPress={startRecording}
//                       className="flex-1 flex-row items-center bg-blue-50 p-3 rounded-lg"
//                     >
//                       <Icon name="microphone" size={20} color="#3B82F6" />
//                       <Text className="text-blue-600 ml-2 font-medium">Record Voice Note</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>

//               {/* Image Upload Section */}
//               <View className="mb-6">
//                 <Text className="text-gray-700 font-medium mb-2">Image Attachment</Text>
//                 {annotationData.imageUri ? (
//                   <View className="relative">
//                     <Image
//                       source={{ uri: annotationData.imageUri }}
//                       className="w-full h-48 rounded-lg mb-2"
//                       resizeMode="cover"
//                     />
//                     <TouchableOpacity
//                       onPress={() => setAnnotationData(prev => ({ ...prev, imageUri: null }))}
//                       className="absolute top-2 right-2 bg-black/70 p-2 rounded-full"
//                     >
//                       <Icon name="close" size={16} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <TouchableOpacity
//                     onPress={pickImage}
//                     className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
//                   >
//                     <Icon name="image-plus" size={40} color="#9CA3AF" />
//                     <Text className="text-gray-500 mt-2 font-medium">Tap to add an image</Text>
//                     <Text className="text-gray-400 text-sm">Supports JPG, PNG</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Action Buttons */}
//               <View className="flex-row justify-between">
//                 <TouchableOpacity
//                   onPress={cancelAnnotation}
//                   className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
//                 >
//                   <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={saveAnnotation}
//                   disabled={!annotationData.text && !annotationData.imageUri && !annotationData.audioUri}
//                   className={`py-3 rounded-lg flex-1 ml-2 ${annotationData.text || annotationData.imageUri || annotationData.audioUri
//                     ? 'bg-blue-600'
//                     : 'bg-blue-300'
//                     }`}
//                 >
//                   <Text className="text-white text-center font-semibold">Save Annotation</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>

//       {/* ---------------- VIEW ANNOTATION DETAILS MODAL ---------------- */}
//       <Modal
//         transparent
//         visible={viewAnnotationModal}
//         animationType="fade"
//         onRequestClose={closeViewAnnotationModal}
//       >
//         <View className="flex-1 bg-black/50 justify-center px-6">
//           <ScrollView className="max-h-[85%]" keyboardShouldPersistTaps="handled">
//             <View className="bg-white rounded-xl p-5">
//               <View className="flex-row justify-between items-center mb-4">
//                 <Text className="text-lg font-semibold">Annotation Details</Text>
//                 <TouchableOpacity onPress={closeViewAnnotationModal}>
//                   <Icon name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {selectedAnnotation && (
//                 <>
//                   {/* Text Content */}
//                   {selectedAnnotation.text && selectedAnnotation.text.length > 0 && (
//                     <View className="mb-5">
//                       <Text className="text-gray-700 font-medium mb-2">Text Note</Text>
//                       <View className="bg-blue-50 p-4 rounded-lg">
//                         <Text className="text-gray-800 text-base">{selectedAnnotation.text}</Text>
//                       </View>
//                     </View>
//                   )}

//                   {/* Audio Content */}
//                   {selectedAnnotation.audioUri && (
//                     <View className="mb-5">
//                       <Text className="text-gray-700 font-medium mb-2">Voice Note</Text>
//                       <View className="bg-green-50 p-4 rounded-lg">
//                         <View className="flex-row items-center justify-between">
//                           <View className="flex-row items-center">
//                             <Icon
//                               name="microphone"
//                               size={24}
//                               color="#10B981"
//                             />
//                             <Text className="text-green-700 ml-3 font-medium">
//                               Audio Recording ({selectedAnnotation.audioDuration}s)
//                             </Text>
//                           </View>
//                           <TouchableOpacity
//                             onPress={() => {
//                               if (currentPlayingId === selectedAnnotation.id && isPlaying) {
//                                 stopAudio();
//                               } else {
//                                 playAudio(selectedAnnotation.audioUri, selectedAnnotation.id);
//                               }
//                             }}
//                             className="bg-green-100 p-3 rounded-full"
//                           >
//                             <Icon
//                               name={currentPlayingId === selectedAnnotation.id && isPlaying ? "pause" : "play"}
//                               size={22}
//                               color="#10B981"
//                             />
//                           </TouchableOpacity>
//                         </View>
//                         {currentPlayingId === selectedAnnotation.id && isPlaying && (
//                           <View className="flex-row items-center mt-3">
//                             <View className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
//                             <Text className="text-green-600 text-sm">Playing audio...</Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   )}

//                   {/* Image Content */}
//                   {selectedAnnotation.imageUri && (
//                     <View className="mb-5">
//                       <Text className="text-gray-700 font-medium mb-2">Image Attachment</Text>
//                       <View className="bg-red-50 p-4 rounded-lg">
//                         <Image
//                           source={{ uri: selectedAnnotation.imageUri }}
//                           className="w-full h-64 rounded-lg mb-3"
//                           resizeMode="contain"
//                         />
//                         <Text className="text-red-700 text-sm italic">
//                           Image attached to annotation
//                         </Text>
//                       </View>
//                     </View>
//                   )}

//                   {/* REMOVED: Annotation Information Section */}

//                   {/* Action Buttons */}
//                   <View className="flex-row justify-between mt-6">
//                     <TouchableOpacity
//                       onPress={closeViewAnnotationModal}
//                       className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
//                     >
//                       <Text className="text-gray-800 text-center font-semibold">Close</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => {
//                         closeViewAnnotationModal();
//                         openDeleteModal(selectedAnnotation);
//                       }}
//                       className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
//                     >
//                       <Text className="text-white text-center font-semibold">Delete</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </>
//               )}
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>

//       {/* ---------------- VERSION MODAL ---------------- */}
//       <Modal
//         transparent
//         visible={versionModalVisible}
//         animationType="slide"
//         onRequestClose={() => setVersionModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setVersionModalVisible(false)}>
//           <View className="flex-1 bg-black/40 justify-end">
//             <TouchableWithoutFeedback>
//               <View className="bg-white rounded-t-3xl p-4 max-h-[80%]">
//                 <View className="flex-row justify-between items-center mb-4">
//                   <Text className="text-lg font-semibold">Select Version</Text>
//                   <TouchableOpacity onPress={() => setVersionModalVisible(false)}>
//                     <Icon name="close" size={24} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//                 {user?.role !== "client" && ( <TouchableOpacity
//                   onPress={() => setAddVersionModal(true)}

//                   className="bg-blue-600 py-3 rounded-xl flex-row justify-center items-center mb-4"
//                 >
//                   <Icon name="plus" size={20} color="#fff" />
//                   <Text className="text-white ml-2 font-semibold">
//                     Add New Version
//                   </Text>
//                 </TouchableOpacity>)}
               

               
//                 <FlatList
//   data={document.versions}
//   keyExtractor={(item) => item._id}
//   renderItem={({ item }) => {
//     const isSelected = selectedVersion._id === item._id;
    
//     // Status styling
//     const getStatusStyle = (status) => {
//       switch(status) {
//         case "pending": return "bg-yellow-100 text-yellow-800";
//         case "approved": return "bg-green-100 text-green-800";
//         case "rejected": return "bg-red-100 text-red-800";
//         default: return "bg-gray-100 text-gray-800";
//       }
//     };

//     return (
//       <TouchableOpacity
//         onPress={() => {
//           setSelectedVersion(item);
//           setScale(1);
//           setVersionModalVisible(false);
//         }}
//         className={`p-4 rounded-xl mb-2 flex-row items-center ${
//           isSelected 
//             ? 'bg-blue-50 border border-blue-200' 
//             : 'bg-gray-50 border border-gray-200'
//         }`}
//       >
//         <Icon 
//           name="file-document-outline" 
//           size={20} 
//           color={isSelected ? "#0066FF" : "#4B5563"} 
//         />
        
//         <View className="ml-3 flex-1">
//           <Text className="font-medium text-gray-900">
//             Version {item.versionNumber}
//           </Text>
          
//           <View className={`px-2 py-1 rounded-full mt-1 self-start ${getStatusStyle(item.status)}`}>
//             <Text className="text-xs font-medium">
//               Status: {item.status}
//             </Text>
//           </View>
//         </View>
        
//         {isSelected && (
//           <Icon name="check-circle" size={20} color="#0066FF" />
//         )}
//       </TouchableOpacity>
//     );
//   }}
// />
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>

//       {/* ---------------- DELETE CONFIRMATION MODAL ---------------- */}
//       <Modal
//         transparent
//         visible={deleteModalVisible}
//         animationType="fade"
//         onRequestClose={cancelDelete}
//       >
//         <View className="flex-1 bg-black/50 justify-center px-6">
//           <View className="bg-white rounded-xl p-5">
//             <Text className="text-lg font-semibold text-center mb-4">
//               Delete Annotation?
//             </Text>
//             <Text className="text-gray-600 text-center mb-6">
//               This will permanently delete all associated content (text, voice, image).
//             </Text>

//             <View className="flex-row justify-between">
//               <TouchableOpacity
//                 onPress={cancelDelete}
//                 className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
//               >
//                 <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={confirmDelete}
//                 className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
//               >
//                 <Text className="text-white text-center font-semibold">Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal
//         transparent
//         visible={addVersionModal}
//         animationType="fade"
//         onRequestClose={() => setAddVersionModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center px-6">
//           <View className="bg-white rounded-xl p-5">
//             <Text className="text-lg font-semibold mb-4">
//               Upload New Plan Version
//             </Text>

//             {/* Image Preview / Picker */}
//             {newVersionImage ? (
//               <View className="relative mb-4">
//                 <Image
//                   source={{ uri: newVersionImage }}
//                   className="w-full h-48 rounded-lg"
//                   resizeMode="contain"
//                 />
//                 <TouchableOpacity
//                   onPress={() => setNewVersionImage(null)}
//                   className="absolute top-2 right-2 bg-black/70 p-2 rounded-full"
//                 >
//                   <Icon name="close" size={18} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 onPress={pickVersionImage}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center mb-4"
//               >
//                 <Icon name="image-plus" size={40} color="#9CA3AF" />
//                 <Text className="text-gray-500 mt-2">
//                   Upload plan image
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {/* Buttons */}
//             <View className="flex-row justify-between mt-4">
//               <TouchableOpacity
//                 onPress={() => setAddVersionModal(false)}
//                 className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
//               >
//                 <Text className="text-center font-semibold">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleCreateVersion}
//                 disabled={creatingVersion}
//                 className={`py-3 rounded-lg flex-1 ml-2 ${creatingVersion ? "bg-blue-300" : "bg-blue-600"
//                   }`}
//               >
//                 {creatingVersion ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text className="text-white text-center font-semibold">
//                     Create Version
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modal transparent visible={rejectModalVisible} animationType="fade">
//   <View className="flex-1 bg-black/50 justify-center px-6">
//     <View className="bg-white rounded-xl p-5">
//       <Text className="text-lg font-semibold mb-3">
//         Reject Version {selectedVersion.versionNumber}
//       </Text>

//       <TextInput
//         value={rejectionReason}
//         onChangeText={setRejectionReason}
//         placeholder="Enter rejection reason..."
//         multiline
//         className="border border-gray-300 rounded-lg p-4 h-28 text-base"
//       />

//       <View className="flex-row justify-between mt-5">
//         <TouchableOpacity
//           onPress={() => setRejectModalVisible(false)}
//           className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
//         >
//           <Text className="text-center font-semibold">Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={confirmRejectVersion}
//           className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
//         >
//           <Text className="text-white text-center font-semibold">Reject</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// </Modal>


//     </View>
//   );
// };

// /* ---------------- ACTION BUTTON COMPONENT ---------------- */
// const ActionButton = ({ icon, onPress, active, disabled }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     disabled={disabled}
//     className={`w-12 h-12 rounded-full items-center justify-center ${active ? 'bg-blue-600' : disabled ? 'bg-gray-200' : 'bg-gray-100'
//       }`}
//   >
//     <Icon
//       name={icon}
//       size={22}
//       color={active ? '#fff' : disabled ? '#aaa' : '#333'}
//     />
//   </TouchableOpacity>
// );

// export default ViewDocument;

import React, { useState, useEffect, useRef } from 'react';
import * as Crypto from "expo-crypto";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '@/components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const ViewDocument = ({ navigation, route }) => {
  const { document: initialDocument, folderId } = route.params;

  // ── Local state copies ──
  const [document, setDocument] = useState(initialDocument);
  const [selectedVersion, setSelectedVersion] = useState(initialDocument?.versions?.[0] || null);

  const [addVersionModal, setAddVersionModal] = useState(false);
  const [newVersionImage, setNewVersionImage] = useState(null);
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Zoom & Annotations
  const [scale, setScale] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationModal, setAnnotationModal] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState(null);
  const [viewAnnotationModal, setViewAnnotationModal] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [imageLayout, setImageLayout] = useState({ width: 1, height: 1 });
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Audio states
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const [annotationData, setAnnotationData] = useState({
    text: '',
    imageUri: null,
    audioUri: null,
    audioDuration: 0,
  });

  const recordingIntervalRef = useRef(null);
  const soundRef = useRef(null);

  const [user, setUser] = useState(null);

  // ── Fetch user role once ──
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // ── Fetch annotations when selected version changes ──
  useEffect(() => {
    if (!selectedVersion?._id) return;
    fetchAnnotations();
  }, [selectedVersion]);

  // ── Cleanup audio on unmount ──
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  // ──────────────────────────────
  //          CLOUDINARY UPLOAD
  // ──────────────────────────────
  const uploadToCloudinary = async ({ uri, folder = "annotations", resourceType = "image" }) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      paramsToSign + CLOUDINARY_CONFIG.apiSecret
    );

    const formData = new FormData();
    formData.append("file", {
      uri,
      type: resourceType === "video" ? "audio/m4a" : "image/jpeg",
      name: resourceType === "video" ? "annotation.m4a" : "annotation.jpg",
    });
    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url;
  };

  // ──────────────────────────────
  //         HISTORY / UNDO / REDO
  // ──────────────────────────────
  const saveToHistory = (newAnnotations) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newAnnotations];
    });
    setHistoryIndex((prev) => prev + 1);
    setHasUnsavedChanges(true);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // ──────────────────────────────
  //      ANNOTATION CREATION
  // ──────────────────────────────
  const handleImagePress = (event) => {
    if (!annotationMode) return;
    const { locationX, locationY } = event.nativeEvent;
    const x = locationX / imageLayout.width;
    const y = locationY / imageLayout.height;

    setCurrentPoint({ x, y });
    setAnnotationData({ text: '', imageUri: null, audioUri: null, audioDuration: 0 });
    setAnnotationModal(true);
  };

  const saveAnnotation = async () => {
    const hasText = annotationData.text.trim();
    const hasImage = annotationData.imageUri;
    const hasAudio = annotationData.audioUri;

    if (!hasText && !hasImage && !hasAudio) {
      Alert.alert("No Content", "Add text, image or audio");
      return;
    }

    let imageUrl = null;
    let audioUrl = null;

    try {
      if (hasImage) {
        imageUrl = await uploadToCloudinary({
          uri: annotationData.imageUri,
          folder: "annotations/images",
          resourceType: "image",
        });
      }
      if (hasAudio) {
        audioUrl = await uploadToCloudinary({
          uri: annotationData.audioUri,
          folder: "annotations/audio",
          resourceType: "video",
        });
      }
    } catch (err) {
      Alert.alert("Upload Failed", err.message);
      return;
    }

    const newAnnotation = {
      id: `anno_${Date.now()}`,
      x: currentPoint.x,
      y: currentPoint.y,
      text: annotationData.text,
      imageUri: imageUrl,
      audioUri: audioUrl,
      audioDuration: annotationData.audioDuration,
      versionId: selectedVersion._id,
      createdAt: new Date().toISOString(),
    };

    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
    saveToHistory(newAnnotations);

    setAnnotationModal(false);
    setCurrentPoint(null);
    setAnnotationData({ text: "", imageUri: null, audioUri: null, audioDuration: 0 });
    Alert.alert("Success", "Annotation added");
  };

  const cancelAnnotation = async () => {
    if (isRecording) await stopRecording();
    await cleanupAudio();
    setAnnotationData({ text: '', imageUri: null, audioUri: null, audioDuration: 0 });
    setAnnotationModal(false);
    setCurrentPoint(null);
  };

  // ──────────────────────────────
  //         AUDIO FUNCTIONS
  // ──────────────────────────────
  // const startRecording = async () => {
  //   try {
  //     const { status } = await Audio.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('Permission Required', 'Microphone permission is required');
  //       return;
  //     }

  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY
  //     );

  //     setRecording(recording);
  //     setIsRecording(true);
  //     setRecordingDuration(0);

  //     recordingIntervalRef.current = setInterval(() => {
  //       setRecordingDuration(prev => prev + 1);
  //     }, 1000);

  //     await recording.startAsync();
  //   } catch (err) {
  //     console.error('Recording start failed', err);
  //     Alert.alert('Error', 'Failed to start recording');
  //   }
  // };
const startRecording = async () => {
  try {
    // Stop any playing audio first
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Microphone permission is required');
      return;
    }

    // ✅ SAFE audio mode (NO interruptionMode)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(recording);
    setIsRecording(true);
    setRecordingDuration(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

  } catch (err) {
    console.error('Recording start failed', err);
    Alert.alert('Error', 'Failed to start recording');
  }
};


  const stopRecording = async () => {
    try {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      setIsRecording(false);

      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAnnotationData(prev => ({
          ...prev,
          audioUri: uri,
          audioDuration: recordingDuration,
        }));
        setRecording(null);
      }
    } catch (err) {
      console.error('Stop recording failed', err);
    }
  };

  const playAudio = async (audioUri, annotationId) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      setCurrentPlayingId(annotationId);
      setIsPlaying(true);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      await sound.playAsync();
    } catch (err) {
      console.error('Play audio error:', err);
      setIsPlaying(false);
      setCurrentPlayingId(null);
      Alert.alert('Playback Error', err.message);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        if (soundRef.current) {
          soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      }
    }
    if (status.error) {
      console.error('Playback error:', status.error);
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
  };

  const cleanupAudio = async () => {
    await stopAudio();
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsPlaying(false);
    setIsRecording(false);
    setCurrentPlayingId(null);
  };

  // ──────────────────────────────
  //         IMAGE PICKER
  // ──────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setAnnotationData(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  // ──────────────────────────────
  //     APPROVE / REJECT VERSION
  // ──────────────────────────────
  const handleApproveVersion = async (versionId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(
        `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions/status/${versionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "approved" }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message || "Approval failed");
        return;
      }

      // Update both document and selectedVersion immutably
      setDocument(prev => ({
        ...prev,
        versions: prev.versions.map(v =>
          v._id === versionId ? { ...v, status: "approved" } : v
        ),
      }));

      if (selectedVersion._id === versionId) {
        setSelectedVersion(prev => ({ ...prev, status: "approved" }));
      }

      Alert.alert("Success", "Version approved");
    } catch (err) {
      Alert.alert("Error", "Approval failed");
    }
  };

  const handleRejectVersion = () => {
    setRejectModalVisible(true);
  };

  const confirmRejectVersion = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Required", "Please enter a rejection reason");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(
        `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions/status/${selectedVersion._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "rejected",
            rejectionReason,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message || "Rejection failed");
        return;
      }

      setDocument(prev => ({
        ...prev,
        versions: prev.versions.map(v =>
          v._id === selectedVersion._id
            ? { ...v, status: "rejected", rejectionReason }
            : v
        ),
      }));

      setSelectedVersion(prev => ({
        ...prev,
        status: "rejected",
        rejectionReason,
      }));

      setRejectModalVisible(false);
      setRejectionReason("");
      Alert.alert("Success", "Version rejected");
    } catch (err) {
      Alert.alert("Error", "Rejection failed");
    }
  };

  // ──────────────────────────────
  //       CREATE NEW VERSION
  // ──────────────────────────────
  const pickVersionImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Gallery access is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });

    if (!result.canceled) {
      setNewVersionImage(result.assets[0].uri);
    }
  };

  const handleCreateVersion = async () => {
    if (!newVersionImage) {
      Alert.alert("Missing Image", "Please upload a plan image");
      return;
    }

    setCreatingVersion(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const imageUrl = await uploadToCloudinary({
        uri: newVersionImage,
        folder: "document-versions",
        resourceType: "image",
      });

      const res = await fetch(
        `${process.env.BASE_API_URL}/api/plan-folders/${folderId}/documents/${document._id}/versions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: imageUrl }),
        }
      );

      const newVersion = await res.json();
      if (!res.ok) {
        Alert.alert("Error", newVersion.message || "Failed to create version");
        return;
      }

      // Update document state → triggers re-render
      setDocument(prev => ({
        ...prev,
        versions: [...prev.versions, newVersion],
      }));

      setSelectedVersion(newVersion);
      setAnnotations([]);
      setHistory([]);
      setHistoryIndex(-1);
      setScale(1);

      setAddVersionModal(false);
      setNewVersionImage(null);

      Alert.alert("Success", `Version ${newVersion.versionNumber} created`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Version creation failed");
    } finally {
      setCreatingVersion(false);
    }
  };

  // ──────────────────────────────
  //         SAVE ANNOTATIONS
  // ──────────────────────────────
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Not authenticated");

      const versionAnnotations = annotations.filter(a => a.versionId === selectedVersion._id);

      const payload = {
        documentId: document._id,
        versionId: selectedVersion._id,
        annotations: versionAnnotations.map(a => ({
          x: a.x,
          y: a.y,
          text: a.text || "",
          imageUri: a.imageUri || null,
          audioUri: a.audioUri || null,
          audioDuration: a.audioDuration || 0,
        })),
      };

      const res = await fetch(
        `${process.env.BASE_API_URL}/api/plan-folders/annotations/${folderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Save failed");
      }

      setHasUnsavedChanges(false);
      Alert.alert("Success", "Annotations saved");
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", err.message || "Failed to save");
    }
  };

  // ──────────────────────────────
  //      FETCH EXISTING ANNOTATIONS
  // ──────────────────────────────
  const fetchAnnotations = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const url = `${process.env.BASE_API_URL}/api/plan-folders/annotations/${folderId}/?documentId=${document._id}&versionId=${selectedVersion._id}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      const mapped = (data.annotations || []).map(a => ({
        id: a._id,
        x: a.x,
        y: a.y,
        text: a.text,
        imageUri: a.imageUri,
        audioUri: a.audioUri,
        audioDuration: a.audioDuration || 0,
        versionId: selectedVersion._id,
      }));

      setAnnotations(mapped);
      setHistory([mapped]);
      setHistoryIndex(0);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Fetch annotations error:", err);
    }
  };

  // ──────────────────────────────
  //         RENDER HELPERS
  // ──────────────────────────────
  const renderAnnotationMarker = (item) => {
    const hasText = item.text?.trim().length > 0;

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedAnnotation(item);
          setViewAnnotationModal(true);
        }}
        onLongPress={() => {
          setAnnotationToDelete(item);
          setDeleteModalVisible(true);
        }}
        style={{
          position: 'absolute',
          left: item.x * imageLayout.width - 20,
          top: item.y * imageLayout.height - 20,
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        <Icon name="map-marker" size={40} color="#EF4444" />
        <View className="bg-black/90 px-3 py-1 rounded-lg mt-1">
          <Text className="text-white text-xs">
            {hasText ? (item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text) : 'Annotation'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ActionButton = ({ icon, onPress, active, disabled }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-12 h-12 rounded-full items-center justify-center ${active ? 'bg-blue-600' : disabled ? 'bg-gray-200' : 'bg-gray-100'}`}
    >
      <Icon name={icon} size={22} color={active ? '#fff' : disabled ? '#aaa' : '#333'} />
    </TouchableOpacity>
  );

  const versionAnnotations = annotations.filter(a => a.versionId === selectedVersion?._id);

  // ──────────────────────────────
  //           RENDER
  // ──────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>

      <Header
        title={`View Document: ${document?.name || 'Document'}`}
        showBackButton
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {hasUnsavedChanges && (
        <View style={{ padding: 16, backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{ backgroundColor: "#2563EB", paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center' }}
          >
            <Icon name="content-save" size={22} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 10, fontSize: 16, fontWeight: "600" }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Client can approve/reject pending versions */}
      {user?.role === "client" && selectedVersion?.status === "pending" && (
        <View style={{ padding: 16, backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Reject Version",
                  `Reject Version ${selectedVersion.versionNumber}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reject", style: "destructive", onPress: handleRejectVersion }
                  ]
                );
              }}
              style={{ flex: 1, backgroundColor: "#fff", paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: "#EF4444", justifyContent: 'center' }}
            >
              <Text style={{ color: "#EF4444", textAlign: 'center', fontWeight: "600", fontSize: 16 }}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Approve Version",
                  `Approve Version ${selectedVersion.versionNumber}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Approve", onPress: () => handleApproveVersion(selectedVersion._id) }
                  ]
                );
              }}
              style={{ flex: 1, backgroundColor: "#10B981", paddingVertical: 14, borderRadius: 12, justifyContent: 'center' }}
            >
              <Text style={{ color: "#fff", textAlign: 'center', fontWeight: "600", fontSize: 16 }}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Image Area */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        <View
          style={{
            width: width - 32,
            aspectRatio: 16 / 9,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#fff',
            elevation: 4,
          }}
        >
          <TouchableWithoutFeedback onPress={handleImagePress}>
            <View
              style={{ flex: 1 }}
              onLayout={(e) => setImageLayout(e.nativeEvent.layout)}
            >
              {imageLoading && (
                <ActivityIndicator size="large" color="#0066FF" style={{ position: 'absolute', top: '45%', left: '45%' }} />
              )}

              <View style={{ flex: 1, transform: [{ scale }] }}>
                {selectedVersion?.image && (
                  <Image
                    source={{ uri: selectedVersion.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      Alert.alert('Error', 'Failed to load image');
                    }}
                  />
                )}

                {versionAnnotations.map(renderAnnotationMarker)}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Text style={{ marginTop: 12, color: '#4B5563' }}>
          Version {selectedVersion?.versionNumber || '?'}
          {hasUnsavedChanges && <Text style={{ color: '#EF4444' }}> • Unsaved</Text>}
        </Text>

        {annotationMode && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Icon name="map-marker-plus" size={16} color="#0066FF" />
            <Text style={{ color: '#0066FF', marginLeft: 6 }}>Tap image to add annotation</Text>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <ActionButton icon="undo" onPress={undo} disabled={!canUndo} />
        <ActionButton icon="redo" onPress={redo} disabled={!canRedo} />
        <ActionButton icon="plus" onPress={() => setScale(p => Math.min(p + 0.2, 3))} />
        <ActionButton icon="minus" onPress={() => setScale(p => Math.max(p - 0.2, 1))} />
        <ActionButton icon="crop-free" onPress={() => setScale(1)} />
        <ActionButton
          icon="map-marker-plus"
          active={annotationMode}
          onPress={() => setAnnotationMode(p => !p)}
        />
      </View>

      {/* Change Version Button */}
      <View style={{ padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <TouchableOpacity
          onPress={() => setVersionModalVisible(true)}
          style={{ backgroundColor: '#0066FF', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        >
          <Icon name="layers-outline" size={18} color="#fff" />
          <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>Change Version</Text>
        </TouchableOpacity>
      </View>

      {/* ────────────────────────────────────────────── */}
      {/*                MODALS                          */}
      {/* ────────────────────────────────────────────── */}

      {/* Add Annotation Modal */}
      <Modal transparent visible={annotationModal} animationType="fade" onRequestClose={cancelAnnotation}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Add Annotation</Text>
                <TouchableOpacity onPress={cancelAnnotation}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Text */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: '500', marginBottom: 8 }}>Text Note</Text>
                <TextInput
                  value={annotationData.text}
                  onChangeText={text => setAnnotationData(p => ({ ...p, text }))}
                  placeholder="Enter note..."
                  multiline
                  numberOfLines={4}
                  style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, textAlignVertical: 'top' }}
                />
              </View>

              {/* Voice */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: '500', marginBottom: 8 }}>Voice Note</Text>
                {annotationData.audioUri ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8 }}>
                    <Icon name="check-circle" size={20} color="#10B981" />
                    <Text style={{ color: '#065F46', marginLeft: 8 }}>
                      Recorded ({annotationData.audioDuration}s)
                    </Text>
                    <TouchableOpacity
                      onPress={() => playAudio(annotationData.audioUri, 'new')}
                      style={{ marginLeft: 'auto', backgroundColor: '#DCFCE7', padding: 8, borderRadius: 999 }}
                    >
                      <Icon name="play" size={20} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                ) : isRecording ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8 }}>
                    <View style={{ width: 12, height: 12, backgroundColor: '#EF4444', borderRadius: 6, marginRight: 8 }} />
                    <Text style={{ color: '#991B1B' }}>Recording... {recordingDuration}s</Text>
                    <TouchableOpacity onPress={stopRecording} style={{ marginLeft: 'auto' }}>
                      <Icon name="stop" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={startRecording}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8 }}
                  >
                    <Icon name="microphone" size={20} color="#3B82F6" />
                    <Text style={{ color: '#1D4ED8', marginLeft: 8, fontWeight: '500' }}>Record Voice</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Image */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: '500', marginBottom: 8 }}>Image</Text>
                {annotationData.imageUri ? (
                  <View style={{ position: 'relative' }}>
                    <Image source={{ uri: annotationData.imageUri }} style={{ width: '100%', height: 180, borderRadius: 8 }} resizeMode="cover" />
                    <TouchableOpacity
                      onPress={() => setAnnotationData(p => ({ ...p, imageUri: null }))}
                      style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 999 }}
                    >
                      <Icon name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#9CA3AF', borderRadius: 8, padding: 24, alignItems: 'center' }}
                  >
                    <Icon name="image-plus" size={40} color="#9CA3AF" />
                    <Text style={{ color: '#6B7280', marginTop: 8 }}>Add Image</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={cancelAnnotation}
                  style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 8 }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveAnnotation}
                  disabled={!annotationData.text && !annotationData.imageUri && !annotationData.audioUri}
                  style={{
                    flex: 1,
                    backgroundColor: (annotationData.text || annotationData.imageUri || annotationData.audioUri) ? '#2563EB' : '#93C5FD',
                    paddingVertical: 14,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* View Annotation Details Modal */}
      <Modal transparent visible={viewAnnotationModal} animationType="fade" onRequestClose={() => setViewAnnotationModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <ScrollView>
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Annotation</Text>
                <TouchableOpacity onPress={() => setViewAnnotationModal(false)}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedAnnotation?.text && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontWeight: '500', marginBottom: 8 }}>Text</Text>
                  <View style={{ backgroundColor: '#EFF6FF', padding: 16, borderRadius: 8 }}>
                    <Text>{selectedAnnotation.text}</Text>
                  </View>
                </View>
              )}

              {selectedAnnotation?.audioUri && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontWeight: '500', marginBottom: 8 }}>Voice Note</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 16, borderRadius: 8 }}>
                    <Icon name="microphone" size={24} color="#10B981" />
                    <Text style={{ marginLeft: 12, color: '#065F46' }}>
                      {selectedAnnotation.audioDuration}s
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (currentPlayingId === selectedAnnotation.id && isPlaying) {
                          stopAudio();
                        } else {
                          playAudio(selectedAnnotation.audioUri, selectedAnnotation.id);
                        }
                      }}
                      style={{ marginLeft: 'auto', backgroundColor: '#DCFCE7', padding: 10, borderRadius: 999 }}
                    >
                      <Icon name={currentPlayingId === selectedAnnotation.id && isPlaying ? "pause" : "play"} size={20} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {selectedAnnotation?.imageUri && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontWeight: '500', marginBottom: 8 }}>Image</Text>
                  <Image
                    source={{ uri: selectedAnnotation.imageUri }}
                    style={{ width: '100%', height: 240, borderRadius: 8 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setViewAnnotationModal(false)}
                  style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 8 }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: '600' }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setViewAnnotationModal(false);
                    setAnnotationToDelete(selectedAnnotation);
                    setDeleteModalVisible(true);
                  }}
                  style={{ flex: 1, backgroundColor: '#DC2626', paddingVertical: 14, borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Version Selection Modal */}
      <Modal transparent visible={versionModalVisible} animationType="slide" onRequestClose={() => setVersionModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVersionModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Versions</Text>
                <TouchableOpacity onPress={() => setVersionModalVisible(false)}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {user?.role !== "client" && (
                <TouchableOpacity
                  onPress={() => setAddVersionModal(true)}
                  style={{ backgroundColor: '#0066FF', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}
                >
                  <Icon name="plus" size={20} color="#fff" />
                  <Text style={{ color: 'white', marginLeft: 8, fontWeight: '600' }}>Add New Version</Text>
                </TouchableOpacity>
              )}

              <FlatList
                data={document?.versions || []}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                  const isSelected = selectedVersion?._id === item._id;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedVersion(item);
                        setScale(1);
                        setVersionModalVisible(false);
                      }}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 8,
                        backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB',
                        borderWidth: 1,
                        borderColor: isSelected ? '#BFDBFE' : '#E5E7EB',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Icon name="file-document-outline" size={20} color={isSelected ? "#0066FF" : "#6B7280"} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ fontWeight: '500' }}>Version {item.versionNumber}</Text>
                        <View style={{
                          alignSelf: 'flex-start',
                          marginTop: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 12,
                          backgroundColor:
                            item.status === 'approved' ? '#D1FAE5' :
                              item.status === 'rejected' ? '#FEE2E2' :
                                item.status === 'pending' ? '#FEF3C7' : '#F3F4F6'
                        }}>
                          <Text style={{
                            fontSize: 12,
                            color:
                              item.status === 'approved' ? '#065F46' :
                                item.status === 'rejected' ? '#991B1B' :
                                  item.status === 'pending' ? '#92400E' : '#4B5563'
                          }}>
                            {item.status}
                          </Text>
                        </View>
                      </View>
                      {isSelected && <Icon name="check-circle" size={20} color="#0066FF" />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add New Version Modal */}
      <Modal transparent visible={addVersionModal} animationType="fade" onRequestClose={() => setAddVersionModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Upload New Version</Text>

            {newVersionImage ? (
              <View style={{ position: 'relative', marginBottom: 16 }}>
                <Image source={{ uri: newVersionImage }} style={{ width: '100%', height: 180, borderRadius: 8 }} resizeMode="contain" />
                <TouchableOpacity
                  onPress={() => setNewVersionImage(null)}
                  style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 999 }}
                >
                  <Icon name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickVersionImage}
                style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#9CA3AF', borderRadius: 8, padding: 32, alignItems: 'center', marginBottom: 16 }}
              >
                <Icon name="image-plus" size={40} color="#9CA3AF" />
                <Text style={{ color: '#6B7280', marginTop: 8 }}>Select Plan Image</Text>
              </TouchableOpacity>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setAddVersionModal(false)}
                style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 8 }}
              >
                <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateVersion}
                disabled={creatingVersion || !newVersionImage}
                style={{
                  flex: 1,
                  backgroundColor: creatingVersion || !newVersionImage ? '#93C5FD' : '#2563EB',
                  paddingVertical: 14,
                  borderRadius: 8,
                  justifyContent: 'center',
                }}
              >
                {creatingVersion ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Create Version</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal transparent visible={rejectModalVisible} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              Reject Version {selectedVersion?.versionNumber}
            </Text>

            <TextInput
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Enter reason..."
              multiline
              style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top' }}
            />

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setRejectModalVisible(false)}
                style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 8 }}
              >
                <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmRejectVersion}
                style={{ flex: 1, backgroundColor: '#DC2626', paddingVertical: 14, borderRadius: 8 }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <Modal transparent visible={deleteModalVisible} animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 12 }}>Delete Annotation?</Text>
            <Text style={{ color: '#4B5563', textAlign: 'center', marginBottom: 24 }}>
              This action cannot be undone.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 8 }}
              >
                <Text style={{ textAlign: 'center', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // You can add annotation deletion logic here if needed
                  setAnnotations(prev => prev.filter(a => a.id !== annotationToDelete?.id));
                  setDeleteModalVisible(false);
                  setAnnotationToDelete(null);
                  Alert.alert("Deleted", "Annotation removed");
                }}
                style={{ flex: 1, backgroundColor: '#DC2626', paddingVertical: 14, borderRadius: 8 }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewDocument;