import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";

export default function BOQDetailScreen({ route, navigation }) {
  const { boqData } = route.params;

  if (!boqData) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "Urbanist-Bold" }}>No BOQ Data Found</Text>
      </View>
    );
  }

  // Status config
  const statusColors = {
    approved: { bg: "#D1FAE5", text: "#10B981" },
    draft: { bg: "#FEF3C7", text: "#F59E0B" },
    pending: { bg: "#F3F4F6", text: "#6B7280" },
    rejected: { bg: "#FEE2E2", text: "#EF4444" },
  };

  const statusStyle = statusColors[boqData.status] || statusColors.pending;

  return (
    <View style={styles.container}>
      <Header title="BOQ Details" showBackButton={true} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + Status */}
        <View style={styles.headerBox}>
          <Text style={styles.title}>{boqData.boqName || "BOQ"}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {boqData.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="home" size={20} color="#0066FF" />
            <Text style={styles.sectionTitle}>Project Information</Text>
          </View>

          <DetailRow label="Built-up Area" value={`${boqData.builtUpArea} sqft`} />
          <DetailRow label="Structural Type" value={boqData.structuralType || "—"} />
          <DetailRow label="Foundation Type" value={boqData.foundationType || "—"} />
          <DetailRow
            label="Version"
            value={`v${boqData.version} ${boqData.isLatest ? "(Latest)" : ""}`}
          />
        </View>

        {/* Material List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color="#0066FF" />
            <Text style={styles.sectionTitle}>Material Requirements</Text>
          </View>

          {boqData.materials.length === 0 && (
            <Text style={styles.emptyText}>No materials added</Text>
          )}

          {boqData.materials.map((mat, index) => (
            <View key={index} style={styles.materialCard}>
              <Text style={styles.materialTitle}>
                {index + 1}. {mat.name}
              </Text>

              <DetailRow label="Quantity" value={`${mat.qty} ${mat.unit}`} />
              <DetailRow label="Rate" value={`₹ ${mat.rate}`} />
              <DetailRow label="Amount" value={`₹ ${mat.amount}`} />
            </View>
          ))}
        </View>

        {/* Cost Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#0066FF" />
            <Text style={styles.sectionTitle}>Cost Summary</Text>
          </View>

          <DetailRow label="Material Cost" value={`₹ ${boqData.totalMaterialCost}`} />
          <DetailRow label="Labor Cost" value={`₹ ${boqData.laborCost}`} />
          <DetailRow label="Misc Cost" value={`₹ ${boqData.miscCost}`} />
          <DetailRow label="Contingency" value={`${boqData.contingency}%`} />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>₹ {boqData.totalCost}</Text>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <DetailRow
            label="Created At"
            value={new Date(boqData.createdAt).toLocaleDateString()}
          />
          <DetailRow
            label="Updated At"
            value={new Date(boqData.updatedAt).toLocaleDateString()}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("BOQcreateScreen", { editData: boqData })
          }
        >
          <Feather name="edit-3" size={18} color="white" />
          <Text style={styles.editButtonText}>Edit BOQ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Reusable Row Component
const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerBox: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Urbanist-Bold",
    color: "#111827",
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  statusText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 12,
  },

  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "Urbanist-Bold",
    fontSize: 18,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  label: {
    fontFamily: "Urbanist-Medium",
    fontSize: 15,
    color: "#6B7280",
  },
  value: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 15,
    color: "#111827",
  },

  materialCard: {
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    marginBottom: 10,
  },
  materialTitle: {
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
    marginBottom: 6,
  },

  emptyText: {
    fontFamily: "Urbanist-Regular",
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 10,
  },

  totalBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontFamily: "Urbanist-Bold",
    fontSize: 18,
    color: "#0369A1",
  },
  totalValue: {
    fontFamily: "Urbanist-Bold",
    fontSize: 18,
    color: "#0284C7",
  },

  editButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
  },
});
