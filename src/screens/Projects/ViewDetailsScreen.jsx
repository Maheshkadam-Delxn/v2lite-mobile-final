
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '@/components/Header';
import { Ionicons, Feather } from '@expo/vector-icons';
import BottomNavBar from '@/components/BottomNavbar';
import TaskScreen from './TaskScreen';
import PaymentsTransaction from '@/screens/AccountingPayement/Transaction';
import ApproveSurveyScreen from '@/screens/Surveys/ApproveSurveyScreen';
import PlansScreen from '@/screens/Design-Management/PlansScreen';
import MaterialsListScreen from '@/screens/Materials/MaterialsListScreen';
import AttendanceScreen from '@/screens/Attendance/AttendaceScreen';
import RiskCategoriesScreen from '@/screens/Issues/RiskCategoriesScreen';
import ReportssListScreen from '@/screens/Reports/ReportsListScreen'
import FilesScreen from '@/screens/Document-Management/FileScreen';
import PlansTab from '@/screens/plans/planscreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateBOQDraftScreen from '@/screens/BOQ/CreateBOQDraftScreen';
import BOQListScreen from '@/screens/BOQ/BOQListScreen';
const API_URL = `${process.env.BASE_API_URL}`;

const ViewDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params || {};
  console.log("ProjectData",project);
  const [activeTab, setActiveTab] = useState('Details');
  const [activeView, setActiveView] = useState('Calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [siteData,setSiteData]=useState();
// console.log("asdfasdfasdf",project);
  const handleBack = () => navigation.goBack();
  
  const handleEdit = () => {
    console.log('Edit project:', project?.id);
    navigation.navigate('CreateProjectScreen');
  };

  // console.log(project)

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
   
  };
 const fetchSurveys = async (isRefreshing = false) => {
    try {
    
      const token = await AsyncStorage.getItem("userToken");
      const data = await AsyncStorage.getItem("userData");
      const parsed = JSON.parse(data);
      const res = await fetch(`${API_URL}/api/surveys/projectid/${project._id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const json = await res.json();
      if (json.success) {
       
        console.log("data",json);
        setSiteData(json);
        // setFilteredSurveys(filterdata);
      }
    } catch (err) {
      console.log("Error fetching surveys:", err);
    } 
  };

  useEffect(()=>{
    fetchSurveys()
  },[project]);

  const tabs = [
    { id: 'Details', label: 'Details' },
     { id: 'Sites', label: 'Sites' },
      { id: 'BOQ', label: 'BOQ' },
      { id: 'Plans', label: 'Plans' },
    { id: 'Task', label: 'Task' },
    { id: 'Transaction', label: 'Transaction' },
    // { id: 'Files', label: 'Files' },
   
   
    { id: 'Material', label: 'Material' },
    { id: 'Attendance', label: 'Attendance' },
    { id: 'Issues', label: 'Issues'},
    { id: 'Reports', label: 'Reports'},
    
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
 const formatter = (value) => {
  if (!value) return "—";

  // Check if date
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }); // Dec
    const year = date.getFullYear();

    return `${day} ${month} ${year}`; // → "10 Dec 2025"
  }

  // Boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Array
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "None";
  }

  // Object (e.g., location)
  if (typeof value === "object") {
    return Object.values(value)
      .filter((v) => v !== null && v !== undefined && v !== "")
      .join(", ") || "—";
  }

  // Others → string
  return String(value);
};

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <>
            <SectionContainer title="Basic Project Details">
              <View style={styles.detailList}>
                <DetailRow label="Project Name" value={project?.name} />
                <DetailRow label="Project Type" value={project.projectType?.projectTypeName || project.category} />
               
                <DetailRow label="Location" value={project.location} />
                <DetailRow label="Start Date" value={formatter(project.startDate)} />
                <DetailRow label="End Date" value={formatter(project.endDate)} />
                <DetailRow label="Project Status" value={project.status}/>
                  <DetailRow label="Project Budget" value={project.budget}/>
              </View>
            </SectionContainer>
        
       
            <SectionContainer title="Client Information">
              <View style={styles.detailList}>
                <DetailRow label="Client Name" value={project.clientName} />
                <DetailRow label="Client Email" value={project.clientEmail} />
                <DetailRow label="Client Phone Number" value={project.clientPhone} />
              </View>
            </SectionContainer>
          </>
        );
      
      case 'Task':
        // Render the TaskScreen component inline
        return <TaskScreen project={project} />;

      case 'Transaction':
        // Render the PaymentsTransaction component inline
        return <PaymentsTransaction project={project} />;

      case 'Plans':
        // Render the PaymentsTransaction component inline
        return <FilesScreen project={project} />;

          case 'Sites':
   
        return <ApproveSurveyScreen project={siteData} />;

        //   case 'Files':
        // // Render the PaymentsTransaction component inline
        // // return <PlansScreen project={project} />;
        // return <PlansTab/>

        case 'BOQ':
          return <BOQListScreen navigation={navigation} project={project}/>;
        // return <CreateBOQDraftScreen/>;
          case 'Material':
        // Render the PaymentsTransaction component inline
        return <MaterialsListScreen project={project} />;

          case 'Attendance':
        // Render the PaymentsTransaction component inline
        return <AttendanceScreen project={project} />;

             case 'Issues':
        // Render the PaymentsTransaction component inline
        return <RiskCategoriesScreen project={project} />;

           case 'Reports':
        // Render the PaymentsTransaction component inline
        return <ReportssListScreen project={project} />;
      
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
     
    </View>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb' 
  },
  scrollView: {
    flex: 1,
  },
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
  content: { 
    paddingHorizontal: 0,
    flex: 1,
  },
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ViewDetailsScreen;