 
 
 import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import Header from '../../components/Header';

const SubmitProposal = ({ navigation }) => {
  const [clientName] = useState('Arun Mishra');
  const [clientEmail] = useState('arun.mishra@gmail.com');
  const [clientPhone] = useState('9326261416');
  const [designerNotes, setDesignerNotes] = useState('The budget includes material costs, labor, and subcontractor fees.Client approvals are required at key project milestones.Additional customization may impact the final budget.');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
         <Header
          title="Submit Proposal"
          showBackButton={true}
          // rightIcon="filter-outline"
          // onRightIconPress={handleFilter}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Proposal Overview */}
          <View style={{ padding: 16 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000'
              }}>
                Proposal Overview
              </Text>
              <TouchableOpacity>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#0066FF'
                }}>
                  Preview
                </Text>
              </TouchableOpacity>
            </View>

            {/* Preview Box */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF',
              padding: 16,
              minHeight: 280
            }}>
              {/* Document Preview Grid */}
              <View style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 8,
                padding: 12,
                minHeight: 240
              }}>
                {/* Grid of document pages */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}>
                  {/* Page 1 - Top Left */}
                  <View style={{
                    width: '48%',
                    height: 110,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    marginBottom: 8,
                    padding: 6,
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }}>
                    <View style={{ width: '60%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginBottom: 3 }} />
                    <View style={{ width: '80%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 3 }} />
                    <View style={{ width: '50%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 6 }} />
                    <View style={{ width: '100%', height: 30, backgroundColor: '#F5F5F5', borderRadius: 3, marginBottom: 4 }} />
                    <View style={{ width: '90%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '70%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2 }} />
                  </View>

                  {/* Page 2 - Top Right */}
                  <View style={{
                    width: '48%',
                    height: 110,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    marginBottom: 8,
                    padding: 6,
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }}>
                    <View style={{ width: '70%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginBottom: 3 }} />
                    <View style={{ width: '100%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 3 }} />
                    <View style={{ width: '85%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 6 }} />
                    <View style={{ width: '90%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '95%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '80%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2 }} />
                  </View>

                  {/* Page 3 - Bottom Left */}
                  <View style={{
                    width: '48%',
                    height: 110,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    padding: 6,
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }}>
                    <View style={{ width: '55%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginBottom: 4 }} />
                    <View style={{ 
                      width: '100%', 
                      height: 40, 
                      backgroundColor: '#FFE8D0', 
                      borderRadius: 3, 
                      marginBottom: 4,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <View style={{ width: '70%', height: 20, backgroundColor: '#FFD9A8', borderRadius: 2 }} />
                    </View>
                    <View style={{ width: '90%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '80%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2 }} />
                  </View>

                  {/* Page 4 - Bottom Right */}
                  <View style={{
                    width: '48%',
                    height: 110,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    padding: 6,
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }}>
                    <View style={{ width: '65%', height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginBottom: 3 }} />
                    <View style={{ width: '100%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '90%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '85%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '95%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 2 }} />
                    <View style={{ width: '75%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2 }} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Proposal Details */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12
            }}>
              Proposal Details
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF'
            }}>
              {/* Client Name */}
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 13,
                color: '#000000',
                marginBottom: 8
              }}>
                Client Name
              </Text>
              <View style={{
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
                marginBottom: 16
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000'
                }}>
                  {clientName}
                </Text>
              </View>

              {/* Client Email */}
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 13,
                color: '#000000',
                marginBottom: 8
              }}>
                Client Email
              </Text>
              <View style={{
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
                marginBottom: 16
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000'
                }}>
                  {clientEmail}
                </Text>
              </View>

              {/* Client Phone */}
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 13,
                color: '#000000',
                marginBottom: 8
              }}>
                Client Phone
              </Text>
              <View style={{
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
                marginBottom: 16
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  color: '#000000'
                }}>
                  {clientPhone}
                </Text>
              </View>

              {/* Designer's Notes */}
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 13,
                color: '#000000',
                marginBottom: 8
              }}>
                Designer's Notes
              </Text>
              <TextInput
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#000000',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  minHeight: 80,
                  textAlignVertical: 'top'
                }}
                value={designerNotes}
                onChangeText={setDesignerNotes}
                multiline
              />
            </View>
          </View>

          {/* Approval Notice */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 16,
              color: '#000000',
              marginBottom: 12
            }}>
              Approval Notice
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 13,
                color: '#000000',
                lineHeight: 20
              }}>
                Please review the attached proposal and design specifications for [Project Name]. Your approval is required to proceed with execution. Any modifications should be communicated before finalizing the contract.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginBottom: 16
          }}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={{
                flex: 1,
                backgroundColor: '#E9EFFF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginRight: 8
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
              onPress={() => {
                // Handle submit action
              }}
              style={{
                flex: 1,
                backgroundColor: '#0066FF',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginLeft: 8
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
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </SafeAreaView>
  );
};

export default SubmitProposal;
