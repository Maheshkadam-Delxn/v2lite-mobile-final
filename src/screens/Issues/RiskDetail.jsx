// RiskDetail.jsx
import React, { useState } from 'react';
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

  // Workflow States
  const [escalateModalVisible, setEscalateModalVisible] = useState(false);
  const [resolutionModalVisible, setResolutionModalVisible] = useState(false); // Assignee View
  const [reviewModalVisible, setReviewModalVisible] = useState(false);         // Admin View

  // Real Data mimicking a real Risk Object
  const [currentStatus, setCurrentStatus] = useState(risk?.status || 'Open');
  const [proofImage, setProofImage] = useState(null);

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
    reportedBy: risk?.owner || 'Ahmed Al-Mansouri',
    reportedDate: risk?.date || '25 Apr 2025',
    location: 'West Bay Construction Site, Doha',
    description: risk?.description || risk?.subtitle || 'Unsafe scaffolding detected at the construction site.',
    currentAssignee: risk?.assignedTo?.name || 'Mohammed Al-Thani (Site Manager)',
    escalationPath: 'Site Manager → Project Manager → Safety Director',
    attachments: [
      { id: '1', name: 'scaffolding_photo.jpg', type: 'image' },
    ],
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
    // 1. Assignee submits proof
    // For now, we simulate an evidence URL since we don't have file upload logic yet.
    const evidenceUrl = "https://example.com/proof_placeholder.jpg";

    // In a real app, you would get remarks from state, e.g., const [remarks, setRemarks] = useState('');
    // Here we'll just send a generic note if none provided.
    const notes = "Resolution proof submitted by assignee.";

    const success = await updateRiskStatusAPI({
      status: 'Pending Review',
      evidence: evidenceUrl,
      resolutionNotes: notes
    });

    if (success) {
      setResolutionModalVisible(false);
      Alert.alert('Submitted', 'Resolution has been submitted for approval.');
    }
  };

  const handleApproveResolution = async () => {
    // 2. Admin approves
    const success = await updateRiskStatusAPI({ status: 'Resolved' });
    if (success) {
      setReviewModalVisible(false);
      Alert.alert('Approved', 'Risk marked as Resolved.');
    }
  };

  const handleRejectResolution = async () => {
    // 3. Admin rejects
    const success = await updateRiskStatusAPI({ status: 'Open' });
    if (success) {
      setProofImage(null);
      setReviewModalVisible(false);
      Alert.alert('Rejected', 'Resolution rejected. Sent back to assignee.');
    }
  };

  /* ——— UI Helpers ——— */
  const getScoreColor = (score) => {
    if (score >= 6) return '#FF3B30';
    if (score >= 3) return '#FF9500';
    return '#10b981';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return { bg: '#3b82f615', text: '#3b82f6' };
      case 'Pending Review': return { bg: '#f59e0b15', text: '#f59e0b' };
      case 'Resolved': return { bg: '#10b98115', text: '#10b981' };
      default: return { bg: '#94a3b815', text: '#94a3b8' };
    }
  };

  const statusColors = getStatusColor(currentStatus);
  const scoreColor = getScoreColor(riskDetails.score);

  // Member Assignment States
  const [members, setMembers] = useState([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

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
      // Optimistically update local state for display
      // Note: riskDetails.currentAssignee is derived from risk object usually, 
      // but here we might need to force a re-render or update a local state for the name.
      // For simplicity, we'll alert. A full app would update the 'risk' object or re-fetch.
      Alert.alert("Success", `Assigned to ${member.name}`);
      setShowMemberPicker(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="Risk Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        backgroundColor="#0066FF"
        titleColor="#fff"
        iconColor="#fff"
        rightIcon={userRole === 'Admin' ? "trash-outline" : null}
        onRightIconPress={handleDeleteRisk}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Header Card (Blue Banner Style) */}
        <View className="bg-white px-5 py-6 rounded-b-[32px] shadow-sm mb-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center gap-2 mb-2">
                <View style={{ backgroundColor: statusColors.bg }} className="px-2.5 py-1 rounded-full">
                  <Text style={{ color: statusColors.text }} className="text-xs font-bold uppercase">
                    {currentStatus}
                  </Text>
                </View>
                <View className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <Text className="text-xs font-bold text-slate-600">
                    Score: {riskDetails.score}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-slate-900 leading-tight">
                {riskDetails.title}
              </Text>
            </View>
            <View className="h-12 w-12 rounded-full bg-blue-50 items-center justify-center">
              <Feather name="alert-triangle" size={24} color="#0066FF" />
            </View>
          </View>

          <View className="mt-4 pt-4 border-t border-slate-100 flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-slate-400 font-medium uppercase mb-1">Assignee</Text>
              {userRole === 'Admin' ? (
                <TouchableOpacity onPress={() => setShowMemberPicker(true)} className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <View className="h-6 w-6 rounded-full bg-indigo-100 items-center justify-center mr-2">
                    <Text className="text-[10px] font-bold text-indigo-600">
                      {riskDetails.currentAssignee ? riskDetails.currentAssignee.substring(0, 2).toUpperCase() : '?'}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-700 mr-2">
                    {riskDetails.currentAssignee || "Unassigned"}
                  </Text>
                  <Feather name="edit-2" size={14} color="#94a3b8" />
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-center">
                  <View className="h-6 w-6 rounded-full bg-indigo-100 items-center justify-center mr-2">
                    <Text className="text-[10px] font-bold text-indigo-600">MA</Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-700">{riskDetails.currentAssignee.split(' ')[0]}</Text>
                </View>
              )}
            </View>
            {!isClientView && (
              <TouchableOpacity onPress={() => setUserRole(r => r === 'Admin' ? 'Assignee' : 'Admin')}>
                <Text className="text-xs text-blue-500 underline">Switch View ({userRole})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ——— Member Picker Modal ——— */}
        <Modal visible={showMemberPicker} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View className="bg-white rounded-2xl w-full max-h-[50%] p-4">
              <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <Text className="text-lg font-bold text-slate-800">Assign Member</Text>
                <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {members.map(member => (
                  <TouchableOpacity
                    key={member._id}
                    className="flex-row items-center p-3 border-b border-gray-50"
                    onPress={() => handleAssignMember(member)}
                  >
                    <View className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center mr-3">
                      <Text className="font-bold text-slate-600">{member.name?.substring(0, 1)}</Text>
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-slate-800">
                        {member.name || member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || member._id || member.id}
                      </Text>
                      <Text className="text-xs text-slate-500">{member.role}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {members.length === 0 && <Text className="text-center text-slate-400 py-4">No members found</Text>}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Action Required Banner */}
        {userRole === 'Assignee' && currentStatus === 'Open' && (
          <View className="mx-4 mb-4 bg-orange-50 border border-orange-100 p-4 rounded-xl flex-row items-center">
            <Feather name="alert-circle" size={20} color="#f59e0b" />
            <Text className="flex-1 ml-3 text-sm text-orange-800 font-medium">
              Action Required: Please mitigate this risk and submit proof of resolution.
            </Text>
          </View>
        )}

        {userRole === 'Admin' && currentStatus === 'Pending Review' && (
          <View className="mx-4 mb-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex-row items-center">
            <Feather name="check-circle" size={20} color="#3b82f6" />
            <Text className="flex-1 ml-3 text-sm text-blue-800 font-medium">
              Approval Needed: Review the proof submitted by the assignee.
            </Text>
          </View>
        )}

        {/* Details Section */}
        <View className="mx-4 bg-white p-5 rounded-2xl mb-4">
          <Text className="text-base font-bold text-slate-900 mb-3">Governance Data</Text>
          <View className="flex-row gap-4">
            <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Text className="text-xs text-slate-500 mb-1">Likelihood</Text>
              <Text className="text-lg font-bold text-slate-800">{riskDetails.likelihood}/3</Text>
            </View>
            <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Text className="text-xs text-slate-500 mb-1">Impact</Text>
              <Text className="text-lg font-bold text-slate-800">{riskDetails.impact}/3</Text>
            </View>
            <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Text className="text-xs text-slate-500 mb-1">Score</Text>
              <Text style={{ color: scoreColor }} className="text-lg font-bold">{riskDetails.score}/9</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 bg-white p-5 rounded-2xl mb-24">
          <Text className="text-base font-bold text-slate-900 mb-2">Description</Text>
          <Text className="text-sm text-slate-600 leading-6 mb-6">
            {riskDetails.description}
          </Text>

          <Text className="text-base font-bold text-slate-900 mb-3">Attachments</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="w-20 h-20 bg-slate-50 rounded-lg items-center justify-center border border-slate-200 border-dashed">
              <Feather name="file-text" size={24} color="#94a3b8" />
              <Text className="text-[10px] text-slate-400 mt-1">Report.pdf</Text>
            </TouchableOpacity>
            {proofImage && (
              <View className="w-20 h-20 rounded-lg bg-green-50 border border-green-200 items-center justify-center">
                <Feather name="check" size={24} color="#10b981" />
                <Text className="text-[10px] text-green-600 mt-1 font-bold">Proof</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white p-4 border-t border-slate-100">
        <View className="flex-row gap-3">

          {/* ACTION 1: Submit Resolution (Assignee Only) */}
          {userRole === 'Assignee' && (currentStatus === 'Open' || currentStatus === 'Mitigating') && (
            <TouchableOpacity
              onPress={() => setResolutionModalVisible(true)}
              className="flex-1 bg-slate-900 py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-slate-900/20"
            >
              <Feather name="check-square" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Submit Resolution</Text>
            </TouchableOpacity>
          )}

          {/* ACTION 2: Review Resolution (Admin Only) */}
          {userRole === 'Admin' && currentStatus === 'Pending Review' && (
            <TouchableOpacity
              onPress={() => setReviewModalVisible(true)}
              className="flex-1 bg-green-600 py-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-green-600/20"
            >
              <Feather name="eye" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Review Proof</Text>
            </TouchableOpacity>
          )}

          {/* Escalate is always available if things go wrong */}
          {(currentStatus !== 'Resolved') && (
            <TouchableOpacity
              onPress={() => setEscalateModalVisible(true)}
              className="w-14 items-center justify-center bg-red-50 rounded-xl border border-red-100"
            >
              <Feather name="arrow-up-right" size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ——— MODAL 1: Submit Resolution (Assignee) ——— */}
      <Modal visible={resolutionModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </View>
            <Text className="text-xl font-bold text-slate-900 mb-2">Submit Resolution</Text>
            <Text className="text-sm text-slate-500 mb-6">Upload proof of work (photo/document) to mark this risk as resolved.</Text>

            <TouchableOpacity
              onPress={() => setProofImage(true)}
              className={`h-40 border-2 border-dashed rounded-2xl items-center justify-center mb-6 ${proofImage ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50'}`}
            >
              {proofImage ? (
                <>
                  <Feather name="check-circle" size={40} color="#10b981" />
                  <Text className="text-green-600 font-bold mt-2">Photo Uploaded</Text>
                </>
              ) : (
                <>
                  <Feather name="camera" size={32} color="#94a3b8" />
                  <Text className="text-slate-400 font-medium mt-2">Tap to Upload Photo</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Add remarks..."
              className="bg-slate-50 p-4 rounded-xl text-slate-800 min-h-[100px] mb-6 border border-slate-100"
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleSubmitResolution}
              className={`py-4 rounded-xl items-center shadow-lg ${proofImage ? 'bg-slate-900 shadow-slate-900/20' : 'bg-slate-300'}`}
              disabled={!proofImage}
            >
              <Text className="text-white font-bold text-base">Submit for Approval</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ——— MODAL 2: Review (Admin) ——— */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8">
            <Text className="text-xl font-bold text-slate-900 mb-6">Review Resolution</Text>

            <View className="bg-slate-50 p-4 rounded-xl mb-6">
              <Text className="text-xs text-slate-500 font-bold uppercase mb-2">Proof of Work</Text>
              <View className="h-48 bg-slate-200 rounded-lg items-center justify-center">
                <Feather name="image" size={32} color="#94a3b8" />
                <Text className="text-slate-500 text-xs mt-2">Simulated Photo Preview</Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={handleRejectResolution}
                className="flex-1 py-4 bg-red-50 border border-red-100 rounded-xl items-center"
              >
                <Text className="text-red-600 font-bold">Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApproveResolution}
                className="flex-1 py-4 bg-green-600 rounded-xl items-center shadow-lg shadow-green-600/20"
              >
                <Text className="text-white font-bold">Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default RiskDetail;