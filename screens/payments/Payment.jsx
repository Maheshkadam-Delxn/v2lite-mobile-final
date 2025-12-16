import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Header from "../../components/Header";

const PaymentScreen = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // -----------------------------
  // Dummy Project Data
  // -----------------------------
  const dummyProjects = [
    { _id: "p1", projectName: "Villa Construction - Dukhan", totalBudget: 5000000, spent: 90000 },
    { _id: "p2", projectName: "Al-Ansari Apartment - Abu Dhalouf", totalBudget: 3000000, spent: 50000 },
    { _id: "p3", projectName: "Bungalow Interior - Al Ghariyah", totalBudget: 1500000, spent: 20000 },
  ];

  // -----------------------------
  // Dummy Transaction Data
  // -----------------------------
  const dummyTransactions = {
    p1: [
      { _id: "t1", title: "Cement Purchase", amount: 25000, date: "2024-01-02", category: "Materials", status: "Completed" },
      { _id: "t2", title: "Steel Rods", amount: 50000, date: "2024-01-05", category: "Materials", status: "Completed" },
      { _id: "t3", title: "Labor Payment", amount: 15000, date: "2024-01-10", category: "Labor", status: "Pending" },
    ],
    p2: [
      { _id: "t4", title: "Tiles Purchase", amount: 32000, date: "2024-02-01", category: "Materials", status: "Completed" },
      { _id: "t5", title: "Wood Material", amount: 18000, date: "2024-02-03", category: "Materials", status: "Completed" },
    ],
    p3: [
      { _id: "t6", title: "Paint Buckets", amount: 8000, date: "2024-03-01", category: "Materials", status: "Completed" },
      { _id: "t7", title: "Electrical Items", amount: 12000, date: "2024-03-04", category: "Equipment", status: "Pending" },
    ],
  };

  // -----------------------------
  // Load Projects (Dummy)
  // -----------------------------
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setTimeout(() => {
      setProjects(dummyProjects);
      setLoadingProjects(false);
    }, 800);
  };

  // -----------------------------
  // Load Transactions By Project ID (Dummy)
  // -----------------------------
  const fetchTransactions = async (projectId) => {
    setLoadingTransactions(true);
    setTimeout(() => {
      setTransactions(dummyTransactions[projectId] || []);
      setLoadingTransactions(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 800);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setDropdownOpen(false);
    fadeAnim.setValue(0);
    fetchTransactions(project._id);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "Materials": return "cube-outline";
      case "Labor": return "people-outline";
      case "Equipment": return "construct-outline";
      default: return "wallet-outline";
    }
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "bg-green-100" : "bg-amber-100";
  };

  const getStatusTextColor = (status) => {
    return status === "Completed" ? "text-green-700" : "text-amber-700";
  };

  const calculateTotalSpent = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
      <Header
        title="Payment Management"
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* PROJECT SELECTOR CARD */}
      <View className="px-4 pt-4 pb-2">
        <View className="bg-white rounded-2xl shadow-sm p-5">
          <View className="flex-row items-center mb-3">
            <Ionicons name="folder-open-outline" size={24} color="#0066FF" />
            <Text className="text-lg font-bold ml-2 text-gray-800">Project Selection</Text>
          </View>

          <TouchableOpacity
            className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 flex-row justify-between items-center"
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Current Project</Text>
              <Text className="text-base font-semibold text-gray-800">
                {selectedProject ? selectedProject.projectName : "Choose a project"}
              </Text>
            </View>
            <Ionicons 
              name={dropdownOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#0066FF" 
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View className="mt-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <ScrollView className="max-h-64">
                {loadingProjects ? (
                  <ActivityIndicator className="p-6" color="#0066FF" size="large" />
                ) : (
                  projects.map((proj, index) => (
                    <TouchableOpacity
                      key={proj._id}
                      className={`p-4 ${index !== projects.length - 1 ? 'border-b border-gray-200' : ''}`}
                      onPress={() => handleSelectProject(proj)}
                      activeOpacity={0.6}
                    >
                      <Text className="text-base font-semibold text-gray-800 mb-1">
                        {proj.projectName}
                      </Text>
                      <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-xs text-gray-500">
                          Budget: {formatCurrency(proj.totalBudget)}
                        </Text>
                        <Text className="text-xs text-blue-600 font-semibold">
                          Spent: {formatCurrency(proj.spent)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* SUMMARY CARD */}
      {selectedProject && !loadingTransactions && transactions.length > 0 && (
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="px-4 py-2"
        >
          <View className="bg-blue-600 rounded-2xl shadow-sm p-5">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white text-sm mb-1" style={{ opacity: 0.9 }}>
                  Total Spent
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {formatCurrency(calculateTotalSpent())}
                </Text>
              </View>
              <View className="bg-white rounded-full p-4" style={{ opacity: 0.2 }}>
                <Ionicons name="trending-up" size={32} color="white" />
              </View>
            </View>
            <View className="flex-row mt-4 pt-4 border-t border-white" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <View className="flex-1">
                <Text className="text-white text-xs" style={{ opacity: 0.75 }}>
                  Transactions
                </Text>
                <Text className="text-white text-xl font-bold">{transactions.length}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-xs" style={{ opacity: 0.75 }}>
                  Remaining
                </Text>
                <Text className="text-white text-xl font-bold">
                  {formatCurrency(selectedProject.totalBudget - calculateTotalSpent())}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* TRANSACTION LIST */}
      <View className="flex-1 px-4 pt-2">
        {loadingTransactions ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0066FF" />
            <Text className="text-gray-500 mt-4">Loading transactions...</Text>
          </View>
        ) : !selectedProject ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="folder-open-outline" size={80} color="#CBD5E1" />
            <Text className="text-gray-400 mt-4 text-base">Select a project to view transactions</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="receipt-outline" size={80} color="#CBD5E1" />
            <Text className="text-gray-400 mt-4 text-base">No transactions found</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
            <Text className="text-base font-bold text-gray-800 mb-3 mt-2">
              Transaction History
            </Text>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden">
                  <View className="p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-blue-50 rounded-full p-3 mr-3">
                          <Ionicons 
                            name={getCategoryIcon(item.category)} 
                            size={24} 
                            color="#0066FF" 
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-gray-800 text-base mb-1">
                            {item.title}
                          </Text>
                          <Text className="text-gray-500 text-sm">{item.category}</Text>
                        </View>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        <Text className={`text-xs font-semibold ${getStatusTextColor(item.status)}`}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-2">{item.date}</Text>
                      </View>
                      <Text className="font-bold text-blue-600 text-lg">
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default PaymentScreen;