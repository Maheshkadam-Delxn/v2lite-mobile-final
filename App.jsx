// // App.js
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useFonts } from 'expo-font';
// import { StatusBar } from 'expo-status-bar';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import "./global.css";
// import Splash1 from './screens/Auth/SplashScreen';
// import Onboarding from './screens/Auth/OnboardingScreen';
// import Welcome from './screens/Auth/WelcomeScreen';
// import SignIn from './screens/Auth/SignInScreen';
// import SignUpScreen from './screens/Auth/SignUpScreen';
// import ResetPasswordScreen from 'screens/Auth/ResetPasswordScreen';
// import OTPVerificationScreen from 'screens/Auth/OTPVerificationScreen';
// import CreatePasswordScreen from 'screens/Auth/ChangePasswordScreen';
// // import Dashboard from './screens/Dashboard/DashboardScreen';
// // import ProjectListScreen from './screens/Projects/ProjectsListScreen';
// import "./global.css"; 

// // import Dashboard from './screens/Dashboard/DashboardScreen'; 
// import ProjectListScreen from './screens/Projects/ProjectsListScreen'; 
// import ViewDetailsScreen from './screens/Projects/ViewDetailsScreen';
// import CreateProjectScreen from './screens/Projects/CreateProjectScreen';
// import FilterScreen from './screens/Projects/FilterScreen';
// import ProposalsListScreen from './screens/Proposals/ProposalsListScreen';
// import CreateProposalScreen from 'screens/Proposals/CreateProposal';
// import SubmitProposal from 'screens/Proposals/SubmitProposal';
// import ViewProposal from 'screens/Proposals/ViewProposal';
// import ChooseTemplate from 'screens/Proposals/ChooseTemplate';
// import AddNewTask from 'screens/Projects/AddNewTask';
// import TaskScreen from 'screens/Projects/TaskScreen';
// import Transaction from 'screens/AccountingPayement/Transaction';
// import TransactionAdd from 'screens/AccountingPayement/TransactionAdd';
// import IncomingPayment from 'screens/AccountingPayement/IncomingPayment';
// import OutgoingPayment from 'screens/AccountingPayement/OutgoingPayment';
// import DebitNote from 'screens/AccountingPayement/DebitNote';
// import DebitNoteAddItem from 'screens/AccountingPayement/DebitNoteAddItem';
// import CreateInvoice from 'screens/AccountingPayement/CreateInvoice';
// import InvoiceAddBoqItem from 'screens/AccountingPayement/InvoiceAddBoqItem';
// import MaterialPurchase from 'screens/AccountingPayement/MaterialPurchase';
// import TransactionFilter from 'screens/AccountingPayement/TransactionFilter';
// import TransactionApproval from 'screens/AccountingPayement/TransactionApproval';
// import UsersScreen from 'screens/Users/UsersScreen';
// import AddMembers from 'screens/Projects/AddMembers';
// import ApproveSurveyScreen from 'screens/Surveys/ApproveSurveyScreen';
// import SurveyRequestScreen from 'screens/Surveys/SurveyRequestScreen';
// import SurveyApprovalScreen from 'screens/Surveys/SurveyApprovalScreen';
// import NewSurveyScreen from 'screens/Surveys/NewSurveyScreen';
// import SurveyDetailScreen from 'screens/Surveys/SurveyDetailScreen';
// import ProjectTimeline from 'screens/HomeOwner/ProjectTimeline';
// import BudgetTracker from 'screens/HomeOwner/BudgetTracker';
// import DesignApprovals from 'screens/HomeOwner/DesignApprovals';
// import QualityChecks from 'screens/HomeOwner/QualityChecks';
// import ChangeRequests from 'screens/HomeOwner/ChangeRequests';
// import MaterialStatus from 'screens/HomeOwner/MaterialStatus';
// import Overview from 'screens/HomeOwner/Overview';
// import EditProfileScreen from 'screens/Profile/EditProfileScreen';
// import MainAppScreen from 'screens/Dashboard/MainAppScreen';
// import ProfilePageScreen from 'screens/Profile/ProfilePageScreen';
// import PrivacyPolicyScreen from 'screens/Profile/PrivacyPolicyScreen';
// import CustomerChooseTemplate from 'screens/HomeOwner/CustomerChooseTemplate';
// import CustomerCreateProposal from 'screens/HomeOwner/CustomerCreateProposal';
// import SubmitProposalCustomer from 'screens/HomeOwner/SubmitProposalCustomer';
// import MaterialDetailScreen from 'screens/Materials/MaterialDetailScreen';
// import MaterialsListScreen from 'screens/Materials/MaterialsListScreen';

// const Stack = createNativeStackNavigator();
// const TOKEN_KEY = 'userToken';

// // optional nav ref for later programmatic navigation
// export const navigationRef = createNavigationContainerRef();

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
//     'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
//     'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
//     'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
//     'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
//   });

//   // tracker while we check auth token
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [initialRoute, setInitialRoute] = useState(null); // will be 'ProjectListScreen' or 'SignIn' etc.

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem(TOKEN_KEY);
//         console.log('[App] startup token present:', !!token);

//         // choose initial route (no navigation dispatch here)
//         if (token) {
//           setInitialRoute('MainAppScreen'); // or 'Dashboard' if you prefer
//           console.log('[App] initialRoute -> MainAppScreen');
//         } else {
//           setInitialRoute('SignIn');
//           console.log('[App] initialRoute -> SignIn');
//         }
//       } catch (err) {
//         console.error('[App] auth check error:', err);
//         setInitialRoute('SignIn');
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };

//     if (fontsLoaded) checkAuth();
//   }, [fontsLoaded]);

//   // Wait until fonts loaded and auth checked
//   if (!fontsLoaded || isCheckingAuth || !initialRoute) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
//         <ActivityIndicator size="large" color="#0066FF" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar style="light" backgroundColor="#ffffff" />
//       <NavigationContainer ref={navigationRef}>
//         <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
//           {/* Auth Flow */}
//           <Stack.Screen name="Splash1" component={Splash1} />
//           <Stack.Screen name="Onboarding" component={Onboarding} />
//           <Stack.Screen name="Welcome" component={Welcome} />
//           <Stack.Screen name="SignIn" component={SignIn} />
//           <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
//           <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
//           <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
//           <Stack.Screen name="ProfilePageScreen" component={ProfilePageScreen} />
//           <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
//           <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />

//           {/* Main App */}
//            <Stack.Screen name="ProjectListScreen" component={ProjectListScreen} />
//           <Stack.Screen name="MainAppScreen" component={MainAppScreen} />
//           <Stack.Screen name="ViewDetails" component={ViewDetailsScreen} />
//           <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
//           <Stack.Screen name="FilterScreen" component={FilterScreen} />
//           <Stack.Screen name="ProposalsListScreen" component={ProposalsListScreen} />
//           <Stack.Screen name="CreateProposalScreen" component={CreateProposalScreen} />
//           <Stack.Screen name="SubmitProposal" component={SubmitProposal} />
//           <Stack.Screen name="ViewProposal" component={ViewProposal} />
//           <Stack.Screen name="ChooseTemplate" component={ChooseTemplate} />
//           <Stack.Screen name="TaskScreen" component={TaskScreen} />
//           <Stack.Screen name="AddNewTask" component={AddNewTask} />

       
//             <Stack.Screen name="Transaction" component={Transaction} />
//             <Stack.Screen name="TransactionAdd" component={TransactionAdd} />
//             <Stack.Screen name="IncomingPayment" component={IncomingPayment} />
//             <Stack.Screen name="OutgoingPayment" component={OutgoingPayment} />
//             <Stack.Screen name="DebitNote" component={DebitNote} />
//             <Stack.Screen name="DebitNoteAddItem" component={DebitNoteAddItem} />
//             <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
//             <Stack.Screen name="InvoiceAddBoqItem" component={InvoiceAddBoqItem} />
//             <Stack.Screen name="MaterialPurchase" component={MaterialPurchase} />
//             <Stack.Screen name="TransactionFilter" component={TransactionFilter} />
//             <Stack.Screen name="TransactionApproval" component={TransactionApproval} />
//             <Stack.Screen name="AddMembers" component={AddMembers} />

//             {/* site survey */}
//             <Stack.Screen name="ApproveSurveyScreen" component={ApproveSurveyScreen} />
//             <Stack.Screen name="SurveyRequestScreen" component={SurveyRequestScreen} /> 
//             <Stack.Screen name="SurveyApprovalScreen" component={SurveyApprovalScreen} />
//             <Stack.Screen name="NewSurveyScreen" component={NewSurveyScreen} />
//             <Stack.Screen name="SurveyDetailScreen" component={SurveyDetailScreen} />

//             {/* Home Owner */}
//             <Stack.Screen name="ProjectTimeline" component={ProjectTimeline} />
//             <Stack.Screen name="BudgetTracker" component={BudgetTracker} />
//             <Stack.Screen name="DesignApprovals" component={DesignApprovals} />
//             <Stack.Screen name="QualityChecks" component={QualityChecks} />
//             <Stack.Screen name="ChangeRequests" component={ChangeRequests} />
//             <Stack.Screen name="MaterialStatus" component={MaterialStatus} />
//             <Stack.Screen name="Overview" component={Overview} />
//             <Stack.Screen name="CustomerChooseTemplate" component={CustomerChooseTemplate} />
//             <Stack.Screen name="CustomerCreateProposal" component={CustomerCreateProposal} />
//             <Stack.Screen name="SubmitProposalCustomer" component={SubmitProposalCustomer} />
//             <Stack.Screen name="ViewCustomerProposal" component={ViewProposal} />


//           {/* users */ }
//           <Stack.Screen name="Users" component={UsersScreen} />


//           {/* Materials */}
//           <Stack.Screen name="MaterialListScreen" component={MaterialsListScreen} />
//           <Stack.Screen name="MaterialDetailScreen" component={MaterialDetailScreen} />


//         </Stack.Navigator>
//       </NavigationContainer>
//     </View>
           


//   );
// }

// App.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import "./global.css";

// Auth Screens
import Splash1 from './screens/Auth/SplashScreen';
import Onboarding from './screens/Auth/OnboardingScreen';
import Welcome from './screens/Auth/WelcomeScreen';
import SignIn from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ResetPasswordScreen from 'screens/Auth/ResetPasswordScreen';
import OTPVerificationScreen from 'screens/Auth/OTPVerificationScreen';
import CreatePasswordScreen from 'screens/Auth/ChangePasswordScreen';

// Main Tab Screens
import ProjectListScreen from './screens/Projects/ProjectsListScreen'; 
import ProposalsListScreen from './screens/Proposals/ProposalsListScreen';
import UsersScreen from 'screens/Users/UsersScreen';
import ProfilePageScreen from 'screens/Profile/ProfilePageScreen';

// Project Screens
import ViewDetailsScreen from './screens/Projects/ViewDetailsScreen';
import CreateProjectScreen from './screens/Projects/CreateProjectScreen';
import FilterScreen from './screens/Projects/FilterScreen';
import AddNewTask from 'screens/Projects/AddNewTask';
import TaskScreen from 'screens/Projects/TaskScreen';
import AddMembers from 'screens/Projects/AddMembers';

// Proposal Screens
import CreateProposalScreen from 'screens/Proposals/CreateProposal';
import SubmitProposal from 'screens/Proposals/SubmitProposal';
import ViewProposal from 'screens/Proposals/ViewProposal';
import ChooseTemplate from 'screens/Proposals/ChooseTemplate';

// Accounting & Payment Screens
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

// Survey Screens
import ApproveSurveyScreen from 'screens/Surveys/ApproveSurveyScreen';
import SurveyRequestScreen from 'screens/Surveys/SurveyRequestScreen'; 
import SurveyApprovalScreen from 'screens/Surveys/SurveyApprovalScreen';
import NewSurveyScreen from 'screens/Surveys/NewSurveyScreen';
import SurveyDetailScreen from 'screens/Surveys/SurveyDetailScreen';

// Home Owner Screens
import ProjectTimeline from 'screens/HomeOwner/ProjectTimeline';
import BudgetTracker from 'screens/HomeOwner/BudgetTracker';
import DesignApprovals from 'screens/HomeOwner/DesignApprovals';
import QualityChecks from 'screens/HomeOwner/QualityChecks';
import ChangeRequests from 'screens/HomeOwner/ChangeRequests';
import MaterialStatus from 'screens/HomeOwner/MaterialStatus';
import Overview from 'screens/HomeOwner/Overview';
import CustomerChooseTemplate from 'screens/HomeOwner/CustomerChooseTemplate';
import CustomerCreateProposal from 'screens/HomeOwner/CustomerCreateProposal';
import SubmitProposalCustomer from 'screens/HomeOwner/SubmitProposalCustomer';

// Profile Screens
import EditProfileScreen from 'screens/Profile/EditProfileScreen';
import PrivacyPolicyScreen from 'screens/Profile/PrivacyPolicyScreen';

// Materials Screens
import MaterialsListScreen from 'screens/Materials/MaterialsListScreen';
import MaterialDetailScreen from 'screens/Materials/MaterialDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TOKEN_KEY = 'userToken';

export const navigationRef = createNavigationContainerRef();

// Project Stack Navigator
const ProjectStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProjectList" component={ProjectListScreen} />
    <Stack.Screen name="ViewDetails" component={ViewDetailsScreen} />
    <Stack.Screen name="CreateProjectScreen" component={CreateProjectScreen} />
    <Stack.Screen name="FilterScreen" component={FilterScreen} />
    <Stack.Screen name="AddNewTask" component={AddNewTask} />
    <Stack.Screen name="TaskScreen" component={TaskScreen} />
    <Stack.Screen name="AddMembers" component={AddMembers} />
  </Stack.Navigator>
);

// Proposal Stack Navigator
const ProposalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProposalsList" component={ProposalsListScreen} />
    <Stack.Screen name="CreateProposalScreen" component={CreateProposalScreen} />
    <Stack.Screen name="SubmitProposal" component={SubmitProposal} />
    <Stack.Screen name="ViewProposal" component={ViewProposal} />
    <Stack.Screen name="ChooseTemplate" component={ChooseTemplate} />
  </Stack.Navigator>
);

// Users Stack Navigator
const UsersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UsersList" component={UsersScreen} />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfilePageScreen} />
    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
  </Stack.Navigator>
);

// Accounting Stack Navigator
const AccountingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TransactionMain" component={Transaction} />
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
);

// Survey Stack Navigator
const SurveyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ApproveSurveyScreen" component={ApproveSurveyScreen} />
    <Stack.Screen name="SurveyRequestScreen" component={SurveyRequestScreen} />
    <Stack.Screen name="SurveyApprovalScreen" component={SurveyApprovalScreen} />
    <Stack.Screen name="NewSurveyScreen" component={NewSurveyScreen} />
    <Stack.Screen name="SurveyDetailScreen" component={SurveyDetailScreen} />
  </Stack.Navigator>
);

// Materials Stack Navigator
const MaterialsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MaterialsList" component={MaterialsListScreen} />
    <Stack.Screen name="MaterialDetailScreen" component={MaterialDetailScreen} />
  </Stack.Navigator>
);

// Home Owner Stack Navigator
const HomeOwnerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProjectTimeline" component={ProjectTimeline} />
    <Stack.Screen name="BudgetTracker" component={BudgetTracker} />
    <Stack.Screen name="DesignApprovals" component={DesignApprovals} />
    <Stack.Screen name="QualityChecks" component={QualityChecks} />
    <Stack.Screen name="ChangeRequests" component={ChangeRequests} />
    <Stack.Screen name="MaterialStatus" component={MaterialStatus} />
    <Stack.Screen name="Overview" component={Overview} />
    <Stack.Screen name="CustomerChooseTemplate" component={CustomerChooseTemplate} />
    <Stack.Screen name="CustomerCreateProposal" component={CustomerCreateProposal} />
    <Stack.Screen name="SubmitProposalCustomer" component={SubmitProposalCustomer} />
    <Stack.Screen name="ViewCustomerProposal" component={ViewProposal} />
  </Stack.Navigator>
);

// Main Tab Navigator with Bottom Navigation
function MainTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Projects') {
              iconName = focused ? 'apps-sharp' : 'apps-outline';
            } else if (route.name === 'Templates') {
              iconName = focused ? 'document-text' : 'document-text-outline';
            } else if (route.name === 'Surveys') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'Materials') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Users') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066FF',
          tabBarInactiveTintColor: '#7F8C8D',
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Urbanist-Medium',
            marginTop: 4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Projects" 
          component={ProjectStack} 
          options={{ title: 'Projects' }}
        />
        <Tab.Screen 
          name="Templates" 
          component={ProposalStack} 
          options={{ title: 'Templates' }}
        />
        <Tab.Screen 
          name="Users" 
          component={UsersStack} 
          options={{ title: 'Users' }}
        />
        <Tab.Screen 
          name="Materials" 
          component={MaterialsStack} 
          options={{ title: 'Materials' }}
        />
        <Tab.Screen 
          name="Account" 
          component={ProfileStack} 
          options={{ title: 'Account' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
} 

// Auth Stack Navigator (No bottom tabs)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash1" component={Splash1} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('[App] startup token present:', !!token);

        if (token) {
          setInitialRoute('MainApp');
        } else {
          setInitialRoute('Auth');
        }
      } catch (err) {
        console.error('[App] auth check error:', err);
        setInitialRoute('Auth');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (fontsLoaded) checkAuth();
  }, [fontsLoaded]);

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
          {/* Auth Stack - No bottom tabs */}
          <Stack.Screen name="Auth" component={AuthStack} />
          
          {/* Main App with Bottom Tabs */}
          <Stack.Screen name="MainApp" component={MainTabs} />
          
          {/* Home Owner Stack (Separate flow) */}
          <Stack.Screen name="HomeOwner" component={HomeOwnerStack} />
          
          {/* Modal screens that should hide bottom tabs */}
          <Stack.Screen 
            name="TransactionModal" 
            component={Transaction} 
            options={{ 
              presentation: 'modal',
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}