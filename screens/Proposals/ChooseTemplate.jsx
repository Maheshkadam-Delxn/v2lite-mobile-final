import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'

const ChooseTemplate = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(1)

  const templates = [
    {
      id: 1,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 3,
      title: 'Modern Residential Proposal',
      description: 'A comprehensive template for residential construction projects with detailed sections.',
      image: 'https://via.placeholder.com/80'
    }
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <Header 
          title="Choose Template" 
          showBackButton={true}
          backgroundColor="#0066FF"
          titleColor="white"
          iconColor="white"
        />

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 180 }} // Only change: was 100 → now 180
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 12
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 48
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
                placeholder="Search..."
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Info Text */}
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 12
          }}>
            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 13,
              color: '#666666',
              textAlign: 'center',
              lineHeight: 20
            }}>
              Select an admin-created template to start{'\n'}customizing your proposal easily
            </Text>
          </View>

          {/* Templates Section */}
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 18,
              color: '#000000',
              marginBottom: 16
            }}>
              Templates
            </Text>

            {/* Template Cards */}
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => setSelectedTemplate(template.id)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: '#0066FF'
                }}
              >
                {/* Top Row - Image, Title, Radio */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  {/* Template Preview Image */}
                  <View style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}>
                    <Image
                      source={{ uri: template.image }}
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Template Title */}
                  <View style={{
                    flex: 1,
                    marginLeft: 12,
                    marginRight: 8
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 15,
                      color: '#000000',
                      lineHeight: 22
                    }}>
                      {template.title}
                    </Text>
                  </View>

                  {/* Radio Button */}
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#0066FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2
                  }}>
                    {selectedTemplate === template.id && (
                      <View style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#0066FF'
                      }} />
                    )}
                  </View>
                </View>

                {/* Description - Full Width Below */}
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 13,
                  color: '#666666',
                  lineHeight: 20
                }}>
                  {template.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Create Proposal Button - Fixed at Bottom */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#F5F5F5',
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0'
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateProposalScreen')}
            style={{
              backgroundColor: '#0066FF',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center'
            }}
          >
            <Text style={{
              fontFamily: 'Urbanist-SemiBold',
              fontSize: 16,
              color: 'white'
            }}>
              Create Proposal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChooseTemplate