// RiskDetail.jsx - No changes needed; nestedScrollEnabled should handle any potential inner scrolling
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const RiskDetail = ({ route, navigation }) => {
  const { risk } = route.params || {};
  const [escalateModalVisible, setEscalateModalVisible] = useState(false);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);

  // Sample risk details - can be fetched from API
  const riskDetails = {
    id: risk?.id || '1',
    title: risk?.title || 'Safety Hazard',
    category: risk?.title || 'Safety Hazard',
    severity: 'High',
    status: 'Open',
    reportedBy: 'Ahmed Al-Mansouri',
    reportedDate: '25 Apr 2025',
    location: 'West Bay Construction Site, Doha',
    description: 'Unsafe scaffolding detected at the construction site. The scaffolding at the north wing lacks proper safety barriers and shows signs of structural weakness. Immediate attention required to prevent potential accidents.',
    currentAssignee: 'Mohammed Al-Thani (Site Manager)',
    escalationPath: 'Site Manager → Project Manager → Safety Director',
    timeRemaining: '18 hours',
    attachments: [
      { id: '1', name: 'scaffolding_photo.jpg', type: 'image' },
      { id: '2', name: 'safety_report.pdf', type: 'pdf' },
    ],
    updates: [
      {
        id: '1',
        date: '26 Apr 2025, 10:30 AM',
        user: 'Mohammed Al-Thani',
        message: 'Safety inspection team has been notified. Will assess by end of day.',
      },
      {
        id: '2',
        date: '25 Apr 2025, 2:15 PM',
        user: 'Ahmed Al-Mansouri',
        message: 'Risk reported and initial documentation completed.',
      },
    ],
  };

  const handleEscalate = () => {
    setEscalateModalVisible(true);
  };

  const handleResolve = () => {
    setResolveModalVisible(true);
  };

  const confirmEscalation = () => {
    setEscalateModalVisible(false);
    Alert.alert('Success', 'Risk has been escalated to the next level');
  };

  const confirmResolution = () => {
    setResolveModalVisible(false);
    Alert.alert('Success', 'Risk has been marked as resolved');
    navigation.goBack();
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return { bg: '#ef444415', text: '#ef4444' };
      case 'medium':
        return { bg: '#f59e0b15', text: '#f59e0b' };
      case 'low':
        return { bg: '#10b98115', text: '#10b981' };
      default:
        return { bg: '#94a3b815', text: '#94a3b8' };
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { bg: '#3b82f615', text: '#3b82f6' };
      case 'in progress':
        return { bg: '#f59e0b15', text: '#f59e0b' };
      case 'resolved':
        return { bg: '#10b98115', text: '#10b981' };
      default:
        return { bg: '#94a3b815', text: '#94a3b8' };
    }
  };

  const severityColors = getSeverityColor(riskDetails.severity);
  const statusColors = getStatusColor(riskDetails.status);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        {/* Header Card */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-5">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-slate-900 mb-2">
                {riskDetails.title}
              </Text>
              <Text className="text-sm text-slate-500">{riskDetails.category}</Text>
            </View>
            <View
              style={{ backgroundColor: risk?.color + '20' || '#0066FF20' }}
              className="w-12 h-12 rounded-full items-center justify-center"
            >
              <Feather name={risk?.icon || 'alert-triangle'} size={24} color={risk?.color || '#0066FF'} />
            </View>
          </View>

          {/* Status & Severity Badges */}
          <View className="flex-row gap-2 mt-2">
            <View
              style={{ backgroundColor: severityColors.bg }}
              className="px-3 py-1.5 rounded-full"
            >
              <Text style={{ color: severityColors.text }} className="text-xs font-semibold">
                {riskDetails.severity} Severity
              </Text>
            </View>
            <View
              style={{ backgroundColor: statusColors.bg }}
              className="px-3 py-1.5 rounded-full"
            >
              <Text style={{ color: statusColors.text }} className="text-xs font-semibold">
                {riskDetails.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-5">
          <Text className="text-base font-bold text-slate-900 mb-3">Description</Text>
          <Text className="text-sm text-slate-600 leading-6">
            {riskDetails.description}
          </Text>
        </View>

        {/* Details Grid */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-5">
          <Text className="text-base font-bold text-slate-900 mb-4">Details</Text>
          
          <View className="mb-4">
            <Text className="text-xs text-slate-500 mb-1.5">Reported By</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {riskDetails.reportedBy}
            </Text>
          </View>

          <View className="h-px bg-slate-100 mb-4" />

          <View className="mb-4">
            <Text className="text-xs text-slate-500 mb-1.5">Reported Date</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {riskDetails.reportedDate}
            </Text>
          </View>

          <View className="h-px bg-slate-100 mb-4" />

          <View className="mb-4">
            <Text className="text-xs text-slate-500 mb-1.5">Location</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {riskDetails.location}
            </Text>
          </View>

          <View className="h-px bg-slate-100 mb-4" />

          <View className="mb-4">
            <Text className="text-xs text-slate-500 mb-1.5">Current Assignee</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {riskDetails.currentAssignee}
            </Text>
          </View>

          <View className="h-px bg-slate-100 mb-4" />

          <View className="mb-4">
            <Text className="text-xs text-slate-500 mb-1.5">Escalation Path</Text>
            <Text className="text-sm font-semibold text-slate-900">
              {riskDetails.escalationPath}
            </Text>
          </View>

          <View className="h-px bg-slate-100 mb-4" />

          <View>
            <Text className="text-xs text-slate-500 mb-1.5">Time Remaining</Text>
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#ef4444" />
              <Text className="text-sm font-bold text-red-500 ml-2">
                {riskDetails.timeRemaining}
              </Text>
            </View>
          </View>
        </View>

        {/* Attachments */}
        <View className="mx-4 mt-4 rounded-2xl bg-white p-5">
          <Text className="text-base font-bold text-slate-900 mb-4">Attachments</Text>
          <View className="flex-row flex-wrap gap-3">
            {riskDetails.attachments.map((attachment) => (
              <TouchableOpacity
                key={attachment.id}
                className="items-center"
              >
                <View 
                  style={{ backgroundColor: '#0066FF15' }}
                  className="w-20 h-20 rounded-xl items-center justify-center"
                >
                  <Feather 
                    name={attachment.type === 'image' ? 'image' : 'file-text'} 
                    size={28} 
                    color="#0066FF" 
                  />
                </View>
                <Text className="text-xs text-slate-600 mt-2 text-center w-20" numberOfLines={2}>
                  {attachment.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activity Timeline */}
        <View className="mx-4 mt-4 mb-24 rounded-2xl bg-white p-5">
          <Text className="text-base font-bold text-slate-900 mb-4">Activity Timeline</Text>
          {riskDetails.updates.map((update, index) => (
            <View key={update.id} className="mb-4">
              <View className="flex-row">
                <View className="mr-3 items-center">
                  <View 
                    style={{ backgroundColor: '#0066FF' }}
                    className="w-2 h-2 rounded-full mt-1.5"
                  />
                  {index !== riskDetails.updates.length - 1 && (
                    <View className="flex-1 w-0.5 bg-slate-200 mt-1" />
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text className="text-xs text-slate-500 mb-1">{update.date}</Text>
                  <Text className="text-sm font-semibold text-slate-900 mb-1">
                    {update.user}
                  </Text>
                  <Text className="text-sm text-slate-600">{update.message}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white p-4"
        style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}
      >
        <View className="flex-row gap-3">
          <TouchableOpacity
            style={{ backgroundColor: '#0066FF' }}
            className="flex-1 rounded-2xl py-4 flex-row items-center justify-center"
            onPress={handleEscalate}
          >
            <Feather name="arrow-up-circle" size={20} color="white" />
            <Text className="text-white font-bold text-sm ml-2">Escalate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-2xl py-4 flex-row items-center justify-center bg-green-50"
            onPress={handleResolve}
          >
            <Feather name="check-circle" size={20} color="#10b981" />
            <Text className="text-green-600 font-bold text-sm ml-2">Resolve</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Escalate Modal */}
      <Modal
        visible={escalateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEscalateModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 bg-slate-200 rounded-full" />
            </View>

            <Text className="text-xl font-bold text-slate-900 mb-6">
              Escalate Risk
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Reason for Escalation
              </Text>
              <TouchableOpacity className="flex-row items-center justify-between bg-slate-50 rounded-xl p-4">
                <Text className="text-base text-slate-900">Requires higher authority</Text>
                <Feather name="chevron-down" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Additional Comments
              </Text>
              <TextInput
                className="h-24 text-sm text-slate-900 p-4 bg-slate-50 rounded-xl"
                placeholder="Add comments..."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                style={{ backgroundColor: '#0066FF' }}
                className="flex-1 rounded-2xl py-4 items-center"
                onPress={confirmEscalation}
              >
                <Text className="text-white font-bold text-base">Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-2xl py-4 items-center bg-slate-100"
                onPress={() => setEscalateModalVisible(false)}
              >
                <Text className="text-slate-700 font-bold text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        visible={resolveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setResolveModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 bg-slate-200 rounded-full" />
            </View>

            <Text className="text-xl font-bold text-slate-900 mb-6">
              Resolve Risk
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Resolution Details
              </Text>
              <TextInput
                className="h-32 text-sm text-slate-900 p-4 bg-slate-50 rounded-xl"
                placeholder="Describe how the risk was resolved..."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-2xl py-4 items-center bg-green-600"
                onPress={confirmResolution}
              >
                <Text className="text-white font-bold text-base">Mark as Resolved</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-2xl py-4 items-center bg-slate-100"
                onPress={() => setResolveModalVisible(false)}
              >
                <Text className="text-slate-700 font-bold text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RiskDetail;