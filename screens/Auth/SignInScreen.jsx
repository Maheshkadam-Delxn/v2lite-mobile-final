// import { View, Text, TouchableOpacity, StatusBar, Dimensions, Modal, Animated, ScrollView, Image } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { useNavigation } from '@react-navigation/native'
// import { MaterialIcons } from '@expo/vector-icons'
// import Header from '../../components/Header'
// import Inputfield from '../../components/Inputfield'
// import AsyncSorage from "../../context/AsyncStorage"
// const { width, height } = Dimensions.get('window')

// const SignInScreen = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [fadeAnim] = useState(new Animated.Value(0))
//   const [scaleAnim] = useState(new Animated.Value(0.8))

//   const navigation = useNavigation()

//   const handleLogin = () => {
//     if (email && password) {
//       setModalVisible(true)
//     } else {
//       console.log('Please fill in all fields')
//     }
//   }

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
//         navigation.navigate('ProjectListScreen')
//       }, 2000)

//       return () => clearTimeout(timer)
//     } else {
//       fadeAnim.setValue(0)
//       scaleAnim.setValue(0.8)
//     }
//   }, [modalVisible])

//   const handleSocialLogin = (provider) => {
//     console.log(`${provider} login attempted`)
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
//           >
//             <View className="flex-1 items-center justify-center">
//               <Text className="text-white text-base font-semibold">Sign in</Text>
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

        // Store token in AsyncStorage (assuming API returns { token: '...' })
        // Adjust 'token' key if your API uses a different field (e.g., 'accessToken')
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token)
        }

        // Optionally store user data if returned
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user))
        }

        // Store remembered email if checked
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedEmail', email)
        }

        setModalVisible(true)
      } else {
        const errorData = await response.json().catch(() => ({}))
        Alert.alert('Login Failed', errorData.message || 'Invalid email or password.')
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
        navigation.navigate('ProjectListScreen')
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
            Welcome back 👋
          </Text>
          <Text className="text-gray-600 text-base leading-6 pt-6">
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
              <Text className="text-gray-700 text-sm">Remember me</Text>
            </View>
            
            <TouchableOpacity onPress={handlereset}>
              <Text className="text-blue-600 text-sm font-medium">Forgot password?</Text>
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
              <Text className="text-white text-base font-semibold">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="w-full h-px bg-gray-200" />
        </View>

        {/* Sign Up Link - Directly on white background */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-center">
            <Text className="text-gray-500 text-sm">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text className="text-blue-600 text-sm font-medium">Sign up</Text>
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
              onPress={() => handleSocialLogin('Google')}
            >
              <MaterialIcons name="mail" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialLogin('Apple')}
            >
              <MaterialIcons name="phone-iphone" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialLogin('Facebook')}
            >
              <MaterialIcons name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
              onPress={() => handleSocialLogin('Twitter')}
            >
              <MaterialIcons name="chat" size={24} color="#1DA1F2" />
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