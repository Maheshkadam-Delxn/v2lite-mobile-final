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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

const Transaction = ({project}) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Transactions');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Debug AsyncStorage (once)
  useEffect(() => {
    const debugAsyncStorage = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      console.log('[Debug] AsyncStorage contents:', data);
    };
    debugAsyncStorage();
  }, []);

  // ---------------------------------------------------------------------
  // Fetch Transactions (GET)
  // ---------------------------------------------------------------------
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
        type: transaction?.type || transaction?.status ||'unknown',
        amount: transaction?.amount || transaction?.advance|| 0,
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
  // Create Transaction (POST) - UPDATED for new schema
  // ---------------------------------------------------------------------
  const handleSaveTransaction = async (formData) => {
    console.log('\n[Transactions] handleSaveTransaction data:', formData);
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      // Map UI transaction types to new schema fields
      const transactionMapping = {
        'Incoming Payment': {
          category: 'payment',
          nature: 'payment_in',
          direction: 'credit'
        },
        'Outgoing Payment': {
          category: 'payment',
          nature: 'payment_out',
          direction: 'debit'
        },
        'Material Purchase': {
          category: 'material',
          nature: 'purchase',
          direction: 'debit'
        },
        'Sales Invoice': {
          category: 'document',
          nature: 'invoice',
          direction: 'credit'
        },
        'Debit Note': {
          category: 'document',
          nature: 'debit_note',
          direction: 'debit'
        },
        'Material Return': {
          category: 'material',
          nature: 'expense', // Could be 'return' if added to enum
          direction: 'credit'
        },
        'Material Transfer': {
          category: 'material',
          nature: 'expense', // Could be 'transfer' if added to enum
          direction: 'debit'
        },
        'Other Expense': {
          category: 'expense',
          nature: 'expense',
          direction: 'debit'
        }
      };

      // Get mapping for the selected transaction type
      const uiType = formData.uiType || selectedTransactionType || 'Other Expense';
      const mapping = transactionMapping[uiType] || {
        category: 'expense',
        nature: 'expense',
        direction: 'debit'
      };

      // Build payload according to new schema
      const payload = {
        projectId: projectId || '691189346522d6945d920bac',
        createdBy: parsedUser.id || '690d86c4425a1a0b7dfe7d42',
        category: mapping.category,
        nature: mapping.nature,
        direction: mapping.direction,
        amount: Number(formData.amount) || 0,
        remarks: formData.remarks || '',
        vendorName: formData.vendorName || formData.from || formData.partyName || '',
        invoiceNumber: formData.invoiceNumber || '',
        invoiceDate: formData.invoiceDate || new Date(),
        paymentMode: formData.paymentMode || 'cash',
        referenceNumber: formData.referenceNumber || '',
        paymentDate: formData.paymentDate || new Date(),
        items: formData.items || [],
        documents: formData.documents || [],
        currency: 'INR',
        status: 'pending',
        // Include materialId if available
        ...(formData.materialId && { materialId: formData.materialId })
      };

      console.log('[Transactions] Sending POST payload:', payload);

      const res = await fetch(API_URL, {
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

      Alert.alert('Success', 'Transaction created successfully!');
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
  // Update Transaction (PUT) - UPDATED for new schema
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

  // ---------------------------------------------------------------------
  // Delete Transaction (DELETE)
  // ---------------------------------------------------------------------
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
  // Handle Edit Transaction - UPDATED for new schema
  // ---------------------------------------------------------------------
  const handleEditTransaction = (transaction) => {
    console.log('[Transactions] Editing transaction:', transaction);

    // Reverse mapping: from new schema to UI types
    const natureToUIType = {
      payment_in: 'Incoming Payment',
      payment_out: 'Outgoing Payment',
      purchased: 'Material Purchase',
      invoice: 'Sales Invoice',
      debit_note: 'Debit Note',
      expense: 'Other Expense'
    };

    const uiType = natureToUIType[transaction.nature] || 'Other Expense';

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

      {/* Modals */}
      <View pointerEvents="box-none">
        <TransactionAddModal
          visible={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransactionType(null);
            setEditingTransaction(null);
          }}
          onSelectTransactionType={setSelectedTransactionType}
          projectId={project._id}
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
          projectId={project._id}
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
          projectId={project._id}
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
          projectId={project._id}
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
          projectId={project._id}
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
          projectId={project._id}
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
            projectId={project._id}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------
// Swipeable Transaction Card Component
// ---------------------------------------------------------------------
const SwipeableTransactionCard = ({ transaction, onDelete, onEdit }) => {
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
          <TransactionCard transaction={transaction} />
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
// Helper Components & Functions - UPDATED
// ---------------------------------------------------------------------
const Stat = ({ label, value, color }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</Text>
    <Text style={{ fontWeight: '700', fontSize: 20, color }}>{value}</Text>
  </View>
);

const TransactionCard = ({ transaction }) => {
  // Determine if transaction is incoming based on direction
  const isIncoming = transaction.direction === 'credit';
  const color = isIncoming ? '#00C896' : '#FF4444';
  const bg = isIncoming ? '#E0F7ED' : '#FFE8E8';

  // Get display name for transaction nature
  const getNatureDisplay = () => {
    const natureMap = {
      payment_in: 'Payment In',
      payment_out: 'Payment Out',
      purchase: 'Material Purchase',
      invoice: 'Sales Invoice',
      debit_note: 'Debit Note',
      expense: 'Expense'
    };
    return natureMap[transaction.nature] || transaction.nature;
  };

  // Get vendor name from multiple possible fields
  const getVendorName = () => {
    if (transaction.vendorName) return transaction.vendorName;
    if (transaction.vendor) return transaction.vendor;
    if (transaction.from) return transaction.from;
    if (transaction.partyName) return transaction.partyName;
    
    // Provide meaningful fallbacks based on nature
    switch(transaction.nature) {
      case 'payment_in': return 'Customer Payment';
      case 'payment_out': return 'Vendor Payment';
      case 'purchase': return 'Material Supplier';
      case 'invoice': return 'Sales Customer';
      case 'debit_note': return 'Debit Note Party';
      default: return 'No vendor';
    }
  };

  const vendorName = getVendorName();
  const natureDisplay = getNatureDisplay();

  // Static conversion: INR to QAR
  const qarAmount = ((Number(transaction?.amount) || 0) * INR_TO_QAR_RATE).toFixed(2);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: isIncoming ? '#00C896' : '#FF4444',
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
        <Text style={{ fontSize: 20, color }}>
          {isIncoming ? '↓' : '↑'}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
          {new Date(transaction.createdAt).toLocaleDateString()} • {natureDisplay}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{vendorName}</Text>
        <Text style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
          Category: {transaction.category}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color, marginBottom: 4 }}>
          ﷼{qarAmount}
        </Text>
        <View
          style={{
            backgroundColor: transaction.status === 'approved' ? '#E0F7ED' : 
                           transaction.status === 'rejected' ? '#FFE8E8' : '#FFF3CD',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: transaction.status === 'approved' ? '#00C896' : 
                     transaction.status === 'rejected' ? '#FF4444' : '#856404',
            }}>
            {transaction.status?.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Updated calculation functions based on direction field
const calculateIncoming = (list) =>
  list
    .filter((t) => t.direction === 'credit')
    .reduce((sum, t) => sum + (Number(t.amount) || 0) * INR_TO_QAR_RATE, 0)
    .toFixed(2);

const calculateOutgoing = (list) =>
  list
    .filter((t) => t.direction === 'debit')
    .reduce((sum, t) => sum + (Number(t.amount) || 0) * INR_TO_QAR_RATE, 0)
    .toFixed(2);

const calculateBalance = (list) => 
  (calculateIncoming(list) - calculateOutgoing(list)).toFixed(2);

export default Transaction;