import { View, Text, TouchableOpacity, StatusBar, TextInput, Modal, Animated, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../components/Header'
 
//const API_URL = 'https://skystruct-lite-backend.vercel.app/api/auth/login'
console.log("jjnhj",process.env.NEXT_PUBLIC_BASE_API_URL);
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/login`;
 
const ModernSignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
 
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
 
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
 if (response.status === 403) {
   
    
   
 navigation.navigate("NewClientPassword", { email });
 
    return; // stop further execution
  }
      if (response.ok) {
        const data = await response.json()
        console.log('Login successful:', data)
 
        if (data.data?.token) {
          await AsyncStorage.setItem('userToken', data.data.token)
        }
 
        if (data.data?.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.data.user))
        }
 
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedEmail', email)
        }
 
        setModalVisible(true)
        setTimeout(() => {
          setModalVisible(false)
          if (data.data.user.role === "admin") {
            navigation.navigate('MainApp');
          } else {
        navigation.navigate('ClientApp');
          }
        }, 2000)
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
useEffect(() => {
  const checkStorage = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log("🔍 TOKEN ON SCREEN LOAD on splash screen:", token);
 
    const user = await AsyncStorage.getItem('userData');
    console.log("🔍 USER ON SCREEN LOAD on splash screen:", user);
     const userData = JSON.parse(user);
    if(userData.role=="admin"){
       navigation.navigate('MainApp');
    }else{
      navigation.navigate('ClientApp');
    }
  };
 
  checkStorage();
}, []);
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
    } else {
      fadeAnim.setValue(0)
      scaleAnim.setValue(0.9)
    }
  }, [modalVisible])
 
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Header/>
      <StatusBar barStyle="light-content" backgroundColor="#ffffff" />
 
     
<ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20
  }}
>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>
 
        {/* Header */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#000000',
            marginBottom: 8,
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Welcome back
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#6B7280',
            lineHeight: 24,
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Sign in to your account
          </Text>
        </View>
 
        {/* Email Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 8,
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Email
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: emailFocused ? '#2563EB' : '#E5E7EB',
            paddingHorizontal: 16,
            height: 52
          }}>
            <MaterialIcons name="email" size={20} color={emailFocused ? '#2563EB' : '#9CA3AF'} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 15,
                color: '#111827',
                fontFamily: 'Inter', // Add your font family if needed
              }}
            />
          </View>
        </View>
 
        {/* Password Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 8,
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Password
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: passwordFocused ? '#2563EB' : '#E5E7EB',
            paddingHorizontal: 16,
            height: 52
          }}>
            <MaterialIcons name="lock" size={20} color={passwordFocused ? '#2563EB' : '#9CA3AF'} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 15,
                color: '#111827',
                fontFamily: 'Inter', // Add your font family if needed
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
          </View>
        </View>
 
        {/* Remember Me & Forgot Password */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: rememberMe ? '#2563EB' : '#D1D5DB',
              backgroundColor: rememberMe ? '#2563EB' : '#ffffff',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {rememberMe && (
                <MaterialIcons name="check" size={14} color="#ffffff" />
              )}
            </View>
            <Text style={{
              marginLeft: 8,
              fontSize: 14,
              color: '#374151',
              fontFamily: 'Inter', // Add your font family if needed
            }}>
              Remember me
            </Text>
          </TouchableOpacity>
         
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#2563EB',
              fontFamily: 'Inter', // Add your font family if needed
            }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
 
        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.9}
          style={{
            backgroundColor: '#2563EB',
            height: 52,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            opacity: isLoading ? 0.7 : 1
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>
 
        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#2563EB',
              fontFamily: 'Inter', // Add your font family if needed
            }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
 
        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          <Text style={{
            marginHorizontal: 16,
            fontSize: 13,
            color: '#9CA3AF',
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
        </View>
 
        {/* Social Login */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            borderRadius: 12,
            backgroundColor: '#ffffff',
            borderWidth: 1.5,
            borderColor: '#E5E7EB'
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/google.png')}
            style={{ width: 20, height: 20, marginRight: 12 }}
            resizeMode="contain"
          />
          <Text style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#374151',
            fontFamily: 'Inter', // Add your font family if needed
          }}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </ScrollView>
 
      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View style={{
              width: 300,
              backgroundColor: '#ffffff',
              borderRadius: 24,
              alignItems: 'center',
              padding: 40
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#0066FF',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24
              }}>
                <MaterialIcons name="check" size={48} color="#ffffff" />
              </View>
 
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#111827',
                textAlign: 'center',
                marginBottom: 8,
                fontFamily: 'Inter', // Add your font family if needed
              }}>
                Success!
              </Text>
 
              <Text style={{
                fontSize: 15,
                color: '#6B7280',
                textAlign: 'center',
                fontFamily: 'Inter', // Add your font family if needed
              }}>
                Redirecting to home...
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}
 
export default ModernSignInScreen
 