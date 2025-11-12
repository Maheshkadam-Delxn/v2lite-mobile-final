import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'

const ViewProposal = ({ navigation }) => {
  const attachmentDocuments = [
    { id: 1, name: 'Proposal Document', size: '630 KB' },
    { id: 2, name: 'Proposal Document', size: '630 KB' },
    { id: 3, name: 'Proposal Document', size: '630 KB' }
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header 
          title="Proposal Name" 
          showBackButton={true}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
         
        >
          {/* Proposal Overview */}
          <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Proposal Overview
            </Text>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF'
            }}>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  width: 120
                }}>
                  Title :
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  flex: 1
                }}>
                  Green Valley Apartment Complex
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  width: 120
                }}>
                  Client :
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#0066FF',
                  flex: 1
                }}>
                  ABC Developers Pvt. Ltd.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  width: 120
                }}>
                  Designer :
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  flex: 1
                }}>
                  John Smith & Associates
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  width: 120
                }}>
                  Date Submitted :
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  flex: 1
                }}>
                  31/03/2025
                </Text>
              </View>
            </View>
          </View>

          {/* Project Summary */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Project Summary
            </Text>
            
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF'
            }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  Project Title
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 15,
                  color: '#000000',
                  marginBottom: 12
                }}>
                  Green Valley Apartment Complex
                </Text>
                <View style={{
                  height: 1,
                  backgroundColor: '#E0E0E0'
                }} />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  Client
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 15,
                  color: '#000000',
                  marginBottom: 12
                }}>
                  ABC Developers Pvt. Ltd.
                </Text>
                <View style={{
                  height: 1,
                  backgroundColor: '#E0E0E0'
                }} />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  Location
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 15,
                  color: '#000000',
                  marginBottom: 12
                }}>
                  Downtown, Los Angeles, CA
                </Text>
                <View style={{
                  height: 1,
                  backgroundColor: '#E0E0E0'
                }} />
              </View>

              <View>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  Project Type
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 15,
                  color: '#000000'
                }}>
                  Residential High-Rise
                </Text>
              </View>
            </View>
          </View>

          {/* Proposal Details */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Proposal Details
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 14,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: 'https://via.placeholder.com/56' }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12
                }}
              />
              <View style={{
                flex: 1,
                marginLeft: 12
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-SemiBold',
                  fontSize: 15,
                  color: '#000000'
                }}>
                  Proposal Document
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#999999',
                  marginTop: 4
                }}>
                  630 KB
                </Text>
              </View>
              <TouchableOpacity style={{
                width: 36,
                height: 36,
                backgroundColor: '#0066FF',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Feather name="download" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Attachments */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Attachments
            </Text>

            {attachmentDocuments.map((doc) => (
              <View 
                key={doc.id} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#0066FF',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={{ uri: 'https://via.placeholder.com/56' }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12
                  }}
                />
                <View style={{
                  flex: 1,
                  marginLeft: 12
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 15,
                    color: '#000000'
                  }}>
                    {doc.name}
                  </Text>
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 13,
                    color: '#999999',
                    marginTop: 4
                  }}>
                    {doc.size}
                  </Text>
                </View>
                <TouchableOpacity style={{
                  width: 36,
                  height: 36,
                  backgroundColor: '#0066FF',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Feather name="download" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Comments */}
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Comments
            </Text>

            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: '#0066FF'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                color: '#000000',
                lineHeight: 22
              }}>
                Please review the attached proposal and design specifications for [Project Name]. Your approval is required to proceed with execution. Any modifications should be communicated before finalizing the contract.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            flexDirection: 'row',
            gap: 12
          }}>
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#FFE5E5',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: '#FF4444'
              }}>
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#00C896',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: 'white'
              }}>
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

     
    </SafeAreaView>
  )
}

export default ViewProposal