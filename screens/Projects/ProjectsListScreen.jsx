// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import React, { useState, useCallback, useMemo, useRef } from 'react';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import Header from 'components/Header';
// import { Ionicons } from '@expo/vector-icons';
// import BottomNavBar from 'components/BottomNavbar';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { RectButton } from 'react-native-gesture-handler';

// const API_URL = 'https://skystruct-lite-backend.vercel.app/api/projects';
// const TOKEN_KEY = 'userToken';

// const ProjectsListScreen = () => {
//   const navigation = useNavigation();

//   // state
//   const [projects, setProjects] = useState([]); // from API
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [error, setError] = useState(null);
  
//   // Use ref instead of state for swipeable row to prevent re-renders
//   const swipeableRowRef = useRef(null);

//   // map API item -> UI project shape
//   const mapItemToProject = (item) => {
//     const name = item.name || item.title || 'Untitled Project';
//     const location = item.location || item.address || (item.site && item.site.address) || 'Address not provided';
//     const dueDateRaw = item.dueDate || item.deadline || item.endDate || item.due || item.createdAt;
//     const dueDate = dueDateRaw ? new Date(dueDateRaw).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
//     const status = item.status || (item.isActive ? 'In Progress' : 'Completed') || 'Unknown';
//     const progress = typeof item.progress === 'number' ? item.progress : item.percentage || 0;
//     const imageUrl = item.image || item.imageUrl || item.coverImage || item.thumbnail || null;
//     return {
//       id: item._id || item.id || Math.random().toString(36).slice(2),
//       name,
//       location,
//       dueDate,
//       status,
//       statusColor: item.statusColor || (status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'),
//       progress: Math.min(Math.max(parseInt(progress || 0, 10), 0), 100),
//       imageUrl,
//       raw: item,
//     };
//   };

//   // fetch projects with verbose logging
//   const fetchProjects = useCallback(async () => {
//     setError(null);
//     try {
//       if (!refreshing) setIsLoading(true);

//       console.log('[Projects] fetchProjects -> start');
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
//       console.log('[Projects] token present:', !!token, ' (key used:', TOKEN_KEY, ')');

//       const startedAt = Date.now();
//       const response = await fetch(API_URL, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });
//       const tookMs = Date.now() - startedAt;

//       // response summary
//       const headersArr = Array.from(response.headers.entries ? response.headers.entries() : []);
//       console.log('[Projects] response summary:', {
//         status: response.status,
//         ok: response.ok,
//         url: response.url,
//         tookMs,
//         headersPreview: headersArr.slice(0, 20),
//       });

//       // parse body
//       const json = await response.json().catch((e) => {
//         console.warn('[Projects] failed to parse JSON body', e);
//         return {};
//       });
//       console.log('[Projects] parsed JSON body:', json);

//       // accept [] OR { data: [...] }
//       const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

//       console.log('[Projects] detected items length:', items.length);

//       if (!Array.isArray(items) || items.length === 0) {
//         console.log('[Projects] No projects found, setting empty array');
//         setProjects([]);
//       } else {
//         const mapped = items.map(mapItemToProject);
//         console.log('[Projects] mapped projects (first):', mapped[0]);
//         setProjects(mapped);
//       }
//     } catch (err) {
//       console.error('[Projects] fetch error:', err);
//       setError('Failed to fetch projects. See console for details.');
//       setProjects([]);
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   }, [refreshing]);

//   // run once on mount and again whenever screen focuses (handles navigate after login)
//   useFocusEffect(
//     useCallback(() => {
//       console.log('[Projects] screen focused — fetching projects');
//       fetchProjects();
//       return () => {
//         // cleanup when unfocused - close any open swipeable
//         if (swipeableRowRef.current) {
//           swipeableRowRef.current.close();
//           swipeableRowRef.current = null;
//         }
//         console.log('[Projects] screen unfocused');
//       };
//     }, [fetchProjects])
//   );

//   // pull-to-refresh handler
//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchProjects();
//   };

//   // delete project function
//   const deleteProject = async (projectId) => {
//     try {
//       const token = await AsyncStorage.getItem(TOKEN_KEY);
      
//       // Close the swipeable row
//       if (swipeableRowRef.current) {
//         swipeableRowRef.current.close();
//         swipeableRowRef.current = null;
//       }

//       // Optimistically remove from UI
//       setProjects(prev => prev.filter(project => project.id !== projectId));

//       // API call to delete from backend
//       const response = await fetch(`${API_URL}/${projectId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete project from server');
//       }

//       console.log('[Projects] Project deleted successfully:', projectId);
      
//     } catch (error) {
//       console.error('[Projects] Delete error:', error);
      
//       // Re-fetch projects to restore the deleted item if API call failed
//       fetchProjects();
      
//       Alert.alert(
//         'Delete Failed',
//         'Failed to delete project. Please try again.',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   // confirm delete dialog
//   const confirmDelete = (project) => {
//     Alert.alert(
//       'Delete Project',
//       `Are you sure you want to delete "${project.name}"?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//           onPress: () => {
//             if (swipeableRowRef.current) {
//               swipeableRowRef.current.close();
//               swipeableRowRef.current = null;
//             }
//           },
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => deleteProject(project.id),
//         },
//       ]
//     );
//   };

//   // swipeable right actions
//   const renderRightActions = (progress, dragX, project) => {
//     return (
//       <RectButton
//         style={{
//           width: 80,
//           marginLeft: 10,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: '#FF3B30',
//           borderRadius: 16,
//           marginVertical: 4,
//         }}
//         onPress={() => confirmDelete(project)}
//       >
//         <Ionicons name="trash-outline" size={24} color="white" />
//         {/* <Text style={{ color: 'white', fontSize: 12, marginTop: 4, fontFamily: 'Urbanist-Medium' }}>
//           Delete
//         </Text> */}
//       </RectButton>
//     );
//   };

//   // close other swipeable rows when one opens
//   const onSwipeableOpen = useCallback((ref) => {
//     if (swipeableRowRef.current && swipeableRowRef.current !== ref) {
//       swipeableRowRef.current.close();
//     }
//     swipeableRowRef.current = ref;
//   }, []);

//   // search filtering
//   const filteredProjects = useMemo(() => {
//     const q = (searchQuery || '').trim().toLowerCase();
//     if (!q) return projects;
//     return projects.filter(
//       (p) =>
//         p.name.toLowerCase().includes(q) ||
//         (p.location && p.location.toLowerCase().includes(q)) ||
//         (p.status && p.status.toLowerCase().includes(q))
//     );
//   }, [projects, searchQuery]);

//   // navigation handlers
//   const handleAddProject = () => {
//     console.log('Navigate -> CreateProjectScreen');
//     navigation.navigate('CreateProjectScreen');
//   };

//   const handleViewDetails = (project) => {
//     console.log('Navigate -> ViewDetails, project id:', project.id);
//     navigation.navigate('ViewDetails', { project: project.raw || project });
//   };

//   const handleEditProject = (project) => {
//     console.log('Edit Project:', project.id);
//     navigation.navigate('CreateProjectScreen', { project: project.raw || project });
//   };

//   const handleFilter = () => {
//     console.log('Filter pressed');
//     navigation.navigate('FilterScreen');
//   };

//   // Project Card Component
//   const ProjectCard = React.memo(({ project, index }) => (
//     <Swipeable
//       friction={2}
//       rightThreshold={40}
//       renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, project)}
//       onSwipeableWillOpen={() => onSwipeableOpen(swipeableRowRef.current)}
//       ref={(ref) => {
//         // Store ref without causing re-renders
//         if (ref && !swipeableRowRef.current) {
//           swipeableRowRef.current = ref;
//         }
//       }}
//     >
//       <View
//         className="mb-4 rounded-2xl border-l-4 bg-white p-4 shadow"
//         style={{ borderLeftColor: '#0066FF' }}
//       >
//         {/* Image + Title + Edit */}
//         <View className="mb-3 flex-row items-start">
//           <View className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
//             {project.raw.projectImages && project.raw.projectImages !== "" ? (
//               <Image
//                 source={{ uri: project.raw.projectImages }}
//                 className="h-full w-full"
//                 resizeMode="cover"
//               />
//             ) : (
//               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <Text style={{ fontFamily: 'Urbanist-SemiBold', color: '#999' }}>No image</Text>
//               </View>
//             )}
//           </View>

//           <View className="flex-1">
//             <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-1 text-base text-black">
//               {project.name}
//             </Text>
//             <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs leading-4 text-gray-500">
//               {project.location}
//             </Text>
//           </View>

//           <TouchableOpacity onPress={() => handleEditProject(project)} className="p-2">
//             <Ionicons name="create-outline" size={20} color="#0066FF" />
//           </TouchableOpacity>
//         </View>

//         {/* Due Date & Status */}
//         <View className="mb-3 flex-row items-center justify-between">
//           <View className="flex-row items-center">
//             <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
//             <Text style={{ fontFamily: 'Urbanist-Regular' }} className="ml-2 text-xs text-gray-500">
//               Due date {project.dueDate}
//             </Text>
//           </View>
//           <View className={`${project.statusColor} rounded-full px-3 py-1`}>
//             <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-xs text-white">
//               {project.status}
//             </Text>
//           </View>
//         </View>

//         {/* Progress Bar */}
//         <View className="mb-3">
//           <View className="h-2 overflow-hidden rounded-full bg-gray-200">
//             <View
//               className="h-full rounded-full bg-blue-600"
//               style={{ width: `${project.progress}%` }}
//             />
//           </View>
//         </View>

//         {/* View Details */}
//         <TouchableOpacity
//           className="flex-row items-center justify-between border-t border-gray-100 pt-3"
//           onPress={() => handleViewDetails(project)}
//         >
//           <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-gray-600">
//             View Details
//           </Text>
//           <Text className="text-lg text-gray-400" style={{ fontFamily: 'Urbanist-Regular' }}>›</Text>
//         </TouchableOpacity>
//       </View>
//     </Swipeable>
//   ));

//   // Loading state
//   if (isLoading) {
//     return (
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <View className="flex-1 bg-gray-50" style={{ justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color="#0066FF" />
//         </View>
//       </GestureHandlerRootView>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View className="flex-1 bg-gray-50">
//         {/* Header */}
//         <Header
//           title="My Projects"
//           // showBackButton={true}
//           rightIcon="filter-outline"
//           onRightIconPress={handleFilter}
//           backgroundColor="#0066FF"
//           titleColor="white"
//           iconColor="white"
//         />

//         <ScrollView
//           className="flex-1 px-4 pt-4"
//           showsVerticalScrollIndicator={false}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066FF" />}
//         >
//           {/* Search + Add Button */}
//           <View className="mb-5 flex-row items-center">
//             <View className="mr-3 flex-1 flex-row items-center rounded-xl bg-white px-4 py-3 shadow-sm">
//               <Ionicons name="search" size={20} color="#9CA3AF" />
//               <TextInput
//                 placeholder="Projects..."
//                 placeholderTextColor="#9CA3AF"
//                 className="ml-2 flex-1 text-sm text-gray-600"
//                 style={{ fontFamily: 'Urbanist-Regular' }}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>

//             {/* + Button – Redirects to CreateProjectScreen */}
//             <TouchableOpacity
//               className="h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md"
//               onPress={handleAddProject}
//             >
//               <Text className="text-2xl font-light text-white" style={{ fontFamily: 'Urbanist-Regular' }}>+</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Error */}
//           {error ? (
//             <View className="mb-4 px-2">
//               <Text className="text-center text-sm text-red-500">{error}</Text>
//               <TouchableOpacity onPress={fetchProjects} className="mt-3 rounded-md bg-blue-600 py-2 px-4">
//                 <Text className="text-center text-white">Retry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : null}

//           {/* Project Cards */}
//           {filteredProjects.length === 0 ? (
//             <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 50 }}>
//               No projects found.
//             </Text>
//           ) : (
//             filteredProjects.map((project, index) => (
//               <ProjectCard 
//                 key={project.id || index} 
//                 project={project} 
//                 index={index} 
//               />
//             ))
//           )}

//             {/* Go to Customer Dashboard Button */}
//           <TouchableOpacity
//             className="mx-4 mb-4 rounded-xl bg-blue-600 px-6 py-4 shadow-lg"
//             activeOpacity={0.8}
//             onPress={() => {
//               navigation.navigate('CustomerChooseTemplate');
//             }}>
//             <Text className="text-center text-base font-semibold text-white">
//               Go to Customer Dashboard
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
     
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default ProjectsListScreen;
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
} from 'react-native';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from 'components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';

const API_URL = 'https://skystruct-lite-backend.vercel.app/api/projects';
const TOKEN_KEY = 'userToken';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProjectsListScreen = () => {
  const navigation = useNavigation();

  // state
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  // Filter bottom sheet state
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Default');
  const [budgetRange, setBudgetRange] = useState({ min: 25, max: 1000 });
  const [assignedTeam, setAssignedTeam] = useState({
    'Project Manager': false,
    Consultant: false,
    Contractor: false,
  });
  const [projectType, setProjectType] = useState({
    Vils: false,
    Interior: false,
    'Commercial Building': false,
    'Residential Complex': false,
  });
  const [selectAll, setSelectAll] = useState(false);

  const sortOptions = ['Default', 'Start Date', 'Budget', 'Progress'];
  const teamOptions = ['Project Manager', 'Consultant', 'Contractor'];
  const projectTypeOptions = [
    'Vils',
    'Interior',
    'Commercial Building',
    'Residential Complex',
  ];

  const swipeableRowRef = useRef(null);
  
  // Fast Bottom sheet animation
  const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;

  const openFilter = () => {
    setShowFilter(true);
    translateY.setValue(BOTTOM_SHEET_HEIGHT);
    
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(translateY, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowFilter(false);
    });
  };

  // map API item -> UI project shape
  const mapItemToProject = (item) => {
    const name = item.name || item.title || 'Untitled Project';
    const location = item.location || item.address || (item.site && item.site.address) || 'Address not provided';
    const dueDateRaw = item.dueDate || item.deadline || item.endDate || item.due || item.createdAt;
    const dueDate = dueDateRaw ? new Date(dueDateRaw).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const status = item.status || (item.isActive ? 'In Progress' : 'Completed') || 'Unknown';
    const progress = typeof item.progress === 'number' ? item.progress : item.percentage || 0;
    const imageUrl = item.image || item.imageUrl || item.coverImage || item.thumbnail || null;
    return {
      id: item._id || item.id || Math.random().toString(36).slice(2),
      name,
      location,
      dueDate,
      status,
      statusColor: item.statusColor || (status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'),
      progress: Math.min(Math.max(parseInt(progress || 0, 10), 0), 100),
      imageUrl,
      raw: item,
    };
  };

  // fetch projects with verbose logging
  const fetchProjects = useCallback(async () => {
    setError(null);
    try {
      if (!refreshing) setIsLoading(true);

      console.log('[Projects] fetchProjects -> start');
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json().catch((e) => {
        console.warn('[Projects] failed to parse JSON body', e);
        return {};
      });

      const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      if (!Array.isArray(items) || items.length === 0) {
        setProjects([]);
      } else {
        const mapped = items.map(mapItemToProject);
        setProjects(mapped);
      }
    } catch (err) {
      console.error('[Projects] fetch error:', err);
      setError('Failed to fetch projects. See console for details.');
      setProjects([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // run once on mount and again whenever screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchProjects();
      return () => {
        if (swipeableRowRef.current) {
          swipeableRowRef.current.close();
          swipeableRowRef.current = null;
        }
      };
    }, [fetchProjects])
  );

  // pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  // delete project function
  const deleteProject = async (projectId) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (swipeableRowRef.current) {
        swipeableRowRef.current.close();
        swipeableRowRef.current = null;
      }

      setProjects(prev => prev.filter(project => project.id !== projectId));

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

      console.log('[Projects] Project deleted successfully:', projectId);
      
    } catch (error) {
      console.error('[Projects] Delete error:', error);
      fetchProjects();
      Alert.alert(
        'Delete Failed',
        'Failed to delete project. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // confirm delete dialog
  const confirmDelete = (project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            if (swipeableRowRef.current) {
              swipeableRowRef.current.close();
              swipeableRowRef.current = null;
            }
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProject(project.id),
        },
      ]
    );
  };

  // swipeable right actions
  const renderRightActions = (progress, dragX, project) => {
    return (
      <RectButton
        style={{
          width: 80,
          marginLeft: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FF3B30',
          borderRadius: 16,
          marginVertical: 4,
        }}
        onPress={() => confirmDelete(project)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </RectButton>
    );
  };

  // close other swipeable rows when one opens
  const onSwipeableOpen = useCallback((ref) => {
    if (swipeableRowRef.current && swipeableRowRef.current !== ref) {
      swipeableRowRef.current.close();
    }
    swipeableRowRef.current = ref;
  }, []);

  // Filter functions
  const toggleTeam = (team) => {
    setAssignedTeam((prev) => ({ ...prev, [team]: !prev[team] }));
  };

  const toggleProjectType = (type) => {
    const newValue = !projectType[type];
    setProjectType((prev) => ({ ...prev, [type]: newValue }));

    const allSelected = projectTypeOptions.every((t) =>
      t === type ? newValue : projectType[t]
    );
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
      Vils: false,
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

  // search filtering
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

  // navigation handlers
  const handleAddProject = () => {
    navigation.navigate('CreateProjectScreen');
  };

  const handleViewDetails = (project) => {
    navigation.navigate('ViewDetails', { project: project.raw || project });
  };

  const handleEditProject = (project) => {
    navigation.navigate('CreateProjectScreen', { project: project.raw || project });
  };

  const handleFilter = () => {
    openFilter();
  };

  // Project Card Component
  const ProjectCard = React.memo(({ project, index }) => (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, project)}
      onSwipeableWillOpen={() => onSwipeableOpen(swipeableRowRef.current)}
      ref={(ref) => {
        if (ref && !swipeableRowRef.current) {
          swipeableRowRef.current = ref;
        }
      }}
    >
      <View
        className="mb-4 rounded-2xl border-l-4 bg-white p-4 shadow"
        style={{ borderLeftColor: '#0066FF' }}
      >
        {/* Image + Title + Edit */}
        <View className="mb-3 flex-row items-start">
          <View className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
            {project.raw.projectImages && project.raw.projectImages !== "" ? (
              <Image
                source={{ uri: project.raw.projectImages }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', color: '#999' }}>No image</Text>
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-1 text-base text-black">
              {project.name}
            </Text>
            <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-xs leading-4 text-gray-500">
              {project.location}
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleEditProject(project)} className="p-2">
            <Ionicons name="create-outline" size={20} color="#0066FF" />
          </TouchableOpacity>
        </View>

        {/* Due Date & Status */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Urbanist-Regular' }} className="ml-2 text-xs text-gray-500">
              Due date {project.dueDate}
            </Text>
          </View>
          <View className={`${project.statusColor} rounded-full px-3 py-1`}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-xs text-white">
              {project.status}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-3">
          <View className="h-2 overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${project.progress}%` }}
            />
          </View>
        </View>

        {/* View Details */}
        <TouchableOpacity
          className="flex-row items-center justify-between border-t border-gray-100 pt-3"
          onPress={() => handleViewDetails(project)}
        >
          <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-gray-600">
            View Details
          </Text>
          <Text className="text-lg text-gray-400" style={{ fontFamily: 'Urbanist-Regular' }}>›</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  ));

  // Filter Bottom Sheet Component
  const FilterBottomSheet = () => (
    <Modal
      visible={showFilter}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={closeFilter}
    >
      <View className="flex-1">
        {/* Static Backdrop - No animation to prevent blackish screen */}
        <View className="flex-1 bg-black/50">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={closeFilter}
          />
        </View>
        
        {/* Animated Bottom Sheet */}
        <Animated.View 
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
          style={{ 
            height: BOTTOM_SHEET_HEIGHT,
            transform: [{ translateY }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <SafeAreaView className="flex-1">
            {/* Drag Handle */}
            <View className="items-center py-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="px-4 pb-2 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">Filters</Text>
                <TouchableOpacity 
                  onPress={closeFilter} 
                  className="p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {/* Sort By */}
              <View className="mx-4 mb-3 mt-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-2 text-base font-semibold text-gray-900">Sort by</Text>
                <View className="flex-row flex-wrap gap-1">
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedSort(option)}
                      className={`rounded-lg px-3 py-2 ${
                        selectedSort === option ? 'bg-blue-500' : 'bg-white'
                      }`}>
                      <Text
                        className={`text-xs font-medium ${
                          selectedSort === option ? 'text-white' : 'text-gray-700'
                        }`}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Budget Range */}
              <View className="mx-4 mb-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-2 text-base font-semibold text-gray-900">Budget</Text>
                <View className="mb-3 flex-row justify-between">
                  <View className="rounded-lg bg-white px-3 py-2">
                    <Text className="text-xs font-semibold text-gray-600">
                      ${budgetRange.min}
                    </Text>
                  </View>
                  <View className="rounded-lg bg-white px-3 py-2">
                    <Text className="text-xs font-semibold text-gray-600">
                      ${budgetRange.max}
                    </Text>
                  </View>
                </View>

                <View className="relative h-12 justify-center">
                  <View className="absolute left-0 right-0 top-5 h-1 rounded-full bg-gray-300" />
                  <View
                    className="absolute top-5 h-1 rounded-full bg-blue-500"
                    style={{
                      left: `${(budgetRange.min / 1000) * 100}%`,
                      right: `${100 - (budgetRange.max / 1000) * 100}%`,
                    }}
                  />

                  <Slider
                    style={{ width: '100%', height: 30, position: 'absolute' }}
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
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor="#3B82F6"
                    step={25}
                  />

                  <Slider
                    style={{ width: '100%', height: 30, position: 'absolute' }}
                    minimumValue={0}
                    maximumValue={1000}
                    value={budgetRange.max}
                    onValueChange={(v) => {
                      const newMax = Math.max(v, budgetRange.min + 25);
                      setBudgetRange((p) => ({
                        ...p,
                        max: Math.round(newMax / 25) * 25,
                      }));
                    }}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor="#3B82F6"
                    step={25}
                  />
                </View>
              </View>

              {/* Assigned Team */}
              <View className="mx-4 mb-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-2 text-base font-semibold text-gray-900">Team</Text>
                {teamOptions.map((team) => (
                  <TouchableOpacity
                    key={team}
                    onPress={() => toggleTeam(team)}
                    className="flex-row items-center justify-between py-2">
                    <Text className="text-sm font-medium text-gray-700">{team}</Text>
                    <View
                      className={`h-5 w-5 items-center justify-center rounded ${
                        assignedTeam[team] ? 'bg-blue-500' : 'border-2 border-gray-300'
                      }`}>
                      {assignedTeam[team] && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Project Type */}
              <View className="mx-4 mb-3 rounded-xl bg-gray-50 p-3">
                <Text className="mb-2 text-base font-semibold text-gray-900">Project Type</Text>
                
                <TouchableOpacity
                  onPress={handleSelectAll}
                  className="mb-2 flex-row items-center justify-between py-1">
                  <Text className="text-sm font-medium text-gray-700">Select All</Text>
                  <View
                    className={`h-5 w-5 items-center justify-center rounded ${
                      selectAll ? 'bg-blue-500' : 'border-2 border-gray-300'
                    }`}>
                    {selectAll && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                </TouchableOpacity>

                {projectTypeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => toggleProjectType(type)}
                    className="flex-row items-center justify-between py-1">
                    <Text className="text-sm font-medium text-gray-700">{type}</Text>
                    <View
                      className={`h-5 w-5 items-center justify-center rounded ${
                        projectType[type] ? 'bg-blue-500' : 'border-2 border-gray-300'
                      }`}>
                      {projectType[type] && (
                        <Ionicons name="checkmark" size={12} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 border-t border-gray-100">
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleResetFilters}
                  className="flex-1 items-center rounded-lg border border-gray-300 bg-white py-3">
                  <Text className="text-sm font-semibold text-gray-700">Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyFilters}
                  className="flex-1 items-center rounded-lg bg-blue-500 py-3">
                  <Text className="text-sm font-semibold text-white">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );

  // Loading state
  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-gray-50" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <Header
          title="My Projects"
          rightIcon="filter-outline"
          onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066FF" />}
        >
          {/* Search + Add Button */}
          <View className="mb-5 flex-row items-center">
            <View className="mr-3 flex-1 flex-row items-center rounded-xl bg-white px-4 py-3 shadow-sm">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Projects..."
                placeholderTextColor="#9CA3AF"
                className="ml-2 flex-1 text-sm text-gray-600"
                style={{ fontFamily: 'Urbanist-Regular' }}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md"
              onPress={handleAddProject}
            >
              <Text className="text-2xl font-light text-white" style={{ fontFamily: 'Urbanist-Regular' }}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error ? (
            <View className="mb-4 px-2">
              <Text className="text-center text-sm text-red-500">{error}</Text>
              <TouchableOpacity onPress={fetchProjects} className="mt-3 rounded-md bg-blue-600 py-2 px-4">
                <Text className="text-center text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Project Cards */}
          {filteredProjects.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 50 }}>
              No projects found.
            </Text>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id || index} 
                project={project} 
                index={index} 
              />
            ))
          )}

          {/* Go to Customer Dashboard Button */}
          <TouchableOpacity
            className="mx-4 mb-4 rounded-xl bg-blue-600 px-6 py-4 shadow-lg"
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('CustomerChooseTemplate');
            }}>
            <Text className="text-center text-base font-semibold text-white">
              Go to Customer Dashboard
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet />
     
      </View>
    </GestureHandlerRootView>
  );
};

export default ProjectsListScreen;