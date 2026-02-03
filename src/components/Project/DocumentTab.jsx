import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Modal
} from "react-native";
import { Feather } from "@expo/vector-icons";
import EmptyState from "../EmptyState";

/* ---------- Helpers ---------- */
const getFileType = (url) => {
  if (url.match(/\.(jpg|jpeg|png|webp)$/i)) return "IMAGE";
  if (url.match(/\.pdf$/i)) return "PDF";
  return "FILE";
};

const getFileIcon = (type) => {
  switch (type) {
    case "PDF":
      return { name: "file-text", bg: "#FEE2E2", color: "#DC2626" };
    case "IMAGE":
      return { name: "image", bg: "#DBEAFE", color: "#2563EB" };
    default:
      return { name: "file", bg: "#E5E7EB", color: "#6B7280" };
  }
};

/* ---------- Component ---------- */
const DocumentsTab = ({ documents = [] }) => {
  const [previewImage, setPreviewImage] = React.useState(null);

  if (!documents.length) {
    return (
      <EmptyState
        title="No Documents"
        description="No documents have been uploaded for this project yet."
      />
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Project Documents
        </Text>

        <View style={{ gap: 12 }}>
          {documents.map((doc, index) => {
            const type = getFileType(doc);
            const icon = getFileIcon(type);

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => {
                  if (type === "IMAGE") {
                    setPreviewImage(doc);
                  } else {
                    Linking.openURL(doc);
                  }
                }}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: icon.bg,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16
                  }}
                >
                  <Feather name={icon.name} size={24} color={icon.color} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Document {index + 1}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                    {type} Document
                  </Text>
                </View>

                <Feather name="chevron-right" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ---------- IMAGE PREVIEW MODAL ---------- */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => setPreviewImage(null)}
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
          >
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>

          <Image
            source={{ uri: previewImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

export default DocumentsTab;
