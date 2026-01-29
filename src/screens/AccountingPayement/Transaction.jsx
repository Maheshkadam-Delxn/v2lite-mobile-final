// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
//   Animated,
//   PanResponder,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Import modals
// import TransactionAddModal from '../../components/TransactionAddModal';
// import IncomingPaymentModal from './IncomingPaymentModal';
// import OutgoingPaymentModal from './OutgoingPaymentModal';
// import DebitNoteModal from '../../components/DebitNoteModal';
// import MaterialPurchaseModal from '../../components/MaterialPurchaseModal';
// import SalesInvoiceModal from '../../components/SalesInvoiceModal';
// import GenericFormModal from '../../components/GenericFormModal';

// const API_URL = `${process.env.BASE_API_URL}/api/transactions`;
// const TOKEN_KEY = 'userToken';

// // Exchange rate: 1 INR = 0.0401 QAR (as of December 15, 2025)
// const INR_TO_QAR_RATE = 0.0401;

// const Transaction = ({ project }) => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState('Transactions');
//   const [showTransactionModal, setShowTransactionModal] = useState(false);
//   const [selectedTransactionType, setSelectedTransactionType] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingTransaction, setEditingTransaction] = useState(null);

 

  
//   const fetchTransactions = useCallback(async () => {
//      setError(null);
//     try {
//       console.log('\n[Transactions] Fetching transactions...');
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
      
//       if (!token) {
//         Alert.alert('Error', 'User not logged in. Please sign in again.');
//         setIsLoading(false);
//         return;
//       }

//       const response = await fetch(`${process.env.BASE_API_URL}/api/newTransaction/${project._id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('[Transactions] Response status:', response.status);
//       const data = await response.json();
//       console.log('[Transactions] Response JSON:', data);
      
//       // Ensure data is properly formatted with defensive checks
//       let list = [];
//       if (Array.isArray(data.data)) {
//         list = data.data;
//       } else if (Array.isArray(data)) {
//         list = data;
//       } else if (data.data && Array.isArray(data.data)) {
//         list = data.data;
//       }
      
//       // Add defensive check for each transaction
//       const safeList = list.map(transaction => ({
//         ...transaction,
//         type: transaction?.type || transaction?.status ||'unknown',
//         amount: transaction?.amount || transaction?.advance|| 0,
//         status: transaction?.status || 'pending',
//         vendorName: transaction?.vendorName || transaction?.vendorId?.name || '',
//         createdAt: transaction?.createdAt || new Date().toISOString(),
//         _id: transaction?._id || Date.now().toString(),
//       }));
      
//       console.log('[Transactions] Processed count:', safeList.length);
//       setTransactions(safeList);
//     } catch (err) {
//       console.error('[Transactions] Fetch error:', err);
//       setError('Failed to load transactions.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTransactions();
//   }, [fetchTransactions]);

//   // ---------------------------------------------------------------------
//   // Create Transaction (POST)
//   // ---------------------------------------------------------------------
//   const handleSaveTransaction = async (formData) => {
//     console.log('\n[Transactions] handleSaveTransaction data:', formData);
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       if (!token) {
//         Alert.alert('Error', 'User not logged in.');
//         return;
//       }

//       const typeMap = {
//         'Incoming Payment': 'payment_in',
//         'Outgoing Payment': 'payment_out',
//         'Material Purchase': 'Purchased',
//         'Sales Invoice': 'invoice',
//         'Debit Note': 'debit_note',
//         'Material Return': 'expense',
//         'Material Transfer': 'expense',
//         'Other Expense': 'expense',
//       };

//       // Determine correct type safely
//       let mappedType = formData?.type;

//       // If it's one of the UI labels (e.g., "Debit Note"), map it to backend format
//       if (typeMap[formData?.type]) {
//         mappedType = typeMap[formData.type];
//       }

//       // Final fallback
//       if (!mappedType) mappedType = 'expense';
// console.log("this is payload",formData);
     
//       const res = await fetch(`${process.env.BASE_API_URL}/api/newTransaction`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const json = await res.json().catch(() => ({}));
//       // console.log('[Transactions] POST response:', json);

//        if (!res.ok) throw new Error(json.message || `Failed with ${res.status}`);

//       Alert.alert('Success', 'Transaction created successfully!');
//       setShowTransactionModal(false);
//       setSelectedTransactionType(null);
//       setEditingTransaction(null);
//       fetchTransactions();
//     } catch (err) {
//       console.error('[Transactions] Create error:', err);
//       Alert.alert('Error', err.message || 'Failed to create transaction');
//     }
//   };

//   // ---------------------------------------------------------------------
//   // Update Transaction (PUT)
//   // ---------------------------------------------------------------------
//   const handleUpdateTransaction = async (id, updatedData) => {
//     try {
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       if (!token) throw new Error('Missing auth token');

//       console.log(`[Transactions] Updating transaction ${id}`);

//       const res = await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });

//       const json = await res.json().catch(() => ({}));
//       console.log('[Transactions] PUT response:', json);

//       if (!res.ok) throw new Error(json.message || 'Update failed');

//       Alert.alert('Updated', 'Transaction updated successfully!');
//       setEditingTransaction(null);
//       setSelectedTransactionType(null);
//       fetchTransactions();
//     } catch (err) {
//       console.error('[Transactions] Update error:', err);
//       Alert.alert('Error', err.message || 'Failed to update transaction');
//     }
//   };

//   const handleDeleteTransaction = async (id) => {
//     Alert.alert('Confirm Delete', 'Are you sure you want to delete this transaction?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             const token = await AsyncStorage.getItem(TOKEN_KEY);
//             if (!token) throw new Error('Missing token');

//             console.log(`[Transactions] Deleting transaction ${id}`);

//             const res = await fetch(`${API_URL}/${id}`, {
//               method: 'DELETE',
//               headers: { Authorization: `Bearer ${token}` },
//             });

//             const json = await res.json().catch(() => ({}));
//             console.log('[Transactions] DELETE response:', json);

//             if (!res.ok) throw new Error(json.message || 'Delete failed');

//             Alert.alert('Deleted', 'Transaction removed successfully.');
//             fetchTransactions();
//           } catch (err) {
//             console.error('[Transactions] Delete error:', err);
//             Alert.alert('Error', err.message || 'Failed to delete transaction');
//           }
//         },
//       },
//     ]);
//   };

//   // ---------------------------------------------------------------------
//   // Handle Edit Transaction - FIXED: Now sets correct type and opens modal
//   // ---------------------------------------------------------------------
//   const handleEditTransaction = (transaction) => {
//     console.log('[Transactions] Editing transaction:', transaction);

//     const typeMap = {
//       payment_in: 'Incoming Payment',
//       payment_out: 'Outgoing Payment',
//       purchased: 'Material Purchase',
//       invoice: 'Sales Invoice',
//       debit_note: 'Debit Note',
//       expense: 'Other Expense',
//     };

//     const uiType = typeMap[transaction?.type] || 'Other Expense';

//     // Set both states to open the correct modal
//     setEditingTransaction(transaction);
//     setSelectedTransactionType(uiType);

//     console.log('[Transactions] Opening modal for type:', uiType);
//   };

//   // ---------------------------------------------------------------------
//   // Reset editing state when modal closes
//   // ---------------------------------------------------------------------
//   const handleModalClose = () => {
//     console.log('[Transactions] Closing modal, resetting editing state');
//     setSelectedTransactionType(null);
//     setEditingTransaction(null);
//   };

//   // ---------------------------------------------------------------------
//   // UI States
//   // ---------------------------------------------------------------------
//   if (isLoading) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0066FF" />
//         <Text style={{ marginTop: 12, color: '#666' }}>Loading transactions...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
//         <TouchableOpacity
//           onPress={fetchTransactions}
//           style={{
//             marginTop: 16,
//             backgroundColor: '#0066FF',
//             paddingVertical: 10,
//             paddingHorizontal: 20,
//             borderRadius: 8,
//           }}>
//           <Text style={{ color: 'white' }}>Retry</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   // ---------------------------------------------------------------------
//   // Main UI
//   // ---------------------------------------------------------------------
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}>
//         {/* Stats Card */}
//         <View
//           style={{
//             backgroundColor: 'white',
//             borderRadius: 16,
//             padding: 16,
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 16,
//             borderLeftWidth: 4,
//             borderLeftColor: '#0066FF',
//           }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
//             <Stat label="BALANCE" value={`+ ${calculateBalance(transactions)} QAR`} color="#0ac42cff" />
//             <Stat label="TOTAL INCOMING" value={`${calculateIncoming(transactions)} QAR`} color="#000" />
//             <Stat label="TOTAL OUTGOING" value={`${calculateOutgoing(transactions)} QAR`} color="#FF4444" />
//           </View>
//         </View>

//         {/* Transactions List */}
//         <View style={{ paddingHorizontal: 16 }}>
//           {transactions.length === 0 ? (
//             <Text style={{ textAlign: 'center', color: '#999', marginTop: 30 }}>
//               No transactions found
//             </Text>
//           ) : (
//             transactions.map((transaction) => (
//               <SwipeableTransactionCard
//                 key={transaction._id}
//                 transaction={transaction}
//                 onDelete={() => handleDeleteTransaction(transaction._id)}
//                 onEdit={() => handleEditTransaction(transaction)}
//               />
//             ))
//           )}
//         </View>

//         {/* Add Transaction Button */}
//         <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
//           <TouchableOpacity
//             onPress={() => setShowTransactionModal(true)}
//             style={{
//               backgroundColor: '#0066FF',
//               borderRadius: 12,
//               paddingVertical: 16,
//               alignItems: 'center',
//             }}>
//             <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
//               Add Transaction Entry
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Modals - Fixed: All modals now properly handle edit mode */}
//       <View pointerEvents="box-none">
//         <TransactionAddModal
//           visible={showTransactionModal}
//           onClose={() => {
//             setShowTransactionModal(false);
//             setSelectedTransactionType(null);
//             setEditingTransaction(null);
//           }}
//           onSelectTransactionType={setSelectedTransactionType}
//         />

//         <IncomingPaymentModal
//           visible={selectedTransactionType === 'Incoming Payment'}
//           onClose={handleModalClose}
//           onSave={
//             editingTransaction
//               ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//               : handleSaveTransaction
//           }
//           editingTransaction={editingTransaction}
//           project={project}
//         />

//         <OutgoingPaymentModal
//           visible={selectedTransactionType === 'Outgoing Payment'}
//           onClose={handleModalClose}
//           onSave={
//             editingTransaction
//               ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//               : handleSaveTransaction
//           }
//           project={project}
//           editingTransaction={editingTransaction}
//         />

//         <DebitNoteModal
//           visible={selectedTransactionType === 'Debit Note'}
//           onClose={handleModalClose}
//           onSave={
//             editingTransaction
//               ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//               : handleSaveTransaction
//           }
//           editingTransaction={editingTransaction}
//         />
//         <MaterialPurchaseModal
//           visible={selectedTransactionType === 'Material Purchase'}
//           onClose={handleModalClose}
//           onSave={
//             editingTransaction
//               ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//               : handleSaveTransaction
//           }
//           editingTransaction={editingTransaction}
//         />
//         <SalesInvoiceModal
//           visible={selectedTransactionType === 'Sales Invoice'}
//           onClose={handleModalClose}
//           onSave={
//             editingTransaction
//               ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//               : handleSaveTransaction
//           }
//           editingTransaction={editingTransaction}
//         />

//         {['Material Return', 'Material Transfer', 'Other Expense'].map((type) => (
//           <GenericFormModal
//             key={type}
//             visible={selectedTransactionType === type}
//             onClose={handleModalClose}
//             type={type}
//             onSave={
//               editingTransaction
//                 ? (data) => handleUpdateTransaction(editingTransaction._id, data)
//                 : handleSaveTransaction
//             }
//             editingTransaction={editingTransaction}
//           />
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// };

// // ---------------------------------------------------------------------
// // Swipeable Transaction Card Component
// // ---------------------------------------------------------------------
// const SwipeableTransactionCard = ({ transaction, onDelete, onEdit }) => {
//   const swipeAnim = useState(new Animated.Value(0))[0];
//   const [showActions, setShowActions] = useState(false);

//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (evt, gestureState) => {
//       return Math.abs(gestureState.dx) > 10;
//     },
//     onPanResponderMove: (evt, gestureState) => {
//       if (gestureState.dx < 0) {
//         swipeAnim.setValue(gestureState.dx);
//       } else if (gestureState.dx > 0) {
//         swipeAnim.setValue(0);
//       }
//     },
//     onPanResponderRelease: (evt, gestureState) => {
//       if (gestureState.dx < -80) {
//         Animated.timing(swipeAnim, {
//           toValue: -160,
//           duration: 200,
//           useNativeDriver: false,
//         }).start(() => setShowActions(true));
//       } else {
//         Animated.timing(swipeAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: false,
//         }).start(() => setShowActions(false));
//       }
//     },
//   });

//   const resetPosition = () => {
//     Animated.timing(swipeAnim, {
//       toValue: 0,
//       duration: 200,
//       useNativeDriver: false,
//     }).start(() => setShowActions(false));
//   };

//   return (
//     <View style={{ marginBottom: 12 }}>
//       <Animated.View
//         style={{
//           transform: [{ translateX: swipeAnim }],
//         }}
//         {...panResponder.panHandlers}>
//         <TouchableOpacity onPress={resetPosition} activeOpacity={0.9}>
//           <TransactionCard transaction={transaction} />
//         </TouchableOpacity>
//       </Animated.View>

//       {/* Action Buttons */}
//       {showActions && (
//         <View
//           style={{
//             position: 'absolute',
//             right: 0,
//             top: 0,
//             bottom: 0,
//             flexDirection: 'row',
//             width: 160,
//           }}>
//           <TouchableOpacity
//             style={{
//               backgroundColor: '#0066FF',
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderTopLeftRadius: 16,
//               borderBottomLeftRadius: 16,
//               marginRight: 1,
//             }}
//             onPress={() => {
//               resetPosition();
//               onEdit();
//             }}>
//             <Feather name="edit" size={20} color="white" />
//             <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Edit</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               backgroundColor: '#FF4444',
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderTopRightRadius: 16,
//               borderBottomRightRadius: 16,
//             }}
//             onPress={() => {
//               resetPosition();
//               onDelete();
//             }}>
//             <Feather name="trash-2" size={20} color="white" />
//             <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// // ---------------------------------------------------------------------
// // Helper Components & Functions
// // ---------------------------------------------------------------------
// const Stat = ({ label, value, color }) => (
//   <View style={{ alignItems: 'center', flex: 1 }}>
//     <Text style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</Text>
//     <Text style={{ fontWeight: '700', fontSize: 20, color }}>{value}</Text>
//   </View>
// );

// const TransactionCard = ({ transaction }) => {
//   // Safely get transaction type with default
//   const transactionType = transaction?.type || 'unknown';
//   const isIncoming = transactionType.includes('in');
//   const color = isIncoming ? '#00C896' : '#FF4444';
//   const bg = isIncoming ? '#E0F7ED' : '#FFE8E8';

//   // FIXED: Get vendor name from multiple possible fields
//   const getVendorName = () => {
//     // Check multiple possible vendor name fields
//     if (transaction?.vendorName) return transaction.vendorName;
//     if (transaction?.vendor) return transaction.vendor;
//     if (transaction?.from) return transaction.from;
//     if (transaction?.partyName) return transaction.partyName;

//     // For different transaction types, provide meaningful fallbacks
//     if (transactionType === 'payment_in') return 'Customer Payment';
//     if (transactionType === 'payment_out') return 'Vendor Payment';
//     if (transactionType === 'purchase') return 'Material Supplier';
//     if (transactionType === 'invoice') return 'Sales Customer';
//     if (transactionType === 'debit_note') return 'Debit Note Party';

//     return 'No vendor';
//   };

//   const vendorName = getVendorName();

//   // Static conversion: INR to QAR
//   const qarAmount = ((Number(transaction?.amount) || 0) * INR_TO_QAR_RATE).toFixed(2);

//   return (
//     <View
//       style={{
//         backgroundColor: 'white',
//         borderRadius: 16,
//         padding: 14,
//         borderLeftWidth: 4,
//         borderLeftColor: '#0066FF',
//         flexDirection: 'row',
//         alignItems: 'center',
//       }}>
//       <View
//         style={{
//           width: 48,
//           height: 48,
//           borderRadius: 24,
//           backgroundColor: bg,
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginRight: 12,
//         }}>
//         <Text style={{ fontSize: 20, color }}>﷼</Text>
//       </View>

//       <View style={{ flex: 1 }}>
//         <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
//           {new Date(transaction?.createdAt || Date.now()).toLocaleDateString()} , {transactionType}
//         </Text>
//         <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{vendorName}</Text>
//       </View>

//       <View style={{ alignItems: 'flex-end' }}>
//         <Text style={{ fontWeight: '700', fontSize: 16, color, marginBottom: 4 }}>
//           ﷼{qarAmount}
//         </Text>
//         <View
//           style={{
//             backgroundColor: transaction?.status === 'approved' ? '#E0F7ED' : '#FFE8E8',
//             paddingHorizontal: 10,
//             paddingVertical: 4,
//             borderRadius: 6,
//           }}>
//           <Text
//             style={{
//               fontSize: 11,
//               fontWeight: '600',
//               color: transaction?.status === 'approved' ? '#00C896' : '#FF4444',
//             }}>
//             {transaction?.status || 'pending'}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const calculateIncoming = (list) => {
//   return list
//     .filter((t) => (t?.type || '').includes('in'))
//     .reduce((sum, t) => sum + (Number(t?.amount) || 0) * INR_TO_QAR_RATE, 0)
//     .toFixed(2);
// };
// const getTransactionAmount = (t) => {
//   // Normal transactions
//   if (t?.amount) return Number(t.amount);

//   // Material Purchase cases
//   if (t?.totalAmount) return Number(t.totalAmount);
//   if (t?.advance) return Number(t.advance);

//   // Fallback (rate × quantity)
//   if (t?.materialRate && t?.quantity) {
//     return Number(t.materialRate) * Number(t.quantity);
//   }

//   return 0;
// };


// const calculateOutgoing = (list) => {
//   return list
//     .filter(
//       (t) =>
//         (t?.type || '').includes('out') ||       // payment_out
//         (t?.type || '').toLowerCase().includes('purchase') || // material purchase
//         t?.status === 'Purchased'                // material purchase from MaterialPurchase
//     )
//     .reduce(
//       (sum, t) => sum + getTransactionAmount(t) * INR_TO_QAR_RATE,
//       0
//     )
//     .toFixed(2);
// };



// const calculateBalance = (list) => {
//   const incoming = parseFloat(calculateIncoming(list)) || 0;
//   const outgoing = parseFloat(calculateOutgoing(list)) || 0;
//   return (incoming - outgoing).toFixed(2);
// };

// export default Transaction;


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import modals
import TransactionAddModal from '../../components/TransactionAddModal';
import IncomingPaymentModal from './IncomingPaymentModal';
import OutgoingPaymentModal from './OutgoingPaymentModal';
import DebitNoteModal from '../../components/DebitNoteModal';
import MaterialPurchaseModal from '../../components/MaterialPurchaseModal';
import SalesInvoiceModal from '../../components/SalesInvoiceModal';
import GenericFormModal from '../../components/GenericFormModal';

const API_URL = `${process.env.BASE_API_URL}/api/transactions`;
const TOKEN_KEY = 'userToken';

// Exchange rate: 1 INR = 0.0401 QAR (as of December 15, 2025)
const INR_TO_QAR_RATE = 0.0401;

const Transaction = ({ project }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Transactions');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // --- PDF Generation Helper ---
  const generateInvoicePDF = async (transactionData) => {
    try {
      // 1. Prepare Watermark Image
      let watermarkBase64 = null;
      try {
        const logoModule = require('../../assets/logo.png');
        // Load asset
        const [asset] = await Asset.loadAsync(logoModule);

        // Ensure asset is downloaded (crucial for some expo versions)
        await asset.downloadAsync();

        // Ensure we have a local URI
        const uri = asset.localUri || asset.uri;

        if (uri) {
          watermarkBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          });
        }
      } catch (imgErr) {
        console.error('Failed to load watermark image:', imgErr);
      }

      // Helper to format currency
      const formatCurrency = (amount) => {
        const val = parseFloat(amount);
        return isNaN(val) ? '0.00' : val.toFixed(2);
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { 
                font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                padding: 0; 
                margin: 0;
                color: #1F2937; 
                -webkit-print-color-adjust: exact;
                background-color: #FFFFFF;
              }
              
              .page-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                position: relative;
                min-height: 100vh;
                box-sizing: border-box;
                background: transparent; /* Changed to transparent to show watermark if it was behind */
                z-index: 2;
              }

              /* Watermark Styling */
              .watermark-container {
                position: absolute; /* Changed from fixed to absolute */
                top: 35%; /* Slightly higher */
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.5;
                width: 40%;
                z-index: 1; /* Low z-index but positive */
                pointer-events: none;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .watermark-img {
                width: 100%;
                height: auto;
                object-fit: contain;
              }
              
              /* Ensure content is above watermark */
              .content-layer {
                position: relative;
                z-index: 5;
              }

              /* Header Styling */
              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 60px;
                padding-bottom: 20px;
                border-bottom: 2px solid #E5E7EB;
                position: relative;
              }
              
              .company-info h1 {
                font-size: 28px;
                font-weight: 800;
                color: #111827;
                margin: 0 0 8px 0;
                letter-spacing: -0.5px;
              }
              .company-info p {
                font-size: 13px;
                color: #6B7280;
                margin: 0;
              }

              .invoice-details {
                text-align: right;
              }
              .invoice-tag {
                background: #0066FF;
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                display: inline-block;
                margin-bottom: 8px;
              }
              .invoice-date {
                font-size: 13px;
                color: #6B7280;
                font-weight: 500;
              }

              /* Content Styling */
              .content-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
              }

              .info-group h3 {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #9CA3AF;
                margin: 0 0 8px 0;
                font-weight: 600;
              }
              .info-group p {
                font-size: 15px;
                color: #111827;
                font-weight: 500;
                margin: 0;
                line-height: 1.4;
              }

              /* Table Styling */
              .details-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 40px;
                position: relative;
                z-index: 1;
                background: rgba(255,255,255,0.8); /* Slight glass effect over watermark */
              }
              
              .details-table th {
                text-align: left;
                padding: 12px 0;
                border-bottom: 2px solid #E5E7EB;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #6B7280;
                font-weight: 600;
              }
              
              .details-table td {
                padding: 16px 0;
                border-bottom: 1px solid #F3F4F6;
                font-size: 14px;
                color: #374151;
              }
              
              .details-table td.label {
                font-weight: 500;
                color: #4B5563;
                width: 40%;
              }
              .details-table td.value {
                text-align: right;
                font-weight: 600;
                color: #111827;
              }

              /* Amount Board */
              .amount-board {
                background: #F9FAFB;
                border-radius: 12px;
                padding: 24px;
                margin-top: 20px;
                border: 1px solid #E5E7EB;
                position: relative;
                z-index: 1;
              }
              
              .amount-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
              }
              .amount-row:last-child {
                margin-bottom: 0;
                padding-top: 12px;
                border-top: 1px solid #E5E7EB;
              }
              
              .amount-label {
                font-size: 14px;
                color: #6B7280;
                font-weight: 500;
              }
              .amount-value {
                font-size: 16px;
                font-weight: 600;
                color: #111827;
              }
              .total-label {
                font-size: 16px;
                font-weight: 700;
                color: #111827;
              }
              .total-value {
                font-size: 24px;
                font-weight: 800;
                color: #0066FF;
              }

              /* Footer */
              .footer {
                margin-top: 80px;
                text-align: center;
                padding-top: 24px;
                border-top: 1px solid #E5E7EB;
                position: relative;
                z-index: 1;
              }
              .footer p {
                font-size: 12px;
                color: #9CA3AF;
                margin: 4px 0;
              }
              .footer-brand {
                font-weight: 600;
                color: #4B5563;
                margin-bottom: 8px !important;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Watermark -->
              ${watermarkBase64 ?
          `<div class="watermark-container">
                   <img src="data:image/png;base64,${watermarkBase64}" class="watermark-img" />
                 </div>` : ''
        }

              <!-- Header -->
              <div class="header">
                <div class="company-info">
                  <h1>TRANSACTION</h1>
                  <p>Receipt & Document Record</p>
                </div>
                <div class="invoice-details">
                  <span class="invoice-tag">${(transactionData.typeLabel || transactionData.type || 'Transaction').toUpperCase()}</span>
                  <div class="invoice-date">${new Date(transactionData.date || transactionData.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <!-- Key Info Grid -->
              <div class="content-grid">
                <div class="info-group">
                  <h3>Pay To / Vendor</h3>
                  <p>${transactionData.vendorName || transactionData.partyName || transactionData.vendorId?.name || 'N/A'}</p>
                </div>
                <div class="info-group">
                  <h3>Payment Method</h3>
                  <p>${transactionData.paymentModeLabel || transactionData.paymentMode || 'N/A'}</p>
                </div>
              </div>

              <!-- Detailed Table -->
              <table class="details-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="label">Reference No.</td>
                    <td class="value">${transactionData.referenceNumber || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Bank Name</td>
                    <td class="value">${transactionData.bankName || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Cost Code</td>
                    <td class="value">${transactionData.costCode || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Category</td>
                    <td class="value">${transactionData.category || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Description / Notes</td>
                    <td class="value">${transactionData.description || transactionData.notes || '-'}</td>
                  </tr>
                  ${(transactionData.documents && transactionData.documents.length > 0) ? `
                  <tr>
                    <td class="label">Attachments</td>
                    <td class="value">${transactionData.documents.length} File(s) Attached</td>
                  </tr>` : ''}
                </tbody>
              </table>

              <!-- Financial Summary -->
              <div class="amount-board">
                <div class="amount-row">
                  <span class="total-label">Total Amount (INR)</span>
                  <span class="total-value">₹ ${formatCurrency(transactionData.amount)}</span>
                </div>
                <div class="amount-row">
                  <span class="amount-label">Exchange Rate</span>
                  <span class="amount-value">1 INR = ${INR_TO_QAR_RATE} QAR</span>
                </div>
                <div class="amount-row">
                  <span class="amount-label">Equivalent Amount (QAR)</span>
                  <span class="amount-value" style="color: #059669;">﷼ ${formatCurrency(transactionData.amount * INR_TO_QAR_RATE)}</span>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p class="footer-brand">V2 Lite Construction Management</p>
                <p>This is a computer-generated document and does not require a physical signature.</p>
                <p>Generated via V2 Lite App • ${new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await printToFileAsync({ html: htmlContent });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      Alert.alert('PDF Error', 'Could not generate invoice PDF.');
    }
  };




  const fetchTransactions = useCallback(async () => {
    setError(null);
    try {
      console.log('\n[Transactions] Fetching transactions...');
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (!token) {
        Alert.alert('Error', 'User not logged in. Please sign in again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.BASE_API_URL}/api/newTransaction/${project._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[Transactions] Response status:', response.status);
      const data = await response.json();
      console.log('[Transactions] Response JSON:', data);

      // Ensure data is properly formatted with defensive checks
      let list = [];
      if (Array.isArray(data.data)) {
        list = data.data;
      } else if (Array.isArray(data)) {
        list = data;
      } else if (data.data && Array.isArray(data.data)) {
        list = data.data;
      }

      // Add defensive check for each transaction
      const safeList = list.map(transaction => ({
        ...transaction,
        type: transaction?.type || transaction?.status || 'unknown',
        amount: transaction?.amount || transaction?.advance || 0,
        status: transaction?.status || 'pending',
        vendorName: transaction?.vendorName || transaction?.vendorId?.name || '',
        createdAt: transaction?.createdAt || new Date().toISOString(),
        _id: transaction?._id || Date.now().toString(),
      }));

      console.log('[Transactions] Processed count:', safeList.length);
      setTransactions(safeList);
    } catch (err) {
      console.error('[Transactions] Fetch error:', err);
      setError('Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ---------------------------------------------------------------------
  // Create Transaction (POST)
  // ---------------------------------------------------------------------
  const handleSaveTransaction = async (formData) => {
    console.log('\n[Transactions] handleSaveTransaction data:', formData);
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const typeMap = {
        'Incoming Payment': 'payment_in',
        'Outgoing Payment': 'payment_out',
        'Material Purchase': 'Purchased',
        'Sales Invoice': 'invoice',
        'Debit Note': 'debit_note',
        'Material Return': 'expense',
        'Material Transfer': 'expense',
        'Other Expense': 'expense',
      };

      // Determine correct type safely
      let mappedType = formData?.type;

      // If it's one of the UI labels (e.g., "Debit Note"), map it to backend format
      if (typeMap[formData?.type]) {
        mappedType = typeMap[formData.type];
      }

      // Final fallback
      if (!mappedType) mappedType = 'expense';
      console.log("this is payload", formData);

      const res = await fetch(`${process.env.BASE_API_URL}/api/newTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => ({}));
      // console.log('[Transactions] POST response:', json);

      if (!res.ok) throw new Error(json.message || `Failed with ${res.status}`);

      // Auto-generate invoice
      generateInvoicePDF(formData);

      Alert.alert('Success', 'Transaction created and invoice generated!', [
        { text: 'OK' }
      ]);
      setShowTransactionModal(false);
      setSelectedTransactionType(null);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('[Transactions] Create error:', err);
      Alert.alert('Error', err.message || 'Failed to create transaction');
    }
  };

  // ---------------------------------------------------------------------
  // Update Transaction (PUT)
  // ---------------------------------------------------------------------
  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error('Missing auth token');

      console.log(`[Transactions] Updating transaction ${id}`);

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const json = await res.json().catch(() => ({}));
      console.log('[Transactions] PUT response:', json);

      if (!res.ok) throw new Error(json.message || 'Update failed');

      Alert.alert('Updated', 'Transaction updated successfully!');
      setEditingTransaction(null);
      setSelectedTransactionType(null);
      fetchTransactions();
    } catch (err) {
      console.error('[Transactions] Update error:', err);
      Alert.alert('Error', err.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (!token) throw new Error('Missing token');

            console.log(`[Transactions] Deleting transaction ${id}`);

            const res = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json().catch(() => ({}));
            console.log('[Transactions] DELETE response:', json);

            if (!res.ok) throw new Error(json.message || 'Delete failed');

            Alert.alert('Deleted', 'Transaction removed successfully.');
            fetchTransactions();
          } catch (err) {
            console.error('[Transactions] Delete error:', err);
            Alert.alert('Error', err.message || 'Failed to delete transaction');
          }
        },
      },
    ]);
  };

  // ---------------------------------------------------------------------
  // Handle Edit Transaction - FIXED: Now sets correct type and opens modal
  // ---------------------------------------------------------------------
  const handleEditTransaction = (transaction) => {
    console.log('[Transactions] Editing transaction:', transaction);

    const typeMap = {
      payment_in: 'Incoming Payment',
      payment_out: 'Outgoing Payment',
      purchased: 'Material Purchase',
      invoice: 'Sales Invoice',
      debit_note: 'Debit Note',
      expense: 'Other Expense',
    };

    const uiType = typeMap[transaction?.type] || 'Other Expense';

    // Set both states to open the correct modal
    setEditingTransaction(transaction);
    setSelectedTransactionType(uiType);

    console.log('[Transactions] Opening modal for type:', uiType);
  };

  // ---------------------------------------------------------------------
  // Reset editing state when modal closes
  // ---------------------------------------------------------------------
  const handleModalClose = () => {
    console.log('[Transactions] Closing modal, resetting editing state');
    setSelectedTransactionType(null);
    setEditingTransaction(null);
  };

  // ---------------------------------------------------------------------
  // UI States
  // ---------------------------------------------------------------------
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading transactions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchTransactions}
          style={{
            marginTop: 16,
            backgroundColor: '#0066FF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}>
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#0066FF',
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Stat label="BALANCE" value={`+ ${calculateBalance(transactions)} QAR`} color="#0ac42cff" />
            <Stat label="TOTAL INCOMING" value={`${calculateIncoming(transactions)} QAR`} color="#000" />
            <Stat label="TOTAL OUTGOING" value={`${calculateOutgoing(transactions)} QAR`} color="#FF4444" />
          </View>
        </View>

        {/* Transactions List */}
        <View style={{ paddingHorizontal: 16 }}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 30 }}>
              No transactions found
            </Text>
          ) : (
            transactions.map((transaction) => (
              <SwipeableTransactionCard
                key={transaction._id}
                transaction={transaction}
                onDelete={() => handleDeleteTransaction(transaction._id)}
                onEdit={() => handleEditTransaction(transaction)}
                onDownload={() => generateInvoicePDF(transaction)}
              />
            ))
          )}
        </View>

        {/* Add Transaction Button */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => setShowTransactionModal(true)}
            style={{
              backgroundColor: '#0066FF',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
              Add Transaction Entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals - Fixed: All modals now properly handle edit mode */}
      <View pointerEvents="box-none">
        <TransactionAddModal
          visible={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransactionType(null);
            setEditingTransaction(null);
          }}
          onSelectTransactionType={setSelectedTransactionType}
        />

        <IncomingPaymentModal
          visible={selectedTransactionType === 'Incoming Payment'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
          project={project}
        />

        <OutgoingPaymentModal
          visible={selectedTransactionType === 'Outgoing Payment'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          project={project}
          editingTransaction={editingTransaction}
        />

        <DebitNoteModal
          visible={selectedTransactionType === 'Debit Note'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />
        <MaterialPurchaseModal
          visible={selectedTransactionType === 'Material Purchase'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />
        <SalesInvoiceModal
          visible={selectedTransactionType === 'Sales Invoice'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />

        {['Material Return', 'Material Transfer', 'Other Expense'].map((type) => (
          <GenericFormModal
            key={type}
            visible={selectedTransactionType === type}
            onClose={handleModalClose}
            type={type}
            onSave={
              editingTransaction
                ? (data) => handleUpdateTransaction(editingTransaction._id, data)
                : handleSaveTransaction
            }
            editingTransaction={editingTransaction}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------
// Swipeable Transaction Card Component
// ---------------------------------------------------------------------
const SwipeableTransactionCard = ({ transaction, onDelete, onEdit, onDownload }) => {
  const swipeAnim = useState(new Animated.Value(0))[0];
  const [showActions, setShowActions] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        swipeAnim.setValue(gestureState.dx);
      } else if (gestureState.dx > 0) {
        swipeAnim.setValue(0);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -80) {
        Animated.timing(swipeAnim, {
          toValue: -160,
          duration: 200,
          useNativeDriver: false,
        }).start(() => setShowActions(true));
      } else {
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => setShowActions(false));
      }
    },
  });

  const resetPosition = () => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setShowActions(false));
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Animated.View
        style={{
          transform: [{ translateX: swipeAnim }],
        }}
        {...panResponder.panHandlers}>
        <TouchableOpacity onPress={resetPosition} activeOpacity={0.9}>
          <TransactionCard transaction={transaction} onDownload={onDownload} />
        </TouchableOpacity>
      </Animated.View>

      {/* Action Buttons */}
      {showActions && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            flexDirection: 'row',
            width: 160,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#0066FF',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              marginRight: 1,
            }}
            onPress={() => {
              resetPosition();
              onEdit();
            }}>
            <Feather name="edit" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#FF4444',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            }}
            onPress={() => {
              resetPosition();
              onDelete();
            }}>
            <Feather name="trash-2" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------
// Helper Components & Functions
// ---------------------------------------------------------------------
const Stat = ({ label, value, color }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</Text>
    <Text style={{ fontWeight: '700', fontSize: 20, color }}>{value}</Text>
  </View>
);

const TransactionCard = ({ transaction, onDownload }) => {
  // Safely get transaction type with default
  const transactionType = transaction?.type || 'unknown';
  const isIncoming = transactionType.includes('in');
  const color = isIncoming ? '#00C896' : '#FF4444';
  const bg = isIncoming ? '#E0F7ED' : '#FFE8E8';

  // FIXED: Get vendor name from multiple possible fields
  const getVendorName = () => {
    // Check multiple possible vendor name fields
    if (transaction?.vendorName) return transaction.vendorName;
    if (transaction?.vendor) return transaction.vendor;
    if (transaction?.from) return transaction.from;
    if (transaction?.partyName) return transaction.partyName;

    // For different transaction types, provide meaningful fallbacks
    if (transactionType === 'payment_in') return 'Customer Payment';
    if (transactionType === 'payment_out') return 'Vendor Payment';
    if (transactionType === 'purchase') return 'Material Supplier';
    if (transactionType === 'invoice') return 'Sales Customer';
    if (transactionType === 'debit_note') return 'Debit Note Party';

    return 'No vendor';
  };

  const vendorName = getVendorName();

  // Static conversion: INR to QAR
  const qarAmount = ((Number(transaction?.amount) || 0) * INR_TO_QAR_RATE).toFixed(2);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#0066FF',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
        <Text style={{ fontSize: 20, color }}>﷼</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
          {new Date(transaction?.createdAt || Date.now()).toLocaleDateString()} , {transactionType}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{vendorName}</Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color, marginBottom: 4 }}>
          ﷼{qarAmount}
        </Text>
        <View
          style={{
            backgroundColor: transaction?.status === 'approved' ? '#E0F7ED' : '#FFE8E8',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
            marginBottom: 6,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: transaction?.status === 'approved' ? '#00C896' : '#FF4444',
            }}>
            {transaction?.status || 'pending'}
          </Text>
        </View>

        {/* Download Icon */}
        <TouchableOpacity
          onPress={onDownload}
          style={{
            padding: 4,
            marginTop: 4,
          }}>
          <Feather name="download" size={18} color="#0066FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const calculateIncoming = (list) => {
  return list
    .filter((t) => (t?.type || '').includes('in'))
    .reduce((sum, t) => sum + (Number(t?.amount) || 0) * INR_TO_QAR_RATE, 0)
    .toFixed(2);
};
const getTransactionAmount = (t) => {
  // Normal transactions
  if (t?.amount) return Number(t.amount);

  // Material Purchase cases
  if (t?.totalAmount) return Number(t.totalAmount);
  if (t?.advance) return Number(t.advance);

  // Fallback (rate × quantity)
  if (t?.materialRate && t?.quantity) {
    return Number(t.materialRate) * Number(t.quantity);
  }

  return 0;
};


const calculateOutgoing = (list) => {
  return list
    .filter(
      (t) =>
        (t?.type || '').includes('out') ||       // payment_out
        (t?.type || '').toLowerCase().includes('purchase') || // material purchase
        t?.status === 'Purchased'                // material purchase from MaterialPurchase
    )
    .reduce(
      (sum, t) => sum + getTransactionAmount(t) * INR_TO_QAR_RATE,
      0
    )
    .toFixed(2);
};



const calculateBalance = (list) => {
  const incoming = parseFloat(calculateIncoming(list)) || 0;
  const outgoing = parseFloat(calculateOutgoing(list)) || 0;
  return (incoming - outgoing).toFixed(2);
};

export default Transaction;