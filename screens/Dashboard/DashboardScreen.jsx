import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const navigation = useNavigation();

  const quickActions = [
    { title: 'Send Money', icon: 'send', color: '#3B82F6' },
    { title: 'Request', icon: 'download', color: '#10B981' },
    { title: 'Top-up', icon: 'add-circle', color: '#F59E0B' },
    { title: 'Bills', icon: 'receipt', color: '#EF4444' },
  ];

  const recentTransactions = [
    { id: 1, name: 'Spotify', amount: '-₹499', date: 'Today', icon: 'musical-notes' },
    { id: 2, name: 'Uber', amount: '-₹285', date: 'Yesterday', icon: 'car' },
    { id: 3, name: 'Salary', amount: '+₹45,000', date: 'Nov 1', icon: 'cash' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="bg-white px-6 pt-4 pb-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Hello, Alex</Text>
            <Text className="text-sm text-gray-500 mt-1">Welcome back!</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center"
          >
            <Text className="text-2xl">A</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg">
          <Text className="text-blue-100 text-sm">Total Balance</Text>
          <Text className="text-white text-3xl font-bold mt-2">₹1,24,560.00</Text>
          <View className="flex-row mt-4">
            <View className="flex-1">
              <Text className="text-blue-100 text-xs">Income</Text>
              <Text className="text-white text-lg font-semibold">₹65,000</Text>
            </View>
            <View className="flex-1">
              <Text className="text-blue-100 text-xs">Expenses</Text>
              <Text className="text-white text-lg font-semibold">₹18,420</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="w-20 h-24 bg-white rounded-2xl items-center justify-center shadow mb-4"
                onPress={() => console.log(item.title)}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <Text className="text-xs text-gray-700 text-center">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text className="text-blue-600 text-sm font-medium">View all</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow-sm"
            >
              <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
                <Ionicons name={tx.icon} size={24} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">{tx.name}</Text>
                <Text className="text-xs text-gray-500">{tx.date}</Text>
              </View>
              <Text
                className={`font-semibold ${
                  tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {tx.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Banner */}
        <View className="mx-6 mt-8 mb-10">
          <View className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">Get 5% Cashback</Text>
                <Text className="text-purple-100 text-sm mt-1">
                  On your first recharge above ₹500
                </Text>
                <TouchableOpacity className="mt-4 bg-white/20 rounded-full px-5 py-2 self-start">
                  <Text className="text-white text-sm font-medium">Claim Now</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: 'https://i.ibb.co.com/5kB0Y3F/gift.png' }}
                className="w-24 h-24"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Placeholder */}
      <View className="bg-white border-t border-gray-200 px-6 py-3">
        <View className="flex-row justify-around">
          {['home', 'wallet', 'cards', 'profile'].map((tab) => (
            <TouchableOpacity key={tab} className="items-center">
              <Feather
                name={tab === 'home' ? 'home' : tab === 'profile' ? 'user' : tab}
                size={24}
                color={tab === 'home' ? '#3B82F6' : '#9CA3AF'}
              />
              <Text
                className={`text-xs mt-1 ${
                  tab === 'home' ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;