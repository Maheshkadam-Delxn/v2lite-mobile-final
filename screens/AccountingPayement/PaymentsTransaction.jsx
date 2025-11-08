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
      date: '10 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '₹5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 2,
      date: '10 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '₹1000',
      status: 'unpaid',
      isIncoming: false,
    },
    {
      id: 3,
      date: '10 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '₹5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 4,
      date: '10 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '₹1000',
      status: 'unpaid',
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
      <View style={styles.transactionIcon}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: item.isIncoming ? '#E8F9F3' : '#FFE8E8' },
          ]}
        >
          <Ionicons
            name={item.isIncoming ? 'arrow-down' : 'arrow-up'}
            size={20}
            color={item.isIncoming ? '#10B981' : '#EF4444'}
          />
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionPerson}>{item.person}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.isIncoming ? '#10B981' : '#EF4444' },
          ]}
        >
          {item.amount}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.status === 'paid' ? '#E8F9F3' : '#FFE8E8',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'paid' ? '#10B981' : '#EF4444',
              },
            ]}
          >
            {item.status === 'paid' ? 'Paid' : 'Unpaid'}
          </Text>
        </View>
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
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL INVOICES</Text>
              <Text style={styles.statValue}>₹ 4,000</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL PAYMENTS</Text>
              <Text style={styles.statValue}>₹ 5,000</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>INVOICES</Text>
              <Text style={styles.statValue}>₹ 0</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL EXPENSE</Text>
              <Text style={styles.statValue}>₹ 300</Text>
            </View>
          </View>
        </View>

        {/* Pending Entries */}
        <View style={styles.pendingSection}>
          <View style={styles.pendingSectionHeader}>
            <View style={styles.pendingTitleRow}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.pendingTitle}>Pending Entries</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>4</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="more-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
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
  statsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#111827',
  },
  pendingSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  pendingSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#111827',
  },
  pendingBadge: {
    backgroundColor: '#0066FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  pendingBadgeText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 11,
    color: 'white',
  },
  transactionsContainer: {
    paddingHorizontal: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionIcon: {
    marginRight: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  transactionType: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 13,
    color: '#111827',
    marginBottom: 2,
  },
  transactionPerson: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
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
    fontSize: 15,
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