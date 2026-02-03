
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
const { width } = Dimensions.get('window');

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

  const slideAnim = useRef(new Animated.Value(300)).current;
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
  const [adminChatMessages, setAdminChatMessages] = useState([]);
  const [adminChatInput, setAdminChatInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
    setSelectedProjectForChat(project);
    setAdminChatModalVisible(true);
    // TODO: Fetch existing chat history for this project
    setAdminChatMessages([
      { id: 1, text: `Hello! How can we help you with ${project.name}?`, isUser: false, time: 'Now' }
    ]);
  };

  const closeAdminChat = () => {
    setAdminChatModalVisible(false);
    setSelectedProjectForChat(null);
    setAdminChatMessages([]);
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
      setAdminChatMessages([]);
      setAdminChatInput("");
      setSuggestions([]);

      // Navigate to Project Overview -> Target Tab
      navigation.navigate("Overview", {
        project: selectedProjectForChat,
        initialTab: targetTab.id
      });
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: adminChatInput,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAdminChatMessages(prev => [...prev, newMessage]);
    setAdminChatInput(prev => ""); // Clear input
    setSuggestions([]);
    // TODO: Send to backend
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

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.deleteAction}>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

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
        toValue: 300,
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
        //navigation.navigate("ViewCustomerProposal", { payload: data });
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
  // Card Component
  // ===============================
  const Card = ({ item, index }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <View style={{ marginBottom: 20 }}>
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
          containerStyle={{ overflow: 'visible' }} // Allow shadow to show if outside
        >
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Overview', { project: item })}
          >
            {/* Top Row: Type & Status */}
            <View style={styles.cardTopRow}>
              <View style={styles.projectTypeBadge}>
                <Text style={styles.projectTypeText}>
                  {item.projectType?.projectTypeName || item.category || "General"}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {item.status || "Active"}
                </Text>
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.cardContent}>
              <View style={styles.projectIconContainer}>
                {item.projectImage ? (
                  <Image
                    source={{ uri: item.projectImage }}
                    style={styles.projectImage}
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={['#EFF6FF', '#DBEAFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.projectIconGradient}
                  >
                    <Ionicons name="business" size={24} color="#2563EB" />
                  </LinearGradient>
                )}
              </View>

              <View style={styles.cardMainInfo}>
                <Text style={styles.projectName} numberOfLines={1}>
                  {item.name || "Untitled Project"}
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.location || "No location set"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="calendar-clear-outline" size={14} color="#9CA3AF" />
                <Text style={styles.footerText}>
                  Created: {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                    : 'N/A'}
                </Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => openAdminChat(item)}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0066FF" />
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.viewDetailsBtn}
                onPress={() => navigation.navigate('Overview', { project: item })}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading Projects...</Text>
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
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search Projects..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.aiButton} onPress={openAIModal}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.aiButtonGradient}
            >
              <Ionicons name="sparkles" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* List Header */}
        {filteredList.length > 0 && (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {searchQuery ? `${filteredList.length} Result${filteredList.length !== 1 ? 's' : ''}` : 'Your Projects'}
            </Text>
          </View>
        )}

        {/* List */}
        <View style={styles.listContainer}>
          {filteredList.map((item, index) => (
            <Card key={item._id} item={item} index={index} />
          ))}

          {filteredList.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="folder-open-outline" size={64} color="#0066FF" />
              </View>
              <Text style={styles.emptyTitle}>No Projects Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try adjusting your search terms or clear the search to see all proposals"
                  : "Get started by creating your first proposal and begin managing your projects efficiently"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={styles.emptyButton} onPress={handleAddProject}>
                  <Ionicons name="add-circle" size={22} color="white" />
                  <Text style={styles.emptyButtonText}>Create New Proposal</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
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
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Enhanced Modal Header */}
            <LinearGradient
              colors={["#0066FF", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeader}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.aiAvatarContainer}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.aiAvatar}
                  >
                    <Ionicons name="sparkles" size={24} color="white" />
                  </LinearGradient>
                </View>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>AI Assistant</Text>
                  <Text style={styles.modalSubtitle}>Building Construction Expert</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeAIModal}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatContainer}
              contentContainerStyle={styles.chatContent}
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
                    style={styles.welcomeGradient}
                  >
                    <View style={styles.welcomeIconContainer}>
                      <LinearGradient
                        colors={["#0066FF", "#3B82F6"]}
                        style={styles.welcomeIcon}
                      >
                        <Ionicons name="construct" size={32} color="white" />
                      </LinearGradient>
                    </View>

                    <Text style={styles.welcomeTitle}>
                      Welcome to AI Building Assistant! 🏗️
                    </Text>
                    <Text style={styles.welcomeMessage}>
                      I'm here to help you with construction planning, cost estimation, material selection, and project management.
                    </Text>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsContainer}>
                      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                      <View style={styles.quickActionsGrid}>
                        {quickActions.map((action) => (
                          <TouchableOpacity
                            key={action.id}
                            style={styles.quickActionCard}
                            onPress={() => handleQuickAction(action.text)}
                            activeOpacity={0.7}
                          >
                            <LinearGradient
                              colors={[action.color, action.color + "CC"]}
                              style={styles.quickActionIconContainer}
                            >
                              <Ionicons name={action.icon} size={22} color="white" />
                            </LinearGradient>
                            <Text style={styles.quickActionText}>{action.text}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <View key={msg.id} style={{ marginBottom: 16 }}>

                      {/* Message Bubble + Avatar Row */}
                      <View style={[
                        styles.messageWrapper,
                        msg.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
                        { marginBottom: (msg.options?.length > 0 || msg.cards?.length > 0) ? 4 : 0 }
                      ]}>
                        {!msg.isUser && (
                          <View style={styles.aiMessageAvatar}>
                            <LinearGradient
                              colors={["#10B981", "#059669"]}
                              style={styles.messageAvatar}
                            >
                              <Ionicons name="sparkles" size={16} color="white" />
                            </LinearGradient>
                          </View>
                        )}

                        <View style={styles.messageContent}>
                          <View
                            style={[
                              styles.messageBubble,
                              msg.isUser ? styles.userMessage : styles.aiMessage,
                            ]}
                          >
                            <Text style={[
                              styles.messageText,
                              msg.isUser ? styles.userMessageText : styles.aiMessageText
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
                            msg.isUser ? styles.userMessageTime : styles.aiMessageTime
                          ]}>
                            {msg.timestamp}
                          </Text>
                        </View>

                        {msg.isUser && (
                          <View style={styles.userMessageAvatar}>
                            <View style={styles.messageAvatar}>
                              <Ionicons name="person" size={16} color="#0066FF" />
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Options & Cards Container */}
                      {!msg.isUser && (
                        <View style={{ marginLeft: 42 }}>
                          {msg.options?.length > 0 && (
                            <View style={styles.optionRow}>
                              {msg.options.map((opt, i) => (
                                <TouchableOpacity
                                  key={opt.value + i}
                                  style={styles.optionBtn}
                                  onPress={() => sendMessage(opt.value)}
                                >
                                  <Text style={{ color: "#2563EB", fontWeight: "600" }}>
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
                              contentContainerStyle={{ paddingVertical: 5 }}
                              style={{ marginTop: 8 }}
                            >
                              {msg.cards.map((c) => (
                                <TouchableOpacity
                                  key={c.id}
                                  style={styles.templateCard}
                                  onPress={() => sendMessage(c.id, false, undefined, c.title)}

                                >
                                  <Text style={{ fontWeight: "700", marginBottom: 4 }}>{c.title}</Text>
                                  <Text style={{ fontSize: 12, color: "#4B5563", marginBottom: 2 }}>Size: {c.landArea}</Text>
                                  <Text style={{ fontSize: 12, color: "#10B981", fontWeight: "600" }}>{c.budget}</Text>
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
            <View style={styles.inputWrapper}>
              {renderInputSection()}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Admin Chat Modal */}
      <Modal
        visible={adminChatModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeAdminChat}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.adminChatContainer}>

            {/* Header */}
            <View style={styles.adminChatHeader}>
              <View>
                <Text style={styles.adminChatTitle}>Chat with Admin</Text>
                <Text style={styles.adminChatSubtitle}>
                  {selectedProjectForChat?.name || "Project Support"}
                </Text>
              </View>
              <TouchableOpacity onPress={closeAdminChat} style={styles.closeButtonLight}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              style={styles.chatList}
              contentContainerStyle={{ padding: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              {adminChatMessages.map((msg, idx) => (
                <View
                  key={msg.id || idx}
                  style={[
                    styles.chatBubbleContainer,
                    msg.isUser ? styles.chatBubbleRight : styles.chatBubbleLeft
                  ]}
                >
                  <View
                    style={[
                      styles.chatBubble,
                      msg.isUser ? styles.chatBubbleUser : styles.chatBubbleAdmin
                    ]}
                  >
                    <Text
                      style={[
                        styles.chatBubbleText,
                        msg.isUser ? styles.chatTextUser : styles.chatTextAdmin
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>{msg.time}</Text>
                </View>
              ))}
            </ScrollView>

            {/* 🔥 Keyboard-safe Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
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
                        <View style={styles.suggestionIcon}>
                          <Ionicons name={item.icon} size={18} color="#0066FF" />
                        </View>
                        <View>
                          <Text style={styles.suggestionLabel}>{item.label}</Text>
                          <Text style={styles.suggestionKeyword}>@{item.keyword}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.adminChatInputContainer}>
                <TextInput
                  style={styles.adminChatInput}
                  placeholder="Type a message... (Type @ for options)"
                  value={adminChatInput}
                  onChangeText={handleAdminChatInput}
                />
                <TouchableOpacity onPress={sendAdminChatMessage} style={styles.adminChatSendBtn}>
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

          </View>
        </View>
      </Modal>


    </GestureHandlerRootView >
  );
}

// ===============================
// ENHANCED STYLES
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
    fontSize: 15,
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  addButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
  },

  aiButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  listHeaderText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  // List Container
  listContainer: {
    paddingHorizontal: 16,
  },

  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    // marginBottom handled by wrapper
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden", // clip content
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },

  projectTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  projectTypeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  cardContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },

  projectIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  projectImage: {
    width: '100%',
    height: '100%',
  },

  projectIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardMainInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },

  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
    lineHeight: 24,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  locationText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    fontWeight: '500',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },

  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  footerText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },

  chatBtnText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '600',
  },

  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  viewDetailsText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },

  // Delete Action
  deleteAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    // marginBottom removed as spacing is handled by card wrapper
  },

  deleteBtn: {
    width: 90,
    height: "100%",
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20, // Match updated card radius
    borderBottomRightRadius: 20,
    gap: 6,
  },

  deleteText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // Empty State
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066FF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },

  emptyButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // ===============================
  // ENHANCED AI MODAL STYLES
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
    height: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  aiAvatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },

  modalHeaderText: {
    gap: 2,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },

  closeButton: {
    width: 36,
    height: 36,
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
    padding: 20,
    paddingBottom: 10,
  },

  // Welcome Screen
  welcomeContainer: {
    alignItems: "center",
  },

  welcomeGradient: {
    width: "100%",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },

  welcomeIconContainer: {
    marginBottom: 20,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },

  welcomeMessage: {
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  quickActionCard: {
    width: (width - 80) / 3,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  quickActionText: {
    fontSize: 13,
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
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  userMessage: {
    backgroundColor: "#0066FF",
    borderTopRightRadius: 4,
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  aiMessageText: {
    color: "#111827",
  },

  messageTime: {
    fontSize: 11,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },

  aiMessageAvatar: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  userMessageAvatar: {
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
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
    borderWidth: 1,
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
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
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
    borderWidth: 1,
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
    fontSize: 15,
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
    fontSize: 15,
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
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },

  characterCount: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginLeft: 42,
  },

  optionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  templateCard: {
    width: 200,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 8,
  },

  // Submit Section Styles
  submitSection: {
    gap: 12,
    paddingHorizontal: 4,
  },

  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 17,
    fontWeight: '700',
  },

  editButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  editButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },

  // Admin Chat Modal Styles
  adminChatContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    overflow: 'hidden',
  },

  adminChatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#fff",
  },

  adminChatTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  adminChatSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  closeButtonLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  chatList: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  chatBubbleContainer: {
    marginBottom: 12,
    maxWidth: "80%",
  },

  chatBubbleRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },

  chatBubbleLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },

  chatBubbleUser: {
    backgroundColor: "#0066FF",
    borderBottomRightRadius: 4,
  },

  chatBubbleAdmin: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },

  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },

  chatTextUser: {
    color: "#FFFFFF",
  },

  chatTextAdmin: {
    color: "#111827",
  },

  chatTime: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  adminChatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    gap: 10,

  },

  adminChatInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },

  suggestionsContainer: {
    maxHeight: 180,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },

  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  suggestionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  suggestionKeyword: {
    fontSize: 12,
    color: '#6B7280',
  },

  adminChatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
  },
});































