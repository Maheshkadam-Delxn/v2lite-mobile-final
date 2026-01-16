// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   FlatList,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   Dimensions,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Svg, { Circle, G, Text as SvgText, Rect, Line } from 'react-native-svg';

// // import Header from '@/components/Header';


// // // Sub Screens
// // import ProjectTimeline from '../HomeOwner/ProjectTimeline';
// // import BudgetTracker from '../HomeOwner/BudgetTracker';
// // import QualityChecks from '../HomeOwner/QualityChecks';
// // import ChangeRequests from '../HomeOwner/ChangeRequests';
// // import MaterialStatus from '../HomeOwner/MaterialStatus';
// // import BOQClientScreen from '../HomeOwner/BOQClientScreen';

// // const { width: screenWidth } = Dimensions.get('window');
// // import FilesScreen from '../Document-Management/FileScreen';

// // const Overview = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const isFocused = useIsFocused();
// //   const { project } = route.params || {};

// //   const [activeTab, setActiveTab] = useState('Overview');
// //   const [milestones, setMilestones] = useState([]);
// //   const [currentRisks, setCurrentRisks] = useState([]);

// //   /* ——— Fetch Data ——— */
// //   const fetchRisks = async () => {
// //     const pid = project?._id || project?.id;
// //     if (!pid) return;

// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       const response = await fetch(`${process.env.BASE_API_URL}/api/risks/project/${pid}`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });
// //       const json = await response.json();
// //       if (json.success) {
// //         setCurrentRisks(json.data);
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch risks", error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (isFocused) {
// //       fetchRisks();
// //     }
// //   }, [isFocused, project]);

// //   const tabs = [
// //     { id: 'Overview', label: 'Overview' },
// //     { id: 'Issues', label: 'Critical Issues' }, // New Tab
// //     { id: 'BOQ', label: 'BOQ' },
// //     { id: 'Plans', label: 'Plans' },
// //     { id: 'ProjectTimeline', label: 'Project Timeline' },
// //     { id: 'BudgetTracker', label: 'Budget Track' },
// //     { id: 'QualityChecks', label: 'Quality Checks' },
// //     { id: 'ChangeRequests', label: 'Change Request' },
// //     { id: 'MaterialStatus', label: 'Material Status' },
// //   ];

// //   /* ------------------ MOCK DATA REMOVED (Now using imported mockRisks) ------------------ */

// //   // Enhanced static data with estimated vs actual budget comparison
// //   const [workProgressData] = useState({
// //     completed: 68,
// //     remaining: 32,
// //     timeline: [
// //       { month: 'Jan', estimated: 100, actual: 120 },
// //       { month: 'Feb', estimated: 80, actual: 85 },
// //       { month: 'Mar', estimated: 150, actual: 130 },
// //       { month: 'Apr', estimated: 120, actual: 140 },
// //       { month: 'May', estimated: 90, actual: 95 },
// //       { month: 'Jun', estimated: 110, actual: 105 },
// //     ],
// //     details: [
// //       { phase: 'Foundation', completed: 100, estimatedDays: 30, actualDays: 28 },
// //       { phase: 'Structure', completed: 95, estimatedDays: 45, actualDays: 42 },
// //       { phase: 'Plumbing', completed: 85, estimatedDays: 25, actualDays: 28 },
// //       { phase: 'Electrical', completed: 75, estimatedDays: 20, actualDays: 22 },
// //       { phase: 'Finishing', completed: 35, estimatedDays: 60, actualDays: 45 },
// //     ],
// //   });

// //   const [financeData] = useState({
// //     totalBudget: 750000,
// //     utilized: 450000,
// //     remaining: 300000,
// //     estimatedVsActual: [
// //       { category: 'Materials', estimated: 350000, actual: 250000 },
// //       { category: 'Labor', estimated: 250000, actual: 120000 },
// //       { category: 'Equipment', estimated: 80000, actual: 50000 },
// //       { category: 'Misc', estimated: 70000, actual: 30000 },
// //     ],
// //     monthlySpending: [
// //       { month: 'Jan', spent: 85000 },
// //       { month: 'Feb', spent: 95000 },
// //       { month: 'Mar', spent: 120000 },
// //       { month: 'Apr', spent: 80000 },
// //       { month: 'May', spent: 60000 },
// //       { month: 'Jun', spent: 50000 },
// //     ],
// //   });

// //   const progressData = [
// //     {
// //       title: 'Overall Progress',
// //       value: '68%',
// //       textColor: 'text-yellow-600',
// //       borderColor: 'border-yellow-200',
// //       leftBorder: 'border-l-4 border-l-yellow-500',
// //     },
// //     {
// //       title: 'Budget Utilized',
// //       value: 'QAR 450K',
// //       textColor: 'text-cyan-600',
// //       borderColor: 'border-cyan-200',
// //       leftBorder: 'border-l-4 border-l-cyan-500',
// //     },
// //     {
// //       title: 'Days Elapsed',
// //       value: '156',
// //       textColor: 'text-red-500',
// //       borderColor: 'border-red-200',
// //       leftBorder: 'border-l-4 border-l-red-500',
// //     },
// //     {
// //       title: 'Active Workers',
// //       value: '12',
// //       textColor: 'text-green-500',
// //       borderColor: 'border-green-200',
// //       leftBorder: 'border-l-4 border-l-green-500',
// //     },
// //   ];

// //   /* ------------------ ENHANCED CIRCULAR PROGRESS WITH SVG ------------------ */
// //   const EnhancedCircularProgress = ({
// //     size = 120,
// //     progress = 0,
// //     color = '#3B82F6',
// //     bgColor = '#F3F4F6',
// //     thickness = 8,
// //     showInnerCircle = false,
// //     innerProgress = 0,
// //     innerColor = '#10B981'
// //   }) => {
// //     const radius = (size - thickness) / 2;
// //     const circumference = 2 * Math.PI * radius;
// //     const strokeDashoffset = circumference - (progress / 100) * circumference;

// //     return (
// //       <View className="relative items-center justify-center">
// //         <Svg width={size} height={size}>
// //           {/* Background Circle */}
// //           <Circle
// //             cx={size / 2}
// //             cy={size / 2}
// //             r={radius}
// //             stroke={bgColor}
// //             strokeWidth={thickness}
// //             fill="transparent"
// //           />

// //           {/* Outer Progress Ring */}
// //           <Circle
// //             cx={size / 2}
// //             cy={size / 2}
// //             r={radius}
// //             stroke={color}
// //             strokeWidth={thickness}
// //             strokeDasharray={circumference}
// //             strokeDashoffset={strokeDashoffset}
// //             strokeLinecap="round"
// //             fill="transparent"
// //             transform={`rotate(-90, ${size / 2}, ${size / 2})`}
// //           />

// //           {/* Inner Progress Ring (if enabled) */}
// //           {showInnerCircle && (
// //             <Circle
// //               cx={size / 2}
// //               cy={size / 2}
// //               r={radius - thickness - 4}
// //               stroke={innerColor}
// //               strokeWidth={thickness - 2}
// //               strokeDasharray={circumference}
// //               strokeDashoffset={circumference - (innerProgress / 100) * circumference}
// //               strokeLinecap="round"
// //               fill="transparent"
// //               transform={`rotate(-90, ${size / 2}, ${size / 2})`}
// //             />
// //           )}

// //           {/* Center Text */}
// //           <G>
// //             <SvgText
// //               x={size / 2}
// //               y={showInnerCircle ? size / 2 - 8 : size / 2}
// //               textAnchor="middle"
// //               fill="#1F2937"
// //               fontSize="20"
// //               fontWeight="bold"
// //             >
// //               {progress}%
// //             </SvgText>
// //             <SvgText
// //               x={size / 2}
// //               y={showInnerCircle ? size / 2 + 10 : size / 2 + 20}
// //               textAnchor="middle"
// //               fill="#6B7280"
// //               fontSize="10"
// //             >
// //               Complete
// //             </SvgText>
// //           </G>
// //         </Svg>
// //       </View>
// //     );
// //   };

// //   /* ------------------ HISTOGRAM COMPONENT ------------------ */
// //   const BudgetHistogram = ({ data, width = screenWidth - 64, height = 200 }) => {
// //     const maxValue = Math.max(...data.flatMap(d => [d.estimated, d.actual]));
// //     const barWidth = (width - 60) / data.length;

// //     return (
// //       <View className="mt-4">
// //         <Text className="text-sm font-semibold text-gray-700 mb-3">
// //           Estimated vs Actual Budget
// //         </Text>

// //         <View style={{ height, width }}>
// //           <Svg width={width} height={height}>
// //             {/* Grid Lines */}
// //             {[0, 25, 50, 75, 100].map((percent, index) => (
// //               <React.Fragment key={`grid-${index}`}>
// //                 <Rect
// //                   x={0}
// //                   y={(height - 40) * (percent / 100)}
// //                   width={width}
// //                   height={1}
// //                   fill="#E5E7EB"
// //                   opacity={0.5}
// //                 />
// //                 <SvgText
// //                   x={width - 25}
// //                   y={(height - 40) * (percent / 100) - 5}
// //                   fill="#6B7280"
// //                   fontSize="10"
// //                 >
// //                   {Math.round(maxValue * (percent / 100) / 1000)}K
// //                 </SvgText>
// //               </React.Fragment>
// //             ))}

// //             {/* Bars */}
// //             {data.map((item, index) => {
// //               const estimatedHeight = (item.estimated / maxValue) * (height - 60);
// //               const actualHeight = (item.actual / maxValue) * (height - 60);
// //               const x = 30 + index * barWidth;

// //               return (
// //                 <G key={`bar-${index}`}>
// //                   {/* Estimated Budget Bar */}
// //                   <Rect
// //                     x={x}
// //                     y={height - 40 - estimatedHeight}
// //                     width={barWidth * 0.4}
// //                     height={estimatedHeight}
// //                     fill="#3B82F6"
// //                     opacity={0.3}
// //                     rx={2}
// //                   />

// //                   {/* Actual Budget Bar */}
// //                   <Rect
// //                     x={x + barWidth * 0.4 + 2}
// //                     y={height - 40 - actualHeight}
// //                     width={barWidth * 0.4}
// //                     height={actualHeight}
// //                     fill={item.actual > item.estimated ? '#EF4444' : '#10B981'}
// //                     rx={2}
// //                   />

// //                   {/* Category Label */}
// //                   <SvgText
// //                     x={x + barWidth * 0.4}
// //                     y={height - 20}
// //                     textAnchor="middle"
// //                     fill="#6B7280"
// //                     fontSize="10"
// //                   >
// //                     {item.category}
// //                   </SvgText>

// //                   {/* Value Labels */}
// //                   {item.actual > item.estimated ? (
// //                     <SvgText
// //                       x={x + barWidth * 0.6}
// //                       y={height - 45 - actualHeight}
// //                       textAnchor="middle"
// //                       fill="#EF4444"
// //                       fontSize="8"
// //                       fontWeight="bold"
// //                     >
// //                       +{Math.round((item.actual - item.estimated) / 1000)}K
// //                     </SvgText>
// //                   ) : (
// //                     <SvgText
// //                       x={x + barWidth * 0.6}
// //                       y={height - 45 - actualHeight}
// //                       textAnchor="middle"
// //                       fill="#10B981"
// //                       fontSize="8"
// //                       fontWeight="bold"
// //                     >
// //                       -{Math.round((item.estimated - item.actual) / 1000)}K
// //                     </SvgText>
// //                   )}
// //                 </G>
// //               );
// //             })}

// //             {/* Legend */}
// //             <G>
// //               <Rect x={30} y={10} width={10} height={10} fill="#3B82F6" opacity={0.3} rx={2} />
// //               <SvgText x={45} y={18} fill="#6B7280" fontSize="10">Estimated</SvgText>

// //               <Rect x={100} y={10} width={10} height={10} fill="#10B981" rx={2} />
// //               <SvgText x={115} y={18} fill="#6B7280" fontSize="10">Under Budget</SvgText>

// //               <Rect x={200} y={10} width={10} height={10} fill="#EF4444" rx={2} />
// //               <SvgText x={215} y={18} fill="#6B7280" fontSize="10">Over Budget</SvgText>
// //             </G>
// //           </Svg>
// //         </View>

// //         {/* Summary Stats */}
// //         <View className="flex-row justify-between mt-4">
// //           <View className="items-center">
// //             <Text className="text-xs text-gray-500">Total Estimated</Text>
// //             <Text className="text-sm font-bold text-blue-600">
// //               QAR {financeData.estimatedVsActual.reduce((sum, item) => sum + item.estimated, 0) / 1000}K
// //             </Text>
// //           </View>
// //           <View className="items-center">
// //             <Text className="text-xs text-gray-500">Total Actual</Text>
// //             <Text className="text-sm font-bold text-green-600">
// //               QAR {financeData.estimatedVsActual.reduce((sum, item) => sum + item.actual, 0) / 1000}K
// //             </Text>
// //           </View>
// //           <View className="items-center">
// //             <Text className="text-xs text-gray-500">Savings</Text>
// //             <Text className="text-sm font-bold text-purple-600">
// //               QAR {(financeData.estimatedVsActual.reduce((sum, item) => sum + item.estimated, 0) -
// //                 financeData.estimatedVsActual.reduce((sum, item) => sum + item.actual, 0)) / 1000}K
// //             </Text>
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   /* ------------------ TIMELINE CHART ------------------ */
// //   const TimelineChart = ({ data, width = screenWidth - 64, height = 150 }) => {
// //     const maxValue = Math.max(...data.flatMap(d => [d.estimated, d.actual]));

// //     return (
// //       <View className="mt-4">
// //         <Text className="text-sm font-semibold text-gray-700 mb-3">
// //           Monthly Progress Timeline
// //         </Text>

// //         <View style={{ height, width }}>
// //           <Svg width={width} height={height}>
// //             {/* Estimated Line */}
// //             {data.map((item, index) => {
// //               const x = 40 + (index * (width - 80) / (data.length - 1));
// //               const y = height - 30 - ((item.estimated / maxValue) * (height - 60));

// //               return (
// //                 <React.Fragment key={`estimated-${index}`}>
// //                   <Circle cx={x} cy={y} r={3} fill="#3B82F6" />
// //                   {index < data.length - 1 && (
// //                     <React.Fragment>
// //                       <Line
// //                         x1={x}
// //                         y1={y}
// //                         x2={40 + ((index + 1) * (width - 80) / (data.length - 1))}
// //                         y2={height - 30 - ((data[index + 1].estimated / maxValue) * (height - 60))}
// //                         stroke="#3B82F6"
// //                         strokeWidth={2}
// //                         strokeDasharray="4,4"
// //                         opacity={0.5}
// //                       />
// //                     </React.Fragment>
// //                   )}
// //                 </React.Fragment>
// //               );
// //             })}

// //             {/* Actual Line */}
// //             {data.map((item, index) => {
// //               const x = 40 + (index * (width - 80) / (data.length - 1));
// //               const y = height - 30 - ((item.actual / maxValue) * (height - 60));

// //               return (
// //                 <React.Fragment key={`actual-${index}`}>
// //                   <Circle cx={x} cy={y} r={4} fill={item.actual > item.estimated ? '#EF4444' : '#10B981'} />
// //                   {index < data.length - 1 && (
// //                     <Line
// //                       x1={x}
// //                       y1={y}
// //                       x2={40 + ((index + 1) * (width - 80) / (data.length - 1))}
// //                       y2={height - 30 - ((data[index + 1].actual / maxValue) * (height - 60))}
// //                       stroke={item.actual > item.estimated ? '#EF4444' : '#10B981'}
// //                       strokeWidth={2}
// //                     />
// //                   )}
// //                 </React.Fragment>
// //               );
// //             })}

// //             {/* Month Labels */}
// //             {data.map((item, index) => {
// //               const x = 40 + (index * (width - 80) / (data.length - 1));
// //               return (
// //                 <SvgText
// //                   key={`label-${index}`}
// //                   x={x}
// //                   y={height - 10}
// //                   textAnchor="middle"
// //                   fill="#6B7280"
// //                   fontSize="10"
// //                 >
// //                   {item.month}
// //                 </SvgText>
// //               );
// //             })}
// //           </Svg>
// //         </View>
// //       </View>
// //     );
// //   };

// //   /* ------------------ STATUS LABEL ------------------ */
// //   const getStatusLabel = (status) => {
// //     switch (status) {
// //       case 'completed':
// //         return 'Completed';
// //       case 'in_progress':
// //         return 'In Progress';
// //       case 'not_started':
// //         return 'Not Started';
// //       default:
// //         return 'Unknown';
// //     }
// //   };

// //   /* ------------------ FETCH MILESTONES ------------------ */
// //   const fetchMilestones = async () => {
// //     if (!project?._id) return;

// //     try {
// //       const token = await AsyncStorage.getItem('userToken');
// //       if (!token) return;

// //       const response = await fetch(
// //         `${process.env.BASE_API_URL}/api/milestones/fetch-by-project/${project._id}`,
// //         {
// //           method: 'GET',
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );

// //       const result = await response.json();

// //       if (response.ok && result.success) {
// //         setMilestones(result.data);
// //       } else {
// //         console.error('Milestone API Error:', result);
// //       }
// //     } catch (error) {
// //       console.error('Milestone Fetch Error:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMilestones();
// //   }, [project?._id]);

// //   /* ------------------ ENHANCED GRAPH COMPONENTS ------------------ */
// //   const renderWorkProgressGraph = () => (
// //     <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
// //       {/* Header */}
// //       <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
// //         <View className="flex-row items-center">
// //           <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
// //             <Ionicons name="bar-chart-outline" size={18} color="#2563EB" />
// //           </View>
// //           <Text className="text-base font-bold text-gray-800">
// //             Work Progress Overview
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Main Progress Circle */}
// //       <View className="items-center py-6 px-4">
// //         <EnhancedCircularProgress
// //           size={120}
// //           progress={workProgressData.completed}
// //           color="#3B82F6"
// //           thickness={8}
// //         />

// //         <Text className="text-xs text-gray-500 mt-2">
// //           Overall Completion
// //         </Text>

// //         {/* Progress Stats */}
// //         <View className="flex-row justify-between w-full mt-6">
// //           <View className="items-center">
// //             <View className="flex-row items-center">
// //               <View className="h-3 w-3 rounded-full bg-green-500 mr-1" />
// //               <Text className="text-lg font-bold text-gray-800">
// //                 {workProgressData.completed}%
// //               </Text>
// //             </View>
// //             <Text className="text-xs text-gray-500 mt-1">Completed</Text>
// //           </View>

// //           <View className="items-center">
// //             <View className="flex-row items-center">
// //               <View className="h-3 w-3 rounded-full bg-gray-300 mr-1" />
// //               <Text className="text-lg font-bold text-gray-800">
// //                 {workProgressData.remaining}%
// //               </Text>
// //             </View>
// //             <Text className="text-xs text-gray-500 mt-1">Remaining</Text>
// //           </View>
// //         </View>

// //         {/* Phase-wise Progress Bars */}
// //         <View className="w-full mt-6">
// //           <Text className="text-sm font-semibold text-gray-700 mb-3">
// //             Phase-wise Progress
// //           </Text>
// //           {workProgressData.details.map((phase, index) => (
// //             <View key={index} className="mb-3">
// //               <View className="flex-row justify-between mb-1">
// //                 <Text className="text-xs text-gray-600">{phase.phase}</Text>
// //                 <Text className="text-xs font-semibold text-gray-700">
// //                   {phase.completed}%
// //                 </Text>
// //               </View>
// //               <View className="h-2 rounded-full bg-gray-200 overflow-hidden">
// //                 <View
// //                   className="h-full rounded-full"
// //                   style={{
// //                     width: `${phase.completed}%`,
// //                     backgroundColor: phase.color || '#3B82F6',
// //                   }}
// //                 />
// //               </View>
// //             </View>
// //           ))}
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderFinanceOverview = () => (
// //     <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
// //       {/* Header */}
// //       <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
// //         <View className="flex-row items-center">
// //           <View className="h-9 w-9 items-center justify-center rounded-full bg-green-100 mr-2">
// //             <Ionicons name="cash-outline" size={18} color="#059669" />
// //           </View>
// //           <Text className="text-base font-bold text-gray-800">
// //             Financial Overview
// //           </Text>
// //         </View>
// //         <Text className="text-xs text-gray-400">QAR</Text>
// //       </View>

// //       {/* Budget Summary */}
// //       <View className="px-4 py-4">
// //         <View className="flex-row justify-between items-center mb-4">
// //           <View>
// //             <Text className="text-xs text-gray-500">Total Budget</Text>
// //             <Text className="text-lg font-bold text-gray-800">
// //               QAR {(financeData.totalBudget / 1000).toFixed(0)}K
// //             </Text>
// //           </View>
// //           <View>
// //             <Text className="text-xs text-gray-500">Remaining</Text>
// //             <Text className="text-lg font-bold text-green-600">
// //               QAR {(financeData.remaining / 1000).toFixed(0)}K
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Budget Histogram */}
// //         <BudgetHistogram data={financeData.estimatedVsActual} />

// //         {/* Monthly Spending Trend */}
// //         <View className="mt-6">
// //           <Text className="text-sm font-semibold text-gray-700 mb-3">
// //             Monthly Spending Trend
// //           </Text>
// //           <View className="flex-row items-end justify-between h-32">
// //             {financeData.monthlySpending.map((month, index) => {
// //               const height = (month.spent / 150000) * 100;
// //               return (
// //                 <View key={index} className="items-center">
// //                   <View className="mb-1">
// //                     <Text className="text-xs font-semibold text-gray-700">
// //                       QAR {(month.spent / 1000).toFixed(0)}K
// //                     </Text>
// //                   </View>
// //                   <View
// //                     className="w-8 rounded-t-lg"
// //                     style={{
// //                       height: `${height}%`,
// //                       backgroundColor: month.spent > 100000
// //                         ? '#EF4444'
// //                         : month.spent > 80000
// //                           ? '#F59E0B'
// //                           : '#10B981',
// //                     }}
// //                   />
// //                   <Text className="text-xs text-gray-500 mt-2">{month.month}</Text>
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         </View>

// //         {/* Summary Stats */}
// //         <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
// //           <View className="items-center">
// //             <Text className="text-lg font-bold text-green-600">
// //               QAR {(financeData.remaining / 1000).toFixed(0)}K
// //             </Text>
// //             <Text className="text-xs text-gray-500">Available</Text>
// //           </View>
// //           <View className="items-center">
// //             <Text className="text-lg font-bold text-blue-600">
// //               QAR {(financeData.utilized / 1000).toFixed(0)}K
// //             </Text>
// //             <Text className="text-xs text-gray-500">Spent</Text>
// //           </View>
// //           <View className="items-center">
// //             <Text className="text-lg font-bold text-gray-800">
// //               {((financeData.utilized / financeData.totalBudget) * 100).toFixed(0)}%
// //             </Text>
// //             <Text className="text-xs text-gray-500">Utilized</Text>
// //           </View>
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   /* ------------------ TAB CONTENT ------------------ */
// //   const renderTabContent = () => {
// //     if (activeTab !== 'Overview') {
// //       switch (activeTab) {
// //         case 'Issues':
// //           return (
// //             <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
// //               <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
// //                 <Ionicons name="alert-circle" size={24} color="#EF4444" />
// //                 <Text style={{ marginLeft: 10, flex: 1, color: '#991B1B', fontSize: 13 }}>
// //                   High-priority risks requiring immediate attention. Tap to view details.
// //                 </Text>
// //               </View>

// //               {currentRisks.map((risk) => (
// //                 <TouchableOpacity
// //                   key={risk.id}
// //                   onPress={() => navigation.navigate('RiskDetail', { risk: risk, isClientView: true })}
// //                   style={{
// //                     backgroundColor: 'white',
// //                     borderRadius: 16,
// //                     padding: 16,
// //                     marginBottom: 12,
// //                     borderLeftWidth: 4,
// //                     borderLeftColor: (risk.score || 0) >= 9 ? '#EF4444' : '#F59E0B',
// //                     shadowColor: '#000',
// //                     shadowOffset: { width: 0, height: 1 },
// //                     shadowOpacity: 0.1,
// //                     shadowRadius: 3,
// //                     elevation: 2
// //                   }}>
// //                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
// //                     <View>
// //                       <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>{risk.title}</Text>
// //                       <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Score: {risk.score} • {risk.severity}</Text>
// //                     </View>
// //                     <View style={{
// //                       paddingHorizontal: 10,
// //                       paddingVertical: 4,
// //                       borderRadius: 20,
// //                       backgroundColor: risk.status === 'Open' ? '#EFF6FF' : '#FFFBEB'
// //                     }}>
// //                       <Text style={{
// //                         fontSize: 12,
// //                         fontWeight: '600',
// //                         color: risk.status === 'Open' ? '#2563EB' : '#D97706'
// //                       }}>
// //                         {risk.status}
// //                       </Text>
// //                     </View>
// //                   </View>

// //                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
// //                     <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
// //                     <Text style={{ fontSize: 12, color: '#6B7280' }}>{risk.date}</Text>
// //                   </View>
// //                 </TouchableOpacity>
// //               ))}
// //               <View style={{ height: 40 }} />
// //             </ScrollView>
// //           );
// //         case 'BOQ':
// //           return <BOQClientScreen project={project} />;
// //         case 'ProjectTimeline':
// //           return <ProjectTimeline project={project} />;
// //         case 'BudgetTracker':
// //           return <BudgetTracker project={project} />;
// //         case 'QualityChecks':
// //           return <QualityChecks project={project} />;
// //         case 'ChangeRequests':
// //           return <ChangeRequests project={project} />;
// //         case 'MaterialStatus':
// //           return <MaterialStatus project={project} />;
// //         case 'Plans':
// //           return <FilesScreen project={project} />;
// //         default:
// //           return null;
// //       }
// //     }

// //     return (
// //       <ScrollView
// //         className="flex-1 bg-gray-50"
// //         contentContainerStyle={{ paddingBottom: 100 }}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Original Progress Cards - KEPT EXACTLY AS BEFORE */}
// //         <View className="flex-row flex-wrap px-4 pt-4">
// //           {progressData.map((item, index) => (
// //             <View
// //               key={index}
// //               className={`w-[48%] ${index % 2 === 0 ? 'mr-[4%]' : ''
// //                 } mb-3`}
// //             >
// //               <View
// //                 className={`bg-white rounded-xl border p-4 ${item.borderColor} ${item.leftBorder}`}
// //               >
// //                 <Text className="mb-1 text-xs text-gray-600">
// //                   {item.title}
// //                 </Text>
// //                 <Text className={`${item.textColor} text-2xl font-bold`}>
// //                   {item.value}
// //                 </Text>
// //               </View>
// //             </View>
// //           ))}
// //         </View>

      

// //         {/* NEW: Work Progress Graph - ADDED NEW */}
// //         {renderWorkProgressGraph()}

    

// //         {/* ------------------ TASKS PROGRESS (ENHANCED) - KEPT ORIGINAL STYLE ------------------ */}
// //         <View className="mx-4 mt-4 mb-6 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
// //           {/* Header */}
// //           <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
// //             <View className="flex-row items-center">
// //               <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
// //                 <Ionicons name="list-outline" size={18} color="#2563EB" />
// //               </View>
// //               <Text className="text-base font-bold text-gray-800">
// //                 Tasks Progress
// //               </Text>
// //             </View>

// //             {/* ------------------ TASKS PROGRESS (ENHANCED) ------------------ */}
// //             <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
// //               {/* Header */}
// //               <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
// //                 <View className="flex-row items-center">
// //                   <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
// //                     <Ionicons name="list-outline" size={18} color="#2563EB" />
// //                   </View>
// //                   <Text className="text-base font-bold text-gray-800">
// //                     Tasks Progress
// //                   </Text>
// //                 </View>

// //                 <Text className="text-xs text-gray-400">
// //                   {milestones.length} Tasks
// //                 </Text>
// //               </View>

// //               {/* Empty State */}
// //               {milestones.length === 0 && (
// //                 <View className="py-8 items-center">
// //                   <Ionicons name="clipboard-outline" size={32} color="#CBD5E1" />
// //                   <Text className="mt-2 text-sm text-gray-400">
// //                     No milestones added yet
// //                   </Text>
// //                 </View>
// //               )}

// //               {/* Milestone List */}
// //               {milestones.map((milestone, index) => {
// //                 const progress = milestone.progress || 0;

// //                 const progressColor =
// //                   milestone.status === 'completed'
// //                     ? 'bg-green-500'
// //                     : milestone.status === 'in_progress'
// //                       ? 'bg-blue-500'
// //                       : 'bg-gray-400';

// //                 const statusBadge =
// //                   milestone.status === 'completed'
// //                     ? 'bg-green-100 text-green-700'
// //                     : milestone.status === 'in_progress'
// //                       ? 'bg-blue-100 text-blue-700'
// //                       : 'bg-gray-100 text-gray-500';

// //                 return (
// //                   <View
// //                     key={milestone._id}
// //                     className={`px-4 py-4 ${index !== milestones.length - 1
// //                       ? 'border-b border-gray-100'
// //                       : ''
// //                       }`}
// //                   >
// //                     {/* Title + Status */}
// //                     <View className="flex-row items-start justify-between mb-2">
// //                       <Text className="text-sm font-semibold text-gray-800 flex-1 pr-3">
// //                         {milestone.title}
// //                       </Text>

// //                       <View className={`px-2 py-0.5 rounded-full ${statusBadge}`}>
// //                         <Text className="text-xs font-semibold">
// //                           {getStatusLabel(milestone.status)}
// //                         </Text>
// //                       </View>
// //                     </View>

// //                     {/* Progress Info */}
// //                     <View className="flex-row items-center justify-between mb-1">
// //                       <Text className="text-xs text-gray-500">
// //                         Progress
// //                       </Text>
// //                       <Text className="text-xs font-semibold text-gray-700">
// //                         {progress}%
// //                       </Text>
// //                     </View>

// //                     {/* Progress Bar */}
// //                     <View className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
// //                       <View
// //                         className={`h-full rounded-full ${progressColor}`}
// //                         style={{ width: `${progress}%` }}
// //                       />
// //                     </View>

// //                     {/* Description */}
// //                     {milestone.description ? (
// //                       <Text className="mt-2 text-xs text-gray-500 leading-4">
// //                         {milestone.description}
// //                       </Text>
// //                     ) : null}
// //                   </View>
// //                 );
// //               })}
// //             </View>
// //           </View>
// //         </View>

// //       </ScrollView>
// //     );
// //   };

// //   const renderTabItem = ({ item }) => (
// //     <TouchableOpacity
// //       onPress={() => setActiveTab(item.id)}
// //       className={`px-4 py-2 mx-1 rounded-full border ${activeTab === item.id
// //         ? 'bg-blue-600 border-blue-600'
// //         : 'bg-white border-gray-300'
// //         }`}
// //     >
// //       <Text
// //         className={`text-xs font-semibold ${activeTab === item.id ? 'text-white' : 'text-gray-600'
// //           }`}
// //       >
// //         {item.label}
// //       </Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <SafeAreaView className="flex-1 bg-white">
// //       <Header
// //         title={project?.name || 'My Project'}
// //         showBackButton
// //         backgroundColor="#0066FF"
// //         titleColor="white"
// //         iconColor="white"
// //       />

// //       {/* Tabs */}
// //       <View className="border-b border-gray-200 py-3 bg-white">
// //         <FlatList
// //           data={tabs}
// //           horizontal
// //           renderItem={renderTabItem}
// //           keyExtractor={(item) => item.id}
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={{ paddingHorizontal: 16 }}
// //         />
// //       </View>

// //       <View className="flex-1">{renderTabContent()}</View>
// //     </SafeAreaView>
// //   );
// // };

// // export default Overview;


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Svg, { 
//   Circle, 
//   G, 
//   Text as SvgText, 
//   Rect, 
//   Line, 
//   Path,
//   LinearGradient,
//   Stop,
//   Defs 
// } from 'react-native-svg';

// import Header from '@/components/Header';

// // Sub Screens
// import ProjectTimeline from '../HomeOwner/ProjectTimeline';
// import BudgetTracker from '../HomeOwner/BudgetTracker';
// import QualityChecks from '../HomeOwner/QualityChecks';
// import ChangeRequests from '../HomeOwner/ChangeRequests';
// import MaterialStatus from '../HomeOwner/MaterialStatus';
// import BOQClientScreen from '../HomeOwner/BOQClientScreen';
// import FilesScreen from '../Document-Management/FileScreen';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const Overview = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const isFocused = useIsFocused();
//   const { project } = route.params || {};

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
//           const totalProgress = milestonesData.reduce((sum, milestone) => 
//             sum + (milestone.progress || 0), 0
//           );
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
//     { id: 'Issues', label: 'Issues', icon: 'alert-circle-outline' },
//     { id: 'BOQ', label: 'BOQ', icon: 'document-text-outline' },
//     { id: 'Plans', label: 'Plans', icon: 'layers-outline' },
//     { id: 'ProjectTimeline', label: 'Timeline', icon: 'calendar-outline' },
//     { id: 'BudgetTracker', label: 'Budget', icon: 'cash-outline' },
//     { id: 'QualityChecks', label: 'Quality', icon: 'checkmark-circle-outline' },
//     { id: 'ChangeRequests', label: 'Changes', icon: 'swap-horizontal-outline' },
//     { id: 'MaterialStatus', label: 'Materials', icon: 'cube-outline' },
//   ];

//   // Progress data based on milestones
//   const progressData = [
//     {
//       title: 'Overall Progress',
//       value: `${overallProgress}%`,
//       icon: 'trending-up',
//       color: '#2427ed',
//       gradient: ['#6366F1', '#8B5CF6'],
//       metric: 'Completion',
//     },
//     {
//       title: 'Tasks Completed',
//       value: `${milestones.filter(m => m.status === 'completed').length}/${milestones.length}`,
//       icon: 'checkmark-done',
//       color: '#10B981',
//       gradient: ['#10B981', '#34D399'],
//       metric: 'Tasks',
//     },
//     {
//       title: 'Active Milestones',
//       value: `${milestones.filter(m => m.status === 'in_progress').length}`,
//       icon: 'time',
//       color: '#F59E0B',
//       gradient: ['#F59E0B', '#FBBF24'],
//       metric: 'In Progress',
//     },
//     {
//       title: 'Days Ahead',
//       value: '15',
//       icon: 'calendar',
//       color: '#EF4444',
//       gradient: ['#EF4444', '#F87171'],
//       metric: 'Schedule',
//     },
//   ];

//   // Enhanced Circular Progress Component
//   const EnhancedCircularProgress = ({ 
//     size = 180, 
//     progress = 0, 
//     strokeWidth = 12,
//     colors = ['#6366F1', '#8B5CF6']
//   }) => {
//     const radius = (size - strokeWidth) / 2;
//     const circumference = 2 * Math.PI * radius;
//     const strokeDashoffset = circumference - (progress / 100) * circumference;

//     return (
//       <View className="relative items-center justify-center">
//         <Svg width={size} height={size}>
//           <Defs>
//             <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <Stop offset="0%" stopColor={colors[0]} />
//               <Stop offset="100%" stopColor={colors[1]} />
//             </LinearGradient>
//           </Defs>
          
//           {/* Background Circle */}
//           <Circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="#E5E7EB"
//             strokeWidth={strokeWidth}
//             fill="transparent"
//             opacity={0.3}
//           />
          
//           {/* Gradient Progress Ring */}
//           <Circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="url(#gradient)"
//             strokeWidth={strokeWidth}
//             strokeDasharray={circumference}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             fill="transparent"
//             transform={`rotate(-90, ${size / 2}, ${size / 2})`}
//           />
          
//           {/* Inner Circle for depth */}
//           <Circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius - strokeWidth}
//             fill="#F8FAFC"
//           />
          
//           {/* Progress Text */}
//           <G>
//             <SvgText
//               x={size / 2}
//               y={size / 2 - 15}
//               textAnchor="middle"
//               fill="#1F2937"
//               fontSize="32"
//               fontWeight="bold"
//             >
//               {progress}%
//             </SvgText>
//             <SvgText
//               x={size / 2}
//               y={size / 2 + 15}
//               textAnchor="middle"
//               fill="#6B7280"
//               fontSize="14"
//             >
//               Complete
//             </SvgText>
//           </G>
//         </Svg>
//       </View>
//     );
//   };

//   // Milestone Card Component
//   const MilestoneCard = ({ milestone, index }) => {
//     const progress = milestone.progress || 0;
//     const statusColor = {
//       completed: '#10B981',
//       in_progress: '#3B82F6',
//       not_started: '#6B7280',
//     }[milestone.status] || '#6B7280';

//     const statusIcon = {
//       completed: 'checkmark-circle',
//       in_progress: 'time',
//       not_started: 'ellipse-outline',
//     }[milestone.status] || 'ellipse-outline';

//     return (
//       <Animated.View 
//         style={{ 
//           opacity: fadeAnim,
//           transform: [{
//             translateY: fadeAnim.interpolate({
//               inputRange: [0, 1],
//               outputRange: [50, 0]
//             })
//           }]
//         }}
//       >
//         <TouchableOpacity 
//           className="bg-white rounded-2xl p-4 mb-3 mx-4 shadow-lg border border-gray-100"
//           style={{
//             shadowColor: statusColor,
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.1,
//             shadowRadius: 8,
//             elevation: 4,
//           }}
//           onPress={() => navigation.navigate('MilestoneDetail', { milestone })}
//         >
//           <View className="flex-row items-start justify-between mb-3">
//             <View className="flex-1">
//               <View className="flex-row items-center mb-1">
//                 <Ionicons name={statusIcon} size={16} color={statusColor} />
//                 <Text className="ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                   {milestone.status.replace('_', ' ')}
//                 </Text>
//               </View>
//               <Text className="text-lg font-bold text-gray-900 mb-1">
//                 {milestone.title}
//               </Text>
//               {milestone.description && (
//                 <Text className="text-sm text-gray-600 mb-3">
//                   {milestone.description}
//                 </Text>
//               )}
//             </View>
//             <View className="items-end">
//               <Text className="text-2xl font-bold text-gray-900">
//                 {progress}%
//               </Text>
//               <Text className="text-xs text-gray-500">Progress</Text>
//             </View>
//           </View>

//           {/* Progress Bar */}
//           <View className="mb-2">
//             <View className="flex-row justify-between mb-1">
//               <Text className="text-xs text-gray-500">Progress</Text>
//               <Text className="text-xs font-semibold text-gray-700">
//                 {progress}%
//               </Text>
//             </View>
//             <View className="h-2 rounded-full bg-gray-200 overflow-hidden">
//               <Animated.View 
//                 className="h-full rounded-full"
//                 style={{
//                   width: `${progress}%`,
//                   backgroundColor: statusColor,
//                 }}
//               />
//             </View>
//           </View>

//           {/* Additional Info */}
//           <View className="flex-row justify-between pt-3 border-t border-gray-100">
//             <View className="flex-row items-center">
//               <Ionicons name="calendar-outline" size={14} color="#6B7280" />
//               <Text className="ml-1 text-xs text-gray-600">
//                 {milestone.dueDate || 'No deadline'}
//               </Text>
//             </View>
//             <View className="flex-row items-center">
//               <Ionicons name="person-outline" size={14} color="#6B7280" />
//               <Text className="ml-1 text-xs text-gray-600">
//                 {milestone.assignedTo || 'Unassigned'}
//               </Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   // Progress Stats Card
//   const ProgressStatsCard = () => {
//     const completed = milestones.filter(m => m.status === 'completed').length;
//     const inProgress = milestones.filter(m => m.status === 'in_progress').length;
//     const notStarted = milestones.filter(m => m.status === 'not_started').length;

//     return (
//       <View className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mx-4 my-4">
//         <Text className="text-white text-lg font-bold mb-4">Progress Breakdown</Text>
        
//         <View className="flex-row justify-between mb-6">
//           <View className="items-center">
//             <Text className="text-3xl font-bold text-white">{completed}</Text>
//             <Text className="text-gray-300 text-sm">Completed</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-3xl font-bold text-white">{inProgress}</Text>
//             <Text className="text-gray-300 text-sm">In Progress</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-3xl font-bold text-white">{notStarted}</Text>
//             <Text className="text-gray-300 text-sm">Not Started</Text>
//           </View>
//         </View>

//         {/* Progress Dots Visualization */}
//         <View className="flex-row flex-wrap justify-center">
//           {milestones.slice(0, 20).map((milestone, index) => {
//             const color = {
//               completed: '#10B981',
//               in_progress: '#3B82F6',
//               not_started: '#4B5563',
//             }[milestone.status] || '#4B5563';
            
//             return (
//               <View 
//                 key={index}
//                 className="w-2 h-2 rounded-full m-1"
//                 style={{ backgroundColor: color }}
//               />
//             );
//           })}
//         </View>
//       </View>
//     );
//   };

 

//   // Main Progress Dashboard
//   const renderProgressDashboard = () => (
//     <View className="items-center py-8">
//       <EnhancedCircularProgress 
//         progress={overallProgress}
//         colors={['#6366F1', '#470cd0']}
//       />
      
//       <View className="flex-row justify-center mt-6 space-x-6">
//         <View className="items-center">
//           <Text className="text-2xl font-bold text-gray-900">{milestones.length}</Text>
//           <Text className="text-sm text-gray-500">Total Tasks</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-2xl font-bold text-gray-900">
//             {milestones.filter(m => m.status === 'completed').length}
//           </Text>
//           <Text className="text-sm text-gray-500">Completed</Text>
//         </View>
//         <View className="items-center">
//           <Text className="text-2xl font-bold text-gray-900">
//             {milestones.filter(m => m.status === 'in_progress').length}
//           </Text>
//           <Text className="text-sm text-gray-500">Active</Text>
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
//       className="px-4"
//       contentContainerStyle={{ paddingVertical: 8 }}
//       renderItem={({ item }) => (
//         <View 
//           className="bg-white rounded-2xl p-4 mr-4 border border-gray-100"
//           style={{ width: screenWidth * 0.45 }}
//         >
//           <View className="flex-row items-center mb-3">
//             <View 
//               className="w-10 h-10 rounded-full items-center justify-center mr-3"
//               style={{ backgroundColor: item.color + '20' }}
//             >
//               <Ionicons name={item.icon} size={20} color={item.color} />
//             </View>
//             <View>
//               <Text className="text-sm text-gray-500">{item.title}</Text>
//               <Text className="text-2xl font-bold text-gray-900">{item.value}</Text>
//             </View>
//           </View>
//           <Text className="text-xs text-gray-400">{item.metric}</Text>
//         </View>
//       )}
//       keyExtractor={(item) => item.title}
//     />
//   );

//   // Loading State
//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50">
//         <Header
//           title={project?.name || 'My Project'}
//           showBackButton
//           backgroundColor="#6366F1"
//           titleColor="white"
//           iconColor="white"
//         />
//         <View className="flex-1 justify-center items-center">
//           <Ionicons name="refresh-outline" size={48} color="#6366F1" />
//           <Text className="mt-4 text-gray-600">Loading progress data...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Empty State
//   if (milestones.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50">
//         <Header
//           title={project?.name || 'My Project'}
//           showBackButton
//           backgroundColor="#6366F1"
//           titleColor="white"
//           iconColor="white"
//         />
        
//         <View className="flex-1 justify-center items-center px-8">
//           <View className="w-32 h-32 bg-indigo-100 rounded-full items-center justify-center mb-6">
//             <Ionicons name="clipboard-outline" size={64} color="#6366F1" />
//           </View>
//           <Text className="text-2xl font-bold text-gray-900 mb-2">No Tasks Yet</Text>
//           <Text className="text-gray-600 text-center mb-8">
//             Start adding milestones and tasks to track your project progress
//           </Text>
//           <TouchableOpacity 
//             className="bg-indigo-600 px-8 py-4 rounded-full flex-row items-center"
//             onPress={() => navigation.navigate('AddMilestone', { project })}
//           >
//             <Ionicons name="add-circle" size={20} color="white" />
//             <Text className="text-white font-semibold ml-2">Add First Task</Text>
//           </TouchableOpacity>
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
//             <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
//               <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
//                 <Ionicons name="alert-circle" size={24} color="#EF4444" />
//                 <Text style={{ marginLeft: 10, flex: 1, color: '#991B1B', fontSize: 13 }}>
//                   High-priority risks requiring immediate attention. Tap to view details.
//                 </Text>
//               </View>

//               {currentRisks.map((risk) => (
//                 <TouchableOpacity
//                   key={risk.id}
//                   onPress={() => navigation.navigate('RiskDetail', { risk: risk, isClientView: true })}
//                   style={{
//                     backgroundColor: 'white',
//                     borderRadius: 16,
//                     padding: 16,
//                     marginBottom: 12,
//                     borderLeftWidth: 4,
//                     borderLeftColor: (risk.score || 0) >= 9 ? '#EF4444' : '#F59E0B',
//                   }}
//                 >
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
//                     <View>
//                       <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>{risk.title}</Text>
//                       <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Score: {risk.score} • {risk.severity}</Text>
//                     </View>
//                     <View style={{
//                       paddingHorizontal: 10,
//                       paddingVertical: 4,
//                       borderRadius: 20,
//                       backgroundColor: risk.status === 'Open' ? '#EFF6FF' : '#FFFBEB'
//                     }}>
//                       <Text style={{
//                         fontSize: 12,
//                         fontWeight: '600',
//                         color: risk.status === 'Open' ? '#2563EB' : '#D97706'
//                       }}>
//                         {risk.status}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
//                     <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
//                     <Text style={{ fontSize: 12, color: '#6B7280' }}>{risk.date}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//               <View style={{ height: 40 }} />
//             </ScrollView>
//           );
//         case 'BOQ':
//           return <BOQClientScreen project={project} />;
//         case 'ProjectTimeline':
//           return <ProjectTimeline project={project} />;
//         case 'BudgetTracker':
//           return <BudgetTracker project={project} />;
//         case 'QualityChecks':
//           return <QualityChecks project={project} />;
//         case 'ChangeRequests':
//           return <ChangeRequests project={project} />;
//         case 'MaterialStatus':
//           return <MaterialStatus project={project} />;
//         case 'Plans':
//           return <FilesScreen project={project} />;
//         default:
//           return null;
//       }
//     }
//     return null;
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <Header
//         title={project?.name || 'My Project'}
//         showBackButton
//         backgroundColor="#6366F1"
//         titleColor="white"
//         iconColor="white"
//       />

//       {/* Tab Navigation */}
//       <View className="bg-white border-b border-gray-200">
//         <FlatList
//           data={tabs}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="py-3"
//           contentContainerStyle={{ paddingHorizontal: 16 }}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => setActiveTab(item.id)}
//               className={`px-4 py-2 mx-1 rounded-full flex-row items-center ${
//                 activeTab === item.id
//                   ? 'bg-indigo-100'
//                   : 'bg-gray-100'
//               }`}
//             >
//               <Ionicons
//                 name={item.icon}
//                 size={16}
//                 color={activeTab === item.id ? '#6366F1' : '#6B7280'}
//               />
//               <Text
//                 className={`ml-2 font-semibold ${
//                   activeTab === item.id
//                     ? 'text-indigo-700'
//                     : 'text-gray-600'
//                 }`}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item) => item.id}
//         />
//       </View>

//       {/* Main Content */}
//       {activeTab === 'Overview' ? (
//         <ScrollView 
//           showsVerticalScrollIndicator={false}
//           className="flex-1"
//           contentContainerStyle={{ paddingBottom: 100 }}
//         >
//           {/* Progress Dashboard */}
//           {renderProgressDashboard()}

//           {/* Progress Cards */}
//           {renderProgressCards()}

         

//           {/* Progress Stats */}
//           <ProgressStatsCard />

//           {/* Milestones List */}
//           <View className="mt-4">
//             <View className="flex-row justify-between items-center mx-4 mb-4">
//               <Text className="text-lg font-bold text-gray-900">Recent Tasks</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('AllMilestones', { project })}>
//                 <Text className="text-indigo-600 font-semibold">View All</Text>
//               </TouchableOpacity>
//             </View>
            
//             {milestones.slice(0, 5).map((milestone, index) => (
//               <MilestoneCard key={milestone._id || index} milestone={milestone} index={index} />
//             ))}
//           </View>
//         </ScrollView>
//       ) : (
//         // Other Tabs Content
//         <View className="flex-1">
//           {renderTabContent()}
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Overview;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, G, Text as SvgText, Rect, Line, Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import Header from '@/components/Header';

// Sub Screens
import ProjectTimeline from '../HomeOwner/ProjectTimeline';
import BudgetTracker from '../HomeOwner/BudgetTracker';
import QualityChecks from '../HomeOwner/QualityChecks';
import ChangeRequests from '../HomeOwner/ChangeRequests';
import MaterialStatus from '../HomeOwner/MaterialStatus';
import BOQClientScreen from '../HomeOwner/BOQClientScreen';
import FilesScreen from '../Document-Management/FileScreen';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Theme Colors with #0066FF as primary
const COLORS = {
  primary: '#0066FF',
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  primaryBg: '#E6F0FF',
  secondary: '#00B8D4',
  accent: '#0091EA',
  success: '#00C853',
  warning: '#FF9800',
  danger: '#F44336',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F2F5',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
};

// Skeleton Loader Component
const SkeletonLoader = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: COLORS.surfaceAlt,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton for Progress Dashboard
const ProgressDashboardSkeleton = () => (
  <View
    style={{
      backgroundColor: COLORS.surface,
      borderRadius: 24,
      padding: 24,
      marginHorizontal: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <SkeletonLoader width={180} height={180} borderRadius={90} />
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.border }}>
      <View style={{ alignItems: 'center' }}>
        <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width={80} height={16} borderRadius={4} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width={80} height={16} borderRadius={4} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <SkeletonLoader width={60} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width={80} height={16} borderRadius={4} />
      </View>
    </View>
  </View>
);

// Skeleton for Progress Cards
const ProgressCardsSkeleton = () => (
  <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20 }}>
    {[1, 2, 3].map((item) => (
      <View
        key={item}
        style={{
          width: screenWidth * 0.42,
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          padding: 18,
          marginRight: 12,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <SkeletonLoader width={48} height={48} borderRadius={24} style={{ marginBottom: 14 }} />
        <SkeletonLoader width="80%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="60%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="50%" height={12} borderRadius={4} />
      </View>
    ))}
  </View>
);

// Skeleton for Milestone Card
const MilestoneCardSkeleton = () => (
  <View
    style={{
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <SkeletonLoader width={100} height={28} borderRadius={14} />
      <SkeletonLoader width={24} height={24} borderRadius={12} />
    </View>
    <SkeletonLoader width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
    <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: 14 }} />
    <View style={{ marginBottom: 14 }}>
      <SkeletonLoader width="100%" height={8} borderRadius={4} style={{ marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <SkeletonLoader width={60} height={14} borderRadius={4} />
        <SkeletonLoader width={40} height={14} borderRadius={4} />
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <SkeletonLoader width={100} height={14} borderRadius={4} />
      <SkeletonLoader width={100} height={14} borderRadius={4} />
    </View>
  </View>
);

const Overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { project } = route.params || {};

  const [activeTab, setActiveTab] = useState('Overview');
  const [milestones, setMilestones] = useState([]);
  const [currentRisks, setCurrentRisks] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Animation values
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Fetch Milestones and calculate progress
  const fetchMilestones = async () => {
    if (!project?._id) return;

    try {
      setLoading(true);
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
        const milestonesData = result.data;
        setMilestones(milestonesData);

        // Calculate overall progress
        if (milestonesData.length > 0) {
          const totalProgress = milestonesData.reduce((sum, milestone) => sum + (milestone.progress || 0), 0);
          const avgProgress = totalProgress / milestonesData.length;
          setOverallProgress(Math.round(avgProgress));

          // Animate progress
          Animated.timing(progressAnim, {
            toValue: avgProgress,
            duration: 1500,
            useNativeDriver: false,
          }).start();
        }
      }
    } catch (error) {
      console.error('Milestone Fetch Error:', error);
    } finally {
      setLoading(false);
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
        setCurrentRisks(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch risks", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchMilestones();
      fetchRisks();

      // Fade animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, project]);

  // Enhanced tabs with icons
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: 'home-outline' },
    { id: 'Issues', label: 'Issues', icon: 'alert-circle-outline' },
    { id: 'BOQ', label: 'BOQ', icon: 'document-text-outline' },
    { id: 'Plans', label: 'Plans', icon: 'layers-outline' },
    { id: 'ProjectTimeline', label: 'Timeline', icon: 'calendar-outline' },
    { id: 'BudgetTracker', label: 'Budget', icon: 'cash-outline' },
    { id: 'QualityChecks', label: 'Quality', icon: 'checkmark-circle-outline' },
    { id: 'ChangeRequests', label: 'Changes', icon: 'swap-horizontal-outline' },
    { id: 'MaterialStatus', label: 'Materials', icon: 'cube-outline' },
  ];

  // Progress data based on milestones
  const progressData = [
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: 'trending-up',
      color: COLORS.primary,
      metric: 'Completion',
    },
    {
      title: 'Tasks Completed',
      value: `${milestones.filter(m => m.status === 'completed').length}/${milestones.length}`,
      icon: 'checkmark-done',
      color: COLORS.success,
      metric: 'Tasks',
    },
    {
      title: 'Active Milestones',
      value: `${milestones.filter(m => m.status === 'in_progress').length}`,
      icon: 'time',
      color: COLORS.accent,
      metric: 'In Progress',
    },
    {
      title: 'Days Ahead',
      value: '15',
      icon: 'calendar',
      color: COLORS.secondary,
      metric: 'Schedule',
    },
  ];

  // Enhanced Circular Progress Component
  const EnhancedCircularProgress = ({ size = 180, progress = 0, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Inner Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 8}
          fill={COLORS.surface}
        />

        {/* Progress Text */}
        <SvgText
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          fontSize="36"
          fontWeight="bold"
          fill={COLORS.text}
        >
          {progress}%
        </SvgText>
        <SvgText
          x={size / 2}
          y={size / 2 + 20}
          textAnchor="middle"
          fontSize="14"
          fill={COLORS.textSecondary}
        >
          Complete
        </SvgText>
      </Svg>
    );
  };

  // Milestone Card Component
  const MilestoneCard = ({ milestone, index }) => {
    const progress = milestone.progress || 0;
    const statusColor = {
      completed: COLORS.success,
      in_progress: COLORS.primary,
      not_started: COLORS.textLight,
    }[milestone.status] || COLORS.textLight;

    const statusIcon = {
      completed: 'checkmark-circle',
      in_progress: 'time',
      not_started: 'ellipse-outline',
    }[milestone.status] || 'ellipse-outline';

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MilestoneDetail', { milestone })}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View
            style={{
              backgroundColor: `${statusColor}15`,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name={statusIcon} size={14} color={statusColor} style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: statusColor }}>
              {milestone.status.replace('_', ' ')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </View>

        {/* Title */}
        <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 6 }}>
          {milestone.title}
        </Text>

        {/* Description */}
        {milestone.description && (
          <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 20 }}>
            {milestone.description}
          </Text>
        )}

        {/* Progress Section */}
        <View style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>Progress</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>{progress}%</Text>
          </View>

          {/* Progress Bar */}
          <View style={{ height: 8, backgroundColor: COLORS.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
            <View
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: statusColor,
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Additional Info */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
              {milestone.dueDate || 'No deadline'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 6 }}>
              {milestone.assignedTo || 'Unassigned'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Progress Stats Card
  const ProgressStatsCard = () => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    const inProgress = milestones.filter(m => m.status === 'in_progress').length;
    const notStarted = milestones.filter(m => m.status === 'not_started').length;

    return (
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          padding: 20,
          marginHorizontal: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 20 }}>
          Progress Breakdown
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${COLORS.success}15`,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.success }}>{completed}</Text>
            </View>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>Completed</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: COLORS.primaryBg,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.primary }}>{inProgress}</Text>
            </View>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>In Progress</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${COLORS.textLight}15`,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.textLight }}>{notStarted}</Text>
            </View>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' }}>Not Started</Text>
          </View>
        </View>

        {/* Progress Dots Visualization */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
          {milestones.slice(0, 20).map((milestone, index) => {
            const color = {
              completed: COLORS.success,
              in_progress: COLORS.primary,
              not_started: COLORS.border,
            }[milestone.status] || COLORS.border;

            return (
              <View
                key={index}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };

  // Main Progress Dashboard
  const renderProgressDashboard = () => (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <EnhancedCircularProgress size={180} progress={overallProgress} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.border }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>{milestones.length}</Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Total Tasks</Text>
        </View>

        <View style={{ width: 1, backgroundColor: COLORS.border }} />

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.success }}>
            {milestones.filter(m => m.status === 'completed').length}
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Completed</Text>
        </View>

        <View style={{ width: 1, backgroundColor: COLORS.border }} />

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.primary }}>
            {milestones.filter(m => m.status === 'in_progress').length}
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' }}>Active</Text>
        </View>
      </View>
    </View>
  );

  // Enhanced Progress Cards
  const renderProgressCards = () => (
    <FlatList
      data={progressData}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      renderItem={({ item }) => (
        <View
          style={{
            width: screenWidth * 0.42,
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 18,
            marginRight: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${item.color}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>

          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '500' }}>
            {item.title}
          </Text>
          <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 }}>
            {item.value}
          </Text>
          <Text style={{ fontSize: 12, color: item.color, fontWeight: '600' }}>{item.metric}</Text>
        </View>
      )}
      keyExtractor={(item) => item.title}
    />
  );

  // Loading State with Skeleton
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Header title="Project Overview" showBackButton />
        
        {/* Tab Navigation Skeleton */}
        <View style={{ backgroundColor: COLORS.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <SkeletonLoader key={item} width={100} height={36} borderRadius={18} style={{ marginHorizontal: 4 }} />
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 20, paddingBottom: 32 }}>
            {/* Progress Dashboard Skeleton */}
            <ProgressDashboardSkeleton />

            {/* Progress Cards Skeleton */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProgressCardsSkeleton />
            </ScrollView>

            {/* Progress Stats Skeleton */}
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 20,
                padding: 20,
                marginHorizontal: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <SkeletonLoader width={150} height={20} borderRadius={4} style={{ marginBottom: 20 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                {[1, 2, 3].map((item) => (
                  <View key={item} style={{ alignItems: 'center' }}>
                    <SkeletonLoader width={56} height={56} borderRadius={28} style={{ marginBottom: 8 }} />
                    <SkeletonLoader width={70} height={14} borderRadius={4} />
                  </View>
                ))}
              </View>
            </View>

            {/* Milestones Skeleton */}
            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <SkeletonLoader width={120} height={24} borderRadius={4} />
                <SkeletonLoader width={70} height={20} borderRadius={4} />
              </View>
              {[1, 2, 3].map((item) => (
                <MilestoneCardSkeleton key={item} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Empty State
  if (milestones.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Header title="Project Overview" showBackButton />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: COLORS.primaryBg,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Ionicons name="file-tray-outline" size={56} color={COLORS.primary} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 12, textAlign: 'center' }}>
            No Tasks Yet
          </Text>
          <Text style={{ fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>
            Start adding milestones and tasks to track your project progress
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddMilestone', { project })}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: COLORS.surface, fontSize: 16, fontWeight: '600' }}>Add First Task</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Tab Content for non-overview tabs
  const renderTabContent = () => {
    if (activeTab !== 'Overview') {
      switch (activeTab) {
        case 'Issues':
          return (
            <View style={{ padding: 16 }}>
              <View
                style={{
                  backgroundColor: `${COLORS.warning}15`,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.warning,
                }}
              >
                <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: '500' }}>
                  High-priority risks requiring immediate attention. Tap to view details.
                </Text>
              </View>

              {currentRisks.map((risk) => (
                <TouchableOpacity
                  key={risk._id}
                  onPress={() => navigation.navigate('RiskDetail', { risk: risk, isClientView: true })}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: (risk.score || 0) >= 9 ? COLORS.danger : COLORS.warning,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 8 }}>
                    {risk.title}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                      Score: {risk.score} • {risk.severity}
                    </Text>
                    <View
                      style={{
                        backgroundColor: COLORS.primaryBg,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: '600' }}>{risk.status}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>{risk.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        case 'BOQ':
          return <BOQClientScreen />;
        case 'ProjectTimeline':
          return <ProjectTimeline />;
        case 'BudgetTracker':
          return <BudgetTracker />;
        case 'QualityChecks':
          return <QualityChecks />;
        case 'ChangeRequests':
          return <ChangeRequests />;
        case 'MaterialStatus':
          return <MaterialStatus />;
        case 'Plans':
          return <FilesScreen project={project} />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header title="Project Overview" showBackButton />

      {/* Tab Navigation */}
      <View style={{ backgroundColor: COLORS.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.id)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                marginHorizontal: 4,
                borderRadius: 24,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: activeTab === item.id ? COLORS.primary : COLORS.surfaceAlt,
              }}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={activeTab === item.id ? COLORS.surface : COLORS.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: activeTab === item.id ? COLORS.surface : COLORS.textSecondary,
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'Overview' ? (
          <Animated.View style={{ opacity: fadeAnim, paddingTop: 20, paddingBottom: 32 }}>
            {/* Progress Dashboard */}
            {renderProgressDashboard()}

            {/* Progress Cards */}
            {renderProgressCards()}

            {/* Progress Stats */}
            <ProgressStatsCard />

            {/* Milestones List */}
            <View style={{ paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>Recent Tasks</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AllMilestones', { project })}>
                  <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>
              </View>

              {milestones.slice(0, 5).map((milestone, index) => (
                <MilestoneCard key={milestone._id || index} milestone={milestone} index={index} />
              ))}
            </View>
          </Animated.View>
        ) : (
          // Other Tabs Content
          <View style={{ paddingTop: 12 }}>{renderTabContent()}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Overview;