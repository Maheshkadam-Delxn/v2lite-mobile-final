// screens/customer/ProjectTimeline.jsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from '@/components/CustomerBottomNavBar';
import Header from '@/components/Header';

const ProjectTimeline = () => {
  const progressData = [
    {
      title: 'Total Duration',
      value: '201 Days',
      bgColor: 'bg-white',
      textColor: 'text-yellow-600',
      leftBorder: 'border-l-4 border-l-yellow-500',
    },
    {
      title: 'Remaining',
      value: '45 Days',
      bgColor: 'bg-white',
      textColor: 'text-cyan-600',
      leftBorder: 'border-l-4 border-l-cyan-500',
    },
    {
      title: 'Complete',
      value: '68%',
      bgColor: 'bg-white',
      textColor: 'text-red-500',
      leftBorder: 'border-l-4 border-l-red-500',
    },
    {
      title: 'Key Milestone',
      value: '382 x 304',
      bgColor: 'bg-white',
      textColor: 'text-green-500',
      leftBorder: 'border-l-4 border-l-green-500',
    },
  ];

  const phases = [
    {
      name: 'Foundation & Structure',
      date: 'Jan 1, 2024 - Feb 15, 2024',
      status: 'Completed',
      progress: 100,
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Roofing & External Walls',
      date: 'Feb 16, 2024 - Mar 10, 2024',
      status: 'Completed',
      progress: 100,
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Interior Finishing',
      date: 'Mar 11, 2024 - Apr 30, 2024',
      status: 'In Progress',
      progress: 75,
      progressColor: 'bg-blue-500',
    },
  ];

  const milestones = [
    {
      name: 'Building Permit Approved',
      date: 'Dec 15, 2023',
      status: 'Completed',
    },
    {
      name: 'Foundation Complete',
      date: 'Jan 15, 2024',
      status: 'Completed',
    },
    {
      name: 'Electrical & Plumbing',
      date: 'Apr 15, 2024',
      status: 'Scheduled',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
     
      

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Progress Cards Grid - With Left Borders */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {progressData.map((item, index) => (
            <View
              key={index}
              className={`w-[48%] ${index % 2 === 0 ? 'mr-[4%]' : ''} mb-3`}>
              <View
                className={`${item.bgColor} ${item.leftBorder} rounded-xl p-4`}>
                <Text className="text-gray-600 text-xs mb-1">{item.title}</Text>
                <Text className={`${item.textColor} text-2xl font-bold`}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Current Phase */}
        <View className=" mx-4 p-4 rounded-xl">
          <Text className="text-gray-800 text-base font-bold">
            Construction Phase : <Text className="font-bold">Interior Finishing</Text>
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Expected completion: <Text className="text-blue-600 font-medium">March 15, 2024</Text>
          </Text>
        </View>

        {/* Construction Phases - With Progress Bars */}
        <View className="bg-white mx-4 my-3 rounded-xl border-l-4 border-l-blue-500 overflow-hidden">
          {phases.map((phase, index) => (
            <View
              key={index}
              className={`px-4 py-4 ${
                index !== phases.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800 text-sm font-medium">
                  {phase.name}
                </Text>
                <Text className="text-blue-600 text-xs font-medium">
                  {phase.status}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs mb-2">{phase.date}</Text>
              {/* Progress Bar */}
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-500 text-xs">
                  {phase.progress}% complete
                </Text>
                <Text className="text-gray-700 text-xs font-medium">
                  {phase.progress}%
                </Text>
              </View>
              <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <View
                  className={`${phase.progressColor} h-full rounded-full`}
                  style={{ width: `${phase.progress}%` }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Key Milestones Header */}
        <View className=" mx-4 p-4 rounded-xl">
          <Text className="text-gray-800 text-base font-bold">
            Key Milestones
          </Text>
        </View>

        {/* Key Milestones - With Blue Left Border */}
        <View className="bg-white mx-4 mb-6 rounded-xl border-l-4 border-l-blue-500 p-4">
          <Text className="text-gray-800 text-base font-semibold mb-4">
            Key Milestones
          </Text>
          {milestones.map((milestone, index) => (
            <View
              key={index}
              className={`flex-row items-start ${
                index !== milestones.length - 1 ? 'mb-4' : ''
              }`}>
              <View
                className={`${
                  milestone.status === 'Completed' 
                    ? 'bg-green-50' 
                    : milestone.status === 'Scheduled'
                    ? 'bg-yellow-50'
                    : 'bg-gray-50'
                } w-10 h-10 rounded-full items-center justify-center mr-3`}>
                <Ionicons
                  name={
                    milestone.status === 'Completed'
                      ? 'checkmark-circle'
                      : milestone.status === 'Scheduled'
                      ? 'time'
                      : 'alert-circle'
                  }
                  size={20}
                  color={
                    milestone.status === 'Completed'
                      ? '#22c55e'
                      : milestone.status === 'Scheduled'
                      ? '#eab308'
                      : '#6b7280'
                  }
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 text-sm font-medium mb-1">
                  {milestone.name}
                </Text>
                <Text className="text-gray-500 text-xs">{milestone.date}</Text>
              </View>
              {/* Status Badge */}
              <View className={`${
                milestone.status === 'Completed' 
                  ? 'bg-green-100' 
                  : milestone.status === 'Scheduled'
                  ? 'bg-yellow-100'
                  : 'bg-gray-100'
              } px-2 py-1 rounded-full`}>
                <Text className={`${
                  milestone.status === 'Completed' 
                    ? 'text-green-800' 
                    : milestone.status === 'Scheduled'
                    ? 'text-yellow-800'
                    : 'text-gray-800'
                } text-xs font-medium`}>
                  {milestone.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      {/* <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View> */}
    </SafeAreaView>
  );
};

export default ProjectTimeline;