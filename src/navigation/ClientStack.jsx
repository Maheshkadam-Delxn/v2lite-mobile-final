import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ClientMainPage from '../screens/HomeOwner/clientpages/ClientMainPage';
import Overview from '../screens/HomeOwner/Overview';
import ProjectTimeline from '../screens/HomeOwner/ProjectTimeline';
import BudgetTracker from '../screens/HomeOwner/BudgetTracker';
import QualityChecks from '../screens/HomeOwner/QualityChecks';
import ChangeRequests from '../screens/HomeOwner/ChangeRequests';
import MaterialStatus from '../screens/HomeOwner/MaterialStatus';
import CostEstimation from '../screens/HomeOwner/AI/costestimation';
import ClientProfilePage from '../screens/HomeOwner/clientpages/clientProfilePage';
import CustomerChooseTemplate from '../screens/HomeOwner/CustomerChooseTemplate';
import TemplatePreview from '../screens/HomeOwner/TemplatePreview';
import SubmitProposalCustomer from '../screens/HomeOwner/SubmitProposalCustomer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ClientProjectStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientHome" component={ClientMainPage} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="ProjectTimeline" component={ProjectTimeline} />
        <Stack.Screen name="BudgetTracker" component={BudgetTracker} />
        <Stack.Screen name="QualityChecks" component={QualityChecks} />
        <Stack.Screen name="ChangeRequests" component={ChangeRequests} />
        <Stack.Screen name="MaterialStatus" component={MaterialStatus} />
    </Stack.Navigator>
);

const AIStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Cost Estimation" component={CostEstimation} />
    </Stack.Navigator>
);

const ClientTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let icon;
                if (route.name === "ClientHome")
                    icon = focused ? "home" : "home-outline";
                else if (route.name === "AI")
                    icon = focused ? "sparkles" : "sparkles-outline";
                else if (route.name === "ClientProfile")
                    icon = focused ? "person" : "person-outline";

                return <Ionicons name={icon} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#0066FF",
            tabBarInactiveTintColor: "#7F8C8D",
            tabBarStyle: {
                height: 65,
                paddingBottom: 5,
                paddingTop: 5,
                backgroundColor: "#fff",
                borderTopWidth: 0,
                elevation: 0,
            },
        })}
        tabBar={(props) => (
            <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
                <View style={{ height: 65 }}>
                    <BottomTabBar {...props} />
                </View>
            </SafeAreaView>
        )}
    >
        <Tab.Screen
            name="ClientHome"
            component={ClientProjectStack}
            options={{ title: "Home" }}
        />
        <Tab.Screen
            name="AI"
            component={AIStack}
            options={{ title: "AI" }}
        />
        <Tab.Screen
            name="ClientProfile"
            component={ClientProfilePage}
            options={{ title: "Account" }}
        />
    </Tab.Navigator>
);

const ClientStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientTabs" component={ClientTabs} />
        <Stack.Screen name="CustomerChooseTemplate" component={CustomerChooseTemplate} />
        <Stack.Screen name="TemplatePreview" component={TemplatePreview} />
        <Stack.Screen name="SubmitProposalCustomer" component={SubmitProposalCustomer} />
    </Stack.Navigator>
);

export default ClientStack;
