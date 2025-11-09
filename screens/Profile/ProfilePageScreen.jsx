// import { View, Text, Image, TouchableOpacity, ScrollView, Switch } from 'react-native'
// import React, { useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { Feather } from '@expo/vector-icons'
// import { useNavigation } from '@react-navigation/native'
// import Header from '../../components/Header'
 
// const ProfilePageScreen = () => {
//   const navigation = useNavigation()
//   const [isDarkMode, setIsDarkMode] = useState(false)
 
//   const toggleDarkMode = () => setIsDarkMode(previousState => !previousState)
 
//   const MenuItem = ({ icon, title, onPress, showArrow = true, rightText = null, isSwitch = false, switchValue = false, onSwitchToggle = null, isLogout = false }) => (
//     <TouchableOpacity
//       onPress={onPress}
//       className="flex-row items-center justify-between py-4 px-4 bg-white"
//       activeOpacity={0.7}
//     >
//       <View className="flex-row items-center flex-1">
//         <Feather
//           name={icon}
//           size={20}
//           color={isLogout ? "#FF3B30" : "#000000"}
//         />
//         <Text
//           style={{ fontFamily: 'Urbanist-Bold' }} // Changed to Bold
//           className={`ml-3 text-base ${isLogout ? 'text-[#FF3B30]' : 'text-[#000000]'}`}
//         >
//           {title}
//         </Text>
//       </View>
     
//       {isSwitch ? (
//         <Switch
//           trackColor={{ false: '#E5E5EA', true: '#4A7CFF' }}
//           thumbColor="#FFFFFF"
//           ios_backgroundColor="#E5E5EA"
//           onValueChange={onSwitchToggle}
//           value={switchValue}
//         />
//       ) : (
//         <View className="flex-row items-center">
//           {rightText && (
//             <Text
//               style={{ fontFamily: 'Urbanist-Bold' }} // Changed to Bold
//               className="text-sm text-[#8E8E93] mr-2"
//             >
//               {rightText}
//             </Text>
//           )}
//           {showArrow && (
//             <Feather
//               name="chevron-right"
//               size={20}
//               color="#8E8E93"
//             />
//           )}
//         </View>
//       )}
//     </TouchableOpacity>
//   )
 
//   const SectionHeader = ({ title }) => (
//     <View className="px-4 py-2 bg-[#F5F5F5]">
//       <Text
//         style={{ fontFamily: 'Urbanist-Bold' }} // Changed to Bold
//         className="text-xs text-[#8E8E93]"
//       >
//         {title}
//       </Text>
//     </View>
//   )
 
//   return (
//     <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['bottom']}>
//       {/* Header */}
//       <Header title="Account" />
 
//       <ScrollView
//         className="flex-1"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Section */}
//         <View className="bg-white px-4 py-5 mb-2">
//           <View className="flex-row items-center justify-between">
//             <View className="flex-row items-center flex-1">
//               <Image
//                 source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
//                 className="w-16 h-16 rounded-full"
//               />
//               <View className="ml-3 flex-1">
//                 <Text
//                   style={{ fontFamily: 'Urbanist-Bold' }} // Changed to Bold
//                   className="text-lg text-[#000000]"
//                 >
//                   Arun Mishra
//                 </Text>
//                 <Text
//                   style={{ fontFamily: 'Urbanist-Bold' }} // Changed to Bold
//                   className="text-sm text-[#8E8E93] mt-0.5"
//                 >
//                   arun.mishra@gmail.com
//                 </Text>
//               </View>
//             </View>
           
//             <TouchableOpacity
//               className="w-10 h-10 bg-[#0066FF] items-center justify-center"
//               style={{ borderRadius: 8 }}
//               activeOpacity={0.7}
//             >
//               <View className="flex-row gap-1">
//                 <View className="w-1.5 h-1.5 bg-white" style={{ borderRadius: 1 }} />
//                 <View className="w-1.5 h-1.5 bg-white" style={{ borderRadius: 1 }} />
//               </View>
//               <View className="flex-row gap-1 mt-1">
//                 <View className="w-1.5 h-1.5 bg-white" style={{ borderRadius: 1 }} />
//                 <View className="w-1.5 h-1.5 bg-white" style={{ borderRadius: 1 }} />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
 
//         {/* General Section */}
//         <SectionHeader title="General" />
       
//         <View className="bg-white mb-2">
//           <MenuItem
//             icon="user"
//             title="Personal Info"
//             onPress={() => navigation.navigate('PersonalInfo')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="folder"
//             title="Projects List"
//             onPress={() => navigation.navigate('ProjectsList')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="credit-card"
//             title="Payment Methods"
//             onPress={() => navigation.navigate('PaymentMethods')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="bell"
//             title="Notification"
//             onPress={() => navigation.navigate('Notification')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="shield"
//             title="Security"
//             onPress={() => navigation.navigate('Security')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="globe"
//             title="Language"
//             rightText="English (US)"
//             onPress={() => navigation.navigate('Language')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="eye"
//             title="Dark Mode"
//             showArrow={false}
//             isSwitch={true}
//             switchValue={isDarkMode}
//             onSwitchToggle={toggleDarkMode}
//           />
//         </View>
 
//         {/* About Section */}
//         <SectionHeader title="About" />
       
//         <View className="bg-white mb-2">
//           <MenuItem
//             icon="help-circle"
//             title="Help Center"
//             onPress={() => navigation.navigate('HelpCenter')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="lock"
//             title="Privacy Policy"
//             onPress={() => navigation.navigate('PrivacyPolicy')}
//           />
//           <View className="h-[1px] bg-[#E5E5EA] ml-12" />
         
//           <MenuItem
//             icon="info"
//             title="About Skystruct"
//             onPress={() => navigation.navigate('AboutSkystruct')}
//           />
//         </View>
 
//         {/* Logout */}
//         <View className="bg-white mb-6">
//           <MenuItem
//             icon="log-out"
//             title="Logout"
//             showArrow={false}
//             isLogout={true}
//             onPress={() => {
//               // Handle logout
//               console.log('Logout pressed')
//             }}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }
 
// export default ProfilePageScreen
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '../../components/Header'

const ProfilePageScreen = () => {
  const navigation = useNavigation()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState)

  // ✅ Logout Logic
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove stored data
              await AsyncStorage.removeItem('userToken')
              await AsyncStorage.removeItem('userData')
              // Optional: comment out next line if you want to remember email
              // await AsyncStorage.removeItem('rememberedEmail')

              console.log('✅ User logged out successfully.')

              // Navigate to SignIn screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              })
            } catch (error) {
              console.error('Error during logout:', error)
              Alert.alert('Error', 'Something went wrong while logging out.')
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  const MenuItem = ({ icon, title, onPress, showArrow = true, rightText = null, isSwitch = false, switchValue = false, onSwitchToggle = null, isLogout = false }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-4 bg-white"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <Feather
          name={icon}
          size={20}
          color={isLogout ? "#FF3B30" : "#000000"}
        />
        <Text
          style={{ fontFamily: 'Urbanist-Bold' }}
          className={`ml-3 text-base ${isLogout ? 'text-[#FF3B30]' : 'text-[#000000]'}`}
        >
          {title}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          trackColor={{ false: '#E5E5EA', true: '#4A7CFF' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E5EA"
          onValueChange={onSwitchToggle}
          value={switchValue}
        />
      ) : (
        <View className="flex-row items-center">
          {rightText && (
            <Text
              style={{ fontFamily: 'Urbanist-Bold' }}
              className="text-sm text-[#8E8E93] mr-2"
            >
              {rightText}
            </Text>
          )}
          {showArrow && (
            <Feather
              name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )

  const SectionHeader = ({ title }) => (
    <View className="px-4 py-2 bg-[#F5F5F5]">
      <Text
        style={{ fontFamily: 'Urbanist-Bold' }}
        className="text-xs text-[#8E8E93]"
      >
        {title}
      </Text>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]" edges={['bottom']}>
      <Header title="Account" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View className="bg-white px-4 py-5 mb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                className="w-16 h-16 rounded-full"
              />
              <View className="ml-3 flex-1">
                <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-lg text-[#000000]">
                  Arun Mishra
                </Text>
                <Text style={{ fontFamily: 'Urbanist-Bold' }} className="text-sm text-[#8E8E93] mt-0.5">
                  arun.mishra@gmail.com
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* General Section */}
        <SectionHeader title="General" />
        <View className="bg-white mb-2">
          <MenuItem icon="user" title="Personal Info" onPress={() => navigation.navigate('PersonalInfo')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="folder" title="Projects List" onPress={() => navigation.navigate('ProjectsList')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="credit-card" title="Payment Methods" onPress={() => navigation.navigate('PaymentMethods')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="bell" title="Notification" onPress={() => navigation.navigate('Notification')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="shield" title="Security" onPress={() => navigation.navigate('Security')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="globe" title="Language" rightText="English (US)" onPress={() => navigation.navigate('Language')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem
            icon="eye"
            title="Dark Mode"
            showArrow={false}
            isSwitch={true}
            switchValue={isDarkMode}
            onSwitchToggle={toggleDarkMode}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" />
        <View className="bg-white mb-2">
          <MenuItem icon="help-circle" title="Help Center" onPress={() => navigation.navigate('HelpCenter')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="lock" title="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicy')} />
          <View className="h-[1px] bg-[#E5E5EA] ml-12" />

          <MenuItem icon="info" title="About Skystruct" onPress={() => navigation.navigate('AboutSkystruct')} />
        </View>

        {/* ✅ Logout Button */}
        <View className="bg-white mb-6">
          <MenuItem
            icon="log-out"
            title="Logout"
            showArrow={false}
            isLogout={true}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfilePageScreen
