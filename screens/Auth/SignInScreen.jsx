
import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, Animated, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../components/Header'
import Inputfield from '../../components/Inputfield'
const { width, height } = Dimensions.get('window')

const API_URL = 'https://skystruct-lite-backend.vercel.app/api/auth/login'

const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  const navigation = useNavigation()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Incomplete Form', 'Please fill in all fields.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)

        // Log token if present (nested under data.data)
        if (data.data?.token) {
          console.log('Received token from API:', data.data.token)
          await AsyncStorage.setItem('userToken', data.data.token)

          // Verify token was saved correctly
          const savedToken = await AsyncStorage.getItem('userToken')
          console.log('Token saved in AsyncStorage:', savedToken)
        } else {
          console.log('No token field in response data.')
        }

        // Optionally store user data if returned
        if (data.data?.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.data.user))
          console.log('User data saved:', data.data.user)
        }

        // Store remembered email if checked
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedEmail', email)
          console.log('Email remembered:', email)
        }

        setModalVisible(true)
      } else {
        const errorData = await response.json().catch(() => ({}))
        Alert.alert('Login Failed', errorData.message || 'Invalid email or password.')
        console.log('Login failed, response status:', response.status, errorData)
      }
    } catch (error) {
      console.error('Network error during login:', error)
      Alert.alert('Network Error', 'Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load remembered email on mount
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const rememberedEmail = await AsyncStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
          setEmail(rememberedEmail)
          setRememberMe(true)
        }
      } catch (error) {
        console.error('Error loading remembered email:', error)
      }
    }
    loadRememberedEmail()
  }, [])

  useEffect(() => {
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
      ]).start()

      const timer = setTimeout(() => {
        setModalVisible(false)
        navigation.navigate('MainAppScreen')
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      fadeAnim.setValue(0)
      scaleAnim.setValue(0.8)
    }
  }, [modalVisible])

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login attempted`)
    // TODO: Implement social auth
  }

  const handlereset = () => navigation.navigate('ResetPassword')

  return (
    <View className="flex-1 bg-white">
      {/* StatusBar with dark content but white background */}
      <StatusBar barStyle="light-content" backgroundColor="#ffffff" />
      
      {/* Header Component */}
      <Header />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Section - Directly on white background */}
        <View className="px-6 pt-6">
          <Text style={{ fontSize: 28, fontWeight: '600', color: '#000000', marginBottom: 12 }}>
            Welcome back 👋
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '400', color: '#6B7280', lineHeight: 22 }}>
            Please enter your email & password to sign in.
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

        {/* Remember Me & Forgot Password - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="mr-3"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}
                >
                  {rememberMe && (
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#374151' }}>
                Remember me
              </Text>
            </View>
            
            <TouchableOpacity onPress={handlereset}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563EB' }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button - Directly on white background */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            className="bg-blue-600 rounded-2xl items-center shadow-lg"
            style={{ height: 56 }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View className="flex-1 items-center justify-center">
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-center">
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#6B7280' }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563EB' }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Login Divider - Directly on white background */}
        <View className="px-6 mt-12">
          <View className="flex-row items-center w-full">
            <View className="flex-1 h-px bg-gray-300" />
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#6B7280', marginHorizontal: 16 }}>
              or continue with
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>
        </View>

        {/* Social Login Buttons - Directly on white background */}
      <View className="px-6 mt-6">
  <View className="flex-row justify-center w-full px-4">
    <TouchableOpacity
      className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
      onPress={() => handleSocialLogin('Google')}
    >
      <Image 
        source={require('../../assets/google.png')} 
        style={{ width: 24, height: 24 }} 
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
</View>
      </ScrollView>

      {/* Success Modal - Updated to match CreatePasswordScreen style */}
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
              {/* Success Image - Using signsuccess.png */}
              <Image
                source={require('../../assets/signsuccess.png')}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
              />

              {/* Text Content */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#235DFF',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Sign In{'\n'}Successful!
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
  )
}

export default SignInScreen