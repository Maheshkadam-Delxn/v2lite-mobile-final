// import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
// import React from 'react'
// import { Ionicons } from '@expo/vector-icons'
// import Header from 'components/Header'
// import { useNavigation } from '@react-navigation/native';

// const ReportsListScreen = () => {
    
//     const navigation = useNavigation();
    
//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
//       {/* Header */}
//       {/* <Header /> */}

//       {/* Full Screen Container - Remove mt-20 to center properly */}
//       <View className="flex-1 items-center justify-center px-6 mt-20">
        
//         {/* Chart Illustration */}
//         <View className="mb-8">
//           <View className="w-48 h-48 bg-gray-100 rounded-[20px] items-center justify-center relative">

//             <View className="flex-row items-end gap-4 mb-6">
//               <View className="w-10 h-24 bg-gray-300 rounded-t-md"></View>
//               <View className="w-10 h-16 bg-gray-300 rounded-t-md"></View>
//               <View className="w-10 h-20 bg-gray-300 rounded-t-md"></View>
//               <View className="w-10 h-14 bg-gray-300 rounded-t-md"></View>
//             </View>

//             <View className="absolute top-8 left-8 right-8 h-[1px] bg-gray-200"></View>
//             <View className="absolute top-16 left-8 right-8 h-[1px] bg-gray-200"></View>
//             <View className="absolute top-24 left-8 right-8 h-[1px] bg-gray-200"></View>

//             {/* Close Icon */}
//             <View className="absolute -top-3 -right-3 bg-gray-300 rounded-full p-2">
//               <Ionicons name="close" size={20} color="white" />
//             </View>
//           </View>
//         </View>

//         {/* Title */}
//         <Text className="text-[#1E1E1E] text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Urbanist-Bold' }}>
//           Create Your Report
//         </Text>

//         {/* Subtitle */}
//         <Text className="text-[#999] text-[15px] text-center mb-8 leading-6" style={{ fontFamily: 'Urbanist-Regular' }}>
//           Currently there are no reports to display.{'\n'}
//           Click the "Create Report" to get started
//         </Text>

//         {/* Button */}
//         <TouchableOpacity 
//           className="bg-[#0066FF] rounded-[16px] py-4 px-16 "
//           onPress={() => navigation.navigate('ReportDetailScreen')}
//         >
//           <Text className="text-white text-[16px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
//             Create Report
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </SafeAreaView>
//   )
// }

// export default ReportsListScreen; // Make sure this line ends with semicolon
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

const ReportsListScreen = () => {
  const navigation = useNavigation();
    
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
      {/* Header */}
      {/* <Header /> */}

      {/* Full Screen Container */}
      <View className="flex-1 items-center justify-center px-6 mt-20">
        
        {/* Chart Illustration */}
        <View className="mb-8">
          <View className="w-48 h-48 bg-gray-100 rounded-[20px] items-center justify-center relative">
            <View className="flex-row items-end gap-4 mb-6">
              <View className="w-10 h-24 bg-gray-300 rounded-t-md"></View>
              <View className="w-10 h-16 bg-gray-300 rounded-t-md"></View>
              <View className="w-10 h-20 bg-gray-300 rounded-t-md"></View>
              <View className="w-10 h-14 bg-gray-300 rounded-t-md"></View>
            </View>

            <View className="absolute top-8 left-8 right-8 h-[1px] bg-gray-200"></View>
            <View className="absolute top-16 left-8 right-8 h-[1px] bg-gray-200"></View>
            <View className="absolute top-24 left-8 right-8 h-[1px] bg-gray-200"></View>

            {/* Close Icon */}
            <View className="absolute -top-3 -right-3 bg-gray-300 rounded-full p-2">
              <Ionicons name="close" size={20} color="white" />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text className="text-[#1E1E1E] text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Urbanist-Bold' }}>
          Create Your Report
        </Text>

        {/* Subtitle */}
        <Text className="text-[#999] text-[15px] text-center mb-8 leading-6" style={{ fontFamily: 'Urbanist-Regular' }}>
          Currently there are no reports to display.{'\n'}
          Click the "Create Report" to get started
        </Text>

        {/* Button */}
        <TouchableOpacity
          className="bg-[#0066FF] rounded-[16px] py-4 px-16"
          onPress={() => navigation.navigate('ReportDetailScreen')}
        >
          <Text
            className="text-white text-[16px] font-semibold"
            style={{ fontFamily: 'Urbanist-SemiBold' }}
          >
            Create Report
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ReportsListScreen;