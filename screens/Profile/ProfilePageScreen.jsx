import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';

const API_URL = 'https://skystruct-lite-backend.vercel.app/api/users';

const ProfilePageScreen = () => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      console.log('[Profile] 🔄 Fetching user data...');
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userData');

      if (!token || !userInfo) {
        console.log('[Profile] ⚠️ No token or user data found');
        return;
      }

      const parsedUser = JSON.parse(userInfo);
      const userId = parsedUser?._id || parsedUser?.id;

      console.log('[Profile] 👤 User ID:', userId);

      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[Profile] 🌐 Status:', response.status);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const json = await response.json();
      console.log('[Profile] ✅ User Data Response:', json);
      setUserData(json?.data);
    } catch (error) {
      console.error('[Profile] ❌ Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            console.log('✅ User logged out successfully');
            navigation.navigate('Auth');
          } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'Something went wrong while logging out.');
          }
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    showArrow = true,
    rightText = null,
    isSwitch = false,
    switchValue = false,
    onSwitchToggle = null,
    isLogout = false,
    iconBg = '#F0F4FF',
    iconColor = '#4A7CFF',
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-5 bg-white"
      activeOpacity={0.7}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{
            backgroundColor: isLogout ? '#FFF0F0' : iconBg,
          }}
        >
          <Feather
            name={icon}
            size={20}
            color={isLogout ? '#FF3B30' : iconColor}
          />
        </View>
        <Text
          style={{ fontFamily: 'Urbanist-SemiBold' }}
          className={`ml-4 text-base ${
            isLogout ? 'text-[#FF3B30]' : 'text-[#1C1C1E]'
          }`}
        >
          {title}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          trackColor={{ false: '#E5E5EA', true: '#4A7CFF' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E5EA"
          onValueChange={onSwitchToggle}
          value={switchValue}
        />
      ) : (
        <View className="flex-row items-center">
          {rightText && (
            <Text
              style={{ fontFamily: 'Urbanist-Medium' }}
              className="text-sm text-[#8E8E93] mr-2"
            >
              {rightText}
            </Text>
          )}
          {showArrow && (
            <Feather name="chevron-right" size={20} color="#C7C7CC" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <View className="px-5 py-3">
      <Text
        style={{ fontFamily: 'Urbanist-Bold' }}
        className="text-xs text-[#8E8E93] uppercase tracking-wider"
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FD]" edges={['bottom']}>
      <Header title="Profile" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A7CFF']}
            tintColor="#4A7CFF"
          />
        }
      >
        {/* Modern Profile Card */}
        <View className="mx-4 mt-4 mb-6">
          <View
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              shadowColor: '#4A7CFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Gradient Background */}
            <LinearGradient
              colors={['#4A7CFF', '#6B93FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-24"
            />
            
            {/* Profile Content */}
            <View className="px-5 pb-6" style={{ marginTop: -40 }}>
              <View className="flex-row items-end">
                <View
                  className="w-20 h-20 rounded-full bg-white p-1"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        userData?.profilePhoto ||
                        'https://ui-avatars.com/api/?name=' +
                          encodeURIComponent(userData?.name || 'User') +
                          '&background=4A7CFF&color=fff&size=200',
                    }}
                    className="w-full h-full rounded-full"
                  />
                </View>
                
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfileScreen')}
                  className="ml-auto mb-1 bg-[#4A7CFF] rounded-full px-5 py-2.5 flex-row items-center"
                  activeOpacity={0.8}
                >
                  <Feather name="edit-2" size={14} color="#FFFFFF" />
                  <Text
                    style={{ fontFamily: 'Urbanist-Bold' }}
                    className="text-white text-sm ml-2"
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View className="mt-3">
                <Text
                  style={{ fontFamily: 'Urbanist-Bold' }}
                  className="text-xl text-[#1C1C1E]"
                >
                  {userData?.name || 'Loading...'}
                </Text>
                <Text
                  style={{ fontFamily: 'Urbanist-Medium' }}
                  className="text-sm text-[#8E8E93] mt-1"
                >
                  {userData?.email || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Signature Card */}
        {userData?.signatureUrl && (
          <View className="mx-4 mb-6">
            <View
              className="bg-white rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text
                style={{ fontFamily: 'Urbanist-Bold' }}
                className="text-base text-[#1C1C1E] mb-3"
              >
                Digital Signature
              </Text>
              <View className="bg-[#F8F9FD] rounded-xl p-4 border border-[#E5E5EA]">
                <Image
                  source={{ uri: userData.signatureUrl }}
                  className="w-full h-24"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}

        {/* Account Section */}
        <SectionHeader title="Account" />
        <View
          className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <MenuItem
            icon="user"
            title="Personal Info"
            onPress={() => navigation.navigate('EditProfileScreen')}
            iconBg="#F0F4FF"
            iconColor="#4A7CFF"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="users"
            title="User Management"
            onPress={() => navigation.navigate('UsersList')}
            iconBg="#FFF0F5"
            iconColor="#FF3B8F"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="briefcase"
            title="Vendor Management"
            onPress={() => navigation.navigate('Vendors')}
            iconBg="#F0FFF4"
            iconColor="#22C55E"
          />
        </View>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        <View
          className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <MenuItem
            icon="bell"
            title="Notifications"
            onPress={() => navigation.navigate('Notification')}
            iconBg="#FFF9E6"
            iconColor="#F59E0B"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="shield"
            title="Security"
            onPress={() => navigation.navigate('Security')}
            iconBg="#F0F0FF"
            iconColor="#8B5CF6"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="globe"
            title="Language"
            rightText="English (US)"
            onPress={() => navigation.navigate('Language')}
            iconBg="#E6F7FF"
            iconColor="#06B6D4"
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="Support" />
        <View
          className="mx-4 mb-4 bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <MenuItem
            icon="help-circle"
            title="Help Center"
            onPress={() => navigation.navigate('CustomerSupport')}
            iconBg="#F0F9FF"
            iconColor="#3B82F6"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="lock"
            title="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
            iconBg="#FFF5F5"
            iconColor="#EF4444"
          />
          <View className="h-[0.5px] bg-[#E5E5EA] ml-[70px]" />
          <MenuItem
            icon="info"
            title="About Skystruct"
            onPress={() => navigation.navigate('AboutSkystruct')}
            iconBg="#F5F3FF"
            iconColor="#A855F7"
          />
        </View>

        {/* Logout Button */}
        <View
          className="mx-4 mb-8 bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#FF3B30',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <MenuItem
            icon="log-out"
            title="Logout"
            showArrow={false}
            isLogout={true}
            onPress={handleLogout}
          />
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePageScreen;