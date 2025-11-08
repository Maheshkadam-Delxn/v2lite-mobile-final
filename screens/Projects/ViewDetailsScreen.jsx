// import React, { useState } from 'react';
// import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import Header from 'components/Header';

// const ViewDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { project } = route.params;
//   const [activeTab, setActiveTab] = useState('Details');

//   const handleBack = () => {
//     navigation.goBack();
//   };

//   const handleEdit = () => {
//     console.log('Edit project:', project.id);
//     navigation.navigate('CreateProjectScreen');
//   };

//   const tabs = [
//     { id: 'Details', label: 'Details' },
//     { id: 'Task', label: 'Task' },
//     { id: 'Transaction', label: 'Transaction' },
//     { id: 'Attendance', label: 'Attendance' },
//   ];

//   // Container component for consistent styling
//   const SectionContainer = ({ children, title }) => (
//     <View className="mb-4 rounded-2xl border-l-4 border-blue-600 bg-white p-4"
//       style={{
//         shadowColor: '#000',
//         shadowOffset: {
//           width: 0,
//           height: 1,
//         },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 1,
//       }}
//     >
//       <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
//         {title}
//       </Text>
//       {children}
//     </View>
//   );

//   // Detail row component for consistent item styling
//   const DetailRow = ({ label, value }) => (
//     <View className="flex-row justify-between py-3 border-b border-gray-100 last:border-b-0">
//       <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500 text-base flex-1">
//         {label}
//       </Text>
//       <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900 text-base flex-1 text-right">
//         {value}
//       </Text>
//     </View>
//   );

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'Details':
//         return (
//           <>
//             {/* Basic Project Details */}
//             <SectionContainer title="Basic Project Details">
//               <View className="space-y-1">
//                 <DetailRow label="Project Name" value="Luxury Vale Point Bay" />
//                 <DetailRow label="Project Type" value="Vale Construction" />
//                 <DetailRow label="Project ID" value="SRT-00325" />
//                 <DetailRow label="Location" value="Palm Jummel's Dubai Gulf" />
//                 <DetailRow label="Start Date" value="10 Jan 2024" />
//                 <DetailRow label="End Date" value="10 Dec 2024" />
//                 <DetailRow label="Project Status" value="-" />
//               </View>
//             </SectionContainer>

//             {/* Project Team */}
//             <SectionContainer title="Project Team">
//               <View className="space-y-1">
//                 <DetailRow label="Project Manager" value="John Dan" />
//                 <DetailRow label="Consular" value="RFC No Horizon" />
//                 <DetailRow label="Main Controller" value="Elkin Bullerin LLC" />
//                 <DetailRow label="Subcommittee" value="-" />
//               </View>
//             </SectionContainer>

//             {/* Financial Overview */}
//             <SectionContainer title="Financial Overview">
//               <View className="space-y-1">
//                 <DetailRow label="Trade Budget" value="$5,000,000" />
//                 <DetailRow label="Amount Spent" value="$2,250,000" />
//                 <DetailRow label="Servicing Budget" value="$2,350,000" />
//                 <DetailRow label="ECO Approval Status" value="-" />
//               </View>
//             </SectionContainer>

//             {/* Client & Approach */}
//             <SectionContainer title="Client & Approach">
//               <View className="space-y-1">
//                 <DetailRow label="Client Name" value="Mr. Ahmed al-Farot" />
//                 <DetailRow label="Approval Status" value="Pruning Client That Review" />
//                 <DetailRow label="Docs List" value="$ Home Notebook 2 Printing" />
//               </View>
//             </SectionContainer>
//           </>
//         );
      
//       case 'Task':
//         return (
//           <SectionContainer title="Tasks">
//             <View className="space-y-4">
//               <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
//                 Task content will be displayed here
//               </Text>
//             </View>
//           </SectionContainer>
//         );
      
//       case 'Transaction':
//         return (
//           <SectionContainer title="Transactions">
//             <View className="space-y-4">
//               <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
//                 Transaction content will be displayed here
//               </Text>
//             </View>
//           </SectionContainer>
//         );
      
//       case 'Attendance':
//         return (
//           <SectionContainer title="Attendance">
//             <View className="space-y-4">
//               <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
//                 Attendance content will be displayed here
//               </Text>
//             </View>
//           </SectionContainer>
//         );
      
//       default:
//         return null;
//     }
//   };

//   const renderTabItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => setActiveTab(item.id)}
//       className={`px-6 py-3 rounded-full mx-1 ${
//         activeTab === item.id ? 'bg-blue-600' : 'bg-gray-100'
//       }`}
//     >
//       <Text
//         style={{ fontFamily: 'Urbanist-SemiBold' }}
//         className={`text-base ${
//           activeTab === item.id ? 'text-white' : 'text-gray-600'
//         }`}
//       >
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-gray-50">
//       <Header
//         title="Project Details"
//         showBackButton={true}
//         onBackPress={handleBack}
//         onRightIconPress={handleEdit}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       {/* Horizontal Tabs */}
//       <View className="bg-white py-3 border-b border-gray-200">
//         <FlatList
//           data={tabs}
//           renderItem={renderTabItem}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 12 }}
//         />
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         {/* Project Info */}
//         <View className="px-5 py-6">
         
//           {/* Tab Content */}
//           {renderTabContent()}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default ViewDetailsScreen;


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
const ViewDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params || {};
  const [activeTab, setActiveTab] = useState('Task');
  const [activeView, setActiveView] = useState('Calendar'); // Calendar = Activities, Activity = Calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const handleBack = () => navigation.goBack();
  const handleEdit = () => {
    console.log('Edit project:', project?.id);
    navigation.navigate('CreateProjectScreen');
  };
  const tabs = [
    { id: 'Details', label: 'Details' },
    { id: 'Task', label: 'Task' },
    { id: 'Transaction', label: 'Transaction' },
    { id: 'Attendance', label: 'Attendance' },
  ];
  const viewTabs = [
    { id: 'Calendar', label: 'Calendar' }, // Shows Activities
    { id: 'Activity', label: 'Activity' }, // Shows Calendar
  ];
  // Project Status
  const projectStatus = [
    { label: 'Completed (110)', color: '#1DD1A1', icon: 'checkmark-circle' },
    { label: 'In Progress (80)', color: '#0066FF', icon: 'time' },
    { label: 'Ongoing (40)', color: '#FFA800', icon: 'play-circle' },
    { label: 'Cancelled (10)', color: '#FF3B30', icon: 'close-circle' },
  ];
  // Activity Data
  const activities = [
    {
      id: 1,
      title: 'Documenting',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
      time: '09:00 AM',
    },
    {
      id: 2,
      title: 'Onboarding',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
      time: '10:30 AM',
    },
    {
      id: 3,
      title: 'Team Meeting',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'Low',
      assignees: 5,
      time: '02:00 PM',
    },
    {
      id: 4,
      title: 'Client Call',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 2,
      time: '04:15 PM',
    },
  ];
  // Calendar Logic
  const generateWeekDates = (startDate) => {
    const dates = [];
    const current = new Date(startDate);
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 4);
    current.setDate(diff);
    const dayNames = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      dates.push({
        date: date.getDate(),
        day: dayNames[i],
        fullDate: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
        isToday: isToday(date),
      });
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const formatMonthYear = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[date.getMonth()] + ' ' + date.getFullYear().toString().slice(2);
  };
  const handlePreviousWeek = () => {
    const newDate = new Date(currentMonth);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentMonth(newDate);
  };
  const handleNextWeek = () => {
    const newDate = new Date(currentMonth);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentMonth(newDate);
  };
  const weekDates = generateWeekDates(currentMonth);
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
  navigation.navigate('TaskScreen');
  return null;

      case 'Transaction':
        return (
          <SectionContainer title="Transactions">
            <Text style={styles.placeholder}>Transaction content will be displayed here</Text>
          </SectionContainer>
        );
      case 'Attendance':
        return (
          <SectionContainer title="Attendance">
            <Text style={styles.placeholder}>Attendance content will be displayed here</Text>
          </SectionContainer>
        );
      default:
        return null;
    }
  };
  const renderMainTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
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
// Styles (Tailwind-like via StyleSheet)
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
 


