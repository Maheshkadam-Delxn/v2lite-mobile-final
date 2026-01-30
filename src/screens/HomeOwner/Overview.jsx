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
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, G, Text as SvgText, LinearGradient, Stop, Defs } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import Header from '@/components/Header';

// Sub Screens
import ProjectTimeline from '../HomeOwner/ProjectTimeline';
import BudgetTracker from '../HomeOwner/BudgetTracker';
import QualityChecks from '../HomeOwner/QualityChecks';
import ChangeRequests from '../HomeOwner/ChangeRequests';
import MaterialStatus from '../HomeOwner/MaterialStatus';
import BOQClientScreen from '../HomeOwner/BOQClientScreen';
import FilesScreen from '../Document-Management/FileScreen';
import SnagListScreen from '../Snags/SnagListScreen';
import WorkProgressListScreen from '../WorkProgress/WorkProgressListScreen';
import Survey from '../HomeOwner/survey';
import Transaction from '../HomeOwner/Transaction'


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Color Palette
const COLORS = {
  primary: '#0066FF',
  primaryLight: '#3385FF',
  primaryDark: '#0052CC',
  primaryBg: 'rgba(0, 102, 255, 0.08)',
  secondary: '#7C3AED',
  accent: '#00B8D4',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: 'rgba(0, 0, 0, 0.05)',
};

// Enhanced Skeleton Loader with shimmer effect
const SkeletonLoader = ({ width, height, borderRadius = 12, style }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-containerWidth, containerWidth],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: COLORS.surfaceAlt,
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            transform: [{ skewX: '-20deg' }],
          }}
        />
      </Animated.View>
    </View>
  );
};

// Enhanced Circular Progress Component with gradient
const EnhancedCircularProgress = ({ size = 200, progress = 0, strokeWidth = 16 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 80) return COLORS.success;
    if (progress >= 50) return COLORS.primary;
    return COLORS.warning;
  };

  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background Circle with subtle gradient */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
          strokeOpacity={0.5}
        />

        {/* Progress Ring with gradient */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Inner glow effect */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          fill="url(#innerGlow)"
        />

        <Defs>
          <LinearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={COLORS.surface} stopOpacity="1" />
            <Stop offset="100%" stopColor={COLORS.surfaceAlt} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>
      </Svg>

      {/* Center Content */}
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 42, fontWeight: '800', color: COLORS.text, marginBottom: -4 }}>
          {progress}%
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' }}>
          Complete
        </Text>
      </View>
    </View>
  );
};

// Glass Card Component for depth effect
const GlassCard = ({ children, style }) => (
  <View style={[styles.glassCard, style]}>
    {children}
  </View>
);

// Enhanced Progress Card Component
const ProgressCard = ({ title, value, icon, color, metric, subtitle }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => setIsPressed(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.progressCard,
        {
          backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.95)' : COLORS.surface,
          transform: [{ scale: isPressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.progressIcon, { backgroundColor: `${color}15` }]}>
        <View style={[styles.iconBackground, { backgroundColor: color }]} />
        <Ionicons name={icon} size={22} color={COLORS.surface} />
      </View>

      <Text style={styles.progressValue}>{value}</Text>
      <Text style={styles.progressTitle}>{title}</Text>

      <View style={styles.progressMetricContainer}>
        <View style={[styles.metricDot, { backgroundColor: color }]} />
        <Text style={[styles.progressMetric, { color }]}>{metric}</Text>
      </View>

      {subtitle && (
        <Text style={styles.progressSubtitle}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
};

// Tab Button Component
const TabButton = ({ item, active, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        onPress();
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.tabButton,
          active ? styles.tabButtonActive : styles.tabButtonInactive,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={18}
          color={active ? COLORS.surface : COLORS.textSecondary}
          style={{ marginRight: 6 }}
        />
        <Text style={[
          styles.tabButtonText,
          active ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
        ]}>
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend }) => (
  <View style={styles.statsCard}>
    <View style={[styles.statsIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statsValue}>{value}</Text>
    <Text style={styles.statsTitle}>{title}</Text>
    {trend && (
      <View style={styles.trendContainer}>
        <Ionicons name={trend > 0 ? 'trending-up' : 'trending-down'} size={12} color={trend > 0 ? COLORS.success : COLORS.danger} />
        <Text style={[styles.trendText, { color: trend > 0 ? COLORS.success : COLORS.danger }]}>
          {Math.abs(trend)}%
        </Text>
      </View>
    )}
  </View>
);

// Enhanced Milestone Card Component with original navigation
const MilestoneCard = ({ milestone, index, project, navigation }) => {
  const progress = milestone.progress || 0;
  const statusConfig = {
    completed: {
      color: COLORS.success,
      icon: 'checkmark-circle',
      bgColor: COLORS.successLight,
    },
    in_progress: {
      color: COLORS.primary,
      icon: 'time',
      bgColor: COLORS.primaryBg,
    },
    not_started: {
      color: COLORS.textLight,
      icon: 'ellipse-outline',
      bgColor: 'rgba(148, 163, 184, 0.1)',
    },
  };

  const config = statusConfig[milestone.status] || statusConfig.not_started;
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Original navigation - goes to milestone detail/edit page
    navigation.navigate('MilestoneDetail', { milestone, projectId: project._id || project.id });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.milestoneCard,
        {
          transform: [{ scale: isPressed ? 0.99 : 1 }],
          borderLeftColor: config.color,
          borderLeftWidth: 4,
        },
      ]}
    >
      <View style={styles.milestoneHeader}>
        <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={14} color={config.color} style={{ marginRight: 4 }} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {milestone.status?.replace('_', ' ') || 'Not Started'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      </View>

      <Text style={styles.milestoneTitle}>{milestone.title}</Text>

      {milestone.description && (
        <Text style={styles.milestoneDescription} numberOfLines={2}>
          {milestone.description}
        </Text>
      )}

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={[styles.progressPercent, { color: config.color }]}>{progress}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: config.color }]}>
            <View style={styles.progressBarGlow} />
          </View>
        </View>
      </View>

      <View style={styles.milestoneFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>
            {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }) : 'No deadline'}
          </Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>
            {milestone.assignedTo || 'Unassigned'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMilestones(), fetchRisks()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (isFocused) {
      fetchMilestones();
      fetchRisks();

      // Animation sequence
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, project]);

  // Enhanced tabs with icons
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: 'home' },
    { id: 'Survey', label: 'Survey', icon: 'clipboard' },
    { id: 'Progress', label: 'Progress', icon: 'trending-up' },
    { id: 'BOQ', label: 'BOQ', icon: 'document-text' },
    { id: 'Plans', label: 'Plans', icon: 'layers' },
    // { id: 'ChangeRequests', label: 'Changes', icon: 'swap-horizontal' },
    { id: 'MaterialStatus', label: 'Materials', icon: 'cube' },
    { id: 'Transaction', label: 'Transaction', icon: 'card-outline' },
    // { id: 'ProjectTimeline', label: 'Timeline', icon: 'calendar-outline' },
    // { id: 'BudgetTracker', label: 'Budget', icon: 'cash-outline' },
    // { id: 'QualityChecks', label: 'Quality', icon: 'checkmark-circle-outline' },
    { id: 'Snags', label: 'Snags', icon: 'bug' },
    { id: 'Issues', label: 'Issues', icon: 'alert-circle' },


  ];

  // Progress data based on milestones
  const progressData = [
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: 'trending-up',
      color: overallProgress >= 80 ? COLORS.success : overallProgress >= 50 ? COLORS.primary : COLORS.warning,
      metric: 'Completion Rate',
      subtitle: `${milestones.filter(m => m.status === 'completed').length} tasks done`,
    },
    {
      title: 'Tasks Completed',
      value: milestones.filter(m => m.status === 'completed').length,
      icon: 'checkmark-done',
      color: COLORS.success,
      metric: 'Done',
      subtitle: `of ${milestones.length} total`,
    },
    {
      title: 'Active Tasks',
      value: milestones.filter(m => m.status === 'in_progress').length,
      icon: 'time',
      color: COLORS.primary,
      metric: 'In Progress',
      subtitle: 'Currently working',
    },
    {
      title: 'On Schedule',
      value: '15',
      icon: 'calendar',
      color: COLORS.secondary,
      metric: 'Days Ahead',
      subtitle: 'From deadline',
    },
  ];

  // Main Progress Dashboard
  const renderProgressDashboard = () => (
    <GlassCard style={styles.dashboardCard}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Project Progress</Text>
        <TouchableOpacity style={styles.dashboardMenu}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressCircleContainer}>
        <EnhancedCircularProgress progress={overallProgress} />
      </View>

      <View style={styles.dashboardStats}>
        {[
          { label: 'Total Tasks', value: milestones.length, color: COLORS.text },
          { label: 'Completed', value: milestones.filter(m => m.status === 'completed').length, color: COLORS.success },
          { label: 'Active', value: milestones.filter(m => m.status === 'in_progress').length, color: COLORS.primary },
        ].map((stat, index) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            {index < 2 && <View style={styles.statDivider} />}
          </View>
        ))}
      </View>
    </GlassCard>
  );

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
        case 'Snags':
          return <SnagListScreen projectId={project._id} showHeader={false} isClient={true} />;
        case 'Progress':
          return <WorkProgressListScreen projectId={project._id} isClient={true} showHeader={false} />;
        case 'Transaction':
          return <Transaction project={project} />;
        default:
          return null;
      }
    }
    return null;
  };

  // Loading State with Enhanced Skeleton
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Header title="Project Overview" showBackButton />

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Tab Navigation Skeleton */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
              {[1, 2, 3, 4, 5].map((item) => (
                <SkeletonLoader key={item} width={100} height={36} borderRadius={18} style={{ marginHorizontal: 6 }} />
              ))}
            </ScrollView>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Dashboard Skeleton */}
            <View style={styles.skeletonDashboard}>
              <SkeletonLoader width="100%" height={280} borderRadius={24} />
            </View>

            {/* Progress Cards Skeleton */}
            <View style={styles.skeletonCards}>
              {[1, 2, 3, 4].map((item) => (
                <SkeletonLoader key={item} width={screenWidth * 0.42} height={140} borderRadius={20} style={{ marginRight: 12 }} />
              ))}
            </View>

            {/* Milestones Skeleton */}
            <View style={styles.skeletonMilestones}>
              <SkeletonLoader width={120} height={24} borderRadius={4} style={{ marginBottom: 16 }} />
              {[1, 2, 3].map((item) => (
                <SkeletonLoader key={item} width="100%" height={180} borderRadius={16} style={{ marginBottom: 12 }} />
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Empty State for non-approved projects
  console.log("Project Status:", project.status);
  if (project.status !== "Ongoing") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Header title="Project Overview" showBackButton />

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="time-outline" size={64} color={COLORS.primary} />
            <View style={styles.emptyIconRing} />
          </View>

          <Text style={styles.emptyTitle}>Project Under Review</Text>

          <Text style={styles.emptyDescription}>
            Your project is currently being reviewed and approved.
            You'll be able to access all features once the approval process is complete.
          </Text>

          <View style={styles.emptyStats}>
            <View style={styles.emptyStat}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.emptyStatText}>Quality Check</Text>
            </View>
            <View style={styles.emptyStat}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              <Text style={styles.emptyStatText}>Document Review</Text>
            </View>
            <View style={styles.emptyStat}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.warning} />
              <Text style={styles.emptyStatText}>Final Approval</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header
        title="Project Overview"
        showBackButton
        rightComponent={
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
          renderItem={({ item }) => (
            <TabButton
              item={item}
              active={activeTab === item.id}
              onPress={() => setActiveTab(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {['Snags', 'Progress', 'Survey'].includes(activeTab) ? (
          <View style={{ flex: 1 }}>
            {activeTab === 'Survey' ? <Survey project={project} /> : renderTabContent()}
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
          >
            {activeTab === 'Overview' ? (
              <>
                {/* Progress Dashboard */}
                {renderProgressDashboard()}

                {/* Progress Cards */}
                <View style={styles.progressCardsContainer}>
                  <FlatList
                    data={progressData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.progressCardsContent}
                    renderItem={({ item }) => <ProgressCard {...item} />}
                    keyExtractor={(item) => item.title}
                  />
                </View>

                {/* Milestones Section */}
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={styles.sectionTitle}>Recent Tasks</Text>
                      <Text style={styles.sectionSubtitle}>
                        {milestones.filter(m => m.status === 'completed').length} of {milestones.length} completed
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewAllButton}
                      onPress={() => navigation.navigate('AllMilestones', { project, projectId: project._id || project.id })}
                    >
                      <Text style={styles.viewAllText}>View All</Text>
                      <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>

                  {milestones.slice(0, 5).map((milestone, index) => (
                    <MilestoneCard
                      key={milestone._id || index}
                      milestone={milestone}
                      index={index}
                      project={project}
                      navigation={navigation}
                    />
                  ))}
                </View>

                {/* Quick Stats Section */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Project Health</Text>
                  <View style={styles.statsGrid}>
                    <StatsCard
                      title="On Schedule"
                      value="95%"
                      icon="calendar-check"
                      color={COLORS.success}
                      trend={5}
                    />
                    <StatsCard
                      title="Budget Used"
                      value="78%"
                      icon="cash"
                      color={COLORS.primary}
                      trend={-2}
                    />
                    <StatsCard
                      title="Quality Score"
                      value="8.9"
                      icon="star"
                      color={COLORS.warning}
                      trend={3}
                    />
                    <StatsCard
                      title="Team Activity"
                      value="High"
                      icon="people"
                      color={COLORS.secondary}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.tabContent}>
                {renderTabContent()}
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  tabContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtonInactive: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: COLORS.surface,
  },
  tabButtonTextInactive: {
    color: COLORS.textSecondary,
  },
  glassCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  dashboardCard: {
    position: 'relative',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  dashboardMenu: {
    padding: 4,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dashboardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    position: 'absolute',
    right: 0,
    top: '25%',
    width: 1,
    height: '50%',
    backgroundColor: COLORS.border,
  },
  progressCardsContainer: {
    marginBottom: 20,
  },
  progressCardsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressCard: {
    width: screenWidth * 0.42,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  iconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  progressTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  progressMetricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  progressMetric: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  milestoneCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  milestoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  milestoneDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    position: 'relative',
  },
  progressBarGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  milestoneFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statsCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  emptyIconRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(0, 102, 255, 0.1)',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  emptyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  emptyStat: {
    alignItems: 'center',
    flex: 1,
  },
  emptyStatText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  tabContent: {
    padding: 16,
  },
  skeletonDashboard: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  skeletonCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  skeletonMilestones: {
    paddingHorizontal: 16,
  },
});

export default Overview;