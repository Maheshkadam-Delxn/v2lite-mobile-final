import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google');
    // Implement Google login logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        {/* Logo */}
        <View className="items-center mb-12 mt-8">
          <Image
            source={require('../assets/logo.png')}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>

        {/* Welcome Text */}
        <Text
          className="text-gray-900 text-[28px] text-center mb-4 px-4"
          style={{ fontFamily: 'Urbanist-Bold' }}
        >
          Welcome to SkyStruct Lite
        </Text>

        {/* Description */}
        <Text
          className="text-gray-600 text-base text-center mb-12 px-6 leading-6"
          style={{ fontFamily: 'Urbanist-Regular' }}
        >
          Effortlessly oversee villa, interior, and building projects with seamless collaboration and real-time updates.
        </Text>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-[#0066FF] py-4 rounded-xl items-center mb-4"
          activeOpacity={0.8}
        >
          <Text
            className="text-white text-lg"
            style={{ fontFamily: 'Urbanist-SemiBold' }}
          >
            Sign up
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-[#E8F0FE] py-4 rounded-xl items-center mb-8"
          activeOpacity={0.8}
        >
          <Text
            className="text-[#0066FF] text-lg"
            style={{ fontFamily: 'Urbanist-SemiBold' }}
          >
            Sign in
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text
          className="text-gray-500 text-sm text-center mb-6"
          style={{ fontFamily: 'Urbanist-Regular' }}
        >
          or continue with
        </Text>

        {/* Google Login Button */}
        <View className="items-center">
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="w-14 h-14 items-center justify-center"
            activeOpacity={0.7}
          >
            <Image
              source={require('../assets/google.png')}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;