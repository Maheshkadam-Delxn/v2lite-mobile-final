import React, { useState, memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// ✅ Import your screens directly
import ProjectListScreen from "../Projects/ProjectsListScreen";
import ProposalsListScreen from "../Proposals/ProposalsListScreen";
import UsersScreen from "../Users/UsersScreen";
// import TaskScreen from "../Projects/TaskScreen";
 import ProfilePageScreen from "../Profile/ProfilePageScreen"; // <-- create or adjust path

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState("ProjectListScreen");

  // ✅ Define tab data with corresponding component
  const tabs = [
    { label: "Projects", icon: "apps-sharp", route: "ProjectListScreen", component: ProjectListScreen },
    { label: "Templates", icon: "document-text-outline", route: "ProposalsListScreen", component: ProposalsListScreen },
    { label: "Users", icon: "people-outline", route: "Users", component: UsersScreen },
    { label: "Vendor", icon: "clipboard-outline", route: "Tasks", component: UsersScreen },
    { label: "Account", icon: "person-outline", route: "ProfilePageScreen", component: ProfilePageScreen },
  ];

  // ✅ Find current active component
  const ActiveComponent = tabs.find((t) => t.route === activeTab)?.component || ProjectListScreen;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Render active screen above */}
      <View style={styles.screenContainer}>
        <ActiveComponent />
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.route;
          const color = isActive ? "#0066FF" : "#7F8C8D";
          return (
            <TouchableOpacity
              key={tab.label}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.route)}
            >
              <Ionicons name={tab.icon} size={22} color={color} />
              <Text style={[styles.navText, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default memo(BottomNavBar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    height: 70,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Urbanist-Medium",
  },
});
