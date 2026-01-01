import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Transaction from '../screens/AccountingPayment/Transaction';
import TransactionAdd from '../screens/AccountingPayment/TransactionAdd';
import IncomingPayment from '../screens/AccountingPayment/IncomingPayment';
import OutgoingPayment from '../screens/AccountingPayment/OutgoingPayment';
import DebitNote from '../screens/AccountingPayment/DebitNote';
import DebitNoteAddItem from '../screens/AccountingPayment/DebitNoteAddItem';
import CreateInvoice from '../screens/AccountingPayment/CreateInvoice';
import InvoiceAddBoqItem from '../screens/AccountingPayment/InvoiceAddBoqItem';
import MaterialPurchase from '../screens/AccountingPayment/MaterialPurchase';
import TransactionFilter from '../screens/AccountingPayment/TransactionFilter';
import TransactionApproval from '../screens/AccountingPayment/TransactionApproval';

const Stack = createNativeStackNavigator();

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

export default AccountingStack;
