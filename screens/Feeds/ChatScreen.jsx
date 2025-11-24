import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from 'components/Header'

const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState('')

  // Chat data matching your image exactly
  const chatData = [
    {
      id: 1,
      userName: 'Contractor Ravi Kumar',
      message: 'Slab poured at Site A...',
      timestamp: '2 min ago',
    },
    {
      id: 2, 
      userName: 'Priya',
      message: 'When will work resume?',
      timestamp: '5 min ago',
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic
      setMessage('')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#0066FF" barStyle="light-content" />
      
      {/* Header */}
      <Header 
        title="Chat" 
        showBackButton={true} 
        onRightIconPress={() => {}} 
        backgroundColor="#0066FF" 
        titleColor="white" 
        iconColor="white" 
      />

      {/* Chat Messages with Cards */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {chatData.map((chat) => (
          <View 
            key={chat.id} 
            className="bg-white rounded-[12px] p-4 mb-3 border border-gray-200"
          >
            {/* User Name */}
            <Text className="text-[#1E1E1E] text-[16px] font-bold mb-1">
              {chat.userName}
            </Text>
            
            {/* Message Text */}
            <Text className="text-[#1E1E1E] text-[14px] mb-2">
              {chat.message}
            </Text>
            
            {/* Timestamp */}
            <Text className="text-[#999] text-[12px]">
              {chat.timestamp}
            </Text>
          </View>
        ))}
        
        {/* Bottom Spacing */}
        <View className="h-20"></View>
      </ScrollView>

    
    </SafeAreaView>
  )
}

export default ChatScreen