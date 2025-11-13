import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const FolderDetailsScreen = ({ route }) => {
  const { folderName } = route.params || { folderName: 'Sample Reports' }
  
  const files = [
    { 
      id: 1, 
      name: 'SampleCSVReport.xlsx', 
      size: '300 kb',
      icon: 'file-excel',
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    { 
      id: 2, 
      name: 'DetailProjectReport.docx', 
      size: '300 kb',
      icon: 'file-word',
      iconColor: '#3B82F6',
      iconBg: '#DBEAFE'
    },
    { 
      id: 3, 
      name: 'SummaryReport.pdf', 
      size: '1.2 mb',
      icon: 'file-pdf-box',
      iconColor: '#EF4444',
      iconBg: '#FEE2E2'
    },
  ]

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

        {/* Files List */}
        <View className="gap-3">
          {files.map((file) => (
            <TouchableOpacity 
              key={file.id} 
              className="flex-row items-center justify-between bg-white rounded-xl px-4 py-4"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: file.iconBg }}
                >
                  <Icon name={file.icon} size={24} color={file.iconColor} />
                </View>
                <Text className="text-base font-medium text-gray-900 flex-1">
                  {file.name}
                </Text>
              </View>
              <Text className="text-sm text-gray-400 ml-2">
                {file.size}
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

export default FolderDetailsScreen