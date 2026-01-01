// FilesTab.js - Add TouchableOpacity import
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity, // Add this import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#0066FF",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  white: "#FFFFFF",
};

const FilesTab = () => {
  const files = [
    { name: "Architectural Plans.pdf", size: "2.4 MB", date: "Jan 15, 2024", type: "pdf" },
    { name: "Structural Drawings.dwg", size: "5.7 MB", date: "Jan 18, 2024", type: "dwg" },
    { name: "Budget Estimate.xlsx", size: "1.2 MB", date: "Feb 01, 2024", type: "excel" },
    { name: "Project Timeline.pptx", size: "3.1 MB", date: "Feb 10, 2024", type: "ppt" },
    { name: "Site Photos.zip", size: "15.8 MB", date: "Mar 05, 2024", type: "zip" },
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'document-text';
      case 'dwg': return 'cube';
      case 'excel': return 'document';
      case 'ppt': return 'document';
      case 'zip': return 'archive';
      default: return 'document';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Project Files & Documents</Text>
      <View style={styles.card}>
        {files.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            <View style={styles.fileIcon}>
              <Ionicons name={getFileIcon(file.type)} size={20} color={COLORS.primary} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileDetails}>{file.size} • {file.date}</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 18,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F2F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  fileDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  downloadButton: {
    padding: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default FilesTab;