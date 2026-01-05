import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.BASE_API_URL}`;

export default function BOQDetailScreen({ route, navigation }) {
  const { boqData, isClientView = false } = route.params; // Add isClientView flag

  if (!boqData) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="file-text" size={64} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No BOQ Data Found</Text>
        <Text style={styles.emptySubtitle}>Please go back and try again</Text>
      </View>
    );
  }

  /* ---------------- Versions ---------------- */
  const versions = boqData.boqVersion || [];
  const latestVersion = versions[versions.length - 1];
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);

  /* ---------------- Reject Modal ---------------- */
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  /* ---------------- Add Version Bottom Sheet ---------------- */
  const [showAddVersionModal, setShowAddVersionModal] = useState(false);
  const [newLaborCost, setNewLaborCost] = useState(
    latestVersion?.laborCost?.toString() || "0"
  );
  const [newMaterials, setNewMaterials] = useState(
    latestVersion?.materials?.map((m) => ({ ...m })) || []
  );

  /* ---------------- Status ---------------- */
  const statusConfig = {
    approved: {
      bg: "#ECFDF5",
      text: "#059669",
      icon: "check-circle",
      border: "#A7F3D0",
    },
    draft: {
      bg: "#FEF9C3",
      text: "#CA8A04",
      icon: "edit-3",
      border: "#FDE68A",
    },
    rejected: {
      bg: "#FEE2E2",
      text: "#DC2626",
      icon: "x-circle",
      border: "#FECACA",
    },
  };

  const statusStyle = statusConfig[boqData.status] || statusConfig.draft;

  /* ---------------- Calculate Totals ---------------- */
  const materialTotal = selectedVersion.materials.reduce(
    (sum, m) => sum + (m.qty || 0) * (m.rate || 0),
    0
  );
  const laborCost = selectedVersion.laborCost || 0;
  const grandTotal = materialTotal + laborCost;

  /* ---------------- Approve ---------------- */
  const handleApprove = async () => {
    Alert.alert(
      "Approve BOQ",
      "Are you sure you want to approve this BOQ?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              const res = await fetch(`${API_URL}/api/boq/${boqData._id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  status: "approved",
                  versionNumber: selectedVersion.versionNumber,
                }),
              });

              if (res.ok) {
                Alert.alert("Success", "BOQ Approved Successfully");
                navigation.goBack();
              } else {
                Alert.alert("Error", "Approval failed. Please try again.");
              }
            } catch {
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  /* ---------------- Reject ---------------- */
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Reason Required", "Please enter a rejection reason");
      return;
    }

    try {
      setRejecting(true);
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/boq/${boqData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      if (res.ok) {
        Alert.alert("Rejected", "BOQ rejected successfully");
        setShowRejectModal(false);
        setRejectionReason("");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Reject failed. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setRejecting(false);
    }
  };

  /* ---------------- Material Handlers (Admin only) ---------------- */
  const updateMaterial = (index, field, value) => {
    const updated = [...newMaterials];
    updated[index][field] =
      field === "qty" || field === "rate" ? Number(value) : value;
    setNewMaterials(updated);
  };

  const addMaterial = () => {
    setNewMaterials([
      ...newMaterials,
      { name: "", qty: 0, unit: "", rate: 0 },
    ]);
  };

  const removeMaterial = (index) => {
    const updated = [...newMaterials];
    updated.splice(index, 1);
    setNewMaterials(updated);
  };

  /* ---------------- Create New Version (Admin only) ---------------- */
  const handleAddNewVersion = async () => {
    if (newMaterials.length === 0) {
      Alert.alert("Error", "Add at least one material");
      return;
    }

    const payload = {
      materials: newMaterials.map((m) => ({
        name: m.name,
        qty: Number(m.qty),
        unit: m.unit,
        rate: Number(m.rate),
      })),
      laborCost: Number(newLaborCost),
    };

    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/api/boq/${boqData._id}/version`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert("Success", "New BOQ version created");
        setShowAddVersionModal(false);
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to create version");
      }
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  /* ---------------- Client Actions ---------------- */
  const handlePrint = () => {
    Alert.alert(
      "Print / Save",
      "This feature would generate a PDF version of this BOQ.",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Share",
      "Share this BOQ with others.",
      [{ text: "OK", style: "default" }]
    );
  };

  /* ---------------- Download PDF ---------------- */
  const handleDownloadPDF = () => {
    Alert.alert(
      "Download PDF",
      "PDF download started. This feature would generate a downloadable PDF file.",
      [{ text: "OK", style: "default" }]
    );
  };

  /* ---------------- Back Handler ---------------- */
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with background image */}
      <Header
        title="BOQ Details"
       
        onRightIconPress={isClientView ? handleShare : handleDownloadPDF}
        backgroundImage={require('../../assets/header.png')}
        titleColor="white"
        iconColor="white"
        showBackButton={true}
        onBackPress={handleBack}
      />
      
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* BOQ INFO CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Feather name="file-text" size={24} color="#1E293B" />
              <View style={styles.headerTextContainer}>
                <Text style={styles.boqTitle}>{boqData.boqName}</Text>
                <Text style={styles.boqSubtitle}>
                  {boqData.projectName || "Bill of Quantities"}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.border,
                },
              ]}
            >
              <Feather name={statusStyle.icon} size={14} color={statusStyle.text} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {boqData.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          {/* Additional Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="maximize" size={14} color="#64748B" />
              <Text style={styles.infoItemLabel}>Area:</Text>
              <Text style={styles.infoItemValue}>{boqData.builtUpArea || "0"} sqft</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Feather name="calendar" size={14} color="#64748B" />
              <Text style={styles.infoItemLabel}>Date:</Text>
              <Text style={styles.infoItemValue}>
                {new Date(boqData.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Feather name="user" size={14} color="#64748B" />
              <Text style={styles.infoItemLabel}>Client:</Text>
              <Text style={styles.infoItemValue}>
                {boqData.clientName || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* VERSION SELECTOR */}
        {versions.length > 1 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="layers" size={20} color="#1E293B" />
              <Text style={styles.sectionTitle}>Version History</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.versionScroll}
            >
              {versions.map((v) => (
                <TouchableOpacity
                  key={v.versionNumber}
                  onPress={() => setSelectedVersion(v)}
                  style={[
                    styles.versionChip,
                    selectedVersion.versionNumber === v.versionNumber &&
                      styles.versionChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.versionChipText,
                      selectedVersion.versionNumber === v.versionNumber &&
                        styles.versionChipTextActive,
                    ]}
                  >
                    v{v.versionNumber}
                  </Text>
                  {v.versionNumber === latestVersion.versionNumber && (
                    <View style={styles.latestBadge}>
                      <Text style={styles.latestBadgeText}>Latest</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* MATERIALS SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>
              Materials {versions.length > 1 && `(v${selectedVersion.versionNumber})`}
            </Text>
          </View>
          
          {selectedVersion.materials.map((m, i) => (
            <View key={i} style={styles.materialCard}>
              <View style={styles.materialHeader}>
                <View style={styles.materialNumberBadge}>
                  <Text style={styles.materialNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.materialName}>{m.name}</Text>
              </View>
              
              <View style={styles.materialDetails}>
                <View style={styles.materialDetailItem}>
                  <Text style={styles.materialDetailLabel}>Quantity</Text>
                  <Text style={styles.materialDetailValue}>
                    {m.qty} {m.unit}
                  </Text>
                </View>
                <View style={styles.materialDivider} />
                <View style={styles.materialDetailItem}>
                  <Text style={styles.materialDetailLabel}>Rate</Text>
                  <Text style={styles.materialDetailValue}>QAR {m.rate?.toFixed(2)}</Text>
                </View>
                <View style={styles.materialDivider} />
                <View style={styles.materialDetailItem}>
                  <Text style={styles.materialDetailLabel}>Total</Text>
                  <Text style={styles.materialDetailValueHighlight}>
                    QAR {(m.qty * m.rate).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* COST SUMMARY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>Cost Summary</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Materials Cost</Text>
            <Text style={styles.costValue}>QAR {materialTotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Labor Cost</Text>
            <Text style={styles.costValue}>QAR {laborCost.toFixed(2)}</Text>
          </View>

          <View style={styles.costDivider} />

          <View style={styles.totalCard}>
            <View style={styles.totalIconContainer}>
              <Feather name="trending-up" size={24} color="#0066FF" />
            </View>
            <View style={styles.totalTextContainer}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>QAR {grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* ADDITIONAL INFO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>Additional Information</Text>
          </View>
          
          <View style={styles.additionalInfo}>
            <View style={styles.infoRowItem}>
              <View style={styles.infoRowItemLabel}>
                <Feather name="file-text" size={16} color="#64748B" />
                <Text style={styles.infoLabel}>BOQ ID:</Text>
              </View>
              <Text style={styles.infoValue}>{boqData.boqId || boqData._id?.slice(-8)}</Text>
            </View>
            
            <View style={styles.infoRowItem}>
              <View style={styles.infoRowItemLabel}>
                <Feather name="calendar" size={16} color="#64748B" />
                <Text style={styles.infoLabel}>Created:</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(boqData.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            
            <View style={styles.infoRowItem}>
              <View style={styles.infoRowItemLabel}>
                <Feather name="clock" size={16} color="#64748B" />
                <Text style={styles.infoLabel}>Last Updated:</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(boqData.updatedAt || boqData.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            
            {boqData.rejectionReason && boqData.status === 'rejected' && (
              <View style={[styles.infoRowItem, styles.rejectionReasonItem]}>
                <View style={styles.infoRowItemLabel}>
                  <Feather name="alert-circle" size={16} color="#DC2626" />
                  <Text style={[styles.infoLabel, styles.rejectionLabel]}>Rejection Reason:</Text>
                </View>
                <Text style={[styles.infoValue, styles.rejectionValue]}>
                  {boqData.rejectionReason}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ACTIONS - DIFFERENT FOR CLIENT VS ADMIN */}
        {isClientView ? (
          /* CLIENT ACTIONS */
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrint}
            >
              <Feather name="printer" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Print / Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Feather name="share-2" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ADMIN ACTIONS */
          <>
            {selectedVersion.status === "draft" && (
              <View style={styles.actionSection}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => setShowRejectModal(true)}
                >
                  <Feather name="x-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={handleApprove}
                >
                  <Feather name="check-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedVersion.status !== "draft" && (
              <TouchableOpacity
                style={styles.newVersionButton}
                onPress={() => {
                  setNewLaborCost(latestVersion.laborCost.toString());
                  setNewMaterials(latestVersion.materials.map((m) => ({ ...m })));
                  setShowAddVersionModal(true);
                }}
              >
                <Feather name="plus-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Add New Version</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ---------------- Reject Modal (Admin only) ---------------- */}
      {!isClientView && (
        <Modal
          visible={showRejectModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRejectModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Feather name="alert-circle" size={24} color="#DC2626" />
                </View>
                <Text style={styles.modalTitle}>Reject BOQ</Text>
                <Text style={styles.modalSubtitle}>
                  Please provide a reason for rejection
                </Text>
              </View>

              <TextInput
                style={styles.textArea}
                placeholder="Enter rejection reason..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={rejectionReason}
                onChangeText={setRejectionReason}
                textAlignVertical="top"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalRejectButton,
                    rejecting && styles.modalRejectButtonDisabled,
                  ]}
                  onPress={handleReject}
                  disabled={rejecting}
                >
                  <Text style={styles.modalRejectButtonText}>
                    {rejecting ? "Rejecting..." : "Reject BOQ"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ---------------- Add Version Modal (Admin only) ---------------- */}
      {!isClientView && (
        <Modal
          visible={showAddVersionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddVersionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Feather name="layers" size={24} color="#0066FF" />
                </View>
                <Text style={styles.modalTitle}>Add New BOQ Version</Text>
                <Text style={styles.modalSubtitle}>
                  Create a new version with updated materials and costs
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Materials */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Materials</Text>
                  
                  {newMaterials.map((m, index) => (
                    <View key={index} style={styles.materialEditCard}>
                      <View style={styles.materialEditHeader}>
                        <Text style={styles.materialEditNumber}>
                          Material {index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeMaterial(index)}
                          style={styles.removeButton}
                        >
                          <Feather name="trash-2" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Material name"
                          placeholderTextColor="#94A3B8"
                          value={m.name}
                          onChangeText={(v) => updateMaterial(index, "name", v)}
                        />
                      </View>

                      <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabel}>Quantity</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="0"
                            placeholderTextColor="#94A3B8"
                            keyboardType="numeric"
                            value={m.qty.toString()}
                            onChangeText={(v) => updateMaterial(index, "qty", v)}
                          />
                        </View>

                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabel}>Unit</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="kg, m, etc"
                            placeholderTextColor="#94A3B8"
                            value={m.unit}
                            onChangeText={(v) => updateMaterial(index, "unit", v)}
                          />
                        </View>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.inputLabel}>Rate (QAR)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0.00"
                          placeholderTextColor="#94A3B8"
                          keyboardType="numeric"
                          value={m.rate.toString()}
                          onChangeText={(v) => updateMaterial(index, "rate", v)}
                        />
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addMaterialButton}
                    onPress={addMaterial}
                  >
                    <Feather name="plus" size={20} color="#0066FF" />
                    <Text style={styles.addMaterialButtonText}>Add Material</Text>
                  </TouchableOpacity>
                </View>

                {/* Labor Cost */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Labor Cost</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Total Labor Cost (QAR)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={newLaborCost}
                      onChangeText={setNewLaborCost}
                    />
                  </View>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowAddVersionModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCreateButton}
                  onPress={handleAddNewVersion}
                >
                  <Feather name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.modalCreateButtonText}>Create Version</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
   // Overlap with header background
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },

  /* Header Card */
  headerCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  boqTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  boqSubtitle: {
    fontSize: 14,
    color: "#64748B",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* Info Row */
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  infoItemLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  infoItemValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  infoDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E2E8F0",
  },

  /* Section */
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  /* Version Selector */
  versionScroll: {
    flexDirection: "row",
  },
  versionChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  versionChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  versionChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  versionChipTextActive: {
    color: "#3B82F6",
  },
  latestBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  latestBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3B82F6",
  },

  /* Material Card */
  materialCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  materialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  materialNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  materialNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B82F6",
  },
  materialName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  materialDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialDetailItem: {
    flex: 1,
  },
  materialDetailLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  materialDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  materialDetailValueHighlight: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0066FF",
  },
  materialDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },

  /* Cost Summary */
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 15,
    color: "#64748B",
  },
  costValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  costDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  totalTextContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0066FF",
  },

  /* Additional Info */
  additionalInfo: {
    gap: 12,
  },
  infoRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoRowItemLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "right",
    flex: 1,
  },
  rejectionReasonItem: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectionLabel: {
    color: "#DC2626",
    fontWeight: "600",
  },
  rejectionValue: {
    color: "#DC2626",
  },

  /* Actions */
  actionSection: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newVersionButton: {
    flexDirection: "row",
    backgroundColor: "#0066FF",
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  printButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
  textArea: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1E293B",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  modalRejectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#DC2626",
  },
  modalRejectButtonDisabled: {
    opacity: 0.6,
  },
  modalRejectButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Bottom Sheet */
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  /* Form */
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  /* Material Edit Card */
  materialEditCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  materialEditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  materialEditNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  removeButton: {
    padding: 8,
  },
  addMaterialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderStyle: "dashed",
  },
  addMaterialButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0066FF",
  },
  modalCreateButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0066FF",
    gap: 8,
  },
  modalCreateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});