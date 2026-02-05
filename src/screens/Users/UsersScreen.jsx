

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
//   const [showProjectDropdown, setShowProjectDropdown] = useState(false);

//   // Default permissions structure - Added task module
//   const defaultPermissions = {
//     indent: { create: false, read: true, update: false, delete: false },
//     boq: { create: false, read: true, update: false, delete: false },
//     vendor: { create: false, read: false, update: false, delete: false },
//     user: { create: false, read: false, update: false, delete: false },
//     proposal: { create: false, read: false, update: false, delete: false },
//     siteSurvey: { create: false, read: false, update: false, delete: false },
//     project: { create: false, read: true, update: false, delete: false },
//     plan: { create: false, read: true, update: false, delete: false },
//     task: { create: false, read: true, update: false, delete: false, approve: false } // Added task module
//   };

//   // Updated role form state to match API structure
//   const [newRole, setNewRole] = useState({
//     name: '',
//     slug: '',
//     description: '',
//     permissions: { ...defaultPermissions },
//     isSystem: false
//   });

//   // New member form state (added assignedProjects)
//   const [newMember, setNewMember] = useState({
//     name: '',
//     email: '',
//     password: '',
//     roleId: '',
//     assignedProjects: [], // <-- new field (array of project ids)
//   });

//   // Initial empty states
//   const [roles, setRoles] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [projects, setProjects] = useState([]); // fetched projects

//   const slideAnim = useRef(new Animated.Value(300)).current;

//   // Updated permission modules to match API structure - Added task management
//   const permissionModules = [
//     {
//       key: 'indent',
//       label: 'Indent Management',
//       description: 'Manage material indents and requests',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'boq',
//       label: 'BOQ Management',
//       description: 'Handle Bill of Quantities and estimates',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'proposal',
//       label: 'Proposal Management',
//       description: 'Handle Proposal of Projects',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'vendor',
//       label: 'Vendor Management',
//       description: 'Manage vendors and suppliers',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'user',
//       label: 'User Management',
//       description: 'Manage users and team members',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'siteSurvey',
//       label: 'Site Survey Management',
//       description: 'Manage site surveys and inspections',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'task',
//       label: 'Task Management',
//       description: 'Manage tasks and assignments',
//       actions: ['create', 'read', 'update', 'delete', 'approve']
//     },
//     {
//       key: 'project',
//       label: 'project Management',
//       description: 'Manage project and actions',
//       actions: ['create', 'read', 'update', 'delete']
//     },
//     {
//       key: 'plan',
//       label: 'plan Management',
//       description: 'Manage plan and actions',
//       actions: ['create', 'read', 'update', 'delete']
//     }
//   ];

//   // Permission actions with labels
//   const permissionActions = {
//     create: { key: 'create', label: 'Create' },
//     read: { key: 'read', label: 'Read' },
//     update: { key: 'update', label: 'Update' },
//     delete: { key: 'delete', label: 'Delete' }
//   };

//   // API base URL
//   const API_BASE = `${process.env.BASE_API_URL}`;

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

//   // Fetch roles, members and projects on mount
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
//         if (!rolesResponse.ok) {
//           const txt = await rolesResponse.text().catch(() => '');
//           console.error('Roles fetch failed:', rolesResponse.status, rolesResponse.statusText, txt);
//           throw new Error(`Failed to fetch roles: ${rolesResponse.status}`);
//         }
//         const rolesRes = await rolesResponse.json();
//         console.log('Roles data:', rolesRes);

//         // Map roles with full permissions structure
//         const mappedRoles = (rolesRes || []).map(role => {
//           const fullPerms = { ...defaultPermissions };
//           if (role.permissions && typeof role.permissions === 'object') {
//             Object.entries(role.permissions).forEach(([modKey, modValue]) => {
//               if (modValue && typeof modValue === 'object') {
//                 fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
//               }
//             });
//           }
//           return { ...role, id: role._id, permissions: fullPerms };
//         });
//         setRoles(mappedRoles);

//         // Fetch members
//         console.log('Fetching members from:', `${API_BASE}/api/admin/users`);
//         const membersHeaders = await getHeaders();
//         const membersResponse = await fetch(`${API_BASE}/api/admin/users`, {
//           headers: membersHeaders
//         });
//         console.log('Members response status:', membersResponse.status, membersResponse.statusText);
//         if (!membersResponse.ok) {
//           const txt = await membersResponse.text().catch(() => '');
//           console.error('Members fetch failed:', membersResponse.status, membersResponse.statusText, txt);
//           throw new Error(`Failed to fetch members: ${membersResponse.status}`);
//         }
//         const membersRes = await membersResponse.json();
//         console.log('Members data:', membersRes);

//         // Map members with role display logic (preserve your logic)
//         const mappedMembers = (membersRes.data || []).map(member => {
//           const memberWithId = { ...member, id: member._id || member.id };

//           // Role display logic
//           let roleDisplay = 'Unknown Role';
//           if (member.roleId) {
//             const roleObj = mappedRoles.find(r => r.id === member.roleId);
//             if (roleObj) roleDisplay = roleObj.name;
//           }
//           if (member.roleName) {
//             try {
//               const parsedRoleName = typeof member.roleName === 'string' ? JSON.parse(member.roleName) : member.roleName;
//               if (parsedRoleName && parsedRoleName.name) {
//                 roleDisplay = parsedRoleName.name;
//               } else if (typeof member.roleName === 'string') {
//                 roleDisplay = member.roleName;
//               }
//             } catch (e) {
//               if (typeof member.roleName === 'string') roleDisplay = member.roleName;
//             }
//           }
//           if (member.role) {
//             try {
//               const parsedRole = typeof member.role === 'string' ? JSON.parse(member.role) : member.role;
//               if (parsedRole && parsedRole.name) roleDisplay = parsedRole.name;
//             } catch (e) {
//               // Ignore
//             }
//           }

//           return {
//             ...memberWithId,
//             role: roleDisplay,
//             avatar: member.avatar || '👤',
//             status: member.status === 'active' ? 'Active' : (member.status || 'Active'),
//             assignedProjects: member.assignedProjects || []
//           };
//         });

//         setMembers(mappedMembers);

//         // Fetch projects for assignment
//         console.log('Fetching projects from:', `${API_BASE}/api/projects`);
//         const projectsHeaders = await getHeaders();
//         const projectsResponse = await fetch(`${API_BASE}/api/projects`, {
//           headers: projectsHeaders
//         });
//         console.log('Projects response status:', projectsResponse.status, projectsResponse.statusText);
//         if (!projectsResponse.ok) {
//           const txt = await projectsResponse.text().catch(() => '');
//           console.error('Projects fetch failed:', projectsResponse.status, projectsResponse.statusText, txt);
//           // don't throw here — projects are optional for member creation
//         } else {
//           const projectsRes = await projectsResponse.json();
//           // projects API might return array or { data: [...] }
//           const list = Array.isArray(projectsRes) ? projectsRes : (projectsRes.data || projectsRes.projects || []);
//           const mappedProjects = (list || []).map(p => ({
//             id: p._id || p.id,
//             name: p.name || p.projectName || p.projectCode || `Project ${p._id}`
//           }));
//           setProjects(mappedProjects);
//         }
//       } catch (error) {
//         console.error('Error loading data:', error);
//         Alert.alert('Error', `Failed to load data: ${error.message}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const openRoleSheet = (role = null) => {
//     if (role) {
//       // Ensure selectedRole has full permissions
//       const fullPerms = { ...defaultPermissions };
//       if (role.permissions && typeof role.permissions === 'object') {
//         Object.entries(role.permissions).forEach(([modKey, modValue]) => {
//           if (modValue && typeof modValue === 'object') {
//             fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
//           }
//         });
//       }
//       setSelectedRole({ ...role, permissions: fullPerms });
//     } else {
//       setSelectedRole(null);
//       setNewRole({
//         name: '',
//         slug: '',
//         description: '',
//         permissions: { ...defaultPermissions },
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
//         permissions: { ...defaultPermissions },
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
//         roleId: '',
//         assignedProjects: []
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
//         roleId: '',
//         assignedProjects: []
//       });
//       setShowRoleDropdown(false);
//       setShowProjectDropdown(false);
//     });
//   };

//   // Handle new member form changes
//   const handleNewMemberChange = (field, value) => {
//     setNewMember(prev => ({ ...prev, [field]: value }));
//   };

//   // Handle role selection
//   const handleRoleSelect = (roleId) => {
//     setNewMember(prev => ({ ...prev, roleId }));
//     setShowRoleDropdown(false);
//   };

//   // Handle project toggle for assignedProjects (multi-select)
//   const toggleProjectSelection = (projectId) => {
//     setNewMember(prev => {
//       const assigned = prev.assignedProjects || [];
//       if (assigned.includes(projectId)) {
//         return { ...prev, assignedProjects: assigned.filter(id => id !== projectId) };
//       } else {
//         return { ...prev, assignedProjects: [...assigned, projectId] };
//       }
//     });
//   };

//   const getSelectedRoleName = () => {
//     if (!newMember.roleId) return 'Select Role';
//     const selectedRoleObj = roles.find(role => role.id === newMember.roleId);
//     return selectedRoleObj?.name || 'Select Role';
//   };

//   const getSelectedProjectsNames = () => {
//     if (!newMember.assignedProjects || newMember.assignedProjects.length === 0) return 'Assign Projects (optional)';
//     const names = newMember.assignedProjects.map(pid => projects.find(p => p.id === pid)?.name || pid);
//     return names.join(', ');
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
//       // Build request body — include assignedProjects (array of project ids)
//       const memberData = {
//         name: newMember.name.trim(),
//         email: newMember.email.trim().toLowerCase(),
//         password: newMember.password,
//         roleId: newMember.roleId,
//         assignedProjects: newMember.assignedProjects || []
//       };

//       console.log('Creating new member with API body:', JSON.stringify(memberData, null, 2));

//       const headers = await getHeaders();
//       const response = await fetch(`${API_BASE}/api/admin/users`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(memberData)
//       });

//       console.log('Create member response status:', response.status, response.statusText);

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => '');
//         console.error('Create member failed:', response.status, response.statusText, errorText);
//         let msg = `Failed to create member: ${response.status}`;
//         try {
//           const j = errorText ? JSON.parse(errorText) : null;
//           if (j?.message) msg = j.message;
//         } catch (e) { }
//         throw new Error(msg);
//       }

//       const responseData = await response.json();
//       const createdMember = responseData.data || responseData; // adapt to API shape
//       console.log('Created member data:', createdMember);
//       const roleName = roles.find(role => role.id === newMember.roleId)?.name || 'Unknown Role';

//       const newMemberWithDetails = {
//         ...createdMember,
//         id: createdMember._id || createdMember.id,
//         role: roleName,
//         avatar: '👤',
//         status: 'Active',
//         assignedProjects: createdMember.assignedProjects || newMember.assignedProjects || []
//       };

//       setMembers(prev => [newMemberWithDetails, ...prev]);

//       // Update role memberCount
//       const roleIndex = roles.findIndex(r => r.id === newMember.roleId);
//       if (roleIndex !== -1) {
//         setRoles(prevRoles => prevRoles.map((r, i) => i === roleIndex ? { ...r, memberCount: (r.memberCount || 0) + 1 } : r));
//       }

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
//     setNewRole(prev => ({ ...prev, [field]: value }));
//   };

//   // Handle permission toggles for new role
//   const handleNewRolePermissionToggle = (module, action) => {
//     setNewRole(prev => {
//       const currentModule = prev.permissions[module] || defaultPermissions[module];
//       const currentValue = currentModule[action] ?? false;
//       return {
//         ...prev,
//         permissions: {
//           ...prev.permissions,
//           [module]: {
//             ...currentModule,
//             [action]: !currentValue
//           }
//         }
//       };
//     });
//   };

//   // Handle permission toggles for existing role
//   const handlePermissionToggle = (module, action) => {
//     if (!selectedRole || selectedRole.isSystem) return;

//     const currentModule = selectedRole.permissions[module] || defaultPermissions[module];
//     const currentValue = currentModule[action] ?? false;

//     setRoles(prevRoles =>
//       prevRoles.map(role =>
//         role.id === selectedRole.id
//           ? {
//             ...role,
//             permissions: {
//               ...role.permissions,
//               [module]: {
//                 ...currentModule,
//                 [action]: !currentValue
//               }
//             }
//           }
//           : role
//       )
//     );

//     setSelectedRole(prev => ({
//       ...prev,
//       permissions: {
//         ...prev.permissions,
//         [module]: {
//           ...currentModule,
//           [action]: !currentValue
//         }
//       }
//     }));
//   };

//   // Generate slug from name
//   const generateSlug = (name) =>
//     name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');

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
//       if (!response.ok) {
//         const errorText = await response.text().catch(() => '');
//         console.error('Create role failed:', response.status, response.statusText, errorText);
//         throw new Error(`Failed to create role: ${response.status}`);
//       }

//       const createdRole = await response.json();
//       console.log('Created role data:', createdRole);

//       // Ensure full permissions for new role
//       const fullPerms = { ...defaultPermissions };
//       if (createdRole.permissions && typeof createdRole.permissions === 'object') {
//         Object.entries(createdRole.permissions).forEach(([modKey, modValue]) => {
//           if (modValue && typeof modValue === 'object') {
//             fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
//           }
//         });
//       }

//       const newRoleWithDetails = {
//         ...createdRole,
//         id: createdRole._id,
//         permissions: fullPerms,
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

//       const updateUrl = `${API_BASE}/api/admin/users/role/${selectedRole.id}`;
//       console.log('Updating role with API body:', JSON.stringify(roleData, null, 2));
//       console.log('Update URL:', updateUrl);
//       const headers = await getHeaders();
//       const response = await fetch(updateUrl, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(roleData)
//       });

//       console.log('Update role response status:', response.status, response.statusText);
//       if (!response.ok) {
//         const errorText = await response.text().catch(() => '');
//         console.error('Full error response:', errorText);
//         console.error('Update role failed:', response.status, response.statusText, errorText);
//         let msg = `Failed to update role permissions: ${response.status}`;
//         try {
//           const errorJson = JSON.parse(errorText);
//           if (errorJson?.message) msg = errorJson.message;
//         } catch { }  // Fallback to status
//         throw new Error(msg);
//       }

//       const updatedRole = await response.json();
//       console.log('Updated role data:', updatedRole);

//       // Ensure full permissions for updated role
//       const fullPerms = { ...defaultPermissions };
//       if (updatedRole.permissions && typeof updatedRole.permissions === 'object') {
//         Object.entries(updatedRole.permissions).forEach(([modKey, modValue]) => {
//           if (modValue && typeof modValue === 'object') {
//             fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
//           }
//         });
//       }

//       // Update local state
//       setRoles(prevRoles =>
//         prevRoles.map(role =>
//           role.id === selectedRole.id ? { ...updatedRole, id: updatedRole._id, permissions: fullPerms, memberCount: role.memberCount } : role
//         )
//       );
//       setSelectedRole({ ...updatedRole, id: updatedRole._id, permissions: fullPerms, memberCount: selectedRole.memberCount });
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
//     if (permissions && typeof permissions === 'object') {
//       Object.entries(permissions).forEach(([key, mod]) => {
//         if (mod && typeof mod === 'object') {
//           Object.values(mod).forEach(action => {
//             if (action) count++;
//           });
//         }
//       });
//     }
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
//     (member.role || '').toLowerCase().includes(searchQuery.toLowerCase())
//   );

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
//           {Object.entries(item.permissions || {})
//             .filter(([module, actions]) =>
//               actions && Object.values(actions).some(action => action)
//             )
//             .slice(0, 3)
//             .map(([module]) => (
//               <View key={module} className="bg-gray-100 px-3 py-1.5 rounded-2xl">
//                 <Text className="text-xs font-urbanistMedium text-gray-600">
//                   {permissionModules.find(m => m.key === module)?.label || module}
//                 </Text>
//               </View>
//             ))}
//           {Object.keys(item.permissions || {}).filter(module =>
//             item.permissions[module] && Object.values(item.permissions[module]).some(action => action)
//           ).length > 3 && (
//               <Text className="text-xs font-urbanistRegular text-gray-500">
//                 +{Object.keys(item.permissions || {}).filter(module =>
//                   item.permissions[module] && Object.values(item.permissions[module]).some(action => action)
//                 ).length - 3} more
//               </Text>
//             )}
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
//           {item.assignedProjects && item.assignedProjects.length > 0 && (
//             <Text className="text-xs font-urbanistRegular text-gray-500 mt-1">
//               Projects: {item.assignedProjects.map(pid => projects.find(p => p.id === pid)?.name || pid).slice(0, 3).join(', ')}{item.assignedProjects.length > 3 ? ` +${item.assignedProjects.length - 3}` : ''}
//             </Text>
//           )}
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
//                     value={newRole.permissions[module.key]?.[actionKey] ?? false}
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
//           `rounded-xl py-4 items-center mt-5 ${isLoading || !newRole.name.trim() || !newRole.description.trim()
//             ? 'bg-gray-400'
//             : 'bg-blue-600'
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
//                     value={selectedRole.permissions[module.key]?.[actionKey] ?? false}
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
//             <Text className={`text-base font-urbanistRegular ${newMember.roleId ? 'text-gray-900' : 'text-gray-500'
//               }`}>
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
//                     onPress={() => handleRoleSelect(role.id)}
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

//         {/* Projects multi-select */}
//         <View className="mb-4">
//           <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
//             Assign Projects (optional)
//           </Text>
//           <TouchableOpacity
//             className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
//             onPress={() => setShowProjectDropdown(!showProjectDropdown)}
//           >
//             <Text className={`text-base font-urbanistRegular ${newMember.assignedProjects && newMember.assignedProjects.length ? 'text-gray-900' : 'text-gray-500'
//               }`}>
//               {getSelectedProjectsNames()}
//             </Text>
//             <Ionicons
//               name={showProjectDropdown ? "chevron-up" : "chevron-down"}
//               size={20}
//               color="#666"
//             />
//           </TouchableOpacity>

//           {showProjectDropdown && (
//             <View className="bg-white border border-gray-200 rounded-xl mt-2 max-h-48">
//               <ScrollView nestedScrollEnabled={true}>
//                 {projects.length === 0 ? (
//                   <View className="px-4 py-3">
//                     <Text className="text-sm font-urbanistRegular text-gray-600">No projects available</Text>
//                   </View>
//                 ) : projects.map(project => {
//                   const checked = newMember.assignedProjects.includes(project.id);
//                   return (
//                     <TouchableOpacity
//                       key={project.id}
//                       className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center"
//                       onPress={() => toggleProjectSelection(project.id)}
//                     >
//                       <View>
//                         <Text className="text-base font-urbanistMedium text-gray-900">{project.name}</Text>
//                       </View>
//                       <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: checked ? '#0066FF' : '#fff', borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
//                         {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//       </View>

//       <TouchableOpacity
//         className={
//           `rounded-xl py-4 items-center mt-5 ${isLoading || !newMember.name.trim() || !newMember.email.trim() ||
//             !newMember.password.trim() || !newMember.roleId
//             ? 'bg-gray-400'
//             : 'bg-blue-600'
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
//         // showBackButton={true}
//         backgroundColor="#0066FF"
//         titleColor="white"
//         iconColor="white"
//       />

//       <View className="flex-1 pt-4">
//         {/* Tabs */}
//         <View className="flex-row mx-5 mb-4 bg-gray-100 rounded-xl p-1">
//           <TouchableOpacity
//             className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'roles' ? 'bg-white' : ''
//               }`}
//             onPress={() => setActiveTab('roles')}
//           >
//             <Text className={`text-base font-urbanistSemiBold ${activeTab === 'roles' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
//               }`}>
//               Roles
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'members' ? 'bg-white' : ''
//               }`}
//             onPress={() => setActiveTab('members')}
//           >
//             <Text className={`text-base font-urbanistSemiBold ${activeTab === 'members' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
//               }`}>
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
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closeRoleSheet}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             justifyContent: 'flex-end',
//           }}
//         >
//           <Animated.View
//             style={{
//               backgroundColor: 'white',
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               paddingTop: 20,
//               paddingBottom: 30,
//               paddingHorizontal: 20,
//               transform: [{ translateY: slideAnim }],
//               maxHeight: '90%',
//             }}
//           >
//             {/* Handle Bar */}
//             <View
//               style={{
//                 width: 50,
//                 height: 5,
//                 backgroundColor: '#E5E5E5',
//                 borderRadius: 10,
//                 alignSelf: 'center',
//                 marginBottom: 15,
//               }}
//             />

//             {/* Header */}
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#000',
//                   flex: 1,
//                   textAlign: 'center',
//                 }}
//               >
//                 {selectedRole
//                   ? `${selectedRole.name} Permissions`
//                   : 'Create New Role'}
//               </Text>

//               <TouchableOpacity onPress={closeRoleSheet}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Scrollable Content */}
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {selectedRole ? renderRolePermissions() : renderRoleForm()}
//             </ScrollView>
//           </Animated.View>
//         </View>
//       </Modal>


//       {/* Member Bottom Sheet */}
//       <Modal
//         visible={showMemberSheet}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={closeMemberSheet}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             justifyContent: 'flex-end',
//           }}
//         >
//           <Animated.View
//             style={{
//               backgroundColor: 'white',
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               paddingTop: 20,
//               paddingBottom: 30,
//               paddingHorizontal: 20,
//               transform: [{ translateY: slideAnim }],
//               maxHeight: '90%',
//             }}
//           >
//             {/* Handle Bar */}
//             <View
//               style={{
//                 width: 50,
//                 height: 5,
//                 backgroundColor: '#E5E5E5',
//                 borderRadius: 10,
//                 alignSelf: 'center',
//                 marginBottom: 15,
//               }}
//             />

//             {/* Header */}
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 marginBottom: 10,
//               }}
//             >
//               <Text
//                 style={{
//                   fontFamily: 'Urbanist-Bold',
//                   fontSize: 18,
//                   color: '#000',
//                   flex: 1,
//                   textAlign: 'center',
//                 }}
//               >
//                 {selectedMember ? selectedMember.name : 'Add New Member'}
//               </Text>
//               <TouchableOpacity onPress={closeMemberSheet}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {/* Scrollable Content */}
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {selectedMember ? (
//                 <View style={{ alignItems: 'center', paddingVertical: 20 }}>
//                   {/* Avatar */}
//                   <View
//                     style={{
//                       width: 80,
//                       height: 80,
//                       borderRadius: 40,
//                       backgroundColor: '#F3F4F6',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginBottom: 15,
//                     }}
//                   >
//                     <Text style={{ fontSize: 32 }}>{selectedMember.avatar}</Text>
//                   </View>

//                   {/* Member Info */}
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Bold',
//                       fontSize: 20,
//                       color: '#111827',
//                       marginBottom: 4,
//                     }}
//                   >
//                     {selectedMember.name}
//                   </Text>
//                   <Text
//                     style={{
//                       fontFamily: 'Urbanist-Regular',
//                       fontSize: 16,
//                       color: '#6B7280',
//                       marginBottom: 20,
//                     }}
//                   >
//                     {selectedMember.email}
//                   </Text>

//                   {/* Role */}
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       width: '100%',
//                       paddingVertical: 12,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E5E7EB',
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 16,
//                         color: '#111827',
//                       }}
//                     >
//                       Role:
//                     </Text>
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 16,
//                         color: '#6B7280',
//                       }}
//                     >
//                       {selectedMember.role}
//                     </Text>
//                   </View>

//                   {/* Status */}
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       width: '100%',
//                       paddingVertical: 12,
//                       borderBottomWidth: 1,
//                       borderBottomColor: '#E5E7EB',
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-SemiBold',
//                         fontSize: 16,
//                         color: '#111827',
//                       }}
//                     >
//                       Status:
//                     </Text>
//                     <Text
//                       style={{
//                         fontFamily: 'Urbanist-Regular',
//                         fontSize: 16,
//                         color:
//                           selectedMember.status === 'Active'
//                             ? '#15803D'
//                             : '#B91C1C',
//                       }}
//                     >
//                       {selectedMember.status}
//                     </Text>
//                   </View>

//                   {/* Assigned Projects */}
//                   {selectedMember.assignedProjects &&
//                     selectedMember.assignedProjects.length > 0 && (
//                       <View style={{ width: '100%', marginTop: 10 }}>
//                         <Text
//                           style={{
//                             fontFamily: 'Urbanist-Medium',
//                             fontSize: 14,
//                             color: '#111827',
//                             marginBottom: 6,
//                           }}
//                         >
//                           Assigned Projects
//                         </Text>
//                         {selectedMember.assignedProjects.map((pid) => (
//                           <View
//                             key={pid}
//                             style={{
//                               paddingVertical: 8,
//                               borderBottomWidth: 1,
//                               borderBottomColor: '#F3F4F6',
//                             }}
//                           >
//                             <Text
//                               style={{
//                                 fontFamily: 'Urbanist-Regular',
//                                 fontSize: 14,
//                                 color: '#374151',
//                               }}
//                             >
//                               {projects.find((p) => p.id === pid)?.name || pid}
//                             </Text>
//                           </View>
//                         ))}
//                       </View>
//                     )}
//                 </View>
//               ) : (
//                 renderAddMemberForm()
//               )}
//             </ScrollView>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default RolesMembersScreen; 



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
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  // Default permissions structure - Added task module
  const defaultPermissions = {
    indent: { create: false, read: true, update: false, delete: false },
    boq: { create: false, read: true, update: false, delete: false },
    vendor: { create: false, read: false, update: false, delete: false },
    user: { create: false, read: false, update: false, delete: false },
    proposal: { create: false, read: false, update: false, delete: false },
    siteSurvey: { create: false, read: false, update: false, delete: false },
    project: { create: false, read: true, update: false, delete: false },
    plan: { create: false, read: true, update: false, delete: false },
    risk: { create: false, read: true, update: false, delete: false },
    task: { create: false, read: true, update: false, delete: false, approve: false } // Added task module
  };

  // Updated role form state to match API structure
  const [newRole, setNewRole] = useState({
    name: '',
    slug: '',
    description: '',
    permissions: { ...defaultPermissions },
    isSystem: false
  });

  // New member form state (added assignedProjects)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    assignedProjects: [], // <-- new field (array of project ids)
  });

  // Initial empty states
  const [roles, setRoles] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]); // fetched projects

  const slideAnim = useRef(new Animated.Value(300)).current;

  // Updated permission modules to match API structure - Added task management
  const permissionModules = [
    {
      key: 'indent',
      label: 'Indent Management',
      description: 'Manage material indents and requests',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'risk',
      label: 'Risk Management',
      description: 'Manage risks and issues',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'boq',
      label: 'BOQ Management',
      description: 'Handle Bill of Quantities and estimates',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'proposal',
      label: 'Proposal Management',
      description: 'Handle Proposal of Projects',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'vendor',
      label: 'Vendor Management',
      description: 'Manage vendors and suppliers',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'user',
      label: 'User Management',
      description: 'Manage users and team members',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'siteSurvey',
      label: 'Site Survey Management',
      description: 'Manage site surveys and inspections',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'task',
      label: 'Task Management',
      description: 'Manage tasks and assignments',
      actions: ['create', 'read', 'update', 'delete', 'approve']
    },
    {
      key: 'project',
      label: 'project Management',
      description: 'Manage project and actions',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      key: 'plan',
      label: 'plan Management',
      description: 'Manage plan and actions',
      actions: ['create', 'read', 'update', 'delete']
    }
  ];

  // Permission actions with labels
  const permissionActions = {
    create: { key: 'create', label: 'Create' },
    read: { key: 'read', label: 'Read' },
    update: { key: 'update', label: 'Update' },
    delete: { key: 'delete', label: 'Delete' }
  };

  // API base URL
  const API_BASE = `${process.env.BASE_API_URL}`;

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

  // Fetch roles, members and projects on mount
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
        if (!rolesResponse.ok) {
          const txt = await rolesResponse.text().catch(() => '');
          console.error('Roles fetch failed:', rolesResponse.status, rolesResponse.statusText, txt);
          throw new Error(`Failed to fetch roles: ${rolesResponse.status}`);
        }
        const rolesRes = await rolesResponse.json();
        console.log('Roles data:', rolesRes);

        // Map roles with full permissions structure
        const mappedRoles = (rolesRes || []).map(role => {
          const fullPerms = { ...defaultPermissions };
          if (role.permissions && typeof role.permissions === 'object') {
            Object.entries(role.permissions).forEach(([modKey, modValue]) => {
              if (modValue && typeof modValue === 'object') {
                fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
              }
            });
          }
          return { ...role, id: role._id, permissions: fullPerms };
        });
        setRoles(mappedRoles);

        // Fetch members
        console.log('Fetching members from:', `${API_BASE}/api/admin/users`);
        const membersHeaders = await getHeaders();
        const membersResponse = await fetch(`${API_BASE}/api/admin/users`, {
          headers: membersHeaders
        });
        console.log('Members response status:', membersResponse.status, membersResponse.statusText);
        if (!membersResponse.ok) {
          const txt = await membersResponse.text().catch(() => '');
          console.error('Members fetch failed:', membersResponse.status, membersResponse.statusText, txt);
          throw new Error(`Failed to fetch members: ${membersResponse.status}`);
        }
        const membersRes = await membersResponse.json();
        console.log('Members data:', membersRes);

        // Map members with role display logic (preserve your logic)
        const mappedMembers = (membersRes.data || []).map(member => {
          const memberWithId = { ...member, id: member._id || member.id };

          // Role display logic
          let roleDisplay = 'Unknown Role';
          if (member.roleId) {
            const roleObj = mappedRoles.find(r => r.id === member.roleId);
            if (roleObj) roleDisplay = roleObj.name;
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
              if (typeof member.roleName === 'string') roleDisplay = member.roleName;
            }
          }
          if (member.role) {
            try {
              const parsedRole = typeof member.role === 'string' ? JSON.parse(member.role) : member.role;
              if (parsedRole && parsedRole.name) roleDisplay = parsedRole.name;
            } catch (e) {
              // Ignore
            }
          }

          return {
            ...memberWithId,
            role: roleDisplay,
            avatar: member.avatar || '👤',
            status: member.status === 'active' ? 'Active' : (member.status || 'Active'),
            assignedProjects: member.assignedProjects || []
          };
        });

        setMembers(mappedMembers);

        // Fetch projects for assignment
        console.log('Fetching projects from:', `${API_BASE}/api/projects`);
        const projectsHeaders = await getHeaders();
        const projectsResponse = await fetch(`${API_BASE}/api/projects`, {
          headers: projectsHeaders
        });
        console.log('Projects response status:', projectsResponse.status, projectsResponse.statusText);
        if (!projectsResponse.ok) {
          const txt = await projectsResponse.text().catch(() => '');
          console.error('Projects fetch failed:', projectsResponse.status, projectsResponse.statusText, txt);
          // don't throw here — projects are optional for member creation
        } else {
          const projectsRes = await projectsResponse.json();
          // projects API might return array or { data: [...] }
          const list = Array.isArray(projectsRes) ? projectsRes : (projectsRes.data || projectsRes.projects || []);
          const mappedProjects = (list || []).map(p => ({
            id: p._id || p.id,
            name: p.name || p.projectName || p.projectCode || `Project ${p._id}`
          }));
          setProjects(mappedProjects);
        }
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
      // Ensure selectedRole has full permissions
      const fullPerms = { ...defaultPermissions };
      if (role.permissions && typeof role.permissions === 'object') {
        Object.entries(role.permissions).forEach(([modKey, modValue]) => {
          if (modValue && typeof modValue === 'object') {
            fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
          }
        });
      }
      setSelectedRole({ ...role, permissions: fullPerms });
    } else {
      setSelectedRole(null);
      setNewRole({
        name: '',
        slug: '',
        description: '',
        permissions: { ...defaultPermissions },
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
        permissions: { ...defaultPermissions },
        isSystem: false
      });
    });
  };

  const openMemberSheet = (member = null) => {
    if (member) {
      setSelectedMember(member);
      // Pre-fill the form with member data for editing
      // Find the roleId from the member's role name
      const memberRole = roles.find(r => r.name === member.role);
      setNewMember({
        name: member.name || '',
        email: member.email || '',
        password: '', // Password field empty for security - only fill if changing
        roleId: member.roleId || memberRole?.id || '',
        assignedProjects: member.assignedProjects || []
      });
    } else {
      setSelectedMember(null);
      setNewMember({
        name: '',
        email: '',
        password: '',
        roleId: '',
        assignedProjects: []
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
        roleId: '',
        assignedProjects: []
      });
      setShowRoleDropdown(false);
      setShowProjectDropdown(false);
    });
  };

  // Handle new member form changes
  const handleNewMemberChange = (field, value) => {
    setNewMember(prev => ({ ...prev, [field]: value }));
  };

  // Handle role selection
  const handleRoleSelect = (roleId) => {
    setNewMember(prev => ({ ...prev, roleId }));
    setShowRoleDropdown(false);
  };

  // Handle project toggle for assignedProjects (multi-select)
  const toggleProjectSelection = (projectId) => {
    setNewMember(prev => {
      const assigned = prev.assignedProjects || [];
      if (assigned.includes(projectId)) {
        return { ...prev, assignedProjects: assigned.filter(id => id !== projectId) };
      } else {
        return { ...prev, assignedProjects: [...assigned, projectId] };
      }
    });
  };

  const getSelectedRoleName = () => {
    if (!newMember.roleId) return 'Select Role';
    const selectedRoleObj = roles.find(role => role.id === newMember.roleId);
    return selectedRoleObj?.name || 'Select Role';
  };

  const getSelectedProjectsNames = () => {
    if (!newMember.assignedProjects || newMember.assignedProjects.length === 0) return 'Assign Projects (optional)';
    const names = newMember.assignedProjects.map(pid => {
      // Try to find project by id or _id to handle different ID formats
      const project = projects.find(p => p.id === pid || p._id === pid);
      return project?.name || pid;
    });
    return names.join(', ');
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
      // Build request body — include assignedProjects (array of project ids)
      const memberData = {
        name: newMember.name.trim(),
        email: newMember.email.trim().toLowerCase(),
        password: newMember.password,
        roleId: newMember.roleId,
        assignedProjects: newMember.assignedProjects || []
      };

      console.log('Creating new member with API body:', JSON.stringify(memberData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(memberData)
      });

      console.log('Create member response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Create member failed:', response.status, response.statusText, errorText);
        let msg = `Failed to create member: ${response.status}`;
        try {
          const j = errorText ? JSON.parse(errorText) : null;
          if (j?.message) msg = j.message;
        } catch (e) { }
        throw new Error(msg);
      }

      const responseData = await response.json();
      const createdMember = responseData.data || responseData; // adapt to API shape
      console.log('Created member data:', createdMember);
      const roleName = roles.find(role => role.id === newMember.roleId)?.name || 'Unknown Role';

      const newMemberWithDetails = {
        ...createdMember,
        id: createdMember._id || createdMember.id,
        role: roleName,
        avatar: '👤',
        status: 'Active',
        assignedProjects: createdMember.assignedProjects || newMember.assignedProjects || []
      };

      setMembers(prev => [newMemberWithDetails, ...prev]);

      // Update role memberCount
      const roleIndex = roles.findIndex(r => r.id === newMember.roleId);
      if (roleIndex !== -1) {
        setRoles(prevRoles => prevRoles.map((r, i) => i === roleIndex ? { ...r, memberCount: (r.memberCount || 0) + 1 } : r));
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

  // Handle update existing member
  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    if (!newMember.name.trim()) {
      Alert.alert('Error', 'Please enter member name');
      return;
    }

    if (!newMember.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
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

    // Password validation only if provided
    if (newMember.password && newMember.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Build request body for update
      const memberData = {
        name: newMember.name.trim(),
        email: newMember.email.trim().toLowerCase(),
        roleId: newMember.roleId,
        assignedProjects: newMember.assignedProjects || []
      };

      // Only include password if it was changed (not empty)
      if (newMember.password && newMember.password.trim()) {
        memberData.password = newMember.password;
      }

      console.log('Updating member with API body:', JSON.stringify(memberData, null, 2));

      const headers = await getHeaders();
      const response = await fetch(`${API_BASE}/api/admin/users/${selectedMember.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(memberData)
      });

      console.log('Update member response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Update member failed:', response.status, response.statusText, errorText);
        let msg = `Failed to update member: ${response.status}`;
        try {
          const j = errorText ? JSON.parse(errorText) : null;
          if (j?.message) msg = j.message;
        } catch (e) { }
        throw new Error(msg);
      }

      const responseData = await response.json();
      const updatedMember = responseData.data || responseData;
      console.log('Updated member data:', updatedMember);

      const roleName = roles.find(role => role.id === newMember.roleId)?.name || 'Unknown Role';

      const updatedMemberWithDetails = {
        ...selectedMember,
        ...updatedMember,
        id: updatedMember._id || updatedMember.id || selectedMember.id,
        name: newMember.name.trim(),
        email: newMember.email.trim().toLowerCase(),
        role: roleName,
        roleId: newMember.roleId,
        assignedProjects: newMember.assignedProjects || []
      };

      // Update members list
      setMembers(prev =>
        prev.map(m =>
          m.id === selectedMember.id ? updatedMemberWithDetails : m
        )
      );

      Alert.alert('Success', 'Member updated successfully');
      closeMemberSheet();
    } catch (error) {
      console.error('Error updating member:', error);
      Alert.alert('Error', `Failed to update member: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new role form changes
  const handleNewRoleChange = (field, value) => {
    setNewRole(prev => ({ ...prev, [field]: value }));
  };

  // Handle permission toggles for new role
  const handleNewRolePermissionToggle = (module, action) => {
    setNewRole(prev => {
      const currentModule = prev.permissions[module] || defaultPermissions[module];
      const currentValue = currentModule[action] ?? false;
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: {
            ...currentModule,
            [action]: !currentValue
          }
        }
      };
    });
  };

  // Handle permission toggles for existing role
  const handlePermissionToggle = (module, action) => {
    if (!selectedRole || selectedRole.isSystem) return;

    const currentModule = selectedRole.permissions[module] || defaultPermissions[module];
    const currentValue = currentModule[action] ?? false;

    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === selectedRole.id
          ? {
            ...role,
            permissions: {
              ...role.permissions,
              [module]: {
                ...currentModule,
                [action]: !currentValue
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
          ...currentModule,
          [action]: !currentValue
        }
      }
    }));
  };

  // Generate slug from name
  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');

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
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Create role failed:', response.status, response.statusText, errorText);
        throw new Error(`Failed to create role: ${response.status}`);
      }

      const createdRole = await response.json();
      console.log('Created role data:', createdRole);

      // Ensure full permissions for new role
      const fullPerms = { ...defaultPermissions };
      if (createdRole.permissions && typeof createdRole.permissions === 'object') {
        Object.entries(createdRole.permissions).forEach(([modKey, modValue]) => {
          if (modValue && typeof modValue === 'object') {
            fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
          }
        });
      }

      const newRoleWithDetails = {
        ...createdRole,
        id: createdRole._id,
        permissions: fullPerms,
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

      const updateUrl = `${API_BASE}/api/admin/users/role/${selectedRole.id}`;
      console.log('Updating role with API body:', JSON.stringify(roleData, null, 2));
      console.log('Update URL:', updateUrl);
      const headers = await getHeaders();
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(roleData)
      });

      console.log('Update role response status:', response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Full error response:', errorText);
        console.error('Update role failed:', response.status, response.statusText, errorText);
        let msg = `Failed to update role permissions: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson?.message) msg = errorJson.message;
        } catch { }  // Fallback to status
        throw new Error(msg);
      }

      const updatedRole = await response.json();
      console.log('Updated role data:', updatedRole);

      // Ensure full permissions for updated role
      const fullPerms = { ...defaultPermissions };
      if (updatedRole.permissions && typeof updatedRole.permissions === 'object') {
        Object.entries(updatedRole.permissions).forEach(([modKey, modValue]) => {
          if (modValue && typeof modValue === 'object') {
            fullPerms[modKey] = { ...defaultPermissions[modKey], ...modValue };
          }
        });
      }

      // Update local state
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === selectedRole.id ? { ...updatedRole, id: updatedRole._id, permissions: fullPerms, memberCount: role.memberCount } : role
        )
      );
      setSelectedRole({ ...updatedRole, id: updatedRole._id, permissions: fullPerms, memberCount: selectedRole.memberCount });
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
    if (permissions && typeof permissions === 'object') {
      Object.entries(permissions).forEach(([key, mod]) => {
        if (mod && typeof mod === 'object') {
          Object.values(mod).forEach(action => {
            if (action) count++;
          });
        }
      });
    }
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
    (member.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {Object.entries(item.permissions || {})
            .filter(([module, actions]) =>
              actions && Object.values(actions).some(action => action)
            )
            .slice(0, 3)
            .map(([module]) => (
              <View key={module} className="bg-gray-100 px-3 py-1.5 rounded-2xl">
                <Text className="text-xs font-urbanistMedium text-gray-600">
                  {permissionModules.find(m => m.key === module)?.label || module}
                </Text>
              </View>
            ))}
          {Object.keys(item.permissions || {}).filter(module =>
            item.permissions[module] && Object.values(item.permissions[module]).some(action => action)
          ).length > 3 && (
              <Text className="text-xs font-urbanistRegular text-gray-500">
                +{Object.keys(item.permissions || {}).filter(module =>
                  item.permissions[module] && Object.values(item.permissions[module]).some(action => action)
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
          {/* {item.assignedProjects && item.assignedProjects.length > 0 && (
            <Text className="text-xs font-urbanistRegular text-gray-500 mt-1">
              Projects: {item.assignedProjects.map(pid => projects.find(p => p.id === pid)?.name || pid).slice(0, 3).join(', ')}{item.assignedProjects.length > 3 ? ` +${item.assignedProjects.length - 3}` : ''}
            </Text>
          )} */}
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
                    value={newRole.permissions[module.key]?.[actionKey] ?? false}
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
          `rounded-xl py-4 items-center mt-5 ${isLoading || !newRole.name.trim() || !newRole.description.trim()
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
                    value={selectedRole.permissions[module.key]?.[actionKey] ?? false}
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

  const renderAddMemberForm = () => {
    const isEditing = !!selectedMember;
    // Check if the member being edited is a client
    const isClientRole = isEditing && selectedMember?.role?.toLowerCase() === 'client';

    return (
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <View className="mb-5">
          <Text className="text-lg font-urbanistBold text-gray-900 mb-4">
            {isEditing ? 'Edit Member' : 'Add New Member'}
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

          {/* Hide password, role, and projects fields for clients */}
          {!isClientRole && (
            <>
              <View className="mb-4">
                <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
                  {isEditing ? 'New Password (leave empty to keep current)' : 'Password *'}
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-urbanistRegular text-gray-900"
                  placeholder={isEditing ? 'Enter new password (optional)' : 'Enter password'}
                  value={newMember.password}
                  onChangeText={(value) => handleNewMemberChange('password', value)}
                  placeholderTextColor="#999"
                  secureTextEntry
                />
                <Text className="text-xs font-urbanistRegular text-gray-600 mt-1">
                  {isEditing
                    ? 'Leave empty to keep the current password'
                    : 'Password must be at least 6 characters long'
                  }
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
                  <Text className={`text-base font-urbanistRegular ${newMember.roleId ? 'text-gray-900' : 'text-gray-500'
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
                          onPress={() => handleRoleSelect(role.id)}
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

              {/* Projects multi-select */}
              <View className="mb-4">
                <Text className="text-base font-urbanistSemiBold text-gray-900 mb-2">
                  Assign Projects (optional)
                </Text>
                <TouchableOpacity
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                  onPress={() => setShowProjectDropdown(!showProjectDropdown)}
                >
                  <Text className={`text-base font-urbanistRegular ${newMember.assignedProjects && newMember.assignedProjects.length ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                    {getSelectedProjectsNames()}
                  </Text>
                  <Ionicons
                    name={showProjectDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {showProjectDropdown && (
                  <View className="bg-white border border-gray-200 rounded-xl mt-2 max-h-48">
                    <ScrollView nestedScrollEnabled={true}>
                      {projects.length === 0 ? (
                        <View className="px-4 py-3">
                          <Text className="text-sm font-urbanistRegular text-gray-600">No projects available</Text>
                        </View>
                      ) : projects.map(project => {
                        // Check if this project is in the assigned projects list
                        const checked = newMember.assignedProjects.some(pid => pid === project.id || pid === project._id);
                        return (
                          <TouchableOpacity
                            key={project.id}
                            className="px-4 py-3 border-b border-gray-100 flex-row justify-between items-center"
                            onPress={() => toggleProjectSelection(project.id)}
                          >
                            <View>
                              <Text className="text-base font-urbanistMedium text-gray-900">{project.name}</Text>
                            </View>
                            <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: checked ? '#0066FF' : '#fff', borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
                              {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          className={
            `rounded-xl py-4 items-center mt-5 ${isLoading || !newMember.name.trim() || !newMember.email.trim() ||
              (!isEditing && !newMember.password.trim()) || (!isClientRole && !newMember.roleId)
              ? 'bg-gray-400'
              : 'bg-blue-600'
            }`
          }
          onPress={isEditing ? handleUpdateMember : handleCreateMember}
          disabled={
            isLoading || !newMember.name.trim() || !newMember.email.trim() ||
            (!isEditing && !newMember.password.trim()) || (!isClientRole && !newMember.roleId)
          }
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-urbanistBold text-white">
              {isEditing ? 'Update Member' : 'Create Member'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const InfoRow = ({ label, value }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#E5E7EB',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#4B5563' }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#111827',
          textAlign: 'right',
          maxWidth: '60%',
        }}
      >
        {value}
      </Text>
    </View>
  );

  const renderMemberDetails = () => {
    if (!selectedMember) return null;

    const assignedProjectNames =
      selectedMember.assignedProjects?.length > 0
        ? selectedMember.assignedProjects
          .map(pid => projects.find(p => p.id === pid)?.name || pid)
          .join(', ')
        : 'No projects assigned';

    return (
      <ScrollView className="px-5">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-3">
            <Text className="text-3xl">{selectedMember.avatar}</Text>
          </View>
          <Text className="text-xl font-urbanistBold text-gray-900">
            {selectedMember.name}
          </Text>
          <Text className="text-sm font-urbanistRegular text-gray-600">
            {selectedMember.email}
          </Text>
        </View>

        {/* Info Cards */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
          <InfoRow label="Full Name" value={selectedMember.name} />
          <InfoRow label="Email" value={selectedMember.email} />
          <InfoRow label="Role" value={selectedMember.role} />
          <InfoRow label="Status" value={selectedMember.status} />
          <InfoRow label="Assigned Projects" value={assignedProjectNames} />
        </View>


        {/* Actions (optional) */}
        <TouchableOpacity className="bg-blue-600 rounded-xl py-4 items-center mt-4">
          <Text className="text-white font-urbanistBold">
            Edit Member
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };





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
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <View className="flex-1 pt-4">
        {/* Tabs */}
        <View className="flex-row mx-5 mb-4 bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'roles' ? 'bg-white' : ''
              }`}
            onPress={() => setActiveTab('roles')}
          >
            <Text className={`text-base font-urbanistSemiBold ${activeTab === 'roles' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
              }`}>
              Roles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'members' ? 'bg-white' : ''
              }`}
            onPress={() => setActiveTab('members')}
          >
            <Text className={`text-base font-urbanistSemiBold ${activeTab === 'members' ? 'text-blue-600 font-urbanistBold' : 'text-gray-600'
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
        transparent={true}
        animationType="slide"
        onRequestClose={closeRoleSheet}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 30,
              paddingHorizontal: 20,
              transform: [{ translateY: slideAnim }],
              maxHeight: '90%',
            }}
          >
            {/* Handle Bar */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: '#E5E5E5',
                borderRadius: 10,
                alignSelf: 'center',
                marginBottom: 15,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#000',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {selectedRole
                  ? `${selectedRole.name} Permissions`
                  : 'Create New Role'}
              </Text>

              <TouchableOpacity onPress={closeRoleSheet}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedRole
                ? renderRolePermissions()
                : renderRoleForm()}
            </ScrollView>

          </Animated.View>
        </View>
      </Modal>


      {/* Member Bottom Sheet */}
      <Modal
        visible={showMemberSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMemberSheet}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 30,
              paddingHorizontal: 20,
              transform: [{ translateY: slideAnim }],
              maxHeight: '90%',
            }}
          >
            {/* Handle Bar */}
            <View
              style={{
                width: 50,
                height: 5,
                backgroundColor: '#E5E5E5',
                borderRadius: 10,
                alignSelf: 'center',
                marginBottom: 15,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 18,
                  color: '#000',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {selectedMember ? `Edit ${selectedMember.name}` : 'Add New Member'}
              </Text>
              <TouchableOpacity onPress={closeMemberSheet}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content - Always show the form */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderAddMemberForm()}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default RolesMembersScreen; 