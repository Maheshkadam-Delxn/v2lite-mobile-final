


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
// import Header from "@/components/Header";

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
//           onPress={() => navigation.navigate('Overview', { project: item })}  // Updated: Navigate to Overview with project data
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

// // ===============================
// // Styles
// // ===============================
// // (Styles remain the same, omitted for brevity)


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

//   loadingContainer: {
//     alignItems: "center",
//     gap: 12,
//   },

//   loadingText: {
//     fontSize: 15,
//     color: "#6B7280",
//     fontWeight: "500",
//   },

//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },

//   scrollContent: {
//     paddingBottom: 20,
//   },

//   // Stats Container
//   statsContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 8,
//     gap: 12,
//     backgroundColor: "#F9FAFB",
//   },

//   statCard: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: 14,
//     borderRadius: 12,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: "#F3F4F6",
//   },

//   statIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   statContent: {
//     flex: 1,
//   },

//   statValue: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 2,
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "500",
//   },

//   // Search Container
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 12,
//     gap: 12,
//   },

//   searchBar: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   searchInput: { 
//     marginLeft: 10, 
//     flex: 1,
//     fontSize: 15,
//     color: "#111827",
//   },

//   addButton: {
//     width: 54,
//     height: 54,
//     borderRadius: 12,
//     backgroundColor: "#0066FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   // List Header
//   listHeader: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },

//   listHeaderText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   // List Container
//   listContainer: {
//     paddingHorizontal: 16,
//   },

//   // Card Styles
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     marginBottom: 14,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#F3F4F6",
//     borderLeftColor:"#0066FF",
//   },

//   cardAccent: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 4,
//     // backgroundColor: "#0066FF",
//   },

//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 12,
//   },

//   cardHeaderLeft: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   projectIconContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   cardHeaderText: {
//     flex: 1,
//     gap: 2,
//   },

//   projectName: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   projectType: {
//     fontSize: 13,
//     color: "#6B7280",
//     fontWeight: "500",
//   },

//   moreButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//   },

//   cardBody: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     gap: 12,
//   },

//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   infoIconContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#FEF2F2",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   infoContent: {
//     flex: 1,
//     gap: 2,
//   },

//   infoLabel: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },

//   infoValue: {
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "600",
//   },

//   divider: {
//     height: 1,
//     backgroundColor: "#F3F4F6",
//     marginVertical: 4,
//   },

//   footerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 6,
//   },

//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },

//   statusText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   dateContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },

//   dateText: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     fontWeight: "500",
//   },

//   // Delete Action
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
//     gap: 6,
//   },

//   deleteText: { 
//     color: "#fff", 
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   // Empty State
//   empty: { 
//     alignItems: "center", 
//     paddingVertical: 60,
//     paddingHorizontal: 32,
//   },

//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#EFF6FF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },

//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//   },

//   emptySubtitle: {
//     fontSize: 15,
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 22,
//     marginBottom: 28,
//   },

//   emptyButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#0066FF",
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },

//   emptyButtonText: {
//     fontSize: 15,
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
// });







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
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";

const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;
const { width } = Dimensions.get('window');

export default function ClientMainPage({ navigation }) {
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const openSwipeRefs = useRef(new Map());

  // Quick action suggestions
  const quickActions = [
    { id: 1, icon: "home-outline", text: "Residential Building", color: "#0066FF" },
    { id: 2, icon: "business-outline", text: "Commercial Project", color: "#10B981" },
    { id: 3, icon: "construct-outline", text: "Renovation Work", color: "#F59E0B" },
    { id: 4, icon: "document-text-outline", text: "Cost Estimate", color: "#8B5CF6" },
  ];

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
  // AI Modal Handlers - ENHANCED
  // ===============================
  const openAIModal = () => {
    setModalVisible(true);
    setShowWelcome(true);
    setMessages([]);

    // Animate modal slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Animate welcome content
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeAIModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setShowWelcome(true);
      setMessages([]);
    });
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage = {
      text: textToSend,
      isUser: true,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setShowWelcome(false);
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    const aiResponse = await simulateAIResponse(textToSend);
    setIsTyping(false);

    const aiMessage = {
      text: aiResponse,
      isUser: false,
      id: Date.now() + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Scroll to bottom again
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickAction = (actionText) => {
    sendMessage(actionText);
  };

  const simulateAIResponse = (userInput) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const input = userInput.toLowerCase();

        if (input.includes("residential") || input.includes("house") || input.includes("home")) {
          resolve("Excellent choice! For residential building projects, I'll help you with:\n\n• Plot assessment and planning\n• Architectural design requirements\n• Material cost estimation\n• Timeline planning\n• Contractor recommendations\n\nWhat's the plot size you're working with?");
        } else if (input.includes("commercial") || input.includes("business") || input.includes("office")) {
          resolve("Great! Commercial projects require careful planning. Let me help you with:\n\n• Zoning and compliance checks\n• Space utilization planning\n• Budget estimation\n• Timeline projection\n• Vendor selection\n\nWhat type of commercial space are you planning?");
        } else if (input.includes("renovation") || input.includes("remodel")) {
          resolve("Renovation projects can be exciting! I can assist with:\n\n• Scope assessment\n• Cost breakdown\n• Material selection\n• Contractor matching\n• Timeline planning\n\nWhat areas are you looking to renovate?");
        } else if (input.includes("cost") || input.includes("estimate") || input.includes("budget")) {
          resolve("I'll help you create a detailed cost estimate! Please provide:\n\n• Project type and size\n• Location\n• Preferred materials\n• Timeline expectations\n\nThis will help me give you an accurate estimate.");
        } else if (input.includes("plot") || input.includes("size") || input.includes("sqft") || input.includes("sq ft")) {
          resolve("Perfect! Based on the plot size, I can help calculate:\n\n• Buildable area (FSI/FAR)\n• Estimated construction cost\n• Material requirements\n• Timeline for completion\n\nWould you like me to create a preliminary project plan?");
        } else {
          resolve("Hello! 👋 I'm your AI Building Assistant. I can help you with:\n\n✨ Project Planning\n📊 Cost Estimation\n🏗️ Material Selection\n⏱️ Timeline Planning\n👷 Contractor Recommendations\n\nWhat would you like to know about your construction project?");
        }
      }, 1500); // Slightly longer for more realistic typing effect
    });
  };

  // ===============================
  // Typing Indicator Component
  // ===============================
  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = (dot, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -10,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animate(dot1, 0);
      animate(dot2, 200);
      animate(dot3, 400);
    }, []);

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
          </View>
        </View>
      </View>
    );
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
          onPress={() => navigation.navigate('Overview', { project: item })}
        >
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

          <View style={styles.cardBody}>
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

            <View style={styles.divider} />

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
        {/* Search + Add Button + AI Button */}
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

          <TouchableOpacity style={styles.aiButton} onPress={openAIModal}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.aiButtonGradient}
            >
              <Ionicons name="sparkles" size={24} color="white" />
            </LinearGradient>
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

      {/* ENHANCED AI Chat Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeAIModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Enhanced Modal Header */}
            <LinearGradient
              colors={["#0066FF", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.aiAvatarContainer}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.aiAvatar}
                  >
                    <Ionicons name="sparkles" size={24} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>AI Assistant</Text>
                  <Text style={styles.modalSubtitle}>Building Construction Expert</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeAIModal}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            >
              {showWelcome ? (
                <Animated.View
                  style={[
                    styles.welcomeContainer,
                    { transform: [{ scale: scaleAnim }] }
                  ]}
                >
                  <LinearGradient
                    colors={["#F0F9FF", "#E0F2FE"]}
                    style={styles.welcomeGradient}
                  >
                    <View style={styles.welcomeIconContainer}>
                      <LinearGradient
                        colors={["#0066FF", "#3B82F6"]}
                        style={styles.welcomeIcon}
                      >
                        <Ionicons name="construct" size={32} color="white" />
                      </LinearGradient>
                    </View>

                    <Text style={styles.welcomeTitle}>
                      Welcome to AI Building Assistant! 🏗️
                    </Text>
                    <Text style={styles.welcomeMessage}>
                      I'm here to help you with construction planning, cost estimation, material selection, and project management.
                    </Text>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                      <View style={styles.quickActionsGrid}>
                        {quickActions.map((action) => (
                          <TouchableOpacity
                            key={action.id}
                            style={styles.quickActionCard}
                            onPress={() => handleQuickAction(action.text)}
                            activeOpacity={0.7}
                          >
                            <LinearGradient
                              colors={[action.color, action.color + "CC"]}
                              style={styles.quickActionIconContainer}
                            >
                              <Ionicons name={action.icon} size={22} color="white" />
                            </LinearGradient>
                            <Text style={styles.quickActionText}>{action.text}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <Animated.View
                      key={msg.id}
                      style={[
                        styles.messageWrapper,
                        msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                      ]}
                    >
                      {!msg.isUser && (
                        <View style={styles.aiMessageAvatar}>
                          <LinearGradient
                            colors={["#10B981", "#059669"]}
                            style={styles.messageAvatar}
                          >
                            <Ionicons name="sparkles" size={16} color="white" />
                          </LinearGradient>
                        </View>
                      )}

                      <View style={styles.messageContent}>
                        <View
                          style={[
                            styles.messageBubble,
                            msg.isUser ? styles.userMessage : styles.aiMessage,
                          ]}
                        >
                          <Text style={[
                            styles.messageText,
                            msg.isUser ? styles.userMessageText : styles.aiMessageText
                          ]}>
                            {msg.text}
                          </Text>
                        </View>
                        <Text style={[
                          styles.messageTime,
                          msg.isUser ? styles.userMessageTime : styles.aiMessageTime
                        ]}>
                          {msg.timestamp}
                        </Text>
                      </View>

                      {msg.isUser && (
                        <View style={styles.userMessageAvatar}>
                          <View style={styles.messageAvatar}>
                            <Ionicons name="person" size={16} color="#0066FF" />
                          </View>
                        </View>
                      )}
                    </Animated.View>
                  ))}

                  {isTyping && <TypingIndicator />}
                </>
              )}
            </ScrollView>

            {/* Enhanced Input Container */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
                </TouchableOpacity>

                <TextInput
                  style={styles.chatInput}
                  placeholder="Type your message..."
                  placeholderTextColor="#9CA3AF"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />

                <TouchableOpacity
                  style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                  onPress={() => sendMessage()}
                  disabled={!inputText.trim()}
                >
                  <LinearGradient
                    colors={inputText.trim() ? ["#0066FF", "#3B82F6"] : ["#E5E7EB", "#D1D5DB"]}
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={inputText.trim() ? "white" : "#9CA3AF"}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.inputFooter}>
                <View style={styles.inputFooterLeft}>
                  <Ionicons name="shield-checkmark" size={12} color="#10B981" />
                  <Text style={styles.inputFooterText}>Secure & Private</Text>
                </View>
                <Text style={styles.characterCount}>{inputText.length}/500</Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </GestureHandlerRootView>
  );
}

// ===============================
// ENHANCED STYLES
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

  aiButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    overflow: "hidden",
  },

  aiButtonGradient: {
    width: "100%",
    height: "100%",
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
    borderLeftWidth: 4,
    borderLeftColor: "#0066FF",
  },

  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
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

  // ===============================
  // ENHANCED AI MODAL STYLES
  // ===============================
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  aiAvatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },

  modalHeaderText: {
    gap: 2,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  chatContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  chatContent: {
    padding: 20,
    paddingBottom: 10,
  },

  // Welcome Screen
  welcomeContainer: {
    alignItems: "center",
  },

  welcomeGradient: {
    width: "100%",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },

  welcomeIconContainer: {
    marginBottom: 20,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },

  welcomeMessage: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  quickActionsContainer: {
    width: "100%",
    marginTop: 8,
  },

  quickActionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  quickActionCard: {
    width: (width - 130) / 3, 
    backgroundColor: "white",
    padding: 12, // Reduced padding
    borderRadius: 14,
    alignItems: "center",
    gap: 8, // Reduced gap
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  quickActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  // Messages
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  userMessageWrapper: {
    justifyContent: "flex-end",
  },

  aiMessageWrapper: {
    justifyContent: "flex-start",
  },

  messageContent: {
    maxWidth: "75%",
    gap: 4,
  },

  messageBubble: {
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  userMessage: {
    backgroundColor: "#0066FF",
    borderTopRightRadius: 4,
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  aiMessageText: {
    color: "#111827",
  },

  messageTime: {
    fontSize: 11,
    fontWeight: "500",
  },

  userMessageTime: {
    color: "#9CA3AF",
    textAlign: "right",
  },

  aiMessageTime: {
    color: "#9CA3AF",
    textAlign: "left",
  },

  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },

  aiMessageAvatar: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  userMessageAvatar: {
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },

  typingBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9CA3AF",
  },

  // Input Container
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  chatInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },

  inputFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  inputFooterText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },

  characterCount: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});