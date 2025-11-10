import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const MaterialsListScreen = () => {
  const [activeMainTab, setActiveMainTab] = useState('Material');
  const [activeSubTab, setActiveSubTab] = useState('Inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const mainTabs = [
    { id: 'Tasks', label: 'Tasks' },
    { id: 'Transactions', label: 'Transactions' },
    { id: 'Material', label: 'Material' },
    { id: 'Attendance', label: 'Attendance' },
  ];

  const subTabs = [
    { id: 'Inventory', label: 'Inventory' },
    { id: 'Request', label: 'Request' },
    { id: 'Received', label: 'Received' },
    { id: 'Used', label: 'Used' },
  ];

  // Mock Data
  const materials = [
    { id: '1', name: 'Test Material', date: '30 v04', stock: 15 },
    { id: '2', name: 'Test2 Material', date: '12 v02', stock: 10 },
    { id: '3', name: 'Test2 Material', date: '01 v01', stock: 10 },
    { id: '4', name: '1R Material', date: '11 v00', stock: 10 },
  ];

  const filteredMaterials = materials.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMainTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.mainTab,
        activeMainTab === item.id ? styles.mainTabActive : styles.mainTabInactive,
      ]}
      onPress={() => setActiveMainTab(item.id)}
    >
      <Text
        style={[
          styles.mainTabText,
          activeMainTab === item.id ? styles.mainTabTextActive : styles.mainTabTextInactive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSubTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.subTab,
        activeSubTab === item.id ? styles.subTabActive : null,
      ]}
      onPress={() => setActiveSubTab(item.id)}
    >
      <Text
        style={[
          styles.subTabText,
          activeSubTab === item.id ? styles.subTabTextActive : styles.subTabTextInactive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderMaterialItem = ({ item }) => (
    <View style={styles.materialItem}>
      <View style={styles.materialLeft}>
        <View style={styles.materialIcon}>
          <MaterialCommunityIcons name="cube-outline" size={24} color="#0066FF" />
        </View>
        <View>
          <Text style={styles.materialName}>{item.name}</Text>
          <Text style={styles.materialDate}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.materialStock}>{item.stock}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
   

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Header Row */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Material</Text>
        <Text style={styles.listHeaderText}>In Stock</Text>
      </View>

      {/* Material List */}
      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, styles.fabUsed]}>
          <Text style={styles.fabText}>- Used</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabMaterial]}>
          <Text style={styles.fabText}>+ Material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabReceived]}>
          <Text style={styles.fabText}>+ Received</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0066FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  bellIcon: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 4,
  },
  mainTabBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mainTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  mainTabActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  mainTabInactive: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  mainTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mainTabTextActive: {
    color: 'white',
  },
  mainTabTextInactive: {
    color: '#6B7280',
  },
  subTabBar: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  subTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 6,
  },
  subTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066FF',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subTabTextActive: {
    color: '#0066FF',
  },
  subTabTextInactive: {
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  materialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  materialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  materialDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  materialStock: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  fabUsed: {
    backgroundColor: '#FECACA',
  },
  fabMaterial: {
    backgroundColor: '#BFDBFE',
  },
  fabReceived: {
    backgroundColor: '#BBF7D0',
  },
  fabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default MaterialsListScreen;