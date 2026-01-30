

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   Alert,
//   Animated,
//   Linking,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Svg, { Circle, G, Text as SvgText, Rect, Line, Path, LinearGradient, Stop, Defs } from 'react-native-svg';
// import Header from '@/components/Header';
// import SurveyScreen from '../HomeOwner/survey';
// import Transaction from '../HomeOwner/Transaction';
// // Sub Screens
// import ProjectTimeline from '../HomeOwner/ProjectTimeline';
// import BudgetTracker from '../HomeOwner/BudgetTracker';
// import QualityChecks from '../HomeOwner/QualityChecks';
// import ChangeRequests from '../HomeOwner/ChangeRequests';
// import MaterialStatus from '../HomeOwner/MaterialStatus';
// import BOQClientScreen from '../HomeOwner/BOQClientScreen';
// import FilesScreen from '../Document-Management/FileScreen';
// import SnagListScreen from '../Snags/SnagListScreen';
// import WorkProgressListScreen from '../WorkProgress/WorkProgressListScreen';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// // Theme Colors with #0066FF as primary
// const COLORS = {
//   primary: '#0066FF',
//   primaryLight: '#3385FF',
//   primaryDark: '#0052CC',
//   primaryBg: '#E6F0FF',
//   secondary: '#00B8D4',
//   accent: '#0091EA',
//   success: '#00C853',
//   warning: '#FF9800',
//   danger: '#F44336',
//   background: '#F5F7FA',
//   surface: '#FFFFFF',
//   surfaceAlt: '#F0F2F5',
//   text: '#1A1A1A',
//   textSecondary: '#6B7280',
//   textLight: '#9CA3AF',
//   border: '#E5E7EB',
// };

// // Skeleton Loader Component
// const SkeletonLoader = ({ width, height, borderRadius = 8, style }) => {
//   const animatedValue = React.useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(animatedValue, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(animatedValue, {
//           toValue: 0,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   const opacity = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.3, 0.7],
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           width,
//           height,
//           backgroundColor: COLORS.surfaceAlt,
//           borderRadius,
//           opacity,
//         },
//         style,
//       ]}
//     />
//   );
// };

// // Skeleton for Progress Dashboard
// const ProgressDashboardSkeleton = () => (
//   <View
//     style={{
//       backgroundColor: COLORS.surface,
//       borderRadius: 24,
//       padding: 24,
//       marginHorizontal: 16,
//       marginBottom: 20,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//     }}
//   >
//     <View style={{ alignItems: 'center', marginBottom: 24 }}>
//       <SkeletonLoader width={180} height={180} borderRadius={90} />
//     </View>

//     <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.border }}>
//       <View style={{ alignItems: 'center' }}>
//         <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
//         <SkeletonLoader width={80} height={16} borderRadius={4} />
//       </View>
//       <View style={{ alignItems: 'center' }}>
//         <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
//         <SkeletonLoader width={80} height={16} borderRadius={4} />
//       </View>
//       <View style={{ alignItems: 'center' }}>
//         <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
//         <SkeletonLoader width={80} height={16} borderRadius={4} />
//       </View>
//     </View>
//   </View>
// );

// // Skeleton for Progress Cards
// const ProgressCardsSkeleton = () => (
//   <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20 }}>
//     {[1, 2, 3].map((item) => (
//       <View
//         key={item}
//         style={{
//           width: screenWidth * 0.42,
//           backgroundColor: COLORS.surface,
//           borderRadius: 20,
//           padding: 18,
//           marginRight: 12,
//           borderWidth: 1,
//           borderColor: COLORS.border,
//         }}
//       >
//         <SkeletonLoader width={48} height={48} borderRadius={24} style={{ marginBottom: 14 }} />
//         <SkeletonLoader width="80%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
//         <SkeletonLoader width="60%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
//         <SkeletonLoader width="50%" height={12} borderRadius={4} />
//       </View>
//     ))}
//   </View>
// );

// // Skeleton for Milestone Card
// const MilestoneCardSkeleton = () => (
//   <View
//     style={{
//       backgroundColor: COLORS.surface,
//       borderRadius: 16,
//       padding: 18,
//       marginBottom: 16,
//       borderWidth: 1,
//       borderColor: COLORS.border,
//     }}
//   >
//     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//       <SkeletonLoader width={100} height={28} borderRadius={14} />
//       <SkeletonLoader width={24} height={24} borderRadius={12} />
//     </View>
//     <SkeletonLoader width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
//     <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: 14 }} />
//     <View style={{ marginBottom: 14 }}>
//       <SkeletonLoader width="100%" height={8} borderRadius={4} style={{ marginBottom: 8 }} />
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <SkeletonLoader width={60} height={14} borderRadius={4} />
//         <SkeletonLoader width={40} height={14} borderRadius={4} />
//       </View>
//     </View>
//     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//       <SkeletonLoader width={100} height={14} borderRadius={4} />
//       <SkeletonLoader width={100} height={14} borderRadius={4} />
//     </View>
//   </View>
// );

// const Overview = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const isFocused = useIsFocused();
//   const { project, initialTab } = route.params || {};

//   const [activeTab, setActiveTab] = useState('Overview');
//   const [milestones, setMilestones] = useState([]);
//   const [currentRisks, setCurrentRisks] = useState([]);
//   const [overallProgress, setOverallProgress] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Animation values
//   const progressAnim = React.useRef(new Animated.Value(0)).current;
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;

//   // Fetch Milestones and calculate progress
//   const fetchMilestones = async () => {
//     if (!project?._id) return;

//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('userToken');
//       if (!token) return;

//       const response = await fetch(
//         `${process.env.BASE_API_URL}/api/milestones/fetch-by-project/${project._id}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const result = await response.json();

//       if (response.ok && result.success) {
//         const milestonesData = result.data;
//         setMilestones(milestonesData);

//         // Calculate overall progress
//         if (milestonesData.length > 0) {
//           const totalProgress = milestonesData.reduce((sum, milestone) => sum + (milestone.progress || 0), 0);
//           const avgProgress = totalProgress / milestonesData.length;
//           setOverallProgress(Math.round(avgProgress));

//           // Animate progress
//           Animated.timing(progressAnim, {
//             toValue: avgProgress,
//             duration: 1500,
//             useNativeDriver: false,
//           }).start();
//         }
//       }
//     } catch (error) {
//       console.error('Milestone Fetch Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRisks = async () => {
//     const pid = project?._id || project?.id;
//     if (!pid) return;

//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const response = await fetch(`${process.env.BASE_API_URL}/api/risks/project/${pid}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const json = await response.json();
//       if (json.success) {
//         setCurrentRisks(json.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch risks", error);
//     }
//   };

//   useEffect(() => {
//     if (initialTab) {
//       setActiveTab(initialTab);
//     }
//   }, [initialTab]);

//   useEffect(() => {
//     if (isFocused) {
//       fetchMilestones();
//       fetchRisks();

//       // Fade animation
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [isFocused, project]);

//   // Enhanced tabs with icons
//   const tabs = [
//     { id: 'Overview', label: 'Overview', icon: 'home-outline' },
//     { id: 'Survey', label: 'Survey', icon: 'clipboard' },
//      { id: 'Progress', label: 'Progress', icon: 'trending-up-outline' },
//       { id: 'BOQ', label: 'BOQ', icon: 'document-text-outline' },
//  { id: 'Plans', label: 'Plans', icon: 'layers-outline' },
//   { id: 'MaterialStatus', label: 'Materials', icon: 'cube-outline' },
//     { id: 'Transaction', label: 'Transaction', icon: 'card-outline' },
//     { id: 'Snags', label: 'Snags', icon: 'bug-outline' },
//     { id: 'Issues', label: 'Issues', icon: 'alert-circle-outline' },
//     { id: 'Handover', label: 'Handover', icon: 'key-outline' },

//   ];

//   // Progress data based on milestones
//   const progressData = [
//     {
//       title: 'Overall Progress',
//       value: `${overallProgress}%`,
//       icon: 'trending-up',
//       color: COLORS.primary,
//       metric: 'Completion',
//     },
//     {
//       title: 'Tasks Completed',
//       value: `${milestones.filter(m => m.status === 'completed').length}/${milestones.length}`,
//       icon: 'checkmark-done',
//       color: COLORS.success,
//       metric: 'Tasks',
//     },
//     {
//       title: 'Active Milestones',
//       value: `${milestones.filter(m => m.status === 'in_progress').length}`,
//       icon: 'time',
//       color: COLORS.accent,
//       metric: 'In Progress',
//     },
//     {
//       title: 'Days Ahead',
//       value: '15',
//       icon: 'calendar',
//       color: COLORS.secondary,
//       metric: 'Schedule',
//     },
//   ];

//   // Enhanced Circular Progress Component
//   const EnhancedCircularProgress = ({ size = 180, progress = 0, strokeWidth = 12 }) => {
//     const radius = (size - strokeWidth) / 2;
//     const circumference = 2 * Math.PI * radius;
//     const strokeDashoffset = circumference - (progress / 100) * circumference;

//     return (
//       <Svg width={size} height={size}>
//         {/* Background Circle */}
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke={COLORS.surfaceAlt}
//           strokeWidth={strokeWidth}
//           fill="none"
//         />

//         {/* Progress Ring */}
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke={COLORS.primary}
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeDasharray={`${circumference} ${circumference}`}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           rotation="-90"
//           origin={`${size / 2}, ${size / 2}`}
//         />

//         {/* Inner Circle */}
//         <Circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius - strokeWidth - 8}
//           fill={COLORS.surface}
//         />

//         {/* Progress Text */}
//         <SvgText
//           x={size / 2}
//           y={size / 2 - 8}
//           textAnchor="middle"
//           fontSize="36"
//           fontWeight="bold"
//           fill={COLORS.text}
//         >
//           {progress}%
//         </SvgText>
//         <SvgText
//           x={size / 2}
//           y={size / 2 + 20}
//           textAnchor="middle"
//           fontSize="14"
//           fill={COLORS.textSecondary}
//         >
//           Complete
//         </SvgText>
//       </Svg>
//     );
//   };

//   // Milestone Card Component
//   const MilestoneCard = ({ milestone, index }) => {
//     const progress = milestone.progress || 0;
//     const statusColor = {
//       completed: COLORS.success,
//       in_progress: COLORS.primary,
//       not_started: COLORS.textLight,
//     }[milestone.status] || COLORS.textLight;

//     const statusIcon = {
//       completed: 'checkmark-circle',
//       in_progress: 'time',
//       not_started: 'ellipse-outline',
//     }[milestone.status] || 'ellipse-outline';

//     return (
//       <TouchableOpacity
//         onPress={() => navigation.navigate('MilestoneDetail', { milestone, projectId: project._id || project.id })}
//         style={{
//           backgroundColor: COLORS.surface,
//           borderRadius: 16,
//           padding: 18,
//           marginBottom: 16,
//           borderWidth: 1,
//           borderColor: COLORS.border,
//         }}
//       >
//         {/* Header */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
//           <View
//             style={{
//               backgroundColor: `${statusColor}15`,
//               paddingHorizontal: 12,
//               paddingVertical: 6,
//               borderRadius: 20,
//               flexDirection: 'row',
//               alignItems: 'center',
//             }}
//           >
//             <Ionicons name={statusIcon} size={14} color={statusColor} style={{ marginRight: 4 }} />
//             <Text style={{ fontSize: 12, fontWeight: '600', color: statusColor }}>
//               {milestone.status.replace('_', ' ')}
//             </Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
//         </View>

//         {/* Title */}
//         <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 6 }}>
//           {milestone.title}
//         </Text>

//         {/* Description */}
//         {milestone.description && (
//           <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 20 }}>
//             {milestone.description}
//           </Text>
//         )}

//         {/* Progress Section */}
//         <View style={{ marginBottom: 14 }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//             <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>Progress</Text>
//             <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>{progress}%</Text>
//           </View>

//           {/* Progress Bar */}
//           <View style={{ height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
//             <View
//               style={{
//                 width: `${progress}%`,
//                 height: '100%',
//                 backgroundColor: statusColor,
//                 borderRadius: 4,
//               }}
//             />
//           </View>
//         </View>

//         {/* Additional Info */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
//             <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
//               {milestone.dueDate || 'No deadline'}
//             </Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
//             <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
//               {milestone.assignedTo || 'Unassigned'}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Progress Stats Card
//   const ProgressStatsCard = () => {
//     const completed = milestones.filter(m => m.status === 'completed').length;
//     const inProgress = milestones.filter(m => m.status === 'in_progress').length;
//     const notStarted = milestones.filter(m => m.status === 'not_started').length;

//     return (
//       <View
//         style={{
//           backgroundColor: COLORS.surface,
//           borderRadius: 20,
//           padding: 20,
//           marginHorizontal: 16,
//           marginBottom: 20,
//           borderWidth: 1,
//           borderColor: COLORS.border,
//         }}
//       >
//         <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 20 }}>
//           Progress Breakdown
//         </Text>

//         <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
//           <View style={{ alignItems: 'center' }}>
//             <View
//               style={{
//                 width: 56,
//                 height: 56,
//                 borderRadius: 28,
//                 backgroundColor: `${COLORS.success}15`,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: 8,
//               }}
//             >
//               <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.success }}>{completed}</Text>
//             </View>
//             <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>Completed</Text>
//           </View>

//           <View style={{ alignItems: 'center' }}>
//             <View
//               style={{
//                 width: 56,
//                 height: 56,
//                 borderRadius: 28,
//                 backgroundColor: COLORS.primaryBg,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: 8,
//               }}
//             >
//               <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.primary }}>{inProgress}</Text>
//             </View>
//             <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>In Progress</Text>
//           </View>

//           <View style={{ alignItems: 'center' }}>
//             <View
//               style={{
//                 width: 56,
//                 height: 56,
//                 borderRadius: 28,
//                 backgroundColor: `${COLORS.textLight}15`,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: 8,
//               }}
//             >
//               <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.textLight }}>{notStarted}</Text>
//             </View>
//             <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>Not Started</Text>
//           </View>
//         </View>

//         {/* Progress Dots Visualization */}
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
//           {milestones.slice(0, 20).map((milestone, index) => {
//             const color = {
//               completed: COLORS.success,
//               in_progress: COLORS.primary,
//               not_started: COLORS.border,
//             }[milestone.status] || COLORS.border;

//             return (
//               <View
//                 key={index}
//                 style={{
//                   width: 12,
//                   height: 12,
//                   borderRadius: 6,
//                   backgroundColor: color,
//                 }}
//               />
//             );
//           })}
//         </View>
//       </View>
//     );
//   };

//   // Main Progress Dashboard
//   const renderProgressDashboard = () => (
//     <View
//       style={{
//         backgroundColor: COLORS.surface,
//         borderRadius: 24,
//         padding: 24,
//         marginHorizontal: 16,
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//       }}
//     >
//       <View style={{ alignItems: 'center', marginBottom: 24 }}>
//         <EnhancedCircularProgress size={180} progress={overallProgress} />
//       </View>

//       <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.border }}>
//         <View style={{ alignItems: 'center' }}>
//           <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>{milestones.length}</Text>
//           <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Total Tasks</Text>
//         </View>

//         <View style={{ width: 1, backgroundColor: COLORS.border }} />

//         <View style={{ alignItems: 'center' }}>
//           <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.success }}>
//             {milestones.filter(m => m.status === 'completed').length}
//           </Text>
//           <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Completed</Text>
//         </View>

//         <View style={{ width: 1, backgroundColor: COLORS.border }} />

//         <View style={{ alignItems: 'center' }}>
//           <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.primary }}>
//             {milestones.filter(m => m.status === 'in_progress').length}
//           </Text>
//           <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Active</Text>
//         </View>
//       </View>
//     </View>
//   );

//   // Enhanced Progress Cards
//   const renderProgressCards = () => (
//     <FlatList
//       data={progressData}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
//       renderItem={({ item }) => (
//         <View
//           style={{
//             width: screenWidth * 0.42,
//             backgroundColor: COLORS.surface,
//             borderRadius: 20,
//             padding: 18,
//             marginRight: 12,
//             borderWidth: 1,
//             borderColor: COLORS.border,
//           }}
//         >
//           <View
//             style={{
//               width: 48,
//               height: 48,
//               borderRadius: 24,
//               backgroundColor: `${item.color}15`,
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: 14,
//             }}
//           >
//             <Ionicons name={item.icon} size={24} color={item.color} />
//           </View>

//           <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '500' }}>
//             {item.title}
//           </Text>
//           <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 }}>
//             {item.value}
//           </Text>
//           <Text style={{ fontSize: 12, color: item.color, fontWeight: '600' }}>{item.metric}</Text>
//         </View>
//       )}
//       keyExtractor={(item) => item.title}
//     />
//   );

//   // Loading State with Skeleton
//   if (loading) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <Header title="Project Overview" showBackButton />

//         {/* Tab Navigation Skeleton */}
//         <View style={{ backgroundColor: COLORS.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
//             {[1, 2, 3, 4, 5].map((item) => (
//               <SkeletonLoader key={item} width={100} height={36} borderRadius={18} style={{ marginHorizontal: 4 }} />
//             ))}
//           </ScrollView>
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={{ paddingTop: 20, paddingBottom: 32 }}>
//             {/* Progress Dashboard Skeleton */}
//             <ProgressDashboardSkeleton />

//             {/* Progress Cards Skeleton */}
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <ProgressCardsSkeleton />
//             </ScrollView>

//             {/* Progress Stats Skeleton */}
//             <View
//               style={{
//                 backgroundColor: COLORS.surface,
//                 borderRadius: 20,
//                 padding: 20,
//                 marginHorizontal: 16,
//                 marginBottom: 20,
//                 borderWidth: 1,
//                 borderColor: COLORS.border,
//               }}
//             >
//               <SkeletonLoader width={150} height={20} borderRadius={4} style={{ marginBottom: 20 }} />
//               <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
//                 {[1, 2, 3].map((item) => (
//                   <View key={item} style={{ alignItems: 'center' }}>
//                     <SkeletonLoader width={56} height={56} borderRadius={28} style={{ marginBottom: 8 }} />
//                     <SkeletonLoader width={70} height={14} borderRadius={4} />
//                   </View>
//                 ))}
//               </View>
//             </View>

//             {/* Milestones Skeleton */}
//             <View style={{ paddingHorizontal: 16 }}>
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                 <SkeletonLoader width={120} height={24} borderRadius={4} />
//                 <SkeletonLoader width={70} height={20} borderRadius={4} />
//               </View>
//               {[1, 2, 3].map((item) => (
//                 <MilestoneCardSkeleton key={item} />
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // Empty State
//   console.log("Project Status:", project.status);
//   if (project.status != "Ongoing" && project.status != "completed") {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <Header title="Project Overview" showBackButton />
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
//           <View
//             style={{
//               width: 120,
//               height: 120,
//               borderRadius: 60,
//               backgroundColor: COLORS.primaryBg,
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginBottom: 24,
//             }}
//           >
//             <Ionicons name="file-tray-outline" size={56} color={COLORS.primary} />
//           </View>
//           <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 12, textAlign: 'center' }}>
//             Project is Under Approval
//           </Text>
//           <Text style={{ fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
//             Please wait until the project is approved to view the overview and manage milestones.
//           </Text>

//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Tab Content for non-overview tabs
//   const renderTabContent = () => {
//     if (activeTab !== 'Overview') {
//       switch (activeTab) {
//         case 'Issues':
//           return (
//             <View style={{ padding: 16 }}>
//               <View
//                 style={{
//                   backgroundColor: `${COLORS.warning}15`,
//                   padding: 16,
//                   borderRadius: 12,
//                   marginBottom: 16,
//                   borderLeftWidth: 4,
//                   borderLeftColor: COLORS.warning,
//                 }}
//               >
//                 <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: '500' }}>
//                   High-priority risks requiring immediate attention. Tap to view details.
//                 </Text>
//               </View>

//               {currentRisks.map((risk) => (
//                 <TouchableOpacity
//                   key={risk._id}
//                   onPress={() => navigation.navigate('RiskDetail', { risk: risk, isClientView: true })}
//                   style={{
//                     backgroundColor: COLORS.surface,
//                     borderRadius: 16,
//                     padding: 16,
//                     marginBottom: 12,
//                     borderLeftWidth: 4,
//                     borderLeftColor: (risk.score || 0) >= 9 ? COLORS.danger : COLORS.warning,
//                     borderWidth: 1,
//                     borderColor: COLORS.border,
//                   }}
//                 >
//                   <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 }}>
//                     {risk.title}
//                   </Text>
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
//                       Score: {risk.score} • {risk.severity}
//                     </Text>
//                     <View
//                       style={{
//                         backgroundColor: COLORS.primaryBg,
//                         paddingHorizontal: 10,
//                         paddingVertical: 4,
//                         borderRadius: 12,
//                       }}
//                     >
//                       <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: '600' }}>{risk.status}</Text>
//                     </View>
//                   </View>
//                   <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>{risk.date}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           );

//         case 'BOQ':
//           return <BOQClientScreen />;
//         case 'Survey':
//           return <SurveyScreen  project={project}/>;

//         case 'ProjectTimeline':
//           return <ProjectTimeline />;
//         case 'BudgetTracker':
//           return <BudgetTracker />;
//         case 'QualityChecks':
//           return <QualityChecks />;
//         case 'ChangeRequests':
//           return <ChangeRequests />;
//         case 'MaterialStatus':
//           return <MaterialStatus />;
//         case 'Transaction':
//           return <Transaction project={project} />;
//         case 'Plans':
//           return <FilesScreen project={project} />;
//         case 'Snags':
//           return <SnagListScreen projectId={project._id} showHeader={false} isClient={true} />;
//         case 'Progress':
//           return <WorkProgressListScreen projectId={project._id} isClient={true} showHeader={false} />;
//         case 'Handover':
//           const isAccepted = project.handover?.handoverAccepted;
//           const isRequested = project.handover?.handoverRequested;

//           return (
//             <View style={{ padding: 16 }}>
//               <View
//                 style={{
//                   backgroundColor: COLORS.surface,
//                   borderRadius: 16,
//                   padding: 24,
//                   alignItems: 'center',
//                   borderWidth: 1,
//                   borderColor: COLORS.border,
//                 }}
//               >
//                 <View
//                   style={{
//                     width: 64,
//                     height: 64,
//                     borderRadius: 32,
//                     backgroundColor: isAccepted ? '#DBEAFE' : (isRequested ? '#DCFCE7' : '#F1F5F9'), // Blue-100, Green-100 or Slate-100
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     marginBottom: 16,
//                   }}
//                 >
//                   <Ionicons
//                     name={isAccepted ? "document-text" : (isRequested ? "checkmark-circle" : "time-outline")}
//                     size={32}
//                     color={isAccepted ? "#2563EB" : (isRequested ? "#16A34A" : "#64748B")}
//                   />
//                 </View>

//                 <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>
//                   {isAccepted ? "Handover Accepted" : (isRequested ? "Handover Requested" : "No Handover Request")}
//                 </Text>

//                 <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
//                   {isAccepted
//                     ? "Handover successfully accepted. Waiting for the final documents."
//                     : (isRequested
//                       ? "The admin has initiated the handover process. Please review any pending actions."
//                       : "The handover process has not been initiated yet. Checking back later."
//                     )
//                   }
//                 </Text>

//                 {isRequested && !isAccepted && (
//                   <View style={{ width: '100%', gap: 12 }}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         Alert.alert('Confirm Approval', 'Are you sure you want to approve this handover request?', [
//                           { text: 'Cancel', style: 'cancel' },
//                           {
//                             text: 'Approve',
//                             onPress: async () => {
//                               try {
//                                 const token = await AsyncStorage.getItem('userToken');
//                                 const res = await fetch(`${process.env.BASE_API_URL}/api/projects/${project._id}/handover/approve`, {
//                                   method: 'POST',
//                                   headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//                                 });
//                                 const data = await res.json();
//                                 if (data.success) {
//                                   Alert.alert('Success', 'Handover approved successfully');
//                                 } else {
//                                   Alert.alert('Error', data.message || 'Failed to approve');
//                                 }
//                               } catch (e) {
//                                 Alert.alert('Error', 'Network request failed');
//                               }
//                             }
//                           }
//                         ]);
//                       }}
//                       style={{
//                         backgroundColor: COLORS.success,
//                         paddingVertical: 14,
//                         borderRadius: 12,
//                         alignItems: 'center',
//                         flexDirection: 'row',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
//                       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Approve Handover</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       onPress={() => {
//                         Alert.alert('Confirm Rejection', 'Are you sure you want to reject this handover request?', [
//                           { text: 'Cancel', style: 'cancel' },
//                           {
//                             text: 'Reject',
//                             style: 'destructive',
//                             onPress: async () => {
//                               try {
//                                 const token = await AsyncStorage.getItem('userToken');
//                                 const res = await fetch(`${process.env.BASE_API_URL}/api/projects/${project._id}/handover/reject`, {
//                                   method: 'POST',
//                                   headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//                                 });
//                                 const data = await res.json();
//                                 if (data.success) {
//                                   Alert.alert('Rejected', 'Handover request rejected');
//                                 } else {
//                                   Alert.alert('Error', data.message || 'Failed to reject');
//                                 }
//                               } catch (e) {
//                                 Alert.alert('Error', 'Network request failed');
//                               }
//                             }
//                           }
//                         ]);
//                       }}
//                       style={{
//                         backgroundColor: 'transparent',
//                         borderWidth: 1,
//                         borderColor: COLORS.danger,
//                         paddingVertical: 14,
//                         borderRadius: 12,
//                         alignItems: 'center',
//                         flexDirection: 'row',
//                         justifyContent: 'center',
//                         marginTop: 12
//                       }}
//                     >
//                       <Ionicons name="close-circle-outline" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
//                       <Text style={{ color: COLORS.danger, fontWeight: 'bold', fontSize: 16 }}>Reject Request</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>

//               {/* Handover Documents List */}
//               {project.handoverDocuments && project.handoverDocuments.length > 0 && (
//                 <View style={{ marginTop: 20 }}>
//                   <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 }}>
//                     Handover Documents
//                   </Text>
//                   {project.handoverDocuments.map((docUrl, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       onPress={() => Linking.openURL(docUrl).catch(err => Alert.alert("Error", "Could not open document"))}
//                       style={{
//                         backgroundColor: COLORS.surface,
//                         borderRadius: 12,
//                         padding: 16,
//                         marginBottom: 10,
//                         borderWidth: 1,
//                         borderColor: COLORS.border,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <View
//                         style={{
//                           width: 40,
//                           height: 40,
//                           borderRadius: 20,
//                           backgroundColor: '#EFF6FF',
//                           justifyContent: 'center',
//                           alignItems: 'center',
//                           marginRight: 12
//                         }}
//                       >
//                         <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
//                       </View>

//                       <View style={{ flex: 1 }}>
//                         <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }} numberOfLines={1}>
//                           Document {index + 1}
//                         </Text>
//                         <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
//                           Tap to view
//                         </Text>
//                       </View>

//                       <Ionicons name="open-outline" size={20} color={COLORS.textLight} />
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>
//           );
//         default:
//           return null;
//       }
//     }
//     return null;
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//       <Header title="Project Overview" showBackButton />

//       {/* Tab Navigation */}
//       <View style={{ backgroundColor: COLORS.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
//         <FlatList
//           data={tabs}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 12 }}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => setActiveTab(item.id)}
//               style={{
//                 paddingHorizontal: 18,
//                 paddingVertical: 10,
//                 marginHorizontal: 4,
//                 borderRadius: 24,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 backgroundColor: activeTab === item.id ? COLORS.primary : COLORS.surfaceAlt,
//               }}
//             >
//               <Ionicons
//                 name={item.icon}
//                 size={18}
//                 color={activeTab === item.id ? COLORS.surface : COLORS.textSecondary}
//                 style={{ marginRight: 6 }}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: '600',
//                   color: activeTab === item.id ? COLORS.surface : COLORS.textSecondary,
//                 }}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item) => item.id}
//         />
//       </View>

//       {/* Main Content */}
//       {['Snags', 'Progress', 'Handover'].includes(activeTab) ? (
//         <View style={{ flex: 1, paddingTop: 12 }}>{renderTabContent()}</View>
//       ) : (
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {activeTab === 'Overview' ? (
//             <Animated.View style={{ opacity: fadeAnim, paddingTop: 20, paddingBottom: 32 }}>
//               {/* Progress Dashboard */}
//               {renderProgressDashboard()}

//               {/* Progress Cards */}
//               {renderProgressCards()}

//               {/* Progress Stats */}
//               <ProgressStatsCard />

//               {/* Milestones List */}
//               <View style={{ paddingHorizontal: 16 }}>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                   <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>Recent Tasks</Text>
//                   <TouchableOpacity onPress={() => navigation.navigate('AllMilestones', { project, projectId: project._id || project.id })}>
//                     <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>View All</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {milestones.slice(0, 5).map((milestone, index) => (
//                   <MilestoneCard key={milestone._id || index} milestone={milestone} index={index} />
//                 ))}
//               </View>
//             </Animated.View>
//           ) : (
//             // Other Tabs Content
//             <View style={{ paddingTop: 12 }}>{renderTabContent()}</View>
//           )}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Overview;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Animated,
  Linking,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Svg, { Circle, G, Text as SvgText, Rect, Line, Path, Stop, Defs, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import Header from '@/components/Header';
import SurveyScreen from '../HomeOwner/survey';
import Transaction from '../HomeOwner/Transaction';
// Sub Screens
import BOQClientScreen from '../HomeOwner/BOQClientScreen';
import FilesScreen from '../Document-Management/FileScreen';
import SnagListScreen from '../Snags/SnagListScreen';
import WorkProgressListScreen from '../WorkProgress/WorkProgressListScreen';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Modern Color Palette
const COLORS = {
  primary: '#0066FF',
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  primaryBg: '#F0F7FF',
  secondary: '#00B8D4',
  accent: '#0091EA',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

// Professional Loading Skeletons
const SkeletonLoader = ({ width, height, borderRadius = 12, style, variant = 'default' }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.surfaceAlt, COLORS.borderLight],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        variant === 'circle' && { borderRadius: width / 2 },
        variant === 'text' && { height: 16, borderRadius: 4 },
        style,
      ]}
    />
  );
};

// Modern Circular Progress Component
const ModernCircularProgress = ({ size = 200, progress = 0, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ position: 'relative', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background Circle with subtle gradient */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.borderLight}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.5}
        />

        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        <Defs>
          <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0066FF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#00B8D4" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
      </Svg>

      {/* Center Content */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 40,
          fontWeight: '700',
          color: COLORS.text,
          letterSpacing: -1,
        }}>
          {progress}%
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          marginTop: 4,
          fontWeight: '500',
        }}>
          Overall Progress
        </Text>
      </View>
    </View>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label, color, isLoading }) => {
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}>
        <SkeletonLoader width={40} height={40} borderRadius={12} style={{ marginBottom: 12 }} />
        <SkeletonLoader width="80%" height={24} borderRadius={6} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="60%" height={16} borderRadius={4} />
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: COLORS.borderLight,
    }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: `${color}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={{
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4,
        letterSpacing: -0.5,
      }}>
        {value}
      </Text>
      <Text style={{
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '500',
      }}>
        {label}
      </Text>
    </View>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress, color = COLORS.primary, height = 6, showLabel = false }) => {
  return (
    <View>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>Progress</Text>
          <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>{progress}%</Text>
        </View>
      )}
      <View style={{
        height,
        backgroundColor: COLORS.borderLight,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
        }} />
      </View>
    </View>
  );
};

// Milestone Card Component
const MilestoneCard = ({ milestone, index }) => {
  const progress = milestone.progress || 0;
  const statusConfig = {
    completed: {
      color: COLORS.success,
      icon: 'checkmark-circle',
      bg: COLORS.successLight,
    },
    in_progress: {
      color: COLORS.primary,
      icon: 'time',
      bg: '#EFF6FF',
    },
    not_started: {
      color: COLORS.textLight,
      icon: 'ellipse-outline',
      bg: COLORS.surfaceAlt,
    },
  }[milestone.status] || { color: COLORS.textLight, icon: 'ellipse-outline', bg: COLORS.surfaceAlt };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MilestoneDetail', { milestone, projectId: project._id || project.id })}
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{
              backgroundColor: statusConfig.bg,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
            }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: statusConfig.color }}>
                {milestone.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <Ionicons name={statusConfig.icon} size={16} color={statusConfig.color} />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, lineHeight: 22 }}>
            {milestone.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </View>

      <ProgressBar progress={progress} color={statusConfig.color} height={6} showLabel />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
            {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No deadline'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
            {milestone.assignedTo?.name || milestone.assignedTo || 'Unassigned'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Loading State Components
const ProgressDashboardSkeleton = () => (
  <View style={{
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  }}>
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <SkeletonLoader width={200} height={200} variant="circle" />
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={{ alignItems: 'center', flex: 1 }}>
          <SkeletonLoader width={60} height={60} borderRadius={30} style={{ marginBottom: 12 }} />
          <SkeletonLoader width={80} height={16} borderRadius={4} />
        </View>
      ))}
    </View>
  </View>
);

const StatsGridSkeleton = () => (
  <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
    {[1, 2, 3].map((item) => (
      <StatCard key={item} isLoading={true} />
    ))}
  </View>
);

const MilestoneListSkeleton = () => (
  <View style={{ paddingHorizontal: 20 }}>
    {[1, 2, 3].map((item) => (
      <View key={item} style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
      }}>
        <SkeletonLoader width="70%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
        <SkeletonLoader width="100%" height={6} borderRadius={3} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <SkeletonLoader width={100} height={16} borderRadius={4} />
          <SkeletonLoader width={80} height={16} borderRadius={4} />
        </View>
      </View>
    ))}
  </View>
);

const Overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { project, initialTab } = route.params || {};

  const [activeTab, setActiveTab] = useState('Overview');
  const [milestones, setMilestones] = useState([]);
  const [currentRisks, setCurrentRisks] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const fetchMilestones = async () => {
    if (!project?._id) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await fetch(
        `${process.env.BASE_API_URL}/api/milestones/fetch-by-project/${project._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const milestonesData = Array.isArray(result.data) ? result.data : [];
        setMilestones(milestonesData);

        if (milestonesData.length > 0) {
          const totalProgress = milestonesData.reduce((sum, milestone) => sum + (milestone.progress || 0), 0);
          const avgProgress = totalProgress / milestonesData.length;
          setOverallProgress(Math.round(avgProgress));
        }
      }
    } catch (error) {
      console.error('Milestone Fetch Error:', error);
    }
  };

  const fetchRisks = async () => {
    const pid = project?._id || project?.id;
    if (!pid) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.BASE_API_URL}/api/risks/project/${pid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        setCurrentRisks(Array.isArray(json.data) ? json.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch risks", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMilestones(), fetchRisks()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (isFocused) {
      loadData();

      // Animation sequence
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, project]);

  // Modern tabs with indicator
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: 'grid-outline' },
    { id: 'Progress', label: 'Progress', icon: 'trending-up-outline' },
    { id: 'BOQ', label: 'BOQ', icon: 'document-text-outline' },
    { id: 'Plans', label: 'Plans', icon: 'folder-outline' },
    // { id: 'MaterialStatus', label: 'Materials', icon: 'cube-outline' },
    { id: 'Transaction', label: 'Payments', icon: 'card-outline' },
    { id: 'Survey', label: 'Survey', icon: 'clipboard-outline' },
    { id: 'Snags', label: 'Snags', icon: 'alert-circle-outline' },
    { id: 'Issues', label: 'Issues', icon: 'warning-outline' },
    { id: 'Handover', label: 'Handover', icon: 'key-outline' },
  ];

  const stats = [
    {
      title: 'Completed Tasks',
      value: `${milestones.filter(m => m.status === 'completed').length}`,
      icon: 'checkmark-done-circle',
      color: COLORS.success,
    },
    {
      title: 'In Progress',
      value: `${milestones.filter(m => m.status === 'in_progress').length}`,
      icon: 'time',
      color: COLORS.primary,
    },
    {
      title: 'Total Tasks',
      value: `${milestones.length}`,
      icon: 'list-circle',
      color: COLORS.secondary,
    },
  ];

  // Enhanced Tab Content
  const renderTabContent = () => {
    if (activeTab !== 'Overview') {
      switch (activeTab) {
        case 'Issues':
          return (
            <View style={{ padding: 20 }}>
              {Array.isArray(currentRisks) && currentRisks.map((risk, index) => (
                <Animated.View
                  key={risk._id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('RiskDetail', { risk: risk, isClientView: true })}
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: risk.score >= 9 ? COLORS.danger : COLORS.warning,
                      borderWidth: 1,
                      borderColor: COLORS.borderLight,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1 }}>
                        {risk.title}
                      </Text>
                      <View style={{
                        backgroundColor: risk.score >= 9 ? COLORS.dangerLight : COLORS.warningLight,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}>
                        <Text style={{
                          fontSize: 12,
                          color: risk.score >= 9 ? COLORS.danger : COLORS.warning,
                          fontWeight: '600',
                        }}>
                          {risk.severity}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Ionicons name="pulse-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
                        Risk Score: {risk.score}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                        {new Date(risk.date).toLocaleDateString()}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: risk.status === 'open' ? COLORS.success : COLORS.warning,
                          marginRight: 6,
                        }} />
                        <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
                          {risk.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          );

        case 'BOQ':
          return <BOQClientScreen />;
        case 'Survey':
          return <SurveyScreen project={project} />;
        case 'Transaction':
          return <Transaction project={project} />;
        case 'Plans':
          return <FilesScreen project={project} />;
        case 'Snags':
          return <SnagListScreen projectId={project._id} showHeader={false} isClient={true} />;
        case 'Progress':
          return <WorkProgressListScreen projectId={project._id} isClient={true} showHeader={false} />;
        case 'Handover':
          const isAccepted = project.handover?.handoverAccepted;
          const isRequested = project.handover?.handoverRequested;

          return (
            <View style={{ padding: 20 }}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 20,
                    padding: 32,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: COLORS.borderLight,
                    marginBottom: 20,
                  }}
                >
                  <LinearGradient
                    colors={isAccepted ? ['#10B981', '#059669'] : (isRequested ? ['#3B82F6', '#1D4ED8'] : ['#6B7280', '#4B5563'])}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Ionicons
                      name={isAccepted ? "checkmark-circle" : (isRequested ? "document-text" : "time-outline")}
                      size={36}
                      color="white"
                    />
                  </LinearGradient>

                  <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>
                    {isAccepted ? "Handover Accepted" : (isRequested ? "Handover Requested" : "Awaiting Handover")}
                  </Text>

                  <Text style={{ fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
                    {isAccepted
                      ? "Project handover has been successfully completed. All final documents are ready for download."
                      : (isRequested
                        ? "The contractor has initiated the handover process. Please review and approve when ready."
                        : "The handover process will begin once all project milestones are completed."
                      )
                    }
                  </Text>

                  {isRequested && !isAccepted && (
                    <View style={{ width: '100%', gap: 12 }}>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Approve Handover', 'Are you satisfied with the completed work and ready to accept handover?', [
                            { text: 'Review Later', style: 'cancel' },
                            {
                              text: 'Approve Handover',
                              onPress: async () => {
                                try {
                                  const token = await AsyncStorage.getItem('userToken');
                                  const res = await fetch(`${process.env.BASE_API_URL}/api/projects/${project._id}/handover/approve`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    Alert.alert('Success', 'Handover approved successfully');
                                  } else {
                                    Alert.alert('Error', data.message || 'Failed to approve');
                                  }
                                } catch (e) {
                                  Alert.alert('Error', 'Network request failed');
                                }
                              }
                            }
                          ]);
                        }}
                        style={{
                          backgroundColor: COLORS.success,
                          paddingVertical: 16,
                          borderRadius: 12,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={22} color="white" style={{ marginRight: 10 }} />
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Approve Handover</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Request Changes', 'Would you like to request changes before accepting handover?', [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Request Changes',
                              onPress: async () => {
                                try {
                                  const token = await AsyncStorage.getItem('userToken');
                                  const res = await fetch(`${process.env.BASE_API_URL}/api/projects/${project._id}/handover/reject`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    Alert.alert('Request Sent', 'Handover changes requested');
                                  } else {
                                    Alert.alert('Error', data.message || 'Failed to request changes');
                                  }
                                } catch (e) {
                                  Alert.alert('Error', 'Network request failed');
                                }
                              }
                            }
                          ]);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          borderWidth: 1,
                          borderColor: COLORS.border,
                          paddingVertical: 16,
                          borderRadius: 12,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: COLORS.textSecondary, fontWeight: '500', fontSize: 15 }}>Request Changes</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {project.handoverDocuments && project.handoverDocuments.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: 16 }}>
                      Handover Documents
                    </Text>
                    {Array.isArray(project.handoverDocuments) && project.handoverDocuments.map((docUrl, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => Linking.openURL(docUrl).catch(err => Alert.alert("Error", "Could not open document"))}
                        style={{
                          backgroundColor: COLORS.surface,
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 10,
                          borderWidth: 1,
                          borderColor: COLORS.borderLight,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: COLORS.primaryBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12
                          }}
                        >
                          <Ionicons name="document-text" size={22} color={COLORS.primary} />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontWeight: '500', color: COLORS.text }}>
                            Handover Document {index + 1}
                          </Text>
                          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                            Tap to view or download
                          </Text>
                        </View>

                        <Ionicons name="download-outline" size={20} color={COLORS.textLight} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Animated.View>
            </View>
          );
        default:
          return null;
      }
    }
    return null;
  };

  // Loading State
  if (loading && activeTab === 'Overview') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Header title="Project Overview" showBackButton />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ paddingTop: 20, paddingBottom: 40 }}>
            <ProgressDashboardSkeleton />
            <StatsGridSkeleton />

            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <SkeletonLoader width={120} height={24} borderRadius={6} style={{ marginBottom: 20 }} />
              <MilestoneListSkeleton />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Empty State for non-approved projects
  if (project.status !== "Ongoing" && project.status !== "completed") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Header title="Project Overview" showBackButton />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <LinearGradient
            colors={[COLORS.primaryBg, '#E6F0FF']}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <Ionicons name="time-outline" size={60} color={COLORS.primary} />
          </LinearGradient>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 12, textAlign: 'center' }}>
            Project Pending Approval
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>
            Your project is currently under review. You'll be able to access all features once it's approved by the administrator.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Back to Projects</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  console.log('DEBUG ARRAYS:', {
    milestonesIsArray: Array.isArray(milestones),
    risksIsArray: Array.isArray(currentRisks),
    handoverDocsIsArray: Array.isArray(project?.handoverDocuments),
    statsIsArray: Array.isArray(stats)
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Project Overview" showBackButton />

      {/* Modern Tab Navigation */}
      <View style={{ backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight }}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.id)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                marginRight: 8,
                borderRadius: 20,
                backgroundColor: activeTab === item.id ? COLORS.primary : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={activeTab === item.id ? 'white' : COLORS.textSecondary}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: activeTab === item.id ? 'white' : COLORS.textSecondary,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Main Content */}
      {['Snags', 'Progress', 'Handover', 'Issues', 'Survey', 'Transaction', 'Plans', 'BOQ'].includes(activeTab) ? (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {renderTabContent()}
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === 'Overview' ? (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                paddingTop: 20,
                paddingBottom: 40,
              }}
            >
              {/* Progress Dashboard */}
              <View style={{
                backgroundColor: COLORS.surface,
                borderRadius: 20,
                padding: 24,
                marginHorizontal: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: COLORS.borderLight,
              }}>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                  <ModernCircularProgress size={200} progress={overallProgress} />
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 24,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.borderLight,
                }}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.text, letterSpacing: -1 }}>
                      {milestones.length}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>
                      Total Tasks
                    </Text>
                  </View>

                  <View style={{ width: 1, backgroundColor: COLORS.borderLight, marginHorizontal: 20 }} />

                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.success, letterSpacing: -1 }}>
                      {milestones.filter(m => m.status === 'completed').length}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>
                      Completed
                    </Text>
                  </View>

                  <View style={{ width: 1, backgroundColor: COLORS.borderLight, marginHorizontal: 20 }} />

                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.primary, letterSpacing: -1 }}>
                      {milestones.filter(m => m.status === 'in_progress').length}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>
                      Active
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Grid */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                {Array.isArray(stats) && stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.title}
                    color={stat.color}
                    isLoading={loading}
                  />
                ))}
              </View>

              {/* Recent Tasks */}
              <View style={{ paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>Recent Tasks</Text>
                  {milestones.length > 5 && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AllMilestones', { project, projectId: project._id || project.id })}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600', marginRight: 4 }}>
                        View All
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  )}
                </View>

                {Array.isArray(milestones) && milestones.slice(0, 5).map((milestone, index) => (
                  <MilestoneCard key={milestone._id || index} milestone={milestone} index={index} />
                ))}

                {milestones.length === 0 && (
                  <View style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 16,
                    padding: 40,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: COLORS.borderLight,
                  }}>
                    <Ionicons name="checkmark-done-circle-outline" size={48} color={COLORS.textLight} style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 8, textAlign: 'center' }}>
                      No Tasks Yet
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' }}>
                      Tasks will appear here once they are added to the project
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ) : (
            <View style={{ paddingTop: 20 }}>
              {renderTabContent()}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Overview;