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

const ProjectsListScreen = () => {
  const navigation = useNavigation();

  const projects = [
    {
      id: 1,
      name: 'Project Name 1',
      location: '1st Floor - B-12B C Block, Sector 2, Gautam Buddh',
      dueDate: '09 Jan 2026',
      status: 'In Progress',
      statusColor: 'bg-blue-600',
      progress: 40,
      imageUrl:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Project Name 2',
      location: '1st Floor - B-12B C Block, Sector 2, Gautam Buddh',
      dueDate: '07 Mar 2025',
      status: 'Completed',
      statusColor: 'bg-emerald-500',
      progress: 100,
      imageUrl:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Project Name 3',
      location: '1st Floor - B-12B C Block, Sector 2, Gautam Buddh',
      dueDate: '09 Jan 2026',
      status: 'In Progress',
      statusColor: 'bg-blue-600',
      progress: 40,
      imageUrl:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Navigate to CreateProjectScreen
  const handleAddProject = () => {
    navigation.navigate('CreateProjectScreen');
  };

  const handleViewDetails = (project) => {
    navigation.navigate('ViewDetails', { project });
  };

  const handleEditProject = (projectId) => {
    console.log('Edit Project:', projectId);
    navigation.navigate('CreateProjectScreen');
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