// AddSnagItem.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';

const AddSnagItem = () => {
  const navigation = useNavigation();

  const [issue, setIssue] = useState('Water leakage');

  // Mock uploaded files
  const uploadedFiles = [
    { name: 'Website templates.pdf', type: 'pdf' },
    { name: 'Logo vector.ai', type: 'ai' },
    { name: 'Wireframe for team.fig', type: 'figma' },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <Ionicons name="document-text" size={32} color="#EF4444" />;
      case 'ai':
        return <FontAwesome5 name="vector-square" size={30} color="#FB923C" />;
      case 'figma':
        return <Ionicons name="layers" size={32} color="#8B5CF6" />;
      default:
        return <Ionicons name="document" size={32} color="#94A3B8" />;
    }
  };

  const handleCreateSnag = () => {
    navigation.navigate('AssignedSnag');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      {/* Header */}
      <Header
        title="Add Snag Item"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-1 bg-white mx-4 my-4 rounded-2xl shadow-lg shadow-black/10 elevation-3 overflow-hidden">
          <View className="p-5">

            {/* Select Project */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Select Project</Text>
              <TouchableOpacity className="flex-row justify-between items-center border-b-2 border-blue-600 py-4">
                <Text className="text-base text-gray-800">Skyline Tower</Text>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Select Location */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Select Location</Text>
              <TouchableOpacity className="flex-row justify-between items-center border-b-2 border-blue-600 py-4">
                <Text className="text-base text-gray-800">Lobby</Text>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Issue Description */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Issue Description</Text>
              <TextInput
                className="border-b-2 border-blue-600 py-3.5 text-base text-gray-800 min-h-[50px]"
                placeholder="Water leakage"
                value={issue}
                onChangeText={setIssue}
                multiline
              />
            </View>

            {/* Priority */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Priority</Text>
              <TouchableOpacity className="flex-row justify-between items-center border-b-2 border-blue-600 py-4">
                <Text className="text-base text-gray-800">High</Text>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Assign To */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Assign To</Text>
              <TouchableOpacity className="flex-row justify-between items-center border-b-2 border-blue-600 py-4">
                <Text className="text-base text-gray-800">Contractor A</Text>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Upload Files */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-800 mb-4">Upload files</Text>
              <TouchableOpacity className="items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 h-36 bg-gray-50 mb-4">
                <MaterialIcons name="cloud-upload" size={50} color="#CBD5E1" />
                <Text className="mt-3 text-base text-gray-500 font-medium">Browse files to upload</Text>
              </TouchableOpacity>

              {/* Uploaded Files List */}
              <View className="mt-4">
                {uploadedFiles.map((file, index) => (
                  <View key={index} className="flex-row items-center bg-white p-3.5 rounded-xl border border-gray-200 mb-2.5">
                    {getFileIcon(file.type)}
                    <Text className="flex-1 ml-3 text-sm text-gray-800 font-medium" numberOfLines={1}>
                      {file.name}
                    </Text>
                    <TouchableOpacity>
                      <Ionicons name="close-circle" size={24} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Snag Button */}
      <View className="px-5 pt-5 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCreateSnag}
          className="bg-blue-500 py-4 rounded-2xl items-center"
        >
          <Text className="text-lg font-semibold text-white">Create Snag</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddSnagItem;