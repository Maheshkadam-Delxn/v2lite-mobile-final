import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

import { StoreProvider } from './src/context/StoreProvider';
import { PermissionProvider } from './src/context/PermissionContext';
import AppNavigator from './src/navigation/AppNavigator';

// Global Styles
import './src/global.css';

const TOKEN_KEY = 'userToken';
export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./src/assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./src/assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-SemiBold': require('./src/assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Medium': require('./src/assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Light': require('./src/assets/fonts/Urbanist-Light.ttf'),
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          const userData = await AsyncStorage.getItem('userData');
          const user = userData ? JSON.parse(userData) : null;

          if (user?.role === 'client') {
            setInitialRoute('ClientApp');
          } else {
            setInitialRoute('MainApp');
          }
        } else {
          setInitialRoute('Auth');
        }
      } catch (err) {
        console.error('[App] auth check error:', err);
        setInitialRoute('Auth');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (fontsLoaded) checkAuth();
  }, [fontsLoaded]);

  if (!fontsLoaded || isCheckingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="large" color="#04285fff" />
      </View>
    );
  }

  return (
    <StoreProvider>
      <PermissionProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="light" backgroundColor="#ffffff" />
          <NavigationContainer ref={navigationRef}>
            <AppNavigator initialRoute={initialRoute} />
          </NavigationContainer>
        </View>
      </PermissionProvider>
    </StoreProvider>
  );
}