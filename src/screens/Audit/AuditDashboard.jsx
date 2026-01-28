

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// /* ======================================================
//    MODULE CONFIG
// ====================================================== */

// const MODULE_META = {
//   milestone: { icon: "flag-outline", color: "#059669" },
//   work_progress: { icon: "time-outline", color: "#2563EB" },
//   snag: { icon: "alert-circle-outline", color: "#DC2626" },
//   material: { icon: "cube-outline", color: "#7C3AED" },
//   transaction: { icon: "card-outline", color: "#0F766E" },
//   risk: { icon: "warning-outline", color: "#D97706" },
//   handover: { icon: "checkmark-done-outline", color: "#4C1D95" },
// };

// /* ======================================================
//    COMBINED AUDIT DATA (ALL MODULES)
// ====================================================== */

// const AUDIT_DATA = [
//   {
//     id: "a1",
//     module: "milestone",
//     title: "Foundation milestone completed",
//     by: "Admin",
//     role: "Admin",
//     time: "22 Jan 2026 • 6:30 PM",
//     details: "All foundation subtasks were completed successfully.",
//   },
//   {
//     id: "a2",
//     module: "work_progress",
//     title: "Daily work progress logged",
//     by: "Ravi Kumar",
//     role: "Site Engineer",
//     time: "23 Jan 2026 • 5:30 PM",
//     details: "10% progress recorded with footing and PCC work photos.",
//   },
//   {
//     id: "a3",
//     module: "material",
//     title: "Cement material purchased",
//     by: "Admin",
//     role: "Admin",
//     time: "23 Jan 2026 • 9:00 AM",
//     details: "100 bags of cement added to inventory.",
//   },
//   {
//     id: "a4",
//     module: "transaction",
//     title: "Material payment recorded",
//     by: "Admin",
//     role: "Admin",
//     time: "23 Jan 2026 • 9:15 AM",
//     details: "₹42,000 paid for cement purchase.",
//   },
//   {
//     id: "a5",
//     module: "snag",
//     title: "Snag marked as fixed",
//     by: "Amit Patil",
//     role: "Contractor",
//     time: "24 Jan 2026 • 11:10 AM",
//     details: "Wall crack issue resolved with proof photos.",
//   },
//   {
//     id: "a6",
//     module: "risk",
//     title: "Schedule risk escalated to High",
//     by: "Suresh Mehta",
//     role: "Project Manager",
//     time: "25 Jan 2026 • 3:45 PM",
//     details:
//       "No progress logged for 4 days. Mitigation plan initiated.",
//   },
//   {
//     id: "a7",
//     module: "transaction",
//     title: "Labour payment recorded",
//     by: "Admin",
//     role: "Admin",
//     time: "26 Jan 2026 • 1:00 PM",
//     details: "₹18,000 paid towards slab labour charges.",
//   },
//   {
//     id: "a8",
//     module: "handover",
//     title: "Client approved project handover",
//     by: "Client",
//     role: "Client",
//     time: "27 Jan 2026 • 6:00 PM",
//     details:
//       "All milestones completed and no critical snags or risks open.",
//   },
// ];

// /* ======================================================
//    SCREEN
// ====================================================== */

// const AuditDashboard = ({ projectId }) => {
//   // const { projectId } = route.params || {};
//   console.log("projectId", projectId);
//   const [expanded, setExpanded] = useState(null);

//   const renderItem = ({ item }) => {
//     const meta = MODULE_META[item.module];
//     const isOpen = expanded === item.id;

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         activeOpacity={0.85}
//         onPress={() => setExpanded(isOpen ? null : item.id)}
//       >
//         <View style={styles.row}>
//           <View
//             style={[
//               styles.iconWrap,
//               { backgroundColor: meta.color + "15" },
//             ]}
//           >
//             <Ionicons
//               name={meta.icon}
//               size={20}
//               color={meta.color}
//             />
//           </View>

//           <View style={styles.content}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.meta}>
//               {item.by} • {item.role}
//             </Text>
//             <Text style={styles.time}>{item.time}</Text>

//             {isOpen && (
//               <View style={styles.details}>
//                 <Text style={styles.detailsText}>
//                   {item.details}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.pageTitle}>Audit Timeline</Text>

//       <FlatList
//         data={AUDIT_DATA}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 24 }}
//       />
//     </SafeAreaView>
//   );
// };

// export default AuditDashboard;

// /* ======================================================
//    STYLES
// ====================================================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     paddingHorizontal: 16,
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginVertical: 16,
//     color: "#020617",
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   iconWrap: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   content: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#020617",
//   },
//   meta: {
//     fontSize: 13,
//     color: "#475569",
//     marginTop: 2,
//   },
//   time: {
//     fontSize: 12,
//     color: "#94A3B8",
//     marginTop: 2,
//   },
//   details: {
//     marginTop: 10,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#E2E8F0",
//   },
//   detailsText: {
//     fontSize: 14,
//     color: "#334155",
//     lineHeight: 20,
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
/* ======================================================
   MODULE CONFIG
====================================================== */

const MODULE_META = {
  milestone: { icon: "flag-outline", color: "#059669" },
  work_progress: { icon: "time-outline", color: "#2563EB" },
  snag: { icon: "alert-circle-outline", color: "#DC2626" },
  material: { icon: "cube-outline", color: "#7C3AED" },
  transaction: { icon: "card-outline", color: "#0F766E" },
  risk: { icon: "warning-outline", color: "#D97706" },
  handover: { icon: "checkmark-done-outline", color: "#4C1D95" },
};

/* ======================================================
   SCREEN
====================================================== */

const AuditDashboard = ({ projectId }) => {
  const [auditData, setAuditData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /* ==============================
     FETCH FUNCTION
  ============================== */
  const fetchAudit = async (isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      isRefresh ? setRefreshing(true) : setLoading(true);

      const res = await fetch(
        `${process.env.BASE_API_URL}/api/audit?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();

      if (!json.success) {
        throw new Error("Audit fetch failed");
      }

      setAuditData(json.data || []);
      setError(null);
    } catch (err) {
      console.error("Audit error:", err);
      setError("Unable to load audit timeline");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  /* ==============================
     INITIAL LOAD
  ============================== */
  useEffect(() => {
    if (projectId) {
      fetchAudit();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  /* ==============================
     RENDER ITEM
  ============================== */
  const renderItem = ({ item }) => {
    const meta = MODULE_META[item.module];
    const isOpen = expanded === item.id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => setExpanded(isOpen ? null : item.id)}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: meta.color + "15" },
            ]}
          >
            <Ionicons
              name={meta.icon}
              size={20}
              color={meta.color}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.meta}>
              {item.performedBy || "System"} • {item.role || "User"}
            </Text>

            <Text style={styles.time}>
              {new Date(item.time).toLocaleString()}
            </Text>

            {isOpen && (
              <View style={styles.details}>
                <Text style={styles.detailsText}>
                  {item.details || "No additional details"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ==============================
     LOADING STATE
  ============================== */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12 }}>
          Loading audit timeline...
        </Text>
      </SafeAreaView>
    );
  }

  /* ==============================
     ERROR STATE
  ============================== */
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchAudit()}
          style={styles.retryBtn}
        >
          <Text style={{ color: "#2563EB" }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* ==============================
     MAIN UI
  ============================== */
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Audit Timeline</Text>

      <FlatList
        data={auditData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAudit(true)}
            colors={["#2563EB"]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No audit activity found.
          </Text>
        }
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: auditData.length === 0 ? 1 : 0,
        }}
      />
    </SafeAreaView>
  );
};

export default AuditDashboard;

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 16,
    color: "#020617",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#020617",
  },
  meta: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  details: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  detailsText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: "#64748B",
  },
  retryBtn: {
    marginTop: 12,
  },
});
