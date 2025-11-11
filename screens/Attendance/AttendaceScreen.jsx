import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
 
 
const AttendanceScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isActiveFilter, setIsActiveFilter] = useState(true);
 
  const tabs = ['All', 'Site Staff', 'Labour Contractor'];
 
  const staffData = [
    { id: 1, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 2, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 3, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 4, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 5, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 6, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 7, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
    { id: 8, name: 'Arun Mishra', role: 'Project Manager', time: '12:45', status: 'Present' },
  ];
 
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">1 Present</Text>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity>
            <Feather name="log-out" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="map-pin" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
 
      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 px-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`py-3 mr-6 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Text className={`${activeTab === tab ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
      {/* Date Badge and Filter */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center space-x-2">
          <View className="bg-blue-500 rounded-lg px-3 py-1.5">
            <Text className="text-white font-bold text-xs">JUN</Text>
            <Text className="text-white font-bold text-lg leading-tight">30</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Feather name="circle" size={16} color="#10b981" fill="#10b981" />
            <Text className="text-xs text-gray-600">1 Present</Text>
            <Feather name="circle" size={16} color="#ef4444" fill="#ef4444" />
            <Text className="text-xs text-gray-600">0 Absent</Text>
            <Feather name="circle" size={16} color="#f59e0b" fill="#f59e0b" />
            <Text className="text-xs text-gray-600">0 Hold Leave</Text>
          </View>
        </View>
      </View>
 
      {/* Active Filter */}
      <View className="px-4 py-2">
        <TouchableOpacity
          onPress={() => setIsActiveFilter(!isActiveFilter)}
          className="flex-row items-center space-x-2"
        >
          <Text className="text-sm text-gray-700">Active</Text>
          <Feather
            name={isActiveFilter ? "check-square" : "square"}
            size={18}
            color={isActiveFilter ? "#3b82f6" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
 
      {/* Add Site Staff Button */}
      <TouchableOpacity className="mx-4 mb-3">
        <Text className="text-blue-500 text-sm font-medium text-right">+ Add Site Staff</Text>
      </TouchableOpacity>
 
      {/* Staff List */}
      <ScrollView className="flex-1 px-4">
        {staffData.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            {/* Avatar */}
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Text className="text-blue-600 font-semibold text-base">AM</Text>
            </View>
 
            {/* Staff Info */}
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">{staff.name}</Text>
              <Text className="text-xs text-gray-500">{staff.role}</Text>
            </View>
 
            {/* Time and Status */}
            <View className="items-end">
              <Text className="text-xs text-gray-500">{staff.time}</Text>
              <Text className="text-xs text-gray-500">{staff.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
 
    
    </SafeAreaView>
  );
};
 
export default AttendanceScreen;
 