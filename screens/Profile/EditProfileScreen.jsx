import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
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

  const handleSave = () => {
    // Handle save action
    console.log('Save pressed')
    // You can add your save logic here
    navigation.goBack() // Go back after saving
  }

  return (
    <View className="flex-1 bg-[#E5E5E5]">
      {/* Header */}
      <Header 
        title="Personal Info" 
        showBackButton={true}
        rightIcon="create-outline"
        onRightIconPress={() => {
          // Handle edit action
          console.log('Edit pressed')
        }}
      />

      <ScrollView 
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding for the button
      >
        {/* Profile Photo */}
        <View className="items-center pt-8 pb-6 bg-white">
          <View className="relative">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 w-9 h-9 bg-[#0066FF] rounded-full items-center justify-center"
              style={{ borderWidth: 3, borderColor: '#E5E5E5' }}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="bg-white px-5 py-6">
          <InputField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <InputField
            label="National ID Number"
            value={nationalId}
            onChangeText={setNationalId}
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            rightIcon={
              <TouchableOpacity className="ml-2">
                <Feather name="mail" size={20} color="#000000" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            leftIcon={
              <View className="flex-row items-center mr-2">
                <Text className="text-lg mr-1">🇺🇸</Text>
                <Feather name="chevron-down" size={16} color="#000000" />
              </View>
            }
            rightIcon={
              <TouchableOpacity className="ml-2">
                <Feather name="phone" size={20} color="#000000" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            rightIcon={
              <TouchableOpacity className="ml-2">
                <Feather name="calendar" size={20} color="#000000" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Gender"
            value={gender}
            onChangeText={setGender}
            isDropdown={true}
            rightIcon={
              <Feather name="chevron-down" size={20} color="#000000" />
            }
          />

          <InputField
            label="Street Address"
            value={streetAddress}
            onChangeText={setStreetAddress}
            placeholder=""
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-5 border-t border-[#E5E5E5]">
        <TouchableOpacity
          className="bg-[#0066FF] py-4 rounded-lg items-center"
          activeOpacity={0.7}
          onPress={handleSave}
        >
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-white"
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EditProfileScreen