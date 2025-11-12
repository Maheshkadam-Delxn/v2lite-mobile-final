// PlansScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import { useRoute } from '@react-navigation/native';

const API_BASE = 'https://skystruct-lite-backend.vercel.app';
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const pdfIcon =require('../../assets/pdfIcon.png'); // keep your asset
const fallbackImage = require('../../assets/plan1.jpg'); // fallback / placeholder

const PlansScreen = () => {
  const route = useRoute();
  const projectId = route?.params?.projectId || route?.params?.project?._id || null;

  const [planCategories, setPlanCategories] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add-modal related state
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('new'); // 'new' or folder id
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  useEffect(() => {
    if (projectId) fetchFoldersForProject();
  }, [projectId]);

  const getAuthHeaders = async (extra = {}) => {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  };

  // -----------------------
  // Fetch existing folders
  // -----------------------
  const fetchFoldersForProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE}/api/documents/folders?projectId=${projectId}`;
      console.log('📂 Fetching project documents from:', url);

      const headers = await getAuthHeaders();
      const res = await fetch(url, { method: 'GET', headers });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log('✅ Folders fetched:', data);

      const folders = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      const formatted = folders.map((folder) => {
        const id = folder._id || folder.id || Math.random().toString();
        const title = folder.name || folder.title || 'Untitled Folder';
        const docs = folder.fileUrls || folder.docs || folder.files || [];

        const plans = docs.map((doc) => {
          const url = doc.url || doc.path || doc.fileUrl || '';
          const mime = (doc.mimeType || doc.type || '').toLowerCase();
          const isPdf = mime.includes('pdf') || url.toLowerCase().endsWith('.pdf');
          const image = isPdf ? pdfIcon : (url ? { uri: url } : fallbackImage);

          return {
            id: doc._id || doc.id || Math.random().toString(),
            title: doc.name || doc.title || 'Untitled Document',
            subtitle: doc.fileType || (isPdf ? 'PDF Document' : 'Image'),
            image,
            raw: doc,
          };
        });

        return {
          id,
          title,
          planCount: plans.length,
          plans,
        };
      });

      // preserve expanded states for existing categories
      const defaultExpanded = {};
      formatted.forEach((f) => {
        defaultExpanded[f.id] = !!expandedSections[f.id]; // keep if already set
      });

      setPlanCategories(formatted);
      setExpandedSections((prev) => ({ ...defaultExpanded, ...prev }));
    } catch (err) {
      console.error('❌ Failed to fetch folders:', err);
      setError(err.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // -----------------------
  // Cloudinary signed upload
  // -----------------------
  const generateSignature = async (timestamp) => {
    // same signing method as you used earlier
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      stringToSign
    );
    return signature;
  };

  const uploadToCloudinary = async (fileUri, fileType = 'image') => {
    try {
      setIsUploadingFile(true);
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const form = new FormData();

      const filename = fileUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const ext = match ? match[1] : (fileType === 'image' ? 'jpg' : 'pdf');
      const mimeType = fileType === 'image' ? `image/${ext}` : `application/${ext}`;

      form.append('file', {
        uri: fileUri,
        name: filename || `upload_${Date.now()}.${ext}`,
        type: mimeType,
      });

      form.append('timestamp', timestamp.toString());
      form.append('signature', signature);
      form.append('api_key', CLOUDINARY_CONFIG.apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;
      console.log('Uploading to Cloudinary:', uploadUrl);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
        headers: {
          // DO NOT set Content-Type manually for multipart/form-data in RN fetch; let it set boundary
        },
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed parse cloudinary response:', e, text);
        throw new Error('Invalid response from Cloudinary');
      }

      if (!res.ok) {
        console.error('Cloudinary upload failed:', data);
        throw new Error(data.error?.message || `Upload failed: ${res.status}`);
      }

      console.log('Cloudinary success:', data.secure_url);
      return { success: true, url: data.secure_url, publicId: data.public_id, raw: data };
    } catch (err) {
      console.error('Cloudinary error:', err);
      return { success: false, error: err.message || String(err) };
    } finally {
      setIsUploadingFile(false);
    }
  };

  // -----------------------
  // Pickers
  // -----------------------
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Media library permission is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setUploadedFile({
          uri: asset.uri,
          name: asset.fileName || asset.uri.split('/').pop(),
          mimeType: asset.type === 'image' ? (asset.uri.endsWith('.png') ? 'image/png' : 'image/jpeg') : 'image',
          type: 'image',
        });
      }
    } catch (err) {
      console.error('pickImage error:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      // Current expo-document-picker returns object with uri & name
      if (res && res.type === 'success') {
        const mime = res.mimeType || (res.name?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        setUploadedFile({
          uri: res.uri,
          name: res.name,
          mimeType: mime,
          type: mime.includes('pdf') ? 'pdf' : 'image',
        });
      }
    } catch (err) {
      console.error('pickDocument error:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleFileUploadSelect = async () => {
    try {
      Alert.alert('Select File Type', 'Choose file type', [
        { text: 'Image', onPress: pickImage },
        { text: 'PDF / Document', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------
  // API: create folder / add document
  // -----------------------
  const createFolder = async (folderName, documentMeta) => {
    // documentMeta: array of { name, url, mimeType }
    try {
      const url = `${API_BASE}/api/documents/folders`;
      const headers = await getAuthHeaders();
      const body = {
        projectId,
        name: folderName,
        fileUrls: documentMeta,
      };
      console.log('Creating folder with body:', body, 'POST', url);
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Create folder failed ${res.status}: ${txt}`);
      }
      const json = await res.json();
      return { success: true, data: json };
    } catch (err) {
      console.error('createFolder error:', err);
      return { success: false, error: err.message || String(err) };
    }
  };

  const addDocumentToFolder = async (folderId, documentMeta) => {
    // documentMeta: { name, url, mimeType }
    try {
      const url = `${API_BASE}/api/documents/folders/${folderId}/documents`;
      const headers = await getAuthHeaders();
      console.log('Adding document to folder:', url, documentMeta);
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(documentMeta),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`Add doc failed ${res.status}: ${txt}`);
      }
      const json = await res.json();
      return { success: true, data: json };
    } catch (err) {
      console.error('addDocumentToFolder error:', err);
      return { success: false, error: err.message || String(err) };
    }
  };

  // -----------------------
  // Submit new plan flow
  // -----------------------
  const handleSubmit = async () => {
    if (!newPlanName.trim()) {
      Alert.alert('Validation', 'Please enter a plan name.');
      return;
    }
    if (!uploadedFile) {
      Alert.alert('Validation', 'Please select a file to upload.');
      return;
    }
    if (selectedCategory === 'new' && !newCategoryName.trim()) {
      Alert.alert('Validation', 'Please enter new category name.');
      return;
    }

    try {
      setIsUploadingFile(true);

      // 1) Upload to Cloudinary
      const fileType = uploadedFile.type === 'image' ? 'image' : 'raw';
      const uploadResult = await uploadToCloudinary(uploadedFile.uri, fileType === 'raw' ? 'raw' : 'image');

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      const uploadedUrl = uploadResult.url;
      const mimeType = uploadedFile.mimeType || (uploadedFile.type === 'pdf' ? 'application/pdf' : 'image/jpeg');

      // Build document metadata
      const docMeta = {
        name: newPlanName.trim(),
        url: uploadedUrl,
        mimeType,
      };

      // 2) Create folder or add to existing
      if (selectedCategory === 'new') {
        const folderName = newCategoryName.trim();
        const res = await createFolder(folderName, [docMeta]);
        if (!res.success) throw new Error(res.error || 'Failed to create folder');

        // Update local UI: append new folder from response or build fallback
        const createdFolder = (res.data && (res.data.data || res.data)) || null;
        // If backend returns created folder, use that — else craft one
        const newFolderForUI = createdFolder
          ? {
              id: createdFolder._id || createdFolder.id,
              title: createdFolder.name || folderName,
              planCount: (createdFolder.documents || []).length,
              plans: (createdFolder.documents || []).map((d) => ({
                id: d._id || d.id || Math.random().toString(),
                title: d.name || d.title || newPlanName,
                subtitle: d.mimeType ? (d.mimeType.includes('pdf') ? 'PDF Document' : 'File') : 'File',
                image: (d.mimeType && d.mimeType.includes('pdf')) ? pdfIcon : { uri: d.url },
                raw: d,
              })),
            }
          : {
              id: `folder-${Date.now()}`,
              title: folderName,
              planCount: 1,
              plans: [
                {
                  id: `doc-${Date.now()}`,
                  title: newPlanName,
                  subtitle: mimeType.includes('pdf') ? 'PDF Document' : 'Image',
                  image: mimeType.includes('pdf') ? pdfIcon : { uri: uploadedUrl },
                  raw: docMeta,
                },
              ],
            };

        setPlanCategories((prev) => [newFolderForUI, ...prev]);
        setExpandedSections((prev) => ({ ...prev, [newFolderForUI.id]: true }));
        Alert.alert('Success', 'New category and plan added successfully!');
      } else {
        // existing folder
        const folderId = selectedCategory;
        const res = await addDocumentToFolder(folderId, docMeta);
        if (!res.success) throw new Error(res.error || 'Failed to add document to folder');

        const createdDoc = (res.data && (res.data.data || res.data)) || null;

        // Update UI by mapping folder and adding plan
        setPlanCategories((prev) =>
          prev.map((folder) => {
            if (folder.id === folderId) {
              const newPlan = createdDoc
                ? {
                    id: createdDoc._id || createdDoc.id || Math.random().toString(),
                    title: createdDoc.name || newPlanName,
                    subtitle: createdDoc.mimeType ? (createdDoc.mimeType.includes('pdf') ? 'PDF Document' : 'File') : 'File',
                    image: (createdDoc.mimeType && createdDoc.mimeType.includes('pdf')) ? pdfIcon : { uri: createdDoc.url || uploadedUrl },
                    raw: createdDoc,
                  }
                : {
                    id: `doc-${Date.now()}`,
                    title: newPlanName,
                    subtitle: mimeType.includes('pdf') ? 'PDF Document' : 'Image',
                    image: mimeType.includes('pdf') ? pdfIcon : { uri: uploadedUrl },
                    raw: docMeta,
                  };

              return {
                ...folder,
                plans: [...folder.plans, newPlan],
                planCount: (folder.planCount || 0) + 1,
              };
            }
            return folder;
          })
        );

        setExpandedSections((prev) => ({ ...prev, [folderId]: true }));
        Alert.alert('Success', 'Plan added to folder successfully!');
      }

      // Reset modal & fields
      setNewPlanName('');
      setNewCategoryName('');
      setUploadedFile(null);
      setShowNewCategoryInput(true);
      setSelectedCategory('new');
      setShowAddPlanModal(false);
    } catch (err) {
      console.error('Submit flow error:', err);
      Alert.alert('Error', err.message || 'Failed to submit plan');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleCloseModal = () => {
    setNewPlanName('');
    setNewCategoryName('');
    setUploadedFile(null);
    setShowNewCategoryInput(true);
    setSelectedCategory('new');
    setShowAddPlanModal(false);
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#0066FF" />
            <Text className="text-gray-500 mt-3">Loading documents...</Text>
          </View>
        )}

        {!loading && error && (
          <View className="items-center justify-center py-10">
            <Feather name="alert-circle" size={32} color="#FF4C4C" />
            <Text className="text-red-500 mt-2">{error}</Text>
          </View>
        )}

        {!loading && !error && planCategories.length === 0 && (
          <View className="items-center justify-center py-16">
            <Feather name="folder" size={40} color="#9CA3AF" />
            <Text className="text-gray-500 mt-3">No plans available yet</Text>
          </View>
        )}

        {!loading &&
          !error &&
          planCategories.map((category) => (
            <View key={category.id} className="mb-3 bg-white rounded-xl overflow-hidden">
              <TouchableOpacity
                onPress={() => toggleSection(category.id)}
                className="flex-row items-center justify-between px-4 py-4"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-3">
                    <Feather name="folder" size={20} color="white" />
                  </View>
                  <Text className="text-gray-900 text-base font-semibold flex-1">
                    {category.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mr-2">
                    ({category.planCount})
                  </Text>
                  <Feather name={expandedSections[category.id] ? 'chevron-up' : 'chevron-down'} size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>

              {expandedSections[category.id] && (
                <View className="px-4 pb-4">
                  {category.plans.length > 0 ? (
                    <View className="flex-row flex-wrap -mx-2">
                      {category.plans.map((plan) => (
                        <View key={plan.id} className="w-1/2 px-2 mb-4">
                          <TouchableOpacity className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <View className="bg-white rounded-lg mb-3 overflow-hidden border border-gray-200">
                              <Image source={plan.image} className="w-full h-32" resizeMode="contain" />
                            </View>
                            <View className="items-center">
                              <Text className="text-gray-900 text-base font-semibold mb-1">{plan.title}</Text>
                              <Text className="text-gray-400 text-sm">{plan.subtitle}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className="bg-gray-50 rounded-xl p-6 items-center justify-center">
                      <Feather name="file" size={28} color="#9CA3AF" />
                      <Text className="text-gray-400 text-sm mt-2 text-center">No documents in this folder</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
      </ScrollView>

      {/* Fixed Add Plan Button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-4 items-center shadow-sm"
          onPress={() => {
            setShowAddPlanModal(true);
            setSelectedCategory('new');
            setShowNewCategoryInput(true);
            setNewCategoryName('');
            setNewPlanName('');
            setUploadedFile(null);
          }}
        >
          <Text className="text-white text-base font-semibold">Add Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Add Plan Modal */}
      <Modal animationType="slide" transparent visible={showAddPlanModal} onRequestClose={handleCloseModal}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">Add New Plan</Text>
              <TouchableOpacity onPress={handleCloseModal}><Feather name="x" size={24} color="#6B7280" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Plan Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Enter plan name"
                  value={newPlanName}
                  onChangeText={setNewPlanName}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Category</Text>
                <View className="flex-row flex-wrap -mx-1">
                  {planCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`mx-1 mb-2 px-4 py-2 rounded-lg border ${selectedCategory === category.id ? 'bg-blue-500 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                      onPress={() => { setSelectedCategory(category.id); setShowNewCategoryInput(false); }}
                    >
                      <Text className={`${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}>{category.title}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    className={`mx-1 mb-2 px-4 py-2 rounded-lg border ${selectedCategory === 'new' ? 'bg-green-500 border-green-500' : 'bg-gray-50 border-gray-200'}`}
                    onPress={() => { setSelectedCategory('new'); setShowNewCategoryInput(true); }}
                  >
                    <Text className={`${selectedCategory === 'new' ? 'text-white' : 'text-gray-700'}`}>+ New</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showNewCategoryInput && (
                <View className="mb-6">
                  <Text className="text-gray-700 font-medium mb-2">New Category Name</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                  />
                </View>
              )}

              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Upload Plan</Text>
                <TouchableOpacity className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 items-center" onPress={handleFileUploadSelect}>
                  <Feather name="upload" size={32} color="#9CA3AF" />
                  <Text className="text-gray-600 font-medium mt-2">{uploadedFile ? 'File Selected' : 'Tap to Upload'}</Text>
                  <Text className="text-gray-400 text-sm mt-1 text-center">Supports JPG, PNG, PDF files</Text>
                  {uploadedFile && (<Text className="text-blue-500 text-sm mt-2 font-medium">{uploadedFile.name}</Text>)}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`rounded-xl py-4 items-center mb-4 ${isUploadingFile ? 'bg-gray-400' : 'bg-blue-500'}`}
                onPress={handleSubmit}
                disabled={isUploadingFile}
              >
                {isUploadingFile ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-base font-semibold">Submit Plan</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlansScreen;