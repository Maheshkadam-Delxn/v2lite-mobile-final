
import { View, Text, TouchableOpacity, StatusBar, TextInput, Modal, Animated, ScrollView, Alert, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';


const API_URL = `${process.env.BASE_API_URL}/api/auth/register`;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !email || !password || !agreeToTerms) {
      Alert.alert('Incomplete Form', 'Please fill in all fields and agree to the terms.');
      return;
    }

    setIsLoading(true);

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
        console.log('Signup successful:', data);
        setModalVisible(true);
      } else {
        const errorData = await response.json();
        Alert.alert('Signup Failed', errorData.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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
        navigation.navigate('SignIn');
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [modalVisible]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#ffffff" />
      
      <Header />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center',
          paddingHorizontal: 24, 
          paddingVertical: 40 
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

        {/* Header Section */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '700', 
            color: '#000000', 
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Create account
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#6B7280', 
            lineHeight: 24,
            textAlign: 'center',
          }}>
            Please enter your details to create an account.
          </Text>
        </View>

        {/* Name Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: 8,
          }}>
            Full Name
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#F9FAFB', 
            borderRadius: 12, 
            borderWidth: 1.5, 
            borderColor: nameFocused ? '#2563EB' : '#E5E7EB', 
            paddingHorizontal: 16, 
            height: 52 
          }}>
            <MaterialIcons name="person" size={20} color={nameFocused ? '#2563EB' : '#9CA3AF'} />
            <TextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              style={{ 
                flex: 1, 
                marginLeft: 12, 
                fontSize: 15, 
                color: '#111827',
              }}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: 8,
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

        {/* Terms Agreement */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <TouchableOpacity
              style={{ marginRight: 12, marginTop: 2 }}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: agreeToTerms ? '#2563EB' : '#D1D5DB',
                  backgroundColor: agreeToTerms ? '#2563EB' : '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {agreeToTerms && (
                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: '#374151', flex: 1, lineHeight: 20 }}>
              I agree to Skystruct{' '}
              <Text style={{ color: '#2563EB', fontWeight: '600' }}>
                Terms, & Privacy Policy
              </Text>
            </Text>
          </View>
        </View>

        {/* Sign Up Button */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#2563EB',
              height: 52,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.7 : 1
            }}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: '#FFFFFF',
            }}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
          <Text style={{ 
            fontSize: 14, 
            color: '#6B7280',
          }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: '#2563EB',
            }}>
              Sign in
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
          onPress={() => handleSocialSignup('Google')}
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
          }}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal - Updated to match SignIn screen style */}
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
                backgroundColor: '#10B981', 
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
              }}>
                Success!
              </Text>

              <Text style={{ 
                fontSize: 15, 
                color: '#6B7280', 
                textAlign: 'center',
              }}>
                Account created successfully
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}