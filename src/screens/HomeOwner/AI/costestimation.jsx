import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import Header from '@/components/Header'

// Placeholder imports for sub-screens (adjust paths as needed)
import AISuggestions from './AISuggestions'; // Assuming this exists
import UploadAnalysis from './UploadAnalysis'; // Assuming this exists
import LiveMonitoring from './LiveMonitoring'; // Assuming this exists
import Materials from './Materials'; // Assuming this exists
import Finance from './Finance'; // Assuming this exists
import EstimateDetails from './EstimateDetails';

const CostEstimation = () => {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    { id: 'AISuggestions', label: 'AI Suggestions' },
    { id: 'UploadAnalysis', label: 'Upload & Analysis' },
    { id: 'EstimateDetails', label: 'Estimate Details' },
    { id: 'LiveMonitoring', label: 'Live Monitoring' },
    { id: 'Materials', label: 'Materials' },
    { id: 'Finance', label: 'Finance' },
  ];

  const costItems = [
    {
      category: 'Civil Work',
      aiEstimate: '72,000 QAR',
      marketRate: '70,075 QAR',
      confidence: 90,
      variance: '+3.5%',
      varianceColor: 'text-green-600',
      varianceBg: 'bg-green-50',
    },
    {
      category: 'Electrical',
      aiEstimate: '22,023 QAR',
      marketRate: '23,225 QAR',
      confidence: 85,
      variance: '-4.3%',
      varianceColor: 'text-red-600',
      varianceBg: 'bg-red-50',
    },
    {
      category: 'Civil Work',
      aiEstimate: '72,000 QAR',
      marketRate: '70,075 QAR',
      confidence: 90,
      variance: '+3.5%',
      varianceColor: 'text-green-600',
      varianceBg: 'bg-green-50',
    },
    {
      category: 'Electrical',
      aiEstimate: '22,023 QAR',
      marketRate: '23,225 QAR',
      confidence: 85,
      variance: '-4.3%',
      varianceColor: 'text-red-600',
      varianceBg: 'bg-red-50',
    },
    {
      category: 'Civil Work',
      aiEstimate: '72,000 QAR',
      marketRate: '70,075 QAR',
      confidence: 90,
      variance: '+3.5%',
      varianceColor: 'text-green-600',
      varianceBg: 'bg-green-50',
    },
  ]

  const handleTabSelect = (tab) => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  const estimateContent = (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* Cost Breakdown Header */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-gray-900 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
          Cost Breakdown
        </Text>
      </View>

      {/* Summary Cards */}
      <View className="flex-row px-4 mb-4">
        {/* Total Estimate Card */}
        <View className="flex-1 bg-white rounded-xl border-l-4 border-l-yellow-500 p-4 mr-2">
          <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
            Total Estimate
          </Text>
          <Text className="text-gray-900 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
            180,660 QAR
          </Text>
        </View>

        {/* Potential Savings Card */}
        <View className="flex-1 bg-white rounded-xl border-l-4 border-l-green-500 p-4 ml-2">
          <Text className="text-gray-600 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
            Potential Savings
          </Text>
          <Text className="text-green-600 text-lg" style={{ fontFamily: 'Urbanist-Bold' }}>
            8,000 QAR
          </Text>
        </View>
      </View>

      {/* Cost Items List */}
      <View className="px-4">
        {costItems.map((item, index) => (
          <View
            key={index}
            className="bg-white rounded-xl border-l-4 border-l-blue-500 p-4 mb-3"
          >
            {/* Category and Variance */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-900 text-base" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {item.category}
              </Text>
              <View className={`${item.varianceBg} px-2 py-1 rounded`}>
                <Text className={`${item.varianceColor} text-xs`} style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {item.variance}
                </Text>
              </View>
            </View>

            {/* AI Estimate and Market Rate */}
            <View className="flex-row justify-between mb-3">
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  AI Estimate
                </Text>
                <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {item.aiEstimate}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  Market Rate
                </Text>
                <Text className="text-gray-900 text-sm" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {item.marketRate}
                </Text>
              </View>
            </View>

            {/* Confidence Bar */}
            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Urbanist-Regular' }}>
                  Confidence
                </Text>
                <Text className="text-gray-900 text-xs" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {item.confidence}%
                </Text>
              </View>
              <View className="bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <View
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${item.confidence}%` }}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    if (activeTab === null) {
      return estimateContent;
    }
    switch (activeTab) {
      case 'AISuggestions':
        return <AISuggestions />;
      case 'UploadAnalysis':
        return <UploadAnalysis />;
    case 'EstimateDetails' :
        return <EstimateDetails/>
      case 'LiveMonitoring':
        return <LiveMonitoring />;
      case 'Materials':
        return <Materials />;
      case 'Finance':
        return <Finance />;
      default:
        return estimateContent;
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
        style={{ fontFamily: 'Urbanist-SemiBold' }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title="Cost Estimation"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
        rightIcon={
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Feather name="bell" size={20} color="white" />
          </TouchableOpacity>
        }
      />

      {/* Sub Header Tab Bar */}
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
    </SafeAreaView>
  )
}

export default CostEstimation