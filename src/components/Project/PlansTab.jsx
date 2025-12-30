import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#0066FF",
  background: "#F9FAFB",
  white: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  border: "#E5E7EB",
  gray: "#9CA3AF",
};

const PlansTab = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const plans = [
    {
      category: "Architectural",
      count: 3,
      items: [
        {
          id: 1,
          title: "A1.0",
          subtitle: "Floor Layout Plan",
          image: "https://i.ibb.co/hMRmYVp/architecture-plan.jpg",
        },
        {
          id: 2,
          title: "A2.1",
          subtitle: "Elevation Plan",
          image: "https://i.ibb.co/hVdyNHG/architectural-elevation.jpg",
        },
        {
          id: 3,
          title: "A3.3",
          subtitle: "Sectional Drawing",
          image: "https://i.ibb.co/f0mQxGh/architectural-section.jpg",
        },
      ],
    },
    {
      category: "Civil",
      count: 2,
      items: [
        {
          id: 1,
          title: "C1.0",
          subtitle: "Site Grading Plan",
          image: "https://i.ibb.co/QXxMk1H/civil-grading.jpg",
        },
        {
          id: 2,
          title: "C2.0",
          subtitle: "Drainage Layout",
          image: "https://i.ibb.co/3m0t3B4/civil-drainage.jpg",
        },
      ],
    },
    {
      category: "Electrical",
      count: 2,
      items: [
        {
          id: 1,
          title: "E1.0",
          subtitle: "Lighting Plan",
          image: "https://i.ibb.co/V32Qdtv/electrical-lighting.jpg",
        },
        {
          id: 2,
          title: "E2.1",
          subtitle: "Power Distribution",
          image: "https://i.ibb.co/bsKFP6p/electrical-panel.jpg",
        },
      ],
    },
    {
      category: "Structural",
      count: 2,
      items: [
        {
          id: 1,
          title: "S1.0",
          subtitle: "Foundation Plan",
          image: "https://i.ibb.co/6rPGWm1/structural-foundation.jpg",
        },
        {
          id: 2,
          title: "S2.2",
          subtitle: "Beam Details",
          image: "https://i.ibb.co/TWymZcs/structural-beam.jpg",
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Scrollable Categories */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {plans.map((plan, index) => (
          <View key={index} style={styles.categoryCard}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() =>
                setActiveCategory(
                  activeCategory === plan.category ? null : plan.category
                )
              }
            >
              <View style={styles.categoryLeft}>
                <Ionicons
                  name="folder-outline"
                  size={20}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.categoryTitle}>{plan.category}</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.planCount}>({plan.count} Plans)</Text>
                <Ionicons
                  name={
                    activeCategory === plan.category
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color={COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {activeCategory === plan.category && plan.items.length > 0 && (
              <View style={styles.planGrid}>
                {plan.items.map((item) => (
                  <View key={item.id} style={styles.planCard}>
                    <Image source={{ uri: item.image }} style={styles.planImage} />
                    <Text style={styles.planTitle}>{item.title}</Text>
                    <Text style={styles.planSubtitle}>{item.subtitle}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Plan Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlansTab;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  planCount: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginRight: 6,
  },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  planCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: "1%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
    padding: 10,
  },
  planImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  planTitle: {
    marginTop: 6,
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  planSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 100,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
