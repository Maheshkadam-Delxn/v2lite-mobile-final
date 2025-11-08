import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Inputfield from '../../components/Inputfield';

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('sandrew.ainsley@yourdomain.com');
  const navigation = useNavigation();

  const handleContinue = () => {
    console.log('Continue to OTP with email:', email);
    navigation.navigate('OTPVerification');
  };

  return (
    <View className="flex-1 bg-white">
      {/* StatusBar with dark content but white background */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Component */}
      <Header />
      
      {/* Light header area with dark text - reduced padding */}
      <View className="bg-white pt-6 pb-3 px-6">
        <Text className="text-gray-900 text-3xl font-bold mb-1">
          Reset your password
        </Text>
        <Text className="text-gray-600 text-base pt-2 leading-6">
          Please enter your email and we will send an
          OTP code in the next step to reset your
          password.
        </Text>
      </View>

      <View className="flex-1">
        <View className="flex-1 px-6" style={{ minHeight: height * 0.7 }}>
          <View
            className="flex-1 bg-white rounded-t-3xl shadow-lg border border-gray-100"
            style={{ elevation: 3 }}
          >
            <View className="p-6 flex-1 justify-between">
              {/* Email Input Section using Inputfield component */}
              <View className="flex-1">
                <Inputfield
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<MaterialIcons name="email" size={24} color="#9CA3AF" />}
                />
              </View>

              {/* Bottom section with button */}
              <View className="mt-auto">
                {/* Divider line above Continue button */}
                <View className="w-full h-px bg-gray-200 mb-6" />

                {/* Continue Button */}
                <TouchableOpacity
                  className="bg-blue-600 rounded-2xl items-center shadow-lg"
                  style={{ height: 56 }}
                  onPress={handleContinue}
                >
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-base font-semibold">Continue</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ResetPasswordScreen;