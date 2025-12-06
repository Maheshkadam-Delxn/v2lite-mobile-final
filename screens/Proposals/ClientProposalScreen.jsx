
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import Header from '../../components/Header';
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = `${process.env.BASE_API_URL}`;

// const ClientProposalScreen = ({ navigation,route  }) => {
//   const statusFilter = route?.params?.status || null;
//   console.log("🟦 STATUS FILTER:", statusFilter);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [proposals, setProposals] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     let mounted = true;

//     const fetchProposals = async () => {
//       setIsLoading(true);
//       try {
//         const token = await AsyncStorage.getItem("userToken");

//         const response = await fetch(
//           `${API_URL}/api/projects`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && { Authorization: `Bearer ${token}` }),
//             },
//           }
//         );

//         const json = await response.json();

//         const items = Array.isArray(json.data) ? json.data : [];

//         // 👉 FILTER ONLY PROJECTS THAT ARE PROPOSALS
//         const proposalProjects = items.filter(
//           (item) =>
//             (Array.isArray(item.selectedItems) &&
//               item.selectedItems.length > 0) ||
//             item.status === "Proposal Under Approval"
//         );

//         // 👉 MAP PROJECT → PROPOSAL UI FORMAT
//         const mapped = proposalProjects.map((item) => ({
//           id: item._id,
//           title: item.name,
//           client: item.clientName,
//           designer: item.manager?.name || "Unknown",
//           image: item.projectImages || "https://via.placeholder.com/80",
//           status: item.status || "Pending",
//           date: item.createdAt
//             ? new Date(item.createdAt).toLocaleDateString()
//             : "—",
//           selectedItems: item.selectedItems,
//           raw: item,
//         }));

//         if (mounted) setProposals(mapped);
//       } catch (error) {
//         console.error("Proposal fetch error:", error);
//       } finally {
//         if (mounted) setIsLoading(false);
//       }
//     };

//     fetchProposals();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const filteredProposals = proposals.filter(proposal =>
//     proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     proposal.designer.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "approved": 
//         return { bg: "#D4EDDA", text: "#155724", icon: "check-circle" };
//       case "rejected": 
//         return { bg: "#F8D7DA", text: "#721C24", icon: "x-circle" };
//       case "pending": 
//         return { bg: "#FFF3CD", text: "#856404", icon: "clock" };
//       case "proposal under approval": 
//         return { bg: "#CCE7FF", text: "#0066CC", icon: "file-text" };
//       default: 
//         return { bg: "#E2E3E5", text: "#383D41", icon: "help-circle" };
//     }
//   };

//   const handleApprove = (proposalId) => {
//     Alert.alert(
//       "Approve Proposal",
//       "Are you sure you want to approve this proposal?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Approve", 
//           style: "default", 
//           onPress: () => {
//             // API call to approve
//             console.log("Approving proposal:", proposalId);
//             // Update local state
//             setProposals(prev => prev.map(p => 
//               p.id === proposalId ? { ...p, status: "Approved" } : p
//             ));
//           }
//         },
//       ]
//     );
//   };

//   const handleReject = (proposalId) => {
//     Alert.alert(
//       "Reject Proposal",
//       "Are you sure you want to reject this proposal?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { 
//           text: "Reject", 
//           style: "destructive", 
//           onPress: () => {
//             // API call to reject
//             console.log("Rejecting proposal:", proposalId);
//             // Update local state
//             setProposals(prev => prev.map(p => 
//               p.id === proposalId ? { ...p, status: "Rejected" } : p
//             ));
//           }
//         },
//       ]
//     );
//   };

//   const handleViewDetails = (proposal) => {
//     navigation.navigate("ViewProposal", { proposal });
//   };

//   const StatusBadge = ({ status }) => {
//     const colors = getStatusColor(status);
//     return (
//       <View style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.bg,
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 16,
//         alignSelf: 'flex-start',
//       }}>
//         <Feather name={colors.icon} size={14} color={colors.text} />
//         <Text style={{
//           fontFamily: "Urbanist-SemiBold",
//           fontSize: 12,
//           color: colors.text,
//           marginLeft: 4,
//         }}>
//           {status}
//         </Text>
//       </View>
//     );
//   };

//   const ProposalCard = ({ proposal }) => {
//     const statusColors = getStatusColor(proposal.status);

//     return (
//       <TouchableOpacity
//         onPress={() => handleViewDetails(proposal)}
//         activeOpacity={0.9}
//         style={{
//           backgroundColor: "white",
//           borderRadius: 24,
//           padding: 20,
//           marginBottom: 16,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 8 },
//           shadowOpacity: 0.1,
//           shadowRadius: 20,
//           elevation: 5,
//           borderLeftWidth: 4,
//           borderLeftColor: statusColors.text,
//         }}
//       >
//         {/* Header Section */}
//         <View style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           marginBottom: 16,
//         }}>
//           <View style={{ flex: 1 }}>
//             <Text style={{
//               fontFamily: "Urbanist-Bold",
//               fontSize: 18,
//               color: "#1A1A1A",
//               lineHeight: 24,
//               marginBottom: 8,
//             }}>
//               {proposal.title}
//             </Text>
//             <StatusBadge status={proposal.status} />
//           </View>
          
//           <Text style={{
//             fontFamily: "Urbanist-Regular",
//             fontSize: 12,
//             color: "#666666",
//           }}>
//             {proposal.date}
//           </Text>
//         </View>

//         {/* Client & Designer Info */}
//         <View style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           marginBottom: 16,
//         }}>
//           <View style={{ flex: 1 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//               <Feather name="user" size={16} color="#0066FF" />
//               <Text style={{
//                 fontFamily: "Urbanist-Medium",
//                 fontSize: 14,
//                 color: "#1A1A1A",
//                 marginLeft: 8,
//               }}>
//                 {proposal.client}
//               </Text>
//             </View>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <Feather name="award" size={16} color="#FF6B35" />
//               <Text style={{
//                 fontFamily: "Urbanist-Medium",
//                 fontSize: 14,
//                 color: "#1A1A1A",
//                 marginLeft: 8,
//               }}>
//                 {proposal.designer}
//               </Text>
//             </View>
//           </View>
//         </View>

       
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
//       <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         {/* Header */}
       
//           <Header
//             title="Approve Proposals"
//             showBackButton={true}
//             rightIcon="filter"
//             onRightIconPress={() => { /* Handle filter */ }}
//             backgroundColor="transparent"
//             titleColor="white"
//             iconColor="white"
//           />
    

//         {/* Search Section */}
//         <View style={{ 
//           paddingHorizontal: 20, 
//           paddingTop: 20,
//           backgroundColor: "#FAFBFC",
//         }}>
//           <View style={{
//             flexDirection: "row",
//             alignItems: "center",
//             backgroundColor: "white",
//             borderRadius: 16,
//             paddingHorizontal: 16,
//             height: 56,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 6 },
//             shadowOpacity: 0.1,
//             shadowRadius: 15,
//             elevation: 5,
//             borderWidth: 1,
//             borderColor: '#F0F0F0',
//           }}>
//             <Feather name="search" size={22} color="#0066FF" />
//             <TextInput
//               style={{
//                 flex: 1,
//                 marginLeft: 12,
//                 fontFamily: "Urbanist-Medium",
//                 fontSize: 16,
//                 color: "#1A1A1A",
//               }}
//               placeholder="Search proposals..."
//               placeholderTextColor="#999999"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity onPress={() => setSearchQuery('')}>
//                 <Feather name="x-circle" size={20} color="#999999" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Content */}
//         <ScrollView
//           style={{ flex: 1, backgroundColor: "#FAFBFC" }}
//           contentContainerStyle={{
//             paddingTop: 20,
//             paddingBottom: 100,
//             paddingHorizontal: 20,
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header Stats */}
//           <View style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 24,
//           }}>
//             <View>
//               <Text style={{
//                 fontFamily: "Urbanist-Bold",
//                 fontSize: 24,
//                 color: "#1A1A1A",
//                 marginBottom: 4,
//               }}>
//                 Proposal List
//               </Text>
//               <Text style={{
//                 fontFamily: "Urbanist-Regular",
//                 fontSize: 14,
//                 color: "#666666",
//               }}>
//                 Manage and review design proposals
//               </Text>
//             </View>
//             <LinearGradient
//               colors={['#0066FF', '#0052CC']}
//               style={{
//                 paddingHorizontal: 16,
//                 paddingVertical: 8,
//                 borderRadius: 20,
//               }}
//             >
//               <Text style={{
//                 fontFamily: "Urbanist-SemiBold",
//                 fontSize: 14,
//                 color: "white",
//               }}>
//                 {filteredProposals.length} {filteredProposals.length === 1 ? 'Proposal' : 'Proposals'}
//               </Text>
//             </LinearGradient>
//           </View>

//           {/* Loader */}
//           {isLoading && (
//             <View style={{ 
//               alignItems: 'center', 
//               paddingTop: 60,
//               paddingBottom: 60,
//             }}>
//               <ActivityIndicator size="large" color="#0066FF" />
//               <Text style={{
//                 fontFamily: "Urbanist-Medium",
//                 fontSize: 16,
//                 color: "#666666",
//                 marginTop: 16,
//               }}>
//                 Loading proposals...
//               </Text>
//             </View>
//           )}

//           {/* Proposals List */}
//           {!isLoading && filteredProposals.length > 0 && (
//             <View>
//               {filteredProposals.map((proposal) => (
//                 <ProposalCard key={proposal.id} proposal={proposal} />
//               ))}
//             </View>
//           )}

//           {/* No Search Results */}
//           {!isLoading && filteredProposals.length === 0 && proposals.length > 0 && (
//             <View style={{
//               alignItems: 'center',
//               paddingTop: 80,
//               paddingHorizontal: 20,
//             }}>
//               <View style={{
//                 backgroundColor: '#F8F9FA',
//                 width: 120,
//                 height: 120,
//                 borderRadius: 60,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginBottom: 24,
//               }}>
//                 <Feather name="search" size={48} color="#D0D5DD" />
//               </View>
//               <Text style={{
//                 fontFamily: "Urbanist-Bold",
//                 fontSize: 20,
//                 color: "#1A1A1A",
//                 marginBottom: 8,
//                 textAlign: 'center',
//               }}>
//                 No proposals found
//               </Text>
//               <Text style={{
//                 fontFamily: "Urbanist-Regular",
//                 fontSize: 15,
//                 color: "#666666",
//                 textAlign: 'center',
//                 lineHeight: 22,
//               }}>
//                 Try adjusting your search terms or filters to find what you're looking for
//               </Text>
//             </View>
//           )}

//           {/* Empty State */}
//           {!isLoading && proposals.length === 0 && (
//             <View style={{
//               alignItems: 'center',
//               paddingTop: 80,
//               paddingHorizontal: 20,
//             }}>
//               <LinearGradient
//                 colors={['#F8F9FA', '#E9ECEF']}
//                 style={{
//                   width: 140,
//                   height: 140,
//                   borderRadius: 70,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginBottom: 24,
//                 }}
//               >
//                 <Feather name="file-text" size={56} color="#ADB5BD" />
//               </LinearGradient>
//               <Text style={{
//                 fontFamily: "Urbanist-Bold",
//                 fontSize: 22,
//                 color: "#1A1A1A",
//                 marginBottom: 12,
//                 textAlign: 'center',
//               }}>
//                 No proposals yet
//               </Text>
//               <Text style={{
//                 fontFamily: "Urbanist-Regular",
//                 fontSize: 15,
//                 color: "#666666",
//                 textAlign: 'center',
//                 lineHeight: 22,
//                 marginBottom: 32,
//               }}>
//                 Proposals will appear here once they're submitted for your approval
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "#0066FF",
//                   paddingHorizontal: 24,
//                   paddingVertical: 12,
//                   borderRadius: 12,
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Feather name="refresh-cw" size={18} color="white" />
//                 <Text style={{
//                   fontFamily: "Urbanist-SemiBold",
//                   fontSize: 15,
//                   color: "white",
//                   marginLeft: 8,
//                 }}>
//                   Refresh
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default ClientProposalScreen;


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
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.BASE_API_URL}`;

const ClientProposalScreen = ({ navigation, route }) => {

  // ROUTE STATUS FILTER
  const statusFilter = route?.params?.status || null;
  const titleHeader= route?.params.title;
  console.log("🟦 STATUS FILTER:", statusFilter);

  const [searchQuery, setSearchQuery] = useState('');
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✨ Allowed statuses under Option C
  const PROPOSAL_STATUSES = [
    "Proposal Under Approval",
    "Initialize",
    "Approved",
    "Rejected"
  ];

  useEffect(() => {
    let mounted = true;

    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await fetch(`${API_URL}/api/projects`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const json = await response.json();
        const items = Array.isArray(json.data) ? json.data : [];

        // ✨ OPTION C → Only proposals with allowed statuses
        let validProposals = items.filter((item) =>
          PROPOSAL_STATUSES.includes(item.status)
        );

        // Map formatted proposal structure
        const mapped = validProposals.map((item) => ({
          id: item._id,
          title: item.name,
          client: item.clientName,
          designer: item.manager?.name || "Unknown",
          image: item.projectImages || "https://via.placeholder.com/80",
          status: item.status,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "—",
          raw: item,
        }));

        // 🎯 APPLY ROUTE STATUS FILTER
        let finalList = mapped;
console.log(mapped)
        if (statusFilter) {
          finalList = mapped.filter(
            (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        if (mounted) setProposals(finalList);
      } catch (error) {
        console.error("Proposal fetch error:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProposals();
    return () => (mounted = false);
  }, [statusFilter]);

  // Search Filtering
  const filteredProposals = proposals.filter((proposal) =>
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.designer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get Status UI Colors
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { bg: "#D4EDDA", text: "#155724", icon: "check-circle" };
      case "rejected":
        return { bg: "#F8D7DA", text: "#721C24", icon: "x-circle" };
      case "pending":
        return { bg: "#FFF3CD", text: "#856404", icon: "clock" };
      case "proposal under approval":
        return { bg: "#CCE7FF", text: "#0066CC", icon: "file-text" };
      case "initialize":
        return { bg: "#FFEFD5", text: "#CC8400", icon: "edit" };
      default:
        return { bg: "#E2E3E5", text: "#383D41", icon: "help-circle" };
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = getStatusColor(status);
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
      }}>
        <Feather name={colors.icon} size={14} color={colors.text} />
        <Text style={{
          fontFamily: "Urbanist-SemiBold",
          fontSize: 12,
          color: colors.text,
          marginLeft: 4,
        }}>
          {status}
        </Text>
      </View>
    );
  };

  // Proposal Card
  const ProposalCard = ({ proposal }) => {
    const statusColors = getStatusColor(proposal.status);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ViewProposal", { proposal })}
        activeOpacity={0.9}
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 20,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
          borderLeftWidth: 4,
          borderLeftColor: statusColors.text,
        }}
      >

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: "Urbanist-Bold",
              fontSize: 18,
              color: "#1A1A1A",
              marginBottom: 8,
            }}>
              {proposal.title}
            </Text>
            <StatusBadge status={proposal.status} />
          </View>

          <Text style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 12,
            color: "#666",
          }}>
            {proposal.date}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Feather name="user" size={16} color="#0066FF" />
              <Text style={{
                fontFamily: "Urbanist-Medium",
                fontSize: 14,
                marginLeft: 8,
              }}>
                {proposal.client}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="award" size={16} color="#FF6B35" />
              <Text style={{
                fontFamily: "Urbanist-Medium",
                fontSize: 14,
                marginLeft: 8,
              }}>
                {proposal.designer}
              </Text>
            </View>
          </View>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <Header
          title={titleHeader}
          showBackButton={true}
          rightIcon="filter"
          onRightIconPress={() => {}}
          backgroundColor="transparent"
          titleColor="white"
          iconColor="white"
        />

        {/* Search Section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 16,
            paddingHorizontal: 16,
            height: 56,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 5,
            borderWidth: 1,
            borderColor: "#F0F0F0",
          }}>
            <Feather name="search" size={22} color="#0066FF" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                fontFamily: "Urbanist-Medium",
                fontSize: 16,
              }}
              placeholder="Search proposals..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Stats */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            <View>
              <Text style={{
                fontFamily: "Urbanist-Bold",
                fontSize: 24,
              }}>
                Proposal List
              </Text>
              <Text style={{
                fontFamily: "Urbanist-Regular",
                fontSize: 14,
                color: "#666",
              }}>
                Manage and review design proposals
              </Text>
            </View>

            <LinearGradient
              colors={["#0066FF", "#0052CC"]}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 20,
              }}
            >
              <Text style={{
                fontFamily: "Urbanist-SemiBold",
                fontSize: 14,
                color: "white",
              }}>
                {filteredProposals.length} {filteredProposals.length === 1 ? "Proposal" : "Proposals"}
              </Text>
            </LinearGradient>
          </View>

          {/* Loader */}
          {isLoading && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <ActivityIndicator size="large" color="#0066FF" />
            </View>
          )}

          {/* Proposals List */}
          {!isLoading && filteredProposals.length > 0 && (
            <View>
              {filteredProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </View>
          )}

          {/* Empty Search */}
          {!isLoading && filteredProposals.length === 0 && proposals.length > 0 && (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Feather name="search" size={48} color="#D0D5DD" />
              <Text style={{
                fontFamily: "Urbanist-Bold",
                fontSize: 20,
                marginTop: 12,
              }}>
                No proposals found
              </Text>
            </View>
          )}

          {/* Fully Empty */}
          {!isLoading && proposals.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Feather name="file-text" size={56} color="#ADB5BD" />
              <Text style={{
                fontFamily: "Urbanist-Bold",
                fontSize: 22,
                marginTop: 12,
              }}>
                No proposals yet
              </Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ClientProposalScreen;
