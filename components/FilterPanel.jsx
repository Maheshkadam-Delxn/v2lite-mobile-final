import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterPanel = ({ visible, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    sortBy: 'Default',
    budgetRange: [25, 100],
    assignedTeam: {
      projectManager: false,
      consultant: false,
      contractor: false,
    },
    projectType: {
      villa: false,
      interior: false,
      commercialBuilding: false,
      residentialComplex: false,
    },
  });

  const COLORS = {
    primary: '#0066FF',
    primaryDark: '#0047CC',
    background: '#F5F7FA',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    white: '#FFFFFF',
    border: '#E0E0E0',
    lightGray: '#F0F2F5',
  };

  const sortOptions = ['Default', 'Start Date', 'Budget', 'Progress'];
  const projectTypes = [
    { key: 'villa', label: 'Villa' },
    { key: 'interior', label: 'Interior' },
    { key: 'commercialBuilding', label: 'Commercial Building' },
    { key: 'residentialComplex', label: 'Residential Complex' },
  ];

  const teamMembers = [
    { key: 'projectManager', label: 'Project Manager' },
    { key: 'consultant', label: 'Consultant' },
    { key: 'contractor', label: 'Contractor' },
  ];

  const handleSortSelect = (sortOption) => {
    setFilters(prev => ({ ...prev, sortBy: sortOption }));
  };

  const handleTeamToggle = (teamKey) => {
    setFilters(prev => ({
      ...prev,
      assignedTeam: {
        ...prev.assignedTeam,
        [teamKey]: !prev.assignedTeam[teamKey],
      },
    }));
  };

  const handleProjectTypeToggle = (typeKey) => {
    setFilters(prev => ({
      ...prev,
      projectType: {
        ...prev.projectType,
        [typeKey]: !prev.projectType[typeKey],
      },
    }));
  };

  const handleSelectAllProjectTypes = () => {
    const allSelected = Object.values(filters.projectType).every(Boolean);
    setFilters(prev => ({
      ...prev,
      projectType: {
        villa: !allSelected,
        interior: !allSelected,
        commercialBuilding: !allSelected,
        residentialComplex: !allSelected,
      },
    }));
  };

  const handleReset = () => {
    setFilters({
      sortBy: 'Default',
      budgetRange: [25, 100],
      assignedTeam: {
        projectManager: false,
        consultant: false,
        contractor: false,
      },
      projectType: {
        villa: false,
        interior: false,
        commercialBuilding: false,
        residentialComplex: false,
      },
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filter Projects</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort By Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort by</Text>
            <View style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    filters.sortBy === option && styles.sortOptionSelected,
                  ]}
                  onPress={() => handleSortSelect(option)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      filters.sortBy === option && styles.sortOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Range Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Range</Text>
            <View style={styles.budgetRange}>
              <Text style={styles.budgetText}>
                ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
              </Text>
            </View>
            <View style={styles.budgetSlider}>
              <View style={styles.budgetTrack} />
              <View style={[styles.budgetProgress, { width: '75%' }]} />
              <View style={styles.budgetThumb} />
            </View>
          </View>

          {/* Assigned Team Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Team</Text>
            <View style={styles.teamOptions}>
              {teamMembers.map((member) => (
                <TouchableOpacity
                  key={member.key}
                  style={styles.checkboxItem}
                  onPress={() => handleTeamToggle(member.key)}
                >
                  <View style={styles.checkbox}>
                    {filters.assignedTeam[member.key] && (
                      <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{member.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Project Type Section */}
          <View style={styles.section}>
            <View style={styles.projectTypeHeader}>
              <Text style={styles.sectionTitle}>Project Type</Text>
              <TouchableOpacity onPress={handleSelectAllProjectTypes}>
                <Text style={styles.selectAllText}>Select All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.projectTypeOptions}>
              {projectTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={styles.checkboxItem}
                  onPress={() => handleProjectTypeToggle(type.key)}
                >
                  <View style={styles.checkbox}>
                    {filters.projectType[type.key] && (
                      <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortOptionSelected: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  sortOptionTextSelected: {
    color: '#FFFFFF',
  },
  budgetRange: {
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  budgetSlider: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 8,
  },
  budgetTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  budgetProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#0066FF',
    borderRadius: 2,
  },
  budgetThumb: {
    position: 'absolute',
    top: -6,
    left: '75%',
    width: 16,
    height: 16,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  teamOptions: {
    gap: 12,
  },
  projectTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectAllText: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '500',
  },
  projectTypeOptions: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FilterPanel;