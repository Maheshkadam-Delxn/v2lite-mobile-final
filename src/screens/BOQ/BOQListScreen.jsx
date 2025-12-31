

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
                        <Text style={styles.infoLabel}>Versions</Text>
                        <Text style={styles.infoValue}>
                          {boq.boqVersion?.length || 0} items
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
