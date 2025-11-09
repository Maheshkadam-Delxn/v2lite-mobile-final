import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { ArrowLeft, User, Eye, FileText, Image as ImageIcon, Figma } from 'lucide-react-native';
import Header from 'components/Header';

const SurveyApprovalScreen = ({ navigation }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const attachments = [
    { id: 1, name: 'Website template.psd', size: '5 mb', icon: FileText, iconBg: '#4285F4' },
    { id: 2, name: 'Logo vector.ai', size: '3 mb', icon: ImageIcon, iconBg: '#FF6B00' },
    { id: 3, name: 'Wireframe for team.figma', size: '2 mb', icon: Figma, iconBg: '#F24E1E' },
  ];

  const approvalHistory = [
    { id: 1, action: 'Submitted by Contractor A on 20-03-2025', detail: '' },
    { id: 2, action: 'Reviewed by Admin on 22-03-2025', detail: 'Reason : Incomplete Data' },
    { id: 3, action: 'Resubmitted by Contractor A on 25-03-2025', detail: '' },
  ];

  const handleBack = () => navigation.goBack();

  // APPROVE MODAL
  const ApproveModal = ({ visible, onCancel, onConfirm }) => (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-6 pb-8 min-h-[280px] justify-center">
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">Approve Survey</Text>
          <Text className="text-sm text-gray-600 text-center mb-8">
            Are you sure you want to Approve this Survey?
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center rounded-lg bg-red-50 py-3.5"
              style={{ borderWidth: 1, borderColor: '#FECACA' }}>
              <Text className="text-sm font-bold text-red-600">Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 items-center rounded-lg bg-green-600 py-3.5">
              <Text className="text-sm font-bold text-white">Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // REJECT MODAL WITH REASON
  const RejectModal = ({ visible, onCancel, onConfirm, reason, setReason }) => (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-6 pb-8 min-h-[380px] justify-center">
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">Reject Survey</Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            Are you sure you want to Reject this Survey?
          </Text>

          {/* Reason Input */}
          <View className="mb-6">
            <Text className="text-xs font-medium text-gray-700 mb-2">Reason for Rejection</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Enter reason..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 items-center rounded-lg bg-red-50 py-3.5"
              style={{ borderWidth: 1, borderColor: '#FECACA' }}>
              <Text className="text-sm font-bold text-red-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (reason.trim()) {
                  onConfirm();
                }
              }}
              disabled={!reason.trim()}
              className={`flex-1 items-center rounded-lg py-3.5 ${
                reason.trim() ? 'bg-green-600' : 'bg-gray-300'
              }`}>
              <Text
                className={`text-sm font-bold ${
                  reason.trim() ? 'text-white' : 'text-gray-500'
                }`}>
                Submit Rejection
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Header
        title="Survey Approvals"
        showBackButton={true}
        onBackPress={handleBack}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <Text className="flex-1 text-lg font-bold text-gray-900">Project Alfa</Text>
        <Text className="text-sm font-semibold text-gray-600">SRQ - 001</Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        {/* General Information */}
        <View className="mt-4 px-4">
          <Text className="mb-2 text-sm font-bold text-gray-900">General Information</Text>
          <View
            className="rounded-lg bg-white p-4 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            {/* Blue Badge */}
            <View className="absolute top-3 right-3 z-10">
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: '#E3F2FD' }}>
                <Text
                  className="text-[10px] font-semibold"
                  style={{ color: '#1565C0' }}>
                  SRQ-001
                </Text>
              </View>
            </View>

            <View className="mb-3 flex-row items-start justify-between">
              <Text className="text-xs text-gray-500">Request ID</Text>
              <Text className="text-xs font-medium text-gray-900">SRQ-001</Text>
            </View>
            <View className="mb-3 flex-row items-start justify-between">
              <Text className="text-xs text-gray-500">Project Name</Text>
              <Text className="text-xs font-medium text-gray-900">Project Alfa</Text>
            </View>
            <View className="mb-3 flex-row items-start justify-between">
              <Text className="text-xs text-gray-500">Date</Text>
              <Text className="text-xs font-medium text-gray-900">10 Jul 2024</Text>
            </View>
            <View className="flex-row items-start justify-between">
              <Text className="text-xs text-gray-500">Type</Text>
              <View className="rounded-md bg-blue-600 px-3 py-1">
                <Text className="text-xs font-semibold text-white">Safety</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mt-4 px-4">
          <Text className="mb-2 text-sm font-bold text-gray-900">Description</Text>
          <View
            className="rounded-lg bg-white p-4 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <View className="absolute top-3 right-3 z-10">
              <View className="rounded-full bg-green-100 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-green-700">New</Text>
              </View>
            </View>
            <Text className="text-xs leading-5 text-gray-700">
              New survey request submitted. Employee Satisfaction Survey Q2 2025 for review.
            </Text>
          </View>
        </View>

        {/* Assigned To */}
        <View className="mt-4 px-4">
          <Text className="mb-2 text-sm font-bold text-gray-900">Assigned To</Text>
          <View
            className="rounded-lg bg-white p-4 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <View className="absolute top-3 right-3 z-10">
              <View className="rounded-full bg-purple-100 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-purple-700">Contractor</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">Contractor</Text>
              <View className="flex-row items-center">
                <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-gray-300">
                  <User size={14} color="#666666" />
                </View>
                <Text className="text-xs font-medium text-gray-900">Mr. Ahmad Al-Farisi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Attachments */}
        <View className="mt-4 px-4">
          <Text className="mb-2 text-sm font-bold text-gray-900">Attachments</Text>
          <View
            className="rounded-lg bg-white p-3 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <View className="absolute top-3 right-3 z-10">
              <View className="rounded-full bg-orange-100 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-orange-700">3 Files</Text>
              </View>
            </View>

            {attachments.map((attachment, index) => {
              const IconComponent = attachment.icon;
              return (
                <View key={attachment.id}>
                  <View className="flex-row items-center py-2">
                    <View
                      className="mr-3 h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: attachment.iconBg }}>
                      <IconComponent size={18} color="#FFFFFF" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-gray-900" numberOfLines={1}>
                        {attachment.name}
                      </Text>
                      <Text className="mt-0.5 text-[10px] text-gray-400">{attachment.size}</Text>
                    </View>
                    <TouchableOpacity className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                      <Eye size={16} color="#0066FF" />
                    </TouchableOpacity>
                  </View>
                  {index < attachments.length - 1 && <View className="my-1 h-px bg-gray-100" />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Approval History */}
        <View className="mt-4 px-4">
          <Text className="mb-2 text-sm font-bold text-gray-900">Approval History</Text>
          <View
            className="rounded-lg bg-white p-4 relative"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <View className="absolute top-3 right-3 z-10">
              <View className="rounded-full bg-red-100 px-2 py-0.5">
                <Text className="text-[10px] font-semibold text-red-700">Pending</Text>
              </View>
            </View>

            {approvalHistory.map((item, index) => (
              <View key={item.id} className="flex-row">
                <View className="mr-3 items-center pt-0.5">
                  <View className="h-2 w-2 rounded-full bg-blue-600" />
                  {index < approvalHistory.length - 1 && (
                    <View className="mt-1 w-0.5 flex-1 bg-gray-300" style={{ minHeight: 30 }} />
                  )}
                </View>
                <View className="flex-1 pb-3">
                  <Text className="text-[11px] font-semibold leading-4 text-gray-900">
                    {item.action}
                  </Text>
                  {item.detail ? (
                    <Text className="mt-1 text-[10px] leading-4 text-gray-500">{item.detail}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-6 mt-6 flex-row gap-3 px-4">
          <TouchableOpacity
            onPress={() => setShowRejectModal(true)}
            className="flex-1 items-center rounded-lg bg-red-50 py-3.5"
            style={{ borderWidth: 1, borderColor: '#FECACA' }}>
            <Text className="text-sm font-bold text-red-600">Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowApproveModal(true)}
            className="flex-1 items-center rounded-lg bg-green-600 py-3.5">
            <Text className="text-sm font-bold text-white">Approve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Approve Modal */}
      <ApproveModal
        visible={showApproveModal}
        onCancel={() => setShowApproveModal(false)}
        onConfirm={() => {
          setShowApproveModal(false);
          alert('Survey Approved');
        }}
      />

      {/* Reject Modal with Reason */}
      <RejectModal
        visible={showRejectModal}
        reason={rejectReason}
        setReason={setRejectReason}
        onCancel={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        onConfirm={() => {
          setShowRejectModal(false);
          setRejectReason('');
          alert(`Survey Rejected. Reason: ${rejectReason}`);
        }}
      />
    </SafeAreaView>
  );
};

export default SurveyApprovalScreen;