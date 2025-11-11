import React, { useState, useEffect } from 'react'

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

import AddBoqItemModal from './AddBoqItemModal'



const SalesInvoiceModal = ({ visible, onClose, onSave }) => {

  const [client, setClient] = useState('Arun Vijay Mishra');

  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState('INV-1');

  const [invoiceDate, setInvoiceDate] = useState('01-04-25');

  const [selectedItems, setSelectedItems] = useState([{

    id: 1,

    name: 'Test',

    unitRate: '100',

    quantity: '19',

    gst: '18.0',

    amount: '1900'

  }]);

  const [notes, setNotes] = useState('');



  // Calculate totals

  const itemSubtotal = selectedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const gstAmount = selectedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0) * (parseFloat(item.gst) || 0) / 100, 0);

  const totalAmount = itemSubtotal + gstAmount;



  const handleSave = () => {

    onSave({

      client,

      invoiceNumber,

      invoiceDate,

      items: selectedItems,

      totals: { itemSubtotal, gstAmount, totalAmount },

      notes

    });

  };



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

                {/* Header - Centered like in image */}

                <View style={{

                  alignItems: 'center',

                  marginBottom: 24

                }}>

                  <Text style={{

                    fontFamily: 'Urbanist-Bold',

                    fontSize: 20,

                    color: '#000000',

                    marginBottom: 8

                  }}>

                    Create Invoice

                  </Text>

                 

                  {/* Client and Invoice Number in single row */}

                  <View style={{

                    flexDirection: 'row',

                    justifyContent: 'space-between',

                    width: '100%',

                    alignItems: 'center'

                  }}>

                    {/* Client */}

                    <View style={{ flex: 1 }}>

                      <InputField

                        label="Client"

                        placeholder="Arun Vijay Mishra"

                        value={client}

                        onChangeText={setClient}

                        style={{

                          marginBottom: 0,

                          borderBottomWidth: 1,

                          borderBottomColor: '#E0E0E0'

                        }}

                      />

                    </View>

                    <View style={{ alignItems: 'flex-end' }}>

                      <Text style={{

                        fontFamily: 'Urbanist-SemiBold',

                        fontSize: 15,

                        color: '#000000'

                      }}>

                        {invoiceNumber}

                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>

                        <Text style={{

                          fontFamily: 'Urbanist-Regular',

                          fontSize: 14,

                          color: '#666666',

                          marginRight: 4

                        }}>

                          {invoiceDate}

                        </Text>

                        <Feather name="chevron-down" size={16} color="#666666" />

                      </View>

                    </View>

                  </View>

                </View>



                {/* BOQ Items Section */}

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

                    Select BOQ Items ({selectedItems.length})

                  </Text>

                  <TouchableOpacity onPress={() => setShowAddItemModal(true)}>

                    <Text style={{

                      fontFamily: 'Urbanist-SemiBold',

                      fontSize: 14,

                      color: '#0066FF'

                    }}>

                      + Add Item

                    </Text>

                  </TouchableOpacity>

                </View>



                {/* Render all selected items */}

                {selectedItems.map((item) => (

                  <View key={item.id} style={{

                    backgroundColor: '#FAFAFA',

                    borderRadius: 12,

                    padding: 16,

                    marginBottom: 20

                  }}>

                    {/* Item Header - Single line with amount and GST */}

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

                        {item.name}

                      </Text>

                      <View style={{ alignItems: 'flex-end' }}>

                        <Text style={{

                          fontFamily: 'Urbanist-Bold',

                          fontSize: 15,

                          color: '#000000'

                        }}>

                          ₹ {item.amount}

                        </Text>

                        <Text style={{

                          fontFamily: 'Urbanist-Regular',

                          fontSize: 11,

                          color: '#999999'

                        }}>

                          +{item.gst}% GST

                        </Text>

                      </View>

                    </View>



                    {/* Unit Rate and Quantity - Side by side labels */}

                    <View style={{

                      flexDirection: 'row',

                      justifyContent: 'space-between',

                      marginBottom: 8

                    }}>

                      <Text style={{

                        fontFamily: 'Urbanist-Regular',

                        fontSize: 11,

                        color: '#999999'

                      }}>

                        Unit Rate

                      </Text>

                      <Text style={{

                        fontFamily: 'Urbanist-Regular',

                        fontSize: 11,

                        color: '#999999'

                      }}>

                        Quantity

                      </Text>

                    </View>



                    {/* Unit Rate and Quantity Inputs using InputField component */}

                    <View style={{

                      flexDirection: 'row',

                      gap: 12,

                      marginBottom: 16

                    }}>

                      {/* Unit Rate */}

                      <View style={{ flex: 1 }}>

                        <InputField

                          label=""

                          placeholder="100"

                          value={item.unitRate}

                          onChangeText={(text) => {

                            const updatedItems = selectedItems.map(i =>

                              i.id === item.id

                                ? {...i, unitRate: text, amount: (parseFloat(text) * parseFloat(i.quantity) || 0).toString()}

                                : i

                            );

                            setSelectedItems(updatedItems);

                          }}

                          style={{

                            marginBottom: 0,

                            borderBottomWidth: 1,

                            borderBottomColor: '#E0E0E0'

                          }}

                          keyboardType="numeric"

                        />

                      </View>

                     

                      {/* Quantity */}

                      <View style={{ flex: 1 }}>

                        <InputField

                          label=""

                          placeholder="19"

                          value={item.quantity}

                          onChangeText={(text) => {

                            const updatedItems = selectedItems.map(i =>

                              i.id === item.id

                                ? {...i, quantity: text, amount: (parseFloat(i.unitRate) * parseFloat(text) || 0).toString()}

                                : i

                            );

                            setSelectedItems(updatedItems);

                          }}

                          style={{

                            marginBottom: 0,

                            borderBottomWidth: 1,

                            borderBottomColor: '#E0E0E0',

                            textAlign: 'right'

                          }}

                          keyboardType="numeric"

                        />

                      </View>

                    </View>

                  </View>

                ))}



                {/* Summary Section */}

                <View style={{

                  marginBottom: 24,

                  backgroundColor: '#FAFAFA',

                  borderRadius: 12,

                  padding: 16

                }}>

                  {/* Item Subtotal */}

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

                      ₹ {itemSubtotal.toLocaleString()}

                    </Text>

                  </View>



                  {/* GST */}

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

                      GST

                    </Text>

                    <Text style={{

                      fontFamily: 'Urbanist-SemiBold',

                      fontSize: 14,

                      color: '#000000'

                    }}>

                      ₹ {gstAmount.toLocaleString()}

                    </Text>

                  </View>



                  {/* Total - With top border */}

                  <View style={{

                    flexDirection: 'row',

                    justifyContent: 'space-between',

                    marginBottom: 12,

                    paddingTop: 12,

                    borderTopWidth: 1,

                    borderTopColor: '#E0E0E0'

                  }}>

                    <Text style={{

                      fontFamily: 'Urbanist-SemiBold',

                      fontSize: 15,

                      color: '#000000'

                    }}>

                      Total

                    </Text>

                    <Text style={{

                      fontFamily: 'Urbanist-Bold',

                      fontSize: 15,

                      color: '#000000'

                    }}>

                      ₹ {totalAmount.toLocaleString()}

                    </Text>

                  </View>



                  {/* Net Amount */}

                  <View style={{

                    flexDirection: 'row',

                    justifyContent: 'space-between',

                    paddingTop: 12,

                    borderTopWidth: 1,

                    borderTopColor: '#E0E0E0'

                  }}>

                    <Text style={{

                      fontFamily: 'Urbanist-SemiBold',

                      fontSize: 15,

                      color: '#000000'

                    }}>

                      Net Amount

                    </Text>

                    <Text style={{

                      fontFamily: 'Urbanist-Bold',

                      fontSize: 15,

                      color: '#000000'

                    }}>

                      ₹ {totalAmount.toLocaleString()}

                    </Text>

                  </View>

                </View>



                {/* Bill To / Ship To */}

                <View style={{

                  flexDirection: 'row',

                  justifyContent: 'space-between',

                  alignItems: 'center',

                  marginBottom: 30

                }}>

                  <Text style={{

                    fontFamily: 'Urbanist-SemiBold',

                    fontSize: 15,

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

                    onPress={handleSave}

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



        {/* Render Add BOQ Item Modal */}

        <AddBoqItemModal

          visible={showAddItemModal}

          onClose={() => setShowAddItemModal(false)}

          onSave={(newItem) => {

            setSelectedItems(prev => [...prev, newItem]);

            setShowAddItemModal(false);

          }}

        />

      </SafeAreaView>

    </Modal>

  )

}



export default SalesInvoiceModal