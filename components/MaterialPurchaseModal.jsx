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
 
const MaterialPurchaseModal = ({ visible, onClose, onSave }) => {
  const [partyName, setPartyName] = useState('Arun Mishra');
  const [unitRate, setUnitRate] = useState('120.0');
  const [quantity, setQuantity] = useState('10.0');
 
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
                  marginBottom: 8
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 20,
                    color: '#000000'
                  }}>
                    Material Purchase
                  </Text>
                  <TouchableOpacity>
                    <Feather name="edit-2" size={20} color="#0066FF" />
                  </TouchableOpacity>
                </View>
 
                {/* Date */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 12,
                    color: '#999999',
                    marginBottom: 4
                  }}>
                    Material Purchase
                  </Text>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 15,
                    color: '#000000'
                  }}>
                    01 Apr 2025
                  </Text>
                </View>
 
                {/* Party Name */}
                <InputField
                  label="Party Name"
                  placeholder="Arun Mishra"
                  value={partyName}
                  onChangeText={setPartyName}
                  style={{ marginBottom: 20 }}
                />
 
                {/* Add Material Button */}
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#0066FF',
                    borderStyle: 'dashed',
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: 'center',
                    marginBottom: 16
                  }}
                >
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#0066FF'
                  }}>
                    + Add Material
                  </Text>
                </TouchableOpacity>
 
                {/* Material Item Card */}
                <View style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 20
                }}>
                  {/* Item Header */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000'
                    }}>
                      Test Material
                    </Text>
                    <TouchableOpacity>
                      <Feather name="trash-2" size={18} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
 
                  {/* Unit Dropdown */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 12,
                      color: '#999999',
                      marginBottom: 4
                    }}>
                      Unit
                    </Text>
                    <TouchableOpacity style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      paddingVertical: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000'
                      }}>
                        no.s
                      </Text>
                      <Feather name="chevron-down" size={16} color="#999999" />
                    </TouchableOpacity>
                  </View>
 
                  {/* Labels Row */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 12,
                      color: '#999999',
                      flex: 1
                    }}>
                      Unit Rate(₹)
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 12,
                      color: '#999999',
                      flex: 1,
                      textAlign: 'right'
                    }}>
                      Quantity
                    </Text>
                  </View>
 
                  {/* Input Fields Row */}
                  <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 12
                  }}>
                    {/* Unit Rate */}
                    <View style={{ flex: 1 }}>
                      <InputField
                        label=""
                        placeholder="120.0"
                        value={unitRate}
                        onChangeText={setUnitRate}
                        style={{ marginBottom: 0 }}
                      />
                    </View>
                   
                    {/* Quantity */}
                    <View style={{ flex: 1 }}>
                      <InputField
                        label=""
                        placeholder="10.0"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={{
                          marginBottom: 0,
                          textAlign: 'right'
                        }}
                      />
                    </View>
                  </View>
 
                  {/* Amount and GST Row */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      ₹ 1,416
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 11,
                      color: '#999999'
                    }}>
                      +18.0% GST
                    </Text>
                  </View>
                </View>
 
                {/* Summary */}
                <View style={{ marginBottom: 20 }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#666666'
                    }}>
                      Item Subtotal
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000'
                    }}>
                      ₹ 1,416
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 16
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      Total Amount
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      ₹ 1,416
                    </Text>
                  </View>
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
                      PM-001
                    </Text>
                    <Feather name="chevron-down" size={20} color="#999999" />
                  </TouchableOpacity>
                </View>
 
                {/* Bill To / Ship To */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 30
                }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000'
                  }}>
                    Bill To / Ship To
                  </Text>
                  <TouchableOpacity>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#0066FF'
                    }}>
                      + Add Address
                    </Text>
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
 
export default MaterialPurchaseModal