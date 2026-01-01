import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PaymentScreen from '../screens/payments/Payment';

const Stack = createNativeStackNavigator();

const PaymentStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
    </Stack.Navigator>
);

export default PaymentStack;
