import React from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

const UploadAnalysis = () => {
  const designs = [
    {
      id: 1,
      title: 'Floor Plan - Ground Floor.pdf',
      status: 'Analysis complete',
      statusColor: 'text-green-500',
    },
    {
      id: 2,
      title: 'Kitchen Design 3D.jpg',
      status: 'Processing',
      statusColor: 'text-orange-500',
    },
    {
      id: 3,
      title: 'Floor Plan - Ground Floor.pdf',
      status: 'Analysis complete',
      statusColor: 'text-green-500',
    },
    {
      id: 4,
      title: 'Floor Plan - Ground Floor.pdf',
      status: 'Analysis complete',
      statusColor: 'text-green-500',
    },
    {
      id: 5,
      title: 'Floor Plan - Ground Floor.pdf',
      status: 'Analysis complete',
      statusColor: 'text-green-500',
    },
    {
      id: 6,
      title: 'Floor Plan - Ground Floor.pdf',
      status: 'Analysis complete',
      statusColor: 'text-green-500',
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Upload Section */}
        <View className="mx-4 mt-6 mb-6">
          <View className="bg-white rounded-xl border-2 border-dashed border-blue-300 p-6 items-center">
            <Text className="text-gray-900 text-base mb-1 text-center" style={{ fontFamily: 'Urbanist-Bold' }}>
              Upload Designs for AI Analysis
            </Text>
            <Text className="text-gray-600 text-xs mb-4 text-center" style={{ fontFamily: 'Urbanist-Regular' }}>
              Upload floor plans, electrical layouts, 3D renders, or any design documents
            </Text>
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-lg">
              <Text className="text-white text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Select Files
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Analyzed Designs Section */}
        <View className="px-4">
          <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
            Analyzed Designs
          </Text>
          <Text className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Urbanist-Regular' }}>
            Documents used for cost estimation
          </Text>

          {/* Design Items List */}
          {designs.map((design) => (
            <View
              key={design.id}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between"
            >
              {/* Left Content */}
              <View className="flex-1 pr-3">
                <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {design.title}
                </Text>
                <Text className={`${design.statusColor} text-xs`} style={{ fontFamily: 'Urbanist-Regular' }}>
                  {design.status}
                </Text>
              </View>

              {/* Right Eye Button */}
              <TouchableOpacity className="bg-blue-600 w-10 h-10 rounded-lg items-center justify-center">
                <Feather name="eye" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UploadAnalysis