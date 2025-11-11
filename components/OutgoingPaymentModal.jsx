import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import InputField from '../components/Inputfield'
 
const OutgoingPaymentModal = ({ visible, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
 
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 32,
                maxHeight: '90%'
              }}
            >
              {/* Handle Bar */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 2
                }} />
              </View>
 
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20 }}
              >
                {/* Header */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 20,
                    color: '#000000'
                  }}>
                    Outgoing Payment
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#999999',
                      marginRight: 4
                    }}>
                      01-04-25
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </View>
                </View>
 
                {/* From Field - Dropdown */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    From
                  </Text>
                  <TouchableOpacity style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      XYZ Constructions Ltd.
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Amount Given */}
                <InputField
                  label="Amount Given"
                  placeholder="₹25,000"
                  value={amount}
                  onChangeText={setAmount}
                />
 
                {/* Description */}
                <InputField
                  label="Description"
                  placeholder="Advance payment for material supply"
                  value={description}
                  onChangeText={setDescription}
                />
 
                {/* Mode - Dropdown */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Mode
                  </Text>
                  <TouchableOpacity style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      Bank Transfer
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Bank Name - Dropdown */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Bank Name
                  </Text>
                  <TouchableOpacity style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      Bank of America
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Cost Code - Dropdown */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Cost Code
                  </Text>
                  <TouchableOpacity style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      MAT-2025-001
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Category - Dropdown */}
                <View style={{ marginBottom: 30 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Category
                  </Text>
                  <TouchableOpacity style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      Material
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Action Buttons */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0066FF',
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: 'center'
                    }}
                    onPress={onSave}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 16,
                      color: 'white'
                    }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: '#00C896',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Feather name="paperclip" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}
 
export default OutgoingPaymentModal