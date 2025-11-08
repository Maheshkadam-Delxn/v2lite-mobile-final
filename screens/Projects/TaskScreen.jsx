import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const TaskScreen = () => {
  const navigation = useNavigation();
  const [activeView, setActiveView] = useState('Calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const projectStatus = [
    { label: 'Completed (110)', color: '#1DD1A1', icon: 'checkmark-circle' },
    { label: 'In Progress (80)', color: '#0066FF', icon: 'time' },
    { label: 'Ongoing (40)', color: '#FFA800', icon: 'play-circle' },
    { label: 'Cancelled (10)', color: '#FF3B30', icon: 'close-circle' },
  ];

  const scheduleActivities = [
    {
      id: 1,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#FF6B6B',
    },
    {
      id: 2,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#4ECDC4',
    },
    {
      id: 3,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#95E1D3',
    },
    {
      id: 4,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#F3A683',
    },
    {
      id: 5,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#786FA6',
    },
    {
      id: 6,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#F8B500',
    },
    {
      id: 7,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#FF6B9D',
    },
    {
      id: 8,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#C44569',
    },
    {
      id: 9,
      title: 'Daily Design Request Report',
      startTime: '12:00 PM',
      endTime: '02:00 PM',
      color: '#1B9CFC',
    },
  ];

  const calendarActivities = [
    {
      id: 1,
      title: 'Onboarding',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
    },
    {
      id: 2,
      title: 'Onboarding',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
    },
    {
      id: 3,
      title: 'Onboarding',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
    },
    {
      id: 4,
      title: 'Onboarding',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      priority: 'High',
      assignees: 3,
    },
  ];

  // ------------------------------------------------------------------
  // Calendar helpers
  // ------------------------------------------------------------------
  const generateWeekDates = (startDate) => {
    const dates = [];
    const current = new Date(startDate);
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
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
        isSelected: isSameDay(date, selectedDate),
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

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const formatMonthYear = (date) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const weekDates = generateWeekDates(currentMonth);

  // ------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------
  const StatusItem = ({ status }) => (
    <View style={styles.statusItem}>
      <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
        <Ionicons name={status.icon} size={16} color="white" />
      </View>
      <Text style={styles.statusLabel}>{status.label}</Text>
    </View>
  );

  const ActivityCard = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            item.priority === 'High' ? styles.priorityHigh : styles.priorityLow,
          ]}>
          <Text
            style={[
              styles.priorityText,
              item.priority === 'High' ? styles.textHigh : styles.textLow,
            ]}>
            {item.priority}
          </Text>
        </View>
      </View>
      <Text style={styles.activityDesc}>{item.description}</Text>
      <View style={styles.assigneeRow}>
        <View style={styles.assigneeAvatars}>
          {[...Array(item.assignees)].map((_, i) => (
            <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -8 }]} />
          ))}
        </View>
        <Text style={styles.assigneeCount}>{item.assignees} people</Text>
      </View>
    </View>
  );

  const ScheduleCard = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={[styles.scheduleColorBar, { backgroundColor: item.color }]} />
      <View style={styles.scheduleContent}>
        <Text style={styles.scheduleTitle}>{item.title}</Text>
        <Text style={styles.scheduleTime}>
          {item.startTime} - {item.endTime}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Project Status Grid */}
        <View style={styles.statusGrid}>
          {projectStatus.map((s, i) => (
            <StatusItem key={i} status={s} />
          ))}
        </View>

        {/* Calendar / Activity Tabs */}
        <View style={styles.viewTabContainer}>
          <View style={styles.viewTabRow}>
            {['Calendar', 'Activity'].map((id) => (
              <TouchableOpacity
                key={id}
                onPress={() => setActiveView(id)}
                style={[styles.viewTab, activeView === id && styles.viewTabActive]}>
                <Text style={[styles.viewTabText, activeView === id && styles.viewTabTextActive]}>
                  {id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Calendar Tab → Show Week Calendar */}
          {activeView === 'Calendar' && (
            <>
              <View style={styles.calendarContainer}>
                <View style={styles.monthHeader}>
                  <TouchableOpacity onPress={handlePreviousWeek}>
                    <Feather name="chevron-left" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.monthText}>{formatMonthYear(selectedDate)}</Text>
                  <TouchableOpacity onPress={handleNextWeek}>
                    <Feather name="chevron-right" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                  {weekDates.map((d, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.dayCell}
                      onPress={() => handleDateSelect(d.fullDate)}>
                      <Text style={[styles.dayName, !d.isCurrentMonth && styles.dayNameFaded]}>
                        {d.day}
                      </Text>
                      <View
                        style={[
                          styles.dateCircle,
                          d.isSelected && styles.dateSelected,
                          !d.isSelected && d.isToday && styles.dateToday,
                        ]}>
                        <Text
                          style={[
                            styles.dateText,
                            !d.isCurrentMonth && styles.dateTextFaded,
                            d.isSelected && styles.dateTextSelected,
                            !d.isSelected && d.isToday && styles.dateTextToday,
                            !d.isSelected && !d.isToday && styles.dateTextNormal,
                          ]}>
                          {d.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Add New Button and All Tasks */}
              <View style={styles.tasksContainer}>
                <View style={styles.tasksHeader}>
                  <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={() => navigation.navigate('AddNewTask')}>
                    <Ionicons name="add-circle-outline" size={18} color="#0066FF" />
                    <Text style={styles.addNewText}>Add New</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.allTasksButton}>
                    <Text style={styles.allTasksText}>All Tasks</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Activity List */}
                <FlatList
                  data={calendarActivities}
                  renderItem={({ item }) => <ActivityCard item={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
          )}

          {/* Activity Tab → Show Schedule List */}
          {activeView === 'Activity' && (
            <View style={styles.activityContainer}>
              {/* Calendar Header */}
              <View style={styles.calendarContainer}>
                <View style={styles.monthHeader}>
                  <TouchableOpacity onPress={handlePreviousWeek}>
                    <Feather name="chevron-left" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.monthText}>{formatMonthYear(selectedDate)}</Text>
                  <TouchableOpacity onPress={handleNextWeek}>
                    <Feather name="chevron-right" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                  {weekDates.map((d, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.dayCell}
                      onPress={() => handleDateSelect(d.fullDate)}>
                      <Text style={[styles.dayName, !d.isCurrentMonth && styles.dayNameFaded]}>
                        {d.day}
                      </Text>
                      <View
                        style={[
                          styles.dateCircle,
                          d.isSelected && styles.dateSelected,
                          !d.isSelected && d.isToday && styles.dateToday,
                        ]}>
                        <Text
                          style={[
                            styles.dateText,
                            !d.isCurrentMonth && styles.dateTextFaded,
                            d.isSelected && styles.dateTextSelected,
                            !d.isSelected && d.isToday && styles.dateTextToday,
                            !d.isSelected && !d.isToday && styles.dateTextNormal,
                          ]}>
                          {d.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Schedule Section */}
              <View style={styles.scheduleSection}>
                <View style={styles.scheduleSectionHeader}>
                  <Text style={styles.scheduleSectionTitle}>Your Schedule</Text>
                  <TouchableOpacity style={styles.selectMemberButton}>
                    <Text style={styles.selectMemberText}>Select Member</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={scheduleActivities}
                  renderItem={({ item }) => <ScheduleCard item={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

/* --------------------------------------------------------------
   Styles
   -------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  statusItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  viewTabActive: { borderBottomColor: '#0066FF' },
  viewTabText: {
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold',
    color: '#9ca3af',
  },
  viewTabTextActive: { color: '#0066FF', fontFamily: 'Urbanist-Bold' },

  calendarContainer: { padding: 16 },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#111827',
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCell: { flex: 1, alignItems: 'center' },
  dayName: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  dayNameFaded: { color: '#d1d5db' },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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

  activityContainer: {
    paddingBottom: 16,
  },

  tasksContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addNewText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#0066FF',
    marginLeft: 6,
  },
  allTasksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  allTasksText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
    color: '#6b7280',
    marginRight: 4,
  },

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#111827',
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
    fontSize: 13,
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
    width: 26,
    height: 26,
    borderRadius: 13,
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

  scheduleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scheduleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleSectionTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#111827',
  },
  selectMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectMemberText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
    color: '#6b7280',
    marginRight: 4,
  },

  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  scheduleColorBar: {
    width: 4,
  },
  scheduleContent: {
    flex: 1,
    padding: 14,
  },
  scheduleTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  scheduleTime: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6b7280',
  },
});

export default TaskScreen;
