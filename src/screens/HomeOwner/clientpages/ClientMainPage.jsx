import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking,
  useWindowDimensions,
} from "react-native";

import React, { useState, useEffect, useRef } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import * as Crypto from "expo-crypto";
import Header from "@/components/Header";

const CLIENT_API_URL = `${process.env.BASE_API_URL}/api/projects`;
const CHAT_API_URL = `${process.env.BASE_API_URL}/api/chat/next`;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
};

const isFileUrl = (text) => {
  if (!text || typeof text !== 'string') return false;
  // Basic URL check
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  if (!urlPattern.test(text)) return false;

  // Check for Cloudinary or common file extensions
  const isCloudinary = text.includes('cloudinary.com');
  const hasFileExt = /\.(pdf|jpg|jpeg|png|gif|webp|doc|docx)$/i.test(text);

  return isCloudinary || hasFileExt;
};

const FileAttachment = ({ url, isUser }) => {
  const getFileName = (link) => {
    try {
      const name = link.split('/').pop().split('?')[0];
      return decodeURIComponent(name).length > 20
        ? decodeURIComponent(name).substring(0, 20) + '...'
        : decodeURIComponent(name);
    } catch (e) {
      return "Document";
    }
  };

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 4,
        paddingHorizontal: 4,
      }}
    >
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Ionicons
          name={isImage ? "image" : isPdf ? "document-text" : "document"}
          size={20}
          color={isUser ? '#FFFFFF' : '#0066FF'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          color: isUser ? '#FFFFFF' : '#111827',
          fontWeight: '600',
          fontSize: 14,
        }}>
          {getFileName(url)}
        </Text>
        <Text style={{
          color: isUser ? 'rgba(255,255,255,0.8)' : '#6B7280',
          fontSize: 11,
        }}>
          Click to view
        </Text>
      </View>
      <Ionicons name="arrow-forward-circle" size={20} color={isUser ? 'rgba(255,255,255,0.8)' : '#9CA3AF'} />
    </TouchableOpacity>
  );
};

export default function ClientMainPage({ navigation }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isSmallScreen = windowWidth < 375;
  const isLargeScreen = windowWidth > 768;
  
  // Responsive calculations
  const responsiveWidth = (value) => {
    const scale = windowWidth / 375; // Base width (iPhone 12)
    return value * Math.min(scale, 1.5); // Cap scaling for tablets
  };

  const responsiveHeight = (value) => {
    const scale = windowHeight / 812; // Base height (iPhone 12)
    return value * Math.min(scale, 1.5);
  };

  const responsiveFont = (size) => {
    const scale = windowWidth / 375;
    const newSize = size * scale;
    return Math.max(newSize, size * 0.9); // Minimum 90% of original size
  };

  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [proposalData, setProposalData] = useState(null);

  const slideAnim = useRef(new Animated.Value(windowHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const openSwipeRefs = useRef(new Map());

  // Quick action suggestions
  const quickActions = [
    { id: 1, icon: "home-outline", text: "Residential", color: "#0066FF" },
    { id: 2, icon: "business-outline", text: "Commercial", color: "#10B981" },
  ];

  // Admin Chat State
  const [adminChatModalVisible, setAdminChatModalVisible] = useState(false);
  const [selectedProjectForChat, setSelectedProjectForChat] = useState(null);
  const [adminChatInput, setAdminChatInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Project Tabs Data for Suggestions
  const PROJECT_TABS = [
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

  const handleAdminChatInput = (text) => {
    setAdminChatInput(text);

    // Check if user is typing a keyword starting with @
    const match = text.match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      const filtered = PROJECT_TABS.filter(tab =>
        tab.keyword.toLowerCase().startsWith(query) ||
        tab.label.toLowerCase().startsWith(query)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (tab) => {
    // Replace the @query with the full @keyword
    const newText = adminChatInput.replace(/@(\w*)$/, `@${tab.keyword} `);
    setAdminChatInput(newText);
    setSuggestions([]);
  };

  const openAdminChat = (project) => {
    navigation.navigate('ProjectChatScreen', {
      project: project,
      currentUserId: currentUserId
    });
  };

  const closeAdminChat = () => {
    setAdminChatModalVisible(false);
    setSelectedProjectForChat(null);
    setSuggestions([]);
  };

  const sendAdminChatMessage = () => {
    if (!adminChatInput.trim()) return;

    const lowerInput = adminChatInput.toLowerCase();

    // generalized Navigation Logic using PROJECT_TABS
    const targetTab = PROJECT_TABS.find(tab => lowerInput.includes(`@${tab.keyword}`));

    if (targetTab) {
      console.log(`Keyword @${targetTab.keyword} detected! Navigating to ${targetTab.label}...`);

      // Close the modal
      setAdminChatModalVisible(false);
      setSelectedProjectForChat(null);
      setAdminChatInput("");
      setSuggestions([]);

      // Navigate to Project Overview -> Target Tab
      navigation.navigate("Overview", {
        project: selectedProjectForChat,
        initialTab: targetTab.id
      });
      return;
    }

    setAdminChatInput(prev => ""); // Clear input
    setSuggestions([]);
  };

  // ===============================
  // Fetch Data
  // ===============================
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoading(true);

      const response = await fetch(CLIENT_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await response.json();
      const list = Array.isArray(json.data) ? json.data : [];

      const stored = await AsyncStorage.getItem("userData");
      const user = stored ? JSON.parse(stored) : null;
      if (user) {
        setCurrentUserId(user.id || user._id);
      }

      if (!user) {
        console.log("⚠ No user found in storage");
        return;
      }

      const loggedInId = String(user.id);
      const loggedInEmail = user.email;

      const filteredList = list.filter((item) => {
        const createdBy = item?.createdBy ? String(item.createdBy) : null;
        const clientEmail = item?.clientEmail;
        return createdBy === loggedInId || clientEmail === loggedInEmail;
      });

      setDataList(filteredList);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ===============================
  // Delete Item
  // ===============================
  const deleteItem = async (id) => {
    try {
      openSwipeRefs.current.get(id)?.close();
      openSwipeRefs.current.delete(id);
      const token = await AsyncStorage.getItem('userToken')
      setDataList((prev) => prev.filter((x) => x._id !== id));

      await fetch(`${CLIENT_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      Alert.alert("Error", "Delete failed");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert("Delete Proposal", `Are you sure you want to delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem(item._id) },
    ]);
  };

  const renderRightActions = (progress, dragX, item) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [responsiveWidth(100), 0],
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item)}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ===============================
  // Navigation
  // ===============================
  const handleAddProject = () => {
    navigation.navigate('CustomerChooseTemplate');
  };

  // ===============================
  // Search
  // ===============================
  const filteredList = dataList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===============================
  // Get Status Color
  // ===============================
  const getStatusColor = (status) => {
    const statusLower = (status || "active").toLowerCase();
    switch (statusLower) {
      case "completed":
        return { bg: "#ECFDF5", dot: "#10B981", text: "#059669" };
      case "in progress":
      case "active":
        return { bg: "#EFF6FF", dot: "#3B82F6", text: "#2563EB" };
      case "pending":
        return { bg: "#FEF3C7", dot: "#F59E0B", text: "#D97706" };
      case "on hold":
        return { bg: "#FEE2E2", dot: "#EF4444", text: "#DC2626" };
      case "proposal under approval":
        return { bg: "#F5F3FF", dot: "#8B5CF6", text: "#7C3AED" };
      default:
        return { bg: "#F3F4F6", dot: "#6B7280", text: "#4B5563" };
    }
  };

  // ===============================
  // AI Modal Handlers - ENHANCED
  // ===============================
  const openAIModal = () => {
    setModalVisible(true);
    setShowWelcome(true);
    setMessages([]);
    setChatSessionId(null);
    setShowSubmitButton(false);
    setProposalData(null);

    // Animate modal slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Animate welcome content
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      // Start flow if opening
      sendMessage(null, true, null); // Pass explicit null to force new session
    });
  };

  const closeAIModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setShowWelcome(true);
      setMessages([]);
      setShowSubmitButton(false);
      setProposalData(null);
    });
  };

  const sendMessage = async (text, system = false, overrideSessionId = undefined, displayText = null) => {
    const textToSend = text || inputText.trim();
    if (!textToSend && !system) return;

    const currentSessionId = overrideSessionId !== undefined ? overrideSessionId : chatSessionId;

    if (!system) {
      setMessages((prev) => [
        ...prev,
        {
          text: displayText || textToSend,
          isUser: true,
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      setInputText("");
      setShowWelcome(false);
    }

    setIsTyping(true);

    console.log("Sending chat message:", { message: system ? "__START__" : textToSend, sessionId: currentSessionId });

    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: system ? "__START__" : textToSend,
          sessionId: currentSessionId,
        }),
      });

      console.log("Chat Response Status:", res.status);

      const data = await res.json();
      console.log("Chat Response Data:", data);
      setChatSessionId(data.sessionId);

      if (data.action === "PROPOSAL_READY") {
        console.log("Proposal Ready - All details collected!");

        // Store proposal data
        setProposalData(data);

        // Show success message and submit button
        setMessages((prev) => [
          ...prev,
          {
            text: "🎉 All details collected! Review and submit your proposal.",
            isUser: false,
            id: Date.now() + 1,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Show the submit button
        setShowSubmitButton(true);
        setIsTyping(false);
        return;
      }

      // Only show bot response if it's not a system initialization message
      if (!system) {
        setMessages((prev) => [
          ...prev,
          {
            text: data.botMessage,
            isUser: false,
            id: Date.now() + 1,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: data.options || [],
            cards: data.cards || [],
            inputType: data.inputType || null,
          },
        ]);

        // Scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }

    } catch (err) {
      console.error("Chat Error:", err);
      Alert.alert("Error", "Failed to connect to AI assistant");
    } finally {
      setIsTyping(false);
    }
  };

  // ===============================
  // Handle Proposal Submission
  // ===============================
  const handleSubmitProposal = async () => {
    console.log("=== PROPOSAL SUBMISSION DATA ===");
    console.log("Session ID:", chatSessionId);
    console.log("Complete Proposal Data:", proposalData);
    console.log("this isme ", JSON.stringify(proposalData, null, 2))
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    const payload = {
      name: proposalData.proposalData.projectName,
      location: proposalData.proposalData.projectLocation,
      projectImage: proposalData.proposalData.projectTypeDetails?.image || "",
      projectType: proposalData.proposalData.projectTypeDetails?._id || null,
      needsNewSiteSurvey: proposalData.proposalData.surveyType == "TEMPLATE_SURVEY" ? false : true,
      projectDocuments: proposalData.proposalData.supportingDocumentUrls,
      clientName: userData.name,
      clientEmail: userData.email,
      plans: proposalData.proposalData.plans,
      category: proposalData.proposalData.category,

      landArea: proposalData.proposalData.landArea,
      clientPhone: proposalData.proposalData.mobileNumber,
      description: proposalData.proposalData.customRequirements || proposalData.proposalData.projectTypeDetails.description || '',
      status: "Proposal Under Approval",
    }

    if (proposalData.proposalData.projectTypeDetails == null) {
      payload.budget = proposalData.proposalData.budget;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("token", token);
      const response = await fetch(`${process.env.BASE_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("==== API RESPONSE ====");
      console.log(data);

      if (response.ok) {
        Alert.alert("Success", "Proposal submitted successfully!");
        navigation.navigate("ClientTabs");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }

    } catch (error) {
      console.log("API ERROR:", error);
      Alert.alert("Network Error", "Unable to submit proposal.");
    }

    // Extract and log all collected data from messages
    console.log("\n=== DETAILED CHAT CONVERSATION ===");
    messages.forEach((msg, index) => {
      const prefix = msg.isUser ? "👤 User" : "🤖 Bot";
      console.log(`${index + 1}. ${prefix}: ${msg.text}`);

      // Log additional data from bot responses
      if (!msg.isUser) {
        if (msg.options && msg.options.length > 0) {
          console.log(`   Options offered: ${msg.options.map(o => o.label).join(', ')}`);
        }
        if (msg.inputType) {
          console.log(`   Input type expected: ${msg.inputType}`);
        }
      }
    });

    console.log("\n=== FINAL PROPOSAL SUMMARY ===");
    if (proposalData) {
      console.log("Bot Message:", proposalData.botMessage);
      console.log("Session ID:", proposalData.sessionId);
      console.log("Action:", proposalData.action);
    }

    console.log("====================================\n");

    // Show success message
    Alert.alert(
      "Proposal Submitted Successfully!",
      "Your proposal has been submitted. All data has been logged to console.",
      [
        {
          text: "OK",
          onPress: () => {
            // Close the modal
            closeAIModal();
            // Refresh the data
            onRefresh();
          }
        }
      ]
    );
  };

  const generateSignature = async (timestamp) => {
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
  };

  const handleFileUpload = async () => {
    console.log("Starting File Upload Process...");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result);

      if (result.canceled) {
        console.log("Document Picker Cancelled");
        return;
      }

      const file = result.assets[0];
      console.log("File Selected:", file);
      setIsUploading(true);

      const timestamp = Math.round(Date.now() / 1000);
      console.log("Generating Signature with timestamp:", timestamp);
      const signature = await generateSignature(timestamp);
      console.log("Signature Generated:", signature);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/octet-stream',
        name: file.name,
      });
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;
      console.log("Uploading to:", uploadUrl);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Upload Response Status:", res.status);
      const responseText = await res.text();
      console.log("Upload Response Text:", responseText);

      const data = JSON.parse(responseText);

      if (data.secure_url) {
        console.log("Upload Success. URL:", data.secure_url);
        // Send the URL as the message
        sendMessage(data.secure_url);
      } else {
        console.error("Upload Failed Data:", data);
        Alert.alert("Upload Failed", "Could not upload file.");
      }

    } catch (err) {
      console.error("Upload Error:", err);
      Alert.alert("Error", "File upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleQuickAction = (actionText) => {
    sendMessage(actionText);
  };

  // ===============================
  // Calculate Progress based on Status
  // ===============================
  const getProgressValue = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "completed":
        return 100;
      case "in progress":
        return 65;
      case "active":
        return 50;
      case "pending":
        return 30;
      case "proposal under approval":
        return 20;
      case "on hold":
        return 10;
      default:
        return 40;
    }
  };

  // ===============================
  // Render Input Section
  // ===============================
  const renderInputSection = () => {
    // If we should show submit button
    if (showSubmitButton) {
      return (
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitProposal}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.submitButtonGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.submitButtonText}>Submit Proposal</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              // Optionally, allow user to go back and edit
              setShowSubmitButton(false);
              setMessages((prev) => prev.slice(0, -1)); // Remove the last message
            }}
          >
            <Text style={styles.editButtonText}>Edit Details</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Normal input section
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

    if (lastMessage && !lastMessage.isUser && lastMessage.inputType === 'file') {
      return (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleFileUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.uploadButtonText}>Upload Document (PDF/Image)</Text>
            </>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TextInput
            style={styles.chatInput}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline={!lastMessage || !lastMessage.inputType || ['text', 'textarea'].includes(lastMessage.inputType)}
            maxLength={500}
            keyboardType={
              lastMessage && lastMessage.inputType === 'number' ? 'numeric' :
                lastMessage && lastMessage.inputType === 'phone' ? 'phone-pad' :
                  lastMessage && lastMessage.inputType === 'email' ? 'email-address' :
                    'default'
            }
          />

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={inputText.trim() ? ["#0066FF", "#3B82F6"] : ["#E5E7EB", "#D1D5DB"]}
              style={styles.sendButtonGradient}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? "white" : "#9CA3AF"}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.inputFooter}>
          <View style={styles.inputFooterLeft}>
            <Ionicons name="shield-checkmark" size={12} color="#10B981" />
            <Text style={styles.inputFooterText}>Secure & Private</Text>
          </View>
          <Text style={styles.characterCount}>{inputText.length}/500</Text>
        </View>
      </>
    );
  };

  // ===============================
  // Typing Indicator Component
  // ===============================
  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = (dot, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -10,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animate(dot1, 0);
      animate(dot2, 200);
      animate(dot3, 400);
    }, []);

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
          </View>
        </View>
      </View>
    );
  };

  // ===============================
  // Responsive Premium Card Component
  // ===============================
  const Card = ({ item, index }) => {
    const statusColors = getStatusColor(item.status);
    const progress = getProgressValue(item.status);

    return (
      <View style={{ marginBottom: responsiveHeight(16) }}>
        <Swipeable
          ref={(ref) => ref && openSwipeRefs.current.set(item._id, ref)}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item)
          }
          onSwipeableWillOpen={() => {
            openSwipeRefs.current.forEach((ref, id) => {
              if (id !== item._id) ref?.close();
            });
          }}
        >
          <TouchableOpacity
            style={[
              styles.enhancedCard,
              { 
                padding: responsiveHeight(isSmallScreen ? 16 : 20),
                borderRadius: responsiveWidth(isSmallScreen ? 16 : 20),
              }
            ]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Overview', { project: item })}
          >
            {/* Card Header with Image and Basic Info */}
            <View style={styles.cardHeader}>
              <View style={[
                styles.imageContainer,
                { 
                  width: responsiveWidth(isSmallScreen ? 50 : 60),
                  height: responsiveWidth(isSmallScreen ? 50 : 60),
                  marginRight: responsiveWidth(isSmallScreen ? 12 : 16),
                }
              ]}>
                {item.projectImage ? (
                  <Image
                    source={{ uri: item.projectImage }}
                    style={styles.projectImage}
                    resizeMode="cover"
                  />
                ) : item.projectType?.image ? (
                  <Image
                    source={{ uri: item.projectType.image }}
                    style={styles.projectImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <LinearGradient
                      colors={['#EFF6FF', '#DBEAFE']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.projectIconGradient}
                    >
                      <Ionicons 
                        name={item.category?.includes('Residential') ? 'home' : 
                              item.category?.includes('Commercial') ? 'business' : 
                              item.projectType?.projectTypeName?.includes('Residential') ? 'home' :
                              item.projectType?.projectTypeName?.includes('Commercial') ? 'business' : 
                              'construct'} 
                        size={responsiveWidth(isSmallScreen ? 24 : 28)} 
                        color="#2563EB" 
                      />
                    </LinearGradient>
                  </View>
                )}
              </View>
              
              <View style={styles.headerInfo}>
                <View style={styles.titleRow}>
                  <Text style={[
                    styles.projectName,
                    { fontSize: responsiveFont(isSmallScreen ? 16 : 18) }
                  ]} numberOfLines={2}>
                    {item.name || "Untitled Project"}
                  </Text>
                  
                  {/* Top Right Chat Button */}
                  <TouchableOpacity
                    style={styles.headerChatBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      openAdminChat(item);
                    }}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={responsiveWidth(20)} color="#0066FF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={responsiveWidth(14)} color="#6B7280" />
                  <Text style={[
                    styles.locationText,
                    { fontSize: responsiveFont(isSmallScreen ? 13 : 14) }
                  ]} numberOfLines={1}>
                    {item.location || "No location set"}
                  </Text>
                </View>
                
                <View style={styles.projectTypeRow}>
                  <View style={styles.projectTypeBadge}>
                    <Ionicons 
                      name={item.category?.includes('Residential') ? 'home-outline' : 
                            item.category?.includes('Commercial') ? 'business-outline' : 
                            item.projectType?.projectTypeName?.includes('Residential') ? 'home-outline' :
                            item.projectType?.projectTypeName?.includes('Commercial') ? 'business-outline' : 
                            'cube-outline'} 
                      size={responsiveWidth(12)} 
                      color="#4B5563" 
                    />
                    <Text style={[
                      styles.projectTypeText,
                      { fontSize: responsiveFont(11) }
                    ]}>
                      {item.projectType?.projectTypeName || item.category || "General"}
                    </Text>
                  </View>
                  
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                    <Text style={[
                      styles.statusText,
                      { color: statusColors.text, fontSize: responsiveFont(11) }
                    ]}>
                      {item.status || "Active"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[
                  styles.progressLabel,
                  { fontSize: responsiveFont(isSmallScreen ? 13 : 14) }
                ]}>
                  Progress
                </Text>
                <Text style={[
                  styles.progressPercentage,
                  { fontSize: responsiveFont(isSmallScreen ? 14 : 15) }
                ]}>
                  {progress}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#0066FF', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Footer with Date and View Details */}
            <View style={styles.cardFooter}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={responsiveWidth(14)} color="#9CA3AF" />
                <Text style={[
                  styles.dateText,
                  { fontSize: responsiveFont(isSmallScreen ? 12 : 13) }
                ]}>
                  Created: {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                    : 'N/A'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.viewDetailsBtn}
                onPress={() => navigation.navigate('Overview', { project: item })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.viewDetailsText,
                  { fontSize: responsiveFont(isSmallScreen ? 13 : 14) }
                ]}>
                  View Details
                </Text>
                <Ionicons name="chevron-forward" size={responsiveWidth(16)} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  };

  // ===============================
  // Responsive Skeleton Component
  // ===============================
  const SkeletonCard = ({ index }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;
    const pulseAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Gentle shimmer effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Subtle pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 0.98,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      return () => {
        shimmerAnimation.stopAnimation();
        pulseAnimation.stopAnimation();
      };
    }, []);

    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View style={[
        styles.skeletonCard,
        { 
          transform: [{ scale: pulseAnimation }],
          padding: responsiveHeight(isSmallScreen ? 16 : 18),
          marginBottom: responsiveHeight(14),
        }
      ]}>
        <View style={styles.skeletonCardHeader}>
          <Animated.View style={[
            styles.skeletonImage,
            { 
              opacity: shimmerOpacity,
              width: responsiveWidth(isSmallScreen ? 48 : 56),
              height: responsiveWidth(isSmallScreen ? 48 : 56),
              marginRight: responsiveWidth(isSmallScreen ? 12 : 14),
            }
          ]} />
          <View style={styles.skeletonHeaderInfo}>
            <Animated.View
              style={[
                styles.skeletonTextLine,
                { 
                  width: '70%', 
                  height: responsiveHeight(isSmallScreen ? 16 : 18),
                  marginBottom: responsiveHeight(8),
                  opacity: shimmerOpacity 
                }
              ]}
            />
            <View style={styles.skeletonLocationRow}>
              <Animated.View
                style={[
                  styles.skeletonIcon,
                  { 
                    width: responsiveWidth(14),
                    height: responsiveWidth(14),
                    opacity: shimmerOpacity 
                  }
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonTextLine,
                  { 
                    width: '80%', 
                    height: responsiveHeight(14),
                    marginLeft: responsiveWidth(6),
                    opacity: shimmerOpacity 
                  }
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.skeletonMetaRow}>
          <View style={styles.skeletonDueDateContainer}>
            <Animated.View
              style={[
                styles.skeletonIcon,
                { 
                  width: responsiveWidth(16),
                  height: responsiveWidth(16),
                  opacity: shimmerOpacity 
                }
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonTextLine,
                { 
                  width: responsiveWidth(100),
                  height: responsiveHeight(14),
                  marginLeft: responsiveWidth(6),
                  opacity: shimmerOpacity 
                }
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.skeletonBadge,
              { 
                width: responsiveWidth(90),
                height: responsiveHeight(28),
                opacity: shimmerOpacity 
              }
            ]}
          />
        </View>

        <View style={styles.skeletonProgressSection}>
          <View style={styles.skeletonProgressHeader}>
            <Animated.View
              style={[
                styles.skeletonTextLine,
                { 
                  width: responsiveWidth(60),
                  height: responsiveHeight(12),
                  opacity: shimmerOpacity 
                }
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonTextLine,
                { 
                  width: responsiveWidth(35),
                  height: responsiveHeight(12),
                  opacity: shimmerOpacity 
                }
              ]}
            />
          </View>
          <View style={styles.skeletonProgressBar}>
            <Animated.View
              style={[
                styles.skeletonProgressFill,
                {
                  width: `${(index % 4) * 20 + 40}%`,
                  opacity: shimmerOpacity
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.skeletonDetailsButton}>
          <Animated.View
            style={[
              styles.skeletonTextLine,
              { 
                width: responsiveWidth(100),
                height: responsiveHeight(14),
                opacity: shimmerOpacity 
              }
            ]}
          />
          <Animated.View
            style={[
              styles.skeletonIcon,
              { 
                width: responsiveWidth(20),
                height: responsiveWidth(20),
                opacity: shimmerOpacity 
              }
            ]}
          />
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={[styles.loadingText, { fontSize: responsiveFont(15) }]}>
            Loading Projects...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header title="Welcome to SkyStruct" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search + Add Button + AI Button */}
        <View style={[
          styles.searchContainer,
          { 
            paddingHorizontal: responsiveWidth(16),
            paddingTop: responsiveHeight(16),
            paddingBottom: responsiveHeight(12),
            gap: responsiveWidth(12),
          }
        ]}>
          <View style={[
            styles.searchBar,
            {
              paddingHorizontal: responsiveWidth(16),
              paddingVertical: responsiveHeight(14),
            }
          ]}>
            <Ionicons name="search" size={responsiveWidth(20)} color="#9CA3AF" />
            <TextInput
              placeholder="Search Projects..."
              placeholderTextColor="#9CA3AF"
              style={[
                styles.searchInput,
                {
                  marginLeft: responsiveWidth(10),
                  fontSize: responsiveFont(15),
                }
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={responsiveWidth(20)} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.aiButton,
              {
                width: responsiveWidth(isSmallScreen ? 50 : 54),
                height: responsiveWidth(isSmallScreen ? 50 : 54),
                borderRadius: responsiveWidth(12),
              }
            ]} 
            onPress={openAIModal}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.aiButtonGradient}
            >
              <Ionicons name="sparkles" size={responsiveWidth(24)} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* List Header */}
        {filteredList.length > 0 && (
          <View style={[
            styles.listHeader,
            { 
              paddingHorizontal: responsiveWidth(16),
              paddingBottom: responsiveHeight(12),
            }
          ]}>
            <Text style={[
              styles.listHeaderText,
              { fontSize: responsiveFont(17) }
            ]}>
              {searchQuery ? `${filteredList.length} Result${filteredList.length !== 1 ? 's' : ''}` : 'Your Projects'}
            </Text>
          </View>
        )}

        {/* List */}
        <View style={[
          styles.listContainer,
          { paddingHorizontal: responsiveWidth(16) }
        ]}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} index={index} />
            ))
          ) : filteredList.length === 0 ? (
            <View style={[
              styles.empty,
              { 
                paddingVertical: responsiveHeight(60),
                paddingHorizontal: responsiveWidth(32),
              }
            ]}>
              <View style={[
                styles.emptyIconContainer,
                { 
                  width: responsiveWidth(120),
                  height: responsiveWidth(120),
                  marginBottom: responsiveHeight(24),
                }
              ]}>
                <Ionicons name="folder-open-outline" size={responsiveWidth(64)} color="#0066FF" />
              </View>
              <Text style={[
                styles.emptyTitle,
                { fontSize: responsiveFont(22) }
              ]}>
                No Projects Found
              </Text>
              <Text style={[
                styles.emptySubtitle,
                { fontSize: responsiveFont(15) }
              ]}>
                {searchQuery
                  ? "Try adjusting your search terms or clear the search to see all proposals"
                  : "Get started by creating your first proposal and begin managing your projects efficiently"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity 
                  style={styles.emptyButton} 
                  onPress={openAIModal}
                >
                  <Ionicons name="sparkles" size={responsiveWidth(22)} color="white" />
                  <Text style={[
                    styles.emptyButtonText,
                    { fontSize: responsiveFont(15) }
                  ]}>
                    Create with AI Assistant
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredList.map((item, index) => (
              <Card key={item._id} item={item} index={index} />
            ))
          )}
        </View>

        <View style={{ height: responsiveHeight(40) }} />
      </ScrollView>

      {/* ENHANCED AI Chat Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeAIModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { 
                transform: [{ translateY: slideAnim }],
                height: windowHeight * 0.85,
              },
            ]}
          >
            {/* Enhanced Modal Header */}
            <LinearGradient
              colors={["#0066FF", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.modalHeader,
                {
                  paddingHorizontal: responsiveWidth(20),
                  paddingTop: responsiveHeight(20),
                  paddingBottom: responsiveHeight(20),
                }
              ]}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.aiAvatarContainer}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={[
                      styles.aiAvatar,
                      {
                        width: responsiveWidth(48),
                        height: responsiveWidth(48),
                      }
                    ]}
                  >
                    <Ionicons name="sparkles" size={responsiveWidth(24)} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.modalHeaderText}>
                  <Text style={[
                    styles.modalTitle,
                    { fontSize: responsiveFont(19) }
                  ]}>
                    AI Assistant
                  </Text>
                  <Text style={[
                    styles.modalSubtitle,
                    { fontSize: responsiveFont(13) }
                  ]}>
                    Building Construction Expert
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    width: responsiveWidth(36),
                    height: responsiveWidth(36),
                  }
                ]}
                onPress={closeAIModal}
              >
                <Ionicons name="close" size={responsiveWidth(24)} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={[
                styles.chatContent,
                { padding: responsiveWidth(20) }
              ]}
              showsVerticalScrollIndicator={false}
            >
              {showWelcome ? (
                <Animated.View
                  style={[
                    styles.welcomeContainer,
                    { transform: [{ scale: scaleAnim }] }
                  ]}
                >
                  <LinearGradient
                    colors={["#F0F9FF", "#E0F2FE"]}
                    style={[
                      styles.welcomeGradient,
                      { padding: responsiveWidth(28) }
                    ]}
                  >
                    <View style={styles.welcomeIconContainer}>
                      <LinearGradient
                        colors={["#0066FF", "#3B82F6"]}
                        style={[
                          styles.welcomeIcon,
                          {
                            width: responsiveWidth(72),
                            height: responsiveWidth(72),
                          }
                        ]}
                      >
                        <Ionicons name="construct" size={responsiveWidth(32)} color="white" />
                      </LinearGradient>
                    </View>

                    <Text style={[
                      styles.welcomeTitle,
                      { fontSize: responsiveFont(22) }
                    ]}>
                      Welcome to AI Building Assistant! 🏗️
                    </Text>
                    <Text style={[
                      styles.welcomeMessage,
                      { fontSize: responsiveFont(15) }
                    ]}>
                      I'm here to help you with construction planning, cost estimation, material selection, and project management.
                    </Text>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                      <Text style={[
                        styles.quickActionsTitle,
                        { fontSize: responsiveFont(14) }
                      ]}>
                        Quick Actions
                      </Text>
                      <View style={[
                        styles.quickActionsGrid,
                        { gap: responsiveWidth(12) }
                      ]}>
                        {quickActions.map((action) => (
                          <TouchableOpacity
                            key={action.id}
                            style={[
                              styles.quickActionCard,
                              { 
                                width: (windowWidth - responsiveWidth(80)) / 3,
                                padding: responsiveWidth(12),
                              }
                            ]}
                            onPress={() => handleQuickAction(action.text)}
                            activeOpacity={0.7}
                          >
                            <LinearGradient
                              colors={[action.color, action.color + "CC"]}
                              style={[
                                styles.quickActionIconContainer,
                                {
                                  width: responsiveWidth(48),
                                  height: responsiveWidth(48),
                                }
                              ]}
                            >
                              <Ionicons name={action.icon} size={responsiveWidth(22)} color="white" />
                            </LinearGradient>
                            <Text style={[
                              styles.quickActionText,
                              { fontSize: responsiveFont(13) }
                            ]}>
                              {action.text}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <View key={msg.id} style={{ marginBottom: responsiveHeight(16) }}>

                      {/* Message Bubble + Avatar Row */}
                      <View style={[
                        styles.messageWrapper,
                        msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                        { marginBottom: (msg.options?.length > 0 || msg.cards?.length > 0) ? responsiveHeight(4) : 0 }
                      ]}>
                        {!msg.isUser && (
                          <View style={styles.aiMessageAvatar}>
                            <LinearGradient
                              colors={["#10B981", "#059669"]}
                              style={[
                                styles.messageAvatar,
                                {
                                  width: responsiveWidth(32),
                                  height: responsiveWidth(32),
                                }
                              ]}
                            >
                              <Ionicons name="sparkles" size={responsiveWidth(16)} color="white" />
                            </LinearGradient>
                          </View>
                        )}

                        <View style={styles.messageContent}>
                          <View
                            style={[
                              styles.messageBubble,
                              msg.isUser ? styles.userMessage : styles.aiMessage,
                              { padding: responsiveWidth(14) }
                            ]}
                          >
                            <Text style={[
                              styles.messageText,
                              msg.isUser ? styles.userMessageText : styles.aiMessageText,
                              { fontSize: responsiveFont(15) }
                            ]}>
                              {isFileUrl(msg.text) ? (
                                <FileAttachment url={msg.text} isUser={msg.isUser} />
                              ) : (
                                msg.text
                              )}
                            </Text>
                          </View>
                          <Text style={[
                            styles.messageTime,
                            msg.isUser ? styles.userMessageTime : styles.aiMessageTime,
                            { fontSize: responsiveFont(11) }
                          ]}>
                            {msg.timestamp}
                          </Text>
                        </View>

                        {msg.isUser && (
                          <View style={styles.userMessageAvatar}>
                            <View style={[
                              styles.messageAvatar,
                              {
                                width: responsiveWidth(32),
                                height: responsiveWidth(32),
                              }
                            ]}>
                              <Ionicons name="person" size={responsiveWidth(16)} color="#0066FF" />
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Options & Cards Container */}
                      {!msg.isUser && (
                        <View style={{ marginLeft: responsiveWidth(42) }}>
                          {msg.options?.length > 0 && (
                            <View style={[
                              styles.optionRow,
                              { 
                                gap: responsiveWidth(8),
                                marginTop: responsiveHeight(8),
                              }
                            ]}>
                              {msg.options.map((opt, i) => (
                                <TouchableOpacity
                                  key={opt.value + i}
                                  style={[
                                    styles.optionBtn,
                                    {
                                      paddingHorizontal: responsiveWidth(14),
                                      paddingVertical: responsiveHeight(10),
                                    }
                                  ]}
                                  onPress={() => sendMessage(opt.value)}
                                >
                                  <Text style={{ 
                                    color: "#2563EB", 
                                    fontWeight: "600",
                                    fontSize: responsiveFont(14)
                                  }}>
                                    {opt.label}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}

                          {msg.cards?.length > 0 && (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ paddingVertical: responsiveHeight(5) }}
                              style={{ marginTop: responsiveHeight(8) }}
                            >
                              {msg.cards.map((c) => (
                                <TouchableOpacity
                                  key={c.id}
                                  style={[
                                    styles.templateCard,
                                    {
                                      width: responsiveWidth(200),
                                      padding: responsiveWidth(14),
                                      marginRight: responsiveWidth(12),
                                    }
                                  ]}
                                  onPress={() => sendMessage(c.id, false, undefined, c.title)}
                                >
                                  <Text style={{ 
                                    fontWeight: "700", 
                                    marginBottom: responsiveHeight(4),
                                    fontSize: responsiveFont(16)
                                  }}>
                                    {c.title}
                                  </Text>
                                  <Text style={{ 
                                    fontSize: responsiveFont(12), 
                                    color: "#4B5563", 
                                    marginBottom: responsiveHeight(2) 
                                  }}>
                                    Size: {c.landArea}
                                  </Text>
                                  <Text style={{ 
                                    fontSize: responsiveFont(12), 
                                    color: "#10B981", 
                                    fontWeight: "600" 
                                  }}>
                                    {c.budget}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          )}
                        </View>
                      )}

                    </View>
                  ))}

                  {isTyping && <TypingIndicator />}
                </>
              )}
            </ScrollView>

            {/* Enhanced Input Container */}
            <View style={[
              styles.inputWrapper,
              {
                paddingTop: responsiveHeight(12),
                paddingBottom: Platform.OS === "ios" ? responsiveHeight(24) : responsiveHeight(12),
                paddingHorizontal: responsiveWidth(16),
              }
            ]}>
              {renderInputSection()}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </GestureHandlerRootView>
  );
}

// ===============================
// RESPONSIVE STYLES WITH MINIMAL BORDERS
// ===============================
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  loadingContainer: {
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    color: "#6B7280",
    fontWeight: "500",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,
    color: "#111827",
  },

  aiButton: {
    overflow: "hidden",
  },

  aiButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // List Header
  listHeader: {
    paddingBottom: 12,
  },

  listHeaderText: {
    fontWeight: "700",
    color: "#111827",
  },

  // List Container
  listContainer: {
  },

  // ===============================
  // ENHANCED PREMIUM CARD STYLES
  // ===============================
  enhancedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  projectImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  projectIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  headerInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  projectName: {
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },

  headerChatBtn: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#DBEAFE',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },

  locationText: {
    color: '#6B7280',
    flex: 1,
  },

  projectTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  projectTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },

  projectTypeText: {
    color: '#4B5563',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Progress Section
  progressSection: {
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  progressLabel: {
    color: '#6B7280',
    fontWeight: '500',
  },

  progressPercentage: {
    color: '#0066FF',
    fontWeight: '700',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 6,
  },

  // Divider
  cardDivider: {
    height: 0.5,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },

  dateText: {
    color: '#6B7280',
    fontWeight: '500',
  },

  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#DBEAFE',
  },

  viewDetailsText: {
    color: '#0066FF',
    fontWeight: '600',
  },

  // Delete Action
  deleteAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: "100%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  // ===============================
  // SKELETON LOADING STYLES
  // ===============================
  skeletonCard: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  skeletonImage: {
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  skeletonHeaderInfo: {
    flex: 1,
  },
  skeletonLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonIcon: {
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  skeletonTextLine: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  skeletonMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skeletonDueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  skeletonProgressSection: {
    marginBottom: 16,
  },
  skeletonProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skeletonProgressBar: {
    height: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    overflow: 'hidden',
  },
  skeletonProgressFill: {
    height: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  skeletonDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#F3F4F6',
  },

  // Empty State
  empty: {
    alignItems: "center",
  },

  emptyIconContainer: {
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptySubtitle: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // ===============================
  // AI MODAL STYLES
  // ===============================
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  aiAvatarContainer: {
  },

  aiAvatar: {
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
  },

  modalHeaderText: {
    gap: 2,
  },

  modalTitle: {
    fontWeight: "700",
    color: "#FFFFFF",
  },

  modalSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },

  closeButton: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  chatContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  chatContent: {
    paddingBottom: 10,
  },

  // Welcome Screen
  welcomeContainer: {
    alignItems: "center",
  },

  welcomeGradient: {
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E0F2FE",
  },

  welcomeIconContainer: {
    marginBottom: 20,
  },

  welcomeIcon: {
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.5)",
  },

  welcomeTitle: {
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },

  welcomeMessage: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  quickActionsContainer: {
    width: "100%",
    marginTop: 8,
  },

  quickActionsTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  quickActionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  quickActionIconContainer: {
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  quickActionText: {
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  // Messages
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  userMessageWrapper: {
    justifyContent: "flex-end",
  },

  aiMessageWrapper: {
    justifyContent: "flex-start",
  },

  messageContent: {
    maxWidth: "75%",
    gap: 4,
  },

  messageBubble: {
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  userMessage: {
    backgroundColor: "#0066FF",
    borderTopRightRadius: 4,
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
  },

  messageText: {
    lineHeight: 21,
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  aiMessageText: {
    color: "#111827",
  },

  messageTime: {
    fontWeight: "500",
  },

  userMessageTime: {
    color: "#9CA3AF",
    textAlign: "right",
  },

  aiMessageTime: {
    color: "#9CA3AF",
    textAlign: "left",
  },

  messageAvatar: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },

  aiMessageAvatar: {
  },

  userMessageAvatar: {
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },

  typingBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9CA3AF",
  },

  // Input Container
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  chatInput: {
    flex: 1,
    color: "#111827",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  uploadButton: {
    backgroundColor: "#0066FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginHorizontal: 4,
  },

  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },

  inputFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  inputFooterText: {
    color: "#10B981",
    fontWeight: "600",
  },

  characterCount: {
    color: "#9CA3AF",
    fontWeight: "500",
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 42,
  },

  optionBtn: {
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 0.5,
    borderColor: "#BFDBFE",
  },

  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  // Submit Section Styles
  submitSection: {
    gap: 12,
    paddingHorizontal: 4,
  },

  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  editButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  editButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
});