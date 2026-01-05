import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import Header from '../../components/Header' // Import the Header component

// Static project data (you can replace this with your actual project data)
const STATIC_PROJECT = {
  _id: 'project_123',
  name: 'My Project',
  description: 'Sample project for file management'
}

const TemplatePlanScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  // Static data
  const [project, setProject] = useState(STATIC_PROJECT)
  
  // parent folder if opened inside a folder
  const parentFolderFromRoute = route?.params?.parentFolderId || null
  const [currentFolderName, setCurrentFolderName] = useState(route?.params?.folderName || 'Template Plans')
  const [currentFolderId, setCurrentFolderId] = useState(parentFolderFromRoute)

  // Static initial folders data
  const initialFolders = [
    {
      _id: 'folder_1',
      name: 'Project Plans',
      description: 'All project planning documents',
      planDocuments: [],
      parentFolder: null,
      createdAt: '2024-01-15'
    },
    {
      _id: 'folder_2',
      name: 'Design Files',
      description: 'UI/UX design assets',
      planDocuments: [],
      parentFolder: null,
      createdAt: '2024-01-16'
    },
    {
      _id: 'folder_3',
      name: 'Meeting Notes',
      description: 'All meeting minutes and notes',
      planDocuments: [],
      parentFolder: null,
      createdAt: '2024-01-17'
    }
  ]

  const [folders, setFolders] = useState(initialFolders)
  const [allDocuments, setAllDocuments] = useState([]) // Store ALL documents here
  const [loading, setLoading] = useState(false)
  
  // Folder creation modal
  const [folderModalVisible, setFolderModalVisible] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [selectedParentFolder, setSelectedParentFolder] = useState(null)
  
  // Document upload modal
  const [documentModalVisible, setDocumentModalVisible] = useState(false)
  const [selectedFolderForDocument, setSelectedFolderForDocument] = useState(null)
  const [documentName, setDocumentName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  /* -------------------- FETCH FOLDERS (STATIC) -------------------- */
  const fetchFolders = () => {
    setLoading(true)
    setTimeout(() => {
      if (currentFolderId) {
        // If inside a folder, show subfolders of this folder
        const subfolders = folders.filter(folder => 
          folder.parentFolder === currentFolderId
        )
        setFolders(subfolders)
      } else {
        // Show root folders
        const rootFolders = folders.filter(folder => !folder.parentFolder)
        setFolders(rootFolders)
      }
      setLoading(false)
    }, 500) // Simulate network delay
  }

  useEffect(() => {
    fetchFolders()
  }, [currentFolderId])

  /* -------------------- GET ALL FOLDERS (FLATTENED) -------------------- */
  const getAllFolders = () => {
    return folders.filter(folder => !folder.parentFolder) // Get only root folders for simplicity
  }

  /* -------------------- GET DOCUMENTS FOR CURRENT FOLDER -------------------- */
  const getDocumentsForCurrentFolder = () => {
    if (!currentFolderId) {
      // If in root, show documents that don't belong to any folder
      return allDocuments.filter(doc => !doc.folderId)
    }
    // If inside a folder, show documents for this folder
    return allDocuments.filter(doc => doc.folderId === currentFolderId)
  }

  /* -------------------- CREATE FOLDER (STATIC) -------------------- */
  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Folder name is required')
      return
    }

    const newFolder = {
      _id: `folder_${Date.now()}`,
      name: folderName,
      description: '',
      planDocuments: [],
      parentFolder: selectedParentFolder || currentFolderId, // Use current folder as parent if creating inside
      createdAt: new Date().toISOString()
    }

    // Update folders list
    setFolders(prev => [...prev, newFolder])
    
    // Reset and close modal
    setFolderName('')
    setFolderModalVisible(false)
    
    Alert.alert('Success', 'Folder created successfully')
  }

  /* -------------------- OPEN ADD FOLDER MODAL -------------------- */
  const openAddFolderModal = (parentId = null) => {
    setSelectedParentFolder(parentId || currentFolderId)
    setFolderName('')
    setFolderModalVisible(true)
  }

  /* -------------------- OPEN FOLDER -------------------- */
  const openFolder = (folder) => {
    if (currentFolderId === folder._id) {
      return
    }
    
    // Update current folder state
    setCurrentFolderId(folder._id)
    setCurrentFolderName(folder.name)
  }

  /* -------------------- GO BACK TO PARENT FOLDER -------------------- */
  const goBack = () => {
    if (currentFolderId) {
      // Find current folder to get its parent
      const currentFolder = folders.find(f => f._id === currentFolderId)
      if (currentFolder) {
        // Find parent folder
        const parentFolder = folders.find(f => f._id === currentFolder.parentFolder)
        setCurrentFolderId(currentFolder.parentFolder)
        setCurrentFolderName(parentFolder ? parentFolder.name : 'Template Plans')
      } else {
        // Go to root
        setCurrentFolderId(null)
        setCurrentFolderName('Template Plans')
      }
    } else {
      // If already in root, go back to previous screen
      navigation.goBack()
    }
  }

  /* -------------------- HANDLE FILE SELECTION -------------------- */
  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (result.type === 'success') {
        setSelectedFile({
          uri: result.uri,
          name: result.name,
          type: result.mimeType,
          size: result.size
        })
        setDocumentName(result.name.split('.')[0]) // Set initial name without extension
      }
    } catch (error) {
      console.log('Error selecting file:', error)
      Alert.alert('Error', 'Failed to select file')
    }
  }

  /* -------------------- SELECT IMAGE -------------------- */
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      })

      if (!result.canceled) {
        const asset = result.assets[0]
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize
        })
        setDocumentName('Image Document')
      }
    } catch (error) {
      console.log('Error selecting image:', error)
      Alert.alert('Error', 'Failed to select image')
    }
  }

  /* -------------------- UPLOAD DOCUMENT (STATIC) -------------------- */
  const handleUploadDocument = () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload')
      return
    }

    if (!documentName.trim()) {
      Alert.alert('Error', 'Please enter a document name')
      return
    }

    setUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      const newDocument = {
        _id: `doc_${Date.now()}`,
        name: documentName,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        folderId: selectedFolderForDocument || currentFolderId, // Use selected or current folder
        uploadDate: new Date().toISOString(),
        thumbnail: selectedFile.type.startsWith('image/') ? selectedFile.uri : null
      }

      // Add document to all documents list
      setAllDocuments(prev => [...prev, newDocument])
      
      // Update folder's document count in folders array
      const targetFolderId = selectedFolderForDocument || currentFolderId
      if (targetFolderId) {
        setFolders(prev => prev.map(folder => 
          folder._id === targetFolderId 
            ? { 
                ...folder, 
                planDocuments: [...(folder.planDocuments || []), newDocument._id] 
              }
            : folder
        ))
      }

      // Reset and close modal
      setSelectedFile(null)
      setDocumentName('')
      setSelectedFolderForDocument(null)
      setDocumentModalVisible(false)
      setUploading(false)
      
      Alert.alert('Success', 'Document uploaded successfully')
    }, 1500)
  }

  /* -------------------- OPEN ADD DOCUMENT MODAL -------------------- */
  const openAddDocumentModal = () => {
    setSelectedFolderForDocument(currentFolderId) // Default to current folder
    setSelectedFile(null)
    setDocumentName('')
    setDocumentModalVisible(true)
  }

  /* -------------------- RENDER FILE ICON -------------------- */
  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return 'image'
    if (fileType?.includes('pdf')) return 'file-pdf-box'
    if (fileType?.includes('word') || fileType?.includes('document')) return 'file-word-box'
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return 'file-excel-box'
    if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return 'file-powerpoint-box'
    return 'file'
  }

  /* -------------------- FORMAT FILE SIZE -------------------- */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /* -------------------- GET FOLDER DOCUMENT COUNT -------------------- */
  const getFolderDocumentCount = (folderId) => {
    return allDocuments.filter(doc => doc.folderId === folderId).length
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
      
      {/* Imported Header Component */}
      <Header 
        title={currentFolderName}
        showBackButton={true}
        onBackPress={goBack}
      />

      <View className="flex-1 bg-gray-100">
        <ScrollView
          className="px-5"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search */}
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mt-4 mb-5">
            <Icon name="magnify" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search folders and documents..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Folder List */}
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
          ) : (
            <View className="gap-3">
              {/* Show folders for current location */}
              {folders
                .filter(folder => folder.parentFolder === currentFolderId)
                .map((folder) => (
                  <TouchableOpacity
                    key={folder._id}
                    className="flex-row justify-between items-center bg-white rounded-xl px-4 py-4"
                    onPress={() => openFolder(folder)}
                    onLongPress={() => openAddFolderModal(folder._id)}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <Icon name="folder" size={24} color="#2563EB" />
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {folder.name}
                        </Text>
                        {folder.description ? (
                          <Text className="text-sm text-gray-500 mt-1">
                            {folder.description}
                          </Text>
                        ) : (
                          <Text className="text-sm text-gray-400 mt-1">
                            Created {new Date(folder.createdAt).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-400 mr-2">
                        {getFolderDocumentCount(folder._id)} files
                      </Text>
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}

              {/* Documents List for current folder */}
              {getDocumentsForCurrentFolder().map((document) => (
                <TouchableOpacity
                  key={document._id}
                  className="flex-row justify-between items-center bg-white rounded-xl px-4 py-4 mt-2"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Icon 
                      name={getFileIcon(document.fileType)} 
                      size={24} 
                      color="#EF4444" 
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {document.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {document.fileName} • {formatFileSize(document.fileSize)} • 
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  
                  {document.thumbnail && (
                    <Image 
                      source={{ uri: document.thumbnail }}
                      className="w-12 h-12 rounded-lg ml-2"
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              ))}

              {/* Empty State */}
              {!loading && 
                folders.filter(folder => folder.parentFolder === currentFolderId).length === 0 && 
                getDocumentsForCurrentFolder().length === 0 && (
                <View className="items-center mt-10">
                  <Icon name="folder-open" size={60} color="#D1D5DB" />
                  <Text className="text-lg text-gray-400 mt-4">
                    {currentFolderId ? 'This folder is empty' : 'No folders or documents found'}
                  </Text>
                  <Text className="text-sm text-gray-400 mt-2">
                    {currentFolderId 
                      ? 'Add folders or upload documents to get started' 
                      : 'Create your first folder to get started'
                    }
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom Buttons */}
        <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 py-5 bg-gray-100">
          <TouchableOpacity
            onPress={() => openAddFolderModal(currentFolderId)}
            className="flex-1 bg-blue-500 py-4 rounded-xl items-center justify-center flex-row"
          >
            <Icon name="folder-plus" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openAddDocumentModal}
            className="flex-1 bg-blue-500 py-4 rounded-xl items-center justify-center flex-row"
          >
            <Icon name="file-plus" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Document</Text>
          </TouchableOpacity>
        </View>

        {/* Add Folder Modal */}
        <Modal 
          visible={folderModalVisible} 
          transparent 
          animationType="slide"
          onRequestClose={() => setFolderModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setFolderModalVisible(false)}>
            <View className="flex-1 bg-black/50 justify-end">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl">
                  {/* Header */}
                  <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                    <Text className="text-lg font-semibold text-gray-900">
                      {selectedParentFolder ? 'Add Subfolder' : 'Add Folder'}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setFolderModalVisible(false)}
                      className="p-2"
                    >
                      <Icon name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Folder Name Input */}
                  <View className="px-6 mt-5">
                    <Text className="text-sm text-gray-500 mb-2">
                      Folder Name
                    </Text>
                    <TextInput
                      value={folderName}
                      onChangeText={setFolderName}
                      className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                      placeholder="Enter folder name"
                      placeholderTextColor="#9CA3AF"
                      autoFocus
                    />
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={handleCreateFolder}
                    disabled={!folderName.trim()}
                    className={`mx-6 mt-8 mb-8 py-4 rounded-xl items-center ${
                      folderName.trim() ? 'bg-blue-500' : 'bg-blue-300'
                    }`}
                  >
                    <Text className="text-white text-base font-semibold">
                      Save Folder
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Add Document Modal */}
        <Modal 
          visible={documentModalVisible} 
          transparent 
          animationType="slide"
          onRequestClose={() => setDocumentModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setDocumentModalVisible(false)}>
            <View className="flex-1 bg-black/50 justify-end">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl max-h-[90%]">
                  {/* Header */}
                  <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                    <Text className="text-lg font-semibold text-gray-900">
                      Upload Document
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setDocumentModalVisible(false)}
                      className="p-2"
                    >
                      <Icon name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                    {/* Select Destination Folder */}
                    <View className="mt-5">
                      <Text className="text-sm text-gray-500 mb-2">
                        Select Destination Folder
                      </Text>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        className="flex-row gap-2"
                      >
                        {/* Root Option */}
                        <TouchableOpacity
                          onPress={() => setSelectedFolderForDocument(null)}
                          className={`px-4 py-3 rounded-lg flex-row items-center ${
                            selectedFolderForDocument === null 
                              ? 'bg-blue-100 border border-blue-500' 
                              : 'bg-gray-100'
                          }`}
                        >
                          <Icon 
                            name="folder" 
                            size={18} 
                            color={selectedFolderForDocument === null ? "#2563EB" : "#6B7280"} 
                          />
                          <Text className={`ml-2 ${
                            selectedFolderForDocument === null 
                              ? 'text-blue-600 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            Root
                          </Text>
                        </TouchableOpacity>
                        
                        {/* All Available Folders */}
                        {getAllFolders().map(folder => (
                          <TouchableOpacity
                            key={folder._id}
                            onPress={() => setSelectedFolderForDocument(folder._id)}
                            className={`px-4 py-3 rounded-lg flex-row items-center ${
                              selectedFolderForDocument === folder._id 
                                ? 'bg-blue-100 border border-blue-500' 
                                : 'bg-gray-100'
                            }`}
                          >
                            <Icon 
                              name="folder" 
                              size={18} 
                              color={selectedFolderForDocument === folder._id ? "#2563EB" : "#6B7280"} 
                            />
                            <Text className={`ml-2 ${
                              selectedFolderForDocument === folder._id 
                                ? 'text-blue-600 font-medium' 
                                : 'text-gray-600'
                            }`}>
                              {folder.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      
                      {/* Current Selection Display */}
                      <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Text className="text-sm text-gray-600">
                          Uploading to:{' '}
                          <Text className="font-semibold">
                            {selectedFolderForDocument === null 
                              ? 'Root' 
                              : folders.find(f => f._id === selectedFolderForDocument)?.name || 'Selected Folder'
                            }
                          </Text>
                        </Text>
                        {selectedFolderForDocument && (
                          <Text className="text-xs text-gray-500 mt-1">
                            Contains {getFolderDocumentCount(selectedFolderForDocument)} document(s)
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Document Name Input */}
                    <View className="mt-5">
                      <Text className="text-sm text-gray-500 mb-2">
                        Document Name
                      </Text>
                      <TextInput
                        value={documentName}
                        onChangeText={setDocumentName}
                        className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
                        placeholder="Enter document name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    {/* File Selection */}
                    <View className="mt-5">
                      <Text className="text-sm text-gray-500 mb-2">
                        Select File
                      </Text>
                      
                      <View className="flex-row gap-3">
                        <TouchableOpacity
                          onPress={selectFile}
                          className="flex-1 bg-gray-100 border border-gray-300 rounded-xl p-4 items-center"
                        >
                          <Icon name="file-upload" size={32} color="#4B5563" />
                          <Text className="text-gray-700 font-medium mt-2">
                            Any File
                          </Text>
                          <Text className="text-gray-500 text-sm text-center mt-1">
                            PDF, DOC, XLS, etc.
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={selectImage}
                          className="flex-1 bg-gray-100 border border-gray-300 rounded-xl p-4 items-center"
                        >
                          <Icon name="image" size={32} color="#4B5563" />
                          <Text className="text-gray-700 font-medium mt-2">
                            Image
                          </Text>
                          <Text className="text-gray-500 text-sm text-center mt-1">
                            JPG, PNG, etc.
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Selected File Preview */}
                      {selectedFile && (
                        <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <View className="flex-row items-center">
                            <Icon 
                              name={getFileIcon(selectedFile.type)} 
                              size={24} 
                              color="#2563EB" 
                            />
                            <View className="ml-3 flex-1">
                              <Text className="font-medium text-gray-900">
                                {selectedFile.name}
                              </Text>
                              <Text className="text-sm text-gray-600 mt-1">
                                {formatFileSize(selectedFile.size)}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => setSelectedFile(null)}
                              className="p-2"
                            >
                              <Icon name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Upload Button */}
                    <TouchableOpacity
                      onPress={handleUploadDocument}
                      disabled={!selectedFile || !documentName.trim() || uploading}
                      className={`mt-8 mb-8 py-4 rounded-xl items-center ${
                        selectedFile && documentName.trim() && !uploading 
                          ? 'bg-blue-500' 
                          : 'bg-blue-300'
                      }`}
                    >
                      {uploading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white text-base font-semibold">
                          {selectedFolderForDocument === null 
                            ? 'Upload to Root' 
                            : `Upload to ${folders.find(f => f._id === selectedFolderForDocument)?.name || 'Folder'}`
                          }
                        </Text>
                      )}
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default TemplatePlanScreen