// SnagDetails.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation }  from '@react-navigation/native';
import Header from 'components/Header';

const SnagDetailScreen = () => {
  const navigation = useNavigation();

  const [statusLogVisible, setStatusLogVisible] = useState(false);
  const [snagActionsVisible, setSnagActionsVisible] = useState(false);
  const [markAsFixedVisible, setMarkAsFixedVisible] = useState(false); // NEW STATE

  // Modal Controls
  const openStatusLog = () => setStatusLogVisible(true);
  const closeStatusLog = () => setStatusLogVisible(false);

  const openSnagActions = () => setSnagActionsVisible(true);
  const closeSnagActions = () => setSnagActionsVisible(false);

  const openMarkAsFixed = () => {
    setSnagActionsVisible(false);
    setMarkAsFixedVisible(true);
  };
  const closeMarkAsFixed = () => setMarkAsFixedVisible(false);

  // Mock photos data
  const photos = [
    { id: 1, uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', title: 'Leakage Point' },
    { id: 2, uri: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', title: 'Water Damage' },
    { id: 3, uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', title: 'Pipe Inspection' },
    { id: 4, uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', title: 'Repair Area' },
    { id: 5, uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop', title: 'Completed Work' },
  ];

  const timelineData = [
    { icon: 'create-outline', color: '#3B82F6', title: 'Snag Created by PM', desc: "That's a fantastic new app feature" },
    { icon: 'person-outline', color: '#8B5CF6', title: 'Assigned to Contractor A', desc: "That's a fantastic new app feature" },
    { icon: 'camera-outline', color: '#10B981', title: 'Photo Evidence Uploaded', desc: "That's a fantastic new app feature" },
    { icon: 'document-text-outline', color: '#F59E0B', title: 'Note Added by Contractor A', desc: "That's a fantastic new app feature" },
    { icon: 'checkmark-circle-outline', color: '#10B981', title: 'Approved by Admin', desc: "That's a fantastic new app feature" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header
        title="Assigned Snag"
        showBackButton={true}
        backgroundColor="#3B82F6"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5">
          {/* Details Card */}
          <View className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
            <Text className="mb-4 text-lg font-bold text-gray-900">Details</Text>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Name</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">SNAG-035</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Status</Text>
              <View className="rounded-full bg-amber-100 px-3 py-1.5">
                <Text className="text-sm font-bold text-amber-600">In Progress</Text>
              </View>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Project</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">Skyline Towers</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Location</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">2nd Floor Lobby</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Issue</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">Wall Paint Peeling</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Reported</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">Apr 3, 2025</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Created By</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">Project Manager</Text>
            </View>
            <View className="mb-3.5 flex-row justify-between">
              <Text className="text-base font-medium text-gray-500">Assigned To</Text>
              <Text className="ml-3 flex-1 text-right text-base font-bold text-gray-600">Contractor A</Text>
            </View>
          </View>

          {/* Photos Section */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-bold text-gray-800">Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerClassName="px-5 gap-3">
              {photos.map((photo) => (
                <View key={photo.id} className="w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <Image source={{ uri: photo.uri }} className="h-32 w-full" resizeMode="cover" />
                  <View className="p-3">
                    <Text className="mb-1 text-sm font-semibold text-gray-800">{photo.title}</Text>
                    <Text className="text-xs text-gray-500">Photo #{photo.id}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Comments Section */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-bold text-gray-800">Comments</Text>
            <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
              <View className="mb-2.5 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                  <Text className="text-sm font-bold text-white">AM</Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-gray-800">Arun Mishra</Text>
                  <Text className="text-sm text-gray-500">2025-04-07 08:21</Text>
                </View>
              </View>
              <Text className="leading-6 text-gray-600">
                This is a critical issue. Please send your team today itself and fix it as soon as possible.
              </Text>
            </View>

            <View className="mt-6 flex-row justify-between px-8">
              <TouchableOpacity onPress={openStatusLog}>
                <Text className="text-lg font-bold text-gray-800">Status Log</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openSnagActions}>
                <Text className="text-base font-semibold text-blue-500">View Timeline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STATUS LOG MODAL */}
      <Modal visible={statusLogVisible} transparent animationType="slide" onRequestClose={closeStatusLog}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeStatusLog} className="flex-1 bg-black/40" />
          <View className="max-h-[85%] rounded-t-3xl bg-white px-6 pb-10 pt-6">
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-gray-300" />
            </View>
            <Text className="mb-6 text-center text-xl font-bold text-gray-800">Status Log</Text>
            <Text className="mb-4 text-sm font-semibold text-blue-600">Today</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {timelineData.map((item, index) => (
                <View key={index} className="mb-6 flex-row">
                  <View className="mr-4 items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: item.color + '20' }}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    {index !== timelineData.length - 1 && <View className="mt-2 h-16 w-0.5 bg-gray-300" />}
                  </View>
                  <View className="flex-1 pb-6">
                    <Text className="text-base font-semibold text-gray-800">{item.title}</Text>
                    <Text className="mt-1 text-sm text-gray-500">{item.desc}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* SNAG ACTIONS MODAL */}
      <Modal visible={snagActionsVisible} transparent animationType="slide" onRequestClose={closeSnagActions}>
        <View className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeSnagActions} className="absolute inset-0 bg-black/40" />
          <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
            <View className="mb-5 items-center">
              <View className="h-1 w-12 rounded-full bg-gray-300" />
            </View>
            <Text className="mb-8 text-center text-xl font-bold text-gray-900">Snag Item Actions</Text>
            <View className="gap-4">
              <TouchableOpacity className="rounded-2xl bg-blue-50 px-6 py-4">
                <Text className="text-center text-lg font-medium text-blue-600">Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-2xl bg-blue-50 px-6 py-4">
                <Text className="text-center text-lg font-medium text-blue-600">Upload Fix Proof</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openMarkAsFixed} className="rounded-2xl bg-blue-50 px-6 py-4">
                <Text className="text-center text-lg font-medium text-blue-600">Mark as Fixed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSnagActionsVisible(false);
                  navigation.navigate('RequestReworkScreen');
                }}
                className="rounded-2xl bg-blue-50 px-6 py-4">
                <Text className="text-center text-lg font-medium text-blue-600">Request Rework</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MARK AS FIXED CONFIRMATION MODAL - EXACTLY LIKE YOUR IMAGE */}
      <Modal visible={markAsFixedVisible} transparent animationType="slide" onRequestClose={closeMarkAsFixed}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
          <TouchableOpacity activeOpacity={1} onPress={closeMarkAsFixed} className="flex-1 bg-black/40" />

          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            {/* Drag Handle */}
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {/* Icon + Title */}
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark" size={44} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Mark as Fixed</Text>
            </View>

            {/* Message */}
            <Text className="text-center text-base text-gray-600 px-4 leading-6">
              Are you sure you want to mark this item as Fixed?
            </Text>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={() => {
                closeMarkAsFixed();
                // Add your API call here later
                alert('Snag marked as Fixed successfully!');
              }}
              className="mt-10 bg-green-500 rounded-xl py-4 px-6">
              <Text className="text-center text-white text-lg font-semibold">Mark as Fixed</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default SnagDetailScreen;