import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from 'components/Header';
import BottomNavBar from 'components/BottomNavbar';

const AddNewTask = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    taskName: '',
    projectName: '',
    taskDescription: '',
    startDate: '2025-03-28',
    endDate: '2025-04-05',
    category: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2025-03-28'));
  const [endDate, setEndDate] = useState(new Date('2025-04-05'));

  const [selectedMembers, setSelectedMembers] = useState([
    { id: 1, name: 'Member 1' },
    { id: 2, name: 'Member 2' },
    { id: 3, name: 'Member 3' },
    { id: 4, name: 'Member 4' },
  ]);

  const [selectedTags, setSelectedTags] = useState(['Design', 'React', 'Frontend']);

  const tags = [
    { name: 'Low', bgColor: '#ECFDF3', textColor: '#027A48' },
    { name: 'Medium', bgColor: '#FFFAEB', textColor: '#B54708' },
    { name: 'High', bgColor: '#FFF4ED', textColor: '#C4320A' },
    { name: 'Urgent', bgColor: '#FEF3F2', textColor: '#B42318' }
  ];

  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: 'Website templates.psd',
      size: '5.9 MB',
      type: 'psd',
      color: '#0066FF',
      progress: 100,
    },
    {
      id: 2,
      name: 'Logo.svg',
      size: '2.3 MB',
      type: 'svg',
      color: '#FFA800',
      progress: 100,
    },
    {
      id: 3,
      name: 'Wireframe for new figma',
      size: '3.7 MB',
      type: 'figma',
      color: '#FF3B30',
      progress: 100,
    },
  ]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    
    if (selectedDate) {
      setStartDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        startDate: formatDate(selectedDate),
      }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    
    if (selectedDate) {
      setEndDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        endDate: formatDate(selectedDate),
      }));
    }
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };

  const handleTagToggle = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleBrowseFiles = () => {
    console.log('Browse files');
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSubmit = () => {
    console.log('Create Task:', formData);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {/* Header */}
        <Header
          title="Create New Task"
          showBackButton={true}
          onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Task Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Task Name here"
                placeholderTextColor="#9CA3AF"
                value={formData.taskName}
                onChangeText={(text) => handleInputChange('taskName', text)}
              />
            </View>

            {/* Task Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Lorem Ipsum is simply dummy text of the printer consecutive endgasping alt; edit tbe discussed temper insulated of cabinet of editor's margin..."
                placeholderTextColor="#9CA3AF"
                value={formData.taskDescription}
                onChangeText={(text) => handleInputChange('taskDescription', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, styles.dateInputGroup]}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={showStartDatepicker}>
                  <Text style={styles.dateText}>{formData.startDate}</Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, styles.dateInputGroup]}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={showEndDatepicker}>
                  <Text style={styles.dateText}>{formData.endDate}</Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Pickers */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartDateChange}
              />
            )}

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndDateChange}
              />
            )}

            {/* Members */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Members</Text>
              <View style={styles.membersContainer}>
                <View style={styles.membersRow}>
                  <View style={styles.avatarRow}>
                    {selectedMembers.map((member, index) => (
                      <View
                        key={member.id}
                        style={[styles.avatar, index > 0 && { marginLeft: -12 }]}
                      />
                    ))}
                  </View>
                  <TouchableOpacity style={styles.addMemberButton}>
                    <Ionicons name="add" size={18} color="#0066FF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Task Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Type</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag.name}
                    style={[
                      styles.tag,
                      { backgroundColor: tag.bgColor },
                      selectedTags.includes(tag.name) && styles.tagSelected,
                    ]}
                    onPress={() => handleTagToggle(tag.name)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: tag.textColor },
                        selectedTags.includes(tag.name) && styles.tagTextSelected,
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>
                  {formData.category || 'Category 1'}
                </Text>
                <Feather name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Upload */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={handleBrowseFiles}>
                <Ionicons name="cloud-upload-outline" size={48} color="#9CA3AF" />
                <Text style={styles.uploadText}>Choose files to upload</Text>
              </TouchableOpacity>
            </View>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Uploaded</Text>
                {uploadedFiles.map((file) => (
                  <View key={file.id} style={styles.fileCard}>
                    <View style={styles.fileIconContainer}>
                      <View style={[styles.fileIcon, { backgroundColor: file.color }]}>
                        <Text style={styles.fileIconText}>
                          {file.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <View style={styles.fileProgressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${file.progress}%`, backgroundColor: file.color },
                            ]}
                          />
                        </View>
                        <Text style={styles.fileSize}>{file.size}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeFileButton}
                      onPress={() => handleRemoveFile(file.id)}
                    >
                      <Ionicons name="close-circle" size={22} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={styles.bottomNav}>
          <BottomNavBar />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#111827',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  dropdownInput: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0066FF',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    flex: 1,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#111827',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  dateInputGroup: {
    flex: 1,
    marginBottom: 0,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0066FF',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#111827',
  },
  membersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0066FF',
    paddingVertical: 12,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addMemberButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelected: {
    borderColor: '#FFA800',
  },
  tagText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 13,
  },
  tagTextSelected: {
    color: '#FFA800',
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0066FF',
    borderStyle: 'dashed',
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 10,
  },
  fileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconContainer: {
    marginRight: 12,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  fileProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  fileSize: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#6B7280',
    minWidth: 45,
  },
  removeFileButton: {
    padding: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default AddNewTask;