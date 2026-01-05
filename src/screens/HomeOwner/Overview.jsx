import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, G, Text as SvgText, Rect, Line } from 'react-native-svg';

import Header from '@/components/Header';

// Sub Screens
import ProjectTimeline from '../HomeOwner/ProjectTimeline';
import BudgetTracker from '../HomeOwner/BudgetTracker';
import QualityChecks from '../HomeOwner/QualityChecks';
import ChangeRequests from '../HomeOwner/ChangeRequests';
import MaterialStatus from '../HomeOwner/MaterialStatus';
import BOQClientScreen from '../HomeOwner/BOQClientScreen';

const { width: screenWidth } = Dimensions.get('window');
import FilesScreen from '../Document-Management/FileScreen';

const Overview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params || {};

  const [activeTab, setActiveTab] = useState('Overview');
  const [milestones, setMilestones] = useState([]);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'BOQ', label: 'BOQ' },
    { id: 'Plans', label: 'Plans' },
    { id: 'ProjectTimeline', label: 'Project Timeline' },
    { id: 'BudgetTracker', label: 'Budget Track' }, 
    { id: 'QualityChecks', label: 'Quality Checks' },
    { id: 'ChangeRequests', label: 'Change Request' },
    { id: 'MaterialStatus', label: 'Material Status' },
  ];

  // Enhanced static data with estimated vs actual budget comparison
  const [workProgressData] = useState({
    completed: 68,
    remaining: 32,
    timeline: [
      { month: 'Jan', estimated: 100, actual: 120 },
      { month: 'Feb', estimated: 80, actual: 85 },
      { month: 'Mar', estimated: 150, actual: 130 },
      { month: 'Apr', estimated: 120, actual: 140 },
      { month: 'May', estimated: 90, actual: 95 },
      { month: 'Jun', estimated: 110, actual: 105 },
    ],
    details: [
      { phase: 'Foundation', completed: 100, estimatedDays: 30, actualDays: 28 },
      { phase: 'Structure', completed: 95, estimatedDays: 45, actualDays: 42 },
      { phase: 'Plumbing', completed: 85, estimatedDays: 25, actualDays: 28 },
      { phase: 'Electrical', completed: 75, estimatedDays: 20, actualDays: 22 },
      { phase: 'Finishing', completed: 35, estimatedDays: 60, actualDays: 45 },
    ],
  });

  const [financeData] = useState({
    totalBudget: 750000,
    utilized: 450000,
    remaining: 300000,
    estimatedVsActual: [
      { category: 'Materials', estimated: 350000, actual: 250000 },
      { category: 'Labor', estimated: 250000, actual: 120000 },
      { category: 'Equipment', estimated: 80000, actual: 50000 },
      { category: 'Misc', estimated: 70000, actual: 30000 },
    ],
    monthlySpending: [
      { month: 'Jan', spent: 85000 },
      { month: 'Feb', spent: 95000 },
      { month: 'Mar', spent: 120000 },
      { month: 'Apr', spent: 80000 },
      { month: 'May', spent: 60000 },
      { month: 'Jun', spent: 50000 },
    ],
  });

  const progressData = [
    {
      title: 'Overall Progress',
      value: '68%',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      leftBorder: 'border-l-4 border-l-yellow-500',
    },
    {
      title: 'Budget Utilized',
      value: 'QAR 450K',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
      leftBorder: 'border-l-4 border-l-cyan-500',
    },
    {
      title: 'Days Elapsed',
      value: '156',
      textColor: 'text-red-500',
      borderColor: 'border-red-200',
      leftBorder: 'border-l-4 border-l-red-500',
    },
    {
      title: 'Active Workers',
      value: '12',
      textColor: 'text-green-500',
      borderColor: 'border-green-200',
      leftBorder: 'border-l-4 border-l-green-500',
    },
  ];

  /* ------------------ ENHANCED CIRCULAR PROGRESS WITH SVG ------------------ */
  const EnhancedCircularProgress = ({ 
    size = 120, 
    progress = 0, 
    color = '#3B82F6', 
    bgColor = '#F3F4F6',
    thickness = 8,
    showInnerCircle = false,
    innerProgress = 0,
    innerColor = '#10B981'
  }) => {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View className="relative items-center justify-center">
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={thickness}
            fill="transparent"
          />
          
          {/* Outer Progress Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
          
          {/* Inner Progress Ring (if enabled) */}
          {showInnerCircle && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius - thickness - 4}
              stroke={innerColor}
              strokeWidth={thickness - 2}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (innerProgress / 100) * circumference}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          )}
          
          {/* Center Text */}
          <G>
            <SvgText
              x={size / 2}
              y={showInnerCircle ? size / 2 - 8 : size / 2}
              textAnchor="middle"
              fill="#1F2937"
              fontSize="20"
              fontWeight="bold"
            >
              {progress}%
            </SvgText>
            <SvgText
              x={size / 2}
              y={showInnerCircle ? size / 2 + 10 : size / 2 + 20}
              textAnchor="middle"
              fill="#6B7280"
              fontSize="10"
            >
              Complete
            </SvgText>
          </G>
        </Svg>
      </View>
    );
  };

  /* ------------------ HISTOGRAM COMPONENT ------------------ */
  const BudgetHistogram = ({ data, width = screenWidth - 64, height = 200 }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.estimated, d.actual]));
    const barWidth = (width - 60) / data.length;
    
    return (
      <View className="mt-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Estimated vs Actual Budget
        </Text>
        
        <View style={{ height, width }}>
          <Svg width={width} height={height}>
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((percent, index) => (
              <React.Fragment key={`grid-${index}`}>
                <Rect
                  x={0}
                  y={(height - 40) * (percent / 100)}
                  width={width}
                  height={1}
                  fill="#E5E7EB"
                  opacity={0.5}
                />
                <SvgText
                  x={width - 25}
                  y={(height - 40) * (percent / 100) - 5}
                  fill="#6B7280"
                  fontSize="10"
                >
                  {Math.round(maxValue * (percent / 100) / 1000)}K
                </SvgText>
              </React.Fragment>
            ))}
            
            {/* Bars */}
            {data.map((item, index) => {
              const estimatedHeight = (item.estimated / maxValue) * (height - 60);
              const actualHeight = (item.actual / maxValue) * (height - 60);
              const x = 30 + index * barWidth;
              
              return (
                <G key={`bar-${index}`}>
                  {/* Estimated Budget Bar */}
                  <Rect
                    x={x}
                    y={height - 40 - estimatedHeight}
                    width={barWidth * 0.4}
                    height={estimatedHeight}
                    fill="#3B82F6"
                    opacity={0.3}
                    rx={2}
                  />
                  
                  {/* Actual Budget Bar */}
                  <Rect
                    x={x + barWidth * 0.4 + 2}
                    y={height - 40 - actualHeight}
                    width={barWidth * 0.4}
                    height={actualHeight}
                    fill={item.actual > item.estimated ? '#EF4444' : '#10B981'}
                    rx={2}
                  />
                  
                  {/* Category Label */}
                  <SvgText
                    x={x + barWidth * 0.4}
                    y={height - 20}
                    textAnchor="middle"
                    fill="#6B7280"
                    fontSize="10"
                  >
                    {item.category}
                  </SvgText>
                  
                  {/* Value Labels */}
                  {item.actual > item.estimated ? (
                    <SvgText
                      x={x + barWidth * 0.6}
                      y={height - 45 - actualHeight}
                      textAnchor="middle"
                      fill="#EF4444"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      +{Math.round((item.actual - item.estimated) / 1000)}K
                    </SvgText>
                  ) : (
                    <SvgText
                      x={x + barWidth * 0.6}
                      y={height - 45 - actualHeight}
                      textAnchor="middle"
                      fill="#10B981"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      -{Math.round((item.estimated - item.actual) / 1000)}K
                    </SvgText>
                  )}
                </G>
              );
            })}
            
            {/* Legend */}
            <G>
              <Rect x={30} y={10} width={10} height={10} fill="#3B82F6" opacity={0.3} rx={2} />
              <SvgText x={45} y={18} fill="#6B7280" fontSize="10">Estimated</SvgText>
              
              <Rect x={100} y={10} width={10} height={10} fill="#10B981" rx={2} />
              <SvgText x={115} y={18} fill="#6B7280" fontSize="10">Under Budget</SvgText>
              
              <Rect x={200} y={10} width={10} height={10} fill="#EF4444" rx={2} />
              <SvgText x={215} y={18} fill="#6B7280" fontSize="10">Over Budget</SvgText>
            </G>
          </Svg>
        </View>
        
        {/* Summary Stats */}
        <View className="flex-row justify-between mt-4">
          <View className="items-center">
            <Text className="text-xs text-gray-500">Total Estimated</Text>
            <Text className="text-sm font-bold text-blue-600">
              QAR {financeData.estimatedVsActual.reduce((sum, item) => sum + item.estimated, 0) / 1000}K
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Total Actual</Text>
            <Text className="text-sm font-bold text-green-600">
              QAR {financeData.estimatedVsActual.reduce((sum, item) => sum + item.actual, 0) / 1000}K
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Savings</Text>
            <Text className="text-sm font-bold text-purple-600">
              QAR {(financeData.estimatedVsActual.reduce((sum, item) => sum + item.estimated, 0) - 
                   financeData.estimatedVsActual.reduce((sum, item) => sum + item.actual, 0)) / 1000}K
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /* ------------------ TIMELINE CHART ------------------ */
  const TimelineChart = ({ data, width = screenWidth - 64, height = 150 }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.estimated, d.actual]));
    
    return (
      <View className="mt-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Monthly Progress Timeline
        </Text>
        
        <View style={{ height, width }}>
          <Svg width={width} height={height}>
            {/* Estimated Line */}
            {data.map((item, index) => {
              const x = 40 + (index * (width - 80) / (data.length - 1));
              const y = height - 30 - ((item.estimated / maxValue) * (height - 60));
              
              return (
                <React.Fragment key={`estimated-${index}`}>
                  <Circle cx={x} cy={y} r={3} fill="#3B82F6" />
                  {index < data.length - 1 && (
                    <React.Fragment>
                      <Line
                        x1={x}
                        y1={y}
                        x2={40 + ((index + 1) * (width - 80) / (data.length - 1))}
                        y2={height - 30 - ((data[index + 1].estimated / maxValue) * (height - 60))}
                        stroke="#3B82F6"
                        strokeWidth={2}
                        strokeDasharray="4,4"
                        opacity={0.5}
                      />
                    </React.Fragment>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Actual Line */}
            {data.map((item, index) => {
              const x = 40 + (index * (width - 80) / (data.length - 1));
              const y = height - 30 - ((item.actual / maxValue) * (height - 60));
              
              return (
                <React.Fragment key={`actual-${index}`}>
                  <Circle cx={x} cy={y} r={4} fill={item.actual > item.estimated ? '#EF4444' : '#10B981'} />
                  {index < data.length - 1 && (
                    <Line
                      x1={x}
                      y1={y}
                      x2={40 + ((index + 1) * (width - 80) / (data.length - 1))}
                      y2={height - 30 - ((data[index + 1].actual / maxValue) * (height - 60))}
                      stroke={item.actual > item.estimated ? '#EF4444' : '#10B981'}
                      strokeWidth={2}
                    />
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Month Labels */}
            {data.map((item, index) => {
              const x = 40 + (index * (width - 80) / (data.length - 1));
              return (
                <SvgText
                  key={`label-${index}`}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#6B7280"
                  fontSize="10"
                >
                  {item.month}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </View>
    );
  };

  /* ------------------ STATUS LABEL ------------------ */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  /* ------------------ FETCH MILESTONES ------------------ */
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
        setMilestones(result.data);
      } else {
        console.error('Milestone API Error:', result);
      }
    } catch (error) {
      console.error('Milestone Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [project?._id]);

  /* ------------------ ENHANCED GRAPH COMPONENTS ------------------ */
  const renderWorkProgressGraph = () => (
    <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
            <Ionicons name="bar-chart-outline" size={18} color="#2563EB" />
          </View>
          <Text className="text-base font-bold text-gray-800">
            Work Progress Overview
          </Text>
        </View>
      </View>

      {/* Main Progress Circle */}
      <View className="items-center py-6 px-4">
        <EnhancedCircularProgress 
          size={120}
          progress={workProgressData.completed}
          color="#3B82F6"
          thickness={8}
        />
        
        <Text className="text-xs text-gray-500 mt-2">
          Overall Completion
        </Text>

        {/* Progress Stats */}
        <View className="flex-row justify-between w-full mt-6">
          <View className="items-center">
            <View className="flex-row items-center">
              <View className="h-3 w-3 rounded-full bg-green-500 mr-1" />
              <Text className="text-lg font-bold text-gray-800">
                {workProgressData.completed}%
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">Completed</Text>
          </View>

          <View className="items-center">
            <View className="flex-row items-center">
              <View className="h-3 w-3 rounded-full bg-gray-300 mr-1" />
              <Text className="text-lg font-bold text-gray-800">
                {workProgressData.remaining}%
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">Remaining</Text>
          </View>
        </View>

        {/* Phase-wise Progress Bars */}
        <View className="w-full mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Phase-wise Progress
          </Text>
          {workProgressData.details.map((phase, index) => (
            <View key={index} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-gray-600">{phase.phase}</Text>
                <Text className="text-xs font-semibold text-gray-700">
                  {phase.completed}%
                </Text>
              </View>
              <View className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${phase.completed}%`,
                    backgroundColor: phase.color || '#3B82F6',
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderFinanceOverview = () => (
    <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-green-100 mr-2">
            <Ionicons name="cash-outline" size={18} color="#059669" />
          </View>
          <Text className="text-base font-bold text-gray-800">
            Financial Overview
          </Text>
        </View>
        <Text className="text-xs text-gray-400">QAR</Text>
      </View>

      {/* Budget Summary */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-xs text-gray-500">Total Budget</Text>
            <Text className="text-lg font-bold text-gray-800">
              QAR {(financeData.totalBudget / 1000).toFixed(0)}K
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">Remaining</Text>
            <Text className="text-lg font-bold text-green-600">
              QAR {(financeData.remaining / 1000).toFixed(0)}K
            </Text>
          </View>
        </View>

        {/* Budget Histogram */}
        <BudgetHistogram data={financeData.estimatedVsActual} />

        {/* Monthly Spending Trend */}
        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">
            Monthly Spending Trend
          </Text>
          <View className="flex-row items-end justify-between h-32">
            {financeData.monthlySpending.map((month, index) => {
              const height = (month.spent / 150000) * 100;
              return (
                <View key={index} className="items-center">
                  <View className="mb-1">
                    <Text className="text-xs font-semibold text-gray-700">
                      QAR {(month.spent / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View
                    className="w-8 rounded-t-lg"
                    style={{
                      height: `${height}%`,
                      backgroundColor: month.spent > 100000 
                        ? '#EF4444' 
                        : month.spent > 80000 
                        ? '#F59E0B' 
                        : '#10B981',
                    }}
                  />
                  <Text className="text-xs text-gray-500 mt-2">{month.month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Summary Stats */}
        <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
          <View className="items-center">
            <Text className="text-lg font-bold text-green-600">
              QAR {(financeData.remaining / 1000).toFixed(0)}K
            </Text>
            <Text className="text-xs text-gray-500">Available</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-blue-600">
              QAR {(financeData.utilized / 1000).toFixed(0)}K
            </Text>
            <Text className="text-xs text-gray-500">Spent</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {((financeData.utilized / financeData.totalBudget) * 100).toFixed(0)}%
            </Text>
            <Text className="text-xs text-gray-500">Utilized</Text>
          </View>
        </View>
      </View>
    </View>
  );

  /* ------------------ TAB CONTENT ------------------ */
  const renderTabContent = () => {
    if (activeTab !== 'Overview') {
      switch (activeTab) {
        case 'BOQ':
          return <BOQClientScreen project={project} />;
        case 'ProjectTimeline':
          return <ProjectTimeline project={project} />;
        case 'BudgetTracker':
          return <BudgetTracker project={project} />;
        case 'QualityChecks':
          return <QualityChecks project={project} />;
        case 'ChangeRequests':
          return <ChangeRequests project={project} />;
        case 'MaterialStatus':
          return <MaterialStatus project={project} />;
        case 'Plans':
          return <FilesScreen project={project} />;
        default:
          return null;
      }
    }

    return (
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Original Progress Cards - KEPT EXACTLY AS BEFORE */}
        <View className="flex-row flex-wrap px-4 pt-4">
          {progressData.map((item, index) => (
            <View
              key={index}
              className={`w-[48%] ${index % 2 === 0 ? 'mr-[4%]' : ''
                } mb-3`}
            >
              <View
                className={`bg-white rounded-xl border p-4 ${item.borderColor} ${item.leftBorder}`}
              >
                <Text className="mb-1 text-xs text-gray-600">
                  {item.title}
                </Text>
                <Text className={`${item.textColor} text-2xl font-bold`}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Current Phase - KEPT EXACTLY AS BEFORE */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4">
          <Text className="text-base font-bold text-gray-800">
            Current Phase : <Text className="font-bold">Interior Finishing</Text>
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Expected completion:{' '}
            <Text className="font-medium text-blue-600">
              March 15, 2026
            </Text>
          </Text>
        </View>

        {/* NEW: Work Progress Graph - ADDED NEW */}
        {renderWorkProgressGraph()}

        {/* NEW: Finance Overview - ADDED NEW */}
        {renderFinanceOverview()}

        {/* ------------------ TASKS PROGRESS (ENHANCED) - KEPT ORIGINAL STYLE ------------------ */}
        <View className="mx-4 mt-4 mb-6 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
                <Ionicons name="list-outline" size={18} color="#2563EB" />
              </View>
              <Text className="text-base font-bold text-gray-800">
                Tasks Progress
              </Text>
            </View>

        {/* ------------------ TASKS PROGRESS (ENHANCED) ------------------ */}
        <View className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-100 mr-2">
                <Ionicons name="list-outline" size={18} color="#2563EB" />
              </View>
              <Text className="text-base font-bold text-gray-800">
                Tasks Progress
              </Text>
            </View>

            <Text className="text-xs text-gray-400">
              {milestones.length} Tasks
            </Text>
          </View>

          {/* Empty State */}
          {milestones.length === 0 && (
            <View className="py-8 items-center">
              <Ionicons name="clipboard-outline" size={32} color="#CBD5E1" />
              <Text className="mt-2 text-sm text-gray-400">
                No milestones added yet
              </Text>
            </View>
          )}

          {/* Milestone List */}
          {milestones.map((milestone, index) => {
            const progress = milestone.progress || 0;

            const progressColor =
              milestone.status === 'completed'
                ? 'bg-green-500'
                : milestone.status === 'in_progress'
                  ? 'bg-blue-500'
                  : 'bg-gray-400';

            const statusBadge =
              milestone.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : milestone.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500';

            return (
              <View
                key={milestone._id}
                className={`px-4 py-4 ${index !== milestones.length - 1
                  ? 'border-b border-gray-100'
                  : ''
                  }`}
              >
                {/* Title + Status */}
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-sm font-semibold text-gray-800 flex-1 pr-3">
                    {milestone.title}
                  </Text>

                  <View className={`px-2 py-0.5 rounded-full ${statusBadge}`}>
                    <Text className="text-xs font-semibold">
                      {getStatusLabel(milestone.status)}
                    </Text>
                  </View>
                </View>

                {/* Progress Info */}
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs text-gray-500">
                    Progress
                  </Text>
                  <Text className="text-xs font-semibold text-gray-700">
                    {progress}%
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                  <View
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </View>

                {/* Description */}
                {milestone.description ? (
                  <Text className="mt-2 text-xs text-gray-500 leading-4">
                    {milestone.description}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
        </View>
        </View>

      </ScrollView>
    );
  };

  const renderTabItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
      className={`px-4 py-2 mx-1 rounded-full border ${activeTab === item.id
        ? 'bg-blue-600 border-blue-600'
        : 'bg-white border-gray-300'
        }`}
    >
      <Text
        className={`text-xs font-semibold ${activeTab === item.id ? 'text-white' : 'text-gray-600'
          }`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title={project?.name || 'My Project'}
        showBackButton
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      {/* Tabs */}
      <View className="border-b border-gray-200 py-3 bg-white">
        <FlatList
          data={tabs}
          horizontal
          renderItem={renderTabItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>

      <View className="flex-1">{renderTabContent()}</View>
    </SafeAreaView>
  );
};

export default Overview;