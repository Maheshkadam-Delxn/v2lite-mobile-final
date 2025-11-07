
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Onboarding'); 
    };

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* Logo */}
      <View className="mb-8">
        <Image
          source={require('../assets/logo.png')}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <Text
        className="text-[40px] leading-[48px] text-gray-900 text-center mb-1"
        style={{
          fontFamily: 'Urbanist-Bold',
        }}
      >
        Welcome to
      </Text>
      <Text
        className="text-[40px] leading-[48px] text-gray-900 text-center mb-6"
        style={{
          fontFamily: 'Urbanist-Bold',
        }}
      >
        SkyStruct
      </Text>

      {/* Subtitle */}
      <Text
        className="text-[18px] leading-[26px] text-gray-700 text-center mb-12"
        style={{
          fontFamily: 'Urbanist-Regular',
        }}
      >
        Smart Construction Management{'\n'}for Villas & Small Buildings.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        className="bg-[#0066FF] px-28 py-4 rounded-xl shadow-lg active:opacity-80"
        onPress={handleGetStarted}
        activeOpacity={0.8}
      >
        <Text
          className="text-white text-lg text-center"
          style={{
            fontFamily: 'Urbanist-Medium',
          }}
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;
