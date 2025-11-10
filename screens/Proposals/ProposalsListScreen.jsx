
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '../../components/BottomNavbar';
import Header from '../../components/Header'; // Import the Header component
import { useNavigation } from '@react-navigation/native';

const ProposalsListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [proposals, setProposals] = useState([]); // Dynamic state for proposals
  const [isLoading, setIsLoading] = useState(true); // Loading state for API

  // Filter states
  const [status, setStatus] = useState('Active');
  const [fromDate, setFromDate] = useState('22/03/2025');
  const [toDate, setToDate] = useState('15/04/2025');
  const [clientName, setClientName] = useState('Arun Mishra');
  const [designer, setDesigner] = useState('John Smith & Associates');

  // Helper to map category to color (case-insensitive)
  const getCategoryColor = (category) => {
    const key = (category || '').toString().toLowerCase();
    const colorMap = {
      residential: '#00D4FF',
      office: '#0066FF',
      home: '#00D4FF',
      business: '#0066FF',
      // add more mappings as needed
    };
    return colorMap[key] || '#0066FF';
  };

  // Fetch proposals from API on mount
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token from AsyncStorage:', token ? 'Token present' : 'No token');

        const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Include token if available
          },
        });

        console.log('API response status:', response.status);

        const json = await response.json().catch(() => ({}));
        console.log('Response JSON:', json);

        // Accept both shapes: [ ... ] OR { data: [ ... ], success: true }
        const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

        if (items.length === 0) {
          console.log('No items array found in API response.');
          setProposals([]);
          return;
        }

        const mappedProposals = items.map((item) => {
          // prefer updatedAt, fallback to createdAt
          const rawDate = item.updatedAt || item.createdAt || null;
          const lastModified = rawDate
            ? new Date(rawDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          // Normalize category to Title Case for display
          const categoryRaw = item.category || 'General';
          const categoryNormalized = categoryRaw
            .toString()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            id: item._id || item.id || Math.random().toString(36).slice(2),
            name: item.name || 'Unnamed Template',
            category: categoryNormalized,
            categoryColor: getCategoryColor(categoryNormalized),
            lastModified,
          };
        });

        console.log('Mapped proposals:', mappedProposals);
        setProposals(mappedProposals);
      } catch (error) {
        console.error('Network error fetching proposals:', error);
        setProposals([]); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const ProposalCard = ({ proposal }) => (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: proposal.categoryColor, // Use dynamic color for border
      }}
    >
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#666666',
              marginRight: 4,
            }}
          >
            Name :
          </Text>
          <Text
            style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 13,
              color: '#000000',
              flex: 1,
            }}
          >
            {proposal.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#666666',
              marginRight: 4,
            }}
          >
            Category :
          </Text>
          <Text
            style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 13,
              color: proposal.categoryColor,
            }}
          >
            {proposal.category}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#666666',
              marginRight: 4,
            }}
          >
            Last Modified :
          </Text>
          <Text
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#000000',
            }}
          >
            {proposal.lastModified}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#000000',
              marginRight: 6,
            }}
          />
          <Text
            style={{
              fontFamily: 'Urbanist-Medium',
              fontSize: 13,
              color: '#000000',
            }}
          >
            Preview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text
            style={{
              fontFamily: 'Urbanist-Medium',
              fontSize: 13,
              color: '#000000',
            }}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text
            style={{
              fontFamily: 'Urbanist-Medium',
              fontSize: 13,
              color: '#000000',
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Filter Modal
  const FilterModal = () => (
    <Modal visible={showFilterModal} transparent={true} animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          {/* Handle Bar */}
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          {/* Title */}
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000000', textAlign: 'center', marginBottom: 24 }}>Proposals Filter</Text>

          {/* Status Dropdown */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Status</Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}>{status}</Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* From Date */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>From Date</Text>
            <View style={{ backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}>{fromDate}</Text>
              <Feather name="calendar" size={20} color="#666666" />
            </View>
          </View>

          {/* To Date */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>To Date</Text>
            <View style={{ backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}>{toDate}</Text>
              <Feather name="calendar" size={20} color="#666666" />
            </View>
          </View>

          {/* Client Name Dropdown */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Client Name</Text>
            <TouchableOpacity style={{ backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}>{clientName}</Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Designer Dropdown */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14, color: '#000000', marginBottom: 8 }}>Designer</Text>
            <TouchableOpacity style={{ backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}>{designer}</Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleFilter = () => {
    console.log('Filter pressed');
    setShowFilterModal(true); // Open filter modal
  };

  // Actions Modal
  const ActionsModal = () => (
    <Modal visible={showActionsModal} transparent={true} animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          {/* Handle Bar */}
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          {/* Title */}
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000000', textAlign: 'center', marginBottom: 24 }}>Proposals Actions</Text>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={() => navigation.navigate('ViewProposal')}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>View Proposal</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={() => navigation.navigate('ChooseTemplate')}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Choose Template</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {/* Use the Header component */}
        <Header
          title="Proposals Templates"
          // showBackButton={true}
          rightIcon="filter-outline"
          onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Search and Add Button - No top padding for flush UI */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 48, marginRight: 12 }}>
            <Feather name="search" size={20} color="#999999" />
            <TextInput
              style={{ flex: 1, marginLeft: 8, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}
              placeholder="Enter Template Name.."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('CreateProposalScreen')}
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Manage Proposals Button */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
          <TouchableOpacity onPress={() => setShowActionsModal(true)} style={{ backgroundColor: '#0066FF', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Manage Proposals</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F5F5F5' }}>
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Template List</Text>
        </View>

        {/* Proposals List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {proposals.length > 0 ? (
            proposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
          ) : (
            <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 50 }}>No templates found.</Text>
          )}
        </ScrollView>
      </View>

      {/* Modals */}
      <FilterModal />
      <ActionsModal />

   
    </View>
  );
};

export default ProposalsListScreen;