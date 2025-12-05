// // import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
// // import React, { useState } from 'react'
// // import { Feather } from '@expo/vector-icons'
// // import Header from '../../components/Header'
// // import CustomerBottomNavBar from 'components/CustomerBottomNavBar'

// // const CustomerChooseTemplate = ({ navigation }) => {
// //   const [searchQuery, setSearchQuery] = useState('')
// //   const [selectedTemplate, setSelectedTemplate] = useState(1)

// //   const templates = [
// //     {
// //       id: 1,
// //       title: 'Modern Residential Proposal',
// //       description: 'A comprehensive template for residential construction projects with detailed sections.',
// //       image: 'https://via.placeholder.com/80'
// //     },
// //     {
// //       id: 2,
// //       title: 'Modern Residential Proposal',
// //       description: 'A comprehensive template for residential construction projects with detailed sections.',
// //       image: 'https://via.placeholder.com/80'
// //     },
// //     {
// //       id: 3,
// //       title: 'Modern Residential Proposal',
// //       description: 'A comprehensive template for residential construction projects with detailed sections.',
// //       image: 'https://via.placeholder.com/80'
// //     }
// //   ]

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
// //       <KeyboardAvoidingView 
// //         style={{ flex: 1 }} 
// //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //       >
// //         <View style={{ flex: 1 }}>
// //           <Header 
// //             title="Choose Template" 
// //             showBackButton={true}
// //             backgroundColor="#0066FF"
// //             titleColor="white"
// //             iconColor="white"
// //           />

// //           <ScrollView 
// //             style={{ flex: 1 }}
// //             contentContainerStyle={{ 
// //               paddingBottom: 180, // Increased to clear BottomNavBar + Button
// //               paddingHorizontal: 16 
// //             }}
// //             showsVerticalScrollIndicator={false}
// //             keyboardShouldPersistTaps="handled"
// //           >
// //             {/* Search Bar */}
// //             <View style={{
// //               paddingTop: 16,
// //               paddingBottom: 12
// //             }}>
// //               <View style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'center',
// //                 backgroundColor: 'white',
// //                 borderRadius: 12,
// //                 paddingHorizontal: 12,
// //                 height: 48
// //               }}>
// //                 <Feather name="search" size={20} color="#999999" />
// //                 <TextInput
// //                   style={{
// //                     flex: 1,
// //                     marginLeft: 8,
// //                     fontFamily: 'Urbanist-Regular',
// //                     fontSize: 14,
// //                     color: '#000000'
// //                   }}
// //                   placeholder="Search..."
// //                   placeholderTextColor="#999999"
// //                   value={searchQuery}
// //                   onChangeText={setSearchQuery}
// //                 />
// //               </View>
// //             </View>

// //             {/* Info Text */}
// //             <View style={{
// //               paddingVertical: 12
// //             }}>
// //               <Text style={{
// //                 fontFamily: 'Urbanist-Regular',
// //                 fontSize: 13,
// //                 color: '#666666',
// //                 textAlign: 'center',
// //                 lineHeight: 20
// //               }}>
// //                 Select an admin-created template to start{'\n'}customizing your proposal easily
// //               </Text>
// //             </View>

// //             {/* Templates Section */}
// //             <View style={{ marginTop: 8 }}>
// //               <Text style={{
// //                 fontFamily: 'Urbanist-Bold',
// //                 fontSize: 18,
// //                 color: '#000000',
// //                 marginBottom: 16
// //               }}>
// //                 Templates
// //               </Text>

// //               {/* Template Cards */}
// //               {templates.map((template) => (
// //                 <TouchableOpacity
// //                   key={template.id}
// //                   onPress={() => setSelectedTemplate(template.id)}
// //                   style={{
// //                     backgroundColor: 'white',
// //                     borderRadius: 16,
// //                     padding: 16,
// //                     marginBottom: 16,
// //                     borderLeftWidth: 4,
// //                     borderLeftColor: '#0066FF'
// //                   }}
// //                 >
// //                   {/* Top Row */}
// //                   <View style={{
// //                     flexDirection: 'row',
// //                     alignItems: 'flex-start',
// //                     marginBottom: 12
// //                   }}>
// //                     <View style={{
// //                       width: 80,
// //                       height: 80,
// //                       backgroundColor: '#F5F5F5',
// //                       borderRadius: 8,
// //                       overflow: 'hidden'
// //                     }}>
// //                       <Image
// //                         source={{ uri: template.image }}
// //                         style={{ width: '100%', height: '100%' }}
// //                         resizeMode="cover"
// //                       />
// //                     </View>

// //                     <View style={{
// //                       flex: 1,
// //                       marginLeft: 12,
// //                       marginRight: 8
// //                     }}>
// //                       <Text style={{
// //                         fontFamily: 'Urbanist-Bold',
// //                         fontSize: 15,
// //                         color: '#000000',
// //                         lineHeight: 22
// //                       }}>
// //                         {template.title}
// //                       </Text>
// //                     </View>

// //                     <View style={{
// //                       width: 24,
// //                       height: 24,
// //                       borderRadius: 12,
// //                       borderWidth: 2,
// //                       borderColor: '#0066FF',
// //                       alignItems: 'center',
// //                       justifyContent: 'center',
// //                       marginTop: 2
// //                     }}>
// //                       {selectedTemplate === template.id && (
// //                         <View style={{
// //                           width: 12,
// //                           height: 12,
// //                           borderRadius: 6,
// //                           backgroundColor: '#0066FF'
// //                         }} />
// //                       )}
// //                     </View>
// //                   </View>

// //                   <Text style={{
// //                     fontFamily: 'Urbanist-Regular',
// //                     fontSize: 13,
// //                     color: '#666666',
// //                     lineHeight: 20
// //                   }}>
// //                     {template.description}
// //                   </Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>

// //             {/* Create Proposal Button - Inside ScrollView */}
// //             <TouchableOpacity
// //               onPress={() => navigation.navigate('CustomerCreateProposal')}
// //               style={{
// //                 backgroundColor: '#0066FF',
// //                 borderRadius: 12,
// //                 paddingVertical: 16,
// //                 alignItems: 'center',
// //                 marginTop: 8,
// //                 marginBottom: 24
// //               }}
// //             >
// //               <Text style={{
// //                 fontFamily: 'Urbanist-SemiBold',
// //                 fontSize: 16,
// //                 color: 'white'
// //               }}>
// //                 Create Proposal
// //               </Text>
// //             </TouchableOpacity>
// //           </ScrollView>

// //           {/* Bottom Navigation Bar - Fixed at Bottom */}
// //           <View style={{
// //             position: 'absolute',
// //             bottom: 0,
// //             left: 0,
// //             right: 0,
// //             height: 70, // Adjust based on your BottomNavBar height
// //             backgroundColor: 'white',
// //             borderTopWidth: 1,
// //             borderTopColor: '#E0E0E0'
// //           }}>
            
// //           </View>
// //         </View>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   )
// // }

// // export default CustomerChooseTemplate;



// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { Feather } from '@expo/vector-icons';
// import Header from '../../components/Header';
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const getCategoryColor = (category) => {
//   switch (category.toLowerCase()) {
//     case "residential": return "#0066FF";
//     case "commercial": return "#FF8A00";
//     default: return "#6C63FF";
//   }
// };

// const CustomerChooseTemplate = ({ navigation }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [templates, setTemplates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // 🔵 FETCH TEMPLATES FROM API
//   useEffect(() => {
//     let mounted = true;

//     const fetchTemplates = async () => {
//       setIsLoading(true);
//       try {
//         const token = await AsyncStorage.getItem("userToken");

//         const response = await fetch(
//           "https://skystruct-lite-backend.vercel.app/api/project-types",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && { Authorization: `Bearer ${token}` }),
//             },
//           }
//         );

//         let json = {};
//         try {
//           json = await response.json();
//         } catch (err) {
//           console.warn("Response JSON parse failed", err);
//         }

//         const items = Array.isArray(json) ? json :
//                        Array.isArray(json.data) ? json.data : [];

//         const mapped = items.map((item) => {
//           const rawDate = item.updatedAt || item.createdAt || null;

//           const lastModified = rawDate
//             ? new Date(rawDate).toLocaleString("en-GB", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "";

//           const categoryRaw = item.category || "General";
//           const categoryNormalized = categoryRaw
//             .toString()
//             .toLowerCase()
//             .replace(/\b\w/g, (c) => c.toUpperCase());

//           return {
//             id: item._id || item.id,
//             title: item.name || "Unnamed Template",
//             description: item.description || "",
//             image: item.image || "https://via.placeholder.com/80",
//             category: categoryNormalized,
//             categoryColor: getCategoryColor(categoryNormalized),
//             lastModified,
//           };
//         });

//         if (mounted) setTemplates(mapped);
//       } catch (error) {
//         console.error("Network error fetching proposals:", error);
//         if (mounted) setTemplates([]);
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     fetchTemplates();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <View style={{ flex: 1 }}>
//           <Header
//             title="Choose Template"
//             showBackButton={true}
//             backgroundColor="#0066FF"
//             titleColor="white"
//             iconColor="white"
//           />

//           <ScrollView
//             style={{ flex: 1 }}
//             contentContainerStyle={{
//               paddingBottom: 180,
//               paddingHorizontal: 16,
//             }}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Search Bar */}
//             <View style={{ paddingTop: 16, paddingBottom: 12 }}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   backgroundColor: "white",
//                   borderRadius: 12,
//                   paddingHorizontal: 12,
//                   height: 48,
//                 }}
//               >
//                 <Feather name="search" size={20} color="#999999" />
//                 <TextInput
//                   style={{
//                     flex: 1,
//                     marginLeft: 8,
//                     fontFamily: "Urbanist-Regular",
//                     fontSize: 14,
//                     color: "#000000",
//                   }}
//                   placeholder="Search..."
//                   placeholderTextColor="#999999"
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                 />
//               </View>
//             </View>

//             {/* Info Text */}
//             {/* <View style={{ paddingVertical: 12 }}>
//               <Text
//                 style={{
//                   fontFamily: "Urbanist-Regular",
//                   fontSize: 13,
//                   color: "#666666",
//                   textAlign: "center",
//                   lineHeight: 20,
//                 }}
//               >
//                 Select an admin-created template to start{"\n"}customizing your proposal easily
//               </Text>
//             </View> */}

//             {/* Loader */}
//             {isLoading && (
//               <ActivityIndicator
//                 size="large"
//                 color="#0066FF"
//                 style={{ marginTop: 20 }}
//               />
//             )}

//             {/* Templates */}
//             {!isLoading && templates.length > 0 && (
//               <View style={{ marginTop: 8 }}>
//                 <Text
//                   style={{
//                     fontFamily: "Urbanist-Bold",
//                     fontSize: 18,
//                     color: "#000000",
//                     marginBottom: 16,
//                   }}
//                 >
//                   Templates
//                 </Text>

//                 {templates.map((template) => (
//                   <TouchableOpacity
//                     key={template.id}
//                     onPress={() => setSelectedTemplate(template.id)}
//                     style={{
//                       backgroundColor: "white",
//                       borderRadius: 16,
//                       padding: 16,
//                       marginBottom: 16,
//                       borderLeftWidth: 4,
//                       borderLeftColor: "#0066FF",
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "flex-start",
//                         marginBottom: 12,
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 80,
//                           height: 80,
//                           backgroundColor: "#F5F5F5",
//                           borderRadius: 8,
//                           overflow: "hidden",
//                         }}
//                       >
//                         <Image
//                           source={{ uri: template.image }}
//                           style={{ width: "100%", height: "100%" }}
//                           resizeMode="cover"
//                         />
//                       </View>

//                       <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
//                         <Text
//                           style={{
//                             fontFamily: "Urbanist-Bold",
//                             fontSize: 15,
//                             color: "#000000",
//                             lineHeight: 22,
//                           }}
//                         >
//                           {template.title}
//                         </Text>
//                         <Text
//                           style={{
//                             fontFamily: "Urbanist-Regular",
//                             color: "#666",
//                             fontSize: 12,
//                             marginTop: 4,
//                           }}
//                         >
//                           Category: {template.category}
//                         </Text>

//                         <Text
//                           style={{
//                             fontFamily: "Urbanist-Regular",
//                             color: "#999",
//                             fontSize: 11,
//                             marginTop: 2,
//                           }}
//                         >
//                           Last Modified: {template.lastModified}
//                         </Text>
//                       </View>

//                       <View
//                         style={{
//                           width: 24,
//                           height: 24,
//                           borderRadius: 12,
//                           borderWidth: 2,
//                           borderColor: "#0066FF",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           marginTop: 2,
//                         }}
//                       >
//                         {selectedTemplate === template.id && (
//                           <View
//                             style={{
//                               width: 12,
//                               height: 12,
//                               borderRadius: 6,
//                               backgroundColor: "#0066FF",
//                             }}
//                           />
//                         )}
//                       </View>
//                     </View>

//                     <Text
//                       style={{
//                         fontFamily: "Urbanist-Regular",
//                         fontSize: 13,
//                         color: "#666666",
//                         lineHeight: 20,
//                       }}
//                     >
//                       {template.description}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* Create Proposal Button */}
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate("CustomerCreateProposal", {
//                   templateId: selectedTemplate,
//                 })
//               }
//               style={{
//                 backgroundColor: "#0066FF",
//                 borderRadius: 12,
//                 paddingVertical: 16,
//                 alignItems: "center",
//                 marginTop: 8,
//                 marginBottom: 24,
//               }}
//               disabled={!selectedTemplate}
//             >
//               <Text
//                 style={{
//                   fontFamily: "Urbanist-SemiBold",
//                   fontSize: 16,
//                   color: "white",
//                 }}
//               >
//                 Create Proposal
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>

//           {/* Empty Bottom Bar */}
//           <View
//             style={{
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: 70,
//               backgroundColor: "white",
//               borderTopWidth: 1,
//               borderTopColor: "#E0E0E0",
//             }}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default CustomerChooseTemplate;

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.BASE_API_URL}`;

const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case "residential": return { primary: "#0066FF", light: "#E6F0FF" };
    case "commercial": return { primary: "#FF8A00", light: "#FFF3E6" };
    default: return { primary: "#6C63FF", light: "#F0EEFF" };
  }
};

const CustomerChooseTemplate = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await fetch(
          `${API_URL}/api/project-types`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        let json = {};
        try {
          json = await response.json();
        } catch (err) {
          console.warn("Response JSON parse failed", err);
        }

        const items = Array.isArray(json) ? json :
                       Array.isArray(json.data) ? json.data : [];

        const mapped = items.map((item) => {
          const rawDate = item.updatedAt || item.createdAt || null;

          const lastModified = rawDate
            ? new Date(rawDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          const categoryRaw = item.category || "General";
          const categoryNormalized = categoryRaw
            .toString()
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            id: item._id || item.id,
            title: item.name || "Unnamed Template",
            description: item.description || "",
            image: item.image || "https://via.placeholder.com/80",
            category: categoryNormalized,
            categoryColors: getCategoryColor(categoryNormalized),
            lastModified,
          };
        });

        if (mounted) setTemplates(mapped);
      } catch (error) {
        console.error("Network error fetching proposals:", error);
        if (mounted) setTemplates([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTemplates();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <Header
            title="Choose Template"
            showBackButton={true}
            backgroundColor="#0066FF"
            titleColor="white"
            iconColor="white"
          />

          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {/* Subtitle */}
            <Text style={{
              fontFamily: "Urbanist-Regular",
              fontSize: 14,
              color: "#5F6368",
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 16,
            }}>
              Select a professionally crafted template to kickstart your proposal
            </Text>

            {/* Modern Search Bar */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 52,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
              borderWidth: 1,
              borderColor: '#F0F0F0',
            }}>
              <Feather name="search" size={22} color="#0066FF" />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontFamily: "Urbanist-Medium",
                  fontSize: 15,
                  color: "#1A1A1A",
                }}
                placeholder="Search templates..."
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={20} color="#999999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: 100,
              paddingHorizontal: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Loader */}
            {isLoading && (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <ActivityIndicator size="large" color="#0066FF" />
                <Text style={{
                  fontFamily: "Urbanist-Medium",
                  fontSize: 14,
                  color: "#666666",
                  marginTop: 12,
                }}>
                  Loading templates...
                </Text>
              </View>
            )}

            {/* Templates Grid */}
            {!isLoading && filteredTemplates.length > 0 && (
              <View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Text style={{
                    fontFamily: "Urbanist-Bold",
                    fontSize: 20,
                    color: "#1A1A1A",
                  }}>
                    Available Templates
                  </Text>
                  <View style={{
                    backgroundColor: '#E6F0FF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}>
                    <Text style={{
                      fontFamily: "Urbanist-SemiBold",
                      fontSize: 13,
                      color: "#0066FF",
                    }}>
                      {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
                    </Text>
                  </View>
                </View>

                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <TouchableOpacity
                      key={template.id}
                      onPress={() => setSelectedTemplate(template.id)}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 16,
                        marginBottom: 16,
                        borderWidth: 2,
                        borderColor: isSelected ? '#0066FF' : 'transparent',
                        shadowColor: isSelected ? "#0066FF" : "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isSelected ? 0.2 : 0.08,
                        shadowRadius: isSelected ? 12 : 8,
                        elevation: isSelected ? 8 : 3,
                        transform: [{ scale: isSelected ? 1 : 1 }],
                      }}
                    >
                      <View style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginBottom: 14,
                      }}>
                        {/* Template Image */}
                        <View style={{
                          width: 90,
                          height: 90,
                          backgroundColor: "#F5F7FA",
                          borderRadius: 16,
                          overflow: "hidden",
                          borderWidth: 1,
                          borderColor: '#E8ECF0',
                        }}>
                          <Image
                            source={{ uri: template.image }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        </View>

                        {/* Template Info */}
                        <View style={{ flex: 1, marginLeft: 14, marginRight: 8 }}>
                          <Text style={{
                            fontFamily: "Urbanist-Bold",
                            fontSize: 16,
                            color: "#1A1A1A",
                            lineHeight: 24,
                            marginBottom: 6,
                          }}>
                            {template.title}
                          </Text>

                          {/* Category Badge */}
                          <View style={{
                            backgroundColor: template.categoryColors.light,
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 8,
                            marginBottom: 6,
                          }}>
                            <Text style={{
                              fontFamily: "Urbanist-SemiBold",
                              color: template.categoryColors.primary,
                              fontSize: 12,
                            }}>
                              {template.category}
                            </Text>
                          </View>

                          {/* Last Modified */}
                         
                        </View>

                        {/* Selection Indicator */}
                        <View style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          borderWidth: 2.5,
                          borderColor: isSelected ? '#0066FF' : '#D0D5DD',
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isSelected ? '#0066FF' : 'white',
                        }}>
                          {isSelected && (
                            <Feather name="check" size={16} color="white" />
                          )}
                        </View>
                      </View>

                      {/* Description */}
                      <Text style={{
                        fontFamily: "Urbanist-Regular",
                        fontSize: 13,
                        color: "#5F6368",
                        lineHeight: 20,
                      }}>
                        {template.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* No Results */}
            {!isLoading && filteredTemplates.length === 0 && templates.length > 0 && (
              <View style={{
                alignItems: 'center',
                paddingTop: 60,
                paddingHorizontal: 20,
              }}>
                <Feather name="search" size={64} color="#D0D5DD" />
                <Text style={{
                  fontFamily: "Urbanist-SemiBold",
                  fontSize: 18,
                  color: "#1A1A1A",
                  marginTop: 20,
                  marginBottom: 8,
                }}>
                  No templates found
                </Text>
                <Text style={{
                  fontFamily: "Urbanist-Regular",
                  fontSize: 14,
                  color: "#666666",
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  Try adjusting your search to find what you're looking for
                </Text>
              </View>
            )}

            {/* Empty State */}
            {!isLoading && templates.length === 0 && (
              <View style={{
                alignItems: 'center',
                paddingTop: 60,
                paddingHorizontal: 20,
              }}>
                <Feather name="file-text" size={64} color="#D0D5DD" />
                <Text style={{
                  fontFamily: "Urbanist-SemiBold",
                  fontSize: 18,
                  color: "#1A1A1A",
                  marginTop: 20,
                  marginBottom: 8,
                }}>
                  No templates available
                </Text>
                <Text style={{
                  fontFamily: "Urbanist-Regular",
                  fontSize: 14,
                  color: "#666666",
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  Templates will appear here once they're created by administrators
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button */}
          {!isLoading && filteredTemplates.length > 0 && (
            <View style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: Platform.OS === 'ios' ? 24 : 16,
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0',
              shadowColor: "#f3f3f3ff",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 10,
            }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CreateProposalScreen", {
                    templateId: selectedTemplate,
                  })
                }
                disabled={!selectedTemplate}
                activeOpacity={0.8}
                style={{
                  backgroundColor: selectedTemplate ? "#0066FF" : "#D0D5DD",
                  borderRadius: 16,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: selectedTemplate ? "#0066FF" : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: selectedTemplate ? 4 : 0,
                }}
              >
                <Feather 
                  name="plus-circle" 
                  size={20} 
                  color="white" 
                  style={{ marginRight: 8 }}
                />
                <Text style={{
                  fontFamily: "Urbanist-Bold",
                  fontSize: 16,
                  color: "white",
                }}>
                  {selectedTemplate ? 'Create Proposal' : 'Select a Template'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomerChooseTemplate;