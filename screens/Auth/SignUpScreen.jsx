import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, Animated, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Inputfield from '../../components/Inputfield';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const navigation = useNavigation();

  const handleSignup = () => {
    if (email && password && agreeToTerms) {
      setModalVisible(true);
      // navigation.replace("MainTabs");
    } else {
      console.log('Please fill in all fields and agree to terms');
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`${provider} signup attempted`);
  };

  React.useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Dashboard');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [modalVisible]);

  return (
    <View className="flex-1 bg-white">
      {/* StatusBar with dark content but white background */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Component */}
      <Header />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Section - Directly on white background */}
        <View className="px-6 pt-6">
          <Text className="text-gray-900 text-2xl font-bold mb-2">
            Hello there 👋
          </Text>
          <Text className="text-gray-600 text-base leading-6 pt-6">
            Please enter your email & password to create an account.
          </Text>
        </View>

        {/* Email Input - Directly on white background */}
        <View className="px-6 mt-8 pt-6">
          <Inputfield
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<MaterialIcons name="email" size={24} color="#9CA3AF" />}
          />
        </View>

        {/* Password Input - Directly on white background */}
        <View className="px-6  pt-6">
          <Inputfield
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color="#2563EB" 
                />
              </TouchableOpacity>
            }
            onIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        {/* Terms Agreement - Directly on white background */}
        <View className="px-6 mt- pt-6">
          <View className="flex-row items-start">
            <TouchableOpacity
              className="mr-3 mt-1"
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  agreeToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
              >
                {agreeToTerms && (
                  <MaterialIcons name="check" size={12} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text className="text-gray-700 text-sm flex-1">
              I agree to Skystruct <Text className="text-blue-600 font-medium">Terms, & Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Sign Up Button - Directly on white background */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className="bg-blue-600 rounded-2xl items-center shadow-lg"
            style={{ height: 56 }}
            onPress={handleSignup}
          >
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-base font-semibold">Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="w-full h-px bg-gray-200" />
        </View>

        {/* Sign In Link - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-center">
            <Text className="text-gray-500 text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text className="text-blue-600 text-sm font-medium">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Login Divider - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center w-full">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="text-sm font-medium text-gray-600 mx-4">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>
        </View>

        {/* Social Login Buttons - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between w-full px-4">
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialSignup('Google')}
            >
              <MaterialIcons name="mail" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialSignup('Apple')}
            >
              <MaterialIcons name="phone-iphone" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialSignup('Facebook')}
            >
              <MaterialIcons name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialSignup('Twitter')}
            >
              <MaterialIcons name="chat" size={24} color="#1DA1F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View
              style={{
                width: 320,
                height: 420,
                backgroundColor: '#fff',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'flex-start',
                elevation: 15,
                overflow: 'hidden',
                paddingHorizontal: 24,
                paddingTop: 60,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#235DFF',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Sign up Successful!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 6,
                }}
              >
                Please wait...
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#6B7280',
                  textAlign: 'center',
                }}
              >
                You will be directed to the homepage.
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}