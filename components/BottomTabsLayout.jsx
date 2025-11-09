// // components/BottomTabsLayout.jsx
// import React from 'react';
// import { View } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MyProjectsScreen from 'screens/ProjectListScreen/MyProjectsScreen';
// import ProfilePageScreen from 'screens/ProfileScreen/ProfilePageScreen';
// import ProjectDetailsScreen from 'screens/ProjectDetailsScreen';
// import BottomNavBar from './BottomNavbar';

// const Stack = createNativeStackNavigator();

// export default function BottomTabsLayout() {
//   return (
//     <View style={{ flex: 1 }}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Home" component={MyProjectsScreen} />
//         <Stack.Screen name="Profile" component={ProfilePageScreen} />
//         <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
//       </Stack.Navigator>

//       {/* ✅ Persistent bottom navigation bar */}
//       <BottomNavBar />
//     </View>
//   );
// }


// components/BottomTabsLayout.jsx
import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Screens
import CustomerProjectsScreen from "../screens/customer/CustomerProjectsScreen";
import CustomerPaymentsScreen from "../screens/customer/CustomerPaymentsScreen";
import CustomerChooseTemplate from "../screens/customer/CustomerChooseTemplate";

import MyProjectsScreen from "../screens/ProjectListScreen/MyProjectsScreen";
import ProfilePageScreen from "../screens/ProfileScreen/ProfilePageScreen";
import ProjectDetailsScreen from "../screens/ProjectDetailsScreen";

// Separate NavBars
import CustomerBottomNavBar from "./CustomerBottomNavBar";
import AdminBottomNavBar from "./AdminBottomNavBar";   // (you can create the admin version the same way)

const Stack = createNativeStackNavigator();

export default function BottomTabsLayout() {
  const navigation = useNavigation();
  const state = navigation.getState();
  const currentRoute = state.routes[state.routes.length - 1];
  const isCustomer = ["CustomerChooseTemplate", "CustomerProjects", "CustomerPayments"].includes(
    currentRoute.name
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isCustomer ? (
          <>
            <Stack.Screen name="CustomerChooseTemplate" component={CustomerChooseTemplate} />
            <Stack.Screen name="CustomerProjects" component={CustomerProjectsScreen} />
            <Stack.Screen name="CustomerPayments" component={CustomerPaymentsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={MyProjectsScreen} />
            <Stack.Screen name="Profile" component={ProfilePageScreen} />
            <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
          </>
        )}
      </Stack.Navigator>

      {/* Choose the correct bar */}
      {isCustomer ? <CustomerBottomNavBar /> : <AdminBottomNavBar />}
    </View>
  );
}
