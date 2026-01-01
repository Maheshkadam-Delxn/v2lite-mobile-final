// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import CustomerBottomNavBar from 'components/CustomerBottomNavBar';
// import Header from 'components/Header';
// import { useNavigation } from '@react-navigation/native';

// const Overview = () => {
//   const navigation = useNavigation();
//   const progressData = [
//     {
//       title: 'Overall Progress',
//       value: '68%',
//       bgColor: 'bg-white',
//       textColor: 'text-yellow-600',
//       borderColor: 'border-yellow-200',
//       leftBorder: 'border-l-4 border-l-yellow-500',
//     },
//     {
//       title: 'Budget Utilized',
//       value: 'QAR 450K',
//       bgColor: 'bg-white',
//       textColor: 'text-cyan-600',
//       borderColor: 'border-cyan-200',
//       leftBorder: 'border-l-4 border-l-cyan-500',
//     },
//     {
//       title: 'Days Elapsed',
//       value: '156',
//       bgColor: 'bg-white',
//       textColor: 'text-red-500',
//       borderColor: 'border-red-200',
//       leftBorder: 'border-l-4 border-l-red-500',
//     },
//     {
//       title: 'Active Workers',
//       value: '12',
//       bgColor: 'bg-white',
//       textColor: 'text-green-500',
//       borderColor: 'border-green-200',
//       leftBorder: 'border-l-4 border-l-green-500',
//     },
//   ];

//   const tasks = [
//     {
//       name: 'Electrical Work',
//       progress: 100,
//       status: 'Completed',
//       progressColor: 'bg-blue-500',
//     },
//     {
//       name: 'Plumbing Installation',
//       progress: 75,
//       status: 'In Progress',
//       progressColor: 'bg-blue-500',
//     },
//     {
//       name: 'Flooring & Tiling',
//       progress: 30,
//       status: 'In Progress',
//       progressColor: 'bg-blue-500',
//     },
//     {
//       name: 'Painting Work',
//       progress: 15,
//       status: 'Not Started',
//       progressColor: 'bg-blue-500',
//     },
//   ];

//   const updates = [
//     {
//       icon: 'checkmark-circle',
//       iconColor: 'text-green-500',
//       iconBg: 'bg-green-50',
//       title: 'Electrical inspection passed',
//       time: '2 hours ago',
//     },
//     {
//       icon: 'trending-up',
//       iconColor: 'text-blue-500',
//       iconBg: 'bg-blue-50',
//       title: 'Budget utilization updated',
//       time: '4 hours ago',
//     },
//     {
//       icon: 'alert-circle',
//       iconColor: 'text-yellow-500',
//       iconBg: 'bg-yellow-50',
//       title: 'Material delivery delayed',
//       time: 'Yesterday',
//     },
//   ];

//   const subNavItems = [
//     { name: 'Project Timeline', screen: 'ProjectTimeline' },
//     { name: 'Budget Track', screen: 'BudgetTracker' },
//     { name: 'Quality Checks', screen: 'QualityChecks' },
//     { name: 'Change Request', screen: 'ChangeRequests' },
//     { name: 'Material Status', screen: 'MaterialStatus' },
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <Header
//         title="My Projects"
//         showBackButton={true}
//         rightIcon="filter-outline"
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       {/* Sub Header for Navigation */}
//       {/* Sub Header for Navigation */}
// <View className="bg-white border-b border-gray-200 py-3">
//   <ScrollView 
//     horizontal 
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={{ paddingHorizontal: 16 }}
//   >
//     {subNavItems.map((item, index) => (
//       <TouchableOpacity
//         key={index}
//         className="mr-2 px-4 py-1.5 rounded-md bg-blue-50"
//         onPress={() => navigation.navigate(item.screen)}
//       >
//         <Text className="text-xs font-semibold text-blue-600">{item.name}</Text>
//       </TouchableOpacity>
//     ))}
//   </ScrollView>
// </View>

//       <ScrollView
//         className="flex-1 bg-gray-50"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* Progress Cards */}
//         <View className="flex-row flex-wrap px-4 pt-4">
//           {progressData.map((item, index) => (
//             <View key={index} className={`w-[48%] ${index % 2 === 0 ? 'mr-[4%]' : ''} mb-3`}>
//               <View
//                 className={`${item.bgColor} ${item.borderColor} ${
//                   item.leftBorder || ''
//                 } rounded-xl border p-4`}>
//                 <Text className="mb-1 text-xs text-gray-600">{item.title}</Text>
//                 <Text className={`${item.textColor} text-2xl font-bold`}>{item.value}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Current Phase - Exact match to provided image */}
//         <View className="mx-4 rounded-xl p-4 bg-white mt-4">
//           <Text className="text-base font-bold text-gray-800">
//             Current Phase : <Text className="font-bold">Interior Finishing</Text>
//           </Text>
//           <Text className="mt-1 text-sm text-gray-500">
//             Expected completion: <Text className="font-medium text-blue-600">March 15, 2026</Text>
//           </Text>
//         </View>

//         {/* Tasks Progress - With Blue Badge & Left Border */}
//         <View className="mx-4 mb-4 overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-blue-500 bg-white mt-4">
//           <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
//             <View className="flex-row items-center">
//               <View className="mr-2 rounded-full bg-blue-100 px-3 py-1">
//                 <Text className="text-xs font-bold text-blue-700"> Tasks Progress</Text>
//               </View>
//             </View>
//           </View>

//           {tasks.map((task, index) => (
//             <View
//               key={index}
//               className={`px-4 py-4 ${
//                 index !== tasks.length - 1 ? 'border-b border-gray-100' : ''
//               }`}>
//               <View className="mb-2 flex-row items-center justify-between">
//                 <Text className="text-sm font-medium text-gray-800">{task.name}</Text>
//                 <Text className="text-xs font-medium text-blue-600">{task.status}</Text>
//               </View>
//               <View className="h-2 overflow-hidden rounded-full bg-gray-200">
//                 <View
//                   className={`${task.progressColor} h-full rounded-full`}
//                   style={{ width: `${task.progress}%` }}
//                 />
//               </View>
//             </View>
//           ))}
//         </View>

//         <View className="mx-4 rounded-xl p-4 bg-white mb-4">
//           <Text className="text-base font-bold text-gray-800">Recent Updates</Text>
//         </View>

//         {/* Recent Updates - With Blue Badge & Left Border */}
//         <View className="mx-4 mb-6 overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-blue-500 bg-white">
//           <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
//             <View className="flex-row items-center"></View>
//             <TouchableOpacity>
//               <Text className="text-sm font-medium text-blue-600">View All</Text>
//             </TouchableOpacity>
//           </View>

//           <View className="px-4 pb-4">
//             {updates.map((update, index) => (
//               <View
//                 key={index}
//                 className={`flex-row items-start ${index !== updates.length - 1 ? 'mb-4' : ''}`}>
//                 <View
//                   className={`${update.iconBg} mr-3 h-10 w-10 items-center justify-center rounded-full`}>
//                   <Ionicons
//                     name={update.icon}
//                     size={20}
//                     color={
//                       update.iconColor === 'text-green-500'
//                         ? '#22c55e'
//                         : update.iconColor === 'text-blue-500'
//                           ? '#0066FF'
//                           : update.iconColor === 'text-yellow-500'
//                             ? '#eab308'
//                             : '#8b5cf6'
//                     }
//                   />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="mb-1 text-sm font-medium text-gray-800">{update.title}</Text>
//                   <Text className="text-xs text-gray-500">{update.time}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Nav Bar */}
//       {/* <View className="absolute bottom-0 left-0 right-0">
//         <CustomerBottomNavBar />
//       </View> */}
//     </SafeAreaView>
//   );
// };

// export default Overview;


import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerBottomNavBar from '@/components/CustomerBottomNavBar';
import Header from '@/components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';

// Placeholder imports for the sub-screen components (adjust paths as needed)
import ProjectTimeline from '../HomeOwner/ProjectTimeline'; // Assuming this exists
import BudgetTracker from '../HomeOwner/BudgetTracker'; // Assuming this exists
import QualityChecks from '../HomeOwner/QualityChecks'; // Assuming this exists
import ChangeRequests from '../HomeOwner/ChangeRequests'; // Assuming this exists
import MaterialStatus from '../HomeOwner/MaterialStatus'; // Assuming this exists

const Overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params || {};  // Access passed project data (e.g., project._id, project.name)

  console.log('Project details:', project);  // For debugging

  const [activeTab, setActiveTab] = useState('Overview');

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
      bgColor: 'bg-white',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      leftBorder: 'border-l-4 border-l-yellow-500',
    },
    {
      title: 'Budget Utilized',
      value: 'QAR 450K',
      bgColor: 'bg-white',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      leftBorder: 'border-l-4 border-l-cyan-500',
    },
    {
      title: 'Days Elapsed',
      value: '156',
      bgColor: 'bg-white',
      textColor: 'text-red-500',
      borderColor: 'border-red-200',
      leftBorder: 'border-l-4 border-l-red-500',
    },
    {
      title: 'Active Workers',
      value: '12',
      bgColor: 'bg-white',
      textColor: 'text-green-500',
      borderColor: 'border-green-200',
      leftBorder: 'border-l-4 border-l-green-500',
    },
  ];

  const tasks = [
    {
      name: 'Electrical Work',
      progress: 100,
      status: 'Completed',
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Plumbing Installation',
      progress: 75,
      status: 'In Progress',
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Flooring & Tiling',
      progress: 30,
      status: 'In Progress',
      progressColor: 'bg-blue-500',
    },
    {
      name: 'Painting Work',
      progress: 15,
      status: 'Not Started',
      progressColor: 'bg-blue-500',
    },
  ];

  const updates = [
    {
      icon: 'checkmark-circle',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      title: 'Electrical inspection passed',
      time: '2 hours ago',
    },
    {
      icon: 'trending-up',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      title: 'Budget utilization updated',
      time: '4 hours ago',
    },
    {
      icon: 'alert-circle',
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-50',
      title: 'Material delivery delayed',
      time: 'Yesterday',
    },
  ];

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Progress Cards */}
            <View className="flex-row flex-wrap px-4 pt-4">
              {progressData.map((item, index) => (
                <View key={index} className={`w-[48%] ${index % 2 === 0 ? 'mr-[4%]' : ''} mb-3`}>
                  <View
                    className={`${item.bgColor} ${item.borderColor} ${
                      item.leftBorder || ''
                    } rounded-xl border p-4`}>
                    <Text className="mb-1 text-xs text-gray-600">{item.title}</Text>
                    <Text className={`${item.textColor} text-2xl font-bold`}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Current Phase - Exact match to provided image */}
            <View className="mx-4 rounded-xl p-4 bg-white mt-4">
              <Text className="text-base font-bold text-gray-800">
                Current Phase : <Text className="font-bold">Interior Finishing</Text>
              </Text>
              <Text className="mt-1 text-sm text-gray-500">
                Expected completion: <Text className="font-medium text-blue-600">March 15, 2026</Text>
              </Text>
            </View>

            {/* Tasks Progress - With Blue Badge & Left Border */}
            <View className="mx-4 mb-4 overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-blue-500 bg-white mt-4">
              <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
                <View className="flex-row items-center">
                  <View className="mr-2 rounded-full bg-blue-100 px-3 py-1">
                    <Text className="text-xs font-bold text-blue-700"> Tasks Progress</Text>
                  </View>
                </View>
              </View>

              {tasks.map((task, index) => (
                <View
                  key={index}
                  className={`px-4 py-4 ${
                    index !== tasks.length - 1 ? 'border-b border-gray-100' : ''
                  }`}>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-800">{task.name}</Text>
                    <Text className="text-xs font-medium text-blue-600">{task.status}</Text>
                  </View>
                  <View className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <View
                      className={`${task.progressColor} h-full rounded-full`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View className="mx-4 rounded-xl p-4 bg-white mb-4">
              <Text className="text-base font-bold text-gray-800">Recent Updates</Text>
            </View>

            {/* Recent Updates - With Blue Badge & Left Border */}
            <View className="mx-4 mb-6 overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-blue-500 bg-white">
              <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
                <View className="flex-row items-center"></View>
                <TouchableOpacity>
                  <Text className="text-sm font-medium text-blue-600">View All</Text>
                </TouchableOpacity>
              </View>

              <View className="px-4 pb-4">
                {updates.map((update, index) => (
                  <View
                    key={index}
                    className={`flex-row items-start ${index !== updates.length - 1 ? 'mb-4' : ''}`}>
                    <View
                      className={`${update.iconBg} mr-3 h-10 w-10 items-center justify-center rounded-full`}>
                      <Ionicons
                        name={update.icon}
                        size={20}
                        color={
                          update.iconColor === 'text-green-500'
                            ? '#22c55e'
                            : update.iconColor === 'text-blue-500'
                              ? '#0066FF'
                              : update.iconColor === 'text-yellow-500'
                                ? '#eab308'
                                : '#8b5cf6'
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-sm font-medium text-gray-800">{update.title}</Text>
                      <Text className="text-xs text-gray-500">{update.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        );
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
  };

  const renderMainTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleTabSelect(item.id)}
      className={
        activeTab === item.id
          ? 'px-4 py-2 rounded-full mx-1 border border-blue-600 bg-blue-600'
          : 'px-4 py-2 rounded-full mx-1 border border-gray-300 bg-white'
      }
    >
      <Text
        className={
          activeTab === item.id
            ? 'text-xs font-semibold text-white'
            : 'text-xs font-semibold text-gray-600'
        }
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title={project?.name || "My Projects"}  // Dynamic title example
        showBackButton={true}
        rightIcon="filter-outline"
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* Sub Header Tab Bar - Mirroring ViewDetailsScreen functionality and similar styling */}
      <View className="bg-white border-b border-gray-200 py-3">
        <FlatList
          data={tabs}
          renderItem={renderMainTabItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View className="flex-1">
        {renderTabContent()}
      </View>

      {/* Bottom Nav Bar */}
      {/* <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View> */}
    </SafeAreaView>
  );
};

export default Overview;