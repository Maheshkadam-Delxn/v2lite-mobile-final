import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import "./global.css";
import Splash1 from './screens/Auth/SplashScreen';
import Onboarding from './screens/Auth/OnboardingScreen';
import Welcome from './screens/Auth/WelcomeScreen';
import SignIn from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import Dashboard from './screens/Dashboard/DashboardScreen'; 
import ProjectListScreen from './screens/Projects/ProjectsListScreen'; 
import ViewDetailsScreen from './screens/Projects/ViewDetailsScreen';
import CreateProjectScreen from './screens/Projects/CreateProjectScreen';
import FilterScreen from './screens/Projects/FilterScreen';

const Stack = createNativeStackNavigator();

const SafeAreaWrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

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
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash1"
            screenOptions={{ headerShown: false }}
          >
            {/* Auth Flow */}
            <Stack.Screen name="Splash1" component={Splash1} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />

            {/* Main App */}
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
            <Stack.Screen name="ViewDetails" component={ViewDetailsScreen} />
            <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
            <Stack.Screen name="FilterScreen" component={FilterScreen} />
            {/* Add more screens later: Transactions, Profile, etc. */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaWrapper>
    </SafeAreaProvider>
  );
}