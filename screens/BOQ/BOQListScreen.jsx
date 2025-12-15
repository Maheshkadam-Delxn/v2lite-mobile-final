
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   Dimensions,
// //   Platform,
// // } from "react-native";
// // import React, { useEffect, useState } from "react";
// // import Header from "../../components/Header";
// // import { Feather } from "@expo/vector-icons";
// // import { LinearGradient } from "expo-linear-gradient";

// // const { width } = Dimensions.get("window");
// // const isSmallDevice = width < 375;
// // const isMediumDevice = width >= 375 && width < 768;
// // const isTablet = width >= 768;

// // export default function BOQListScreen({ navigation }) {
// //   const [boqList, setBoqList] = useState([]);

// //   useEffect(() => {
// //     // 🔵 Dummy data for testing UI
// //     setBoqList([
// //       {
// //         _id: "boq_001",
// //         title: "BOQ Draft - Phase 1",
// //         builtUpArea: 3500,
// //         status: "draft",
// //         createdAt: "2025-02-10",
// //         itemCount: 24,
// //       },
// //       {
// //         _id: "boq_002",
// //         title: "BOQ Final - Main Structure",
// //         builtUpArea: 4200,
// //         status: "final",
// //         createdAt: "2025-02-12",
// //         itemCount: 38,
// //       },
// //       {
// //         _id: "boq_003",
// //         title: "BOQ - Electrical Works",
// //         builtUpArea: 2800,
// //         status: "draft",
// //         createdAt: "2025-02-15",
// //         itemCount: 16,
// //       },
// //     ]);
// //   }, []);

// //   const renderStatus = (status) => {
// //     const statusConfig = {
// //       final: {
// //         color: "#10B981",
// //         bg: "#D1FAE5",
// //         icon: "check-circle",
// //       },
// //       draft: {
// //         color: "#F59E0B",
// //         bg: "#FEF3C7",
// //         icon: "edit-3",
// //       },
// //       pending: {
// //         color: "#6B7280",
// //         bg: "#F3F4F6",
// //         icon: "clock",
// //       },
// //     };

// //     const config = statusConfig[status] || statusConfig.pending;

// //     return (
// //       <View
// //         style={{
// //           backgroundColor: config.bg,
// //           paddingHorizontal: isSmallDevice ? 8 : 12,
// //           paddingVertical: isSmallDevice ? 4 : 6,
// //           borderRadius: 20,
// //           flexDirection: "row",
// //           alignItems: "center",
// //           gap: 4,
// //         }}
// //       >
// //         <Feather name={config.icon} size={12} color={config.color} />
// //         <Text
// //           style={{
// //             fontFamily: "Urbanist-SemiBold",
// //             fontSize: isSmallDevice ? 11 : 12,
// //             color: config.color,
// //             letterSpacing: 0.5,
// //           }}
// //         >
// //           {status.toUpperCase()}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   const EmptyState = () => (
// //     <View
// //       style={{
// //         marginTop: isTablet ? 100 : 80,
// //         alignItems: "center",
// //         paddingHorizontal: 20,
// //       }}
// //     >
// //       <View
// //         style={{
// //           width: isTablet ? 120 : 100,
// //           height: isTablet ? 120 : 100,
// //           borderRadius: isTablet ? 60 : 50,
// //           backgroundColor: "#F3F4F6",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           marginBottom: 24,
// //         }}
// //       >
// //         <Feather name="clipboard" size={isTablet ? 50 : 40} color="#9CA3AF" />
// //       </View>
// //       <Text
// //         style={{
// //           fontFamily: "Urbanist-Bold",
// //           fontSize: isTablet ? 24 : 20,
// //           color: "#111827",
// //           marginBottom: 12,
// //         }}
// //       >
// //         No BOQs Created Yet
// //       </Text>
// //       <Text
// //         style={{
// //           fontFamily: "Urbanist-Regular",
// //           fontSize: isTablet ? 16 : 14,
// //           color: "#6B7280",
// //           textAlign: "center",
// //           lineHeight: 22,
// //           maxWidth: 320,
// //         }}
// //       >
// //         Start by creating your first Bill of Quantities to manage project costs
// //         and materials efficiently.
// //       </Text>
// //       <TouchableOpacity
// //         style={{
// //           marginTop: 32,
// //           backgroundColor: "#0066FF",
// //           paddingHorizontal: 32,
// //           paddingVertical: 16,
// //           borderRadius: 16,
// //           flexDirection: "row",
// //           alignItems: "center",
// //           gap: 8,
// //           ...Platform.select({
// //             ios: {
// //               shadowColor: "#0066FF",
// //               shadowOffset: { width: 0, height: 4 },
// //               shadowOpacity: 0.3,
// //               shadowRadius: 8,
// //             },
// //             android: {
// //               elevation: 6,
// //             },
// //           }),
// //         }}
// //         onPress={() => navigation.navigate("CreateBOQDraftScreen")}
// //       >
// //         <Feather name="plus" size={20} color="white" />
// //         <Text
// //           style={{
// //             fontFamily: "Urbanist-Bold",
// //             fontSize: 16,
// //             color: "white",
// //           }}
// //         >
// //           Create First BOQ
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   return (
// //     <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
     

// //       <ScrollView
// //         style={{ flex: 1 }}
// //         contentContainerStyle={{
// //           paddingHorizontal: isTablet ? 30 : 15,
// //           paddingTop: 24,
// //           paddingBottom: 120,
// //         }}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Header Section */}
// //         <View
// //           style={{
// //             marginBottom: 28,
// //           }}
// //         >
// //           <View
// //             style={{
// //               flexDirection: isSmallDevice ? "column" : "row",
// //               justifyContent: "space-between",
// //               alignItems: isSmallDevice ? "flex-start" : "center",
// //               gap: isSmallDevice ? 16 : 0,
// //             }}
// //           >
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{
// //                   fontFamily: "Urbanist-Bold",
// //                   fontSize: isTablet ? 32 : isSmallDevice ? 18 : 26,
// //                   color: "#111827",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 Bill of Quantities
// //               </Text>
// //               <Text
// //                 style={{
// //                   fontFamily: "Urbanist-Regular",
// //                   fontSize: isTablet ? 10 : 12,
// //                   color: "#6B7280",
// //                   lineHeight: 20,
// //                 }}
// //               >
// //                 Manage and track all project BOQs
// //               </Text>
// //             </View>

// //             {/* Add New BOQ Button */}
// //             <TouchableOpacity
// //               style={{
// //                 backgroundColor: "#0066FF",
// //                 paddingHorizontal: isSmallDevice ? 12 : 20,
// //                 paddingVertical: isSmallDevice ? 10 : 14,
// //                 borderRadius: 14,
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 gap: 8,
// //                 ...Platform.select({
// //                   ios: {
// //                     shadowColor: "#0066FF",
// //                     shadowOffset: { width: 0, height: 4 },
// //                     shadowOpacity: 0.25,
// //                     shadowRadius: 8,
// //                   },
// //                   android: {
// //                     elevation: 5,
// //                   },
// //                 }),
// //               }}
// //               onPress={() => navigation.navigate("CreateBOQDraftScreen")}
// //               activeOpacity={0.8}
// //             >
// //               <Feather name="plus" size={14} color="white" />
// //               <Text
// //                 style={{
// //                   fontFamily: "Urbanist-Bold",
// //                   fontSize: isSmallDevice ? 12 : 15,
// //                   color: "white",
// //                   letterSpacing: 0.2,
// //                 }}
// //               >
// //                 New BOQ
// //               </Text>
// //             </TouchableOpacity>
// //           </View>

          
// //         </View>

// //         {/* BOQ Cards */}
// //         <View style={{ gap: 16 }}>
// //           {boqList.map((boq, index) => (
// //             <TouchableOpacity
// //               key={boq._id}
// //               style={{
// //                 backgroundColor: "white",
// //                 borderRadius: 20,
// //                 padding: isTablet ? 24 : 20,
// //                 borderWidth: 1,
// //                 borderColor: "#E5E7EB",
// //                 ...Platform.select({
// //                   ios: {
// //                     shadowColor: "#000",
// //                     shadowOffset: { width: 0, height: 2 },
// //                     shadowOpacity: 0.05,
// //                     shadowRadius: 8,
// //                   },
// //                   android: {
// //                     elevation: 2,
// //                   },
// //                 }),
// //               }}
// //               onPress={() =>
// //                 navigation.navigate("BOQDetailScreen", { boqData: boq })
// //               }
// //               activeOpacity={0.7}
// //             >
// //               {/* Header Row */}
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   alignItems: "flex-start",
// //                   marginBottom: 16,
// //                   gap: 12,
// //                 }}
// //               >
// //                 <View style={{ flex: 1 }}>
// //                   <Text
// //                     style={{
// //                       fontFamily: "Urbanist-Bold",
// //                       fontSize: isTablet ? 20 : 18,
// //                       color: "#111827",
// //                       marginBottom: 4,
// //                     }}
// //                     numberOfLines={2}
// //                   >
// //                     {boq.title}
// //                   </Text>
// //                 </View>
// //                 {renderStatus(boq.status)}
// //               </View>

// //               {/* Info Grid */}
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   flexWrap: "wrap",
// //                   gap: 16,
// //                   marginBottom: 16,
// //                 }}
// //               >
// //                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
// //                   <View
// //                     style={{
// //                       width: 40,
// //                       height: 40,
// //                       borderRadius: 12,
// //                       backgroundColor: "#EFF6FF",
// //                       justifyContent: "center",
// //                       alignItems: "center",
// //                     }}
// //                   >
// //                     <Feather name="maximize" size={18} color="#0066FF" />
// //                   </View>
// //                   <View>
// //                     <Text
// //                       style={{
// //                         fontFamily: "Urbanist-Regular",
// //                         fontSize: 12,
// //                         color: "#9CA3AF",
// //                       }}
// //                     >
// //                       Built-up Area
// //                     </Text>
// //                     <Text
// //                       style={{
// //                         fontFamily: "Urbanist-Bold",
// //                         fontSize: 15,
// //                         color: "#111827",
// //                       }}
// //                     >
// //                       {boq.builtUpArea.toLocaleString()} sqft
// //                     </Text>
// //                   </View>
// //                 </View>

// //                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
// //                   <View
// //                     style={{
// //                       width: 40,
// //                       height: 40,
// //                       borderRadius: 12,
// //                       backgroundColor: "#F0FDF4",
// //                       justifyContent: "center",
// //                       alignItems: "center",
// //                     }}
// //                   >
// //                     <Feather name="list" size={18} color="#10B981" />
// //                   </View>
// //                   <View>
// //                     <Text
// //                       style={{
// //                         fontFamily: "Urbanist-Regular",
// //                         fontSize: 12,
// //                         color: "#9CA3AF",
// //                       }}
// //                     >
// //                       Items
// //                     </Text>
// //                     <Text
// //                       style={{
// //                         fontFamily: "Urbanist-Bold",
// //                         fontSize: 15,
// //                         color: "#111827",
// //                       }}
// //                     >
// //                       {boq.itemCount} items
// //                     </Text>
// //                   </View>
// //                 </View>
// //               </View>

// //               {/* Footer Row */}
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                   paddingTop: 16,
// //                   borderTopWidth: 1,
// //                   borderTopColor: "#F3F4F6",
// //                 }}
// //               >
// //                 <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
// //                   <Feather name="calendar" size={14} color="#9CA3AF" />
// //                   <Text
// //                     style={{
// //                       fontFamily: "Urbanist-Regular",
// //                       fontSize: 13,
// //                       color: "#6B7280",
// //                     }}
// //                   >
// //                     {new Date(boq.createdAt).toLocaleDateString("en-US", {
// //                       month: "short",
// //                       day: "numeric",
// //                       year: "numeric",
// //                     })}
// //                   </Text>
// //                 </View>

// //                 <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
// //                   <Text
// //                     style={{
// //                       fontFamily: "Urbanist-SemiBold",
// //                       fontSize: 13,
// //                       color: "#0066FF",
// //                     }}
// //                   >
// //                     View Details
// //                   </Text>
// //                   <Feather name="arrow-right" size={16} color="#0066FF" />
// //                 </View>
// //               </View>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Empty State */}
// //         {boqList.length === 0 && <EmptyState />}
// //       </ScrollView>
// //     </View>
// //   );
// // }

// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Feather } from "@expo/vector-icons";
// import { useNavigation } from '@react-navigation/native';
// const { width } = Dimensions.get("window");
// const isSmallDevice = width < 375;
// const isMediumDevice = width >= 375 && width < 768;
// const isTablet = width >= 768;

// export default function BOQListScreen({ navigation: navProp ,project }) {

   
//     console.log("this is me",project);
//   const [boqList, setBoqList] = useState([]);
//     const navigationHook = useNavigation();
//   const navigation = navProp || navigationHook;

//   useEffect(() => {
//     setBoqList([
//       {
//         _id: "boq_001",
//         title: "BOQ Draft - Phase 1",
//         builtUpArea: 3500,
//         status: "draft",
//         createdAt: "2025-02-10",
//         itemCount: 24,
//       },
//       {
//         _id: "boq_002",
//         title: "BOQ Final - Main Structure",
//         builtUpArea: 4200,
//         status: "final",
//         createdAt: "2025-02-12",
//         itemCount: 38,
//       },
//       {
//         _id: "boq_003",
//         title: "BOQ - Electrical Works",
//         builtUpArea: 2800,
//         status: "draft",
//         createdAt: "2025-02-15",
//         itemCount: 16,
//       },
//     ]);
//   }, []);

//   const renderStatus = (status) => {
//     const statusConfig = {
//       final: {
//         color: "#10B981",
//         bg: "#D1FAE5",
//         icon: "check-circle",
//       },
//       draft: {
//         color: "#F59E0B",
//         bg: "#FEF3C7",
//         icon: "edit-3",
//       },
//       pending: {
//         color: "#6B7280",
//         bg: "#F3F4F6",
//         icon: "clock",
//       },
//     };

//     const config = statusConfig[status] || statusConfig.pending;

//     return (
//       <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
//         <Feather name={config.icon} size={12} color={config.color} />
//         <Text style={[styles.statusText, { color: config.color }]}>
//           {status.toUpperCase()}
//         </Text>
//       </View>
//     );
//   };

//   const EmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <View style={styles.emptyIcon}>
//         <Feather name="clipboard" size={isTablet ? 50 : 40} color="#9CA3AF" />
//       </View>
//       <Text style={styles.emptyTitle}>No BOQs Created Yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Start by creating your first Bill of Quantities to manage project costs
//         and materials efficiently.
//       </Text>
//       <TouchableOpacity
//         style={styles.emptyButton}
//         onPress={() => navigation.navigate("BOQcreateScreen")}
//       >
//         <Feather name="plus" size={20} color="white" />
//         <Text style={styles.emptyButtonText}>Create First BOQ</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header Section - Fixed positioning */}
//       <View style={styles.headerContainer}>
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.headerTitle}>Bill of Quantities</Text>
//             <Text style={styles.headerSubtitle}>
//               Manage and track all project BOQs
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.newButton}
//             onPress={() => navigation.navigate("BOQcreateScreen",{project})}
//             activeOpacity={0.8}
//           >
//             <Feather name="plus" size={14} color="white" />
//             <Text style={styles.newButtonText}>New BOQ</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Content */}
//       <ScrollView
//         style={styles.content}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* BOQ Cards */}
//         <View style={styles.cardsContainer}>
//           {boqList.map((boq) => (
//             <TouchableOpacity
//               key={boq._id}
//               style={styles.card}
//               onPress={() =>
//                 navigation.navigate("BOQDetailScreen", { boqData: boq })
//               }
//               activeOpacity={0.7}
//             >
//               {/* Header Row */}
//               <View style={styles.cardHeader}>
//                 <View style={styles.cardTitleContainer}>
//                   <Text style={styles.cardTitle} numberOfLines={2}>
//                     {boq.title}
//                   </Text>
//                 </View>
//                 {renderStatus(boq.status)}
//               </View>

//               {/* Info Grid */}
//               <View style={styles.infoGrid}>
//                 <View style={styles.infoItem}>
//                   <View style={styles.infoIcon}>
//                     <Feather name="maximize" size={18} color="#0066FF" />
//                   </View>
//                   <View>
//                     <Text style={styles.infoLabel}>Built-up Area</Text>
//                     <Text style={styles.infoValue}>
//                       {boq.builtUpArea.toLocaleString()} sqft
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.infoItem}>
//                   <View style={styles.infoIcon}>
//                     <Feather name="list" size={18} color="#10B981" />
//                   </View>
//                   <View>
//                     <Text style={styles.infoLabel}>Items</Text>
//                     <Text style={styles.infoValue}>{boq.itemCount} items</Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Footer Row */}
//               <View style={styles.cardFooter}>
//                 <View style={styles.dateContainer}>
//                   <Feather name="calendar" size={14} color="#9CA3AF" />
//                   <Text style={styles.dateText}>
//                     {new Date(boq.createdAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </View>

//                 <View style={styles.viewDetails}>
//                   <Text style={styles.viewDetailsText}>View Details</Text>
//                   <Feather name="arrow-right" size={16} color="#0066FF" />
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Empty State */}
//         {boqList.length === 0 && <EmptyState />}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   headerContainer: {
//     backgroundColor: "white",
//     paddingHorizontal: isTablet ? 30 : 15,
//     paddingTop: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: isTablet ? 32 : isSmallDevice ? 20 : 26,
//     color: "#111827",
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontFamily: "Urbanist-Regular",
//     fontSize: isTablet ? 14 : 12,
//     color: "#6B7280",
//     lineHeight: 20,
//   },
//   newButton: {
//     backgroundColor: "#0066FF",
//     paddingHorizontal: isSmallDevice ? 16 : 20,
//     paddingVertical: isSmallDevice ? 10 : 12,
//     borderRadius: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     minWidth: 100,
//     marginLeft: 16,
//   },
//   newButtonText: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: isSmallDevice ? 12 : 14,
//     color: "white",
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: isTablet ? 30 : 15,
//     paddingTop: 24,
//     paddingBottom: 40,
//   },
//   cardsContainer: {
//     gap: 16,
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: isTablet ? 24 : 20,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 16,
//   },
//   cardTitleContainer: {
//     flex: 1,
//     marginRight: 12,
//   },
//   cardTitle: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: isTablet ? 20 : 18,
//     color: "#111827",
//     lineHeight: 24,
//   },
//   statusBadge: {
//     paddingHorizontal: isSmallDevice ? 8 : 12,
//     paddingVertical: isSmallDevice ? 4 : 6,
//     borderRadius: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     flexShrink: 0,
//   },
//   statusText: {
//     fontFamily: "Urbanist-SemiBold",
//     fontSize: isSmallDevice ? 11 : 12,
//     letterSpacing: 0.5,
//   },
//   infoGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 16,
//     marginBottom: 16,
//   },
//   infoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   infoIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   infoLabel: {
//     fontFamily: "Urbanist-Regular",
//     fontSize: 12,
//     color: "#9CA3AF",
//   },
//   infoValue: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: 15,
//     color: "#111827",
//   },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//   },
//   dateContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   dateText: {
//     fontFamily: "Urbanist-Regular",
//     fontSize: 13,
//     color: "#6B7280",
//   },
//   viewDetails: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   viewDetailsText: {
//     fontFamily: "Urbanist-SemiBold",
//     fontSize: 13,
//     color: "#0066FF",
//   },
//   emptyContainer: {
//     marginTop: isTablet ? 80 : 60,
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   emptyIcon: {
//     width: isTablet ? 120 : 100,
//     height: isTablet ? 120 : 100,
//     borderRadius: isTablet ? 60 : 50,
//     backgroundColor: "#F3F4F6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   emptyTitle: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: isTablet ? 24 : 20,
//     color: "#111827",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontFamily: "Urbanist-Regular",
//     fontSize: isTablet ? 16 : 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 22,
//     maxWidth: 320,
//     marginBottom: 32,
//   },
//   emptyButton: {
//     backgroundColor: "#0066FF",
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   emptyButtonText: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: 16,
//     color: "white",
//   },
// });


import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const API_URL = `${process.env.BASE_API_URL}`;

export default function BOQListScreen({ navigation: navProp, project }) {
  const navigationHook = useNavigation();
  const navigation = navProp || navigationHook;

  const [boqList, setBoqList] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------
  // 📌 Fetch BOQs from backend
  // -------------------------------------------------------------------
  const fetchBOQs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const res = await fetch(
        `${API_URL}/api/boq?projectId=${project._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setBoqList(json.data);
      } else {
        console.log("Error fetching BOQs", json.message);
      }
    } catch (err) {
      console.log("BOQ FETCH ERROR →", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBOQs();
  }, [project]);

  // -------------------------------------------------------------------
  // 📌 Status Badge Renderer
  // -------------------------------------------------------------------
  const renderStatus = (status) => {
    const statusConfig = {
      approved: { color: "#10B981", bg: "#D1FAE5", icon: "check-circle" },
      draft: { color: "#F59E0B", bg: "#FEF3C7", icon: "edit-3" },
      pending: { color: "#6B7280", bg: "#F3F4F6", icon: "clock" },
      rejected: { color: "#EF4444", bg: "#FEE2E2", icon: "x-circle" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Feather name={config.icon} size={12} color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    );
  };

  // -------------------------------------------------------------------
  // 📌 Empty State UI
  // -------------------------------------------------------------------
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Feather name="clipboard" size={isTablet ? 50 : 40} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No BOQs Available</Text>
      <Text style={styles.emptySubtitle}>
        Start by creating a BOQ for this project.
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("BOQcreateScreen", { project })}
      >
        <Feather name="plus" size={20} color="white" />
        <Text style={styles.emptyButtonText}>Create BOQ</Text>
      </TouchableOpacity>
    </View>
  );

  // -------------------------------------------------------------------
  // 📌 MAIN RENDER
  // -------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Bill of Quantities</Text>
            <Text style={styles.headerSubtitle}>
              Manage all BOQs for this project
            </Text>
          </View>

          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate("BOQcreateScreen", { project })}
          >
            <Feather name="plus" size={14} color="white" />
            <Text style={styles.newButtonText}>New BOQ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loader */}
      {loading && (
        <View style={{ paddingTop: 50 }}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      )}

      {/* Content */}
      {!loading && (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {boqList.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={styles.cardsContainer}>
              {boqList.map((boq) => (
                <TouchableOpacity
                  key={boq._id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("BOQdetailsScreen", { boqData: boq })
                  }
                >
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {boq.boqName || "BOQ Draft"}
                    </Text>
                    {renderStatus(boq.status)}
                  </View>

                  {/* Info */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <Feather name="maximize" size={18} color="#0066FF" />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Built-up Area</Text>
                        <Text style={styles.infoValue}>
                          {boq.builtUpArea} sqft
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoItem}>
                      <View style={styles.infoIcon}>
                        <Feather name="list" size={18} color="#10B981" />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>Materials</Text>
                        <Text style={styles.infoValue}>
                          {boq.materials?.length || 0} items
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <View style={styles.dateContainer}>
                      <Feather name="calendar" size={14} color="#9CA3AF" />
                      <Text style={styles.dateText}>
                        {new Date(boq.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.viewDetails}>
                      <Text style={styles.viewDetailsText}>View Details</Text>
                      <Feather name="arrow-right" size={16} color="#0066FF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// -------------------------------------------------------------------
// 📌 STYLES
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom:16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 26, fontFamily: "Urbanist-Bold", color: "#111827" },
  headerSubtitle: { fontSize: 14, color: "#6B7280" },

  newButton: {
    backgroundColor: "#0066FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newButtonText: { color: "white", fontFamily: "Urbanist-Bold" },

  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  cardsContainer: { gap: 16 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 18, fontFamily: "Urbanist-Bold", color: "#111827", flex: 1, marginRight: 10 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: { fontSize: 11, fontFamily: "Urbanist-SemiBold" },

  infoGrid: { flexDirection: "row", gap: 16, marginVertical: 16 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: { fontSize: 12, color: "#9CA3AF" },
  infoValue: { fontSize: 15, fontFamily: "Urbanist-Bold" },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dateContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateText: { fontSize: 13, color: "#6B7280" },

  viewDetails: { flexDirection: "row", alignItems: "center", gap: 6 },
  viewDetailsText: { color: "#0066FF", fontFamily: "Urbanist-SemiBold" },

  emptyContainer: { marginTop: 80, alignItems: "center" },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontFamily: "Urbanist-Bold", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 20 },
  emptyButton: {
    backgroundColor: "#0066FF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emptyButtonText: { color: "white", fontSize: 16, fontFamily: "Urbanist-Bold" },
});
