import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '@/components/Header';

// Sub Screens
import ProjectTimeline from '../HomeOwner/ProjectTimeline';
import BudgetTracker from '../HomeOwner/BudgetTracker';
import QualityChecks from '../HomeOwner/QualityChecks';
import ChangeRequests from '../HomeOwner/ChangeRequests';
import MaterialStatus from '../HomeOwner/MaterialStatus';

const Overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params || {};

  const [activeTab, setActiveTab] = useState('Overview');
  const [milestones, setMilestones] = useState([]);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'ProjectTimeline', label: 'Project Timeline' },
    { id: 'BudgetTracker', label: 'Budget Track' },
    { id: 'QualityChecks', label: 'Quality Checks' },
    { id: 'ChangeRequests', label: 'Change Request' },
    { id: 'MaterialStatus', label: 'Material Status' },
  ];

  const progressData = [
    {
      title: 'Overall Progress',
      value: '68%',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      leftBorder: 'border-l-4 border-l-yellow-500',
    },
    {
      title: 'Budget Utilized',
      value: 'QAR 450K',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      leftBorder: 'border-l-4 border-l-cyan-500',
    },
    {
      title: 'Days Elapsed',
      value: '156',
      textColor: 'text-red-500',
      borderColor: 'border-red-200',
      leftBorder: 'border-l-4 border-l-red-500',
    },
    {
      title: 'Active Workers',
      value: '12',
      textColor: 'text-green-500',
      borderColor: 'border-green-200',
      leftBorder: 'border-l-4 border-l-green-500',
    },
  ];

  /* ------------------ STATUS LABEL ------------------ */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  /* ------------------ FETCH MILESTONES ------------------ */
  const fetchMilestones = async () => {
    if (!project?._id) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(
        `${process.env.BASE_API_URL}/api/milestones/fetch-by-project/${project._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMilestones(result.data);
      } else {
        console.error('Milestone API Error:', result);
      }
    } catch (error) {
      console.error('Milestone Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [project?._id]);

  /* ------------------ TAB CONTENT ------------------ */
  const renderTabContent = () => {
    if (activeTab !== 'Overview') {
      switch (activeTab) {
        case 'ProjectTimeline':
          return <ProjectTimeline project={project} />;
        case 'BudgetTracker':
          return <BudgetTracker project={project} />;
        case 'QualityChecks':
          return <QualityChecks project={project} />;
        case 'ChangeRequests':
          return <ChangeRequests project={project} />;
        case 'MaterialStatus':
          return <MaterialStatus project={project} />;
        default:
          return null;
      }
    }

    return (
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Cards */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {progressData.map((item, index) => (
            <View
              key={index}
              className={`w-[48%] ${
                index % 2 === 0 ? 'mr-[4%]' : ''
              } mb-3`}
            >
              <View
                className={`bg-white rounded-xl border p-4 ${item.borderColor} ${item.leftBorder}`}
              >
                <Text className="mb-1 text-xs text-gray-600">
                  {item.title}
                </Text>
                <Text className={`${item.textColor} text-2xl font-bold`}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Current Phase */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-base font-bold text-gray-800">
            Current Phase : <Text className="font-bold">Interior Finishing</Text>
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Expected completion:{' '}
            <Text className="font-medium text-blue-600">
              March 15, 2026
            </Text>
          </Text>
        </View>

        {/* ------------------ TASKS PROGRESS (ENHANCED) ------------------ */}
<View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
  {/* Header */}
  <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
    <View className="flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
        <Ionicons name="list-outline" size={18} color="#2563EB" />
      </View>
      <Text className="text-base font-bold text-gray-800">
        Tasks Progress
      </Text>
    </View>

    <Text className="text-xs text-gray-400">
      {milestones.length} Tasks
    </Text>
  </View>

  {/* Empty State */}
  {milestones.length === 0 && (
    <View className="py-8 items-center">
      <Ionicons name="clipboard-outline" size={32} color="#CBD5E1" />
      <Text className="mt-2 text-sm text-gray-400">
        No milestones added yet
      </Text>
    </View>
  )}

  {/* Milestone List */}
  {milestones.map((milestone, index) => {
    const progress = milestone.progress || 0;

    const progressColor =
      milestone.status === 'completed'
        ? 'bg-green-500'
        : milestone.status === 'in_progress'
        ? 'bg-blue-500'
        : 'bg-gray-400';

    const statusBadge =
      milestone.status === 'completed'
        ? 'bg-green-100 text-green-700'
        : milestone.status === 'in_progress'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-gray-100 text-gray-500';

    return (
      <View
        key={milestone._id}
        className={`px-4 py-4 ${
          index !== milestones.length - 1
            ? 'border-b border-gray-100'
            : ''
        }`}
      >
        {/* Title + Status */}
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-800 flex-1 pr-3">
            {milestone.title}
          </Text>

          <View className={`px-2 py-0.5 rounded-full ${statusBadge}`}>
            <Text className="text-xs font-semibold">
              {getStatusLabel(milestone.status)}
            </Text>
          </View>
        </View>

        {/* Progress Info */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs text-gray-500">
            Progress
          </Text>
          <Text className="text-xs font-semibold text-gray-700">
            {progress}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
          <View
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* Description */}
        {milestone.description ? (
          <Text className="mt-2 text-xs text-gray-500 leading-4">
            {milestone.description}
          </Text>
        ) : null}
      </View>
    );
  })}
</View>

      </ScrollView>
    );
  };

  const renderTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
      className={`px-4 py-2 mx-1 rounded-full border ${
        activeTab === item.id
          ? 'bg-blue-600 border-blue-600'
          : 'bg-white border-gray-300'
      }`}
    >
      <Text
        className={`text-xs font-semibold ${
          activeTab === item.id ? 'text-white' : 'text-gray-600'
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title={project?.name || 'My Project'}
        showBackButton
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* Tabs */}
      <View className="border-b border-gray-200 py-3 bg-white">
        <FlatList
          data={tabs}
          horizontal
          renderItem={renderTabItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View className="flex-1">{renderTabContent()}</View>
    </SafeAreaView>
  );
};

export default Overview;
