import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const ProposalsListScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Filter states (demo defaults; wire to real pickers if needed)
  const [status, setStatus] = useState('Active');
  const [fromDate, setFromDate] = useState('22/03/2025');
  const [toDate, setToDate] = useState('15/04/2025');
  const [clientName, setClientName] = useState('Arun Mishra');
  const [designer, setDesigner] = useState('John Smith & Associates');

  // helper to map category to color (case-insensitive)
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

  useEffect(() => {
    let mounted = true;
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token from AsyncStorage:', token ? 'Token present' : 'No token');

        const response = await fetch('https://skystruct-lite-backend.vercel.app/api/project-types', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log('API response status:', response.status);

        // Try parse JSON safely
        let json = {};
        try {
          json = await response.json();
        } catch (err) {
          console.warn('Response JSON parse failed', err);
        }

        const items = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

        const mappedProposals = items.map((item) => {
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
            raw: item,
          };
        });

        if (mounted) {
          setProposals(mappedProposals);
        }
      } catch (error) {
        console.error('Network error fetching proposals:', error);
        if (mounted) setProposals([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => {
      mounted = false;
    };
  }, []);

  // Simple client-side search filtering (case-insensitive)
  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    const q = searchQuery.trim().toLowerCase();
    return proposals.filter(
      (p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [searchQuery, proposals]);

  // navigation handlers
  const handlePreview = (proposal) => {
    navigation.navigate('PreviewProposalScreen', { id: proposal.id, proposal });
  };

  const handleEdit = (proposal) => {
    navigation.navigate('EditProposalScreen', { id: proposal.id, proposal });
  };

  const handleDelete = (proposal) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${proposal.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(proposal.id),
        },
      ]
    );
  };

  // Example delete API call (adjust endpoint & method to your backend)
  const confirmDelete = async (id) => {
    setIsDeletingId(id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://skystruct-lite-backend.vercel.app/api/project-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id));
      } else {
        const body = await response.text();
        console.warn('Delete failed', response.status, body);
        Alert.alert('Delete failed', 'Could not delete template. Try again.');
      }
    } catch (err) {
      console.error('Delete error', err);
      Alert.alert('Network error', 'Unable to delete. Check your connection.');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Proposal card as small render function (used in FlatList)
  const renderProposal = ({ item }) => (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: item.categoryColor,
      }}
    >
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Name :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: '#000000', flex: 1 }}>{item.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Category :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: item.categoryColor }}>{item.category}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Last Modified :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.lastModified}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <TouchableOpacity
          onPress={() => handlePreview(item)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleEdit(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>
            {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Modals (kept similar to your original)
  const FilterModal = () => (
    <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Filter</Text>

          {/* ... keep the filter controls as-is or convert to pickers */}
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

  const ActionsModal = () => (
    <Modal visible={showActionsModal} transparent animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Proposals Actions</Text>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={() => {
              setShowActionsModal(false);
              navigation.navigate('ViewProposal');
            }}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>View Proposal</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={() => {
              setShowActionsModal(false);
              navigation.navigate('ChooseTemplate');
            }}
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
        <Header
          title="Proposals Templates"
          rightIcon="filter-outline"
          onRightIconPress={() => setShowFilterModal(true)}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 48, marginRight: 12 }}>
            <Feather name="search" size={20} color="#999999" />
            <TextInput
              style={{ flex: 1, marginLeft: 8, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}
              placeholder="Enter Template Name.."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('CreateProposalScreen')}
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => setShowActionsModal(true)} style={{ backgroundColor: '#0066FF', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Manage Proposals</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Template List</Text>
        </View>

        <FlatList
          data={filteredProposals}
          keyExtractor={(item) => item.id}
          renderItem={renderProposal}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 50 }}>No templates found.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FilterModal />
      <ActionsModal />
    </View>
  );
};

export default ProposalsListScreen;
