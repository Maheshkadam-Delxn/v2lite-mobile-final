import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';

const PaymentsTransaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params || {};
  
  const [activeTab, setActiveTab] = useState('Transactions');

  const tabs = [
    { id: 'Details', label: 'Details' },
    { id: 'Tasks', label: 'Tasks' },
    { id: 'Transactions', label: 'Transactions' },
    { id: 'Attendance', label: 'Attendance' },
  ];

  const transactions = [
    {
      id: 1,
      date: '19 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '❤️ 5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 2,
      date: '19 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '❤️ 1000',
      status: 'unpaid',
      isIncoming: false,
    },
    {
      id: 3,
      date: '19 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '❤️ 5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 4,
      date: '19 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '❤️ 1000',
      status: 'paid',
      isIncoming: false,
    },
  ];

  const handleBack = () => navigation.goBack();

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    if (tab === 'Details') {
      navigation.navigate('Details');
    } else if (tab === 'Tasks') {
      navigation.navigate('Task');
    } else if (tab === 'Attendance') {
      navigation.navigate('Attendance');
    }
  };

  const handleAddTransaction = () => {
    console.log('Add transaction');
    // Navigate to add transaction screen
  };

  const handleOptions = () => {
    console.log('Options');
  };

  const renderTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleTabSelect(item.id)}
      style={[
        styles.tab,
        activeTab === item.id ? styles.tabActive : styles.tabInactive,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === item.id ? styles.tabTextActive : styles.tabTextInactive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionCard = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDate}>{item.date}, {item.type}</Text>
        <Text style={styles.transactionPerson}>{item.person}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          {item.amount}
        </Text>
        {item.status === 'unpaid' && (
          <Text style={styles.unpaidText}>Unpaid</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Project Name"
        showBackButton={true}
        onBackPress={handleBack}
        rightIcon="person-circle"
        onRightIconPress={handleOptions}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <FlatList
          data={tabs}
          renderItem={renderTabItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Section - Matches screenshot layout */}
        <View style={styles.statsSection}>
          {/* Details Card */}
          <View style={styles.statCard}>
            <Text style={styles.statMainLabel}>BALANCE</Text>
            <View style={styles.amountRow}>
              <Text style={styles.plusSign}>+</Text>
              <Text style={styles.statMainValue}>4,000</Text>
            </View>
          </View>

          {/* Tasks Card */}
          <View style={styles.statCard}>
            <Text style={styles.statMainLabel}>TOTAL INCOMING</Text>
            <Text style={styles.statMainValue}>5,000</Text>
          </View>

          {/* Transactions Card */}
          <View style={styles.statCard}>
            <Text style={styles.statMainLabel}>TOTAL OUTGOING</Text>
            <Text style={styles.statMainValue}>1,000</Text>
          </View>

          {/* Two-column section */}
          <View style={styles.twoColumnRow}>
            <View style={[styles.statCard, styles.halfCard]}>
              <Text style={styles.statLabel}>INVOICE</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.crossIcon}>❌️</Text>
                <Text style={styles.statValue}>O</Text>
              </View>
            </View>
            <View style={[styles.statCard, styles.halfCard]}>
              <Text style={styles.statLabel}>TOTAL EXPENSE</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.crossIcon}>❌️</Text>
                <Text style={styles.statValue}>300</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Pending Entries Header */}
        <View style={styles.pendingHeader}>
          <Text style={styles.pendingTitle}>Pending Entries</Text>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <FlatList
            data={transactions}
            renderItem={renderTransactionCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Add Transaction Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <Text style={styles.addButtonText}>Add Transaction Entry</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabBar: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBarContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  tabInactive: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Urbanist-SemiBold',
  },
  tabTextActive: {
    color: 'white',
  },
  tabTextInactive: {
    color: '#6B7280',
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  statMainLabel: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  statMainValue: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#000000',
  },
  statLabel: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#000000',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusSign: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#000000',
    marginRight: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crossIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  pendingHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  pendingTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#000000',
  },
  transactionsContainer: {
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  transactionPerson: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#666666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  unpaidText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
    color: '#FF4444',
  },
  addButton: {
    backgroundColor: '#0066FF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: 'white', 
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PaymentsTransaction;