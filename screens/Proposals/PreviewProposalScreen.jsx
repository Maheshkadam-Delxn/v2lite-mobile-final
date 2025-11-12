import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal, Image } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';

const PreviewProposalScreen = ({ navigation, route }) => {
  // Sample data - in real app, this would come from route.params or context
  const [proposalData, setProposalData] = useState({
    id: '1',
    title: 'Modern Residential Proposal',
    clientName: 'Arun Mishra',
    address: '123 Main Street, Downtown City, State 12345',
    date: '31/03/2025',
    budget: '$2,500,000',
    startDate: '2025-03-28',
    endDate: '2026-03-22',
    category: 'Residential',
    status: 'Draft',
    lastModified: '28/03/2025, 14:30',
    notes: 'The budget includes material costs, labor, and subcontractor fees. Client approvals are required at key project milestones. Additional customization may impact the final budget.',
    items: [
      { id: 1, name: 'Site Preparation & Excavation', checked: true },
      { id: 2, name: 'Foundation & Structural Work', checked: true },
      { id: 3, name: 'Masonry & Wall Construction', checked: true },
      { id: 4, name: 'Roofing & Waterproofing', checked: true },
      { id: 5, name: 'Electrical & Plumbing', checked: true },
      { id: 6, name: 'Interior Finishing', checked: true },
      { id: 7, name: 'Safety & Compliance Measures', checked: true },
    ],
    attachments: [
      { id: 1, name: 'Floor_Plan.pdf', type: 'pdf' },
      { id: 2, name: '3D_Renderings.zip', type: 'zip' },
      { id: 3, name: 'Material_Specs.docx', type: 'doc' },
    ]
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  // Get category color (consistent with your other screens)
  const getCategoryColor = (category) => {
    const key = (category || '').toString().toLowerCase();
    const colorMap = {
      residential: '#00D4FF',
      office: '#0066FF',
      home: '#00D4FF',
      business: '#0066FF',
    };
    return colorMap[key] || '#0066FF';
  };

  const handleEdit = () => {
    setShowActionsModal(false);
    navigation.navigate('EditProposal', { proposalData });
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const ShareModal = () => (
    <Modal visible={showShareModal} transparent={true} animationType="slide" onRequestClose={() => setShowShareModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          {/* Handle Bar */}
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          {/* Title */}
          <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 18, color: '#000000', textAlign: 'center', marginBottom: 24 }}>Share Proposal</Text>

          {/* Share Options */}
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

          {/* Cancel Button */}
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
    <Modal visible={showActionsModal} transparent={true} animationType="slide" onRequestClose={() => setShowActionsModal(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20 }}>
          {/* Handle Bar */}
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

          {/* Title */}
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

          {/* Cancel Button */}
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {/* Header with actions button */}
        <Header
          title="Preview Proposal"
          showBackButton={true}
          rightIcon="more-vertical"
          onRightIconPress={() => setShowActionsModal(true)}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Proposal Header */}
          <View style={{ padding: 16 }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              borderLeftWidth: 4,
              borderLeftColor: getCategoryColor(proposalData.category),
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 20,
                    color: '#000000',
                    marginBottom: 4,
                  }}>
                    {proposalData.title}
                  </Text>
                  <View style={{
                    backgroundColor: getCategoryColor(proposalData.category) + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 16,
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 12,
                      color: getCategoryColor(proposalData.category),
                    }}>
                      {proposalData.category}
                    </Text>
                  </View>
                </View>
                <View style={{
                  backgroundColor: '#00D4FF' + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 12,
                    color: '#00D4FF',
                  }}>
                    {proposalData.status}
                  </Text>
                </View>
              </View>

              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#666666',
                lineHeight: 20,
              }}>
                Last modified: {proposalData.lastModified}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12,
            }}>
              Basic Information
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
            }}>
              <InfoRow label="Client Name" value={proposalData.clientName} />
              <InfoRow label="Address" value={proposalData.address} />
              <InfoRow label="Date" value={proposalData.date} />
            </View>
          </View>

          {/* Project Details */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12,
            }}>
              Project Details
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
            }}>
              <InfoRow label="Budget" value={proposalData.budget} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <InfoRow label="Start Date" value={proposalData.startDate} />
                </View>
                <View style={{ flex: 1 }}>
                  <InfoRow label="End Date" value={proposalData.endDate} />
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                  Notes
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  lineHeight: 20,
                }}>
                  {proposalData.notes}
                </Text>
              </View>
            </View>
          </View>

          {/* Proposal Items */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12,
            }}>
              Proposal Items
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
            }}>
              {proposalData.items.map((item, index) => (
                <View key={item.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index === proposalData.items.length - 1 ? 0 : 12,
                }}>
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: item.checked ? '#0066FF' : '#F5F5F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    {item.checked && <Feather name="check" size={14} color="white" />}
                  </View>
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                    flex: 1,
                  }}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Attachments */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12,
            }}>
              Attachments
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
            }}>
              {proposalData.attachments.map((file, index) => (
                <View key={file.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index === proposalData.attachments.length - 1 ? 0 : 12,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: getFileColor(file.type) + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ fontSize: 20 }}>{getFileIcon(file.type)}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 14,
                      color: '#000000',
                    }}>
                      {file.name}
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 12,
                      color: '#666666',
                      marginTop: 2,
                    }}>
                      {file.type.toUpperCase()} File
                    </Text>
                  </View>

                  <TouchableOpacity style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#F5F5F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="download" size={16} color="#666666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Button */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SubmitProposal', { proposalData })}
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
          <Text style={{
            fontFamily: 'Urbanist-SemiBold',
            fontSize: 16,
            color: 'white',
          }}>
            Submit Proposal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ShareModal />
      <ActionsModal />
    </SafeAreaView>
  );
};

// Reusable Info Row Component
const InfoRow = ({ label, value }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 13,
      color: '#000000',
      marginBottom: 4,
    }}>
      {label}
    </Text>
    <Text style={{
      fontFamily: 'Urbanist-Regular',
      fontSize: 14,
      color: '#666666',
    }}>
      {value}
    </Text>
  </View>
);

export default PreviewProposalScreen;