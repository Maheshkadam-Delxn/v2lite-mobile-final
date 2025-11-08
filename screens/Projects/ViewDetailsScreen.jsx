import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons, Feather } from '@expo/vector-icons';
import BottomNavBar from 'components/BottomNavbar';
import TaskScreen from './TaskScreen';
import PaymentsTransaction from 'screens/AccountingPayement/PaymentsTransaction';

const ViewDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params || {};
  const [activeTab, setActiveTab] = useState('Task');
  const [activeView, setActiveView] = useState('Calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleBack = () => navigation.goBack();
  
  const handleEdit = () => {
    console.log('Edit project:', project?.id);
    navigation.navigate('CreateProjectScreen');
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    // Only navigate to other screens for Transaction and Attendance
    // For Details and Task, we handle it within this component
    if (tab === 'Transaction') {
      navigation.navigate('Transaction');
    // } else if (tab === 'Attendance') {
    //   navigation.navigate('Attendance');
    }
    else if (tab === 'Transaction') {
    navigation.navigate('Payments', {
      screen: 'PaymentsTransaction',
      params: { project },              
    });
  }
    // For 'Details' and 'Task', just set the active tab (no navigation)
  };

  const tabs = [
    { id: 'Details', label: 'Details' },
    { id: 'Task', label: 'Task' },
    { id: 'Transaction', label: 'Transaction' },
    { id: 'Attendance', label: 'Attendance' },
  ];

  const viewTabs = [
    { id: 'Calendar', label: 'Calendar' },
    { id: 'Activity', label: 'Activity' },
  ];

  // Reusable Components
  const SectionContainer = ({ children, title }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <>
            <SectionContainer title="Basic Project Details">
              <View style={styles.detailList}>
                <DetailRow label="Project Name" value="Luxury Vale Point Bay" />
                <DetailRow label="Project Type" value="Vale Construction" />
                <DetailRow label="Project ID" value="SRT-00325" />
                <DetailRow label="Location" value="Palm Jummel's Dubai Gulf" />
                <DetailRow label="Start Date" value="10 Jan 2024" />
                <DetailRow label="End Date" value="10 Dec 2024" />
                <DetailRow label="Project Status" value="-" />
              </View>
            </SectionContainer>
            <SectionContainer title="Project Team">
              <View style={styles.detailList}>
                <DetailRow label="Project Manager" value="John Dan" />
                <DetailRow label="Consular" value="RFC No Horizon" />
                <DetailRow label="Main Controller" value="Elkin Bullerin LLC" />
                <DetailRow label="Subcommittee" value="-" />
              </View>
            </SectionContainer>
            <SectionContainer title="Financial Overview">
              <View style={styles.detailList}>
                <DetailRow label="Trade Budget" value="$5,000,000" />
                <DetailRow label="Amount Spent" value="$2,250,000" />
                <DetailRow label="Servicing Budget" value="$2,350,000" />
                <DetailRow label="ECO Approval Status" value="-" />
              </View>
            </SectionContainer>
            <SectionContainer title="Client & Approach">
              <View style={styles.detailList}>
                <DetailRow label="Client Name" value="Mr. Ahmed al-Farot" />
                <DetailRow label="Approval Status" value="Pruning Client That Review" />
                <DetailRow label="Docs List" value="$ Home Notebook 2 Printing" />
              </View>
            </SectionContainer>
          </>
        );
      
      case 'Task':
        // Render the TaskScreen component inline
        return <TaskScreen project={project} />;

        // case 'Transaction':
        // return <PaymentsTransaction project={project} />;
      
      default:
        return null;
    }
  };

  const renderMainTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleTabSelect(item.id)}
      style={[
        styles.mainTab,
        activeTab === item.id ? styles.mainTabActive : styles.mainTabInactive,
      ]}
    >
      <Text
        style={[
          styles.mainTabText,
          activeTab === item.id ? styles.mainTabTextActive : styles.mainTabTextInactive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Project Details"
        showBackButton={true}
        onBackPress={handleBack}
        onRightIconPress={handleEdit}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />
      <View style={styles.mainTabBar}>
        <FlatList
          data={tabs}
          renderItem={renderMainTabItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <BottomNavBar />
      </View>
    </View>
  );
};

// Styles remain the same as in your original code
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mainTabBar: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  mainTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  mainTabActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  mainTabInactive: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
  },
  mainTabText: {
    fontSize: 13,
    fontFamily: 'Urbanist-SemiBold',
  },
  mainTabTextActive: { color: 'white' },
  mainTabTextInactive: { color: '#4b5563' },
  content: { paddingHorizontal: 0 },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 16,
  },
  detailList: { gap: 4 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 15,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  // Task Tab
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusLabel: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 11,
    color: '#374151',
    flex: 1,
  },
  viewTabContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  viewTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  viewTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewTabActive: {
    borderBottomColor: '#0066FF',
  },
  viewTabText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#6b7280',
  },
  viewTabTextActive: {
    color: '#0066FF',
    fontFamily: 'Urbanist-Bold',
  },
  calendarContainer: { padding: 16 },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 15,
    color: '#111827',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayName: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
  },
  dayNameFaded: { color: '#d1d5db' },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelected: { backgroundColor: '#0066FF' },
  dateToday: { backgroundColor: '#dbeafe' },
  dateText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
  },
  dateTextSelected: { color: 'white' },
  dateTextToday: { color: '#0066FF' },
  dateTextNormal: { color: '#111827' },
  dateTextFaded: { color: '#d1d5db' },
  activityContainer: { padding: 16 },
  addButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#111827',
  },
  activityTime: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
    color: '#0066FF',
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: { backgroundColor: '#fee2e2' },
  priorityLow: { backgroundColor: '#ecfdf5' },
  priorityText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
  },
  textHigh: { color: '#ef4444' },
  textLow: { color: '#10b981' },
  activityDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeAvatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: 'white',
  },
  assigneeCount: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 8,
  },
  placeholder: {
    fontFamily: 'Urbanist-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 32,
    fontSize: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ViewDetailsScreen;