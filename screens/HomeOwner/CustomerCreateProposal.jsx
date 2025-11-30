import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import CustomerBottomNavBar from 'components/CustomerBottomNavBar';
import Header from 'components/Header';

const CustomerCreateProposal = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState(
    ''
  );
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState(
    ''
  );

  const [proposalItems, setProposalItems] = useState([
    { id: 1, name: 'Site Preparation & Excavation', checked: false },
    { id: 2, name: 'Foundation & Structural Work', checked: false },
    { id: 3, name: 'Masonry & Wall Construction', checked: false },
    { id: 4, name: 'Roofing & Waterproofing', checked: false },
    { id: 5, name: 'Electrical & Plumbing', checked: false },
    { id: 6, name: 'Interior Finishing', checked: false },
    { id: 7, name: 'Safety & Compliance Measures', checked: false },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 1, name: 'Website templates.psd', icon: '📄', color: '#0066FF' },
    { id: 2, name: 'Logo vector.ai', icon: '🎨', color: '#FF6B35' },
    { id: 3, name: 'Wireframe for team.figma', icon: '🎯', color: '#FF3366' },
  ]);

  const toggleItem = (id) => {
    setProposalItems(
      proposalItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header title={"Create a Proposal"}/>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}>
              Basic Information
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#0066FF',
              }}>
              {/* Title */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Title
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  marginBottom: 16,
                }}
                value={title}
                onChangeText={setTitle}
              />

              {/* Client Name */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Client Name
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  marginBottom: 16,
                }}
                value={clientName}
                onChangeText={setClientName}
              />

              {/* Address */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Address
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  marginBottom: 16,
                  minHeight: 60,
                  textAlignVertical: 'top',
                }}
                value={address}
                onChangeText={setAddress}
                multiline
              />

              {/* Date */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Date
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                  }}>
                  {date}
                </Text>
                <Feather name="calendar" size={18} color="#666666" />
              </View>
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
              }}>
              Project Details
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#0066FF',
              }}>
              {/* Budget */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Budget
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  marginBottom: 16,
                }}
                value={budget}
                onChangeText={setBudget}
              />

              {/* Start Date and End Date */}
              <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 13,
                      color: '#000000',
                      marginBottom: 8,
                    }}>
                    Start Date
                  </Text>
                  <TextInput
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#000000',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                    }}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 13,
                      color: '#000000',
                      marginBottom: 8,
                    }}>
                    End Date
                  </Text>
                  <TextInput
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#000000',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                    }}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              {/* Notes */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Notes
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  minHeight: 70,
                  textAlignVertical: 'top',
                }}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          </View>

          {/* Proposal Items */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}>
              Proposal Items
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#0066FF',
              }}>
              {proposalItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: index === proposalItems.length - 1 ? 0 : 16,
                  }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      backgroundColor: item.checked ? '#0066FF' : 'transparent',
                      borderWidth: 2,
                      borderColor: item.checked ? '#0066FF' : '#CCCCCC',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                    {item.checked && <Feather name="check" size={14} color="white" />}
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#000000',
                      flex: 1,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Attachments */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginBottom: 12,
              }}>
              Attachments
            </Text>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#0066FF',
              }}>
              {/* Upload Button */}
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  paddingVertical: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#F5F5F5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <Feather name="upload" size={24} color="#666666" />
                </View>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 13,
                    color: '#666666',
                  }}>
                  Browse files to upload
                </Text>
              </TouchableOpacity>

              {/* Uploaded Files */}
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 14,
                  color: '#000000',
                  marginBottom: 12,
                }}>
                Uploaded
              </Text>

              {attachments.map((file, index) => (
                <View
                  key={file.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: index === attachments.length - 1 ? 0 : 12,
                  }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: file.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                    <Text style={{ fontSize: 20 }}>{file.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Urbanist-Medium',
                        fontSize: 13,
                        color: '#000000',
                        marginBottom: 2,
                      }}>
                      {file.name}
                    </Text>
                    <View
                      style={{
                        width: 80,
                        height: 3,
                        backgroundColor: file.color,
                        borderRadius: 2,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => removeAttachment(file.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#FFE8E8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Feather name="x" size={14} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              marginBottom: 16,
            }}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={{
                flex: 1,
                backgroundColor: '#E9EFFF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginRight: 8,
              }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 15,
                  color: '#0066FF',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation?.navigate('SubmitProposalCustomer')}
              style={{
                flex: 1,
                backgroundColor: '#0066FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginLeft: 8,
              }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 15,
                  color: 'white',
                }}>
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
};

export default CustomerCreateProposal;
