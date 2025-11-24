import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from 'components/Header'

const FolderDetailsScreen = ({ route, navigation }) => {
  const { folderName } = route.params || { folderName: 'Sample Reports' }
  
  const [modalVisible, setModalVisible] = useState(false)

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
      iconColor: '#0066FF',
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
      <Header title="Sample Reports" showBackButton={true} onRightIconPress={() => {}} backgroundColor="#0066FF" titleColor="white" iconColor="white" />
      
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

      {/* Add Folder Modal – 100% Match to Your Image */}
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

                {/* Form Fields */}
                <View className="px-6 mt-5">
                  <Text className="text-sm text-gray-500 mb-2">Folder Name</Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                    placeholder="C 4.1"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View className="px-6 mt-5">
                  <Text className="text-sm text-gray-500 mb-2">Category</Text>
                  <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row justify-between items-center">
                    <Text className="text-base text-gray-900">Grading Plan</Text>
                    <Icon name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

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

export default FolderDetailsScreen