import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "components/Header";

//const CLIENT_API_URL ="https://skystruct-lite-backend.vercel.app/api/client/projects";

const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/client/projects`;

export default function ClientMainPage({ navigation }) {
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openSwipeRefs = useRef(new Map());

  // ===============================
  // Fetch Data
  // ===============================
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoading(true);

      const response = await fetch(CLIENT_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await response.json();
      const list = Array.isArray(json.data) ? json.data : [];

      setDataList(list);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ===============================
  // Delete Item
  // ===============================
  const deleteItem = async (id) => {
    try {
      openSwipeRefs.current.get(id)?.close();
      openSwipeRefs.current.delete(id);

      setDataList((prev) => prev.filter((x) => x._id !== id));

      await fetch(`${CLIENT_API_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      Alert.alert("Error", "Delete failed");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert("Delete", `Delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
    ]);
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.deleteAction}>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // ===============================
  // Navigation
  // ===============================
  const handleAddProject = () => {
     navigation.navigate('CustomerChooseTemplate')
  };

  // ===============================
  // Search
  // ===============================
  const filteredList = dataList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===============================
  // Card Component
  // ===============================
  const Card = ({ item }) => (
    <Swipeable
      ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      onSwipeableWillOpen={() => {
        openSwipeRefs.current.forEach((ref, id) => {
          if (id !== item._id) ref?.close();
        });
      }}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.imageBox}>
            {item.projectImages ? (
              <Image source={{ uri: item.projectImages }} style={styles.clientImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text>No Image</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.subText}>{item.email}</Text>
          </View>

         
        </View>

        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text style={styles.subText}>{item.address || "No Address"}</Text>
        </View>
      </View>
    </Swipeable>
  );

  // ===============================
  // UI
  // ===============================
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header title="Welcome to SkyStruct" />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search + Add Button */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search Projects..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={{ paddingHorizontal: 16 }}>
          {filteredList.map((item) => (
            <Card key={item._id} item={item} />
          ))}

          {filteredList.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No data found</Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

// ===============================
// Styles
// ===============================
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 12,
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },

  searchInput: { marginLeft: 10, flex: 1 },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0066FF",
    elevation: 2,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#EEE",
  },

  clientImage: { width: "100%", height: "100%" },

  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },

  nameText: { fontSize: 16, fontWeight: "700", color: "#111" },

  subText: { fontSize: 12, color: "#6B7280" },

  detailsRow: { flexDirection: "row", alignItems: "center" },

  deleteAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 12,
  },

  deleteBtn: {
    width: 85,
    height: "100%",
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  deleteText: { color: "#fff", marginTop: 3 },

  empty: { alignItems: "center", paddingVertical: 60 },

  emptyText: { marginTop: 16, color: "#777" },
});
