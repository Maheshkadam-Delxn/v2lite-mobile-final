// TaskScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = `${process.env.BASE_API_URL}/api`;
// const TASKS_BY_PROJECT = (projectId) => `${BASE_URL}/tasks/by-project?projectId=${projectId}`;
// const TOKEN_KEY = 'userToken';

// const TaskScreen = ({ project: projectProp }) => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   // projectId: prefer prop.project._id / prop.project.id, else route.params.projectId
//   const derivedProjectId =
//     (projectProp && (projectProp._id || projectProp.id)) ||
//     route?.params?.projectId ||
//     null;

//   const [projectId, setProjectId] = useState(derivedProjectId);

//   const [activeView, setActiveView] = useState('Calendar');
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const [tasks, setTasks] = useState([]);
//   const [loadingTasks, setLoadingTasks] = useState(false);
//   const [tasksError, setTasksError] = useState(null);

//   const projectStatus = [
//     { label: 'Completed (100)', color: '#1DD1A1', icon: 'checkmark-circle' },
//     { label: 'In Progress (80)', color: '#0066FF', icon: 'time' },
//     { label: 'Ongoing (40)', color: '#FFA800', icon: 'play-circle' },
//     { label: 'Cancelled (10)', color: '#FF3B30', icon: 'close-circle' },
//   ];

//   // keep projectId updated if prop or route changes
//   useEffect(() => {
//     const id =
//       (projectProp && (projectProp._id || projectProp.id)) ||
//       route?.params?.projectId ||
//       null;
//     setProjectId(id);
//   }, [projectProp, route?.params?.projectId]);

//   // -----------------------------
//   // Calendar helpers (unchanged)
//   // -----------------------------
//   const generateWeekDates = (startDate) => {
//     const dates = [];
//     const current = new Date(startDate);
//     const dayOfWeek = current.getDay();
//     const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
//     current.setDate(diff);
//     const dayNames = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(current);
//       dates.push({
//         date: date.getDate(),
//         day: dayNames[i],
//         fullDate: new Date(date),
//         isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
//         isToday: isToday(date),
//         isSelected: isSameDay(date, selectedDate),
//       });
//       current.setDate(current.getDate() + 1);
//     }
//     return dates;
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     return (
//       date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear()
//     );
//   };

//   const isSameDay = (date1, date2) => {
//     return (
//       date1.getDate() === date2.getDate() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getFullYear() === date2.getFullYear()
//     );
//   };

//   const formatMonthYear = (date) => {
//     const months = [
//       'January','February','March','April','May','June','July','August','September','October','November','December',
//     ];
//     return `${months[date.getMonth()]} ${date.getDate()}`;
//   };

//   const handlePreviousWeek = () => {
//     const newDate = new Date(currentMonth);
//     newDate.setDate(newDate.getDate() - 7);
//     setCurrentMonth(newDate);
//   };

//   const handleNextWeek = () => {
//     const newDate = new Date(currentMonth);
//     newDate.setDate(newDate.getDate() + 7);
//     setCurrentMonth(newDate);
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//   };

//   const weekDates = generateWeekDates(currentMonth);

//   // -----------------------------
//   // UI cards
//   // -----------------------------
//   const StatusItem = ({ status }) => (
//     <View style={styles.statusItem}>
//       <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
//         <Ionicons name={status.icon} size={16} color="white" />
//       </View>
//       <Text style={styles.statusLabel}>{status.label}</Text>
//     </View>
//   );

//   const ActivityCard = ({ item }) => (
//     <View style={styles.activityCard}>
//       <View style={styles.activityHeader}>
//         <Text style={styles.activityTitle}>{item.title}</Text>
//         <View
//           style={[
//             styles.priorityBadge,
//             item.priority === 'High' ? styles.priorityHigh : styles.priorityLow,
//           ]}>
//           <Text
//             style={[
//               styles.priorityText,
//               item.priority === 'High' ? styles.textHigh : styles.textLow,
//             ]}>
//             {item.priority}
//           </Text>
//         </View>
//       </View>
//       <Text style={styles.activityDesc}>{item.description}</Text>
//       <View style={styles.assigneeRow}>
//         <View style={styles.assigneeAvatars}>
//           {[...Array(Math.max(0, item.assignees || 0))].map((_, i) => (
//             <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -8 }]} />
//           ))}
//         </View>
//         <Text style={styles.assigneeCount}>{item.assignees || 0} people</Text>
//       </View>
//     </View>
//   );

//   const ScheduleCard = ({ item }) => (
//     <View style={styles.scheduleCard}>
//       <View style={[styles.scheduleColorBar, { backgroundColor: item.color || '#1B9CFC' }]} />
//       <View style={styles.scheduleContent}>
//         <Text style={styles.scheduleTitle}>{item.title}</Text>
//         <Text style={styles.scheduleTime}>
//           {item.startTime || '09:00 AM'} - {item.endTime || '10:00 AM'}
//         </Text>
//       </View>
//     </View>
//   );

//   // -----------------------------
//   // map API tasks -> UI shapes
//   // -----------------------------
//   const scheduleActivities = tasks.map((t, idx) => ({
//     id: t._id || t.id || idx,
//     title: t.title || t.name || t.taskName || 'Untitled Task',
//     startTime: t.startTime || t.from || t.start || '09:00 AM',
//     endTime: t.endTime || t.to || t.end || '10:00 AM',
//     color: t.color || t.colorCode || '#1B9CFC',
//   }));

//   const calendarActivities = tasks.map((t, idx) => ({
//     id: t._id || t.id || idx,
//     title: t.title || t.name || t.taskName || 'Untitled Task',
//     description: t.description || t.details || 'No description provided.',
//     assignees:
//       typeof t.assignees === 'number'
//         ? t.assignees
//         : Array.isArray(t.assignees)
//         ? t.assignees.length
//         : 1,
//   }));

//   // -----------------------------
//   // fetch tasks by project
//   // -----------------------------
//   useEffect(() => {
//     let cancelled = false;

//     if (!projectId) {
//       setTasks([]);
//       setTasksError('Missing projectId. Open this screen from a project (pass project or projectId).');
//       setLoadingTasks(false);
//       return;
//     }

//     const fetchTasks = async () => {
//       setLoadingTasks(true);
//       setTasksError(null);
//       try {
//         const token = await AsyncStorage.getItem(TOKEN_KEY);
//         const headers = { 'Content-Type': 'application/json' };
//         if (token) headers['Authorization'] = `Bearer ${token}`;

//         const res = await fetch(TASKS_BY_PROJECT(projectId), {
//           method: 'GET',
//           headers,
//         });

//         if (!res.ok) {
//           if (res.status === 401) {
//             const txt = await res.text().catch(() => '');
//             throw new Error(`Unauthorized (401). ${txt}`);
//           }
//           const txt = await res.text().catch(() => '');
//           throw new Error(`HTTP ${res.status} ${txt}`);
//         }

//         const json = await res.json().catch(() => []);
//         const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

//         if (!cancelled) setTasks(items);
//       } catch (err) {
//         console.error('Failed to fetch tasks for project:', projectId, err);
//         if (!cancelled) setTasksError(err.message || 'Failed to fetch tasks');
//       } finally {
//         if (!cancelled) setLoadingTasks(false);
//       }
//     };

//     fetchTasks();

//     return () => {
//       cancelled = true;
//     };
//   }, [projectId]);

//   // -----------------------------
//   // Render
//   // -----------------------------
//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Project Status Grid */}
//         <View style={styles.statusGrid}>
//           {projectStatus.map((s, i) => (
//             <StatusItem key={i} status={s} />
//           ))}
//         </View>

//         {/* Calendar / Activity Tabs */}
//         <View style={styles.viewTabContainer}>
//           <View style={styles.viewTabRow}>
//             {['Calendar', 'Activity'].map((id) => (
//               <TouchableOpacity
//                 key={id}
//                 onPress={() => setActiveView(id)}
//                 style={[styles.viewTab, activeView === id && styles.viewTabActive]}>
//                 <Text style={[styles.viewTabText, activeView === id && styles.viewTabTextActive]}>
//                   {id}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Calendar Tab → Show Week Calendar */}
//           {activeView === 'Calendar' && (
//             <>
//               <View style={styles.calendarContainer}>
//                 <View style={styles.monthHeader}>
//                   <TouchableOpacity onPress={handlePreviousWeek}>
//                     <Feather name="chevron-left" size={20} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text style={styles.monthText}>{formatMonthYear(selectedDate)}</Text>
//                   <TouchableOpacity onPress={handleNextWeek}>
//                     <Feather name="chevron-right" size={20} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.weekRow}>
//                   {weekDates.map((d, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={styles.dayCell}
//                       onPress={() => handleDateSelect(d.fullDate)}>
//                       <Text style={[styles.dayName, !d.isCurrentMonth && styles.dayNameFaded]}>
//                         {d.day}
//                       </Text>
//                       <View
//                         style={[
//                           styles.dateCircle,
//                           d.isSelected && styles.dateSelected,
//                           !d.isSelected && d.isToday && styles.dateToday,
//                         ]}>
//                         <Text
//                           style={[
//                             styles.dateText,
//                             !d.isCurrentMonth && styles.dateTextFaded,
//                             d.isSelected && styles.dateTextSelected,
//                             !d.isSelected && d.isToday && styles.dateTextToday,
//                             !d.isSelected && !d.isToday && styles.dateTextNormal,
//                           ]}>
//                           {d.date}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Add New Button and All Tasks */}
//               <View style={styles.tasksContainer}>
//                 <View style={styles.tasksHeader}>
//                   <TouchableOpacity
//                     style={styles.addNewButton}
//                     onPress={() => navigation.navigate('AddNewTask', { projectId })}>
//                     <Ionicons name="add-circle-outline" size={18} color="#0066FF" />
//                     <Text style={styles.addNewText}>Add New</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.allTasksButton}>
//                     <Text style={styles.allTasksText}>All Tasks</Text>
//                     <Feather name="chevron-down" size={16} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Activity List (Calendar view uses calendarActivities) */}
//                 {loadingTasks ? (
//                   <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 8 }} />
//                 ) : tasksError ? (
//                   <Text style={{ textAlign: 'center', color: '#ef4444', marginTop: 8 }}>{tasksError}</Text>
//                 ) : tasks.length === 0 ? (
//                   <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 8 }}>No tasks found.</Text>
//                 ) : (
//                   <FlatList
//                     data={calendarActivities}
//                     renderItem={({ item }) => <ActivityCard item={item} />}
//                     keyExtractor={(item) => item.id.toString()}
//                     scrollEnabled={false}
//                     showsVerticalScrollIndicator={false}
//                   />
//                 )}
//               </View>
//             </>
//           )}

//           {/* Activity Tab → Show Schedule List */}
//           {activeView === 'Activity' && (
//             <View style={styles.activityContainer}>
//               {/* Calendar Header */}
//               <View style={styles.calendarContainer}>
//                 <View style={styles.monthHeader}>
//                   <TouchableOpacity onPress={handlePreviousWeek}>
//                     <Feather name="chevron-left" size={20} color="#6B7280" />
//                   </TouchableOpacity>
//                   <Text style={styles.monthText}>{formatMonthYear(selectedDate)}</Text>
//                   <TouchableOpacity onPress={handleNextWeek}>
//                     <Feather name="chevron-right" size={20} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.weekRow}>
//                   {weekDates.map((d, idx) => (
//                     <TouchableOpacity
//                       key={idx}
//                       style={styles.dayCell}
//                       onPress={() => handleDateSelect(d.fullDate)}>
//                       <Text style={[styles.dayName, !d.isCurrentMonth && styles.dayNameFaded]}>
//                         {d.day}
//                       </Text>
//                       <View
//                         style={[
//                           styles.dateCircle,
//                           d.isSelected && styles.dateSelected,
//                           !d.isSelected && d.isToday && styles.dateToday,
//                         ]}>
//                         <Text
//                           style={[
//                             styles.dateText,
//                             !d.isCurrentMonth && styles.dateTextFaded,
//                             d.isSelected && styles.dateTextSelected,
//                             !d.isSelected && d.isToday && styles.dateTextToday,
//                             !d.isSelected && !d.isToday && styles.dateTextNormal,
//                           ]}>
//                           {d.date}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Schedule Section */}
//               <View style={styles.scheduleSection}>
//                 <View style={styles.scheduleSectionHeader}>
//                   <Text style={styles.scheduleSectionTitle}>Your Schedule</Text>
//                   <TouchableOpacity style={styles.selectMemberButton}>
//                     <Text style={styles.selectMemberText}>Select Member</Text>
//                     <Feather name="chevron-down" size={16} color="#6B7280" />
//                   </TouchableOpacity>
//                 </View>

//                 {loadingTasks ? (
//                   <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 8 }} />
//                 ) : tasksError ? (
//                   <Text style={{ textAlign: 'center', color: '#ef4444', marginTop: 8 }}>{tasksError}</Text>
//                 ) : tasks.length === 0 ? (
//                   <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 8 }}>No tasks found.</Text>
//                 ) : (
//                   <FlatList
//                     data={scheduleActivities}
//                     renderItem={({ item }) => <ScheduleCard item={item} />}
//                     keyExtractor={(item) => item.id.toString()}
//                     scrollEnabled={false}
//                     showsVerticalScrollIndicator={false}
//                   />
//                 )}
//               </View>
//             </View>
//           )}
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>
//     </View>
//   );
// };

// /* --------------------------------------------------------------
//    Styles (unchanged)
//    -------------------------------------------------------------- */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9fafb' },

//   statusGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginBottom: 24,
//     marginTop: 16,
//   },
//   statusItem: {
//     width: '48%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   statusIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   statusLabel: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 11,
//     color: '#374151',
//     flex: 1,
//   },

//   viewTabContainer: {
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   viewTabRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   viewTab: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: 'center',
//     borderBottomWidth: 3,
//     borderBottomColor: 'transparent',
//   },
//   viewTabActive: { borderBottomColor: '#0066FF' },
//   viewTabText: {
//     fontSize: 15,
//     fontFamily: 'Urbanist-SemiBold',
//     color: '#9ca3af',
//   },
//   viewTabTextActive: { color: '#0066FF', fontFamily: 'Urbanist-Bold' },

//   calendarContainer: { padding: 16 },
//   monthHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   monthText: {
//     fontFamily: 'Urbanist-Bold',
//     fontSize: 16,
//     color: '#111827',
//   },
//   weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   dayCell: { flex: 1, alignItems: 'center' },
//   dayName: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 12,
//     color: '#6b7280',
//     marginBottom: 8,
//   },
//   dayNameFaded: { color: '#d1d5db' },
//   dateCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dateSelected: { backgroundColor: '#0066FF' },
//   dateToday: { backgroundColor: '#dbeafe' },
//   dateText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//   },
//   dateTextSelected: { color: 'white' },
//   dateTextToday: { color: '#0066FF' },
//   dateTextNormal: { color: '#111827' },
//   dateTextFaded: { color: '#d1d5db' },

//   activityContainer: {
//     paddingBottom: 16,
//   },

//   tasksContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   tasksHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   addNewButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   addNewText: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: '#0066FF',
//     marginLeft: 6,
//   },
//   allTasksButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   allTasksText: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 13,
//     color: '#6b7280',
//     marginRight: 4,
//   },

//   activityCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f3f4f6',
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   activityTitle: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 15,
//     color: '#111827',
//   },
//   priorityBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   priorityHigh: { backgroundColor: '#fee2e2' },
//   priorityLow: { backgroundColor: '#ecfdf5' },
//   priorityText: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 11,
//   },
//   textHigh: { color: '#ef4444' },
//   textLow: { color: '#10b981' },
//   activityDesc: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 13,
//     color: '#6b7280',
//     lineHeight: 18,
//     marginBottom: 12,
//   },
//   assigneeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   assigneeAvatars: {
//     flexDirection: 'row',
//   },
//   avatar: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     backgroundColor: '#e5e7eb',
//     borderWidth: 2,
//     borderColor: 'white',
//   },
//   assigneeCount: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 11,
//     color: '#6b7280',
//     marginLeft: 8,
//   },

//   scheduleSection: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   scheduleSectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   scheduleSectionTitle: {
//     fontFamily: 'Urbanist-Bold',
//     fontSize: 16,
//     color: '#111827',
//   },
//   selectMemberButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   selectMemberText: {
//     fontFamily: 'Urbanist-Medium',
//     fontSize: 13,
//     color: '#6b7280',
//     marginRight: 4,
//   },

//   scheduleCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginBottom: 12,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#f3f4f6',
//   },
//   scheduleColorBar: {
//     width: 4,
//   },
//   scheduleContent: {
//     flex: 1,
//     padding: 14,
//   },
//   scheduleTitle: {
//     fontFamily: 'Urbanist-SemiBold',
//     fontSize: 14,
//     color: '#111827',
//     marginBottom: 4,
//   },
//   scheduleTime: {
//     fontFamily: 'Urbanist-Regular',
//     fontSize: 12,
//     color: '#6b7280',
//   },
// });

// export default TaskScreen;


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

const BASE_URL = `${process.env.BASE_API_URL}/api`;
const TASKS_BY_PROJECT = (projectId) => `${BASE_URL}/tasks/by-project?projectId=${projectId}`;
const TOKEN_KEY = 'userToken';

const TaskScreen = ({ project: projectProp }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const derivedProjectId =
    (projectProp && (projectProp._id || projectProp.id)) ||
    route?.params?.projectId ||
    null;

  const [projectId, setProjectId] = useState(derivedProjectId);
  const [activeView, setActiveView] = useState('Calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  // Status mapping based on schema enum values
  const projectStatus = [
    { label: 'Todo', color: '#6b7280', icon: 'checkbox-outline', status: 'todo' },
    { label: 'In Progress', color: '#0066FF', icon: 'time', status: 'inprogress' },
    { label: 'Review', color: '#FFA800', icon: 'eye-outline', status: 'review' },
    { label: 'Done', color: '#1DD1A1', icon: 'checkmark-circle', status: 'done' },
  ];

  // Priority mapping based on schema enum values
  const priorityMap = {
    low: { label: 'Low', color: '#10b981', bgColor: '#ecfdf5' },
    medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fffbeb' },
    high: { label: 'High', color: '#ef4444', bgColor: '#fee2e2' },
    critical: { label: 'Critical', color: '#dc2626', bgColor: '#fef2f2' }
  };

  // Task type mapping
  const taskTypeMap = {
    annotation: { label: 'Annotation', color: '#8b5cf6' },
    site: { label: 'Site', color: '#0ea5e9' },
    documentation: { label: 'Documentation', color: '#10b981' },
    approval: { label: 'Approval', color: '#f59e0b' },
    general: { label: 'General', color: '#6b7280' }
  };

  useEffect(() => {
    const id =
      (projectProp && (projectProp._id || projectProp.id)) ||
      route?.params?.projectId ||
      null;
    setProjectId(id);
  }, [projectProp, route?.params?.projectId]);

  // -----------------------------
  // Calendar helpers
  // -----------------------------
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
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
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

  // -----------------------------
  // Calculate status counts from tasks
  // -----------------------------
  const calculateStatusCounts = () => {
    const counts = {
      todo: 0,
      inprogress: 0,
      blocked: 0,
      review: 0,
      done: 0,
    };

    tasks.forEach(task => {
      if (task.status && counts.hasOwnProperty(task.status)) {
        counts[task.status]++;
      } else {
        counts.todo++; // Default to todo if status not set
      }
    });

    return projectStatus.map(status => {
      const count = counts[status.status] || 0;
      return {
        ...status,
        label: `${status.label} (${count})`,
      };
    });
  };

  const dynamicStatus = calculateStatusCounts();

  // -----------------------------
  // UI cards
  // -----------------------------
  const StatusItem = ({ status }) => (
    <View style={styles.statusItem}>
      <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
        <Ionicons name={status.icon} size={16} color="white" />
      </View>
      <Text style={styles.statusLabel}>{status.label}</Text>
    </View>
  );

  const ActivityCard = ({ item }) => {
    const priority = priorityMap[item.priority] || priorityMap.medium;
    const taskType = taskTypeMap[item.taskType] || taskTypeMap.general;
    
    return (
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View style={styles.taskTypeTag}>
            <Text style={[styles.taskTypeTagText, { color: taskType.color }]}>
              {taskType.label}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priority.bgColor }]}>
            <Text style={[styles.priorityText, { color: priority.color }]}>
              {priority.label}
            </Text>
          </View>
        </View>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDesc}>
          {item.description || 'No description provided'}
        </Text>
        
        <View style={styles.taskDetailsRow}>
          <View style={styles.assigneeRow}>
            <View style={styles.assigneeAvatars}>
              {item.assignedTo?.slice(0, 3).map((_, i) => (
                <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -8 }]} />
              ))}
            </View>
            <Text style={styles.assigneeCount}>
              {item.assignedTo?.length || 0} {item.assignedTo?.length === 1 ? 'person' : 'people'}
            </Text>
          </View>
          
          {item.dueDate && (
            <View style={styles.dueDateContainer}>
              <Feather name="calendar" size={12} color="#6b7280" />
              <Text style={styles.dueDateText}>
                {new Date(item.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.statusBadgeContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          {item.progress > 0 && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const ScheduleCard = ({ item }) => {
    const taskType = taskTypeMap[item.taskType] || taskTypeMap.general;
    
    return (
      <View style={styles.scheduleCard}>
        <View style={[styles.scheduleColorBar, { backgroundColor: getStatusColor(item.status) }]} />
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleTitle}>{item.title}</Text>
          
          <View style={styles.scheduleDetailsRow}>
            <View style={[styles.taskTypeBadge, { backgroundColor: taskType.color + '20' }]}>
              <Text style={[styles.taskTypeBadgeText, { color: taskType.color }]}>
                {taskType.label}
              </Text>
            </View>
            
            {item.startDate && (
              <View style={styles.scheduleTimeContainer}>
                <Feather name="clock" size={10} color="#6b7280" />
                <Text style={styles.scheduleTime}>
                  {formatDateToTime(item.startDate)}
                </Text>
              </View>
            )}
          </View>
          
          {item.dueDate && (
            <Text style={styles.scheduleDate}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // -----------------------------
  // Helper functions
  // -----------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'inprogress': return '#0066FF';
      case 'review': return '#FFA800';
      case 'blocked': return '#FF3B30';
      case 'done': return '#1DD1A1';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'review': return 'In Review';
      case 'blocked': return 'Blocked';
      case 'done': return 'Done';
      default: return 'To Do';
    }
  };

  const formatDateToTime = (dateString) => {
    if (!dateString) return 'No time set';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // -----------------------------
  // Map API tasks -> UI shapes
  // -----------------------------
  const scheduleActivities = tasks.map((t) => ({
    id: t._id,
    title: t.title,
    description: t.description,
    startDate: t.startDate,
    dueDate: t.dueDate,
    status: t.status,
    taskType: t.taskType,
    priority: t.priority,
    progress: t.progress,
    assignedTo: t.assignedTo || [],
  }));

  const calendarActivities = tasks.map((t) => ({
    id: t._id,
    title: t.title,
    description: t.description,
    assignedTo: t.assignedTo || [],
    priority: t.priority,
    dueDate: t.dueDate,
    status: t.status,
    taskType: t.taskType,
    progress: t.progress || 0,
  }));

  // -----------------------------
  // fetch tasks by project
  // -----------------------------
  useEffect(() => {
    let cancelled = false;

    if (!projectId) {
      setTasks([]);
      setTasksError('Missing projectId. Open this screen from a project (pass project or projectId).');
      setLoadingTasks(false);
      return;
    }

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setTasksError(null);
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(TASKS_BY_PROJECT(projectId), {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          if (res.status === 401) {
            const txt = await res.text().catch(() => '');
            throw new Error(`Unauthorized (401). ${txt}`);
          }
          const txt = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${txt}`);
        }

        const json = await res.json().catch(() => []);
        const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

        if (!cancelled) setTasks(items);
      } catch (err) {
        console.error('Failed to fetch tasks for project:', projectId, err);
        if (!cancelled) setTasksError(err.message || 'Failed to fetch tasks');
      } finally {
        if (!cancelled) setLoadingTasks(false);
      }
    };

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Project Status Grid */}
        <View style={styles.statusGrid}>
          {dynamicStatus.map((s, i) => (
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

          {/* Calendar Tab → Show Week Calendar and All Tasks */}
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
                    onPress={() => navigation.navigate('AddNewTask', { projectId })}>
                    <Ionicons name="add-circle-outline" size={18} color="#0066FF" />
                    <Text style={styles.addNewText}>Add New Task</Text>
                  </TouchableOpacity>
                  <Text style={styles.totalTasksText}>
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
                  </Text>
                </View>

                {/* All Tasks List */}
                {loadingTasks ? (
                  <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 16 }} />
                ) : tasksError ? (
                  <Text style={{ textAlign: 'center', color: '#ef4444', marginTop: 16 }}>{tasksError}</Text>
                ) : tasks.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="clipboard-outline" size={48} color="#d1d5db" />
                    <Text style={styles.emptyStateTitle}>No tasks yet</Text>
                    <Text style={styles.emptyStateText}>
                      Create your first task for this project
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={calendarActivities}
                    renderItem={({ item }) => <ActivityCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                )}
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
                  <Text style={styles.scheduleSectionTitle}>Project Schedule</Text>
                  <Text style={styles.totalTasksText}>
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </Text>
                </View>

                {loadingTasks ? (
                  <ActivityIndicator size="small" color="#0066FF" style={{ marginTop: 16 }} />
                ) : tasksError ? (
                  <Text style={{ textAlign: 'center', color: '#ef4444', marginTop: 16 }}>{tasksError}</Text>
                ) : tasks.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                    <Text style={styles.emptyStateTitle}>No scheduled tasks</Text>
                    <Text style={styles.emptyStateText}>
                      Tasks with start dates will appear here
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={scheduleActivities}
                    renderItem={({ item }) => <ScheduleCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  addNewText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#0066FF',
    marginLeft: 6,
  },
  totalTasksText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
    color: '#6b7280',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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
  taskTypeTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskTypeTagText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
  },
  activityTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 6,
  },
  activityDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  taskDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dueDateText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
  },
  progressContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 11,
    color: '#6b7280',
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
    marginBottom: 8,
  },
  scheduleDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTypeBadgeText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  scheduleTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  scheduleDate: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6b7280',
  },
});

export default TaskScreen;