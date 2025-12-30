

import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from "../../../App";

const API_URL = `${process.env.BASE_API_URL}`;
const { width } = Dimensions.get("window");

export default function SiteSurveysTab() {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSurveys = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const data = await AsyncStorage.getItem("userData");
      const parsed = JSON.parse(data);
      const res = await fetch(`${API_URL}/api/surveys`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const json = await res.json();
      if (json.success) {
        const filterdata = json.data.filter(
          (e) => e.assignContractor == parsed.id
        );
        setSurveys(filterdata);
        setFilteredSurveys(filterdata);
      }
    } catch (err) {
      console.log("Error fetching surveys:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurveys(true);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [searchQuery, surveys]);

  const filterSurveys = () => {
    if (searchQuery.trim()) {
      const filtered = surveys.filter(
        (survey) =>
          survey.projectId?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          survey.requestedBy?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          survey._id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSurveys(filtered);
    } else {
      setFilteredSurveys(surveys);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "#FEF3C7",
        text: "#92400E",
        icon: "⏳",
        label: "Pending",
      },
      completed: {
        bg: "#D1FAE5",
        text: "#065F46",
        icon: "✓",
        label: "Completed",
      },
      "in-progress": {
        bg: "#DBEAFE",
        text: "#1E40AF",
        icon: "⟳",
        label: "In Progress",
      },
      cancelled: {
        bg: "#FEE2E2",
        text: "#991B1B",
        icon: "✕",
        label: "Cancelled",
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const renderSurvey = ({ item }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          overflow: "hidden",
        }}
      >
        {/* Accent Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: statusConfig.text,
          }}
        />

        <View style={{ padding: 16 }}>
          {/* Header Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 4,
                }}
                numberOfLines={2}
              >
                {item.projectId?.name || "No Project"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                ID: {item._id.slice(-8).toUpperCase()}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              style={{
                backgroundColor: statusConfig.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 12 }}>{statusConfig.icon}</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: statusConfig.text,
                }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "#F3F4F6",
              marginVertical: 12,
            }}
          />

          {/* Info Grid */}
          <View style={{ gap: 12 }}>
            {/* Requested By */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 16 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Requested By
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {item.requestedBy?.name || "Unknown"}
                </Text>
              </View>
            </View>

            {/* Date Info Row */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Survey Date */}
              {item.surveyDate && (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#F9FAFB",
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginRight: 4 }}>📅</Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      Survey Date
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {new Date(item.surveyDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}

              {/* Created Date */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#F9FAFB",
                  padding: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 14, marginRight: 4 }}>🕒</Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#6B7280",
                      fontWeight: "500",
                    }}
                  >
                    Created
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          {/* Action Button */}
<View style={{ marginTop: 16 }}>

  {/* Pending → Take Survey */}
  {item.status === "pending" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("SiteSurveyForm", {
          survey: item,
          mode: "take",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>📝</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        Take Survey
      </Text>
    </TouchableOpacity>
  )}

  {/* In Progress → Continue Survey */}
  {item.status === "in-progress" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("SiteSurveyForm", {
          survey: item,
          mode: "continue",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>▶️</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        Continue Survey
      </Text>
    </TouchableOpacity>
  )}

  {/* Completed → View Details */}
  {item.status === "completed" && (
    <TouchableOpacity
      onPress={() =>
        navigationRef.current?.navigate("ViewSiteSurvey", {
          survey: item,
          mode: "view",
        })
      }
      style={{
        backgroundColor: "#2563EB",   // SAME BLUE COLOR
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 16, color: "#fff" }}>👁️</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
        View Details
      </Text>
    </TouchableOpacity>
  )}

</View>

        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Header title={"Site Surveys"}/>

      {/* Loading State */}
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <ActivityIndicator size="large" color="#2563EB" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 15,
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Loading surveys...
          </Text>
        </View>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Search Bar */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
              backgroundColor: "#F9FAFB",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: searchQuery ? "#2563EB" : "#E5E7EB",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by project, ID, or requester..."
                placeholderTextColor="#9CA3AF"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: "#111827",
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Results Count */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {filteredSurveys.length}{" "}
                {filteredSurveys.length === 1 ? "survey" : "surveys"}
              </Text>
              {searchQuery && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    marginLeft: 4,
                  }}
                >
                  for "{searchQuery}"
                </Text>
              )}
            </View>
          </View>

          {/* Empty State */}
          {filteredSurveys.length === 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 32,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#F3F4F6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text style={{ fontSize: 48 }}>📋</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                No surveys found
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                {searchQuery
                  ? `No results matching "${searchQuery}"`
                  : "You don't have any surveys at the moment"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={{
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginTop: 24,
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Clear Search
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Surveys List */}
          {filteredSurveys.length > 0 && (
            <FlatList
              data={filteredSurveys}
              keyExtractor={(item) => item._id}
              renderItem={renderSurvey}
              contentContainerStyle={{
                paddingTop: 8,
                paddingBottom: 24,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#2563EB"
                  colors={["#2563EB"]}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}