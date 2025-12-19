import React from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import Header from 'components/Header'

const AISuggestions = () => {
  const suggestions = [
    {
      id: 1,
      category: 'Cost Saving',
      categoryColor: 'bg-green-500',
      confidence: '89% confident',
      title: 'Consider Vitrified Tiles instead of Italian Marble',
      description: 'For living room flooring. Vitrified tiles offer 40% cost savings without compromising on aesthetics or durability.',
      potential: 'Save ₹120k',
      potentialColor: 'text-green-600',
      quality: 'Low',
      qualityColor: 'text-red-600',
    },
    {
      id: 2,
      category: 'Optimization',
      categoryColor: 'bg-blue-500',
      confidence: '92% confident',
      title: 'Optimize Electrical Layout',
      description: 'Consolidating switch boards can reduce wiring by 15% without affecting functionality.',
      potential: 'Save ₹38k',
      potentialColor: 'text-green-600',
      quality: 'None',
      qualityColor: 'text-gray-600',
    },
    {
      id: 3,
      category: 'Recommendation',
      categoryColor: 'bg-yellow-500',
      confidence: '94% confident',
      title: 'Upgrade to Energy-Efficient HVAC',
      description: 'Higher upfront cost but 25% reduction in running costs over 5 years.',
      potential: 'Save ₹250k',
      potentialColor: 'text-yellow-600',
      quality: 'Improved',
      qualityColor: 'text-green-600',
    },
    {
      id: 4,
      category: 'Cost Saving',
      categoryColor: 'bg-green-500',
      confidence: '89% confident',
      title: 'Consider Vitrified Tiles instead of Italian Marble',
      description: 'For living room flooring. Vitrified tiles offer 40% cost savings without compromising on aesthetics or durability.',
      potential: 'Save ₹120k',
      potentialColor: 'text-green-600',
      quality: 'Low',
      qualityColor: 'text-red-600',
    },
    {
      id: 5,
      category: 'Optimization',
      categoryColor: 'bg-blue-500',
      confidence: '92% confident',
      title: 'Optimize Electrical Layout',
      description: 'Consolidating switch boards can reduce wiring by 15% without affecting functionality.',
      potential: 'Save ₹38k',
      potentialColor: 'text-green-600',
      quality: 'None',
      qualityColor: 'text-gray-600',
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* AI-Powered Recommendations Header */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-gray-900 text-lg mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
            AI-Powered Recommendations
          </Text>
          <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
            We've identified 4 optimization opportunities
          </Text>
        </View>

        {/* Suggestions List */}
        <View className="px-4">
          {suggestions.map((item) => {
            // Determine border color based on category
            const borderColor = 
              item.category === 'Cost Saving' ? 'border-l-green-500' :
              item.category === 'Optimization' ? 'border-l-blue-500' :
              'border-l-yellow-500'
            
            return (
              <View
                key={item.id}
                className={`bg-white rounded-xl border-l-4 ${borderColor} p-4 mb-3 flex-row`}
              >
                {/* Left Content */}
                <View className="flex-1 pr-3">
                  {/* Category Badge and Confidence */}
                  <View className="flex-row items-center mb-2">
                    <View className={`${item.categoryColor} px-3 py-1 rounded-full mr-2`}>
                      <Text className="text-white text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                        {item.category}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                      {item.confidence}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text className="text-gray-900 text-base mb-2" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {item.title}
                  </Text>

                  {/* Description */}
                  <Text className="text-gray-600 text-xs mb-2 leading-5" style={{ fontFamily: 'Urbanist-Regular' }}>
                    {item.description}
                  </Text>

                  {/* Potential and Quality Impact */}
                  <View className="flex-row items-center flex-wrap">
                    <Text className="text-gray-700 text-xs mr-3" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Potential:{' '}
                      <Text className={`${item.potentialColor}`} style={{ fontFamily: 'Urbanist-SemiBold' }}>
                        {item.potential}
                      </Text>
                    </Text>
                    <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Quality Impact:{' '}
                      <Text className={`${item.qualityColor}`} style={{ fontFamily: 'Urbanist-SemiBold' }}>
                        {item.quality}
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Right Actions */}
                <View className="items-center justify-center">
                  {/* Add/Check Button */}
                  <TouchableOpacity className="bg-green-500 w-10 h-10 rounded-full items-center justify-center mb-2">
                    <Feather name="check" size={20} color="white" />
                  </TouchableOpacity>

                  {/* Eye/View Button */}
                  <TouchableOpacity className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center">
                    <Feather name="eye" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </View>

        {/* Total Potential Savings */}
        <View className="bg-white mx-4 mt-2 rounded-xl border-l-4 border-l-blue-500 p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
                Total Potential Savings
              </Text>
              <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                If all suggestions are applied
              </Text>
            </View>
            <View className="bg-blue-50 px-4 py-2 rounded-lg">
              <Text className="text-blue-600 text-xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                ₹12.5 L
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AISuggestions