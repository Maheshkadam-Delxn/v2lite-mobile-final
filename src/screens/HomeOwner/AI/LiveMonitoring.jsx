import React from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

const LiveMonitoring = () => {
  const activities = [
    {
      id: 1,
      title: 'Electrical wiring started in Master Bedroom',
      team: 'Electrical Team',
      time: '10:45 AM',
    },
    {
      id: 2,
      title: 'Material delivery received - Tiles (200 boxes)',
      team: 'Store Keeper',
      time: '10:30 AM',
    },
    {
      id: 3,
      title: 'Safety inspection completed - All clear',
      team: 'Safety Officer',
      time: '10:15 AM',
    },
    {
      id: 4,
      title: 'Progress photo uploaded - Kitchen flooring',
      team: 'Site Supervisor',
      time: '09:45 AM',
    },
  ]

  const cameras = [
    { id: 1, name: 'Cam 1', isActive: true },
    { id: 2, name: 'Cam 2', isActive: true },
    { id: 3, name: 'Cam 3', isActive: true },
    { id: 4, name: 'Cam 4', isActive: true },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Site Status Header */}
        <View className="bg-white px-4 pt-6 pb-4 flex-row justify-between items-start">
          <View>
            <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
              Site is Active
            </Text>
            <Text className="text-green-500 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
              Last updated · Just now
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center">
            <Feather name="refresh-cw" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Status Cards Grid */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {/* Workers On-site */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Workers On-site
              </Text>
              <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                24
              </Text>
            </View>
          </View>

          {/* Active Tasks */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Active Tasks
              </Text>
              <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                8
              </Text>
            </View>
          </View>

          {/* Today's Progress */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Today's Progress
              </Text>
              <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                2.5%
              </Text>
            </View>
          </View>

          {/* Weather */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Weather
              </Text>
              <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                32°C
              </Text>
            </View>
          </View>
        </View>

        {/* Live Activity Feed */}
        <View className="mx-4 mt-2 mb-3 bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
              Live Activity Feed
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
              <Text className="text-green-500 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Live
              </Text>
            </View>
          </View>

          {/* Activity Items */}
          <View>
            {activities.map((activity, index) => (
              <View
                key={activity.id}
                className={`${index !== activities.length - 1 ? 'mb-4' : ''}`}
              >
                <Text className="text-gray-900 text-sm mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  {activity.title}
                </Text>
                <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                  {activity.team} · {activity.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Site Cameras */}
        <View className="mx-4 mb-3 bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
              Site Cameras
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-red-500 rounded-full mr-1.5" />
              <Text className="text-red-500 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Live
              </Text>
            </View>
          </View>

          {/* Camera Grid */}
          <View className="flex-row flex-wrap -mx-2">
            {cameras.map((camera, index) => (
              <View
                key={camera.id}
                className="w-[50%] px-2 mb-4"
              >
                <TouchableOpacity className="bg-gray-100 rounded-xl aspect-square items-center justify-center relative">
                  {/* Active Indicator */}
                  {camera.isActive && (
                    <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full" />
                  )}
                  
                  {/* Camera Icon */}
                  <Feather name="camera" size={40} color="#6b7280" />
                  
                  {/* Camera Label */}
                  <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded">
                    <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                      {camera.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LiveMonitoring