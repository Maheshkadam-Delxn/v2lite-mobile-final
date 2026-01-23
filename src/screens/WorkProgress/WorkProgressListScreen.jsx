import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    ScrollView,
    Image,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { WorkProgressService } from '../../services/WorkProgressService';

const WorkProgressListScreen = ({ projectId: propProjectId, isClient = false }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const projectId = propProjectId || params.projectId;

    const [activeTab, setActiveTab] = useState('logs'); // 'logs' or 'reports'
    const [logs, setLogs] = useState([]);
    const [summaries, setSummaries] = useState({ daily: null, weekly: null, monthly: null });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            if (activeTab === 'logs') {
                const response = await WorkProgressService.getLogs({ projectId });
                setLogs(response.data || []);
            } else {
                const [daily, weekly, monthly] = await Promise.all([
                    WorkProgressService.getSummary({ projectId, type: 'daily' }),
                    WorkProgressService.getSummary({ projectId, type: 'weekly' }),
                    WorkProgressService.getSummary({ projectId, type: 'monthly' })
                ]);
                setSummaries({
                    daily: daily.data,
                    weekly: weekly.data,
                    monthly: monthly.data
                });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load work progress data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [projectId, activeTab]);

    useFocusEffect(
        useCallback(() => {
            fetchData(true);
        }, [fetchData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(false);
    };

    const renderLogItem = ({ item }) => (
        <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-400 capitalize">
                        {new Date(item.logDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                    <Text className="text-base text-gray-800 mt-2" numberOfLines={3}>
                        {item.description}
                    </Text>
                </View>
                <View
                    className="px-2 py-1 rounded-lg items-center justify-center min-w-[50px]"
                    style={{ backgroundColor: WorkProgressService.getEffortColor(item.effortPercentage) + '20' }}
                >
                    <Text
                        className="text-xs font-bold"
                        style={{ color: WorkProgressService.getEffortColor(item.effortPercentage) }}
                    >
                        {item.effortPercentage}%
                    </Text>
                </View>
            </View>

            {item.photos && item.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                    {item.photos.map((photo, index) => (
                        <Image
                            key={index}
                            source={{ uri: photo }}
                            className="w-20 h-20 rounded-lg mr-2 bg-gray-200"
                        />
                    ))}
                </ScrollView>
            )}

            <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
                <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 ml-1">
                    Logged by {item.createdBy?.name || 'Manager'}
                </Text>
                {item.milestoneId && (
                    <>
                        <Text className="text-xs text-gray-300 mx-2">|</Text>
                        <Ionicons name="flag-outline" size={14} color="#9CA3AF" />
                        <Text className="text-xs text-gray-400 ml-1">
                            {item.milestoneId.title}
                        </Text>
                    </>
                )}
            </View>

            {/* Link Snag Action - Only for Admins/Managers */}
            {!isClient && (
                <TouchableOpacity
                    className="mt-3 flex-row items-center justify-end"
                    onPress={() => navigation.navigate('CreateSnagScreen', {
                        projectId: item.projectId || projectId,
                        workProgressId: item._id
                    })}
                >
                    <Ionicons name="bug-outline" size={14} color="#EF4444" />
                    <Text className="text-xs text-red-500 font-bold ml-1">Report Snag from Log</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderSummaryCard = (title, data, icon) => {
        if (!data) return null;
        return (
            <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                            <Ionicons name={icon} size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-lg font-bold text-gray-800">{title}</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-bold">Active</Text>
                    </View>
                </View>

                <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-black text-gray-800">{data.averageEffort?.toFixed(1) || 0}%</Text>
                        <Text className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Avg. Effort</Text>
                    </View>
                    <View className="w-[1px] h-10 bg-gray-100" />
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-black text-gray-800">{data.totalLogs || 0}</Text>
                        <Text className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Total Logs</Text>
                    </View>
                    <View className="w-[1px] h-10 bg-gray-100" />
                    <View className="items-center flex-1">
                        <Text
                            className="text-2xl font-black"
                            style={{ color: WorkProgressService.getEffortColor(data.totalEffort || 0) }}
                        >
                            {data.totalEffort || 0}%
                        </Text>
                        <Text className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Total Progress</Text>
                    </View>
                </View>

                <View className="mt-4 bg-gray-50 rounded-xl p-3">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xs font-medium text-gray-500">Progress Visualization</Text>
                        <Text className="text-xs font-bold text-blue-600">{data.totalEffort || 0}%</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-blue-500"
                            style={{ width: `${Math.min(data.totalEffort || 0, 100)}%` }}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center py-20 px-10">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="document-text-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-700 text-center">No Progress Logs Yet</Text>
            <Text className="text-gray-400 mt-2 text-center">
                Track your daily site execution by adding work progress logs. Tap the button below to start.
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Header
                title="Work Progress"
                showBackButton={true}
            />

            {/* Selector Tab */}
            <View className="flex-row px-4 py-3 bg-white shadow-sm">
                <TouchableOpacity
                    onPress={() => setActiveTab('logs')}
                    className={`flex-1 items-center py-2 rounded-lg ${activeTab === 'logs' ? 'bg-blue-600' : ''}`}
                >
                    <Text className={`font-semibold ${activeTab === 'logs' ? 'text-white' : 'text-gray-500'}`}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('reports')}
                    className={`flex-1 items-center py-2 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600' : ''}`}
                >
                    <Text className={`font-semibold ${activeTab === 'reports' ? 'text-white' : 'text-gray-500'}`}>Reports</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <>
                    {activeTab === 'logs' ? (
                        <FlatList
                            data={logs}
                            renderItem={renderLogItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={{ padding: 16, pb: 100, flexGrow: 1 }}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            ListEmptyComponent={renderEmptyState}
                        />
                    ) : (
                        <ScrollView
                            contentContainerStyle={{ padding: 16, pb: 40 }}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            {renderSummaryCard('Daily Progress', summaries.daily, 'today-outline')}
                            {renderSummaryCard('Weekly Summary', summaries.weekly, 'calendar-outline')}
                            {renderSummaryCard('Monthly Overview', summaries.monthly, 'bar-chart-outline')}

                            {/* Empty state for reports if no data at all */}
                            {!summaries.daily && !summaries.weekly && !summaries.monthly && renderEmptyState()}
                        </ScrollView>
                    )}
                </>
            )}

            {/* FAB to Add Progress - Only for non-clients */}
            {!isClient && (
                <TouchableOpacity
                    className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full justify-center items-center shadow-lg shadow-blue-300"
                    onPress={() => navigation.navigate('CreateWorkProgressScreen', { projectId })}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default WorkProgressListScreen;
