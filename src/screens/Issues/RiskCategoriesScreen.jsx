import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.BASE_API_URL}/api`;

/* ——— Helper: Get Score Color ——— */
const getScoreColor = (score) => {
  if (score >= 6) return '#FF3B30'; // Red (High/Critical)
  if (score >= 3) return '#FF9500'; // Orange (Medium)
  return '#10b981'; // Green (Low)
};

/* ——— Risk Item Component ——— */
const RiskItem = ({ item, onPress }) => {
  const scoreColor = getScoreColor(item.score);

  return (
    <TouchableOpacity onPress={() => onPress(item)} className="flex-row items-center rounded-xl bg-white p-4 mb-3 border border-slate-100 shadow-sm">
      {/* Icon Badge */}
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: (item.color || '#FF9500') + '15' }}>
        <Feather name={item.icon || 'alert-triangle'} size={22} color={item.color || '#FF9500'} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-base font-bold text-slate-800 flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
          {/* Score Badge */}
          <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-md">
            <Text className="text-xs font-bold text-slate-600 mr-1">Score:</Text>
            <Text style={{ color: scoreColor }} className="text-xs font-bold">{item.score}</Text>
          </View>
        </View>

        <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>{item.description || item.subtitle}</Text>

        <View className="mt-3 flex-row items-center">
          <View className={`px-2 py-0.5 rounded text-[10px] items-center justify-center border`}
            style={{
              borderColor: item.status === 'Open' ? '#3b82f6' : item.status === 'Mitigating' ? '#f59e0b' : '#10b981',
              backgroundColor: item.status === 'Open' ? '#3b82f610' : item.status === 'Mitigating' ? '#f59e0b10' : '#10b98110'
            }}>
            <Text style={{
              color: item.status === 'Open' ? '#3b82f6' : item.status === 'Mitigating' ? '#f59e0b' : '#10b981',
              fontSize: 10, fontWeight: '600'
            }}>
              {item.status ? item.status.toUpperCase() : 'OPEN'}
            </Text>
          </View>
          <Text className="text-xs text-slate-400 ml-auto">{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ——— Add Risk Modal (The Matrix) ——— */
const AddRiskModal = ({ visible, onClose, onSubmit, members = [] }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [likelihood, setLikelihood] = useState(1);
  const [impact, setImpact] = useState(1);
  const [category, setCategory] = useState({ name: 'General', icon: 'alert-circle', color: '#8E8E93' });
  const [assignedTo, setAssignedTo] = useState(null);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  // Calculated Score
  const score = likelihood * impact;
  const scoreColor = getScoreColor(score);

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      setTitle('');
      setDesc('');
      setLikelihood(1);
      setImpact(1);
      setCategory({ name: 'General', icon: 'alert-circle', color: '#8E8E93' });
      setAssignedTo(null);
    }
  }, [visible]);

  /* ——— Simple Dropdown/Selector Helper ——— */
  const LevelSelector = ({ label, value, onChange }) => (
    <View className="flex-1">
      <Text className="mb-2 text-sm font-medium text-slate-500">{label}</Text>
      <View className="flex-row rounded-xl border border-gray-200 bg-gray-50 p-1">
        {[1, 2, 3].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChange(level)}
            className={`flex-1 items-center justify-center rounded-lg py-2 ${value === level ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`font-bold ${value === level
              ? (level === 3 ? 'text-red-500' : level === 2 ? 'text-orange-500' : 'text-green-600')
              : 'text-slate-400'
              }`}>
              {level === 1 ? 'L' : level === 2 ? 'M' : 'H'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[90%] rounded-t-3xl bg-white pb-8">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-100 px-6 py-4">
            <Text className="text-lg font-bold text-slate-800">Identify New Risk</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-slate-100 rounded-full">
              <Feather name="x" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
            {/* 1. Risk Matrix Score Card */}
            <View className="mb-6 rounded-2xl bg-blue-50 p-4 border border-blue-100">
              <Text className="text-center text-sm font-semibold text-blue-800 mb-4">RISK MATRIX SCORE</Text>

              <View className="flex-row items-center justify-center gap-6">
                {/* Likelihood x Impact = Score */}
                <View className="items-center">
                  <Text className="text-2xl font-bold text-slate-700">{likelihood}</Text>
                  <Text className="text-xs text-slate-500 mt-1">Likelihood</Text>
                </View>
                <Feather name="x" size={16} color="#94a3b8" />
                <View className="items-center">
                  <Text className="text-2xl font-bold text-slate-700">{impact}</Text>
                  <Text className="text-xs text-slate-500 mt-1">Impact</Text>
                </View>
                <Feather name="chevrons-right" size={20} color="#94a3b8" />
                <View className="items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Text style={{ color: scoreColor }} className="text-3xl font-extrabold">{score}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 mt-1">SCORE</Text>
                </View>
              </View>

              {score >= 6 && (
                <View className="mt-4 flex-row items-center justify-center bg-red-100 px-3 py-1.5 rounded-lg">
                  <Feather name="alert-circle" size={14} color="#dc2626" />
                  <Text className="ml-2 text-xs font-bold text-red-700">Client Notification Triggered</Text>
                </View>
              )}
            </View>

            {/* 2. Matrix Inputs */}
            <View className="mb-2">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium text-slate-500">Risk Assessment</Text>
                <View className="bg-blue-50 px-2 py-1 rounded">
                  <Text className="text-[10px] text-blue-600 font-medium">Why Score? Triggers Escalation</Text>
                </View>
              </View>
              <View className="flex-row gap-4 mb-6">
                <LevelSelector label="Likelihood (1-3)" value={likelihood} onChange={setLikelihood} />
                <LevelSelector label="Impact (1-3)" value={impact} onChange={setImpact} />
              </View>
            </View>

            {/* 3. Basic Details */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-slate-500">Risk Title</Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-slate-50 p-4 text-base text-slate-800"
                placeholder="e.g. Foundation Crack"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Assign To User (Dynamic) */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-slate-500">Assign To </Text>
              <TouchableOpacity
                onPress={() => setShowMemberPicker(!showMemberPicker)}
                className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-slate-50 p-4"
              >
                <View className="flex-row items-center gap-3">
                  {assignedTo ? (
                    <>
                      <View className="h-8 w-8 rounded-full bg-indigo-100 items-center justify-center">
                        <Text className="font-bold text-indigo-600">{assignedTo.name?.substring(0, 2).toUpperCase()}</Text>
                      </View>
                      <Text className="text-base text-slate-800">{assignedTo.name} ({assignedTo.role || 'Member'})</Text>
                    </>
                  ) : (
                    <Text className="text-base text-slate-400">Select Assignee</Text>
                  )}
                </View>
                <Feather name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>

              {/* Member Picker Dropdown */}
              {showMemberPicker && (
                <View className="mt-2 rounded-xl border border-gray-200 bg-white max-h-40">
                  <ScrollView nestedScrollEnabled>
                    {members.map(member => (
                      <TouchableOpacity
                        key={member._id}
                        className="p-3 border-b border-gray-50 flex-row items-center"
                        onPress={() => {
                          setAssignedTo(member);
                          setShowMemberPicker(false);
                        }}
                      >
                        <View className="h-6 w-6 rounded-full bg-slate-100 items-center justify-center mr-3">
                          <Text className="text-[10px]">{member.name?.substring(0, 1)}</Text>
                        </View>
                        <Text className="text-sm text-slate-700">
                          {member.name || member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || member._id || member.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {members.length === 0 && (
                      <Text className="p-3 text-sm text-slate-400 text-center">No members found</Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-slate-500">Description</Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-slate-50 p-4 text-base text-slate-800"
                placeholder="Describe the risk..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={desc}
                onChangeText={setDesc}
              />
            </View>

            {/* 4. Category Selector (Simplified) */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-slate-500">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                {['Safety', 'Financial', 'Schedule', 'Quality', 'Design'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory({ name: cat, icon: 'tag', color: '#6366f1' })}
                    className={`px-4 py-2 rounded-lg border ${category.name === cat ? 'bg-slate-800 border-slate-800' : 'bg-white border-gray-200'
                      }`}
                  >
                    <Text className={`text-sm font-semibold ${category.name === cat ? 'text-white' : 'text-slate-600'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

          </ScrollView>

          {/* Submit Button */}
          <View className="px-6 pt-2">
            <TouchableOpacity
              onPress={() => onSubmit({ title, desc, likelihood, impact, score, category, assignedTo })}
              className="w-full items-center justify-center rounded-2xl bg-slate-900 py-4 shadow-lg shadow-blue-900/20"
            >
              <Text className="text-base font-bold text-white">Identify Risk</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

/* ——— Main Screen ——— */
const RiskCategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log("route",route);
  const { project } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Member fetching
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  /* ——— Fetch Data ——— */
  const fetchRisks = async () => {
    if (!project._id) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/risks/project/${project._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        setRisks(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch risks", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    console.log("projectId",project._id);
    if (!project._id) return;
    setLoadingMembers(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Generic endpoint + client-side filtering as per instruction
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      console.log("members",json);
      const list = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      // Filter members assigned to this projectId
      const membersAssignedToProject = list.filter(member =>
        Array.isArray(member.assignedProjects) &&
        member.assignedProjects.some(pid => String(pid) === String(project._id))
      );
      console.log("members",list);
      setMembers(membersAssignedToProject);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (project._id) {
      fetchRisks();
      fetchMembers();
    }
  }, [project._id]);


  const handleCreateRisk = async (newRiskData) => {
    if (!newRiskData.title) {
      Alert.alert("Missing Fields", "Please provide a title for the risk.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const body = {
        projectId: project._id,
        title: newRiskData.title,
        description: newRiskData.desc,
        category: newRiskData.category.name,
        severity: newRiskData.score ? (newRiskData.score >= 6 ? 'High' : 'Medium') : undefined,
        likelihood: newRiskData.likelihood,
        impact: newRiskData.impact,
      };

      if (newRiskData.assignedTo && newRiskData.assignedTo._id) {
        body.assignedTo = newRiskData.assignedTo._id;
      }

      const response = await fetch(`${API_URL}/risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const json = await response.json();
      if (json.success) {
        Alert.alert("Success", "Risk identified successfully.");
        fetchRisks();
        setModalVisible(false);
      } else {
        Alert.alert("Error", json.message || "Failed to create risk");
      }
    } catch (error) {
      Alert.alert("Error", "Network error creating risk");
    }
  };

  const handleCardPress = (item) => {
    // Pass isClientView: false for Admin/Manager
    navigation.navigate('RiskDetail', { risk: item, isClientView: false });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header Search */}
      <View className="mx-4 mb-4 mt-3 h-12 flex-row items-center rounded-xl bg-white px-4 border border-slate-100 shadow-sm">
        <Feather name="search" size={20} color="#94a3b8" className="mr-3" />
        <TextInput
          placeholder="Search risks..."
          placeholderTextColor="#94a3b8"
          className="flex-1 text-base text-slate-800"
        />
        <Feather name="filter" size={20} color="#94a3b8" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <FlatList
          data={risks}
          keyExtractor={item => item._id || item.id}
          renderItem={({ item }) => <RiskItem item={item} onPress={handleCardPress} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ListHeaderComponent={
            <Text className="mb-4 text-sm font-bold text-slate-400 tracking-wider">ACTIVE RISKS</Text>
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-slate-400">No risks identified yet.</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-16 w-16 items-center justify-center rounded-full bg-slate-900 shadow-xl shadow-slate-900/30"
        onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <AddRiskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateRisk}
        members={members}
      />
    </SafeAreaView>
  );
};

export default RiskCategoriesScreen;