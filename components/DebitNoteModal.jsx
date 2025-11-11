import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import InputField from '../components/Inputfield'
import AddItemModal from './AddItemModal'
 
const DebitNoteModal = ({ visible, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
 
  return (
    <>
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
                      Debit Note
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
                  <View style={{ marginBottom: 24 }}>
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
 
                  {/* Items Section */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 15,
                      color: '#000000'
                    }}>
                      Items (1)
                    </Text>
                    <TouchableOpacity onPress={() => setShowAddItemModal(true)}>
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#0066FF'
                      }}>
                        + New Item
                      </Text>
                    </TouchableOpacity>
                  </View>
 
                  {/* Item Card */}
                  <View style={{
                    backgroundColor: '#FAFAFA',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 16
                    }}>
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: '#000000',
                        flex: 1
                      }}>
                        Defective Cement Return
                      </Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{
                          fontFamily: 'Urbanist-Bold',
                          fontSize: 15,
                          color: '#000000'
                        }}>
                          ₹ 1000
                        </Text>
                        <Text style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 11,
                          color: '#999999'
                        }}>
                          +18.0% GST
                        </Text>
                      </View>
                      <TouchableOpacity style={{ marginLeft: 12 }}>
                        <Feather name="edit-2" size={18} color="#0066FF" />
                      </TouchableOpacity>
                    </View>
 
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 11,
                          color: '#999999',
                          marginBottom: 4
                        }}>
                          Unit Rate
                        </Text>
                        <TextInput
                          placeholder="100"
                          placeholderTextColor="#000000"
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 14,
                            color: '#000000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E0E0E0',
                            paddingVertical: 8
                          }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontFamily: 'Urbanist-Regular',
                          fontSize: 11,
                          color: '#999999',
                          marginBottom: 4
                        }}>
                          Quantity
                        </Text>
                        <TextInput
                          placeholder="10"
                          placeholderTextColor="#000000"
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 14,
                            color: '#000000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#E0E0E0',
                            paddingVertical: 8
                          }}
                        />
                      </View>
                    </View>
                  </View>
 
                  {/* Summary Section */}
                  <View style={{ marginBottom: 24 }}>
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
                        ₹ 1000
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
                        ₹ 1,180
                      </Text>
                    </View>
                  </View>
 
                  {/* Notes */}
                  <InputField
                    label="Notes"
                    placeholder="Advance payment for material supply"
                    value={notes}
                    onChangeText={setNotes}
                    style={{ marginBottom: 30 }}
                  />
 
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
     
      {/* Add Item Modal - Nested inside Debit Note */}
      <AddItemModal
        visible={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onSave={() => setShowAddItemModal(false)}
      />
    </>
  )
}
 
export default DebitNoteModal
 