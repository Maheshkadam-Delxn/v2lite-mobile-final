


import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = `${process.env.BASE_API_URL}`;

// Exchange rate: 1 INR ≈ 0.0402 QAR (as of December 16, 2025)
const INR_TO_QAR = 0.0402;

const convertToQAR = (inrAmount) => {
  if (typeof inrAmount === 'number') {
    return (inrAmount * INR_TO_QAR).toFixed(2);
  }
  return '0.00';
};

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

  // Handle approve action
  const handleApprove = async() => {
    console.log("Approving BOQ:", boqData._id);
    const data = await AsyncStorage.getItem('userData');
    const admin =JSON.parse(data);
    console.log("d",admin);
     const canAccessUserManagement =
  admin?.role === "admin" ||
  (admin?.permissions?.boq &&
    (
     admin?.permissions?.boq.update || admin?.permissions?.boq.view ));

    console.log("data is ",canAccessUserManagement);
    if (!canAccessUserManagement) {
      alert("You do not have permission to approve this BOQ.");
      return;
    }
     const token =  await AsyncStorage.getItem('userToken');
       const response = await fetch(`${API_URL}/api/boq/${boqData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'approved',
         
        })
      });
      
      const result = await response.json();
      console.log(result);
  if (response.ok) {
        Alert.alert("Success", "BOQ has been approved successfully!");
        // Navigate back or refresh data
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Failed to approve BOQ");
      } 
  };

  // Handle reject action
  const handleReject = () => {
    // TODO: Implement reject logic (API call, state update, etc.)
    console.log("Rejecting BOQ:", boqData.id);
    // Show success message or update UI
    alert("BOQ has been rejected!");
    navigation.goBack(); // Or update local state
  };

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
              <DetailRow label="Rate" value={`QAR ${convertToQAR(mat.rate)}`} />
              <DetailRow label="Amount" value={`QAR ${convertToQAR(mat.amount)}`} />
            </View>
          ))}
        </View>

        {/* Cost Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#0066FF" />
            <Text style={styles.sectionTitle}>Cost Summary</Text>
          </View>

          <DetailRow label="Material Cost" value={`QAR ${convertToQAR(boqData.totalMaterialCost)}`} />
          <DetailRow label="Labor Cost" value={`QAR ${convertToQAR(boqData.laborCost)}`} />
          <DetailRow label="Misc Cost" value={`QAR ${convertToQAR(boqData.miscCost)}`} />
          <DetailRow label="Contingency" value={`${boqData.contingency}%`} />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>QAR {convertToQAR(boqData.totalCost)}</Text>
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

        {/* Conditional Buttons */}
        {boqData.status === "draft" ? (
          // Show Approve/Reject buttons for draft status
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={handleReject}
            >
              <Feather name="x-circle" size={18} color="white" />
              <Text style={styles.actionButtonText}>Reject BOQ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={handleApprove}
            >
              <Feather name="check-circle" size={18} color="white" />
              <Text style={styles.actionButtonText}>Approve BOQ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show Edit button for non-draft status
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("BOQcreateScreen", { editData: boqData })
            }
          >
            <Feather name="edit-3" size={18} color="white" />
            <Text style={styles.editButtonText}>Edit BOQ</Text>
          </TouchableOpacity>
        )}
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

  // Action Buttons Container
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },

  // Common button style
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  // Specific button styles
  rejectButton: {
    backgroundColor: "#EF4444",
  },
  
  approveButton: {
    backgroundColor: "#10B981",
  },

  actionButtonText: {
    color: "white",
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
  },

  // Edit button (for non-draft status)
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