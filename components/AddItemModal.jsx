import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import InputField from '../components/Inputfield'
 
const AddItemModal = ({ visible, onClose, onSave }) => {
  const [itemName, setItemName] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [description, setDescription] = useState('');
 
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
 
            {/* Item Name */}
            <InputField
              label="Item Name"
              placeholder="XYZ Constructions Ltd."
              value={itemName}
              onChangeText={setItemName}
              style={{ marginBottom: 20 }}
            />
 
            {/* Estimated Quantity and Unit */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {/* Estimated Quantity */}
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
              {/* Unit Rate */}
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
 
            {/* Description */}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
 
export default AddItemModal