import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: "#0066FF",
  background: "#F6F8FC",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  white: "#FFFFFF",
  border: "#E0E0E0",
  success: "#1ABC9C",
  warning: "#F39C12",
  danger: "#E74C3C",
};

const AttendanceScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('daily'); // daily, weekly, monthly

  const attendanceData = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Site Engineer',
      checkIn: '08:00 AM',
      checkOut: '05:00 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      role: 'Foreman',
      checkIn: '07:30 AM',
      checkOut: '04:30 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      role: 'Architect',
      checkIn: '09:00 AM',
      checkOut: '03:00 PM',
      status: 'present',
      hours: '6h',
    },
    {
      id: '4',
      name: 'David Brown',
      role: 'Labor',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      hours: '0h',
    },
    {
      id: '5',
      name: 'Emma Davis',
      role: 'Safety Officer',
      checkIn: '08:15 AM',
      checkOut: '05:15 PM',
      status: 'present',
      hours: '9h',
    },
  ];

  const stats = {
    total: 15,
    present: 12,
    absent: 2,
    late: 1,
  };

  const AttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeRole}>{item.role}</Text>
      </View>
      <View style={styles.timeInfo}>
        <Text style={styles.timeLabel}>Check In</Text>
        <Text style={styles.timeValue}>{item.checkIn}</Text>
      </View>
      <View style={styles.timeInfo}>
        <Text style={styles.timeLabel}>Check Out</Text>
        <Text style={styles.timeValue}>{item.checkOut}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          { 
            backgroundColor: 
              item.status === 'present' ? '#E8F6F3' : 
              item.status === 'absent' ? '#FDEDED' : '#FBEEE6'
          }
        ]}>
          <Text style={[
            styles.statusText,
            { 
              color: 
                item.status === 'present' ? COLORS.success : 
                item.status === 'absent' ? COLORS.danger : COLORS.warning
            }
          ]}>
            {item.status}
          </Text>
        </View>
        <Text style={styles.hoursText}>{item.hours}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.success }]}>{stats.present}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.danger }]}>{stats.absent}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.warning }]}>{stats.late}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
          </View>
        </View>

        {/* Date and View Selector */}
        <View style={styles.controlsSection}>
          <View style={styles.dateSelector}>
            <TouchableOpacity style={styles.dateButton}>
              <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.dateText}>March 25, 2024</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.viewSelector}>
            {['daily', 'weekly', 'monthly'].map((viewType) => (
              <TouchableOpacity
                key={viewType}
                style={[
                  styles.viewButton,
                  view === viewType && styles.viewButtonActive
                ]}
                onPress={() => setView(viewType)}
              >
                <Text style={[
                  styles.viewButtonText,
                  view === viewType && styles.viewButtonTextActive
                ]}>
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Attendance List */}
        <View style={styles.attendanceSection}>
          <Text style={styles.sectionTitle}>Today's Attendance</Text>
          <View style={styles.attendanceList}>
            {attendanceData.map((item) => (
              <AttendanceItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Export Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="add" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  header: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: { padding: 6 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  notificationIcon: { padding: 6 },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  controlsSection: {
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#0066FF',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  attendanceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  attendanceList: {
    marginBottom: 20,
  },
  attendanceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  timeInfo: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  hoursText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#0066FF',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default AttendanceScreen;