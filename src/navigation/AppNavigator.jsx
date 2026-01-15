import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import ClientStack from './ClientStack';
import { MaterialsStack } from './FeatureStacks';

// Screens for direct access
import AddDocumentScreen from '../screens/Document-Management/AddDocumentScreen';
import CustomerCreateProposal from '../screens/HomeOwner/CustomerCreateProposal';
import CustomerSupport from '../screens/Profile/CustomerSupport';
import FeedDetailsScreen from '../screens/Feeds/FeedDetailsScreen';
import ChatScreen from '../screens/Feeds/ChatScreen';
import RiskDetail from '../screens/Issues/RiskDetail';
import EscalationMatrixScreen from '../screens/Issues/EscalationMatrixScreen';
import DesignApprovals from '../screens/HomeOwner/DesignApprovals';
import SurveyRequestScreen from '../screens/Surveys/SurveyRequestScreen';
import SurveyApprovalScreen from '../screens/Surveys/SurveyApprovalScreen';
import NewSurveyScreen from '../screens/Surveys/NewSurveyScreen';
import TasksTab from '../components/Project/TasksTab';
import SurveyDetailScreen from '../screens/Surveys/SurveyDetailScreen';
import FeedsScreen from '../screens/Feeds/FeedsScreen';
import UsersScreen from '../screens/Users/UsersScreen';
import VendorsScreen from '../screens/Vendors/Vendors';
import Transaction from '../screens/AccountingPayement/Transaction';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ initialRoute }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen name="ClientApp" component={ClientStack} />

            <Stack.Screen name="Materials" component={MaterialsStack} />

            {/* Direct Screens */}
            <Stack.Screen name="AddDocumentScreen" component={AddDocumentScreen} />
            <Stack.Screen name="CustomerCreateProposal" component={CustomerCreateProposal} />
            <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
            <Stack.Screen name="FeedDetails" component={FeedDetailsScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="RiskDetail" component={RiskDetail} />
            <Stack.Screen name="EscalationMatrixScreen" component={EscalationMatrixScreen} />
            <Stack.Screen name="DesignApprovals" component={DesignApprovals} />
            <Stack.Screen name="SurveyRequestScreen" component={SurveyRequestScreen} />
            <Stack.Screen name="SurveyApprovalScreen" component={SurveyApprovalScreen} />
            <Stack.Screen name="NewSurveyScreen" component={NewSurveyScreen} />
            <Stack.Screen name="TasksTab" component={TasksTab} />
            <Stack.Screen name="SurveyDetailScreen" component={SurveyDetailScreen} />
            <Stack.Screen name="FeedsScreen" component={FeedsScreen} />
            <Stack.Screen name="UsersList" component={UsersScreen} />
            <Stack.Screen name="Vendors" component={VendorsScreen} />

            <Stack.Screen
                name="TransactionModal"
                component={Transaction}
                options={{ presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
