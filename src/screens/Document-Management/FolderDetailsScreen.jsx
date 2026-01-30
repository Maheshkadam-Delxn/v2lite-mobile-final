import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '@/components/Header'
import * as Crypto from 'expo-crypto'

const API_URL = process.env.BASE_API_URL
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
}

const FolderDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const generateSignature = async (timestamp) => {
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      stringToSign
    )
  }

  const { folderId, folderName, parentFolderId, project } = route.params

  const [subFolders, setSubFolders] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [docModalVisible, setDocModalVisible] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  /* -------------------- FETCH FOLDER CONTENT -------------------- */
  const fetchFolderContent = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      // Fetch subfolders
      const res = await fetch(
        `${API_URL}/api/plan-folders?parentFolder=${folderId}&projectId=${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const json = await res.json()
      setSubFolders(json.data || [])
      
      return json.data || []
    } catch (err) {
      console.log('Fetch folder content error:', err)
      return []
    }
  }

  /* -------------------- FETCH DOCUMENTS -------------------- */
  const fetchDocuments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      const res = await fetch(
        `${API_URL}/api/plan-folders/document/${parentFolderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const json = await res.json()

      if (json.success) {
        setDocuments(json.data)
        return json.data
      }
      return []
    } catch (err) {
      console.log('Fetch documents error:', err)
      return []
    }
  }

  /* -------------------- LOAD ALL DATA -------------------- */
  const loadAllData = async () => {
    try {
      setLoading(true)
      const [foldersResult, docsResult] = await Promise.all([
        fetchFolderContent(),
        fetchDocuments()
      ])
      
      // Data is now loaded
      setDataLoaded(true)
    } catch (error) {
      console.log('Load all data error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  /* -------------------- ON REFRESH (Pull-to-refresh) -------------------- */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    loadAllData()
  }, [])

  useEffect(() => {
    loadAllData()
  }, [])

  /* -------------------- UPLOAD TO CLOUDINARY -------------------- */
  const uploadToCloudinary = async (file) => {
    try {
      const timestamp = Math.round(Date.now() / 1000)
      const signature = await generateSignature(timestamp)

      const isImage = file.mimeType?.startsWith('image')
      const uploadType = isImage ? 'image' : 'raw'

      const formData = new FormData()
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      })
      formData.append('timestamp', timestamp.toString())
      formData.append('signature', signature)
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey)

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${uploadType}/upload`

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = await res.json()

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || 'Cloudinary upload failed')
      }

      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        type: uploadType,
      }
    } catch (err) {
      console.log('Cloudinary error:', err)
      return { success: false, error: err.message }
    }
  }

  /* -------------------- OPEN SUBFOLDER -------------------- */
  const openSubFolder = (folder) => {
    navigation.push('FolderDetailsScreen', {
      folderId: folder._id,
      folderName: folder.name,
      project,
    })
  }

  /* -------------------- ADD DOCUMENT -------------------- */
  const addDocument = () => {
    setDocModalVisible(true)
  }

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    })

    if (result.canceled) return

    const file = result.assets[0]
    setUploading(true)

    const uploadResult = await uploadToCloudinary(file)

    setUploading(false)

    if (uploadResult.success) {
      setSelectedFile({
        name: file.name,
        url: uploadResult.url,
        type: uploadResult.type,
      })
    } else {
      Alert.alert('Upload Failed', uploadResult.error)
    }
  }

  const submitDocument = async () => {
    if (!docTitle || !selectedFile?.url) {
      Alert.alert('Error', 'Document name and upload are required')
      return
    }

    try {
      setUploading(true)
      const token = await AsyncStorage.getItem('userToken')

      const payload = {
        documentName: docTitle,
        imageUrl: selectedFile.url,
      }

      const res = await fetch(
        `${API_URL}/api/plan-folders/document/${parentFolderId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const json = await res.json()

      if (json.success) {
        Alert.alert('Success', 'Document added')
        setDocModalVisible(false)
        setDocTitle('')
        setSelectedFile(null)
        // Refresh data after adding document
        loadAllData()
      } else {
        Alert.alert('Error', json.message || 'Failed')
      }
    } catch (err) {
      console.log('Submit document error:', err)
      Alert.alert('Error', 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  /* -------------------- RENDER LOADING -------------------- */
  if (loading) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header title={folderName} showBackButton={true} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-4">Loading folder content...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title={folderName} showBackButton={true} />

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      >
        {/* Subfolders */}
        {subFolders.length > 0 && (
          <>
            <Text className="text-sm text-gray-500 mt-5 mb-2">Folders</Text>
            {subFolders.map((folder) => (
              <TouchableOpacity
                key={folder._id}
                className="flex-row justify-between bg-white rounded-xl px-4 py-4 mb-3"
                onPress={() => openSubFolder(folder)}
              >
                <View className="flex-row items-center gap-3">
                  <Icon name="folder" size={24} color="#2563EB" />
                  <Text className="text-base font-semibold">{folder.name}</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <>
            <Text className="text-sm text-gray-500 mt-6 mb-2">Documents</Text>
            {documents.map((doc) => (
              <TouchableOpacity
                key={doc._id}
                onPress={() =>
                  navigation.navigate('viewDocument', {
                    document: doc,
                    folderId: parentFolderId,
                  })
                }
                className="flex-row justify-between bg-white rounded-xl px-4 py-4 mb-3"
              >
                <View className="flex-row items-center gap-3">
                  <Icon name="file-pdf-box" size={24} color="#EF4444" />
                  <Text className="text-base font-semibold">{doc.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Only show empty state AFTER data has been loaded and there's truly no content */}
        {dataLoaded && subFolders.length === 0 && documents.length === 0 && (
          <View className="items-center mt-16">
            <Icon name="folder-open" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4">This folder is empty</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 py-5 bg-gray-100">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FilesScreen', {
              parentFolderId: folderId,
              project,
            })
          }
          className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Add Folder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={addDocument}
          className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Add Document</Text>
        </TouchableOpacity>
      </View>

      {/* Document Modal */}
      <Modal visible={docModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-5 py-6">
            <Text className="text-lg font-semibold mb-4">Add Document</Text>

            {/* Document Name */}
            <TextInput
              placeholder="Document Name"
              value={docTitle}
              onChangeText={setDocTitle}
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4"
            />

            {/* File Picker */}
            <TouchableOpacity
              onPress={pickFile}
              className="bg-gray-100 rounded-xl px-4 py-4 mb-3 flex-row items-center gap-3"
            >
              <Icon name="upload" size={22} color="#2563EB" />
              <Text className="text-gray-700">
                {selectedFile ? selectedFile.name : 'Upload PDF or Image'}
              </Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setDocModalVisible(false)}
                className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={submitDocument}
                disabled={uploading}
                className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default FolderDetailsScreen    