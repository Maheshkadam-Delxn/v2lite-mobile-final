import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const ProposalsListScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states for creating new proposal
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: null, // This will store the Cloudinary URL after upload
  });

  // Image state for local image handling
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter states
  const [status, setStatus] = useState('Active');
  const [fromDate, setFromDate] = useState('22/03/2025');
  const [toDate, setToDate] = useState('15/04/2025');
  const [clientName, setClientName] = useState('Arun Mishra');
  const [designer, setDesigner] = useState('John Smith & Associates');

  // Helper to map category to color (case-insensitive)
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

  useEffect(() => {
    let mounted = true;
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token from AsyncStorage:', token ? 'Token present' : 'No token');

        const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log('API response status:', response.status);

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

        if (mounted) {
          setProposals(mappedProposals);
        }
      } catch (error) {
        console.error('Network error fetching proposals:', error);
        if (mounted) setProposals([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!showCreateModal) {
      setFormData({
        name: '',
        category: '',
        description: '',
        image: null,
      });
      setSelectedImage(null);
      setUploadProgress(0);
    }
  }, [showCreateModal]);

  // Simple client-side search filtering
  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    const q = searchQuery.trim().toLowerCase();
    return proposals.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [searchQuery, proposals]);

  // Cloudinary upload functions
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

  const uploadToCloudinary = async (imageUri) => {
    try {
      console.log('Starting Cloudinary signed upload...');
      setIsUploading(true);
      setUploadProgress(0);
      
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);
      
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('file', {
        uri: imageUri,
        type: type,
        name: filename || `image_${Date.now()}.jpg`,
      });
      
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadProgress(100);

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
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelect = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log('Image picker result:', result);

    if (!result.canceled && result.assets && result.assets[0]) {
      const imageAsset = result.assets[0];
      setSelectedImage({
        uri: imageAsset.uri,
        name: `proposal_image_${Date.now()}.jpg`,
      });

      // Upload to Cloudinary immediately
      const uploadResult = await uploadToCloudinary(imageAsset.uri);
      
      if (uploadResult.success) {
        setFormData(prev => ({
          ...prev,
          image: uploadResult.url
        }));
        Alert.alert('Success', 'Image uploaded to Cloudinary successfully!');
      } else {
        Alert.alert(
          'Upload Failed', 
          `Failed to upload image: ${uploadResult.error}`,
          [{ text: 'OK' }]
        );
        setSelectedImage(null);
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }
    if (!formData.image) {
      Alert.alert('Error', 'Image is required');
      return false;
    }
    return true;
  };

  // Submit new proposal
  const handleCreateProposal = async () => {
    if (!validateForm()) return;

    if (isUploading) {
      Alert.alert('Please Wait', 'Image is still uploading. Please wait until upload completes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProposal = await response.json();
        
        // Add the new proposal to the local state
        const mappedProposal = {
          id: newProposal._id || newProposal.id,
          name: newProposal.name || 'Unnamed Template',
          category: (newProposal.category || 'General')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          categoryColor: getCategoryColor(newProposal.category),
          lastModified: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          image: newProposal.image || null,
          description: newProposal.description || '',
          raw: newProposal,
        };

        setProposals(prev => [mappedProposal, ...prev]);
        setShowCreateModal(false);
        Alert.alert('Success', 'Proposal template created successfully!');
      } else {
        const errorText = await response.text();
        console.warn('Create failed', response.status, errorText);
        Alert.alert('Error', 'Failed to create proposal template. Please try again.');
      }
    } catch (error) {
      console.error('Create error', error);
      Alert.alert('Network Error', 'Unable to create proposal. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handlePreview = (proposal) => {
    navigation.navigate('PreviewProposalScreen', { id: proposal.id, proposal });
  };

  const handleEdit = (proposal) => {
    navigation.navigate('EditProposalScreen', { id: proposal.id, proposal });
  };

  const handleDelete = (proposal) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${proposal.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(proposal.id),
        },
      ]
    );
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

  // Proposal card render function
  const renderProposal = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: item.categoryColor,
      }}
    >
      <View style={{ marginBottom: 12 }}>
        {item.image && (
          <Image 
            source={{ uri: item.image }}
            style={{
              width: '100%',
              height: 120,
              borderRadius: 8,
              marginBottom: 12,
            }}
            resizeMode="cover"
          />
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
        <TouchableOpacity
          onPress={() => handlePreview(item)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleEdit(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>
            {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Create Proposal Modal
  const CreateProposalModal = () => (
    <Modal visible={showCreateModal} transparent animationType="slide" onRequestClose={() => !isSubmitting && setShowCreateModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' }}>
          <View style={{ paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Create New Proposal Template</Text>
            
            <ScrollView style={{ maxHeight: 500 }} showsVerticalScrollIndicator={false}>
              {/* Name Field */}
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
                  onChangeText={(value) => handleInputChange('name', value)}
                  editable={!isSubmitting}
                />
              </View>

              {/* Category Field */}
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
                  onChangeText={(value) => handleInputChange('category', value)}
                  editable={!isSubmitting}
                />
              </View>

              {/* Description Field */}
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
                  onChangeText={(value) => handleInputChange('description', value)}
                  multiline
                  numberOfLines={4}
                  editable={!isSubmitting}
                />
              </View>

              {/* Image Upload Field */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Image *</Text>
                
                {selectedImage ? (
                  <View style={{ marginBottom: 12 }}>
                    <Image 
                      source={{ uri: selectedImage.uri }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                        marginBottom: 8,
                      }}
                      resizeMode="cover"
                    />
                    {isUploading && (
                      <View style={{ marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>Uploading...</Text>
                          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666' }}>{uploadProgress}%</Text>
                        </View>
                        <View style={{ height: 4, backgroundColor: '#F0F0F0', borderRadius: 2 }}>
                          <View style={{ 
                            height: 4, 
                            backgroundColor: '#0066FF', 
                            borderRadius: 2,
                            width: `${uploadProgress}%` 
                          }} />
                        </View>
                      </View>
                    )}
                    {formData.image && !isUploading && (
                      <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#00C851', marginBottom: 8 }}>
                        ✓ Image uploaded successfully to Cloudinary
                      </Text>
                    )}
                    <TouchableOpacity 
                      onPress={removeSelectedImage}
                      style={{
                        backgroundColor: '#FF4444',
                        borderRadius: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                      }}
                      disabled={isUploading}
                    >
                      <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: 'white' }}>
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={handleImageSelect}
                    style={{
                      borderWidth: 2,
                      borderColor: '#0066FF',
                      borderStyle: 'dashed',
                      borderRadius: 12,
                      padding: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F8FAFF',
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator size="large" color="#0066FF" />
                    ) : (
                      <>
                        <Feather name="image" size={32} color="#0066FF" style={{ marginBottom: 8 }} />
                        <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, color: '#0066FF' }}>
                          Select Image
                        </Text>
                        <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#666666', marginTop: 4, textAlign: 'center' }}>
                          Tap to choose an image from your gallery
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity 
                onPress={() => setShowCreateModal(false)} 
                style={{ 
                  flex: 1, 
                  backgroundColor: '#F5F5F5', 
                  borderRadius: 12, 
                  paddingVertical: 14, 
                  alignItems: 'center',
                  opacity: isSubmitting ? 0.6 : 1
                }}
                disabled={isSubmitting}
              >
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#666666' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleCreateProposal}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#0066FF', 
                  borderRadius: 12, 
                  paddingVertical: 14, 
                  alignItems: 'center',
                  opacity: (isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image) ? 0.6 : 1
                }}
                disabled={isSubmitting || isUploading || !formData.name || !formData.category || !formData.description || !formData.image}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Other modals (FilterModal and ActionsModal remain the same)
  const FilterModal = () => (
    <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Filter</Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const ActionsModal = () => (
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
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header
          title="Proposals Templates"
          rightIcon="filter-outline"
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

          <TouchableOpacity
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setShowCreateModal(true)}
          >
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
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Template List</Text>
        </View>

        <FlatList
          data={filteredProposals}
          keyExtractor={(item) => item.id}
          renderItem={renderProposal}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 50 }}>No templates found.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FilterModal />
      <ActionsModal />
      <CreateProposalModal />
    </View>
  );
};

export default ProposalsListScreen;