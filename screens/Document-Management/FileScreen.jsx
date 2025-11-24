import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

const FilesScreen = () => {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)

  const folders = [
    { id: 1, name: 'Sample Reports', fileCount: 3 },
    { id: 2, name: 'Design Changes', fileCount: 3 },
    { id: 3, name: 'RFIs', fileCount: 3 },
    { id: 4, name: 'Submittals', fileCount: 3 },
  ]

  const handleFolderPress = (folderName) => {
    navigation.navigate('FolderDetails', { folderName })
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mt-5 mb-5">
          <Icon name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Folders List */}
        <View className="gap-3">
          {folders.map((folder) => (
            <TouchableOpacity 
              key={folder.id} 
              className="flex-row items-center justify-between bg-white rounded-xl px-4 py-4"
              onPress={() => handleFolderPress(folder.name)}
            >
              <View className="flex-row items-center gap-3">
                <Icon name="folder" size={24} color="#0066FF" />
                <Text className="text-base font-semibold text-gray-900">
                  {folder.name}
                </Text>
              </View>
              <Text className="text-sm text-gray-400">
                {folder.fileCount} Files
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 py-5 bg-gray-100">
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center"
        >
          <Text className="text-base font-semibold text-white">
            Add Folder
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('AddDocumentScreen')}
          className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center"
        >
          <Text className="text-base font-semibold text-white">
            Add Document
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Folder Modal – EXACT MATCH TO YOUR IMAGE */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl pb-8">
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900">Add Folder</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Folder Name */}
                <View className="px-6 mt-5">
                  <Text className="text-sm text-gray-500 mb-2">Folder Name</Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                    placeholder="C 4.1"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Category */}
                <View className="px-6 mt-5">
                  <Text className="text-sm text-gray-500 mb-2">Category</Text>
                  <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row justify-between items-center">
                    <Text className="text-base text-gray-900">Grading Plan</Text>
                    <Icon name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Folder Icon */}
                <View className="px-6 mt-5">
                  <Text className="text-sm text-gray-500 mb-2">Folder Icon</Text>
                  <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row justify-between items-center">
                    <Text className="text-base text-gray-900">far-regular far-settings</Text>
                    <Icon name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity className="bg-blue-500 mx-6 mt-8 py-4 rounded-xl items-center">
                  <Text className="text-white text-base font-semibold">Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default FilesScreen