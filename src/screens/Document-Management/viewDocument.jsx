

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
  const { document, folderId } = route.params;

  const [selectedVersion, setSelectedVersion] = useState(
    document?.versions?.[0]
  );

  /* ---------------- ZOOM ---------------- */
  const [scale, setScale] = useState(1);

  /* ---------------- ANNOTATIONS WITH HISTORY ---------------- */
  const [annotations, setAnnotations] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationModal, setAnnotationModal] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState(null);

  // NEW: Annotation View Modal
  const [viewAnnotationModal, setViewAnnotationModal] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  const [imageLayout, setImageLayout] = useState({ width: 1, height: 1 });
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // For audio recording and playback
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const uploadToCloudinary = async ({
    uri,
    folder = "annotations",
    resourceType = "image", // image | video (audio)
  }) => {
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      paramsToSign + CLOUDINARY_CONFIG.apiSecret
    );

    const formData = new FormData();

    formData.append("file", {
      uri,
      type:
        resourceType === "video"
          ? "audio/m4a"
          : "image/jpeg",
      name:
        resourceType === "video"
          ? "annotation.m4a"
          : "annotation.jpg",
    });

    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  };
  // For new annotation data
  const [annotationData, setAnnotationData] = useState({
    text: '',
    imageUri: null,
    audioUri: null,
    audioDuration: 0,
  });

  // Refs
  const recordingIntervalRef = useRef(null);
  const soundRef = useRef(null);

  // Save current state to history
  const saveToHistory = (newAnnotations) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newAnnotations];
    });
    setHistoryIndex((prev) => prev + 1);
    setHasUnsavedChanges(true);
  };

  /* ---------------- UNDO / REDO ---------------- */
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

  /* ---------------- IMAGE TAP (START ANNOTATION) ---------------- */
  const handleImagePress = (event) => {
    if (!annotationMode) return;

    const { locationX, locationY } = event.nativeEvent;
    const x = locationX / imageLayout.width;
    const y = locationY / imageLayout.height;

    setCurrentPoint({ x, y });

    // Reset annotation data for new annotation
    setAnnotationData({
      text: '',
      imageUri: null,
      audioUri: null,
      audioDuration: 0,
    });

    setAnnotationModal(true);
  };

  /* ---------------- VIEW ANNOTATION DETAILS ---------------- */
  const viewAnnotationDetails = (annotation) => {
    setSelectedAnnotation(annotation);
    setViewAnnotationModal(true);
  };

  const closeViewAnnotationModal = async () => {
    // Stop audio if playing
    if (currentPlayingId === selectedAnnotation?.id && isPlaying) {
      await stopAudio();
    }
    setViewAnnotationModal(false);
    setSelectedAnnotation(null);
  };

  /* ---------------- AUDIO RECORDING FUNCTIONS ---------------- */
  const startRecording = async () => {
    try {
      console.log('Requesting audio permissions...');

      const permission = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', permission.status);

      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required for voice annotations!');
        return;
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Starting recording...');

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer for recording duration
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      console.log('Recording started successfully');

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Failed', 'Failed to start recording: ' + err.message);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      setIsRecording(false);

      if (recording) {
        await recording.stopAndUnloadAsync();

        // Reset audio mode for playback
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const uri = recording.getURI();
        console.log('Recording saved to:', uri);
        console.log('Recording duration:', recordingDuration, 'seconds');

        setAnnotationData(prev => ({
          ...prev,
          audioUri: uri,
          audioDuration: recordingDuration,
        }));

        setRecording(null);
        console.log('Recording stopped successfully');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Recording Error', 'Failed to stop recording');
    }
  };

  /* ---------------- AUDIO PLAYBACK FUNCTIONS ---------------- */
  // const playAudio = async (audioUri, annotationId) => {
  //   try {
  //     console.log('=== PLAY AUDIO DEBUG ===');
  //     console.log('Audio URI:', audioUri);
  //     console.log('Annotation ID:', annotationId);

  //     // Check if file exists
  //     const fileInfo = await FileSystem.getInfoAsync(audioUri);
  //     console.log('File exists:', fileInfo.exists);

  //     if (!fileInfo.exists) {
  //       Alert.alert('Audio Error', 'Audio file not found');
  //       return;
  //     }

  //     // Stop any currently playing audio
  //     if (soundRef.current) {
  //       await soundRef.current.stopAsync();
  //       await soundRef.current.unloadAsync();
  //       soundRef.current = null;
  //       setIsPlaying(false);
  //     }

  //     // Set audio mode for playback
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: false,
  //       playsInSilentModeIOS: true,
  //       staysActiveInBackground: false,
  //       shouldDuckAndroid: true,
  //       playThroughEarpieceAndroid: false,
  //     });

  //     // Set loading state
  //     setCurrentPlayingId(annotationId);
  //     setIsPlaying(true);

  //     // Load the audio file
  //     const { sound } = await Audio.Sound.createAsync(
  //       { uri: audioUri },
  //       {
  //         shouldPlay: true,
  //         isLooping: false
  //       },
  //       onPlaybackStatusUpdate
  //     );

  //     soundRef.current = sound;

  //     // Play the audio
  //     await sound.playAsync();

  //   } catch (err) {
  //     console.error('=== PLAY AUDIO ERROR ===', err);
  //     console.error('Error details:', err.message);
  //     setIsPlaying(false);
  //     setCurrentPlayingId(null);
  //     Alert.alert('Playback Error', 'Failed to play audio: ' + err.message);
  //   }
  // };
/* ---------------- AUDIO PLAYBACK FUNCTIONS ---------------- */
const playAudio = async (audioUri, annotationId) => {
  try {
    console.log('=== PLAY AUDIO DEBUG ===');
    console.log('Audio URI:', audioUri);
    console.log('Annotation ID:', annotationId);

    // Skip file existence check for Cloudinary/remote URLs
    if (audioUri && audioUri.startsWith('http')) {
      console.log('Playing Cloudinary/remote audio URL');
      // Cloudinary URLs are remote, skip local file check
    } else if (audioUri) {
      // For local files only, check if they exist
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      console.log('Local file exists:', fileInfo.exists);
      
      if (!fileInfo.exists) {
        Alert.alert('Audio Error', 'Audio file not found');
        return;
      }
    } else {
      Alert.alert('Audio Error', 'No audio URL provided');
      return;
    }

    // Stop any currently playing audio
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
    }

    // Set audio mode for playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Set loading state
    setCurrentPlayingId(annotationId);
    setIsPlaying(true);

    console.log('Loading audio from URI:', audioUri);
    
    // Load the audio file - works for both local files and Cloudinary URLs
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      {
        shouldPlay: true,
        isLooping: false,
        // Additional options for better compatibility
        progressUpdateIntervalMillis: 500,
        volume: 1.0,
        rate: 1.0,
        pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
      },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;

    console.log('Audio loaded successfully, starting playback...');
    
    // Play the audio
    await sound.playAsync();

  } catch (err) {
    console.error('=== PLAY AUDIO ERROR ===', err);
    console.error('Error details:', err.message);
    setIsPlaying(false);
    setCurrentPlayingId(null);
    
    // Check for specific audio format issues
    if (err.message.includes('format') || err.message.includes('codec')) {
      Alert.alert('Playback Error', 'Audio format not supported. Try recording again.');
    } else {
      Alert.alert('Playback Error', 'Failed to play audio: ' + err.message);
    }
  }
};
  const onPlaybackStatusUpdate = (status) => {
    console.log('Playback status update:', status);

    if (status.isLoaded) {
      if (status.isPlaying) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      if (status.didJustFinish) {
        // Audio finished playing
        console.log('Playback finished');
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
      Alert.alert('Playback Error', 'Error playing audio');
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const stopAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentPlayingId(null);
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  };

  /* ---------------- AUDIO CLEANUP ---------------- */
  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
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
    } catch (err) {
      console.error('Error cleaning up audio:', err);
    }
  };

  /* ---------------- IMAGE PICKER ---------------- */
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setAnnotationData(prev => ({
          ...prev,
          imageUri: result.assets[0].uri,
        }));
      }
    } catch (err) {
      console.error('Error picking image', err);
      Alert.alert('Image Error', 'Failed to pick image');
    }
  };

  /* ---------------- SAVE ANNOTATION ---------------- */
  // const saveAnnotation = async () => {
  //   // Check if at least one type of annotation exists
  //   const hasText = annotationData.text.trim().length > 0;
  //   const hasImage = annotationData.imageUri !== null;
  //   const hasAudio = annotationData.audioUri !== null;

  //   if (!hasText && !hasImage && !hasAudio) {
  //     Alert.alert('No Content', 'Please add at least one annotation (text, image, or voice)');
  //     return;
  //   }

  //   // Clean up audio resources first
  //   await cleanupAudio();

  //   // Generate a unique ID
  //   const annotationId = `anno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  //   // Prepare annotation data
  //   const newAnnotation = {
  //     id: annotationId,
  //     x: currentPoint.x,
  //     y: currentPoint.y,
  //     text: annotationData.text.trim(),
  //     imageUri: annotationData.imageUri,
  //     audioUri: annotationData.audioUri,
  //     audioDuration: annotationData.audioDuration,
  //     versionId: selectedVersion._id,
  //     createdAt: new Date().toISOString(),
  //   };

  //   // If there's an audio file, copy it to app directory
  //   if (hasAudio && annotationData.audioUri) {
  //     try {
  //       const audioFileName = `annotation_${annotationId}.m4a`;
  //       const audioFileUri = `${FileSystem.documentDirectory}${audioFileName}`;

  //       await FileSystem.copyAsync({
  //         from: annotationData.audioUri,
  //         to: audioFileUri,
  //       });

  //       newAnnotation.audioUri = audioFileUri;
  //       console.log('Audio file saved to:', audioFileUri);
  //     } catch (err) {
  //       console.error('Error saving audio file:', err);
  //       Alert.alert('Save Error', 'Failed to save audio file');
  //       return;
  //     }
  //   }

  //   // If there's an image, copy it to app directory
  //   if (hasImage && annotationData.imageUri) {
  //     try {
  //       const imageFileName = `annotation_${annotationId}.jpg`;
  //       const imageFileUri = `${FileSystem.documentDirectory}${imageFileName}`;

  //       await FileSystem.copyAsync({
  //         from: annotationData.imageUri,
  //         to: imageFileUri,
  //       });

  //       newAnnotation.imageUri = imageFileUri;
  //       console.log('Image file saved to:', imageFileUri);
  //     } catch (err) {
  //       console.error('Error saving image file:', err);
  //       Alert.alert('Save Error', 'Failed to save image file');
  //       return;
  //     }
  //   }

  //   // Add to annotations
  //   const newAnnotations = [...annotations, newAnnotation];
  //   setAnnotations(newAnnotations);
  //   saveToHistory(newAnnotations);

  //   // Reset states
  //   setAnnotationData({
  //     text: '',
  //     imageUri: null,
  //     audioUri: null,
  //     audioDuration: 0,
  //   });

  //   setAnnotationModal(false);
  //   setCurrentPoint(null);

  //   Alert.alert('Success', 'Annotation saved successfully!');
  // };
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
          resourceType: "video", // audio = video in Cloudinary
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
    console.log('New Annotation:', newAnnotation);
    setAnnotations(newAnnotations);
    saveToHistory(newAnnotations);

    setAnnotationModal(false);
    setCurrentPoint(null);
    setAnnotationData({
      text: "",
      imageUri: null,
      audioUri: null,
      audioDuration: 0,
    });

    Alert.alert("Success", "Annotation uploaded to Cloudinary");
  };

  /* ---------------- CANCEL ANNOTATION ---------------- */
  const cancelAnnotation = async () => {
    // Stop recording if in progress
    if (isRecording) {
      await stopRecording();
    }

    // Clean up audio resources
    await cleanupAudio();

    // Reset states
    setAnnotationData({
      text: '',
      imageUri: null,
      audioUri: null,
      audioDuration: 0,
    });

    setAnnotationModal(false);
    setCurrentPoint(null);
  };

  /* ---------------- DELETE ANNOTATION ---------------- */
  const openDeleteModal = (annotation) => {
    setAnnotationToDelete(annotation);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (annotationToDelete) {
      // Stop audio if playing this annotation
      if (currentPlayingId === annotationToDelete.id) {
        await stopAudio();
      }

      // Delete associated files
      if (annotationToDelete.audioUri) {
        try {
          await FileSystem.deleteAsync(annotationToDelete.audioUri);
        } catch (err) {
          console.error('Error deleting audio file:', err);
        }
      }

      if (annotationToDelete.imageUri) {
        try {
          await FileSystem.deleteAsync(annotationToDelete.imageUri);
        } catch (err) {
          console.error('Error deleting image file:', err);
        }
      }

      const newAnnotations = annotations.filter((a) => a.id !== annotationToDelete.id);
      setAnnotations(newAnnotations);
      saveToHistory(newAnnotations);

      Alert.alert('Deleted', 'Annotation deleted successfully');
    }
    setDeleteModalVisible(false);
    setAnnotationToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setAnnotationToDelete(null);
  };

  /* ---------------- ZOOM CONTROLS ---------------- */
  const zoomIn = () => setScale((p) => Math.min(p + 0.2, 3));
  const zoomOut = () => setScale((p) => Math.max(p - 0.2, 1));
  const resetZoom = () => setScale(1);

  const versionAnnotations = annotations.filter(
    (a) => a.versionId === selectedVersion._id
  );

  /* ---------------- SAVE TO BACKEND ---------------- */
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert('Authentication Error', "User not authenticated");
        return;
      }

     
console.log("files",versionAnnotations)
      const payload = {
        documentId: document._id,
        versionId: selectedVersion._id,
        annotations: versionAnnotations.map(a => ({
          x: a.x,
          y: a.y,
          text: a.text || "",
          
          imageUri: a.imageUri || null,   // ✅ Cloudinary image URL
          audioUri: a.audioUri || null,   // ✅ Cloudinary audio URL
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

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Save failed:", data);
        Alert.alert('Save Failed', data.message || "Failed to save annotations");
        return;
      }

      console.log("✅ SAVE SUCCESS:", data);
      setHasUnsavedChanges(false);
      Alert.alert('Success', "Annotations saved successfully");
    } catch (err) {
      console.error("❌ Error saving annotations:", err);
      Alert.alert('Error', "Something went wrong");
    }
  };

  /* ---------------- FETCH ANNOTATIONS ---------------- */
  const fetchAnnotations = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const url =
        `${process.env.BASE_API_URL}` +
        `/api/plan-folders/annotations/${folderId}/` +
        `?documentId=${document._id}` +
        `&versionId=${selectedVersion._id}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Fetch failed:", data);
        return;
      }

      // Note: For production, you'd need to download files from server
      const mappedAnnotations = (data.annotations || []).map(a => ({
        id: a._id,
        x: a.x,
        y: a.y,
        text: a.text,
        imageUri: a.imageUri || null,
        audioUri: a.audioUri || null,
        audioDuration: a.audioDuration || 0,
        versionId: selectedVersion._id,
      }));

      setAnnotations(mappedAnnotations);
      setHistory([mappedAnnotations]);
      setHistoryIndex(0);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("❌ Error fetching annotations:", err);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (!selectedVersion?._id) return;
    fetchAnnotations();
  }, [selectedVersion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  /* ---------------- RENDER ANNOTATION MARKER ---------------- */
  const renderAnnotationMarker = (item) => {
    const hasText = item.text && item.text.length > 0;

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        onPress={() => viewAnnotationDetails(item)}
        onLongPress={() => openDeleteModal(item)}
        style={{
          position: 'absolute',
          left: item.x * imageLayout.width - 20,
          top: item.y * imageLayout.height - 20,
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        {/* Marker Icon - Simple red pin without badges */}
        <View className="relative">
          <Icon
            name="map-marker"
            size={40}
            color="#EF4444"  // Always red, no color coding based on content
          />

          {/* REMOVED: Small badge icons on marker */}
        </View>

        {/* SIMPLE TOOLTIP - Only shows text preview */}
        <View className="bg-black/90 px-3 py-1 rounded-lg mt-1">
          <Text className="text-white text-xs">
            {hasText ? (item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text) : 'Annotation'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", position: "relative" }}>

      {/* ---------------- HEADER ---------------- */}
      <Header
        title={`View Document: ${document.name}`}
        showBackButton
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"

      />
      {/* ---------------- SAVE BUTTON BELOW HEADER ---------------- */}
      {hasUnsavedChanges && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "#F9FAFB",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#2563EB",
              paddingVertical: 14,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="content-save" size={22} color="#fff" />
            <Text
              style={{
                color: "#fff",
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      )}



      {/* ---------------- IMAGE WITH ANNOTATIONS ---------------- */}
      <View className="flex-1 justify-center items-center px-4">
        <View
          style={{
            width: width - 32,
            maxWidth: 420,
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
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setImageLayout({ width, height });
              }}
            >
              {imageLoading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: '45%',
                    left: '45%',
                    zIndex: 10,
                  }}
                  size="large"
                  color="#0066FF"
                />
              )}

              <View style={{ flex: 1, transform: [{ scale }] }}>
                <Image
                  source={{ uri: selectedVersion.image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    Alert.alert('Image Error', 'Failed to load document image');
                  }}
                />

                {/* ANNOTATIONS */}
                {versionAnnotations.map(renderAnnotationMarker)}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Text className="mt-3 text-gray-600">
          Version {selectedVersion.versionNumber}
          {hasUnsavedChanges && <Text className="text-red-500"> • Unsaved changes</Text>}
        </Text>

        {annotationMode && (
          <View className="mt-2 flex-row items-center">
            <Icon name="map-marker-plus" size={16} color="#0066FF" />
            <Text className="text-blue-600 ml-1 text-sm">
              Tap on the image to add an annotation (text, voice, or image)
            </Text>
          </View>
        )}
      </View>

      {/* ---------------- BOTTOM ACTION PANEL ---------------- */}
      <View className="flex-row justify-around items-center bg-white py-3 border-t">
        <ActionButton icon="undo" onPress={undo} disabled={!canUndo} />
        <ActionButton icon="redo" onPress={redo} disabled={!canRedo} />

        <ActionButton icon="plus" onPress={zoomIn} />
        <ActionButton icon="minus" onPress={zoomOut} />
        <ActionButton icon="crop-free" onPress={resetZoom} />

        <ActionButton
          icon="map-marker-plus"
          active={annotationMode}
          onPress={() => setAnnotationMode((p) => !p)}
        />
      </View>

      {/* ---------------- CHANGE VERSION ---------------- */}
      <View className="p-4 bg-white border-t">
        <TouchableOpacity
          onPress={() => setVersionModalVisible(true)}
          className="bg-blue-600 py-3 rounded-xl flex-row justify-center"
        >
          <Icon name="layers-outline" size={18} color="#fff" />
          <Text className="text-white ml-2 font-semibold">Change Version</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- ANNOTATION CREATION MODAL ---------------- */}
      <Modal
        transparent
        visible={annotationModal}
        animationType="fade"
        onRequestClose={cancelAnnotation}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <ScrollView className="max-h-[80%]" keyboardShouldPersistTaps="handled">
            <View className="bg-white rounded-xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">Add Annotation</Text>
                <TouchableOpacity onPress={cancelAnnotation}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Text Input Section */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Text Note</Text>
                <TextInput
                  value={annotationData.text}
                  onChangeText={(text) => setAnnotationData(prev => ({ ...prev, text }))}
                  placeholder="Enter your annotation text..."
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Voice Recording Section */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Voice Note</Text>
                <View className="flex-row items-center justify-between">
                  {annotationData.audioUri ? (
                    <View className="flex-1 flex-row items-center bg-green-50 p-3 rounded-lg">
                      <Icon name="check-circle" size={20} color="#10B981" />
                      <Text className="text-green-600 ml-2">
                        Recorded ({annotationData.audioDuration}s)
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (currentPlayingId === 'new' && isPlaying) {
                            stopAudio();
                          } else {
                            playAudio(annotationData.audioUri, 'new');
                          }
                        }}
                        className="ml-auto bg-green-100 p-2 rounded-full"
                      >
                        <Icon
                          name={currentPlayingId === 'new' && isPlaying ? "pause" : "play"}
                          size={20}
                          color="#10B981"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setAnnotationData(prev => ({ ...prev, audioUri: null, audioDuration: 0 }))}
                        className="ml-2 bg-red-100 p-2 rounded-full"
                      >
                        <Icon name="delete" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : isRecording ? (
                    <View className="flex-1 flex-row items-center bg-red-50 p-3 rounded-lg">
                      <View className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <Text className="text-red-600 ml-2 font-medium">
                        Recording... {recordingDuration}s
                      </Text>
                      <TouchableOpacity
                        onPress={stopRecording}
                        className="ml-auto bg-red-100 p-2 rounded-full"
                      >
                        <Icon name="stop" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={startRecording}
                      className="flex-1 flex-row items-center bg-blue-50 p-3 rounded-lg"
                    >
                      <Icon name="microphone" size={20} color="#3B82F6" />
                      <Text className="text-blue-600 ml-2 font-medium">Record Voice Note</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Image Upload Section */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Image Attachment</Text>
                {annotationData.imageUri ? (
                  <View className="relative">
                    <Image
                      source={{ uri: annotationData.imageUri }}
                      className="w-full h-48 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setAnnotationData(prev => ({ ...prev, imageUri: null }))}
                      className="absolute top-2 right-2 bg-black/70 p-2 rounded-full"
                    >
                      <Icon name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
                  >
                    <Icon name="image-plus" size={40} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2 font-medium">Tap to add an image</Text>
                    <Text className="text-gray-400 text-sm">Supports JPG, PNG</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={cancelAnnotation}
                  className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
                >
                  <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={saveAnnotation}
                  disabled={!annotationData.text && !annotationData.imageUri && !annotationData.audioUri}
                  className={`py-3 rounded-lg flex-1 ml-2 ${annotationData.text || annotationData.imageUri || annotationData.audioUri
                      ? 'bg-blue-600'
                      : 'bg-blue-300'
                    }`}
                >
                  <Text className="text-white text-center font-semibold">Save Annotation</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ---------------- VIEW ANNOTATION DETAILS MODAL ---------------- */}
      <Modal
        transparent
        visible={viewAnnotationModal}
        animationType="fade"
        onRequestClose={closeViewAnnotationModal}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <ScrollView className="max-h-[85%]" keyboardShouldPersistTaps="handled">
            <View className="bg-white rounded-xl p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">Annotation Details</Text>
                <TouchableOpacity onPress={closeViewAnnotationModal}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedAnnotation && (
                <>
                  {/* Text Content */}
                  {selectedAnnotation.text && selectedAnnotation.text.length > 0 && (
                    <View className="mb-5">
                      <Text className="text-gray-700 font-medium mb-2">Text Note</Text>
                      <View className="bg-blue-50 p-4 rounded-lg">
                        <Text className="text-gray-800 text-base">{selectedAnnotation.text}</Text>
                      </View>
                    </View>
                  )}

                  {/* Audio Content */}
                  {selectedAnnotation.audioUri && (
                    <View className="mb-5">
                      <Text className="text-gray-700 font-medium mb-2">Voice Note</Text>
                      <View className="bg-green-50 p-4 rounded-lg">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Icon
                              name="microphone"
                              size={24}
                              color="#10B981"
                            />
                            <Text className="text-green-700 ml-3 font-medium">
                              Audio Recording ({selectedAnnotation.audioDuration}s)
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              if (currentPlayingId === selectedAnnotation.id && isPlaying) {
                                stopAudio();
                              } else {
                                playAudio(selectedAnnotation.audioUri, selectedAnnotation.id);
                              }
                            }}
                            className="bg-green-100 p-3 rounded-full"
                          >
                            <Icon
                              name={currentPlayingId === selectedAnnotation.id && isPlaying ? "pause" : "play"}
                              size={22}
                              color="#10B981"
                            />
                          </TouchableOpacity>
                        </View>
                        {currentPlayingId === selectedAnnotation.id && isPlaying && (
                          <View className="flex-row items-center mt-3">
                            <View className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                            <Text className="text-green-600 text-sm">Playing audio...</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Image Content */}
                  {selectedAnnotation.imageUri && (
                    <View className="mb-5">
                      <Text className="text-gray-700 font-medium mb-2">Image Attachment</Text>
                      <View className="bg-red-50 p-4 rounded-lg">
                        <Image
                          source={{ uri: selectedAnnotation.imageUri }}
                          className="w-full h-64 rounded-lg mb-3"
                          resizeMode="contain"
                        />
                        <Text className="text-red-700 text-sm italic">
                          Image attached to annotation
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* REMOVED: Annotation Information Section */}

                  {/* Action Buttons */}
                  <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                      onPress={closeViewAnnotationModal}
                      className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
                    >
                      <Text className="text-gray-800 text-center font-semibold">Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        closeViewAnnotationModal();
                        openDeleteModal(selectedAnnotation);
                      }}
                      className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
                    >
                      <Text className="text-white text-center font-semibold">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ---------------- VERSION MODAL ---------------- */}
      <Modal
        transparent
        visible={versionModalVisible}
        animationType="slide"
        onRequestClose={() => setVersionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVersionModalVisible(false)}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-4 max-h-[80%]">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold">Select Version</Text>
                  <TouchableOpacity onPress={() => setVersionModalVisible(false)}>
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={document.versions}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedVersion(item);
                        setScale(1);
                        setVersionModalVisible(false);
                      }}
                      className={`p-4 rounded-xl mb-2 flex-row items-center ${selectedVersion._id === item._id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-100'
                        }`}
                    >
                      <Icon name="file-document-outline" size={20} color="#0066FF" />
                      <Text className="ml-3 font-medium">Version {item.versionNumber}</Text>
                      {selectedVersion._id === item._id && (
                        <Icon name="check-circle" size={20} color="#0066FF" className="ml-auto" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ---------------- DELETE CONFIRMATION MODAL ---------------- */}
      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-xl p-5">
            <Text className="text-lg font-semibold text-center mb-4">
              Delete Annotation?
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              This will permanently delete all associated content (text, voice, image).
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={cancelDelete}
                className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ---------------- ACTION BUTTON COMPONENT ---------------- */
const ActionButton = ({ icon, onPress, active, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`w-12 h-12 rounded-full items-center justify-center ${active ? 'bg-blue-600' : disabled ? 'bg-gray-200' : 'bg-gray-100'
      }`}
  >
    <Icon
      name={icon}
      size={22}
      color={active ? '#fff' : disabled ? '#aaa' : '#333'}
    />
  </TouchableOpacity>
);

export default ViewDocument;