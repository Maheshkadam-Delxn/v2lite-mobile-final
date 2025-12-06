import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.BASE_API_URL}`;

const ClientProposalScreen = ({ navigation, route }) => {
  // ROUTE STATUS FILTER
  const statusFilter = route?.params?.status || null;
  const titleHeader = route?.params?.title || 'Proposals';
  console.log('🟦 STATUS FILTER:', statusFilter);

  const [searchQuery, setSearchQuery] = useState('');
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 💠 Assign modal state
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [assignForm, setAssignForm] = useState({
    assigneeName: '',
    startDate: '',
  });

  // Allowed statuses
  const PROPOSAL_STATUSES = [
    'Proposal Under Approval',
    'Initialize',
    'Approved',
    'Rejected',
  ];

  useEffect(() => {
    let mounted = true;

    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');

        const response = await fetch(`${API_URL}/api/projects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const json = await response.json();
        const items = Array.isArray(json.data) ? json.data : [];

        // Only proposals with allowed statuses
        let validProposals = items.filter((item) =>
          PROPOSAL_STATUSES.includes(item.status)
        );

        // Map into UI shape
        const mapped = validProposals.map((item) => ({
          id: item._id,
          title: item.name,
          client: item.clientName,
          designer: item.manager?.name || 'Unknown',
          image: item.projectImages || 'https://via.placeholder.com/80',
          status: item.status,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : '—',
          raw: item,
        }));

        console.log(mapped);

        // Apply route filter if passed
        let finalList = mapped;
        if (statusFilter) {
          finalList = mapped.filter(
            (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        if (mounted) setProposals(finalList);
      } catch (error) {
        console.error('Proposal fetch error:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  // Search Filter
  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.designer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Colors by status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { bg: '#D4EDDA', text: '#155724', icon: 'check-circle' };
      case 'rejected':
        return { bg: '#F8D7DA', text: '#721C24', icon: 'x-circle' };
      case 'pending':
        return { bg: '#FFF3CD', text: '#856404', icon: 'clock' };
      case 'proposal under approval':
        return { bg: '#CCE7FF', text: '#0066CC', icon: 'file-text' };
      case 'initialize':
        return { bg: '#FFEFD5', text: '#CC8400', icon: 'edit' };
      default:
        return { bg: '#E2E3E5', text: '#383D41', icon: 'help-circle' };
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = getStatusColor(status);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.bg,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          alignSelf: 'flex-start',
        }}
      >
        <Feather name={colors.icon} size={14} color={colors.text} />
        <Text
          style={{
            fontFamily: 'Urbanist-SemiBold',
            fontSize: 12,
            color: colors.text,
            marginLeft: 4,
          }}
        >
          {status}
        </Text>
      </View>
    );
  };

  // 🔵 Open Assign Modal
  const handleOpenAssignModal = (proposal) => {
    setSelectedProposal(proposal);
    setAssignForm({
      assigneeName: '',
      startDate: '',
    });
    setAssignModalVisible(true);
  };

  // 🔵 Confirm Assign (hook API here later)
  const handleConfirmAssign = () => {
    if (!assignForm.assigneeName || !assignForm.startDate) {
      Alert.alert('Missing Fields', 'Please fill assignee and date.');
      return;
    }

    const payload = {
      projectId: selectedProposal?.id,
      assigneeName: assignForm.assigneeName,
      startDate: assignForm.startDate,
    };

    console.log('✅ Assign Project Payload:', payload);

    // TODO:
    // await fetch(`${API_URL}/api/projects/assign`, { method: "POST", body: JSON.stringify(payload) })

    setAssignModalVisible(false);
    Alert.alert('Success', 'Project assigned successfully.');
  };

  // Proposal card
  const ProposalCard = ({ proposal }) => {
    const statusColors = getStatusColor(proposal.status);
    const isInitializable =
      proposal.status?.toLowerCase() === 'initialize'; // only for Initialize

    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 20,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
          borderLeftWidth: 4,
          borderLeftColor: statusColors.text,
        }}
      >
        {/* Top – title, status, date */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ViewProposal', { proposal })}
            >
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#1A1A1A',
                  marginBottom: 8,
                }}
              >
                {proposal.title}
              </Text>
            </TouchableOpacity>
            <StatusBadge status={proposal.status} />
          </View>

          <Text
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 12,
              color: '#666',
            }}
          >
            {proposal.date}
          </Text>
        </View>

        {/* Client & Designer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Feather name="user" size={16} color="#0066FF" />
              <Text
                style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  marginLeft: 8,
                }}
              >
                {proposal.client}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="award" size={16} color="#FF6B35" />
              <Text
                style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  marginLeft: 8,
                }}
              >
                {proposal.designer}
              </Text>
            </View>
          </View>
        </View>

        {/* Assign Project button only for Initialize status */}
        {isInitializable && (
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              onPress={() => handleOpenAssignModal(proposal)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: '#0066FF',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Feather name="calendar" size={16} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: 'white',
                  marginLeft: 6,
                }}
              >
                Assign Project
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header
          title={titleHeader}
          showBackButton={true}
          rightIcon="filter"
          onRightIconPress={() => {}}
          backgroundColor="transparent"
          titleColor="white"
          iconColor="white"
        />

        {/* Search */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 56,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 15,
              elevation: 5,
              borderWidth: 1,
              borderColor: '#F0F0F0',
            }}
          >
            <Feather name="search" size={22} color="#0066FF" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                fontFamily: 'Urbanist-Medium',
                fontSize: 16,
              }}
              placeholder="Search proposals..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top stats */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 24,
                }}
              >
                Proposal List
              </Text>
              <Text
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#666',
                }}
              >
                Manage and review design proposals
              </Text>
            </View>

            <LinearGradient
              colors={['#0066FF', '#0052CC']}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 14,
                  color: 'white',
                }}
              >
                {filteredProposals.length}{' '}
                {filteredProposals.length === 1 ? 'Proposal' : 'Proposals'}
              </Text>
            </LinearGradient>
          </View>

          {/* Loader */}
          {isLoading && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <ActivityIndicator size="large" color="#0066FF" />
            </View>
          )}

          {/* List */}
          {!isLoading && filteredProposals.length > 0 && (
            <View>
              {filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </View>
          )}

          {/* Empty search */}
          {!isLoading && filteredProposals.length === 0 && proposals.length > 0 && (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Feather name="search" size={48} color="#D0D5DD" />
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 20,
                  marginTop: 12,
                }}
              >
                No proposals found
              </Text>
            </View>
          )}

          {/* Fully empty */}
          {!isLoading && proposals.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Feather name="file-text" size={56} color="#ADB5BD" />
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 22,
                  marginTop: 12,
                }}
              >
                No proposals yet
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🔴 Assign Project Modal */}
      <Modal
        visible={assignModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              Assign Project
            </Text>
            <Text
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#666',
                marginBottom: 16,
              }}
            >
              {selectedProposal?.title}
            </Text>

            {/* Assignee */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                Assign To
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                }}
                placeholder="Enter user name / role"
                placeholderTextColor="#9CA3AF"
                value={assignForm.assigneeName}
                onChangeText={(text) =>
                  setAssignForm((prev) => ({ ...prev, assigneeName: text }))
                }
              />
            </View>

            {/* Date */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                Start / Assignment Date
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={assignForm.startDate}
                onChangeText={(text) =>
                  setAssignForm((prev) => ({ ...prev, startDate: text }))
                }
              />
            </View>

            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setAssignModalVisible(false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#4B5563',
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmAssign}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: '#0066FF',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Feather name="check" size={16} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: 'white',
                    marginLeft: 6,
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClientProposalScreen;
