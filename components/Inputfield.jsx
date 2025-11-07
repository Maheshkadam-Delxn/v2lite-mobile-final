import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

const CustomInput = ({
  label,
  icon,
  error,
  onIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-6">
      {/* Label */}
      {label && (
        <Text className="text-sm font-[Urbanist-SemiBold] text-black mb-2">
          {label}
        </Text>
      )}

      {/* Input + Icon */}
      <View
        className="flex-row items-center border-b"
        style={{
          borderBottomColor: isFocused
            ? '#2563EB'
            : error
            ? '#EF4444'
            : '#E5E7EB',
          borderBottomWidth: 1,
        }}
      >
        <TextInput
          className="flex-1 text-sm font-[Urbanist-Regular] text-black py-3 pr-10"
          placeholderTextColor="#BDBDBD"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Icon (aligned properly, no overlap) */}
        {icon && (
          <TouchableOpacity onPress={onIconPress} className="p-1">
            {icon}
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && (
        <Text className="text-xs font-[Urbanist-Regular] text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
