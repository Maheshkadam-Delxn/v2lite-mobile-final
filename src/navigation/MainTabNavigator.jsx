import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProjectStack from './ProjectStack';
import ProposalStack from './ProposalStack';
import PaymentStack from './PaymentStack'; 
import SiteSurveysStack from './SiteSurveysStack';
import { AuditStack, ProfileStack } from './FeatureStacks';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    const [accessPayment, setPayment] = useState(false);
    const [siteSurveys, setSurvey] = useState(false);

    useEffect(() => {
        const checkStorage = async () => {
            const user = await AsyncStorage.getItem('userData');
            const parsedUser = user ? JSON.parse(user) : null;

            const canAccessPayment =
                parsedUser?.role === "admin" ||
                !!(
                    parsedUser?.permissions?.payment &&
                    (
                        parsedUser.permissions.payment.create ||
                        parsedUser.permissions.payment.update ||
                        parsedUser.permissions.payment.delete ||
                        parsedUser.permissions.payment.view
                    )
                );

            const canAccessSiteSurveys =
                parsedUser?.role !== "admin" ||
                !!(
                    parsedUser?.permissions?.siteSurvey &&
                    (
                        parsedUser.permissions.siteSurvey.create ||
                        parsedUser.permissions.siteSurvey.update ||
                        parsedUser.permissions.siteSurvey.delete ||
                        parsedUser.permissions.siteSurvey.view
                    )
                );

            setSurvey(canAccessSiteSurveys);
            setPayment(canAccessPayment);
        };

        checkStorage();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Projects') iconName = focused ? 'apps-sharp' : 'apps-outline';
                        // Renaming 'Templates' to 'Proposals' or keeping 'Templates'? Code said 'Templates' pointing to 'ProposalStack'
                        else if (route.name === 'Templates')
                            iconName = focused ? 'document-text' : 'document-text-outline';
                        else if (route.name === 'Payments') iconName = focused ? 'wallet' : 'wallet-outline';
                        else if (route.name === 'Account') iconName = focused ? 'settings' : 'settings-outline';
                        else if (route.name === 'Audit') iconName = focused ? 'person' : 'person-outline';
                        else if (route.name === 'Site Surveys')
                            iconName = focused ? 'clipboard' : 'clipboard-outline';

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#0066FF',
                    tabBarInactiveTintColor: '#7F8C8D',
                    tabBarStyle: {
                        height: 70,
                        paddingBottom: 10,
                        paddingTop: 10,
                        backgroundColor: '#fff',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderTopWidth: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontFamily: 'Urbanist-Medium',
                        marginTop: 4,
                    },
                    headerShown: false,
                })}>
                <Tab.Screen name="Projects" component={ProjectStack} options={{ title: 'Projects' }} />
                <Tab.Screen name="Templates" component={ProposalStack} options={{ title: 'Templates' }} />
                {accessPayment && (
                    <Tab.Screen name="Payments" component={PaymentStack} options={{ title: 'Payments' }} />
                )}
                {siteSurveys && (
                    <Tab.Screen name="Site Surveys" component={SiteSurveysStack} options={{ title: 'Site Surveys' }} />
                )}

                <Tab.Screen name="Audit" component={AuditStack} options={{ title: 'Snag' }} />
                <Tab.Screen name="Account" component={ProfileStack} options={{ title: 'Settings' }} />

            </Tab.Navigator>
        </SafeAreaView>
    );
}

export default MainTabNavigator;
