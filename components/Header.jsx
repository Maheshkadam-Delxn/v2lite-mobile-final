// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// const Header = ({
//   title,
//   showBackButton,
//   rightIcon,
//   onRightIconPress,
//   backgroundColor = '#0066FF',
// }) => {
//   const navigation = useNavigation();
//   const handleBackPress = () => navigation.goBack();

//   return (
//     <>
//       {/* REMOVED StatusBar from here */}
//       <SafeAreaView
//         edges={['top']}
//         style={{
//           backgroundColor,
//           borderBottomLeftRadius: 16,
//           borderBottomRightRadius: 16,
//           overflow: 'hidden',
//         }}
//       >
//         <View className="pb-6 px-4">
//           <View className="flex-row items-center justify-between">
//             <View className="w-10">
//               {showBackButton && (
//                 <TouchableOpacity
//                   onPress={handleBackPress}
//                   className="w-10 h-10 items-center justify-center"
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name="arrow-back" size={24} color="white" />
//                 </TouchableOpacity>
//               )}
//             </View>

//             {title && (
//               <Text
//                 className="text-white text-xl flex-1 text-center"
//                 style={{ fontFamily: 'Urbanist-Bold' }}
//               >
//                 {title}
//               </Text>
//             )}

//             <View className="w-10">
//               {rightIcon && (
//                 <TouchableOpacity
//                   onPress={onRightIconPress}
//                   className="w-10 h-10 items-center justify-center"
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name={rightIcon} size={24} color="white" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </>
//   );
// };

// export default Header;

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const Header = () => {
//   return (
//     <SafeAreaView edges={['top']} style={styles.header}>
//       <View style={styles.headerContent}>
//         <Text style={styles.headerText}>Your App Name</Text>
//         {/* Add your header content here */}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#FFFFFF',
//   },
//   headerContent: {
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
// });

// export { Header };