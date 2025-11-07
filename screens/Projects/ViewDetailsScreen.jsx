import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import { Ionicons } from '@expo/vector-icons';

const ViewDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params;
  const [activeTab, setActiveTab] = useState('Details');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    console.log('Edit project:', project.id);
    navigation.navigate('CreateProjectScreen');
  };

  const tabs = [
    { id: 'Details', label: 'Details' },
    { id: 'Task', label: 'Task' },
    { id: 'Transaction', label: 'Transaction' },
    { id: 'Attendance', label: 'Attendance' },
  ];

  // Container component for consistent styling
  const SectionContainer = ({ children, title }) => (
    <View className="mb-6 p-6 bg-white rounded-2xl shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-xl text-gray-900 mb-4">
        {title}
      </Text>
      {children}
    </View>
  );

  // Detail row component for consistent item styling
  const DetailRow = ({ label, value }) => (
    <View className="flex-row justify-between py-3 border-b border-gray-100 last:border-b-0">
      <Text style={{ fontFamily: 'Urbanist-Medium' }} className="text-gray-500 text-base flex-1">
        {label}
      </Text>
      <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-900 text-base flex-1 text-right">
        {value}
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <>
            {/* Basic Project Details */}
            <SectionContainer title="Basic Project Details">
              <View className="space-y-1">
                <DetailRow label="Project Name" value="Luxury Vale Point Bay" />
                <DetailRow label="Project Type" value="Vale Construction" />
                <DetailRow label="Project ID" value="SRT-00325" />
                <DetailRow label="Location" value="Palm Jummel's Dubai Gulf" />
                <DetailRow label="Start Date" value="10 Jan 2024" />
                <DetailRow label="End Date" value="10 Dec 2024" />
                <DetailRow label="Project Status" value="-" />
              </View>
            </SectionContainer>

            {/* Project Team */}
            <SectionContainer title="Project Team">
              <View className="space-y-1">
                <DetailRow label="Project Manager" value="John Dan" />
                <DetailRow label="Consular" value="RFC No Horizon" />
                <DetailRow label="Main Controller" value="Elkin Bullerin LLC" />
                <DetailRow label="Subcommittee" value="-" />
              </View>
            </SectionContainer>

            {/* Financial Overview */}
            <SectionContainer title="Financial Overview">
              <View className="space-y-1">
                <DetailRow label="Trade Budget" value="$5,000,000" />
                <DetailRow label="Amount Spent" value="$2,250,000" />
                <DetailRow label="Servicing Budget" value="$2,350,000" />
                <DetailRow label="ECO Approval Status" value="-" />
              </View>
            </SectionContainer>

            {/* Client & Approach */}
            <SectionContainer title="Client & Approach">
              <View className="space-y-1">
                <DetailRow label="Client Name" value="Mr. Ahmed al-Farot" />
                <DetailRow label="Approval Status" value="Pruning Client That Review" />
                <DetailRow label="Docs List" value="$ Home Notebook 2 Printing" />
              </View>
            </SectionContainer>
          </>
        );
      
      case 'Task':
        return (
          <SectionContainer title="Tasks">
            <View className="space-y-4">
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
                Task content will be displayed here
              </Text>
            </View>
          </SectionContainer>
        );
      
      case 'Transaction':
        return (
          <SectionContainer title="Transactions">
            <View className="space-y-4">
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
                Transaction content will be displayed here
              </Text>
            </View>
          </SectionContainer>
        );
      
      case 'Attendance':
        return (
          <SectionContainer title="Attendance">
            <View className="space-y-4">
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-gray-600 text-center py-8">
                Attendance content will be displayed here
              </Text>
            </View>
          </SectionContainer>
        );
      
      default:
        return null;
    }
  };

  const renderTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
      className={`px-6 py-3 rounded-full mx-1 ${
        activeTab === item.id ? 'bg-blue-600' : 'bg-gray-100'
      }`}
    >
      <Text
        style={{ fontFamily: 'Urbanist-SemiBold' }}
        className={`text-base ${
          activeTab === item.id ? 'text-white' : 'text-gray-600'
        }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        title="Project Details"
        showBackButton={true}
        onBackPress={handleBack}
        onRightIconPress={handleEdit}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* Horizontal Tabs */}
      <View className="bg-white py-3 shadow-sm border-b border-gray-200">
        <FlatList
          data={tabs}
          renderItem={renderTabItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Project Info */}
        <View className="px-5 py-6">
         
          {/* Tab Content */}
          {renderTabContent()}

          {/* Action Buttons - Only show on Details tab */}
          {activeTab === 'Details' && (
            <View className="flex-row space-x-4 mb-4 mt-2">
              <TouchableOpacity 
                className="flex-1 bg-blue-600 rounded-xl py-4 items-center shadow-sm"
                style={{
                  shadowColor: '#0066FF',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-white text-base">
                  Update Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-white rounded-xl py-4 items-center shadow-sm border border-gray-200"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text style={{ fontFamily: 'Urbanist-SemiBold' }} className="text-gray-600 text-base">
                  Share Project
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewDetailsScreen;