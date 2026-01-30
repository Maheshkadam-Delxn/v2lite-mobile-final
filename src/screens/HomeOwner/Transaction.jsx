import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Enhanced Color Palette (matching Overview.jsx)
const COLORS = {
    primary: '#0066FF',
    primaryLight: '#3385FF',
    primaryDark: '#0052CC',
    primaryBg: 'rgba(0, 102, 255, 0.08)',
    secondary: '#7C3AED',
    accent: '#00B8D4',
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.1)',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.1)',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    shadow: 'rgba(0, 0, 0, 0.05)',
};

const INR_TO_QAR_RATE = 0.0401;

const Transaction = ({ project }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        if (!project?._id) return;

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Authentication token not found');
                setLoading(false);
                return;
            }

            setError(null);
            // console.log(`Fetching transactions for project: ${project._id}`);

            const response = await fetch(`${process.env.BASE_API_URL}/api/newTransaction/${project._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            // Handle different response structures
            let list = [];
            if (Array.isArray(data.data)) {
                list = data.data;
            } else if (Array.isArray(data)) {
                list = data;
            } else if (data.data && Array.isArray(data.data)) {
                list = data.data;
            }

            // Safe processing of list
            const safeList = list.map(transaction => ({
                ...transaction,
                type: transaction?.type || transaction?.status || 'unknown',
                amount: transaction?.amount || transaction?.advance || 0,
                status: transaction?.status || 'pending',
                vendorName: transaction?.vendorName || transaction?.vendorId?.name || getVendorNameFallback(transaction),
                createdAt: transaction?.createdAt || new Date().toISOString(),
                _id: transaction?._id || Date.now().toString(),
            }));

            // Sort by date (newest first)
            safeList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setTransactions(safeList);
        } catch (err) {
            console.error('Fetch transactions error:', err);
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [project]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTransactions();
    }, [fetchTransactions]);

    // Helper to get vendor name if main fields are missing
    const getVendorNameFallback = (transaction) => {
        if (transaction?.vendor) return transaction.vendor;
        if (transaction?.from) return transaction.from;
        if (transaction?.partyName) return transaction.partyName;
        return 'Unknown Party';
    };

    const getTransactionIcon = (type) => {
        const lowerType = (type || '').toLowerCase();
        if (lowerType.includes('in') || lowerType.includes('payment_in')) return 'arrow-down-circle';
        if (lowerType.includes('out') || lowerType.includes('payment_out')) return 'arrow-up-circle';
        if (lowerType.includes('purchase')) return 'cart';
        if (lowerType.includes('invoice')) return 'document-text';
        return 'receipt';
    };

    const getTransactionColor = (type) => {
        const lowerType = (type || '').toLowerCase();
        if (lowerType.includes('in') || lowerType.includes('payment_in')) return COLORS.success;
        if (lowerType.includes('out') || lowerType.includes('payment_out')) return COLORS.danger;
        return COLORS.primary;
    };

    const formatCurrency = (amount) => {
        // Convert INR to QAR if needed, or just display as is
        // Assuming API returns INR, converting to QAR for display as per other screens
        const val = Number(amount) || 0;
        const qarVal = (val * INR_TO_QAR_RATE).toFixed(2);
        return `﷼ ${qarVal}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {transactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="wallet-outline" size={48} color={COLORS.textLight} />
                    </View>
                    <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                    <Text style={styles.emptyText}>
                        Financial records for this project will appear here.
                    </Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchTransactions}>
                        <Ionicons name="refresh" size={20} color={COLORS.primary} />
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    }
                >
                    {/* Summary Card (Optional - can be added if needed, sticking to list for now) */}

                    {transactions.map((item, index) => {
                        const icon = getTransactionIcon(item.type);
                        const color = getTransactionColor(item.type);
                        const isIncoming = (item.type || '').includes('in');

                        return (
                            <View key={item._id || index} style={styles.transactionCard}>
                                <View style={styles.row}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                                        <Ionicons name={icon} size={24} color={color} />
                                    </View>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.vendorName} numberOfLines={1}>
                                            {item.vendorName || item.type}
                                        </Text>
                                        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                                    </View>

                                    <View style={styles.amountContainer}>
                                        <Text style={[styles.amount, { color: isIncoming ? COLORS.success : COLORS.text }]}>
                                            {isIncoming ? '+' : '-'} {formatCurrency(item.amount)}
                                        </Text>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: item.status === 'approved' ? COLORS.successLight : COLORS.warningLight }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: item.status === 'approved' ? COLORS.success : COLORS.warning }
                                            ]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    errorContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        marginTop: 12,
        color: COLORS.danger,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primaryBg,
        borderRadius: 8,
    },
    retryText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    refreshButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 8,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    transactionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        // Minimal shadow for depth
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    vendorName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});

export default Transaction;