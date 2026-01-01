import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const resolutionData = [
  {
    id: '1',
    riskCategory: 'Safety Hazard',
    severityLevel: 'High',
    currentStatus: 'Pending',
    responsibleParty: 'Project Manager',
    resolutionTimeline: {
      reported: 'Mar 20, 2025',
      expected: 'Mar 30, 2025',
      actual: 'Mar 29, 2025',
    },
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
  {
    id: '2',
    riskCategory: 'Safety Hazard',
    severityLevel: 'High',
    currentStatus: 'Pending',
    responsibleParty: 'Project Manager',
    resolutionTimeline: {
      reported: 'Mar 20, 2025',
      expected: 'Mar 30, 2025',
      actual: 'Mar 29, 2025',
    },
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
];

const ResolutionItem = ({ item }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
      {/* Header Row */}
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-sm text-gray-500 mb-1">Risk Category:</Text>
          <Text className="text-base font-medium text-gray-900">{item.riskCategory}</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500 mb-1">Severity Level:</Text>
          <View className="bg-red-100 px-2 py-1 rounded">
            <Text className="text-red-600 text-xs font-semibold">{item.severityLevel}</Text>
          </View>
        </View>
      </View>

      {/* Status */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-gray-500">Current Status:</Text>
        <View className="bg-orange-100 px-3 py-1 rounded-lg">
          <Text className="text-orange-600 text-sm font-semibold">{item.currentStatus}</Text>
        </View>
      </View>

      {/* Responsible Party */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm text-gray-500">Responsible Party:</Text>
        <Text className="text-base font-medium text-gray-900">{item.responsibleParty}</Text>
      </View>

      {/* Timeline */}
      <View className="mb-4">
        <Text className="text-sm text-gray-500 mb-2">Resolution Timeline</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Reported:</Text>
          <Text className="text-sm font-medium text-gray-900">{item.resolutionTimeline.reported}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Expected:</Text>
          <Text className="text-sm font-medium text-gray-900">{item.resolutionTimeline.expected}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">Actual:</Text>
          <Text className="text-sm font-medium text-gray-900">{item.resolutionTimeline.actual}</Text>
        </View>
      </View>

      {/* Description */}
      <View>
        <Text className="text-sm text-gray-500 mb-2">Description</Text>
        <Text className="text-sm text-gray-700 leading-5">{item.description}</Text>
      </View>
    </View>
  );
};

const TrackRiskScreen = () => {
  const renderItem = ({ item }) => <ResolutionItem item={item} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-11">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-base text-gray-900"
          />
        </View>
      </View>

      {/* Header */}
      <View className="bg-white px-4 py-4">
        <Text className="text-lg font-semibold text-gray-900">Resolution List</Text>
      </View>

      {/* List */}
      <FlatList
        data={resolutionData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default TrackRiskScreen;