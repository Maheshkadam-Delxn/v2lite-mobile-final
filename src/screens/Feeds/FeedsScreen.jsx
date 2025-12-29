import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from '@/components/Header'
import CustomerBottomNavBar from '@/components/CustomerBottomNavBar'

const FeedsScreen = ({ navigation }) => {
  const [feedData] = useState([
    {
      id: 1,
      userName: 'Arun Mishra',
      action: 'raised an issue',
      timestamp: '2 weeks ago',
      content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      actionButton: 'Submit Issue Resolution',
      commentCount: 2,
      hasComments: false
    },
    {
      id: 2,
      userName: 'Arun Mishra',
      action: 'updated progress of task',
      timestamp: '2 weeks ago',
      content: '10% of project completed',
      actionButton: 'Update Task Progress',
      commentCount: 2,
      hasComments: false
    },
    {
      id: 3,
      userName: 'Arun Mishra',
      action: 'Created a task',
      timestamp: '2 weeks ago',
      content: 'Project Task (Design)',
      actionButton: 'Update Task Progress',
      commentCount: 2,
      hasComments: true,
      comments: [
        {
          userName: 'Arun Mishra',
          text: 'Done'
        }
      ]
    }
  ])

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      <Header title="Feeds" showBackButton={true} onRightIconPress={() => {}} backgroundColor="#0066FF" titleColor="white" iconColor="white" />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {feedData.map((feed) => (
          <View key={feed.id} className="bg-white mt-4 rounded-[20px] overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: '#0066FF' }}>
            <View className="px-4 py-4">
              {/* User Info */}
              <TouchableOpacity
                className="flex-row items-start mb-3"
                onPress={() => navigation.navigate("FeedDetails", { feed })}
              >
                <View className="w-12 h-12 rounded-full bg-[#E0E0E0] overflow-hidden mr-3">
                  {/* Profile Image - You can replace with actual image */}
                  <Image 
                    source={{ uri: 'https://via.placeholder.com/48' }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-baseline flex-wrap">
                    <Text className="text-[#1E1E1E] text-[15px] font-bold mr-1" style={{ fontFamily: 'Urbanist-Bold' }}>
                      {feed.userName}
                    </Text>
                    <Text className="text-[#1E1E1E] text-[14px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                      {feed.action}
                    </Text>
                  </View>
                  <Text className="text-[#999] text-[12px] mt-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                    {feed.timestamp}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Content */}
              <Text className="text-[#1E1E1E] text-[14px] leading-5 mb-4" style={{ fontFamily: 'Urbanist-Regular' }}>
                {feed.content}
              </Text>

              {/* Action Button and Comment Button */}
              <View className="flex-row items-center">
                <TouchableOpacity 
                  className="flex-1 bg-[#0066FF] rounded-[12px] py-3.5 mr-3"
                  onPress={() => console.log(`Action: ${feed.actionButton}`)}
                >
                  <Text className="text-white text-[15px] font-semibold text-center" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    {feed.actionButton}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="relative bg-[#0066FF] rounded-[14px] p-3.5"
                  onPress={() => console.log('Open comments')}
                >
                  <Ionicons name="chatbubble-outline" size={24} color="white" />
                  {feed.commentCount > 0 && (
                    <View className="absolute -top-1.5 -right-1.5 bg-[#00D285] rounded-full w-5 h-5 items-center justify-center border-2 border-white">
                      <Text className="text-white text-[10px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                        {feed.commentCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Comments Section */}
              {feed.hasComments && feed.comments && (
                <View className="mt-4">
                  {feed.comments.map((comment, index) => (
                    <View key={index} className="flex-row items-start">
                      <View className="w-9 h-9 rounded-full bg-[#E0E0E0] overflow-hidden mr-2">
                        <Image 
                          source={{ uri: 'https://via.placeholder.com/36' }} 
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex-1">
                        <View className="bg-[#0066FF] rounded-[16px] px-3.5 py-2.5 inline-block self-start" style={{ borderTopLeftRadius: 4 }}>
                          <Text className="text-white text-[12px] font-semibold mb-0.5" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                            {comment.userName}
                          </Text>
                          <Text className="text-white text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                            {comment.text}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Bottom Spacing */}
        <View className="h-6"></View>
      </ScrollView>
       {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <CustomerBottomNavBar />
      </View>
    </SafeAreaView>
  )
}

export default FeedsScreen