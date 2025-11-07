import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const TransactionsScreen = ({ navigation }) => {
  // Dummy summary data
  const summary = {
    balance: "₹45,200",
    incoming: "₹20,000",
    outgoing: "₹8,500",
    invoice: "₹3,000",
    expense: "₹2,500",
  };

  // Dummy pending entries
  const pendingEntries = [
    {
      id: 1,
      title: "Milk Purchase",
      amount: "₹3,000",
      date: "02 Nov 2025",
      icon: "cart-outline",
      color: "#1ABC9C",
    },
    {
      id: 2,
      title: "Farmer Payment",
      amount: "₹1,500",
      date: "03 Nov 2025",
      icon: "cash-outline",
      color: "#F39C12",
    },
    {
      id: 3,
      title: "Transport Expense",
      amount: "₹2,000",
      date: "04 Nov 2025",
      icon: "car-outline",
      color: "#E74C3C",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />

      {/* HEADER */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Project Dairy Farm</Text>

        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View> */}

      {/* TABS */}
      {/* <View style={styles.tabs}>
        {["Details", "Tasks", "Transactions", "Attendance"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              tab === "Transactions" && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                tab === "Transactions" && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Balance</Text>
              <Text style={styles.summaryValue}>{summary.balance}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Incoming</Text>
              <Text style={styles.summaryValue}>{summary.incoming}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Outgoing</Text>
              <Text style={styles.summaryValue}>{summary.outgoing}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Invoice</Text>
              <Text style={styles.summaryValue}>{summary.invoice}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={styles.summaryValue}>{summary.expense}</Text>
            </View>
          </View>
        </View>

        {/* PENDING ENTRIES */}
        <Text style={styles.sectionTitle}>Pending Entries</Text>
        {pendingEntries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View
              style={[styles.entryIconContainer, { backgroundColor: entry.color }]}
            >
              <Ionicons name={entry.icon} size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
            <Text style={styles.entryAmount}>{entry.amount}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ADD ENTRY BUTTON */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Transaction Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#0066FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomRightRadius: 50,
  },
  headerIcon: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: -25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#0066FF",
  },
  activeTabText: {
    color: "#0066FF",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: "#7F8C8D",
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  entryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  entryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  entryTitle: {
    fontSize: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  entryDate: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  entryAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0066FF",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#0066FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
