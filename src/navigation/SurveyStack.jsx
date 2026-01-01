import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ApproveSurveyScreen from '../screens/Surveys/ApproveSurveyScreen';
import SurveyRequestScreen from '../screens/Surveys/SurveyRequestScreen';
import SurveyApprovalScreen from '../screens/Surveys/SurveyApprovalScreen';
import NewSurveyScreen from '../screens/Surveys/NewSurveyScreen';
import SurveyDetailScreen from '../screens/Surveys/SurveyDetailScreen';

const Stack = createNativeStackNavigator();

const SurveyStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ApproveSurveyScreen" component={ApproveSurveyScreen} />
        <Stack.Screen name="SurveyRequestScreen" component={SurveyRequestScreen} />
        <Stack.Screen name="SurveyApprovalScreen" component={SurveyApprovalScreen} />
        <Stack.Screen name="NewSurveyScreen" component={NewSurveyScreen} />
        <Stack.Screen name="SurveyDetailScreen" component={SurveyDetailScreen} />
    </Stack.Navigator>
);

export default SurveyStack;
