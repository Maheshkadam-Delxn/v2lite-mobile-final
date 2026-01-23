import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // Using standard picker

import Header from '../../components/Header';
import CustomInput from '../../components/Inputfield'; // Check if this path is correct based on export
import { SnagService, SNAG_CATEGORIES, SNAG_SEVERITIES } from '../../services/SnagService';
import { uploadToCloudinary } from '../../utils/cloudinary';

const CreateSnagScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState(SNAG_CATEGORIES[0]);
    const [severity, setSeverity] = useState('medium');
    const [workProgressId, setWorkProgressId] = useState(route.params?.workProgressId || null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
            base64: true, // We might need base64 or upload file directly. 
            // For now, assuming API handles base64 or we upload to separate service.
            // Based on req: "photos": ["url1.jpg"] -> Implies URL.
            // Since I don't have a file upload service mocked yet, I'll simulate or send base64 if backend supports.
            // *Correction*: The user request says "must upload photos".
            // I'll stick to local URI for now and assume there's a file upload mechanism or I'll just send the URI and let backend handle (unlikely).
            // Standard practice: Upload image -> get URL -> send URL.
            // Since I don't see a general FileUpload service, I will assume for this task I send the base64 data uri or just the object.
            // Let's assume for now I can send the base64 string directly as a data URI if the backend accepts it, or just a placeholder if I can't upload.
            // Wait, let's look at `SnagService` plan. I didn't verify file upload.
            // I'll just use the URI for now to unblock UI.
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    }

    const removePhoto = (index) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const validate = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title is required');
            return false;
        }
        if (!category) {
            Alert.alert('Error', 'Category is required');
            return false;
        }
        if (!location.trim()) {
            Alert.alert('Error', 'Location is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        if (!projectId) {
            Alert.alert("Error", "Project ID is missing");
            return;
        }

        setLoading(true);
        try {
            // Upload photos to Cloudinary
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
                title,
                description,
                category,
                location,
                severity,
                workProgressId,
                photos: uploadedUrls,
            };

            await SnagService.createSnag(payload);
            Alert.alert('Success', 'Snag reported successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to create snag');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Header title="Report Snag" showBackButton={true} />

            <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>

                <CustomInput
                    label="Issue Title"
                    placeholder="e.g. Cracked Tile"
                    value={title}
                    onChangeText={setTitle}
                />

                <View className="mb-6">
                    <Text className="text-sm font-[Urbanist-SemiBold] text-black mb-2">Category</Text>
                    <View className="border border-gray-200 rounded-lg">
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={styles.picker}
                        >
                            {SNAG_CATEGORIES.map((cat) => (
                                <Picker.Item key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={cat} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <CustomInput
                    label="Location"
                    placeholder="e.g. Master Bedroom"
                    value={location}
                    onChangeText={setLocation}
                />

                <View className="mb-6">
                    <Text className="text-sm font-[Urbanist-SemiBold] text-black mb-2">Severity</Text>
                    <View className="border border-gray-200 rounded-lg">
                        <Picker
                            selectedValue={severity}
                            onValueChange={(itemValue) => setSeverity(itemValue)}
                            style={styles.picker}
                        >
                            {SNAG_SEVERITIES.map((sev) => (
                                <Picker.Item key={sev} label={sev.charAt(0).toUpperCase() + sev.slice(1)} value={sev} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <CustomInput
                    label="Description"
                    placeholder="Describe the issue in detail..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: 'top' }} // Adjust for multiline
                />

                {/* Photos Section */}
                <View className="mb-8">
                    <Text className="text-sm font-[Urbanist-SemiBold] text-black mb-2">Photos</Text>
                    <View className="flex-row flex-wrap">
                        {photos.map((uri, index) => (
                            <View key={index} className="w-20 h-20 mr-3 mb-3 relative">
                                <Image source={{ uri }} className="w-full h-full rounded-lg" />
                                <TouchableOpacity
                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center p-0"
                                    onPress={() => removePhoto(index)}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mr-3 mb-3 bg-gray-50 bg-opacity-50"
                            onPress={pickImage}
                        >
                            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mr-3 mb-3 bg-gray-50 bg-opacity-50"
                            onPress={takePhoto}
                        >
                            <Ionicons name="camera-outline" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`bg-blue-600 rounded-full py-4 items-center justify-center shadow-md ${loading ? 'opacity-70' : ''}`}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Report Snag</Text>
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
})

export default CreateSnagScreen;
