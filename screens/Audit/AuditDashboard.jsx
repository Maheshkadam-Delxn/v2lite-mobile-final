// DashboardScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import Header from 'components/Header';

const AuditDashboard = () => {
  const stats = [
    { label: 'Pending Snag', value: '05', color: '#FFA726' },
    { label: 'Await Docs', value: '03', color: '#42A5F5' },
    { label: 'Awaiting Approval', value: '02', color: '#EF5350' },
    { label: 'Sign Off Required', value: '04', color: '#66BB6A' },
  ];

  const snagItems = [
    {
      id: 'SNAG-1001',
      project: 'Skyline Tower',
      location: 'Lobby',
      issue: 'Water Voltage',
      assigned: 'Contractor A',
      created: 'Apr 1, 2025',
      status: 'In Progress',
      statusColor: '#FFA726',
    },
    {
      id: 'SNAG-1001',
      project: 'Skyline Tower',
      location: 'Lobby',
      issue: 'Water Voltage',
      assigned: 'Contractor A',
      created: 'Apr 1, 2025',
      status: 'In Progress',
      statusColor: '#FFA726',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      {/* Header */}
       <Header
          title="My Projects"
          rightIcon="filter-outline"
        //   onRightIconPress={openFilter}
          backgroundColor="#3B82F6"
          titleColor="white"
          iconColor="white"
        />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.statColorLine, { backgroundColor: '#FFA726' }]} />
              <Text style={styles.statValue}>05</Text>
              <Text style={styles.statLabel}>Pending Snag</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statColorLine, { backgroundColor: '#42A5F5' }]} />
              <Text style={styles.statValue}>03</Text>
              <Text style={styles.statLabel}>Await Docs</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={[styles.statColorLine, { backgroundColor: '#EF5350' }]} />
              <Text style={styles.statValue}>02</Text>
              <Text style={styles.statLabel}>Awaiting Approval</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statColorLine, { backgroundColor: '#66BB6A' }]} />
              <Text style={styles.statValue}>04</Text>
              <Text style={styles.statLabel}>Sign Off Required</Text>
            </View>
          </View>
        </View>

        {/* Snag Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Snag Items</Text>
            <TouchableOpacity>
              <Text style={styles.newItemText}>New Item</Text>
            </TouchableOpacity>
          </View>

          {snagItems.map((item, index) => (
            <View key={index} style={styles.snagCard}>
              {/* Image Header with ID and Status */}
              <ImageBackground
                source={{ uri: 'https://via.placeholder.com/400x200.png?text=Construction+Site' }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <View style={styles.imageOverlay}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>{item.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.statusColor }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </ImageBackground>

              {/* Details Section */}
              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Project:</Text>
                  <Text style={styles.detailValue}>{item.project}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{item.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Issue:</Text>
                  <Text style={styles.detailValue}>{item.issue}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Assigned:</Text>
                  <Text style={styles.detailValue}>{item.assigned}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>{item.created}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Action Buttons */}
              <View style={styles.actionSection}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>Snapshot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E40AF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statColorLine: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  newItemText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 14,
  },
  snagCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageBackground: {
    height: 160,
  },
  imageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  idBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  idText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  actionSection: {
    flexDirection: 'row',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
};

export default AuditDashboard;