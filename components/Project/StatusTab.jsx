import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const COLORS = {
  primary: "#0066FF",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  white: "#FFFFFF",
  success: "#1ABC9C",
  warning: "#F39C12",
  danger: "#E74C3C",
};

const StatusTab = () => {
  const statusData = {
    overall: "On Track",
    progress: "75%",
    milestones: [
      { name: "Planning", status: "Completed", date: "Jan 15, 2024" },
      { name: "Foundation", status: "Completed", date: "Mar 01, 2024" },
      { name: "Structure", status: "In Progress", date: "Jun 30, 2024" },
      { name: "Finishing", status: "Pending", date: "Sep 15, 2024" },
    ]
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Project Status Overview</Text>
      <View style={styles.card}>
        <View style={styles.statusHeader}>
          <Text style={styles.overallStatus}>Overall Status: {statusData.overall}</Text>
          <Text style={styles.progressText}>Progress: {statusData.progress}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Milestones</Text>
      <View style={styles.card}>
        {statusData.milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneItem}>
            <Text style={styles.milestoneName}>{milestone.name}</Text>
            <View style={styles.milestoneDetails}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: 
                  milestone.status === "Completed" ? "#E8F6F3" :
                  milestone.status === "In Progress" ? "#E8F1FF" : "#FBEEE6"
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: 
                    milestone.status === "Completed" ? COLORS.success :
                    milestone.status === "In Progress" ? COLORS.primary : COLORS.warning
                  }
                ]}>
                  {milestone.status}
                </Text>
              </View>
              <Text style={styles.milestoneDate}>{milestone.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 18,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overallStatus: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  milestoneItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },
  milestoneDetails: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  milestoneDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StatusTab;