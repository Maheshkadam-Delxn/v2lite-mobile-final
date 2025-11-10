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
    : entries.filter(e => e.type === activeTab.toLowerCase());

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

        {/* Entry Tabs */}
        <View className="mx-4 mt-4 flex-row rounded-lg bg-gray-100 p-1">
          {['All Entries', 'Received Entries', 'Uned'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-2 rounded-md ${
                activeTab === tab ? 'bg-white shadow-sm' : ''
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Entries List Header */}
        <View className="mx-4 mt-4 flex-row justify-between items-center">
          <Text className="text-sm font-medium text-gray-700">Amount</Text>
          <Text className="text-sm font-medium text-gray-700">No Stock</Text>
        </View>

        {/* Entries List */}
        <View className="mx-4 mt-2 rounded-xl bg-white p-4">
          <FlatList
            data={filteredEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
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

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 h-16 flex-row items-center justify-around border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center">
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text className="mt-1 text-xs text-gray-500">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="folder-outline" size={24} color="#9CA3AF" />
          <Text className="mt-1 text-xs text-gray-500">Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="card-outline" size={24} color="#3B82F6" />
          <Text className="mt-1 text-xs text-blue-600">Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="document-text-outline" size={24} color="#9CA3AF" />
          <Text className="mt-1 text-xs text-gray-500">Tasks</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MaterialDetailsScreen;