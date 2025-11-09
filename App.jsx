// App.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import "./global.css";
import Splash1 from './screens/Auth/SplashScreen';
import Onboarding from './screens/Auth/OnboardingScreen';
import Welcome from './screens/Auth/WelcomeScreen';
import SignIn from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ResetPasswordScreen from 'screens/Auth/ResetPasswordScreen';
import OTPVerificationScreen from 'screens/Auth/OTPVerificationScreen';
import CreatePasswordScreen from 'screens/Auth/ChangePasswordScreen';
// import Dashboard from './screens/Dashboard/DashboardScreen';
// import ProjectListScreen from './screens/Projects/ProjectsListScreen';
import "./global.css"; 

// import Dashboard from './screens/Dashboard/DashboardScreen'; 
import ProjectListScreen from './screens/Projects/ProjectsListScreen'; 
import ViewDetailsScreen from './screens/Projects/ViewDetailsScreen';
import CreateProjectScreen from './screens/Projects/CreateProjectScreen';
import FilterScreen from './screens/Projects/FilterScreen';
import ProposalsListScreen from './screens/Proposals/ProposalsListScreen';
import CreateProposalScreen from 'screens/Proposals/CreateProposal';
import SubmitProposal from 'screens/Proposals/SubmitProposal';
import ViewProposal from 'screens/Proposals/ViewProposal';
import ChooseTemplate from 'screens/Proposals/ChooseTemplate';
import AddNewTask from 'screens/Projects/AddNewTask';
import TaskScreen from 'screens/Projects/TaskScreen';
import Transaction from 'screens/AccountingPayement/Transaction';
import TransactionAdd from 'screens/AccountingPayement/TransactionAdd';
import IncomingPayment from 'screens/AccountingPayement/IncomingPayment';
import OutgoingPayment from 'screens/AccountingPayement/OutgoingPayment';
import DebitNote from 'screens/AccountingPayement/DebitNote';
import DebitNoteAddItem from 'screens/AccountingPayement/DebitNoteAddItem';
import CreateInvoice from 'screens/AccountingPayement/CreateInvoice';
import InvoiceAddBoqItem from 'screens/AccountingPayement/InvoiceAddBoqItem';
import MaterialPurchase from 'screens/AccountingPayement/MaterialPurchase';
import TransactionFilter from 'screens/AccountingPayement/TransactionFilter';
import TransactionApproval from 'screens/AccountingPayement/TransactionApproval';
import UsersScreen from 'screens/Users/UsersScreen';
import AddMembers from 'screens/Projects/AddMembers';
import ApproveSurveyScreen from 'screens/Surveys/ApproveSurveyScreen';
import SurveyRequestScreen from 'screens/Surveys/SurveyRequestScreen';
import SurveyApprovalScreen from 'screens/Surveys/SurveyApprovalScreen';
import NewSurveyScreen from 'screens/Surveys/NewSurveyScreen';
import SurveyDetailScreen from 'screens/Surveys/SurveyDetailScreen';

const Stack = createNativeStackNavigator();
const TOKEN_KEY = 'userToken';

// optional nav ref for later programmatic navigation
export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
  });

  // tracker while we check auth token
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null); // will be 'ProjectListScreen' or 'SignIn' etc.

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('[App] startup token present:', !!token);

        // choose initial route (no navigation dispatch here)
        if (token) {
          setInitialRoute('ProjectListScreen'); // or 'Dashboard' if you prefer
          console.log('[App] initialRoute -> ProjectListScreen');
        } else {
          setInitialRoute('SignIn');
          console.log('[App] initialRoute -> SignIn');
        }
      } catch (err) {
        console.error('[App] auth check error:', err);
        setInitialRoute('SignIn');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (fontsLoaded) checkAuth();
  }, [fontsLoaded]);

  // Wait until fonts loaded and auth checked
  if (!fontsLoaded || isCheckingAuth || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#ffffff" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          {/* Auth Flow */}
          <Stack.Screen name="Splash1" component={Splash1} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />

          {/* Main App */}
          <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
          <Stack.Screen name="ViewDetails" component={ViewDetailsScreen} />
          <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
          <Stack.Screen name="FilterScreen" component={FilterScreen} />
          <Stack.Screen name="ProposalsListScreen" component={ProposalsListScreen} />
          <Stack.Screen name="CreateProposalScreen" component={CreateProposalScreen} />
          <Stack.Screen name="SubmitProposal" component={SubmitProposal} />
          <Stack.Screen name="ViewProposal" component={ViewProposal} />
          <Stack.Screen name="ChooseTemplate" component={ChooseTemplate} />
          <Stack.Screen name="TaskScreen" component={TaskScreen} />
          <Stack.Screen name="AddNewTask" component={AddNewTask} />

          {/* Accounting & Payments
          <Stack.Screen name="PaymentsTransaction" component={Payme} />
          <Stack.Screen name="TransactionAdd" component={TransactionAdd} />
          <Stack.Screen name="IncomingPayment" component={IncomingPayment} />
          <Stack.Screen name="OutgoingPayment" component={OutgoingPayment} />
          <Stack.Screen name="DebitNote" component={DebitNote} />
          <Stack.Screen name="DebitNoteAddItem" component={DebitNoteAddItem} />
          <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
          <Stack.Screen name="InvoiceAddBoqItem" component={InvoiceAddBoqItem} />
          <Stack.Screen name="MaterialPurchase" component={MaterialPurchase} />
          <Stack.Screen name="TransactionFilter" component={TransactionFilter} />
          <Stack.Screen name="TransactionApproval" component={TransactionApproval} /> */}
 {/* Accounting and payement*/}
            <Stack.Screen name="Transaction" component={Transaction} />
            <Stack.Screen name="TransactionAdd" component={TransactionAdd} />
            <Stack.Screen name="IncomingPayment" component={IncomingPayment} />
            <Stack.Screen name="OutgoingPayment" component={OutgoingPayment} />
            <Stack.Screen name="DebitNote" component={DebitNote} />
            <Stack.Screen name="DebitNoteAddItem" component={DebitNoteAddItem} />
            <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
            <Stack.Screen name="InvoiceAddBoqItem" component={InvoiceAddBoqItem} />
            <Stack.Screen name="MaterialPurchase" component={MaterialPurchase} />
            <Stack.Screen name="TransactionFilter" component={TransactionFilter} />
            <Stack.Screen name="TransactionApproval" component={TransactionApproval} />
            <Stack.Screen name="AddMembers" component={AddMembers} />

            {/* site survey */}
            <Stack.Screen name="ApproveSurveyScreen" component={ApproveSurveyScreen} />
            <Stack.Screen name="SurveyRequestScreen" component={SurveyRequestScreen} /> 
            <Stack.Screen name="SurveyApprovalScreen" component={SurveyApprovalScreen} />
            <Stack.Screen name="NewSurveyScreen" component={NewSurveyScreen} />
            <Stack.Screen name="SurveyDetailScreen" component={SurveyDetailScreen} />

          {/* users */ }
          <Stack.Screen name="Users" component={UsersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
           


  );
}