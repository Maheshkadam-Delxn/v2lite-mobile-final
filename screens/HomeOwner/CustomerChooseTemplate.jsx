// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import CustomerBottomNavBar from 'components/Project/CustomerBottomNavBar';
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
//         <View className=" mx-4 rounded-xl p-4">
//           <Text className="text-base font-bold text-gray-800">
//             Current Phase : <Text className="font-bold">Interior Finishing</Text>
//           </Text>
//           <Text className="mt-1 text-sm text-gray-500">
//             Expected completion: <Text className="font-medium text-blue-600">March 15, 2024</Text>
//           </Text>
//         </View>

//         {/* Tasks Progress - With Blue Badge & Left Border */}
//         <View className="mx-4 mb-4 overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-blue-500 bg-white">
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

//         <View className=" mx-4 rounded-xl p-4">
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
//                           ? '#3b82f6'
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

//         {/* Construction Phase Button */}
//         <View className="mx-4 mb-6">
//           <TouchableOpacity
//             className="rounded-xl bg-blue-600 px-6 py-4 shadow-md"
//             activeOpacity={0.8}
//             onPress={() => {
//               navigation.navigate('ProjectTimeline');
//             }}>
//             <Text className="text-center text-base font-semibold text-white">
//               Construction Phase
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Bottom Nav Bar */}
//       <View className="absolute bottom-0 left-0 right-0">
//         <CustomerBottomNavBar />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Overview;


import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'

const CustomerChooseTemplate = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(1)

  const templates = [
    {
      id: 1,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 3,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    }
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header 
          title="Choose Template" 
          showBackButton={true}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 48
            }}>
              <Feather name="search" size={20} color="#999999" />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000'
                }}
                placeholder="Search..."
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Info Text */}
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 12
          }}>
            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#666666',
              textAlign: 'center',
              lineHeight: 20
            }}>
              Select an admin-created template to start{'\n'}customizing your proposal easily
            </Text>
          </View>

          {/* Templates Section */}
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Templates
            </Text>

            {/* Template Cards */}
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => setSelectedTemplate(template.id)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: '#0066FF'
                }}
              >
                {/* Top Row - Image, Title, Radio */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  {/* Template Preview Image */}
                  <View style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}>
                    <Image
                      source={{ uri: template.image }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Template Title */}
                  <View style={{
                    flex: 1,
                    marginLeft: 12,
                    marginRight: 8
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 15,
                      color: '#000000',
                      lineHeight: 22
                    }}>
                      {template.title}
                    </Text>
                  </View>

                  {/* Radio Button */}
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#0066FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2
                  }}>
                    {selectedTemplate === template.id && (
                      <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#0066FF'
                      }} />
                    )}
                  </View>
                </View>

                {/* Description - Full Width Below */}
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  lineHeight: 20
                }}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Create Proposal Button - Fixed at Bottom */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#F5F5F5',
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0'
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateCustomerProposal')}
            style={{
              backgroundColor: '#0066FF',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 16,
              color: 'white'
            }}>
              Create Proposal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CustomerChooseTemplate
