// MilestoneTasksScreen.js - Fixed version with Header component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Header component
import Header from '../../components/Header';

const BASE_URL = `${process.env.BASE_API_URL}/api`;
const TASKS_BY_PROJECT = (projectId) => `${BASE_URL}/tasks/by-project?projectId=${projectId}`;
const TOKEN_KEY = 'userToken';

const MilestoneTasksScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { milestone, projectId } = route.params;

  const [activeView, setActiveView] = useState('Calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(milestone?.progress || 0);

  // Generate week dates function
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
      'January','February','March','April','May','June','July','August','September','October','November','December',
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
    filterTasksByDate(date);
  };

  // Filter tasks by selected date
  const filterTasksByDate = (date) => {
    if (!allTasks || !Array.isArray(allTasks)) {
      setFilteredTasks([]);
      return;
    }
    
    const filtered = allTasks.filter(task => {
      if (!task || !task.dueDate) return false;
      try {
        const taskDate = new Date(task.dueDate);
        return isSameDay(taskDate, date);
      } catch (error) {
        console.error('Error parsing task date:', error);
        return false;
      }
    });
    setFilteredTasks(filtered);
  };

  const weekDates = generateWeekDates(currentMonth);

  // Calculate progress based on tasks
  const calculateProgress = (tasks) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return 0;
    const completed = tasks.filter(task => 
      task && task.status === 'completed'
    ).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Fetch tasks for this milestone
  useEffect(() => {
    let cancelled = false;

    if (!projectId) {
      setTasksError('Missing projectId');
      setLoadingTasks(false);
      return;
    }

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTasksError(null);
      
      try {
        // Use mock data for demo since API might not be available
        // In production, uncomment the API call below
        
        /*
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(TASKS_BY_PROJECT(projectId), {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
        */
        
        // Mock data for demo
        const mockTasks = [
          {
            id: '1',
            _id: '1',
            title: 'Foundation Concrete',
            description: 'Pour concrete for foundation',
            priority: 'High',
            assignees: 3,
            dueDate: new Date().toISOString(),
            status: 'completed',
            startTime: '09:00 AM',
            endTime: '05:00 PM',
            color: '#0066FF',
          },
          {
            id: '2',
            _id: '2',
            title: 'Site Excavation',
            description: 'Excavate site for foundation',
            priority: 'Medium',
            assignees: 2,
            dueDate: new Date().toISOString(),
            status: 'in-progress',
            startTime: '08:00 AM',
            endTime: '04:00 PM',
            color: '#FFA800',
          },
          {
            id: '3',
            _id: '3',
            title: 'Rebar Installation',
            description: 'Install reinforcement bars',
            priority: 'High',
            assignees: 4,
            dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            status: 'pending',
            startTime: '07:00 AM',
            endTime: '03:00 PM',
            color: '#1DD1A1',
          },
        ];

        if (!cancelled) {
          setAllTasks(mockTasks);
          filterTasksByDate(selectedDate);
          const progress = calculateProgress(mockTasks);
          setCurrentProgress(progress);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        if (!cancelled) {
          setTasksError(err.message || 'Failed to fetch tasks');
          const mockTasks = [];
          setAllTasks(mockTasks);
          setFilteredTasks(mockTasks);
          const progress = calculateProgress(mockTasks);
          setCurrentProgress(progress);
        }
      } finally {
        if (!cancelled) setLoadingTasks(false);
      }
    };

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [projectId, milestone?.id]);

  // UI Components
  const ActivityCard = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{item.title || 'Untitled Task'}</Text>
          <View
            style={[
              styles.priorityBadge,
              item.priority === 'High' ? styles.priorityHigh : 
              item.priority === 'Medium' ? styles.priorityMedium : styles.priorityLow,
            ]}>
            <Text
              style={[
                styles.priorityText,
                item.priority === 'High' ? styles.textHigh : 
                item.priority === 'Medium' ? styles.textMedium : styles.textLow,
              ]}>
              {item.priority || 'Low'}
            </Text>
          </View>
        </View>
        <Text style={styles.activityDesc}>{item.description || 'No description'}</Text>
        <View style={styles.assigneeRow}>
          <View style={styles.assigneeAvatars}>
            {[...Array(Math.max(0, item.assignees || 0))].map((_, i) => (
              <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -8 }]} />
            ))}
          </View>
          <Text style={styles.assigneeCount}>{item.assignees || 0} people</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'completed' ? styles.statusCompleted :
            item.status === 'in-progress' ? styles.statusInProgress : styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'completed' ? styles.statusTextCompleted :
              item.status === 'in-progress' ? styles.statusTextInProgress : styles.statusTextPending
            ]}>
              {item.status === 'completed' ? 'Completed' : 
               item.status === 'in-progress' ? 'In Progress' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ScheduleCard = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={styles.scheduleCard}>
        <View style={[styles.scheduleColorBar, { backgroundColor: item.color || milestone?.color || '#1B9CFC' }]} />
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleTitle}>{item.title || 'Untitled Task'}</Text>
          <Text style={styles.scheduleTime}>
            {item.startTime || '09:00 AM'} - {item.endTime || '10:00 AM'}
          </Text>
          <Text style={styles.scheduleDesc}>{item.description || 'No description'}</Text>
        </View>
      </View>
    );
  };

  // Filter tasks for schedule view
  const scheduleTasks = filteredTasks.filter(task => 
    task && task.startTime && task.endTime
  );

  if (!milestone) {
    return (
      <View style={styles.container}>
        <Header 
          title="Milestone Not Found" 
          showBackButton={true} 
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Milestone Not Found</Text>
          <TouchableOpacity 
            style={styles.backButtonFull}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Component - Shows milestone name */}
      <Header 
        title={milestone.title || 'Untitled Milestone'} 
        showBackButton={true} 
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        {/* Milestone Header Section */}
        <View style={styles.milestoneHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={[styles.milestoneIcon, { backgroundColor: `${milestone.color}20` }]}>
                <Ionicons name={milestone.icon || 'flag'} size={20} color={milestone.color} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{milestone.title || 'Untitled Milestone'}</Text>
                <Text style={styles.headerSubtitle}>{milestone.description || 'No description'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressPercent}>{currentProgress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${currentProgress}%`,
                  backgroundColor: milestone.color 
                }
              ]} 
            />
          </View>
          <Text style={styles.progressSubtitle}>
            Based on task completion for this milestone
          </Text>
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

          {/* Calendar Tab */}
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

              {/* Tasks for Selected Date */}
              <View style={styles.tasksContainer}>
                <View style={styles.tasksHeader}>
                  <Text style={styles.tasksDate}>
                    Tasks for {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={() => navigation.navigate('AddNewTask', { 
                      projectId,
                      milestoneId: milestone.id,
                      milestoneTitle: milestone.title 
                    })}>
                    <Ionicons name="add-circle-outline" size={18} color="#0066FF" />
                    <Text style={styles.addNewText}>Add New</Text>
                  </TouchableOpacity>
                </View>

                {loadingTasks ? (
                  <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 16 }} />
                ) : tasksError ? (
                  <Text style={styles.errorText}>{tasksError}</Text>
                ) : !filteredTasks || filteredTasks.length === 0 ? (
                  <View style={styles.noTasks}>
                    <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.noTasksText}>No tasks for this date</Text>
                    <Text style={styles.noTasksSubtext}>Add tasks to track progress</Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredTasks}
                    renderItem={({ item }) => <ActivityCard item={item} />}
                    keyExtractor={(item, index) => 
                      item?.id?.toString() || 
                      item?._id?.toString() || 
                      `task-${index}`
                    }
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </>
          )}

          {/* Activity Tab */}
          {activeView === 'Activity' && (
            <View style={styles.activityContainer}>
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
                  <Text style={styles.scheduleSectionTitle}>Today's Schedule</Text>
                  <TouchableOpacity style={styles.selectMemberButton}>
                    <Text style={styles.selectMemberText}>Team Members</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {loadingTasks ? (
                  <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 16 }} />
                ) : tasksError ? (
                  <Text style={styles.errorText}>{tasksError}</Text>
                ) : !scheduleTasks || scheduleTasks.length === 0 ? (
                  <View style={styles.noTasks}>
                    <Ionicons name="time-outline" size={48} color="#D1D5DB" />
                    <Text style={styles.noTasksText}>No scheduled tasks</Text>
                    <Text style={styles.noTasksSubtext}>Add tasks with time slots</Text>
                  </View>
                ) : (
                  <FlatList
                    data={scheduleTasks}
                    renderItem={({ item }) => <ScheduleCard item={item} />}
                    keyExtractor={(item, index) => 
                      item?.id?.toString() || 
                      item?._id?.toString() || 
                      `schedule-${index}`
                    }
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb' 
  },
  contentContainer: {
    marginTop: 16, // Adds spacing below header
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 80, // Account for header height
  },
  errorTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonFull: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  backButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  milestoneHeader: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  progressSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#111827',
  },
  progressPercent: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#111827',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewTabContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
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
  tasksDate: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#111827',
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
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: { backgroundColor: '#fee2e2' },
  priorityMedium: { backgroundColor: '#fef3c7' },
  priorityLow: { backgroundColor: '#ecfdf5' },
  priorityText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
  },
  textHigh: { color: '#ef4444' },
  textMedium: { color: '#d97706' },
  textLow: { color: '#10b981' },
  activityDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusCompleted: { backgroundColor: '#D1FAE5' },
  statusInProgress: { backgroundColor: '#FEF3C7' },
  statusPending: { backgroundColor: '#F3F4F6' },
  statusText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
  },
  statusTextCompleted: { color: '#047857' },
  statusTextInProgress: { color: '#D97706' },
  statusTextPending: { color: '#6B7280' },
  activityContainer: {
    paddingBottom: 16,
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
    fontSize: 15,
    color: '#111827',
    marginBottom: 4,
  },
  scheduleTime: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
    color: '#0066FF',
    marginBottom: 4,
  },
  scheduleDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: 16,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  noTasks: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noTasksText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
  },
  noTasksSubtext: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default MilestoneTasksScreen;