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
  danger: "#E74C3C",
  warning: "#F39C12",
  success: "#1ABC9C",
};

const IssuesTab = () => {
  const issues = [
    { id: "ISS-001", title: "Material Delivery Delay", priority: "High", status: "Open", assignee: "John Doe" },
    { id: "ISS-002", title: "Structural Inspection Required", priority: "Medium", status: "In Progress", assignee: "Sarah Wilson" },
    { id: "ISS-003", title: "Permit Approval Pending", priority: "High", status: "Open", assignee: "Mike Johnson" },
    { id: "ISS-004", title: "Equipment Maintenance", priority: "Low", status: "Resolved", assignee: "David Brown" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return COLORS.danger;
      case 'Medium': return COLORS.warning;
      case 'Low': return COLORS.success;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Project Issues & Risks</Text>
      <View style={styles.card}>
        {issues.map((issue, index) => (
          <View key={index} style={styles.issueItem}>
            <View style={styles.issueHeader}>
              <Text style={styles.issueId}>{issue.id}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(issue.priority) }]}>
                <Text style={styles.priorityText}>{issue.priority}</Text>
              </View>
            </View>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <View style={styles.issueFooter}>
              <View style={[styles.statusBadge, { backgroundColor: issue.status === "Resolved" ? "#E8F6F3" : "#E8F1FF" }]}>
                <Text style={[styles.statusText, { color: issue.status === "Resolved" ? COLORS.success : COLORS.primary }]}>
                  {issue.status}
                </Text>
              </View>
              <Text style={styles.assigneeText}>Assigned to: {issue.assignee}</Text>
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
  issueItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  issueId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  assigneeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default IssuesTab;