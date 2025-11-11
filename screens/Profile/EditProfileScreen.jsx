import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import Header from '../../components/Header'
import InputField from '../../components/Inputfield'
 
const EditProfileScreen = () => {
  const navigation = useNavigation()
  const [fullName, setFullName] = useState('Arun Mishra')
  const [nationalId, setNationalId] = useState('3637 4738 4899')
  const [email, setEmail] = useState('arun.mishra@gmail.com')
  const [phoneNumber, setPhoneNumber] = useState('+1 111 467 378 399')
  const [dateOfBirth, setDateOfBirth] = useState('12/27/1995')
  const [gender, setGender] = useState('Male')
  const [streetAddress, setStreetAddress] = useState('')
  const [signature, setSignature] = useState(null)
  const [showSignatureOptions, setShowSignatureOptions] = useState(false)
 
  const handleSave = () => {
    navigation.goBack()
  }
 
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status === 'granted'
  }
 
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return status === 'granted'
  }
 
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert('Permission required', 'Camera permission is required.')
      return
    }
 
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 2],
      quality: 0.8,
    })
 
    if (!result.canceled) {
      setSignature(result.assets[0].uri)
      setShowSignatureOptions(false)
    }
  }
 
  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission()
    if (!hasPermission) {
      Alert.alert('Permission required', 'Gallery permission is required.')
      return
    }
 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 2],
      quality: 0.8,
    })
 
    if (!result.canceled) {
      setSignature(result.assets[0].uri)
      setShowSignatureOptions(false)
    }
  }
 
  const handleSignatureUploadPress = () => {
    setShowSignatureOptions(true)
  }
 
  const handleRemoveSignature = () => {
    setSignature(null)
  }
 
  return (
    <View className="flex-1 bg-[#E5E5E5]">
      <Header title="Personal Info" showBackButton={true} />
 
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="items-center pt-8 pb-6 bg-white">
          <View className="relative">
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} className="w-28 h-28 rounded-full" />
            <TouchableOpacity className="absolute bottom-0 right-0 w-9 h-9 bg-[#0066FF] rounded-full items-center justify-center" style={{ borderWidth: 3, borderColor: '#E5E5E5' }}>
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
 
        <View className="bg-white px-5 py-6">
          <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
          <InputField label="National ID Number" value={nationalId} onChangeText={setNationalId} />
          <InputField label="Email" value={email} onChangeText={setEmail} rightIcon={<Feather name="mail" size={20} color="#000" />} />
          <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />
          <InputField label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} rightIcon={<Feather name="calendar" size={20} color="#000" />} />
          <InputField label="Gender" value={gender} onChangeText={setGender} isDropdown={true} rightIcon={<Feather name="chevron-down" size={20} color="#000" />} />
          <InputField label="Street Address" value={streetAddress} onChangeText={setStreetAddress} />
        </View>
 
        <View className="bg-white px-5 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg text-black" style={{ fontFamily: 'Urbanist-Bold' }}>Signature</Text>
            {signature && (
              <TouchableOpacity className="flex-row items-center bg-red-500 px-3 py-2 rounded-lg" onPress={handleRemoveSignature}>
                <Feather name="trash-2" size={16} color="#FFF" />
                <Text className="text-white font-medium ml-2">Remove Signature</Text>
              </TouchableOpacity>
            )}
          </View>
 
          <View className="border-2 border-dashed border-[#E5E5E5] rounded-lg min-h-[200px] overflow-hidden items-center justify-center relative">
            {/* Field Label Inside Box */}
            <View className="absolute top-2 left-2 flex-row items-center">
              <Feather name="edit" size={16} color="#0066FF" />
              <Text className="text-sm text-gray-600 ml-1">Upload Signature</Text>
            </View>
            {signature ? (
              <View className="w-full items-center justify-center py-4">
                <Image
                  source={{ uri: signature }}
                  style={{ width: '100%', aspectRatio: 2 }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <TouchableOpacity className="w-full h-full min-h-[200px] items-center justify-center" onPress={handleSignatureUploadPress}>
                <View className="items-center justify-center mb-3">
                  <Feather name="upload" size={36} color="#0066FF" />
                </View>
                <Text className="text-base text-[#0066FF] font-semibold mb-1 text-center">Upload Signature</Text>
                <Text className="text-sm text-gray-500 text-center">Tap here to upload your signature</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
 
      <Modal visible={showSignatureOptions} transparent animationType="slide" onRequestClose={() => setShowSignatureOptions(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg text-black" style={{ fontFamily: 'Urbanist-Bold' }}>Choose Signature Source</Text>
              <TouchableOpacity onPress={() => setShowSignatureOptions(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
 
            <TouchableOpacity className="flex-row items-center py-4 border-b border-[#E5E5E5]" onPress={openCamera}>
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Feather name="camera" size={20} color="#0066FF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-black">Take Photo</Text>
                <Text className="text-sm text-gray-500">Capture your signature</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
 
            <TouchableOpacity className="flex-row items-center py-4" onPress={openGallery}>
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Feather name="image" size={20} color="#0066FF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-black">Choose from Gallery</Text>
                <Text className="text-sm text-gray-500">Select your signature</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
 
            <TouchableOpacity className="mt-6 py-4 rounded-lg border border-[#E5E5E5] items-center" onPress={() => setShowSignatureOptions(false)}>
              <Text className="text-base font-medium text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-5 border-t border-[#E5E5E5]">
        <TouchableOpacity className="bg-[#0066FF] py-4 rounded-lg items-center" onPress={handleSave}>
          <Text className="text-base text-white" style={{ fontFamily: 'Urbanist-Bold' }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
 
export default EditProfileScreen