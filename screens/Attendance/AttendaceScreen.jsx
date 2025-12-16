import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AttendanceScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('daily'); // daily, weekly, monthly

  const attendanceData = [
    {
      id: '1',
      name: 'Fatima Ahmed',
      role: 'Site Engineer',
      checkIn: '08:00 AM',
      checkOut: '05:00 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '2',
      name: 'Mohammed Saleem',
      role: 'Foreman',
      checkIn: '07:30 AM',
      checkOut: '04:30 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '3',
      name: 'Fatima Ahmed',
      role: 'Architect',
      checkIn: '09:00 AM',
      checkOut: '03:00 PM',
      status: 'present',
      hours: '6h',
    },
    {
      id: '4',
      name: 'Hassan Abdelaal',
      role: 'Labor',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      hours: '0h',
    },
    {
      id: '5',
      name: 'Noora Ali',
      role: 'Safety Officer',
      checkIn: '08:15 AM',
      checkOut: '05:15 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '6',
      name: 'Khalid Ahmed',
      role: 'Project Manager',
      checkIn: '08:30 AM',
      checkOut: '05:30 PM',
      status: 'present',
      hours: '9h',
    },
    {
      id: '7',
      name: 'Maryam Samad',
      role: 'Quality Inspector',
      checkIn: '08:00 AM',
      checkOut: '-',
      status: 'late',
      hours: '4h',
    },
  ];

  const stats = {
    total: 15,
    present: 12,
    absent: 2,
    late: 1,
  };

  const AttendanceItem = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <View 
          style={{ backgroundColor: '#0066FF' }}
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
        >
          <Text className="text-white font-semibold text-base">
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900 mb-1">{item.name}</Text>
          <Text className="text-sm text-slate-500">{item.role}</Text>
        </View>
        <View 
          style={{
            backgroundColor: 
              item.status === 'present' ? '#10b98115' : 
              item.status === 'absent' ? '#ef444415' : '#f59e0b15'
          }}
          className="px-3 py-1.5 rounded-full"
        >
          <Text 
            style={{
              color: 
                item.status === 'present' ? '#10b981' : 
                item.status === 'absent' ? '#ef4444' : '#f59e0b'
            }}
            className="text-xs font-semibold capitalize"
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-3" style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
        <View className="flex-1">
          <Text className="text-xs text-slate-500 mb-1">Check In</Text>
          <Text className="text-sm font-semibold text-slate-900">{item.checkIn}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-xs text-slate-500 mb-1">Check Out</Text>
          <Text className="text-sm font-semibold text-slate-900">{item.checkOut}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-xs text-slate-500 mb-1">Total Hours</Text>
          <Text style={{ color: '#0066FF' }} className="text-sm font-bold">{item.hours}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar backgroundColor="#0066FF" barStyle="light-content" />
      

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View className="bg-white rounded-2xl p-5 mb-5">
          <Text className="text-base font-bold text-slate-900 mb-4">Today's Overview</Text>
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</Text>
              <Text className="text-xs text-slate-500">Total</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>{stats.present}</Text>
              <Text className="text-xs text-slate-500">Present</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold mb-1" style={{ color: '#ef4444' }}>{stats.absent}</Text>
              <Text className="text-xs text-slate-500">Absent</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="flex-1 items-center">
              <Text className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>{stats.late}</Text>
              <Text className="text-xs text-slate-500">Late</Text>
            </View>
          </View>
        </View>

        {/* Date Selector */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50">
              <Ionicons name="chevron-back" size={20} color="#0066FF" />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-slate-900">March 25, 2024</Text>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50">
              <Ionicons name="chevron-forward" size={20} color="#0066FF" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* View Selector */}
        <View className="bg-white rounded-2xl p-1.5 mb-5 flex-row">
          {['daily', 'weekly', 'monthly'].map((viewType) => (
            <TouchableOpacity
              key={viewType}
              style={view === viewType ? { backgroundColor: '#0066FF' } : {}}
              className={`flex-1 py-3 rounded-xl items-center`}
              onPress={() => setView(viewType)}
            >
              <Text 
                className={`text-sm font-semibold ${view === viewType ? 'text-white' : 'text-slate-500'}`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attendance List */}
        <View className="mb-5">
          <Text className="text-base font-bold text-slate-900 mb-3">Attendance Records</Text>
          {attendanceData.map((item) => (
            <AttendanceItem key={item.id} item={item} />
          ))}
        </View>

        <View className="h-5" />
      </ScrollView>

      {/* Action Buttons */}
      {/* <View className="flex-row p-4 bg-white" style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#0066FF' }}
          className="flex-2 flex-row rounded-2xl py-4 items-center justify-center mr-3"
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-sm ml-2">Export Report</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 flex-row rounded-2xl py-4 items-center justify-center bg-slate-50"
        >
          <Ionicons name="add" size={20} color="#0066FF" />
          <Text style={{ color: '#0066FF' }} className="font-semibold text-sm ml-2">Add</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default AttendanceScreen;