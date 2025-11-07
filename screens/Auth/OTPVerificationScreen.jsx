import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  Dimensions, 
  TextInput 
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(55);
  const navigation = useNavigation();

  const inputs = useRef([]);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(55);
      console.log('Resending OTP code...');
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      console.log('Verifying OTP:', enteredOtp);
      navigation.navigate('CreatePassword');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* StatusBar with dark content but white background */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Component */}
      <Header />
      
      {/* Light header area with dark text - matching ResetPasswordScreen */}
      <View className="bg-white pt-6 pb-3 px-6">
        <Text className="text-gray-900 text-3xl font-bold mb-1">
          OTP code verification
        </Text>
        <Text className="text-gray-600 text-base pt-2 leading-6">
          We have sent an OTP code to your email 
          <Text className="font-semibold"> san******ley@yourdomain.com</Text>. 
          Enter the OTP code below to verify.
        </Text>
      </View>

      <View className="flex-1">
        <View className="flex-1 px-6" style={{ minHeight: height * 0.7 }}>
          <View
            className="flex-1 bg-white rounded-t-3xl shadow-lg border border-gray-100"
            style={{ elevation: 3 }}
          >
            <View className="p-6 flex-1 justify-between">
              {/* OTP Input Section */}
              <View className="flex-1">
                <Text className="text-gray-800 text-base font-medium mb-6 text-center">
                  Enter OTP Code
                </Text>
                
                {/* OTP Boxes */}
                <View className="flex-row justify-between mb-8 px-2">
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputs.current[index] = ref)}
                      value={digit}
                      maxLength={1}
                      keyboardType="numeric"
                      className="w-16 h-16 rounded-2xl border-2 border-gray-300 bg-gray-50 text-center text-2xl text-gray-800 font-bold"
                      onChangeText={(value) => {
                        const newOtp = [...otp];
                        newOtp[index] = value;
                        setOtp(newOtp);

                        if (value && index < otp.length - 1) {
                          inputs.current[index + 1].focus();
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                          inputs.current[index - 1].focus();
                        }
                      }}
                    />
                  ))}
                </View>

                {/* Resend Section */}
                <View className="items-center">
                  <Text className="text-gray-500 text-sm mb-2 font-medium">
                    Didn't receive email?
                  </Text>

                  {timer > 0 ? (
                    <Text className="text-sm text-gray-600 font-medium">
                      You can resend code in{" "}
                      <Text className="text-blue-600 font-bold">
                        {timer} s
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendCode}>
                      <Text className="text-sm text-blue-600 font-medium">
                        Resend code
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Bottom section with button */}
              <View className="mt-auto">
                {/* Divider line above Verify button */}
                <View className="w-full h-px bg-gray-200 mb-6" />

                {/* Verify Button */}
                <TouchableOpacity
                  className="bg-blue-600 rounded-2xl items-center shadow-lg"
                  style={{ height: 56 }}
                  onPress={handleVerify}
                >
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-base font-semibold">Verify</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;