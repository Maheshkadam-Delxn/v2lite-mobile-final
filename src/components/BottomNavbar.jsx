
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";


const BottomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { label: "Projects", icon: "apps-sharp", route: "ProjectListScreen" },
    { label: "Templates", icon: "document-text-outline", route: "ProposalsListScreen" },
    { label: "Users", icon: "people-outline", route: "Users" }, // Changed from Payments to Users
    //  { label: "Templates", icon: "document-text-outline", route: "ProposalsListScreen" },
    { label: "Vendor", icon: "clipboard-outline", route: "Tasks" },
    { label: "Account", icon: "person-outline", route: "ProfilePageScreen" },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
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
              <Ionicons name={tab.icon} size={22} color={color} />
              <Text style={[styles.navText, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
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
    fontFamily: 'Urbanist-Medium',
  },
});

export default BottomNavBar;