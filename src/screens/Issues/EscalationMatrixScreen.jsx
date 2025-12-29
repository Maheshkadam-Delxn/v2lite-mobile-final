import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const escalationRules = [
  {
    id: '1',
    title: 'Safety Hazard',
    severity: 'High',
    path: 'Project Manager (24 hours) → Admin (48 hours) → Client',
    isSolved: true,
  },
  {
    id: '2',
    title: 'Safety Hazard',
    severity: 'High',
    path: 'Project Manager (24 hours) → Admin (48 hours) → Client',
    isSolved: false,
  },
  {
    id: '3',
    title: 'Safety Hazard',
    severity: 'High',
    path: 'Project Manager (24 hours) → Admin (48 hours) → Client',
    isSolved: false,
  },
  {
    id: '4',
    title: 'Safety Hazard',
    severity: 'High',
    path: 'Project Manager (24 hours) → Admin (48 hours) → Client',
    isSolved: false,
  },
];

/* ——— Escalation Rule Item ——— */
const EscalationRuleItem = ({ item }) => {
  return (
    <View className="mx-4 mb-3 rounded-2xl border border-gray-100 bg-white p-4">
      <View className="mb-1 flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
          <Text className="mt-0.5 text-sm text-red-600">Severity Level: {item.severity}</Text>
        </View>
        <View className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600">
          {item.isSolved ? (
            <View className="h-3 w-3 rounded-full bg-blue-600" />
          ) : (
            <View className="h-3 w-3 rounded-full border-2 border-gray-300" />
          )}
        </View>
      </View>
      <Text className="mt-2 text-sm text-slate-600">{item.path}</Text>
    </View>
  );
};

/* ——— Submit Risk Report Modal ——— */
const SubmitRiskReportModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="max-h-[90%] rounded-t-3xl bg-white pb-8">
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-5">
                <Text className="text-lg font-semibold text-slate-800">Submit Risk Report</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Risk Category & Severity */}
                <View className="mt-4 flex-row px-6">
                  <View className="mr-2 flex-1">
                    <Text className="mb-1.5 text-sm text-slate-500">Risk Category</Text>
                    <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                      <Text className="text-base text-slate-800">Safety Hazard</Text>
                      <Feather name="chevron-down" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                  <View className="ml-2 flex-1">
                    <Text className="mb-1.5 text-sm text-slate-500">Severity Level</Text>
                    <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                      <Text className="text-base text-slate-800">High</Text>
                      <Feather name="chevron-down" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Risk Description */}
                <View className="mt-4 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Risk Description</Text>
                  <TextInput
                    className="rounded-xl border border-gray-300 p-3 text-base text-slate-800"
                    placeholder="Enter details..."
                    placeholderTextColor="#8E8E93"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Status */}
                <View className="mt-4 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Status</Text>
                  <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                    <Text className="text-base text-slate-800">Solved</Text>
                    <Feather name="chevron-down" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Location */}
                <View className="mt-4 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Location</Text>
                  <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                    <Text className="text-base text-slate-800">Mumbai</Text>
                    <Feather name="chevron-down" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View className="mt-6 flex-row items-center justify-between px-6">
                <TouchableOpacity className="rounded-xl bg-blue-600 px-40 py-4">
                  <Text className="text-base font-semibold text-white">Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity className="h-14 w-14 items-center justify-center rounded-xl bg-green-500">
                  <Feather name="paperclip" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/* ——— Main Screen ——— */
const EscalationMatrixScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => <EscalationRuleItem item={item} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="border-b border-gray-200 bg-white px-4 py-3">
        <View className="h-11 flex-row items-center rounded-xl bg-gray-100 px-4">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 flex-1 text-base text-slate-700"
          />
        </View>
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-6 py-4">
        <Text className="text-lg font-bold text-slate-900">Escalation Rules</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-sm font-medium text-blue-600">Mark Issue Solved</Text>
        </TouchableOpacity>
      </View>

      {/* Rules List */}
      <FlatList
        data={escalationRules}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Submit Risk Report Modal */}
      <SubmitRiskReportModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
};

export default EscalationMatrixScreen;
