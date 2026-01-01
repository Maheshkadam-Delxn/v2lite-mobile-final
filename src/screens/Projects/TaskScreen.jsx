// MilestonesScreen.js
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const TaskScreen = ({ project: projectProp, route: routeProp }) => {
  const navigation = useNavigation();
  const route = routeProp || {};
  
  // Static Milestones Data
  const [milestones, setMilestones] = useState([
    {
      id: '1',
      title: 'Foundation Work',
      description: 'Excavation, footing, and foundation concrete work',
      progress: 40,
      status: 'In Progress',
      color: '#0066FF',
      icon: 'home',
      subtasks: [
        { id: '1-1', title: 'Site Excavation', status: 'completed', assignedTo: 'John Doe' },
        { id: '1-2', title: 'Footing Concrete', status: 'completed', assignedTo: 'Mike Smith' },
        { id: '1-3', title: 'Foundation Wall', status: 'in-progress', assignedTo: 'Sarah Johnson' },
        { id: '1-4', title: 'Waterproofing', status: 'pending', assignedTo: 'Not Assigned' },
        { id: '1-5', title: 'Backfilling', status: 'pending', assignedTo: 'Not Assigned' },
      ]
    },
    {
      id: '2',
      title: 'RCC Work',
      description: 'Structural concrete work for columns and beams',
      progress: 25,
      status: 'Ongoing',
      color: '#FFA800',
      icon: 'cube',
      subtasks: [
        { id: '2-1', title: 'Column Reinforcement', status: 'completed', assignedTo: 'Alex Brown' },
        { id: '2-2', title: 'Beam Shuttering', status: 'in-progress', assignedTo: 'Emma Wilson' },
        { id: '2-3', title: 'Concrete Pouring', status: 'pending', assignedTo: 'Not Assigned' },
        { id: '2-4', title: 'Curing', status: 'pending', assignedTo: 'Not Assigned' },
      ]
    },
    {
      id: '3',
      title: 'Slab Making',
      description: 'Floor slab construction and finishing',
      progress: 0,
      status: 'Not Started',
      color: '#1DD1A1',
      icon: 'square',
      subtasks: [
        { id: '3-1', title: 'Formwork Installation', status: 'pending', assignedTo: 'Not Assigned' },
        { id: '3-2', title: 'Slab Reinforcement', status: 'pending', assignedTo: 'Not Assigned' },
        { id: '3-3', title: 'Concrete Pouring', status: 'pending', assignedTo: 'Not Assigned' },
        { id: '3-4', title: 'Finishing', status: 'pending', assignedTo: 'Not Assigned' },
      ]
    },
  ]);

  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    color: '#0066FF',
  });

  const projectId = (projectProp && (projectProp._id || projectProp.id)) || route?.params?.projectId || null;

  // Calculate progress based on subtasks
  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / subtasks.length) * 100);
  };

  // Colors for new milestones
  const milestoneColors = ['#0066FF', '#FFA800', '#1DD1A1', '#FF6B6B', '#9B59B6', '#FFC312'];

  // Icons for new milestones
  const milestoneIcons = ['home', 'cube', 'square', 'grid', 'water', 'flash', 'construct', 'hammer', 'layers'];

  // Create new milestone
  const handleCreateMilestone = () => {
    if (!newMilestone.title.trim()) return;

    const randomColor = milestoneColors[Math.floor(Math.random() * milestoneColors.length)];
    const randomIcon = milestoneIcons[Math.floor(Math.random() * milestoneIcons.length)];

    const newMilestoneObj = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      progress: 0,
      status: 'Not Started',
      color: randomColor,
      icon: randomIcon,
      subtasks: []
    };

    setMilestones([...milestones, newMilestoneObj]);
    setNewMilestone({ title: '', description: '', color: '#0066FF' });
    setShowNewMilestoneModal(false);
  };

  // Navigate to milestone tasks screen
  const handleMilestonePress = (milestone) => {
    navigation.navigate('MilestoneTasks', {
      milestone,
      projectId,
    });
  };

  // Milestone Card Component
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
              <Ionicons name={milestone.icon} size={24} color={milestone.color} />
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
    </View>
  );
};

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
    width: 48,
    height: 48,
    borderRadius: 12,
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
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 20,
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
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
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

export default TaskScreen;