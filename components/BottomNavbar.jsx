// components/BottomNavBar.jsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    // { label: "Home", icon: "home-outline", route: "Dashboard" },
    { label: "Projects", icon: "apps-sharp", route: "ProjectListScreen" },
     { label: "Templates", icon: "document-text-outline", route: "ProposalsListScreen" },
      // { label: "Roles", icon: "apps-sharp", route: "ProjectListScreen" },
    { label: "Payments", icon: "credit-card-outline", route: "Payments" },
    { label: "Tasks", icon: "clipboard-outline", route: "Tasks" },
    { label: "Account", icon: "person-outline", route: "ProfilePageScreen" },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.route;
        const color = isActive ? "#0066FF" : "#7F8C8D";
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.route)}
          >
            {tab.label === "Payments" ? (
              <MaterialCommunityIcons name={tab.icon} size={22} color={color} />
            ) : (
              <Ionicons name={tab.icon} size={22} color={color} />
            )}
            <Text style={[styles.navText, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;
