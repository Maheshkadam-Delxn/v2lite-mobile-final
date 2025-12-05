import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'https://skystruct-lite-backend.vercel.app/api/auth/verify-client';
const API_URL = `${process.env.BASE_API_URL}/api/auth/verify-client`;
const NewClientPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  // Get email from previous screen or route params
  const email = route.params?.email || '';

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Password Requirements',
        'Password must contain:\n• Minimum 8 characters\n• At least one uppercase letter\n• At least one lowercase letter\n• At least one number\n• At least one special character'
      );
      return;
    }

    setIsLoading(true);
console.log("Submitting:", {
  email: email,
  newPassword: newPassword,
  confirmPassword: confirmPassword,
});

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: newPassword,
         
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Password set successfully:', data);

        Alert.alert(
          'Success',
          'Your password has been set successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SignIn')
            }
          ]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Error', errorData.message || 'Failed to set new password. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 40
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 40 }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ 
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
            <Text style={{ marginLeft: 8, color: '#2563EB', fontSize: 16 }}>
              Back
            </Text>
          </TouchableOpacity>

          <Text style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#000000',
            marginBottom: 8,
          }}>
            Set New Password
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#6B7280',
            lineHeight: 24,
          }}>
            Create a new password for your account
          </Text>
        </View>

        {/* Email Display (if available) */}
        {email ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#111827',
              marginBottom: 8,
            }}>
              Account Email
            </Text>
            <View style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: '#E5E7EB',
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}>
              <Text style={{
                fontSize: 15,
                color: '#111827',
                fontWeight: '500',
              }}>
                {email}
              </Text>
            </View>
          </View>
        ) : null}

        {/* New Password Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 8,
          }}>
            New Password
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: newPasswordFocused ? '#2563EB' : '#E5E7EB',
            paddingHorizontal: 16,
            height: 52
          }}>
            <MaterialIcons 
              name="lock" 
              size={20} 
              color={newPasswordFocused ? '#2563EB' : '#9CA3AF'} 
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showNewPassword}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 15,
                color: '#111827',
              }}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <MaterialIcons
                name={showNewPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 8,
          }}>
            Confirm New Password
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: confirmPasswordFocused ? '#2563EB' : '#E5E7EB',
            paddingHorizontal: 16,
            height: 52
          }}>
            <MaterialIcons 
              name="lock-outline" 
              size={20} 
              color={confirmPasswordFocused ? '#2563EB' : '#9CA3AF'} 
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 15,
                color: '#111827',
              }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <View style={{
          backgroundColor: '#F0F9FF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 32,
          borderLeftWidth: 4,
          borderLeftColor: '#2563EB'
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#2563EB',
            marginBottom: 8,
          }}>
            Password Requirements:
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#6B7280',
            lineHeight: 18,
          }}>
            • Minimum 8 characters{"\n"}
            • At least one uppercase letter{"\n"}
            • At least one lowercase letter{"\n"}
            • At least one number{"\n"}
            • At least one special character
          </Text>
        </View>

        {/* Set Password Button */}
        <TouchableOpacity
          onPress={handleSetNewPassword}
          disabled={isLoading}
          activeOpacity={0.9}
          style={{
            backgroundColor: '#2563EB',
            height: 52,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            opacity: isLoading ? 0.7 : 1,
            flexDirection: 'row',
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" style={{ marginRight: 8 }} />
          ) : null}
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
          }}>
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ModernSignInScreen')}
          disabled={isLoading}
          style={{
            height: 52,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#E5E7EB',
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#374151',
          }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewClientPassword;