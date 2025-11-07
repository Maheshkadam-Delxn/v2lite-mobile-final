import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';

const ProposalsListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  
  // Filter states
  const [status, setStatus] = useState('Active');
  const [fromDate, setFromDate] = useState('22/03/2025');
  const [toDate, setToDate] = useState('15/04/2025');
  const [clientName, setClientName] = useState('Arun Mishra');
  const [designer, setDesigner] = useState('John Smith & Associates');

  const proposals = [
    {
      id: 1,
      name: 'Mordern Office Template',
      category: 'Office',
      categoryColor: '#0066FF',
      lastModified: '12/03/2025 16:20'
    },
    {
      id: 2,
      name: 'Mordern Home Template',
      category: 'Home',
      categoryColor: '#00D4FF',
      lastModified: '12/03/2025 16:20'
    },
    {
      id: 3,
      name: 'Mordern Business Template',
      category: 'Business',
      categoryColor: '#0066FF',
      lastModified: '12/03/2025 16:20'
    }
  ];

  const ProposalCard = ({ proposal }) => (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#0066FF'
    }}>
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 13,
            color: '#666666',
            marginRight: 4
          }}>
            Name :
          </Text>
          <Text style={{
            fontFamily: 'Urbanist-SemiBold',
            fontSize: 13,
            color: '#000000',
            flex: 1
          }}>
            {proposal.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 13,
            color: '#666666',
            marginRight: 4
          }}>
            Category :
          </Text>
          <Text style={{
            fontFamily: 'Urbanist-SemiBold',
            fontSize: 13,
            color: proposal.categoryColor
          }}>
            {proposal.category}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 13,
            color: '#666666',
            marginRight: 4
          }}>
            Last Modified :
          </Text>
          <Text style={{
            fontFamily: 'Urbanist-Regular',
            fontSize: 13,
            color: '#000000'
          }}>
            {proposal.lastModified}
          </Text>
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
      }}>
        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#000000',
            marginRight: 6
          }} />
          <Text style={{
            fontFamily: 'Urbanist-Medium',
            fontSize: 13,
            color: '#000000'
          }}>
            Preview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Feather name="edit-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{
            fontFamily: 'Urbanist-Medium',
            fontSize: 13,
            color: '#000000'
          }}>
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Feather name="trash-2" size={12} color="#000000" style={{ marginRight: 6 }} />
          <Text style={{
            fontFamily: 'Urbanist-Medium',
            fontSize: 13,
            color: '#000000'
          }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Filter Modal
  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingBottom: 30,
          paddingHorizontal: 20
        }}>
          {/* Handle Bar */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#E0E0E0',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20
          }} />

          {/* Title */}
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 18,
            color: '#000000',
            textAlign: 'center',
            marginBottom: 24
          }}>
            Proposals Filter
          </Text>

          {/* Status Dropdown */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: '#000000',
              marginBottom: 8
            }}>
              Status
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}>
                {status}
              </Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* From Date */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: '#000000',
              marginBottom: 8
            }}>
              From Date
            </Text>
            <View style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}>
                {fromDate}
              </Text>
              <Feather name="calendar" size={20} color="#666666" />
            </View>
          </View>

          {/* To Date */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: '#000000',
              marginBottom: 8
            }}>
              To Date
            </Text>
            <View style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}>
                {toDate}
              </Text>
              <Feather name="calendar" size={20} color="#666666" />
            </View>
          </View>

          {/* Client Name Dropdown */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: '#000000',
              marginBottom: 8
            }}>
              Client Name
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}>
                {clientName}
              </Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Designer Dropdown */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: '#000000',
              marginBottom: 8
            }}>
              Designer
            </Text>
            <TouchableOpacity style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}>
                {designer}
              </Text>
              <Feather name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            gap: 12
          }}>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={{
                flex: 1,
                backgroundColor: '#E8F0FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center'
              }}
            >
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 15,
                color: '#0066FF'
              }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={{
                flex: 1,
                backgroundColor: '#0066FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center'
              }}
            >
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 15,
                color: 'white'
              }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Actions Modal
  const ActionsModal = () => (
    <Modal
      visible={showActionsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowActionsModal(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingBottom: 30,
          paddingHorizontal: 20
        }}>
          {/* Handle Bar */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#E0E0E0',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20
          }} />

          {/* Title */}
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 18,
            color: '#000000',
            textAlign: 'center',
            marginBottom: 24
          }}>
            Proposals Actions
          </Text>

          {/* View Proposal Button */}
          <TouchableOpacity style={{
            backgroundColor: '#0066FF',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12
          }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 15,
              color: 'white'
            }}>
              View Proposal
            </Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>

          {/* Approve Proposal Button */}
          <TouchableOpacity style={{
            backgroundColor: '#0066FF',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12
          }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 15,
              color: 'white'
            }}>
              Approve Proposal
            </Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>

          {/* Reject Proposal Button */}
          <TouchableOpacity style={{
            backgroundColor: '#0066FF',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 15,
              color: 'white'
            }}>
              Reject Proposal
            </Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {/* Custom Header with Back and Filter buttons - BLUE BACKGROUND */}
        <View style={{
          backgroundColor: '#0066FF', // Changed to blue
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" /> {/* White icon */}
          </TouchableOpacity>

          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 18,
            color: '#FFFFFF' // White text
          }}>
            Proposals
          </Text>

          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="filter" size={20} color="#FFFFFF" /> {/* White icon */}
          </TouchableOpacity>
        </View>

        {/* Search and Add Button */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          backgroundColor: '#F5F5F5'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
            marginRight: 12
          }}>
            <Feather name="search" size={20} color="#999999" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 8,
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000'
              }}
              placeholder="Enter Template Name.."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity 
  style={{
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center'
  }}
  onPress={() => navigation.navigate('CreateProposalScreen')}
>
  <Feather name="plus" size={24} color="white" />
</TouchableOpacity>
        </View>

        {/* Manage Proposals Button */}
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: '#F5F5F5'
        }}>
          <TouchableOpacity
            onPress={() => setShowActionsModal(true)}
            style={{
              backgroundColor: '#0066FF',
              height: 48,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 15,
              color: 'white'
            }}>
              Manage Proposals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#F5F5F5'
        }}>
          <Text style={{
            fontFamily: 'Urbanist-Bold',
            fontSize: 16,
            color: '#000000'
          }}>
            Template List
          </Text>
        </View>

        {/* Proposals List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
        >
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </ScrollView>
      </View>

      {/* Modals */}
      <FilterModal />
      <ActionsModal />

      {/* Bottom Navigation */}
      <BottomNavbar />
    </SafeAreaView>
  );
};

export default ProposalsListScreen;