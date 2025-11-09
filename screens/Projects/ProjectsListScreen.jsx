import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from 'components/BottomNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

const API_URL = 'https://skystruct-lite-backend.vercel.app/api/projects';
const TOKEN_KEY = 'userToken';

const ProjectsListScreen = () => {
  const navigation = useNavigation();

  // state
  const [projects, setProjects] = useState([]); // from API
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  // Use ref instead of state for swipeable row to prevent re-renders
  const swipeableRowRef = useRef(null);

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
      console.log('[Projects] token present:', !!token, ' (key used:', TOKEN_KEY, ')');

      const startedAt = Date.now();
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const tookMs = Date.now() - startedAt;

      // response summary
      const headersArr = Array.from(response.headers.entries ? response.headers.entries() : []);
      console.log('[Projects] response summary:', {
        status: response.status,
        ok: response.ok,
        url: response.url,
        tookMs,
        headersPreview: headersArr.slice(0, 20),
      });

      // parse body
      const json = await response.json().catch((e) => {
        console.warn('[Projects] failed to parse JSON body', e);
        return {};
      });
      console.log('[Projects] parsed JSON body:', json);

      // accept [] OR { data: [...] }
      const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      console.log('[Projects] detected items length:', items.length);

      if (!Array.isArray(items) || items.length === 0) {
        console.log('[Projects] No projects found, setting empty array');
        setProjects([]);
      } else {
        const mapped = items.map(mapItemToProject);
        console.log('[Projects] mapped projects (first):', mapped[0]);
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

  // run once on mount and again whenever screen focuses (handles navigate after login)
  useFocusEffect(
    useCallback(() => {
      console.log('[Projects] screen focused — fetching projects');
      fetchProjects();
      return () => {
        // cleanup when unfocused - close any open swipeable
        if (swipeableRowRef.current) {
          swipeableRowRef.current.close();
          swipeableRowRef.current = null;
        }
        console.log('[Projects] screen unfocused');
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
      
      // Close the swipeable row
      if (swipeableRowRef.current) {
        swipeableRowRef.current.close();
        swipeableRowRef.current = null;
      }

      // Optimistically remove from UI
      setProjects(prev => prev.filter(project => project.id !== projectId));

      // API call to delete from backend
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
      
      // Re-fetch projects to restore the deleted item if API call failed
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
        {/* <Text style={{ color: 'white', fontSize: 12, marginTop: 4, fontFamily: 'Urbanist-Medium' }}>
          Delete
        </Text> */}
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
    console.log('Navigate -> CreateProjectScreen');
    navigation.navigate('CreateProjectScreen');
  };

  const handleViewDetails = (project) => {
    console.log('Navigate -> ViewDetails, project id:', project.id);
    navigation.navigate('ViewDetails', { project: project.raw || project });
  };

  const handleEditProject = (project) => {
    console.log('Edit Project:', project.id);
    navigation.navigate('CreateProjectScreen', { project: project.raw || project });
  };

  const handleFilter = () => {
    console.log('Filter pressed');
    navigation.navigate('FilterScreen');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="My Projects"
        showBackButton={true}
        rightIcon="filter-outline"
        onRightIconPress={handleFilter}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
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
            />
          </View>

          {/* + Button – Redirects to CreateProjectScreen */}
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md"
            onPress={handleAddProject}
          >
            <Text className="text-2xl font-light text-white">+</Text>
          </TouchableOpacity>
        </View>

        {/* Project Cards */}
        {projects.map((project) => (
          <View
            key={project.id}
            className="mb-4 rounded-2xl border-l-4 border-blue-600 bg-white p-4 shadow"
          >
            {/* Image + Title + Edit */}
            <View className="mb-3 flex-row items-start">
              <View className="mr-3 h-12 w-12 overflow-hidden rounded-lg bg-gray-200">
                <Image
                  source={{ uri: project.imageUrl }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <Text
                  style={{ fontFamily: 'Urbanist-Bold' }}
                  className="mb-1 text-base text-black"
                >
                  {project.name}
                </Text>
                <Text
                  style={{ fontFamily: 'Urbanist-Regular' }}
                  className="text-xs leading-4 text-gray-500"
                >
                  {project.location}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleEditProject(project.id)}
                className="p-2"
              >
                <Ionicons name="create-outline" size={20} color="#0066FF" />
              </TouchableOpacity>
            </View>

            {/* Due Date & Status */}
            <View className="mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                <Text
                  style={{ fontFamily: 'Urbanist-Regular' }}
                  className="ml-2 text-xs text-gray-500"
                >
                  Due date {project.dueDate}
                </Text>
              </View>
              <View className={`${project.statusColor} rounded-full px-3 py-1`}>
                <Text
                  style={{ fontFamily: 'Urbanist-SemiBold' }}
                  className="text-xs text-white"
                >
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
              <Text
                style={{ fontFamily: 'Urbanist-Medium' }}
                className="text-sm text-gray-600"
              >
                View Details
              </Text>
              <Text className="text-lg text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
          <BottomNavBar />
        </View>
    </View>
  );
};

export default ProjectsListScreen;
