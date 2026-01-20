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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const API_URL = `${process.env.BASE_API_URL}`;

const BOQClientScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const project = route.params?.project;
  
  const [boqList, setBoqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState(null);

  // -------------------------------------------------------------------
  // 📌 Fetch BOQs for the project
  // -------------------------------------------------------------------
  const fetchBOQs = async (projectId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const res = await fetch(
        `${API_URL}/api/boq?projectId=${projectId}`,
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
        setBoqList([]);
      }
    } catch (err) {
      console.log("BOQ FETCH ERROR →", err);
      setBoqList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project && project._id) {
      setProjectDetails(project);
      fetchBOQs(project._id);
    }
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
  // 📌 Navigate to BOQ Details
  // -------------------------------------------------------------------
  const handleViewDetails = (boq) => {
    // Navigate to BOQDetailScreen with all BOQ data
    navigation.navigate("BOQClientDetailScreen", { 
      boqData: boq,
      isClientView: true // Flag to indicate this is client view
    });
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
        No BOQs have been created for this project yet.
      </Text>
    </View>
  );

  
  const BOQCard = ({ boq }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewDetails(boq)}
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
              {boq.builtUpArea || "0"} sqft
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
              {boq.boqVersion?.length || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text style={styles.dateText}>
            Created: {new Date(boq.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.viewDetails}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Feather name="arrow-right" size={16} color="#0066FF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // -------------------------------------------------------------------
  // 📌 MAIN RENDER
  // -------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      

      {/* Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loaderText}>Loading BOQs...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Available BOQs</Text>
          
          {boqList.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={styles.cardsContainer}>
              {boqList.map((boq) => (
                <BOQCard key={boq._id} boq={boq} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// -------------------------------------------------------------------
// 📌 STYLES
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB" 
  },
  
  headerContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerLeft: { 
    flex: 1 
  },
  headerTitle: { 
    fontSize: 26, 
    fontFamily: "Urbanist-Bold", 
    color: "#111827" 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: "#6B7280",
    marginTop: 4 
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  content: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    paddingBottom: 40 
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist-Bold",
    color: "#111827",
    marginBottom: 16,
  },

  cardsContainer: { gap: 16 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12 
  },
  cardTitle: { 
    fontSize: 18, 
    fontFamily: "Urbanist-Bold", 
    color: "#111827", 
    flex: 1, 
    marginRight: 10 
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: { 
    fontSize: 11, 
    fontFamily: "Urbanist-SemiBold" 
  },

  infoGrid: { 
    flexDirection: "row", 
    gap: 16, 
    marginVertical: 12 
  },
  infoItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
    flex: 1 
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: { 
    fontSize: 12, 
    color: "#9CA3AF" 
  },
  infoValue: { 
    fontSize: 15, 
    fontFamily: "Urbanist-Bold",
    marginTop: 2 
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 8,
  },
  dateContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  dateText: { 
    fontSize: 13, 
    color: "#6B7280" 
  },

  viewDetails: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  viewDetailsText: { 
    color: "#0066FF", 
    fontFamily: "Urbanist-SemiBold" 
  },

  emptyContainer: { 
    marginTop: 80, 
    alignItems: "center" 
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { 
    fontSize: 22, 
    fontFamily: "Urbanist-Bold", 
    marginBottom: 8 
  },
  emptySubtitle: { 
    fontSize: 14, 
    color: "#6B7280", 
    textAlign: "center", 
    marginBottom: 20 
  },
});

export default BOQClientScreen;