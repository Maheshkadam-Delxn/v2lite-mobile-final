import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Member = ({ project }) => {
    const projectId = project._id;
 
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
 
    useEffect(() => {
        fetchMembers();
    }, [projectId]);
 
    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError("");
            const token = await AsyncStorage.getItem("userToken");
            
            const res = await fetch(
                `${process.env.BASE_API_URL}/api/users/by-project/${projectId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );
 
            const data = await res.json();
            
            if (data.success) {
                setMembers(data.users);
            } else {
                setError(data.message || "Failed to load members");
            }
        } catch (err) {
            console.error("Error fetching members:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchMembers();
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: "#ff6b6b",
            manager: "#4ecdc4",
            developer: "#45b7d1",
            designer: "#f7b731",
            member: "#9b59b6",
        };
        return colors[role?.toLowerCase()] || "#95a5a6";
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No members found</Text>
            <Text style={styles.emptySubtext}>
                Add members to collaborate on this project
            </Text>
        </View>
    );

    const renderMemberItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.memberCard}
            activeOpacity={0.7}
        >
            <View style={styles.memberContent}>
                <View style={[styles.avatar, { backgroundColor: getRoleColor(item.role) }]}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
                
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.name}</Text>
                    <Text style={styles.memberEmail}>{item.email}</Text>
                    
                    <View style={styles.roleContainer}>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
                            <Text style={styles.roleText}>{item.role || "Member"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
 
    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4ecdc4" />
                <Text style={styles.loadingText}>Loading members...</Text>
            </View>
        );
    }
 
    if (error && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchMembers}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }
 
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Team Members</Text>
                <View style={styles.memberCount}>
                    <Text style={styles.memberCountText}>{members.length}</Text>
                </View>
            </View>
 
            <FlatList
                data={members}
                keyExtractor={(item) => item._id}
                renderItem={renderMemberItem}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={members.length === 0 && styles.emptyList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4ecdc4"
                        colors={["#4ecdc4"]}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    memberCount: {
        backgroundColor: "#0967ebff",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    memberCountText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    memberCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    memberContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        color: "#1a1a1a",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 4,
    },
    memberEmail: {
        color: "#6c757d",
        fontSize: 14,
        marginBottom: 8,
    },
    roleContainer: {
        flexDirection: "row",
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    roleText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyList: {
        flexGrow: 1,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        color: "#1a1a1a",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    emptySubtext: {
        color: "#6c757d",
        fontSize: 14,
        textAlign: "center",
    },
    loadingText: {
        color: "#6c757d",
        fontSize: 16,
        marginTop: 12,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: "#dc3545",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    retryButton: {
        backgroundColor: "#4ecdc4",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
 
export default Member;