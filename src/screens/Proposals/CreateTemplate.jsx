
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Modal,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

// BOQ Bottom Sheet Component
const BoqBottomSheet = React.memo(({
  visible,
  onClose,
  boqData,
  boqIndex,
  onSave,
  onDelete,
  isSubmitting
}) => {
  const [localBoq, setLocalBoq] = useState(boqData || {
    boqName: '',
    builtUpArea: 0,
    structuralType: '',
    foundationType: '',
    boqVersion: [{
      versionNumber: 1,
      createdAt: new Date().toISOString(),
      materials: [],
      status: 'draft',
      rejectionReason: '',
      laborCost: 0,
      totalMaterialCost: 0,
      totalCost: 0
    }],
    status: 'draft'
  });

  const [materialInput, setMaterialInput] = useState({
    name: '',
    qty: '',
    unit: '',
    rate: ''
  });

  const slideAnim = useRef(new Animated.Value(500)).current;
  const version = localBoq.boqVersion?.[0] || {};

  useEffect(() => {
    if (visible) {
      if (boqData) {
        setLocalBoq(boqData);
      }
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 12,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [visible, boqData]);

  const handleClose = () => {
    Animated.spring(slideAnim, {
      toValue: 500,
      useNativeDriver: true,
      tension: 50,
      friction: 12,
    }).start(() => onClose());
  };

  const updateLocalBoq = (field, value) => {
    if (field === 'builtUpArea' || field === 'laborCost') {
      setLocalBoq(prev => {
        const updated = { ...prev };
        if (field === 'laborCost') {
          updated.boqVersion[0][field] = Number(value) || 0;
        } else {
          updated[field] = Number(value) || 0;
        }
        calculateTotals(updated);
        return updated;
      });
    } else {
      setLocalBoq(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateTotals = (boq) => {
    const version = boq.boqVersion[0];
    let materialTotal = 0;
    (version.materials || []).forEach(material => {
      material.amount = material.qty * material.rate;
      materialTotal += material.amount;
    });
    version.totalMaterialCost = materialTotal;
    version.totalCost = materialTotal + version.laborCost;
    return boq;
  };

  const addMaterial = () => {
    if (!materialInput.name?.trim() || !materialInput.qty?.trim() ||
      !materialInput.unit?.trim() || !materialInput.rate?.trim()) {
      Alert.alert('Validation', 'Please fill all material fields');
      return;
    }

    const qty = Number(materialInput.qty);
    const rate = Number(materialInput.rate);

    if (qty <= 0 || rate <= 0) {
      Alert.alert('Validation', 'Quantity and Rate must be greater than 0');
      return;
    }

    const newMaterial = {
      name: materialInput.name.trim(),
      qty,
      unit: materialInput.unit.trim(),
      rate,
      amount: qty * rate
    };

    setLocalBoq(prev => {
      const updated = { ...prev };
      updated.boqVersion[0].materials = [
        ...(updated.boqVersion[0].materials || []),
        newMaterial
      ];
      return calculateTotals(updated);
    });

    setMaterialInput({ name: '', qty: '', unit: '', rate: '' });
  };

  const removeMaterial = (index) => {
    setLocalBoq(prev => {
      const updated = { ...prev };
      updated.boqVersion[0].materials =
        (updated.boqVersion[0].materials || []).filter((_, i) => i !== index);
      return calculateTotals(updated);
    });
  };

  const handleSave = () => {
    if (!localBoq.boqName?.trim()) {
      Alert.alert('Validation', 'BOQ Name is required');
      return;
    }
    if (!localBoq.builtUpArea || localBoq.builtUpArea <= 0) {
      Alert.alert('Validation', 'Built Up Area is required and must be positive');
      return;
    }
    if (!localBoq.structuralType?.trim()) {
      Alert.alert('Validation', 'Structural Type is required');
      return;
    }
    if (!localBoq.foundationType?.trim()) {
      Alert.alert('Validation', 'Foundation Type is required');
      return;
    }
    if ((version.materials || []).length === 0) {
      Alert.alert('Validation', 'At least one material is required');
      return;
    }
    if (version.laborCost < 0) {
      Alert.alert('Validation', 'Labor Cost must be non-negative');
      return;
    }

    onSave(localBoq, boqIndex);
    handleClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete BOQ',
      'Are you sure you want to delete this BOQ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(boqIndex);
            handleClose();
          }
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90%] shadow-lg"
          style={{ transform: [{ translateY: slideAnim }] }}
        >
          {/* Header */}
          <View className="pt-3 pb-4 px-5 border-b border-gray-200">
            <View className="w-10 h-1 bg-gray-300 rounded self-center mb-4" />
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-black">
                {boqIndex !== null ? `Edit BOQ ${boqIndex + 1}` : 'Add New BOQ'}
              </Text>
              {boqIndex !== null && (
                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isSubmitting}
                  className="p-1.5"
                >
                  <Feather name="trash-2" size={20} color="#FF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            className="px-5 py-4 max-h-[75%]"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* BOQ General Fields */}
            <View className="mb-4">
              <Text className="font-semibold text-sm text-black mb-2">BOQ Name *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border border-gray-300"
                placeholder="Enter BOQ name"
                placeholderTextColor="#999999"
                value={localBoq.boqName || ''}
                onChangeText={(v) => updateLocalBoq('boqName', v)}
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold text-sm text-black mb-2">Built Up Area (sq ft) *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border border-gray-300"
                placeholder="e.g., 1000"
                placeholderTextColor="#999999"
                value={String(localBoq.builtUpArea || '')}
                onChangeText={(v) => updateLocalBoq('builtUpArea', v)}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold text-sm text-black mb-2">Structural Type *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border border-gray-300"
                placeholder="e.g., RCC, Steel"
                placeholderTextColor="#999999"
                value={localBoq.structuralType || ''}
                onChangeText={(v) => updateLocalBoq('structuralType', v)}
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold text-sm text-black mb-2">Foundation Type *</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border border-gray-300"
                placeholder="e.g., Isolated, Raft"
                placeholderTextColor="#999999"
                value={localBoq.foundationType || ''}
                onChangeText={(v) => updateLocalBoq('foundationType', v)}
                editable={!isSubmitting}
              />
            </View>

            {/* Add Material Form */}
            <View className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
              <Text className="font-semibold text-base text-black mb-3">Add New Material</Text>

              <TextInput
                className="bg-white rounded-lg px-3 py-2.5 mb-2 font-regular text-sm text-black border border-gray-300"
                placeholder="Material Name"
                placeholderTextColor="#999999"
                value={materialInput.name}
                onChangeText={(v) => setMaterialInput(prev => ({ ...prev, name: v }))}
                editable={!isSubmitting}
              />

              <View className="flex-row justify-between">
                <TextInput
                  className="bg-white rounded-lg px-3 py-2.5 flex-1 mx-0.5 font-regular text-sm text-black border border-gray-300"
                  placeholder="Quantity"
                  placeholderTextColor="#999999"
                  value={materialInput.qty}
                  onChangeText={(v) => setMaterialInput(prev => ({ ...prev, qty: v }))}
                  editable={!isSubmitting}
                  keyboardType="numeric"
                />
                <TextInput
                  className="bg-white rounded-lg px-3 py-2.5 flex-1 mx-0.5 font-regular text-sm text-black border border-gray-300"
                  placeholder="Unit"
                  placeholderTextColor="#999999"
                  value={materialInput.unit}
                  onChangeText={(v) => setMaterialInput(prev => ({ ...prev, unit: v }))}
                  editable={!isSubmitting}
                />
                <TextInput
                  className="bg-white rounded-lg px-3 py-2.5 flex-1 mx-0.5 font-regular text-sm text-black border border-gray-300"
                  placeholder="Rate (₹)"
                  placeholderTextColor="#999999"
                  value={materialInput.rate}
                  onChangeText={(v) => setMaterialInput(prev => ({ ...prev, rate: v }))}
                  editable={!isSubmitting}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                onPress={addMaterial}
                className="bg-blue-600 rounded-lg py-3 flex-row items-center justify-center mt-2"
                disabled={isSubmitting}
              >
                <Feather name="plus" size={18} color="white" className="mr-1.5" />
                <Text className="font-semibold text-sm text-white">Add Material</Text>
              </TouchableOpacity>
            </View>

            {/* Materials List */}
            {(version.materials || []).length > 0 ? (
              <View className="mb-5">
                <Text className="font-semibold text-base text-black mb-3">
                  Materials ({(version.materials || []).length})
                </Text>

                {(version.materials || []).map((item, index) => (
                  <View key={index} className="flex-row justify-between items-center bg-white rounded-lg p-3 mb-2 border border-gray-100">
                    <View className="flex-1">
                      <Text className="font-semibold text-sm text-black mb-1">{item.name}</Text>
                      <Text className="font-regular text-xs text-gray-600">
                        {item.qty} {item.unit} @ ₹{item.rate}/unit
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="font-medium text-sm text-blue-600 mr-3">
                        ₹{item.amount?.toFixed(2) || '0.00'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeMaterial(index)}
                        disabled={isSubmitting}
                        className="p-1"
                      >
                        <Feather name="trash-2" size={16} color="#FF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center p-7 bg-blue-50 rounded-xl border border-gray-300 border-dashed mb-5">
                <Feather name="package" size={32} color="#CCCCCC" />
                <Text className="font-medium text-sm text-gray-600 mt-2">No materials added yet</Text>
                <Text className="font-regular text-xs text-gray-500 mt-1 text-center">
                  Add materials to calculate the total cost
                </Text>
              </View>
            )}

            {/* Labor Cost */}
            <View className="mb-4">
              <Text className="font-semibold text-sm text-black mb-2">Labor Cost (₹)</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border border-gray-300"
                placeholder="Enter labor cost"
                placeholderTextColor="#999999"
                value={String(version.laborCost || '')}
                onChangeText={(v) => updateLocalBoq('laborCost', v)}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
            </View>

            {/* Totals */}
            <View className="bg-blue-100 rounded-xl p-4 mb-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-regular text-sm text-gray-600">Material Cost:</Text>
                <Text className="font-medium text-sm text-black">
                  ₹{version.totalMaterialCost?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-regular text-sm text-gray-600">Labor Cost:</Text>
                <Text className="font-medium text-sm text-black">
                  ₹{version.laborCost?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-blue-300">
                <Text className="font-semibold text-base text-black">Total Cost:</Text>
                <Text className="font-bold text-lg text-blue-600">
                  ₹{version.totalCost?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center mx-1.5"
              disabled={isSubmitting}
            >
              <Text className="font-semibold text-sm text-gray-600">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-blue-600 rounded-xl py-3.5 items-center mx-1.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-sm text-white">
                  {boqIndex !== null ? 'Update BOQ' : 'Add BOQ'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

// Project Plan Bottom Sheet Component
const ProjectPlanBottomSheet = React.memo(({
  visible,
  onClose,
  planData,
  onSave,
  isSubmitting
}) => {
  const [folders, setFolders] = useState([

  ]);

  const [allDocuments, setAllDocuments] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState('Project Plans');

  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedParentFolder, setSelectedParentFolder] = useState(null);

  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedFolderForDocument, setSelectedFolderForDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 12,
      }).start();

      // Load saved data if exists
      if (planData) {
        setFolders(planData.folders || []);
        setAllDocuments(planData.documents || []);
      }
    } else {
      slideAnim.setValue(500);
    }
  }, [visible, planData]);

  const handleClose = () => {
    Animated.spring(slideAnim, {
      toValue: 500,
      useNativeDriver: true,
      tension: 50,
      friction: 12,
    }).start(() => onClose());
  };

  const handleSavePlan = () => {
    const planData = {
      folders,
      documents: allDocuments,
      lastUpdated: new Date().toISOString()
    };
    onSave(planData);
    handleClose();
  };

  const getFolderDocumentCount = (folderId) => {
    return allDocuments.filter(doc => doc.folderId === folderId).length;
  };

  const openFolder = (folder) => {
    if (currentFolderId === folder._id) return;
    setCurrentFolderId(folder._id);
    setCurrentFolderName(folder.name);
  };

  const goBack = () => {
    if (currentFolderId) {
      const currentFolder = folders.find(f => f._id === currentFolderId);
      if (currentFolder) {
        setCurrentFolderId(currentFolder.parentFolder);
        const parentFolder = folders.find(f => f._id === currentFolder.parentFolder);
        setCurrentFolderName(parentFolder ? parentFolder.name : 'Project Plans');
      } else {
        setCurrentFolderId(null);
        setCurrentFolderName('Project Plans');
      }
    }
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Folder name is required');
      return;
    }

    const newFolder = {
      _id: `folder_${Date.now()}`,
      name: folderName,
      description: '',
      planDocuments: [],
      parentFolder: selectedParentFolder || currentFolderId,
      createdAt: new Date().toISOString()
    };

    setFolders(prev => [...prev, newFolder]);
    setFolderName('');
    setFolderModalVisible(false);
    Alert.alert('Success', 'Folder created successfully');
  };





  // Generate Cloudinary signature - Shared function
  const generateSignature = async (timestamp) => {
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
  };
  // const uploadPlanFileToCloudinary = async (file) => {
  //   try {
  //     console.log("📤 Uploading plan file to Cloudinary:", file);

  //     const timestamp = Math.round(Date.now() / 1000);
  //     const signature = await generateSignature(timestamp);

  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: file.uri,
  //       type: file.type,
  //       name: file.name || `file_${Date.now()}`,
  //     });
  //     formData.append('timestamp', timestamp.toString());
  //     formData.append('signature', signature);
  //     formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  //     formData.append('upload_preset', 'ml_default'); // Add this line
  //     formData.append('resource_type', 'auto');

  //     const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`;

  //     console.log("📤 Upload URL:", uploadUrl);

  //     const response = await fetch(uploadUrl, {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const responseData = await response.json();

  //     if (response.ok && responseData.secure_url) {
  //       console.log("✅ File uploaded successfully:", responseData.secure_url);
  //       return {
  //         success: true,
  //         url: responseData.secure_url,
  //         publicId: responseData.public_id,
  //         fileType: responseData.resource_type,
  //         format: responseData.format,
  //       };
  //     } else {
  //       console.error("❌ Upload failed:", responseData);
  //       return {
  //         success: false,
  //         error: responseData.error?.message || 'Upload failed',
  //         details: responseData,
  //       };
  //     }
  //   } catch (error) {
  //     console.error("❌ Upload error:", error);
  //     return {
  //       success: false,
  //       error: error.message || String(error),
  //     };
  //   }
  // };

  const uploadPlanFileToCloudinary = async (imageUri) => {
    try {
      console.log("📤 Starting upload for file:", imageUri);

      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const form = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      // Use more generic type handling or specific mime types if known
      // For react-native formData, usually 'image/jpeg' or specific mime works, 
      // but strictly for docs, 'application/pdf' etc might be needed.
      // However, usually just name and uri is enough for some RN FormData polyfills, 
      // but let's try to be as specific as possible if we can, or fallback to application/octet-stream
      let type = 'application/octet-stream';
      if (match) {
        const ext = match[1].toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = `image/${ext}`;
        else if (ext === 'pdf') type = 'application/pdf';
        else if (['doc', 'docx'].includes(ext)) type = 'application/msword';
      }

      form.append('file', {
        uri: imageUri,
        type,
        name: filename || `file_${Date.now()}`,
      });
      form.append('timestamp', timestamp.toString());
      form.append('signature', signature);
      form.append('api_key', CLOUDINARY_CONFIG.apiKey);

      // Use auto resource type to support pdfs, docs, images, etc.
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;
      console.log("Uploading to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return { success: false, error: 'Invalid Cloudinary response', details: text };
      }

      if (response.ok && data.secure_url) {
        return { success: true, url: data.secure_url, publicId: data.public_id };
      } else {
        return { success: false, error: data.error?.message || `Status ${response.status}`, details: data };
      }
    } catch (err) {
      return { success: false, error: err.message || String(err) };
    } finally {
      setUploading(false);
    }
  };
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    if (!documentName.trim()) {
      Alert.alert('Error', 'Please enter a document name');
      return;
    }

    setUploading(true);

    const result = await uploadPlanFileToCloudinary(selectedFile.uri);
console.log("🚀 ~ handleUploadDocument ~ result:", result)
    if (result.success) {
      const newDocument = {
        _id: `doc_${Date.now()}`,
        name: documentName,
        fileName: selectedFile.name || 'Unknown file',
        fileType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size || 0,
        folderId: selectedFolderForDocument || currentFolderId || null,
        uploadDate: new Date().toISOString(),
        fileUrl: result.url,                    // ← Important: save the URL
        thumbnail: selectedFile.type.startsWith('image/') ? selectedFile.uri : null,
      };

      setAllDocuments(prev => [...prev, newDocument]);

      // Update folder's planDocuments
      const targetFolderId = selectedFolderForDocument || currentFolderId;
      if (targetFolderId) {
        setFolders(prev => prev.map(folder =>
          folder._id === targetFolderId
            ? { ...folder, planDocuments: [...(folder.planDocuments || []), newDocument._id] }
            : folder
        ));
      }

      Alert.alert('Success', 'Document uploaded successfully!');
    } else {
      Alert.alert('Upload Failed', result.error || 'Unknown error occurred');
    }

    // Reset form
    setSelectedFile(null);
    setDocumentName('');
    setSelectedFolderForDocument(null);
    setDocumentModalVisible(false);
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return 'image';
    if (fileType?.includes('pdf')) return 'file-pdf-box';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'file-word-box';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return 'file-excel-box';
    if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return 'file-powerpoint-box';
    return 'file';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90%] shadow-lg"
          style={{ transform: [{ translateY: slideAnim }] }}
        >
          {/* Header */}
          <View className="pt-3 pb-4 px-5 border-b border-gray-200">
            <View className="w-10 h-1 bg-gray-300 rounded self-center mb-4" />
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg text-black">Project Plan Files</Text>
              <TouchableOpacity
                onPress={handleClose}
                className="p-1.5"
              >
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="px-5 py-4 max-h-[70%]"
            showsVerticalScrollIndicator={false}
          >
            {/* Breadcrumb */}
            <View className="flex-row items-center mb-4">
              <TouchableOpacity onPress={goBack} className="p-2">
                <Feather name="arrow-left" size={20} color="#2563EB" />
              </TouchableOpacity>
              <Text className="ml-2 text-gray-700 font-medium">
                {currentFolderName}
              </Text>
            </View>

            {/* Folders List */}
            <View className="gap-3">
              {folders
                .filter(folder => folder.parentFolder === currentFolderId)
                .map((folder) => (
                  <TouchableOpacity
                    key={folder._id}
                    className="flex-row justify-between items-center bg-white rounded-xl px-4 py-4 border border-gray-200"
                    onPress={() => openFolder(folder)}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <Feather name="folder" size={24} color="#2563EB" />
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {folder.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {getFolderDocumentCount(folder._id)} files • Created {new Date(folder.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}

              {/* Documents List */}
              {allDocuments
                .filter(doc => doc.folderId === currentFolderId)
                .map((document) => (
                  <View
                    key={document._id}
                    className="flex-row justify-between items-center bg-white rounded-xl px-4 py-4 mt-2 border border-gray-200"
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <Feather name={getFileIcon(document.fileType)} size={24} color="#EF4444" />
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {document.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {document.fileName} • {formatFileSize(document.fileSize)}
                        </Text>
                      </View>
                    </View>
                    {document.thumbnail && (
                      <Image
                        source={{ uri: document.thumbnail }}
                        className="w-12 h-12 rounded-lg ml-2"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                ))}

              {/* Empty State */}
              {folders.filter(folder => folder.parentFolder === currentFolderId).length === 0 &&
                allDocuments.filter(doc => doc.folderId === currentFolderId).length === 0 && (
                  <View className="items-center mt-10 p-6 bg-gray-50 rounded-xl">
                    <Feather name="folder" size={48} color="#D1D5DB" />
                    <Text className="text-lg text-gray-400 mt-4">
                      {currentFolderId ? 'This folder is empty' : 'No folders or documents'}
                    </Text>
                    <Text className="text-sm text-gray-400 mt-2 text-center">
                      {currentFolderId
                        ? 'Add folders or upload documents to get started'
                        : 'Create folders to organize your project plans'
                      }
                    </Text>
                  </View>
                )}
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View className="flex-row px-5 py-4 border-t border-gray-200 gap-3">
            <TouchableOpacity
              onPress={() => setFolderModalVisible(true)}
              className="flex-1 bg-blue-500 py-3 rounded-xl items-center justify-center flex-row"
            >
              <Feather name="folder-plus" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Add Folder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDocumentModalVisible(true)}
              className="flex-1 bg-green-500 py-3 rounded-xl items-center justify-center flex-row"
            >
              <Feather name="upload" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Upload File</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Save Button */}
          <View className="px-5 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleSavePlan}
              className="bg-blue-600 rounded-xl py-3.5 items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-sm text-white">
                  Save Project Plan
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Add Folder Modal */}
        <Modal
          visible={folderModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFolderModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-900">
                  Add Folder
                </Text>
                <TouchableOpacity
                  onPress={() => setFolderModalVisible(false)}
                  className="p-2"
                >
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="px-6 mt-5">
                <Text className="text-sm text-gray-500 mb-2">
                  Folder Name
                </Text>
                <TextInput
                  value={folderName}
                  onChangeText={setFolderName}
                  className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                  placeholder="Enter folder name"
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />
              </View>

              <TouchableOpacity
                onPress={handleCreateFolder}
                disabled={!folderName.trim()}
                className={`mx-6 mt-8 mb-8 py-4 rounded-xl items-center ${folderName.trim() ? 'bg-blue-500' : 'bg-blue-300'
                  }`}
              >
                <Text className="text-white text-base font-semibold">
                  Create Folder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Document Modal */}
        <Modal
          visible={documentModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDocumentModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl max-h-[90%]">
              <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-900">
                  Upload Document
                </Text>
                <TouchableOpacity
                  onPress={() => setDocumentModalVisible(false)}
                  className="p-2"
                >
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <View className="mt-5">
                  <Text className="text-sm text-gray-500 mb-2">
                    Document Name
                  </Text>
                  <TextInput
                    value={documentName}
                    onChangeText={setDocumentName}
                    className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                    placeholder="Enter document name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View className="mt-5">
                  <Text className="text-sm text-gray-500 mb-2">
                    Select File
                  </Text>

                  <TouchableOpacity
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: false,
                        quality: 1,
                      });

                      if (!result.canceled && result.assets[0]) {
                        const asset = result.assets[0];
                        setSelectedFile({
                          uri: asset.uri,
                          name: asset.fileName || `file_${Date.now()}`,
                          type: asset.type || 'image/jpeg',
                          size: asset.fileSize || 0
                        });
                      }
                    }}
                    className="bg-gray-100 border border-gray-300 rounded-xl p-4 items-center"
                  >
                    <Feather name="upload" size={32} color="#4B5563" />
                    <Text className="text-gray-700 font-medium mt-2">
                      Select File
                    </Text>
                    <Text className="text-gray-500 text-sm text-center mt-1">
                      Choose any file from your device
                    </Text>
                  </TouchableOpacity>

                  {selectedFile && (
                    <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <View className="flex-row items-center">
                        <Feather name="file" size={24} color="#2563EB" />
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-gray-900">
                            {selectedFile.name}
                          </Text>
                          <Text className="text-sm text-gray-600 mt-1">
                            {formatFileSize(selectedFile.size)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSelectedFile(null)}
                          className="p-2"
                        >
                          <Feather name="x-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleUploadDocument}
                  disabled={!selectedFile || !documentName.trim() || uploading}
                  className={`mt-8 mb-8 py-4 rounded-xl items-center ${selectedFile && documentName.trim() && !uploading
                      ? 'bg-blue-500'
                      : 'bg-blue-300'
                    }`}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-base font-semibold">
                      Upload Document
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
});

const CreateTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();

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

    createdAt: new Date().toISOString().split('T')[0]
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Bottom sheet states
  const [showBoqSheet, setShowBoqSheet] = useState(false);
  const [editingBoqIndex, setEditingBoqIndex] = useState(null);
  const [editingBoqData, setEditingBoqData] = useState(null);

  const [showPlanSheet, setShowPlanSheet] = useState(false);

  // Check if edit mode
  const isEditMode = mode === 'edit';

  // Helper functions
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

  const ensureBoqsStructure = (boqsData) => {
    if (!Array.isArray(boqsData)) return [];
    return boqsData.map(ensureBoqStructure);
  };

  // Initialize component
  useEffect(() => {
    console.log("🔄 Initializing CreateTemplate...");

    const routeParams = route.params || {};
    const routeSurveyData = routeParams.siteSurveyData;
    const routeFormData = routeParams.formData;
    const routeMode = routeParams.mode;
    const routeInitialData = routeParams.initialData;

    const finalMode = routeMode || mode || 'create';
    const finalInitialData = routeInitialData || initialData;
    const finalSurveyData = routeSurveyData || surveyData;
    const finalFormData = routeFormData || templateFormData;

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

    let initialFormData = { ...formData };

    if (finalMode === 'edit' && finalInitialData) {
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

        createdAt: finalInitialData.createdAt || formData.createdAt
      };

      if (finalInitialData.image) {
        setSelectedImage({ uri: finalInitialData.image });
        setUploadProgress(100);
      }
    } else if (finalFormData) {
      initialFormData = { ...formData, ...finalFormData };
      initialFormData.boqs = ensureBoqsStructure(finalFormData.boqs || (finalFormData.boq ? [finalFormData.boq] : []));
      initialFormData.planData = finalFormData.planData || formData.planData;

      if (finalFormData.image) {
        setSelectedImage({ uri: finalFormData.image });
        setUploadProgress(100);
      }
    }

    if (finalSurveyData) {
      initialFormData.siteSurvey = finalSurveyData;
    }

    setFormData(initialFormData);

    if (finalFormData || finalSurveyData) {
      setLastSaved('Just now');
    }

  }, [route.params]);

  // Auto-save form data
  const debouncedSave = useCallback(
    debounce(async (data) => {
      if (!data.projectTypeName && !data.category) {
        return;
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

  useEffect(() => {
    debouncedSave(formData);

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
        setTemplateFormData(updatedFormData);
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
    setTemplateFormData(updatedFormData);
    setUploadProgress(0);
  };

  // BOQ Bottom Sheet Functions
  const openBoqSheet = (index = null) => {
    if (index !== null) {
      setEditingBoqIndex(index);
      setEditingBoqData(formData.boqs[index]);
    } else {
      setEditingBoqIndex(null);
      setEditingBoqData(null);
    }
    setShowBoqSheet(true);
  };

  const closeBoqSheet = () => {
    setShowBoqSheet(false);
    setEditingBoqIndex(null);
    setEditingBoqData(null);
  };

  const handleSaveBoq = (boqData, index) => {
    const updatedBoqs = [...formData.boqs];

    if (index !== null) {
      updatedBoqs[index] = boqData;
    } else {
      const versionNumber = updatedBoqs.length + 1;
      const newBoq = {
        ...boqData,
        boqVersion: [{
          ...boqData.boqVersion[0],
          versionNumber
        }]
      };
      updatedBoqs.push(newBoq);
    }

    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
  };

  const handleDeleteBoq = (index) => {
    const updatedBoqs = formData.boqs.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, boqs: updatedBoqs };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
  };

  // Project Plan Functions
  const openPlanSheet = () => {
    setShowPlanSheet(true);
  };

  const closePlanSheet = () => {
    setShowPlanSheet(false);
  };

  const handleSavePlan = (planData) => {
    const updatedFormData = { ...formData, planData };
    setFormData(updatedFormData);
    setTemplateFormData(updatedFormData);
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
            versionNumber: 1,
            createdAt: version.createdAt || new Date().toISOString(),
            materials: version.materials || [],
            status: version.status || 'draft',
            contractorApproval:"approved",
            rejectionReason: version.rejectionReason || '',
            laborCost: Number(version.laborCost) || 0,
            totalMaterialCost: Number(version.totalMaterialCost) || 0,
            totalCost: Number(version.totalCost) || 0
          })),
          status: boq.status || 'draft'
        })),
        siteSurvey: surveyData,
        planData: formData.planData,

      };
console.log("📥 Preparing to submit the following data:\n", JSON.stringify(requestData, null, 2));

      const transformPlanDataForBackend = (planData) => {


        const { folders = [], documents = [] } = planData;

        return folders.map(folder => {
          // documents inside this folder
          const folderDocs = documents.filter(
            doc => doc.folderId === folder._id
          );

          return {
            name: folder.name,
            parentFolder: folder.parentFolder || null,


            planDocuments: folderDocs.map(doc => ({
              name: doc.name,
            
              versions: [
                {
                  versionNumber: 1,
                  status:"approved",
                  image: doc.thumbnail || doc.fileUrl || doc.uri || null,
                  annotations: [] // future annotations
                }
              ]
            }))
          };
        });
      };

      const data = transformPlanDataForBackend(formData.planData);

      console.log(
        "📦 Transformed plan data for backend:\n",
        JSON.stringify(data, null, 2)
      );


const payload={...requestData , plansData:data}


     
      // console.log("📤 Submitting data:", payload);

      // TODO: Uncomment API call
      const response = await fetch(
        `${process.env.BASE_API_URL}/api/project-type-with-survey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
    <View className="absolute top-15 right-5 z-50">
      {isSaving ? (
        <View className="flex-row items-center bg-orange-500 px-2 py-1 rounded-xl">
          <ActivityIndicator size={12} color="white" className="mr-1" />
          <Text className="text-white text-xs font-medium">Saving...</Text>
        </View>
      ) : lastSaved ? (
        <View className="flex-row items-center bg-green-600 px-2 py-1 rounded-xl">
          <Feather name="check" size={12} color="white" className="mr-1" />
          <Text className="text-white text-xs font-medium">Saved {lastSaved}</Text>
        </View>
      ) : null}
    </View>
  );

  // BOQ List component
  const renderBoqList = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-semibold text-sm text-black">Bill of Quantities (BOQs) *</Text>
        <Text className="font-medium text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
          {formData.boqs.length} {formData.boqs.length === 1 ? 'BOQ' : 'BOQs'}
        </Text>
      </View>

      {formData.boqs.length === 0 ? (
        <View className="items-center justify-center p-10 bg-blue-50 rounded-xl border border-gray-300 border-dashed mb-4">
          <Feather name="clipboard" size={40} color="#CCCCCC" />
          <Text className="font-semibold text-base text-gray-600 mt-3">No BOQs added yet</Text>
          <Text className="font-regular text-xs text-gray-500 mt-1 text-center">
            Add BOQs to define materials, quantities, and costs
          </Text>
        </View>
      ) : (
        formData.boqs.map((boq, index) => {
          const version = boq.boqVersion?.[0] || {};
          return (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-xl p-4 mb-3 border border-blue-100 shadow-sm shadow-blue-200"
              onPress={() => openBoqSheet(index)}
              disabled={isSubmitting}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1">
                  <Feather name="clipboard" size={18} color="#0066FF" className="mr-2" />
                  <Text className="font-semibold text-base text-black flex-1" numberOfLines={1}>
                    {boq.boqName || `BOQ ${index + 1}`}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-row items-center ml-3">
                    <Feather name="package" size={12} color="#666666" />
                    <Text className="font-medium text-xs text-gray-600 ml-1">
                      {version.materials?.length || 0}
                    </Text>
                  </View>
                  <View className="flex-row items-center ml-3">
                    <Feather name="dollar-sign" size={12} color="#666666" />
                    <Text className="font-medium text-xs text-gray-600 ml-1">
                      ₹{version.totalCost?.toFixed(0) || '0'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View className="flex-1">
                  <Text className="font-regular text-xs text-gray-600 mb-0.5">Area:</Text>
                  <Text className="font-medium text-xs text-black">
                    {boq.builtUpArea || 0} sq ft
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-regular text-xs text-gray-600 mb-0.5">Structure:</Text>
                  <Text className="font-medium text-xs text-black">
                    {boq.structuralType || 'Not set'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-regular text-xs text-gray-600 mb-0.5">Foundation:</Text>
                  <Text className="font-medium text-xs text-black">
                    {boq.foundationType || 'Not set'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <TouchableOpacity
                  className="flex-row items-center px-3 py-1.5 bg-blue-100 rounded"
                  onPress={() => openBoqSheet(index)}
                  disabled={isSubmitting}
                >
                  <Feather name="edit" size={14} color="#0066FF" />
                  <Text className="font-medium text-xs text-blue-600 ml-1">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-1.5"
                  onPress={() => handleDeleteBoq(index)}
                  disabled={isSubmitting}
                >
                  <Feather name="trash-2" size={14} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity
        onPress={() => openBoqSheet()}
        className="flex-row items-center justify-center py-3.5 border border-blue-600 rounded-lg bg-white"
        disabled={isSubmitting}
      >
        <Feather name="plus" size={20} color="#0066FF" className="mr-2" />
        <Text className="font-medium text-sm text-blue-600">
          {formData.boqs.length > 0 ? 'Add Another BOQ' : 'Add BOQ'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Site survey button
  const renderSiteSurveyButton = () => (
    <TouchableOpacity
      onPress={goToSiteSurvey}
      className="flex-row justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-600 mb-4"
    >
      <View className="flex-row items-center">
        <Feather name="map-pin" size={20} color="#0066FF" className="mr-2.5" />
        <View>
          <View className="flex-row items-center">
            <Text className="font-semibold text-base text-black">
              {surveyData ? '✓ Site Survey Added' : 'Include Site Survey'}
            </Text>
            {surveyData && (
              <View className="flex-row items-center bg-green-100 px-1.5 py-1 rounded ml-2">
                <Feather name="check-circle" size={14} color="#00C851" className="mr-1" />
                <Text className="text-green-700 text-xs font-medium">
                  {surveyData.reviewStatus === 'completed' ? 'completed' : 'in draft'}
                </Text>
              </View>
            )}
          </View>
          <Text className="font-regular text-xs text-gray-600 mt-0.5">
            Add site location and survey details
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#0066FF" />
    </TouchableOpacity>
  );

  // Add Plan button
  const renderAddPlanButton = () => {
    const hasPlan = formData.planData && Object.keys(formData.planData).length > 0;

    return (
      <TouchableOpacity
        onPress={openPlanSheet}
        className="flex-row justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-600 mb-4"
      >
        <View className="flex-row items-center">
          <Feather
            name={hasPlan ? "check-circle" : "file-text"}
            size={20}
            color={hasPlan ? "#00C851" : "#0066FF"}
            className="mr-2.5"
          />
          <View>
            <View className="flex-row items-center">
              <Text className="font-semibold text-base text-black">
                {hasPlan ? '✓ Project Plan Added' : 'Add Project Plan'}
              </Text>
              {hasPlan && (
                <View className="flex-row items-center bg-green-100 px-1.5 py-1 rounded ml-2">
                  <Feather name="check" size={12} color="#00C851" />
                  <Text className="text-green-700 text-xs font-medium ml-1">
                    Plan ready
                  </Text>
                </View>
              )}
            </View>
            <Text className="font-regular text-xs text-gray-600 mt-0.5">
              Add project plans like Architectural , Structural and timelines
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
    <View className="flex-1 bg-white">
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
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
      >
        <ScrollView
          className="flex-grow px-5 py-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Project Type Name */}
          <View className="mb-4">
            <Text className="font-semibold text-sm text-black mb-2">Project Type Name *</Text>
            <TextInput
              className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border ${formData.projectTypeName ? 'border-blue-600' : 'border-gray-300'}`}
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
          <View className="mb-4">
  <Text className="font-semibold text-sm text-black mb-2">Category *</Text>
  <View className={`bg-gray-100 rounded-xl px-1 font-regular text-sm text-black border ${formData.category ? 'border-blue-600' : 'border-gray-300'}`}>
    <Picker
      selectedValue={formData.category}
      onValueChange={(v) => updateField('category', v)}
      enabled={!isSubmitting}
      style={{ height: 50 }}
    >
      <Picker.Item label="Select a category..." value="" />
      <Picker.Item label="Residential" value="Residential" />
      <Picker.Item label="Commercial" value="Commercial" />
       
    </Picker>
  </View>
</View>

          {/* Description */}
          <View className="mb-4">
            <Text className="font-semibold text-sm text-black mb-2">Description *</Text>
            <TextInput
              className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border min-h-28 text-align-top ${formData.description ? 'border-blue-600' : 'border-gray-300'}`}
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
          <View className="mb-4">
            <Text className="font-semibold text-sm text-black mb-2">Land Area *</Text>
            <TextInput
              className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border ${formData.landArea ? 'border-blue-600' : 'border-gray-300'}`}
              placeholder="e.g., 1000 sq ft"
              placeholderTextColor="#999999"
              value={formData.landArea}
              onChangeText={(v) => updateField('landArea', v)}
              editable={!isSubmitting}
              keyboardType="default"
            />
          </View>

          {/* Estimated Days */}
          <View className="mb-4">
            <Text className="font-semibold text-sm text-black mb-2">Estimated Days *</Text>
            <TextInput
              className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border ${formData.estimated_days ? 'border-blue-600' : 'border-gray-300'}`}
              placeholder="e.g., 30"
              placeholderTextColor="#999999"
              value={formData.estimated_days}
              onChangeText={(v) => updateField('estimated_days', v)}
              editable={!isSubmitting}
              keyboardType="numeric"
            />
          </View>

          {/* Budget Range */}
          <View className="mb-4">
            <Text className="font-semibold text-sm text-black mb-2">Budget Range *</Text>
            <View className="flex-row justify-between">
              <TextInput
                className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border flex-1 mr-2 ${formData.budgetMinRange ? 'border-blue-600' : 'border-gray-300'}`}
                placeholder="Min (₹)"
                placeholderTextColor="#999999"
                value={formData.budgetMinRange}
                onChangeText={(v) => updateField('budgetMinRange', v)}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
              <TextInput
                className={`bg-gray-100 rounded-xl px-4 py-3.5 font-regular text-sm text-black border flex-1 ml-2 ${formData.budgetMaxRange ? 'border-blue-600' : 'border-gray-300'}`}
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
          {renderBoqList()}

          {/* Image */}
          <View className="mb-6">
            <Text className="font-semibold text-sm text-black mb-2">Image *</Text>

            {selectedImage ? (
              <View className="mb-3">
                <Image
                  source={{ uri: selectedImage.uri }}
                  className="w-full h-48 rounded-xl mb-2"
                  resizeMode="cover"
                />
                {isUploading && (
                  <View className="mb-2">
                    <View className="flex-row justify-between mb-1">
                      <Text className="font-regular text-xs text-gray-600">Uploading...</Text>
                      <Text className="font-regular text-xs text-gray-600">{uploadProgress}%</Text>
                    </View>
                    <View className="h-1 bg-gray-100 rounded">
                      <View className="h-1 bg-blue-600 rounded" style={{ width: `${uploadProgress}%` }} />
                    </View>
                  </View>
                )}
                {formData.image && !isUploading && (
                  <Text className="font-regular text-xs text-green-600 mb-2">
                    ✓ Image uploaded successfully to Cloudinary
                  </Text>
                )}
                <TouchableOpacity
                  onPress={removeSelectedImage}
                  className="bg-red-500 rounded-lg py-2.5 px-4 items-center"
                  disabled={isUploading}
                >
                  <Text className="font-semibold text-sm text-white">Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                disabled={isUploading}
                className="border-2 border-blue-600 border-dashed rounded-xl p-10 items-center justify-center bg-blue-50"
              >
                {isUploading ? (
                  <ActivityIndicator size="large" color="#0066FF" />
                ) : (
                  <>
                    <Feather name="image" size={32} color="#0066FF" className="mb-2" />
                    <Text className="font-semibold text-base text-blue-600">Select Image</Text>
                    <Text className="font-regular text-xs text-gray-600 mt-1 text-center">
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


        </ScrollView>

        {/* Footer Buttons */}
        <View className="flex-row px-5 py-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handleCancel}
            className={`flex-1 bg-gray-100 rounded-xl py-3.5 items-center mr-3 ${isSubmitting ? 'opacity-60' : ''}`}
            disabled={isSubmitting}
          >
            <Text className="font-semibold text-sm text-gray-600">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            className={`flex-1 bg-blue-600 rounded-xl py-3.5 items-center ${(!isSaveEnabled() || isSubmitting) ? 'opacity-60' : ''}`}
            disabled={!isSaveEnabled() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-sm text-white">
                {isEditMode ? 'Save Changes' : 'Create Project Type'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* BOQ Bottom Sheet */}
      <BoqBottomSheet
        visible={showBoqSheet}
        onClose={closeBoqSheet}
        boqData={editingBoqData}
        boqIndex={editingBoqIndex}
        onSave={handleSaveBoq}
        onDelete={handleDeleteBoq}
        isSubmitting={isSubmitting}
      />

      {/* Project Plan Bottom Sheet */}
      <ProjectPlanBottomSheet
        visible={showPlanSheet}
        onClose={closePlanSheet}
        planData={formData.planData}
        onSave={handleSavePlan}
        isSubmitting={isSubmitting}
      />
    </View>
  );
};

export default CreateTemplate;