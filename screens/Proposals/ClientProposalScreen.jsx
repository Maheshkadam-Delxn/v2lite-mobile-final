import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClientProposalScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");

        // Assuming API endpoint for proposals; adjust as needed
        const response = await fetch(
          "https://skystruct-lite-backend.vercel.app/api/proposals", // Mock endpoint; replace with actual
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        let json = {};
        try {
          json = await response.json();
        } catch (err) {
          console.warn("Response JSON parse failed", err);
        }

        const items = Array.isArray(json) ? json :
                       Array.isArray(json.data) ? json.data : [];

        const mapped = items.map((item) => ({
          id: item._id || item.id,
          title: item.title || "Unnamed Proposal",
          client: item.client || "Unnamed Client",
          designer: item.designer || "Unnamed Designer",
          image: item.image || "https://via.placeholder.com/80",
          status: item.status || "Pending",
          date: item.date || new Date().toLocaleDateString(),
        }));

        if (mounted) setProposals(mapped);
      } catch (error) {
        console.error("Network error fetching proposals:", error);
        if (mounted) {
          // Mock data for demo if API fails
          setProposals([
            {
              id: 1,
              title: "Green Valley Apartment Complex",
              client: "Green Valley Apartment Complex",
              designer: "ABC Developers Pvt Ltd",
              image: "https://via.placeholder.com/80?text=Proposal+1",
              status: "Pending",
              date: "Nov 15, 2025",
            },
            {
              id: 2,
              title: "Green Valley Apartment Complex",
              client: "Green Valley Apartment Complex",
              designer: "ABC Developers Pvt Ltd",
              image: "https://via.placeholder.com/80?text=Proposal+2",
              status: "Approved",
              date: "Nov 20, 2025",
            },
            {
              id: 3,
              title: "Green Valley Apartment Complex",
              client: "Green Valley Apartment Complex",
              designer: "ABC Developers Pvt Ltd",
              image: "https://via.placeholder.com/80?text=Proposal+3",
              status: "Pending",
              date: "Nov 25, 2025",
            },
            {
              id: 4,
              title: "Green Valley Apartment Complex",
              client: "Green Valley Apartment Complex",
              designer: "ABC Developers Pvt Ltd",
              image: "https://via.placeholder.com/80?text=Proposal+4",
              status: "Rejected",
              date: "Nov 28, 2025",
            },
          ]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProposals = proposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.designer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return { bg: "#D4EDDA", text: "#155724" };
      case "rejected": return { bg: "#F8D7DA", text: "#721C24" };
      case "pending": return { bg: "#FFF3CD", text: "#856404" };
      default: return { bg: "#E2E3E5", text: "#383D41" };
    }
  };

  const handleApprove = (proposalId) => {
    Alert.alert(
      "Approve Proposal",
      "Are you sure you want to approve this proposal?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", style: "destructive", onPress: () => {
          // API call to approve
          console.log("Approving proposal:", proposalId);
          // Update local state
          setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: "Approved" } : p));
        }},
      ]
    );
  };

  const handleReject = (proposalId) => {
    Alert.alert(
      "Reject Proposal",
      "Are you sure you want to reject this proposal?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", style: "destructive", onPress: () => {
          // API call to reject
          console.log("Rejecting proposal:", proposalId);
          // Update local state
          setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: "Rejected" } : p));
        }},
      ]
    );
  };

  const handleViewDetails = (proposal) => {
    navigation.navigate("ProposalDetailsScreen", { proposal });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <Header
            title="Approve Proposals"
            showBackButton={true}
            rightIcon="check-circle" // Assuming Header supports rightIcon for approve
            onRightIconPress={() => { /* Handle bulk approve or something */ }}
            backgroundColor="#0066FF"
            titleColor="white"
            iconColor="white"
          />

          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {/* Modern Search Bar */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 52,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
              borderWidth: 1,
              borderColor: '#F0F0F0',
              marginBottom: 20,
            }}>
              <Feather name="search" size={22} color="#0066FF" />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontFamily: "Urbanist-Medium",
                  fontSize: 15,
                  color: "#1A1A1A",
                }}
                placeholder="Enter Proposal Name"
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={20} color="#999999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: 0,
              paddingBottom: 100,
              paddingHorizontal: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Loader */}
            {isLoading && (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <ActivityIndicator size="large" color="#0066FF" />
                <Text style={{
                  fontFamily: "Urbanist-Medium",
                  fontSize: 14,
                  color: "#666666",
                  marginTop: 12,
                }}>
                  Loading proposals...
                </Text>
              </View>
            )}

            {/* Proposals List */}
            {!isLoading && filteredProposals.length > 0 && (
              <View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Text style={{
                    fontFamily: "Urbanist-Bold",
                    fontSize: 20,
                    color: "#1A1A1A",
                  }}>
                    Proposal List
                  </Text>
                  <View style={{
                    backgroundColor: '#E6F0FF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}>
                    <Text style={{
                      fontFamily: "Urbanist-SemiBold",
                      fontSize: 13,
                      color: "#0066FF",
                    }}>
                      {filteredProposals.length} Proposals
                    </Text>
                  </View>
                </View>

                {filteredProposals.map((proposal) => {
                  const statusColors = getStatusColor(proposal.status);

                  return (
                    <TouchableOpacity
                      key={proposal.id}
                      onPress={() => handleViewDetails(proposal)}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: "white",
                        borderRadius: 20,
                        padding: 16,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: statusColors.bg,
                        shadowColor: statusColors.text,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                      }}
                    >
                      <View style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginBottom: 14,
                      }}>
                        {/* Proposal Image/Avatar */}
                        <View style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "#F5F7FA",
                          borderRadius: 12,
                          overflow: "hidden",
                          marginRight: 14,
                          borderWidth: 1,
                          borderColor: '#E8ECF0',
                        }}>
                          <Image
                            source={{ uri: proposal.image }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        </View>

                        {/* Proposal Info */}
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontFamily: "Urbanist-Bold",
                            fontSize: 16,
                            color: "#1A1A1A",
                            lineHeight: 24,
                            marginBottom: 6,
                          }}>
                            {proposal.title}
                          </Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                              backgroundColor: statusColors.bg,
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              marginRight: 12,
                            }}>
                              <Text style={{
                                fontFamily: "Urbanist-SemiBold",
                                fontSize: 11,
                                color: statusColors.text,
                              }}>
                                {proposal.status}
                              </Text>
                            </View>
                            <Text style={{
                              fontFamily: "Urbanist-Regular",
                              fontSize: 13,
                              color: "#666666",
                            }}>
                              {proposal.date}
                            </Text>
                          </View>

                          {/* Client and Designer */}
                          <View style={{ marginBottom: 6 }}>
                            <Text style={{
                              fontFamily: "Urbanist-Regular",
                              fontSize: 13,
                              color: "#666666",
                              marginBottom: 2,
                            }}>
                              Client:
                            </Text>
                            <Text style={{
                              fontFamily: "Urbanist-SemiBold",
                              fontSize: 14,
                              color: "#1A1A1A",
                            }}>
                              {proposal.client}
                            </Text>
                          </View>

                          <View>
                            <Text style={{
                              fontFamily: "Urbanist-Regular",
                              fontSize: 13,
                              color: "#666666",
                              marginBottom: 2,
                            }}>
                              Designer:
                            </Text>
                            <Text style={{
                              fontFamily: "Urbanist-SemiBold",
                              fontSize: 14,
                              color: "#1A1A1A",
                            }}>
                              {proposal.designer}
                            </Text>
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                          {proposal.status === 'Pending' && (
                            <>
                              <TouchableOpacity
                                onPress={() => handleApprove(proposal.id)}
                                style={{
                                  backgroundColor: "#28A745",
                                  borderRadius: 8,
                                  paddingHorizontal: 12,
                                  paddingVertical: 8,
                                  marginBottom: 6,
                                  minWidth: 80,
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{
                                  fontFamily: "Urbanist-SemiBold",
                                  fontSize: 12,
                                  color: "white",
                                }}>
                                  Approve
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleReject(proposal.id)}
                                style={{
                                  backgroundColor: "#DC3545",
                                  borderRadius: 8,
                                  paddingHorizontal: 12,
                                  paddingVertical: 8,
                                  minWidth: 80,
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{
                                  fontFamily: "Urbanist-SemiBold",
                                  fontSize: 12,
                                  color: "white",
                                }}>
                                  Reject
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* No Results */}
            {!isLoading && filteredProposals.length === 0 && proposals.length > 0 && (
              <View style={{
                alignItems: 'center',
                paddingTop: 60,
                paddingHorizontal: 20,
              }}>
                <Feather name="search" size={64} color="#D0D5DD" />
                <Text style={{
                  fontFamily: "Urbanist-SemiBold",
                  fontSize: 18,
                  color: "#1A1A1A",
                  marginTop: 20,
                  marginBottom: 8,
                }}>
                  No proposals found
                </Text>
                <Text style={{
                  fontFamily: "Urbanist-Regular",
                  fontSize: 14,
                  color: "#666666",
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  Try adjusting your search to find what you're looking for
                </Text>
              </View>
            )}

            {/* Empty State */}
            {!isLoading && proposals.length === 0 && (
              <View style={{
                alignItems: 'center',
                paddingTop: 60,
                paddingHorizontal: 20,
              }}>
                <Feather name="file-text" size={64} color="#D0D5DD" />
                <Text style={{
                  fontFamily: "Urbanist-SemiBold",
                  fontSize: 18,
                  color: "#1A1A1A",
                  marginTop: 20,
                  marginBottom: 8,
                }}>
                  No proposals yet
                </Text>
                <Text style={{
                  fontFamily: "Urbanist-Regular",
                  fontSize: 14,
                  color: "#666666",
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  Proposals will appear here once they're submitted for approval
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ClientProposalScreen;