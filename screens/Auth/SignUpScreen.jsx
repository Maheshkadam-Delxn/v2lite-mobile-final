
import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, Animated, ScrollView, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import Inputfield from '../../components/Inputfield';

const { width, height } = Dimensions.get('window');
const API_URL = 'https://skystruct-lite-backend.vercel.app/api/auth/register';

export default function SignUpScreen() {
  const [name, setName] = useState(''); // Added name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state for API call
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !email || !password || !agreeToTerms) {
      Alert.alert('Incomplete Form', 'Please fill in all fields and agree to the terms.');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data); // Log response for debugging
        setModalVisible(true);
      } else {
        const errorData = await response.json();
        Alert.alert('Signup Failed', errorData.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`${provider} signup attempted`);
    // TODO: Implement social auth (e.g., via Expo AuthSession or Firebase)
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
        navigation.navigate('SignIn'); // Updated to navigate to SignIn on success
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
            Please enter your details to create an account.
          </Text>
        </View>

        {/* Name Input - Added new input field */}
        <View className="px-6 mt-8 pt-6">
          <Inputfield
            label="Full Name"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            icon={<MaterialIcons name="person" size={24} color="#9CA3AF" />}
          />
        </View>

        {/* Email Input - Adjusted gap to match email-password spacing */}
        <View className="px-6 pt-6">
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
        <View className="px-6 pt-6">
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
        <View className="px-6 mt-6 pt-6">
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
            disabled={isLoading} // Disable during loading
          >
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-base font-semibold">
                {isLoading ? 'Signing up...' : 'Sign up'}
              </Text>
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

      {/* Success Modal - Updated to match SignInScreen style with Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View
              style={{
                width: 340,
                height: 500,
                backgroundColor: '#fff',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'flex-start',
                elevation: 15,
                zIndex: 999,
                overflow: 'hidden',
                paddingHorizontal: 24,
                paddingTop: 50,
              }}
            >
              {/* Success Image - Using signsuccess.png (same as SignIn) */}
              <Image
                source={require('../../assets/signsuccess.png')}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
              />

              {/* Text Content - Updated for SignUp */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#235DFF',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Sign Up{'\n'}Successful!
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                Please wait...
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#9CA3AF',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                You will be redirected to the homepage
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}