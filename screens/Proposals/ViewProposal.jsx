// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   Platform
// } from 'react-native'
// import React, { useState } from 'react'
// import { Feather } from '@expo/vector-icons'
// import { LinearGradient } from 'expo-linear-gradient'
// import Header from '../../components/Header'

// const ViewProposal = ({ navigation, route }) => {
//   const { proposal } = route.params || {};
//   console.log("Proposal data:", proposal);

//   const API_URL = `${process.env.BASE_API_URL}`;
  
//   // Use the actual proposal data
//   const proposalData = proposal || {};
//   const rawData = proposalData?.raw || {};

//   const getFileIcon = (type) => {
//     switch (type) {
//       case 'pdf': return 'file-text';
//       case 'zip': return 'archive';
//       case 'excel': return 'file';
//       default: return 'file';
//     }
//   };

//   const getFileColor = (type) => {
//     switch (type) {
//       case 'pdf': return '#FF4444';
//       case 'zip': return '#FF6B35';
//       case 'excel': return '#00C896';
//       default: return '#0066FF';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not specified';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const handleApprove = () => {
//     Alert.alert(
//       "Approve Proposal",
//       "Are you sure you want to approve this proposal?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Approve", 
//           style: "default",
//           onPress: () => {
//             // Handle approval logic
//             console.log("Proposal approved");
//             navigation.goBack();
//           }
//         },
//       ]
//     );
//   };

//   const handleReject = () => {
//     Alert.alert(
//       "Reject Proposal",
//       "Are you sure you want to reject this proposal?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Reject", 
//           style: "destructive",
//           onPress: () => {
//             // Handle rejection logic
//             console.log("Proposal rejected");
//             navigation.goBack();
//           }
//         },
//       ]
//     );
//   };

//   const handleDownload = (file) => {
//     console.log("Downloading:", file.name);
//     // Implement download logic
//   };

//   const StatusBadge = ({ status }) => {
//     const getStatusColors = () => {
//       switch (status?.toLowerCase()) {
//         case "approved": 
//           return { bg: "#D4EDDA", text: "#155724", icon: "check-circle" };
//         case "rejected": 
//           return { bg: "#F8D7DA", text: "#721C24", icon: "x-circle" };
//         case "pending": 
//           return { bg: "#FFF3CD", text: "#856404", icon: "clock" };
//         case "proposal under approval": 
//           return { bg: "#CCE7FF", text: "#0066CC", icon: "file-text" };
//         default: 
//           return { bg: "#E2E3E5", text: "#383D41", icon: "help-circle" };
//       }
//     };

//     const colors = getStatusColors();

//     return (
//       <View style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.bg,
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 16,
//         alignSelf: 'flex-start',
//       }}>
//         <Feather name={colors.icon} size={14} color={colors.text} />
//         <Text style={{
//           fontFamily: "Urbanist-SemiBold",
//           fontSize: 12,
//           color: colors.text,
//           marginLeft: 4,
//         }}>
//           {status || 'Pending'}
//         </Text>
//       </View>
//     );
//   };

//   const SectionHeader = ({ title, icon }) => (
//     <View style={{
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 16,
//     }}>
//       <Feather name={icon} size={20} color="#0066FF" />
//       <Text style={{
//         fontFamily: 'Urbanist-Bold',
//         fontSize: 20,
//         color: '#1A1A1A',
//         marginLeft: 8,
//       }}>
//         {title}
//       </Text>
//     </View>
//   );

//   const InfoCard = ({ children }) => (
//     <View style={{
//       backgroundColor: 'white',
//       borderRadius: 20,
//       padding: 20,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.1,
//       shadowRadius: 12,
//       elevation: 5,
//       borderLeftWidth: 4,
//       borderLeftColor: '#0066FF'
//     }}>
//       {children}
//     </View>
//   );

//   const InfoRow = ({ label, value, highlight = false }) => (
//     <View style={{ 
//       flexDirection: 'row', 
//       marginBottom: 16,
//       alignItems: 'flex-start'
//     }}>
//       <Text style={{
//         fontFamily: 'Urbanist-SemiBold',
//         fontSize: 14,
//         color: '#666666',
//         width: 120
//       }}>
//         {label}
//       </Text>
//       <Text style={{
//         fontFamily: highlight ? 'Urbanist-Bold' : 'Urbanist-Medium',
//         fontSize: 14,
//         color: highlight ? '#0066FF' : '#1A1A1A',
//         flex: 1,
//         lineHeight: 20
//       }}>
//         {value || 'Not specified'}
//       </Text>
//     </View>
//   );

//   // Safe data access with fallbacks
//   const projectDocuments = rawData.projectDocuments || [];
//   const selectedItems = rawData.selectedItems || [];
//   const projectType = rawData.projectType || {};
//   const description = rawData.description || 'No description provided.';
//   const budget = rawData.budget || 'Not specified';
//   const location = rawData.location || 'Not specified';
//   const projectName = rawData.name || 'Unnamed Project';
//   const status = rawData.status || 'Pending';
//   const createdAt = rawData.createdAt || '';
//   const clientName = proposalData.client || 'Not specified';
//   const designerName = proposalData.designer || 'Not specified';

//   return (
//     <View style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
//       <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
//       {/* Header with Gradient */}
      
//         <Header 
//           title="Proposal Details" 
//           showBackButton={true}
//           backgroundColor="transparent"
//           titleColor="white"
//           iconColor="white"
//         />
   
      
//       <ScrollView 
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Proposal Header */}
//         <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
//           <View style={{
//             backgroundColor: 'white',
//             borderRadius: 20,
//             padding: 20,
//             marginBottom: 16,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.1,
//             shadowRadius: 12,
//             elevation: 5,
//           }}>
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               marginBottom: 12,
//             }}>
//               <Text style={{
//                 fontFamily: 'Urbanist-Bold',
//                 fontSize: 22,
//                 color: '#1A1A1A',
//                 flex: 1,
//                 marginRight: 12,
//               }}>
//                 {projectName}
//               </Text>
//               <StatusBadge status={status} />
//             </View>
            
//             <Text style={{
//               fontFamily: 'Urbanist-Regular',
//               fontSize: 15,
//               color: '#666666',
//               lineHeight: 22,
//               marginBottom: 16,
//             }}>
//               {description}
//             </Text>

//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}>
//               <View>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Medium',
//                   fontSize: 14,
//                   color: '#0066FF',
//                   marginBottom: 4,
//                 }}>
//                   {designerName}
//                 </Text>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Regular',
//                   fontSize: 12,
//                   color: '#999999',
//                 }}>
//                   Submitted on {formatDate(createdAt)}
//                 </Text>
//               </View>
              
//               <View style={{
//                 backgroundColor: '#E6F0FF',
//                 paddingHorizontal: 12,
//                 paddingVertical: 6,
//                 borderRadius: 12,
//               }}>
//                 <Text style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 16,
//                   color: '#0066FF',
//                 }}>
//                   {budget}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Project Overview */}
//         <View style={{ paddingHorizontal: 20 }}>
//           <SectionHeader title="Project Overview" icon="clipboard" />
          
//           <InfoCard>
//             <InfoRow label="Project Title" value={projectName} />
//             <InfoRow label="Client" value={clientName} highlight />
//             <InfoRow label="Designer" value={designerName} />
//             <InfoRow label="Location" value={location} />
//             <InfoRow label="Project Type" value={projectType.projectTypeName} />
//             <InfoRow label="Status" value={status} />
//             <InfoRow label="Total Budget" value={budget} highlight />
//             <InfoRow label="Date Submitted" value={formatDate(createdAt)} />
//           </InfoCard>
//         </View>

//         {/* Project Description */}
//         <View style={{ paddingHorizontal: 20 }}>
//           <SectionHeader title="Project Description" icon="file-text" />
          
//           <InfoCard>
//             <Text style={{
//               fontFamily: 'Urbanist-Regular',
//               fontSize: 14,
//               color: '#1A1A1A',
//               lineHeight: 22,
//             }}>
//               {description}
//             </Text>
//           </InfoCard>
//         </View>

//         {/* Selected Items */}
//         {/* */}

//         {/* Attachments */}
//         {projectDocuments.length > 0 && (
//           <View style={{ paddingHorizontal: 20 }}>
//             <SectionHeader title="Attachments" icon="paperclip" />
            
//             <View style={{ marginBottom: 24 }}>
//               {projectDocuments.map((doc, index) => (
//                 <TouchableOpacity 
//                   key={doc._id || index}
//                   onPress={() => handleDownload(doc)}
//                   style={{
//                     backgroundColor: 'white',
//                     borderRadius: 16,
//                     padding: 16,
//                     marginBottom: 12,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     shadowColor: "#000",
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.1,
//                     shadowRadius: 8,
//                     elevation: 3,
//                   }}
//                 >
//                   <View style={{
//                     width: 48,
//                     height: 48,
//                     backgroundColor: '#0066FF20',
//                     borderRadius: 12,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     marginRight: 12,
//                   }}>
//                     <Feather name={getFileIcon(doc.type)} size={24} color="#0066FF" />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontFamily: 'Urbanist-SemiBold',
//                       fontSize: 15,
//                       color: '#1A1A1A',
//                     }}>
//                       Document {index + 1}
//                     </Text>
//                     <Text style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 13,
//                       color: '#999999',
//                       marginTop: 2,
//                     }}>
//                       {doc.type || 'Document'} • {formatDate(doc.uploadDate)}
//                     </Text>
//                   </View>
//                   <TouchableOpacity 
//                     onPress={() => handleDownload(doc)}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       backgroundColor: '#0066FF',
//                       borderRadius: 10,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <Feather name="download" size={18} color="white" />
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Additional Information */}
//         <View style={{ paddingHorizontal: 20 }}>
//           <SectionHeader title="Additional Information" icon="info" />
          
//           <InfoCard>
//             <View style={{ marginBottom: 16 }}>
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 14,
//                 color: '#666666',
//                 marginBottom: 8,
//               }}>
//                 Project ID
//               </Text>
//               <Text style={{
//                 fontFamily: 'Urbanist-Medium',
//                 fontSize: 14,
//                 color: '#1A1A1A',
//               }}>
//                 {rawData._id || 'Not available'}
//               </Text>
//             </View>
            
//             <View>
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 14,
//                 color: '#666666',
//                 marginBottom: 8,
//               }}>
//                 Last Updated
//               </Text>
//               <Text style={{
//                 fontFamily: 'Urbanist-Medium',
//                 fontSize: 14,
//                 color: '#1A1A1A',
//               }}>
//                 {formatDate(rawData.updatedAt) || 'Not available'}
//               </Text>
//             </View>
//           </InfoCard>
//         </View>

//         {/* Action Buttons */}
//         {status === 'Proposal Under Approval' && (
//           <View style={{
//             paddingHorizontal: 20,
//             paddingBottom: 24,
//             flexDirection: 'row',
//             gap: 12
//           }}>
//             <TouchableOpacity 
//               onPress={handleReject}
//               style={{
//                 flex: 1,
//                 backgroundColor: '#FFE5E5',
//                 borderRadius: 16,
//                 paddingVertical: 16,
//                 alignItems: 'center',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 shadowColor: "#FF4444",
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.2,
//                 shadowRadius: 8,
//                 elevation: 3,
//               }}
//             >
//               <Feather name="x" size={20} color="#FF4444" />
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: '#FF4444',
//                 marginLeft: 8,
//               }}>
//                 Reject
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               onPress={handleApprove}
//               style={{
//                 flex: 1,
//                 backgroundColor: '#00C896',
//                 borderRadius: 16,
//                 paddingVertical: 16,
//                 alignItems: 'center',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 shadowColor: "#00C896",
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.3,
//                 shadowRadius: 8,
//                 elevation: 3,
//               }}
//             >
//               <Feather name="check" size={20} color="white" />
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: 'white',
//                 marginLeft: 8,
//               }}>
//                 Approve
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* View Only State */}
//         {status !== 'Proposal Under Approval' && (
//           <View style={{
//             paddingHorizontal: 20,
//             paddingBottom: 24,
//           }}>
//             <View style={{
//               backgroundColor: '#E6F0FF',
//               borderRadius: 16,
//               padding: 16,
//               alignItems: 'center',
//             }}>
//               <Feather name="eye" size={24} color="#0066FF" />
//               <Text style={{
//                 fontFamily: 'Urbanist-SemiBold',
//                 fontSize: 16,
//                 color: '#0066FF',
//                 marginTop: 8,
//               }}>
//                 View Only - {status}
//               </Text>
//               <Text style={{
//                 fontFamily: 'Urbanist-Regular',
//                 fontSize: 14,
//                 color: '#666666',
//                 textAlign: 'center',
//                 marginTop: 4,
//               }}>
//                 This proposal has already been {status.toLowerCase()}
//               </Text>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   )
// }

// export default ViewProposal



import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import React, { useState, useCallback } from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Separate Modal Component
const RejectionModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  rejectionReason, 
  setRejectionReason,
  isSubmitting 
}) => {
  const [localReason, setLocalReason] = useState(rejectionReason);
  
  const handleSubmit = () => {
    onSubmit(localReason);
  };

  const handleClose = () => {
    setLocalReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: 'white',
                borderRadius: 24,
                width: '100%',
                maxWidth: 400,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
              }}>
                {/* Modal Header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#FFE5E5',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather name="x" size={20} color="#FF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-Bold',
                      fontSize: 20,
                      color: '#1A1A1A',
                    }}>
                      Reject Proposal
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#666666',
                      marginTop: 4,
                    }}>
                      Please provide a reason for rejection
                    </Text>
                  </View>
                </View>

                {/* Reason Input */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: '#1A1A1A',
                    marginBottom: 8,
                  }}>
                    Reason for Rejection *
                  </Text>
                  <TextInput
                    value={localReason}
                    onChangeText={setLocalReason}
                    placeholder="Enter your reason here..."
                    placeholderTextColor="#999999"
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: '#FAFBFC',
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 14,
                      color: '#1A1A1A',
                      textAlignVertical: 'top',
                      minHeight: 120,
                      borderWidth: 1,
                      borderColor: localReason ? '#0066FF' : '#E0E0E0',
                    }}
                    maxLength={500}
                  />
                  <Text style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 12,
                    color: '#999999',
                    textAlign: 'right',
                    marginTop: 4,
                  }}>
                    {localReason.length}/500 characters
                  </Text>
                </View>

              

                {/* Action Buttons */}
                <View style={{ 
                  flexDirection: 'row', 
                  gap: 12,
                  justifyContent: 'flex-end'
                }}>
                  <TouchableOpacity 
                    onPress={handleClose}
                    disabled={isSubmitting}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: '#F5F5F5',
                    }}
                  >
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 14,
                      color: '#666666',
                    }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={handleSubmit}
                    disabled={isSubmitting || !localReason.trim()}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: isSubmitting || !localReason.trim() ? '#CCCCCC' : '#FF4444',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Feather name="loader" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Processing...
                        </Text>
                      </>
                    ) : (
                      <>
                        <Feather name="x" size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: 'white',
                        }}>
                          Reject Proposal
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ViewProposal = ({ navigation, route }) => {
  const { proposal } = route.params || {};
  
  // State for rejection modal and reason
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the actual proposal data
  const proposalData = proposal || {};
  const rawData = proposalData?.raw || {};
  
  // Get the ID from rawData._id for the API endpoint
  const itemId = rawData._id; // This is the ID used in the API

  const API_URL = `${process.env.BASE_API_URL}`;

  const getFileIcon = useCallback((type) => {
    switch (type) {
      case 'pdf': return 'file-text';
      case 'zip': return 'archive';
      case 'excel': return 'file';
      default: return 'file';
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }, []);

  // Handle approval with API call
  const handleApprove = useCallback(async () => {
    if (!itemId) {
      Alert.alert(
        "Error",
        "ID not found. Cannot approve proposal.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Approve Proposal",
      "Are you sure you want to approve this proposal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          style: "default",
          onPress: async () => {
            setIsSubmitting(true);
            
            try {
              // Prepare the request body with "Initialize" status
              const requestBody = {
                status: "Initialize", // Changed from "Approved" to "Initialize"
                // Optionally, you can add an approval note or timestamp
                updatedAt: new Date().toISOString()
              };

              const token = await AsyncStorage.getItem('userToken');
              
              // Make the PUT request to the API
              const response = await fetch(`${API_URL}/api/projects/${itemId}`, {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(requestBody),
              });

              console.log(`Making PUT request for approval to: /api/projects/${itemId}`);
              console.log('Request body:', requestBody);
              
              const responseData = await response.json();
              
              if (response.ok) {
                console.log('Approval successful:', responseData);
                
                // Show success message
                Alert.alert(
                  "Proposal Approved",
                  "The proposal has been successfully approved and initialized.",
                  [
                    { 
                      text: "OK", 
                      onPress: () => {
                        // Navigate back to previous screen
                        navigation.goBack();
                      }
                    }
                  ]
                );
              } 
              else {
                console.error('Approval failed:', responseData);
                throw new Error(responseData.message || `HTTP ${response.status}: Failed to approve proposal`);
              }
            } catch (error) {
              console.error('Error approving proposal:', error);
              
              Alert.alert(
                "Error",
                error.message || "Failed to approve proposal. Please try again.",
                [{ text: "OK" }]
              );
            } finally {
              setIsSubmitting(false);
            }
          }
        },
      ]
    );
  }, [itemId, navigation, API_URL]);

  // Alternative simpler approval handler
  const handleApproveSimple = useCallback(async () => {
    Alert.alert(
      "Approve Proposal",
      "Are you sure you want to approve this proposal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          style: "default",
          onPress: async () => {
            await updateProposalStatus("Initialize");
          }
        },
      ]
    );
  }, []);

  // Handle rejection with API call
  const handleReject = () => {
    setShowRejectModal(true);
  };

  // Handle rejection with API call
  const handleRejectSubmit = useCallback(async (reason) => {
    if (!reason.trim()) {
      Alert.alert(
        "Reason Required",
        "Please provide a reason for rejection.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!itemId) {
      Alert.alert(
        "Error",
        "ID not found. Cannot reject proposal.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the request body
      const requestBody = {
        status: "Rejected",
        rejectionReason: reason,
        // Add timestamp if needed
        updatedAt: new Date().toISOString()
      };

      const token = await AsyncStorage.getItem('userToken');
      
      // Make the PUT request to the API
      const response = await fetch(`${API_URL}/api/projects/${itemId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Making PUT request to: /api/projects/${itemId}`);
      console.log('Request body:', requestBody);
      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Rejection successful:', responseData);
        
        // Show success message
        Alert.alert(
          "Proposal Rejected",
          "The proposal has been successfully rejected.",
          [
            { 
              text: "OK", 
              onPress: () => {
                // Navigate back to previous screen
                navigation.goBack();
              }
            }
          ]
        );
      } 
      else {
        console.error('Rejection failed:', responseData);
        throw new Error(responseData.message || `HTTP ${response.status}: Failed to reject proposal`);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      
      Alert.alert(
        "Error",
        error.message || "Failed to reject proposal. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
      setShowRejectModal(false);
    }
  }, [itemId, navigation, API_URL]);

  // Generic function to update proposal status
  const updateProposalStatus = useCallback(async (status, rejectionReason = '') => {
    if (!itemId) {
      Alert.alert("Error", "ID not found. Cannot update proposal.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestBody = {
        status: status,
        updatedAt: new Date().toISOString()
      };

      // Add rejection reason if provided
      if (rejectionReason) {
        requestBody.rejectionReason = rejectionReason;
      }

      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch(`${API_URL}/api/projects/${itemId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        const action = status === "Initialize" ? "approved" : "rejected";
        const message = status === "Initialize" 
          ? "The proposal has been successfully approved and initialized."
          : "The proposal has been successfully rejected.";
        
        Alert.alert(
          `Proposal ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          message,
          [
            { 
              text: "OK", 
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      } 
      else {
        throw new Error(responseData.message || `Failed to update proposal`);
      }
    } catch (error) {
      console.error('Error updating proposal:', error);
      Alert.alert("Error", error.message || "Failed to update proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowRejectModal(false);
    }
  }, [itemId, navigation, API_URL]);

  // Enhanced handleApprove using the generic function
  const handleApproveEnhanced = useCallback(() => {
    Alert.alert(
      "Approve Proposal",
      "Are you sure you want to approve this proposal?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          style: "default",
          onPress: () => updateProposalStatus("Initialize")
        },
      ]
    );
  }, [updateProposalStatus]);

  const handleDownload = useCallback((file) => {
    console.log("Downloading:", file.name);
    // Implement download logic
  }, []);

  const StatusBadge = useCallback(({ status }) => {
    const getStatusColors = () => {
      switch (status?.toLowerCase()) {
        case "approved": 
        case "initialize": // Add support for Initialize status
          return { bg: "#D4EDDA", text: "#155724", icon: "check-circle" };
        case "rejected": 
          return { bg: "#F8D7DA", text: "#721C24", icon: "x-circle" };
        case "pending": 
          return { bg: "#FFF3CD", text: "#856404", icon: "clock" };
        case "proposal under approval": 
          return { bg: "#CCE7FF", text: "#0066CC", icon: "file-text" };
        default: 
          return { bg: "#E2E3E5", text: "#383D41", icon: "help-circle" };
      }
    };

    const colors = getStatusColors();

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
      }}>
        <Feather name={colors.icon} size={14} color={colors.text} />
        <Text style={{
          fontFamily: "Urbanist-SemiBold",
          fontSize: 12,
          color: colors.text,
          marginLeft: 4,
        }}>
          {status || 'Pending'}
        </Text>
      </View>
    );
  }, []);

  const SectionHeader = useCallback(({ title, icon }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    }}>
      <Feather name={icon} size={20} color="#0066FF" />
      <Text style={{
        fontFamily: 'Urbanist-Bold',
        fontSize: 20,
        color: '#1A1A1A',
        marginLeft: 8,
      }}>
        {title}
      </Text>
    </View>
  ), []);

  const InfoCard = useCallback(({ children }) => (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: '#0066FF'
    }}>
      {children}
    </View>
  ), []);

  const InfoRow = useCallback(({ label, value, highlight = false }) => (
    <View style={{ 
      flexDirection: 'row', 
      marginBottom: 16,
      alignItems: 'flex-start'
    }}>
      <Text style={{
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 14,
        color: '#666666',
        width: 120
      }}>
        {label}
      </Text>
      <Text style={{
        fontFamily: highlight ? 'Urbanist-Bold' : 'Urbanist-Medium',
        fontSize: 14,
        color: highlight ? '#0066FF' : '#1A1A1A',
        flex: 1,
        lineHeight: 20
      }}>
        {value || 'Not specified'}
      </Text>
    </View>
  ), []);

  // Safe data access with fallbacks
  const projectDocuments = rawData.projectDocuments || [];
  const selectedItems = rawData.selectedItems || [];
  const projectType = rawData.projectType || {};
  const description = rawData.description || 'No description provided.';
  const budget = rawData.budget || 'NA';
  const location = rawData.location || 'Not specified';
  const projectName = rawData.name || 'Unnamed Project';
  const status = rawData.status || 'Pending';
  const createdAt = rawData.createdAt || '';
  const clientName = proposalData.client || 'Not specified';
  const designerName = proposalData.designer || 'Not specified';

  // Log ID for debugging
  console.log("Using ID for API:", itemId);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
      <Header 
        title="Proposal Details" 
        showBackButton={true}
        backgroundColor="transparent"
        titleColor="white"
        iconColor="white"
      />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Proposal Header */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <Text style={{
                fontFamily: 'Urbanist-Bold',
                fontSize: 22,
                color: '#1A1A1A',
                flex: 1,
                marginRight: 12,
              }}>
                {projectName}
              </Text>
              <StatusBadge status={status} />
            </View>
            
            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              color: '#666666',
              lineHeight: 22,
              marginBottom: 16,
            }}>
              {description}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#0066FF',
                  marginBottom: 4,
                }}>
                  {designerName}
                </Text>
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 12,
                  color: '#999999',
                }}>
                  Submitted on {formatDate(createdAt)}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: '#E6F0FF',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}>
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 16,
                  color: '#0066FF',
                }}>
                  {budget}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Project Overview */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Project Overview" icon="clipboard" />
          
          <InfoCard>
            <InfoRow label="Project Title" value={projectName} />
            <InfoRow label="Client" value={clientName} highlight />
            <InfoRow label="Designer" value={designerName} />
            <InfoRow label="Location" value={location} />
            <InfoRow label="Project Type" value={projectType.projectTypeName} />
            <InfoRow label="Status" value={status} />
            <InfoRow label="Total Budget" value={budget} highlight />
            <InfoRow label="Date Submitted" value={formatDate(createdAt)} />
            <InfoRow label="Reference ID" value={itemId} highlight />
          </InfoCard>
        </View>

        {/* Project Description */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Project Description" icon="file-text" />
          
          <InfoCard>
            <Text style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 14,
              color: '#1A1A1A',
              lineHeight: 22,
            }}>
              {description}
            </Text>
          </InfoCard>
        </View>

        {/* Attachments */}
        {projectDocuments.length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            <SectionHeader title="Attachments" icon="paperclip" />
            
            <View style={{ marginBottom: 24 }}>
              {projectDocuments.map((doc, index) => (
                <TouchableOpacity 
                  key={doc._id || index}
                  onPress={() => handleDownload(doc)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#0066FF20',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather name={getFileIcon(doc.type)} size={24} color="#0066FF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: 'Urbanist-SemiBold',
                      fontSize: 15,
                      color: '#1A1A1A',
                    }}>
                      Document {index + 1}
                    </Text>
                    <Text style={{
                      fontFamily: 'Urbanist-Regular',
                      fontSize: 13,
                      color: '#999999',
                      marginTop: 2,
                    }}>
                      {doc.type || 'Document'} • {formatDate(doc.uploadDate)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDownload(doc)}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: '#0066FF',
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="download" size={18} color="white" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Additional Information */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader title="Additional Information" icon="info" />
          
          <InfoCard>
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 14,
                color: '#666666',
                marginBottom: 8,
              }}>
                Reference ID
              </Text>
              <Text style={{
                fontFamily: 'Urbanist-Medium',
                fontSize: 14,
                color: '#1A1A1A',
              }}>
                {itemId || 'Not available'}
              </Text>
            </View>
            
            <View>
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 14,
                color: '#666666',
                marginBottom: 8,
              }}>
                Last Updated
              </Text>
              <Text style={{
                fontFamily: 'Urbanist-Medium',
                fontSize: 14,
                color: '#1A1A1A',
              }}>
                {formatDate(rawData.updatedAt) || 'Not available'}
              </Text>
            </View>
          </InfoCard>
        </View>

        {/* Action Buttons */}
        {status === 'Proposal Under Approval' && (
          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            flexDirection: 'row',
            gap: 12
          }}>
            <TouchableOpacity 
              onPress={handleReject}
              style={{
                flex: 1,
                backgroundColor: '#FFE5E5',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                shadowColor: "#FF4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Feather name="x" size={20} color="#FF4444" />
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: '#FF4444',
                marginLeft: 8,
              }}>
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleApprove}  // Use the enhanced approve handler
              style={{
                flex: 1,
                backgroundColor: '#00C896',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: "center",
                shadowColor: "#00C896",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Feather name="check" size={20} color="white" />
              <Text style={{
                fontFamily: 'Urbanist-SemiBold',
                fontSize: 16,
                color: 'white',
                marginLeft: 8,
              }}>
                Approve
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* View Only State */}
       {status !== "Proposal Under Approval" && (
  <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
    <View
      style={{
        backgroundColor: status === "Rejected" ? "#FFE7E7" : "#E6F0FF",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
      }}
    >
      <Feather
        name="eye"
        size={24}
        color={status === "Rejected" ? "#D32F2F" : "#0066FF"}
      />

      <Text
        style={{
          fontFamily: "Urbanist-SemiBold",
          fontSize: 16,
          color: status === "Rejected" ? "#D32F2F" : "#0066FF",
          marginTop: 8,
        }}
      >
        View Only – {status}
      </Text>

      {/* Message */}
      {status === "Rejected" ? (
        <Text
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            color: "#B3261E",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          This proposal was rejected.
          {"\n"}Reason: {proposal?.raw?.rejectionReason || "Not provided"}
        </Text>
      ) : (
        <Text
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            color: "#666666",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          This proposal has already been {status.toLowerCase()}.
        </Text>
      )}
    </View>
  </View>
)}

      </ScrollView>

      {/* Rejection Modal */}
      <RejectionModal 
        visible={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isSubmitting={isSubmitting}
      />
    </View>
  )
}

export default ViewProposal