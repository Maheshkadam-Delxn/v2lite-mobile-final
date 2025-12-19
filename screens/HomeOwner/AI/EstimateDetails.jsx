import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

const EstimateDetails = () => {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const costSections = [
    {
      id: 1,
      category: 'Civil Work',
      items: '5 Items',
      total: '70,078 QAR',
      variance: '+2.5% vs market',
      varianceColor: 'text-red-500',
      subItems: [
        { name: 'Foundation Work', details: '120 sqft • 450 QAR /sqft', cost: '54,000 QAR' },
        { name: 'RCC Columns', details: '24 nos • 8,500 QAR /no', cost: '204,000 QAR' },
        { name: 'Beam & Slab Work', details: '1800 sqft • 85 QAR /sqft', cost: '153,000 QAR' },
        { name: 'Brick Masonry', details: '4500 sqft • 65 QAR /sqft', cost: '292,500 QAR' },
        { name: 'Plastering', details: '6000 sqft • 35 QAR /sqft', cost: '210,000 QAR' },
      ]
    },
    {
      id: 2,
      category: 'Civil Work',
      items: '5 Items',
      total: '70,078 QAR',
      variance: '+2.9% vs market',
      varianceColor: 'text-red-500',
      subItems: [
        { name: 'Foundation Work', details: '120 sqft • 450 QAR /sqft', cost: '54,000 QAR' },
        { name: 'RCC Columns', details: '24 nos • 8,500 QAR /no', cost: '204,000 QAR' },
        { name: 'Beam & Slab Work', details: '1800 sqft • 85 QAR /sqft', cost: '153,000 QAR' },
        { name: 'Brick Masonry', details: '4500 sqft • 65 QAR /sqft', cost: '292,500 QAR' },
        { name: 'Plastering', details: '6000 sqft • 35 QAR /sqft', cost: '210,000 QAR' },
      ]
    },
    {
      id: 3,
      category: 'Civil Work',
      items: '5 Items',
      total: '70,078 QAR',
      variance: '+2.9% vs market',
      varianceColor: 'text-red-500',
      subItems: [
        { name: 'Foundation Work', details: '120 sqft • 450 QAR /sqft', cost: '54,000 QAR' },
        { name: 'RCC Columns', details: '24 nos • 8,500 QAR /no', cost: '204,000 QAR' },
        { name: 'Beam & Slab Work', details: '1800 sqft • 85 QAR /sqft', cost: '153,000 QAR' },
        { name: 'Brick Masonry', details: '4500 sqft • 65 QAR /sqft', cost: '292,500 QAR' },
        { name: 'Plastering', details: '6000 sqft • 35 QAR /sqft', cost: '210,000 QAR' },
      ]
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Document Header */}
        <View className="bg-white px-4 pt-6 pb-4">
          <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
            Floor Plan - Ground Floor.pdf
          </Text>
          <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
            Architectural Floor Plan · Analyzed on 1/15/2025
          </Text>
        </View>

        {/* Cost Overview Cards */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {/* Total Cost */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Total Cost
              </Text>
              <Text className="text-blue-600 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
                114,134.91 QAR
              </Text>
            </View>
          </View>

          {/* Labor */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Labor
              </Text>
              <Text className="text-blue-600 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
                34,238.48 QAR
              </Text>
            </View>
          </View>

          {/* Materials */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Materials
              </Text>
              <Text className="text-blue-600 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
                68,477 QAR
              </Text>
            </View>
          </View>

          {/* Confidence */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Confidence
              </Text>
              <Text className="text-blue-600 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
                92%
              </Text>
            </View>
          </View>
        </View>

        {/* Detailed Cost Breakdown */}
        <View className="px-4 pt-2 pb-3">
          <Text className="text-gray-900 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
            Detailed Cost Breakdown
          </Text>
        </View>

        {/* Expandable Sections */}
        <View className="px-4">
          {costSections.map((section) => (
            <View key={section.id} className="mb-3">
              {/* Section Header */}
              <TouchableOpacity
                onPress={() => toggleSection(section.id)}
                className="bg-white rounded-xl p-4 flex-row items-center"
              >
                {/* Icon */}
                <View className="bg-blue-50 w-10 h-10 rounded-lg items-center justify-center mr-3">
                  <Feather name="file-text" size={20} color="#0066FF" />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-gray-900 text-base mb-0.5" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    {section.category}
                  </Text>
                  <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                    {section.items}
                  </Text>
                </View>

                {/* Cost and Arrow */}
                <View className="items-end">
                  <Text className="text-gray-900 text-base mb-0.5" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {section.total}
                  </Text>
                  <Text className={`${section.varianceColor} text-xs`} style={{ fontFamily: 'Urbanist-Regular' }}>
                    {section.variance}
                  </Text>
                </View>

                {/* Expand/Collapse Icon */}
                <View className="ml-3">
                  <Feather 
                    name={expandedSections[section.id] ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded Content */}
              {expandedSections[section.id] && section.subItems.length > 0 && (
                <View className="bg-gray-50 rounded-xl mt-2 p-4">
                  {section.subItems.map((item, index) => (
                    <View
                      key={index}
                      className={`flex-row justify-between items-start ${
                        index !== section.subItems.length - 1 ? 'mb-4' : ''
                      }`}
                    >
                      <View className="flex-1 pr-4">
                        <Text className="text-gray-900 text-sm mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                          {item.name}
                        </Text>
                        <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                          {item.details}
                        </Text>
                      </View>
                      <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.cost}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Cost Summary */}
        <View className="mx-4 mt-2 mb-3 bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
          <Text className="text-gray-900 text-lg mb-4" style={{ fontFamily: 'Urbanist-Bold' }}>
            Cost Summary
          </Text>

          {/* Summary Items */}
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
                Material Cost
              </Text>
              <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                1,710,000 QAR
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
                Labor Cost
              </Text>
              <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                855,000 QAR
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
                Overhead (5%)
              </Text>
              <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                142,500 QAR
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
                Contingency (5%)
              </Text>
              <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                142,500 QAR
              </Text>
            </View>

            {/* Divider */}
            <View className="border-t border-gray-200 my-2" />

            {/* Grand Total */}
            <View className="flex-row justify-between items-center bg-gray-50 px-3 py-3 rounded-lg">
              <Text className="text-gray-900 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
                Grand Total
              </Text>
              <Text className="text-gray-900 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
                2,850,000 QAR
              </Text>
            </View>
          </View>
        </View>

        {/* Notes & Assumptions */}
        <View className="mx-4 mb-3 bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
          <Text className="text-gray-900 text-lg mb-3" style={{ fontFamily: 'Urbanist-Bold' }}>
            Notes & Assumptions
          </Text>

          <View className="space-y-2">
            <View className="flex-row">
              <Text className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'Urbanist-Regular' }}>•</Text>
              <Text className="text-gray-600 text-xs flex-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Prices are based on Qatar market rates as of Q1 2025
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'Urbanist-Regular' }}>•</Text>
              <Text className="text-gray-600 text-xs flex-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Steel prices may vary based on market fluctuations (±5%)
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'Urbanist-Regular' }}>•</Text>
              <Text className="text-gray-600 text-xs flex-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Marble delivery requires advance booking of 15 days
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'Urbanist-Regular' }}>•</Text>
              <Text className="text-gray-600 text-xs flex-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Labor rates include accommodation and basic amenities
              </Text>
            </View>

            <View className="flex-row">
              <Text className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'Urbanist-Regular' }}>•</Text>
              <Text className="text-gray-600 text-xs flex-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Contingency of 5% included for unforeseen expenses
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EstimateDetails