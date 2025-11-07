import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons } from '@expo/vector-icons';

const ViewDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    console.log('Edit project:', project.id);
    navigation.navigate('CreateProjectScreen');
  };

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Project Details"
        showBackButton={true}
        onBackPress={handleBack}
        rightIcon="create-outline"
        onRightIconPress={handleEdit}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        {/* Project Image */}
        <View className="h-64 w-full">
          <Image
            source={{ uri: project.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Project Info */}
        <View className="px-6 py-6">
          {/* Project Header */}
          <View className="mb-6 flex-row items-start justify-between">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-2xl text-gray-900 mb-2">
                {project.name}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="ml-2 text-base text-gray-600">
                  {project.location}
                </Text>
              </View>
            </View>
            <View className={`${project.statusColor} rounded-full px-4 py-2 ml-4`}>
              <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-sm text-white">
                {project.status}
              </Text>
            </View>
          </View>

          {/* Progress Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-lg text-gray-900">
                Progress
              </Text>
              <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-lg text-blue-600">
                {project.progress}%
              </Text>
            </View>
            <View className="h-3 overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${project.progress}%` }}
              />
            </View>
          </View>

          {/* Details Section */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-lg text-gray-900 mb-4">
              Project Details
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#0066FF" />
                <View className="ml-3">
                  <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-gray-500">
                    Due Date
                  </Text>
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-900">
                    {project.dueDate}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="flag-outline" size={20} color="#0066FF" />
                <View className="ml-3">
                  <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-gray-500">
                    Status
                  </Text>
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-900">
                    {project.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="business-outline" size={20} color="#0066FF" />
                <View className="ml-3">
                  <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-sm text-gray-500">
                    Location
                  </Text>
                  <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-900">
                    {project.location}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mb-8">
            <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl py-4 items-center">
              <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-white text-base">
                Update Progress
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-4 items-center">
              <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-gray-600 text-base">
                Share Project
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewDetailsScreen;