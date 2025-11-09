// screens/customer/BudgetTracker.jsx
import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from 'components/Project/CustomerBottomNavBar';
import Header from 'components/Header';

const BudgetTracker = () => {
  const topCards = [
    {
      title: 'Total Budget',
      value: 'QAR 650,000',
      borderColor: 'border-l-4 border-l-yellow-500',
      valueColor: 'text-yellow-600',
    },
    {
      title: 'Total Spent',
      value: 'QAR 485,000',
      borderColor: 'border-l-4 border-l-cyan-500',
      valueColor: 'text-cyan-600',
    },
    {
      title: 'Remaining',
      value: 'QAR 165,000',
      borderColor: 'border-l-4 border-l-red-500',
      valueColor: 'text-red-500',
    },
  ];

  const categories = [
    {
      name: 'Foundation & Structure',
      budget: 'QAR 150,000',
      spent: 'QAR 120,000',
      percent: 80,
    },
    {
      name: 'Roofing & External Walls',
      budget: 'QAR 100,000',
      spent: 'QAR 85,000',
      percent: 85,
    },
    {
      name: 'Interior Finishing',
      budget: 'QAR 200,000',
      spent: 'QAR 150,000',
      percent: 75,
    },
    {
      name: 'Electrical & Plumbing',
      budget: 'QAR 150,000',
      spent: 'QAR 130,000',
      percent: 87,
    },
  ];

  const recentExpenses = [
    { name: 'Flooring materials', date: 'Apr 20, 2024', amount: 'QAR 15,000' },
    { name: 'Roofing materials', date: 'Apr 18, 2024', amount: 'QAR 12,000' },
    { name: 'Plumbing supplies', date: 'Apr 15, 2024', amount: 'QAR 8,000' },
    { name: 'Electrical fittings', date: 'Apr 12, 2024', amount: 'QAR 10,000' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title="Budget Tracker"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top 3 Budget Cards - Updated to vertical layout */}
        <View className="px-4 pt-4">
          {topCards.map((card, i) => (
            <View key={i} className="mb-3">
              <View
                className={`bg-white ${card.borderColor} rounded-xl p-4`}>
                <Text className="mb-1 text-xs text-gray-600">{card.title}</Text>
                <Text className={`${card.valueColor} text-2xl font-bold`}>{card.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Overall Budget Progress - Updated Design */}
        <View className="mx-4 mt-6">
          <View className="mb-3 flex-row items-center mx-4">
            <Text className="text-base font-semibold text-gray-800">Overall Budget Progress</Text>
          </View>

          {/* Card with Left Blue Border */}
          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white p-4">
            {/* Progress Bar */}
            <View className="flex-row items-center mb-4">
              <Text className="text-sm text-gray-600">75%</Text>
              <View className="mx-2 h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <View className="h-full bg-blue-600" style={{ width: '75%' }} />
              </View>
              <Text className="text-sm text-gray-600">Utilized</Text>
            </View>

            {/* Budget Breakdown */}
            <View className="flex-row justify-between">
              {/* Total Budget */}
              <View className="items-center">
                <Text className="text-gray-600 text-xs mb-1">Total Budget</Text>
                <Text className="text-gray-800 text-lg font-bold">QAR 650.000</Text>
              </View>

              {/* Total Spent */}
              <View className="items-center">
                <Text className="text-gray-600 text-xs mb-1">Total Spent</Text>
                <Text className="text-gray-800 text-lg font-bold">QAR 485.000</Text>
              </View>

              {/* Remaining */}
              <View className="items-center">
                <Text className="text-gray-600 text-xs mb-1">Remaining</Text>
                <Text className="text-gray-800 text-lg font-bold">QAR 165.000</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budget by Category - With Blue Left Border */}
        <View className="mx-4 mt-6">
          <View className="mb-3 flex-row items-center">
            <Text className="mx-4 text-base font-bold text-gray-800">Budget by Category</Text>
          </View>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {categories.map((cat, idx) => (
              <View
                key={idx}
                className={`px-4 py-3 ${
                  idx !== categories.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                {/* Name + Spent */}
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="flex-1 pr-2 text-sm font-medium text-gray-800">{cat.name}</Text>
                  <Text className="text-sm font-medium text-blue-600">{cat.spent}</Text>
                </View>

                {/* Mini Progress Bar */}
                <View className="flex-row items-center">
                  <Text className="w-10 text-xs text-gray-500">{cat.percent}%</Text>
                  <View className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <View className="h-full bg-blue-600" style={{ width: `${cat.percent}%` }} />
                  </View>
                  <Text className="text-xs text-gray-500">{cat.budget}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Expenses - With Blue Left Border */}
        <View className="mx-4 mb-6 mt-6">
          <View className="mb-3 flex-row items-center">
            <Text className="mx-4 text-base font-bold text-gray-800">Recent Expenses</Text>
          </View>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {recentExpenses.map((exp, i) => (
              <View
                key={i}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  i !== recentExpenses.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                <View>
                  <Text className="text-sm font-medium text-gray-800">{exp.name}</Text>
                  <Text className="text-xs text-gray-500">{exp.date}</Text>
                </View>
                <Text className="text-sm font-medium text-blue-600">{exp.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default BudgetTracker;