import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';

const CreateProjectScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    startDate: '',
    endDate: '',
    budget: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'Website-templates.psd', icon: 'File', color: 'bg-blue-500', progress: 60 },
    { id: 2, name: 'Logo-vector.ai', icon: 'File', color: 'bg-red-500', progress: 40 },
    { id: 3, name: 'Wireframe for team.figma', icon: 'Paintbrush', color: 'bg-purple-500', progress: 30 },
  ]);

  const handleCreateProject = () => {
    console.log('Create Project:', formData);
    navigation.navigate('Tasks');
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

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <Header
          title="Create New Project"
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
          contentContainerStyle={{ paddingBottom: 100 }} // Critical: Space for BottomNavBar
        >
          {/* Project Image */}
          <View className="mb-8 items-center">
            <View className="relative h-32 w-32 overflow-hidden rounded-2xl">
              <View className="h-full w-full items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
                <View className="h-44 w-32 overflow-hidden rounded-2xl border-2 border-white/30 bg-white shadow-2xl shadow-blue-900/50">
                  <Image
                    source={{
                      uri: 'https://t4.ftcdn.net/jpg/02/81/89/73/360_F_281897358_3rj9ZBSZHo5s0L1ug7uuIHadSxh9Cc75.jpg',
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  <View className="shadow-inner absolute inset-0 rounded-2xl border border-white/20" />
                </View>
              </View>
              <View className="absolute bottom-2 right-2 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#235DFF]">
                <Text className="text-base text-white">Edit</Text>
              </View>
            </View>
          </View>

          {/* Project Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Name
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter project name"
              placeholderTextColor="#9CA3AF"
              value={formData.projectName}
              onChangeText={(text) => handleInputChange('projectName', text)}
            />
          </View>

          {/* Project Description */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Project Description
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="Enter project description"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.projectDescription}
              onChangeText={(text) => handleInputChange('projectDescription', text)}
            />
          </View>

          {/* Client Name */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Name
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client name"
              placeholderTextColor="#9CA3AF"
              value={formData.clientName}
              onChangeText={(text) => handleInputChange('clientName', text)}
            />
          </View>

          {/* Client Email */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Email
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={formData.clientEmail}
              onChangeText={(text) => handleInputChange('clientEmail', text)}
            />
          </View>

          {/* Client Phone */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Client Phone
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter client phone"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={formData.clientPhone}
              onChangeText={(text) => handleInputChange('clientPhone', text)}
            />
          </View>

          {/* Address / Location */}
          <View className="mb-6">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Address / Location
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="min-h-[80px] border-b border-[#235DFF] pb-3 text-base leading-6 text-gray-600"
              placeholder="Enter project address"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          {/* Dates */}
          <View className="mb-6 flex-row gap-5">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
                Start Date
              </Text>
              <TextInput
                style={{ fontFamily: 'Urbanist-Regular' }}
                className="border-b border-[#235DFF] pb-3 text-base text-black"
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={formData.startDate}
                onChangeText={(text) => handleInputChange('startDate', text)}
              />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
                End Date
              </Text>
              <TextInput
                style={{ fontFamily: 'Urbanist-Regular' }}
                className="border-b border-[#235DFF] pb-3 text-base text-black"
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={formData.endDate}
                onChangeText={(text) => handleInputChange('endDate', text)}
              />
            </View>
          </View>

          {/* Budget Amount */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="mb-3 text-sm text-black">
              Budget Amount
            </Text>
            <TextInput
              style={{ fontFamily: 'Urbanist-Regular' }}
              className="border-b border-[#235DFF] pb-3 text-base text-black"
              placeholder="Enter budget amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.budget}
              onChangeText={(text) => handleInputChange('budget', text)}
            />
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

          {/* Create Project Button */}
          <TouchableOpacity
            className="mb-6 items-center rounded-xl bg-[#235DFF] py-4"
            onPress={handleCreateProject}>
            <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-base text-white">
              Create Project
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Fixed Bottom Navigation Bar */}
        <View className="absolute bottom-0 left-0 right-0">
          <BottomNavBar />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateProjectScreen;