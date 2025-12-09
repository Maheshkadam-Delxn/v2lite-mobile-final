
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Header from "components/Header";
// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   View,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   RefreshControl,
//   TextInput,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { navigationRef } from "../../App.jsx"; // Adjust the import path to your App.js file

// const API_URL = `${process.env.BASE_API_URL}`;

// export default function SiteSurveysTab() {
//   const [surveys, setSurveys] = useState([]);
//   const [filteredSurveys, setFilteredSurveys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const fetchSurveys = async (isRefreshing = false) => {
//     try {
//       if (!isRefreshing) setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       const data = await AsyncStorage.getItem('userData');
//       const parsed = JSON.parse(data);
      
//       const res = await fetch(`${API_URL}/api/surveys`, {
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });
//       const json = await res.json();

//       if (json.success) {
//         const filterdata = json.data.filter((e) => e.assignContractor == parsed.id);
//         setSurveys(filterdata);
//         setFilteredSurveys(filterdata);
//       }
//     } catch (err) {
//       console.log("Error fetching surveys:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchSurveys(true);
//   };

//   useEffect(() => {
//     fetchSurveys();
//   }, []);

//   useEffect(() => {
//     filterSurveys();
//   }, [searchQuery, surveys]);

//   const filterSurveys = () => {
//     if (searchQuery.trim()) {
//       const filtered = surveys.filter((survey) =>
//         survey.projectId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         survey.requestedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         survey._id?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredSurveys(filtered);
//     } else {
//       setFilteredSurveys(surveys);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: { bg: "#FEF3C7", text: "#92400E" },
//       completed: { bg: "#D1FAE5", text: "#065F46" },
//       "in-progress": { bg: "#DBEAFE", text: "#1E40AF" },
//       cancelled: { bg: "#FEE2E2", text: "#991B1B" },
//     };
//     return colors[status?.toLowerCase()] || colors.pending;
//   };

//   const renderSurvey = ({ item }) => {
//     const statusColors = getStatusColor(item.status);
    
//     return (
//       <TouchableOpacity
//         activeOpacity={0.7}
//         className="mx-4 mb-3"
//       >
//         <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <View className="p-4">
//             {/* Header */}
//             <View className="flex-row justify-between items-start mb-3">
//               <View className="flex-1 mr-3">
//                 <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
//                   {item.projectId?.name || "No Project"}
//                 </Text>
//                 <Text className="text-xs text-gray-500">
//                   ID: {item._id.slice(-8).toUpperCase()}
//                 </Text>
//               </View>
              
//               {/* Status Badge */}
//               <View
//                 style={{ backgroundColor: statusColors.bg }}
//                 className="px-3 py-1 rounded-md"
//               >
//                 <Text
//                   style={{ color: statusColors.text }}
//                   className="text-xs font-medium capitalize"
//                 >
//                   {item.status}
//                 </Text>
//               </View>
//             </View>

//             {/* Divider */}
//             <View className="h-px bg-gray-100 my-3" />

//             {/* Info Section */}
//             <View className="space-y-2">
//               {/* Requested By */}
//               <View className="flex-row items-center justify-between">
//                 <Text className="text-sm text-gray-600">Requested By</Text>
//                 <Text className="text-sm font-medium text-gray-900">
//                   {item.requestedBy?.name || "Unknown"}
//                 </Text>
//               </View>

//               {/* Survey Date */}
//               {item.surveyDate && (
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-sm text-gray-600">Survey Date</Text>
//                   <Text className="text-sm font-medium text-gray-900">
//                     {new Date(item.surveyDate).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </View>
//               )}

//               {/* Created Date */}
//               <View className="flex-row items-center justify-between">
//                 <Text className="text-sm text-gray-600">Created</Text>
//                 <Text className="text-sm font-medium text-gray-900">
//                   {new Date(item.createdAt).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     year: "numeric",
//                   })}
//                 </Text>
//               </View>
//             </View>

//             {/* Action Button */}
//             {/* <TouchableOpacity
//               className="mt-4 bg-blue-600 rounded-lg py-2.5 items-center"
//               activeOpacity={0.8}
//                onPress={() => navigationRef.current?.navigate('SiteSurveyForm', { survey: item })}
//             >
//               <Text className="text-white font-medium text-sm">View Details</Text>
//             </TouchableOpacity> */}
//             {/* Action Button */}
// {item.status === "pending" && (
//   <TouchableOpacity
//     className="mt-4 bg-blue-600 rounded-lg py-2.5 items-center"
//     activeOpacity={0.8}
//     onPress={() =>
//       navigationRef.current?.navigate("SiteSurveyForm", {
//         survey: item,
//         mode: "take",
//       })
//     }
//   >
//     <Text className="text-white font-medium text-sm">Take Survey</Text>
//   </TouchableOpacity>
// )}

// {item.status === "in-progress" && (
//   <TouchableOpacity
//     className="mt-4 bg-yellow-500 rounded-lg py-2.5 items-center"
//     activeOpacity={0.8}
//     onPress={() =>
//       navigationRef.current?.navigate("SiteSurveyForm", {
//         survey: item,
//         mode: "continue",
//       })
//     }
//   >
//     <Text className="text-white font-medium text-sm">Continue Survey</Text>
//   </TouchableOpacity>
// )}

// {item.status === "completed" && (
//   <TouchableOpacity
//     className="mt-4 bg-gray-800 rounded-lg py-2.5 items-center"
//     activeOpacity={0.8}
//     onPress={() =>
//       navigationRef.current?.navigate("SiteSurveyForm", {
//         survey: item,
//         mode: "view",
//       })
//     }
//   >
//     <Text className="text-white font-medium text-sm">View Details</Text>
//   </TouchableOpacity>
// )}

//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View className="flex-1 bg-gray-50">
//       <Header title={"Site Surveys"} />

//       {/* Loading State */}
//       {loading && (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#2563EB" />
//           <Text className="text-gray-600 mt-3 font-medium">Loading surveys...</Text>
//         </View>
//       )}

//       {/* Main Content */}
//       {!loading && (
//         <>
//           {/* Search Bar */}
//           <View className="px-4 pt-4 pb-3">
//             <View className="bg-white rounded-lg border border-gray-200 flex-row items-center px-4 py-3">
//               <Text className="text-gray-400 mr-2 text-lg">🔍</Text>
//               <TextInput
//                 placeholder="Search surveys..."
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 className="flex-1 text-sm text-gray-900"
//                 placeholderTextColor="#9CA3AF"
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity
//                   onPress={() => setSearchQuery("")}
//                   className="ml-2"
//                 >
//                   <Text className="text-gray-400 text-base">✕</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* Results Count */}
//           <View className="px-4 pb-2">
//             <Text className="text-sm text-gray-600">
//               {filteredSurveys.length} {filteredSurveys.length === 1 ? "survey" : "surveys"}
//             </Text>
//           </View>

//           {/* Empty State */}
//           {filteredSurveys.length === 0 && (
//             <View className="flex-1 justify-center items-center px-8">
//               <View className="items-center">
//                 <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
//                   <Text className="text-3xl">📋</Text>
//                 </View>
//                 <Text className="text-lg font-semibold text-gray-900 mb-2">
//                   No surveys found
//                 </Text>
//                 <Text className="text-sm text-gray-500 text-center mb-6">
//                   {searchQuery
//                     ? `No results matching "${searchQuery}"`
//                     : "You don't have any surveys at the moment"}
//                 </Text>
//                 {searchQuery && (
//                   <TouchableOpacity
//                     onPress={() => setSearchQuery("")}
//                     className="bg-blue-600 rounded-lg px-6 py-2.5"
//                   >
//                     <Text className="text-white font-medium text-sm">Clear Search</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           )}

//           {/* Surveys List */}
//           {filteredSurveys.length > 0 && (
//             <FlatList
//               data={filteredSurveys}
//               keyExtractor={(item) => item._id}
//               renderItem={renderSurvey}
//               contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={refreshing}
//                   onRefresh={onRefresh}
//                   tintColor="#2563EB"
//                   colors={["#2563EB"]}
//                 />
//               }
//               showsVerticalScrollIndicator={false}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// }


import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "components/Header";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from "../../App.jsx";

const API_URL = `${process.env.BASE_API_URL}`;
const { width } = Dimensions.get("window");

export default function SiteSurveysTab() {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSurveys = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const data = await AsyncStorage.getItem("userData");
      const parsed = JSON.parse(data);
      const res = await fetch(`${API_URL}/api/surveys`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const json = await res.json();
      if (json.success) {
        const filterdata = json.data.filter(
          (e) => e.assignContractor == parsed.id
        );
        setSurveys(filterdata);
        setFilteredSurveys(filterdata);
      }
    } catch (err) {
      console.log("Error fetching surveys:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurveys(true);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [searchQuery, surveys]);

  const filterSurveys = () => {
    if (searchQuery.trim()) {
      const filtered = surveys.filter(
        (survey) =>
          survey.projectId?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          survey.requestedBy?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          survey._id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSurveys(filtered);
    } else {
      setFilteredSurveys(surveys);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "#FEF3C7",
        text: "#92400E",
        icon: "⏳",
        label: "Pending",
      },
      completed: {
        bg: "#D1FAE5",
        text: "#065F46",
        icon: "✓",
        label: "Completed",
      },
      "in-progress": {
        bg: "#DBEAFE",
        text: "#1E40AF",
        icon: "⟳",
        label: "In Progress",
      },
      cancelled: {
        bg: "#FEE2E2",
        text: "#991B1B",
        icon: "✕",
        label: "Cancelled",
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const renderSurvey = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          overflow: "hidden",
        }}
      >
        {/* Accent Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: statusConfig.text,
          }}
        />

        <View style={{ padding: 16 }}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 4,
                }}
                numberOfLines={2}
              >
                {item.projectId?.name || "No Project"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                ID: {item._id.slice(-8).toUpperCase()}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              style={{
                backgroundColor: statusConfig.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 12 }}>{statusConfig.icon}</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: statusConfig.text,
                }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "#F3F4F6",
              marginVertical: 12,
            }}
          />

          {/* Info Grid */}
          <View style={{ gap: 12 }}>
            {/* Requested By */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Requested By
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {item.requestedBy?.name || "Unknown"}
                </Text>
              </View>
            </View>

            {/* Date Info Row */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Survey Date */}
              {item.surveyDate && (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#F9FAFB",
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 4 }}>📅</Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      Survey Date
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {new Date(item.surveyDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}

              {/* Created Date */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#F9FAFB",
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 14, marginRight: 4 }}>🕒</Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      fontWeight: "500",
                    }}
                  >
                    Created
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          {/* Action Button */}
<View style={{ marginTop: 16 }}>

  {/* Pending → Take Survey */}
  {item.status === "pending" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("SiteSurveyForm", {
          survey: item,
          mode: "take",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>📝</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        Take Survey
      </Text>
    </TouchableOpacity>
  )}

  {/* In Progress → Continue Survey */}
  {item.status === "in-progress" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("SiteSurveyForm", {
          survey: item,
          mode: "continue",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>▶️</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        Continue Survey
      </Text>
    </TouchableOpacity>
  )}

  {/* Completed → View Details */}
  {item.status === "completed" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("SiteSurveyForm", {
          survey: item,
          mode: "view",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>👁️</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        View Details
      </Text>
    </TouchableOpacity>
  )}

</View>

        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Header title={"Site Surveys"}/>

      {/* Loading State */}
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 15,
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Loading surveys...
          </Text>
        </View>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Search Bar */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
              backgroundColor: "#F9FAFB",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: searchQuery ? "#2563EB" : "#E5E7EB",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by project, ID, or requester..."
                placeholderTextColor="#9CA3AF"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: "#111827",
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Results Count */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {filteredSurveys.length}{" "}
                {filteredSurveys.length === 1 ? "survey" : "surveys"}
              </Text>
              {searchQuery && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    marginLeft: 4,
                  }}
                >
                  for "{searchQuery}"
                </Text>
              )}
            </View>
          </View>

          {/* Empty State */}
          {filteredSurveys.length === 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 32,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text style={{ fontSize: 48 }}>📋</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                No surveys found
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                {searchQuery
                  ? `No results matching "${searchQuery}"`
                  : "You don't have any surveys at the moment"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginTop: 24,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Clear Search
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Surveys List */}
          {filteredSurveys.length > 0 && (
            <FlatList
              data={filteredSurveys}
              keyExtractor={(item) => item._id}
              renderItem={renderSurvey}
              contentContainerStyle={{
                paddingTop: 8,
                paddingBottom: 24,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#2563EB"
                  colors={["#2563EB"]}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}