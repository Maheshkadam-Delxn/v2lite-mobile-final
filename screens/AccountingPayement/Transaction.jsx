// import React, { useState , useEffect } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Modal,
//   TextInput
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'
// import { useNavigation } from '@react-navigation/native'
// import InputField from '../../components/Inputfield'
// const Transaction = () => {
//   const navigation = useNavigation()
//   const [activeTab, setActiveTab] = useState('Transactions')
//   const [showTransactionModal, setShowTransactionModal] = useState(false)
//   const [selectedTransactionType, setSelectedTransactionType] = useState(null)
//   const [showAddItemModal, setShowAddItemModal] = useState(false)

//   const transactions = [
//     {
//       id: 1,
//       date: '19 Mar 2025',
//       type: 'Incoming Payment',
//       person: 'Arun Mishra',
//       amount: '₹5000',
//       status: 'paid',
//       isIncoming: true,
//     },
//     {
//       id: 2,
//       date: '19 Mar 2025',
//       type: 'Outgoing Payment',
//       person: 'Arun Mishra',
//       amount: '₹1000',
//       status: 'unpaid',
//       isIncoming: false,
//     },
//     {
//       id: 3,
//       date: '19 Mar 2025',
//       type: 'Incoming Payment',
//       person: 'Arun Mishra',
//       amount: '₹5000',
//       status: 'paid',
//       isIncoming: true,
//     },
//     {
//       id: 4,
//       date: '19 Mar 2025',
//       type: 'Outgoing Payment',
//       person: 'Arun Mishra',
//       amount: '₹1000',
//       status: 'paid',
//       isIncoming: false,
//     },
//   ]

//   const tabs = ['Details', 'Tasks', 'Transactions', 'Attendance']

//   // Incoming Payment Form Modal
// const IncomingPaymentModal = () => (
//   <Modal
//     visible={selectedTransactionType === 'Incoming Payment'}
//     animationType="slide"
//     transparent={true}
//     onRequestClose={() => setSelectedTransactionType(null)}
//   >
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//       <TouchableOpacity
//         style={{ flex: 1 }}
//         activeOpacity={1}
//         onPress={() => setSelectedTransactionType(null)}
//       >
//         <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//           <TouchableOpacity
//             activeOpacity={1}
//             style={{
//               backgroundColor: 'white',
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               paddingTop: 12,
//               paddingBottom: 32,
//               maxHeight: '90%'
//             }}
//           >
//             {/* Handle Bar */}
//             <View style={{ alignItems: 'center', marginBottom: 16 }}>
//               <View style={{
//                 width: 40,
//                 height: 4,
//                 backgroundColor: '#E0E0E0',
//                 borderRadius: 2
//               }} />
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               style={{ paddingHorizontal: 20 }}
//             >
//               {/* Header */}
//               <View style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: 24
//               }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 20,
//                   color: '#000000'
//                 }}>
//                   Incoming Payment
//                 </Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 14,
//                     color: '#999999',
//                     marginRight: 4
//                   }}>
//                     01-04-25
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </View>
//               </View>

//               {/* From Field - Dropdown */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   From
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
//                     XYZ Constructions Ltd.
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Amount Received - Using InputField Component */}
//               <InputField
//                 label="Amount Received"
//                 placeholder="₹25,000"
//                 value=""
//                 onChangeText={(text) => console.log(text)}
//                 style={{ marginBottom: 20 }}
//               />

//               {/* Description - Using InputField Component */}
//               <InputField
//                 label="Description"
//                 placeholder="Advance payment for material supply"
//                 value=""
//                 onChangeText={(text) => console.log(text)}
//                 style={{ marginBottom: 20 }}
//               />

//               {/* Mode - Dropdown */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   Mode
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
//                     Bank Transfer
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Bank Name - Dropdown */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   Bank Name
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
//                     Bank of America
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Cost Code - Dropdown */}
//               <View style={{ marginBottom: 20 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   Cost Code
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
//                     MAT-2025-001
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Category - Dropdown */}
//               <View style={{ marginBottom: 30 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 13,
//                   color: '#000000',
//                   marginBottom: 8
//                 }}>
//                   Category
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
//                     Material
//                   </Text>
//                   <Feather name="chevron-down" size={20} color="#999999" />
//                 </TouchableOpacity>
//               </View>

//               {/* Action Buttons */}
//               <View style={{
//                 flexDirection: 'row',
//                 gap: 12,
//                 marginBottom: 20
//               }}>
//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: '#0066FF',
//                     borderRadius: 12,
//                     paddingVertical: 16,
//                     alignItems: 'center'
//                   }}
//                   onPress={() => setSelectedTransactionType(null)}
//                 >
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 16,
//                     color: 'white'
//                   }}>
//                     Save
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={{
//                     width: 56,
//                     height: 56,
//                     backgroundColor: '#00C896',
//                     borderRadius: 12,
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <Feather name="paperclip" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </SafeAreaView>
//   </Modal>
// )

//   // Outgoing Payment Form Modal
// const OutgoingPaymentModal = () => {
//   // Add state for form fields
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');

//   return (
//     <Modal
//       visible={selectedTransactionType === 'Outgoing Payment'}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setSelectedTransactionType(null)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setSelectedTransactionType(null)}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 24
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000'
//                   }}>
//                     Outgoing Payment
//                   </Text>
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#999999',
//                       marginRight: 4
//                     }}>
//                       01-04-25
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </View>
//                 </View>

//                 {/* From Field - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     From
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       XYZ Constructions Ltd.
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Amount Given - Using InputField Component */}
//                 <InputField
//                   label="Amount Given"
//                   placeholder="₹25,000"
//                   value={amount}
//                   onChangeText={setAmount}
//                 />

//                 {/* Description - Using InputField Component */}
//                 <InputField
//                   label="Description"
//                   placeholder="Advance payment for material supply"
//                   value={description}
//                   onChangeText={setDescription}
//                 />

//                 {/* Mode - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Mode
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Bank Transfer
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Bank Name - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Bank Name
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Bank of America
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Cost Code - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Cost Code
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       MAT-2025-001
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Category - Dropdown */}
//                 <View style={{ marginBottom: 30 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Category
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Material
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center'
//                     }}
//                     onPress={() => setSelectedTransactionType(null)}
//                   >
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 16,
//                       color: 'white'
//                     }}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={{
//                       width: 56,
//                       height: 56,
//                       backgroundColor: '#00C896',
//                       borderRadius: 12,
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <Feather name="paperclip" size={24} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </Modal>
//   )
// }

//   // Add Item Modal (for Debit Note)
// const AddItemModal = () => {
//   // Add state for form fields
//   const [itemName, setItemName] = useState('');
//   const [estimatedQuantity, setEstimatedQuantity] = useState('');
//   const [unitRate, setUnitRate] = useState('');
//   const [description, setDescription] = useState('');

//   return (
//     <Modal
//       visible={showAddItemModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowAddItemModal(false)}
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

//             {/* Item Name - Using InputField Component */}
//             <InputField
//               label="Item Name"
//               placeholder="XYZ Constructions Ltd."
//               value={itemName}
//               onChangeText={setItemName}
//               style={{ marginBottom: 20 }}
//             />

//             {/* Estimated Quantity and Unit */}
//             <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//               {/* Estimated Quantity - Using InputField Component */}
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
//               {/* Unit Rate - Using InputField Component */}
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

//             {/* Description - Using InputField Component */}
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
//               onPress={() => setShowAddItemModal(false)}
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

//  // Debit Note Form Modal
// const DebitNoteModal = () => {
//   // Add state for form fields
//   const [notes, setNotes] = useState('');

//   return (
//     <>
//       <Modal
//         visible={selectedTransactionType === 'Debit Note'}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setSelectedTransactionType(null)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={() => setSelectedTransactionType(null)}
//           >
//             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   backgroundColor: 'white',
//                   borderTopLeftRadius: 24,
//                   borderTopRightRadius: 24,
//                   paddingTop: 12,
//                   paddingBottom: 32,
//                   maxHeight: '90%'
//                 }}
//               >
//                 {/* Handle Bar */}
//                 <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{
//                     width: 40,
//                     height: 4,
//                     backgroundColor: '#E0E0E0',
//                     borderRadius: 2
//                   }} />
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   style={{ paddingHorizontal: 20 }}
//                 >
//                   {/* Header */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 24
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#000000'
//                     }}>
//                       Debit Note
//                     </Text>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#999999',
//                         marginRight: 4
//                       }}>
//                         01-04-25
//                       </Text>
//                       <Feather name="chevron-down" size={20} color="#999999" />
//                     </View>
//                   </View>

//                   {/* From Field - Dropdown */}
//                   <View style={{ marginBottom: 24 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 13,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       From
//                     </Text>
//                     <TouchableOpacity style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         XYZ Constructions Ltd.
//                       </Text>
//                       <Feather name="chevron-down" size={20} color="#999999" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Items Section */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 16
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Items (1)
//                     </Text>
//                     <TouchableOpacity onPress={() => setShowAddItemModal(true)}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#0066FF'
//                       }}>
//                         + New Item
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Item Card */}
//                   <View style={{
//                     backgroundColor: '#FAFAFA',
//                     borderRadius: 12,
//                     padding: 16,
//                     marginBottom: 24
//                   }}>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       marginBottom: 16
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000',
//                         flex: 1
//                       }}>
//                         Defective Cement Return
//                       </Text>
//                       <View style={{ alignItems: 'flex-end' }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Bold',
//                           fontSize: 15,
//                           color: '#000000'
//                         }}>
//                           ₹ 1000
//                         </Text>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999'
//                         }}>
//                           +18.0% GST
//                         </Text>
//                       </View>
//                       <TouchableOpacity style={{ marginLeft: 12 }}>
//                         <Feather name="edit-2" size={18} color="#0066FF" />
//                       </TouchableOpacity>
//                     </View>

//                     <View style={{ flexDirection: 'row', gap: 12 }}>
//                       <View style={{ flex: 1 }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999',
//                           marginBottom: 4
//                         }}>
//                           Unit Rate
//                         </Text>
//                         <TextInput
//                           placeholder="100"
//                           placeholderTextColor="#000000"
//                           style={{
//                             fontFamily: 'Urbanist-Regular',
//                             fontSize: 14,
//                             color: '#000000',
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0',
//                             paddingVertical: 8
//                           }}
//                         />
//                       </View>
//                       <View style={{ flex: 1 }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999',
//                           marginBottom: 4
//                         }}>
//                           Quantity
//                         </Text>
//                         <TextInput
//                           placeholder="10"
//                           placeholderTextColor="#000000"
//                           style={{
//                             fontFamily: 'Urbanist-Regular',
//                             fontSize: 14,
//                             color: '#000000',
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0',
//                             paddingVertical: 8
//                           }}
//                         />
//                       </View>
//                     </View>
//                   </View>

//                   {/* Summary Section */}
//                   <View style={{ marginBottom: 24 }}>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginBottom: 12
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#666666'
//                       }}>
//                         Item Subtotal
//                       </Text>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         ₹ 1000
//                       </Text>
//                     </View>
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginBottom: 16
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         Total Amount
//                       </Text>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Bold',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         ₹ 1,180
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Notes - Using InputField Component */}
//                   <InputField
//                     label="Notes"
//                     placeholder="Advance payment for material supply"
//                     value={notes}
//                     onChangeText={setNotes}
//                     style={{ marginBottom: 30 }}
//                   />

//                   {/* Action Buttons */}
//                   <View style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 20
//                   }}>
//                     <TouchableOpacity
//                       style={{
//                         flex: 1,
//                         backgroundColor: '#0066FF',
//                         borderRadius: 12,
//                         paddingVertical: 16,
//                         alignItems: 'center'
//                       }}
//                       onPress={() => setSelectedTransactionType(null)}
//                     >
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 16,
//                         color: 'white'
//                       }}>
//                         Save
//                       </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: '#00C896',
//                         borderRadius: 12,
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                       }}
//                     >
//                       <Feather name="paperclip" size={24} color="white" />
//                     </TouchableOpacity>
//                   </View>
//                 </ScrollView>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>

//       {/* Add Item Modal - Nested inside Debit Note */}
//       <AddItemModal />
//     </>
//   )
// }

//   // Material Purchase Form Modal
// const MaterialPurchaseModal = () => {
//   // Add state for form fields
//   const [partyName, setPartyName] = useState('Arun Mishra');
//   const [unitRate, setUnitRate] = useState('120.0');
//   const [quantity, setQuantity] = useState('10.0');

//   return (
//     <Modal
//       visible={selectedTransactionType === 'Material Purchase'}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setSelectedTransactionType(null)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setSelectedTransactionType(null)}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 8
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000'
//                   }}>
//                     Material Purchase
//                   </Text>
//                   <TouchableOpacity>
//                     <Feather name="edit-2" size={20} color="#0066FF" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Date */}
//                 <View style={{ marginBottom: 24 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 12,
//                     color: '#999999',
//                     marginBottom: 4
//                   }}>
//                     Material Purchase
//                   </Text>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     01 Apr 2025
//                   </Text>
//                 </View>

//                 {/* Party Name - Using InputField Component */}
//                 <InputField
//                   label="Party Name"
//                   placeholder="Arun Mishra"
//                   value={partyName}
//                   onChangeText={setPartyName}
//                   style={{ marginBottom: 20 }}
//                 />

//                 {/* Add Material Button */}
//                 <TouchableOpacity
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#0066FF',
//                     borderStyle: 'dashed',
//                     borderRadius: 8,
//                     paddingVertical: 12,
//                     alignItems: 'center',
//                     marginBottom: 16
//                   }}
//                 >
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#0066FF'
//                   }}>
//                     + Add Material
//                   </Text>
//                 </TouchableOpacity>

//                 {/* Material Item Card */}
//                 <View style={{
//                   backgroundColor: '#FAFAFA',
//                   borderRadius: 12,
//                   padding: 14,
//                   marginBottom: 20
//                 }}>
//                   {/* Item Header */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       Test Material
//                     </Text>
//                     <TouchableOpacity>
//                       <Feather name="trash-2" size={18} color="#FF4444" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Unit Dropdown */}
//                   <View style={{ marginBottom: 12 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 12,
//                       color: '#999999',
//                       marginBottom: 4
//                     }}>
//                       Unit
//                     </Text>
//                     <TouchableOpacity style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 8,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         no.s
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#999999" />
//                     </TouchableOpacity>
//                   </View>

//                   {/* Labels Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 8
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 12,
//                       color: '#999999',
//                       flex: 1
//                     }}>
//                       Unit Rate(₹)
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 12,
//                       color: '#999999',
//                       flex: 1,
//                       textAlign: 'right'
//                     }}>
//                       Quantity
//                     </Text>
//                   </View>

//                   {/* Input Fields Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 12
//                   }}>
//                     {/* Unit Rate - Using InputField Component */}
//                     <View style={{ flex: 1 }}>
//                       <InputField
//                         label=""
//                         placeholder="120.0"
//                         value={unitRate}
//                         onChangeText={setUnitRate}
//                         style={{ marginBottom: 0 }}
//                       />
//                     </View>

//                     {/* Quantity - Using InputField Component */}
//                     <View style={{ flex: 1 }}>
//                       <InputField
//                         label=""
//                         placeholder="10.0"
//                         value={quantity}
//                         onChangeText={setQuantity}
//                         style={{
//                           marginBottom: 0,
//                           textAlign: 'right'
//                         }}
//                       />
//                     </View>
//                   </View>

//                   {/* Amount and GST Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 11,
//                       color: '#999999'
//                     }}>
//                       +18.0% GST
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Summary */}
//                 <View style={{ marginBottom: 20 }}>
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#666666'
//                     }}>
//                       Item Subtotal
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                   </View>
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 16
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Total Amount
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ 1,416
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Cost Code - Dropdown */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Cost Code
//                   </Text>
//                   <TouchableOpacity style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       PM-001
//                     </Text>
//                     <Feather name="chevron-down" size={20} color="#999999" />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Bill To / Ship To */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 30
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Medium',
//                     fontSize: 13,
//                     color: '#000000'
//                   }}>
//                     Bill To / Ship To
//                   </Text>
//                   <TouchableOpacity>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#0066FF'
//                     }}>
//                       + Add Address
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center'
//                     }}
//                     onPress={() => setSelectedTransactionType(null)}
//                   >
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 16,
//                       color: 'white'
//                     }}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={{
//                       width: 56,
//                       height: 56,
//                       backgroundColor: '#00C896',
//                       borderRadius: 12,
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <Feather name="paperclip" size={24} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </Modal>
//   )
// }
// // Sales Invoice Form Modal
// const SalesInvoiceModal = () => {
//   // Add state for form fields
//   const [client, setClient] = useState('Arun Vijay Mishra');
//   const [showAddItemModal, setShowAddItemModal] = useState(false);
//   const [invoiceNumber, setInvoiceNumber] = useState('INV-1');
//   const [invoiceDate, setInvoiceDate] = useState('01-04-25');
//   const [selectedItems, setSelectedItems] = useState([{
//     id: 1,
//     name: 'Test',
//     unitRate: '100',
//     quantity: '19',
//     gst: '18.0',
//     amount: '1900'
//   }]);
//   const [notes, setNotes] = useState('');

//   // Calculate totals
//   const itemSubtotal = selectedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
//   const gstAmount = selectedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0) * (parseFloat(item.gst) || 0) / 100, 0);
//   const totalAmount = itemSubtotal + gstAmount;

//   // Update unit rate handler
//   const handleUnitRateChange = (text) => {
//     const updatedItems = [...selectedItems];
//     updatedItems[0].unitRate = text;
//     // Recalculate amount
//     updatedItems[0].amount = (parseFloat(text) * parseFloat(updatedItems[0].quantity) || 0).toString();
//     setSelectedItems(updatedItems);
//   };

//   // Update quantity handler
//   const handleQuantityChange = (text) => {
//     const updatedItems = [...selectedItems];
//     updatedItems[0].quantity = text;
//     // Recalculate amount
//     updatedItems[0].amount = (parseFloat(updatedItems[0].unitRate) * parseFloat(text) || 0).toString();
//     setSelectedItems(updatedItems);
//   };

//   // Add BOQ Item Modal Component
//   const AddBoqItemModal = () => {
//     const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
//     const [unit, setUnit] = useState('sqft');
//     const [gst, setGst] = useState('18.0');
//     const [invoiceQuantity, setInvoiceQuantity] = useState('10');
//     const [unitSalesPrice, setUnitSalesPrice] = useState('1,900');
//     const [salesPrice, setSalesPrice] = useState('1,900');
//     const [costCode, setCostCode] = useState('Select');

//     // Calculate sales price when unit sales price or quantity changes
//     useEffect(() => {
//       const unitPrice = parseFloat(unitSalesPrice.replace(/,/g, '')) || 0;
//       const quantity = parseFloat(invoiceQuantity) || 0;
//       const calculatedPrice = unitPrice * quantity;
//       setSalesPrice(calculatedPrice.toLocaleString());
//     }, [unitSalesPrice, invoiceQuantity]);

//     const handleSaveItem = () => {
//       const newItem = {
//         id: Date.now(),
//         name: itemName,
//         unitRate: unitSalesPrice.replace(/,/g, ''),
//         quantity: invoiceQuantity,
//         gst: gst,
//         amount: salesPrice.replace(/,/g, '')
//       };

//       // Add the new item to selectedItems
//       setSelectedItems(prev => [...prev, newItem]);
//       setShowAddItemModal(false);

//       // Reset form
//       setItemName('');
//       setUnit('sqft');
//       setGst('18.0');
//       setInvoiceQuantity('');
//       setUnitSalesPrice('');
//       setSalesPrice('');
//       setCostCode('Select');
//     };

//     return (
//       <Modal
//         visible={showAddItemModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowAddItemModal(false)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={() => setShowAddItemModal(false)}
//           >
//             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   backgroundColor: 'white',
//                   borderTopLeftRadius: 24,
//                   borderTopRightRadius: 24,
//                   paddingTop: 12,
//                   paddingBottom: 32,
//                   maxHeight: '90%'
//                 }}
//               >
//                 {/* Handle Bar */}
//                 <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{
//                     width: 40,
//                     height: 4,
//                     backgroundColor: '#E0E0E0',
//                     borderRadius: 2
//                   }} />
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   style={{ paddingHorizontal: 20 }}
//                 >
//                   {/* Header */}
//                   <View style={{
//                     alignItems: 'center',
//                     marginBottom: 24
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Add BOQ Item
//                     </Text>
//                   </View>

//                   {/* Item Name */}
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Item Name
//                     </Text>
//                     <InputField
//                       label=""
//                       placeholder="Enter item name"
//                       value={itemName}
//                       onChangeText={setItemName}
//                       style={{
//                         marginBottom: 0,
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0'
//                       }}
//                     />
//                   </View>

//                   {/* Unit and GST Row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     gap: 12,
//                     marginBottom: 20
//                   }}>
//                     {/* Unit */}
//                     <View style={{ flex: 1 }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000',
//                         marginBottom: 8
//                       }}>
//                         Unit
//                       </Text>
//                       <View style={{
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0',
//                         paddingVertical: 12,
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                       }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 14,
//                           color: '#000000'
//                         }}>
//                           {unit}
//                         </Text>
//                         <Feather name="chevron-down" size={16} color="#666666" />
//                       </View>
//                     </View>

//                     {/* GST */}
//                     <View style={{ flex: 1 }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000',
//                         marginBottom: 8
//                       }}>
//                         GST
//                       </Text>
//                       <View style={{
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0',
//                         paddingVertical: 12,
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                       }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 14,
//                           color: '#000000'
//                         }}>
//                           {gst} %
//                         </Text>
//                         <Feather name="chevron-down" size={16} color="#666666" />
//                       </View>
//                     </View>
//                   </View>

//                   {/* Invoice Quantity */}
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Invoice Quantity
//                     </Text>
//                     <InputField
//                       label=""
//                       placeholder="Enter quantity"
//                       value={invoiceQuantity}
//                       onChangeText={setInvoiceQuantity}
//                       style={{
//                         marginBottom: 0,
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0'
//                       }}
//                       keyboardType="numeric"
//                     />
//                   </View>

//                   {/* Unit Sales Price */}
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Unit Sales Price
//                     </Text>
//                     <InputField
//                       label=""
//                       placeholder="Enter unit price"
//                       value={unitSalesPrice}
//                       onChangeText={setUnitSalesPrice}
//                       style={{
//                         marginBottom: 0,
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0'
//                       }}
//                       keyboardType="numeric"
//                     />
//                   </View>

//                   {/* Sales Price */}
//                   <View style={{ marginBottom: 20 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Sales Price
//                     </Text>
//                     <InputField
//                       label=""
//                       placeholder="Sales price"
//                       value={salesPrice}
//                       editable={false}
//                       style={{
//                         marginBottom: 0,
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#E0E0E0',
//                         backgroundColor: '#FAFAFA'
//                       }}
//                     />
//                   </View>

//                   {/* Cost Code */}
//                   <View style={{ marginBottom: 30 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Cost Code
//                     </Text>
//                     <View style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: costCode === 'Select' ? '#999999' : '#000000'
//                       }}>
//                         {costCode}
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#666666" />
//                     </View>
//                   </View>

//                  {/* Save and Action Buttons - Two buttons side by side */}
// <View style={{
//   flexDirection: 'row',
//   gap: 12,
//   marginBottom: 20
// }}>
//   {/* Save Button */}
//   <TouchableOpacity
//     style={{
//       flex: 1,
//       backgroundColor: '#0066FF',
//       borderRadius: 12,
//       paddingVertical: 16,
//       alignItems: 'center'
//     }}
//     onPress={handleSaveItem}
//   >
//     <Text style={{
//       fontFamily: 'Urbanist-SemiBold',
//       fontSize: 16,
//       color: 'white'
//     }}>
//       Save
//     </Text>
//   </TouchableOpacity>

//   {/* Action Button */}
//   <TouchableOpacity
//     style={{
//       width: 56,
//       height: 56,
//       backgroundColor: '#00C896',
//       borderRadius: 12,
//       alignItems: 'center',
//       justifyContent: 'center'
//     }}
//     onPress={() => {
//       // Handle action button logic here
//       console.log('Action button pressed');
//     }}
//   >
//     <Feather name="paperclip" size={24} color="white" />
//   </TouchableOpacity>
// </View>
//                 </ScrollView>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>
//     );
//   };

//   return (
//     <Modal
//       visible={selectedTransactionType === 'Sales Invoice'}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setSelectedTransactionType(null)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setSelectedTransactionType(null)}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header - Centered like in image */}
//                 <View style={{
//                   alignItems: 'center',
//                   marginBottom: 24
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Create Invoice
//                   </Text>

//                   {/* Client and Invoice Number in single row */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     width: '100%',
//                     alignItems: 'center'
//                   }}>
//                     {/* Client - Using InputField Component */}
//                     <View style={{ flex: 1 }}>
//                       <InputField
//                         label="Client"
//                         placeholder="Arun Vijay Mishra"
//                         value={client}
//                         onChangeText={setClient}
//                         style={{
//                           marginBottom: 0,
//                           borderBottomWidth: 1,
//                           borderBottomColor: '#E0E0E0'
//                         }}
//                       />
//                     </View>
//                     <View style={{ alignItems: 'flex-end' }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 15,
//                         color: '#000000'
//                       }}>
//                         {invoiceNumber}
//                       </Text>
//                       <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 14,
//                           color: '#666666',
//                           marginRight: 4
//                         }}>
//                           {invoiceDate}
//                         </Text>
//                         <Feather name="chevron-down" size={16} color="#666666" />
//                       </View>
//                     </View>
//                   </View>
//                 </View>

//                 {/* BOQ Items Section */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 16
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     Select BOQ Items ({selectedItems.length})
//                   </Text>
//                   <TouchableOpacity onPress={() => setShowAddItemModal(true)}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#0066FF'
//                     }}>
//                       + Add Item
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Render all selected items */}
//                 {selectedItems.map((item) => (
//                   <View key={item.id} style={{
//                     backgroundColor: '#FAFAFA',
//                     borderRadius: 12,
//                     padding: 16,
//                     marginBottom: 20
//                   }}>
//                     {/* Item Header - Single line with amount and GST */}
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       marginBottom: 16
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: '#000000',
//                         flex: 1
//                       }}>
//                         {item.name}
//                       </Text>
//                       <View style={{ alignItems: 'flex-end' }}>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Bold',
//                           fontSize: 15,
//                           color: '#000000'
//                         }}>
//                           ₹ {item.amount}
//                         </Text>
//                         <Text style={{
//                           fontFamily: 'Urbanist-Regular',
//                           fontSize: 11,
//                           color: '#999999'
//                         }}>
//                           +{item.gst}% GST
//                         </Text>
//                       </View>
//                     </View>

//                     {/* Unit Rate and Quantity - Side by side labels */}
//                     <View style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginBottom: 8
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 11,
//                         color: '#999999'
//                       }}>
//                         Unit Rate
//                       </Text>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 11,
//                         color: '#999999'
//                       }}>
//                         Quantity
//                       </Text>
//                     </View>

//                     {/* Unit Rate and Quantity Inputs using InputField component */}
//                     <View style={{
//                       flexDirection: 'row',
//                       gap: 12,
//                       marginBottom: 16
//                     }}>
//                       {/* Unit Rate - Using InputField Component */}
//                       <View style={{ flex: 1 }}>
//                         <InputField
//                           label=""
//                           placeholder="100"
//                           value={item.unitRate}
//                           onChangeText={(text) => {
//                             const updatedItems = selectedItems.map(i =>
//                               i.id === item.id
//                                 ? {...i, unitRate: text, amount: (parseFloat(text) * parseFloat(i.quantity) || 0).toString()}
//                                 : i
//                             );
//                             setSelectedItems(updatedItems);
//                           }}
//                           style={{
//                             marginBottom: 0,
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0'
//                           }}
//                           keyboardType="numeric"
//                         />
//                       </View>

//                       {/* Quantity - Using InputField Component */}
//                       <View style={{ flex: 1 }}>
//                         <InputField
//                           label=""
//                           placeholder="19"
//                           value={item.quantity}
//                           onChangeText={(text) => {
//                             const updatedItems = selectedItems.map(i =>
//                               i.id === item.id
//                                 ? {...i, quantity: text, amount: (parseFloat(i.unitRate) * parseFloat(text) || 0).toString()}
//                                 : i
//                             );
//                             setSelectedItems(updatedItems);
//                           }}
//                           style={{
//                             marginBottom: 0,
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#E0E0E0',
//                             textAlign: 'right'
//                           }}
//                           keyboardType="numeric"
//                         />
//                       </View>
//                     </View>
//                   </View>
//                 ))}

//                 {/* Summary Section - Updated spacing and styling */}
//                 <View style={{
//                   marginBottom: 24,
//                   backgroundColor: '#FAFAFA',
//                   borderRadius: 12,
//                   padding: 16
//                 }}>
//                   {/* Item Subtotal */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#666666'
//                     }}>
//                       Item Subtotal
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       ₹ {itemSubtotal.toLocaleString()}
//                     </Text>
//                   </View>

//                   {/* GST */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 12
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: '#666666'
//                     }}>
//                       GST
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000'
//                     }}>
//                       ₹ {gstAmount.toLocaleString()}
//                     </Text>
//                   </View>

//                   {/* Total - With top border */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     marginBottom: 12,
//                     paddingTop: 12,
//                     borderTopWidth: 1,
//                     borderTopColor: '#E0E0E0'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Total
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ {totalAmount.toLocaleString()}
//                     </Text>
//                   </View>

//                   {/* Net Amount */}
//                   <View style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingTop: 12,
//                     borderTopWidth: 1,
//                     borderTopColor: '#E0E0E0'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       Net Amount
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 15,
//                       color: '#000000'
//                     }}>
//                       ₹ {totalAmount.toLocaleString()}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Bill To / Ship To */}
//                 <View style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: 30
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 15,
//                     color: '#000000'
//                   }}>
//                     Bill To / Ship To
//                   </Text>
//                   <TouchableOpacity>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#0066FF'
//                     }}>
//                       + Add Address
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Action Buttons - Two buttons as requested */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 12,
//                       paddingVertical: 16,
//                       alignItems: 'center'
//                     }}
//                     onPress={() => {
//                       // Handle save logic here
//                       console.log('Invoice saved:', {
//                         client,
//                         invoiceNumber,
//                         invoiceDate,
//                         items: selectedItems,
//                         totals: { itemSubtotal, gstAmount, totalAmount },
//                         notes
//                       });
//                       setSelectedTransactionType(null);
//                     }}
//                   >
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 16,
//                       color: 'white'
//                     }}>
//                       Save
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={{
//                       width: 56,
//                       height: 56,
//                       backgroundColor: '#00C896',
//                       borderRadius: 12,
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <Feather name="paperclip" size={24} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>

//         {/* Render Add BOQ Item Modal */}
//         <AddBoqItemModal />
//       </SafeAreaView>
//     </Modal>
//   );
// };
// const AddBoqItemModal = () => {
//   const [itemName, setItemName] = useState('XYZ Constructions Ltd.');
//   const [unit, setUnit] = useState('sqft');
//   const [gst, setGst] = useState('18.0');
//   const [invoiceQuantity, setInvoiceQuantity] = useState('10');
//   const [unitSalesPrice, setUnitSalesPrice] = useState('1,900');
//   const [salesPrice, setSalesPrice] = useState('1,900');
//   const [costCode, setCostCode] = useState('Select');

//   // Calculate sales price when unit sales price or quantity changes
//   useEffect(() => {
//     const unitPrice = parseFloat(unitSalesPrice.replace(/,/g, '')) || 0;
//     const quantity = parseFloat(invoiceQuantity) || 0;
//     const calculatedPrice = unitPrice * quantity;
//     setSalesPrice(calculatedPrice.toLocaleString());
//   }, [unitSalesPrice, invoiceQuantity]);

//   return (
//     <Modal
//       visible={showAddItemModal}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowAddItemModal(false)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setShowAddItemModal(false)}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <View style={{
//                   alignItems: 'center',
//                   marginBottom: 24
//                 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 20,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Add BOQ Item
//                   </Text>
//                 </View>

//                 {/* Item Name */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Item Name
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter item name"
//                     value={itemName}
//                     onChangeText={setItemName}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                   />
//                 </View>

//                 {/* Unit and GST Row */}
//                 <View style={{
//                   flexDirection: 'row',
//                   gap: 12,
//                   marginBottom: 20
//                 }}>
//                   {/* Unit */}
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       Unit
//                     </Text>
//                     <View style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         {unit}
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#666666" />
//                     </View>
//                   </View>

//                   {/* GST */}
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 14,
//                       color: '#000000',
//                       marginBottom: 8
//                     }}>
//                       GST
//                     </Text>
//                     <View style={{
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       paddingVertical: 12,
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center'
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 14,
//                         color: '#000000'
//                       }}>
//                         {gst} %
//                       </Text>
//                       <Feather name="chevron-down" size={16} color="#666666" />
//                     </View>
//                   </View>
//                 </View>

//                 {/* Invoice Quantity */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Invoice Quantity
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter quantity"
//                     value={invoiceQuantity}
//                     onChangeText={setInvoiceQuantity}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {/* Unit Sales Price */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Unit Sales Price
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Enter unit price"
//                     value={unitSalesPrice}
//                     onChangeText={setUnitSalesPrice}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0'
//                     }}
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {/* Sales Price */}
//                 <View style={{ marginBottom: 20 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Sales Price
//                   </Text>
//                   <InputField
//                     label=""
//                     placeholder="Sales price"
//                     value={salesPrice}
//                     editable={false}
//                     style={{
//                       marginBottom: 0,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E0E0E0',
//                       backgroundColor: '#FAFAFA'
//                     }}
//                   />
//                 </View>

//                 {/* Cost Code */}
//                 <View style={{ marginBottom: 30 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000',
//                     marginBottom: 8
//                   }}>
//                     Cost Code
//                   </Text>
//                   <View style={{
//                     borderBottomWidth: 1,
//                     borderBottomColor: '#E0E0E0',
//                     paddingVertical: 12,
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 14,
//                       color: costCode === 'Select' ? '#999999' : '#000000'
//                     }}>
//                       {costCode}
//                     </Text>
//                     <Feather name="chevron-down" size={16} color="#666666" />
//                   </View>
//                 </View>

//                 {/* Save Button */}
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: '#0066FF',
//                     borderRadius: 12,
//                     paddingVertical: 16,
//                     alignItems: 'center',
//                     marginBottom: 20
//                   }}
//                   onPress={() => {
//                     // Handle save logic here
//                     const newItem = {
//                       id: Date.now(),
//                       name: itemName,
//                       unitRate: unitSalesPrice.replace(/,/g, ''),
//                       quantity: invoiceQuantity,
//                       gst: gst,
//                       amount: salesPrice.replace(/,/g, '')
//                     };

//                     // Add the new item to selectedItems
//                     setSelectedItems(prev => [...prev, newItem]);
//                     setShowAddItemModal(false);

//                     // Reset form
//                     setItemName('');
//                     setUnit('sqft');
//                     setGst('18.0');
//                     setInvoiceQuantity('');
//                     setUnitSalesPrice('');
//                     setSalesPrice('');
//                     setCostCode('Select');
//                   }}
//                 >
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 16,
//                     color: 'white'
//                   }}>
//                     Save
//                   </Text>
//                 </TouchableOpacity>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </Modal>
//   );
// };

//   // Generic Form Modal (for Sales Invoice, Material Return, Material Transfer, Other Expense)
//   // const GenericFormModal = ({ type }) => (
//   //   <Modal
//   //     visible={selectedTransactionType === type}
//   //     animationType="slide"
//   //     transparent={true}
//   //     onRequestClose={() => setSelectedTransactionType(null)}
//   //   >
//   //     <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//   //       <TouchableOpacity
//   //         style={{ flex: 1 }}
//   //         activeOpacity={1}
//   //         onPress={() => setSelectedTransactionType(null)}
//   //       >
//   //         <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//   //           <TouchableOpacity
//   //             activeOpacity={1}
//   //             style={{
//   //               backgroundColor: 'white',
//   //               borderTopLeftRadius: 24,
//   //               borderTopRightRadius: 24,
//   //               paddingTop: 12,
//   //               paddingBottom: 32,
//   //               maxHeight: '90%'
//   //             }}
//   //           >
//   //             {/* Handle Bar */}
//   //             <View style={{ alignItems: 'center', marginBottom: 16 }}>
//   //               <View style={{
//   //                 width: 40,
//   //                 height: 4,
//   //                 backgroundColor: '#E0E0E0',
//   //                 borderRadius: 2
//   //               }} />
//   //             </View>

//   //             <ScrollView
//   //               showsVerticalScrollIndicator={false}
//   //               style={{ paddingHorizontal: 20 }}
//   //             >
//   //               {/* Header */}
//   //               <Text style={{
//   //                 fontFamily: 'Urbanist-Bold',
//   //                 fontSize: 20,
//   //                 color: '#000000',
//   //                 textAlign: 'center',
//   //                 marginBottom: 32
//   //               }}>
//   //                 {type}
//   //               </Text>

//   //               <Text style={{
//   //                 fontFamily: 'Urbanist-Regular',
//   //                 fontSize: 15,
//   //                 color: '#666666',
//   //                 textAlign: 'center',
//   //                 marginBottom: 32
//   //               }}>
//   //                 Coming Soon...
//   //               </Text>

//   //               {/* Close Button */}
//   //               <TouchableOpacity
//   //                 style={{
//   //                   backgroundColor: '#0066FF',
//   //                   borderRadius: 12,
//   //                   paddingVertical: 16,
//   //                   alignItems: 'center',
//   //                   marginBottom: 20
//   //                 }}
//   //                 onPress={() => setSelectedTransactionType(null)}
//   //               >
//   //                 <Text style={{
//   //                   fontFamily: 'Urbanist-SemiBold',
//   //                   fontSize: 16,
//   //                   color: 'white'
//   //                 }}>
//   //                   Close
//   //                 </Text>
//   //               </TouchableOpacity>
//   //             </ScrollView>
//   //           </TouchableOpacity>
//   //         </View>
//   //       </TouchableOpacity>
//   //     </SafeAreaView>
//   //   </Modal>
//   // )
//   // Generic Form Modal (for Material Return, Material Transfer, Other Expense)
// const GenericFormModal = ({ type }) => {
//   // Don't render this modal for Sales Invoice since we have a dedicated component
//   if (type === 'Sales Invoice') {
//     return null;
//   }

//   return (
//     <Modal
//       visible={selectedTransactionType === type}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setSelectedTransactionType(null)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//         <TouchableOpacity
//           style={{ flex: 1 }}
//           activeOpacity={1}
//           onPress={() => setSelectedTransactionType(null)}
//         >
//           <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={{
//                 backgroundColor: 'white',
//                 borderTopLeftRadius: 24,
//                 borderTopRightRadius: 24,
//                 paddingTop: 12,
//                 paddingBottom: 32,
//                 maxHeight: '90%'
//               }}
//             >
//               {/* Handle Bar */}
//               <View style={{ alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 40,
//                   height: 4,
//                   backgroundColor: '#E0E0E0',
//                   borderRadius: 2
//                 }} />
//               </View>

//               <ScrollView
//                 showsVerticalScrollIndicator={false}
//                 style={{ paddingHorizontal: 20 }}
//               >
//                 {/* Header */}
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 20,
//                   color: '#000000',
//                   textAlign: 'center',
//                   marginBottom: 32
//                 }}>
//                   {type}
//                 </Text>

//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 15,
//                   color: '#666666',
//                   textAlign: 'center',
//                   marginBottom: 32
//                 }}>
//                   Coming Soon...
//                 </Text>

//                 {/* Close Button */}
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: '#0066FF',
//                     borderRadius: 12,
//                     paddingVertical: 16,
//                     alignItems: 'center',
//                     marginBottom: 20
//                   }}
//                   onPress={() => setSelectedTransactionType(null)}
//                 >
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 16,
//                     color: 'white'
//                   }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//               </ScrollView>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </SafeAreaView>
//     </Modal>
//   )
// }
//   // TransactionAdd Modal Component
//   const TransactionAddModal = () => {
//     const paymentTypes = [
//       { id: 1, label: 'Outgoing Payment', color: '#FFE0E0', textColor: '#FF4444' },
//       { id: 2, label: 'Incoming Payment', color: '#D4F5E9', textColor: '#00C896' },
//     ]

//     const debitNote = { label: 'Debit Note', color: '#D4F0FF', textColor: '#00A3E0' }

//     const salesType = { label: 'Sales Invoice', color: '#D4F0FF', textColor: '#00A3E0' }

//     const expenseTypes = [
//       { id: 1, label: 'Material Purchase', color: '#D4F0FF', textColor: '#00A3E0' },
//       { id: 2, label: 'Material Return', color: '#D4F0FF', textColor: '#00A3E0' },
//       { id: 3, label: 'Material Transfer', color: '#D4F0FF', textColor: '#00A3E0' },
//       { id: 4, label: 'Other Expense', color: '#D4F0FF', textColor: '#00A3E0' },
//     ]

//     return (
//       <Modal
//         visible={showTransactionModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowTransactionModal(false)}
//       >
//         <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={() => setShowTransactionModal(false)}
//           >
//             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
//               <TouchableOpacity
//                 activeOpacity={1}
//                 style={{
//                   backgroundColor: 'white',
//                   borderTopLeftRadius: 24,
//                   borderTopRightRadius: 24,
//                   paddingTop: 12,
//                   paddingBottom: 32
//                 }}
//               >
//                 {/* Handle Bar */}
//                 <View style={{ alignItems: 'center', marginBottom: 24 }}>
//                   <View style={{
//                     width: 40,
//                     height: 4,
//                     backgroundColor: '#E0E0E0',
//                     borderRadius: 2
//                   }} />
//                 </View>

//                 <ScrollView
//                   showsVerticalScrollIndicator={false}
//                   style={{ maxHeight: 500 }}
//                 >
//                   {/* Payment Section */}
//                   <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 14,
//                       color: '#999999',
//                       marginBottom: 12
//                     }}>
//                       Payment
//                     </Text>
//                     <View style={{
//                       flexDirection: 'row',
//                       gap: 12,
//                       marginBottom: 12
//                     }}>
//                       {paymentTypes.map((type) => (
//                         <TouchableOpacity
//                           key={type.id}
//                           style={{
//                             flex: 1,
//                             backgroundColor: type.color,
//                             paddingVertical: 14,
//                             paddingHorizontal: 16,
//                             borderRadius: 12,
//                             alignItems: 'center'
//                           }}
//                           onPress={() => {
//                             setShowTransactionModal(false)
//                             setSelectedTransactionType(type.label)
//                           }}
//                         >
//                           <Text style={{
//                             fontFamily: 'Urbanist-SemiBold',
//                             fontSize: 14,
//                             color: type.textColor
//                           }}>
//                             {type.label}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                     <TouchableOpacity
//                       style={{
//                         backgroundColor: debitNote.color,
//                         paddingVertical: 14,
//                         paddingHorizontal: 16,
//                         borderRadius: 12,
//                         alignItems: 'center'
//                       }}
//                       onPress={() => {
//                         setShowTransactionModal(false)
//                         setSelectedTransactionType(debitNote.label)
//                       }}
//                     >
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: debitNote.textColor
//                       }}>
//                         {debitNote.label}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Sales Section */}
//                   <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 14,
//                       color: '#999999',
//                       marginBottom: 12
//                     }}>
//                       Sales
//                     </Text>
//                     <TouchableOpacity
//                       style={{
//                         backgroundColor: salesType.color,
//                         paddingVertical: 14,
//                         paddingHorizontal: 16,
//                         borderRadius: 12,
//                         alignItems: 'center'
//                       }}
//                       onPress={() => {
//                         setShowTransactionModal(false)
//                         setSelectedTransactionType(salesType.label)
//                       }}
//                     >
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 14,
//                         color: salesType.textColor
//                       }}>
//                         {salesType.label}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Expense Section */}
//                   <View style={{ paddingHorizontal: 24 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Medium',
//                       fontSize: 14,
//                       color: '#999999',
//                       marginBottom: 12
//                     }}>
//                       Expense
//                     </Text>
//                     <View style={{ gap: 12 }}>
//                       <View style={{
//                         flexDirection: 'row',
//                         gap: 12
//                       }}>
//                         {expenseTypes.slice(0, 2).map((type) => (
//                           <TouchableOpacity
//                             key={type.id}
//                             style={{
//                               flex: 1,
//                               backgroundColor: type.color,
//                               paddingVertical: 14,
//                               paddingHorizontal: 16,
//                               borderRadius: 12,
//                               alignItems: 'center'
//                             }}
//                             onPress={() => {
//                               setShowTransactionModal(false)
//                               setSelectedTransactionType(type.label)
//                             }}
//                           >
//                             <Text style={{
//                               fontFamily: 'Urbanist-SemiBold',
//                               fontSize: 14,
//                               color: type.textColor
//                             }}>
//                               {type.label}
//                             </Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                       <View style={{
//                         flexDirection: 'row',
//                         gap: 12
//                       }}>
//                         {expenseTypes.slice(2, 4).map((type) => (
//                           <TouchableOpacity
//                             key={type.id}
//                             style={{
//                               flex: 1,
//                               backgroundColor: type.color,
//                               paddingVertical: 14,
//                               paddingHorizontal: 16,
//                               borderRadius: 12,
//                               alignItems: 'center'
//                             }}
//                             onPress={() => {
//                               setShowTransactionModal(false)
//                               setSelectedTransactionType(type.label)
//                             }}
//                           >
//                             <Text style={{
//                               fontFamily: 'Urbanist-SemiBold',
//                               fontSize: 14,
//                               color: type.textColor
//                             }}>
//                               {type.label}
//                             </Text>
//                           </TouchableOpacity>
//                         ))}
//                       </View>
//                     </View>
//                   </View>
//                 </ScrollView>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>
//     )
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//       <View style={{ flex: 1 }}>
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Stats Card */}
//           <View style={{
//             backgroundColor: 'white',
//             borderRadius: 16,
//             padding: 16,
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 16,
//             borderLeftWidth: 4,
//             borderLeftColor: '#0066FF'
//           }}>
//             {/* Top Row - 3 Stats */}
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginBottom: 20
//             }}>
//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   BALANCE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#000000'
//                 }}>
//                   + 4,000
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL INCOMING
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#000000'
//                 }}>
//                   5,000
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL OUTGOING
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#FF4444'
//                 }}>
//                   1,000
//                 </Text>
//               </View>
//             </View>

//             {/* Bottom Row - 2 Stats */}
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               paddingTop: 16,
//               borderTopWidth: 1,
//               borderTopColor: '#F0F0F0'
//             }}>
//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   INVOICE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#000000'
//                 }}>
//                   ₹ 0
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL EXPENSE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#FF4444'
//                 }}>
//                   ₹ 300
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Pending Entries Header */}
//           <View style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             paddingHorizontal: 16,
//             marginBottom: 12
//           }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <View style={{ flexDirection: 'row', marginRight: 8 }}>
//                 <View style={{
//                   width: 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: '#000000',
//                   marginRight: 2
//                 }} />
//                 <View style={{
//                   width: 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: '#000000'
//                 }} />
//               </View>
//               <Text style={{
//                 fontFamily: 'Urbanist-Bold',
//                 fontSize: 16,
//                 color: '#000000',
//                 marginRight: 8
//               }}>
//                 Pending Entries
//               </Text>
//               <View style={{
//                 backgroundColor: '#E0EFFF',
//                 paddingHorizontal: 8,
//                 paddingVertical: 2,
//                 borderRadius: 12,
//                 minWidth: 24,
//                 alignItems: 'center'
//               }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 12,
//                   color: '#0066FF'
//                 }}>
//                   0
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity>
//               <Feather name="more-vertical" size={20} color="#666666" />
//             </TouchableOpacity>
//           </View>

//           {/* Transaction Cards */}
//           <View style={{ paddingHorizontal: 16 }}>
//             {transactions.map((transaction) => (
//               <View
//                 key={transaction.id}
//                 style={{
//                   backgroundColor: 'white',
//                   borderRadius: 16,
//                   padding: 14,
//                   marginBottom: 12,
//                   borderLeftWidth: 4,
//                   borderLeftColor: '#0066FF',
//                   flexDirection: 'row',
//                   alignItems: 'center'
//                 }}
//               >
//                 {/* Icon */}
//                 <View style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 24,
//                   backgroundColor: transaction.isIncoming ? '#E0F7ED' : '#FFE8E8',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: 12
//                 }}>
//                   <Text style={{
//                     fontSize: 20,
//                     color: transaction.isIncoming ? '#00C896' : '#FF4444'
//                   }}>
//                     $
//                   </Text>
//                 </View>

//                 {/* Details */}
//                 <View style={{ flex: 1 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 12,
//                     color: '#999999',
//                     marginBottom: 4
//                   }}>
//                     {transaction.date}, {transaction.type}
//                   </Text>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000'
//                   }}>
//                     {transaction.person}
//                   </Text>
//                 </View>

//                 {/* Amount & Status */}
//                 <View style={{ alignItems: 'flex-end' }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 16,
//                     color: transaction.isIncoming ? '#00C896' : '#FF4444',
//                     marginBottom: 4
//                   }}>
//                     {transaction.amount}
//                   </Text>
//                   {transaction.status === 'unpaid' && (
//                     <View style={{
//                       backgroundColor: '#FFE8E8',
//                       paddingHorizontal: 10,
//                       paddingVertical: 4,
//                       borderRadius: 6
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 11,
//                         color: '#FF4444'
//                       }}>
//                         Unpaid
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* Add Transaction Button */}
//           <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
//             <TouchableOpacity
//               onPress={() => setShowTransactionModal(true)}
//               style={{
//                 backgroundColor: '#0066FF',
//                 borderRadius: 12,
//                 paddingVertical: 16,
//                 alignItems: 'center'
//               }}
//             >
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: 'white'
//               }}>
//                 Add Transaction Entry
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>

//       {/* All Modals */}
//       <TransactionAddModal />
//       <IncomingPaymentModal />
//       <OutgoingPaymentModal />
//       <DebitNoteModal />

//       <MaterialPurchaseModal />
//       <SalesInvoiceModal />
//       <GenericFormModal type="Sales Invoice" />
//       <GenericFormModal type="Material Return" />
//       <GenericFormModal type="Material Transfer" />
//       <GenericFormModal type="Other Expense" />
//     </SafeAreaView>
//   )
// }

// export default Transaction

// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native'
// import { Feather } from '@expo/vector-icons'
// import { useNavigation } from '@react-navigation/native'

// // Import all modal components
// import TransactionAddModal from '../../components/TransactionAddModal'
// import IncomingPaymentModal from '../../components/IncomingPaymentModal'
// import OutgoingPaymentModal from '../../components/OutgoingPaymentModal'
// import DebitNoteModal from '../../components/DebitNoteModal'
// import MaterialPurchaseModal from '../../components/MaterialPurchaseModal'
// import SalesInvoiceModal from '../../components/SalesInvoiceModal'
// import GenericFormModal from '../../components/GenericFormModal'

// const Transaction = () => {
//   const navigation = useNavigation()
//   const [activeTab, setActiveTab] = useState('Transactions')
//   const [showTransactionModal, setShowTransactionModal] = useState(false)
//   const [selectedTransactionType, setSelectedTransactionType] = useState(null)

//   const transactions = [
//     {
//       id: 1,
//       date: '19 Mar 2025',
//       type: 'Incoming Payment',
//       person: 'Arun Mishra',
//       amount: '₹5000',
//       status: 'paid',
//       isIncoming: true,
//     },
//     {
//       id: 2,
//       date: '19 Mar 2025',
//       type: 'Outgoing Payment',
//       person: 'Arun Mishra',
//       amount: '₹1000',
//       status: 'unpaid',
//       isIncoming: false,
//     },
//     {
//       id: 3,
//       date: '19 Mar 2025',
//       type: 'Incoming Payment',
//       person: 'Arun Mishra',
//       amount: '₹5000',
//       status: 'paid',
//       isIncoming: true,
//     },
//     {
//       id: 4,
//       date: '19 Mar 2025',
//       type: 'Outgoing Payment',
//       person: 'Arun Mishra',
//       amount: '₹1000',
//       status: 'paid',
//       isIncoming: false,
//     },
//   ]

//   const tabs = ['Details', 'Tasks', 'Transactions', 'Attendance']

//   const handleSaveTransaction = (data) => {
//     console.log('Saving transaction:', data);
//     setSelectedTransactionType(null);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
//       <View style={{ flex: 1 }}>
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{ paddingBottom: 100 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Stats Card */}
//           <View style={{
//             backgroundColor: 'white',
//             borderRadius: 16,
//             padding: 16,
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 16,
//             borderLeftWidth: 4,
//             borderLeftColor: '#0066FF'
//           }}>
//             {/* Top Row - 3 Stats */}
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginBottom: 20
//             }}>
//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   BALANCE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#000000'
//                 }}>
//                   + 4,000
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL INCOMING
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#000000'
//                 }}>
//                   5,000
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL OUTGOING
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 22,
//                   color: '#FF4444'
//                 }}>
//                   1,000
//                 </Text>
//               </View>
//             </View>

//             {/* Bottom Row - 2 Stats */}
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               paddingTop: 16,
//               borderTopWidth: 1,
//               borderTopColor: '#F0F0F0'
//             }}>
//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   INVOICE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#000000'
//                 }}>
//                   ₹ 0
//                 </Text>
//               </View>

//               <View style={{ alignItems: 'center', flex: 1 }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 11,
//                   color: '#666666',
//                   letterSpacing: 0.5,
//                   marginBottom: 6
//                 }}>
//                   TOTAL EXPENSE
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#FF4444'
//                 }}>
//                   ₹ 300
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Pending Entries Header */}
//           <View style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             paddingHorizontal: 16,
//             marginBottom: 12
//           }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <View style={{ flexDirection: 'row', marginRight: 8 }}>
//                 <View style={{
//                   width: 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: '#000000',
//                   marginRight: 2
//                 }} />
//                 <View style={{
//                   width: 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: '#000000'
//                 }} />
//               </View>
//               <Text style={{
//                 fontFamily: 'Urbanist-Bold',
//                 fontSize: 16,
//                 color: '#000000',
//                 marginRight: 8
//               }}>
//                 Pending Entries
//               </Text>
//               <View style={{
//                 backgroundColor: '#E0EFFF',
//                 paddingHorizontal: 8,
//                 paddingVertical: 2,
//                 borderRadius: 12,
//                 minWidth: 24,
//                 alignItems: 'center'
//               }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 12,
//                   color: '#0066FF'
//                 }}>
//                   0
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity>
//               <Feather name="more-vertical" size={20} color="#666666" />
//             </TouchableOpacity>
//           </View>

//           {/* Transaction Cards */}
//           <View style={{ paddingHorizontal: 16 }}>
//             {transactions.map((transaction) => (
//               <View
//                 key={transaction.id}
//                 style={{
//                   backgroundColor: 'white',
//                   borderRadius: 16,
//                   padding: 14,
//                   marginBottom: 12,
//                   borderLeftWidth: 4,
//                   borderLeftColor: '#0066FF',
//                   flexDirection: 'row',
//                   alignItems: 'center'
//                 }}
//               >
//                 {/* Icon */}
//                 <View style={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 24,
//                   backgroundColor: transaction.isIncoming ? '#E0F7ED' : '#FFE8E8',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: 12
//                 }}>
//                   <Text style={{
//                     fontSize: 20,
//                     color: transaction.isIncoming ? '#00C896' : '#FF4444'
//                   }}>
//                     $
//                   </Text>
//                 </View>

//                 {/* Details */}
//                 <View style={{ flex: 1 }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Regular',
//                     fontSize: 12,
//                     color: '#999999',
//                     marginBottom: 4
//                   }}>
//                     {transaction.date}, {transaction.type}
//                   </Text>
//                   <Text style={{
//                     fontFamily: 'Urbanist-SemiBold',
//                     fontSize: 14,
//                     color: '#000000'
//                   }}>
//                     {transaction.person}
//                   </Text>
//                 </View>

//                 {/* Amount & Status */}
//                 <View style={{ alignItems: 'flex-end' }}>
//                   <Text style={{
//                     fontFamily: 'Urbanist-Bold',
//                     fontSize: 16,
//                     color: transaction.isIncoming ? '#00C896' : '#FF4444',
//                     marginBottom: 4
//                   }}>
//                     {transaction.amount}
//                   </Text>
//                   {transaction.status === 'unpaid' && (
//                     <View style={{
//                       backgroundColor: '#FFE8E8',
//                       paddingHorizontal: 10,
//                       paddingVertical: 4,
//                       borderRadius: 6
//                     }}>
//                       <Text style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 11,
//                         color: '#FF4444'
//                       }}>
//                         Unpaid
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* Add Transaction Button */}
//           <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
//             <TouchableOpacity
//               onPress={() => setShowTransactionModal(true)}
//               style={{
//                 backgroundColor: '#0066FF',
//                 borderRadius: 12,
//                 paddingVertical: 16,
//                 alignItems: 'center'
//               }}
//             >
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: 'white'
//               }}>
//                 Add Transaction Entry
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>

//       {/* All Modals */}
//       <TransactionAddModal
//         visible={showTransactionModal}
//         onClose={() => setShowTransactionModal(false)}
//         onSelectTransactionType={setSelectedTransactionType}
//       />

//       <IncomingPaymentModal
//         visible={selectedTransactionType === 'Incoming Payment'}
//         onClose={() => setSelectedTransactionType(null)}
//         onSave={handleSaveTransaction}
//       />

//       <OutgoingPaymentModal
//         visible={selectedTransactionType === 'Outgoing Payment'}
//         onClose={() => setSelectedTransactionType(null)}
//         onSave={handleSaveTransaction}
//       />

//       <DebitNoteModal
//         visible={selectedTransactionType === 'Debit Note'}
//         onClose={() => setSelectedTransactionType(null)}
//         onSave={handleSaveTransaction}
//       />

//       <MaterialPurchaseModal
//         visible={selectedTransactionType === 'Material Purchase'}
//         onClose={() => setSelectedTransactionType(null)}
//         onSave={handleSaveTransaction}
//       />

//       <SalesInvoiceModal
//         visible={selectedTransactionType === 'Sales Invoice'}
//         onClose={() => setSelectedTransactionType(null)}
//         onSave={handleSaveTransaction}
//       />

//       <GenericFormModal
//         visible={selectedTransactionType === 'Material Return'}
//         onClose={() => setSelectedTransactionType(null)}
//         type="Material Return"
//       />

//       <GenericFormModal
//         visible={selectedTransactionType === 'Material Transfer'}
//         onClose={() => setSelectedTransactionType(null)}
//         type="Material Transfer"
//       />

//       <GenericFormModal
//         visible={selectedTransactionType === 'Other Expense'}
//         onClose={() => setSelectedTransactionType(null)}
//         type="Other Expense"
//       />
//     </SafeAreaView>
//   )
// }

// export default Transaction

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import modals
import TransactionAddModal from '../../components/TransactionAddModal';
import IncomingPaymentModal from '../../components/IncomingPaymentModal';
import OutgoingPaymentModal from '../../components/OutgoingPaymentModal';
import DebitNoteModal from '../../components/DebitNoteModal';
import MaterialPurchaseModal from '../../components/MaterialPurchaseModal';
import SalesInvoiceModal from '../../components/SalesInvoiceModal';
import GenericFormModal from '../../components/GenericFormModal';

//const API_URL = 'https://skystruct-lite-backend.vercel.app/api/transactions';
const API_URL = `${process.env.BASE_API_URL}/api/transactions`;
const TOKEN_KEY = 'userToken';

const Transaction = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Transactions');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Debug AsyncStorage (once)
  useEffect(() => {
    const debugAsyncStorage = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      console.log('[Debug] AsyncStorage contents:', data);
    };
    debugAsyncStorage();
  }, []);

  // ---------------------------------------------------------------------
  // Fetch Transactions (GET)
  // ---------------------------------------------------------------------
  const fetchTransactions = useCallback(async () => {
    setError(null);
    try {
      console.log('\n[Transactions] Fetching transactions...');
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('[Transactions] Token fetched:', token);

      if (!token) {
        Alert.alert('Error', 'User not logged in. Please sign in again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[Transactions] Response status:', response.status);
      const data = await response.json();
      console.log('[Transactions] Response JSON:', data);

      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

      console.log('[Transactions] Count:', list.length);
      setTransactions(list);
    } catch (err) {
      console.error('[Transactions] Fetch error:', err);
      setError('Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ---------------------------------------------------------------------
  // Create Transaction (POST)
  // ---------------------------------------------------------------------
  const handleSaveTransaction = async (formData) => {
    console.log('\n[Transactions] handleSaveTransaction data:', formData);
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const projectId = await AsyncStorage.getItem('activeProjectId');
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : {};

      if (!token) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const typeMap = {
        'Incoming Payment': 'payment_in',
        'Outgoing Payment': 'payment_out',
        'Material Purchase': 'purchase',
        'Sales Invoice': 'invoice',
        'Debit Note': 'debit_note',
        'Material Return': 'expense',
        'Material Transfer': 'expense',
        'Other Expense': 'expense',
      };

      // Determine correct type safely
      let mappedType = formData.type;

      // If it's one of the UI labels (e.g., "Debit Note"), map it to backend format
      if (typeMap[formData.type]) {
        mappedType = typeMap[formData.type];
      }

      // Final fallback
      if (!mappedType) mappedType = 'expense';

      const payload = {
        projectId: projectId || '691189346522d6945d920bac',
        createdBy: parsedUser.id || '690d86c4425a1a0b7dfe7d42',
        type: mappedType, // ✅ preserves debit_note if already set
        amount: Number(formData.amount) || 0,
        remarks: formData.remarks || '',
        vendorName: formData.vendorName || formData.from || '',
        invoiceNumber: formData.invoiceNumber || '',
        invoiceDate: formData.invoiceDate || new Date(),
        paymentMode: formData.paymentMode || 'cash',
        referenceNumber: formData.referenceNumber || '',
        paymentDate: formData.paymentDate || new Date(),
        items: formData.items || [],
        documents: formData.documents || [],
        currency: 'INR',
        status: 'pending',
      };

      console.log('[Transactions] Sending POST payload:', payload);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      console.log('[Transactions] POST response:', json);

      if (!res.ok) throw new Error(json.message || `Failed with ${res.status}`);

      Alert.alert('Success', 'Transaction created successfully!');
      setShowTransactionModal(false);
      setSelectedTransactionType(null);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('[Transactions] Create error:', err);
      Alert.alert('Error', err.message || 'Failed to create transaction');
    }
  };

  // ---------------------------------------------------------------------
  // Update Transaction (PUT)
  // ---------------------------------------------------------------------
  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error('Missing auth token');

      console.log(`[Transactions] Updating transaction ${id}`);

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const json = await res.json().catch(() => ({}));
      console.log('[Transactions] PUT response:', json);

      if (!res.ok) throw new Error(json.message || 'Update failed');

      Alert.alert('Updated', 'Transaction updated successfully!');
      setEditingTransaction(null);
      setSelectedTransactionType(null);
      fetchTransactions();
    } catch (err) {
      console.error('[Transactions] Update error:', err);
      Alert.alert('Error', err.message || 'Failed to update transaction');
    }
  };

  // ---------------------------------------------------------------------
  // Delete Transaction (DELETE)
  // ---------------------------------------------------------------------
  const handleDeleteTransaction = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (!token) throw new Error('Missing token');

            console.log(`[Transactions] Deleting transaction ${id}`);

            const res = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json().catch(() => ({}));
            console.log('[Transactions] DELETE response:', json);

            if (!res.ok) throw new Error(json.message || 'Delete failed');

            Alert.alert('Deleted', 'Transaction removed successfully.');
            fetchTransactions();
          } catch (err) {
            console.error('[Transactions] Delete error:', err);
            Alert.alert('Error', err.message || 'Failed to delete transaction');
          }
        },
      },
    ]);
  };

  // ---------------------------------------------------------------------
  // Handle Edit Transaction - FIXED: Now sets correct type and opens modal
  // ---------------------------------------------------------------------
  const handleEditTransaction = (transaction) => {
    console.log('[Transactions] Editing transaction:', transaction);

    const typeMap = {
      payment_in: 'Incoming Payment',
      payment_out: 'Outgoing Payment',
      purchase: 'Material Purchase',
      invoice: 'Sales Invoice',
      debit_note: 'Debit Note',
      expense: 'Other Expense',
    };

    const uiType = typeMap[transaction.type] || 'Other Expense';

    // Set both states to open the correct modal
    setEditingTransaction(transaction);
    setSelectedTransactionType(uiType);

    console.log('[Transactions] Opening modal for type:', uiType);
  };

  // ---------------------------------------------------------------------
  // Reset editing state when modal closes
  // ---------------------------------------------------------------------
  const handleModalClose = () => {
    console.log('[Transactions] Closing modal, resetting editing state');
    setSelectedTransactionType(null);
    setEditingTransaction(null);
  };

  // ---------------------------------------------------------------------
  // UI States
  // ---------------------------------------------------------------------
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading transactions...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchTransactions}
          style={{
            marginTop: 16,
            backgroundColor: '#0066FF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}>
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#0066FF',
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Stat label="BALANCE" value={`+ ${calculateBalance(transactions)}`} color="#000" />
            <Stat label="TOTAL INCOMING" value={calculateIncoming(transactions)} color="#000" />
            <Stat label="TOTAL OUTGOING" value={calculateOutgoing(transactions)} color="#FF4444" />
          </View>
        </View>

        {/* Transactions List */}
        <View style={{ paddingHorizontal: 16 }}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 30 }}>
              No transactions found
            </Text>
          ) : (
            transactions.map((transaction) => (
              <SwipeableTransactionCard
                key={transaction._id}
                transaction={transaction}
                onDelete={() => handleDeleteTransaction(transaction._id)}
                onEdit={() => handleEditTransaction(transaction)}
              />
            ))
          )}
        </View>

        {/* Add Transaction Button */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <TouchableOpacity
            onPress={() => setShowTransactionModal(true)}
            style={{
              backgroundColor: '#0066FF',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>
              Add Transaction Entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals - Fixed: All modals now properly handle edit mode */}
      <View pointerEvents="box-none">
        <TransactionAddModal
          visible={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransactionType(null);
            setEditingTransaction(null);
          }}
          onSelectTransactionType={setSelectedTransactionType}
        />

        <IncomingPaymentModal
          visible={selectedTransactionType === 'Incoming Payment'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />

        <OutgoingPaymentModal
          visible={selectedTransactionType === 'Outgoing Payment'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />

        <DebitNoteModal
          visible={selectedTransactionType === 'Debit Note'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />
        <MaterialPurchaseModal
          visible={selectedTransactionType === 'Material Purchase'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />
        <SalesInvoiceModal
          visible={selectedTransactionType === 'Sales Invoice'}
          onClose={handleModalClose}
          onSave={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleSaveTransaction
          }
          editingTransaction={editingTransaction}
        />

        {['Material Return', 'Material Transfer', 'Other Expense'].map((type) => (
          <GenericFormModal
            key={type}
            visible={selectedTransactionType === type}
            onClose={handleModalClose}
            type={type}
            onSave={
              editingTransaction
                ? (data) => handleUpdateTransaction(editingTransaction._id, data)
                : handleSaveTransaction
            }
            editingTransaction={editingTransaction}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------
// Swipeable Transaction Card Component
// ---------------------------------------------------------------------
const SwipeableTransactionCard = ({ transaction, onDelete, onEdit }) => {
  const swipeAnim = useState(new Animated.Value(0))[0];
  const [showActions, setShowActions] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        swipeAnim.setValue(gestureState.dx);
      } else if (gestureState.dx > 0) {
        swipeAnim.setValue(0);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -80) {
        Animated.timing(swipeAnim, {
          toValue: -160,
          duration: 200,
          useNativeDriver: false,
        }).start(() => setShowActions(true));
      } else {
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => setShowActions(false));
      }
    },
  });

  const resetPosition = () => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setShowActions(false));
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Animated.View
        style={{
          transform: [{ translateX: swipeAnim }],
        }}
        {...panResponder.panHandlers}>
        <TouchableOpacity onPress={resetPosition} activeOpacity={0.9}>
          <TransactionCard transaction={transaction} />
        </TouchableOpacity>
      </Animated.View>

      {/* Action Buttons */}
      {showActions && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            flexDirection: 'row',
            width: 160,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#0066FF',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              marginRight: 1,
            }}
            onPress={() => {
              resetPosition();
              onEdit();
            }}>
            <Feather name="edit" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#FF4444',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
            }}
            onPress={() => {
              resetPosition();
              onDelete();
            }}>
            <Feather name="trash-2" size={20} color="white" />
            <Text style={{ color: 'white', fontSize: 12, marginTop: 4 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------
// Helper Components & Functions
// ---------------------------------------------------------------------
const Stat = ({ label, value, color }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{label}</Text>
    <Text style={{ fontWeight: '700', fontSize: 20, color }}>{value}</Text>
  </View>
);

const TransactionCard = ({ transaction }) => {
  const isIncoming = transaction.type.includes('in');
  const color = isIncoming ? '#00C896' : '#FF4444';
  const bg = isIncoming ? '#E0F7ED' : '#FFE8E8';

  // FIXED: Get vendor name from multiple possible fields
  const getVendorName = () => {
    // Check multiple possible vendor name fields
    if (transaction.vendorName) return transaction.vendorName;
    if (transaction.vendor) return transaction.vendor;
    if (transaction.from) return transaction.from;
    if (transaction.partyName) return transaction.partyName;

    // For different transaction types, provide meaningful fallbacks
    if (transaction.type === 'payment_in') return 'Customer Payment';
    if (transaction.type === 'payment_out') return 'Vendor Payment';
    if (transaction.type === 'purchase') return 'Material Supplier';
    if (transaction.type === 'invoice') return 'Sales Customer';
    if (transaction.type === 'debit_note') return 'Debit Note Party';

    return 'No vendor';
  };

  const vendorName = getVendorName();

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#0066FF',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
        <Text style={{ fontSize: 20, color }}>₹</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
          {new Date(transaction.createdAt).toLocaleDateString()} , {transaction.type}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>{vendorName}</Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color, marginBottom: 4 }}>
          ₹{transaction.amount}
        </Text>
        <View
          style={{
            backgroundColor: transaction.status === 'approved' ? '#E0F7ED' : '#FFE8E8',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: transaction.status === 'approved' ? '#00C896' : '#FF4444',
            }}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </View>
  );
};

const calculateIncoming = (list) =>
  list.filter((t) => t.type.includes('in')).reduce((sum, t) => sum + (t.amount || 0), 0);
const calculateOutgoing = (list) =>
  list.filter((t) => t.type.includes('out')).reduce((sum, t) => sum + (t.amount || 0), 0);
const calculateBalance = (list) => calculateIncoming(list) - calculateOutgoing(list);

export default Transaction;
