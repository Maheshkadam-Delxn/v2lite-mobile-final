import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EscalationMatrixScreen from './EscalationMatrixScreen';

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

const SWIPE_THRESHOLD = -100;
const BUTTON_WIDTH = 80;

/* ——— Swipeable Card ——— */
const SwipeableRiskItem = ({ item, onEdit, onDelete, onPress }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.min(
          0,
          Math.max(gestureState.dx + currentOffset.current, -BUTTON_WIDTH * 2)
        );
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -BUTTON_WIDTH * 2,
            useNativeDriver: true,
          }).start();
          currentOffset.current = -BUTTON_WIDTH * 2;
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          currentOffset.current = 0;
        }
      },
    })
  ).current;

  const handleEdit = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
      currentOffset.current = 0;
      onEdit(item);
    });
  };

  const handleDelete = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(() => {
      currentOffset.current = 0;
      onDelete(item);
    });
  };

  return (
    <View className="mb-3 overflow-hidden">
      <View
        className="absolute bottom-0 right-0 top-0 flex-row"
        style={{ width: BUTTON_WIDTH * 2 }}>
        <TouchableOpacity
          className="flex-1 items-center justify-center bg-blue-600"
          onPress={handleEdit}>
          <Feather name="edit" size={20} color="white" />
          <Text className="mt-1 text-xs text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 items-center justify-center bg-red-500"
          onPress={handleDelete}>
          <Feather name="trash-2" size={20} color="white" />
          <Text className="mt-1 text-xs text-white">Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        className="flex-row items-center rounded-sm bg-white p-4"
        {...panResponder.panHandlers}>
        <TouchableOpacity onPress={() => onPress(item)} className="flex-1 flex-row items-center">
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color + '20' }}>
            <Feather name={item.icon} size={20} color={item.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-800">{item.title}</Text>
            <Text className="mt-0.5 text-sm text-slate-500">{item.subtitle}</Text>
          </View>
        </TouchableOpacity>
        <View className="w-5" />
      </Animated.View>
    </View>
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
                <TouchableOpacity className="rounded-xl bg-blue-600 px-40 py-4">
                  <Text className="text-base font-semibold text-white">Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center rounded-xl bg-green-500 px-4 py-3">
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

/* ——— Edit Escalation Rule Modal ——— */
const EditEscalationModal = ({ visible, onClose, risk }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="max-h-[90%] rounded-t-3xl bg-white pb-8">
              <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-5">
                <Text className="text-lg font-semibold text-slate-800">Edit Escalation Rule</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mt-4 flex-row px-6">
                  <View className="mr-2 flex-1">
                    <Text className="mb-1.5 text-sm text-slate-500">Risk Category</Text>
                    <Text className="text-base font-medium text-slate-800">
                      {risk?.title || ''}
                    </Text>
                  </View>
                  <View className="ml-2 flex-1">
                    <Text className="mb-1.5 text-sm text-slate-500">Severity Level</Text>
                    <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                      <Text className="text-base text-slate-800">High</Text>
                      <Feather name="chevron-down" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mt-5 px-6">
                  <Text className="mb-1.5 text-sm text-slate-500">Escalation Path:</Text>
                  <TouchableOpacity className="self-start">
                    <Text className="text-base font-medium text-blue-600">New Step</Text>
                  </TouchableOpacity>
                </View>

                <View className="mx-6 mt-4 rounded-2xl bg-gray-50 p-4">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-slate-800">Step 1</Text>
                    <Feather name="chevron-down" size={20} color="#8E8E93" />
                  </View>
                  <View className="mb-3">
                    <Text className="mb-1.5 text-sm text-slate-500">Role</Text>
                    <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                      <Text className="text-base text-slate-800">Project Manager</Text>
                      <Feather name="chevron-down" size={20} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row">
                    <View className="mr-2 flex-1">
                      <Text className="mb-1.5 text-sm text-slate-500">Time Frame</Text>
                      <TextInput
                        className="rounded-xl border border-gray-300 p-3 text-base text-slate-800"
                        value="24"
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="ml-2 flex-1">
                      <Text className="mb-1.5 text-sm text-slate-500">Time Unit</Text>
                      <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                        <Text className="text-base text-slate-800">Hours</Text>
                        <Feather name="chevron-down" size={20} color="#8E8E93" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View className="mx-6 mt-4 rounded-2xl bg-gray-50 p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-slate-800">Step 2</Text>
                    <Feather name="chevron-down" size={20} color="#8E8E93" />
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity className="mx-6 mt-6 items-center rounded-xl bg-blue-600 py-4">
                <Text className="text-base font-semibold text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/* ——— Issue Detail Modal ——— */
const IssueDetailModal = ({ visible, onClose, issue, onEscalate }) => {
  if (!issue) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40">
          <TouchableWithoutFeedback>
            <View className="absolute bottom-0 left-0 right-0 max-h-[92%] rounded-t-3xl bg-white pb-8">
              {/* Header */}
              <View className="border-b border-gray-200 px-6 py-5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-slate-800">Issue Detail</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Feather name="x" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {/* Issue Description */}
                <View className="mt-5">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Issue Description</Text>
                  <View className="rounded-xl border border-gray-300 bg-gray-50 p-4">
                    <Text className="text-base leading-6 text-slate-800">
                      It was popularised in the 1960s with the release of Letraset sheets containing
                      Lorem Ipsum passages, and more recently with desktop publishing software like
                      Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                  </View>
                </View>

                {/* Attachments */}
                <View className="mt-5">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Attachments</Text>
                  <View className="flex-row gap-4">
                    <View className="items-center">
                      <View className="h-16 w-16 items-center justify-center rounded-xl border border-gray-300 bg-white">
                        <Feather name="file-text" size={24} color="#3B82F6" />
                      </View>
                      <Text className="mt-2 text-xs text-slate-600">Website templates.psd</Text>
                    </View>
                    <View className="items-center">
                      <View className="h-16 w-16 items-center justify-center rounded-xl border border-gray-300 bg-white">
                        <Feather name="file-text" size={24} color="#F97316" />
                      </View>
                      <Text className="mt-2 text-xs text-slate-600">Logo vector.ai</Text>
                    </View>
                  </View>
                </View>

                {/* Location */}
                <View className="mt-5">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Location</Text>
                  <View className="rounded-xl border border-gray-300 bg-white p-4">
                    <Text className="text-base text-slate-800">Site Location</Text>
                  </View>
                </View>

                {/* Current Assignee */}
                <View className="mt-4">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Current Assignee</Text>
                  <View className="rounded-xl border border-gray-300 bg-white p-4">
                    <Text className="text-base text-slate-800">Arun Mishra</Text>
                  </View>
                </View>

                {/* Escalation Path */}
                <View className="mt-4">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Escalation Path</Text>
                  <View className="rounded-xl border border-gray-300 bg-white p-4">
                    <Text className="text-base text-slate-800">Project Manager to Admin</Text>
                  </View>
                </View>

                {/* Time Remaining */}
                <View className="mt-4">
                  <Text className="mb-3 text-sm font-medium text-slate-500">Time Remaining</Text>
                  <View className="rounded-xl border border-gray-300 bg-white p-4">
                    <Text className="text-base text-slate-800">24 hours</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Escalate Now Button */}
              <View className="mt-6 flex-row items-center justify-center px-8">
                <TouchableOpacity
                  className="w-full justify-center rounded-xl bg-blue-600 px-6 py-4"
                  onPress={onEscalate}>
                  <Text className="text-center text-base font-bold text-white">Escalate Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

/* ——— Escalate Issue Modal ——— */
const EscalateIssueModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="rounded-t-3xl bg-white p-6 pb-8">
              <Text className="text-center text-lg font-semibold text-slate-800">
                Escalate Issue
              </Text>

              <View className="mt-5">
                <Text className="mb-2 text-sm font-medium text-slate-500">
                  Reason for Escalation
                </Text>
                <TouchableOpacity className="flex-row items-center justify-between rounded-xl border border-gray-300 p-3">
                  <Text className="text-base text-slate-800">Requires higher authority</Text>
                  <Feather name="chevron-down" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <View className="mt-4">
                <Text className="mb-2 text-sm font-medium text-slate-500">Additional Comments</Text>
                <TextInput
                  className="rounded-xl border border-gray-300 p-3 text-base text-slate-800"
                  placeholder="Add comments..."
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 items-center rounded-xl bg-green-600 py-4"
                  onPress={onConfirm} // Use the passed onConfirm prop
                >
                  <Text className="text-base font-semibold text-white">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 items-center rounded-xl bg-red-600 py-4"
                  onPress={onClose}>
                  <Text className="text-base font-semibold text-white">Cancel</Text>
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [escalateModalVisible, setEscalateModalVisible] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);

  const handleEdit = (item) => {
    setSelectedRisk(item);
    setEditModalVisible(true);
  };

  const handleDelete = (item) => {
    console.log('Delete:', item);
  };

  const handleAddRisk = () => {
    setReportModalVisible(true);
  };

  const handleCardPress = (item) => {
    setSelectedRisk(item);
    setDetailModalVisible(true);
  };

  const handleEscalate = () => {
    setDetailModalVisible(false);
    setEscalateModalVisible(true);
  };

  const renderRiskItem = ({ item }) => (
    <SwipeableRiskItem
      item={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPress={handleCardPress}
    />
  );

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

      <FlatList
        data={risks}
        keyExtractor={(item) => item.id}
        renderItem={renderRiskItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-xl"
        onPress={handleAddRisk}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <ReportRiskModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} />
      <EditEscalationModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        risk={selectedRisk}
      />
      <IssueDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        issue={selectedRisk}
        onEscalate={handleEscalate}
      />
      <EscalateIssueModal
        visible={escalateModalVisible}
        onClose={() => setEscalateModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default RiskCategoriesScreen;

