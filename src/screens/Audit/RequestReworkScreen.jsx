// RequestReworkScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/Header';

const RequestReworkScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Header
        title="Assigned Snag"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
        {/* Snag Info Card */}
        <View className="mt-6 rounded-2xl bg-gray-50 p-5">
          {/* Title */}
          <Text className="mb-4 text-xl font-bold text-gray-900">Details</Text>

          {/* Content */}
          <Text className="text-sm font-bold text-blue-600">SNAG-149</Text>
          <Text className="mt-2 text-lg font-bold text-gray-900">Improper Window Fitting</Text>
          <Text className="mt-2 text-sm text-gray-500">Fixed by Contractor B · Apr 5, 2025</Text>
        </View>

        {/* Why is rework needed? */}
        <Text className="mt-8 text-base font-bold text-gray-900">Why is rework needed?</Text>
        <TextInput
          placeholder="Describe what's still wrong..."
          multiline
          numberOfLines={5}
          className="mt-3 rounded-xl border border-gray-300 px-4 py-4 text-base text-gray-700"
          style={{ textAlignVertical: 'top' }}
        />

        {/* Photos Section */}
        <Text className="mt-8 text-base font-bold text-gray-900">Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          <View className="flex-row gap-4">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="h-32 w-32 overflow-hidden rounded-xl border border-gray-300 bg-gray-200">
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            ))}
            {/* Add Photo */}
            <TouchableOpacity className="h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-gray-50">
              <Ionicons name="add" size={40} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Assign Back To */}
        <Text className="mt-8 text-base font-bold text-gray-900">Assign Back To</Text>
        <TouchableOpacity className="mt-4 flex-row items-center justify-between rounded-xl border border-gray-300 px-5 py-4">
          <View className="flex-row items-center">
            <View>
              <Text className="text-base font-semibold text-gray-900">Arun Mishra</Text>
              <Text className="text-sm text-gray-500">Contractor B</Text>
            </View>
          </View>
          <Ionicons name="chevron-down-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Fixed Buttons */}
      <View className="flex-row gap-4 border-t border-gray-200 px-5 py-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-1 rounded-xl bg-blue-600 py-4">
          <Text className="text-center text-base font-semibold text-white">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 rounded-xl bg-green-500 py-4">
          <Text className="text-center text-base font-semibold text-white">Request Rework</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestReworkScreen;
