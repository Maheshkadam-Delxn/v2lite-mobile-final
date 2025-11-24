// // screens/Dashboard.jsx
// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
//   Image,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import BottomNavBar from '../../components/BottomNavbar';

// const { width } = Dimensions.get('window');

// const Dashboard = () => {
//   const navigation = useNavigation();

//   const quickActions = [
//     { title: 'Send Money', icon: 'send', color: '#0066FF' },
//     { title: 'Request', icon: 'download', color: '#10B981' },
//     { title: 'Top-up', icon: 'add-circle', color: '#F59E0B' },
//     { title: 'Bills', icon: 'receipt', color: '#EF4444' },
//   ];

//   const recentTransactions = [
//     { id: 1, name: 'Spotify', amount: '-₹499', date: 'Today', icon: 'musical-notes' },
//     { id: 2, name: 'Uber', amount: '-₹285', date: 'Yesterday', icon: 'car' },
//     { id: 3, name: 'Salary', amount: '+₹45,000', date: 'Nov 1', icon: 'cash' },
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <StatusBar style="dark" backgroundColor="#ffffff" />

//       {/* Header */}
//       <View className="bg-white px-6 pt-4 pb-6 shadow-sm">
//         <View className="flex-row justify-between items-center">
//           <View>
//             <Text className="text-2xl font-bold text-gray-900">Hello, Alex</Text>
//             <Text className="text-sm text-gray-500 mt-1">Welcome back!</Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('Profile')}
//             className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center"
//           >
//             <Text className="text-2xl">A</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         // Add bottom padding so content isn't hidden behind the fixed nav bar
//         contentContainerStyle={{ paddingBottom: 90 }}
//       >
//         {/* Quick Actions */}
//         <View className="px-6 mt-8">
//           <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
//           <View className="flex-row flex-wrap justify-between">
//             {quickActions.map((item, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 className="w-20 h-24 bg-white rounded-2xl items-center justify-center shadow mb-4"
//                 onPress={() => console.log(item.title)}
//               >
//                 <View
//                   className="w-12 h-12 rounded-full items-center justify-center mb-2"
//                   style={{ backgroundColor: item.color + '20' }}
//                 >
//                   <Ionicons name={item.icon} size={28} color={item.color} />
//                 </View>
//                 <Text className="text-xs text-gray-700 text-center">{item.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Recent Transactions */}
//         <View className="px-6 mt-8">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-lg font-semibold text-gray-800">Recent Transactions</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
//               <Text className="text-blue-600 text-sm font-medium">View all</Text>
//             </TouchableOpacity>
//           </View>

//           {recentTransactions.map((tx) => (
//             <TouchableOpacity
//               key={tx.id}
//               className="flex-row items-center bg-white rounded-2xl p-4 mb-3 shadow-sm"
//             >
//               <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
//                 <Ionicons name={tx.icon} size={24} color="#6B7280" />
//               </View>
//               <View className="flex-1">
//                 <Text className="font-medium text-gray-900">{tx.name}</Text>
//                 <Text className="text-xs text-gray-500">{tx.date}</Text>
//               </View>
//               <Text
//                 className={`font-semibold ${
//                   tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
//                 }`}
//               >
//                 {tx.amount}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Reusable Bottom Navigation */}
//       <BottomNavBar />
//     </SafeAreaView>
//   );
// };

// export default Dashboard;