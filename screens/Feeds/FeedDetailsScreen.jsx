import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from 'components/Header'
import * as DocumentPicker from 'expo-document-picker'
import CustomerBottomNavBar from 'components/CustomerBottomNavBar'

const FeedDetailsScreen = ({ route, navigation }) => {
  const { feed } = route.params
  const [message, setMessage] = useState('')
  const [comments, setComments] = useState(feed.comments || [])
  const [attachedDocument, setAttachedDocument] = useState(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      const newComment = {
        id: Date.now(),
        userName: 'You',
        text: message,
        timestamp: 'Just now',
        document: attachedDocument
      }
      setComments([...comments, newComment])
      setMessage('')
      setAttachedDocument(null)
    }
  }

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      })

      if (result.type === 'success') {
        setAttachedDocument({
          name: result.name,
          uri: result.uri,
          size: result.size,
          type: result.mimeType
        })
      }
    } catch (error) {
      console.log('Document picker error:', error)
    }
  }

  const removeDocument = () => {
    setAttachedDocument(null)
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <StatusBar backgroundColor="#0066FF" barStyle="light-content" />
      
      <Header 
        title={feed.userName} 
        showBackButton={true} 
        onRightIconPress={() => {}} 
        backgroundColor="#0066FF" 
        titleColor="white" 
        iconColor="white" 
      />

      <ScrollView className="px-4 mt-4" showsVerticalScrollIndicator={false}>
        {/* Main Feed Card */}
        <View
          className="bg-white rounded-[20px] p-4 mb-4"
          style={{ borderLeftWidth: 4, borderLeftColor: '#0066FF' }}
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://via.placeholder.com/60' }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-[#1E1E1E] font-bold text-[16px]">{feed.userName}</Text>
              <Text className="text-[#999] text-[12px] mt-1">{feed.timestamp}</Text>
            </View>
          </View>

          <Text className="mt-4 text-[14px] text-[#1E1E1E] leading-5">
            {feed.content}
          </Text>

          {feed.actionButton && (
            <TouchableOpacity 
              className="bg-[#0066FF] rounded-[12px] py-3 mt-4"
              onPress={() => console.log(`Action: ${feed.actionButton}`)}
            >
              <Text className="text-white text-[15px] font-semibold text-center">
                {feed.actionButton}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Chat Button */}
        <TouchableOpacity 
          className="bg-[#00D285] rounded-[12px] py-4 mb-4 flex-row items-center justify-center"
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <Ionicons name="chatbubble" size={20} color="white" />
          <Text className="text-white text-[15px] font-semibold ml-2">
            Chat
          </Text>
        </TouchableOpacity>

        {/* Comments Section */}
        {comments.length > 0 && (
          <>
            <Text className="text-[#1E1E1E] font-bold text-[18px] mb-3">Comments</Text>
            {comments.map((comment, index) => (
              <View
                key={index}
                className="bg-white rounded-[20px] p-4 mb-3"
                style={{ borderLeftWidth: 4, borderLeftColor: '#E0E0E0' }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: 'https://via.placeholder.com/60' }}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <Text className="text-[#1E1E1E] font-bold text-[14px]">{comment.userName}</Text>
                  </View>
                  <Text className="text-[#999] text-[11px]">{comment.timestamp}</Text>
                </View>
                
                <Text className="text-[14px] text-[#1E1E1E] leading-5 mb-2">
                  {comment.text}
                </Text>

                {/* Show attached document in comment */}
                {comment.document && (
                  <View className="flex-row items-center bg-[#F3F4F6] p-2 rounded-lg mt-2">
                    <Ionicons name="document" size={20} color="#0066FF" />
                    <Text className="text-[12px] text-[#1E1E1E] ml-2 flex-1" numberOfLines={1}>
                      {comment.document.name}
                    </Text>
                    <Text className="text-[10px] text-[#999]">
                      {(comment.document.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <View className="h-20"></View>
      </ScrollView>

      {/* Bottom Input Bar */}
      <View className="bg-white px-3 py-3 border-t border-gray-200">
        {/* Attached Document Preview */}
        {attachedDocument && (
          <View className="flex-row items-center justify-between bg-[#E3F2FD] p-3 rounded-lg mb-2">
            <View className="flex-row items-center flex-1">
              <Ionicons name="document" size={20} color="#0066FF" />
              <View className="ml-2 flex-1">
                <Text className="text-[12px] text-[#1E1E1E] font-medium" numberOfLines={1}>
                  {attachedDocument.name}
                </Text>
                <Text className="text-[10px] text-[#666]">
                  {(attachedDocument.size / 1024).toFixed(1)} KB
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={removeDocument}>
              <Ionicons name="close-circle" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row items-center">
          <TextInput
            placeholder="Type your comment..."
            className="flex-1 bg-[#F3F4F6] px-4 py-3 rounded-xl text-[15px]"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {/* Document Upload Button */}
          <TouchableOpacity 
            className="ml-3 bg-[#04D361] p-3 rounded-xl"
            onPress={handleDocumentUpload}
          >
            <Ionicons name="attach" size={22} color="white" />
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity 
            className="ml-3 bg-[#0066FF] p-3 rounded-xl"
            onPress={handleSendMessage}
            disabled={!message.trim() && !attachedDocument}
          >
            <Ionicons name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
       {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View>
    </SafeAreaView>
  )
}

export default FeedDetailsScreen