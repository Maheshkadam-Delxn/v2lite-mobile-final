// MaterialStatus.jsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from 'components/CustomerBottomNavBar';
import Header from 'components/Header';

const MaterialStatus = () => {
  /* ---------------------- DATA ---------------------- */
 const upcomingDeliveries = [
  {
    date: 'Apr 25, 2024',
    items: ['LID Light Intrum'],
    status: 'Scheduled',
  },
  {
    date: 'Apr 25, 2024',
    items: ['LID Light Intrum'],
    status: 'Scheduled',
  },
  {
    date: 'Apr 25, 2024',
    items: ['LID Light Intrum'],
    status: 'Scheduled',
  },
];

 const inventory = [
  {
    name: 'Cement River Title',
    order: 'Owner No. 1000',
    submitted: 'Submitted Apr 1, 2024',
    submittedEnd: 'Submonel, April 30, 2024',
    cost: 'Cents (OAR 5,000)',
    status: 'Delivered',
  },
  {
    name: 'Cement River Title',
    order: 'Owner No. 1000',
    submitted: 'Submitted Apr 1, 2024',
    submittedEnd: 'Submonel, April 30, 2024',
    cost: 'Cents (OAR 5,000)',
    status: 'Delivered',
  },
  {
    name: 'Cement River Title',
    order: 'Owner No. 1000',
    submitted: 'Submitted Apr 1, 2024',
    submittedEnd: 'Submonel, April 30, 2024',
    cost: 'Cents (OAR 5,000)',
    status: 'Delivered',
  },
  {
    name: 'Cement River Title',
    order: 'Owner No. 1000',
    submitted: 'Submitted Apr 1, 2024',
    submittedEnd: 'Submonel, April 30, 2024',
    cost: 'Cents (OAR 5,000)',
    status: 'Delivered',
  },
];

  /* ------------------- REUSABLE COMPONENTS ------------------- */
  const StatCard = ({ title, count, subtitle, border, text }) => (
    <View className={`bg-white ${border} rounded-xl p-4 mb-3`}>
      <Text className="text-xs text-gray-600 mb-1">{title}</Text>
      <Text className={`text-2xl font-bold ${text}`}>{count}</Text>
      {subtitle && (
        <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
  );

const DeliveryItem = ({ item, isLast }) => (
  <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
    <View className="flex-row items-start justify-between">
      <View className="flex-row items-start flex-1">
        <View className="mr-3 mt-1">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="calendar-outline" size={14} color="#0066FF" />
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800 mb-1">
            {item.date}
          </Text>
          {item.items.map((i, idx) => (
            <Text key={idx} className="text-xs text-gray-600">
              {i}
            </Text>
          ))}
        </View>
      </View>
      
      {/* Status Badge - positioned at opposite end */}
      {item.status && (
        <View className="bg-blue-100 rounded-full px-3 py-1 ml-2 self-start">
          <Text className="text-xs font-medium text-blue-600">{item.status}</Text>
        </View>
      )}
    </View>
  </View>
);

 const InventoryItem = ({ item, isLast }) => (
  <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
    <View className="flex-row items-start justify-between">
      <View className="flex-row items-start flex-1">
        <View className="mr-3 mt-1">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="cube-outline" size={14} color="#0066FF" />
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800 mb-1">
            {item.name}
          </Text>
          <Text className="text-xs text-gray-400 mb-0.5">{item.order}</Text>
          <View className="flex-row items-center flex-wrap">
            <Text className="text-xs text-gray-600 mr-2">{item.submitted}</Text>
            <Text className="text-xs text-gray-600 mr-2">|</Text>
            <Text className="text-xs text-gray-600 mr-2">{item.submittedEnd}</Text>
            <Text className="text-xs text-gray-600 mr-2">|</Text>
            <Text className="text-xs text-gray-600">{item.cost}</Text>
          </View>
        </View>
      </View>
      
      {/* Status Badge - positioned at opposite end */}
      {item.status && (
        <View className="bg-blue-100 rounded-full px-3 py-1 ml-2 self-start">
          <Text className="text-xs font-medium text-blue-600">{item.status}</Text>
        </View>
      )}
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
                title="Total Items"
                count="06"
                subtitle="Dailmond"
                border="border-l-4 border-l-cyan-500"
                text="text-cyan-600"
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Delivered"
                count="03"
                border="border-l-4 border-l-red-500"
                text="text-red-600"
              />
            </View>
          </View>
        </View>

        {/* ---------- MATERIALS RECEIVED ---------- */}
        <View className="mx-4 mt-2">
          <View className="bg-white rounded-xl p-4 border-l-4 border-l-green-500">
            <Text className="text-xs text-gray-600">
              Materials Received of OAR 36,200 total
            </Text>
            <Text className="text-xl font-bold text-green-500 mt-1">
              OAR 14,200
            </Text>
          </View>
        </View>

         <View className="mx-4 mt-4 mb-2">
          <View className="bg-white rounded-xl p-4 border-l-4 border-l-blue-500">
            <Text className="text-xs text-gray-600">
              Materials Received of OAR 36,200 total
            </Text>
            <Text className="text-xl font-bold text-gray-800 mt-1">
              OAR 14,200
            </Text>

            {/* Progress Bar */}
            <View className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-blue-500"
                style={{ width: '39%' }} 
              />
            </View>
          </View>
        </View>

        {/* ---------- UPCOMING DELIVERIES ---------- */}
        <View className="mx-4 mt-4">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">
            Upcoming Deliveries
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {upcomingDeliveries.map((item, idx) => (
              <DeliveryItem
                key={idx}
                item={item}
                isLast={idx === upcomingDeliveries.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ---------- MATERIAL INVENTORY ---------- */}
        <View className="mx-4 mt-6 mb-6">
          <Text className="mx-4 mb-3 text-xl font-bold text-gray-800">
            Material Inventory
          </Text>
          <Text className="mx-4 mb-3 text-base text-gray-600">
            Campbine list of project materials
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {inventory.map((item, idx) => (
              <InventoryItem
                key={idx}
                item={item}
                isLast={idx === inventory.length - 1}
              />
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

export default MaterialStatus;