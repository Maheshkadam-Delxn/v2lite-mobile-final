// // import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native'
// // import React, { useState } from 'react'
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// // import { useNavigation } from '@react-navigation/native'

// // const FilesScreen = () => {
// //   const navigation = useNavigation()
// //   const [modalVisible, setModalVisible] = useState(false)

// //   const folders = [
// //     { id: 1, name: 'Sample Reports', fileCount: 3 },
// //     { id: 2, name: 'Design Changes', fileCount: 3 },
// //     { id: 3, name: 'RFIs', fileCount: 3 },
// //     { id: 4, name: 'Submittals', fileCount: 3 },
// //   ]

// //   const handleFolderPress = (folderName) => {
// //     navigation.navigate('FolderDetails', { folderName })
// //   }

// //   return (
// //     <View className="flex-1 bg-gray-100">
// //       <ScrollView 
// //         className="flex-1 px-5" 
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={{ paddingBottom: 100 }}
// //       >
// //         {/* Search Bar */}
// //         <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mt-5 mb-5">
// //           <Icon name="magnify" size={20} color="#9CA3AF" />
// //           <TextInput
// //             className="flex-1 ml-2 text-base text-gray-900"
// //             placeholder="Search"
// //             placeholderTextColor="#9CA3AF"
// //           />
// //         </View>

// //         {/* Folders List */}
// //         <View className="gap-3">
// //           {folders.map((folder) => (
// //             <TouchableOpacity 
// //               key={folder.id} 
// //               className="flex-row items-center justify-between bg-white rounded-xl px-4 py-4"
// //               onPress={() => handleFolderPress(folder.name)}
// //             >
// //               <View className="flex-row items-center gap-3">
// //                 <Icon name="folder" size={24} color="#0066FF" />
// //                 <Text className="text-base font-semibold text-gray-900">
// //                   {folder.name}
// //                 </Text>
// //               </View>
// //               <Text className="text-sm text-gray-400">
// //                 {folder.fileCount} Files
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </ScrollView>

// //       {/* Bottom Buttons */}
// //       <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 py-5 bg-gray-100">
// //         <TouchableOpacity 
// //           onPress={() => setModalVisible(true)}
// //           className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center"
// //         >
// //           <Text className="text-base font-semibold text-white">
// //             Add Folder
// //           </Text>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity
// //           onPress={() => navigation.navigate('AddDocumentScreen')}
// //           className="flex-1 bg-blue-500 rounded-xl py-4 items-center justify-center"
// //         >
// //           <Text className="text-base font-semibold text-white">
// //             Add Document
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Add Folder Modal – EXACT MATCH TO YOUR IMAGE */}
// //       <Modal visible={modalVisible} transparent animationType="slide">
// //         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
// //           <View className="flex-1 bg-black/50 justify-end">
// //             <TouchableWithoutFeedback>
// //               <View className="bg-white rounded-t-3xl pb-8">
// //                 {/* Header */}
// //                 <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
// //                   <Text className="text-lg font-semibold text-gray-900">Add Folder</Text>
// //                   <TouchableOpacity onPress={() => setModalVisible(false)}>
// //                     <Icon name="close" size={24} color="#6B7280" />
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Folder Name */}
// //                 <View className="px-6 mt-5">
// //                   <Text className="text-sm text-gray-500 mb-2">Folder Name</Text>
// //                   <TextInput
// //                     className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900"
// //                     placeholder="C 4.1"
// //                     placeholderTextColor="#9CA3AF"
// //                   />
// //                 </View>

// //                 {/* Category */}
// //                 <View className="px-6 mt-5">
// //                   <Text className="text-sm text-gray-500 mb-2">Category</Text>
// //                   <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row justify-between items-center">
// //                     <Text className="text-base text-gray-900">Grading Plan</Text>
// //                     <Icon name="chevron-down" size={20} color="#9CA3AF" />
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Folder Icon */}
// //                 <View className="px-6 mt-5">
// //                   <Text className="text-sm text-gray-500 mb-2">Folder Icon</Text>
// //                   <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row justify-between items-center">
// //                     <Text className="text-base text-gray-900">far-regular far-settings</Text>
// //                     <Icon name="chevron-down" size={20} color="#9CA3AF" />
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Save Button */}
// //                 <TouchableOpacity className="bg-blue-500 mx-6 mt-8 py-4 rounded-xl items-center">
// //                   <Text className="text-white text-base font-semibold">Save</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </TouchableWithoutFeedback>
// //           </View>
// //         </TouchableWithoutFeedback>
// //       </Modal>
// //     </View>
// //   )
// // }

// // export default FilesScreen


// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
// } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { useNavigation, useRoute } from '@react-navigation/native'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// const API_URL = process.env.BASE_API_URL

// const FilesScreen = ({project}) => {

//   console.log("this is id",project._id);
//   const navigation = useNavigation()
//   const route = useRoute()

//   // parent folder if opened inside a folder
//   const parentFolderFromRoute = route?.params?.parentFolderId || null

//   const [folders, setFolders] = useState([])
//   const [loading, setLoading] = useState(false)

//   const [modalVisible, setModalVisible] = useState(false)
//   const [folderName, setFolderName] = useState('')
//   const [selectedParentFolder, setSelectedParentFolder] = useState(null)

//   /* -------------------- FETCH FOLDERS -------------------- */
//   const fetchFolders = async () => {
//     try {
//       setLoading(true)

//       const url = parentFolderFromRoute
//         ? `${API_URL}/api/plan-folders?parentFolder=${parentFolderFromRoute}&projectId=PROJECT_ID`
//         : `${API_URL}/api/plan-folders/${project._id}`
// console.log(url);
//       const res = await fetch(url)
//       const json = await res.json()

//       setFolders(json.data || [])
//     } catch (err) {
//       console.log('Fetch folders error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchFolders()
//   }, [])

//   /* -------------------- CREATE FOLDER -------------------- */
//   const handleCreateFolder = async () => {
//     // if (!folderName.trim()) return
//     console.log(API_URL);

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       console.log(token);
//       await fetch(`${API_URL}/api/plan-folders`, {
//         method: 'POST',
//          headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}` 
//       },
//         body: JSON.stringify({
//           name: folderName,
//           projectId: project._id,
//           parentFolder: selectedParentFolder, // null or folderId
//         }),
//       })

//       setFolderName('')
//       setModalVisible(false)
//       fetchFolders()
//     } catch (err) {
//       console.log('Create folder error:', err)
//     }
//   }

//   /* -------------------- OPEN ADD FOLDER MODAL -------------------- */
//   const openAddFolderModal = (parentId = null) => {
//     setSelectedParentFolder(parentId)
//     setFolderName('')
//     setModalVisible(true)
//   }

//   /* -------------------- OPEN FOLDER -------------------- */
//   const openFolder = (folder) => {
//     navigation.push('FilesScreen', {
//       parentFolderId: folder._id,
//     })
//   }

//   return (
//     <View className="flex-1 bg-gray-100">
//       <ScrollView
//         className="px-5"
//         contentContainerStyle={{ paddingBottom: 120 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Search */}
//         <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mt-5 mb-5">
//           <Icon name="magnify" size={20} color="#9CA3AF" />
//           <TextInput
//             className="flex-1 ml-2 text-base"
//             placeholder="Search"
//             placeholderTextColor="#9CA3AF"
//           />
//         </View>

//         {/* Folder List */}
//         {loading ? (
//           <ActivityIndicator size="large" style={{ marginTop: 40 }} />
//         ) : (
//           <View className="gap-3">
//             {folders.map((folder) => (
//               <TouchableOpacity
//                 key={folder._id}
//                 className="flex-row justify-between bg-white rounded-xl px-4 py-4"
//                 onPress={() => openFolder(folder)}
//                 onLongPress={() => openAddFolderModal(folder._id)}
//               >
//                 <View className="flex-row items-center gap-3">
//                   <Icon name="folder" size={24} color="#2563EB" />
//                   <Text className="text-base font-semibold">
//                     {folder.name}
//                   </Text>
//                 </View>

//                 <Text className="text-gray-400">
//                   {folder.planDocuments?.length || 0} Files
//                 </Text>
//               </TouchableOpacity>
//             ))}

//             {!loading && folders.length === 0 && (
//               <Text className="text-center text-gray-400 mt-10">
//                 No folders found
//               </Text>
//             )}
//           </View>
//         )}
//       </ScrollView>

//       {/* Bottom Buttons */}
//       <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 px-5 py-5 bg-gray-100">
//         <TouchableOpacity
//           onPress={() => openAddFolderModal(null)}
//           className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
//         >
//           <Text className="text-white font-semibold">Add Folder</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => navigation.navigate('AddDocumentScreen')}
//           className="flex-1 bg-blue-500 py-4 rounded-xl items-center"
//         >
//           <Text className="text-white font-semibold">Add Document</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Add Folder Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//           <View className="flex-1 bg-black/50 justify-end">
//             <TouchableWithoutFeedback>
//               <View className="bg-white rounded-t-3xl pb-8">
//                 {/* Header */}
//                 <View className="flex-row justify-between px-6 py-5 border-b">
//                   <Text className="text-lg font-semibold">Add Folder</Text>
//                   <TouchableOpacity onPress={() => setModalVisible(false)}>
//                     <Icon name="close" size={24} />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Input */}
//                 <View className="px-6 mt-5">
//                   <Text className="text-sm text-gray-500 mb-2">
//                     Folder Name
//                   </Text>
//                   <TextInput
//                     value={folderName}
//                     onChangeText={setFolderName}
//                     className="border rounded-xl px-4 py-3"
//                     placeholder="Enter folder name"
//                   />
//                 </View>

//                 {/* Save */}
//                 <TouchableOpacity
//                   onPress={handleCreateFolder}
//                   className="bg-blue-500 mx-6 mt-8 py-4 rounded-xl items-center"
//                 >
//                   <Text className="text-white font-semibold">Save</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   )
// }

// export default FilesScreen
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = process.env.BASE_API_URL

const FilesScreen = ({ project }) => {
  const navigation = useNavigation()
  const route = useRoute()

  // parent folder if opened inside a folder
  const parentFolderFromRoute = route?.params?.parentFolderId || null

  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [selectedParentFolder, setSelectedParentFolder] = useState(null)

  /* -------------------- FETCH FOLDERS -------------------- */
  const fetchFolders = async () => {
    try {
      setLoading(true)

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken')
      
      if (!token) {
        console.log('No token found')
        return
      }

      // Build URL based on whether we're in a subfolder or root
      let url
      if (parentFolderFromRoute) {
        // Fetching subfolders of a specific folder
        url = `${API_URL}/api/plan-folders?parentFolder=${parentFolderFromRoute}&projectId=${project._id}`
      } else {
        // Fetching root folders for the project
        url = `${API_URL}/api/plan-folders/${project._id}`
      }

      console.log('Fetching folders from:', url)

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const json = await res.json()
      console.log('Folders response:', json)
      
      setFolders(json.data || json || [])
    } catch (err) {
      console.log('Fetch folders error:', err)
      // Optionally show error to user
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (project?._id) {
      fetchFolders()
    }
  }, [project?._id, parentFolderFromRoute])

  /* -------------------- CREATE FOLDER -------------------- */
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      console.log('Folder name is required')
      return
    }

    if (!project?._id) {
      console.log('Project ID is required')
      return
    }

    try {
      const token = await AsyncStorage.getItem('userToken')
      
      if (!token) {
        console.log('No token found')
        return
      }

      console.log('Creating folder with:', {
        name: folderName,
        projectId: project._id,
        parentFolder: selectedParentFolder
      })

      const response = await fetch(`${API_URL}/api/plan-folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: folderName,
          projectId: project._id,
          parentFolder: selectedParentFolder, // null or folderId
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create folder: ${errorText}`)
      }

      const result = await response.json()
      console.log('Folder created successfully:', result)

      // Reset and refresh
      setFolderName('')
      setModalVisible(false)
      fetchFolders()
    } catch (err) {
      console.log('Create folder error:', err)
      // Optionally show error to user
    }
  }

  /* -------------------- OPEN ADD FOLDER MODAL -------------------- */
  const openAddFolderModal = (parentId = null) => {
    setSelectedParentFolder(parentId)
    setFolderName('')
    setModalVisible(true)
  }

  /* -------------------- OPEN FOLDER -------------------- */
  /* -------------------- OPEN FOLDER -------------------- */
/* -------------------- OPEN FOLDER -------------------- */
const openFolder = (folder) => {
  // Check if we're already in this folder
  if (parentFolderFromRoute === folder._id) {
    return; // Already in this folder
  }
  console.log("this is me",folder);
  navigation.navigate('FolderDetails', {
    parentFolderId: folder._id,
    folderName: folder.name,
    project: project
  })
}

  /* -------------------- NAVIGATE TO ADD DOCUMENT -------------------- */
  const navigateToAddDocument = () => {
    navigation.navigate('AddDocumentScreen', {
      projectId: project._id,
      parentFolderId: selectedParentFolder || parentFolderFromRoute
    })
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header showing current location */}
        {parentFolderFromRoute && (
          <View className="mt-5 mb-3">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="flex-row items-center"
            >
              <Icon name="arrow-left" size={20} color="#2563EB" />
              <Text className="ml-2 text-blue-500">Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mt-2 mb-5">
          <Icon name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search folders..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Folder List */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
        ) : (
          <View className="gap-3">
            {folders.map((folder) => (
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
                    {folder.description && (
                      <Text className="text-sm text-gray-500 mt-1">
                        {folder.description}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-400 mr-2">
                    {folder.planDocuments?.length || 0} files
                  </Text>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}

            {!loading && folders.length === 0 && (
              <View className="items-center mt-10">
                <Icon name="folder-open" size={60} color="#D1D5DB" />
                <Text className="text-lg text-gray-400 mt-4">
                  No folders found
                </Text>
                <Text className="text-sm text-gray-400 mt-2">
                  {parentFolderFromRoute 
                    ? 'This folder is empty' 
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
          onPress={() => openAddFolderModal(parentFolderFromRoute)}
          className="flex-1 bg-blue-500 py-4 rounded-xl items-center justify-center flex-row"
        >
          <Icon name="folder-plus" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Folder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToAddDocument}
          className="flex-1 bg-blue-500 py-4 rounded-xl items-center justify-center flex-row"
        >
          <Icon name="file-plus" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Add Document</Text>
        </TouchableOpacity>
      </View>

      {/* Add Folder Modal */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl">
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-5 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900">
                    {selectedParentFolder ? 'Add Subfolder' : 'Add Folder'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
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
    </View>
  )
}

export default FilesScreen