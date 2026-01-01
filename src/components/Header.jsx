// import React from 'react';
// import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
 
// const Header = ({
//   title,
//   showBackButton = false,
//   rightIcon,
//   onRightIconPress,
//   backgroundColor = '#0066FF',
//   titleColor = 'white',
//   iconColor = 'white',
//   headerStyle,
//   titleStyle,
//   backgroundImage, // New prop for custom background image
// }) => {
//   const navigation = useNavigation();
 
//   const handleBackPress = () => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     }
//   };
 
//   // Check if all three elements are absent
//   const isEmptyHeader = !title && !showBackButton && !rightIcon;
 
//   // Default background image
//   const defaultBgImage = require('../../my-expo-app/assets/header.png');
 
//   return (
//     <SafeAreaView
//       edges={['top']}
//       style={{
//         backgroundColor: backgroundColor,
//         borderBottomLeftRadius: 16,
//         borderBottomRightRadius: 16,
//         overflow: 'hidden',
//         ...headerStyle,
//       }}
//     >
//       <ImageBackground
//         source={backgroundImage || defaultBgImage}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <View className={`px-4 pt-4 ${isEmptyHeader ? 'pb-14' : 'pb-6'}`}>
//           <View className="flex-row items-center justify-between">
//             {/* Left Section - Back Button */}
//             <View className="w-10">
//               {showBackButton && (
//                 <TouchableOpacity
//                   onPress={handleBackPress}
//                   className="w-10 h-10 items-center justify-center"
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name="arrow-back" size={24} color={iconColor} />
//                 </TouchableOpacity>
//               )}
//             </View>
 
//             {/* Center Section - Title */}
//             <View className="flex-1 mx-2">
//               {title && (
//                 <Text
//                   className="text-center text-2xl"
//                   style={[
//                     {
//                       color: titleColor,
//                       fontFamily: 'Urbanist-Bold',
//                     },
//                     titleStyle,
//                   ]}
//                   numberOfLines={1}
//                 >
//                   {title}
//                 </Text>
//               )}
//             </View>
 
//             {/* Right Section - Icon */}
//             <View className="w-10">
//               {rightIcon && (
//                 <TouchableOpacity
//                   onPress={onRightIconPress}
//                   className="w-10 h-10 items-center justify-center"
//                   activeOpacity={0.7}
//                 >
//                   <Ionicons name={rightIcon} size={24} color={iconColor} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };
 
// const styles = StyleSheet.create({
//   backgroundImage: {
//     width: '100%',
//   },
// });
 
// export default Header;
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
 
const Header = ({
  title,
  showBackButton = false,
  rightIcon,
  onRightIconPress,
  backgroundColor = '#0066FF',
  titleColor = 'white',
  iconColor = 'white',
  headerStyle,
  titleStyle,
  backgroundImage,
}) => {
  const navigation = useNavigation();
 
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
 
  // Check if all three elements are absent
  const isEmptyHeader = !title && !showBackButton && !rightIcon;
 
  // Default background image
  const defaultBgImage = require('../assets/header.png');
 
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: backgroundColor,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        ...headerStyle,
      }}
    >
      <ImageBackground
        source={backgroundImage || defaultBgImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Conditional rendering based on whether header is empty or not */}
        {isEmptyHeader ? (
          // Empty header with just extra padding for height
          <View className="pb-20" />
        ) : (
          // Header with content (title, back button, or right icon)
          <View className="px-4 pt-4 pb-6">
            <View className="flex-row items-center justify-between">
              {/* Left Section - Back Button */}
              <View className="w-10">
                {showBackButton && (
                  <TouchableOpacity
                    onPress={handleBackPress}
                    className="w-10 h-10 items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="arrow-back" size={24} color={iconColor} />
                  </TouchableOpacity>
                )}
              </View>
 
              {/* Center Section - Title */}
              <View className="flex-1 mx-2">
                {title && (
                  <Text
                    className="text-center text-2xl"
                    style={[
                      {
                        color: titleColor,
                        fontFamily: 'Urbanist-Bold',
                      },
                      titleStyle,
                    ]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                )}
              </View>
 
              {/* Right Section - Icon */}
              <View className="w-10">
                {rightIcon && (
                  <TouchableOpacity
                    onPress={onRightIconPress}
                    className="w-10 h-10 items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name={rightIcon} size={24} color={iconColor} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
  },
});
 
export default Header;
 