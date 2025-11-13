import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

const FilesScreen = () => {
  const navigation = useNavigation()
  
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
                <Icon name="folder" size={24} color="#3B82F6" />
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
        <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center">
          <Text className="text-base font-semibold text-white">
            Add Folder
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center">
          <Text className="text-base font-semibold text-white">
            Add Document
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FilesScreen