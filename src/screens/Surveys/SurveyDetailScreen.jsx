import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Search, ChevronRight, Plus, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Header from '@/components/Header';

// Add Comment Modal Component
const AddCommentModal = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState('');

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add Comment</Text>

        <View style={styles.commentBox}>
          <Text style={styles.commentLabel}>Comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="The budget includes material costs, labor, and subcontractor fees..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <View style={styles.modalButtonsRow}>
          <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={() => {
              if (comment.trim()) {
                onSubmit(comment);
                setComment('');
                onClose();
              } else {
                Alert.alert('Please type a comment');
              }
            }}
          >
            <Text style={styles.modalSubmitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Add Document Modal Component (Simplified without DocumentPicker)
const AddDocumentModal = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [files, setFiles] = useState([]);

  const simulateFilePick = () => {
    // Simulate file selection - in real app, you'd use DocumentPicker here
    const newFile = {
      name: `document_${Date.now()}.pdf`,
      type: 'pdf',
      size: '2.4 MB'
    };
    setFiles(prev => [...prev, newFile]);
    Alert.alert('Info', 'In a real app, this would open file picker');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Attach Documents</Text>

        {/* File Upload Area */}
        <TouchableOpacity style={styles.dropZone} onPress={simulateFilePick}>
          <Text style={styles.dropIcon}>📁</Text>
          <Text style={styles.dropText}>
            Choose a file or drag & drop it here
          </Text>
          <Text style={styles.dropSubText}>
            .JPEG, .PNG, .PDF, .AI and MP4 formats, up to 50MB
          </Text>
          <Text style={styles.browseText}>Browse File</Text>
        </TouchableOpacity>

        {/* Selected Files */}
        {files.map((file, idx) => (
          <View key={idx} style={styles.fileRow}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <TouchableOpacity onPress={() => removeFile(idx)}>
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.modalButtonsRow}>
          <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={() => {
              onSubmit(files);
              setFiles([]);
              onClose();
            }}
          >
            <Text style={styles.modalSubmitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Screen Component
const SurveyDetailScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleBack = () => navigation.goBack();

  const openCommentModal = (requestId) => {
    setSelectedRequestId(requestId);
    setCommentModalVisible(true);
  };

  const openDocumentModal = (requestId) => {
    setSelectedRequestId(requestId);
    setDocumentModalVisible(true);
  };

  const handleCommentSubmit = (comment) => {
    console.log('Comment for', selectedRequestId, ':', comment);
    Alert.alert('Success', 'Comment added successfully!');
  };

  const handleDocumentSubmit = (files) => {
    console.log('Documents for', selectedRequestId, ':', files);
    if (files.length > 0) {
      Alert.alert('Success', `${files.length} document(s) attached successfully!`);
    } else {
      Alert.alert('Info', 'No documents were attached');
    }
  };

  const surveyRequests = [
    {
      id: 'SRQ - 001',
      project: 'Project Alpha',
      contractor: 'Contractor A',
      dateSubmitted: '28-03-2025',
      status: 'Safety',
      statusColor: 'blue',
    },
    {
      id: 'SRQ - 002',
      project: 'Project Beta',
      contractor: 'Contractor B',
      dateSubmitted: '29-03-2025',
      status: 'Pending',
      statusColor: 'orange',
    }
  ];

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'blue':
        return { backgroundColor: '#E8F0FF' };
      case 'orange':
        return { backgroundColor: '#FFF4E6' };
      case 'green':
        return { backgroundColor: '#E6F4EA' };
      default:
        return { backgroundColor: '#F3F4F6' };
    }
  };

  const getBadgeTextStyle = (color) => {
    switch (color) {
      case 'blue':
        return { color: '#0066FF' };
      case 'orange':
        return { color: '#FF9500' };
      case 'green':
        return { color: '#28A745' };
      default:
        return { color: '#6B7280' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      <Header
        title="Survey Requests"
        showBackButton={true}
        onBackPress={handleBack}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View style={{ flex: 1 }}>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Search and Add Button Container */}
        <View style={styles.searchAddContainer}>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Add Button */}
          {/* <TouchableOpacity style={styles.addButton} 
          onPress={() => navigation.navigate('NewSurveyScreen')}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
        </View>

        {/* Survey Request Cards */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {surveyRequests.map((request, index) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                index === surveyRequests.length - 1 && { marginBottom: 0 }
              ]}
            >
              {/* Header with ID and Badge */}
              <View style={styles.cardHeader}>
                <Text style={styles.requestId}>{request.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    getBadgeStyle(request.statusColor)
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      getBadgeTextStyle(request.statusColor)
                    ]}
                  >
                    {request.status}
                  </Text>
                </View>
              </View>

              {/* Project Info */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Project :</Text>
                <Text style={styles.infoValue}>{request.project}</Text>
              </View>

              {/* Contractor Info */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contractor :</Text>
                <Text style={[styles.infoValue, { color: '#FF6B35' }]}>
                  {request.contractor}
                </Text>
              </View>

              {/* Date Submitted */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date Submitted :</Text>
                <Text style={styles.infoValue}>{request.dateSubmitted}</Text>
              </View>

              {/* Action Buttons */}
             <View style={styles.actionButtonsContainer}>
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={() => openCommentModal(request.id)}
  >
    <Text style={styles.actionButtonText}>Add Comments</Text>
    <ChevronRight size={16} color="#0066FF" />
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.actionButton}
    onPress={() => openDocumentModal(request.id)}
  >
    <Text style={styles.actionButtonText}>Add Documents</Text>
    <ChevronRight size={16} color="#0066FF" />
  </TouchableOpacity>
</View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modals */}
      <AddCommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        onSubmit={handleCommentSubmit}
      />
      
      <AddDocumentModal
        visible={documentModalVisible}
        onClose={() => setDocumentModalVisible(false)}
        onSubmit={handleDocumentSubmit}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0066FF',
    borderRadius: 24, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
 actionButtonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginVertical: 8,
},
actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
//   backgroundColor: '#F8F9FA',
//   borderRadius: 8,
//   borderWidth: 1,
//   borderColor: '#E9ECEF',
},
actionButtonText: {
  fontSize: 14,
  fontWeight: '500',
  color: '#0066FF',
  marginRight: 8,
},

  // Modal Styles
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000000',
  },
  commentBox: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  dropIcon: {
    fontSize: 48,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  dropText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  dropSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  browseText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '600',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  modalCancelText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  modalSubmitBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
};

export default SurveyDetailScreen;