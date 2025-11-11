// MaterialDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const MaterialDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState('All Entries');

  // Mock entries
  const entries = [
    {
      id: '1',
      date: '30 Apr 2025',
      party: 'Party: Others',
      qty: '+10',
      type: 'received',
    },
    {
      id: '2',
      date: 'On Arc 2025',
      party: 'Party: Aura Mishra',
      qty: '5',
      type: 'used',
    },
  ];

  const filteredEntries = activeTab === 'All Entries'
    ? entries
    : activeTab === 'Received Entries'
    ? entries.filter(e => e.type === 'received')
    : entries.filter(e => e.type === 'used');

  const renderEntry = ({ item }) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">{item.date}</Text>
          <Text className="text-xs text-gray-500 mt-1">{item.party}</Text>
        </View>
        <Text
          className={`text-sm font-medium ${
            item.type === 'received' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {item.qty}
        </Text>
      </View>
      <View className="h-px bg-gray-200 mt-3" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="Details"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Material Info Card */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-lg font-bold text-gray-900">Test Material</Text>
          <Text className="mt-2 text-sm text-gray-500">Cost Code: 123</Text>
          <Text className="mt-1 text-sm text-gray-500">Category:</Text>
          
          {/* Quantity Section */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">15,000 m</Text>
            <View className="flex-row justify-between border-b border-gray-200 pb-2">
              <Text className="text-xs text-gray-500">Quantity</Text>
              <Text className="text-xs text-gray-500">NETEGIES ID</Text>
              <Text className="text-xs text-gray-500">TEMA ADD</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm font-medium text-gray-900">0</Text>
              <Text className="text-sm font-medium text-gray-900">20</Text>
              <Text className="text-sm font-medium text-gray-900">5</Text>
            </View>
          </View>
        </View>

        {/* Entries Container */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          {/* Entries List Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-medium text-gray-700">Amount</Text>
            <Text className="text-sm font-medium text-gray-700">No Stock</Text>
          </View>

          {/* Entries List */}
          <FlatList
            data={filteredEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />

          {/* Empty State for Other Tabs */}
          {filteredEntries.length === 0 && (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-sm">No {activeTab.toLowerCase()} found</Text>
            </View>
          )}
        </View>

        {/* Additional Containers Section */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-sm font-medium text-gray-700 mb-3">Other Information</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Total Transactions</Text>
              <Text className="text-sm font-medium text-gray-900">2</Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Last Updated</Text>
              <Text className="text-sm font-medium text-gray-900">30 Apr 2025</Text>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Status</Text>
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-800">Active</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-16 left-0 right-0 flex-row px-4">
        <TouchableOpacity className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-red-50 py-3">
          <Text className="text-sm font-semibold text-red-600">Used</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-green-50 py-3">
          <Text className="text-sm font-semibold text-green-600">Received</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MaterialDetailsScreen;