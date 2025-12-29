// AuditDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { useNavigation } from '@react-navigation/native';

const AuditDashboard = () => {
  const navigation = useNavigation();

  // Modal States
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [approveTaskModalVisible, setApproveTaskModalVisible] = useState(false);
  const [rejectTaskModalVisible, setRejectTaskModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [notifyAssignee, setNotifyAssignee] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleAddNewItem = () => {
    navigation.navigate('AddSnagItem');
  };

  // Comment Modal
  const openCommentModal = () => setCommentModalVisible(true);
  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setComment('');
  };

  // Preview Modal
  const openPreviewModal = () => setPreviewModalVisible(true);
  const closePreviewModal = () => setPreviewModalVisible(false);

  // Approve Task Modal
  const openApproveTaskModal = () => {
    closePreviewModal();
    setApproveTaskModalVisible(true);
  };
  const closeApproveTaskModal = () => setApproveTaskModalVisible(false);

  // Reject Task Modal
  const openRejectTaskModal = () => {
    closePreviewModal();
    setRejectTaskModalVisible(true);
  };
  const closeRejectTaskModal = () => {
    setRejectTaskModalVisible(false);
    setRejectionReason('');
  };

  const [snagItems] = useState([
    {
      id: 'SNAG-1234',
      status: 'In Progress',
      project: 'Skyline Tower',
      location: 'Lobby',
      issue: 'Cracked Tile in Lobby',
      assigned: 'Contractor A',
      date: 'Apr 1, 2025',
    },
  ]);

  const stats = [
    { label: 'Pending Snag', value: '05', color: '#FFA726' },
    { label: 'Await Docs', value: '03', color: '#42A5F5' },
    { label: 'Awaiting Approval', value: '02', color: '#EF5350' },
    { label: 'Sign Off Required', value: '04', color: '#66BB6A' },
  ];

  const StatCard = ({ title, value, color }) => (
    <View className="bg-white rounded-xl p-4 w-[48%] mb-3 shadow-sm shadow-black/5 elevation-2 relative">
      <View className="w-1 h-10 rounded-full absolute left-0 top-4" style={{ backgroundColor: color }} />
      <Text className="text-2xl font-bold text-gray-800 ml-3">{value}</Text>
      <Text className="text-xs text-gray-600 font-medium ml-3 mt-1">{title}</Text>
    </View>
  );

  const SnagItemCard = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm shadow-black/5 elevation-2 relative min-h-[180px]">
  {/* Blue Left Badge - Full Height */}
  <View className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
  
  <View className="ml-3 flex-1">
    <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-100">
      <Text className="text-base font-bold text-gray-800">{item.id}</Text>
      <View className="bg-orange-50 px-3 py-1 rounded-full">
        <Text className="text-orange-500 text-xs font-semibold">{item.status}</Text>
      </View>
    </View>

    <View className="mb-3">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500 font-medium">Project</Text>
        <Text className="text-sm text-gray-800 font-medium">{item.project}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500 font-medium">Location</Text>
        <Text className="text-sm text-gray-800 font-medium">{item.location}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500 font-medium">Issue</Text>
        <Text className="text-sm text-gray-800 font-medium">{item.issue}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500 font-medium">Assigned</Text>
        <Text className="text-sm text-gray-800 font-medium">{item.assigned}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500 font-medium">Date</Text>
        <Text className="text-sm text-gray-800 font-medium">{item.date}</Text>
      </View>
    </View>

    <View className="flex-row justify-around pt-3 border-t border-gray-100">
      <TouchableOpacity onPress={openPreviewModal} className="flex-row items-center">
        <Ionicons name="eye-outline" size={18} color="#4A90E2" />
        <Text className="text-blue-500 text-sm font-semibold ml-1.5">Preview</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={openCommentModal} className="flex-row items-center">
        <Ionicons name="chatbubble-outline" size={18} color="#4A90E2" />
        <Text className="text-blue-500 text-sm font-semibold ml-1.5">Comment</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
  );

  return (
    <>
      <View className="flex-1 bg-gray-100">
        <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
        
        <Header
          title="Dashboard"
          rightIcon="filter-outline"
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between mb-5">
            {stats.map((stat, index) => (
              <StatCard key={index} title={stat.label} value={stat.value} color={stat.color} />
            ))}
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-semibold text-gray-800">Snag Items</Text>
            <TouchableOpacity onPress={handleAddNewItem}>
              <Text className="text-blue-500 text-sm font-semibold">+ New Item</Text>
            </TouchableOpacity>
          </View>

          {snagItems.map((item, index) => (
            <SnagItemCard key={index} item={item} />
          ))}
        </ScrollView>
      </View>

      {/* Comment Modal */}
      <Modal visible={commentModalVisible} transparent animationType="slide" onRequestClose={closeCommentModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeCommentModal} className="flex-1 bg-black/40" />
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <View className="items-center mb-5"><View className="w-12 h-1.5 bg-gray-300 rounded-full" /></View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">Add Comment</Text>
            <TextInput className="border border-gray-300 rounded-2xl px-5 py-4 text-base text-gray-700 min-h-[120px]" placeholder="Add your feedback below..." placeholderTextColor="#94A3B8" multiline value={comment} onChangeText={setComment} />
            <Text className="text-sm text-gray-500 mt-3 leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
            </Text>
            <TouchableOpacity onPress={closeCommentModal} className="mt-8 bg-blue-500 py-4 rounded-2xl items-center">
              <Text className="text-white text-lg font-semibold">Submit feedback</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Preview → Approve/Reject Modal */}
      <Modal visible={previewModalVisible} transparent animationType="slide" onRequestClose={closePreviewModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closePreviewModal} className="flex-1 bg-black/40" />
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="items-center mb-6"><View className="w-12 h-1.5 bg-gray-300 rounded-full" /></View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-8">Review Snag Item</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={openApproveTaskModal} className="flex-1 bg-green-500 py-4 rounded-2xl items-center">
                <Text className="text-white text-lg font-semibold">Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openRejectTaskModal} className="flex-1 bg-red-500 py-4 rounded-2xl items-center">
                <Text className="text-white text-lg font-semibold">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Approve Task Modal */}
      <Modal visible={approveTaskModalVisible} transparent animationType="slide" onRequestClose={closeApproveTaskModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeApproveTaskModal} className="flex-1 bg-black/40" />
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <View className="items-center mb-5"><View className="w-12 h-1.5 bg-gray-300 rounded-full" /></View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">Approve Task</Text>
            <View className="mb-6">
              <Text className="text-sm text-gray-600 mb-1">Confirm approval of:</Text>
              <Text className="text-base font-semibold text-gray-800">SNAG-1234</Text>
              <Text className="text-base text-gray-700 mt-1">Cracked Tile in Lobby</Text>
              <Text className="text-sm text-gray-600 mt-3">Assigned Contractor: <Text className="font-medium">Contractor A</Text></Text>
              <Text className="text-sm text-gray-600">Attached: <Text className="font-medium">2 photos, note</Text></Text>
            </View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-base text-gray-800 font-medium">Notify Assigned Person :</Text>
              <Switch value={notifyAssignee} onValueChange={setNotifyAssignee} trackColor={{ false: '#E2E8F0', true: '#0066FF' }} thumbColor={notifyAssignee ? '#FFFFFF' : '#94A3B8'} ios_backgroundColor="#E2E8F0" />
            </View>
            <Text className="text-sm text-gray-600 mb-3">Add Optional Note</Text>
            <Text className="text-sm text-gray-500 leading-6 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
            </Text>
            <TouchableOpacity onPress={closeApproveTaskModal} className="bg-blue-600 py-4 rounded-2xl items-center">
              <Text className="text-white text-lg font-semibold">Approve Task</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* REJECT TASK MODAL - 100% SAME AS YOUR IMAGE */}
      <Modal visible={rejectTaskModalVisible} transparent animationType="slide" onRequestClose={closeRejectTaskModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeRejectTaskModal} className="flex-1 bg-black/40" />

          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            {/* Drag Handle */}
            <View className="items-center mb-5">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <Text className="text-xl font-bold text-gray-800 text-center mb-6">Reject Task</Text>

            <Text className="text-base text-gray-700 text-center mb-6">
              Please provide reason for rejection
            </Text>

            {/* Reason Input */}
            <TextInput
              className="border border-gray-300 rounded-2xl px-5 py-4 text-base text-gray-700 min-h-[120px]"
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna..."
              placeholderTextColor="#94A3B8"
              multiline
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />

            {/* Reject Button */}
            <TouchableOpacity
              onPress={closeRejectTaskModal}
              className="mt-10 bg-red-500 py-4 rounded-2xl items-center"
            >
              <Text className="text-white text-lg font-semibold">Reject Task</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default AuditDashboard;