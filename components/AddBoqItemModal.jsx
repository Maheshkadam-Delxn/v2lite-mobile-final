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
 
const AddBoqItemModal = ({ visible, onClose, onSave }) => {
  const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
  const [unit, setUnit] = useState('sqft');
  const [gst, setGst] = useState('18.0');
  const [invoiceQuantity, setInvoiceQuantity] = useState('10');
  const [unitSalesPrice, setUnitSalesPrice] = useState('1,900');
  const [salesPrice, setSalesPrice] = useState('1,900');
  const [costCode, setCostCode] = useState('Select');
 
  // Calculate sales price when unit sales price or quantity changes
  useEffect(() => {
    const unitPrice = parseFloat(unitSalesPrice.replace(/,/g, '')) || 0;
    const quantity = parseFloat(invoiceQuantity) || 0;
    const calculatedPrice = unitPrice * quantity;
    setSalesPrice(calculatedPrice.toLocaleString());
  }, [unitSalesPrice, invoiceQuantity]);
 
  const handleSaveItem = () => {
    const newItem = {
      id: Date.now(),
      name: itemName,
      unitRate: unitSalesPrice.replace(/,/g, ''),
      quantity: invoiceQuantity,
      gst: gst,
      amount: salesPrice.replace(/,/g, '')
    };
   
    onSave(newItem);
   
    // Reset form
    setItemName('');
    setUnit('sqft');
    setGst('18.0');
    setInvoiceQuantity('');
    setUnitSalesPrice('');
    setSalesPrice('');
    setCostCode('Select');
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
                {/* Header */}
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
                    Add BOQ Item
                  </Text>
                </View>
 
                {/* Item Name */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Item Name
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter item name"
                    value={itemName}
                    onChangeText={setItemName}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                  />
                </View>
 
                {/* Unit and GST Row */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20
                }}>
                  {/* Unit */}
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000',
                      marginBottom: 8
                    }}>
                      Unit
                    </Text>
                    <View style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000'
                      }}>
                        {unit}
                      </Text>
                      <Feather name="chevron-down" size={16} color="#666666" />
                    </View>
                  </View>
 
                  {/* GST */}
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#000000',
                      marginBottom: 8
                    }}>
                      GST
                    </Text>
                    <View style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      paddingVertical: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: 'Urbanist-Regular',
                        fontSize: 14,
                        color: '#000000'
                      }}>
                        {gst} %
                      </Text>
                      <Feather name="chevron-down" size={16} color="#666666" />
                    </View>
                  </View>
                </View>
 
                {/* Invoice Quantity */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Invoice Quantity
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter quantity"
                    value={invoiceQuantity}
                    onChangeText={setInvoiceQuantity}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                    keyboardType="numeric"
                  />
                </View>
 
                {/* Unit Sales Price */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Unit Sales Price
                  </Text>
                  <InputField
                    label=""
                    placeholder="Enter unit price"
                    value={unitSalesPrice}
                    onChangeText={setUnitSalesPrice}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                    keyboardType="numeric"
                  />
                </View>
 
                {/* Sales Price */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Sales Price
                  </Text>
                  <InputField
                    label=""
                    placeholder="Sales price"
                    value={salesPrice}
                    editable={false}
                    style={{
                      marginBottom: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </View>
 
                {/* Cost Code */}
                <View style={{ marginBottom: 30 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: '#000000',
                    marginBottom: 8
                  }}>
                    Cost Code
                  </Text>
                  <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: costCode === 'Select' ? '#999999' : '#000000'
                    }}>
                      {costCode}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#666666" />
                  </View>
                </View>
 
                {/* Save and Action Buttons */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20
                }}>
                  {/* Save Button */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#0066FF',
                      borderRadius: 12,
                      paddingVertical: 16,
                      alignItems: 'center'
                    }}
                    onPress={handleSaveItem}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 16,
                      color: 'white'
                    }}>
                      Save
                    </Text>
                  </TouchableOpacity>
 
                  {/* Action Button */}
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
 
export default AddBoqItemModal
 