import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Share, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from 'components/Header'
import * as Clipboard from 'expo-clipboard'

const CustomerSupport = ({ navigation }) => {
  const [message, setMessage] = useState('')
  const scrollViewRef = useRef(null)
  const [showToast, setShowToast] = useState(false)
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: 'Hello there',
      isUser: true,
      time: '9:41'
    },
    {
      id: 2,
      text: 'Hello! How may I assist you today?',
      isUser: false,
      time: '9:41'
    },
    {
      id: 3,
      text: 'Show me what you can do',
      isUser: true,
      time: '9:42'
    },
    {
      id: 4,
      text: 'Of course! As an AI language model, I am equipped to assist with a variety of tasks. Here are some examples of what I can help you with:\n\n- Answer questions. Just ask me anything you like!\n- Generate text. I can write essays, stories, or any other type of content you need.',
      isUser: false,
      time: '9:42'
    }
  ])

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [chatMessages])

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out SkyStruct Customer Support! Get help with your construction projects.',
        title: 'SkyStruct Customer Support'
      })
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType)
        } else {
          // Shared
          console.log('Content shared successfully')
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed')
      }
    } catch (error) {
      console.error('Error sharing:', error.message)
    }
  }

  const handleCopyMessage = async (text) => {
    await Clipboard.setStringAsync(text)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  const handleShareMessage = async (text) => {
    try {
      await Share.share({
        message: text,
      })
    } catch (error) {
      console.error('Error sharing message:', error.message)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
      {/* Header */}
      <Header title="Customer Support" showBackButton={true} />

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.map((msg) => (
          <View key={msg.id} className="mb-3">
            {msg.isUser ? (
              <View className="flex-row justify-end">
                <View className="bg-[#0066FF] rounded-[16px] px-4 py-3 max-w-[80%]">
                  <Text className="text-white text-[15px]" style={{ fontFamily: 'Urbanist-Medium' }}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-row justify-start items-start">
                <View className="bg-[#F5F5F5] rounded-[16px] px-4 py-3 max-w-[75%]">
                  <Text className="text-[#1E1E1E] text-[15px] leading-6" style={{ fontFamily: 'Urbanist-Regular' }}>
                    {msg.text}
                  </Text>
                </View>
                <View className="ml-2 gap-2">
                  <TouchableOpacity
                    onPress={() => handleCopyMessage(msg.text)}
                    className="p-1"
                  >
                    <Ionicons name="copy-outline" size={20} color="#999" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleShareMessage(msg.text)}
                    className="p-1"
                  >
                    <Ionicons name="share-social-outline" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Toast Notification */}
      {showToast && (
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E1E1E] rounded-[12px] px-6 py-4">
          <Text className="text-white text-[15px]" style={{ fontFamily: 'Urbanist-Medium' }}>
            Message has been copied to clipboard!
          </Text>
        </View>
      )}

      {/* Message Input */}
      <View className="px-4 py-3 bg-white border-t border-[#F0F0F0]">
        <View className="flex-row items-center">
          <View className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2 flex-row items-center mr-3">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask me anything..."
              placeholderTextColor="#999"
              className="flex-1 text-[15px] py-2"
              style={{ fontFamily: 'Urbanist-Regular' }}
            />
            <TouchableOpacity 
              onPress={() => {
                if (message.trim()) {
                  const newMessage = {
                    id: chatMessages.length + 1,
                    text: message,
                    isUser: true,
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                  }
                  setChatMessages([...chatMessages, newMessage])
                  setMessage('')
                  
                  // Simulate support response after 1 second
                  setTimeout(() => {
                    const supportResponse = {
                      id: chatMessages.length + 2,
                      text: 'Thank you for your query. Our support team will assist you shortly with your request.',
                      isUser: false,
                      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                    }
                    setChatMessages(prev => [...prev, supportResponse])
                  }, 1000)
                }
              }}
            >
              <Ionicons name="send" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            className="bg-[#0066FF] rounded-[16px] p-3"
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      
    </SafeAreaView>
  )
}

export default CustomerSupport