import BottomNavBar from 'components/BottomNavbar';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

const ProposalsListScreen = () => {
  const templates = [
    {
      id: 1,
      name: 'Anudan Office Template',
      category: 'Office',
      lastModified: '12/03/2025',
      number: '№20'
    },
    {
      id: 2,
      name: 'Anudan Home Template',
      category: 'Home',
      lastModified: '12/03/2025',
      number: '№20'
    },
    {
      id: 3,
      name: 'Anudan Business Template',
      category: 'Business',
      lastModified: '12/03/2025',
      number: '№20'
    }
  ];

  const TemplateCard = ({ template }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <Text style={styles.nameLabel}>Name:</Text>
        <Text style={styles.templateName}>{template.name}</Text>
      </View>
      
      <View style={styles.templateDetails}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <Text style={styles.categoryValue}>{template.category}</Text>
      </View>
      
      <View style={styles.templateDetails}>
        <Text style={styles.lastModifiedLabel}>Last Modified:</Text>
        <Text style={styles.lastModifiedValue}>
          {template.lastModified} {template.number}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Preview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.deleteButton]}>
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proposals Templates</Text>
      </View>

      {/* Error Section */}
      <View style={styles.errorSection}>
        <Text style={styles.errorTitle}>Error Template Name...</Text>
      </View>

      {/* Template List */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Template List</Text>
        
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </ScrollView>
      <BottomNavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  errorSection: {
    backgroundColor: '#fff3cd',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    marginTop: 8,
  },
  templateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  templateDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  lastModifiedLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  lastModifiedValue: {
    fontSize: 14,
    color: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#dc3545',
  },
});

export default ProposalsListScreen;