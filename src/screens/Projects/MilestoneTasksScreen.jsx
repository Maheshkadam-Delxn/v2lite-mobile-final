// MilestoneTasksScreen.js - Integrated with API for fetching subtasks via GET and adding/updating via PUT
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import Header component
import Header from '../../components/Header';

const BASE_URL = `${process.env.BASE_API_URL}/api`;
const MILESTONE_BY_ID = (milestoneId) => `${BASE_URL}/milestones/${milestoneId}`;
const USERS_URL = `${BASE_URL}/users`;
const TOKEN_KEY = 'userToken';

const MilestoneTasksScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { milestone: initialMilestone, projectId } = route.params;

  const [activeView, setActiveView] = useState('Calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    const sunday = new Date(today.getFullYear(), today.getMonth(), diff);
    return sunday;
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(initialMilestone?.progress || 0);
  const [milestoneData, setMilestoneData] = useState(initialMilestone);

  // Members states for user selection in modal
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  // States for subtask addition/editing
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null); // null for new
  const [currentSubtask, setCurrentSubtask] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: [], // Array of user IDs (strings for now; integrate user search later)
    isCompleted: false,
  });

  // Date picker states - Updated for @react-native-community/datetimepicker
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  // Helper to get date key for comparison (YYYY-MM-DD)
  const getDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Filter tasks by date range (active on selected date) - Now returns array
  const getFilteredTasks = (tasks, date) => {
    if (!tasks || !Array.isArray(tasks)) {
      return [];
    }
    
    return tasks.filter(task => {
      if (!task || !task.startDate || !task.endDate) return false;
      try {
        const startKey = getDateKey(task.startDate);
        const endKey = getDateKey(task.endDate);
        const checkKey = getDateKey(date);
        return checkKey >= startKey && checkKey <= endKey;
      } catch (error) {
        console.error('Error parsing task dates:', error);
        return false;
      }
    });
  };

  // Generate week dates function - Fixed to start on Sunday
  const generateWeekDates = (startDate) => {
    const dates = [];
    const current = new Date(startDate);
    // Standard diff for Sunday start
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek;
    current.setDate(diff);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      dates.push({
        date: date.getDate(),
        day: dayNames[i],
        fullDate: new Date(date),
        isCurrentMonth: date.getMonth() === selectedDate.getMonth(),
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
    const newWeekStart = new Date(currentMonth);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentMonth(newWeekStart);
    // Update selectedDate to same weekday in new week
    const dayOfWeek = selectedDate.getDay();
    const newSelected = new Date(newWeekStart);
    newSelected.setDate(newWeekStart.getDate() + dayOfWeek);
    setSelectedDate(newSelected);
    setFilteredTasks(getFilteredTasks(allTasks, newSelected));
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentMonth);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentMonth(newWeekStart);
    // Update selectedDate to same weekday in new week
    const dayOfWeek = selectedDate.getDay();
    const newSelected = new Date(newWeekStart);
    newSelected.setDate(newWeekStart.getDate() + dayOfWeek);
    setSelectedDate(newSelected);
    setFilteredTasks(getFilteredTasks(allTasks, newSelected));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Set currentMonth to start of week containing date
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    const weekStart = new Date(date.getFullYear(), date.getMonth(), diff);
    setCurrentMonth(weekStart);
    setFilteredTasks(getFilteredTasks(allTasks, date));
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

  // Fetch members (similar to MilestonesScreen)
  const fetchMembers = async () => {
    if (!projectId) return;
    setMembersLoading(true);
    setMembersError(null);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      const res = await fetch(USERS_URL, { method: 'GET', headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      const list = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
      // Filter members assigned to this projectId
      const membersAssignedToProject = list.filter(member =>
        Array.isArray(member.assignedProjects) &&
        member.assignedProjects.some(pid => String(pid) === String(projectId))
      );
      setMembers(membersAssignedToProject);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setMembersError(err.message || 'Failed to load members');
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch milestone details and subtasks (GET /milestones/${milestoneId})
  const fetchMilestone = async () => {
    // Fix: Handle both 'id' and '_id' for milestone ID
    const milestoneId = milestoneData?.id || milestoneData?._id;
    if (!milestoneId) {
      setTasksError('Missing milestone ID');
      setLoadingTasks(false);
      return;
    }

    setLoadingTasks(true);
    setTasksError(null);
    
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(MILESTONE_BY_ID(milestoneId), {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      console.log('GET Milestone Response:', json); // Console the GET response
      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch milestone');
      }

      const milestone = json.data;
      const subtasks = Array.isArray(milestone.subtasks) ? milestone.subtasks : [];

      // Map subtasks to task format expected by UI - Fixed mapping for description and other fields
      const mappedTasks = subtasks.map(sub => {
        console.log('Subtask object:', sub); // Added logging to debug subtask structure
        return {
          id: sub._id,
          _id: sub._id,
          title: sub.title || 'Untitled Task',
          description: sub.description || 'No description available', // Restored fallback to ensure mapping and display
          priority: sub.priority || 'Medium', // Use API field if available, else default
          assignees: Array.isArray(sub.assignedTo) ? sub.assignedTo.length : 0,
          startDate: sub.startDate,
          endDate: sub.endDate,
          status: sub.isCompleted ? 'completed' : 'pending',
          startTime: sub.startTime || '09:00 AM', // Use API if available
          endTime: sub.endTime || '05:00 PM', // Use API if available
          color: milestone.color || '#0066FF',
          attachments: sub.attachments || [],
          assignedTo: sub.assignedTo || [], // Preserve full array for updates
          isCompleted: sub.isCompleted || false, // Preserve for updates
        };
      });

      setMilestoneData({ ...milestone, id: milestone._id || milestone.id }); // Ensure 'id' is set
      setAllTasks(mappedTasks);

      // Set initial selectedDate to today or earliest task start if today has no tasks
      const today = new Date();
      const todayKey = getDateKey(today);
      const hasTasksToday = mappedTasks.some(task => {
        const startKey = getDateKey(task.startDate);
        const endKey = getDateKey(task.endDate);
        return todayKey >= startKey && todayKey <= endKey;
      });

      let initialDate = today;
      if (!hasTasksToday && mappedTasks.length > 0) {
        const futureTasks = mappedTasks.filter(task => {
          const startKey = getDateKey(task.startDate);
          return startKey > todayKey;
        });
        if (futureTasks.length > 0) {
          const earliestTask = futureTasks.reduce((min, task) => {
            return new Date(task.startDate) < new Date(min.startDate) ? task : min;
          });
          initialDate = new Date(earliestTask.startDate);
        }
      }

      setSelectedDate(initialDate);
      // Set currentMonth to start of week containing initialDate
      const dayOfWeek = initialDate.getDay();
      const diff = initialDate.getDate() - dayOfWeek;
      const weekStart = new Date(initialDate.getFullYear(), initialDate.getMonth(), diff);
      setCurrentMonth(weekStart);

      // Compute and set filtered tasks immediately
      const initialFiltered = getFilteredTasks(mappedTasks, initialDate);
      setFilteredTasks(initialFiltered);
      const progress = milestone.progress || calculateProgress(mappedTasks);
      setCurrentProgress(progress);
    } catch (err) {
      console.error('Failed to fetch milestone:', err);
      setTasksError(err.message || 'Failed to fetch milestone details');
      // Fix: Ensure fallback has 'id'
      const fallbackMilestone = initialMilestone ? { ...initialMilestone, id: initialMilestone._id || initialMilestone.id } : null;
      setMilestoneData(fallbackMilestone);
      const fallbackTasks = [];
      setAllTasks(fallbackTasks);
      setFilteredTasks(fallbackTasks);
      const progress = fallbackMilestone?.progress || calculateProgress(fallbackTasks);
      setCurrentProgress(progress);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Handle add/edit subtask via PUT
  const handleSaveSubtask = async () => {
    if (!currentSubtask.title.trim()) {
      Alert.alert("Error", "Subtask title is required");
      return;
    }

    // Fix: Get milestone ID safely
    const milestoneId = milestoneData?.id || milestoneData?._id;
    if (!milestoneId) {
      Alert.alert("Error", "Milestone ID is missing");
      return;
    }

    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const isEdit = !!editingTaskId;
      const updatedTasks = [...allTasks];
      const subtaskData = {
        title: currentSubtask.title,
        description: currentSubtask.description,
        startDate: currentSubtask.startDate,
        endDate: currentSubtask.endDate,
        assignedTo: currentSubtask.assignedTo,
        isCompleted: currentSubtask.isCompleted,
        attachments: [], // Default empty; handle uploads separately
      };

      if (isEdit) {
        // Update existing
        const index = allTasks.findIndex(t => (t._id || t.id) === editingTaskId);
        if (index < 0) {
          Alert.alert("Error", "Task not found for update");
          return;
        }
        const updatedTask = {
          ...allTasks[index],
          ...subtaskData,
          status: subtaskData.isCompleted ? 'completed' : 'pending',
          assignees: subtaskData.assignedTo.length,
        };
        updatedTasks[index] = updatedTask;
      } else {
        // Add new
        const newTaskId = `temp-${Date.now()}`; // Temp ID until refetch
        const newTask = {
          id: newTaskId,
          ...subtaskData,
          status: subtaskData.isCompleted ? 'completed' : 'pending',
          assignees: subtaskData.assignedTo.length,
          priority: 'Medium',
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          color: milestoneData.color || '#0066FF',
          attachments: [],
        };
        updatedTasks.push(newTask);
      }

      // Prepare API body with full subtasks array (backend replaces subtasks)
      const apiSubtasks = updatedTasks.map(task => {
        const { id, status, assignees, priority, startTime, endTime, color, dueDate } = task; // Added dueDate to destructuring
        const apiTask = { ...task };
        delete apiTask.id;
        delete apiTask.status;
        delete apiTask.assignees;
        delete apiTask.priority;
        delete apiTask.startTime;
        delete apiTask.endTime;
        delete apiTask.color;
        delete apiTask.dueDate; // Explicitly remove dueDate to avoid sending unknown fields
        return apiTask;
      });

      const body = {
        subtasks: apiSubtasks,
      };

      console.log('PUT Request Body:', JSON.stringify(body, null, 2)); // Added logging for debugging

      const res = await fetch(MILESTONE_BY_ID(milestoneId), {
        method: 'PUT', // Fixed: Changed to PUT for consistency
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('PUT Response Error:', { status: res.status, data: errData }); // Enhanced logging
        throw new Error(errData.message || "Failed to update milestone");
      }

      const updatedData = await res.json();
      console.log('PUT Response:', updatedData); // Log successful response
      if (updatedData.success) {
        Alert.alert("Success", isEdit ? "Subtask updated!" : "Subtask added!");
        // Refetch to get updated data with new _id and progress
        await fetchMilestone();
        resetSubtaskForm();
      } else {
        throw new Error(updatedData.message || "Failed to update");
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert("Error", err.message || "Failed to update subtask");
    }
  };

  // Handle delete subtask via PUT
  const handleDeleteSubtask = async (taskId) => {
    // Fix: Get milestone ID safely
    const milestoneId = milestoneData?.id || milestoneData?._id;
    if (!milestoneId) {
      Alert.alert("Error", "Milestone ID is missing");
      return;
    }

    Alert.alert(
      "Delete Subtask",
      "Are you sure? This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN_KEY);
              const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
              };

              // Filter out the deleted task
              const remainingTasks = allTasks.filter(t => (t._id || t.id) !== taskId);
              // Prepare full subtasks for PUT
              const apiSubtasks = remainingTasks.map(task => {
                const { id, status, assignees, priority, startTime, endTime, color, dueDate } = task; // Added dueDate
                const apiTask = { ...task };
                delete apiTask.id;
                delete apiTask.status;
                delete apiTask.assignees;
                delete apiTask.priority;
                delete apiTask.startTime;
                delete apiTask.endTime;
                delete apiTask.color;
                delete apiTask.dueDate; // Explicitly remove
                return apiTask;
              });
              const body = {
                subtasks: apiSubtasks,
              };

              console.log('DELETE PUT Request Body:', JSON.stringify(body, null, 2)); // Added logging

              const res = await fetch(MILESTONE_BY_ID(milestoneId), {
                method: 'PUT', // Fixed: Already PUT
                headers,
                body: JSON.stringify(body),
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('DELETE PUT Response Error:', { status: res.status, data: errData });
                Alert.alert("Error", errData.message || "Failed to delete subtask");
                return;
              }

              console.log('DELETE PUT Response:', await res.json()); // Log response
              await fetchMilestone();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert("Error", "Failed to delete subtask");
            }
          },
        },
      ]
    );
  };

  // Handle edit subtask
  const handleEditSubtask = (taskId) => {
    const task = allTasks.find(t => (t._id || t.id) === taskId);
    if (!task) return;
    setCurrentSubtask({
      title: task.title,
      description: task.description,
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      assignedTo: task.assignedTo || [],
      isCompleted: task.isCompleted || false,
    });
    setEditingTaskId(taskId);
    setTempStartDate(task.startDate ? new Date(task.startDate) : new Date());
    setTempEndDate(task.endDate ? new Date(task.endDate) : new Date());
    setShowSubtaskModal(true);
  };

  // Handle toggle completion via PUT
  const handleToggleCompletion = async (taskId) => {
    // Fix: Get milestone ID safely
    const milestoneId = milestoneData?.id || milestoneData?._id;
    if (!milestoneId) {
      Alert.alert("Error", "Milestone ID is missing");
      return;
    }

    const taskIndex = allTasks.findIndex(t => (t._id || t.id) === taskId);
    if (taskIndex === -1) {
      Alert.alert("Error", "Task not found");
      return;
    }

    const newCompleted = !allTasks[taskIndex].isCompleted;

    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };
      // Prepare full subtasks for PUT with only the toggled change
      const apiSubtasks = allTasks.map(t => {
        if ((t._id || t.id) === taskId) {
          return {
            _id: t._id,
            isCompleted: newCompleted,
            title: t.title,
            description: t.description,
            startDate: t.startDate,
            endDate: t.endDate,
            assignedTo: t.assignedTo,
            attachments: t.attachments || [],
          };
        } else {
          return {
            _id: t._id,
            isCompleted: t.isCompleted,
            title: t.title,
            description: t.description,
            startDate: t.startDate,
            endDate: t.endDate,
            assignedTo: t.assignedTo,
            attachments: t.attachments || [],
          };
        }
      });
      const body = {
        subtasks: apiSubtasks,
      };

      console.log('TOGGLE PUT Request Body:', JSON.stringify(body, null, 2)); // Added logging

      const res = await fetch(MILESTONE_BY_ID(milestoneId), {
        method: 'PUT', // Fixed: Already PUT
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('TOGGLE PUT Response Error:', { status: res.status, data: errData });
        Alert.alert("Error", errData.message || "Failed to update status");
        return;
      }

      console.log('TOGGLE PUT Response:', await res.json()); // Log response
      await fetchMilestone();
    } catch (err) {
      console.error('Toggle error:', err);
      Alert.alert("Error", "Failed to update status");
    }
  };

  // Reset form
  const resetSubtaskForm = () => {
    setCurrentSubtask({ title: '', description: '', startDate: '', endDate: '', assignedTo: [], isCompleted: false });
    setEditingTaskId(null);
    setShowSubtaskModal(false);
    setTempStartDate(new Date());
    setTempEndDate(new Date());
  };

  // Open add modal
  const openAddSubtask = () => {
    resetSubtaskForm();
    setEditingTaskId(null);
    setShowSubtaskModal(true);
  };

  // Handle date change for start/end (updated for new picker)
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempStartDate(selectedDate);
      setCurrentSubtask({ ...currentSubtask, startDate: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempEndDate(selectedDate);
      setCurrentSubtask({ ...currentSubtask, endDate: selectedDate.toISOString().split('T')[0] });
    }
  };

  useEffect(() => {
    // Fix: Ensure initialMilestone has 'id'
    const mappedInitial = initialMilestone ? { ...initialMilestone, id: initialMilestone._id || initialMilestone.id } : null;
    setMilestoneData(mappedInitial);
    if (mappedInitial) {
      fetchMilestone();
      fetchMembers(); // Fetch members on mount
    }
  }, [initialMilestone, projectId]);

  // UI Components - Enhanced ActivityCard with actions
  const ActivityCard = ({ item, taskId }) => {
    if (!item) return null;
    
    const formattedStartDate = item.startDate ? new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No start date';
    const formattedEndDate = item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No end date';
    
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
        <Text style={styles.activityDesc}>
          {item.description}
        </Text>
        <View style={styles.taskDetails}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color="#6B7280" />
            <Text style={styles.dateText}>{formattedStartDate} - {formattedEndDate}</Text>
          </View>
          <View style={styles.assigneeRow}>
            <View style={styles.assigneeAvatars}>
              {[...Array(Math.max(0, item.assignees || 0))].map((_, i) => (
                <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -8 }]} />
              ))}
            </View>
            <Text style={styles.assigneeCount}>{item.assignees || 0} assigned</Text>
          </View>
        </View>
        <View style={styles.taskActionsRow}>
          <TouchableOpacity
            style={[styles.toggleButton, item.status === 'completed' && styles.toggleCompleted]}
            onPress={() => handleToggleCompletion(taskId)}
          >
            <Ionicons 
              name={item.status === 'completed' ? 'checkmark-circle' : 'radio-button-off'} 
              size={20} 
              color={item.status === 'completed' ? '#10b981' : '#6B7280'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditSubtask(taskId)}
          >
            <Feather name="edit-2" size={16} color="#0066FF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteSubtask(taskId)}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ScheduleCard = ({ item }) => {
    if (!item) return null;
    
    const formattedStartDate = item.startDate ? new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date';
    const formattedEndDate = item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date';
    
    return (
      <View style={styles.scheduleCard}>
        <View style={[styles.scheduleColorBar, { backgroundColor: item.color || milestoneData?.color || '#0066FF' }]} />
        <View style={styles.scheduleContent}>
          <Text style={styles.scheduleTitle}>{item.title || 'Untitled Task'}</Text>
          <Text style={styles.scheduleTime}>
            {formattedStartDate} - {formattedEndDate}
          </Text>
          <Text style={styles.scheduleDesc}>
            {item.description}
          </Text>
          <Text style={styles.scheduleAssignees}>{item.assignees || 0} assigned</Text>
        </View>
      </View>
    );
  };

  // Filter tasks for schedule view
  const scheduleTasks = filteredTasks.filter(task => 
    task && task.startTime && task.endTime
  );

  if (!milestoneData) {
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
        title={milestoneData.title || 'Untitled Milestone'} 
        showBackButton={true} 
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        {/* Milestone Header Section */}
        <View style={styles.milestoneHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={[styles.milestoneIcon, { backgroundColor: `${milestoneData.color || '#0066FF'}20` }]}>
                <Ionicons name={milestoneData.icon || 'flag'} size={20} color={milestoneData.color || '#0066FF'} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{milestoneData.title || 'Untitled Milestone'}</Text>
                <Text style={styles.headerSubtitle}>{milestoneData.description || 'No description'}</Text>
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
                  backgroundColor: milestoneData.color || '#0066FF' 
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

              {/* Tasks for Selected Date - Fixed: Show only month and date */}
              <View style={styles.tasksContainer}>
                <View style={styles.tasksHeader}>
                  <Text style={styles.tasksDate}>
                    Tasks for {selectedDate.toLocaleDateString('en-US', { 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={openAddSubtask}
                  >
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
                    renderItem={({ item }) => (
                      <ActivityCard 
                        key={item._id || item.id} 
                        item={item} 
                        taskId={item._id || item.id} 
                      />
                    )}
                    keyExtractor={(item, index) => 
                      item?._id?.toString() || 
                      item?.id?.toString() || 
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
                    renderItem={({ item, index }) => <ScheduleCard key={item._id || item.id || index} item={item} />}
                    keyExtractor={(item, index) => 
                      item?._id?.toString() || 
                      item?.id?.toString() || 
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

      {/* Subtask Modal - Updated with user dropdown like MilestonesScreen */}
      <Modal
        visible={showSubtaskModal}
        transparent
        animationType="slide"
        onRequestClose={resetSubtaskForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTaskId ? 'Edit Subtask' : 'Add New Subtask'}
              </Text>
              <TouchableOpacity onPress={resetSubtaskForm}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Pour concrete foundation"
                  value={currentSubtask.title}
                  onChangeText={(text) => setCurrentSubtask({ ...currentSubtask, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Details about this subtask..."
                  value={currentSubtask.description}
                  onChangeText={(text) => setCurrentSubtask({ ...currentSubtask, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {currentSubtask.startDate ? new Date(currentSubtask.startDate).toLocaleDateString() : 'Select start date'}
                  </Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    testID="startDateTimePicker"
                    value={tempStartDate}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {currentSubtask.endDate ? new Date(currentSubtask.endDate).toLocaleDateString() : 'Select end date'}
                  </Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDateTimePicker"
                    value={tempEndDate}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                  />
                )}
              </View>

              {/* Assigned To: Updated to dropdown like MilestonesScreen */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Assigned To (Optional)</Text>
                {membersLoading ? (
                  <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#0066FF" />
                  </View>
                ) : membersError ? (
                  <Text style={{ color: '#EF4444', fontSize: 14, marginTop: 4 }}>{membersError}</Text>
                ) : members.length === 0 ? (
                  <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>No members available</Text>
                ) : (
                  <View>
                    <View style={styles.dropdownInput}>
                      <Text style={styles.dropdownText} numberOfLines={1}>
                        {currentSubtask.assignedTo.length > 0
                          ? currentSubtask.assignedTo
                              .map(id => {
                                const member = members.find(m => String(m._id || m.id) === String(id));
                                return member?.name || member?.fullName || `${member?.firstName || ''} ${member?.lastName || ''}`.trim() || id;
                              })
                              .join(', ')
                          : 'Select members'}
                      </Text>
                      <Feather name="chevron-down" size={20} color="#6B7280" />
                    </View>
                    <View style={{ marginTop: 8 }}>
                      {members.map((m) => {
                        const id = m._id || m.id;
                        const selected = currentSubtask.assignedTo.some(x => String(x) === String(id));
                        return (
                          <TouchableOpacity
                            key={id}
                            style={[styles.memberItem, selected && styles.memberItemActive]}
                            onPress={() => {
                              setCurrentSubtask(prev => {
                                const assigned = [...prev.assignedTo];
                                const exists = assigned.some(x => String(x) === String(id));
                                if (exists) {
                                  return { ...prev, assignedTo: assigned.filter(x => String(x) !== String(id)) };
                                } else {
                                  return { ...prev, assignedTo: [...assigned, id] };
                                }
                              });
                            }}
                          >
                            <Text style={[styles.memberText, selected && styles.memberTextActive]}>
                              {m.name || m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || id}
                            </Text>
                            <Text style={{ fontSize: 12, color: selected ? '#ffffff' : '#6B7280' }}>{m.email}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Mark as Completed</Text>
                  <Switch
                    value={currentSubtask.isCompleted}
                    onValueChange={(value) => setCurrentSubtask({ ...currentSubtask, isCompleted: value })}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={currentSubtask.isCompleted ? "#0066FF" : "#f4f3f4"}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={resetSubtaskForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.createButton,
                  !currentSubtask.title.trim() && styles.createButtonDisabled
                ]}
                onPress={handleSaveSubtask}
                disabled={!currentSubtask.title.trim()}
              >
                <Text style={styles.createButtonText}>
                  {editingTaskId ? 'Update Subtask' : 'Add Subtask'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  taskDetails: {
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: 'white',
  },
  assigneeCount: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  taskActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    padding: 4,
    marginRight: 8,
  },
  toggleCompleted: {
    // Optional: Style change for completed
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
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
    marginBottom: 4,
  },
  scheduleAssignees: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#9CA3AF',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: 600,
  },
  modalScroll: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 0,
  },
  modalTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputLabel: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#111827',
  },
  // Member selection styles (from MilestonesScreen)
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  memberItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  memberItemActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  memberText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  memberTextActive: {
    color: 'white',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  switchLabel: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  cancelButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#6B7280',
  },
  createButton: {
    flex: 2,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#0066FF',
    borderRadius: 12,
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  createButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default MilestoneTasksScreen;