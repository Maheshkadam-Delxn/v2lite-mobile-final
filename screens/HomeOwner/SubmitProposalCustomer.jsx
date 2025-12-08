import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Header from 'components/Header';
import * as DocumentPicker from 'expo-document-picker';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOUDINARY = {
  cloudName: "dmlsgazvr",
  apiKey: "353369352647425",
  apiSecret: "8qcz7uAdftDVFNd6IqaDOytg_HI",
};
//const API_URL = 'https://skystruct-lite-backend.vercel.app/api/projects';

const API_URL = `${process.env.BASE_API_URL}/api/projects`;
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY.apiSecret}`;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
};

const uploadToCloudinary = async (fileUri, fileType) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await generateSignature(timestamp);
    const fileName = `doc_${Date.now()}.pdf`;

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: fileType,
      name: fileName,
    });
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", CLOUDINARY.apiKey);

    const uploadURL = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/raw/upload`;
    const response = await fetch(uploadURL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return { success: true, url: data.secure_url };
    } else {
      return { success: false, error: data.error?.message || "Upload failed" };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const SubmitProposalCustomer = ({ navigation, route }) => {
  const { templateData } = route.params || {};
  const [proposalData, setProposalData] = useState();
  
  useEffect(() => {
    if (templateData) {
      setProposalData(templateData);
    }
  }, [templateData]);

  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [location, setLocation] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");

useEffect(() => {
  const fetchUserData = async () => {
    const userdata = await AsyncStorage.getItem("userData");

    if (!userdata) return;

    const parsedUser = JSON.parse(userdata); // ✔ convert string → object

    console.log("Parsed User:", parsedUser);
    console.log("User Name:", parsedUser.name);

    setClientName(parsedUser.name);
    setClientEmail(parsedUser.email) // ✔ correct
  };

  fetchUserData();
}, []);

  const handleDocumentPick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (result.canceled) return;

    const picked = result.assets[0];
    const newDoc = {
      id: Date.now(),
      name: picked.name,
      localUri: picked.uri,
      cloudinaryUrl: null,
      uploading: true,
      error: null,
    };

    setDocuments((prev) => [...prev, newDoc]);
    setUploading(true);

    const uploadRes = await uploadToCloudinary(picked.uri, picked.mimeType);
    setUploading(false);

    if (uploadRes.success) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? { ...d, cloudinaryUrl: uploadRes.url, uploading: false }
            : d
        )
      );
    } else {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? { ...d, uploading: false, error: uploadRes.error }
            : d
        )
      );
      Alert.alert("Upload Failed", uploadRes.error);
    }
  };

  const removeDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

// const handleSubmit = () => {
//   if (!projectName || !clientName || !clientEmail) {
//     Alert.alert("Required Fields", "Please fill in all required fields.");
//     return;
//   }

//   const payload = {
//     projectType: proposalData?.id,
//     templateName: proposalData?.title,
//     templateCategory: proposalData?.category,
//     templateItems: proposalData?.items,
//     name:projectName,
//     clientName,
//     clientEmail,
//     clientPhone,
//     location,
//     projectDocuments:documents,
//      description:note,
//     status:"Proposal Under Approval"
//   };

//   console.log("====== FINAL SUBMISSION DATA ======");
//   console.log(payload);


 
// };

const handleSubmit = async () => {
  if (!projectName || !clientName || !clientEmail) {
    Alert.alert("Required Fields", "Please fill in all required fields.");
    return;
  }

  const payload = {
    projectType: proposalData?.id,
    templateName: proposalData?.title,
    templateCategory: proposalData?.category,
    templateItems: proposalData?.items,
    name: projectName,
    clientName,
    clientEmail,
    clientPhone,
    location,
    projectDocuments: documents,
    description: note,
    status: "Proposal Under Approval",
  };

  console.log("====== FINAL SUBMISSION DATA ======");
  console.log(payload);

  try {
  const token = await AsyncStorage.getItem('userToken');
  console.log("token",token);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("==== API RESPONSE ====");
    console.log(data);

    if (response.ok) {
      Alert.alert("Success", "Proposal submitted successfully!");
      //navigation.navigate("ViewCustomerProposal", { payload: data });
    } else {
      Alert.alert("Error", data.message || "Something went wrong.");
    }

  } catch (error) {
    console.log("API ERROR:", error);
    Alert.alert("Network Error", "Unable to submit proposal.");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Submit Proposal" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Template Info Card */}
        {proposalData && (
          <View style={styles.templateCard}>
            <View style={styles.templateIconContainer}>
              <Feather name="file-text" size={24} color="#0066FF" />
            </View>
            <View style={styles.templateInfo}>
              <Text style={styles.templateLabel}>Selected Template</Text>
              <Text style={styles.templateTitle}>{proposalData.title}</Text>
            </View>
          </View>
        )}

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Project Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Project Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="briefcase" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter project name"
                placeholderTextColor="#999"
                value={projectName}
                onChangeText={setProjectName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Location 
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter project location"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Client Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Client Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter client's name"
                placeholderTextColor="#999"
                value={clientName}
                  editable={false}
                onChangeText={setClientName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="client@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                  editable={false}   
                autoCapitalize="none"
                value={clientEmail}
                onChangeText={setClientEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="phone" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={clientPhone}
                onChangeText={setClientPhone}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
  <Text style={styles.label}>
    Note 
  </Text>
  <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingTop: 12 }]}>
    <Feather name="edit-2" size={18} color="#666" style={styles.inputIcon} />
    <TextInput
      style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
      placeholder="Write additional notes..."
      placeholderTextColor="#999"
      value={note}
      onChangeText={setNote}
      multiline
    />
  </View>
</View>

        </View>

        {/* Documents Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Supporting Documents</Text>
          <Text style={styles.sectionSubtitle}>
            Upload any relevant files or documents
          </Text>

          <TouchableOpacity
            onPress={handleDocumentPick}
            style={styles.uploadButton}
            disabled={uploading}
            activeOpacity={0.7}
          >
            {uploading ? (
              <ActivityIndicator color="#0066FF" />
            ) : (
              <>
                <View style={styles.uploadIconContainer}>
                  <Feather name="upload-cloud" size={24} color="#0066FF" />
                </View>
                <Text style={styles.uploadButtonText}>Choose Document</Text>
                <Text style={styles.uploadButtonSubtext}>PDF, DOC, XLS, or any file type</Text>
              </>
            )}
          </TouchableOpacity>

          {documents.length > 0 && (
            <View style={styles.documentsContainer}>
              {documents.map((doc) => (
                <View key={doc.id} style={styles.docCard}>
                  <View style={styles.docIconContainer}>
                    <Feather 
                      name={doc.uploading ? "loader" : doc.cloudinaryUrl ? "check-circle" : "file"} 
                      size={20} 
                      color={doc.uploading ? "#666" : doc.cloudinaryUrl ? "#10B981" : "#0066FF"} 
                    />
                  </View>
                  
                  <View style={styles.docInfo}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    
                    {doc.uploading && (
                      <Text style={styles.docStatus}>Uploading...</Text>
                    )}
                    
                    {doc.cloudinaryUrl && (
                      <Text style={styles.docStatusSuccess}>Upload complete</Text>
                    )}
                    
                    {doc.error && (
                      <Text style={styles.docStatusError}>{doc.error}</Text>
                    )}
                  </View>

                  <TouchableOpacity 
                    onPress={() => removeDocument(doc.id)}
                    style={styles.removeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="x" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit Proposal</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  templateCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#0066FF",
  },
  templateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E9EFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateLabel: {
    fontFamily: "Urbanist-Medium",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  templateTitle: {
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
    color: "#0F172A",
  },
  formSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: "Urbanist-Bold",
    fontSize: 18,
    color: "#0F172A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "Urbanist-Regular",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  optional: {
    fontFamily: "Urbanist-Regular",
    fontSize: 12,
    color: "#94A3B8",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Urbanist-Regular",
    fontSize: 15,
    color: "#0F172A",
  },
  uploadButton: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E9EFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadButtonText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 16,
    color: "#0066FF",
    marginTop: 8,
  },
  uploadButtonSubtext: {
    fontFamily: "Urbanist-Regular",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },
  documentsContainer: {
    marginTop: 16,
  },
  docCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  docIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 4,
  },
  docStatus: {
    fontFamily: "Urbanist-Regular",
    fontSize: 12,
    color: "#64748B",
  },
  docStatusSuccess: {
    fontFamily: "Urbanist-Medium",
    fontSize: 12,
    color: "#10B981",
  },
  docStatusError: {
    fontFamily: "Urbanist-Regular",
    fontSize: 12,
    color: "#EF4444",
  },
  removeButton: {
    padding: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: "#0066FF",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: "Urbanist-Bold",
    fontSize: 16,
    color: "#FFF",
    marginRight: 8,
  },
});

export default SubmitProposalCustomer;