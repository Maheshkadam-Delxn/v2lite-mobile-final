// ChangeRequests.jsx
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from '@/components/CustomerBottomNavBar';
import Header from '@/components/Header';

const ChangeRequests = () => {
  /* ---------------------- DATA ---------------------- */
  const pendingRequests = [
    {
      title: 'Add Built-in Storage in Master Bedroom',
      cost: 'QAR 8,500',
      time: 'Time Impact: 3 days',
      requested: 'Requested: Mar 15, 2024',
    },
    {
      title: 'Add Built-in Storage in Master Bedroom',
      cost: 'QAR 8,500',
      time: 'Time Impact: 3 days',
      requested: 'Requested: Mar 15, 2024',
    },
  ];

  const completedRequests = [
    {
      title: 'Add Built-in Storage in Master Bedroom',
      cost: 'QAR 8,500',
      time: 'Time Impact: 3 days',
      requested: 'Requested: Mar 15, 2024',
      status: 'Approved',
      date: 'Approved: Mar 18, 2024',
    },
    {
      title: 'Add Built-in Storage in Master Bedroom',
      cost: 'QAR 8,500',
      time: 'Time Impact: 3 days',
      requested: 'Requested: Mar 15, 2024',
      status: 'Rejected',
      date: 'Rejected: Mar 16, 2024',
    },
    {
      title: 'Add Built-in Storage in Master Bedroom',
      cost: 'QAR 8,500',
      time: 'Time Impact: 3 days',
      requested: 'Requested: Mar 15, 2024',
      status: 'Approved',
      date: 'Approved: Mar 18, 2024',
    },
  ];

  /* ------------------- REUSABLE COMPONENTS ------------------- */
  const StatCard = ({ title, count, border, text }) => (
    <View className={`bg-white ${border} mb-3 rounded-xl p-4`}>
      <Text className="mb-1 text-xs text-gray-600">{title}</Text>
      <Text className={`text-2xl font-bold ${text}`}>{count}</Text>
    </View>
  );

  const PendingItem = ({ item, isLast }) => (
    <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <View className="flex-row items-start">
        {/* Icon + Content */}
        <View className="mr-3 mt-1">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="add" size={14} color="#0066FF" />
          </View>
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-sm font-semibold text-gray-800">{item.title}</Text>
          <Text className="mb-0.5 text-xs text-gray-600">{item.cost}</Text>
          <Text className="mb-1 text-xs text-gray-400">{item.time}</Text>
          <Text className="text-xs text-gray-400">{item.requested}</Text>

          {/* Action Buttons – Enhanced & Polished */}
        <View className="mt-4 flex-row gap-3">
  {/* Approve Button */}
  <TouchableOpacity className="flex-1 items-center justify-center rounded-xl border border-green-200 bg-green-50 py-2">
    <Text className="text-sm font-semibold text-green-700">Approve</Text>
  </TouchableOpacity>

  {/* Request More Info Button */}
  <TouchableOpacity className="flex-1 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 py-2">
    <Text className="text-sm font-semibold text-gray-700">More Info</Text>
  </TouchableOpacity>

  {/* Reject Button */}
  <TouchableOpacity className="flex-1 items-center justify-center rounded-xl border border-red-200 bg-red-50 py-2">
    <Text className="text-sm font-semibold text-red-700">Reject</Text>
  </TouchableOpacity>
</View>
        </View>

        {/* Badge */}
        <View className={`${item.badgeColor} ml-3 rounded-full px-2.5 py-1`}>
          <Text className="text-xs font-medium">{item.badge}</Text>
        </View>
      </View>
    </View>
  );

  const CompletedItem = ({ item, isLast }) => (
    <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <View className="flex-row items-start">
        <View className="mr-3 mt-1">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="add" size={14} color="#0066FF" />
          </View>
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-sm font-semibold text-gray-800">{item.title}</Text>
          <Text className="mb-0.5 text-xs text-gray-600">{item.cost}</Text>
          <Text className="mb-1 text-xs text-gray-400">{item.time}</Text>
          <Text className="text-xs text-gray-400">{item.requested}</Text>
          <Text className="text-xs text-gray-400">{item.date}</Text>
        </View>

        <View
          className={`${
            item.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          } ml-3 rounded-full px-2.5 py-1`}>
          <Text className="text-xs font-medium">{item.status}</Text>
        </View>
      </View>
    </View>
  );

  /* ----------------------- RENDER ----------------------- */
  return (
    <SafeAreaView className="flex-1 bg-white">
     

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ---------- TOP STATS ---------- */}
        <View className="mt-6 px-4">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard
                title="Under Review"
                count="01"
                border="border-l-4 border-l-cyan-500"
                text="text-cyan-600"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Total Cost Impact"
                count="QAR 9,500"
                border="border-l-4 border-l-blue-500"
                text="text-blue-600"
              />
            </View>
          </View>
        </View>

        <View className="mt-3 px-4">
          <StatCard
            title="Approved/Completed"
            count="03"
            border="border-l-4 border-l-green-500"
            text="text-green-600"
          />
        </View>

        {/* ---------- PENDING REVIEW ---------- */}
        <View className="mx-4 mt-6">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">Pending Review</Text>
          <Text className="mx-4 mb-3 text-sm text-gray-600">Change requests awaiting approval</Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {pendingRequests.map((item, idx) => (
              <PendingItem key={idx} item={item} isLast={idx === pendingRequests.length - 1} />
            ))}
          </View>
        </View>

        {/* ---------- ALL CHANGE REQUESTS ---------- */}
        <View className="mx-4 mb-6 mt-6">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">
            All Change Requests
          </Text>
          <Text className="mx-4 mb-3 text-sm text-gray-600">
            Complete history of project modifications
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {completedRequests.map((item, idx) => (
              <CompletedItem key={idx} item={item} isLast={idx === completedRequests.length - 1} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ---------- BOTTOM NAV ---------- */}
      {/* <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View> */}
    </SafeAreaView>
  );
};

export default ChangeRequests;
