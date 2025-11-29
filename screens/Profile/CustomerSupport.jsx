import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Share,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Header from "components/Header";
import * as Clipboard from "expo-clipboard";

const CustomerSupport = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello there", isUser: true, time: "9:41" },
    { id: 2, text: "Hello! How may I assist you today?", isUser: false, time: "9:41" },
    { id: 3, text: "Show me what you can do", isUser: true, time: "9:42" },
    {
      id: 4,
      text:
        "Sure! I can assist with:\n\n• Construction project help\n• Answering questions\n• Generating content\n",
      isUser: false,
      time: "9:42",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const handleCopyMessage = async (text) => {
    await Clipboard.setStringAsync(text);
    setShowToast(true);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  const handleShareMessage = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Check out SkyStruct Customer Support!",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: chatMessages.length + 1,
      text: message,
      isUser: true,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setChatMessages([...chatMessages, newMsg]);
    setMessage("");

    setTimeout(() => {
      const autoReply = {
        id: chatMessages.length + 2,
        text: "Thank you for your message! Our support team will respond shortly.",
        isUser: false,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setChatMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const MessageBubble = ({ msg }) => (
    <View className="mb-4">
      {msg.isUser ? (
        <View className="flex-row justify-end">
          <View className="bg-[#4A7CFF] rounded-3xl px-5 py-3.5 max-w-[80%]">
            <Text className="text-white text-[15px]">{msg.text}</Text>
            <Text className="text-white/70 text-[11px] mt-1">{msg.time}</Text>
          </View>
        </View>
      ) : (
        <View className="flex-row justify-start">
          <View className="max-w-[80%]">
            <View className="bg-[#F5F7FA] rounded-3xl px-5 py-3.5">
              <Text className="text-black text-[15px]">{msg.text}</Text>
              <Text className="text-gray-500 text-[11px] mt-1">{msg.time}</Text>
            </View>

            <View className="flex-row gap-3 mt-2 ml-3">
              <TouchableOpacity
                onPress={() => handleCopyMessage(msg.text)}
                className="bg-white rounded-full p-2"
              >
                <Ionicons name="copy-outline" size={16} color="#4A7CFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleShareMessage(msg.text)}
                className="bg-white rounded-full p-2"
              >
                <Ionicons name="share-social-outline" size={16} color="#4A7CFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8F9FD]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

      <Header title="Customer Support" showBackButton={true} />

      {/* CHAT MESSAGES */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={scrollToBottom}
      >
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </ScrollView>

      {/* TOAST */}
      {showToast && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            top: "50%",
            left: "10%",
            right: "10%",
            transform: [{ translateY: -25 }],
          }}
          className="bg-black rounded-2xl px-6 py-4 flex-row items-center"
        >
          <Ionicons name="checkmark" size={16} color="white" />
          <Text className="text-white ml-3">Copied!</Text>
        </Animated.View>
      )}

      {/* FIXED INPUT FIELD */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View
          className="px-4 py-3 bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center gap-3">
            {/* INPUT BOX */}
            <View className="flex-1 bg-[#F5F7FA] rounded-3xl px-5 py-2 flex-row items-center">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message…"
                placeholderTextColor="#8E8E93"
                className="flex-1 text-[15px]"
                multiline
                style={{ minHeight: 40, maxHeight: 120 }}
              />

              {message.length > 0 && (
                <TouchableOpacity onPress={handleSendMessage}>
                  <View className="bg-[#4A7CFF] rounded-full p-2">
                    <Ionicons name="send" size={18} color="white" />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* SHARE BUTTON */}
            <TouchableOpacity
              className="bg-[#4A7CFF] rounded-2xl p-3"
              onPress={handleShareApp}
            >
              <Ionicons name="share-social" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CustomerSupport;
