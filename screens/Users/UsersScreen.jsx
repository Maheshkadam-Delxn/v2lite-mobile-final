// // screens/Users/RolesMembersScreen.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Animated,
//   Modal,
//   Switch,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Header from '../../components/Header';
// import BottomNavBar from '../../components/BottomNavbar';

// const RolesMembersScreen = () => {
//   const [activeTab, setActiveTab] = useState('roles');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showRoleSheet, setShowRoleSheet] = useState(false);
//   const [showMemberSheet, setShowMemberSheet] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
//   // Updated role form state to match API structure
//   const [newRole, setNewRole] = useState({
//     name: '',
//     slug: '',
//     description: '',
//     permissions: {
//       indent: { create: false, update: false, delete: false },
//       boq: { create: false, update: false, delete: false },
//       vendor: { create: false, update: false, delete: false },
//       user: { create: false, update: false }
//     },
//     isSystem: false
//   });

//   // New member form state
//   const [newMember, setNewMember] = useState({
//     name: '',
//     email: '',
//     password: '',
//     roleId: ''
//   });

//   // Initial empty states
//   const [roles, setRoles] = useState([]);
//   const [members, setMembers] = useState([]);

//   const slideAnim = useRef(new Animated.Value(300)).current;

//   // Updated permission modules to match API structure
//   const permissionModules = [
//     {
//       key: 'indent',
//       label: 'Indent Management',
//       description: 'Manage material indents and requests',
//       actions: ['create', 'update', 'delete']
//     },
//     {
//       key: 'boq',
//       label: 'BOQ Management',
//       description: 'Handle Bill of Quantities and estimates',
//       actions: ['create', 'update', 'delete']
//     },
//     {
//       key: 'vendor',
//       label: 'Vendor Management',
//       description: 'Manage vendors and suppliers',
//       actions: ['create', 'update', 'delete']
//     },
//     {
//       key: 'user',
//       label: 'User Management',
//       description: 'Manage users and team members',
//       actions: ['create', 'update']
//     }
//   ];

//   // Permission actions with labels
//   const permissionActions = {
//     create: { key: 'create', label: 'Create' },
//     update: { key: 'update', label: 'Update' },
//     delete: { key: 'delete', label: 'Delete' }
//   };

//   // API base URL
//   const API_BASE = 'https://skystruct-lite-backend.vercel.app';

//   // Get auth token
//   const getAuthToken = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       return token;
//     } catch (error) {
//       console.error('Error getting token:', error);
//       return null;
//     }
//   };

//   // Create headers with auth
//   const getHeaders = async (additionalHeaders = {}) => {
//     const token = await getAuthToken();
//     return {
//       'Content-Type': 'application/json',
//       ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//       ...additionalHeaders,
//     };
//   };

//   // Fetch roles and members on mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Fetch roles
//         console.log('Fetching roles from:', `${API_BASE}/api/admin/users/role`);
//         const rolesHeaders = await getHeaders();
//         const rolesResponse = await fetch(`${API_BASE}/api/admin/users/role`, {
//           headers: rolesHeaders
//         });
//         console.log('Roles response status:', rolesResponse.status, rolesResponse.statusText);
//         console.log('Roles response headers:', [...rolesResponse.headers.entries()]);
//         if (!rolesResponse.ok) {
//           console.error('Roles fetch failed:', rolesResponse.status, rolesResponse.statusText);
//           throw new Error(`Failed to fetch roles: ${rolesResponse.status} ${rolesResponse.statusText}`);
//         }
//         const rolesRes = await rolesResponse.json();
//         console.log('Roles data:', rolesRes);

//         // Fetch members
//         console.log('Fetching members from:', `${API_BASE}/api/admin/users`);
//         const membersHeaders = await getHeaders();
//         const membersResponse = await fetch(`${API_BASE}/api/admin/users`, {
//           headers: membersHeaders
//         });
//         console.log('Members response status:', membersResponse.status, membersResponse.statusText);
//         console.log('Members response headers:', [...membersResponse.headers.entries()]);
//         if (!membersResponse.ok) {
//           console.error('Members fetch failed:', membersResponse.status, membersResponse.statusText);
//           throw new Error(`Failed to fetch members: ${membersResponse.status} ${membersResponse.statusText}`);
//         }
//         const membersRes = await membersResponse.json();
//         console.log('Members data:', membersRes);

//         setRoles(rolesRes || []);
//         setMembers((membersRes || []).map(member => ({
//           ...member,
//           role: rolesRes.find(r => r.id === member.roleId)?.name || 'Unknown Role',
//           avatar: member.avatar || '👤',
//           status: member.status || 'Active'
//         })));
//       } catch (error) {
//         console.error('Error loading data:', error);
//         if (error.message.includes('401') || error.message.includes('auth')) {
//           Alert.alert('Authentication Error', 'Please log in again.', [
//             { text: 'OK', onPress: () => navigation.navigate('SignIn') }
//           ]);
//         } else {
//           Alert.alert('Error', `Failed to load data: ${error.message}`);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const openRoleSheet = (role = null) => {
//     if (role) {
//       setSelectedRole(role);
//     } else {
//       setSelectedRole(null);
//       setNewRole({
//         name: '',
//         slug: '',
//         description: '',
//         permissions: {
//           indent: { create: false, update: false, delete: false },
//           boq: { create: false, update: false, delete: false },
//           vendor: { create: false, update: false, delete: false },
//           user: { create: false, update: false }
//         },
//         isSystem: false
//       });
//     }
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
//       setNewRole({
//         name: '',
//         slug: '',
//         description: '',
//         permissions: {
//           indent: { create: false, update: false, delete: false },
//           boq: { create: false, update: false, delete: false },
//           vendor: { create: false, update: false, delete: false },
//           user: { create: false, update: false }
//         },
//         isSystem: false
//       });
//     });
//   };

//   const openMemberSheet = (member = null) => {
//     if (member) {
//       setSelectedMember(member);
//     } else {
//       setSelectedMember(null);
//       setNewMember({
//         name: '',
//         email: '',
//         password: '',
//         roleId: ''
//       });
//     }
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
//       setNewMember({
//         name: '',
//         email: '',
//         password: '',
//         roleId: ''
//       });
//       setShowRoleDropdown(false);
//     });
//   };

//   // Handle new member form changes
//   const handleNewMemberChange = (field, value) => {
//     setNewMember(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle role selection
//   const handleRoleSelect = (roleId, roleName) => {
//     setNewMember(prev => ({
//       ...prev,
//       roleId: roleId
//     }));
//     setShowRoleDropdown(false);
//   };

//   // Handle create new member
//   const handleCreateMember = async () => {
//     if (!newMember.name.trim()) {
//       Alert.alert('Error', 'Please enter member name');
//       return;
//     }

//     if (!newMember.email.trim()) {
//       Alert.alert('Error', 'Please enter email address');
//       return;
//     }

//     if (!newMember.password.trim()) {
//       Alert.alert('Error', 'Please enter password');
//       return;
//     }

//     if (!newMember.roleId) {
//       Alert.alert('Error', 'Please select a role');
//       return;
//     }

//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(newMember.email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     // Password strength validation
//     if (newMember.password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters long');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const memberData = {
//         name: newMember.name.trim(),
//         email: newMember.email.trim().toLowerCase(),
//         password: newMember.password,
//         roleId: newMember.roleId
//       };

//       console.log('Creating new member with API body:', JSON.stringify(memberData, null, 2));

//       const headers = await getHeaders();
//       const response = await fetch(`${API_BASE}/api/admin/users`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(memberData)
//       });

//       console.log('Create member response status:', response.status, response.statusText);
//       console.log('Create member response headers:', [...response.headers.entries()]);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Create member failed:', response.status, response.statusText, errorText);
//         throw new Error(`Failed to create member: ${response.status} ${response.statusText}`);
//       }

//       const createdMember = await response.json();
//       console.log('Created member data:', createdMember);
//       const roleName = roles.find(role => role.id === newMember.roleId)?.name || 'Unknown Role';

//       const newMemberWithDetails = {
//         ...createdMember,
//         role: roleName,
//         avatar: '👤',
//         status: 'Active'
//       };

//       setMembers(prev => [newMemberWithDetails, ...prev]);
      
//       Alert.alert('Success', 'Member created successfully');
//       closeMemberSheet();
//     } catch (error) {
//       console.error('Error creating member:', error);
//       Alert.alert('Error', `Failed to create member: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle new role form changes
//   const handleNewRoleChange = (field, value) => {
//     setNewRole(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle permission toggles for new role
//   const handleNewRolePermissionToggle = (module, action) => {
//     setNewRole(prev => ({
//       ...prev,
//       permissions: {
//         ...prev.permissions,
//         [module]: {
//           ...prev.permissions[module],
//           [action]: !prev.permissions[module][action]
//         }
//       }
//     }));
//   };

//   // Handle permission toggles for existing role
//   const handlePermissionToggle = (module, action) => {
//     if (!selectedRole || selectedRole.isSystem) return;
    
//     setRoles(prevRoles => 
//       prevRoles.map(role => 
//         role.id === selectedRole.id 
//           ? {
//               ...role,
//               permissions: {
//                 ...role.permissions,
//                 [module]: {
//                   ...role.permissions[module],
//                   [action]: !role.permissions[module][action]
//                 }
//               }
//             }
//           : role
//       )
//     );
    
//     setSelectedRole(prev => ({
//       ...prev,
//       permissions: {
//         ...prev.permissions,
//         [module]: {
//           ...prev.permissions[module],
//           [action]: !prev.permissions[module][action]
//         }
//       }
//     }));
//   };

//   // Generate slug from name
//   const generateSlug = (name) => {
//     return name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '_')
//       .replace(/(^_|_$)/g, '');
//   };

//   // Handle create new role
//   const handleCreateRole = async () => {
//     if (!newRole.name.trim()) {
//       Alert.alert('Error', 'Please enter a role name');
//       return;
//     }

//     if (!newRole.description.trim()) {
//       Alert.alert('Error', 'Please enter a role description');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const roleData = {
//         name: newRole.name.trim(),
//         slug: newRole.slug.trim() || generateSlug(newRole.name),
//         description: newRole.description.trim(),
//         permissions: newRole.permissions,
//         isSystem: false
//       };

//       console.log('Creating new role with API body:', JSON.stringify(roleData, null, 2));

//       const headers = await getHeaders();
//       const response = await fetch(`${API_BASE}/api/admin/users/role`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(roleData)
//       });

//       console.log('Create role response status:', response.status, response.statusText);
//       console.log('Create role response headers:', [...response.headers.entries()]);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Create role failed:', response.status, response.statusText, errorText);
//         throw new Error(`Failed to create role: ${response.status} ${response.statusText}`);
//       }

//       const createdRole = await response.json();
//       console.log('Created role data:', createdRole);
//       const newRoleWithDetails = {
//         ...createdRole,
//         memberCount: createdRole.memberCount || 0
//       };

//       setRoles(prev => [newRoleWithDetails, ...prev]);
      
//       Alert.alert('Success', 'Role created successfully');
//       closeRoleSheet();
//     } catch (error) {
//       console.error('Error creating role:', error);
//       Alert.alert('Error', `Failed to create role: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle update existing role
//   const handleSaveRole = async () => {
//     if (!selectedRole) return;
    
//     setIsLoading(true);
//     try {
//       const roleData = {
//         name: selectedRole.name,
//         slug: selectedRole.slug,
//         description: selectedRole.description,
//         permissions: selectedRole.permissions,
//         isSystem: selectedRole.isSystem || false
//       };

//       console.log('Updating role with API body:', JSON.stringify(roleData, null, 2));

//       const headers = await getHeaders();
//       const response = await fetch(`${API_BASE}/api/admin/users/role/${selectedRole.id}`, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(roleData)
//       });

//       console.log('Update role response status:', response.status, response.statusText);
//       console.log('Update role response headers:', [...response.headers.entries()]);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Update role failed:', response.status, response.statusText, errorText);
//         throw new Error(`Failed to update role permissions: ${response.status} ${response.statusText}`);
//       }

//       const updatedRole = await response.json();
//       console.log('Updated role data:', updatedRole);

//       // Update local state
//       setRoles(prevRoles => 
//         prevRoles.map(role => 
//           role.id === selectedRole.id ? { ...updatedRole, memberCount: role.memberCount } : role
//         )
//       );
//       setSelectedRole({ ...updatedRole, memberCount: selectedRole.memberCount });
      
//       Alert.alert('Success', 'Role permissions updated successfully');
//       closeRoleSheet();
//     } catch (error) {
//       console.error('Error saving role:', error);
//       Alert.alert('Error', `Failed to update role permissions: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getActivePermissionsCount = (permissions) => {
//     let count = 0;
//     Object.values(permissions).forEach(module => {
//       Object.values(module).forEach(action => {
//         if (action) count++;
//       });
//     });
//     return count;
//   };

//   const getTotalPermissionsCount = () => {
//     let total = 0;
//     permissionModules.forEach(module => {
//       total += module.actions.length;
//     });
//     return total;
//   };

//   const filteredRoles = roles.filter(role =>
//     role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     role.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredMembers = members.filter(member =>
//     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     member.role.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const getSelectedRoleName = () => {
//     if (!newMember.roleId) return 'Select Role';
//     const selectedRoleObj = roles.find(role => role.id === newMember.roleId);
//     return selectedRoleObj?.name || 'Select Role';
//   };

//   const renderRoleItem = ({ item }) => {
//     const activePermissions = getActivePermissionsCount(item.permissions);
//     const totalPermissions = getTotalPermissionsCount();
//     const progressPercentage = (activePermissions / totalPermissions) * 100;
    
//     return (
//       <TouchableOpacity 
//         className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
//         onPress={() => openRoleSheet(item)}
//       >
//         <View className="flex-row justify-between items-start mb-3">
//           <View className="flex-1">
//             <View className="flex-row items-center mb-1 flex-wrap">
//               <Text className="text-lg font-urbanistBold text-gray-900 mr-2">
//                 {item.name}
//               </Text>
//               {item.isSystem && (
//                 <View className="bg-red-100 px-2 py-1 rounded-lg">
//                   <Text className="text-xs font-urbanistMedium text-red-700">
//                     System
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <Text className="text-sm font-urbanistRegular text-gray-600 mb-1">
//               {item.memberCount || 0} members
//             </Text>
//             <Text className="text-sm font-urbanistRegular text-gray-600 leading-5" numberOfLines={2}>
//               {item.description}
//             </Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color="#666" />
//         </View>
        
//         <View className="mb-3">
//           <View className="h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
//             <View 
//               className="h-full bg-blue-600 rounded-full"
//               style={{ width: `${progressPercentage}%` }}
//             />
//           </View>
//           <Text className="text-xs font-urbanistRegular text-gray-600 text-center">
//             {activePermissions}/{totalPermissions} permissions
//           </Text>
//         </View>

//         <View className="flex-row flex-wrap items-center gap-2">
//           {Object.entries(item.permissions)
//             .filter(([module, actions]) => 
//               Object.values(actions).some(action => action)
//             )
//             .slice(0, 3)
//             .map(([module]) => (
//               <View key={module} className="bg-gray-100 px-3 py-1.5 rounded-2xl">
//                 <Text className="text-xs font-urbanistMedium text-gray-600">
//                   {permissionModules.find(m => m.key === module)?.label || module}
//                 </Text>
//               </View>
//             ))}
//           {Object.keys(item.permissions).filter(module => 
//             Object.values(item.permissions[module]).some(action => action)
//           ).length > 3 && (
//             <Text className="text-xs font-urbanistRegular text-gray-500">
//               +{Object.keys(item.permissions).filter(module => 
//                 Object.values(item.permissions[module]).some(action => action)
//               ).length - 3} more
//             </Text>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderMemberItem = ({ item }) => (
//     <TouchableOpacity 
//       className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
//       onPress={() => openMemberSheet(item)}
//     >
//       <View className="flex-row items-center">
//         <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center mr-3">
//           <Text className="text-xl">{item.avatar}</Text>
//         </View>
//         <View className="flex-1">
//           <Text className="text-base font-urbanistBold text-gray-900 mb-0.5">
//             {item.name}
//           </Text>
//           <Text className="text-sm font-urbanistRegular text-gray-600 mb-0.5">
//             {item.email}
//           </Text>
//           <Text className="text-xs font-urbanistMedium text-blue-600">
//             {item.role}
//           </Text>
//         </View>
//         <View className="items-end">
//           <View className={
//             item.status === 'Active' 
//               ? "bg-green-100 px-2 py-1 rounded-xl" 
//               : "bg-red-100 px-2 py-1 rounded-xl"
//           }>
//             <Text className={
//               item.status === 'Active'
//                 ? "text-xs font-urbanistMedium text-green-800"
//                 : "text-xs font-urbanistMedium text-red-800"
//             }>
//               {item.status}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderRoleForm = () => (
//     <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
//       <View className="mb-5">
//         <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
//           Role Information
//         </Text>
        
//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Role Name *
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
//             placeholder="e.g., Procurement Manager"
//             value={newRole.name}
//             onChangeText={(value) => handleNewRoleChange('name', value)}
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Slug
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
//             placeholder="e.g., procurement_manager"
//             value={newRole.slug}
//             onChangeText={(value) => handleNewRoleChange('slug', value)}
//             placeholderTextColor="#999"
//           />
//           <Text className="text-xs font-urbanistRegular text-gray-600 mt-1 italic">
//             Auto-generated from name if left empty. Used for API references.
//           </Text>
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Description *
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900 min-h-[80px] text-align-top"
//             placeholder="Describe what this role can do..."
//             value={newRole.description}
//             onChangeText={(value) => handleNewRoleChange('description', value)}
//             placeholderTextColor="#999"
//             multiline
//             numberOfLines={3}
//             textAlignVertical="top"
//           />
//         </View>
//       </View>

//       <View className="mb-5">
//         <Text className="text-lg font-urbanistBold text-gray-900 mb-1">
//           Module Permissions
//         </Text>
//         <Text className="text-sm font-urbanistRegular text-gray-600 mb-5">
//           Configure what this role can access and modify
//         </Text>
        
//         {permissionModules.map(module => (
//           <View key={module.key} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
//             <View className="mb-3">
//               <View className="flex-1">
//                 <Text className="text-base font-urbanistBold text-gray-900 mb-1">
//                   {module.label}
//                 </Text>
//                 <Text className="text-xs font-urbanistRegular text-gray-600">
//                   {module.description}
//                 </Text>
//               </View>
//             </View>
            
//             <View className="gap-2">
//               {module.actions.map(actionKey => (
//                 <View key={actionKey} className="flex-row items-center justify-between py-2">
//                   <Text className="text-sm font-urbanistMedium text-gray-900">
//                     {permissionActions[actionKey]?.label || actionKey}
//                   </Text>
//                   <Switch
//                     value={newRole.permissions[module.key]?.[actionKey] || false}
//                     onValueChange={() => handleNewRolePermissionToggle(module.key, actionKey)}
//                     trackColor={{ false: '#f0f0f0', true: '#0066FF' }}
//                     thumbColor="#fff"
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </View>

//       <TouchableOpacity 
//         className={
//           `rounded-xl py-4 items-center mt-5 ${
//             isLoading || !newRole.name.trim() || !newRole.description.trim()
//               ? 'bg-gray-400'
//               : 'bg-blue-600'
//           }`
//         }
//         onPress={handleCreateRole}
//         disabled={isLoading || !newRole.name.trim() || !newRole.description.trim()}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-base font-urbanistBold text-white">
//             Create Role
//           </Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );

//   const renderRolePermissions = () => (
//     <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
//       {selectedRole.description && (
//         <View className="bg-gray-50 p-4 rounded-xl mb-5">
//           <Text className="text-sm font-urbanistRegular text-gray-600 leading-5 text-center">
//             {selectedRole.description}
//           </Text>
//         </View>
//       )}
      
//       <View className="mb-5">
//         <Text className="text-lg font-urbanistBold text-gray-900 mb-1">
//           Module Permissions
//         </Text>
//         <Text className="text-sm font-urbanistRegular text-gray-600 mb-5">
//           Configure what this role can access and modify
//         </Text>
        
//         {permissionModules.map(module => (
//           <View key={module.key} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
//             <View className="mb-3">
//               <View className="flex-1">
//                 <Text className="text-base font-urbanistBold text-gray-900 mb-1">
//                   {module.label}
//                 </Text>
//                 <Text className="text-xs font-urbanistRegular text-gray-600">
//                   {module.description}
//                 </Text>
//               </View>
//             </View>
            
//             <View className="gap-2">
//               {module.actions.map(actionKey => (
//                 <View key={actionKey} className="flex-row items-center justify-between py-2">
//                   <Text className="text-sm font-urbanistMedium text-gray-900">
//                     {permissionActions[actionKey]?.label || actionKey}
//                   </Text>
//                   <Switch
//                     value={selectedRole.permissions[module.key]?.[actionKey] || false}
//                     onValueChange={() => handlePermissionToggle(module.key, actionKey)}
//                     trackColor={{ false: '#f0f0f0', true: '#0066FF' }}
//                     thumbColor="#fff"
//                     disabled={selectedRole.isSystem}
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         ))}
//       </View>

//       {!selectedRole.isSystem && (
//         <TouchableOpacity 
//           className="bg-blue-600 rounded-xl py-4 items-center mt-5"
//           onPress={handleSaveRole}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text className="text-base font-urbanistBold text-white">
//               Save Permissions
//             </Text>
//           )}
//         </TouchableOpacity>
//       )}
      
//       {selectedRole.isSystem && (
//         <View className="flex-row items-center justify-center bg-gray-50 p-4 rounded-xl mt-5 gap-2">
//           <Ionicons name="information-circle" size={20} color="#666" />
//           <Text className="text-sm font-urbanistMedium text-gray-600">
//             This is a system role and cannot be modified
//           </Text>
//         </View>
//       )}
//     </ScrollView>
//   );

//   const renderAddMemberForm = () => (
//     <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
//       <View className="mb-5">
//         <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
//           Add New Member
//         </Text>
        
//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Full Name *
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
//             placeholder="e.g., Priya Deshmukh"
//             value={newMember.name}
//             onChangeText={(value) => handleNewMemberChange('name', value)}
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Email Address *
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
//             placeholder="e.g., priya.deshmukh@example.com"
//             value={newMember.email}
//             onChangeText={(value) => handleNewMemberChange('email', value)}
//             placeholderTextColor="#999"
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Password *
//           </Text>
//           <TextInput
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
//             placeholder="Enter password"
//             value={newMember.password}
//             onChangeText={(value) => handleNewMemberChange('password', value)}
//             placeholderTextColor="#999"
//             secureTextEntry
//           />
//           <Text className="text-xs font-urbanistRegular text-gray-600 mt-1">
//             Password must be at least 6 characters long
//           </Text>
//         </View>

//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Role *
//           </Text>
//           <TouchableOpacity
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
//             onPress={() => setShowRoleDropdown(!showRoleDropdown)}
//           >
//             <Text className={`text-base font-urbanistRegular ${
//               newMember.roleId ? 'text-gray-900' : 'text-gray-500'
//             }`}>
//               {getSelectedRoleName()}
//             </Text>
//             <Ionicons 
//               name={showRoleDropdown ? "chevron-up" : "chevron-down"} 
//               size={20} 
//               color="#666" 
//             />
//           </TouchableOpacity>

//           {showRoleDropdown && (
//             <View className="bg-white border border-gray-200 rounded-xl mt-2 max-h-48">
//               <ScrollView nestedScrollEnabled={true}>
//                 {roles.map(role => (
//                   <TouchableOpacity
//                     key={role.id}
//                     className="px-4 py-3 border-b border-gray-100"
//                     onPress={() => handleRoleSelect(role.id, role.name)}
//                   >
//                     <Text className="text-base font-urbanistMedium text-gray-900">
//                       {role.name}
//                     </Text>
//                     <Text className="text-sm font-urbanistRegular text-gray-600 mt-1">
//                       {role.description}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </View>

//       <TouchableOpacity 
//         className={
//           `rounded-xl py-4 items-center mt-5 ${
//             isLoading || !newMember.name.trim() || !newMember.email.trim() || 
//             !newMember.password.trim() || !newMember.roleId
//               ? 'bg-gray-400'
//               : 'bg-blue-600'
//           }`
//         }
//         onPress={handleCreateMember}
//         disabled={
//           isLoading || !newMember.name.trim() || !newMember.email.trim() || 
//           !newMember.password.trim() || !newMember.roleId
//         }
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-base font-urbanistBold text-white">
//             Create Member
//           </Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );

//   const handleAddButtonPress = () => {
//     if (activeTab === 'roles') {
//       openRoleSheet(); // Open role creation modal
//     } else {
//       openMemberSheet(); // Open member creation modal
//     }
//   };

//   if (isLoading && roles.length === 0 && members.length === 0) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center">
//         <ActivityIndicator size="large" color="#0066FF" />
//         <Text className="mt-2 text-gray-600">Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <Header
//         title="Team Management"
//         showBackButton={true}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       <View className="flex-1 pt-4">
//         {/* Tabs */}
//         <View className="flex-row mx-5 mb-4 bg-gray-100 rounded-xl p-1">
//           <TouchableOpacity
//             className={`flex-1 py-3 items-center rounded-lg ${
//               activeTab === 'roles' ? 'bg-white' : ''
//             }`}
//             onPress={() => setActiveTab('roles')}
//           >
//             <Text className={`text-base font-urbanistSemiBold ${
//               activeTab === 'roles' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
//             }`}>
//               Roles
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className={`flex-1 py-3 items-center rounded-lg ${
//               activeTab === 'members' ? 'bg-white' : ''
//             }`}
//             onPress={() => setActiveTab('members')}
//           >
//             <Text className={`text-base font-urbanistSemiBold ${
//               activeTab === 'members' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
//             }`}>
//               Members
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search and Add Button */}
//         <View className="flex-row items-center px-5 mb-4 gap-3">
//           <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
//             <Ionicons name="search" size={20} color="#666" />
//             <TextInput
//               className="flex-1 ml-2 text-base font-urbanistRegular text-gray-900"
//               placeholder={`Search ${activeTab}...`}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholderTextColor="#999"
//             />
//           </View>
//           <TouchableOpacity 
//             className="w-12 h-12 bg-blue-600 rounded-xl justify-center items-center"
//             onPress={handleAddButtonPress}
//           >
//             <Ionicons name="add" size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Content */}
//         <View className="flex-1 px-5">
//           {activeTab === 'roles' ? (
//             <FlatList
//               data={filteredRoles}
//               renderItem={renderRoleItem}
//               keyExtractor={item => item.id}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               ListEmptyComponent={
//                 <View className="flex-1 justify-center items-center py-10">
//                   <Text className="text-gray-500 text-center">No roles found</Text>
//                 </View>
//               }
//             />
//           ) : (
//             <FlatList
//               data={filteredMembers}
//               renderItem={renderMemberItem}
//               keyExtractor={item => item.id}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{ paddingBottom: 20 }}
//               ListEmptyComponent={
//                 <View className="flex-1 justify-center items-center py-10">
//                   <Text className="text-gray-500 text-center">No members found</Text>
//                 </View>
//               }
//             />
//           )}
//         </View>
//       </View>

   

//       {/* Role Bottom Sheet */}
//       <Modal
//         visible={showRoleSheet}
//         transparent
//         animationType="none"
//         onRequestClose={closeRoleSheet}
//       >
//         <TouchableOpacity 
//           className="flex-1 bg-black/50 justify-end"
//           activeOpacity={1}
//           onPress={closeRoleSheet}
//         >
//           <Animated.View 
//             className="bg-transparent rounded-t-3xl overflow-hidden max-h-[90%]"
//             style={{ transform: [{ translateY: slideAnim }] }}
//           >
//             <View className="bg-white rounded-t-3xl overflow-hidden max-h-[90%]">
//               <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
//                 <View className="w-10 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 -ml-5" />
//                 <Text className="text-lg font-urbanistBold text-gray-900 flex-1 text-center">
//                   {selectedRole ? `${selectedRole.name} Permissions` : 'Create New Role'}
//                 </Text>
//                 <TouchableOpacity onPress={closeRoleSheet}>
//                   <Ionicons name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {selectedRole ? renderRolePermissions() : renderRoleForm()}
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
//           className="flex-1 bg-black/50 justify-end"
//           activeOpacity={1}
//           onPress={closeMemberSheet}
//         >
//           <Animated.View 
//             className="bg-transparent rounded-t-3xl overflow-hidden max-h-[90%]"
//             style={{ transform: [{ translateY: slideAnim }] }}
//           >
//             <View className="bg-white rounded-t-3xl overflow-hidden max-h-[90%]">
//               <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
//                 <View className="w-10 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 -ml-5" />
//                 <Text className="text-lg font-urbanistBold text-gray-900 flex-1 text-center">
//                   {selectedMember ? selectedMember.name : 'Add New Member'}
//                 </Text>
//                 <TouchableOpacity onPress={closeMemberSheet}>
//                   <Ionicons name="close" size={24} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               {selectedMember ? (
//                 <ScrollView className="px-5">
//                   <View className="items-center py-5">
//                     <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
//                       <Text className="text-3xl">{selectedMember.avatar}</Text>
//                     </View>
//                     <Text className="text-xl font-urbanistBold text-gray-900 mb-1">
//                       {selectedMember.name}
//                     </Text>
//                     <Text className="text-base font-urbanistRegular text-gray-600 mb-5">
//                       {selectedMember.email}
//                     </Text>
                    
//                     <View className="flex-row justify-between items-center w-full py-3 border-b border-gray-100">
//                       <Text className="text-base font-urbanistSemiBold text-gray-900">
//                         Role:
//                       </Text>
//                       <Text className="text-base font-urbanistRegular text-gray-600">
//                         {selectedMember.role}
//                       </Text>
//                     </View>
//                     <View className="flex-row justify-between items-center w-full py-3 border-b border-gray-100">
//                       <Text className="text-base font-urbanistSemiBold text-gray-900">
//                         Status:
//                       </Text>
//                       <Text className={
//                         selectedMember.status === 'Active'
//                           ? "text-base font-urbanistRegular text-green-700"
//                           : "text-base font-urbanistRegular text-red-700"
//                       }>
//                         {selectedMember.status}
//                       </Text>
//                     </View>
//                   </View>
//                 </ScrollView>
//               ) : (
//                 renderAddMemberForm()
//               )}
//             </View>
//           </Animated.View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// export default RolesMembersScreen;
// screens/Users/RolesMembersScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  // Updated role form state to match API structure
  const [newRole, setNewRole] = useState({
    name: '',
    slug: '',
    description: '',
    permissions: {
      indent: { create: false, update: false, delete: false },
      boq: { create: false, update: false, delete: false },
      vendor: { create: false, update: false, delete: false },
      user: { create: false, update: false }
    },
    isSystem: false
  });

  // New member form state
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',
    roleId: ''
  });

  // Initial empty states
  const [roles, setRoles] = useState([]);
  const [members, setMembers] = useState([]);

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Updated permission modules to match API structure
  const permissionModules = [
    {
      key: 'indent',
      label: 'Indent Management',
      description: 'Manage material indents and requests',
      actions: ['create', 'update', 'delete']
    },
    {
      key: 'boq',
      label: 'BOQ Management',
      description: 'Handle Bill of Quantities and estimates',
      actions: ['create', 'update', 'delete']
    },
    {
      key: 'vendor',
      label: 'Vendor Management',
      description: 'Manage vendors and suppliers',
      actions: ['create', 'update', 'delete']
    },
    {
      key: 'user',
      label: 'User Management',
      description: 'Manage users and team members',
      actions: ['create', 'update']
    }
  ];

  // Permission actions with labels
  const permissionActions = {
    create: { key: 'create', label: 'Create' },
    update: { key: 'update', label: 'Update' },
    delete: { key: 'delete', label: 'Delete' }
  };

  // API base URL
  const API_BASE = 'https://skystruct-lite-backend.vercel.app';

  // Get auth token
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Create headers with auth
  const getHeaders = async (additionalHeaders = {}) => {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...additionalHeaders,
    };
  };

  // Fetch roles and members on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch roles
        console.log('Fetching roles from:', `${API_BASE}/api/admin/users/role`);
        const rolesHeaders = await getHeaders();
        const rolesResponse = await fetch(`${API_BASE}/api/admin/users/role`, {
          headers: rolesHeaders
        });
        console.log('Roles response status:', rolesResponse.status, rolesResponse.statusText);
        console.log('Roles response headers:', [...rolesResponse.headers.entries()]);
        if (!rolesResponse.ok) {
          console.error('Roles fetch failed:', rolesResponse.status, rolesResponse.statusText);
          throw new Error(`Failed to fetch roles: ${rolesResponse.status} ${rolesResponse.statusText}`);
        }
        const rolesRes = await rolesResponse.json();
        console.log('Roles data:', rolesRes);

        // Map roles to include id
        const mappedRoles = (rolesRes || []).map(role => ({
          ...role,
          id: role._id
        }));
        setRoles(mappedRoles);

        // Fetch members
        console.log('Fetching members from:', `${API_BASE}/api/admin/users`);
        const membersHeaders = await getHeaders();
        const membersResponse = await fetch(`${API_BASE}/api/admin/users`, {
          headers: membersHeaders
        });
        console.log('Members response status:', membersResponse.status, membersResponse.statusText);
        console.log('Members response headers:', [...membersResponse.headers.entries()]);
        if (!membersResponse.ok) {
          console.error('Members fetch failed:', membersResponse.status, membersResponse.statusText);
          throw new Error(`Failed to fetch members: ${membersResponse.status} ${membersResponse.statusText}`);
        }
        const membersRes = await membersResponse.json();
        console.log('Members data:', membersRes);

        // Map members with role display logic
        const mappedMembers = (membersRes.data || []).map(member => {
          const memberWithId = {
            ...member,
            id: member._id || member.id
          };

          // Role display logic
          let roleDisplay = 'Unknown Role';
          if (member.roleId) {
            const roleObj = mappedRoles.find(r => r.id === member.roleId);
            if (roleObj) {
              roleDisplay = roleObj.name;
            }
          }
          if (member.roleName) {
            try {
              const parsedRoleName = typeof member.roleName === 'string' ? JSON.parse(member.roleName) : member.roleName;
              if (parsedRoleName && parsedRoleName.name) {
                roleDisplay = parsedRoleName.name;
              } else if (typeof member.roleName === 'string') {
                roleDisplay = member.roleName;
              }
            } catch (e) {
              if (typeof member.roleName === 'string') {
                roleDisplay = member.roleName;
              }
            }
          }
          if (member.role) {
            try {
              const parsedRole = typeof member.role === 'string' ? JSON.parse(member.role) : member.role;
              if (parsedRole && parsedRole.name) {
                roleDisplay = parsedRole.name;
              }
            } catch (e) {
              // Ignore
            }
          }

          return {
            ...memberWithId,
            role: roleDisplay,
            avatar: member.avatar || '👤',
            status: member.status === 'active' ? 'Active' : (member.status || 'Active')
          };
        });

        setMembers(mappedMembers);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', `Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const openRoleSheet = (role = null) => {
    if (role) {
      setSelectedRole(role);
    } else {
      setSelectedRole(null);
      setNewRole({
        name: '',
        slug: '',
        description: '',
        permissions: {
          indent: { create: false, update: false, delete: false },
          boq: { create: false, update: false, delete: false },
          vendor: { create: false, update: false, delete: false },
          user: { create: false, update: false }
        },
        isSystem: false
      });
    }
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
      setNewRole({
        name: '',
        slug: '',
        description: '',
        permissions: {
          indent: { create: false, update: false, delete: false },
          boq: { create: false, update: false, delete: false },
          vendor: { create: false, update: false, delete: false },
          user: { create: false, update: false }
        },
        isSystem: false
      });
    });
  };

  const openMemberSheet = (member = null) => {
    if (member) {
      setSelectedMember(member);
    } else {
      setSelectedMember(null);
      setNewMember({
        name: '',
        email: '',
        password: '',
        roleId: ''
      });
    }
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
      setNewMember({
        name: '',
        email: '',
        password: '',
        roleId: ''
      });
      setShowRoleDropdown(false);
    });
  };

  // Handle new member form changes
  const handleNewMemberChange = (field, value) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle role selection
  const handleRoleSelect = (roleId, roleName) => {
    setNewMember(prev => ({
      ...prev,
      roleId: roleId
    }));
    setShowRoleDropdown(false);
  };

  // Handle create new member
  const handleCreateMember = async () => {
    if (!newMember.name.trim()) {
      Alert.alert('Error', 'Please enter member name');
      return;
    }

    if (!newMember.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return;
    }

    if (!newMember.password.trim()) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    if (!newMember.roleId) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password strength validation
    if (newMember.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const memberData = {
        name: newMember.name.trim(),
        email: newMember.email.trim().toLowerCase(),
        password: newMember.password,
        roleId: newMember.roleId
      };

      console.log('Creating new member with API body:', JSON.stringify(memberData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(memberData)
      });

      console.log('Create member response status:', response.status, response.statusText);
      console.log('Create member response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create member failed:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create member: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      const createdMember = responseData.data || responseData; // Assuming similar structure
      console.log('Created member data:', createdMember);
      const roleName = roles.find(role => role.id === newMember.roleId)?.name || 'Unknown Role';

      const newMemberWithDetails = {
        ...createdMember,
        id: createdMember._id || createdMember.id,
        role: roleName,
        avatar: '👤',
        status: 'Active'
      };

      setMembers(prev => [newMemberWithDetails, ...prev]);

      // Update role memberCount
      const roleIndex = roles.findIndex(r => r.id === newMember.roleId);
      if (roleIndex !== -1) {
        setRoles(prevRoles => prevRoles.map((r, i) => 
          i === roleIndex ? { ...r, memberCount: (r.memberCount || 0) + 1 } : r
        ));
      }
      
      Alert.alert('Success', 'Member created successfully');
      closeMemberSheet();
    } catch (error) {
      console.error('Error creating member:', error);
      Alert.alert('Error', `Failed to create member: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new role form changes
  const handleNewRoleChange = (field, value) => {
    setNewRole(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle permission toggles for new role
  const handleNewRolePermissionToggle = (module, action) => {
    setNewRole(prev => ({
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

  // Handle permission toggles for existing role
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

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
  };

  // Handle create new role
  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      Alert.alert('Error', 'Please enter a role name');
      return;
    }

    if (!newRole.description.trim()) {
      Alert.alert('Error', 'Please enter a role description');
      return;
    }

    setIsLoading(true);
    try {
      const roleData = {
        name: newRole.name.trim(),
        slug: newRole.slug.trim() || generateSlug(newRole.name),
        description: newRole.description.trim(),
        permissions: newRole.permissions,
        isSystem: false
      };

      console.log('Creating new role with API body:', JSON.stringify(roleData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users/role`, {
        method: 'POST',
        headers,
        body: JSON.stringify(roleData)
      });

      console.log('Create role response status:', response.status, response.statusText);
      console.log('Create role response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create role failed:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create role: ${response.status} ${response.statusText}`);
      }

      const createdRole = await response.json();
      console.log('Created role data:', createdRole);
      const newRoleWithDetails = {
        ...createdRole,
        id: createdRole._id,
        memberCount: createdRole.memberCount || 0
      };

      setRoles(prev => [newRoleWithDetails, ...prev]);
      
      Alert.alert('Success', 'Role created successfully');
      closeRoleSheet();
    } catch (error) {
      console.error('Error creating role:', error);
      Alert.alert('Error', `Failed to create role: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update existing role
  const handleSaveRole = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      const roleData = {
        name: selectedRole.name,
        slug: selectedRole.slug,
        description: selectedRole.description,
        permissions: selectedRole.permissions,
        isSystem: selectedRole.isSystem || false
      };

      console.log('Updating role with API body:', JSON.stringify(roleData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users/role/${selectedRole.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(roleData)
      });

      console.log('Update role response status:', response.status, response.statusText);
      console.log('Update role response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update role failed:', response.status, response.statusText, errorText);
        throw new Error(`Failed to update role permissions: ${response.status} ${response.statusText}`);
      }

      const updatedRole = await response.json();
      console.log('Updated role data:', updatedRole);

      // Update local state
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role.id === selectedRole.id ? { ...updatedRole, id: updatedRole._id, memberCount: role.memberCount } : role
        )
      );
      setSelectedRole({ ...updatedRole, id: updatedRole._id, memberCount: selectedRole.memberCount });
      
      Alert.alert('Success', 'Role permissions updated successfully');
      closeRoleSheet();
    } catch (error) {
      console.error('Error saving role:', error);
      Alert.alert('Error', `Failed to update role permissions: ${error.message}`);
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

  const getTotalPermissionsCount = () => {
    let total = 0;
    permissionModules.forEach(module => {
      total += module.actions.length;
    });
    return total;
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

  const getSelectedRoleName = () => {
    if (!newMember.roleId) return 'Select Role';
    const selectedRoleObj = roles.find(role => role.id === newMember.roleId);
    return selectedRoleObj?.name || 'Select Role';
  };

  const renderRoleItem = ({ item }) => {
    const activePermissions = getActivePermissionsCount(item.permissions);
    const totalPermissions = getTotalPermissionsCount();
    const progressPercentage = (activePermissions / totalPermissions) * 100;
    
    return (
      <TouchableOpacity 
        className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
        onPress={() => openRoleSheet(item)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-1 flex-wrap">
              <Text className="text-lg font-urbanistBold text-gray-900 mr-2">
                {item.name}
              </Text>
              {item.isSystem && (
                <View className="bg-red-100 px-2 py-1 rounded-lg">
                  <Text className="text-xs font-urbanistMedium text-red-700">
                    System
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-urbanistRegular text-gray-600 mb-1">
              {item.memberCount || 0} members
            </Text>
            <Text className="text-sm font-urbanistRegular text-gray-600 leading-5" numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
        
        <View className="mb-3">
          <View className="h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
            <View 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <Text className="text-xs font-urbanistRegular text-gray-600 text-center">
            {activePermissions}/{totalPermissions} permissions
          </Text>
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          {Object.entries(item.permissions)
            .filter(([module, actions]) => 
              Object.values(actions).some(action => action)
            )
            .slice(0, 3)
            .map(([module]) => (
              <View key={module} className="bg-gray-100 px-3 py-1.5 rounded-2xl">
                <Text className="text-xs font-urbanistMedium text-gray-600">
                  {permissionModules.find(m => m.key === module)?.label || module}
                </Text>
              </View>
            ))}
          {Object.keys(item.permissions).filter(module => 
            Object.values(item.permissions[module]).some(action => action)
          ).length > 3 && (
            <Text className="text-xs font-urbanistRegular text-gray-500">
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
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
      onPress={() => openMemberSheet(item)}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center mr-3">
          <Text className="text-xl">{item.avatar}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-urbanistBold text-gray-900 mb-0.5">
            {item.name}
          </Text>
          <Text className="text-sm font-urbanistRegular text-gray-600 mb-0.5">
            {item.email}
          </Text>
          <Text className="text-xs font-urbanistMedium text-blue-600">
            {item.role}
          </Text>
        </View>
        <View className="items-end">
          <View className={
            item.status === 'Active' 
              ? "bg-green-100 px-2 py-1 rounded-xl" 
              : "bg-red-100 px-2 py-1 rounded-xl"
          }>
            <Text className={
              item.status === 'Active'
                ? "text-xs font-urbanistMedium text-green-800"
                : "text-xs font-urbanistMedium text-red-800"
            }>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRoleForm = () => (
    <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
      <View className="mb-5">
        <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
          Role Information
        </Text>
        
        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Role Name *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., Procurement Manager"
            value={newRole.name}
            onChangeText={(value) => handleNewRoleChange('name', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Slug
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., procurement_manager"
            value={newRole.slug}
            onChangeText={(value) => handleNewRoleChange('slug', value)}
            placeholderTextColor="#999"
          />
          <Text className="text-xs font-urbanistRegular text-gray-600 mt-1 italic">
            Auto-generated from name if left empty. Used for API references.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Description *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900 min-h-[80px] text-align-top"
            placeholder="Describe what this role can do..."
            value={newRole.description}
            onChangeText={(value) => handleNewRoleChange('description', value)}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View className="mb-5">
        <Text className="text-lg font-urbanistBold text-gray-900 mb-1">
          Module Permissions
        </Text>
        <Text className="text-sm font-urbanistRegular text-gray-600 mb-5">
          Configure what this role can access and modify
        </Text>
        
        {permissionModules.map(module => (
          <View key={module.key} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
            <View className="mb-3">
              <View className="flex-1">
                <Text className="text-base font-urbanistBold text-gray-900 mb-1">
                  {module.label}
                </Text>
                <Text className="text-xs font-urbanistRegular text-gray-600">
                  {module.description}
                </Text>
              </View>
            </View>
            
            <View className="gap-2">
              {module.actions.map(actionKey => (
                <View key={actionKey} className="flex-row items-center justify-between py-2">
                  <Text className="text-sm font-urbanistMedium text-gray-900">
                    {permissionActions[actionKey]?.label || actionKey}
                  </Text>
                  <Switch
                    value={newRole.permissions[module.key]?.[actionKey] || false}
                    onValueChange={() => handleNewRolePermissionToggle(module.key, actionKey)}
                    trackColor={{ false: '#f0f0f0', true: '#0066FF' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        className={
          `rounded-xl py-4 items-center mt-5 ${
            isLoading || !newRole.name.trim() || !newRole.description.trim()
              ? 'bg-gray-400'
              : 'bg-blue-600'
          }`
        }
        onPress={handleCreateRole}
        disabled={isLoading || !newRole.name.trim() || !newRole.description.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-urbanistBold text-white">
            Create Role
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderRolePermissions = () => (
    <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
      {selectedRole.description && (
        <View className="bg-gray-50 p-4 rounded-xl mb-5">
          <Text className="text-sm font-urbanistRegular text-gray-600 leading-5 text-center">
            {selectedRole.description}
          </Text>
        </View>
      )}
      
      <View className="mb-5">
        <Text className="text-lg font-urbanistBold text-gray-900 mb-1">
          Module Permissions
        </Text>
        <Text className="text-sm font-urbanistRegular text-gray-600 mb-5">
          Configure what this role can access and modify
        </Text>
        
        {permissionModules.map(module => (
          <View key={module.key} className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
            <View className="mb-3">
              <View className="flex-1">
                <Text className="text-base font-urbanistBold text-gray-900 mb-1">
                  {module.label}
                </Text>
                <Text className="text-xs font-urbanistRegular text-gray-600">
                  {module.description}
                </Text>
              </View>
            </View>
            
            <View className="gap-2">
              {module.actions.map(actionKey => (
                <View key={actionKey} className="flex-row items-center justify-between py-2">
                  <Text className="text-sm font-urbanistMedium text-gray-900">
                    {permissionActions[actionKey]?.label || actionKey}
                  </Text>
                  <Switch
                    value={selectedRole.permissions[module.key]?.[actionKey] || false}
                    onValueChange={() => handlePermissionToggle(module.key, actionKey)}
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
          className="bg-blue-600 rounded-xl py-4 items-center mt-5"
          onPress={handleSaveRole}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-urbanistBold text-white">
              Save Permissions
            </Text>
          )}
        </TouchableOpacity>
      )}
      
      {selectedRole.isSystem && (
        <View className="flex-row items-center justify-center bg-gray-50 p-4 rounded-xl mt-5 gap-2">
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text className="text-sm font-urbanistMedium text-gray-600">
            This is a system role and cannot be modified
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderAddMemberForm = () => (
    <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
      <View className="mb-5">
        <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
          Add New Member
        </Text>
        
        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Full Name *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., Priya Deshmukh"
            value={newMember.name}
            onChangeText={(value) => handleNewMemberChange('name', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Email Address *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="e.g., priya.deshmukh@example.com"
            value={newMember.email}
            onChangeText={(value) => handleNewMemberChange('email', value)}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Password *
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
            placeholder="Enter password"
            value={newMember.password}
            onChangeText={(value) => handleNewMemberChange('password', value)}
            placeholderTextColor="#999"
            secureTextEntry
          />
          <Text className="text-xs font-urbanistRegular text-gray-600 mt-1">
            Password must be at least 6 characters long
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
            Role *
          </Text>
          <TouchableOpacity
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
            onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <Text className={`text-base font-urbanistRegular ${
              newMember.roleId ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {getSelectedRoleName()}
            </Text>
            <Ionicons 
              name={showRoleDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showRoleDropdown && (
            <View className="bg-white border border-gray-200 rounded-xl mt-2 max-h-48">
              <ScrollView nestedScrollEnabled={true}>
                {roles.map(role => (
                  <TouchableOpacity
                    key={role.id}
                    className="px-4 py-3 border-b border-gray-100"
                    onPress={() => handleRoleSelect(role.id, role.name)}
                  >
                    <Text className="text-base font-urbanistMedium text-gray-900">
                      {role.name}
                    </Text>
                    <Text className="text-sm font-urbanistRegular text-gray-600 mt-1">
                      {role.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        className={
          `rounded-xl py-4 items-center mt-5 ${
            isLoading || !newMember.name.trim() || !newMember.email.trim() || 
            !newMember.password.trim() || !newMember.roleId
              ? 'bg-gray-400'
              : 'bg-blue-600'
          }`
        }
        onPress={handleCreateMember}
        disabled={
          isLoading || !newMember.name.trim() || !newMember.email.trim() || 
          !newMember.password.trim() || !newMember.roleId
        }
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-urbanistBold text-white">
            Create Member
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const handleAddButtonPress = () => {
    if (activeTab === 'roles') {
      openRoleSheet(); // Open role creation modal
    } else {
      openMemberSheet(); // Open member creation modal
    }
  };

  if (isLoading && roles.length === 0 && members.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0066FF" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header
        title="Team Management"
        // showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View className="flex-1 pt-4">
        {/* Tabs */}
        <View className="flex-row mx-5 mb-4 bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${
              activeTab === 'roles' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('roles')}
          >
            <Text className={`text-base font-urbanistSemiBold ${
              activeTab === 'roles' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
            }`}>
              Roles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${
              activeTab === 'members' ? 'bg-white' : ''
            }`}
            onPress={() => setActiveTab('members')}
          >
            <Text className={`text-base font-urbanistSemiBold ${
              activeTab === 'members' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
            }`}>
              Members
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Add Button */}
        <View className="flex-row items-center px-5 mb-4 gap-3">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base font-urbanistRegular text-gray-900"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity 
            className="w-12 h-12 bg-blue-600 rounded-xl justify-center items-center"
            onPress={handleAddButtonPress}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-5">
          {activeTab === 'roles' ? (
            <FlatList
              data={filteredRoles}
              renderItem={renderRoleItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-10">
                  <Text className="text-gray-500 text-center">No roles found</Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={filteredMembers}
              renderItem={renderMemberItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-10">
                  <Text className="text-gray-500 text-center">No members found</Text>
                </View>
              }
            />
          )}
        </View>
      </View>

   

      {/* Role Bottom Sheet */}
      <Modal
        visible={showRoleSheet}
        transparent
        animationType="none"
        onRequestClose={closeRoleSheet}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={closeRoleSheet}
        >
          <Animated.View 
            className="bg-transparent rounded-t-3xl overflow-hidden max-h-[90%]"
            style={{ transform: [{ translateY: slideAnim }] }}
          >
            <View className="bg-white rounded-t-3xl overflow-hidden max-h-[90%]">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <View className="w-10 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 -ml-5" />
                <Text className="text-lg font-urbanistBold text-gray-900 flex-1 text-center">
                  {selectedRole ? `${selectedRole.name} Permissions` : 'Create New Role'}
                </Text>
                <TouchableOpacity onPress={closeRoleSheet}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedRole ? renderRolePermissions() : renderRoleForm()}
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
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={closeMemberSheet}
        >
          <Animated.View 
            className="bg-transparent rounded-t-3xl overflow-hidden max-h-[90%]"
            style={{ transform: [{ translateY: slideAnim }] }}
          >
            <View className="bg-white rounded-t-3xl overflow-hidden max-h-[90%]">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <View className="w-10 h-1 bg-gray-300 rounded-full absolute top-2 left-1/2 -ml-5" />
                <Text className="text-lg font-urbanistBold text-gray-900 flex-1 text-center">
                  {selectedMember ? selectedMember.name : 'Add New Member'}
                </Text>
                <TouchableOpacity onPress={closeMemberSheet}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedMember ? (
                <ScrollView className="px-5">
                  <View className="items-center py-5">
                    <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
                      <Text className="text-3xl">{selectedMember.avatar}</Text>
                    </View>
                    <Text className="text-xl font-urbanistBold text-gray-900 mb-1">
                      {selectedMember.name}
                    </Text>
                    <Text className="text-base font-urbanistRegular text-gray-600 mb-5">
                      {selectedMember.email}
                    </Text>
                    
                    <View className="flex-row justify-between items-center w-full py-3 border-b border-gray-100">
                      <Text className="text-base font-urbanistSemiBold text-gray-900">
                        Role:
                      </Text>
                      <Text className="text-base font-urbanistRegular text-gray-600">
                        {selectedMember.role}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center w-full py-3 border-b border-gray-100">
                      <Text className="text-base font-urbanistSemiBold text-gray-900">
                        Status:
                      </Text>
                      <Text className={
                        selectedMember.status === 'Active'
                          ? "text-base font-urbanistRegular text-green-700"
                          : "text-base font-urbanistRegular text-red-700"
                      }>
                        {selectedMember.status}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              ) : (
                renderAddMemberForm()
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default RolesMembersScreen;