import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';
import { ChevronDown, Calendar } from 'lucide-react-native';

const NewSurveyScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    surveyName: '',
    surveyType: '',
    description: '',
    contractor: '',
    startDate: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Website-templates.psd', icon: 'File', color: 'bg-blue-500', progress: 60 },
    { id: 2, name: 'Logo-vector.ai', icon: 'File', color: 'bg-red-500', progress: 40 },
  ]);

  const handleCreateProject = () => {
    console.log('Submit:', formData);
    navigation.navigate('Tasks');
  };

  const handleSaveDraft = () => {
    console.log('Save Draft:', formData);
  };

  const handleBrowseFiles = () => console.log('Browse files');

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenSurveyType = () => {
    console.log('Open Survey Type dropdown');
  };

  const handleOpenCalendar = () => {
    console.log('Open Calendar');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header
          title="New Survey Request"
          showBackButton={true}
          onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Scrollable Content with Bottom Padding */}
        <ScrollView
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Survey Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Survey Name
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Project Name 1"
              placeholderTextColor="#9CA3AF"
              value={formData.surveyName}
              onChangeText={(text) => handleInputChange('surveyName', text)}
            />
          </View>

          {/* Survey Type - Dropdown */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Survey Type
            </Text>
            <TouchableOpacity
              onPress={handleOpenSurveyType}
              className="flex-row items-center justify-between border-b border-[#235DFF] pb-3">
              <Text
                style={{ fontFamily: 'Urbanist-Regular' }}
                className={`text-base ${formData.surveyType ? 'text-black' : 'text-gray-400'}`}>
                {formData.surveyType || 'Select'}
              </Text>
              <ChevronDown size={20} color="#235DFF" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Description
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="The budget includes material cost, labor, and subcontractor fees. Client approval is required of any project milestones. Additional customization may impact the final budget."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

          {/* Contractor */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Contractor
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Select"
              placeholderTextColor="#9CA3AF"
              value={formData.contractor}
              onChangeText={(text) => handleInputChange('contractor', text)}
            />
          </View>

          {/* Start Date - Calendar Trigger */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Start Date
            </Text>
            <TouchableOpacity
              onPress={handleOpenCalendar}
              className="flex-row items-center justify-between border-b border-[#235DFF] pb-3">
              <Text
                style={{ fontFamily: 'Urbanist-Regular' }}
                className={`text-base ${formData.startDate ? 'text-black' : 'text-gray-400'}`}>
                {formData.startDate || 'Select Date'}
              </Text>
              <Calendar size={20} color="#235DFF" />
            </TouchableOpacity>
          </View>

          {/* Upload Files */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-5 text-base text-black">
              Upload Files
            </Text>

            <TouchableOpacity
              className="mb-6 items-center justify-center rounded-2xl border-2 border-dashed border-[#235DFF] py-12"
              onPress={handleBrowseFiles}>
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white">
                <Text className="text-sm">Folder</Text>
              </View>
              <Text style={{ fontFamily: 'Urbanist-Regular' }} className="text-base text-gray-500">
                Browse files to upload
              </Text>
            </TouchableOpacity>

            {uploadedFiles.length > 0 && (
              <>
                <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-4 text-sm text-black">
                  Uploaded
                </Text>

                {uploadedFiles.map((file) => (
                  <View key={file.id} className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <View
                          className={`h-12 w-12 rounded-xl ${file.color} mr-4 items-center justify-center`}>
                          <Text className="text-lg text-white">{file.icon}</Text>
                        </View>
                        <Text
                          style={{ fontFamily: 'Urbanist-Medium' }}
                          className="flex-1 text-sm text-black">
                          {file.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="h-7 w-7 items-center justify-center rounded-full bg-red-50"
                        onPress={() => handleRemoveFile(file.id)}>
                        <Text className="text-sm text-red-500">X</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="ml-16 h-2 overflow-hidden rounded-full bg-gray-200">
                      <View
                        className="h-full rounded-full bg-[#235DFF]"
                        style={{ width: `${file.progress}%` }}
                      />
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Action Buttons: Cancel, Save Draft, Submit */}
          <View className="mb-6 flex-row justify-between gap-2">
            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-red-200 py-4"
              onPress={() => console.log('Cancel')}>
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-red-700">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-blue-200 py-4"
              onPress={handleSaveDraft}>
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-blue-600">
                Save Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-green-500 py-4"
              onPress={handleCreateProject}>
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-white">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation Bar */}
        <View className="absolute bottom-0 left-0 right-0">
          <BottomNavBar />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewSurveyScreen;
