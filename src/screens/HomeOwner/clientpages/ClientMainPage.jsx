// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   RefreshControl,
// //   ActivityIndicator,
// //   Alert,
// //   StyleSheet,
// // } from "react-native";

// // import React, { useState, useEffect, useRef } from "react";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { Ionicons } from "@expo/vector-icons";
// // import Swipeable from "react-native-gesture-handler/Swipeable";
// // import { GestureHandlerRootView } from "react-native-gesture-handler";
// // import Header from "components/Header";

// // //const CLIENT_API_URL ="https://skystruct-lite-backend.vercel.app/api/client/projects";

// // const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;

// // export default function ClientMainPage({ navigation }) {
// //   const [dataList, setDataList] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const openSwipeRefs = useRef(new Map());

// //   // ===============================
// //   // Fetch Data
// //   // ===============================
// //   const fetchData = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("userToken");
// //       setIsLoading(true);

// //       const response = await fetch(CLIENT_API_URL, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       const json = await response.json();
// //       const dd = await AsyncStorage.getItem("userData");
// //       console.log("adsf", dd);
// //       const list = Array.isArray(json.data) ? json.data : [];


// //       const aa = dd ? JSON.parse(dd) : null;

// //       if (!aa?.id) {
// //         console.log("No user ID found");
// //       }


// //       // 1️⃣ Get user data once
// // const stored = await AsyncStorage.getItem("userData");
// // const user = stored ? JSON.parse(stored) : null;

// // if (!user) {
// //   console.log("⚠ No user found in storage");
// //   return;
// // }

// // const loggedInId = String(user.id);
// // const loggedInEmail = user.email;

// // console.log("Logged in ID:", loggedInId);
// // console.log("Logged in Email:", loggedInEmail);

// // // 2️⃣ Filter list with BOTH conditions
// // const filteredList = list.filter((item) => {
// //   const createdBy = item?.createdBy ? String(item.createdBy) : null;
// //   const clientEmail = item?.clientEmail;

// //   const matchByCreator = createdBy === loggedInId;
// //   const matchByEmail = clientEmail === loggedInEmail;

// //   console.log("--------- CHECKING PROJECT ---------");
// //   console.log("DB createdBy:", createdBy);
// //   console.log("DB clientEmail:", clientEmail);
// //   console.log("MATCH createdBy? ->", matchByCreator);
// //   console.log("MATCH email? ->", matchByEmail);

// //   // Keep item if ANY condition matches
// //   return matchByCreator || matchByEmail;
// // });

// // console.log("🎉 Final Filtered List:", filteredList);





// //       setDataList(filteredList);
// //     } catch (err) {
// //       console.log("Fetch Error:", err);
// //     } finally {
// //       setIsLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const onRefresh = () => {
// //     setRefreshing(true);
// //     fetchData();
// //   };

// //   // ===============================
// //   // Delete Item
// //   // ===============================
// //   const deleteItem = async (id) => {
// //     try {
// //       openSwipeRefs.current.get(id)?.close();
// //       openSwipeRefs.current.delete(id);

// //       setDataList((prev) => prev.filter((x) => x._id !== id));

// //       await fetch(`${CLIENT_API_URL}/${id}`, {
// //         method: "DELETE",
// //       });
// //     } catch (err) {
// //       Alert.alert("Error", "Delete failed");
// //     }
// //   };

// //   const confirmDelete = (item) => {
// //     Alert.alert("Delete", `Delete "${item.name}"?`, [
// //       { text: "Cancel", style: "cancel" },
// //       { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
// //     ]);
// //   };

// //   const renderRightActions = (progress, dragX, item) => (
// //     <View style={styles.deleteAction}>
// //       <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
// //         <Ionicons name="trash-outline" size={22} color="#fff" />
// //         <Text style={styles.deleteText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // ===============================
// //   // Navigation
// //   // ===============================
// //   const handleAddProject = () => {
// //     navigation.navigate('CustomerChooseTemplate')
// //   };

// //   // ===============================
// //   // Search
// //   // ===============================
// //   const filteredList = dataList.filter((item) =>
// //     item.name?.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   // ===============================
// //   // Card Component
// //   // ===============================
// //   const Card = ({ item }) => (
// //     <Swipeable
// //       ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
// //       renderRightActions={(progress, dragX) =>
// //         renderRightActions(progress, dragX, item)
// //       }
// //       onSwipeableWillOpen={() => {
// //         openSwipeRefs.current.forEach((ref, id) => {
// //           if (id !== item._id) ref?.close();
// //         });
// //       }}
// //     >
// //       <View style={styles.card}>
// //         <View style={styles.cardHeader}>
// //           <View style={styles.imageBox}>
// //             {item.projectImages ? (
// //               <Image source={{ uri: item.projectImages }} style={styles.clientImage} />
// //             ) : (
// //               <View style={styles.placeholder}>
// //                 <Text>No Image</Text>
// //               </View>
// //             )}
// //           </View>

// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.nameText}>{item.name}</Text>
// //             <Text style={styles.subText}>{item.email}</Text>
// //           </View>


// //         </View>

// //         <View style={styles.detailsRow}>
// //           <Ionicons name="location-outline" size={16} color="#9CA3AF" />
// //           <Text style={styles.subText}>{item.address || "No Address"}</Text>
// //         </View>
// //       </View>
// //     </Swipeable>
// //   );

// //   if (isLoading) {
// //     return (
// //       <View style={styles.loading}>
// //         <ActivityIndicator size="large" color="#0066FF" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <Header title="Welcome to SkyStruct" />

// //       <ScrollView
// //         style={{ flex: 1, backgroundColor: "#F9FAFB" }}
// //         refreshControl={
// //           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// //         }
// //       >
// //         {/* Search + Add Button */}
// //         <View style={styles.searchContainer}>
// //           <View style={styles.searchBar}>
// //             <Ionicons name="search" size={18} color="#9CA3AF" />
// //             <TextInput
// //               placeholder="Search Projects..."
// //               style={styles.searchInput}
// //               value={searchQuery}
// //               onChangeText={setSearchQuery}
// //             />
// //           </View>

// //           <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
// //             <Ionicons name="add" size={24} color="white" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* List */}
// //         <View style={{ paddingHorizontal: 16 }}>
// //           {filteredList.map((item) => (
// //             <Card key={item._id} item={item} />
// //           ))}

// //           {filteredList.length === 0 && (
// //             <View style={styles.empty}>
// //               <Ionicons name="folder-open-outline" size={60} color="#D1D5DB" />
// //               <Text style={styles.emptyText}>No data found</Text>
// //             </View>
// //           )}
// //         </View>

// //         <View style={{ height: 20 }} />
// //       </ScrollView>
// //     </GestureHandlerRootView>
// //   );
// // }

// // // ===============================
// // // Styles
// // // ===============================
// // const styles = StyleSheet.create({
// //   loading: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   searchContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 16,
// //     paddingTop: 16,
// //     paddingBottom: 10,
// //     gap: 12,
// //   },

// //   searchBar: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "white",
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //   },

// //   searchInput: { marginLeft: 10, flex: 1 },

// //   addButton: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 12,
// //     backgroundColor: "#0066FF",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     elevation: 5,
// //   },

// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderLeftWidth: 4,
// //     borderLeftColor: "#0066FF",
// //     elevation: 2,
// //   },

// //   cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

// //   imageBox: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 12,
// //     marginRight: 12,
// //     overflow: "hidden",
// //     backgroundColor: "#EEE",
// //   },

// //   clientImage: { width: "100%", height: "100%" },

// //   placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },

// //   nameText: { fontSize: 16, fontWeight: "700", color: "#111" },

// //   subText: { fontSize: 12, color: "#6B7280" },

// //   detailsRow: { flexDirection: "row", alignItems: "center" },

// //   deleteAction: {
// //     justifyContent: "center",
// //     alignItems: "flex-end",
// //     marginBottom: 12,
// //   },

// //   deleteBtn: {
// //     width: 85,
// //     height: "100%",
// //     backgroundColor: "#EF4444",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderTopRightRadius: 16,
// //     borderBottomRightRadius: 16,
// //   },

// //   deleteText: { color: "#fff", marginTop: 3 },

// //   empty: { alignItems: "center", paddingVertical: 60 },

// //   emptyText: { marginTop: 16, color: "#777" },
// // });

// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
// } from "react-native";

// import React, { useState, useEffect, useRef } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import Swipeable from "react-native-gesture-handler/Swipeable";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Header from "components/Header";

// //const CLIENT_API_URL ="https://skystruct-lite-backend.vercel.app/api/client/projects";

// const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;

// export default function ClientMainPage({ navigation }) {
//   const [dataList, setDataList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const openSwipeRefs = useRef(new Map());

//   // ===============================
//   // Fetch Data
//   // ===============================
//   const fetchData = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       setIsLoading(true);

//       const response = await fetch(CLIENT_API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await response.json();
//       const dd = await AsyncStorage.getItem("userData");
//       console.log("adsf", dd);
//       const list = Array.isArray(json.data) ? json.data : [];


//       const aa = dd ? JSON.parse(dd) : null;

//       if (!aa?.id) {
//         console.log("No user ID found");
//       }


//       // 1️⃣ Get user data once
// const stored = await AsyncStorage.getItem("userData");
// const user = stored ? JSON.parse(stored) : null;

// if (!user) {
//   console.log("⚠ No user found in storage");
//   return;
// }

// const loggedInId = String(user.id);
// const loggedInEmail = user.email;

// console.log("Logged in ID:", loggedInId);
// console.log("Logged in Email:", loggedInEmail);

// // 2️⃣ Filter list with BOTH conditions
// const filteredList = list.filter((item) => {
//   const createdBy = item?.createdBy ? String(item.createdBy) : null;
//   const clientEmail = item?.clientEmail;

//   const matchByCreator = createdBy === loggedInId;
//   const matchByEmail = clientEmail === loggedInEmail;

//   console.log("--------- CHECKING PROJECT ---------");
//   console.log("DB createdBy:", createdBy);
//   console.log("DB clientEmail:", clientEmail);
//   console.log("MATCH createdBy? ->", matchByCreator);
//   console.log("MATCH email? ->", matchByEmail);

//   // Keep item if ANY condition matches
//   return matchByCreator || matchByEmail;
// });

// console.log("🎉 Final Filtered List:", filteredList);





//       setDataList(filteredList);
//     } catch (err) {
//       console.log("Fetch Error:", err);
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // ===============================
//   // Delete Item
//   // ===============================
//   const deleteItem = async (id) => {
//     try {
//       openSwipeRefs.current.get(id)?.close();
//       openSwipeRefs.current.delete(id);

//       setDataList((prev) => prev.filter((x) => x._id !== id));

//       await fetch(`${CLIENT_API_URL}/${id}`, {
//         method: "DELETE",
//       });
//     } catch (err) {
//       Alert.alert("Error", "Delete failed");
//     }
//   };

//   const confirmDelete = (item) => {
//     Alert.alert("Delete", `Delete "${item.name}"?`, [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
//     ]);
//   };

//   const renderRightActions = (progress, dragX, item) => (
//     <View style={styles.deleteAction}>
//       <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
//         <Ionicons name="trash-outline" size={22} color="#fff" />
//         <Text style={styles.deleteText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // ===============================
//   // Navigation
//   // ===============================
//   const handleAddProject = () => {
//     navigation.navigate('CustomerChooseTemplate')
//   };

//   // ===============================
//   // Search
//   // ===============================
//   const filteredList = dataList.filter((item) =>
//     item.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ===============================
//   // Card Component
//   // ===============================
//   const Card = ({ item, index }) => (
//     <Swipeable
//       ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
//       renderRightActions={(progress, dragX) =>
//         renderRightActions(progress, dragX, item)
//       }
//       onSwipeableWillOpen={() => {
//         openSwipeRefs.current.forEach((ref, id) => {
//           if (id !== item._id) ref?.close();
//         });
//       }}
//     >
//       <TouchableOpacity 
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() => {/* Add navigation to project details */}}
//       >
//         <View style={styles.cardBody}>
//           <View style={styles.cardRow}>
//             <View style={styles.iconLabelContainer}>
//               <Ionicons name="document-text-outline" size={18} color="#0066FF" />
//               <Text style={styles.cardLabel}>Project Name</Text>
//             </View>
//             <Text style={styles.cardValue} numberOfLines={2}>{item.name || "N/A"}</Text>
//           </View>

          

          


//           <View style={styles.cardRow}>
//             <View style={styles.iconLabelContainer}>
//               <Ionicons name="location-outline" size={18} color="#EF4444" />
//               <Text style={styles.cardLabel}>Location</Text>
//             </View>
//             <Text style={styles.cardValue} numberOfLines={1}>{item.location || "N/A"}</Text>
//           </View>

//           <View style={styles.cardRow}>
//             <View style={styles.iconLabelContainer}>
//               <Ionicons name="home-outline" size={18} color="#6366F1" />
//               <Text style={styles.cardLabel}>Project Type</Text>
//             </View>
//             <Text style={styles.cardValue} numberOfLines={2}>
//               {item.projectType?.projectTypeName || "N/A"}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.cardFooter}>
//           <View style={styles.statusBadge}>
//             <View style={styles.statusDot} />
//             <Text style={styles.statusText}>{item.status || "Active"}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Swipeable>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color="#0066FF" />
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Header title="Welcome to SkyStruct" />

//       <ScrollView
//         style={{ flex: 1, backgroundColor: "#F9FAFB" }}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Search + Add Button */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <Ionicons name="search" size={20} color="#9CA3AF" />
//             <TextInput
//               placeholder="Search proposals..."
//               placeholderTextColor="#9CA3AF"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => setSearchQuery("")}>
//                 <Ionicons name="close-circle" size={20} color="#9CA3AF" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
//             <Ionicons name="add" size={26} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* List */}
//         <View style={{ paddingHorizontal: 16 }}>
//           {filteredList.map((item, index) => (
//             <Card key={item._id} item={item} index={index} />
//           ))}

//           {filteredList.length === 0 && (
//             <View style={styles.empty}>
//               <View style={styles.emptyIconContainer}>
//                 <Ionicons name="folder-open-outline" size={64} color="#0066FF" />
//               </View>
//               <Text style={styles.emptyTitle}>No Proposals Found</Text>
//               <Text style={styles.emptySubtitle}>
//                 {searchQuery 
//                   ? "Try adjusting your search terms" 
//                   : "Get started by creating your first proposal"}
//               </Text>
//               {!searchQuery && (
//                 <TouchableOpacity style={styles.emptyButton} onPress={handleAddProject}>
//                   <Ionicons name="add-circle-outline" size={20} color="#0066FF" />
//                   <Text style={styles.emptyButtonText}>Create Proposal</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         </View>

//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </GestureHandlerRootView>
//   );
// }

// // ===============================
// // Styles
// // ===============================
// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//   },

//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 12,
//     gap: 12,
//     backgroundColor: "#F9FAFB",
//   },

//   searchBar: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   searchInput: { 
//     marginLeft: 10, 
//     flex: 1,
//     fontSize: 15,
//     color: "#111827",
//   },

//   addButton: {
//     width: 52,
//     height: 52,
//     borderRadius: 14,
//     backgroundColor: "#0066FF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#0066FF",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 14,
//     borderLeftWidth: 4,
//     borderLeftColor: "#0066FF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   cardBody: {
//     gap: 12,
//   },

//   cardRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//   },

//   iconLabelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     minWidth: 140,
//   },

//   cardLabel: {
//     fontSize: 13,
//     color: "#6B7280",
//     fontWeight: "600",
//   },

//   cardValue: {
//     fontSize: 13,
//     color: "#111827",
//     flex: 1,
//     textAlign: "right",
//     fontWeight: "500",
//   },

//   cardValueBlue: {
//     fontSize: 13,
//     color: "#0066FF",
//     flex: 1,
//     textAlign: "right",
//     fontWeight: "600",
//   },

//   cardFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 14,
//     paddingTop: 14,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//   },

//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ECFDF5",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     gap: 6,
//   },

//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#10B981",
//   },

//   statusText: {
//     fontSize: 12,
//     color: "#059669",
//     fontWeight: "600",
//   },

//   menuButton: {
//     padding: 6,
//     borderRadius: 8,
//   },

//   deleteAction: {
//     justifyContent: "center",
//     alignItems: "flex-end",
//     marginBottom: 14,
//   },

//   deleteBtn: {
//     width: 90,
//     height: "100%",
//     backgroundColor: "#EF4444",
//     justifyContent: "center",
//     alignItems: "center",
//     borderTopRightRadius: 16,
//     borderBottomRightRadius: 16,
//     gap: 4,
//   },

//   deleteText: { 
//     color: "#fff", 
//     fontSize: 13,
//     fontWeight: "600",
//   },

//   empty: { 
//     alignItems: "center", 
//     paddingVertical: 80,
//     paddingHorizontal: 32,
//   },

//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//   },

//   emptySubtitle: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 24,
//   },

//   emptyButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//   },

//   emptyButtonText: {
//     fontSize: 15,
//     color: "#0066FF",
//     fontWeight: "600",
//   },
// });


// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   RefreshControl,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
// } from "react-native";

// import React, { useState, useEffect, useRef } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import Swipeable from "react-native-gesture-handler/Swipeable";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { LinearGradient } from "expo-linear-gradient";
// import Header from "components/Header";

// const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;

// export default function ClientMainPage({ navigation }) {
//   const [dataList, setDataList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const openSwipeRefs = useRef(new Map());

//   // ===============================
//   // Fetch Data
//   // ===============================
//   const fetchData = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       setIsLoading(true);

//       const response = await fetch(CLIENT_API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await response.json();
//       const list = Array.isArray(json.data) ? json.data : [];

//       const stored = await AsyncStorage.getItem("userData");
//       const user = stored ? JSON.parse(stored) : null;

//       if (!user) {
//         console.log("⚠ No user found in storage");
//         return;
//       }

//       const loggedInId = String(user.id);
//       const loggedInEmail = user.email;

//       const filteredList = list.filter((item) => {
//         const createdBy = item?.createdBy ? String(item.createdBy) : null;
//         const clientEmail = item?.clientEmail;
//         return createdBy === loggedInId || clientEmail === loggedInEmail;
//       });

//       setDataList(filteredList);
//     } catch (err) {
//       console.log("Fetch Error:", err);
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   // ===============================
//   // Delete Item
//   // ===============================
//   const deleteItem = async (id) => {
//     try {
//       openSwipeRefs.current.get(id)?.close();
//       openSwipeRefs.current.delete(id);

//       setDataList((prev) => prev.filter((x) => x._id !== id));

//       await fetch(`${CLIENT_API_URL}/${id}`, {
//         method: "DELETE",
//       });
//     } catch (err) {
//       Alert.alert("Error", "Delete failed");
//     }
//   };

//   const confirmDelete = (item) => {
//     Alert.alert("Delete Proposal", `Are you sure you want to delete "${item.name}"?`, [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
//     ]);
//   };

//   const renderRightActions = (progress, dragX, item) => (
//     <View style={styles.deleteAction}>
//       <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
//         <Ionicons name="trash-outline" size={24} color="#fff" />
//         <Text style={styles.deleteText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // ===============================
//   // Navigation
//   // ===============================
//   const handleAddProject = () => {
//     navigation.navigate('CustomerChooseTemplate');
//   };

//   // ===============================
//   // Search
//   // ===============================
//   const filteredList = dataList.filter((item) =>
//     item.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // ===============================
//   // Get Status Color
//   // ===============================
//   const getStatusColor = (status) => {
//     const statusLower = (status || "active").toLowerCase();
//     switch (statusLower) {
//       case "completed":
//         return { bg: "#ECFDF5", dot: "#10B981", text: "#059669" };
//       case "in progress":
//       case "active":
//         return { bg: "#EFF6FF", dot: "#3B82F6", text: "#2563EB" };
//       case "pending":
//         return { bg: "#FEF3C7", dot: "#F59E0B", text: "#D97706" };
//       case "on hold":
//         return { bg: "#FEE2E2", dot: "#EF4444", text: "#DC2626" };
//       default:
//         return { bg: "#F3F4F6", dot: "#6B7280", text: "#4B5563" };
//     }
//   };

//   // ===============================
//   // Card Component
//   // ===============================
//   const Card = ({ item, index }) => {
//     const statusColors = getStatusColor(item.status);

//     return (
//       <Swipeable
//         ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
//         renderRightActions={(progress, dragX) =>
//           renderRightActions(progress, dragX, item)
//         }
//         onSwipeableWillOpen={() => {
//           openSwipeRefs.current.forEach((ref, id) => {
//             if (id !== item._id) ref?.close();
//           });
//         }}
//       >
//         <TouchableOpacity 
//           style={styles.card}
//           activeOpacity={0.7}
//           onPress={() => {/* Add navigation to project details */}}
//         >
//           {/* Card Header with Gradient */}
//           <View style={styles.cardHeader}>
//             <View style={styles.cardHeaderLeft}>
//               <View style={styles.projectIconContainer}>
//                 <Ionicons name="briefcase" size={20} color="#0066FF" />
//               </View>
//               <View style={styles.cardHeaderText}>
//                 <Text style={styles.projectName} numberOfLines={1}>
//                   {item.name || "Untitled Project"}
//                 </Text>
//                 <Text style={styles.projectType} numberOfLines={1}>
//                   {item.projectType?.projectTypeName || "No type specified"}
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.moreButton}>
//               <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           {/* Card Body */}
//           <View style={styles.cardBody}>
//             {/* Location */}
//             <View style={styles.infoRow}>
//               <View style={styles.infoIconContainer}>
//                 <Ionicons name="location" size={18} color="#EF4444" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Location</Text>
//                 <Text style={styles.infoValue} numberOfLines={1}>
//                   {item.location || "Not specified"}
//                 </Text>
//               </View>
//             </View>

//             {/* Divider */}
//             <View style={styles.divider} />

//             {/* Status and Date Row */}
//             <View style={styles.footerRow}>
//               <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
//                 <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
//                 <Text style={[styles.statusText, { color: statusColors.text }]}>
//                   {item.status || "Active"}
//                 </Text>
//               </View>
              
//               <View style={styles.dateContainer}>
//                 <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
//                 <Text style={styles.dateText}>
//                   {item.createdAt 
//                     ? new Date(item.createdAt).toLocaleDateString('en-US', { 
//                         month: 'short', 
//                         day: 'numeric',
//                         year: 'numeric'
//                       })
//                     : 'No date'}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Card Accent Line */}
//           <View style={[styles.cardAccent, { backgroundColor: statusColors.dot }]} />
//         </TouchableOpacity>
//       </Swipeable>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loading}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0066FF" />
//           <Text style={styles.loadingText}>Loading Projects...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Header title="Welcome to SkyStruct" />

     

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Search + Add Button */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <Ionicons name="search" size={20} color="#9CA3AF" />
//             <TextInput
//               placeholder="Search Projects..."
//               placeholderTextColor="#9CA3AF"
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => setSearchQuery("")}>
//                 <Ionicons name="close-circle" size={20} color="#9CA3AF" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
//             <Ionicons name="add" size={28} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* List Header */}
//         {filteredList.length > 0 && (
//           <View style={styles.listHeader}>
//             <Text style={styles.listHeaderText}>
//               {searchQuery ? `${filteredList.length} Result${filteredList.length !== 1 ? 's' : ''}` : 'Your Projects'}
//             </Text>
//           </View>
//         )}

//         {/* List */}
//         <View style={styles.listContainer}>
//           {filteredList.map((item, index) => (
//             <Card key={item._id} item={item} index={index} />
//           ))}

//           {filteredList.length === 0 && (
//             <View style={styles.empty}>
//               <View style={styles.emptyIconContainer}>
//                 <Ionicons name="folder-open-outline" size={64} color="#0066FF" />
//               </View>
//               <Text style={styles.emptyTitle}>No Projects Found</Text>
//               <Text style={styles.emptySubtitle}>
//                 {searchQuery 
//                   ? "Try adjusting your search terms or clear the search to see all proposals" 
//                   : "Get started by creating your first proposal and begin managing your projects efficiently"}
//               </Text>
//               {!searchQuery && (
//                 <TouchableOpacity style={styles.emptyButton} onPress={handleAddProject}>
//                   <Ionicons name="add-circle" size={22} color="white" />
//                   <Text style={styles.emptyButtonText}>Create New Proposal</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </GestureHandlerRootView>
//   );
// }




import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";

const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;

export default function ClientMainPage({ navigation }) {
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSwipeRefs = useRef(new Map());

  // ===============================
  // Fetch Data
  // ===============================
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoading(true);

      const response = await fetch(CLIENT_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await response.json();
      const list = Array.isArray(json.data) ? json.data : [];

      const stored = await AsyncStorage.getItem("userData");
      const user = stored ? JSON.parse(stored) : null;

      if (!user) {
        console.log("⚠ No user found in storage");
        return;
      }

      const loggedInId = String(user.id);
      const loggedInEmail = user.email;

      const filteredList = list.filter((item) => {
        const createdBy = item?.createdBy ? String(item.createdBy) : null;
        const clientEmail = item?.clientEmail;
        return createdBy === loggedInId || clientEmail === loggedInEmail;
      });

      setDataList(filteredList);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ===============================
  // Delete Item
  // ===============================
  const deleteItem = async (id) => {
    try {
      openSwipeRefs.current.get(id)?.close();
      openSwipeRefs.current.delete(id);

      setDataList((prev) => prev.filter((x) => x._id !== id));

      await fetch(`${CLIENT_API_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      Alert.alert("Error", "Delete failed");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert("Delete Proposal", `Are you sure you want to delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
    ]);
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.deleteAction}>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // ===============================
  // Navigation
  // ===============================
  const handleAddProject = () => {
    navigation.navigate('CustomerChooseTemplate');
  };

  // ===============================
  // Search
  // ===============================
  const filteredList = dataList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===============================
  // Get Status Color
  // ===============================
  const getStatusColor = (status) => {
    const statusLower = (status || "active").toLowerCase();
    switch (statusLower) {
      case "completed":
        return { bg: "#ECFDF5", dot: "#10B981", text: "#059669" };
      case "in progress":
      case "active":
        return { bg: "#EFF6FF", dot: "#3B82F6", text: "#2563EB" };
      case "pending":
        return { bg: "#FEF3C7", dot: "#F59E0B", text: "#D97706" };
      case "on hold":
        return { bg: "#FEE2E2", dot: "#EF4444", text: "#DC2626" };
      default:
        return { bg: "#F3F4F6", dot: "#6B7280", text: "#4B5563" };
    }
  };

  // ===============================
  // Card Component
  // ===============================
  const Card = ({ item, index }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <Swipeable
        ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        onSwipeableWillOpen={() => {
          openSwipeRefs.current.forEach((ref, id) => {
            if (id !== item._id) ref?.close();
          });
        }}
      >
        <TouchableOpacity 
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Overview', { project: item })}  // Updated: Navigate to Overview with project data
        >
          {/* Card Header with Gradient */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.projectIconContainer}>
                <Ionicons name="briefcase" size={20} color="#0066FF" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.projectName} numberOfLines={1}>
                  {item.name || "Untitled Project"}
                </Text>
                <Text style={styles.projectType} numberOfLines={1}>
                  {item.projectType?.projectTypeName || "No type specified"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            {/* Location */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={18} color="#EF4444" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {item.location || "Not specified"}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Status and Date Row */}
            <View style={styles.footerRow}>
              <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {item.status || "Active"}
                </Text>
              </View>
              
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                <Text style={styles.dateText}>
                  {item.createdAt 
                    ? new Date(item.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'No date'}
                </Text>
              </View>
            </View>
          </View>

          {/* Card Accent Line */}
          <View style={[styles.cardAccent, { backgroundColor: statusColors.dot }]} />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading Projects...</Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header title="Welcome to SkyStruct" />

     

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search + Add Button */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search Projects..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* List Header */}
        {filteredList.length > 0 && (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {searchQuery ? `${filteredList.length} Result${filteredList.length !== 1 ? 's' : ''}` : 'Your Projects'}
            </Text>
          </View>
        )}

        {/* List */}
        <View style={styles.listContainer}>
          {filteredList.map((item, index) => (
            <Card key={item._id} item={item} index={index} />
          ))}

          {filteredList.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="folder-open-outline" size={64} color="#0066FF" />
              </View>
              <Text style={styles.emptyTitle}>No Projects Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? "Try adjusting your search terms or clear the search to see all proposals" 
                  : "Get started by creating your first proposal and begin managing your projects efficiently"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.emptyButton} onPress={handleAddProject}>
                  <Ionicons name="add-circle" size={22} color="white" />
                  <Text style={styles.emptyButtonText}>Create New Proposal</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

// ===============================
// Styles
// ===============================
// (Styles remain the same, omitted for brevity)


// ===============================
// Styles
// ===============================
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  loadingContainer: {
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
    backgroundColor: "#F9FAFB",
  },

  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },

  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  statContent: {
    flex: 1,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: { 
    marginLeft: 10, 
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  addButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // List Header
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  listHeaderText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  // List Container
  listContainer: {
    paddingHorizontal: 16,
  },

  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderLeftColor:"#0066FF",
  },

  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    // backgroundColor: "#0066FF",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  cardHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  projectIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeaderText: {
    flex: 1,
    gap: 2,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  projectType: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    gap: 2,
  },

  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // Delete Action
  deleteAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  deleteBtn: {
    width: 90,
    height: "100%",
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    gap: 6,
  },

  deleteText: { 
    color: "#fff", 
    fontSize: 13,
    fontWeight: "700",
  },

  // Empty State
  empty: { 
    alignItems: "center", 
    paddingVertical: 60,
    paddingHorizontal: 32,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066FF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },

  emptyButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});