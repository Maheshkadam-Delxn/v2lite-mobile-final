import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SiteSurveysTab from '../screens/siteSurveys/SurveysList';
import SiteSurveyForm from '../screens/siteSurveys/SiteSurveyForm';
import viewSiteSurvey from '../screens/siteSurveys/viewSiteSurvey';

const Stack = createNativeStackNavigator();

const SiteSurveysStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SiteSurveysList" component={SiteSurveysTab} />
        <Stack.Screen name="SiteSurveyForm" component={SiteSurveyForm} />
        <Stack.Screen name="ViewSiteSurvey" component={viewSiteSurvey} />
    </Stack.Navigator>
);

export default SiteSurveysStack;
