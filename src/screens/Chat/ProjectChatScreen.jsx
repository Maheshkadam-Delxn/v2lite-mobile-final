import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    SafeAreaView,
    Image,
    ActivityIndicator,
    Alert,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProjectChat } from '@/hooks/useProjectChat';
import { uploadToCloudinary } from '@/utils/cloudinary';
import Header from '@/components/Header';

const ProjectChatScreen = ({ route, navigation }) => {
    const { project, currentUserId: initialUserId } = route.params || {};
    const [currentUserId, setCurrentUserId] = useState(initialUserId);
    const [userRole, setUserRole] = useState(null);
    const [chatInput, setChatInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Role-specific Project Tabs Data
    const ADMIN_TABS = [
        { id: 'Details', label: 'Details', keyword: 'details', icon: 'information-circle-outline' },
        { id: 'Sites', label: 'Sites', keyword: 'sites', icon: 'map-outline' },
        { id: 'Documents', label: 'Documents', keyword: 'documents', icon: 'document-text-outline' },
        { id: 'BOQ', label: 'BOQ', keyword: 'boq', icon: 'list-outline' },
        { id: 'Plans', label: 'Plans', keyword: 'plans', icon: 'layers-outline' },
        { id: 'Task', label: 'Tasks', keyword: 'tasks', icon: 'checkbox-outline' },
        { id: 'Transaction', label: 'Transactions', keyword: 'transactions', icon: 'cash-outline' },
        { id: 'Material', label: 'Materials', keyword: 'materials', icon: 'cube-outline' },
        { id: 'Attendance', label: 'Attendance', keyword: 'attendance', icon: 'people-outline' },
        { id: 'Escalation Matrix', label: 'Escalation', keyword: 'escalation', icon: 'alert-circle-outline' },
        { id: 'Snags', label: 'Snags', keyword: 'snags', icon: 'bug-outline' },
        { id: 'Progress', label: 'Progress', keyword: 'progress', icon: 'trending-up-outline' },
        { id: 'Audit', label: 'Audit', keyword: 'audit', icon: 'analytics-outline' },
        { id: 'Members', label: 'Members', keyword: 'members', icon: 'person-add-outline' },
        { id: 'Handover', label: 'Handover', keyword: 'handover', icon: 'key-outline' },
    ];

    const CLIENT_TABS = [
        { id: 'Overview', label: 'Overview', keyword: 'overview', icon: 'grid-outline' },
        { id: 'Progress', label: 'Progress', keyword: 'progress', icon: 'trending-up-outline' },
        { id: 'BOQ', label: 'BOQ', keyword: 'boq', icon: 'document-text-outline' },
        { id: 'Plans', label: 'Plans', keyword: 'plans', icon: 'folder-outline' },
        { id: 'Transaction', label: 'Payments', keyword: 'payments', icon: 'card-outline' },
        { id: 'Survey', label: 'Survey', keyword: 'survey', icon: 'clipboard-outline' },
        { id: 'Snags', label: 'Snags', keyword: 'snags', icon: 'alert-circle-outline' },
        { id: 'Issues', label: 'Issues', keyword: 'issues', icon: 'warning-outline' },
        { id: 'Handover', label: 'Handover', icon: 'key-outline' },
    ];

    const getAvailableTabs = () => {
        return userRole === 'client' ? CLIENT_TABS : ADMIN_TABS;
    };

    const handleInputChange = (text) => {
        setChatInput(text);
        const match = text.match(/@(\w*)$/);
        if (match) {
            const query = match[1].toLowerCase();
            const availableTabs = getAvailableTabs();
            setSuggestions(availableTabs.filter(tab =>
                tab.keyword.toLowerCase().startsWith(query) ||
                tab.label.toLowerCase().startsWith(query)
            ));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (tab) => {
        const words = chatInput.split(' ');
        words.pop(); // Remove the typed @query
        const newInput = [...words, `@${tab.keyword} `].join(' ');
        setChatInput(newInput);
        setSuggestions([]);
    };

    const projectId = project?._id || project?.id;
    const { messages, sendMessage, isConnected } = useProjectChat(projectId);
    const scrollViewRef = useRef(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Initial scroll to bottom when messages load
    useEffect(() => {
        if (messages.length > 0 && isInitialLoad) {
            // Give layout a moment to settle
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
                setIsInitialLoad(false);
            }, 500);
        }
    }, [messages, isInitialLoad]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (!isInitialLoad) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages.length]);

    // Handle scroll when keyboard opens
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUserId || !userRole) {
                const stored = await AsyncStorage.getItem("userData");
                const user = stored ? JSON.parse(stored) : null;
                if (user) {
                    setCurrentUserId(user.id || user._id);
                    setUserRole(user.role);
                }
            }
        };
        fetchUser();
    }, [currentUserId, userRole]);

    const handleSend = () => {
        if (!chatInput.trim()) return;

        const lowerInput = chatInput.toLowerCase();
        const availableTabs = getAvailableTabs();
        const targetTab = availableTabs.find(tab => lowerInput.includes(`@${tab.keyword}`));

        if (targetTab) {
            if (!userRole) {
                Alert.alert("Loading", "Please wait a moment while we identify your role...");
                return;
            }

            if (userRole === 'client') {
                // For clients, navigate to Overview in ClientStack
                navigation.navigate('ClientApp', {
                    screen: 'ClientTabs',
                    params: {
                        screen: 'ClientHome',
                        params: {
                            screen: 'Overview',
                            params: {
                                project: project,
                                initialTab: targetTab.id
                            }
                        }
                    }
                });
            } else {
                // For admins/managers, navigate to ViewDetails via explicit nested path
                navigation.navigate('MainApp', {
                    screen: 'Projects',
                    params: {
                        screen: 'ViewDetails',
                        params: {
                            project: project.raw || project,
                            initialTab: targetTab.id
                        }
                    }
                });
            }
            return;
        }

        sendMessage(chatInput);
        setChatInput("");
    };

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to send images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            uploadImage(result.assets[0]);
        }
    };

    const uploadImage = async (asset) => {
        setIsUploading(true);
        try {
            const uploadResult = await uploadToCloudinary(asset);
            if (uploadResult.success) {
                sendMessage(uploadResult.url, 'image');
            } else {
                Alert.alert("Upload Failed", uploadResult.error || "Could not upload image.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Professional Shared Header */}
            <Header
                title={project?.name || "Project Chat"}
                showBackButton={true}
                rightIcon="ellipsis-vertical"
                onRightIconPress={() => { }}
                titleStyle={{ fontSize: 20 }}
            />

            {/* Connection Status Sub-header */}
            <View style={styles.statusBanner}>
                <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#F59E0B' }]} />
                <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Connecting...'}</Text>
            </View>

            {/* KeyboardAvoidingView wrapping the main content to fix layout issues */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                {/* Messages List */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.chatList}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg, idx) => {
                        const msgSender = (typeof msg.sender === 'object' ? msg.sender?._id || msg.sender?.id : msg.sender)
                            || (typeof msg.senderId === 'object' ? msg.senderId?._id || msg.senderId?.id : msg.senderId);

                        const isMe = msgSender === currentUserId || msg.sender === 'me' || msg.optimistic;
                        const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                        // Debug logging for message rendering
                        if (idx === messages.length - 1) { // Log only the last message to avoid spam
                            console.log(`[${new Date().toISOString()}] 🎨 Rendering Message:`, {
                                msgSender,
                                currentUserId,
                                isMe,
                                content: msg.content?.substring(0, 30),
                                optimistic: msg.optimistic
                            });
                        }

                        return (
                            <View
                                key={msg.id || idx}
                                style={[
                                    styles.chatBubbleContainer,
                                    isMe ? styles.chatBubbleRight : styles.chatBubbleLeft
                                ]}
                            >
                                <View
                                    style={[
                                        styles.chatBubble,
                                        isMe ? styles.chatBubbleUser : styles.chatBubbleOther,
                                        msg.type === 'image' && styles.imageBubble
                                    ]}
                                >
                                    {msg.type === 'image' || (typeof msg.content === 'string' && msg.content.includes('cloudinary.com')) ? (
                                        <View>
                                            <Image
                                                source={{ uri: msg.content }}
                                                style={styles.messageImage}
                                                resizeMode="cover"
                                            />
                                            {msg.optimistic && (
                                                <View style={styles.imageOverlay}>
                                                    <ActivityIndicator color="#fff" />
                                                </View>
                                            )}
                                        </View>
                                    ) : (
                                        <Text
                                            style={[
                                                styles.chatBubbleText,
                                                isMe ? styles.chatTextUser : styles.chatTextOther
                                            ]}
                                        >
                                            {msg.content}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.chatTime}>{time}</Text>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Input Area */}
                <View>
                    {/* Suggestions List */}
                    {suggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
                                {suggestions.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.suggestionItem}
                                        onPress={() => handleSuggestionSelect(item)}
                                    >
                                        <View style={styles.suggestionIcon}>
                                            <Ionicons name={item.icon} size={14} color="#0066FF" />
                                        </View>
                                        <Text style={styles.suggestionLabel}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                onPress={handleImagePick}
                                style={styles.attachBtn}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <ActivityIndicator size="small" color="#6B7280" />
                                ) : (
                                    <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
                                )}
                            </TouchableOpacity>

                            <TextInput
                                style={styles.input}
                                placeholder="Type a message..."
                                value={chatInput}
                                onChangeText={handleInputChange}
                                multiline
                                maxHeight={100}
                                returnKeyType="default"
                                blurOnSubmit={false}
                            />

                            <TouchableOpacity
                                onPress={handleSend}
                                style={[styles.sendBtn, !chatInput.trim() && styles.sendBtnDisabled]}
                                disabled={!chatInput.trim()}
                            >
                                <Ionicons name="send" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    chatList: {
        flex: 1,
    },
    chatBubbleContainer: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    chatBubbleRight: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    chatBubbleLeft: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 11,
        color: '#9CA3AF',
        marginBottom: 4,
        marginLeft: 4,
    },
    chatBubble: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 18,
    },
    chatBubbleUser: {
        backgroundColor: '#0066FF',
        borderBottomRightRadius: 2,
    },
    chatBubbleOther: {
        backgroundColor: '#F3F4F6',
        borderBottomLeftRadius: 2,
    },
    imageBubble: {
        padding: 0,
        overflow: 'hidden',
        borderRadius: 12,
    },
    messageImage: {
        width: 220,
        height: 180,
        borderRadius: 12,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatBubbleText: {
        fontSize: 15,
        lineHeight: 20,
    },
    chatTextUser: {
        color: '#FFFFFF',
    },
    chatTextOther: {
        color: '#111827',
    },
    chatTime: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 4,
        marginHorizontal: 4,
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    suggestionsScroll: {
        paddingHorizontal: 16,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    suggestionIcon: {
        marginRight: 4,
    },
    suggestionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    inputWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    attachBtn: {
        padding: 8,
    },
    input: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 15,
        color: '#111827',
        maxHeight: 100,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    sendBtnDisabled: {
        backgroundColor: '#E5E7EB',
    },
});

export default ProjectChatScreen;
