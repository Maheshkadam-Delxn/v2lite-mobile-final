import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'

const Materials = () => {
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory' or 'boq'

  const inventoryItems = [
    {
      id: 1,
      name: 'OPC 53 Grade Cement',
      category: 'Cement & Concrete',
      status: 'Adequate',
      statusColor: 'bg-green-500',
      reqBags: '500',
      received: '450',
      consumed: '380',
      inStock: '70',
      progress: 76,
    },
    {
      id: 2,
      name: 'TMT Steel 12mm',
      category: 'Steel & Rebar',
      status: 'Low Stock',
      statusColor: 'bg-yellow-500',
      reqBags: '25',
      received: '22',
      consumed: '20',
      inStock: '02',
      progress: 76,
    },
    {
      id: 3,
      name: 'OPC 53 Grade Cement',
      category: 'Cement & Concrete',
      status: 'Adequate',
      statusColor: 'bg-green-500',
      reqBags: '500',
      received: '450',
      consumed: '380',
      inStock: '70',
      progress: 76,
    },
    {
      id: 4,
      name: 'TMT Steel 12mm',
      category: 'Steel & Rebar',
      status: 'Low Stock',
      statusColor: 'bg-yellow-500',
      reqBags: '25',
      received: '22',
      consumed: '20',
      inStock: '02',
      progress: 76,
    },
    {
      id: 5,
      name: 'TMT Steel 12mm',
      category: 'Steel & Rebar',
      status: 'Low Stock',
      statusColor: 'bg-yellow-500',
      reqBags: '25',
      received: '22',
      consumed: '20',
      inStock: '02',
      progress: 76,
    },
  ]

  const boqItems = [
    {
      id: 1,
      boqId: 'BOQ-001',
      status: 'Completed',
      statusColor: 'bg-green-500',
      workName: 'Civil Work - Foundation',
      materials: ['OPC 53 Grade Cement', 'TMT Steel 12mm', 'River Sand'],
      progress: 100,
    },
    {
      id: 2,
      boqId: 'BOQ-001',
      status: 'Completed',
      statusColor: 'bg-green-500',
      workName: 'Civil Work - Foundation',
      materials: ['OPC 53 Grade Cement', 'TMT Steel 12mm', 'River Sand'],
      progress: 100,
    },
    {
      id: 3,
      boqId: 'BOQ-001',
      status: 'Completed',
      statusColor: 'bg-green-500',
      workName: 'Civil Work - Foundation',
      materials: ['OPC 53 Grade Cement', 'TMT Steel 12mm', 'River Sand'],
      progress: 100,
    },
    {
      id: 4,
      boqId: 'BOQ-001',
      status: 'Completed',
      statusColor: 'bg-green-500',
      workName: 'Civil Work - Foundation',
      materials: ['OPC 53 Grade Cement', 'TMT Steel 12mm', 'River Sand'],
      progress: 100,
    },
    {
      id: 5,
      boqId: 'BOQ-001',
      status: 'Completed',
      statusColor: 'bg-green-500',
      workName: 'Civil Work - Foundation',
      materials: ['OPC 53 Grade Cement', 'TMT Steel 12mm', 'River Sand'],
      progress: 100,
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Tab Buttons */}
        <View className="flex-row px-4 pt-6 pb-4">
          <TouchableOpacity
            onPress={() => setActiveTab('inventory')}
            className={`flex-1 mr-2 py-3 rounded-lg ${
              activeTab === 'inventory' ? 'bg-blue-600' : 'bg-white border border-blue-600'
            }`}
          >
            <Text
              className={`text-center text-sm ${
                activeTab === 'inventory' ? 'text-white' : 'text-blue-600'
              }`}
              style={{ fontFamily: 'Urbanist-SemiBold' }}
            >
              Inventory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('boq')}
            className={`flex-1 ml-2 py-3 rounded-lg ${
              activeTab === 'boq' ? 'bg-blue-600' : 'bg-white border border-blue-600'
            }`}
          >
            <Text
              className={`text-center text-sm ${
                activeTab === 'boq' ? 'text-white' : 'text-blue-600'
              }`}
              style={{ fontFamily: 'Urbanist-SemiBold' }}
            >
              Boq Mapping
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inventory Tab Content */}
        {activeTab === 'inventory' && (
          <>
            {/* Stats Cards */}
            <View className="flex-row flex-wrap px-4 mb-4">
              {/* Total Items */}
              <View className="w-[48%] mr-[4%] mb-3">
                <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
                  <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Total Items
                  </Text>
                  <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                    06
                  </Text>
                </View>
              </View>

              {/* Units Received */}
              <View className="w-[48%] mb-3">
                <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
                  <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Units Received
                  </Text>
                  <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                    782
                  </Text>
                </View>
              </View>

              {/* Units Consumed */}
              <View className="w-[48%] mr-[4%] mb-3">
                <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
                  <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Units Consumed
                  </Text>
                  <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                    602
                  </Text>
                </View>
              </View>

              {/* Need Attention */}
              <View className="w-[48%] mb-3">
                <View className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4">
                  <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Need Attention
                  </Text>
                  <Text className="text-blue-600 text-2xl" style={{ fontFamily: 'Urbanist-Bold' }}>
                    02
                  </Text>
                </View>
              </View>
            </View>

            {/* Filter Buttons */}
            <View className="px-4 mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full mr-2">
                  <Text className="text-white text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    All Materials
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white border border-blue-600 px-4 py-2 rounded-full mr-2">
                  <Text className="text-blue-600 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Cement & Concrete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-white border border-blue-600 px-4 py-2 rounded-full">
                  <Text className="text-blue-600 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Steel & Rebar
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Inventory Items */}
            <View className="px-4">
              {inventoryItems.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4 mb-3"
                >
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-900 text-base mb-1" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.name}
                      </Text>
                      <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                        {item.category}
                      </Text>
                    </View>
                    <View className={`${item.statusColor} px-3 py-1 rounded-full`}>
                      <Text className="text-white text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Stats Row */}
                  <View className="flex-row justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                        Req bags
                      </Text>
                      <Text className="text-blue-600 text-sm" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.reqBags}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                        Received
                      </Text>
                      <Text className="text-blue-600 text-sm" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.received}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                        consumed
                      </Text>
                      <Text className="text-blue-600 text-sm" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.consumed}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                        Instock
                      </Text>
                      <Text className="text-blue-600 text-sm" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {item.inStock}
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
          </>
        )}

        {/* BoQ Mapping Tab Content */}
        {activeTab === 'boq' && (
          <View className="px-4">
            {boqItems.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4 mb-3"
              >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View className={`${item.statusColor} px-3 py-1 rounded-full mr-2`}>
                        <Text className="text-white text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                          {item.status}
                        </Text>
                      </View>
                      <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                        {item.boqId}
                      </Text>
                    </View>
                    <Text className="text-gray-900 text-base mb-2" style={{ fontFamily: 'Urbanist-Bold' }}>
                      {item.workName}
                    </Text>
                    
                    {/* Materials Tags */}
                    <View className="flex-row flex-wrap">
                      {item.materials.map((material, index) => (
                        <View
                          key={index}
                          className="bg-gray-100 px-2 py-1 rounded mr-2 mb-1"
                        >
                          <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                            {material}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Material Used
                  </Text>
                  <Text className="text-blue-600 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    {item.progress}%
                  </Text>
                </View>
                <View className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <View
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Materials