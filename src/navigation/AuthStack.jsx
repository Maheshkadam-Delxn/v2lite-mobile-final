import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash1 from '../screens/Auth/SplashScreen';
import Onboarding from '../screens/Auth/OnboardingScreen';
import Welcome from '../screens/Auth/WelcomeScreen';
import SignIn from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';
import CreatePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import NewClientPassword from '../screens/Auth/NewClientPassword';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash1" component={Splash1} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="NewClientPassword" component={NewClientPassword} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
    </Stack.Navigator>
);

export default AuthStack;
