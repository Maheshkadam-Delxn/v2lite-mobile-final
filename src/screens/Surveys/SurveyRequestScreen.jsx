import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Search, ChevronRight, ChevronDown, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const SurveyRequestScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = `${process.env.BASE_API_URL}`;

  const handleBack = () => navigation.goBack();
  const handleAdd = () => {
    // Handle add button press
    console.log('Add button pressed');
  };

  const surveyRequests = [
    {
      id: 'SRQ - 001',
      project: 'Project Alpha',
      contractor: 'Contractor A',
      dateSubmitted: '28-03-2025',
      status: 'Safety',
      statusColor: 'blue',
    },
    {
      id: 'SRQ - 002',
      project: 'Project Beta',
      contractor: 'Contractor B',
      dateSubmitted: '29-03-2025',
      status: 'Pending',
      statusColor: 'orange',
    },
    {
      id: 'SRQ - 003',
      project: 'Project Gamma',
      contractor: 'Contractor C',
      dateSubmitted: '30-03-2025',
      status: 'Approved',
      statusColor: 'green',
    },
  ];

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'blue':
        return { backgroundColor: '#E8F0FF' };
      case 'orange':
        return { backgroundColor: '#FFF4E6' };
      case 'green':
        return { backgroundColor: '#E6F4EA' };
      default:
        return { backgroundColor: '#F3F4F6' };
    }
  };

  const getBadgeTextStyle = (color) => {
    switch (color) {
      case 'blue':
        return { color: '#0066FF' };
      case 'orange':
        return { color: '#FF9500' };
      case 'green':
        return { color: '#28A745' };
      default:
        return { color: '#6B7280' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      <Header
        title="Survey Requests"
        showBackButton={true}
        onBackPress={handleBack}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View style={{ flex: 1 }}>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Search and Add Button Container */}
        <View style={styles.searchAddContainer}>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('NewSurveyScreen')}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Survey Request Cards */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {surveyRequests.map((request, index) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                index === surveyRequests.length - 1 && { marginBottom: 0 },
              ]}>
              {/* Header with ID and Badge */}
              <View style={styles.cardHeader}>
                <Text style={styles.requestId}>{request.id}</Text>
                <View style={[styles.statusBadge, getBadgeStyle(request.statusColor)]}>
                  <Text style={[styles.statusText, getBadgeTextStyle(request.statusColor)]}>
                    {request.status}
                  </Text>
                </View>
              </View>

              {/* Project Info */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Project :</Text>
                <Text style={styles.infoValue}>{request.project}</Text>
              </View>

              {/* Contractor Info */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contractor :</Text>
                <Text style={[styles.infoValue, { color: '#FF6B35' }]}>{request.contractor}</Text>
              </View>

              {/* Date Submitted */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date Submitted :</Text>
                <Text style={styles.infoValue}>{request.dateSubmitted}</Text>
              </View>

              {/* View Details Button */}
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => navigation.navigate('SurveyDetailScreen', { request })}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={16} color="#0066FF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 24,
  },
  toolsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  toolsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toolButtonPrimary: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toolButtonPrimaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  toolButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toolButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0066FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, // Reduced from 0.1
    shadowRadius: 1, // Reduced from 2
    elevation: 1, // Reduced from 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
};

export default SurveyRequestScreen;
