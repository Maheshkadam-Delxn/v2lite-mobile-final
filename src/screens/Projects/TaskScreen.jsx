// MilestonesScreen.js - Updated to include color and icon in POST, plus subtask addition UI in create modal
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
const BASE_URL = `${process.env.BASE_API_URL}/api`;
const MILESTONES_BY_PROJECT = (projectId) => `${BASE_URL}/milestones?projectId=${projectId}`;
const USERS_URL = `${BASE_URL}/users`;
const TOKEN_KEY = 'userToken';
const MilestonesScreen = ({ project: projectProp, route: routeProp }) => {
  const navigation = useNavigation();
  const route = routeProp || {};
 
  const projectId = (projectProp && (projectProp._id || projectProp.id)) || route?.params?.projectId || null;
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    color: '#0066FF',
    subtasks: [], // New: Array for subtasks
  });
  // New: States for subtask addition in modal
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null); // -1 for new
  const [currentSubtask, setCurrentSubtask] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: [], // Array of user IDs (strings for now; integrate user search later)
    isCompleted: false,
  });
  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  // Members states
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  // Status mapping from API to UI
  const mapStatusToUI = (apiStatus) => {
    switch (apiStatus) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Not Started';
    }
  };
  // Subtask status mapping for UI
  const mapSubtaskStatus = (apiStatus) => {
    // Assuming API subtasks have isCompleted; map to UI status
    return apiStatus === true ? 'completed' : 'pending';
  };
  // Fetch milestones (GET API)
  const fetchMilestones = async () => {
    if (!projectId) {
      setError('Missing projectId');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
   
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      const res = await fetch(MILESTONES_BY_PROJECT(projectId), {
        method: 'GET',
        headers,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch milestones');
      }
      const items = Array.isArray(json.data) ? json.data : [];
     
      // Map API data to UI shape
      const mappedMilestones = items.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description || '',
        progress: item.progress || 0,
        status: mapStatusToUI(item.status),
        color: item.color || '#0066FF',
        icon: item.icon || 'flag',
        subtasks: (item.subtasks || []).map(sub => ({
          id: sub._id,
          title: sub.title,
          description: sub.description || '', // Fixed: Use correct field name (assuming schema fix)
          startDate: sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '',
          endDate: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '',
          status: mapSubtaskStatus(sub.isCompleted),
          assignedTo: sub.assignedTo?.map(userId => ({ name: 'User' })) || ['Not Assigned'],
        })),
      }));
      setMilestones(mappedMilestones);
    } catch (err) {
      console.error('Failed to fetch milestones:', err);
      setError(err.message || 'Failed to fetch milestones');
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch members
  useEffect(() => {
    if (!projectId) return;
    const fetchMembers = async () => {
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
    fetchMembers();
  }, [projectId]);
  // Calculate progress based on subtasks (for validation)
  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(task => task.isCompleted).length; // Use isCompleted for calc
    return Math.round((completed / subtasks.length) * 100);
  };
  // Colors for new milestones
  const milestoneColors = ['#0066FF', '#FFA800', '#1DD1A1', '#FF6B6B', '#9B59B6', '#FFC312'];
  // Icons for new milestones
  const milestoneIcons = ['home', 'cube', 'square', 'grid', 'water', 'flash', 'construct', 'hammer', 'layers'];
  // New: Handle add/edit subtask
  const handleSaveSubtask = () => {
    if (!currentSubtask.title.trim()) {
      Alert.alert("Error", "Subtask title is required");
      return;
    }
    const subtasks = [...newMilestone.subtasks];
    const subtaskData = {
      ...currentSubtask,
      startDate: currentSubtask.startDate || '',
      endDate: currentSubtask.endDate || '',
      // Note: assignedTo as strings; in prod, map to real ObjectIds from user selection
    };
    if (editingSubtaskIndex >= 0) {
      subtasks[editingSubtaskIndex] = subtaskData;
    } else {
      subtasks.push(subtaskData);
    }
    setNewMilestone({ ...newMilestone, subtasks });
    setCurrentSubtask({ title: '', description: '', startDate: '', endDate: '', assignedTo: [], isCompleted: false });
    setEditingSubtaskIndex(null);
    setShowSubtaskModal(false);
  };
  // New: Handle delete subtask
  const handleDeleteSubtask = (index) => {
    Alert.alert(
      "Delete Subtask",
      "Are you sure? This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = newMilestone.subtasks.filter((_, i) => i !== index);
            setNewMilestone({ ...newMilestone, subtasks: updated });
          },
        },
      ]
    );
  };
  // New: Handle edit subtask
  const handleEditSubtask = (index) => {
    const subtask = newMilestone.subtasks[index];
    setCurrentSubtask(subtask);
    setEditingSubtaskIndex(index);
    setTempStartDate(subtask.startDate ? new Date(subtask.startDate) : new Date());
    setTempEndDate(subtask.endDate ? new Date(subtask.endDate) : new Date());
    setShowSubtaskModal(true);
  };
  // Create new milestone (POST API) - Updated to include subtasks
  const handleCreateMilestone = async () => {
    if (!newMilestone.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    const randomIcon = milestoneIcons[Math.floor(Math.random() * milestoneIcons.length)];
    const body = {
      projectId,
      title: newMilestone.title.trim(),
      description: newMilestone.description.trim() || `Milestone created on ${new Date().toLocaleDateString()}`,
      color: newMilestone.color,
      icon: randomIcon,
      subtasks: newMilestone.subtasks.map((subtask) => ({
        title: subtask.title,
        description: subtask.description, // Fixed: Use correct field
        startDate: subtask.startDate,
        endDate: subtask.endDate,
        assignedTo: subtask.assignedTo, // Array of IDs
        isCompleted: subtask.isCompleted || false,
        attachments: [], // Default empty
      })),
    };
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };
      const res = await fetch(`${BASE_URL}/milestones`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create milestone");
      }
      const newData = await res.json();
      if (newData.success) {
        Alert.alert("Success", "Milestone created successfully");
        // Map new milestone to UI shape
        const createdMilestone = {
          id: newData.data._id,
          title: body.title,
          description: body.description,
          progress: newData.data.progress || 0,
          status: mapStatusToUI(newData.data.status || 'not_started'),
          color: body.color,
          icon: body.icon,
          subtasks: (newData.data.subtasks || []).map(sub => ({
            id: sub._id,
            title: sub.title,
            description: sub.description || '',
            startDate: sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '',
            endDate: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '',
            status: mapSubtaskStatus(sub.isCompleted),
            assignedTo: sub.assignedTo?.map(userId => ({ name: 'User' })) || ['Not Assigned'],
          })),
        };
        setMilestones([createdMilestone, ...milestones]);
        setNewMilestone({ title: '', description: '', color: '#0066FF', subtasks: [] });
        setShowNewMilestoneModal(false);
      } else {
        throw new Error(newData.message || "Failed to create milestone");
      }
    } catch (err) {
      console.error('POST error:', err);
      Alert.alert("Error", err.message || "Network error");
    }
  };
  // Navigate to milestone tasks screen
  const handleMilestonePress = (milestone) => {
    navigation.navigate('MilestoneTasks', {
      milestone,
      projectId,
    });
  };
  // Fetch on mount
  useEffect(() => {
    fetchMilestones();
  }, [projectId]);
  // Milestone Card Component (unchanged, but uses mapped data)
  const MilestoneCard = ({ milestone }) => {
    const completedSubtasks = milestone.subtasks.filter(task => task.status === 'completed').length;
    const totalSubtasks = milestone.subtasks.length;
    return (
      <TouchableOpacity
        style={styles.milestoneCard}
        onPress={() => handleMilestonePress(milestone)}
        activeOpacity={0.9}
      >
        <View style={styles.milestoneHeader}>
          <View style={styles.milestoneIconContainer}>
            <View style={[styles.milestoneIcon, { backgroundColor: `${milestone.color}20` }]}>
              <Ionicons name={milestone.icon} size={20} color={milestone.color} />
            </View>
            <View style={styles.milestoneTitleContainer}>
              <Text style={styles.milestoneTitle}>{milestone.title}</Text>
              <Text style={styles.milestoneSubtitle}>{milestone.description}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${milestone.color}15` }]}>
            <Text style={[styles.statusBadgeText, { color: milestone.color }]}>
              {milestone.status}
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressPercent}>{milestone.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${milestone.progress}%`,
                  backgroundColor: milestone.color
                }
              ]}
            />
          </View>
          <Text style={styles.subtaskCount}>
            {completedSubtasks} of {totalSubtasks} tasks completed
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.viewTasksButton}
            onPress={() => handleMilestonePress(milestone)}
          >
            <Text style={styles.viewTasksText}>View Tasks</Text>
            <Feather name="chevron-right" size={16} color="#0066FF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading milestones...</Text>
        </View>
      </View>
    );
  }
  // Error state
  if (error && milestones.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchMilestones}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Project Milestones</Text>
            <Text style={styles.headerSubtitle}>
              Track progress for each construction phase
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowNewMilestoneModal(true)}
            disabled={loading}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{milestones.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {milestones.filter(m => m.status === 'In Progress' || m.status === 'Ongoing').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {milestones.filter(m => m.status === 'Completed').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length) || 0}%
            </Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>
        {/* Milestones List */}
        {milestones.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="flag" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No Milestones Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first milestone to start tracking construction phases
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowNewMilestoneModal(true)}
              disabled={loading}
            >
              <Ionicons name="add-circle-outline" size={20} color="#0066FF" />
              <Text style={styles.emptyButtonText}>Create Milestone</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={milestones}
            renderItem={({ item }) => <MilestoneCard milestone={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.milestonesList}
          />
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* New Milestone Modal */}
      <Modal
        visible={showNewMilestoneModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewMilestoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Milestone</Text>
              <TouchableOpacity onPress={() => setShowNewMilestoneModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Milestone Title *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Foundation Work, Slab Making"
                  value={newMilestone.title}
                  onChangeText={(text) => setNewMilestone({...newMilestone, title: text})}
                  maxLength={50}
                />
                <Text style={styles.charCount}>{newMilestone.title.length}/50</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Brief description of this milestone..."
                  value={newMilestone.description}
                  onChangeText={(text) => setNewMilestone({...newMilestone, description: text})}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Color Theme</Text>
                <View style={styles.colorOptions}>
                  {milestoneColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newMilestone.color === color && styles.colorOptionSelected
                      ]}
                      onPress={() => setNewMilestone({...newMilestone, color})}
                    />
                  ))}
                </View>
              </View>
              {/* New: Subtasks Section */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subtasks (Optional)</Text>
                <TouchableOpacity
                  style={styles.addSubtaskButton}
                  onPress={() => {
                    setCurrentSubtask({ title: '', description: '', startDate: '', endDate: '', assignedTo: [], isCompleted: false });
                    setEditingSubtaskIndex(-1);
                    setTempStartDate(new Date());
                    setTempEndDate(new Date());
                    setShowSubtaskModal(true);
                  }}
                >
                  <Feather name="plus" size={20} color="#0066FF" />
                  <Text style={styles.addSubtaskText}>Add Subtask</Text>
                </TouchableOpacity>
                {newMilestone.subtasks.length > 0 && (
                  <View style={styles.subtasksList}>
                    {newMilestone.subtasks.map((subtask, index) => (
                      <View key={index} style={styles.subtaskItem}>
                        <View style={styles.subtaskContent}>
                          <Text style={styles.subtaskTitle}>{subtask.title}</Text>
                          {subtask.description ? <Text style={styles.subtaskDesc}>{subtask.description}</Text> : null}
                          <Text style={styles.subtaskDates}>
                            {subtask.startDate} - {subtask.endDate}
                          </Text>
                        </View>
                        <View style={styles.subtaskActions}>
                          <TouchableOpacity
                            style={styles.editSubtaskButton}
                            onPress={() => handleEditSubtask(index)}
                          >
                            <Feather name="edit-2" size={16} color="#0066FF" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteSubtaskButton}
                            onPress={() => handleDeleteSubtask(index)}
                          >
                            <Feather name="trash-2" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {newMilestone.subtasks.length === 0 && (
                  <Text style={styles.subtaskHint}>Add subtasks to track detailed progress</Text>
                )}
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewMilestoneModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  !newMilestone.title.trim() && styles.createButtonDisabled
                ]}
                onPress={handleCreateMilestone}
                disabled={!newMilestone.title.trim()}
              >
                <Text style={styles.createButtonText}>Create Milestone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* New: Subtask Modal */}
      <Modal
        visible={showSubtaskModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowSubtaskModal(false);
          setEditingSubtaskIndex(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSubtaskIndex >= 0 ? 'Edit Subtask' : 'Add New Subtask'}
              </Text>
              <TouchableOpacity onPress={() => setShowSubtaskModal(false)}>
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
                    {currentSubtask.startDate || 'Select start date'}
                  </Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={tempStartDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setTempStartDate(selectedDate);
                        setCurrentSubtask({ ...currentSubtask, startDate: selectedDate.toISOString().split('T')[0] });
                      }
                    }}
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
                    {currentSubtask.endDate || 'Select end date'}
                  </Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={tempEndDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setTempEndDate(selectedDate);
                        setCurrentSubtask({ ...currentSubtask, endDate: selectedDate.toISOString().split('T')[0] });
                      }
                    }}
                  />
                )}
              </View>
              {/* Assigned To: Fetched list */}
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
                onPress={() => setShowSubtaskModal(false)}
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
                  {editingSubtaskIndex >= 0 ? 'Update Subtask' : 'Add Subtask'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
// Add new styles for subtask UI, loading, and error
const additionalStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  // New: Subtask styles
  addSubtaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginTop: 8,
  },
  addSubtaskText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#0066FF',
    marginLeft: 8,
  },
  subtasksList: {
    marginTop: 12,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  subtaskContent: {
    flex: 1,
  },
  subtaskTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  subtaskDesc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  subtaskDates: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  subtaskActions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  editSubtaskButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteSubtaskButton: {
    padding: 4,
  },
  subtaskHint: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
  // Member selection styles
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
  // Modal scroll
  modalScroll: {
    flex: 1,
  },
});
// Merge with existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  milestonesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  milestoneCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  milestoneIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneTitleContainer: {
    flex: 1,
  },
  milestoneTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  milestoneSubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercent: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  subtaskCount: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewTasksButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  viewTasksText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#0066FF',
    marginRight: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  emptyButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#0066FF',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%', // Fix: Increased maxHeight slightly to allow more room
    minHeight: 600, // Fix: Increased minHeight for taller default modal height
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
  charCount: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#111827',
    transform: [{ scale: 1.1 }],
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
  // Additional styles
  ...additionalStyles,
});
export default MilestonesScreen;