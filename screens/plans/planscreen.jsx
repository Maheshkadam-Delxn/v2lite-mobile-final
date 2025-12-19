// import React, { useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Linking,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// /**
//  * PlansTab - Modern UI for finalized plan data
//  * Now with Tailwind CSS styling via NativeWind
//  */

// // ---------- Sample Data ----------
// const sampleData = {
//   projectId: "proj-001",
//   name: "Luxury 7BHK Villa - Plot A",
//   finalizedBy: {
//     consultant: "Ahmed Hassan (Consultant)",
//     siteManager: "Mohamed Ali",
//     date: "2025-05-22",
//   },
//   measurements: [
//     { label: "Plot Area", value: "450 sq.m" },
//     { label: "Setback Front", value: "6 m" },
//     { label: "Setback Rear", value: "4 m" },
//     { label: "Plinth Area", value: "380 sq.m" },
//     { label: "Ground Floor Builtup", value: "200 sq.m" },
//   ],
//   photos: [
//     { id: "p1", source: require("../../assets/one.png"), caption: "Site - Front view" },
//     { id: "p2", source: require("../../assets/two.png"), caption: "Ground - Soil check" },
//   ],
//   boqSnapshot: {
//     totalItems: 42,
//     totalAmount: 38200000,
//     categories: [
//       { id: "c1", name: "RCC & Foundation", qty: "120 m3", amount: 8200000 },
//       { id: "c2", name: "Masonry & Brickwork", qty: "950 m2", amount: 4200000 },
//       { id: "c3", name: "Finishes", qty: "-", amount: 11200000 },
//     ],
//   },
//   budget: {
//     baseline: 35000000,
//     revised: 38200000,
//     currency: "QAR",
//   },
//   documents: [
//     { id: "d1", name: "Survey Report.pdf", url: "https://example.com/survey.pdf", type: "PDF" },
//     { id: "d2", name: "Plan_V1.pdf", url: "https://example.com/plan_v1.pdf", type: "PDF" },
//     { id: "d3", name: "Soil Test Report.pdf", url: "https://example.com/soil.pdf", type: "PDF" },
//   ],
//   approvalStatus: {
//     consultantApproved: true,
//     siteManagerApproved: true,
//     clientApproved: false,
//   },
// };

// // ---------- Utility helpers ----------
// const currencyFormatter = (amount, currency = "QAR") =>
//   new Intl.NumberFormat("en-QA", { 
//     style: "currency", 
//     currency: "QAR", 
//     maximumFractionDigits: 0 
//   }).format(amount);

// const SectionTitle = ({ title, right }) => (
//   <View className="flex-row justify-between items-center  mb-3">
//     <Text className="text-lg font-bold text-slate-900">{title}</Text>
//     {right ? <View>{right}</View> : null}
//   </View>
// );

// // ---------- Components ----------
// function MeasurementRow({ item }) {
//   return (
//     <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-2">
//       <View className="flex-1">
//         <Text className="text-sm text-slate-500 mb-1">{item.label}</Text>
//         <Text className="text-lg font-bold text-slate-900">{item.value}</Text>
//       </View>
//     </View>
//   );
// }

// function BOQItem({ item, isLast }) {
//   return (
//     <View className={`flex-row items-center py-3 ${!isLast ? 'border-b border-slate-100' : ''}`}>
//       <View className="flex-1">
//         <Text className="text-sm font-semibold text-slate-900 mb-0.5">{item.name}</Text>
//         <Text className="text-xs text-slate-500">{item.qty}</Text>
//       </View>
//       <Text className="text-base font-bold text-slate-900">{currencyFormatter(item.amount)}</Text>
//     </View>
//   );
// }

// function DocumentRow({ doc }) {
//   const open = async (url) => {
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (!supported) {
//         Alert.alert("Can't open file", "No handler for this URL");
//         return;
//       }
//       await Linking.openURL(url);
//     } catch (e) {
//       Alert.alert("Error", e.message);
//     }
//   };

//   return (
//     <TouchableOpacity 
//       className="bg-white rounded-xl p-4 flex-row items-center shadow-sm shadow-black/5 mb-2"
//       onPress={() => open(doc.url)}
//     >
//       <View style={{ backgroundColor: '#0066FF15' }} className="w-11 h-11 rounded-lg items-center justify-center mr-3">
//         <MaterialCommunityIcons name="file-pdf-box" size={24} color="#0066FF" />
//       </View>
//       <View className="flex-1">
//         <Text className="text-sm font-semibold text-slate-900 mb-0.5">{doc.name}</Text>
//         <Text className="text-xs text-slate-500">{doc.type}</Text>
//       </View>
//       <MaterialCommunityIcons name="arrow-right" size={20} color="#0066FF" />
//     </TouchableOpacity>
//   );
// }

// function ApprovalBadge({ approved, label }) {
//   return (
//     <View className="flex-row items-center py-3 border-b border-slate-100">
//       <View className={`w-3 h-3 rounded-full mr-3 ${approved ? 'bg-emerald-500' : 'bg-slate-300'}`} />
//       <View className="flex-1">
//         <Text className="text-sm font-semibold text-slate-900 mb-0.5">{label}</Text>
//         <Text className={`text-xs ${approved ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
//           {approved ? "Approved" : "Pending"}
//         </Text>
//       </View>
//       {approved && (
//         <MaterialCommunityIcons name="check-circle" size={18} color="#10b981" />
//       )}
//     </View>
//   );
// }

// // ---------- Main Screen ----------
// export default function PlansTab({ route }) {
//   const [data] = useState(sampleData);
//   const [clientApproved, setClientApproved] = useState(data.approvalStatus.clientApproved);

//   const totalBoqAmount = useMemo(() => data.boqSnapshot.totalAmount, [data]);
//   const budgetDelta = totalBoqAmount - data.budget.baseline;
//   const budgetVariancePercent = ((budgetDelta / data.budget.baseline) * 100).toFixed(1);

//   const onApproveByClient = () => {
//     setClientApproved(true);
//     Alert.alert("Approved", "Client approval recorded successfully.");
//   };

//   const onRequestChanges = () => {
//     Alert.prompt
//       ? Alert.prompt("Request Changes", "Type the changes you want to request:", (text) => {
//           Alert.alert("Requested", "Change request submitted: " + (text || "—"));
//         })
//       : Alert.alert("Request Changes", "Change request submitted (simulated).");
//   };

//   return (
//     <View className="flex-1 bg-slate-50 mt-2">
//       {/* <Header title="Project Plans" /> */}
//       <ScrollView 
//         className="flex-1"
//         contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 16, paddingBottom: 40 }}  // Further reduced top padding to 4 for minimal gap
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Hero Header */}
//         <View className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg shadow-black/10">
//           <View style={{ backgroundColor: '#0066FF' }} className="p-6">
//             <Text className="text-2xl font-extrabold text-white mb-3">{data.name}</Text>
//             <View className="flex-row items-center">
//               <MaterialCommunityIcons name="calendar" size={16} color="rgba(255,255,255,0.9)" />
//               <Text className="text-sm text-white/90 ml-1.5">{data.finalizedBy.date}</Text>
//               <Text className="mx-2 text-white/60">•</Text>
//               <MaterialCommunityIcons name="account" size={16} color="rgba(255,255,255,0.9)" />
//               <Text className="text-sm text-white/90 ml-1.5">{data.finalizedBy.consultant}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Measurements Grid */}
//         <SectionTitle title="Site Measurements" />
//         <View className="space-y-2">
//           {data.measurements.map((m) => (
//             <MeasurementRow key={m.label} item={m} />
//           ))}
//         </View>

//         {/* Photos Gallery */}
//         <SectionTitle title="Site Photos" />
//         <FlatList
//           className="my-1"
//           data={data.photos}
//           keyExtractor={(p) => p.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View className="w-64 mr-3 rounded-2xl overflow-hidden bg-white shadow-md shadow-black/10">
//               <Image source={item.source} className="w-full h-48" />
//               <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
//                 <Text className="text-sm font-semibold text-white">{item.caption}</Text>
//               </View>
//             </View>
//           )}
//         />

//         {/* BOQ Snapshot */}
//         <SectionTitle
//           title="BOQ Breakdown"
//           right={
//             <View className="bg-slate-100 px-3 py-1.5 rounded-full">
//               <Text className="text-xs font-semibold text-slate-600">{data.boqSnapshot.totalItems} items</Text>
//             </View>
//           }
//         />
//         <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
//           {data.boqSnapshot.categories.map((c, idx) => (
//             <BOQItem key={c.id} item={c} isLast={idx === data.boqSnapshot.categories.length - 1} />
//           ))}
//           <View className=" pt-4 border-t-2 border-slate-200 flex-row justify-between items-center">
//             <Text className="text-base font-bold text-slate-900">Total Amount</Text>
//             <Text style={{ color: '#0066FF' }} className="text-xl font-extrabold">{currencyFormatter(totalBoqAmount)}</Text>
//           </View>
//         </View>

//         {/* Budget Summary */}
//         <SectionTitle title="Budget Analysis" />
//         <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
//           <View className="flex-row mb-4">
//             <View className="flex-1">
//               <Text className="text-sm text-slate-500 mb-1.5">Baseline</Text>
//               <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.baseline)}</Text>
//             </View>
//             <View className="w-0.5 bg-slate-200 mx-4" />
//             <View className="flex-1">
//               <Text className="text-sm text-slate-500 mb-1.5">Revised</Text>
//               <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.revised)}</Text>
//             </View>
//           </View>
//           <View className="bg-slate-50 rounded-xl p-4">
//             <Text className="text-sm text-slate-500 mb-2">Variance</Text>
//             <View className="flex-row items-center justify-between">
//               <Text className={`text-xl font-extrabold ${budgetDelta > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
//                 {budgetDelta >= 0 ? '+' : ''}{currencyFormatter(Math.abs(budgetDelta))}
//               </Text>
//               <View className={`px-3 py-1.5 rounded-full ${budgetDelta > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
//                 <Text className={`text-xs font-bold ${budgetDelta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
//                   {budgetDelta >= 0 ? '+' : ''}{budgetVariancePercent}%
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Documents */}
//         <SectionTitle title="Documents" />
//         <View className="space-y-2">
//           {data.documents.map((doc) => (
//             <DocumentRow key={doc.id} doc={doc} />
//           ))}
//         </View>

//         {/* Approvals */}
//         <SectionTitle title="Approval Status" />
//         <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
//           <ApprovalBadge approved={data.approvalStatus.consultantApproved} label="Consultant" />
//           <ApprovalBadge approved={data.approvalStatus.siteManagerApproved} label="Site Manager" />
//           <ApprovalBadge approved={clientApproved} label="Client" />

//           {/* Action Buttons */}
//           {!clientApproved ? (
//             <View className=" space-y-2.5">
//               <TouchableOpacity 
//                 style={{ backgroundColor: '#0066FF' }}
//                 className="rounded-xl py-4 items-center shadow-lg flex-row justify-center"
//                 onPress={onApproveByClient}
//               >
//                 <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
//                 <Text className="text-white text-base font-bold ml-2">Approve Plan</Text>
//               </TouchableOpacity>

//             </View>
//           ) : (
//             <View className=" bg-emerald-100 rounded-xl p-4 flex-row items-center">
//               <MaterialCommunityIcons name="check-circle" size={28} color="#047857" />
//               <Text className="flex-1 text-sm font-semibold text-emerald-800 ml-3">
//                 Plan approved! Ready for task allocation.
//               </Text>
//             </View>
//           )}
//         </View>

//         <View className="h-10" />
//       </ScrollView>
//     </View>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * PlansScreen - List view for all plans in the system
 * Fetches from /api/plans (with optional projectId filter)
 */

// ---------- Utility helpers ----------
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-QA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ---------- Components ----------
function PlanCard({ plan, onPress }) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm shadow-black/5"
      onPress={() => onPress(plan._id)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-slate-900 flex-1 pr-2">{plan.name}</Text>
        <View className={`px-2 py-1 rounded-full ${plan.isArchived ? 'bg-red-100' : 'bg-emerald-100'}`}>
          <Text className={`text-xs font-semibold ${plan.isArchived ? 'text-red-600' : 'text-emerald-600'}`}>
            {plan.isArchived ? 'Archived' : 'Active'}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center mb-1">
        <MaterialCommunityIcons name="calendar" size={16} color="#6b7280" />
        <Text className="text-sm text-slate-500 ml-1.5">{formatDate(plan.uploadedAt)}</Text>
      </View>
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="account" size={16} color="#6b7280" />
        <Text className="text-sm text-slate-500 ml-1.5">
          Uploaded by {plan.uploadedBy?.name || 'Unknown'}
        </Text>
      </View>
      {plan.projectId && (
        <View className="flex-row items-center mt-1">
          <MaterialCommunityIcons name="folder" size={16} color="#6b7280" />
          <Text className="text-sm text-slate-500 ml-1.5">
            Project: {plan.projectId.name}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ---------- Main Screen ----------
export default function PlansScreen({ route, navigation }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = `${process.env.BASE_API_URL}`;

  const projectId = route?.params?.projectId; // Optional filter

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken'); // Adjust key as per your auth
        const url = `${API_BASE}/api/plan${projectId ? `?projectId=${projectId}` : ''}`; // Replace with your Next.js URL
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setPlans(result.data || []);
        } else {
          throw new Error(result.message || "Failed to fetch plans");
        }
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", `Failed to load plans: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [projectId]);

  const handlePlanPress = (planId) => {
    navigation.navigate('PlanDetail', { id: planId });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0066FF" />
        <Text className="mt-2 text-slate-600">Loading plans...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
        <Text className="mt-2 text-slate-600 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-slate-900 mb-4">
          All Plans ({plans.length})
        </Text>
        {plans.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialCommunityIcons name="file-cad" size={64} color="#d1d5db" />
            <Text className="text-lg text-slate-500 mt-2">No plans available</Text>
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PlanCard plan={item} onPress={handlePlanPress} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}