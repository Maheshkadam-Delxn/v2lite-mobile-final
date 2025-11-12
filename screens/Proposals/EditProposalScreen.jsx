import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/Header';

const EditProposalScreen = ({ navigation, route }) => {
  // Get proposal data from route params or use default data
  const proposalData = route.params?.proposalData || {
    id: '1',
    title: 'Project Name 1',
    clientName: 'Arun Mishra',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna...',
    date: '31/03/2025',
    budget: '$2,500,000',
    startDate: '2025-03-28',
    endDate: '2026-03-22',
    notes: 'The budget includes material costs, labor, and subcontractor fees. Client approvals are required at key project milestones. Additional customization may impact the final budget.',
    category: 'Residential',
    status: 'Draft'
  };

  const [title, setTitle] = useState(proposalData.title);
  const [clientName, setClientName] = useState(proposalData.clientName);
  const [address, setAddress] = useState(proposalData.address);
  const [date, setDate] = useState(proposalData.date);
  const [budget, setBudget] = useState(proposalData.budget);
  const [startDate, setStartDate] = useState(proposalData.startDate);
  const [endDate, setEndDate] = useState(proposalData.endDate);
  const [notes, setNotes] = useState(proposalData.notes);
  const [category, setCategory] = useState(proposalData.category);
  const [hasChanges, setHasChanges] = useState(false);

  const [proposalItems, setProposalItems] = useState([
    { id: 1, name: 'Site Preparation & Excavation', checked: true },
    { id: 2, name: 'Foundation & Structural Work', checked: true },
    { id: 3, name: 'Masonry & Wall Construction', checked: true },
    { id: 4, name: 'Roofing & Waterproofing', checked: true },
    { id: 5, name: 'Electrical & Plumbing', checked: true },
    { id: 6, name: 'Interior Finishing', checked: true },
    { id: 7, name: 'Safety & Compliance Measures', checked: true },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 1, name: 'Website templates.psd', icon: '📄', color: '#0066FF' },
    { id: 2, name: 'Logo vector.ai', icon: '🎨', color: '#FF6B35' },
    { id: 3, name: 'Wireframe for team.figma', icon: '🎯', color: '#FF3366' },
  ]);

  // Track changes
  useEffect(() => {
    const originalData = {
      title: proposalData.title,
      clientName: proposalData.clientName,
      address: proposalData.address,
      date: proposalData.date,
      budget: proposalData.budget,
      startDate: proposalData.startDate,
      endDate: proposalData.endDate,
      notes: proposalData.notes,
    };

    const currentData = {
      title,
      clientName,
      address,
      date,
      budget,
      startDate,
      endDate,
      notes,
    };

    const hasUnsavedChanges = JSON.stringify(originalData) !== JSON.stringify(currentData);
    setHasChanges(hasUnsavedChanges);
  }, [title, clientName, address, date, budget, startDate, endDate, notes]);

  const toggleItem = (id) => {
    setProposalItems(
      proposalItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
    setHasChanges(true);
  };

  const removeAttachment = (id) => {
    Alert.alert(
      'Remove Attachment',
      'Are you sure you want to remove this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setAttachments(attachments.filter((item) => item.id !== id));
            setHasChanges(true);
          }
        },
      ]
    );
  };

  const handleSave = () => {
    // Save logic would go here - API call to update proposal
    console.log('Saving proposal with data:', {
      title,
      clientName,
      address,
      date,
      budget,
      startDate,
      endDate,
      notes,
      proposalItems,
      attachments
    });

    // Show success message
    Alert.alert('Success', 'Proposal updated successfully!', [
      { 
        text: 'OK', 
        onPress: () => {
          setHasChanges(false);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Continue Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => navigation.goBack()
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handlePreview = () => {
    const updatedProposalData = {
      ...proposalData,
      title,
      clientName,
      address,
      date,
      budget,
      startDate,
      endDate,
      notes,
      items: proposalItems,
      attachments
    };
    
    navigation.navigate('PreviewProposal', { proposalData: updatedProposalData });
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'New Proposal Item',
      checked: false
    };
    setProposalItems([...proposalItems, newItem]);
    setHasChanges(true);
  };

  const updateItemName = (id, newName) => {
    setProposalItems(
      proposalItems.map((item) => 
        item.id === id ? { ...item, name: newName } : item
      )
    );
    setHasChanges(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <Header
          title="Edit Proposal"
          showBackButton={true}
          onBackPress={handleCancel}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Save Indicator */}
        {hasChanges && (
          <View style={{
            backgroundColor: '#FFA500',
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Feather name="info" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 14,
              color: 'white',
            }}>
              You have unsaved changes
            </Text>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
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
                placeholder="Enter proposal title"
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
                placeholder="Enter client name"
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
                placeholder="Enter project address"
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
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                }}
                onPress={() => {
                  // Date picker would go here
                  Alert.alert('Info', 'Date picker would open here');
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    color: '#000000',
                  }}>
                  {date}
                </Text>
                <Feather name="calendar" size={18} color="#666666" />
              </TouchableOpacity>
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
                placeholder="Enter project budget"
                keyboardType="numeric"
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
                    placeholder="YYYY-MM-DD"
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
                    placeholder="YYYY-MM-DD"
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
                placeholder="Enter project notes and details"
              />
            </View>
          </View>

          {/* Proposal Items */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                Proposal Items
              </Text>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#0066FF',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
                onPress={addNewItem}
              >
                <Feather name="plus" size={16} color="white" style={{ marginRight: 4 }} />
                <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 12, color: 'white' }}>
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#0066FF',
              }}>
              {proposalItems.map((item, index) => (
                <View key={item.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: index === proposalItems.length - 1 ? 0 : 16,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleItem(item.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                  >
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
                    <TextInput
                      style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000',
                        flex: 1,
                        paddingVertical: 4,
                      }}
                      value={item.name}
                      onChangeText={(text) => updateItemName(item.id, text)}
                      onPressIn={(e) => e.stopPropagation()}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (proposalItems.length > 1) {
                        setProposalItems(proposalItems.filter(i => i.id !== item.id));
                        setHasChanges(true);
                      } else {
                        Alert.alert('Cannot Remove', 'At least one proposal item is required.');
                      }
                    }}
                    style={{
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Feather name="x" size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
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
                }}
                onPress={() => {
                  // File upload logic would go here
                  Alert.alert('Info', 'File picker would open here');
                }}
              >
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
              gap: 12,
            }}>
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                flex: 1,
                backgroundColor: '#E9EFFF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
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
              onPress={handlePreview}
              style={{
                flex: 1,
                backgroundColor: '#00D4FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 15,
                  color: 'white',
                }}>
                Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                flex: 1,
                backgroundColor: '#0066FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 15,
                  color: 'white',
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProposalScreen;