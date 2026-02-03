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
    Keyboard,
    Dimensions,
    Image,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import { useProjectChat } from '@/hooks/useProjectChat';
import Header from '@/components/Header';

const CLOUDINARY_CONFIG = {
    cloudName: 'dmlsgazvr',
    apiKey: '353369352647425',
    apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const isFileUrl = (text) => {
    if (!text || typeof text !== 'string') return false;
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(text)) return false;
    const isCloudinary = text.includes('cloudinary.com');
    const hasFileExt = /\.(pdf|jpg|jpeg|png|gif|webp|doc|docx)$/i.test(text);
    return isCloudinary || hasFileExt;
};

const FileAttachment = ({ url, isUser }) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('cloudinary.com');

    if (isImage) {
        return (
            <TouchableOpacity onPress={() => Linking.openURL(url)}>
                <Image
                    source={{ uri: url }}
                    style={{
                        width: 200,
                        height: 150,
                        borderRadius: 12,
                        marginTop: 4,
                        backgroundColor: '#eee'
                    }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={() => Linking.openURL(url)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 4,
            }}
        >
            <Ionicons name="document-text" size={20} color={isUser ? '#fff' : '#0066FF'} />
            <Text style={{ color: isUser ? '#fff' : '#0066FF', fontSize: 13, fontWeight: '600' }}>View Attachment</Text>
        </TouchableOpacity>
    );
};

const ProjectChatScreen = ({ route, navigation }) => {
    const { project, currentUserId: initialUserId } = route.params || {};
    const [currentUserId, setCurrentUserId] = useState(initialUserId);
    const [userRole, setUserRole] = useState('admin'); // Default to admin
    const [chatInput, setChatInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const ADMIN_TABS = [
        { id: 'Details', label: 'Details', keyword: 'details', icon: 'information-circle-outline' },
        { id: 'Sites', label: 'Sites', keyword: 'sites', icon: 'map-outline' },
        { id: 'BOQ', label: 'BOQ', keyword: 'boq', icon: 'document-text-outline' },
        { id: 'Plans', label: 'Plans', keyword: 'plans', icon: 'layers-outline' },
        { id: 'Task', label: 'Tasks', keyword: 'tasks', icon: 'checkbox-outline' },
        { id: 'Transaction', label: 'Transactions', keyword: 'transactions', icon: 'cash-outline' },
        { id: 'Material', label: 'Materials', keyword: 'materials', icon: 'cube-outline' },
        { id: 'Attendance', label: 'Attendance', keyword: 'attendance', icon: 'people-outline' },
        { id: 'Issues', label: 'Issues', keyword: 'issues', icon: 'alert-circle-outline' },
        { id: 'Reports', label: 'Reports', keyword: 'reports', icon: 'bar-chart-outline' },
    ];

    const CLIENT_TABS = [
        { id: 'Overview', label: 'Overview', keyword: 'overview', icon: 'home-outline' },
        { id: 'Issues', label: 'Issues', keyword: 'issues', icon: 'alert-circle-outline' },
        { id: 'BOQ', label: 'BOQ', keyword: 'boq', icon: 'document-text-outline' },
        { id: 'Plans', label: 'Plans', keyword: 'plans', icon: 'layers-outline' },
        { id: 'ProjectTimeline', label: 'Timeline', keyword: 'timeline', icon: 'calendar-outline' },
        { id: 'BudgetTracker', label: 'Budget', keyword: 'budget', icon: 'cash-outline' },
        { id: 'QualityChecks', label: 'Quality', keyword: 'quality', icon: 'checkmark-circle-outline' },
        { id: 'ChangeRequests', label: 'Changes', keyword: 'changes', icon: 'swap-horizontal-outline' },
        { id: 'MaterialStatus', label: 'Materials', keyword: 'materials', icon: 'cube-outline' },
    ];

    const currentTabs = userRole === 'client' ? CLIENT_TABS : ADMIN_TABS;

    // Use the hook - ensure we pass the correct ID
    const projectId = project?._id || project?.id;
    const { messages, sendMessage, isConnected } = useProjectChat(projectId);

    // Scroll to bottom helper
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const stored = await AsyncStorage.getItem("userData");
            const user = stored ? JSON.parse(stored) : null;
            if (user) {
                if (!currentUserId) setCurrentUserId(user.id || user._id);
                setUserRole(user.role || 'admin');
            }
        };
        fetchUser();

        // Keyboard listeners for auto-scroll
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            showSubscription.remove();
        };
    }, [currentUserId]);

    const handleInputChange = (text) => {
        setChatInput(text);
        const match = text.match(/@(\w*)$/);
        if (match) {
            const query = match[1].toLowerCase();
            setSuggestions(currentTabs.filter(tab =>
                tab.keyword.toLowerCase().startsWith(query) ||
                tab.label.toLowerCase().startsWith(query)
            ));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = (tab) => {
        const newText = chatInput.replace(/@(\w*)$/, `@${tab.keyword} `);
        setChatInput(newText);
        setSuggestions([]);
    };

    const generateSignature = async (timestamp) => {
        const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
        return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
    };

    const handleImagePick = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Please allow gallery access to send photos.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            setIsUploading(true);

            const timestamp = Math.round(Date.now() / 1000);
            const signature = await generateSignature(timestamp);

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.mimeType || 'image/jpeg',
                name: file.fileName || 'chat_image.jpg',
            });
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;
            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const data = await res.json();
            if (data.secure_url) {
                sendMessage(data.secure_url);
            } else {
                Alert.alert("Upload Failed", "Could not send image.");
            }
        } catch (err) {
            console.error("Image pick error:", err);
            Alert.alert("Error", "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSend = () => {
        if (!chatInput.trim()) return;
        const lowerInput = chatInput.toLowerCase();
        const targetTab = currentTabs.find(tab => lowerInput.includes(`@${tab.keyword}`));

        if (targetTab) {
            const targetScreen = userRole === 'client' ? 'Overview' : 'ViewDetails';
            navigation.navigate(targetScreen, {
                project: project.raw || project,
                initialTab: targetTab.id
            });
            return;
        }

        sendMessage(chatInput);
        setChatInput("");
    };

    return (
        <View style={styles.container}>
            <Header
                title={project?.name || "Project Chat"}
                showBackButton={true}
                titleStyle={styles.headerTitleOverride}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                style={{ flex: 1 }}
            >
                <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10B981' : '#F59E0B' }]} />
                    <Text style={styles.statusText}>{isConnected ? 'Active Now' : 'Connecting...'}</Text>
                    {isUploading && (
                        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <ActivityIndicator size="small" color="#0066FF" />
                            <Text style={styles.uploadingText}>Sending picture...</Text>
                        </View>
                    )}
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.chatList}
                    contentContainerStyle={styles.chatListContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.length === 0 && !isUploading && (
                        <View style={styles.emptyState}>
                            <View style={styles.welcomeIcon}>
                                <Ionicons name="chatbubbles-outline" size={32} color="#0066FF" />
                            </View>
                            <Text style={styles.emptyText}>Start a conversation about</Text>
                            <Text style={styles.emptyProjectName}>{project?.name}</Text>
                        </View>
                    )}

                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === currentUserId || msg.sender === 'me' || msg.optimistic;
                        const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                        const hasAttachment = isFileUrl(msg.content);

                        return (
                            <View
                                key={msg.id || idx}
                                style={[
                                    styles.chatBubbleContainer,
                                    isMe ? styles.chatBubbleRight : styles.chatBubbleLeft
                                ]}
                            >
                                {!isMe && (
                                    <View style={styles.senderAvatar}>
                                        <Text style={styles.avatarText}>{(msg.senderName || 'U').charAt(0)}</Text>
                                    </View>
                                )}
                                <View style={{ flexShrink: 1 }}>
                                    <View
                                        style={[
                                            styles.chatBubble,
                                            isMe ? styles.chatBubbleUser : styles.chatBubbleOther
                                        ]}
                                    >
                                        {hasAttachment ? (
                                            <FileAttachment url={msg.content} isUser={isMe} />
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
                                    <Text style={[styles.chatTime, isMe && { textAlign: 'right' }]}>{time}</Text>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                            {suggestions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.suggestionChip}
                                    onPress={() => handleSuggestionSelect(item)}
                                >
                                    <Ionicons name={item.icon} size={16} color="#0066FF" />
                                    <Text style={styles.suggestionChipText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.inputWrapper}>
                    <View style={styles.inputOuterContainer}>
                        <TouchableOpacity style={styles.attachBtn} onPress={handleImagePick}>
                            <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Type message..."
                            placeholderTextColor="#9CA3AF"
                            value={chatInput}
                            onChangeText={handleInputChange}
                            multiline
                            maxHeight={100}
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
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerTitleOverride: {
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
        color: '#FFFFFF',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        color: '#6B7280',
    },
    uploadingText: {
        fontSize: 12,
        fontFamily: 'Urbanist-SemiBold',
        color: '#0066FF',
    },
    chatList: {
        flex: 1,
    },
    chatListContent: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    welcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#9CA3AF',
        textAlign: 'center',
    },
    emptyProjectName: {
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
        color: '#111827',
        textAlign: 'center',
        marginTop: 4,
    },
    chatBubbleContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    chatBubbleRight: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse', // Reverse for right-aligned avatar if needed, but here it's only for other
    },
    chatBubbleLeft: {
        alignSelf: 'flex-start',
    },
    senderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 12,
        fontFamily: 'Urbanist-Bold',
        color: '#6B7280',
    },
    chatBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        maxWidth: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    chatBubbleUser: {
        backgroundColor: '#0066FF',
        borderBottomRightRadius: 4,
    },
    chatBubbleOther: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    chatBubbleText: {
        fontSize: 15,
        fontFamily: 'Urbanist-Regular',
        lineHeight: 22,
    },
    chatTextUser: {
        color: '#FFFFFF',
    },
    chatTextOther: {
        color: '#111827',
    },
    chatTime: {
        fontSize: 10,
        fontFamily: 'Urbanist-Medium',
        color: '#9CA3AF',
        marginTop: 4,
        marginHorizontal: 4,
    },
    suggestionsContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    suggestionsScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        gap: 6,
    },
    suggestionChipText: {
        fontSize: 13,
        fontFamily: 'Urbanist-SemiBold',
        color: '#0066FF',
    },
    inputWrapper: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    inputOuterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White background for a cleaner look
        borderRadius: 28,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Subtle light gray border
    },
    input: {
        flex: 1,
        fontFamily: 'Urbanist-Medium',
        fontSize: 15,
        color: '#111827',
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        maxHeight: 120,
    },
    attachBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    sendBtnDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
        elevation: 0,
    },
    keyboardAvoidingView: {
        width: '100%',
    },
});

export default ProjectChatScreen;
