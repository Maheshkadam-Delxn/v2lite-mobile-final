import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Users
import UsersScreen from '../screens/Users/UsersScreen';

// Profile
import ProfilePageScreen from '../screens/Profile/ProfilePageScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import CustomerSupport from '../screens/Profile/CustomerSupport';

// Issues
import RiskCategoriesScreen from '../screens/Issues/RiskCategoriesScreen';
import RiskDetail from '../screens/Issues/RiskDetail';
import EscalationMatrixScreen from '../screens/Issues/EscalationMatrixScreen';

// Reports
import ReportsListScreen from '../screens/Reports/ReportsListScreen';
import ReportDetailScreen from '../screens/Reports/ReportDetailScreen';

// Audit
import AuditDashboard from '../screens/Audit/AuditDashboard';
import AddSnagItem from '../screens/Audit/AddSnagItem';
import AssignedSnag from '../screens/Audit/AssignedSnag';
import SnagDetailScreen from '../screens/Audit/SangDetailScreen';
import RequestReworkScreen from '../screens/Audit/RequestReworkScreen';

// Materials
import MaterialsListScreen from '../screens/Materials/MaterialsListScreen';
import MaterialDetailScreen from '../screens/Materials/MaterialDetailScreen';
import CreatePOScreen from '../screens/Materials/CreatePOScreen';

const Stack = createNativeStackNavigator();

export const UsersStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UsersList" component={UsersScreen} />
    </Stack.Navigator>
);

export const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileMain" component={ProfilePageScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen name="CustomerSupport" component={CustomerSupport} />
    </Stack.Navigator>
);

export const IssuesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RiskCategoriesScreen" component={RiskCategoriesScreen} />
        <Stack.Screen name="RiskDetail" component={RiskDetail} />
        <Stack.Screen name="EscalationMatrixScreen" component={EscalationMatrixScreen} />
    </Stack.Navigator>
);

export const ReportsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ReportsList" component={ReportsListScreen} />
        <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
    </Stack.Navigator>
);

export const AuditStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuditDashboard" component={AuditDashboard} />
        <Stack.Screen name="AddSnagItem" component={AddSnagItem} />
        <Stack.Screen name="AssignedSnag" component={AssignedSnag} />
        <Stack.Screen name="SnagDetailScreen" component={SnagDetailScreen} />
        <Stack.Screen name="RequestReworkScreen" component={RequestReworkScreen} />
    </Stack.Navigator>
);

export const MaterialsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MaterialsList" component={MaterialsListScreen} />
        <Stack.Screen name="MaterialDetailScreen" component={MaterialDetailScreen} />
        <Stack.Screen name="CreatePOScreen" component={CreatePOScreen} />
    </Stack.Navigator>
);
