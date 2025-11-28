import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Header from 'components/Header';

// Mock file upload function
const uploadFile = async (file) => {
  // Simulate file upload with progress
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve({
          id: Date.now().toString(),
          title: file.name,
          size: formatFileSize(file.size),
          progress: 100,
          isInProgress: true,
        });
      }
    }, 300);
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentItem = ({ item, onPress }) => {
  if (item.isInProgress) {
    return (
      <TouchableOpacity 
        className="flex-row items-center bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-200"
        onPress={() => onPress(item)}
      >
        <View className="mr-4">
          <MaterialIcons name="insert-drive-file" size={32} color="#0066FF" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">{item.size}</Text>
          <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${item.progress}%` }} 
            />
          </View>
        </View>
        <View className="ml-3">
          {item.progress === 100 ? (
            <Feather name="check-circle" size={24} color="#10B981" />
          ) : (
            <Feather name="upload-cloud" size={20} color="#6B7280" />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      className="flex-row items-center bg-white mx-4 mb-3 p-4 rounded-xl border border-gray-200"
      onPress={() => onPress(item)}
    >
      <View className="mr-4">
        <MaterialIcons name="insert-drive-file" size={32} color="#10B981" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 mb-1" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-sm text-gray-500">{item.uploadedAt}</Text>
      </View>
      <Feather name="check-circle" size={24} color="#10B981" />
    </TouchableOpacity>
  );
};

const AddDocumentScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'SampleRiskReport.xlsx',
      size: '450 KB',
      progress: 80,
      isInProgress: true,
    },
    {
      id: '2',
      title: 'SampleReport.pdf',
      size: '1.2 MB',
      progress: 100,
      isInProgress: true,
    },
    {
      id: '3',
      title: 'SampleSVReport.xlsx',
      size: '320 KB',
      uploadedAt: '30 min ago',
    },
    {
      id: '4',
      title: 'SampleReport.pdf',
      size: '800 KB',
      uploadedAt: '2 hours ago',
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleDocumentPress = (document) => {
    Alert.alert(
      document.title,
      `Size: ${document.size}\n${document.uploadedAt ? `Uploaded: ${document.uploadedAt}` : `Progress: ${document.progress}%`}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => viewDocumentDetails(document) },
        document.isInProgress && document.progress === 100 
          ? { text: 'Mark Complete', onPress: () => markDocumentComplete(document.id) }
          : null,
      ].filter(Boolean)
    );
  };

  const viewDocumentDetails = (document) => {
    Alert.alert('Document Details', 
      `Name: ${document.title}\nSize: ${document.size}\nStatus: ${document.isInProgress ? 'In Progress' : 'Completed'}\n${document.uploadedAt ? `Uploaded: ${document.uploadedAt}` : `Progress: ${document.progress}%`}`
    );
  };

  const markDocumentComplete = (documentId) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === documentId
          ? {
              ...doc,
              isInProgress: false,
              uploadedAt: 'Just now',
            }
          : doc
      )
    );
    Alert.alert('Success', 'Document marked as complete!');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'All Files', 'PDF Only', 'Excel Only', 'Images Only'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          const filters = ['All Files', 'PDF Only', 'Excel Only', 'Images Only'];
          Alert.alert('Filter Selected', `Showing: ${filters[buttonIndex - 1]}`);
        }
      );
    } else {
      Alert.alert('Filter', 'Filter functionality would open a modal on Android');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // Add new document to in-progress list
        const newDocument = {
          id: Date.now().toString(),
          title: result.name,
          size: formatFileSize(result.size),
          progress: 0,
          isInProgress: true,
        };

        setDocuments(prevDocs => [newDocument, ...prevDocs]);

        // Simulate upload progress
        simulateUploadProgress(newDocument.id);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const simulateUploadProgress = (documentId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update document to completed state after a delay
        setTimeout(() => {
          setDocuments(prevDocs =>
            prevDocs.map(doc =>
              doc.id === documentId
                ? {
                    ...doc,
                    progress: 100,
                  }
                : doc
            )
          );
        }, 500);
      } else {
        setDocuments(prevDocs =>
          prevDocs.map(doc =>
            doc.id === documentId
              ? {
                  ...doc,
                  progress: Math.min(progress, 99),
                }
              : doc
          )
        );
      }
    }, 300);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const filteredDocuments = {
    inProgress: documents.filter(d => 
      d.isInProgress && 
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    recentlyUploaded: documents.filter(d => 
      !d.isInProgress && 
      d.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const renderItem = ({ item }) => (
    <DocumentItem item={item} onPress={handleDocumentPress} />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Upload Documents"
        // rightIcon="filter-outline"
        // onRightIconPress={handleFilterPress}
        onBackPress={handleBackPress}
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />
      
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-3 h-11">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            ref={searchInputRef}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-base text-gray-900"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* In Progress Section */}
      {filteredDocuments.inProgress.length > 0 && (
        <>
          <View className="px-4 py-3">
            <Text className="text-base font-bold text-gray-900">In Progress</Text>
          </View>
          <FlatList
            data={filteredDocuments.inProgress}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Recently Uploaded Section */}
      {filteredDocuments.recentlyUploaded.length > 0 && (
        <>
          <View className="px-4 py-3">
            <Text className="text-base font-bold text-gray-900">Recently Uploaded</Text>
          </View>
          <FlatList
            data={filteredDocuments.recentlyUploaded}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Empty State */}
      {filteredDocuments.inProgress.length === 0 && filteredDocuments.recentlyUploaded.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Feather name="file" size={64} color="#9CA3AF" />
          <Text className="text-lg text-gray-500 mt-4">No documents found</Text>
          <Text className="text-sm text-gray-400 mt-2">
            {searchQuery ? 'Try a different search term' : 'Upload your first document'}
          </Text>
        </View>
      )}

      {/* Browse Button */}
      <TouchableOpacity 
        className="flex-row items-center justify-center bg-blue-600 mx-4 my-6 py-4 rounded-xl active:bg-blue-700"
        onPress={pickDocument}
        activeOpacity={0.8}
      >
        <Feather name="paperclip" size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-2">Browse a File</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddDocumentScreen;