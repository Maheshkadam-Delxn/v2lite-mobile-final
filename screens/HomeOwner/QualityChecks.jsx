// DesignApprovals.jsx  (renamed to QualityChecks – just change the file name if you want)
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from 'components/CustomerBottomNavBar';
import Header from 'components/Header';

const QualityChecks = () => {
  /* ---------------------- DATA ---------------------- */
  const upcomingInspections = [
    {
      title: 'Fire Safety Systems',
      subtitle: 'Interior Finishing',
      date: 'Inspection Date: 22 Mar, 2024',
    },
    {
      title: 'Fire Safety Systems',
      subtitle: 'Interior Finishing',
      date: 'Inspection Date: 22 Mar, 2024',
    },
    {
      title: 'Fire Safety Systems',
      subtitle: 'Interior Finishing',
      date: 'Inspection Date: 22 Mar, 2024',
    },
    {
      title: 'Fire Safety Systems',
      subtitle: 'Interior Finishing',
      date: 'Inspection Date: 22 Mar, 2024',
    },
  ];

  const qualityIssues = [
    {
      title: 'Minor plumbing leak in guest bathroom',
      date: 'Reported: 18 Mar, 2024',
      resolved: 'Resolved',
    },
    {
      title: 'Minor plumbing leak in guest bathroom',
      date: 'Reported: 18 Mar, 2024',
      resolved: 'Resolved',
    },
    {
      title: 'Minor plumbing leak in guest bathroom',
      date: 'Reported: 18 Mar, 2024',
      resolved: 'Resolved',
    },
    {
      title: 'Minor plumbing leak in guest bathroom',
      date: 'Reported: 18 Mar, 2024',
      resolved: 'Resolved',
    },
  ];

  /* ------------------- REUSABLE COMPONENTS ------------------- */
  const SmallStatCard = ({ title, count, border, text }) => (
    <View className={`bg-white ${border} mb-3 rounded-xl p-3`}>
      <Text className="mb-1 text-xs text-gray-600">{title}</Text>
      <Text className={`text-2xl font-bold ${text}`}>{count}</Text>
    </View>
  );

  const InspectionItem = ({ item, isLast }) => (
    <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="mb-0.5 text-sm font-semibold text-gray-800">{item.title}</Text>
          <Text className="text-xs text-gray-400">{item.subtitle}</Text>
          <Text className="mt-1 text-xs text-gray-400">{item.date}</Text>
        </View>

        <View className="rounded-full bg-blue-100 px-2.5 py-1">
          <Text className="text-xs font-medium text-blue-600">Scheduled</Text>
        </View>
      </View>
    </View>
  );

  const IssueItem = ({ item, isLast }) => (
    <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="mb-1 text-sm font-medium text-gray-800">{item.title}</Text>
          <Text className="text-xs text-gray-400">{item.date}</Text>
        </View>

        <View className="rounded-full bg-green-100 px-2.5 py-1">
          <Text className="text-xs font-medium text-green-600">{item.resolved}</Text>
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
        {/* ---------- QUALITY SCORE & INSPECTION PASSED ---------- */}
        <View className="mt-5 px-4">
          <View className="flex-row justify-between">
            {/* Quality Score */}
            <View className="w-[48%] rounded-xl border-l-4 border-l-blue-500 bg-white p-4">
              <Text className="mb-1 text-xs text-gray-600">Quality Score</Text>
              <Text className="text-2xl font-bold text-gray-800">93%</Text>
            </View>

            {/* Inspection Passed */}
            <View className="w-[48%] rounded-xl border-l-4 border-l-yellow-500 bg-white p-4">
              <Text className="mb-1 text-xs text-gray-600">Inspection Passed</Text>
              <Text className="text-2xl font-bold text-gray-800">04</Text>
            </View>
          </View>
        </View>

        {/* ---------- CRITICAL & MINOR ISSUES ---------- */}
        <View className="mt-5 px-4">
          <View className="flex-row justify-between">
            {/* Critical Issues */}
            <View className="w-[48%] rounded-xl border-l-4 border-l-red-500 bg-white p-4">
              <Text className="mb-1 text-xs text-gray-600">Critical Issues</Text>
              <Text className="text-2xl font-bold text-red-600">0</Text>
            </View>

            {/* Minor Issues */}
            <View className="w-[48%] rounded-xl border-l-4 border-l-teal-500 bg-white p-4">
              <Text className="mb-1 text-xs text-gray-600">Minor Issues</Text>
              <Text className="text-2xl font-bold text-teal-600">03</Text>
            </View>
          </View>
        </View>

        {/* ---------- UPCOMING INSPECTIONS ---------- */}
        <View className="mx-4 mt-6">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">Upcoming Inspections</Text>

          <Text className="font-sm mx-4 mb-3 text-base text-gray-800">
            Schedule quality checks and inspections
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {upcomingInspections.map((item, idx) => (
              <InspectionItem
                key={idx}
                item={item}
                isLast={idx === upcomingInspections.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ---------- QUALITY ISSUES ---------- */}
        <View className="mx-4 mb-6 mt-6">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">Quality Issues</Text>

          <Text className="font-sm mx-4 mb-3 text-base text-gray-800">
            Tracked issues and their relation status
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {qualityIssues.map((item, idx) => (
              <IssueItem key={idx} item={item} isLast={idx === qualityIssues.length - 1} />
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

export default QualityChecks;