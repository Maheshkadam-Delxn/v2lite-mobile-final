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
//               <TouchableOpacity
//     className="mt-4 bg-blue-600 rounded-lg py-2.5 items-center"
//     activeOpacity={0.8}
//     onPress={() => navigation.navigate('SiteSurveyForm')}
//   >
//     <Text className="text-white font-medium text-sm">View Details</Text>
//   </TouchableOpacity>
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from "../../App.jsx"; // Adjust the import path to your App.js file

const API_URL = `${process.env.BASE_API_URL}`;

export default function SiteSurveysTab() {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSurveys = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const data = await AsyncStorage.getItem('userData');
      const parsed = JSON.parse(data);
      
      const res = await fetch(`${API_URL}/api/surveys`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const json = await res.json();

      if (json.success) {
        const filterdata = json.data.filter((e) => e.assignContractor == parsed.id);
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
      const filtered = surveys.filter((survey) =>
        survey.projectId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.requestedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey._id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSurveys(filtered);
    } else {
      setFilteredSurveys(surveys);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#FEF3C7", text: "#92400E" },
      completed: { bg: "#D1FAE5", text: "#065F46" },
      "in-progress": { bg: "#DBEAFE", text: "#1E40AF" },
      cancelled: { bg: "#FEE2E2", text: "#991B1B" },
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  const renderSurvey = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="mx-4 mb-3"
      >
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <View className="p-4">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 mr-3">
                <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={2}>
                  {item.projectId?.name || "No Project"}
                </Text>
                <Text className="text-xs text-gray-500">
                  ID: {item._id.slice(-8).toUpperCase()}
                </Text>
              </View>
              
              {/* Status Badge */}
              <View
                style={{ backgroundColor: statusColors.bg }}
                className="px-3 py-1 rounded-md"
              >
                <Text
                  style={{ color: statusColors.text }}
                  className="text-xs font-medium capitalize"
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-100 my-3" />

            {/* Info Section */}
            <View className="space-y-2">
              {/* Requested By */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Requested By</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {item.requestedBy?.name || "Unknown"}
                </Text>
              </View>

              {/* Survey Date */}
              {item.surveyDate && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">Survey Date</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {new Date(item.surveyDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}

              {/* Created Date */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Created</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              className="mt-4 bg-blue-600 rounded-lg py-2.5 items-center"
              activeOpacity={0.8}
              onPress={() => navigationRef.current?.navigate('SiteSurveyForm')}
            >
              <Text className="text-white font-medium text-sm">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header title={"Site Surveys"} />

      {/* Loading State */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-600 mt-3 font-medium">Loading surveys...</Text>
        </View>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Search Bar */}
          <View className="px-4 pt-4 pb-3">
            <View className="bg-white rounded-lg border border-gray-200 flex-row items-center px-4 py-3">
              <Text className="text-gray-400 mr-2 text-lg">🔍</Text>
              <TextInput
                placeholder="Search surveys..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-sm text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="ml-2"
                >
                  <Text className="text-gray-400 text-base">✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Results Count */}
          <View className="px-4 pb-2">
            <Text className="text-sm text-gray-600">
              {filteredSurveys.length} {filteredSurveys.length === 1 ? "survey" : "surveys"}
            </Text>
          </View>

          {/* Empty State */}
          {filteredSurveys.length === 0 && (
            <View className="flex-1 justify-center items-center px-8">
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Text className="text-3xl">📋</Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  No surveys found
                </Text>
                <Text className="text-sm text-gray-500 text-center mb-6">
                  {searchQuery
                    ? `No results matching "${searchQuery}"`
                    : "You don't have any surveys at the moment"}
                </Text>
                {searchQuery && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    className="bg-blue-600 rounded-lg px-6 py-2.5"
                  >
                    <Text className="text-white font-medium text-sm">Clear Search</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Surveys List */}
          {filteredSurveys.length > 0 && (
            <FlatList
              data={filteredSurveys}
              keyExtractor={(item) => item._id}
              renderItem={renderSurvey}
              contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
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