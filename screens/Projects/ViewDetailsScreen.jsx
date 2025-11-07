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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-2xl text-gray-900 mb-2">
              Luxury Vale Point Bay
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="ml-2 text-base text-gray-600">
                Palm Jummel's Dubai Gulf
              </Text>
            </View>
          </View>

          {/* Progress Section */}
          <View className="mb-8 p-4 bg-gray-50 rounded-2xl">
            <View className="flex-row justify-between items-center mb-3">
              <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-lg text-gray-900">
                Progress
              </Text>
              <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-lg text-blue-600">
                45%
              </Text>
            </View>
            <View className="h-3 overflow-hidden rounded-full bg-gray-200">
              <View
                className="h-full rounded-full bg-blue-600"
                style={{ width: '45%' }}
              />
            </View>
          </View>

          {/* Details Sections */}
          
          {/* Basic Project Details */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
              Basic Project Details
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Project Name</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Luxury Vale Point Bay</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Project Type</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Vale Construction</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Project ID</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">SRT-00325</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Location</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Palm Jummel's Dubai Gulf</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Start Date</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">10 Jan 2024</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">End Date</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">10 Dec 2024</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Project Status</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">-</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 mb-8" />

          {/* Project Team */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
              Project Team
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Project Manager</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">John Dan</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Consular</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">RFC No Horizon</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Main Controller</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Elkin Bullerin LLC</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Subcommittee</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">-</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 mb-8" />

          {/* Financial Overview */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
              Financial Overview
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Trade Budget</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">$5,000,000</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Amount Spent</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">$2,250,000</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Servicing Budget</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">$2,350,000</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">ECO Approval Status</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">-</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 mb-8" />

          {/* Client & Approach */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
              Client & Approach
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Client Name</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Mr. Ahmed al-Farot</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Approval Status</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">Pruning Client That Review</Text>
              </View>
              <View className="flex-row justify-between">
                <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500">Docs List</Text>
                <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900">$ Home Notebook 2 Printing</Text>
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