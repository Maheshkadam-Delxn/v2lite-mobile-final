// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Modal
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'
// import InputField from '../components/Inputfield'

// const AddItemModal = ({ visible, onClose, onSave }) => {
//   const [itemName, setItemName] = useState('');
//   const [estimatedQuantity, setEstimatedQuantity] = useState('');
//   const [unitRate, setUnitRate] = useState('');
//   const [description, setDescription] = useState('');

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
//         <View
//           style={{
//             backgroundColor: 'white',
//             borderTopLeftRadius: 24,
//             borderTopRightRadius: 24,
//             paddingTop: 12,
//             paddingBottom: 32,
//             maxHeight: '80%'
//           }}
//         >
//           {/* Handle Bar */}
//           <View style={{ alignItems: 'center', marginBottom: 16 }}>
//             <View style={{
//               width: 40,
//               height: 4,
//               backgroundColor: '#E0E0E0',
//               borderRadius: 2
//             }} />
//           </View>

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             style={{ paddingHorizontal: 20 }}
//           >
//             {/* Header */}
//             <Text style={{
//               fontFamily: 'Urbanist-Bold',
//               fontSize: 20,
//               color: '#000000',
//               textAlign: 'center',
//               marginBottom: 24
//             }}>
//               Add Item
//             </Text>

//             {/* Item Name */}
//             <InputField
//               label="Item Name"
//               placeholder="XYZ Constructions Ltd."
//               value={itemName}
//               onChangeText={setItemName}
//               style={{ marginBottom: 20 }}
//             />

//             {/* Estimated Quantity and Unit */}
//             <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//               {/* Estimated Quantity */}
//               <View style={{ flex: 1 }}>
//                 <InputField
//                   label="Estimated Quantity"
//                   placeholder="₹25,000"
//                   value={estimatedQuantity}
//                   onChangeText={setEstimatedQuantity}
//                 />
//               </View>

//               {/* Unit - Dropdown */}
//               <View style={{ flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   Unit
//                 </Text>
//                 <TouchableOpacity style={{
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#E0E0E0',
//                   paddingVertical: 12,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center'
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     sqft
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Unit Rate and GST */}
//             <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//               {/* Unit Rate */}
//               <View style={{ flex: 1 }}>
//                 <InputField
//                   label="Unit Rate"
//                   placeholder="₹25,000"
//                   value={unitRate}
//                   onChangeText={setUnitRate}
//                 />
//               </View>

//               {/* GST - Dropdown */}
//               <View style={{ flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   GST
//                 </Text>
//                 <TouchableOpacity style={{
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#E0E0E0',
//                   paddingVertical: 12,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center'
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     18.0 %
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Cost Code - Dropdown */}
//             <View style={{ marginBottom: 20 }}>
//               <Text style={{
//                 fontFamily: 'Urbanist-Medium',
//                 fontSize: 13,
//                 color: '#000000',
//                 marginBottom: 8
//               }}>
//                 Cost Code
//               </Text>
//               <TouchableOpacity style={{
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#E0E0E0',
//                 paddingVertical: 12,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//               }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 15,
//                   color: '#000000'
//                 }}>
//                   PM-001
//                 </Text>
//                 <Feather name="chevron-down" size={20} color="#999999" />
//               </TouchableOpacity>
//             </View>

//             {/* Description */}
//             <InputField
//               label="Description"
//               placeholder="Advance payment for material supply"
//               value={description}
//               onChangeText={setDescription}
//               style={{ marginBottom: 30 }}
//             />

//             {/* Save Button */}
//             <TouchableOpacity
//               style={{
//                 backgroundColor: '#0066FF',
//                 borderRadius: 12,
//                 paddingVertical: 16,
//                 alignItems: 'center',
//                 marginBottom: 20
//               }}
//               onPress={onSave}
//             >
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: 'white'
//               }}>
//                 Save
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   )
// }

// export default AddItemModal

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputField from '../components/Inputfield';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import DateTimePicker from '@react-native-community/datetimepicker';

// ✅ Cloudinary Config
const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

// ✅ Generate Cloudinary Signature
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
};

// ✅ Upload to Cloudinary
const uploadToCloudinary = async (fileUri) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);
    const filename = fileUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', { uri: fileUri, type, name: filename });
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const result = await res.json();
    if (res.ok && result.secure_url) {
      return { success: true, url: result.secure_url };
    } else throw new Error(result.error?.message || 'Upload failed');
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return { success: false, error: err.message };
  }
};

// ✅ Backend API URL
const API_URL = 'https://skystruct-lite-backend.vercel.app/api/transactions';

// Dropdown options
const UNIT_OPTIONS = ['sqft', 'no.s', 'kg', 'meter', 'litre', 'piece', 'box', 'set'];
const GST_OPTIONS = ['0', '5', '12', '18', '28'];
const COST_CODE_OPTIONS = ['PM-001', 'PM-002', 'PM-003', 'PM-004', 'PM-005'];

const AddItemModal = ({ visible, onClose, onSave }) => {
  const [itemName, setItemName] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('sqft');
  const [selectedGst, setSelectedGst] = useState('18');
  const [selectedCostCode, setSelectedCostCode] = useState('PM-001');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showGstDropdown, setShowGstDropdown] = useState(false);
  const [showCostCodeDropdown, setShowCostCodeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // 📂 Upload Document (optional future use)
  const handleDocumentUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted')
        return Alert.alert('Permission Denied', 'Please allow media access.');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        Alert.alert('Uploading', 'Please wait...');
        const upload = await uploadToCloudinary(uri);

        if (upload.success) {
          setUploadedDocs((prev) => [...prev, upload.url]);
          Alert.alert('Success', 'Document uploaded successfully!');
        } else {
          Alert.alert('Upload Failed', upload.error || 'Try again later.');
        }
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload document.');
    }
  };

  // 💾 Save Item → API Integration
  const handleSave = async () => {
    try {
      const projectId =
        (await AsyncStorage.getItem('activeProjectId')) ||
        (await AsyncStorage.getItem('projectId'));
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!projectId || !userId || !token) {
        Alert.alert('Error', 'Missing project or user info. Please re-login.');
        return;
      }

      const quantity = parseFloat(estimatedQuantity) || 0;
      const rate = parseFloat(unitRate) || 0;
      const totalAmount = quantity * rate;
      const gstAmount = totalAmount * (parseFloat(selectedGst) / 100);
      const finalAmount = totalAmount + gstAmount;

      // ✅ Correct type for backend
      const payload = {
        projectId,
        createdBy: userId,
        type: 'debit_note', 
        vendorName: itemName || 'N/A',
        invoiceNumber: `ITEM-${Date.now()}`,
        invoiceDate: selectedDate.toISOString(),
        items: [
          {
            itemName: itemName,
            quantity,
            unitPrice: rate,
            total: totalAmount,
            remarks: description,
          },
        ],
        amount: finalAmount,
        remarks: description,
        documents: uploadedDocs,
        unit: selectedUnit,
        gstPercentage: parseFloat(selectedGst),
        costCode: selectedCostCode,
      };

      console.log('📤 Sending Item Payload:', payload);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      console.log('📩 API Response:', result);

      if (response.ok) {
        Alert.alert('Success', 'Item saved successfully!');
        // ✅ Pass only the transaction object to parent
        if (onSave && typeof onSave === 'function') {
          onSave(result?.data || {});
        }
        onClose();
      } else {
        console.error('❌ API Error:', result);
        Alert.alert('Error', result.message || 'Failed to save item.');
      }
    } catch (error) {
      console.error('❌ Save Error:', error);
      Alert.alert('Error', 'Something went wrong while saving item.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 12,
            paddingBottom: 32,
            maxHeight: '80%',
          }}>
          {/* Handle Bar */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: '#E0E0E0',
                borderRadius: 2,
              }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 20,
                color: '#000000',
                textAlign: 'center',
                marginBottom: 24,
              }}>
              Add Item
            </Text>

            {/* Date with Calendar */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 15,
                    color: '#000000',
                  }}>
                  {formatDate(selectedDate)}
                </Text>
                <Feather name="calendar" size={20} color="#999999" />
              </TouchableOpacity>
            </View>

            {/* Item Name */}
            <InputField
              label="Item Name"
              placeholder="XYZ Constructions Ltd."
              value={itemName}
              onChangeText={setItemName}
              style={{ marginBottom: 20 }}
            />

            {/* Estimated Quantity & Unit */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Estimated Quantity"
                  placeholder="10"
                  value={estimatedQuantity}
                  onChangeText={setEstimatedQuantity}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}>
                  Unit
                </Text>
                <TouchableOpacity
                  onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}>
                    {selectedUnit}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>

                {/* Unit Dropdown List */}
                {showUnitDropdown && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 8,
                      zIndex: 1000,
                      elevation: 5,
                      maxHeight: 200,
                    }}>
                    <ScrollView>
                      {UNIT_OPTIONS.map((unit) => (
                        <TouchableOpacity
                          key={unit}
                          onPress={() => {
                            setSelectedUnit(unit);
                            setShowUnitDropdown(false);
                          }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F0F0F0',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Urbanist-Regular',
                              fontSize: 14,
                              color: '#000000',
                            }}>
                            {unit}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Unit Rate & GST */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Unit Rate"
                  placeholder="₹2500"
                  value={unitRate}
                  onChangeText={setUnitRate}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 13,
                    color: '#000000',
                    marginBottom: 8,
                  }}>
                  GST
                </Text>
                <TouchableOpacity
                  onPress={() => setShowGstDropdown(!showGstDropdown)}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                    paddingVertical: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 15,
                      color: '#000000',
                    }}>
                    {selectedGst} %
                  </Text>
                  <Feather name="chevron-down" size={20} color="#999999" />
                </TouchableOpacity>

                {/* GST Dropdown List */}
                {showGstDropdown && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                      borderRadius: 8,
                      zIndex: 1000,
                      elevation: 5,
                      maxHeight: 200,
                    }}>
                    <ScrollView>
                      {GST_OPTIONS.map((gst) => (
                        <TouchableOpacity
                          key={gst}
                          onPress={() => {
                            setSelectedGst(gst);
                            setShowGstDropdown(false);
                          }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F0F0F0',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Urbanist-Regular',
                              fontSize: 14,
                              color: '#000000',
                            }}>
                            {gst}%
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Cost Code */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 13,
                  color: '#000000',
                  marginBottom: 8,
                }}>
                Cost Code
              </Text>
              <TouchableOpacity
                onPress={() => setShowCostCodeDropdown(!showCostCodeDropdown)}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 15,
                    color: '#000000',
                  }}>
                  {selectedCostCode}
                </Text>
                <Feather name="chevron-down" size={20} color="#999999" />
              </TouchableOpacity>

              {/* Cost Code Dropdown List */}
              {showCostCodeDropdown && (
                <View
                  style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: 8,
                    zIndex: 1000,
                    elevation: 5,
                    maxHeight: 200,
                  }}>
                  <ScrollView>
                    {COST_CODE_OPTIONS.map((code) => (
                      <TouchableOpacity
                        key={code}
                        onPress={() => {
                          setSelectedCostCode(code);
                          setShowCostCodeDropdown(false);
                        }}
                        style={{
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#F0F0F0',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Urbanist-Regular',
                            fontSize: 14,
                            color: '#000000',
                          }}>
                          {code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Description */}
            <InputField
              label="Description"
              placeholder="Add description here..."
              value={description}
              onChangeText={setDescription}
              style={{ marginBottom: 30 }}
            />

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#0066FF',
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
                onPress={handleSave}>
                <Text
                  style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: 'white',
                  }}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDocumentUpload}
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: '#00C896',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather name="paperclip" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            style={{ backgroundColor: 'white' }}
          />
        )}
      </View>
    </Modal>
  );
};

export default AddItemModal;
