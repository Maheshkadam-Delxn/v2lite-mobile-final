import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import "./global.css";
import Splash1 from './screens/Auth/SplashScreen';
import Onboarding from './screens/Auth/OnboardingScreen';
import Welcome from './screens/Auth/WelcomeScreen';
import SignIn from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ResetPasswordScreen from 'screens/Auth/ResetPasswordScreen';
import OTPVerificationScreen from 'screens/Auth/OTPVerificationScreen';
import CreatePasswordScreen from 'screens/Auth/ChangePasswordScreen';
import "./global.css";
import Dashboard from './screens/Dashboard/DashboardScreen';  

// import Dashboard from './screens/Dashboard/DashboardScreen'; 
import ProjectListScreen from './screens/Projects/ProjectsListScreen'; 
import ViewDetailsScreen from './screens/Projects/ViewDetailsScreen';
import CreateProjectScreen from './screens/Projects/CreateProjectScreen';
import FilterScreen from './screens/Projects/FilterScreen';
import ProposalsListScreen from './screens/Proposals/ProposalsListScreen';
import CreateProposalScreen from 'screens/Proposals/CreateProposal';
import SubmitProposal from 'screens/Proposals/SubmitProposal';
import ViewProposal from 'screens/Proposals/ViewProposal';
import ReviewProposalScreen from 'screens/Proposals/ChooseTemplate';
import ChooseTemplate from 'screens/Proposals/ChooseTemplate';
import AddNewTask from 'screens/Projects/AddNewTask';

import TaskScreen from 'screens/Projects/TaskScreen';
import PaymentsTransaction from 'screens/AccountingPayement/PaymentsTransaction';
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

const Stack = createNativeStackNavigator();

const SafeAreaWrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaWrapper>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash1"
            screenOptions={{ headerShown: false }}
          >
            {/* Auth Flow */}
            <Stack.Screen name="Splash1" component={Splash1} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/>
            <Stack.Screen name ="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name ="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name ="CreatePassword" component={CreatePasswordScreen} />
            {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}

            {/* Main App */}
            {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
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
            {/* Add more screens later: Transactions, Profile, etc. */}

            {/* Accounting and payement*/}
            
            <Stack.Screen name="PaymentsTransaction" component={PaymentsTransaction} />
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









            

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaWrapper>
    </SafeAreaProvider>
  );
}