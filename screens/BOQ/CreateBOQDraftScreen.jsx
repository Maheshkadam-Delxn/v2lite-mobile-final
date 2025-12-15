
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import React, { useState } from "react";
// import { Feather } from "@expo/vector-icons";
// import Header from "../../components/Header";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = `${process.env.BASE_API_URL}`;

// export default function CreateBOQDraftScreen({ navigation ,route}) {
//   const {project} = route?.params;
//   console.log("asdfe",project);
//   const projectId=project._id;
//   console.log(projectId)
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     builtUpArea: "",
//     structuralType: "",
//     foundationType: "",
//     laborCost: "",
//     miscCost: "",
//     contingency: "",
//   });

//   const [materials, setMaterials] = useState([
//     { name: "", qty: "", unit: "", rate: "" },
//   ]);

//   const updateForm = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const addMaterial = () => {
//     setMaterials((prev) => [...prev, { name: "", qty: "", unit: "", rate: "" }]);
//   };

//   const updateMaterial = (index, key, value) => {
//     const updated = [...materials];
//     updated[index][key] = value;
//     setMaterials(updated);
//   };

//   const deleteMaterial = (index) => {
//     setMaterials((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSaveBOQ = async () => {
//     if (!form.builtUpArea) {
//       Alert.alert("Error", "Built-up area is required");
//       return;
//     }

//     setLoading(true);
//     const payload={
//         ...form,materials
//     }
//     console.log(payload);

//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       const response = await fetch(`${API_URL}/api/boq`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           projectId,
//           ...form,
//           materials,
//         }),
//       });

//       const json = await response.json();

//       if (!response.ok) {
//         throw new Error(json.message || "Failed to save BOQ");
//       }

//       Alert.alert("Success", "BOQ draft saved!");
//    navigation.goBack();
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInput = (label, key, placeholder, keyboard = "default") => (
//     <View style={styles.inputContainer}>
//       <Text style={[styles.label, { fontFamily: "Urbanist-SemiBold" }]}>
//         {label}
//       </Text>
//       <TextInput
//         placeholder={placeholder}
//         placeholderTextColor="#94A3B8"
//         keyboardType={keyboard}
//         style={[styles.input, { fontFamily: "Urbanist-Regular" }]}
//         value={form[key]}
//         onChangeText={(text) => updateForm(key, text)}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header title="Create BOQ Draft" showBackButton={true} />

//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Project Information Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Feather name="home" size={20} color="#235DFF" />
//             <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
//               Project Information
//             </Text>
//           </View>

//           {renderInput("Built-Up Area (sqft)", "builtUpArea", "Enter area in sqft", "numeric")}
//           {renderInput("Structural Type", "structuralType", "RCC / Load Bearing / Hybrid")}
//           {renderInput("Foundation Type", "foundationType", "Shallow / Deep / Raft")}
//         </View>

//         {/* Materials Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Feather name="package" size={20} color="#235DFF" />
//             <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
//               Material Requirements
//             </Text>
//           </View>

//           {materials.map((material, index) => (
//             <View key={index} style={styles.materialCard}>
//               <View style={styles.materialHeader}>
//                 <Text style={[styles.materialTitle, { fontFamily: "Urbanist-SemiBold" }]}>
//                   Material {index + 1}
//                 </Text>
//                 {materials.length > 1 && (
//                   <TouchableOpacity
//                     onPress={() => deleteMaterial(index)}
//                     style={styles.deleteButton}
//                   >
//                     <Feather name="trash-2" size={18} color="#EF4444" />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <TextInput
//                 placeholder="Material Name"
//                 placeholderTextColor="#94A3B8"
//                 style={[styles.materialInput, { fontFamily: "Urbanist-Regular" }]}
//                 value={material.name}
//                 onChangeText={(val) => updateMaterial(index, "name", val)}
//               />

//               <View style={styles.row}>
//                 <TextInput
//                   placeholder="Quantity"
//                   keyboardType="numeric"
//                   placeholderTextColor="#94A3B8"
//                   style={[styles.materialInputHalf, { fontFamily: "Urbanist-Regular" }]}
//                   value={material.qty}
//                   onChangeText={(val) => updateMaterial(index, "qty", val)}
//                 />
//                 <TextInput
//                   placeholder="Unit"
//                   placeholderTextColor="#94A3B8"
//                   style={[styles.materialInputHalf, { fontFamily: "Urbanist-Regular" }]}
//                   value={material.unit}
//                   onChangeText={(val) => updateMaterial(index, "unit", val)}
//                 />
//               </View>

//               <TextInput
//                 placeholder="Rate (₹)"
//                 keyboardType="numeric"
//                 placeholderTextColor="#94A3B8"
//                 style={[styles.materialInput, { fontFamily: "Urbanist-Regular" }]}
//                 value={material.rate}
//                 onChangeText={(val) => updateMaterial(index, "rate", val)}
//               />
//             </View>
//           ))}

//           <TouchableOpacity style={styles.addButton} onPress={addMaterial}>
//             <Feather name="plus-circle" size={20} color="#235DFF" />
//             <Text style={[styles.addButtonText, { fontFamily: "Urbanist-SemiBold" }]}>
//               Add Material
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Cost Details Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Feather name="dollar-sign" size={20} color="#235DFF" />
//             <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
//               Cost Details
//             </Text>
//           </View>

//           {renderInput("Labor Cost (₹)", "laborCost", "Enter labor cost", "numeric")}
//           {renderInput("Miscellaneous Cost (₹)", "miscCost", "Enter misc cost", "numeric")}
//           {renderInput("Contingency (%)", "contingency", "Enter percentage", "numeric")}
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Save Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.saveButton, loading && styles.saveButtonDisabled]}
//           onPress={handleSaveBOQ}
//           disabled={loading}
//         >
//           <Feather name={loading ? "loader" : "save"} size={20} color="white" />
//           <Text style={[styles.saveButtonText, { fontFamily: "Urbanist-Bold" }]}>
//             {loading ? "Saving..." : "Save BOQ Draft"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   section: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: "#1E293B",
//     marginLeft: 10,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     color: "#475569",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: "#1E293B",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   materialCard: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   materialHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   materialTitle: {
//     fontSize: 16,
//     color: "#1E293B",
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   materialInput: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: "#1E293B",
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   materialInputHalf: {
//     flex: 1,
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: "#1E293B",
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   addButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#EFF6FF",
//     borderRadius: 12,
//     paddingVertical: 14,
//     borderWidth: 1,
//     borderColor: "#DBEAFE",
//     borderStyle: "dashed",
//   },
//   addButtonText: {
//     fontSize: 15,
//     color: "#235DFF",
//     marginLeft: 8,
//   },
//   footer: {
//     backgroundColor: "white",
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#E2E8F0",
//   },
//   saveButton: {
//     backgroundColor: "#235DFF",
//     borderRadius: 12,
//     paddingVertical: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#235DFF",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   saveButtonDisabled: {
//     backgroundColor: "#94A3B8",
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 16,
//     marginLeft: 8,
//   },
// });


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.BASE_API_URL}`;

export default function CreateBOQDraftScreen({ navigation, route }) {
  const { project } = route?.params;
  const projectId = project?._id;

  const [loading, setLoading] = useState(false);

  // -------------------------
  // UPDATED FORM WITH BOQ NAME
  // -------------------------
  const [form, setForm] = useState({
    boqName: "",            // <-- NEW FIELD
    builtUpArea: "",
    structuralType: "",
    foundationType: "",
    laborCost: "",
    miscCost: "",
    contingency: "",
  });

  const [materials, setMaterials] = useState([
    { name: "", qty: "", unit: "", rate: "" },
  ]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addMaterial = () => {
    setMaterials((prev) => [...prev, { name: "", qty: "", unit: "", rate: "" }]);
  };

  const updateMaterial = (index, key, value) => {
    const updated = [...materials];
    updated[index][key] = value;
    setMaterials(updated);
  };

  const deleteMaterial = (index) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveBOQ = async () => {
    if (!form.boqName) {
      Alert.alert("Error", "BOQ Name is required");
      return;
    }
    if (!form.builtUpArea) {
      Alert.alert("Error", "Built-up area is required");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      const user = JSON.parse(userData);

      const response = await fetch(`${API_URL}/api/boq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          projectId,
          ...form,
          materials,
          createdBy: user?._id, // REQUIRED
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to save BOQ");
      }

      Alert.alert("Success", "BOQ draft saved!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, key, placeholder, keyboard = "default") => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { fontFamily: "Urbanist-SemiBold" }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboard}
        style={[styles.input, { fontFamily: "Urbanist-Regular" }]}
        value={form[key]}
        onChangeText={(text) => updateForm(key, text)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Create BOQ Draft" showBackButton={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* -----------------------------
            PROJECT INFORMATION SECTION
        ------------------------------- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="home" size={20} color="#235DFF" />
            <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
              Project Information
            </Text>
          </View>

          {/* NEW FIELD: BOQ NAME */}
          {renderInput("BOQ Name", "boqName", "Enter BOQ Name")}

          {renderInput("Built-Up Area (sqft)", "builtUpArea", "Enter area in sqft", "numeric")}
          {renderInput("Structural Type", "structuralType", "RCC / Load Bearing / Hybrid")}
          {renderInput("Foundation Type", "foundationType", "Shallow / Deep / Raft")}
        </View>

        {/* -----------------------------
             MATERIAL REQUIREMENTS
        ------------------------------- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="package" size={20} color="#235DFF" />
            <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
              Material Requirements
            </Text>
          </View>

          {materials.map((material, index) => (
            <View key={index} style={styles.materialCard}>
              <View style={styles.materialHeader}>
                <Text style={[styles.materialTitle, { fontFamily: "Urbanist-SemiBold" }]}>
                  Material {index + 1}
                </Text>
                {materials.length > 1 && (
                  <TouchableOpacity onPress={() => deleteMaterial(index)} style={styles.deleteButton}>
                    <Feather name="trash-2" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                placeholder="Material Name"
                placeholderTextColor="#94A3B8"
                style={[styles.materialInput, { fontFamily: "Urbanist-Regular" }]}
                value={material.name}
                onChangeText={(val) => updateMaterial(index, "name", val)}
              />

              <View style={styles.row}>
                <TextInput
                  placeholder="Quantity"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  style={[styles.materialInputHalf, { fontFamily: "Urbanist-Regular" }]}
                  value={material.qty}
                  onChangeText={(val) => updateMaterial(index, "qty", val)}
                />

                <TextInput
                  placeholder="Unit"
                  placeholderTextColor="#94A3B8"
                  style={[styles.materialInputHalf, { fontFamily: "Urbanist-Regular" }]}
                  value={material.unit}
                  onChangeText={(val) => updateMaterial(index, "unit", val)}
                />
              </View>

              <TextInput
                placeholder="Rate (₹)"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
                style={[styles.materialInput, { fontFamily: "Urbanist-Regular" }]}
                value={material.rate}
                onChangeText={(val) => updateMaterial(index, "rate", val)}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addMaterial}>
            <Feather name="plus-circle" size={20} color="#235DFF" />
            <Text style={[styles.addButtonText, { fontFamily: "Urbanist-SemiBold" }]}>
              Add Material
            </Text>
          </TouchableOpacity>
        </View>

        {/* -----------------------------
            COST DETAILS
        ------------------------------- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="dollar-sign" size={20} color="#235DFF" />
            <Text style={[styles.sectionTitle, { fontFamily: "Urbanist-Bold" }]}>
              Cost Details
            </Text>
          </View>

          {renderInput("Labor Cost (₹)", "laborCost", "Enter labor cost", "numeric")}
          {renderInput("Miscellaneous Cost (₹)", "miscCost", "Enter misc cost", "numeric")}
          {renderInput("Contingency (%)", "contingency", "Enter percentage", "numeric")}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* -----------------------------
          SAVE BUTTON
      ------------------------------- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveBOQ}
          disabled={loading}
        >
          <Feather name={loading ? "loader" : "save"} size={20} color="white" />
          <Text style={[styles.saveButtonText, { fontFamily: "Urbanist-Bold" }]}>
            {loading ? "Saving..." : "Save BOQ Draft"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------------------
   STYLES (unchanged)
---------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 18, color: "#1E293B", marginLeft: 10 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, color: "#475569", marginBottom: 8 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  materialCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  materialTitle: { fontSize: 16, color: "#1E293B" },
  materialInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  materialInputHalf: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  addButton: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  addButtonText: { fontSize: 15, color: "#235DFF" },
  footer: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveButton: {
    backgroundColor: "#235DFF",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButtonDisabled: { backgroundColor: "#94A3B8" },
  saveButtonText: { color: "white", fontSize: 16, marginLeft: 8 },
});
