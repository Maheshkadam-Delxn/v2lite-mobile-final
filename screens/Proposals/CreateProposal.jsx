
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';

import Header from "../../components/Header";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// ==============================
// Cloudinary Configuration
// ==============================
const CLOUDINARY_CONFIG = {
  cloudName: "dmlsgazvr",
  apiKey: "353369352647425",
  apiSecret: "8qcz7uAdftDVFNd6IqaDOytg_HI",
};

// Generate Cloudinary Signature
const generateSignature = async (timestamp) => {
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    stringToSign
  );
};

// Upload to Cloudinary
const uploadToCloudinary = async (fileUri, fileType = "image") => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const formData = new FormData();
    const filename = fileUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;

    formData.append("file", {
      uri: fileUri,
      type: type,
      name: filename || `${fileType}_${Date.now()}.jpg`,
    });

    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", CLOUDINARY_CONFIG.apiKey);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    const text = await response.text();
    const data = JSON.parse(text);

    if (response.ok && data.secure_url) {
      return { success: true, url: data.secure_url };
    } else {
      return { success: false, error: data.error?.message };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const CreateProposalScreen = ({ navigation }) => {
  // FORM STATES
 const [name, setName] = useState("");
const route = useRoute();
const templateId = route.params?.templateId;

console.log("📌 Received Template ID:", templateId);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
 const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [description, setDescription] = useState("");


  // Date Picker
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState("");

  // Checklist Items
  const [proposalItems, setProposalItems] = useState([
    { id: 1, name: "Site Preparation & Excavation", checked: false },
    { id: 2, name: "Foundation & Structural Work", checked: false },
    { id: 3, name: "Masonry & Wall Construction", checked: false },
    { id: 4, name: "Roofing & Waterproofing", checked: false },
    { id: 5, name: "Electrical & Plumbing", checked: false },
    { id: 6, name: "Interior Finishing", checked: false },
    { id: 7, name: "Safety & Compliance Measures", checked: false },
  ]);

const [projectDocuments, setProjectDocuments] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const toggleItem = (id) => {
    setProposalItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    );
  };

  const randomColor = () => {
    const colors = ["#0066FF", "#FF3366", "#FF6B35", "#10B981", "#6366F1"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAttachmentsSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Gallery access needed.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      for (const file of result.assets) {
        const fileType = file.type === "image" ? "image" : "raw";

        const localFile = {
          id: Date.now() + Math.random(),
          name: `attachment_${Date.now()}`,
          url: file.uri,
          icon: fileType === "image" ? "🖼️" : "📄",
          color: randomColor(),
          progress: 0,
          isUploading: true,
        };

        setProjectDocuments((prev) => [localFile, ...prev]);
        setIsUploading(true);

        const upload = await uploadToCloudinary(file.uri, fileType);
        setIsUploading(false);

        if (upload.success) {
          setProjectDocuments((prev) =>
            prev.map((a) =>
              a.id === localFile.id
                ? { ...a, cloudinaryUrl: upload.url, progress: 100, isUploading: false, color: "#10B981" }
                : a
            )
          );
        } else {
          setProjectDocuments((prev) =>
            prev.map((a) =>
              a.id === localFile.id
                ? { ...a, error: upload.error, isUploading: false, color: "#EF4444" }
                : a
            )
          );
        }
      }
    }
  };

  const removeAttachment = (id) => {
    setProjectDocuments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDateConfirm = (selectedDate) => {
    const formatted = selectedDate.toISOString().split("T")[0];

    if (activePicker === "proposal") setDate(formatted);
    if (activePicker === "start") setStartDate(formatted);
    if (activePicker === "end") setEndDate(formatted);

    setPickerVisible(false);
  };

  // const handleSubmit = () => {
  //   const proposalData = {
  //     name,

  //     clientName,
  //     clientEmail,
  //     clientPhone,
  //     location,
  //     date,
  //     budget,
  //     startDate,
  //     endDate,
  //     description,
  //     status:"Proposal Under Approval",
  //     selectedItems: proposalItems
  //       .filter((i) => i.checked)
  //       .map((i) => i.name),
  //     projectDocuments: projectDocuments
  //       .filter((a) => a.cloudinaryUrl)
  //       .map((a) => a.cloudinaryUrl),
  //   };

  //   console.log("📌 FINAL PROPOSAL DATA");
  //   console.log(JSON.stringify(proposalData, null, 2));

  //   Alert.alert("Success", "Proposal data printed in console!");
  // };
const handleSubmit = async () => {
  const proposalData = {
    name,
    clientName,
    clientEmail,
    clientPhone,
    location,
    date,
    budget,
    startDate,
    endDate,
    description,
    status: "Proposal Under Approval",
      projectType: templateId,
    selectedItems: proposalItems.filter((i) => i.checked).map((i) => i.name),
    projectDocuments: projectDocuments
      .filter((a) => a.cloudinaryUrl)
      .map((a) => a.cloudinaryUrl),
  };

  console.log("📌 FINAL PROPOSAL DATA", proposalData);

  try {
    // 🔥 Get token from AsyncStorage
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      Alert.alert("Error", "User not authenticated. No token found.");
      return;
    }

    const response = await fetch("https://skystruct-lite-backend.vercel.app/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 SEND TOKEN HERE
      },
      body: JSON.stringify(proposalData),
    });

    const result = await response.json();
    console.log("📌 API RESPONSE:", result);

    if (response.ok) {
      Alert.alert("Success", "Proposal submitted successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", result.message || "Failed to submit proposal");
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    Alert.alert("Error", "Something went wrong while sending data.");
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <Header
        title="Create Proposal"
        showBackButton={true}
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BASIC INFO */}
        <View style={{ padding: 16 }}>
          <Text style={styles.heading}>Basic Information</Text>

          <View style={styles.card}>
       <Text style={styles.label}>Name</Text>
<TextInput style={styles.input} value={name} onChangeText={setName} />


            <Text style={styles.label}>Client Name</Text>
            <TextInput style={styles.input} value={clientName} onChangeText={setClientName} />

            <Text style={styles.label}>Client Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              value={clientEmail}
              onChangeText={setClientEmail}
            />

            <Text style={styles.label}>Client Phone</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={clientPhone}
              onChangeText={setClientPhone}
            />

            <Text style={styles.label}>Location</Text>
<TextInput
  style={styles.textarea}
  multiline
  value={location}
  onChangeText={setLocation}
/>


            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateRow}
              onPress={() => {
                setActivePicker("proposal");
                setPickerVisible(true);
              }}
            >
              <Text style={styles.dateValue}>{date || "Select date"}</Text>
              <Feather name="calendar" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PROJECT DETAILS */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.heading}>Project Details</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Budget</Text>
            <TextInput style={styles.input} value={budget} onChangeText={setBudget} />

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateRow}
                  onPress={() => {
                    setActivePicker("start");
                    setPickerVisible(true);
                  }}
                >
                  <Text style={styles.dateValue}>{startDate || "Select date"}</Text>
                  <Feather name="calendar" size={18} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateRow}
                  onPress={() => {
                    setActivePicker("end");
                    setPickerVisible(true);
                  }}
                >
                  <Text style={styles.dateValue}>{endDate || "Select date"}</Text>
                  <Feather name="calendar" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

           <Text style={styles.label}>Description</Text>
<TextInput
  style={styles.textarea}
  multiline
  value={description}
  onChangeText={setDescription}
/>

          </View>
        </View>

        {/* PROPOSAL ITEMS */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.heading}>Proposal Items</Text>

          <View style={styles.card}>
            {proposalItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkRow}
                onPress={() => toggleItem(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: item.checked ? "#0066FF" : "white",
                      borderColor: item.checked ? "#0066FF" : "#CCC",
                    },
                  ]}
                >
                  {item.checked && (
                    <Feather name="check" size={14} color="white" />
                  )}
                </View>
                <Text style={styles.checkLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ATTACHMENTS */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={styles.heading}>Attachments</Text>

          <View style={styles.card}>
            <TouchableOpacity
              onPress={handleAttachmentsSelect}
              disabled={isUploading}
              style={styles.uploadBox}
            >
              {isUploading ? (
                <ActivityIndicator color="#666" />
              ) : (
                <>
                  <View style={styles.uploadIcon}>
                    <Feather name="upload" size={22} color="#666" />
                  </View>
                  <Text style={styles.uploadText}>Browse files to upload</Text>
                </>
              )}
            </TouchableOpacity>

            {projectDocuments.map((file) => (
              <View key={file.id} style={{ marginBottom: 14 }}>
                <View style={styles.fileRow}>
                  <View
                    style={[
                      styles.fileIcon,
                      { backgroundColor: file.color },
                    ]}
                  >
                    {file.isUploading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={{ fontSize: 18 }}>
                        {file.error ? "!" : file.icon}
                      </Text>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName}>{file.name}</Text>

                    {file.cloudinaryUrl && (
                      <Text style={styles.successText}>Uploaded ✓</Text>
                    )}

                    {file.error && (
                      <Text style={styles.errorText}>Upload Failed</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    disabled={file.isUploading}
                    onPress={() => removeAttachment(file.id)}
                  >
                    <Feather name="x" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${file.progress}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isUploading}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>
              {isUploading ? "Uploading..." : "Proceed"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========================== DATE PICKER ========================== */}
      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = {
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0066FF",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 8,
    marginBottom: 16,
  },
  textarea: {
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 60,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateValue: {
    fontSize: 14,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkLabel: {
    fontSize: 14,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    borderRadius: 10,
    marginBottom: 16,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  uploadText: {
    color: "#666",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 13,
    fontWeight: "500",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    marginLeft: 52,
    marginTop: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0066FF",
  },
  successText: {
    color: "#10B981",
    fontSize: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#E9EFFF",
    padding: 14,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#0066FF",
    fontWeight: "600",
  },
  proceedBtn: {
    flex: 1,
    backgroundColor: "#0066FF",
    padding: 14,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  proceedText: {
    color: "white",
    fontWeight: "600",
  },
};

export default CreateProposalScreen;
