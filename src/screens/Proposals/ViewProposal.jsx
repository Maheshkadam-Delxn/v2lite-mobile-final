

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
  ActivityIndicator,
  Linking
} from 'react-native'
import React, { useState, useCallback } from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Helper function to get file type from URL
const getFileTypeFromUrl = (url) => {
  if (!url) return 'unknown';

  try {
    // Extract the URL without query parameters
    const urlWithoutQuery = url.split('?')[0];

    // Extract the file extension
    const extension = urlWithoutQuery.split('.').pop().toLowerCase();

    // Check for image types
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    if (imageExtensions.includes(extension)) return 'image';

    // Check for PDF
    if (extension === 'pdf') return 'pdf';

    // Also check if the URL contains common image or PDF indicators
    if (url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.jpeg') ||
      url.toLowerCase().includes('.png') || url.toLowerCase().includes('.gif') ||
      url.toLowerCase().includes('.webp') || url.toLowerCase().includes('.bmp')) {
      return 'image';
    }

    if (url.toLowerCase().includes('.pdf')) return 'pdf';

    // Check Cloudinary URLs that might be images
    if (url.includes('cloudinary.com') &&
      (url.includes('/image/') || url.includes('/upload/'))) {
      return 'image';
    }

    return 'unknown';
  } catch (error) {
    console.error('Error detecting file type:', error);
    return 'unknown';
  }
};

// Separate File Viewer Modal Component
const FileViewerModal = ({
  visible,
  onClose,
  file,
  fileType,
  onDownload
}) => {
  const [loading, setLoading] = useState(true);

  const renderFileContent = () => {
    if (!file) return null;

    const fileUrl = file.planFileUrl || file.url || file.uri;
    const fileName = file.planName || file.name || 'Document';

    // Get file type from the component prop or detect it
    const detectedType = getFileTypeFromUrl(fileUrl);
    const type = fileType || detectedType;

    // Enhanced detection for Cloudinary URLs
    const isLikelyImage = type === 'image' ||
      (fileUrl && (
        fileUrl.includes('.jpg') ||
        fileUrl.includes('.jpeg') ||
        fileUrl.includes('.png') ||
        fileUrl.includes('.gif') ||
        fileUrl.includes('.bmp') ||
        fileUrl.includes('.webp') ||
        fileUrl.includes('/image/upload/')
      ));

    const isLikelyPDF = type === 'pdf' || (fileUrl && fileUrl.includes('.pdf'));

    console.log('File viewer debug:', {
      fileUrl,
      detectedType,
      fileType,
      isLikelyImage,
      isLikelyPDF
    });

    if (isLikelyImage) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {loading && (
            <ActivityIndicator size="large" color="#0066FF" style={{ position: 'absolute' }} />
          )}
          <Image
            source={{ uri: fileUrl }}
            style={{
              width: width - 40,
              height: height * 0.7,
              resizeMode: 'contain'
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(error) => {
              console.log('Image load error:', error.nativeEvent);
              setLoading(false);
              Alert.alert(
                'Preview Error',
                'Unable to load image preview.',
                [{ text: 'OK' }]
              );
            }}
          />
        </View>
      );
    } else if (isLikelyPDF) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            width: 100,
            height: 100,
            backgroundColor: '#E6F0FF',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Feather name="file-text" size={50} color="#0066FF" />
          </View>
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 18,
            color: 'white',
            textAlign: 'center',
            marginBottom: 10
          }}>
            {fileName}
          </Text>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 14,
            color: '#CCCCCC',
            textAlign: 'center',
            marginBottom: 20
          }}>
            PDF files can be viewed by downloading them.
          </Text>
          <TouchableOpacity
            onPress={() => onDownload(file)}
            style={{
              backgroundColor: '#0066FF',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Feather name="download" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: 'white'
            }}>
              Download PDF
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            width: 100,
            height: 100,
            backgroundColor: '#E6F0FF',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Feather name="file" size={50} color="#0066FF" />
          </View>
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 18,
            color: 'white',
            textAlign: 'center',
            marginBottom: 10
          }}>
            {fileName}
          </Text>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 14,
            color: '#CCCCCC',
            textAlign: 'center',
            marginBottom: 20
          }}>
            This file format cannot be previewed directly.
          </Text>
          <TouchableOpacity
            onPress={() => onDownload(file)}
            style={{
              backgroundColor: '#0066FF',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Feather name="download" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: 'white'
            }}>
              Download File
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* File Content Container */}
        <View style={{
          width: width * 0.9,
          height: height * 0.8,
          backgroundColor: 'transparent',
          borderRadius: 0,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: 'white',
                marginBottom: 4
              }} numberOfLines={1}>
                {file?.planName || file?.name || 'Document'}
              </Text>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 12,
                color: '#CCCCCC'
              }}>
                {fileType ? fileType.toUpperCase() : 'PREVIEW'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity
                onPress={() => onDownload(file)}
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Feather name="download" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 18,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Feather name="x" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* File Content */}
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            {renderFileContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Separate Modal Component for Rejection
const RejectionModal = ({
  visible,
  onClose,
  onSubmit,
  rejectionReason,
  setRejectionReason,
  isSubmitting
}) => {
  const [localReason, setLocalReason] = useState(rejectionReason);

  const handleSubmit = () => {
    onSubmit(localReason);
  };

  const handleClose = () => {
    setLocalReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 24,
                width: '100%',
                maxWidth: 400,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
              }}>
                {/* Modal Header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#FFE5E5',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather name="x" size={20} color="#FF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 20,
                      color: '#1A1A1A',
                    }}>
                      Reject Proposal
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#666666',
                      marginTop: 4,
                    }}>
                      Please provide a reason for rejection
                    </Text>
                  </View>
                </View>

                {/* Reason Input */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: '#1A1A1A',
                    marginBottom: 8,
                  }}>
                    Reason for Rejection *
                  </Text>
                  <TextInput
                    value={localReason}
                    onChangeText={setLocalReason}
                    placeholder="Enter your reason here..."
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: '#FAFBFC',
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#1A1A1A',
                      textAlignVertical: 'top',
                      minHeight: 120,
                      borderWidth: 1,
                      borderColor: localReason ? '#0066FF' : '#E0E0E0',
                    }}
                    maxLength={500}
                  />
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 12,
                    color: '#999999',
                    textAlign: 'right',
                    marginTop: 4,
                  }}>
                    {localReason.length}/500 characters
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  justifyContent: 'flex-end'
                }}>
                  <TouchableOpacity
                    onPress={handleClose}
                    disabled={isSubmitting}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: '#F5F5F5',
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#666666',
                    }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || !localReason.trim()}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: isSubmitting || !localReason.trim() ? '#CCCCCC' : '#FF4444',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Feather name="loader" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Processing...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Feather name="x" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Reject Proposal
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Final Budget Modal Component
const FinalBudgetModal = ({
  visible,
  onClose,
  onSubmit,
  initialBudget,
  isSubmitting,
  minBudget,
  maxBudget
}) => {
  const [budget, setBudget] = useState(initialBudget);

  const handleSubmit = () => {
    // Validation
    const budgetValue = parseFloat(budget);
    if (minBudget && maxBudget) {
      if (budgetValue < minBudget || budgetValue > maxBudget) {
        Alert.alert(
          "Invalid Budget",
          `Please enter a budget between ${minBudget} and ${maxBudget}.`,
          [{ text: "OK" }]
        );
        return;
      }
    }

    onSubmit(budget);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 24,
                width: '100%',
                maxWidth: 400,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#E6F0FF',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather name="dollar-sign" size={20} color="#0066FF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 20,
                      color: '#1A1A1A',
                    }}>
                      Finalize Budget
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#666666',
                      marginTop: 4,
                    }}>
                      Please set the final agreed budget for this project.
                      {minBudget && maxBudget ? ` (Range: ${minBudget} - ${maxBudget})` : ''}
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: '#1A1A1A',
                    marginBottom: 8,
                  }}>
                    Final Budget Amount *
                  </Text>
                  <TextInput
                    value={budget}
                    onChangeText={setBudget}
                    placeholder="Enter final budget (e.g. 150000)"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: '#FAFBFC',
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 16,
                      color: '#1A1A1A',
                      borderWidth: 1,
                      borderColor: budget ? '#0066FF' : '#E0E0E0',
                    }}
                  />
                </View>

                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  justifyContent: 'flex-end'
                }}>
                  <TouchableOpacity
                    onPress={onClose}
                    disabled={isSubmitting}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: '#F5F5F5',
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#666666',
                    }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || !budget}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: isSubmitting || !budget ? '#CCCCCC' : '#0066FF',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Feather name="loader" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Processing...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Feather name="check" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Confirm Approval
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ViewProposal = ({ navigation, route }) => {
  const { proposal } = route.params || {};

  // State for modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);

  const [rejectionReason, setRejectionReason] = useState('');
  const [finalBudget, setFinalBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the actual proposal data
  const proposalData = proposal || {};
  const rawData = proposalData?.raw || {};

  // Get the ID from rawData._id for the API endpoint
  const itemId = rawData._id;

  const API_URL = `${process.env.BASE_API_URL}`;

  const getFileIcon = useCallback((type) => {
    switch (type) {
      case 'pdf': return 'file-text';
      case 'zip': return 'archive';
      case 'excel': return 'file';
      case 'image': return 'image';
      case 'document': return 'file-text';
      case 'powerpoint': return 'presentation';
      default: return 'file';
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }, []);

  // Handle file view
  const handleViewFile = useCallback((file) => {
    if (!file) return;

    const fileUrl = file.planFileUrl || file.url || file.uri;
    const fileType = getFileTypeFromUrl(fileUrl);

    console.log('Opening file preview:', {
      fileName: file.planName || file.name,
      fileUrl: fileUrl,
      fileType: fileType
    });

    setSelectedFile(file);
    setSelectedFileType(fileType);
    setShowFileViewer(true);
  }, []);

  // Handle download
  const handleDownload = useCallback(async (file) => {
    if (!file) return;

    try {
      const fileUrl = file.planFileUrl || file.url || file.uri;
      const fileName = file.planName || file.name || 'document';

      if (!fileUrl) {
        Alert.alert('Error', 'File URL not found');
        return;
      }

      Alert.alert(
        'Download File',
        'Do you want to download this file?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                setIsSubmitting(true);

                const supported = await Linking.canOpenURL(fileUrl);

                if (supported) {
                  await Linking.openURL(fileUrl);
                } else {
                  Alert.alert(
                    'Error',
                    'Cannot open this file. Please check the URL or try again later.',
                    [{ text: 'OK' }]
                  );
                }
              } catch (error) {
                console.error('Error downloading file:', error);
                Alert.alert(
                  'Error',
                  'Failed to download file. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setIsSubmitting(false);
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error('Error preparing download:', error);
      Alert.alert('Error', 'Failed to prepare file for download');
    }
  }, []);

  // Original approve handler replaced with new logic
  const handleApprove = useCallback(() => {
    // Check if budget is a range
    const isBudgetRange = budget && (
      budget.toString().toLowerCase().includes('to') ||
      budget.toString().includes('-') ||
      (rawData.projectType?.budgetMinRange && rawData.projectType?.budgetMaxRange)
    );

    if (isBudgetRange) {
      // If range, show modal
      setFinalBudget(''); // Reset or maybe pre-fill if you want
      setShowBudgetModal(true);
    } else {
      // If fixed, confirm and proceed
      Alert.alert(
        "Approve Proposal",
        "Are you sure you want to approve this proposal?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Approve",
            style: "default",
            onPress: () => processApproval(budget) // Use existing budget
          },
        ]
      );
    }
  }, [budget, rawData]);

  const processApproval = async (approvedBudget) => {
    if (!itemId) {
      Alert.alert("Error", "ID not found.");
      return;
    }

    const needsNewSiteSurvey = rawData?.needsNewSiteSurvey ?? false;
    const nextStatus = needsNewSiteSurvey ? "Initialize" : "Ongoing";

    setIsSubmitting(true);

    try {
      const requestBody = {
        status: nextStatus,
        budget: approvedBudget,
      
        startDate: new Date().toISOString()
      };

      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${API_URL}/api/projects/${itemId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Making PUT request for approval to: /api/projects/${itemId}`);
      console.log('Request body:', requestBody);

      const responseData = await response.json();

      if (response.ok) {
        // Close modal if open
        setShowBudgetModal(false);

        Alert.alert(
          "Proposal Approved",
          "The proposal has been successfully approved and initialized.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      }
      else {
        console.error('Approval failed:', responseData);
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to approve proposal`);
      }
    } catch (error) {
      console.error('Error approving proposal:', error);
      Alert.alert(
        "Error",
        error.message || "Failed to approve proposal. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalBudgetSubmit = (budget) => {
    processApproval(budget);
  };

  // Handle rejection with API call
  const handleReject = () => {
    setShowRejectModal(true);
  };

  // Handle rejection with API call
  const handleRejectSubmit = useCallback(async (reason) => {
    if (!reason.trim()) {
      Alert.alert(
        "Reason Required",
        "Please provide a reason for rejection.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!itemId) {
      Alert.alert(
        "Error",
        "ID not found. Cannot reject proposal.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        status: "Rejected",
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      };

      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${API_URL}/api/projects/${itemId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Making PUT request to: /api/projects/${itemId}`);
      console.log('Request body:', requestBody);
      const responseData = await response.json();

      if (response.ok) {
        console.log('Rejection successful:', responseData);

        Alert.alert(
          "Proposal Rejected",
          "The proposal has been successfully rejected.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      }
      else {
        console.error('Rejection failed:', responseData);
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to reject proposal`);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);

      Alert.alert(
        "Error",
        error.message || "Failed to reject proposal. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
      setShowRejectModal(false);
    }
  }, [itemId, navigation, API_URL]);

  // Safe data access with fallbacks
  const projectDocuments = rawData.projectDocuments || [];
  const plans = rawData.plans || [];
  const needsNewSiteSurvey = rawData?.needsNewSiteSurvey ?? false;
  const projectType = rawData.projectType || {};
  console.log('Project type data:', projectType);
  const description = rawData.description || 'No description provided.';
  const budget =
    rawData.budget ??
    (rawData.projectType?.budgetMinRange && rawData.projectType?.budgetMaxRange
      ? `${rawData.projectType.budgetMinRange} to ${rawData.projectType.budgetMaxRange}`
      : 'NA');

  const category = rawData.category || 'Not specified';
  const location = rawData.location || 'Not specified';
  const landArea =
    `${rawData.landArea ?? ''}`.trim()
      ? `${rawData.landArea} sqft`
      : rawData.projectType?.landArea || 'Not specified';
  const projectName = rawData.name || 'Unnamed Project';
  const status = rawData.status || 'Pending';
  const createdAt = rawData.createdAt || '';
  const clientName = proposalData.client || 'Not specified';
  const designerName = proposalData.designer || 'Not specified';

  // Convert projectDocuments strings to proper file objects if needed
  const documentFiles = projectDocuments.map((doc, index) => {
    if (typeof doc === 'string') {
      return {
        _id: `doc-${index}`,
        url: doc,
        name: `Document ${index + 1}`,
        type: getFileTypeFromUrl(doc)
      };
    }
    return doc;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      <Header
        title="Proposal Details"
        showBackButton={true}
        backgroundColor="transparent"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Proposal Header */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 22,
                color: '#1A1A1A',
                flex: 1,
                marginRight: 12,
              }}>
                {projectName}
              </Text>
              <StatusBadge status={status} />
            </View>

            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              color: '#666666',
              lineHeight: 22,
              marginBottom: 16,
            }}>
              {description}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#0066FF',
                  marginBottom: 4,
                }}>
                  {designerName}
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 12,
                  color: '#999999',
                }}>
                  Submitted on {formatDate(createdAt)}
                </Text>
              </View>

              <View style={{
                backgroundColor: '#E6F0FF',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 16,
                  color: '#0066FF',
                }}>
                  {budget}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Project Overview */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Project Overview" icon="clipboard" />

          <InfoCard>
            <InfoRow label="Project Title" value={projectName} />
            <InfoRow label="Client" value={clientName} highlight />
            <InfoRow label="Designer" value={designerName} />
            <InfoRow label="Location" value={location} />
            {!!landArea && (
              <InfoRow label="Land Area" value={landArea} />
            )}

            <InfoRow label="Project Type" value={projectType.projectTypeName || category} />
            <InfoRow label="Status" value={status} />
            <InfoRow label="Total Budget" value={budget} highlight />
            <InfoRow label="Date Submitted" value={formatDate(createdAt)} />
          </InfoCard>
        </View>

        {/* Project Description */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Project Description" icon="file-text" />

          <InfoCard>
            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 14,
              color: '#1A1A1A',
              lineHeight: 22,
            }}>
              {description}
            </Text>
          </InfoCard>
        </View>

        {/* Plans */}
        {plans.length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            <SectionHeader title="Plans" icon="paperclip" />

            <View style={{ marginBottom: 24 }}>
              {plans.map((plan, index) => {
                const fileUrl = plan.planFileUrl;
                const fileType = getFileTypeFromUrl(fileUrl);

                return (
                  <View
                    key={plan._id || index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    {/* Clickable area for viewing */}
                    <TouchableOpacity
                      onPress={() => handleViewFile(plan)}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#0066FF20',
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}>
                        <Feather name={getFileIcon(fileType)} size={24} color="#0066FF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 15,
                          color: '#1A1A1A',
                        }}>
                          {plan.planName || `Plan ${index + 1}`}
                        </Text>
                        <Text style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 13,
                          color: '#999999',
                          marginTop: 2,
                        }}>
                          {fileType.charAt(0).toUpperCase() + fileType.slice(1)} •
                          Tap to preview
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Separate button for download */}
                    <TouchableOpacity
                      onPress={() => handleDownload(plan)}
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#0066FF',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                      }}
                    >
                      <Feather name="download" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Attachments */}
        {documentFiles.length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            <SectionHeader title="Attachments" icon="paperclip" />

            <View style={{ marginBottom: 24 }}>
              {documentFiles.map((doc, index) => {
                const fileUrl = doc.url || doc.planFileUrl;
                const fileType = getFileTypeFromUrl(fileUrl);

                return (
                  <View
                    key={doc._id || index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    {/* Clickable area for viewing */}
                    <TouchableOpacity
                      onPress={() => handleViewFile(doc)}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#0066FF20',
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}>
                        <Feather name={getFileIcon(fileType)} size={24} color="#0066FF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 15,
                          color: '#1A1A1A',
                        }}>
                          {doc.name || `Document ${index + 1}`}
                        </Text>
                        <Text style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 13,
                          color: '#999999',
                          marginTop: 2,
                        }}>
                          {fileType.charAt(0).toUpperCase() + fileType.slice(1)} •
                          Tap to preview
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Separate button for download */}
                    <TouchableOpacity
                      onPress={() => handleDownload(doc)}
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#0066FF',
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                      }}
                    >
                      <Feather name="download" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Additional Information */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Additional Information" icon="info" />

          <InfoCard>
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 14,
                color: '#666666',
                marginBottom: 8,
              }}>
                Need New Site Survey
              </Text>
              <Text
                style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#1A1A1A',
                }}
              >
                {needsNewSiteSurvey ? "Yes" : "No"}
              </Text>
            </View>

            <View>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 14,
                color: '#666666',
                marginBottom: 8,
              }}>
                Last Updated
              </Text>
              <Text style={{
                fontFamily: 'Urbanist-Medium',
                fontSize: 14,
                color: '#1A1A1A',
              }}>
                {formatDate(rawData.updatedAt) || 'Not available'}
              </Text>
            </View>
          </InfoCard>
        </View>

        {/* Action Buttons */}
        {status === 'Proposal Under Approval' && (
          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            flexDirection: 'row',
            gap: 12
          }}>
            <TouchableOpacity
              onPress={handleReject}
              disabled={isSubmitting}
              style={{
                flex: 1,
                backgroundColor: '#FFE5E5',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                shadowColor: "#FF4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              <Feather name="x" size={20} color="#FF4444" />
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: '#FF4444',
                marginLeft: 8,
              }}>
                {isSubmitting ? 'Processing...' : 'Reject'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleApprove}
              disabled={isSubmitting}
              style={{
                flex: 1,
                backgroundColor: '#00C896',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: "center",
                shadowColor: "#00C896",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 3,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              <Feather name="check" size={20} color="white" />
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: 'white',
                marginLeft: 8,
              }}>
                {isSubmitting ? 'Processing...' : 'Approve'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* View Only State */}
        {status !== "Proposal Under Approval" && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
            <View
              style={{
                backgroundColor: status === "Rejected" ? "#FFE7E7" : "#E6F0FF",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
              }}
            >
              <Feather
                name="eye"
                size={24}
                color={status === "Rejected" ? "#D32F2F" : "#0066FF"}
              />

              <Text
                style={{
                  fontFamily: "Urbanist-SemiBold",
                  fontSize: 16,
                  color: status === "Rejected" ? "#D32F2F" : "#0066FF",
                  marginTop: 8,
                }}
              >
                View Only – {status}
              </Text>

              {/* Message */}
              {status === "Rejected" ? (
                <Text
                  style={{
                    fontFamily: "Urbanist-Regular",
                    fontSize: 14,
                    color: "#B3261E",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  This proposal was rejected.
                  {"\n"}Reason: {rawData?.rejectionReason || "Not provided"}
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: "Urbanist-Regular",
                    fontSize: 14,
                    color: "#666666",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  This proposal has already been {status.toLowerCase()}.
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Rejection Modal */}
      <RejectionModal
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isSubmitting={isSubmitting}
      />

      <FinalBudgetModal
        visible={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleFinalBudgetSubmit}
        initialBudget={''}
        isSubmitting={isSubmitting}
        minBudget={rawData.projectType?.budgetMinRange}
        maxBudget={rawData.projectType?.budgetMaxRange}
      />

      {/* File Viewer Modal */}
      <FileViewerModal
        visible={showFileViewer}
        onClose={() => {
          setShowFileViewer(false);
          setSelectedFile(null);
          setSelectedFileType(null);
        }}
        file={selectedFile}
        fileType={selectedFileType}
        onDownload={handleDownload}
      />
    </View>
  )
}

// Helper components
const StatusBadge = ({ status }) => {
  const getStatusColors = () => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "initialize":
      case "ongoing":
        return { bg: "#D4EDDA", text: "#155724", icon: "check-circle" };
      case "rejected":
        return { bg: "#F8D7DA", text: "#721C24", icon: "x-circle" };
      case "pending":
        return { bg: "#FFF3CD", text: "#856404", icon: "clock" };
      case "proposal under approval":
        return { bg: "#CCE7FF", text: "#0066CC", icon: "file-text" };
      default:
        return { bg: "#E2E3E5", text: "#383D41", icon: "help-circle" };
    }
  };

  const colors = getStatusColors();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    }}>
      <Feather name={colors.icon} size={14} color={colors.text} />
      <Text style={{
        fontFamily: "Urbanist-SemiBold",
        fontSize: 12,
        color: colors.text,
        marginLeft: 4,
      }}>
        {status || 'Pending'}
      </Text>
    </View>
  );
};

const SectionHeader = ({ title, icon }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  }}>
    <Feather name={icon} size={20} color="#0066FF" />
    <Text style={{
      fontFamily: 'Urbanist-Bold',
      fontSize: 20,
      color: '#1A1A1A',
      marginLeft: 8,
    }}>
      {title}
    </Text>
  </View>
);

const InfoCard = ({ children }) => (
  <View style={{
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF'
  }}>
    {children}
  </View>
);

const InfoRow = ({ label, value, highlight = false }) => (
  <View style={{
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start'
  }}>
    <Text style={{
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 14,
      color: '#666666',
      width: 120
    }}>
      {label}
    </Text>
    <Text style={{
      fontFamily: highlight ? 'Urbanist-Bold' : 'Urbanist-Medium',
      fontSize: 14,
      color: highlight ? '#0066FF' : '#1A1A1A',
      flex: 1,
      lineHeight: 20
    }}>
      {value || 'Not specified'}
    </Text>
  </View>
);

export default ViewProposal