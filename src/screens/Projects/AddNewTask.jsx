
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

//const API_BASE = 'https://skystruct-lite-backend.vercel.app'; // your base URL
const API_BASE = `${process.env.BASE_API_URL}`;
const TASKS_POST_URL = `${API_BASE}/api/tasks`;
const USERS_URL = `${API_BASE}/api/users`; // <-- endpoint you asked for
const TOKEN_KEY = 'userToken';

// Cloudinary config (from your CreateProject screen)
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

const uploadToCloudinary = async (fileUri, fileType = 'image') => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const form = new FormData();
    const filename = fileUri.split('/').pop();
    const extMatch = /\.(\w+)$/.exec(filename || '');
    const ext = extMatch ? extMatch[1] : fileType === 'image' ? 'jpg' : 'dat';
    const mime = fileType === 'image' ? `image/${ext}` : `application/octet-stream`;

    form.append('file', {
      uri: fileUri,
      name: filename || `file_${Date.now()}.${ext}`,
      type: mime,
    });
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('api_key', CLOUDINARY_CONFIG.apiKey);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;
    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const txt = await res.text();
    let data;
    try {
      data = JSON.parse(txt);
    } catch (e) {
      return { success: false, error: 'Invalid Cloudinary response', details: txt };
    }

    if (res.ok && data.secure_url) {
      return { success: true, url: data.secure_url, publicId: data.public_id, data };
    } else {
      return { success: false, error: data.error?.message || `Upload failed ${res.status}`, details: data };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Upload error' };
  }
};

const AddNewTask = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // projectId from route.params or route.params.project
  const initialProjectId =
    route?.params?.projectId ||
    (route?.params?.project && (route.params.project._id || route.params.project.id)) ||
    '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    status: 'todo', // todo | inprogress | done
  });

  const [projectId, setProjectId] = useState(initialProjectId);

  // members fetched from API
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  // assignedTo is now an array of user ids (multi-select)
  const [assignedTo, setAssignedTo] = useState([]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [startDateObj, setStartDateObj] = useState(new Date(formData.startDate));
  const [dueDateObj, setDueDateObj] = useState(new Date(formData.dueDate));

  // attachments state
  const [attachments, setAttachments] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id =
      route?.params?.projectId || (route?.params?.project && (route.params.project._id || route.params.project.id));
    if (id) setProjectId(id);
  }, [route?.params]);

  // Toggle a member id in the assignedTo array (multi-select)
  const toggleAssigned = (id) => {
    setAssignedTo(prev => {
      if (!Array.isArray(prev)) prev = [];
      const exists = prev.some(x => String(x) === String(id));
      if (exists) {
        return prev.filter(x => String(x) !== String(id));
      } else {
        return [...prev, id];
      }
    });
  };

  // Fetch members from /api/admin/users using token
  useEffect(() => {
    if (!projectId) return; // Guard: Don't fetch if no projectId

    let mounted = true;
    const fetchMembers = async () => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        console.log('Fetching members from:', `${API_BASE}/api/admin/users`);
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(USERS_URL, { method: 'GET', headers });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Failed to fetch users: ${res.status} ${txt}`);
        }
        const json = await res.json().catch(() => []);
        const list = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

        // Filter members assigned to this projectId
        const membersAssignedToProject = list.filter(member =>
          Array.isArray(member.assignedProjects) &&
          member.assignedProjects.some(pid => String(pid) === String(projectId))
        );

        console.log("project id", projectId);
        console.log("Filtered members for project:", membersAssignedToProject);

        if (mounted) {
          setMembers(membersAssignedToProject);
          // default select first member if any (as array)
          const firstId = membersAssignedToProject?.[0]?._id || membersAssignedToProject?.[0]?.id || '';
          if (firstId) setAssignedTo([firstId]);
          else setAssignedTo([]); // clear if none
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        if (mounted) setMembersError(err.message || 'Failed to load members');
      } finally {
        if (mounted) setMembersLoading(false);
      }
    };

    fetchMembers();

    return () => {
      mounted = false;
    };
  }, [projectId]); // re-run when projectId changes

  const showStartPicker = () => setShowStartDatePicker(true);
  const showDuePicker = () => setShowDueDatePicker(true);

  const onStartChange = (e, selected) => {
    if (Platform.OS === 'android') setShowStartDatePicker(false);
    if (selected) {
      setStartDateObj(selected);
      const iso = selected.toISOString();
      setFormData((p) => ({ ...p, startDate: iso }));
    }
  };

  const onDueChange = (e, selected) => {
    if (Platform.OS === 'android') setShowDueDatePicker(false);
    if (selected) {
      setDueDateObj(selected);
      const iso = selected.toISOString();
      setFormData((p) => ({ ...p, dueDate: iso }));
    }
  };

  // pick file and upload to Cloudinary
  const handleBrowseFiles = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permission is required to pick files.');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: false,
        quality: 0.7,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;
      const asset = res.assets[0];

      const isImage = asset.type === 'image' || /\.(jpg|jpeg|png|gif)$/i.test(asset.uri || '');
      const local = {
        id: Date.now() + Math.random(),
        name: asset.fileName || asset.uri.split('/').pop(),
        uri: asset.uri,
        type: isImage ? 'image' : 'raw',
        isUploading: true,
        url: null,
        error: null,
        size: asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined,
      };

      setAttachments((p) => [local, ...p]);

      const uploaded = await uploadToCloudinary(local.uri, local.type === 'image' ? 'image' : 'raw');

      setAttachments((prev) =>
        prev.map((a) =>
          a.id === local.id
            ? {
                ...a,
                isUploading: false,
                url: uploaded.success ? uploaded.url : null,
                error: uploaded.success ? null : uploaded.error || 'Upload failed',
              }
            : a
        )
      );

      if (!uploaded.success) Alert.alert('Upload failed', uploaded.error || 'Cloudinary upload failed');
    } catch (err) {
      console.error('Browse/upload error', err);
      Alert.alert('Error', 'Unable to pick/upload file.');
    }
  };

  const handleRemoveFile = (id) => setAttachments((p) => p.filter((f) => f.id !== id));

  const validateBeforeSubmit = () => {
    if (!formData.title || formData.title.trim() === '') {
      Alert.alert('Validation', 'Title is required.');
      return false;
    }
    if (!projectId) {
      Alert.alert('Validation', 'projectId missing. Open from project details or pass projectId.');
      return false;
    }
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      Alert.alert('Validation', 'Please assign the task to at least one member.');
      return false;
    }
    if (attachments.some((a) => a.isUploading)) {
      Alert.alert('Please wait', 'Attachments are still uploading.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;
    setIsSubmitting(true);

    try {
      const body = {
        title: formData.title,
        description: formData.description,
        projectId,
        assignedTo: Array.isArray(assignedTo) ? assignedTo : (assignedTo ? [assignedTo] : []),
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        status: formData.status,
        attachments: attachments.filter(a => a.url).map(a => a.url),
      };

      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(TASKS_POST_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        let msg = `Server error ${res.status}`;
        try {
          const j = txt ? JSON.parse(txt) : null;
          if (j?.message) msg = j.message;
        } catch (e) {
          if (txt) msg = txt;
        }
        throw new Error(msg);
      }

      Alert.alert('Success', 'Task created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Create task failed', err);
      Alert.alert('Error', err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusButton = ({ value, label }) => (
    <TouchableOpacity
      style={[styles.statusBtn, formData.status === value && styles.statusBtnActive]}
      onPress={() => setFormData((p) => ({ ...p, status: value }))}
    >
      <Text style={[styles.statusBtnText, formData.status === value && styles.statusBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderAttachment = ({ item }) => (
    <View style={styles.fileCard}>
      <View style={styles.fileIconContainer}>
        <View style={[styles.fileIcon, { backgroundColor: item.url ? '#10b981' : '#6B7280' }]}>
          <Text style={styles.fileIconText}>{(item.name || '').split('.').pop()?.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <View style={styles.fileProgressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: item.isUploading ? '40%' : item.url ? '100%' : '0%' },
              ]}
            />
          </View>
          <Text style={styles.fileSize}>{item.size || (item.isUploading ? 'Uploading...' : '')}</Text>
        </View>
        {item.error ? <Text style={{ color: '#ef4444', marginTop: 6 }}>{item.error}</Text> : null}
      </View>
      <TouchableOpacity style={styles.removeFileButton} onPress={() => handleRemoveFile(item.id)} disabled={item.isUploading}>
        {item.isUploading ? <ActivityIndicator /> : <Ionicons name="close-circle" size={22} color="#FF3B30" />}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Header title="Create New Task" showBackButton={true} onRightIconPress={() => {}} backgroundColor="#0066FF" titleColor="white" iconColor="white" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Review electrical layout"
                placeholderTextColor="#9CA3AF"
                value={formData.title}
                onChangeText={(t) => setFormData((p) => ({ ...p, title: t }))}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Check wiring plan for Villa project"
                placeholderTextColor="#9CA3AF"
                value={formData.description}
                onChangeText={(t) => setFormData((p) => ({ ...p, description: t }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, styles.dateInputGroup]}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={showStartPicker}>
                  <Text style={styles.dateText}>{new Date(formData.startDate).toISOString().split('T')[0]}</Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, styles.dateInputGroup]}>
                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity style={styles.dateInput} onPress={showDuePicker}>
                  <Text style={styles.dateText}>{new Date(formData.dueDate).toISOString().split('T')[0]}</Text>
                  <Feather name="calendar" size={18} color="#0066FF" />
                </TouchableOpacity>
              </View>
            </View>

            {showStartDatePicker && <DateTimePicker value={startDateObj} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onStartChange} />}
            {showDueDatePicker && <DateTimePicker value={dueDateObj} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDueChange} />}

            {/* AssignedTo (fetched list) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assign To</Text>

              {membersLoading ? (
                <View style={{ paddingVertical: 12 }}>
                  <ActivityIndicator />
                </View>
              ) : membersError ? (
                <Text style={{ color: '#ef4444' }}>{membersError}</Text>
              ) : members.length === 0 ? (
                <Text style={{ color: '#6b7280' }}>No members available</Text>
              ) : (
                <>
                  <View style={styles.dropdownInput}>
                    <Text style={styles.dropdownText}>
                      {Array.isArray(assignedTo) && assignedTo.length > 0
                        ? assignedTo.map(id => (members.find(m => (m._id || m.id) === id)?.name || id)).join(', ')
                        : 'Select members'}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#6B7280" />
                  </View>
                  <View style={{ marginTop: 8 }}>
                    {members.map((m) => {
                      const id = m._id || m.id;
                      const selected = Array.isArray(assignedTo) && assignedTo.some(x => String(x) === String(id));
                      return (
                        <TouchableOpacity
                          key={id}
                          style={[styles.memberItem, selected && styles.memberItemActive]}
                          onPress={() => toggleAssigned(id)}
                        >
                          <Text style={[styles.memberText, selected && styles.memberTextActive]}>
                            {m.name || m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || id}
                          </Text>
                          <Text style={{ fontSize: 12, color: selected ? '#ffffff' : '#6b7280' }}>{m.email}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </View>

            {/* Status */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <StatusButton value="todo" label="To do" />
                <StatusButton value="inprogress" label="In progress" />
                <StatusButton value="done" label="Done" />
              </View>
            </View>

            {/* Upload attachments */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attachments</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={handleBrowseFiles} disabled={attachments.some((a) => a.isUploading)}>
                <Ionicons name="cloud-upload-outline" size={48} color="#9CA3AF" />
                <Text style={styles.uploadText}>
                  {attachments.some((a) => a.isUploading) ? 'Uploading...' : 'Choose files to upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Uploaded attachments list */}
            {attachments.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Uploaded</Text>
                <FlatList
                  data={attachments}
                  renderItem={renderAttachment}
                  keyExtractor={(i) => String(i.id)}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, (isSubmitting || attachments.some((a) => a.isUploading)) && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={isSubmitting || attachments.some((a) => a.isUploading)}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>

       
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  wrapper: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#111827', marginBottom: 10 },
  input: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#0066FF', paddingVertical: 12, paddingHorizontal: 0, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#111827' },
  textArea: { minHeight: 80, paddingTop: 12 },
  dateRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  dateInputGroup: { flex: 1, marginBottom: 0 },
  dateInput: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#0066FF', paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { flex: 1, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#111827' },
  dropdownInput: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#0066FF', paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownText: { flex: 1, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#111827' },
  memberItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
  memberItemActive: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  memberText: { color: '#111827' },
  memberTextActive: { color: 'white' },
  statusBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'white', marginRight: 8 },
  statusBtnActive: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  statusBtnText: { fontFamily: 'Urbanist-Medium', color: '#111827' },
  statusBtnTextActive: { color: 'white' },
  uploadBox: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 2, borderColor: '#0066FF', borderStyle: 'dashed', paddingVertical: 48, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  uploadText: { fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#9CA3AF', marginTop: 10 },
  fileCard: { backgroundColor: '#FFFFFF', paddingVertical: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  fileIconContainer: { marginRight: 12 },
  fileIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  fileIconText: { fontFamily: 'Urbanist-Bold', fontSize: 9, color: '#FFFFFF' },
  fileInfo: { flex: 1 },
  fileName: { fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#111827', marginBottom: 6 },
  fileProgressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBar: { flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: '#0066FF' },
  fileSize: { fontFamily: 'Urbanist-Regular', fontSize: 12, color: '#6B7280', minWidth: 45 },
  removeFileButton: { padding: 4, marginLeft: 8 },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelButton: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  cancelButtonText: { fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#6B7280' },
  submitButton: { flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  submitButtonText: { fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#FFFFFF' },

});

export default AddNewTask;
