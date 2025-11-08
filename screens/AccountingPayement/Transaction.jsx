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
import { useNavigation } from '@react-navigation/native'
import InputField from '../../components/Inputfield'
const Transaction = () => {
  const navigation = useNavigation() 
  const [activeTab, setActiveTab] = useState('Transactions')
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [selectedTransactionType, setSelectedTransactionType] = useState(null)
  const [showAddItemModal, setShowAddItemModal] = useState(false)

  const transactions = [
    {
      id: 1,
      date: '19 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '₹5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 2,
      date: '19 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '₹1000',
      status: 'unpaid',
      isIncoming: false,
    },
    {
      id: 3,
      date: '19 Mar 2025',
      type: 'Incoming Payment',
      person: 'Arun Mishra',
      amount: '₹5000',
      status: 'paid',
      isIncoming: true,
    },
    {
      id: 4,
      date: '19 Mar 2025',
      type: 'Outgoing Payment',
      person: 'Arun Mishra',
      amount: '₹1000',
      status: 'paid',
      isIncoming: false,
    },
  ]

  const tabs = ['Details', 'Tasks', 'Transactions', 'Attendance']

  // Incoming Payment Form Modal
const IncomingPaymentModal = () => (
  <Modal
    visible={selectedTransactionType === 'Incoming Payment'}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setSelectedTransactionType(null)}
  >
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <TouchableOpacity 
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => setSelectedTransactionType(null)}
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
                  Incoming Payment
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

              {/* Amount Received - Using InputField Component */}
              <InputField
                label="Amount Received"
                placeholder="₹25,000"
                value=""
                onChangeText={(text) => console.log(text)}
                style={{ marginBottom: 20 }}
              />

              {/* Description - Using InputField Component */}
              <InputField
                label="Description"
                placeholder="Advance payment for material supply"
                value=""
                onChangeText={(text) => console.log(text)}
                style={{ marginBottom: 20 }}
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
                  onPress={() => setSelectedTransactionType(null)}
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

  // Outgoing Payment Form Modal
const OutgoingPaymentModal = () => {
  // Add state for form fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Modal
      visible={selectedTransactionType === 'Outgoing Payment'}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedTransactionType(null)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setSelectedTransactionType(null)}
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

                {/* Amount Given - Using InputField Component */}
                <InputField
                  label="Amount Given"
                  placeholder="₹25,000"
                  value={amount}
                  onChangeText={setAmount}
                />

                {/* Description - Using InputField Component */}
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
                    onPress={() => setSelectedTransactionType(null)}
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

  // Add Item Modal (for Debit Note)
const AddItemModal = () => {
  // Add state for form fields
  const [itemName, setItemName] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Modal
      visible={showAddItemModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddItemModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 12,
            paddingBottom: 32,
            maxHeight: '80%'
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
            <Text style={{
              fontFamily: 'Urbanist-Bold',
              fontSize: 20,
              color: '#000000',
              textAlign: 'center',
              marginBottom: 24
            }}>
              Add Item
            </Text>

            {/* Item Name - Using InputField Component */}
            <InputField
              label="Item Name"
              placeholder="XYZ Constructions Ltd."
              value={itemName}
              onChangeText={setItemName}
              style={{ marginBottom: 20 }}
            />

            {/* Estimated Quantity and Unit */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {/* Estimated Quantity - Using InputField Component */}
              <View style={{ flex: 1 }}>
                <InputField
                  label="Estimated Quantity"
                  placeholder="₹25,000"
                  value={estimatedQuantity}
                  onChangeText={setEstimatedQuantity}
                />
              </View>
              
              {/* Unit - Dropdown */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  Unit
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
                    sqft
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Unit Rate and GST */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {/* Unit Rate - Using InputField Component */}
              <View style={{ flex: 1 }}>
                <InputField
                  label="Unit Rate"
                  placeholder="₹25,000"
                  value={unitRate}
                  onChangeText={setUnitRate}
                />
              </View>
              
              {/* GST - Dropdown */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8
                }}>
                  GST
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
                    18.0 %
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>
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

            {/* Description - Using InputField Component */}
            <InputField
              label="Description"
              placeholder="Advance payment for material supply"
              value={description}
              onChangeText={setDescription}
              style={{ marginBottom: 30 }}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#0066FF',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 20
              }}
              onPress={() => setShowAddItemModal(false)}
            >
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: 'white'
              }}>
                Save
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

 // Debit Note Form Modal
const DebitNoteModal = () => {
  // Add state for form fields
  const [notes, setNotes] = useState('');

  return (
    <>
      <Modal
        visible={selectedTransactionType === 'Debit Note'}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTransactionType(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setSelectedTransactionType(null)}
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

                  {/* Notes - Using InputField Component */}
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
                      onPress={() => setSelectedTransactionType(null)}
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
      <AddItemModal />
    </>
  )
}

  // Material Purchase Form Modal
const MaterialPurchaseModal = () => {
  // Add state for form fields
  const [partyName, setPartyName] = useState('Arun Mishra');
  const [unitRate, setUnitRate] = useState('120.0');
  const [quantity, setQuantity] = useState('10.0');

  return (
    <Modal
      visible={selectedTransactionType === 'Material Purchase'}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedTransactionType(null)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setSelectedTransactionType(null)}
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

                {/* Party Name - Using InputField Component */}
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
                    {/* Unit Rate - Using InputField Component */}
                    <View style={{ flex: 1 }}>
                      <InputField
                        label=""
                        placeholder="120.0"
                        value={unitRate}
                        onChangeText={setUnitRate}
                        style={{ marginBottom: 0 }}
                      />
                    </View>
                    
                    {/* Quantity - Using InputField Component */}
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
                    onPress={() => setSelectedTransactionType(null)}
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

  // Generic Form Modal (for Sales Invoice, Material Return, Material Transfer, Other Expense)
  const GenericFormModal = ({ type }) => (
    <Modal
      visible={selectedTransactionType === type}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedTransactionType(null)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setSelectedTransactionType(null)}
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
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 20,
                  color: '#000000',
                  textAlign: 'center',
                  marginBottom: 32
                }}>
                  {type}
                </Text>

                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  color: '#666666',
                  textAlign: 'center',
                  marginBottom: 32
                }}>
                  Coming Soon...
                </Text>

                {/* Close Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0066FF',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                    marginBottom: 20
                  }}
                  onPress={() => setSelectedTransactionType(null)}
                >
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: 'white'
                  }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )

  // TransactionAdd Modal Component
  const TransactionAddModal = () => {
    const paymentTypes = [
      { id: 1, label: 'Outgoing Payment', color: '#FFE0E0', textColor: '#FF4444' },
      { id: 2, label: 'Incoming Payment', color: '#D4F5E9', textColor: '#00C896' },
    ]

    const debitNote = { label: 'Debit Note', color: '#D4F0FF', textColor: '#00A3E0' }

    const salesType = { label: 'Sales Invoice', color: '#D4F0FF', textColor: '#00A3E0' }

    const expenseTypes = [
      { id: 1, label: 'Material Purchase', color: '#D4F0FF', textColor: '#00A3E0' },
      { id: 2, label: 'Material Return', color: '#D4F0FF', textColor: '#00A3E0' },
      { id: 3, label: 'Material Transfer', color: '#D4F0FF', textColor: '#00A3E0' },
      { id: 4, label: 'Other Expense', color: '#D4F0FF', textColor: '#00A3E0' },
    ]

    return (
      <Modal
        visible={showTransactionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransactionModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowTransactionModal(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableOpacity 
                activeOpacity={1}
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  paddingTop: 12,
                  paddingBottom: 32
                }}
              >
                {/* Handle Bar */}
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: '#E0E0E0',
                    borderRadius: 2
                  }} />
                </View>

                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 500 }}
                >
                  {/* Payment Section */}
                  <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 14,
                      color: '#999999',
                      marginBottom: 12
                    }}>
                      Payment
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      gap: 12,
                      marginBottom: 12
                    }}>
                      {paymentTypes.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          style={{
                            flex: 1,
                            backgroundColor: type.color,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            alignItems: 'center'
                          }}
                          onPress={() => {
                            setShowTransactionModal(false)
                            setSelectedTransactionType(type.label)
                          }}
                        >
                          <Text style={{
                            fontFamily: 'Urbanist-SemiBold',
                            fontSize: 14,
                            color: type.textColor
                          }}>
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: debitNote.color,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                      }}
                      onPress={() => {
                        setShowTransactionModal(false)
                        setSelectedTransactionType(debitNote.label)
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: debitNote.textColor
                      }}>
                        {debitNote.label}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sales Section */}
                  <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 14,
                      color: '#999999',
                      marginBottom: 12
                    }}>
                      Sales
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: salesType.color,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                      }}
                      onPress={() => {
                        setShowTransactionModal(false)
                        setSelectedTransactionType(salesType.label)
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: salesType.textColor
                      }}>
                        {salesType.label}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Expense Section */}
                  <View style={{ paddingHorizontal: 24 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Medium',
                      fontSize: 14,
                      color: '#999999',
                      marginBottom: 12
                    }}>
                      Expense
                    </Text>
                    <View style={{ gap: 12 }}>
                      <View style={{
                        flexDirection: 'row',
                        gap: 12
                      }}>
                        {expenseTypes.slice(0, 2).map((type) => (
                          <TouchableOpacity
                            key={type.id}
                            style={{
                              flex: 1,
                              backgroundColor: type.color,
                              paddingVertical: 14,
                              paddingHorizontal: 16,
                              borderRadius: 12,
                              alignItems: 'center'
                            }}
                            onPress={() => {
                              setShowTransactionModal(false)
                              setSelectedTransactionType(type.label)
                            }}
                          >
                            <Text style={{
                              fontFamily: 'Urbanist-SemiBold',
                              fontSize: 14,
                              color: type.textColor
                            }}>
                              {type.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        gap: 12
                      }}>
                        {expenseTypes.slice(2, 4).map((type) => (
                          <TouchableOpacity
                            key={type.id}
                            style={{
                              flex: 1,
                              backgroundColor: type.color,
                              paddingVertical: 14,
                              paddingHorizontal: 16,
                              borderRadius: 12,
                              alignItems: 'center'
                            }}
                            onPress={() => {
                              setShowTransactionModal(false)
                              setSelectedTransactionType(type.label)
                            }}
                          >
                            <Text style={{
                              fontFamily: 'Urbanist-SemiBold',
                              fontSize: 14,
                              color: type.textColor
                            }}>
                              {type.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Card */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#0066FF'
          }}>
            {/* Top Row - 3 Stats */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20
            }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 11,
                  color: '#666666',
                  letterSpacing: 0.5,
                  marginBottom: 6
                }}>
                  BALANCE
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 22,
                  color: '#000000'
                }}>
                  + 4,000
                </Text>
              </View>

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 11,
                  color: '#666666',
                  letterSpacing: 0.5,
                  marginBottom: 6
                }}>
                  TOTAL INCOMING
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 22,
                  color: '#000000'
                }}>
                  5,000
                </Text>
              </View>

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 11,
                  color: '#666666',
                  letterSpacing: 0.5,
                  marginBottom: 6
                }}>
                  TOTAL OUTGOING
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 22,
                  color: '#FF4444'
                }}>
                  1,000
                </Text>
              </View>
            </View>

            {/* Bottom Row - 2 Stats */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0'
            }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 11,
                  color: '#666666',
                  letterSpacing: 0.5,
                  marginBottom: 6
                }}>
                  INVOICE
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#000000'
                }}>
                  ₹ 0
                </Text>
              </View>

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 11,
                  color: '#666666',
                  letterSpacing: 0.5,
                  marginBottom: 6
                }}>
                  TOTAL EXPENSE
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#FF4444'
                }}>
                  ₹ 300
                </Text>
              </View>
            </View>
          </View>

          {/* Pending Entries Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 12
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', marginRight: 8 }}>
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#000000',
                  marginRight: 2
                }} />
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#000000'
                }} />
              </View>
              <Text style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 16,
                color: '#000000',
                marginRight: 8
              }}>
                Pending Entries
              </Text>
              <View style={{
                backgroundColor: '#E0EFFF',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                minWidth: 24,
                alignItems: 'center'
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 12,
                  color: '#0066FF'
                }}>
                  0
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Feather name="more-vertical" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Transaction Cards */}
          <View style={{ paddingHorizontal: 16 }}>
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
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
                {/* Icon */}
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: transaction.isIncoming ? '#E0F7ED' : '#FFE8E8',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <Text style={{
                    fontSize: 20,
                    color: transaction.isIncoming ? '#00C896' : '#FF4444'
                  }}>
                    $
                  </Text>
                </View>

                {/* Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 12,
                    color: '#999999',
                    marginBottom: 4
                  }}>
                    {transaction.date}, {transaction.type}
                  </Text>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000'
                  }}>
                    {transaction.person}
                  </Text>
                </View>

                {/* Amount & Status */}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontFamily: 'Urbanist-Bold',
                    fontSize: 16,
                    color: transaction.isIncoming ? '#00C896' : '#FF4444',
                    marginBottom: 4
                  }}>
                    {transaction.amount}
                  </Text>
                  {transaction.status === 'unpaid' && (
                    <View style={{
                      backgroundColor: '#FFE8E8',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 6
                    }}>
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 11,
                        color: '#FF4444'
                      }}>
                        Unpaid
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Add Transaction Button */}
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setShowTransactionModal(true)}
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
                Add Transaction Entry
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* All Modals */}
      <TransactionAddModal />
      <IncomingPaymentModal />
      <OutgoingPaymentModal />
      <DebitNoteModal />
      <MaterialPurchaseModal />
      <GenericFormModal type="Sales Invoice" />
      <GenericFormModal type="Material Return" />
      <GenericFormModal type="Material Transfer" />
      <GenericFormModal type="Other Expense" />
    </SafeAreaView>
  )
}

export default Transaction