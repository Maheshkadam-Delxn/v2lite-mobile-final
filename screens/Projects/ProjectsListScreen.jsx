import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  SafeAreaView,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Slider from '@react-native-community/slider';

const API_URL = `${process.env.BASE_API_URL}/api/projects`;
const TOKEN_KEY = 'userToken';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ProjectsListScreen = () => {
  const navigation = useNavigation();

  // State
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Default');
  const [budgetRange, setBudgetRange] = useState({ min: 25, max: 1000 });
  const [assignedTeam, setAssignedTeam] = useState({
    'Project Manager': false,
    Consultant: false,
    Contractor: false,
  });
  const [projectType, setProjectType] = useState({
    Villas: false,
    Interior: false,
    'Commercial Building': false,
    'Residential Complex': false,
  });
  const [selectAll, setSelectAll] = useState(false);

  const sortOptions = ['Default', 'Start Date', 'Budget', 'Progress'];
  const teamOptions = ['Project Manager', 'Consultant', 'Contractor'];
  const projectTypeOptions = ['Villas', 'Interior', 'Commercial Building', 'Residential Complex'];

  const openSwipeableRefs = useRef(new Map());

  // Bottom sheet animation
  const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;

  const openFilter = () => {
    setShowFilter(true);
    translateY.setValue(BOTTOM_SHEET_HEIGHT);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(translateY, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowFilter(false);
    });
  };

  // Map API item to UI project
  const mapItemToProject = (item) => {
    const name = item.name || item.title || 'Untitled Project';
    const location =
      item.location || item.address || (item.site && item.site.address) || 'Address not provided';
    const dueDateRaw = item.dueDate || item.deadline || item.endDate || item.due || item.createdAt;
    const dueDate = dueDateRaw
      ? new Date(dueDateRaw).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';
    const status = item.status || (item.isActive ? 'In Progress' : 'Completed') || 'Unknown';
    const progress = typeof item.progress === 'number' ? item.progress : item.percentage || 0;
    const imageUrl = item.image || item.imageUrl || item.coverImage || item.thumbnail || null;

    return {
      id: item._id || item.id || Math.random().toString(36).slice(2),
      name,
      location,
      dueDate,
      status,
      statusColor:
        status === 'Completed' ? '#10B981' : status === 'InProgress' ? '#0066FF' : '#F59E0B',
      progress: Math.min(Math.max(parseInt(progress || 0, 10), 0), 100),
      imageUrl,
      raw: item,
    };
  };

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setError(null);
    try {
      if (!refreshing) setIsLoading(true);

      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json().catch(() => ({}));
      const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      if (!Array.isArray(items) || items.length === 0) {
        setProjects([]);
      } else {
        const filtered = items.filter(
  (item) => item.status !== "Proposal Under Approval"
);
        const mapped = filtered.map(mapItemToProject);
        setProjects(mapped);
      }
    } catch (err) {
      console.error('[Projects] fetch error:', err);
      setError('Failed to fetch projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
      return () => {
        openSwipeableRefs.current.forEach((ref) => ref?.close());
        openSwipeableRefs.current.clear();
      };
    }, [fetchProjects])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      // Close swipeable and optimistically remove from UI
      openSwipeableRefs.current.get(projectId)?.close();
      openSwipeableRefs.current.delete(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));

      const response = await fetch(`${API_URL}/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project from server');
      }
    } catch (error) {
      console.error('[Projects] Delete error:', error);
      fetchProjects(); // Revert on error
      Alert.alert('Delete Failed', 'Failed to delete project. Please try again.');
    }
  };

  const confirmDelete = (project) => {
    Alert.alert('Delete Project', `Are you sure you want to delete "${project.name}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          openSwipeableRefs.current.get(project.id)?.close();
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteProject(project.id),
      },
    ]);
  };

  // Render delete action
  const renderRightActions = (progress, dragX, project) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(project)}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Filter functions
  const toggleTeam = (team) => {
    setAssignedTeam((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  const toggleProjectType = (type) => {
    const newValue = !projectType[type];
    setProjectType((prev) => ({ ...prev, [type]: newValue }));

    const allSelected = projectTypeOptions.every((t) => (t === type ? newValue : projectType[t]));
    setSelectAll(allSelected);
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    const updated = {};
    projectTypeOptions.forEach((t) => (updated[t] = newValue));
    setProjectType(updated);
  };

  const handleResetFilters = () => {
    setSelectedSort('Default');
    setBudgetRange({ min: 25, max: 1000 });
    setAssignedTeam({
      'Project Manager': false,
      Consultant: false,
      Contractor: false,
    });
    setProjectType({
      Villas: false,
      Interior: false,
      'Commercial Building': false,
      'Residential Complex': false,
    });
    setSelectAll(false);
  };

  const handleApplyFilters = () => {
    const filters = {
      sort: selectedSort,
      budget: budgetRange,
      team: Object.keys(assignedTeam).filter((k) => assignedTeam[k]),
      types: Object.keys(projectType).filter((k) => projectType[k]),
    };
    console.log('Applied Filters:', filters);
    closeFilter();
  };

  // Search filtering
  const filteredProjects = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.status && p.status.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  // Navigation handlers
  const handleAddProject = () => {
    navigation.navigate('CreateProjectScreen');
  };

  const handleViewDetails = (project) => {
    navigation.navigate('ViewDetails', { project: project.raw || project });
  };

  const handleEditProject = (project) => {
    navigation.navigate('CreateProjectScreen', { project: project.raw || project });
  };

  // Project Card Component - UPDATED WITH YOUR PREFERRED DESIGN
  const ProjectCard = React.memo(({ project }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) {
          openSwipeableRefs.current.set(project.id, ref);
        }
      }}
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, project)}
      onSwipeableWillOpen={() => {
        // Close other open swipeables
        openSwipeableRefs.current.forEach((ref, id) => {
          if (id !== project.id) {
            ref?.close();
          }
        });
      }}>
      <View style={styles.card}>
        {/* Image + Title + Edit */}
        <View style={styles.cardHeader}>
          <View style={styles.imageContainer}>
            {project.raw.projectImages && project.raw.projectImages !== '' ? (
              <Image
                source={{ uri: project.raw.projectImages }}
                style={styles.projectImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.noImageText}>No image</Text>
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.projectName} numberOfLines={2}>
              {project.name}
            </Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {project.location}
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleEditProject(project)} style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {/* Due Date & Status */}
        <View style={styles.metaRow}>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={styles.dueDateText}>Due date {project.dueDate}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: project.statusColor }]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
          </View>
        </View>

        {/* View Details */}
        <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewDetails(project)}>
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Text style={styles.detailsArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  ));

  // Filter Bottom Sheet
  const FilterBottomSheet = () => (
    <Modal
      visible={showFilter}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={closeFilter}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeFilter} />

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: BOTTOM_SHEET_HEIGHT,
              transform: [{ translateY }],
            },
          ]}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter Projects</Text>
              <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContentContainer}>
              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort by</Text>
                <View style={styles.chipContainer}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedSort(option)}
                      style={[styles.chip, selectedSort === option && styles.chipSelected]}>
                      <Text
                        style={[
                          styles.chipText,
                          selectedSort === option && styles.chipTextSelected,
                        ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Budget Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Budget Range</Text>
                <View style={styles.budgetDisplay}>
                  <View style={styles.budgetValue}>
                    <Text style={styles.budgetValueText}>${budgetRange.min}</Text>
                  </View>
                  <Text style={styles.budgetSeparator}>—</Text>
                  <View style={styles.budgetValue}>
                    <Text style={styles.budgetValueText}>${budgetRange.max}</Text>
                  </View>
                </View>

                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000}
                    value={budgetRange.min}
                    onValueChange={(v) => {
                      const newMin = Math.min(v, budgetRange.max - 25);
                      setBudgetRange((p) => ({
                        ...p,
                        min: Math.round(newMin / 25) * 25,
                      }));
                    }}
                    minimumTrackTintColor="#0066FF"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#0066FF"
                    step={25}
                  />
                </View>
              </View>

              {/* Assigned Team */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Assigned Team</Text>
                {teamOptions.map((team) => (
                  <TouchableOpacity
                    key={team}
                    onPress={() => toggleTeam(team)}
                    style={styles.checkboxRow}>
                    <Text style={styles.checkboxLabel}>{team}</Text>
                    <View style={[styles.checkbox, assignedTeam[team] && styles.checkboxChecked]}>
                      {assignedTeam[team] && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Project Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Project Type</Text>

                <TouchableOpacity
                  onPress={handleSelectAll}
                  style={[styles.checkboxRow, styles.selectAllRow]}>
                  <Text style={styles.selectAllLabel}>Select All</Text>
                  <View style={[styles.checkbox, selectAll && styles.checkboxChecked]}>
                    {selectAll && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </TouchableOpacity>

                {projectTypeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleProjectType(type)}
                    style={styles.checkboxRow}>
                    <Text style={styles.checkboxLabel}>{type}</Text>
                    <View style={[styles.checkbox, projectType[type] && styles.checkboxChecked]}>
                      {projectType[type] && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          title="My Projects"
          rightIcon="filter-outline"
          onRightIconPress={openFilter}
          backgroundImage={require('../../assets/header.png')}
          titleColor="white"
          iconColor="white"
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066FF" />
          }>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Search projects..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchProjects} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Projects List */}
          <View style={styles.projectsList}>
            {filteredProjects.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No projects found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Create your first project to get started'}
                </Text>
              </View>
            ) : (
              filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            )}
          </View>

          {/* Customer Dashboard Button */}
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.navigate('CustomerChooseTemplate')}>
            <Ionicons name="grid-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.dashboardButtonText}>Go to Customer Dashboard</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>

        <FilterBottomSheet />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Urbanist-Medium',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Urbanist-Regular',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 12,
    fontFamily: 'Urbanist-Medium',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#DC2626',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
  },
  projectsList: {
    paddingHorizontal: 16,
  },

  // UPDATED CARD STYLES - Using your preferred design
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  noImageText: {
    fontFamily: 'Urbanist-SemiBold',
    color: '#999',
    fontSize: 10,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Urbanist-Bold',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Urbanist-Regular',
    lineHeight: 16,
  },
  editButton: {
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Urbanist-Regular',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Urbanist-SemiBold',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066FF',
    borderRadius: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Urbanist-Medium',
  },
  detailsArrow: {
    fontSize: 18,
    color: '#9CA3AF',
    fontFamily: 'Urbanist-Regular',
  },

  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginLeft: 12,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Urbanist-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
    fontFamily: 'Urbanist-Regular',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Urbanist-SemiBold',
  },
  // Modal & Bottom Sheet Styles
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Urbanist-Bold',
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentContainer: {
    paddingBottom: 100,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Urbanist-SemiBold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Urbanist-Medium',
  },
  chipTextSelected: {
    color: 'white',
  },
  budgetDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetValue: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  budgetValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Urbanist-SemiBold',
  },
  budgetSeparator: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Urbanist-Regular',
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  selectAllRow: {
    marginBottom: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Urbanist-Regular',
  },
  selectAllLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'Urbanist-SemiBold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Urbanist-SemiBold',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Urbanist-SemiBold',
  },
});

export default ProjectsListScreen;
