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
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

/* -------------------- Helper: category color -------------------- */
const getCategoryColor = (category) => {
  const key = (category || '').toString().toLowerCase();
  const colorMap = {
    residential: '#00D4FF',
    office: '#0066FF',
    home: '#00D4FF',
    business: '#0066FF',
    commercial: '#FF6B00',
    industrial: '#8B4513',
    general: '#666666',
  };
  return colorMap[key] || '#0066FF';
};

/* -------------------- Parent screen -------------------- */
const ProposalsListScreen = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const API_URL = `${process.env.BASE_API_URL}`;

  useEffect(() => {
    let mounted = true;
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/api/project-types`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

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
            projectTypeName: item.projectTypeName || 'Unnamed Project',
            name: item.projectTypeName || 'Unnamed Project', // For backward compatibility
            category: categoryNormalized,
            categoryColor: getCategoryColor(categoryNormalized),
            lastModified,
            image: item.image || null,
            description: item.description || '',
            landArea: item.landArea || '',
            estimated_days: item.estimated_days || 0,
            budgetMinRange: item.budgetMinRange || '',
            budgetMaxRange: item.budgetMaxRange || '',
            material: item.material || [],
            createdAt: item.createdAt || '',
            raw: item,
          };
        });

        if (mounted) setProposals(mappedProposals);
      } catch (error) {
        console.error('Network error fetching proposals:', error);
        if (mounted) setProposals([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => { mounted = false; };
  }, []);

  // Keep search local
  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    const q = searchQuery.trim().toLowerCase();
    return proposals.filter(
      (p) =>
        (p.projectTypeName || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }, [searchQuery, proposals]);

  const handlePreview = (proposal) => navigation.navigate('PreviewProposalScreen', { 
    id: proposal.id, 
    proposal 
  });

  // Navigate to CreateTemplate page for editing
  const handleEdit = (proposal) => {
    navigation.navigate('CreateTemplate', { 
      initialData: proposal,
      mode: 'edit'
    });
  };

  // Navigate to CreateTemplate page for creating new template
  const handleCreate = () => {
    navigation.navigate('CreateTemplate', { 
      mode: 'create'
    });
  };

  const confirmDelete = async (id) => {
    setIsDeletingId(id);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/project-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id));
        Alert.alert('Success', 'Project type deleted successfully!');
      } else {
        const body = await response.text();
        console.warn('Delete failed', response.status, body);
        Alert.alert('Delete failed', 'Could not delete project type. Try again.');
      }
    } catch (err) {
      console.error('Delete error', err);
      Alert.alert('Network error', 'Unable to delete. Check your connection.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleDelete = (proposal) => {
    Alert.alert(
      'Delete Project Type',
      `Are you sure you want to delete "${proposal.projectTypeName}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(proposal.id) },
      ]
    );
  };

  const renderProposal = ({ item }) => (
    <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: item.categoryColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
      <View style={{ marginBottom: 12 }}>
        {item.image && (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: 120, borderRadius: 8, marginBottom: 12 }} resizeMode="cover" />
        )}
        
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Project Type :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: '#000000', flex: 1 }}>{item.projectTypeName}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Category :</Text>
          <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13, color: item.categoryColor }}>{item.category}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Description :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000', flex: 1 }} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Land Area :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.landArea}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Budget Range :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>
            ₹{item.budgetMinRange} - ₹{item.budgetMaxRange}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Estimated Days :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.estimated_days} days</Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Materials :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>
            {item.material?.length || 0} items
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#666666', marginRight: 4 }}>Last Modified :</Text>
          <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 13, color: '#000000' }}>{item.lastModified}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
        <TouchableOpacity onPress={() => handlePreview(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#000000', marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleEdit(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)} style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 13, color: '#000000' }}>{isDeletingId === item.id ? 'Deleting...' : 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#666666', marginTop: 16 }}>Loading project types...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header
          title="Project Types"
          rightIcon="filter"
          onRightIconPress={() => setShowFilterModal(true)}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#F5F5F5' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 48, marginRight: 12 , marginTop: 14 }}>
            <Feather name="search" size={20} color="#999999" />
            <TextInput
              style={{ flex: 1, marginLeft: 8, fontFamily: 'Urbanist-Regular', fontSize: 14, color: '#000000' }}
              placeholder="Search project types..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity 
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center', marginTop: 14 }} 
            onPress={handleCreate}
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => setShowActionsModal(true)} style={{ backgroundColor: '#0066FF', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Manage Project Types</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#000000' }}>Project Types List ({filteredProposals.length})</Text>
        </View>

        <FlatList
          data={filteredProposals}
          keyExtractor={(item) => item.id}
          renderItem={renderProposal}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Feather name="file-text" size={48} color="#CCCCCC" />
              <Text style={{ textAlign: 'center', color: '#666666', fontSize: 16, marginTop: 16 }}>No project types found.</Text>
              <Text style={{ textAlign: 'center', color: '#999999', fontSize: 14, marginTop: 8 }}>Create your first project type by tapping the + button</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Filter Project Types</Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{ flex: 1, backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Actions Modal */}
      <Modal visible={showActionsModal} transparent animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 24 }}>Project Type Actions</Text>

            <TouchableOpacity
              style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
              onPress={() => {
                setShowActionsModal(false);
                navigation.navigate('ClientProposalScreen',{status:"Proposal Under Approval" , title:"All Proposals"});
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>View Proposals</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
              onPress={() => {
                setShowActionsModal(false);
                navigation.navigate('ClientProposalScreen',{status:"Initialize", title:"Approved Proposals"});
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Approve Proposals</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
              onPress={() => {
                setShowActionsModal(false);
                navigation.navigate('ClientProposalScreen',{status:"Rejected", title:"Rejected Proposals"});
              }}
            >
              <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Rejected Proposals</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProposalsListScreen;