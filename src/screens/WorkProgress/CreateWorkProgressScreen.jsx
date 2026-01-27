import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/Header';
import CustomInput from '../../components/Inputfield';
import { WorkProgressService } from '../../services/WorkProgressService';
import { uploadToCloudinary } from '../../utils/cloudinary';

const CreateWorkProgressScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params || {};

    const [milestones, setMilestones] = useState([]);
    const [selectedMilestone, setSelectedMilestone] = useState('');
    const [description, setDescription] = useState('');
    const [effortPercentage, setEffortPercentage] = useState(10);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingMilestones, setFetchingMilestones] = useState(true);

    useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const fetchMilestones = async () => {
        if (!projectId) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            const BASE_URL = `${process.env.BASE_API_URL}/api`;
            const response = await fetch(`${BASE_URL}/milestones?projectId=${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await response.json();
            if (json.success) {
                setMilestones(json.data || []);
                if (json.data && json.data.length > 0) {
                    setSelectedMilestone(json.data[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setFetchingMilestones(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need camera roll permissions to upload photos.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need camera permissions to take photos.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const removePhoto = (index) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Error', 'Please provide a description of the work done.');
            return;
        }

        setLoading(true);
        try {
            // Check if log already exists for today
            const today = new Date().toISOString().split('T')[0];
            const existingLogs = await WorkProgressService.getLogs({ projectId, date: today });
            if (existingLogs.success && existingLogs.data && existingLogs.data.length > 0) {
                Alert.alert('Duplicate Log', 'A work progress log already exists for this project today. Only one log is allowed per day.');
                setLoading(false);
                return;
            }

            // Check 100% total effort cap for today
            // Check 100% total effort cap for today
            const totalExistingEffort = existingLogs.data.reduce((sum, log) => sum + (log.progressPercent || 0), 0);
            if (totalExistingEffort + parseInt(effortPercentage) > 100) {
                Alert.alert('Limit Exceeded', `Total effort for today cannot exceed 100%. You have already logged ${totalExistingEffort}% effort.`);
                setLoading(false);
                return;
            }

            // Upload photos
            const uploadedUrls = [];
            for (const uri of photos) {
                const result = await uploadToCloudinary(uri);
                if (result.success) {
                    uploadedUrls.push(result.url);
                } else {
                    throw new Error(`Failed to upload photo: ${result.error}`);
                }
            }

            const payload = {
                projectId,
                milestoneId: selectedMilestone || undefined,
                description: description.trim(),
                progressPercent: parseInt(effortPercentage),
                photos: uploadedUrls,
                date: new Date().toISOString().split('T')[0],
            };

            await WorkProgressService.createLog(payload);
            Alert.alert('Success', 'Daily progress logged successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to log progress.');
        } finally {
            setLoading(false);
        }
    };

    // Effort options: 5, 10, 15... 100
    const effortOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

    return (
        <View className="flex-1 bg-white">
            <Header title="Log Daily Progress" showBackButton={true} />

            <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Milestone Selection */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Milestone (Optional)</Text>
                    <View className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                        {fetchingMilestones ? (
                            <ActivityIndicator size="small" color="#3B82F6" className="py-3" />
                        ) : (
                            <Picker
                                selectedValue={selectedMilestone}
                                onValueChange={(itemValue) => setSelectedMilestone(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Generic Project Progress" value="" />
                                {milestones.map((m) => (
                                    <Picker.Item key={m._id} label={m.title} value={m._id} />
                                ))}
                            </Picker>
                        )}
                    </View>
                </View>

                {/* Effort Percentage */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Effort Percentage (%)</Text>
                    <View className="flex-row items-center">
                        <View className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 mr-4">
                            <Picker
                                selectedValue={effortPercentage}
                                onValueChange={(itemValue) => setEffortPercentage(itemValue)}
                                style={styles.picker}
                            >
                                {effortOptions.map((opt) => (
                                    <Picker.Item key={opt} label={`${opt}%`} value={opt} />
                                ))}
                            </Picker>
                        </View>
                        <View className={`w-12 h-12 rounded-full items-center justify-center bg-blue-50`}>
                            <Text className="text-blue-600 font-bold">{effortPercentage}%</Text>
                        </View>
                    </View>
                    <Text className="text-xs text-gray-400 mt-1 italic">
                        Tip: Total effort for all logs today cannot exceed 100%.
                    </Text>
                </View>

                {/* Description */}
                <CustomInput
                    label="Description of Work"
                    placeholder="Describe what was achieved today..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    style={{ height: 120, textAlignVertical: 'top' }}
                />

                {/* Photos */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Execution Photos</Text>
                    <View className="flex-row flex-wrap">
                        {photos.map((uri, index) => (
                            <View key={index} className="w-20 h-20 mr-3 mb-3 relative">
                                <Image source={{ uri }} className="w-full h-full rounded-lg bg-gray-100" />
                                <TouchableOpacity
                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                                    onPress={() => removePhoto(index)}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg items-center justify-center mr-3 mb-3 bg-gray-50"
                            onPress={pickImage}
                        >
                            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg items-center justify-center mr-3 mb-3 bg-gray-50"
                            onPress={takePhoto}
                        >
                            <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`bg-blue-600 rounded-2xl py-4 items-center justify-center shadow-lg shadow-blue-200 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle-outline" size={20} color="white" className="mr-2" />
                            <Text className="text-white font-bold text-lg ml-2">Log Progress</Text>
                        </View>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: '100%',
    }
});

export default CreateWorkProgressScreen;
