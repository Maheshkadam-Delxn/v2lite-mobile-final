import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#3B82F6",
  background: "#F9FAFB",
  white: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  gray: "#9CA3AF",
  success: "#22C55E",
  danger: "#EF4444",
  info: "#38BDF8",
};

const MaterialDashboard = () => {
  const [inventoryTab, setInventoryTab] = useState("Inventory");

  // Example dummy data for all tabs
  const data = {
    Inventory: [
      { name: "Cement", quantity: "20 bags", stock: 15 },
      { name: "Bricks", quantity: "100 pcs", stock: 80 },
    ],
    Request: [
      { name: "Steel Rod", quantity: "10 nos", status: "Pending" },
      { name: "Sand", quantity: "50 kg", status: "Approved" },
    ],
    Received: [
      { name: "Tiles", quantity: "200 pcs", date: "2 Nov 2025" },
      { name: "Paint", quantity: "5 L", date: "1 Nov 2025" },
    ],
    Used: [
      { name: "Cement", quantity: "5 bags", usedBy: "Worker A" },
      { name: "Bricks", quantity: "20 pcs", usedBy: "Worker B" },
    ],
  };

  const renderTabContent = () => {
    switch (inventoryTab) {
      case "Inventory":
        return (
          <View style={styles.materialList}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Material</Text>
              <Text style={styles.listHeaderText}>In Stock</Text>
            </View>
            {data.Inventory.map((item, i) => (
              <View key={i} style={styles.materialCard}>
                <View style={styles.materialLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name="cube-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.materialName}>{item.name}</Text>
                    <Text style={styles.materialQuantity}>{item.quantity}</Text>
                  </View>
                </View>
                <Text style={styles.materialStock}>{item.stock}</Text>
              </View>
            ))}
          </View>
        );

      case "Request":
        return (
          <View style={styles.materialList}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Material</Text>
              <Text style={styles.listHeaderText}>Status</Text>
            </View>
            {data.Request.map((item, i) => (
              <View key={i} style={styles.materialCard}>
                <View style={styles.materialLeft}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={COLORS.info}
                  />
                  <Text style={styles.materialName}>{item.name}</Text>
                </View>
                <Text
                  style={{
                    color:
                      item.status === "Approved"
                        ? COLORS.success
                        : COLORS.danger,
                    fontWeight: "600",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        );

      case "Received":
        return (
          <View style={styles.materialList}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Material</Text>
              <Text style={styles.listHeaderText}>Date</Text>
            </View>
            {data.Received.map((item, i) => (
              <View key={i} style={styles.materialCard}>
                <View style={styles.materialLeft}>
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color={COLORS.success}
                  />
                  <Text style={styles.materialName}>{item.name}</Text>
                </View>
                <Text style={styles.materialQuantity}>{item.date}</Text>
              </View>
            ))}
          </View>
        );

      case "Used":
        return (
          <View style={styles.materialList}>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Material</Text>
              <Text style={styles.listHeaderText}>Used By</Text>
            </View>
            {data.Used.map((item, i) => (
              <View key={i} style={styles.materialCard}>
                <View style={styles.materialLeft}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={20}
                    color={COLORS.danger}
                  />
                  <Text style={styles.materialName}>{item.name}</Text>
                </View>
                <Text style={styles.materialQuantity}>{item.usedBy}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Tabs */}
        <View style={styles.secondaryTabs}>
          {["Inventory", "Request", "Received", "Used"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.secondaryTab}
              onPress={() => setInventoryTab(tab)}
            >
              <Text
                style={[
                  styles.secondaryTabText,
                  inventoryTab === tab && styles.activeSecondaryTabText,
                ]}
              >
                {tab}
              </Text>
              {inventoryTab === tab && <View style={styles.activeTabLine} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${inventoryTab.toLowerCase()}...`}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Tab content */}
        {renderTabContent()}
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={[styles.bottomBtn, styles.usedBtn]}>
          <Text style={styles.usedText}>- Used</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, styles.addBtn]}>
          <Text style={styles.addText}>+ Material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, styles.receivedBtn]}>
          <Text style={styles.receivedText}>+ Received</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MaterialDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  secondaryTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  secondaryTab: { alignItems: "center" },
  secondaryTabText: { fontSize: 14, color: COLORS.textSecondary },
  activeSecondaryTabText: { color: COLORS.primary, fontWeight: "600" },
  activeTabLine: {
    height: 3,
    width: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  materialList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  materialCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  materialLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 10,
  },
  materialName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  materialQuantity: { fontSize: 13, color: COLORS.textSecondary },
  materialStock: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  bottomBtn: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  usedBtn: { backgroundColor: "#FEE2E2" },
  addBtn: { backgroundColor: "#CFFAFE" },
  receivedBtn: { backgroundColor: "#D1FAE5" },
  usedText: { color: COLORS.danger, fontWeight: "700" },
  addText: { color: COLORS.info, fontWeight: "700" },
  receivedText: { color: COLORS.success, fontWeight: "700" },
});
