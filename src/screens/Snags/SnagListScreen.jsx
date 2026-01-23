import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Image,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header'; // Assuming this path based on folder structure
import { SnagService } from '../../services/SnagService';

const SnagListScreen = ({ projectId: propProjectId }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const projectId = propProjectId || params.projectId;

    const [snags, setSnags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState(''); // '' means all

    const fetchSnags = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const params = {};
            if (projectId) params.projectId = projectId;
            if (statusFilter) params.status = statusFilter;

            const response = await SnagService.getSnags(params);
            setSnags(response.data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load snags');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [projectId, statusFilter]);

    useFocusEffect(
        useCallback(() => {
            fetchSnags(true);
        }, [fetchSnags])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchSnags(false);
    };

    const renderSnagItem = ({ item }) => {
        return (
            <TouchableOpacity
                className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100"
                onPress={() => navigation.navigate('SnagDetailScreen', { snagId: item._id })}
            >
                <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="pricetag-outline" size={12} color="#6B7280" />
                            <Text className="text-xs text-gray-500 ml-1 capitalize">{item.category}</Text>
                            <Text className="text-xs text-gray-300 mx-2">|</Text>
                            <Ionicons name="location-outline" size={12} color="#6B7280" />
                            <Text className="text-xs text-gray-500 ml-1" numberOfLines={1}>{item.location}</Text>
                        </View>
                    </View>
                    <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: SnagService.getStatusColor(item.status) + '20' }} // 20% opacity bg
                    >
                        <Text
                            className="text-xs font-semibold capitalize"
                            style={{ color: SnagService.getStatusColor(item.status) }}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: SnagService.getSeverityColor(item.severity) }} />
                        <Text className="text-xs text-gray-600 capitalize">
                            {item.severity} Priority
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
            <Text className="text-xl font-bold text-gray-600 mt-4">No Snags Found</Text>
            <Text className="text-gray-400 mt-2 text-center px-10">
                There are no reported issues for this project yet. Tap the + button to report a new snag.
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Header
                title="Snags"
                showBackButton={true}
            // rightIcon="filter-outline"
            // onRightIconPress={() => {}} // TODO: Implement advanced filters if needed
            />

            {/* Filter Tabs - Simple status filter */}
            <View className="flex-row px-4 py-3 bg-white shadow-sm space-x-2">
                <TouchableOpacity
                    onPress={() => setStatusFilter('')}
                    className={`px-3 py-1.5 rounded-full ${statusFilter === '' ? 'bg-blue-600' : 'bg-gray-100'}`}
                >
                    <Text className={`text-sm ${statusFilter === '' ? 'text-white' : 'text-gray-600'}`}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStatusFilter('open')}
                    className={`px-3 py-1.5 rounded-full ${statusFilter === 'open' ? 'bg-blue-600' : 'bg-gray-100'}`}
                >
                    <Text className={`text-sm ${statusFilter === 'open' ? 'text-white' : 'text-gray-600'}`}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStatusFilter('fixed')}
                    className={`px-3 py-1.5 rounded-full ${statusFilter === 'fixed' ? 'bg-blue-600' : 'bg-gray-100'}`}
                >
                    <Text className={`text-sm ${statusFilter === 'fixed' ? 'text-white' : 'text-gray-600'}`}>Fixed</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0066FF" />
                </View>
            ) : (
                <FlatList
                    data={snags}
                    renderItem={renderSnagItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={renderEmptyState}
                />
            )}

            {/* FAB to Create Snag */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full justify-center items-center shadow-lg shadow-blue-300"
                onPress={() => navigation.navigate('CreateSnagScreen', { projectId })}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default SnagListScreen;
