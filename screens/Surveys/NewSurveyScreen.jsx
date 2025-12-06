import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';
import { ChevronDown, Calendar } from 'lucide-react-native';

const NewSurveyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // You can pass projectId / proposalId via route params
  const { projectId, proposalId } = route.params || {};

  const [formData, setFormData] = useState({
    // maps to summary.shortNote
    surveyShortNote: '',

    // maps to surveyType
    surveyType: '', // "villa" | "apartment" | etc.

    // maps to finalReport.summary or just internal description
    description: '',

    // maps to assignedTo (for now as a name; later you’ll map to userId)
    assignedToName: '',

    // maps to scheduledDate
    scheduledDate: '',

    // maps to location.address
    locationAddress: '',
  });

  // These can later become attachments or initial documents for the survey
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenSurveyType = () => {
    // TODO: open bottom sheet / modal to pick from ["villa", "apartment", "commercial", ...]
    console.log('Open Survey Type dropdown');
  };

  const handleOpenCalendar = () => {
    // TODO: open date picker
    console.log('Open Calendar');
  };

  const handleBrowseFiles = () => {
    // TODO: hook into document / image picker and push items into uploadedFiles
    console.log('Browse files');
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSaveDraft = () => {
    // Build survey payload as per schema (draft)
    const surveyPayload = {
      projectId: projectId || null,
      proposalId: proposalId || null,
      surveyType: formData.surveyType || null,
      status: 'pending',
      assignedTo: null, // you will map assignedToName to actual userId later
      assignedToName: formData.assignedToName,
      scheduledDate: formData.scheduledDate || null,
      location: {
        address: formData.locationAddress || '',
        latitude: null,
        longitude: null,
      },
      summary: {
        shortNote: formData.surveyShortNote || '',
        keyFindings: [],
        siteConstraints: [],
        requiresProposalChange: false,
      },
      description: formData.description || '',
      photos: [], // will be filled from SurveyDetailScreen
      observations: [],
      review: {
        status: 'not-reviewed',
        reviewerId: null,
        reviewedAt: null,
        remarks: '',
        requiredChanges: [],
      },
      finalReport: {
        generated: false,
        generatedAt: null,
        summary: '',
        keyFindings: [],
        recommendedChanges: [],
        attachments: uploadedFiles.map(f => f.url || ''), // if you store urls
      },
      history: [
        {
          action: 'save-draft',
          fromStatus: null,
          toStatus: 'pending',
          userId: null,
          note: 'Draft created from mobile',
          at: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Save Draft Payload:', surveyPayload);
    // TODO: call API: POST /api/surveys (draft)
  };

  const handleSubmitSurvey = () => {
    const surveyPayload = {
      projectId: projectId || null,
      proposalId: proposalId || null,
      surveyType: formData.surveyType || null,
      status: 'pending',
      assignedTo: null,
      assignedToName: formData.assignedToName,
      scheduledDate: formData.scheduledDate || null,
      location: {
        address: formData.locationAddress || '',
        latitude: null,
        longitude: null,
      },
      summary: {
        shortNote: formData.surveyShortNote || '',
        keyFindings: [],
        siteConstraints: [],
        requiresProposalChange: false,
      },
      description: formData.description || '',
      photos: [],
      observations: [],
      review: {
        status: 'not-reviewed',
        reviewerId: null,
        reviewedAt: null,
        remarks: '',
        requiredChanges: [],
      },
      finalReport: {
        generated: false,
        generatedAt: null,
        summary: '',
        keyFindings: [],
        recommendedChanges: [],
        attachments: uploadedFiles.map(f => f.url || ''),
      },
      history: [
        {
          action: 'created',
          fromStatus: null,
          toStatus: 'pending',
          userId: null,
          note: 'Survey created from NewSurveyScreen',
          at: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Submit Survey Payload:', surveyPayload);
    // TODO: POST /api/surveys
    navigation.navigate('SurveyDetailScreen', {
      surveyId: 'NEW_CREATED_ID', // replace with API response
    });
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <Header
          title="New Site Survey"
          showBackButton={true}
          onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView
          className="flex-1 px-6 pt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Survey Short Note (maps to summary.shortNote) */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Survey Title / Short Note
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Ex: Site survey for 7 BHK Villa"
              placeholderTextColor="#9CA3AF"
              value={formData.surveyShortNote}
              onChangeText={(text) => handleInputChange('surveyShortNote', text)}
            />
          </View>

          {/* Survey Type */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Survey Type
            </Text>
            <TouchableOpacity
              onPress={handleOpenSurveyType}
              className="flex-row items-center justify-between border-b border-[#235DFF] pb-3"
            >
              <Text
                style={{ fontFamily: 'Urbanist-Regular' }}
                className={`text-base ${
                  formData.surveyType ? 'text-black' : 'text-gray-400'
                }`}
              >
                {formData.surveyType || 'Select (Villa, Apartment, etc.)'}
              </Text>
              <ChevronDown size={20} color="#235DFF" />
            </TouchableOpacity>
          </View>

          {/* Site Address (maps to location.address) */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Site Address
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter site address"
              placeholderTextColor="#9CA3AF"
              value={formData.locationAddress}
              onChangeText={(text) => handleInputChange('locationAddress', text)}
            />
          </View>

          {/* Description (notes / internal description) */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Description / Notes
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="Any additional context for the survey, client expectations, access info, etc."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
          </View>

          {/* Assign To (Surveyor / PM) */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Assign To (Surveyor / PM)
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Select or enter responsible person"
              placeholderTextColor="#9CA3AF"
              value={formData.assignedToName}
              onChangeText={(text) => handleInputChange('assignedToName', text)}
            />
          </View>

          {/* Scheduled Date */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-3 text-sm text-black"
            >
              Scheduled Date
            </Text>
            <TouchableOpacity
              onPress={handleOpenCalendar}
              className="flex-row items-center justify-between border-b border-[#235DFF] pb-3"
            >
              <Text
                style={{ fontFamily: 'Urbanist-Regular' }}
                className={`text-base ${
                  formData.scheduledDate ? 'text-black' : 'text-gray-400'
                }`}
              >
                {formData.scheduledDate || 'Select Date'}
              </Text>
              <Calendar size={20} color="#235DFF" />
            </TouchableOpacity>
          </View>

          {/* Upload Reference Files (optional) */}
          <View className="mb-8">
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="mb-5 text-base text-black"
            >
              Upload Reference Files (Optional)
            </Text>

            <TouchableOpacity
              className="mb-6 items-center justify-center rounded-2xl border-2 border-dashed border-[#235DFF] py-12"
              onPress={handleBrowseFiles}
            >
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white">
                <Text className="text-sm">Folder</Text>
              </View>
              <Text
                style={{ fontFamily: 'Urbanist-Regular' }}
                className="text-base text-gray-500"
              >
                Browse files to upload
              </Text>
            </TouchableOpacity>

            {uploadedFiles.length > 0 && (
              <>
                <Text
                  style={{ fontFamily: 'Urbanist-Bold' }}
                  className="mb-4 text-sm text-black"
                >
                  Uploaded
                </Text>

                {uploadedFiles.map(file => (
                  <View key={file.id} className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                          <Text className="text-lg text-white">File</Text>
                        </View>
                        <Text
                          style={{ fontFamily: 'Urbanist-Medium' }}
                          className="flex-1 text-sm text-black"
                        >
                          {file.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="h-7 w-7 items-center justify-center rounded-full bg-red-50"
                        onPress={() => handleRemoveFile(file.id)}
                      >
                        <Text className="text-sm text-red-500">X</Text>
                      </TouchableOpacity>
                    </View>
                    {file.progress != null && (
                      <View className="ml-16 h-2 overflow-hidden rounded-full bg-gray-200">
                        <View
                          className="h-full rounded-full bg-[#235DFF]"
                          style={{ width: `${file.progress}%` }}
                        />
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Buttons */}
          <View className="mb-6 flex-row justify-between gap-2">
            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-red-200 py-4"
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{ fontFamily: 'Urbanist-Bold' }}
                className="text-base text-red-700"
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-blue-200 py-4"
              onPress={handleSaveDraft}
            >
              <Text
                style={{ fontFamily: 'Urbanist-Bold' }}
                className="text-base text-blue-600"
              >
                Save Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center rounded-xl bg-green-500 py-4"
              onPress={handleSubmitSurvey}
            >
              <Text
                style={{ fontFamily: 'Urbanist-Bold' }}
                className="text-base text-white"
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0">
          <BottomNavBar />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewSurveyScreen;
