// AssignedSnagDetail.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';

const AssignedSnag = () => {
  const navigation = useNavigation();
  const [isFixed, setIsFixed] = useState(false);
  const [addNotesVisible, setAddNotesVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const openAddNotes = () => setAddNotesVisible(true);
  const closeAddNotes = () => {
    setAddNotesVisible(false);
    setNoteText('');
  };

  // Upload Photo Functionality
  const handleUploadPhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const newPhoto = {
        id: Date.now(),
        uri: result.assets[0].uri,
        title: `Photo ${uploadedPhotos.length + 1}`,
      };
      setUploadedPhotos(prev => [...prev, newPhoto]);
    }
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      {/* Header */}
      <Header
        title="Assigned Snag"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="p-5">

          {/* Clickable Snag Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SnagDetailScreen')}
            className="bg-white rounded-2xl shadow-xl shadow-black/10 elevation-6 relative overflow-hidden"
          >
            {/* Full-height Blue Left Border */}
            <View className="absolute left-0 top-0 w-1 h-full bg-blue-500" />

            {/* Content */}
            <View className="ml-4 p-5">
              {/* ID + Status */}
              <View className="flex-row justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <Text className="text-2xl font-extrabold text-gray-800">SNAG-1001</Text>
                <View className="bg-amber-100 px-3.5 py-1.5 rounded-full">
                  <Text className="text-amber-600 text-sm font-bold">In Progress</Text>
                </View>
              </View>

              {/* Details */}
              <View className="mb-5">
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-base text-gray-500 font-medium">Project :</Text>
                  <Text className="text-base text-gray-800 font-semibold flex-1 text-right ml-3">Skyline Tower</Text>
                </View>
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-base text-gray-500 font-medium">Location :</Text>
                  <Text className="text-base text-gray-800 font-semibold flex-1 text-right ml-3">Lobby</Text>
                </View>
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-base text-gray-500 font-medium">Issue :</Text>
                  <Text className="text-base text-gray-800 font-semibold flex-1 text-right ml-3">Water leakage</Text>
                </View>
                <View className="flex-row justify-between mb-3.5">
                  <Text className="text-base text-gray-500 font-medium">Assigned On :</Text>
                  <Text className="text-base text-gray-800 font-semibold flex-1 text-right ml-3">Apr 2, 2025</Text>
                </View>

                {/* Toggle */}
                <View className="flex-row justify-between items-center mb-3.5">
                  <Text className="text-base text-gray-500 font-medium">Issue Fixed?</Text>
                  <Switch
                    value={isFixed}
                    onValueChange={setIsFixed}
                    trackColor={{ false: '#E2E8F0', true: '#0066FF' }}
                    thumbColor={isFixed ? '#FFFFFF' : '#94A3B8'}
                    ios_backgroundColor="#E2E8F0"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between mt-2.5">
                <TouchableOpacity
                  onPress={openAddNotes}
                  className="flex-1 flex-row items-center justify-center bg-gray-50 py-3.5 rounded-2xl mx-1.5 border-2 border-gray-200"
                >
                  <MaterialIcons name="note-add" size={22} color="#1E293B" />
                  <Text className="ml-2.5 text-sm text-gray-800 font-semibold">Add Notes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleUploadPhoto}
                  className="flex-1 flex-row items-center justify-center bg-gray-50 py-3.5 rounded-2xl mx-1.5 border-2 border-gray-200"
                >
                  <MaterialIcons name="file-upload" size={22} color="#1E293B" />
                  <Text className="ml-2.5 text-sm text-gray-800 font-semibold">Upload Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Uploaded Photos Section */}
          {uploadedPhotos.length > 0 && (
            <View className="mt-8">
              <Text className="text-xl font-bold text-gray-800 mb-4">Uploaded Photos</Text>
              
              {/* Photos Grid */}
              <View className="flex-row flex-wrap justify-between">
                {uploadedPhotos.map((photo) => (
                  <View key={photo.id} className="w-[48%] mb-4 relative">
                    <View className="bg-white rounded-2xl shadow-lg shadow-black/5 elevation-3 overflow-hidden">
                      <Image
                        source={{ uri: photo.uri }}
                        className="w-full h-32"
                        resizeMode="cover"
                      />
                      <View className="p-3">
                        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                          {photo.title}
                        </Text>
                      </View>
                    </View>
                    {/* Remove Button */}
                    <TouchableOpacity 
                      onPress={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Placeholder for spacing */}
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* ADD NOTES MODAL - EXACTLY LIKE YOUR IMAGE */}
      <Modal
        visible={addNotesVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAddNotes}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Backdrop */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeAddNotes}
            className="flex-1 bg-black/40 justify-end"
          />

          {/* Modal Content */}
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
            {/* Drag Handle */}
            <View className="items-center mb-4">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {/* Title */}
            <Text className="text-center text-xl font-bold text-gray-900 mb-6">
              Add Notes
            </Text>

            {/* Notes Input */}
            <View className="bg-gray-100 rounded-2xl px-4 pt-4 pb-2 min-h-32">
              <Text className="text-gray-500 text-sm mb-1">Notes</Text>
              <TextInput
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
                placeholderTextColor="#94A3B8"
                multiline
                value={noteText}
                onChangeText={setNoteText}
                className="text-gray-800 text-base"
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={closeAddNotes}
              className="mt-8 bg-blue-600 rounded-xl py-4"
            >
              <Text className="text-center text-white text-base font-semibold">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default AssignedSnag;