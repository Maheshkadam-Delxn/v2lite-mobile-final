import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const API_URL = `${process.env.BASE_API_URL}`;

const CreateTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get initial data if editing (passed from ProposalsListScreen)
  const initialData = route.params?.initialData || null;
  const mode = route.params?.mode || 'create';
  const isEditMode = mode === 'edit';
  
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
    createdAt: new Date().toISOString().split('T')[0]
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Material fields state
  const [materialName, setMaterialName] = useState('');
  const [materialUnits, setMaterialUnits] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');

  useEffect(() => {
    // If editing, populate fields with initial data
    if (isEditMode && initialData) {
      setFormData({
        projectTypeName: initialData.projectTypeName || initialData.name || '',
        category: initialData.category || '',
        description: initialData.description || '',
        image: initialData.image || null,
        landArea: initialData.landArea || '',
        estimated_days: initialData.estimated_days ? String(initialData.estimated_days) : '',
        budgetMinRange: initialData.budgetMinRange || '',
        budgetMaxRange: initialData.budgetMaxRange || '',
        material: initialData.material || [],
        createdAt: initialData.createdAt || new Date().toISOString().split('T')[0]
      });
      setSelectedImage(initialData.image ? { uri: initialData.image } : null);
      setUploadProgress(initialData.image ? 100 : 0);
    }
  }, [initialData, isEditMode]);

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

  const addMaterial = () => {
    if (!materialName.trim() || !materialUnits.trim() || !materialQuantity.trim()) {
      Alert.alert('Validation', 'Please fill all material fields');
      return;
    }

    const newMaterial = {
      material_name: materialName.trim(),
      units: materialUnits.trim(),
      quantity: Number(materialQuantity)
    };

    setFormData(prev => ({
      ...prev,
      material: [...prev.material, newMaterial]
    }));

    // Clear material fields
    setMaterialName('');
    setMaterialUnits('');
    setMaterialQuantity('');
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      material: prev.material.filter((_, i) => i !== index)
    }));
  };

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
    if (formData.material.length === 0) { 
      Alert.alert('Validation', 'At least one material is required'); 
      return false; 
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
        material: formData.material,
        createdAt: formData.createdAt
      };

      let resp;
      if (isEditMode) {
        // update flow
        resp = await fetch(`${API_URL}/api/project-types/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // create flow
        resp = await fetch(`${API_URL}/api/project-types`, {
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
          projectTypeName: createdOrUpdated.projectTypeName || requestData.projectTypeName,
          name: createdOrUpdated.projectTypeName || requestData.projectTypeName,
          category: (createdOrUpdated.category || requestData.category).toString().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
          categoryColor: getCategoryColor(createdOrUpdated.category || requestData.category),
          lastModified: new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          image: createdOrUpdated.image || requestData.image,
          description: createdOrUpdated.description || requestData.description,
          landArea: createdOrUpdated.landArea || requestData.landArea,
          estimated_days: createdOrUpdated.estimated_days || requestData.estimated_days,
          budgetMinRange: createdOrUpdated.budgetMinRange || requestData.budgetMinRange,
          budgetMaxRange: createdOrUpdated.budgetMaxRange || requestData.budgetMaxRange,
          material: createdOrUpdated.material || requestData.material,
          createdAt: createdOrUpdated.createdAt || requestData.createdAt,
          raw: createdOrUpdated,
        };

        if (isEditMode) {
          Alert.alert('Success', 'Template updated successfully!');
        } else {
          Alert.alert('Success', 'Project type created successfully!');
        }
        
        // Navigate back to ProposalsListScreen
        navigation.goBack();
      } else {
        const txt = await resp.text();
        let errMsg = 'Failed to save template. Please try again.';
        try { 
          const j = JSON.parse(txt); 
          errMsg = j.message || errMsg; 
        } catch(e) { 
          if (txt) errMsg = txt; 
        }
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      Alert.alert('Network error', 'Unable to save. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Project Type Name *</Text>
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
                borderColor: formData.projectTypeName ? '#0066FF' : '#E0E0E0',
              }}
              placeholder="Enter project type name"
              placeholderTextColor="#999999"
              value={formData.projectTypeName}
              onChangeText={(v) => setFormData(p => ({ ...p, projectTypeName: v }))}
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
              placeholder="Enter project type description"
              placeholderTextColor="#999999"
              value={formData.description}
              onChangeText={(v) => setFormData(p => ({ ...p, description: v }))}
              multiline
              numberOfLines={4}
              editable={!isSubmitting}
              returnKeyType="done"
            />
          </View>

          {/* Land Area */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Land Area *</Text>
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
                borderColor: formData.landArea ? '#0066FF' : '#E0E0E0',
              }}
              placeholder="e.g., 1000 sq ft"
              placeholderTextColor="#999999"
              value={formData.landArea}
              onChangeText={(v) => setFormData(p => ({ ...p, landArea: v }))}
              editable={!isSubmitting}
              keyboardType="default"
            />
          </View>

          {/* Estimated Days */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Estimated Days *</Text>
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
                borderColor: formData.estimated_days ? '#0066FF' : '#E0E0E0',
              }}
              placeholder="e.g., 30"
              placeholderTextColor="#999999"
              value={formData.estimated_days}
              onChangeText={(v) => setFormData(p => ({ ...p, estimated_days: v }))}
              editable={!isSubmitting}
              keyboardType="numeric"
            />
          </View>

          {/* Budget Range */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Budget Range *</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  borderWidth: 1,
                  borderColor: formData.budgetMinRange ? '#0066FF' : '#E0E0E0',
                  marginRight: 8,
                }}
                placeholder="Min (₹)"
                placeholderTextColor="#999999"
                value={formData.budgetMinRange}
                onChangeText={(v) => setFormData(p => ({ ...p, budgetMinRange: v }))}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  borderWidth: 1,
                  borderColor: formData.budgetMaxRange ? '#0066FF' : '#E0E0E0',
                  marginLeft: 8,
                }}
                placeholder="Max (₹)"
                placeholderTextColor="#999999"
                value={formData.budgetMaxRange}
                onChangeText={(v) => setFormData(p => ({ ...p, budgetMaxRange: v }))}
                editable={!isSubmitting}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Materials Section */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Materials *</Text>
            
            {/* Add Material Form */}
            <View style={{ backgroundColor: '#F8FAFF', borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#0066FF', marginBottom: 8 }}>Add New Material</Text>
              
              <TextInput
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  marginBottom: 8,
                }}
                placeholder="Material Name"
                placeholderTextColor="#999999"
                value={materialName}
                onChangeText={setMaterialName}
                editable={!isSubmitting}
              />
              
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    marginRight: 8,
                  }}
                  placeholder="Units"
                  placeholderTextColor="#999999"
                  value={materialUnits}
                  onChangeText={setMaterialUnits}
                  editable={!isSubmitting}
                />
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    marginLeft: 8,
                  }}
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
                style={{ backgroundColor: '#0066FF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                disabled={isSubmitting}
              >
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Add Material</Text>
              </TouchableOpacity>
            </View>

            {/* Materials List */}
            {formData.material.length > 0 ? (
              <View>
                <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#666666', marginBottom: 8 }}>
                  Added Materials ({formData.material.length})
                </Text>
                {formData.material.map((item, index) => (
                  <View key={index} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: 8, 
                    padding: 12, 
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#F0F0F0',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000' }}>
                        {item.material_name}
                      </Text>
                      <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>
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
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#999999', textAlign: 'center', marginTop: 8 }}>
                No materials added yet
              </Text>
            )}
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
                <TouchableOpacity 
                  onPress={removeSelectedImage} 
                  style={{ backgroundColor: '#FF4444', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' }} 
                  disabled={isUploading}
                >
                  <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={pickImage} 
                disabled={isUploading} 
                style={{ 
                  borderWidth: 2, 
                  borderColor: '#0066FF', 
                  borderStyle: 'dashed', 
                  borderRadius: 12, 
                  padding: 40, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  backgroundColor: '#F8FAFF' 
                }}
              >
                {isUploading ? (
                  <ActivityIndicator size="large" color="#0066FF" />
                ) : (
                  <>
                    <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
                    <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, color: '#0066FF' }}>Select Image</Text>
                    <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>
                      Tap to choose an image from your gallery
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0'
        }}>
          <TouchableOpacity
            onPress={handleCancel}
            style={{ 
              flex: 1, 
              backgroundColor: '#F5F5F5', 
              borderRadius: 12, 
              paddingVertical: 14, 
              alignItems: 'center', 
              marginRight: 12,
              opacity: isSubmitting ? 0.6 : 1 
            }}
            disabled={isSubmitting}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#666666' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={{ 
              flex: 1, 
              backgroundColor: '#0066FF', 
              borderRadius: 12, 
              paddingVertical: 14, 
              alignItems: 'center',
              opacity: (isSubmitting || isUploading || !formData.projectTypeName || !formData.category || !formData.description || !formData.image || !formData.landArea || !formData.estimated_days || !formData.budgetMinRange || !formData.budgetMaxRange || formData.material.length === 0) ? 0.6 : 1 
            }}
            disabled={isSubmitting || isUploading || !formData.projectTypeName || !formData.category || !formData.description || !formData.image || !formData.landArea || !formData.estimated_days || !formData.budgetMinRange || !formData.budgetMaxRange || formData.material.length === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>
                {isEditMode ? 'Save Changes' : 'Create Project Type'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateTemplate;