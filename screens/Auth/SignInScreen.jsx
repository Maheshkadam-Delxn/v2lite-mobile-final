
// // export default SignInScreen
// import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, Animated, ScrollView, Image, Alert } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { useNavigation } from '@react-navigation/native'
// import { MaterialIcons } from '@expo/vector-icons'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import Header from '../../components/Header'
// import Inputfield from '../../components/Inputfield'

// const { width, height } = Dimensions.get('window')

// const API_URL = 'https://skystruct-lite-backend.vercel.app/api/auth/login'

// const SignInScreen = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [fadeAnim] = useState(new Animated.Value(0))
//   const [scaleAnim] = useState(new Animated.Value(0.8))

//   const navigation = useNavigation()

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Incomplete Form', 'Please fill in all fields.')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         console.log('Login successful:', data)

//         // Log token if present (nested under data.data)
//         if (data.data?.token) {
//           console.log('Received token from API:', data.data.token)
//           await AsyncStorage.setItem('userToken', data.data.token)

//           // Verify token was saved correctly
//           const savedToken = await AsyncStorage.getItem('userToken')
//           console.log('Token saved in AsyncStorage:', savedToken)
//         } else {
//           console.log('No token field in response data.')
//         }

//         // Optionally store user data if returned
//         if (data.data?.user) {
//           await AsyncStorage.setItem('userData', JSON.stringify(data.data.user))
//           console.log('User data saved:', data.data.user)
//         }

//         // Store remembered email if checked
//         if (rememberMe) {
//           await AsyncStorage.setItem('rememberedEmail', email)
//           console.log('Email remembered:', email)
//         }

//         setModalVisible(true)
//       } else {
//         const errorData = await response.json().catch(() => ({}))
//         Alert.alert('Login Failed', errorData.message || 'Invalid email or password.')
//         console.log('Login failed, response status:', response.status, errorData)
//       }
//     } catch (error) {
//       console.error('Network error during login:', error)
//       Alert.alert('Network Error', 'Please check your connection and try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Load remembered email on mount
//   useEffect(() => {
//     const loadRememberedEmail = async () => {
//       try {
//         const rememberedEmail = await AsyncStorage.getItem('rememberedEmail')
//         if (rememberedEmail) {
//           setEmail(rememberedEmail)
//           setRememberMe(true)
//         }
//       } catch (error) {
//         console.error('Error loading remembered email:', error)
//       }
//     }
//     loadRememberedEmail()
//   }, [])

//   useEffect(() => {
//     if (modalVisible) {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           tension: 50,
//           friction: 7,
//           useNativeDriver: true,
//         }),
//       ]).start()

//       const timer = setTimeout(() => {
//         setModalVisible(false)
//         navigation.navigate('MainAppScreen')
//       }, 2000)

//       return () => clearTimeout(timer)
//     } else {
//       fadeAnim.setValue(0)
//       scaleAnim.setValue(0.8)
//     }
//   }, [modalVisible])

//   const handleSocialLogin = (provider) => {
//     console.log(`${provider} login attempted`)
//     // TODO: Implement social auth
//   }

//   const handlereset = () => navigation.navigate('ResetPassword')

//   return (
//     <View className="flex-1 bg-white">
//       {/* StatusBar with dark content but white background */}
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header Component */}
//       <Header />
      
//       <ScrollView 
//         className="flex-1" 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
//         {/* Header Section - Directly on white background */}
//         <View className="px-6 pt-6">
//           <Text className="text-gray-900 text-2xl font-bold mb-2">
//             Welcome back 👋
//           </Text>
//           <Text className="text-gray-600 text-base leading-6 pt-6">
//             Please enter your email & password to sign in.
//           </Text>
//         </View>

//         {/* Email Input - Directly on white background */}
//         <View className="px-6 mt-8 pt-6">
//           <Inputfield
//             label="Email"
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             icon={<MaterialIcons name="email" size={24} color="#9CA3AF" />}
//           />
//         </View>

//         {/* Password Input - Directly on white background */}
//         <View className="px-6 pt-6">
//           <Inputfield
//             label="Password"
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             icon={
//               <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 <MaterialIcons 
//                   name={showPassword ? "visibility" : "visibility-off"} 
//                   size={24} 
//                   color="#2563EB" 
//                 />
//               </TouchableOpacity>
//             }
//             onIconPress={() => setShowPassword(!showPassword)}
//           />
//         </View>

//         {/* Remember Me & Forgot Password - Directly on white background */}
//         <View className="px-6 mt-6">
//           <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center">
//               <TouchableOpacity
//                 className="mr-3"
//                 onPress={() => setRememberMe(!rememberMe)}
//               >
//                 <View
//                   className={`w-5 h-5 rounded border-2 items-center justify-center ${
//                     rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
//                   }`}
//                 >
//                   {rememberMe && (
//                     <MaterialIcons name="check" size={12} color="#FFFFFF" />
//                   )}
//                 </View>
//               </TouchableOpacity>
//               <Text className="text-gray-700 text-sm">Remember me</Text>
//             </View>
            
//             <TouchableOpacity onPress={handlereset}>
//               <Text className="text-blue-600 text-sm font-medium">Forgot password?</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Sign In Button - Directly on white background */}
//         <View className="px-6 mt-6">
//           <TouchableOpacity
//             className="bg-blue-600 rounded-2xl items-center shadow-lg"
//             style={{ height: 56 }}
//             onPress={handleLogin}
//             disabled={isLoading}
//           >
//             <View className="flex-1 items-center justify-center">
//               <Text className="text-white text-base font-semibold">
//                 {isLoading ? 'Signing in...' : 'Sign in'}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Divider - Directly on white background */}
//         <View className="px-6 mt-6">
//           <View className="w-full h-px bg-gray-200" />
//         </View>

//         {/* Sign Up Link - Directly on white background */}
//         <View className="px-6 mt-6">
//           <View className="flex-row justify-center">
//             <Text className="text-gray-500 text-sm">Don't have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//               <Text className="text-blue-600 text-sm font-medium">Sign up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Social Login Divider - Directly on white background */}
//         <View className="px-6 mt-6">
//           <View className="flex-row items-center w-full">
//             <View className="flex-1 h-px bg-gray-300" />
//             <Text className="text-sm font-medium text-gray-600 mx-4">
//               or continue with
//             </Text>
//             <View className="flex-1 h-px bg-gray-300" />
//           </View>
//         </View>

//         {/* Social Login Buttons - Directly on white background */}
//         <View className="px-6 mt-6">
//           <View className="flex-row justify-between w-full px-4">
//             <TouchableOpacity
//               className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
//               onPress={() => handleSocialLogin('Google')}
//             >
//               <MaterialIcons name="mail" size={24} color="#DB4437" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
//               onPress={() => handleSocialLogin('Apple')}
//             >
//               <MaterialIcons name="phone-iphone" size={24} color="#000000" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
//               onPress={() => handleSocialLogin('Facebook')}
//             >
//               <MaterialIcons name="facebook" size={24} color="#1877F2" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
//               onPress={() => handleSocialLogin('Twitter')}
//             >
//               <MaterialIcons name="chat" size={24} color="#1DA1F2" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Success Modal - Updated to match CreatePasswordScreen style */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="none"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <Animated.View
//             style={{
//               opacity: fadeAnim,
//               transform: [{ scale: scaleAnim }],
//             }}
//           >
//             <View
//               style={{
//                 width: 340,
//                 height: 500,
//                 backgroundColor: '#fff',
//                 borderRadius: 30,
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 elevation: 15,
//                 zIndex: 999,
//                 overflow: 'hidden',
//                 paddingHorizontal: 24,
//                 paddingTop: 50,
//               }}
//             >
//               {/* Success Image - Using signsuccess.png */}
//               <Image
//                 source={require('../../assets/signsuccess.png')}
//                 style={{
//                   width: 160,
//                   height: 160,
//                   resizeMode: 'contain',
//                   marginBottom: 30,
//                 }}
//               />

//               {/* Text Content */}
//               <Text
//                 style={{
//                   fontSize: 24,
//                   fontWeight: '700',
//                   color: '#235DFF',
//                   textAlign: 'center',
//                   marginBottom: 8,
//                 }}
//               >
//                 Sign In{'\n'}Successful!
//               </Text>

//               <Text
//                 style={{
//                   fontSize: 16,
//                   color: '#6B7280',
//                   textAlign: 'center',
//                   marginBottom: 4,
//                 }}
//               >
//                 Please wait...
//               </Text>

//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: '#9CA3AF',
//                   textAlign: 'center',
//                   marginTop: 20,
//                 }}
//               >
//                 You will be redirected to the homepage
//               </Text>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   )
// }

// export default SignInScreen

import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
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

        if (data.data?.token) {
          console.log('Received token from API:', data.data.token)
          await AsyncStorage.setItem('userToken', data.data.token)
          const savedToken = await AsyncStorage.getItem('userToken')
          console.log('Token saved in AsyncStorage:', savedToken)
        } else {
          console.log('No token field in response data.')
        }

        if (data.data?.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.data.user))
          console.log('User data saved:', data.data.user)
        }

        if (rememberMe) {
          await AsyncStorage.setItem('rememberedEmail', email)
          console.log('Email remembered:', email)
        }

        setModalVisible(true)
        setTimeout(() => {
          setModalVisible(false)
          navigation.navigate('MainAppScreen')
        }, 2000)
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

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login attempted`)
  }

  const handlereset = () => navigation.navigate('ResetPassword')

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Logo Section */}
        <View style={{ 
          alignItems: 'center', 
          paddingTop: 60,
          paddingBottom: 20
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: '#667EEA',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <MaterialIcons name="lock" size={40} color="#FFFFFF" />
          </View>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '800', 
            color: '#1A202C',
            marginBottom: 8 
          }}>
            Welcome Back
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#718096',
            textAlign: 'center',
            paddingHorizontal: 40,
            lineHeight: 24
          }}>
            Sign in to continue to your account
          </Text>
        </View>

        {/* Main Form Container */}
        <View style={{ 
          marginHorizontal: 24, 
          marginTop: 40 
        }}>
          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: '#2D3748', 
              marginBottom: 8,
              marginLeft: 4
            }}>
              Email Address
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F7FAFC',
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: '#E2E8F0',
              paddingHorizontal: 16,
              height: 56,
            }}>
              <MaterialIcons name="email" size={22} color="#A0AEC0" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Inputfield
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ fontSize: 15, color: '#2D3748' }}
                />
              </View>
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: '#2D3748', 
              marginBottom: 8,
              marginLeft: 4
            }}>
              Password
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F7FAFC',
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: '#E2E8F0',
              paddingHorizontal: 16,
              height: 56,
            }}>
              <MaterialIcons name="lock-outline" size={22} color="#A0AEC0" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Inputfield
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ fontSize: 15, color: '#2D3748' }}
                />
              </View>
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={{ padding: 4 }}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={22} 
                  color="#667EEA" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 28,
            paddingHorizontal: 4
          }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: rememberMe ? '#667EEA' : '#CBD5E0',
                  backgroundColor: rememberMe ? '#667EEA' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                {rememberMe && (
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={{ fontSize: 14, color: '#4A5568', fontWeight: '500' }}>
                Remember me
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handlereset} activeOpacity={0.7}>
              <Text style={{ fontSize: 14, color: '#667EEA', fontWeight: '600' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#667EEA',
              height: 56,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#667EEA',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 5,
              marginBottom: 24,
            }}
          >
            <Text style={{ 
              color: '#FFFFFF', 
              fontSize: 16, 
              fontWeight: '700',
              letterSpacing: 0.5
            }}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#718096', fontSize: 15 }}>
                Don't have an account? 
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('SignUp')} 
                activeOpacity={0.7}
              >
                <Text style={{ 
                  color: '#667EEA', 
                  fontSize: 15, 
                  fontWeight: '700', 
                  marginLeft: 4 
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginBottom: 28
          }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
            <Text style={{ 
              fontSize: 13, 
              fontWeight: '600', 
              color: '#A0AEC0', 
              marginHorizontal: 16,
              letterSpacing: 0.5
            }}>
              OR CONTINUE WITH
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
          </View>

          {/* Social Login Buttons */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center',
            gap: 16,
            marginBottom: 40
          }}>
            <TouchableOpacity
              onPress={() => handleSocialLogin('Google')}
              activeOpacity={0.7}
              style={{
                width: 70,
                height: 70,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <MaterialIcons name="mail" size={28} color="#DB4437" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSocialLogin('Apple')}
              activeOpacity={0.7}
              style={{
                width: 70,
                height: 70,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <MaterialIcons name="phone-iphone" size={28} color="#000000" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSocialLogin('Facebook')}
              activeOpacity={0.7}
              style={{
                width: 70,
                height: 70,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <MaterialIcons name="facebook" size={28} color="#1877F2" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSocialLogin('Twitter')}
              activeOpacity={0.7}
              style={{
                width: 70,
                height: 70,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                borderWidth: 1.5,
                borderColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <MaterialIcons name="chat" size={28} color="#1DA1F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.65)' 
        }}>
          <View
            style={{
              width: width * 0.85,
              maxWidth: 360,
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              alignItems: 'center',
              paddingVertical: 48,
              paddingHorizontal: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 10,
            }}
          >
            {/* Success Icon with Background */}
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#D1FAE5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#10B981',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MaterialIcons name="check" size={44} color="#FFFFFF" />
              </View>
            </View>

            {/* Text Content */}
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: '#1A202C',
                textAlign: 'center',
                marginBottom: 12,
                letterSpacing: 0.3
              }}
            >
              Login Successful!
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: '#718096',
                textAlign: 'center',
                lineHeight: 22,
                paddingHorizontal: 8
              }}
            >
              Redirecting you to your dashboard...
            </Text>

            {/* Loading Indicator */}
            <View style={{ 
              flexDirection: 'row', 
              marginTop: 24,
              gap: 8
            }}>
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: '#667EEA' 
              }} />
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: '#667EEA',
                opacity: 0.6 
              }} />
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: '#667EEA',
                opacity: 0.3 
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SignInScreen