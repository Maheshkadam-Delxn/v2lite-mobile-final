// // screens/Users/RolesMembersScreen.jsx
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   FlatList,
//   Animated,
//   Modal,
//   Switch,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import Header from '../../components/Header';
// import BottomNavBar from '../../components/BottomNavbar';

// const RolesMembersScreen = () => {
//   const [activeTab, setActiveTab] = useState('roles');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showRoleSheet, setShowRoleSheet] = useState(false);
//   const [showMemberSheet, setShowMemberSheet] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [selectedMember, setSelectedMember] = useState(null);
  
//   // Sample data
//   const [roles, setRoles] = useState([
//     {
//       id: '1',
//       name: 'Administrator',
//       memberCount: 3,
//       permissions: {
//         viewProjects: true,
//         editProjects: true,
//         deleteProjects: true,
//         manageUsers: true,
//         viewReports: true,
//       }
//     },
//     {
//       id: '2',
//       name: 'Project Manager',
//       memberCount: 5,
//       permissions: {
//         viewProjects: true,
//         editProjects: true,
//         deleteProjects: false,
//         manageUsers: false,
//         viewReports: true,
//       }
//     },
//     {
//       id: '3',
//       name: 'Team Member',
//       memberCount: 12,
//       permissions: {
//         viewProjects: true,
//         editProjects: false,
//         deleteProjects: false,
//         manageUsers: false,
//         viewReports: false,
//       }
//     },
//     {
//       id: '4',
//       name: 'Viewer',
//       memberCount: 8,
//       permissions: {
//         viewProjects: true,
//         editProjects: false,
//         deleteProjects: false,
//         manageUsers: false,
//         viewReports: true,
//       }
//     },
//   ]);

//   const [members, setMembers] = useState([
//     {
//       id: '1',
//       name: 'John Doe',
//       email: 'john@company.com',
//       role: 'Administrator',
//       status: 'Active',
//       avatar: '👨‍💼'
//     },
//     {
//       id: '2',
//       name: 'Jane Smith',
//       email: 'jane@company.com',
//       role: 'Project Manager',
//       status: 'Active',
//       avatar: '👩‍💼'
//     },
//     {
//       id: '3',
//       name: 'Mike Johnson',
//       email: 'mike@company.com',
//       role: 'Team Member',
//       status: 'Active',
//       avatar: '👨‍🔧'
//     },
//     {
//       id: '4',
//       name: 'Sarah Wilson',
//       email: 'sarah@company.com',
//       role: 'Viewer',
//       status: 'Inactive',
//       avatar: '👩‍💻'
//     },
//   ]);

//   const slideAnim = useRef(new Animated.Value(300)).current;

//   const openRoleSheet = (role = null) => {
//     setSelectedRole(role);
//     setShowRoleSheet(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeRoleSheet = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowRoleSheet(false);
//       setSelectedRole(null);
//     });
//   };

//   const openMemberSheet = (member = null) => {
//     setSelectedMember(member);
//     setShowMemberSheet(true);
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const closeMemberSheet = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowMemberSheet(false);
//       setSelectedMember(null);
//     });
//   };

//   const handlePermissionToggle = (permission) => {
//     if (!selectedRole) return;
    
//     setRoles(prevRoles => 
//       prevRoles.map(role => 
//         role.id === selectedRole.id 
//           ? {
//               ...role,
//               permissions: {
//                 ...role.permissions,
//                 [permission]: !role.permissions[permission]
//               }
//             }
//           : role
//       )
//     );
    
//     setSelectedRole(prev => ({
//       ...prev,
//       permissions: {
//         ...prev.permissions,
//         [permission]: !prev.permissions[permission]
//       }
//     }));
//   };

//   const filteredRoles = roles.filter(role =>
//     role.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredMembers = members.filter(member =>
//     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.role.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const renderRoleItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.roleCard}
//       onPress={() => openRoleSheet(item)}
//     >
//       <View style={styles.roleHeader}>
//         <View style={styles.roleInfo}>
//           <Text style={styles.roleName}>{item.name}</Text>
//           <Text style={styles.memberCount}>{item.memberCount} members</Text>
//         </View>
//         <Ionicons name="chevron-forward" size={20} color="#666" />
//       </View>
//       <View style={styles.permissionTags}>
//         {Object.entries(item.permissions)
//           .filter(([_, value]) => value)
//           .slice(0, 3)
//           .map(([key]) => (
//             <View key={key} style={styles.permissionTag}>
//               <Text style={styles.permissionTagText}>
//                 {key.replace(/([A-Z])/g, ' $1').trim()}
//               </Text>
//             </View>
//           ))}
//         {Object.values(item.permissions).filter(Boolean).length > 3 && (
//           <Text style={styles.morePermissions}>+{Object.values(item.permissions).filter(Boolean).length - 3} more</Text>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderMemberItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.memberCard}
//       onPress={() => openMemberSheet(item)}
//     >
//       <View style={styles.memberHeader}>
//         <View style={styles.memberAvatar}>
//           <Text style={styles.avatarText}>{item.avatar}</Text>
//         </View>
//         <View style={styles.memberInfo}>
//           <Text style={styles.memberName}>{item.name}</Text>
//           <Text style={styles.memberEmail}>{item.email}</Text>
//         </View>
//         <View style={styles.memberMeta}>
//           <View style={[
//             styles.statusBadge,
//             { backgroundColor: item.status === 'Active' ? '#E8F5E8' : '#FFE8E8' }
//           ]}>
//             <Text style={[
//               styles.statusText,
//               { color: item.status === 'Active' ? '#2E7D32' : '#D32F2F' }
//             ]}>
//               {item.status}
//             </Text>
//           </View>
//           <Text style={styles.memberRole}>{item.role}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Header
//         title="Team Management"
//         showBackButton={true}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       <View style={styles.contentWrapper}>
//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'roles' && styles.activeTab]}
//             onPress={() => setActiveTab('roles')}
//           >
//             <Text style={[styles.tabText, activeTab === 'roles' && styles.activeTabText]}>
//               Roles
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, activeTab === 'members' && styles.activeTab]}
//             onPress={() => setActiveTab('members')}
//           >
//             <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
//               Members
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search and Add Button */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <Ionicons name="search" size={20} color="#666" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder={`Search ${activeTab}...`}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholderTextColor="#999"
//             />
//           </View>
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => activeTab === 'roles' ? openRoleSheet() : openMemberSheet()}
//           >
//             <Ionicons name="add" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {activeTab === 'roles' ? (
//             <FlatList
//               data={filteredRoles}
//               renderItem={renderRoleItem}
//               keyExtractor={item => item.id}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.listContainer}
//             />
//           ) : (
//             <FlatList
//               data={filteredMembers}
//               renderItem={renderMemberItem}
//               keyExtractor={item => item.id}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.listContainer}
//             />
//           )}
//         </View>
//       </View>

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNavContainer}>
//         <BottomNavBar />
//       </View>

//       {/* Role Bottom Sheet */}
//       <Modal
//         visible={showRoleSheet}
//         transparent
//         animationType="none"
//         onRequestClose={closeRoleSheet}
//       >
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={closeRoleSheet}
//         >
//           <Animated.View 
//             style={[
//               styles.bottomSheet,
//               { transform: [{ translateY: slideAnim }] }
//             ]}
//           >
//             <View style={styles.sheetContentContainer}>
//               <View style={styles.sheetHeader}>
//                 <View style={styles.sheetHandle} />
//                 <Text style={styles.sheetTitle}>
//                   {selectedRole ? selectedRole.name : 'Add New Role'}
//                 </Text>
//                 <TouchableOpacity onPress={closeRoleSheet}>
//                   <Ionicons name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.sheetContent}>
//                 {selectedRole ? (
//                   <>
//                     <View style={styles.permissionSection}>
//                       <Text style={styles.sectionTitle}>Permissions</Text>
//                       {Object.entries(selectedRole.permissions).map(([key, value]) => (
//                         <View key={key} style={styles.permissionRow}>
//                           <View style={styles.permissionInfo}>
//                             <Text style={styles.permissionName}>
//                               {key.replace(/([A-Z])/g, ' $1').trim()}
//                             </Text>
//                             <Text style={styles.permissionDescription}>
//                               Can {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
//                             </Text>
//                           </View>
//                           <Switch
//                             value={value}
//                             onValueChange={() => handlePermissionToggle(key)}
//                             trackColor={{ false: '#f0f0f0', true: '#007AFF' }}
//                             thumbColor="#fff"
//                           />
//                         </View>
//                       ))}
//                     </View>
//                   </>
//                 ) : (
//                   <View style={styles.addRoleForm}>
//                     <Text style={styles.addFormTitle}>Create New Role</Text>
//                     {/* Add form fields for new role creation */}
//                   </View>
//                 )}
//               </ScrollView>
//             </View>
//           </Animated.View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Member Bottom Sheet */}
//       <Modal
//         visible={showMemberSheet}
//         transparent
//         animationType="none"
//         onRequestClose={closeMemberSheet}
//       >
//         <TouchableOpacity 
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={closeMemberSheet}
//         >
//           <Animated.View 
//             style={[
//               styles.bottomSheet,
//               { transform: [{ translateY: slideAnim }] }
//             ]}
//           >
//             <View style={styles.sheetContentContainer}>
//               <View style={styles.sheetHeader}>
//                 <View style={styles.sheetHandle} />
//                 <Text style={styles.sheetTitle}>
//                   {selectedMember ? selectedMember.name : 'Add New Member'}
//                 </Text>
//                 <TouchableOpacity onPress={closeMemberSheet}>
//                   <Ionicons name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView style={styles.sheetContent}>
//                 {selectedMember ? (
//                   <View style={styles.memberDetails}>
//                     <View style={styles.memberAvatarLarge}>
//                       <Text style={styles.avatarTextLarge}>{selectedMember.avatar}</Text>
//                     </View>
//                     <Text style={styles.memberNameLarge}>{selectedMember.name}</Text>
//                     <Text style={styles.memberEmailLarge}>{selectedMember.email}</Text>
                    
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Role:</Text>
//                       <Text style={styles.detailValue}>{selectedMember.role}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Status:</Text>
//                       <Text style={[
//                         styles.detailValue,
//                         { color: selectedMember.status === 'Active' ? '#2E7D32' : '#D32F2F' }
//                       ]}>
//                         {selectedMember.status}
//                       </Text>
//                     </View>
//                   </View>
//                 ) : (
//                   <View style={styles.addMemberForm}>
//                     <Text style={styles.addFormTitle}>Add Team Member</Text>
//                     {/* Add form fields for new member creation */}
//                   </View>
//                 )}
//               </ScrollView>
//             </View>
//           </Animated.View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   contentWrapper: {
//     flex: 1,
//     paddingTop: 16,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginHorizontal: 20,
//     marginBottom: 16,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     padding: 4,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: '#fff',
//   },
//   tabText: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-SemiBold',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#0066FF',
//     fontFamily: 'Urbanist-Bold',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 16,
//     gap: 12,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 8,
//     fontSize: 16,
//     fontFamily: 'Urbanist-Regular',
//     color: '#1a1a1a',
//   },
//   addButton: {
//     width: 50,
//     height: 50,
//     backgroundColor: '#0066FF',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   roleCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   roleHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   roleInfo: {
//     flex: 1,
//   },
//   roleName: {
//     fontSize: 18,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   memberCount: {
//     fontSize: 14,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//   },
//   permissionTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     gap: 8,
//   },
//   permissionTag: {
//     backgroundColor: '#f0f0f0',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   permissionTagText: {
//     fontSize: 12,
//     fontFamily: 'Urbanist-Medium',
//     color: '#666',
//   },
//   morePermissions: {
//     fontSize: 12,
//     fontFamily: 'Urbanist-Regular',
//     color: '#999',
//   },
//   memberCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   memberHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   memberAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     fontSize: 20,
//   },
//   memberInfo: {
//     flex: 1,
//   },
//   memberName: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     marginBottom: 2,
//   },
//   memberEmail: {
//     fontSize: 14,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//   },
//   memberMeta: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginBottom: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Urbanist-Medium',
//   },
//   memberRole: {
//     fontSize: 12,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//   },
//   bottomNavContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   bottomSheet: {
//     backgroundColor: 'transparent',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: 'hidden',
//     maxHeight: '80%',
//   },
//   sheetContentContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: 'hidden',
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   sheetHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ddd',
//     borderRadius: 2,
//     position: 'absolute',
//     top: 8,
//     left: '50%',
//     marginLeft: -20,
//   },
//   sheetTitle: {
//     fontSize: 20,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     flex: 1,
//     textAlign: 'center',
//   },
//   sheetContent: {
//     padding: 20,
//   },
//   permissionSection: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   permissionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   permissionInfo: {
//     flex: 1,
//   },
//   permissionName: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-SemiBold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   permissionDescription: {
//     fontSize: 14,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//   },
//   addRoleForm: {
//     paddingVertical: 20,
//   },
//   addFormTitle: {
//     fontSize: 18,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     marginBottom: 20,
//   },
//   memberDetails: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   memberAvatarLarge: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   avatarTextLarge: {
//     fontSize: 32,
//   },
//   memberNameLarge: {
//     fontSize: 24,
//     fontFamily: 'Urbanist-Bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   memberEmailLarge: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//     marginBottom: 20,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   detailLabel: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-SemiBold',
//     color: '#1a1a1a',
//   },
//   detailValue: {
//     fontSize: 16,
//     fontFamily: 'Urbanist-Regular',
//     color: '#666',
//   },
//   addMemberForm: {
//     paddingVertical: 20,
//   },
// });

// export default RolesMembersScreen;
// screens/Users/RolesMembersScreen.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavbar';

const RolesMembersScreen = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [showMemberSheet, setShowMemberSheet] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data matching your API structure
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: 'Administrator',
      slug: 'administrator',
      description: 'Full system access with all permissions',
      memberCount: 3,
      isSystem: true,
      permissions: {
        indent: { create: true, update: true, delete: true, view: true },
        boq: { create: true, update: true, delete: true, view: true },
        vendor: { create: true, update: true, delete: true, view: true },
        user: { create: true, update: true, delete: true, view: true },
        project: { create: true, update: true, delete: true, view: true },
        payment: { create: true, update: true, delete: true, view: true }
      }
    },
    {
      id: '2',
      name: 'Procurement Manager',
      slug: 'procurement_manager',
      description: 'Oversees vendor management, material procurement, and BOQ validation.',
      memberCount: 5,
      isSystem: false,
      permissions: {
        indent: { create: true, update: true, delete: false, view: true },
        boq: { create: true, update: true, delete: false, view: true },
        vendor: { create: true, update: true, delete: false, view: true },
        user: { create: false, update: false, delete: false, view: true },
        project: { create: false, update: false, delete: false, view: true },
        payment: { create: false, update: false, delete: false, view: true }
      }
    },
    {
      id: '3',
      name: 'Project Manager',
      slug: 'project_manager',
      description: 'Manages projects, tasks, and team assignments',
      memberCount: 8,
      isSystem: false,
      permissions: {
        indent: { create: true, update: true, delete: false, view: true },
        boq: { create: true, update: true, delete: false, view: true },
        vendor: { create: false, update: false, delete: false, view: true },
        user: { create: false, update: false, delete: false, view: true },
        project: { create: true, update: true, delete: false, view: true },
        payment: { create: false, update: false, delete: false, view: true }
      }
    },
    {
      id: '4',
      name: 'Viewer',
      slug: 'viewer',
      description: 'Read-only access to view projects and reports',
      memberCount: 12,
      isSystem: false,
      permissions: {
        indent: { create: false, update: false, delete: false, view: true },
        boq: { create: false, update: false, delete: false, view: true },
        vendor: { create: false, update: false, delete: false, view: true },
        user: { create: false, update: false, delete: false, view: false },
        project: { create: false, update: false, delete: false, view: true },
        payment: { create: false, update: false, delete: false, view: true }
      }
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Administrator',
      status: 'Active',
      avatar: '👨‍💼'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Procurement Manager',
      status: 'Active',
      avatar: '👩‍💼'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Project Manager',
      status: 'Active',
      avatar: '👨‍🔧'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'Viewer',
      status: 'Inactive',
      avatar: '👩‍💻'
    },
  ]);

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Permission modules with labels
  const permissionModules = [
    {
      key: 'indent',
      label: 'Indent Management',
      description: 'Manage material indents and requests'
    },
    {
      key: 'boq',
      label: 'BOQ Management',
      description: 'Handle Bill of Quantities and estimates'
    },
    {
      key: 'vendor',
      label: 'Vendor Management',
      description: 'Manage vendors and suppliers'
    },
    {
      key: 'user',
      label: 'User Management',
      description: 'Manage users and team members'
    },
    {
      key: 'project',
      label: 'Project Management',
      description: 'Manage projects and tasks'
    },
    {
      key: 'payment',
      label: 'Payment Management',
      description: 'Handle payments and transactions'
    }
  ];

  // Permission actions with labels
  const permissionActions = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' }
  ];

  const openRoleSheet = (role = null) => {
    setSelectedRole(role);
    setShowRoleSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeRoleSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowRoleSheet(false);
      setSelectedRole(null);
    });
  };

  const openMemberSheet = (member = null) => {
    setSelectedMember(member);
    setShowMemberSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMemberSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMemberSheet(false);
      setSelectedMember(null);
    });
  };

  const handlePermissionToggle = (module, action) => {
    if (!selectedRole || selectedRole.isSystem) return;
    
    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === selectedRole.id 
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [module]: {
                  ...role.permissions[module],
                  [action]: !role.permissions[module][action]
                }
              }
            }
          : role
      )
    );
    
    setSelectedRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module][action]
        }
      }
    }));
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      // Here you would make your API call
      const roleData = {
        name: selectedRole.name,
        slug: selectedRole.slug,
        description: selectedRole.description,
        permissions: selectedRole.permissions,
        isSystem: selectedRole.isSystem || false
      };

      console.log('Saving role:', roleData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Role permissions updated successfully');
      closeRoleSheet();
    } catch (error) {
      Alert.alert('Error', 'Failed to update role permissions');
      console.error('Error saving role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivePermissionsCount = (permissions) => {
    let count = 0;
    Object.values(permissions).forEach(module => {
      Object.values(module).forEach(action => {
        if (action) count++;
      });
    });
    return count;
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRoleItem = ({ item }) => {
    const activePermissions = getActivePermissionsCount(item.permissions);
    const totalPermissions = Object.keys(item.permissions).length * Object.keys(permissionActions).length;
    
    return (
      <TouchableOpacity 
        style={styles.roleCard}
        onPress={() => openRoleSheet(item)}
      >
        <View style={styles.roleHeader}>
          <View style={styles.roleInfo}>
            <View style={styles.roleTitleContainer}>
              <Text style={styles.roleName}>{item.name}</Text>
              {item.isSystem && (
                <View style={styles.systemBadge}>
                  <Text style={styles.systemBadgeText}>System</Text>
                </View>
              )}
            </View>
            <Text style={styles.memberCount}>{item.memberCount} members</Text>
            <Text style={styles.roleDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
        
        <View style={styles.permissionProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(activePermissions / totalPermissions) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.permissionCount}>
            {activePermissions}/{totalPermissions} permissions
          </Text>
        </View>

        <View style={styles.permissionTags}>
          {Object.entries(item.permissions)
            .filter(([module, actions]) => 
              Object.values(actions).some(action => action)
            )
            .slice(0, 3)
            .map(([module]) => (
              <View key={module} style={styles.permissionTag}>
                <Text style={styles.permissionTagText}>
                  {permissionModules.find(m => m.key === module)?.label || module}
                </Text>
              </View>
            ))}
          {Object.keys(item.permissions).filter(module => 
            Object.values(item.permissions[module]).some(action => action)
          ).length > 3 && (
            <Text style={styles.morePermissions}>
              +{Object.keys(item.permissions).filter(module => 
                Object.values(item.permissions[module]).some(action => action)
              ).length - 3} more
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.memberCard}
      onPress={() => openMemberSheet(item)}
    >
      <View style={styles.memberHeader}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
          <Text style={styles.memberRoleLabel}>{item.role}</Text>
        </View>
        <View style={styles.memberMeta}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'Active' ? '#E8F5E8' : '#FFE8E8' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'Active' ? '#2E7D32' : '#D32F2F' }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Team Management"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View style={styles.contentWrapper}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'roles' && styles.activeTab]}
            onPress={() => setActiveTab('roles')}
          >
            <Text style={[styles.tabText, activeTab === 'roles' && styles.activeTabText]}>
              Roles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              Members
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Add Button */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => activeTab === 'roles' ? openRoleSheet() : openMemberSheet()}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'roles' ? (
            <FlatList
              data={filteredRoles}
              renderItem={renderRoleItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderMemberItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavBar />
      </View>

      {/* Role Bottom Sheet */}
      <Modal
        visible={showRoleSheet}
        transparent
        animationType="none"
        onRequestClose={closeRoleSheet}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeRoleSheet}
        >
          <Animated.View 
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sheetContentContainer}>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>
                  {selectedRole ? `${selectedRole.name} Permissions` : 'Add New Role'}
                </Text>
                <TouchableOpacity onPress={closeRoleSheet}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
                {selectedRole ? (
                  <>
                    {selectedRole.description && (
                      <View style={styles.roleDescriptionSection}>
                        <Text style={styles.roleDescriptionText}>
                          {selectedRole.description}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.permissionSection}>
                      <Text style={styles.sectionTitle}>Module Permissions</Text>
                      <Text style={styles.sectionSubtitle}>
                        Configure what this role can access and modify
                      </Text>
                      
                      {permissionModules.map(module => (
                        <View key={module.key} style={styles.permissionModule}>
                          <View style={styles.moduleHeader}>
                            <View style={styles.moduleInfo}>
                              <Text style={styles.moduleName}>{module.label}</Text>
                              <Text style={styles.moduleDescription}>
                                {module.description}
                              </Text>
                            </View>
                          </View>
                          
                          <View style={styles.permissionActions}>
                            {permissionActions.map(action => (
                              <View key={action.key} style={styles.permissionRow}>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                                <Switch
                                  value={selectedRole.permissions[module.key]?.[action.key] || false}
                                  onValueChange={() => handlePermissionToggle(module.key, action.key)}
                                  trackColor={{ false: '#f0f0f0', true: '#0066FF' }}
                                  thumbColor="#fff"
                                  disabled={selectedRole.isSystem}
                                />
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>

                    {!selectedRole.isSystem && (
                      <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleSaveRole}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.saveButtonText}>Save Permissions</Text>
                        )}
                      </TouchableOpacity>
                    )}
                    
                    {selectedRole.isSystem && (
                      <View style={styles.systemRoleNote}>
                        <Ionicons name="information-circle" size={20} color="#666" />
                        <Text style={styles.systemRoleText}>
                          This is a system role and cannot be modified
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.addRoleForm}>
                    <Text style={styles.addFormTitle}>Create New Role</Text>
                    {/* Add form fields for new role creation */}
                  </View>
                )}
              </ScrollView>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Member Bottom Sheet */}
      <Modal
        visible={showMemberSheet}
        transparent
        animationType="none"
        onRequestClose={closeMemberSheet}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMemberSheet}
        >
          <Animated.View 
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sheetContentContainer}>
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>
                  {selectedMember ? selectedMember.name : 'Add New Member'}
                </Text>
                <TouchableOpacity onPress={closeMemberSheet}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetContent}>
                {selectedMember ? (
                  <View style={styles.memberDetails}>
                    <View style={styles.memberAvatarLarge}>
                      <Text style={styles.avatarTextLarge}>{selectedMember.avatar}</Text>
                    </View>
                    <Text style={styles.memberNameLarge}>{selectedMember.name}</Text>
                    <Text style={styles.memberEmailLarge}>{selectedMember.email}</Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Role:</Text>
                      <Text style={styles.detailValue}>{selectedMember.role}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={[
                        styles.detailValue,
                        { color: selectedMember.status === 'Active' ? '#2E7D32' : '#D32F2F' }
                      ]}>
                        {selectedMember.status}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.addMemberForm}>
                    <Text style={styles.addFormTitle}>Add Team Member</Text>
                    {/* Add form fields for new member creation */}
                  </View>
                )}
              </ScrollView>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#666',
  },
  activeTabText: {
    color: '#0066FF',
    fontFamily: 'Urbanist-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#1a1a1a',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  roleName: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginRight: 8,
  },
  systemBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  systemBadgeText: {
    fontSize: 10,
    fontFamily: 'Urbanist-Medium',
    color: '#D32F2F',
  },
  memberCount: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    lineHeight: 18,
  },
  permissionProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066FF',
    borderRadius: 3,
  },
  permissionCount: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    textAlign: 'center',
  },
  permissionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  permissionTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  permissionTagText: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#666',
  },
  morePermissions: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: '#999',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    marginBottom: 2,
  },
  memberRoleLabel: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#0066FF',
  },
  memberMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  sheetContentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  sheetContent: {
    padding: 20,
  },
  roleDescriptionSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  roleDescriptionText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  permissionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    marginBottom: 20,
  },
  permissionModule: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  moduleHeader: {
    marginBottom: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
  },
  permissionActions: {
    gap: 8,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#fff',
  },
  systemRoleNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  systemRoleText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#666',
  },
  addRoleForm: {
    paddingVertical: 20,
  },
  addFormTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  memberDetails: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  memberAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    fontSize: 32,
  },
  memberNameLarge: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  memberEmailLarge: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#1a1a1a',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#666',
  },
  addMemberForm: {
    paddingVertical: 20,
  },
});

export default RolesMembersScreen;