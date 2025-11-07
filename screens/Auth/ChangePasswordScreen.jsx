import { View, Text, TouchableOpacity, StatusBar, TextInput, Modal, Animated, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'

const { width, height } = Dimensions.get('window')

const CreatePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))
  const navigation = useNavigation()

  const handleContinue = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      console.log('New Password:', newPassword)
      console.log('Confirm Password:', confirmPassword)
      setShowSuccessModal(true)
    }
  }

  useEffect(() => {
    if (showSuccessModal) {
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
        setShowSuccessModal(false)
        // navigation.navigate('Homepage')
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      fadeAnim.setValue(0)
      scaleAnim.setValue(0.8)
    }
  }, [showSuccessModal])

  // Check if passwords match and are not empty
  const isContinueEnabled = newPassword && confirmPassword && newPassword === confirmPassword

  return (
    <View className="flex-1 bg-white">
      {/* StatusBar with dark content but white background */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Component */}
      <Header />
      
      {/* Light header area with dark text - matching OTPVerificationScreen */}
      <View className="bg-white pt-6 pb-3 px-6">
        <Text className="text-gray-900 text-3xl font-bold mb-1">
          Create New Password
        </Text>
        <Text className="text-gray-600 text-base pt-2 leading-6">
          Create your new password. If you forget it, then{'\n'}
          you have to do forgot password.
        </Text>
      </View>

      <View className="flex-1">
        <View className="flex-1 px-6" style={{ minHeight: height * 0.7 }}>
          <View
            className="flex-1 bg-white rounded-t-3xl shadow-lg border border-gray-100"
            style={{ elevation: 3 }}
          >
            <View className="p-6 flex-1 justify-between">
              {/* Password Input Section */}
              <View className="flex-1">
                {/* New Password Input */}
                <View className="mb-6">
                  <Text className="text-gray-800 text-base font-medium mb-3">New Password</Text>
                  <View
                    className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-200"
                    style={{ height: 56 }}
                  >
                    <TextInput
                      className="flex-1 px-5 text-gray-800 text-base"
                      placeholder="Enter new password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                      className="pr-4"
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                        <Text className="text-blue-600 text-xs font-bold">
                          {showNewPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View className="mb-6">
                  <Text className="text-gray-800 text-base font-medium mb-3">Confirm New Password</Text>
                  <View
                    className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-200"
                    style={{ height: 56 }}
                  >
                    <TextInput
                      className="flex-1 px-5 text-gray-800 text-base"
                      placeholder="Confirm new password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      className="pr-4"
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                        <Text className="text-blue-600 text-xs font-bold">
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Password match validation */}
                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text className="text-red-500 text-sm mt-2">
                      Passwords do not match
                    </Text>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <Text className="text-green-500 text-sm mt-2">
                      Passwords match
                    </Text>
                  )}
                </View>
              </View>

              {/* Bottom section with button */}
              <View className="mt-auto">
                {/* Divider line above Continue button */}
                <View className="w-full h-px bg-gray-200 mb-6" />

                {/* Continue Button */}
                <TouchableOpacity
                  className={`rounded-2xl items-center shadow-lg ${isContinueEnabled ? 'bg-blue-600' : 'bg-blue-300'}`}
                  style={{ height: 56 }}
                  onPress={handleContinue}
                  disabled={!isContinueEnabled}
                >
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-base font-semibold">Continue</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowSuccessModal(false)}
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
              {/* Success Image */}
              {/* <Image
                source={require('../../../assets/resetsuccesful.png')}
                style={{
                  width: 160,
                  height: 160,
                  resizeMode: 'contain',
                  marginBottom: 30,
                }}
              /> */}

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
                Reset Password{'\n'}Successful!
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
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

export default CreatePasswordScreen