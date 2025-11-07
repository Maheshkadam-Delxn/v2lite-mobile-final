// components/BottomTabsLayout.jsx
import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyProjectsScreen from 'screens/ProjectListScreen/MyProjectsScreen';
import ProfilePageScreen from 'screens/ProfileScreen/ProfilePageScreen';
import ProjectDetailsScreen from 'screens/ProjectDetailsScreen';
import BottomNavBar from './BottomNavbar';

const Stack = createNativeStackNavigator();

export default function BottomTabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={MyProjectsScreen} />
        <Stack.Screen name="Profile" component={ProfilePageScreen} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      </Stack.Navigator>

      {/* ✅ Persistent bottom navigation bar */}
      <BottomNavBar />
    </View>
  );
}
