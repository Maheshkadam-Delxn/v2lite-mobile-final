import React from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native'

const Finance = () => {
  const laborItems = [
    {
      id: 1,
      category: 'Labor - Masonry',
      budgeted: '85,000',
      actual: '72,500',
      committed: '78,000',
      forecast: '82,000',
      variance: '-14.7%',
      varianceColor: 'text-green-500',
      varianceBg: 'bg-green-50',
      progress: 85,
    },
    {
      id: 2,
      category: 'Labor - Masonry',
      budgeted: '85,000',
      actual: '72,500',
      committed: '78,000',
      forecast: '82,000',
      variance: '-14.7%',
      varianceColor: 'text-green-500',
      varianceBg: 'bg-green-50',
      progress: 85,
    },
    {
      id: 3,
      category: 'Labor - Masonry',
      budgeted: '85,000',
      actual: '72,500',
      committed: '78,000',
      forecast: '82,000',
      variance: '-14.7%',
      varianceColor: 'text-green-500',
      varianceBg: 'bg-green-50',
      progress: 85,
    },
    {
      id: 4,
      category: 'Labor - Masonry',
      budgeted: '85,000',
      actual: '72,500',
      committed: '78,000',
      forecast: '82,000',
      variance: '-14.7%',
      varianceColor: 'text-green-500',
      varianceBg: 'bg-green-50',
      progress: 85,
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="bg-white px-4 pt-6 pb-4">
          <Text className="text-gray-900 text-xl mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
            Finance Integration
          </Text>
          <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Urbanist-Regular' }}>
            Labor and equipment costs mapped to project budget
          </Text>
        </View>

        {/* Summary Cards Grid */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {/* Total Budgeted */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Total Budgeted
              </Text>
              <Text className="text-blue-600 text-xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                QAR 333,000
              </Text>
            </View>
          </View>

          {/* Total Actual */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Total Actual
              </Text>
              <Text className="text-blue-600 text-xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                QAR 280,200
              </Text>
            </View>
          </View>

          {/* Total Committed */}
          <View className="w-[48%] mr-[4%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Total Committed
              </Text>
              <Text className="text-blue-600 text-xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                QAR 301,500
              </Text>
            </View>
          </View>

          {/* Forecast at Completion */}
          <View className="w-[48%] mb-3">
            <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
              <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Forecast at Completion
              </Text>
              <Text className="text-blue-600 text-xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                QAR 322,200
              </Text>
            </View>
          </View>
        </View>

        {/* Labor Items */}
        <View className="px-4 mt-2">
          {laborItems.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4 mb-3"
            >
              {/* Header */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {item.category}
                  </Text>
                  <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Budgeted (QAR) : {item.budgeted}
                  </Text>
                </View>
                <View className={`${item.varianceBg} px-2 py-1 rounded`}>
                  <Text className={`${item.varianceColor} text-xs`} style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    {item.variance}
                  </Text>
                </View>
              </View>

              {/* Cost Breakdown */}
              <View className="flex-row justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Actual (QAR)
                  </Text>
                  <Text className="text-blue-600 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {item.actual}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Committed (QAR)
                  </Text>
                  <Text className="text-blue-600 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {item.committed}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Forecast (QAR)
                  </Text>
                  <Text className="text-blue-600 text-base" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {item.forecast}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="flex-row items-center">
                <View className="flex-1 mr-2">
                  <View className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <View
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </View>
                </View>
                <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {item.progress}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Finance