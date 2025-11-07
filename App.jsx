
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View, Platform } from 'react-native'; // Removed StatusBar import
import { StatusBar } from 'expo-status-bar'; // ✅ New import

// Your screens (unchanged)
import Splash1 from './screens/Auth/SplashScreen';
import Onboarding from './screens/Auth/OnboardingScreen';
import Welcome from './screens/Auth/WelcomeScreen';
import SignIn from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';

import "./global.css";

const Stack = createNativeStackNavigator();

// SafeAreaView wrapper (unchanged for now)
const SafeAreaWrapper = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {children}
    </SafeAreaView>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaWrapper>
        {/* ✅ Expo StatusBar: Solid blue bg, light text; handles Android translucency */}
        <StatusBar 
          style="dark" 
          backgroundColor="blue"
          networkActivityIndicatorVisible={false} // Optional: Hides spinner if not needed
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash1"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash1" component={Splash1} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaWrapper>
    </SafeAreaProvider>
  );
}