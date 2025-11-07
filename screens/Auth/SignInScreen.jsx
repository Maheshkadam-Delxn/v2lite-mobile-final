import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, ScrollView, Modal, Animated, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  const navigation = useNavigation()

  const handleLogin = () => {
    if (email && password) {
      setModalVisible(true)
      navigation.replace("MainTabs")
    } else {
      console.log('Please fill in all fields')
    }
  }

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
        navigation.navigate('Dashboard')
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      fadeAnim.setValue(0)
      scaleAnim.setValue(0.8)
    }
  }, [modalVisible])

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login attempted`)
  }

  const handlereset = () => navigation.navigate('ResetPassword')

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <View className="flex-1">
        <View className="flex-1 px-6 pt-6" style={{ minHeight: height }}>
          <View
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-6"
            style={{ elevation: 3 }}
          >
            <Text className="text-3xl font-medium text-gray-900 mb-3">
              Welcome back 👋
            </Text>
            <Text className="text-gray-500 text-base leading-6">
              Please enter your email & password to sign in.
            </Text>
          </View>

          <View
            className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100"
            style={{ elevation: 3, minHeight: height * 0.5 }}
          >
            <View className="p-6 flex-1">
              <View className="mb-6">
                <Text className="text-gray-800 text-base font-medium mb-3">Email</Text>
                <View
                  className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-200"
                  style={{ height: 56 }}
                >
                  <TextInput
                    className="flex-1 px-5 text-gray-800 text-base"
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View className="pr-4">
                    <View className="w-6 h-6 items-center justify-center">
                      <Text className="text-gray-400 text-lg">✉️</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-800 text-base font-medium mb-3">Password</Text>
                <View
                  className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-200"
                  style={{ height: 56 }}
                >
                  <TextInput
                    className="flex-1 px-5 text-gray-800 text-base"
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="pr-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                      <Text className="text-blue-600 text-xs font-bold">
                        {showPassword ? '🔓' : '🔒'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-8">
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
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text className="text-gray-700 text-sm">Remember me</Text>
                </View>
                
                <TouchableOpacity onPress={handlereset}>
                  <Text className="text-blue-600 text-sm font-medium">Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <View className="w-full h-px bg-gray-200 my-6" />

              <View className="flex-row justify-center mb-6">
                <Text className="text-gray-500 text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text className="text-blue-600 text-sm font-medium">Sign up</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center w-full mt-6 mb-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="font-urbanist text-sm font-medium text-gray-600 mx-4">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              <View className="flex-row justify-between w-full mb-8 px-4">
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
                  onPress={() => handleSocialLogin('Google')}
                >
                  <AntDesign name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
                  onPress={() => handleSocialLogin('Apple')}
                >
                  <AntDesign name="apple1" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
                  onPress={() => handleSocialLogin('Facebook')}
                >
                  <FontAwesome name="facebook" size={24} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-16 h-16 rounded-full items-center justify-center border border-gray-300 bg-white shadow-sm"
                  onPress={() => handleSocialLogin('Twitter')}
                >
                  <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                </TouchableOpacity>
              </View>

              <View className="w-full h-px bg-gray-200 mt-6" />

              <View className="mt-6">
                <TouchableOpacity
                  className="bg-blue-600 rounded-2xl items-center shadow-lg"
                  style={{ height: 56 }}
                  onPress={handleLogin}
                >
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-base font-semibold">Sign in</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

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
              <Image
                source={require('../../../assets/signsuccess.png')}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#235DFF',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Sign in Successful!
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
    </SafeAreaView>
  )
}

export default SignInScreen