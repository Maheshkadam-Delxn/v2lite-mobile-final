
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
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
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
  const [initialLoad, setInitialLoad] = useState(true);

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
  const fetchProjects = useCallback(async (showLoading = true) => {
    setError(null);
    try {
      if (showLoading) {
        setIsLoading(true);
      }

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
          (item) =>
            item.status !== "Proposal Under Approval" &&
            item.status !== "Initialize" && item.status !== "Rejected"
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
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (initialLoad) {
        fetchProjects(true);
      } else {
        fetchProjects(false);
      }
      
      return () => {
        openSwipeableRefs.current.forEach((ref) => ref?.close());
        openSwipeableRefs.current.clear();
      };
    }, [fetchProjects, initialLoad])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects(true);
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!permissions?.permissions?.project?.delete && permissions?.role !== "admin") {
    Alert.alert(
      "Access Denied",
      "You do not have permission to delete a project.",
      [{ text: "OK" }]
    );
    return;
  }
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);

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
      fetchProjects(false);
      Alert.alert('Delete Failed', 'Failed to delete project. Please try again.');
    }
  };

  const confirmDelete = (project) => {
    if (!permissions?.permissions?.project?.delete && permissions?.role !== "admin") {
    Alert.alert(
      "Access Denied",
      "You do not have permission to delete a project.",
      [{ text: "OK" }]
    );
    return;
  }
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
  
    closeFilter();
  };

  const [permissions, setPermissions] = useState({});
useEffect(() => {
        const checkStorage = async () => {
            const user = await AsyncStorage.getItem('userData');
            const parsedUser = user ? JSON.parse(user) : null;

            const canAccessPayment =
                parsedUser?.role === "admin" ||
                !!(
                    parsedUser?.permissions?.payment &&
                    (
                        parsedUser.permissions.payment.create ||
                        parsedUser.permissions.payment.update ||
                        parsedUser.permissions.payment.delete ||
                        parsedUser.permissions.payment.view
                    )
                );
                console.log("Payment Access",parsedUser);
setPermissions(parsedUser);
            // const canAccessSiteSurveys =
            //     parsedUser?.role !== "admin" &&
            //     !!(
                   
            //             parsedUser.permissions.siteSurvey.create ||
            //             parsedUser.permissions.siteSurvey.update ||
            //             parsedUser.permissions.siteSurvey.delete ||
            //             parsedUser.permissions.siteSurvey.view
                    
            //     );

          
        };

        checkStorage();
    }, []);
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
  if (!permissions?.permissions?.project?.create  && permissions?.role !== "admin") {
    Alert.alert(
      "Access Denied",
      "You do not have permission to create a project.",
      [{ text: "OK" }]
    );
    return;
  }

  navigation.navigate('CreateProjectScreen');
};

  const handleViewDetails = (project) => {
    navigation.navigate('ViewDetails', { project: project.raw || project });
  };

  const handleEditProject = (project) => {
    navigation.navigate('CreateProjectScreen', { project: project.raw || project });
  };

  // Project Card Component
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
        openSwipeableRefs.current.forEach((ref, id) => {
          if (id !== project.id) {
            ref?.close();
          }
        });
      }}>
      <View style={styles.card}>
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
                <Ionicons name="image-outline" size={24} color="#D1D5DB" />
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.projectName} numberOfLines={2}>
              {project.name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#9CA3AF" />
              <Text style={styles.locationText} numberOfLines={1}>
                {project.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Due Date & Status */}
        <View style={styles.metaRow}>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={styles.dueDateText}>Due {project.dueDate}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: project.statusColor }]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{project.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
          </View>
        </View>

        {/* View Details */}
        <TouchableOpacity 
          style={styles.detailsButton} 
          onPress={() => handleViewDetails(project)}
          activeOpacity={0.7}>
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={20} color="#0066FF" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  ));

  // Enhanced Relaxing Skeleton Loading Component
  const SkeletonCard = ({ index }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Gentle shimmer effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Subtle pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 0.98,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      return () => {
        shimmerAnimation.stopAnimation();
        pulseAnimation.stopAnimation();
      };
    }, []);

    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View style={[styles.skeletonCard, { transform: [{ scale: pulseAnimation }] }]}>
        <View style={styles.skeletonCardHeader}>
          <Animated.View style={[styles.skeletonImage, { opacity: shimmerOpacity }]} />
          <View style={styles.skeletonHeaderInfo}>
            <Animated.View 
              style={[
                styles.skeletonTextLine, 
                { width: '70%', height: 18, marginBottom: 8, opacity: shimmerOpacity }
              ]} 
            />
            <View style={styles.skeletonLocationRow}>
              <Animated.View 
                style={[
                  styles.skeletonIcon, 
                  { width: 14, height: 14, opacity: shimmerOpacity }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.skeletonTextLine, 
                  { width: '80%', height: 14, marginLeft: 6, opacity: shimmerOpacity }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.skeletonMetaRow}>
          <View style={styles.skeletonDueDateContainer}>
            <Animated.View 
              style={[
                styles.skeletonIcon, 
                { width: 16, height: 16, opacity: shimmerOpacity }
              ]} 
            />
            <Animated.View 
              style={[
                styles.skeletonTextLine, 
                { width: 100, height: 14, marginLeft: 6, opacity: shimmerOpacity }
              ]} 
            />
          </View>
          <Animated.View 
            style={[
              styles.skeletonBadge, 
              { width: 90, height: 28, opacity: shimmerOpacity }
            ]} 
          />
        </View>

        <View style={styles.skeletonProgressSection}>
          <View style={styles.skeletonProgressHeader}>
            <Animated.View 
              style={[
                styles.skeletonTextLine, 
                { width: 60, height: 12, opacity: shimmerOpacity }
              ]} 
            />
            <Animated.View 
              style={[
                styles.skeletonTextLine, 
                { width: 35, height: 12, opacity: shimmerOpacity }
              ]} 
            />
          </View>
          <View style={styles.skeletonProgressBar}>
            <Animated.View 
              style={[
                styles.skeletonProgressFill, 
                { 
                  width: `${(index % 4) * 20 + 40}%`,
                  opacity: shimmerOpacity 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.skeletonDetailsButton}>
          <Animated.View 
            style={[
              styles.skeletonTextLine, 
              { width: 100, height: 14, opacity: shimmerOpacity }
            ]} 
          />
          <Animated.View 
            style={[
              styles.skeletonIcon, 
              { width: 20, height: 20, opacity: shimmerOpacity }
            ]} 
          />
        </View>
      </Animated.View>
    );
  };

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
                      style={[styles.chip, selectedSort === option && styles.chipSelected]}
                      activeOpacity={0.7}>
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
                    <Text style={styles.budgetLabel}>Min</Text>
                    <Text style={styles.budgetValueText}>${budgetRange.min}</Text>
                  </View>
                  <View style={styles.budgetSeparator}>
                    <View style={styles.separatorLine} />
                  </View>
                  <View style={styles.budgetValue}>
                    <Text style={styles.budgetLabel}>Max</Text>
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
                    style={styles.checkboxRow}
                    activeOpacity={0.7}>
                    <View style={styles.checkboxLabelContainer}>
                      <Ionicons 
                        name={team === 'Project Manager' ? 'person-outline' : team === 'Consultant' ? 'briefcase-outline' : 'construct-outline'} 
                        size={20} 
                        color="#6B7280" 
                      />
                      <Text style={styles.checkboxLabel}>{team}</Text>
                    </View>
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
                  style={[styles.checkboxRow, styles.selectAllRow]}
                  activeOpacity={0.7}>
                  <Text style={styles.selectAllLabel}>Select All</Text>
                  <View style={[styles.checkbox, selectAll && styles.checkboxChecked]}>
                    {selectAll && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </TouchableOpacity>

                {projectTypeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleProjectType(type)}
                    style={styles.checkboxRow}
                    activeOpacity={0.7}>
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
              <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton} activeOpacity={0.7}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton} activeOpacity={0.7}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );

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
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddProject} activeOpacity={0.7}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchProjects(true)} style={styles.retryButton} activeOpacity={0.7}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Projects List or Skeleton Loading */}
          <View style={styles.projectsList}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} index={index} />
              ))
            ) : filteredProjects.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyStateText}>No projects found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Create your first project to get started'}
                </Text>
                {!searchQuery && (
                  <TouchableOpacity 
                    style={styles.emptyStateButton} 
                    onPress={handleAddProject}
                    activeOpacity={0.7}>
                    <Ionicons name="add-circle-outline" size={20} color="#0066FF" />
                    <Text style={styles.emptyStateButtonText}>Create Project</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)
            )}
          </View>

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
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Urbanist-Regular',
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: 8,
    marginBottom: 12,
    fontFamily: 'Urbanist-Medium',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#DC2626',
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
  },
  projectsList: {
    paddingHorizontal: 16,
  },

  // Enhanced Skeleton Loading Styles
  skeletonCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  skeletonImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 14,
  },
  skeletonHeaderInfo: {
    flex: 1,
  },
  skeletonLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonIcon: {
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  skeletonTextLine: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonDueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  skeletonProgressSection: {
    marginBottom: 16,
  },
  skeletonProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonProgressBar: {
    height: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    overflow: 'hidden',
  },
  skeletonProgressFill: {
    height: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  skeletonDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Enhanced Project Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: '#a7a8a9ff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#F8FAFC',
  },
  headerInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    fontFamily: 'Urbanist-Bold',
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Urbanist-Regular',
    lineHeight: 18,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dueDateText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Urbanist-Medium',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Urbanist-SemiBold',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Urbanist-Medium',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#0066FF',
    fontFamily: 'Urbanist-Bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066FF',
    borderRadius: 6,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailsButtonText: {
    fontSize: 15,
    color: '#0066FF',
    fontFamily: 'Urbanist-SemiBold',
  },

  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
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
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    fontFamily: 'Urbanist-Bold',
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Urbanist-Regular',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  emptyStateButtonText: {
    fontSize: 15,
    color: '#0066FF',
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Urbanist-Bold',
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentContainer: {
    paddingBottom: 120,
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
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
    fontWeight: '600',
  },
  budgetDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  budgetValue: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontFamily: 'Urbanist-Medium',
  },
  budgetValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Urbanist-Bold',
  },
  budgetSeparator: {
    paddingHorizontal: 12,
  },
  separatorLine: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
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
    paddingVertical: 14,
  },
  selectAllRow: {
    marginBottom: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkboxLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Urbanist-Regular',
  },
  selectAllLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'Urbanist-SemiBold',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    borderRadius: 14,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Urbanist-SemiBold',
  },
});

export default ProjectsListScreen;



 