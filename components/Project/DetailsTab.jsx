import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const COLORS = {
  primary: "#0066FF",
  background: "#F6F8FC",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  white: "#FFFFFF",
  border: "#E0E0E0",
  lightGray: "#F1F4F8",
};

const DetailsTab = ({ projectData }) => {
  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* BASIC DETAILS */}
      <Text style={styles.sectionTitle}>Basic Project Details</Text>
      <View style={styles.card}>
        <DetailRow label="Project Name :" value={projectData.projectName} />
        <DetailRow label="Project Type :" value={projectData.projectType} />
        <DetailRow label="Project ID :" value={projectData.projectId} />
        <DetailRow label="Location :" value={projectData.location} />
        <DetailRow label="Start Date :" value={projectData.startDate} />
        <DetailRow label="End Date :" value={projectData.endDate} />
        <View style={styles.statusRow}>
          <Text style={styles.detailLabel}>Project Status :</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{projectData.projectStatus}</Text>
          </View>
        </View>
      </View>

      {/* PROJECT TEAM */}
      <Text style={styles.sectionTitle}>Project Team</Text>
      <View style={styles.card}>
        <DetailRow label="Project Manager :" value={projectData.projectManager} />
        <DetailRow label="Consultant :" value={projectData.consultant} />
        <DetailRow label="Main Contractor :" value={projectData.mainContractor} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Subcontractors :</Text>
          <View style={styles.avatarGroup}>
            <View style={styles.avatar} />
            <View style={[styles.avatar, styles.avatarSecond]} />
            <View style={[styles.avatar, styles.avatarThird]} />
            <View style={styles.moreAvatars}>
              <Text style={styles.moreText}>+3</Text>
            </View>
          </View>
        </View>
      </View>

      {/* FINANCIAL OVERVIEW */}
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.card}>
        <DetailRow label="Total Budget :" value={projectData.totalBudget} />
        <DetailRow label="Amount Spent :" value={projectData.amountSpent} />
        <DetailRow label="Remaining Budget :" value={projectData.remainingBudget} />
        <View style={styles.statusRow}>
          <Text style={styles.detailLabel}>BOQ Approval Status :</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{projectData.boqStatus}</Text>
          </View>
        </View>
      </View>

      {/* CLIENT APPROVALS */}
      <Text style={styles.sectionTitle}>Client & Approvals</Text>
      <View style={styles.card}>
        <DetailRow label="Client Name :" value={projectData.clientName} />
        <DetailRow
          label="Approval Status :"
          value={projectData.approvalStatus}
        />
        <DetailRow label="Snag List :" value={projectData.snagList} />
      </View>

      {/* BOTTOM SPACING */}
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
  contentContainer: {
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 8,
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarSecond: {
    marginLeft: -10,
    backgroundColor: "#1ABC9C",
  },
  avatarThird: {
    marginLeft: -10,
    backgroundColor: "#F39C12",
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    borderWidth: 2,
    borderColor: "#fff",
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default DetailsTab;