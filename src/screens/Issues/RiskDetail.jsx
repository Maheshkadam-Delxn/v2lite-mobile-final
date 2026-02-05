// RiskDetail.jsx
import React, { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/utils/cloudinary";

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '@/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiskDetail = ({ route, navigation }) => {
  const { risk, isClientView } = route.params || {};
  console.log("RISK IS :", risk);
  // Workflow States
  const [escalateModalVisible, setEscalateModalVisible] = useState(false);
  const [resolutionModalVisible, setResolutionModalVisible] = useState(false); // Assignee View
  const [reviewModalVisible, setReviewModalVisible] = useState(false);         // Admin View
  const [userData, setUserData] = useState(null);
  // Real Data mimicking a real Risk Object
  const [currentStatus, setCurrentStatus] = useState(risk?.status || 'Open');
  const [proofImage, setProofImage] = useState(null);

  // Update status when risk prop changes
  useEffect(() => {
    if (risk?.status) {
      setCurrentStatus(risk.status);
    }
  }, [risk?.status]);

  // Simulated Role (In real app, check auth context)
  // Toggle this to test different views!
  const [userRole, setUserRole] = useState('Assignee'); // 'Admin' or 'Assignee'

  const riskDetails = {
    id: risk?.id || risk?._id || '1',
    title: risk?.title || 'Safety Hazard',
    category: risk?.category || 'Safety',
    severity: risk?.severity || 'High',
    status: currentStatus,
    score: risk?.score || 9,
    likelihood: risk?.likelihood || 3,
    impact: risk?.impact || 3,
    reportedBy: risk?.createdBy?.name || 'Ahmed Al-Mansouri',
    reportedDate: risk?.date || '25 Apr 2025',
    location: 'West Bay Construction Site, Doha',
    description: risk?.description || risk?.subtitle || 'Unsafe scaffolding detected at the construction site.',
    currentAssignee: risk?.assignedTo?.name || 'Mohammed Al-Thani (Site Manager)',
    escalationPath: 'Site Manager → Project Manager → Safety Director',
    evidence: risk?.evidence,
    resolutionNotes: risk?.resolutionNotes,
    attachments: [
      { id: '1', name: 'scaffolding_photo.jpg', type: 'image' },
    ],
    assignedTo: risk?.assignedTo,
    updates: [
      {
        id: '1',
        date: 'Today, 10:30 AM',
        user: 'System',
        message: 'Risk Identified and Matrix Scored.',
      },
    ],
  };



  /* ——— Helper: Update Risk Status API ——— */
  const updateRiskStatusAPI = async (payload) => {
    if (!riskDetails.id) return false;
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Payload can contain status, evidence, resolutionNotes, etc.
      const response = await fetch(`${process.env.BASE_API_URL}/api/risks/${riskDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (json.success) {
        if (payload.status) setCurrentStatus(payload.status);
        return true;
      } else {
        Alert.alert("Error", json.message || "Failed to update risk");
        return false;
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error");
      return false;
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow gallery access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setProofImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  /* ——— Helper: Delete Risk API ——— */
  const handleDeleteRisk = async () => {
    Alert.alert(
      "Delete Risk",
      "Are you sure you want to delete this risk? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch(`${process.env.BASE_API_URL}/api/risks/${riskDetails.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const json = await response.json();
              if (json.success) {
                Alert.alert("Success", "Risk deleted successfully.");
                navigation.goBack();
              } else {
                Alert.alert("Error", json.message || "Failed to delete risk");
              }
            } catch (error) {
              Alert.alert("Error", "Network error");
            }
          }
        }
      ]
    );
  };

  /* ——— Workflow Actions ——— */
  const handleSubmitResolution = async () => {
    if (!proofImage) return;

    // 1️⃣ Upload image
    const uploadResult = await uploadToCloudinary({
      uri: proofImage,
      name: "risk_proof.jpg",
    });

    if (!uploadResult.success) {
      Alert.alert("Upload failed", uploadResult.error);
      return;
    }

    // 2️⃣ Send Cloudinary URL to backend
    const success = await updateRiskStatusAPI({
      status: "Risk Closed",
      evidence: uploadResult.url,
      resolutionNotes: "Resolution proof submitted",
    });

    if (success) {
      setResolutionModalVisible(false);
      Alert.alert("Submitted", "Resolution sent for approval", [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]);
    }
  };

  const handleApproveResolution = async () => {
    // 2. Admin approves
    const success = await updateRiskStatusAPI({ status: 'Resolved' });
    if (success) {
      setReviewModalVisible(false);
      Alert.alert('Approved', 'Risk marked as Resolved.', [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]);
    }
  };

  const handleRejectResolution = async () => {
    // 3. Admin rejects
    const success = await updateRiskStatusAPI({ status: 'Open' });
    if (success) {
      setProofImage(null);
      setReviewModalVisible(false);
      Alert.alert('Rejected', 'Resolution rejected. Sent back to assignee.', [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]);
    }
  };

  /* ——— UI Helpers ——— */
  const getScoreColor = (score) => {
    if (score >= 6) return '#DC2626';
    if (score >= 3) return '#EA580C';
    return '#059669';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return { bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6' };
      case 'Pending Review': return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      case 'Risk Closed': return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
      case 'Resolved': return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
      default: return { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' };
    }
  };

  const statusColors = getStatusColor(currentStatus);
  const scoreColor = getScoreColor(riskDetails.score);

  // Member Assignment States
  const [members, setMembers] = useState([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          const parsedData = JSON.parse(data);
          setUserData(parsedData);
          console.log("User data:", parsedData);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };

    loadUserData();
  }, []);


  useEffect(() => {
    if (userRole === 'Admin' && risk?.projectId) {
      fetchMembers();
    }
  }, [userRole, risk]);

  const fetchMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Generic endpoint + client-side filtering
      const response = await fetch(`${process.env.BASE_API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      const list = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      // Filter members assigned to this projectId
      const membersAssignedToProject = list.filter(member =>
        Array.isArray(member.assignedProjects) &&
        member.assignedProjects.some(pid => String(pid) === String(risk.projectId))
      );
      setMembers(membersAssignedToProject);
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  const handleAssignMember = async (member) => {
    const success = await updateRiskStatusAPI({ assignedTo: member._id });
    if (success) {
      Alert.alert("Success", `Assigned to ${member.name}`);
      setShowMemberPicker(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Risk Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backgroundColor="#1D4ED8"
        titleColor="#fff"
        iconColor="#fff"
        rightIcon={userRole === 'Admin' ? "trash-outline" : null}
        onRightIconPress={handleDeleteRisk}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Card */}
        <View className="bg-white px-6 pt-6 pb-5 mb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-lg font-medium text-gray-500 mb-1">
                {riskDetails.category}
              </Text>
              <Text className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                {riskDetails.title}
              </Text>
              <View className="flex-row items-center flex-wrap gap-2">
                <View
                  style={{
                    backgroundColor: statusColors.bg,
                    borderColor: statusColors.border,
                    borderWidth: 1
                  }}
                  className="px-3 py-1.5 rounded-lg"
                >
                  <Text style={{ color: statusColors.text }} className="text-sm font-semibold">
                    {currentStatus}
                  </Text>
                </View>
                <View className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
                  <Text className="text-sm font-semibold text-gray-700">
                    Score: <Text style={{ color: scoreColor }}>{riskDetails.score}</Text>/9
                  </Text>
                </View>
                <View className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-200">
                  <Text className="text-sm font-semibold text-gray-700">
                    {riskDetails.severity} Risk
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="pt-4 border-t border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-xs text-gray-500 font-medium mb-1">Reported By</Text>
                <Text className="text-sm font-semibold text-gray-900">{riskDetails.reportedBy}</Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 font-medium mb-1">Date</Text>
                <Text className="text-sm font-semibold text-gray-900">{riskDetails.reportedDate}</Text>
              </View>
            </View>

            <View>
              <Text className="text-xs text-gray-500 font-medium mb-1">Assignee</Text>
              {userRole === 'Admin' ? (
                <TouchableOpacity
                  onPress={() => setShowMemberPicker(true)}
                  className="flex-row items-center mt-1"
                >
                  <View className="h-10 w-10 rounded-full bg-indigo-100 items-center justify-center mr-3 border border-indigo-200">
                    <Text className="text-sm font-bold text-indigo-600">
                      {riskDetails.currentAssignee ? riskDetails.currentAssignee.substring(0, 2).toUpperCase() : '?'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">
                      {riskDetails.currentAssignee || "Unassigned"}
                    </Text>
                    <Text className="text-xs text-gray-500">Tap to reassign</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center mt-1">
                  <View className="h-10 w-10 rounded-full bg-indigo-100 items-center justify-center mr-3 border border-indigo-200">
                    <Text className="text-sm font-bold text-indigo-600">
                      {riskDetails.currentAssignee ? riskDetails.currentAssignee.substring(0, 2).toUpperCase() : 'MA'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-gray-900">{riskDetails.currentAssignee}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ——— Member Picker Modal ——— */}
        <Modal visible={showMemberPicker} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/60 px-6">
            <View className="bg-white rounded-2xl w-full max-h-[60%] overflow-hidden">
              <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">Assign Member</Text>
                <TouchableOpacity
                  onPress={() => setShowMemberPicker(false)}
                  className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Feather name="x" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView className="p-2">
                {members.map(member => (
                  <TouchableOpacity
                    key={member._id}
                    className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
                    onPress={() => handleAssignMember(member)}
                  >
                    <View className="h-12 w-12 rounded-full bg-gray-100 items-center justify-center mr-4 border border-gray-200">
                      <Text className="text-base font-bold text-gray-600">
                        {member.name?.substring(0, 1) || 'U'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {member.name || member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unnamed User'}
                      </Text>
                      {member.role && (
                        <Text className="text-sm text-gray-500">{member.role}</Text>
                      )}
                    </View>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
                {members.length === 0 && (
                  <View className="py-12 items-center">
                    <Feather name="users" size={48} color="#E5E7EB" />
                    <Text className="text-gray-400 mt-4 text-center px-8">No members available for this project</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Action Required Banner */}
        {userRole === 'Assignee' && currentStatus === 'Open' && (
          <View className="mx-6 mb-4">
            <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex-row items-start">
              <Feather name="alert-circle" size={20} color="#D97706" className="mt-0.5" />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-amber-900 mb-1">Action Required</Text>
                <Text className="text-sm text-amber-800">
                  Please mitigate this risk and submit proof of resolution.
                </Text>
              </View>
            </View>
          </View>
        )}

        {userRole === 'Admin' && currentStatus === 'Pending Review' && (
          <View className="mx-6 mb-4">
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex-row items-start">
              <Feather name="check-circle" size={20} color="#1D4ED8" className="mt-0.5" />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-blue-900 mb-1">Approval Needed</Text>
                <Text className="text-sm text-blue-800">
                  Review the proof submitted by the assignee.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Risk Matrix Section */}
        {/* <View className="mx-6 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Risk Assessment</Text>
          <View className="bg-white rounded-xl border border-gray-200 p-5">
            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <Text className="text-xs text-gray-500 mb-1">Likelihood</Text>
                <View className="h-16 w-16 rounded-full bg-blue-50 border-2 border-blue-100 items-center justify-center">
                  <Text className="text-2xl font-bold text-blue-700">{riskDetails.likelihood}</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-2">/3</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs text-gray-500 mb-1">Impact</Text>
                <View className="h-16 w-16 rounded-full bg-red-50 border-2 border-red-100 items-center justify-center">
                  <Text className="text-2xl font-bold text-red-700">{riskDetails.impact}</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-2">/3</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs text-gray-500 mb-1">Risk Score</Text>
                <View
                  style={{ backgroundColor: scoreColor + '15', borderColor: scoreColor + '40' }}
                  className="h-16 w-16 rounded-full border-2 items-center justify-center"
                >
                  <Text style={{ color: scoreColor }} className="text-2xl font-bold">
                    {riskDetails.score}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-2">/9</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <View
                  style={{
                    width: `${(riskDetails.score / 9) * 100}%`,
                    backgroundColor: scoreColor
                  }}
                  className="h-full rounded-full"
                />
              </View>
              <Text className="text-xs text-gray-500 ml-3">
                {riskDetails.score <= 3 ? 'Low Risk' : riskDetails.score <= 6 ? 'Medium Risk' : 'High Risk'}
              </Text>
            </View>
          </View>
        </View> */}

        {/* Description Section */}
        <View className="mx-6 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Description</Text>
          <View className="bg-white rounded-xl border border-gray-200 p-5">
            <Text className="text-sm text-gray-700 leading-6">
              {riskDetails.description}
            </Text>
            {riskDetails.status == "Risk Closed" && riskDetails.evidence && (
              <View className="mt-6 pt-6 border-t border-gray-100">
                <Text className="text-sm font-semibold text-gray-900 mb-3">Resolution Proof</Text>
                <View className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <View className="flex-row items-start mb-3">
                    <Feather name="paperclip" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-700 ml-2">Attachment:</Text>
                  </View>
                  <Image
                    source={{ uri: riskDetails.evidence }}
                    className="w-full h-48 rounded-lg mb-4"
                    resizeMode="cover"
                  />
                  {riskDetails.resolutionNotes && (
                    <View className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <Text className="text-sm font-medium text-green-800 mb-1">Resolution Notes</Text>
                      <Text className="text-sm text-green-700">{riskDetails.resolutionNotes}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Additional Details */}
        {/* <View className="mx-6 mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Additional Details</Text>
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <View className="p-5 border-b border-gray-100">
              <Text className="text-xs text-gray-500 font-medium mb-1">Location</Text>
              <Text className="text-sm text-gray-900">{riskDetails.location}</Text>
            </View>
            <View className="p-5 border-b border-gray-100">
              <Text className="text-xs text-gray-500 font-medium mb-1">Escalation Path</Text>
              <Text className="text-sm text-gray-900">{riskDetails.escalationPath}</Text>
            </View>
            <View className="p-5">
              <Text className="text-xs text-gray-500 font-medium mb-1">Updates</Text>
              {riskDetails.updates.map(update => (
                <View key={update.id} className="flex-row py-2">
                  <View className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3" />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900">{update.message}</Text>
                    <Text className="text-xs text-gray-500">{update.date} • by {update.user}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View> */}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-4">
        <View className="flex-row gap-3">
          {/* ACTION 1: Submit Resolution (Assignee Only) */}
          {userRole === 'Assignee' && (currentStatus === 'Open' || currentStatus === 'Pending Review') && (
            <TouchableOpacity
              onPress={() => {
                console.log("RISK DETAILS", riskDetails?.assignedTo._id);
                console.log("USER DATA", userData._id);
                if (riskDetails?.assignedTo._id != userData.id) {
                  Alert.alert("Permission Denied");
                  return;
                }
                setResolutionModalVisible(true)
              }}
              className="flex-1 bg-gray-900 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="check-square" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Submit Resolution</Text>
            </TouchableOpacity>
          )}

          {/* ACTION 2: Review Resolution (Admin Only) */}
          {userRole === 'Admin' && currentStatus === 'Pending Review' && (
            <TouchableOpacity
              onPress={() =>




                setReviewModalVisible(true)



              }
              className="flex-1 bg-green-600 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="eye" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Review Proof</Text>

            </TouchableOpacity>
          )}

          {/* View Attachment Button for Closed Risks */}
          {/* {riskDetails.status === "Risk Closed" && riskDetails.evidence && (
            <TouchableOpacity
              onPress={() => {
                // You can implement a full-screen image viewer here
                Alert.alert("View Attachment", "Open image in full screen?");
              }}
              className="flex-1 bg-blue-600 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Feather name="image" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">View Proof</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>

      {/* ——— MODAL 1: Submit Resolution (Assignee) ——— */}
      <Modal visible={resolutionModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/60">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => {

              if (riskDetails.assignedTo._id != user._id) {
                Alert.alert("You are not assigned to this risk");
                return;
              }
              setResolutionModalVisible(false)
            }}
          />
          <View className="bg-white rounded-t-3xl">
            <View className="p-6 pb-8">
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </View>

              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">Submit Resolution</Text>
                <TouchableOpacity onPress={() => setResolutionModalVisible(false)}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text className="text-sm text-gray-600 mb-6">
                Upload proof of work (photo/document) to mark this risk as resolved.
              </Text>

              <TouchableOpacity
                onPress={pickImageFromGallery}
                className={`h-48 border-2 rounded-2xl items-center justify-center mb-6 overflow-hidden ${proofImage
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 border-dashed bg-gray-50'
                  }`}
              >
                {proofImage ? (
                  <>
                    <Image
                      source={{ uri: proofImage }}
                      style={{ width: "100%", height: "100%" }}
                      className="rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-4 right-4 bg-green-600 px-4 py-2 rounded-lg">
                      <Text className="text-white text-sm font-semibold">Change Photo</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="h-16 w-16 rounded-full bg-gray-100 items-center justify-center mb-3 border border-gray-200">
                      <Feather name="camera" size={28} color="#6B7280" />
                    </View>
                    <Text className="text-gray-700 font-medium mb-1">Tap to Upload Photo</Text>
                    <Text className="text-gray-500 text-sm">JPG, PNG or PDF</Text>
                  </>
                )}
              </TouchableOpacity>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-900 mb-2">Resolution Remarks</Text>
                <TextInput
                  placeholder="Describe the resolution steps taken..."
                  className="bg-gray-50 p-4 rounded-xl text-gray-800 h-32 border border-gray-200"
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmitResolution}
                className={`py-4 rounded-xl items-center ${proofImage
                  ? 'bg-gray-900'
                  : 'bg-gray-300'
                  }`}
                disabled={!proofImage}
              >
                <Text className="text-white font-semibold text-base">
                  Submit for Approval
                </Text>
              </TouchableOpacity>
            </View>
            <View className="h-6 bg-white" />
          </View>
        </View>
      </Modal>

      {/* ——— MODAL 2: Review (Admin) ——— */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/60">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setReviewModalVisible(false)}
          />
          <View className="bg-white rounded-t-3xl">
            <View className="p-6 pb-8">
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </View>

              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">Review Resolution</Text>
                <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                <Text className="text-sm font-medium text-gray-900 mb-3">Proof of Work</Text>
                <View className="h-56 bg-gray-200 rounded-lg items-center justify-center mb-4 overflow-hidden">
                  {proofImage ? (
                    <Image
                      source={{ uri: proofImage }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <Feather name="image" size={48} color="#9CA3AF" />
                      <Text className="text-gray-500 text-sm mt-3">Proof image preview</Text>
                    </>
                  )}
                </View>
                <Text className="text-xs text-gray-500">
                  Submitted by {riskDetails.currentAssignee} • Today, 2:30 PM
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleRejectResolution}
                  className="flex-1 py-4 bg-white border-2 border-red-200 rounded-xl items-center"
                >
                  <Text className="text-red-600 font-semibold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApproveResolution}
                  className="flex-1 py-4 bg-green-600 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-6 bg-white" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RiskDetail;