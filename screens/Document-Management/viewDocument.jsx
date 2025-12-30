
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Header from 'components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ViewDocument = ({ navigation, route }) => {
  const { document,folderId } = route.params;

  const [selectedVersion, setSelectedVersion] = useState(
    document?.versions?.[0]
  );

  /* ---------------- ZOOM ---------------- */
  const [scale, setScale] = useState(1);

  /* ---------------- ANNOTATIONS WITH HISTORY ---------------- */
  const [annotations, setAnnotations] = useState([]);
  const [history, setHistory] = useState([]); // Past states
  const [historyIndex, setHistoryIndex] = useState(-1); // Current position in history

  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotationModal, setAnnotationModal] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [currentPoint, setCurrentPoint] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState(null);

  const [imageLayout, setImageLayout] = useState({ width: 1, height: 1 });
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Save current state to history
  const saveToHistory = (newAnnotations) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newAnnotations];
    });
    setHistoryIndex((prev) => prev + 1);
    setHasUnsavedChanges(true);
  };

  /* ---------------- UNDO / REDO ---------------- */
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  /* ---------------- IMAGE TAP (ADD ANNOTATION) ---------------- */
  const handleImagePress = (event) => {
    if (!annotationMode) return;

    const { locationX, locationY } = event.nativeEvent;

    const x = locationX / imageLayout.width;
    const y = locationY / imageLayout.height;

    setCurrentPoint({ x, y });
    setAnnotationModal(true);
  };

  /* ---------------- SAVE ANNOTATION ---------------- */
  const saveAnnotation = () => {
    if (!annotationText.trim()) return;

    const newAnnotation = {
      id: Date.now().toString(),
      x: currentPoint.x,
      y: currentPoint.y,
      text: annotationText,
      versionId: selectedVersion._id,
    };

    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
    saveToHistory(newAnnotations);

    setAnnotationText('');
    setAnnotationModal(false);
    setCurrentPoint(null);
  };

  /* ---------------- CANCEL ANNOTATION ---------------- */
  const cancelAnnotation = () => {
    setAnnotationModal(false);
    setAnnotationText('');
    setCurrentPoint(null);
  };

  /* ---------------- DELETE ANNOTATION ---------------- */
  const openDeleteModal = (annotation) => {
    setAnnotationToDelete(annotation);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (annotationToDelete) {
      const newAnnotations = annotations.filter((a) => a.id !== annotationToDelete.id);
      setAnnotations(newAnnotations);
      saveToHistory(newAnnotations);
    }
    setDeleteModalVisible(false);
    setAnnotationToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setAnnotationToDelete(null);
  };

  const versionAnnotations = annotations.filter(
    (a) => a.versionId === selectedVersion._id
  );

  /* ---------------- ZOOM CONTROLS ---------------- */
  const zoomIn = () => setScale((p) => Math.min(p + 0.2, 3));
  const zoomOut = () => setScale((p) => Math.max(p - 0.2, 1));
  const resetZoom = () => setScale(1);




const handleSave = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // 👈 get token

    if (!token) {
      alert("User not authenticated");
      return;
    }

    const payload = {
      documentId: document._id,
      versionId: selectedVersion._id,
      annotations: versionAnnotations.map(a => ({
        x: a.x,
        y: a.y,
        text: a.text,
      })),
    };

    console.log("📌 SENDING PAYLOAD ↓↓↓");
    console.log(JSON.stringify(payload, null, 2));

    const res = await fetch(
      `${process.env.BASE_API_URL}/api/plan-folders/annotations/${folderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 PASS TOKEN
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Save failed:", data);
      alert(data.message || "Failed to save annotations");
      return;
    }

    console.log("✅ SAVE SUCCESS:", data);
    setHasUnsavedChanges(false);
    alert("Annotations saved successfully");
  } catch (err) {
    console.error("❌ Error saving annotations:", err);
    alert("Something went wrong");
  }
};

const fetchAnnotations = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const url =
      `${process.env.BASE_API_URL}` +
      `/api/plan-folders/annotations/${folderId}/` +
      `?documentId=${document._id}` +
      `&versionId=${selectedVersion._id}`;

    console.log("📡 Fetching annotations:", url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Fetch failed:", data);
      return;
    }

    const mappedAnnotations = (data.annotations || []).map(a => ({
      id: a._id,
      x: a.x,
      y: a.y,
      text: a.text,
      versionId: selectedVersion._id,
    }));

    console.log("✅ Loaded annotations:", mappedAnnotations);

    // hydrate UI
    setAnnotations(mappedAnnotations);
    setHistory([mappedAnnotations]);
    setHistoryIndex(0);
    setHasUnsavedChanges(false);
  } catch (err) {
    console.error("❌ Error fetching annotations:", err);
  }
};


 
useEffect(() => {
  if (!selectedVersion?._id) return;
  fetchAnnotations();
}, [selectedVersion]);


  return (
    <View className="flex-1 bg-gray-50">
      {/* ---------------- HEADER WITH SAVE BUTTON ---------------- */}
      <Header
        title={`View Document: ${document.name}`}
        showBackButton
        backgroundColor="#0066FF"
        titleColor="white"
        iconColor="white"
        rightComponent={
          hasUnsavedChanges && (
            <TouchableOpacity
              onPress={handleSave}
              className="bg-white/20 px-4 py-2 rounded-full mr-3 flex-row items-center"
            >
              <Icon name="content-save" size={18} color="#fff" />
              <Text className="text-black ml-1 font-medium">Save</Text>
            </TouchableOpacity>
          )
        }
      />
      <View>
        <TouchableOpacity
              onPress={handleSave}
              className="bg-white/20 px-4 py-2 rounded-full mr-3 flex-row items-center"
            >
              <Icon name="content-save" size={18} color="#7b75e3ff" />
              <Text className="text-black ml-1 font-medium">Save</Text>
            </TouchableOpacity>
      </View>

      {/* ---------------- IMAGE ---------------- */}
      <View className="flex-1 justify-center items-center px-4">
        <View
          style={{
            width: width - 32,
            maxWidth: 420,
            aspectRatio: 16 / 9,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#fff',
            elevation: 4,
          }}
        >
          <TouchableWithoutFeedback onPress={handleImagePress}>
            <View
              style={{ flex: 1 }}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setImageLayout({ width, height });
              }}
            >
              {imageLoading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: '45%',
                    left: '45%',
                    zIndex: 10,
                  }}
                />
              )}

              <View style={{ flex: 1, transform: [{ scale }] }}>
                <Image
                  source={{ uri: selectedVersion.image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  onLoadEnd={() => setImageLoading(false)}
                />

                {/* ANNOTATIONS */}
                {versionAnnotations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onLongPress={() => openDeleteModal(item)}
                    style={{
                      position: 'absolute',
                      left: item.x * imageLayout.width - 15,
                      top: item.y * imageLayout.height - 15,
                      alignItems: 'center',
                    }}
                  >
                    <Icon name="map-marker" size={30} color="#EF4444" />
                    <View className="bg-black/80 px-3 py-2 rounded-lg mt-1 max-w-[200px]">
                      <Text className="text-white text-xs text-center">{item.text}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Text className="mt-3 text-gray-600">
          Version {selectedVersion.versionNumber}
          {hasUnsavedChanges && <Text className="text-red-500"> • Unsaved changes</Text>}
        </Text>

        {annotationMode && (
          <View className="mt-2 flex-row items-center">
            <Icon name="map-marker-plus" size={16} color="#0066FF" />
            <Text className="text-blue-600 ml-1 text-sm">
              Tap on the image to add an annotation
            </Text>
          </View>
        )}
      </View>

      {/* ================= BOTTOM ACTION PANEL ================= */}
      <View className="flex-row justify-around items-center bg-white py-3 border-t">
        <ActionButton icon="undo" onPress={undo} disabled={!canUndo} />
        <ActionButton icon="redo" onPress={redo} disabled={!canRedo} />

        <ActionButton icon="plus" onPress={zoomIn} />
        <ActionButton icon="minus" onPress={zoomOut} />
        <ActionButton icon="crop-free" onPress={resetZoom} />

        <ActionButton
          icon="map-marker-plus"
          active={annotationMode}
          onPress={() => setAnnotationMode((p) => !p)}
        />
      </View>

      {/* ---------------- CHANGE VERSION ---------------- */}
      <View className="p-4 bg-white border-t">
        <TouchableOpacity
          onPress={() => setVersionModalVisible(true)}
          className="bg-blue-600 py-3 rounded-xl flex-row justify-center"
        >
          <Icon name="layers-outline" size={18} color="#fff" />
          <Text className="text-white ml-2 font-semibold">Change Version</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- VERSION MODAL ---------------- */}
      <Modal transparent visible={versionModalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setVersionModalVisible(false)}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl p-4">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold">Select Version</Text>
                  <TouchableOpacity onPress={() => setVersionModalVisible(false)}>
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={document.versions}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedVersion(item);
                        setScale(1);
                        setVersionModalVisible(false);
                      }}
                      className="p-4 bg-gray-100 rounded-xl mb-2 flex-row items-center"
                    >
                      <Icon name="file-document-outline" size={20} color="#0066FF" />
                      <Text className="ml-3 font-medium">Version {item.versionNumber}</Text>
                      {selectedVersion._id === item._id && (
                        <Icon name="check-circle" size={20} color="#0066FF" className="ml-auto" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ---------------- ANNOTATION INPUT MODAL ---------------- */}
      <Modal transparent visible={annotationModal} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Add Annotation</Text>
              <TouchableOpacity onPress={cancelAnnotation}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={annotationText}
              onChangeText={setAnnotationText}
              placeholder="Enter your annotation text..."
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
              placeholderTextColor="#999"
              onSubmitEditing={saveAnnotation}
              returnKeyType="done"
              autoFocus={true}
              multiline={true}
              numberOfLines={3}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={cancelAnnotation}
                className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveAnnotation}
                disabled={!annotationText.trim()}
                className={`py-3 rounded-lg flex-1 ml-2 ${
                  annotationText.trim() ? 'bg-blue-600' : 'bg-blue-300'
                }`}
              >
                <Text className="text-white text-center font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------------- DELETE CONFIRMATION MODAL ---------------- */}
      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-xl p-5">
            <Text className="text-lg font-semibold text-center mb-4">
              Delete Annotation?
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              "{annotationToDelete?.text}"
            </Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={cancelDelete}
                className="bg-gray-200 py-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                className="bg-red-600 py-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ---------------- ACTION BUTTON WITH DISABLED STATE ---------------- */
const ActionButton = ({ icon, onPress, active, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`w-12 h-12 rounded-full items-center justify-center ${
      active ? 'bg-blue-600' : disabled ? 'bg-gray-200' : 'bg-gray-100'
    }`}
  >
    <Icon
      name={icon}
      size={22}
      color={active ? '#fff' : disabled ? '#aaa' : '#333'}
    />
  </TouchableOpacity>
);

export default ViewDocument;