import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        ...headerStyle,
      }}
    >
      <View className="pb-6 px-4 pt-4">
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
                    fontFamily: 'Urbanist-Bold'
                  },
                  titleStyle
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
    </SafeAreaView>
  );
};

export default Header;