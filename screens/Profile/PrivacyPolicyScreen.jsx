import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header'

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation()

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header 
        title="Privacy Policy" 
        showBackButton={true}
      />

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 py-6">
          {/* Introduction */}
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            At Skystruct, we respect and protect the privacy of our users. This Privacy Policy outlines the types of personal information we collect, how we use it, and how we protect your information.
          </Text>

          {/* Information We Collect Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            Information We Collect
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            When you use our app, we may collect the following types of personal information:
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • Device Information: We may collect information about the type of device you use, its operating system, and other technical details to help us improve our app.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • Usage Information: We may collect information about how you use our app, such as which features you use and how often you use them.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            • Personal Information: We may collect personal information, such as your name, email address, or phone number, if you choose to provide it to us.
          </Text>

          {/* How We Use Your Information Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            How We Use Your Information
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            We use your information for the following purposes:
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • To provide and improve our app: We use your information to provide and improve our app, including troubleshooting and fixing bugs.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • To personalize your experience: We may use your information to personalize your experience with our app, such as by recommending features or content that may be of interest to you.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            • To communicate with you: We may use your information to communicate with you about our app, such as by sending you updates or notifications.
          </Text>

          {/* Data Security Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            Data Security
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>

          {/* Your Rights Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            Your Rights
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            You have the right to:
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • Access your personal information that we hold about you.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • Request that we correct any inaccurate information about you.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-2"
          >
            • Request that we delete your personal information.
          </Text>

          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            • Object to the processing of your personal information.
          </Text>

          {/* Changes to Privacy Policy Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            Changes to This Privacy Policy
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-6"
          >
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </Text>

          {/* Contact Us Section */}
          <Text 
            style={{ fontFamily: 'Urbanist-Bold' }}
            className="text-base text-[#000000] mb-3"
          >
            Contact Us
          </Text>
          
          <Text 
            style={{ fontFamily: 'Urbanist-Regular' }}
            className="text-sm text-[#666666] leading-6 mb-8"
          >
            If you have any questions or concerns about this Privacy Policy, please contact us at support@skystruct.com
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default PrivacyPolicyScreen