

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import Header from '../../components/Header';
import InputField from '../../components/Inputfield';

//const API_URL = 'https://skystruct-lite-backend.vercel.app/api/users';
const API_URL = `${process.env.BASE_API_URL}/api/users`;
const TOKEN_KEY = 'userToken';

// ✅ Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [signature, setSignature] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploadingType, setUploadingType] = useState(null); // 'profile' or 'signature'
  const [isUploading, setIsUploading] = useState(false);
  const [showSignatureOptions, setShowSignatureOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Generate Cloudinary signature
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

  // ✅ Upload file to Cloudinary
  const uploadToCloudinary = async (imageUri, fileType = 'image') => {
    try {
      setIsUploading(true);
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;

      formData.append('file', {
        uri: imageUri,
        type,
        name: filename || `${fileType}_${Date.now()}.jpg`,
      });
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;
      console.log(`[Cloudinary] Uploading to ${uploadUrl}...`);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (response.ok && data.secure_url) {
        console.log('[Cloudinary] ✅ Uploaded:', data.secure_url);
        return { success: true, url: data.secure_url };
      } else {
        console.error('[Cloudinary] ❌ Upload failed:', data);
        return { success: false, error: data?.error?.message || 'Upload failed' };
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Fetch user data (including profile and signature)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('[EditProfile] 🔄 Fetching user data...');
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const userData = await AsyncStorage.getItem('userData');

        if (!storedToken || !userData) {
          console.log('[EditProfile] ⚠️ Token or user data missing');
          return;
        }

        const parsed = JSON.parse(userData);
        const id = parsed?._id || parsed?.id;
        setUserId(id);
        setToken(storedToken);

        const res = await fetch(`${API_URL}/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const json = await res.json();
        if (!res.ok) {
          console.log('[EditProfile] ❌ Error fetching user:', json);
          return;
        }

        const data = json.data;
        console.log('[EditProfile] ✅ User data fetched:', data);

        setFullName(data.name || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setStreetAddress(data.address || '');
        setGender(data.gender || '');
        setDateOfBirth(data.dateOfBirth || '');
        setSignature(data.signatureUrl || null);
        setProfilePhoto(data.profilePhoto || null);
      } catch (err) {
        console.error('[EditProfile] ❌ Fetch Error:', err);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Handle signature upload
  const handleSignatureUpload = async (source = 'gallery') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Camera or gallery access is needed.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 2],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 2],
            quality: 0.8,
          });

    if (!result.canceled) {
      setUploadingType('signature');
      const uploadResult = await uploadToCloudinary(result.assets[0].uri);
      if (uploadResult.success) {
        setSignature(uploadResult.url);
        Alert.alert('Success', 'Signature uploaded successfully!');
      } else {
        Alert.alert('Error', uploadResult.error);
      }
      setShowSignatureOptions(false);
    }
  };

  // ✅ Handle profile photo upload
  const handleProfilePhotoUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant access to your gallery.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploadingType('profile');
      const uploadResult = await uploadToCloudinary(result.assets[0].uri);
      if (uploadResult.success) {
        setProfilePhoto(uploadResult.url);
        Alert.alert('Success', 'Profile photo uploaded successfully!');
      } else {
        Alert.alert('Error', uploadResult.error);
      }
    }
  };

  // ✅ Save user info including photo/signature
  const handleSave = async () => {
    if (!userId || !token) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName,
        email,
        phoneNumber,
        address: streetAddress,
        gender,
        dateOfBirth,
        nationalId,
        signatureUrl: signature,
        profilePhoto: profilePhoto,
      };

      const res = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        console.error('[EditProfile] ❌ Update Error:', json);
        Alert.alert('Error', json?.message || 'Failed to update profile.');
      } else {
        console.log('[EditProfile] ✅ Profile updated:', json);
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      }
    } catch (err) {
      console.error('[EditProfile] ❌ Save Error:', err);
      Alert.alert('Error', 'Something went wrong while saving changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#E5E5E5]">
      <Header title="Personal Info" showBackButton={true} />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ✅ Profile Photo */}
        <View className="items-center pt-8 pb-6 bg-white">
          <View className="relative">
            <Image
              source={{
                uri:
                  profilePhoto ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName || 'User'),
              }}
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-9 h-9 bg-[#0066FF] rounded-full items-center justify-center"
              style={{ borderWidth: 3, borderColor: '#E5E5E5' }}
              onPress={handleProfilePhotoUpload}
              disabled={isUploading && uploadingType === 'profile'}
            >
              {isUploading && uploadingType === 'profile' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="edit-2" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ User Details */}
        <View className="bg-white px-5 py-6">
          <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
          <InputField label="National ID" value={nationalId} onChangeText={setNationalId} />
          <InputField label="Email" value={email} onChangeText={setEmail} />
          <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
          <InputField label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} />
          <InputField label="Gender" value={gender} onChangeText={setGender} />
          <InputField label="Address" value={streetAddress} onChangeText={setStreetAddress} />
        </View>

        {/* ✅ Signature Upload */}
        <View className="bg-white px-5 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg text-black" style={{ fontFamily: 'Urbanist-Bold' }}>
              Signature
            </Text>
            {signature && (
              <TouchableOpacity
                className="flex-row items-center bg-red-500 px-3 py-2 rounded-lg"
                onPress={() => setSignature(null)}
              >
                <Feather name="trash-2" size={16} color="#FFF" />
                <Text className="text-white font-medium ml-2">Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className="border-2 border-dashed border-[#E5E5E5] rounded-lg min-h-[200px] items-center justify-center"
            onPress={() => setShowSignatureOptions(true)}
            disabled={isUploading && uploadingType === 'signature'}
          >
            {signature ? (
              <Image source={{ uri: signature }} style={{ width: '100%', aspectRatio: 2 }} resizeMode="contain" />
            ) : (
              <View className="items-center">
                {isUploading && uploadingType === 'signature' ? (
                  <ActivityIndicator color="#0066FF" />
                ) : (
                  <>
                    <Feather name="upload" size={36} color="#0066FF" />
                    <Text className="text-[#0066FF] font-semibold mt-2">Upload Signature</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Signature Source Modal */}
      <Modal visible={showSignatureOptions} transparent animationType="slide" onRequestClose={() => setShowSignatureOptions(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-bold text-black">Choose Signature Source</Text>
              <TouchableOpacity onPress={() => setShowSignatureOptions(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-[#E5E5E5]" onPress={() => handleSignatureUpload('camera')}>
              <Feather name="camera" size={20} color="#0066FF" />
              <Text className="ml-3 text-base">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4" onPress={() => handleSignatureUpload('gallery')}>
              <Feather name="image" size={20} color="#0066FF" />
              <Text className="ml-3 text-base">Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-6 py-4 rounded-lg border border-[#E5E5E5] items-center" onPress={() => setShowSignatureOptions(false)}>
              <Text className="text-base text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ✅ Save Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-5 border-t border-[#E5E5E5]">
        <TouchableOpacity
          className="bg-[#0066FF] py-4 rounded-lg items-center"
          onPress={handleSave}
          disabled={loading}
        >
          <Text className="text-base text-white font-bold">
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
