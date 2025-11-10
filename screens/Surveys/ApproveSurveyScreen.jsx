import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import BottomNavBar from 'components/BottomNavbar';
import { useFonts, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold } from '@expo-google-fonts/urbanist';


const ApproveSurveyScreen = () => {
  const navigation = useNavigation(); 
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': Urbanist_400Regular,
    'Urbanist-Medium': Urbanist_500Medium,
    'Urbanist-SemiBold': Urbanist_600SemiBold,
    'Urbanist-Bold': Urbanist_700Bold,
  });

  if (!fontsLoaded) return null;

  const recentActivities = [
    {
      id: 1,
      title: 'Project Alpha',
      description: 'John Doe submitted a new request for approval',
      date: '2025-04-07 6:02 AM',
      status: 'New Request',
      badgeBg: '#E8F0FF',
      badgeText: '#0066FF',
    },
    {
      id: 2,
      title: 'Project Beta',
      description: 'Jane Smith approved the budget proposal',
      date: '2025-04-07 6:02 AM',
      status: 'Approval',
      badgeBg: '#E8F0FF',
      badgeText: '#0066FF',
    },
    {
      id: 3,
      title: 'Project Gamma',
      description: 'Mark Johnson added a comment: Please review the latest changes',
      date: '2025-04-07 6:02 AM',
      status: 'In Progress',
      badgeBg: '#E8F0FF',
      badgeText: '#0066FF',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* ----- Project Selector ----- */}
            <View style={styles.projectSelector}>
              <Text style={styles.inputLabel}>Project</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={styles.dropdownText}>Project Name 1</Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.surveyStatsContainer}>
              {/* Top Row – TOTAL | PENDING | IN PROGRESS */}
              <View style={styles.surveyTopRow}>
                <View style={styles.surveyItem}>
                  <Text style={styles.surveyLabel}>TOTAL SURVEY</Text>
                  <Text style={styles.surveyValue}>100</Text>
                </View>
                <View style={styles.surveyDivider} />
                <View style={styles.surveyItem}>
                  <Text style={styles.surveyLabel}>PENDING SURVEY</Text>
                  <Text style={[styles.surveyValue, { color: '#FF3B30' }]}>10</Text>
                </View>
                <View style={styles.surveyDivider} />
                <View style={styles.surveyItem}>
                  <Text style={styles.surveyLabel}>IN PROGRESS</Text>
                  <Text style={[styles.surveyValue, { color: '#0066FF' }]}>15</Text>
                </View>
              </View>

              {/* Divider Line */}
              <View style={styles.surveyHorizontalDivider} />

              {/* Bottom Row – AWAITING APPROVAL | APPROVED */}
              <View style={styles.surveyBottomRow}>
                <View style={styles.surveyBottomItem}>
                  <Text style={styles.surveySubLabel}>AWAITING APPROVAL</Text>
                  <Text style={[styles.surveyBottomValue, { color: '#FF9500' }]}>10</Text>
                </View>
                <View style={styles.surveyBottomItem}>
                  <Text style={styles.surveySubLabel}>APPROVED</Text>
                  <Text style={[styles.surveyBottomValue, { color: '#28A745' }]}>50</Text>
                </View>
              </View>
            </View>

            {/* ----- Recent Activities ----- */}
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity, idx) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityCard,
                    idx === recentActivities.length - 1 && { marginBottom: 0 },
                  ]}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: activity.badgeBg }]}>
                      <Text style={[styles.statusText, { color: activity.badgeText }]}>
                        {activity.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityDesc}>{activity.description}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              ))}
            </View>

            {/* ----- Action Buttons ----- */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate('SurveyRequestScreen')}
              >
                <Text style={styles.outlineButtonText}>View Survey Req</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filledButton}
                onPress={() => navigation.navigate('SurveyApprovalScreen')}
              >
                <Text style={styles.filledButtonText}>Manage Approvals</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

  <BottomNavBar/>
    </SafeAreaView>
  );
};
export default ApproveSurveyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },

  /* ----- Project Selector ----- */
  projectSelector: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  inputLabel: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#000000',
  },

  /* ----- Survey Stats Container ----- */
  surveyStatsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  surveyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surveyItem: {
    flex: 1,
    alignItems: 'center',
  },
  surveyLabel: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  surveyValue: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#000000',
  },
  surveyDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  surveyHorizontalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  surveyBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  surveyBottomItem: {
    flex: 1,
    alignItems: 'center',
  },
  surveySubLabel: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 11,
    color: '#999999',
    marginBottom: 4,
  },
  surveyBottomValue: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
  },

  /* ----- Recent Activities ----- */
  sectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 12,
    marginTop: 8,
  },
  activitiesContainer: {
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 11,
  },
  activityDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#444444',
    marginBottom: 4,
  },
  activityDate: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#999999',
  },

  /* ----- Action Buttons ----- */
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  outlineButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#CCE0FF',
  },
  outlineButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#0066FF',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  filledButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: 'white',
  },

  /* ----- Bottom Navigation ----- */
  bottomNav: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});



