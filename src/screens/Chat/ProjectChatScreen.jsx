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
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProjectChat } from '@/hooks/useProjectChat';
import Header from '@/components/Header'; // Assuming you have a reusable Header component

const ProjectChatScreen = ({ route, navigation }) => {
    const { project, currentUserId: initialUserId } = route.params || {};
    const [currentUserId, setCurrentUserId] = useState(initialUserId);
    const [chatInput, setChatInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Project Tabs Data for Suggestions
    const PROJECT_TABS = [
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

    const handleInputChange = (text) => {
        setChatInput(text);
        const match = text.match(/@(\w*)$/);
        if (match) {
            const query = match[1].toLowerCase();
            setSuggestions(PROJECT_TABS.filter(tab =>
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

    // Use the hook - ensure we pass the correct ID
    const projectId = project?._id || project?.id;
    const { messages, sendMessage, isConnected } = useProjectChat(projectId);

    // Scroll to bottom helper
    const scrollViewRef = useRef(null);

    useEffect(() => {
        // If userId wasn't passed in params, fetch it
        const fetchUser = async () => {
            if (!currentUserId) {
                const stored = await AsyncStorage.getItem("userData");
                const user = stored ? JSON.parse(stored) : null;
                if (user) {
                    setCurrentUserId(user.id || user._id);
                }
            }
        };
        fetchUser();
    }, [currentUserId]);

    const handleSend = () => {
        if (!chatInput.trim()) return;

        const lowerInput = chatInput.toLowerCase();
        const targetTab = PROJECT_TABS.find(tab => lowerInput.includes(`@${tab.keyword}`));

        if (targetTab) {
            navigation.navigate("ViewDetails", {
                project: project.raw || project,
                initialTab: targetTab.id
            });
            return;
        }

        sendMessage(chatInput);
        setChatInput("");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{project?.name || "Project Chat"}</Text>
                    <Text style={styles.headerSubtitle}>{isConnected ? 'Connected' : 'Connecting...'}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Messages List */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.chatList}
                contentContainerStyle={{ padding: 16 }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                keyboardShouldPersistTaps="handled"
            >
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUserId || msg.sender === 'me';
                    const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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
                                    isMe ? styles.chatBubbleUser : styles.chatBubbleOther
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chatBubbleText,
                                        isMe ? styles.chatTextUser : styles.chatTextOther
                                    ]}
                                >
                                    {msg.content}
                                </Text>
                            </View>
                            <Text style={styles.chatTime}>{time}</Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            {suggestions.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.suggestionItem}
                                    onPress={() => handleSuggestionSelect(item)}
                                >
                                    <Ionicons name={item.icon} size={18} color="#0066FF" />
                                    <Text style={styles.suggestionLabel}>{item.label}</Text>
                                    <Text style={styles.suggestionKeyword}>@{item.keyword}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message... (@ for options)"
                        value={chatInput}
                        onChangeText={handleInputChange}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#10B981',
    },
    chatList: {
        flex: 1,
    },
    chatBubbleContainer: {
        marginBottom: 12,
        maxWidth: '85%',
    },
    chatBubbleRight: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    chatBubbleLeft: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    chatBubble: {
        padding: 12,
        borderRadius: 16,
        marginBottom: 4,
    },
    chatBubbleUser: {
        backgroundColor: '#0066FF',
        borderBottomRightRadius: 4,
    },
    chatBubbleOther: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
        marginTop: 2,
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        maxHeight: 200,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 10,
    },
    suggestionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    suggestionKeyword: {
        fontSize: 12,
        color: '#6B7280',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 15,
        color: '#111827',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0066FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProjectChatScreen;
