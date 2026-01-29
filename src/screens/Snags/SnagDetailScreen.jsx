import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    StyleSheet,
    Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // For assigning user

import Header from '../../components/Header';
import { SnagService } from '../../services/SnagService';
import { uploadToCloudinary } from '../../utils/cloudinary';

const SnagDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { snagId } = route.params || {};

    const [snag, setSnag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]); // For assignment
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Modals
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolutionPhoto, setResolutionPhoto] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (snagId) {
            fetchSnagDetails();
        } else {
            Alert.alert('Error', 'No Snag ID provided');
            navigation.goBack();
        }
        fetchCurrentUser();
    }, [snagId]);

    const fetchCurrentUser = async () => {
        const json = await AsyncStorage.getItem('userData');
        if (json) {
            setCurrentUser(JSON.parse(json));
        }
    };

    const fetchSnagDetails = async () => {
        setLoading(true);
        try {
            const response = await SnagService.getSnagDetails(snagId);
            setSnag(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load snag details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        if (users.length > 0) {
            setShowAssignModal(true);
            return;
        }
        setLoadingUsers(true);
        try {
            const json = await SnagService.getUsers();
            if (json.data) {
                setUsers(json.data);
                setShowAssignModal(true);
            } else {
                Alert.alert('Error', 'Failed to load users list');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Actions
    const handleAssign = async () => {
        if (!selectedAssignee) {
            Alert.alert('Error', 'Please select a user');
            return;
        }
        setUpdating(true);
        try {
            await SnagService.updateSnag(snagId, {
                status: 'assigned',
                assignedTo: selectedAssignee
            });
            setShowAssignModal(false);
            fetchSnagDetails();
            Alert.alert('Success', 'Snag assigned successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to assign snag');
        } finally {
            setUpdating(false);
        }
    };

    const handlePickImage = () => {
        Alert.alert('Select Photo', 'Choose an option', [
            { text: 'Camera', onPress: takePhoto },
            { text: 'Gallery', onPress: pickResolutionPhoto },
            { text: 'Cancel', style: 'cancel' }
        ]);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Camera permission is required');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setResolutionPhoto(result.assets[0].uri);
        }
    };

    const pickResolutionPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setResolutionPhoto(result.assets[0].uri);
        }
    };

    const handleFix = async () => {
        if (!resolutionPhoto) {
            Alert.alert('Error', 'Please upload a photo proof');
            return;
        }
        setUpdating(true);
        try {
            // Upload to Cloudinary
            const result = await uploadToCloudinary(resolutionPhoto);
            if (!result.success) {
                throw new Error(result.error || 'Failed to upload photo');
            }

            // Send photo uri array as per req
            await SnagService.updateSnag(snagId, {
                status: 'fixed',
                resolutionPhotos: [result.url]
            });
            setShowResolveModal(false);
            fetchSnagDetails();
            Alert.alert('Success', 'Snag marked as fixed');
        } catch (error) {
            Alert.alert('Error', 'Failed to mark as fixed');
        } finally {
            setUpdating(false);
        }
    }

    const handleVerify = async () => {
        Alert.alert('Verify Snag', 'Are you sure you want to verify this snag?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Verify', onPress: async () => {
                    setUpdating(true);
                    try {
                        await SnagService.updateSnag(snagId, { status: 'verified' });
                        fetchSnagDetails();
                    } catch (e) { Alert.alert('Error', 'Failed to verify'); }
                    finally { setUpdating(false); }
                }
            }
        ])
    }

    const handleClose = async () => {
        Alert.alert('Close Snag', 'Are you sure you want to close this snag?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Close', style: 'destructive', onPress: async () => {
                    setUpdating(true);
                    try {
                        await SnagService.updateSnag(snagId, { status: 'closed' });
                        fetchSnagDetails();
                    } catch (e) { Alert.alert('Error', 'Failed to close'); }
                    finally { setUpdating(false); }
                }
            }
        ])
    }


    // Permission Checks (Basic MVP implementation)
    const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'project_manager';
    const isClient = currentUser?.role === 'client' || currentUser?.role === 'homeowner';

    // Normalize IDs for comparison
    const currentUserId = currentUser?._id || currentUser?.id;
    const assigneeId = snag?.assignedTo?._id || snag?.assignedTo?.id;
    const isAssignee = currentUserId && assigneeId && String(currentUserId) === String(assigneeId);

    // Debug Logging
    useEffect(() => {
        if (snag && currentUser) {
            console.log('[SnagDetailScreen] Debug Permissions:');
            console.log(' - Current User ID:', currentUserId);
            console.log(' - Assignee ID:', assigneeId);
            console.log(' - isAdminOrManager:', isAdminOrManager);
            console.log(' - Is Assignee:', isAssignee);
        }
    }, [snag, currentUser, currentUserId, assigneeId, isAssignee]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        )
    }

    if (!snag) return null;

    return (
        <View className="flex-1 bg-white">
            <Header title="Snag Details" showBackButton={true} />
            <ScrollView className="flex-1">
                {/* Status Banner */}
                <View className="p-4" style={{ backgroundColor: SnagService.getStatusColor(snag.status) + '20' }}>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-bold text-lg capitalize" style={{ color: SnagService.getStatusColor(snag.status) }}>
                            {snag.status}
                        </Text>
                        <View className="bg-white px-3 py-1 rounded-full">
                            <Text className="text-xs font-semibold capitalize" style={{ color: SnagService.getSeverityColor(snag.severity) }}>
                                {snag.severity} Severity
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="p-4">
                    <Text className="text-2xl font-bold mb-2">{snag.title}</Text>

                    <View className="flex-row items-center mb-4">
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text className="text-gray-600 ml-1">{snag.location}</Text>
                        <Text className="text-gray-300 mx-2">|</Text>
                        <Ionicons name="pricetag-outline" size={16} color="#666" />
                        <Text className="text-gray-600 ml-1 capitalize">{snag.category}</Text>
                    </View>

                    <Text className="text-gray-800 text-base leading-6 mb-6">
                        {snag.description}
                    </Text>

                    {/* Photos */}
                    {snag.photos && snag.photos.length > 0 && (
                        <View className="mb-6">
                            <Text className="font-bold text-gray-900 mb-3">Photos</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {snag.photos.map((photo, index) => (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate('ImagePreview', { imageSource: photo, planTitle: snag.title })}>
                                        <Image
                                            source={{ uri: photo }}
                                            className="w-32 h-32 rounded-lg mr-3 bg-gray-100"
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Assigned To */}
                    {snag.assignedTo && (
                        <View className="flex-row items-center mb-6 p-4 bg-gray-50 rounded-xl">
                            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <Text className="text-blue-600 font-bold">{snag.assignedTo.name?.[0] || 'U'}</Text>
                            </View>
                            <View>
                                <Text className="text-xs text-gray-500">Assigned To</Text>
                                <Text className="font-semibold text-gray-900">{snag.assignedTo.name || 'Unknown'}</Text>
                            </View>
                        </View>
                    )}

                    {/* Resolution Photos */}
                    {snag.resolutionPhotos && snag.resolutionPhotos.length > 0 && (
                        <View className="mb-6">
                            <Text className="font-bold text-gray-900 mb-3">Resolution Proof</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {snag.resolutionPhotos.map((photo, index) => (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate('ImagePreview', { imageSource: photo, planTitle: 'Resolution Proof' })}>
                                        <Image
                                            source={{ uri: photo }}
                                            className="w-32 h-32 rounded-lg mr-3 bg-green-50 border border-green-100"
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View className="mt-4 mb-10 space-y-3">
                        {/* Admin/Manager Actions */}
                        {isAdminOrManager && snag.status === 'open' && (
                            <TouchableOpacity
                                className="bg-blue-600 py-3 rounded-xl items-center"
                                onPress={fetchUsers}
                            >
                                {loadingUsers ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Assign Snag</Text>}
                            </TouchableOpacity>
                        )}

                        {/* Assignee Actions (or Admin acting as assignee for testing) - Clients CANNOT fix */}
                        {(snag.status === 'assigned' && (isAssignee || isAdminOrManager) && !isClient) && (
                            <TouchableOpacity
                                className="bg-yellow-500 py-3 rounded-xl items-center"
                                onPress={() => setShowResolveModal(true)}
                            >
                                <Text className="text-white font-bold">Mark as Fixed</Text>
                            </TouchableOpacity>
                        )}

                        {/* Verification Actions */}
                        {(isAdminOrManager && snag.status === 'fixed') && (
                            <TouchableOpacity
                                className="bg-green-600 py-3 rounded-xl items-center"
                                onPress={handleVerify}
                            >
                                <Text className="text-white font-bold">Verify Fix</Text>
                            </TouchableOpacity>
                        )}

                        {/* Close Actions */}
                        {(isAdminOrManager && snag.status === 'verified') && (
                            <TouchableOpacity
                                className="bg-gray-800 py-3 rounded-xl items-center"
                                onPress={handleClose}
                            >
                                <Text className="text-white font-bold">Close Snag</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Assign Modal */}
            <Modal visible={showAssignModal} transparent animationType="slide" onRequestClose={() => setShowAssignModal(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                        <Text className="text-xl font-bold mb-4">Assign Snag</Text>
                        <View className="border border-gray-200 rounded-lg mb-4">
                            <Picker
                                selectedValue={selectedAssignee}
                                onValueChange={(itemValue) => setSelectedAssignee(itemValue)}
                                style={{ width: '100%' }}
                            >
                                <Picker.Item label="Select User..." value="" />
                                {users.map((u) => (
                                    <Picker.Item key={u._id} label={u.name} value={u._id} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity
                            className="bg-blue-600 py-4 rounded-xl items-center mt-4"
                            onPress={handleAssign}
                            disabled={updating}
                        >
                            {updating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Confirm Assignment</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mt-4 items-center"
                            onPress={() => setShowAssignModal(false)}
                        >
                            <Text className="text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Resolve Modal */}
            <Modal visible={showResolveModal} transparent animationType="slide" onRequestClose={() => setShowResolveModal(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6">
                        <Text className="text-xl font-bold mb-4">Mark as Fixed</Text>
                        <Text className="text-gray-600 mb-4">Please upload a photo proof of the fix.</Text>

                        {resolutionPhoto ? (
                            <View className="mb-4 relative">
                                <Image source={{ uri: resolutionPhoto }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                                <TouchableOpacity
                                    className="absolute top-2 right-2 bg-white rounded-full p-2"
                                    onPress={() => setResolutionPhoto(null)}
                                >
                                    <Ionicons name="trash" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                className="h-48 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mb-4 bg-gray-50"
                                onPress={handlePickImage}
                            >
                                <Ionicons name="camera" size={40} color="#9CA3AF" />
                                <Text className="text-gray-400 mt-2">Tap to take/select photo</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className={`bg-blue-600 py-4 rounded-xl items-center mt-4 ${!resolutionPhoto ? 'opacity-50' : ''}`}
                            onPress={handleFix}
                            disabled={updating || !resolutionPhoto}
                        >
                            {updating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Submit Fix</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="mt-4 items-center"
                            onPress={() => setShowResolveModal(false)}
                        >
                            <Text className="text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default SnagDetailScreen;
