
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const risks = [
  {
    id: '1',
    type: 'safety',
    icon: 'alert-triangle',
    color: '#FF9500',
    title: 'Safety Hazard',
    subtitle: 'Risks related to physical safety',
  },
  {
    id: '2',
    type: 'financial',
    icon: 'dollar-sign',
    color: '#FF3B30',
    title: 'Financial Risk',
    subtitle: 'Risks regarding financial losses',
  },
  {
    id: '3',
    type: 'cyber',
    icon: 'shield',
    color: '#007AFF',
    title: 'Cybersecurity Risk',
    subtitle: 'Threats to data security and hacking',
  },
  {
    id: '4',
    type: 'regulatory',
    icon: 'file-text',
    color: '#5856D6',
    title: 'Regulatory Compliance',
    subtitle: 'Failure to comply with laws and regulations',
  },
  {
    id: '5',
    type: 'operational',
    icon: 'zap',
    color: '#8E8E93',
    title: 'Operational Risk',
    subtitle: 'Failures in internal processes and operations',
  },
];

/* ——— Risk Item ——— */
const RiskItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} className="flex-row items-center rounded-sm bg-white p-4 mb-3">
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: item.color + '20' }}>
        <Feather name={item.icon} size={20} color={item.color} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-slate-800">{item.title}</Text>
        <Text className="mt-0.5 text-sm text-slate-500">{item.subtitle}</Text>
      </View>
      <View className="w-5" />
    </TouchableOpacity>
  );
};

/* ——— Report Risk Modal ——— */
const ReportRiskModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="max-h-[85%] rounded-t-3xl bg-white pb-8">
              <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-5">
                <Text className="text-lg font-semibold text-slate-800">Report Risk</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
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

                <View className="mt-4 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Risk Description</Text>
                  <TextInput
                    className="rounded-xl border border-gray-300 p-3 text-base text-slate-800"
                    placeholder="Enter risk details..."
                    placeholderTextColor="#8E8E93"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View className="mt-4 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Location</Text>
                  <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                    <Text className="text-base text-slate-800">Mumbai</Text>
                    <Feather name="chevron-down" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View className="mt-6 flex-row items-center justify-between px-6">
                <TouchableOpacity className="flex-1 items-center justify-center rounded-xl bg-blue-600 py-4">
                  <Text className="text-base font-semibold text-white">Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity className="ml-3 flex-row items-center justify-center rounded-xl bg-green-500 px-4 py-4">
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
const RiskCategoriesScreen = () => {
  const navigation = useNavigation();
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const handleAddRisk = () => {
    setReportModalVisible(true);
  };

  const handleCardPress = (item) => {
    navigation.navigate('RiskDetail', { risk: item });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="mx-4 mb-4 mt-3 h-11 flex-row items-center rounded-lg bg-white px-3 shadow-sm">
        <Feather name="search" size={20} color="#8E8E93" className="mr-2" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#8E8E93"
          className="flex-1 text-base text-slate-800"
        />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {risks.map((item) => (
          <RiskItem key={item.id} item={item} onPress={handleCardPress} />
        ))}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-xl"
        onPress={handleAddRisk}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <ReportRiskModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} />
    </SafeAreaView>
  );
};

export default RiskCategoriesScreen;