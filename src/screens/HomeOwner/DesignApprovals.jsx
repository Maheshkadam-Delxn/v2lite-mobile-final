// DesignApprovals.jsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from '../../components/CustomerBottomNavBar';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const DesignApprovals = () => {

  const navigation = useNavigation();

  const statusCards = [
    {
      title: 'Pending Review',
      count: '02',
      border: 'border-l-4 border-l-cyan-500',
      text: 'text-cyan-600',
    },
    {
      title: 'Approved',
      count: '18',
      border: 'border-l-4 border-l-green-500',
      text: 'text-green-600',
    },
    {
      title: 'Rejected',
      count: '01',
      border: 'border-l-4 border-l-red-500',
      text: 'text-red-600',
    },
  ];

  const pendingApprovals = [
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Urgent review', bg: 'bg-red-100', txt: 'text-red-600' },
    },
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Urgent review', bg: 'bg-red-100', txt: 'text-red-600' },
    },
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Urgent review', bg: 'bg-red-100', txt: 'text-red-600' },
    },
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Urgent review', bg: 'bg-red-100', txt: 'text-red-600' },
    },
  ];

  const allApprovals = [
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Pending', bg: 'bg-red-100', txt: 'text-red-600' },
      date: 'Received: May 8, 2024',
    },
    {
      title: 'Bathroom Tile Selection',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Final tile selection for master bathroom',
      badge: { label: 'Pending', bg: 'bg-red-100', txt: 'text-red-600' },
      date: 'Received: May 8, 2024',
    },
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Pending', bg: 'bg-red-100', txt: 'text-red-600' },
      date: 'Received: May 8, 2024',
    },
    {
      title: 'Kitchen Layout Revision',
      id: 'DAF RO-002 / DAR RO-003',
      description: 'Updated kitchen layout with island configuration',
      badge: { label: 'Pending', bg: 'bg-red-100', txt: 'text-red-600' },
      date: 'Received: May 8, 2024',
    },
  ];

  /* --------------------------------------------------- */
  /*  RE-USABLE CARD COMPONENTS                         */
  /* --------------------------------------------------- */
  const StatusCard = ({ title, count, border, text }) => (
    <View className={`bg-white ${border} rounded-xl p-4 mb-3`}>
      <Text className="text-xs text-gray-600 mb-1">{title}</Text>
      <Text className={`text-2xl font-bold ${text}`}>{count}</Text>
    </View>
  );

  const ApprovalItem = ({ item, showDate = false }) => (
    <View
      className={`px-4 py-3 ${
        // add bottom border except for the last item
        item.__last ? '' : 'border-b border-gray-100'
        }`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-gray-800 mb-0.5">
            {item.title}
          </Text>
          <Text className="text-xs text-gray-400 mb-0.5">{item.id}</Text>
          {showDate && (
            <Text className="text-xs text-gray-400">{item.date}</Text>
          )}
        </View>

        <View className="flex-row items-center">
          {/* Badge */}
          <View
            className={`${item.badge.bg} px-2.5 py-1 rounded-full mr-2`}>
            <Text className={`text-xs font-medium ${item.badge.txt}`}>
              {item.badge.label}
            </Text>
          </View>

          {/* Eye icon */}
          <TouchableOpacity className="w-7 h-7 bg-blue-100 rounded-full items-center justify-center">
            <Ionicons name="eye-outline" size={16} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mt-2 text-xs text-gray-600 leading-4">
        {item.description}
      </Text>
    </View>
  );

  /* --------------------------------------------------- */
  /*  MAIN RENDER                                       */
  /* --------------------------------------------------- */
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header – same blue curved bottom as in the picture */}
      <Header
        title="Design Approvals"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ---------- 3 STATUS CARDS (vertical) ---------- */}
        <View className="px-4 pt-4">
          {statusCards.map((c, i) => (
            <StatusCard
              key={i}
              title={c.title}
              count={c.count}
              border={c.border}
              text={c.text}
            />
          ))}
        </View>

        {/* ---------- PENDING APPROVALS SECTION ---------- */}
        <View className="mx-4 mt-6">
          <Text className="mx-4 mb-3 text-base font-bold text-gray-800">
            Pending Approvals
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {pendingApprovals.map((item, idx) => (
              <ApprovalItem
                key={idx}
                item={{
                  ...item,
                  __last: idx === pendingApprovals.length - 1,
                }}
              />
            ))}
          </View>
        </View>

        {/* ---------- ALL DESIGN APPROVALS SECTION ---------- */}
        <View className="mx-4 mt-6 mb-6">
          <Text className="mx-4 mb-3 text-base font-bold text-gray-800">
            All Design Approvals
          </Text>

          <View className="overflow-hidden rounded-xl border-l-4 border-l-blue-500 bg-white">
            {allApprovals.map((item, idx) => (
              <ApprovalItem
                key={idx}
                item={{
                  ...item,
                  __last: idx === allApprovals.length - 1,
                }}
                showDate
              />
            ))}
          </View>
        </View>
        <TouchableOpacity
          className="mx-4 mb-4 rounded-xl bg-blue-600 px-6 py-4 shadow-lg"
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('QualityChecks');
          }}>
          <Text className="text-center text-base font-semibold text-white">Quality Checks</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default DesignApprovals;