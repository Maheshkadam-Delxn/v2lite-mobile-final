import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');

const Onboarding = () => {
  const navigation = useNavigation();
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingData = [
    {
      id: 1,
      title: 'Manage Your Villa, Interior & Building Projects',
      description: 'Streamline villa interior, and building management with real-time insights.',
      image: require('../../assets/splash/splash3.png'), // Replace with your actual image
    },
    {
      id: 2,
      title: 'Stay in Control of Every Project Task',
      description: 'Monitor progress, assign tasks, and approve updates seamlessly, effortlessly.',
      image: require('../../assets/splash/splash2.png'), // Replace with your actual image
    },
    {
      id: 3,
      title: 'Connect, Collaborate & Simplify Your Project',
      description: 'Work with teams, share designs, and manage projects all in one place',
      image: require('../../assets/splash/splash1.png'), // Replace with your actual image
    }
  ];

  const handlePageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const goToNextPage = () => {
    if (currentPage < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      navigation.navigate('Welcome');
    }
  };

  const skipOnboarding = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={skipOnboarding}
        className="absolute top-4 right-6 z-10 px-4 py-2"
      >
        <Text
          className="text-gray-600 text-base"
          style={{ fontFamily: 'Urbanist-Medium' }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      {/* Pager View */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {onboardingData.map((item) => (
          <View key={item.id} className="flex-1 justify-center items-center px-6 pt-16">
            {/* Phone Image */}
            <View className="mb-8">
              <Image
                source={item.image}
                className="w-72 h-96"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text
              className="text-gray-900 text-2xl text-center mb-3 px-4"
              style={{ fontFamily: 'Urbanist-Bold' }}
            >
              {item.title}
            </Text>

            {/* Description */}
            <Text
              className="text-gray-600 text-base text-center px-8"
              style={{ fontFamily: 'Urbanist-Regular' }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </PagerView>

      {/* Bottom Section */}
      <View className="pb-8 px-6">
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-6">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentPage ? 'bg-[#0066FF] w-8' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={goToNextPage}
          className="bg-[#0066FF] py-4 rounded-xl items-center"
          activeOpacity={0.8}
        >
          <Text
            className="text-white text-lg"
            style={{ fontFamily: 'Urbanist-SemiBold' }}
          >
            {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;