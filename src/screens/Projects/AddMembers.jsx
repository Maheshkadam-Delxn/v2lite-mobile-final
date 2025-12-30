import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '@/components/Header';

const AddMembers = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project } = route.params || {};

  const [activeTab, setActiveTab] = useState('Users');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleBack = () => navigation.goBack();

  const handleEdit = () => {
    console.log('Edit project:', project?.id);
    navigation.navigate('CreateProjectScreen');
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const projectData = {
    groups: [
      { id: 1, name: 'Design Team', memberCount: 8 },
      { id: 2, name: 'Development Team', memberCount: 12 },
      { id: 3, name: 'QA Team', memberCount: 5 },
      { id: 4, name: 'Marketing Team', memberCount: 6 },
    ],
    users: [
      { id: 1, name: 'Aum Mishra', role: 'Manager' },
      { id: 2, name: 'Priya Sharma', role: 'Developer' },
      { id: 3, name: 'Rahul Kumar', role: 'Designer' },
      { id: 4, name: 'Neha Patel', role: 'Tester' },
    ],
  };

  const tabs = [
    { id: 'Users', label: 'Users' },
    { id: 'Groups', label: 'Groups' },
  ];

  const GroupContainer = ({ group, isSelected, onToggle }) => (
    <TouchableOpacity 
      style={[
        styles.groupContainer,
        isSelected && styles.containerSelected
      ]} 
      onPress={() => onToggle(group.id)}
    >
      <View style={styles.groupHeader}>
        <Image
          source={{ uri: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80' }}
          style={styles.groupAvatar}
        />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupMembers}>{group.memberCount} members</Text>
        </View>
        <View style={[styles.checkmarkContainer, isSelected && styles.checkmarkContainerSelected]}>
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const UserContainer = ({ user, isSelected, onToggle }) => (
    <TouchableOpacity 
      style={[
        styles.userContainer,
        isSelected && styles.containerSelected
      ]} 
      onPress={() => onToggle(user.id)}
    >
      <View style={styles.userHeader}>
        <Image
          source={{ uri: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80' }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
        <View style={[styles.checkmarkContainer, isSelected && styles.checkmarkContainerSelected]}>
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    if (activeTab === 'Users') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Select Users to Add</Text>
          {projectData.users.map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onToggle={toggleUserSelection}
            />
          ))}
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Select Groups to Add</Text>
        {projectData.groups.map((group) => (
          <GroupContainer
            key={group.id}
            group={group}
            isSelected={selectedGroups.includes(group.id)}
            onToggle={toggleGroupSelection}
          />
        ))}
      </View>
    );
  };

  const renderTab = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
      style={[
        styles.tab,
        activeTab === item.id && styles.tabActive,
        item.id === 'Users' ? styles.tabLeft : styles.tabRight,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === item.id && styles.tabTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Add Members"
        showBackButton={true}
        onBackPress={handleBack}
        onRightIconPress={handleEdit}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabBarContainer}>
          <FlatList
            data={tabs}
            renderItem={renderTab}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
          />
        </View>

        {/* Tab content */}
        {renderTabContent()}
      </ScrollView>

      {/* Add Button */}
      {(selectedUsers.length > 0 || selectedGroups.length > 0) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>
              Add {selectedUsers.length + selectedGroups.length} {activeTab === 'Users' ? 'Users' : 'Groups'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  scrollView: { 
    flex: 1 
  },

  // Tab bar
  tabBarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBarContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  tabLeft: { 
    alignSelf: 'flex-start' 
  },
  tabRight: { 
    alignSelf: 'flex-end' 
  },
  tabActive: { 
    borderBottomWidth: 3, 
    borderBottomColor: '#0066FF' 
  },
  tabText: { 
    fontSize: 16, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
  tabTextActive: { 
    color: '#0066FF', 
    fontWeight: '600' 
  },

  // Tab content
  tabContent: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    marginLeft: 8,
  },

  // User Container
  userContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Group Container
  groupContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Selection Styles
  containerSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
  },

  // Checkmark Styles
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainerSelected: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Add Button
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddMembers;