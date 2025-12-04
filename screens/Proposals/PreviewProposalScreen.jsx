import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PreviewProposalScreen = ({ navigation, route }) => {
  const { id, proposal } = route.params || {};

  const [proposalData, setProposalData] = useState(() => {
    // fallback initial data from list (so screen doesn't flash empty)
    if (!proposal) {
      return {
        title: 'Loading...',
        category: 'General',
        status: 'Draft',
        lastModified: '',
        budget: '',
        startDate: '',
        endDate: '',
        notes: '',
        clientName: '',
        address: '',
        items: [],
        attachments: []
      };
    }

    const budgetText =
      proposal.budgetMinRange && proposal.budgetMaxRange
        ? `₹${proposal.budgetMinRange} - ₹${proposal.budgetMaxRange}`
        : '';

    return {
      id: proposal.id,
      title: proposal.projectTypeName || 'Unnamed Project Type',
      category: proposal.category || 'General',
      status: 'Template',
      lastModified: proposal.lastModified || '',
      budget: budgetText,
      startDate: '',
      endDate: '',
      notes: proposal.description || '',
      clientName: '',
      address: '',
      items: (proposal.material || []).map((m, idx) => ({
        id: idx + 1,
        name: `${m.material_name || 'Material'} (${m.quantity || 0} ${m.units || ''})`,
        checked: true
      })),
      attachments: []
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  // Get category color (consistent with other screens)
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

  /* ---------- Fetch template detail by ID ---------- */
  useEffect(() => {
    let mounted = true;

    const fetchTemplateDetail = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');

        const res = await fetch(
          `https://skystruct-lite-backend.vercel.app/api/project-types/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        let json = {};
        try {
          json = await res.json();
        } catch (err) {
          console.warn('Failed to parse template detail JSON', err);
        }

        // Support both { success, data } and direct object
        const data = json.data || json;

        if (!data || !mounted) return;

        const categoryRaw = data.category || 'General';
        const categoryNormalized = categoryRaw
          .toString()
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const rawDate = data.updatedAt || data.createdAt || null;
        const lastModified = rawDate
          ? new Date(rawDate).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        const budgetText =
          data.budgetMinRange && data.budgetMaxRange
            ? `₹${data.budgetMinRange} - ₹${data.budgetMaxRange}`
            : '';

        const materials = Array.isArray(data.material) ? data.material : [];

        if (mounted) {
          setProposalData((prev) => ({
            ...prev,
            id: data._id || prev.id,
            title: data.projectTypeName || prev.title || 'Unnamed Project Type',
            category: categoryNormalized,
            status: 'Template',
            lastModified: lastModified,
            budget: budgetText,
            // You can later replace these with real proposal dates
            startDate: '',
            endDate: '',
            notes: data.description || prev.notes || '',
            clientName: prev.clientName || '',
            address: prev.address || '',
            items: materials.map((m, idx) => ({
              id: idx + 1,
              name: `${m.material_name || 'Material'} (${m.quantity || 0} ${m.units || ''})`,
              checked: true,
            })),
            attachments: prev.attachments || [],
          }));
        }
      } catch (err) {
        console.error('Error fetching template detail:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTemplateDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEdit = () => {
    setShowActionsModal(false);
    // You can navigate to create/edit template screen or proposal edit screen
    navigation.navigate('CreateTemplate', { 
      initialData: proposalData,
      mode: 'editFromPreview',
      templateId: id,
    });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const ShareModal = () => (
    <Modal
      visible={showShareModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000000', textAlign: 'center', marginBottom: 24 }}>Share Proposal</Text>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#25D366', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Feather name="message-circle" size={20} color="white" />
            </View>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#000000', flex: 1 }}>Share via WhatsApp</Text>
            <Feather name="chevron-right" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#0088CC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Feather name="mail" size={20} color="white" />
            </View>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#000000', flex: 1 }}>Send via Email</Text>
            <Feather name="chevron-right" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#0066FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Feather name="download" size={20} color="white" />
            </View>
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#000000', flex: 1 }}>Download PDF</Text>
            <Feather name="chevron-right" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowShareModal(false)}
            style={{ marginTop: 24, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ActionsModal = () => (
    <Modal
      visible={showActionsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowActionsModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000000', textAlign: 'center', marginBottom: 24 }}>Proposal Actions</Text>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={handleEdit}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Edit Proposal</Text>
            <Feather name="edit-2" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#0066FF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
            onPress={handleShare}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Share Proposal</Text>
            <Feather name="share-2" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#FF3B30', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            onPress={() => setShowActionsModal(false)}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: 'white' }}>Delete Proposal</Text>
            <Feather name="trash-2" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowActionsModal(false)}
            style={{ marginTop: 16, backgroundColor: '#E8F0FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15, color: '#0066FF' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'zip': return '📦';
      default: return '📎';
    }
  };

  const getFileColor = (fileType) => {
    switch (fileType) {
      case 'pdf': return '#FF3B30';
      case 'doc': return '#0066FF';
      case 'zip': return '#FF9500';
      default: return '#666666';
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: '#666666', marginTop: 16 }}>
          Loading template details...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header
          title="Preview Proposal"
          showBackButton={true}
          // rightIcon="more-vertical"
          onRightIconPress={() => setShowActionsModal(true)}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Proposal Header */}
          <View style={{ padding: 16 }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                borderLeftWidth: 4,
                borderLeftColor: getCategoryColor(proposalData.category),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 20,
                      color: '#000000',
                      marginBottom: 4,
                    }}
                  >
                    {proposalData.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: getCategoryColor(proposalData.category) + '20',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 16,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 12,
                        color: getCategoryColor(proposalData.category),
                      }}
                    >
                      {proposalData.category}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#00D4FF' + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 12,
                      color: '#00D4FF',
                    }}
                  >
                    {proposalData.status}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#666666',
                  lineHeight: 20,
                }}
              >
                Last modified: {proposalData.lastModified}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}
            >
              Basic Information
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <InfoRow label="Template Name" value={proposalData.title} />
              <InfoRow label="Category" value={proposalData.category} />
              {/* You can map client details here later if your flow adds it */}
            </View>
          </View>

          {/* Project Details */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}
            >
              Project Details
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <InfoRow label="Budget Range" value={proposalData.budget || '—'} />
              <InfoRow label="Estimated Duration" value={proposal?.estimated_days ? `${proposal.estimated_days} days` : '—'} />
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}
                >
                  Description
                </Text>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 13,
                    color: '#666666',
                    lineHeight: 20,
                  }}
                >
                  {proposalData.notes || 'No description provided.'}
                </Text>
              </View>
            </View>
          </View>

          {/* Proposal Items (Materials) */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}
            >
              Template Items (Materials)
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
              }}
            >
              {proposalData.items.length === 0 ? (
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#666666',
                  }}
                >
                  No materials defined for this template.
                </Text>
              ) : (
                proposalData.items.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: index === proposalData.items.length - 1 ? 0 : 12,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: item.checked ? '#0066FF' : '#F5F5F5',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      {item.checked && <Feather name="check" size={14} color="white" />}
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000',
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Attachments (optional, currently empty) */}
          {proposalData.attachments && proposalData.attachments.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 16,
                  color: '#000000',
                  marginBottom: 12,
                }}
              >
                Attachments
              </Text>

              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                {proposalData.attachments.map((file, index) => (
                  <View
                    key={file.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: index === proposalData.attachments.length - 1 ? 0 : 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: getFileColor(file.type) + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{getFileIcon(file.type)}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: 'Urbanist-Medium',
                          fontSize: 14,
                          color: '#000000',
                        }}
                      >
                        {file.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 12,
                          color: '#666666',
                          marginTop: 2,
                        }}
                      >
                        {file.type.toUpperCase()} File
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#F5F5F5',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Feather name="download" size={16} color="#666666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Action Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#F5F5F5',
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('SubmitProposal', { proposalData, templateId: id })}
          style={{
            backgroundColor: '#0066FF',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Feather name="send" size={20} color="white" style={{ marginRight: 8 }} />
          <Text
            style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 16,
              color: 'white',
            }}
          >
            Use This Template
          </Text>
        </TouchableOpacity>
      </View>

      <ShareModal />
      <ActionsModal />
    </View>
  );
};

// Reusable Info Row Component
const InfoRow = ({ label, value }) => (
  <View style={{ marginBottom: 16 }}>
    <Text
      style={{
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 13,
        color: '#000000',
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontFamily: 'Urbanist-Regular',
        fontSize: 14,
        color: '#666666',
      }}
    >
      {value || '—'}
    </Text>
  </View>
);

export default PreviewProposalScreen;
