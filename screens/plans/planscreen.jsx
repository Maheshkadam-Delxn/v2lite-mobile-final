import { View, Text, FlatList, Linking, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import * as Crypto from 'expo-crypto'
import { Feather, Ionicons } from '@expo/vector-icons'
import WebView from 'react-native-webview'
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const ImagePreviewModal = ({ visible, onClose, imageUri, planId, projectId, onAddAnnotation }) => {
  const [annotations, setAnnotations] = useState([])
  const [loading, setLoading] = useState(false)
  const [annotationMode, setAnnotationMode] = useState(false)
  const [tempPosition, setTempPosition] = useState(null)

  const baseScale = useSharedValue(1)
  const pinchScale = useSharedValue(1)
  const offset = useSharedValue({ x: 0, y: 0 })
  const start = useSharedValue({ x: 0, y: 0 })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value.x },
      { translateY: offset.value.y },
      { scale: baseScale.value * pinchScale.value },
    ],
  }))

  useEffect(() => {
    if (visible && planId) {
      fetchAnnotations()
    }
  }, [visible, planId])

  const fetchAnnotations = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`${process.env.BASE_API_URL}/api/annotation?planId=${planId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnnotations(data.data)
      }
    } catch (error) {
      console.error('Fetch annotations error:', error)
    } finally {
      setLoading(false)
    }
  }

  const onPinchGestureEvent = (event) => {
    pinchScale.value = event.nativeEvent.scale
  }

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseScale.value = Math.max(1, baseScale.value * event.nativeEvent.scale)
      pinchScale.value = 1
      start.value = { x: offset.value.x, y: offset.value.y }
    }
  }

  const onImagePress = (event) => {
    if (annotationMode) {
      const { locationX, locationY } = event.nativeEvent
      // Normalize position (0-1) based on screen dimensions
      const normX = locationX / screenWidth
      const normY = locationY / screenHeight
      setTempPosition({ x: normX, y: normY })
      onAddAnnotation({ x: normX, y: normY, page: 1 })
      setAnnotationMode(false)
      setTempPosition(null)
    }
  }

  const toggleAnnotationMode = () => {
    setAnnotationMode(!annotationMode)
  }

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <PinchGestureHandler
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
          >
            <Animated.View style={[ { flex: 1, justifyContent: 'center', alignItems: 'center' }, animatedStyle ]}>
              <TouchableOpacity onPress={onImagePress} activeOpacity={1}>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: screenWidth, height: screenHeight }}
                  resizeMode="contain"
                />
                {/* Render annotations as pins */}
                {annotations.map((anno, index) => (
                  <TouchableOpacity
                    key={anno._id}
                    style={{
                      position: 'absolute',
                      left: anno.position.x * screenWidth - 12,
                      top: anno.position.y * screenHeight - 24,
                    }}
                    onPress={() => Alert.alert(`Title: ${anno.title}`, `Description: ${anno.description}`)}
                  >
                    <Ionicons name="location" size={24} color="red" />
                  </TouchableOpacity>
                ))}
                {tempPosition && (
                  <View
                    style={{
                      position: 'absolute',
                      left: tempPosition.x * screenWidth - 12,
                      top: tempPosition.y * screenHeight - 24,
                    }}
                  >
                    <Ionicons name="location-outline" size={24} color="blue" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </PinchGestureHandler>
        )}
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(255,255,255,0.5)', padding: 10, borderRadius: 5 }} onPress={onClose}>
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', bottom: 40, right: 20, backgroundColor: 'blue', padding: 10, borderRadius: 50 }} onPress={toggleAnnotationMode}>
          <Ionicons name={annotationMode ? "close" : "add"} size={30} color="white" />
        </TouchableOpacity>
      </GestureHandlerRootView>
    </Modal>
  )
}

const PlansTab = ({ project }) => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planHistory, setPlanHistory] = useState([])
  const [annotations, setAnnotations] = useState([])
  const [showAnnotationModal, setShowAnnotationModal] = useState(false)
  const [isAnnotationUpdate, setIsAnnotationUpdate] = useState(false)
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [annotationForm, setAnnotationForm] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium',
    position: { x: 0, y: 0, page: 1 },
    attachments: [],
    status: 'open',
    resolutionNote: '',
    assignedTo: null,
  })
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [annotationsLoading, setAnnotationsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    planType: '',
    floor: '',
    area: '',
    remarks: '',
    file: null,
  })
  const [uploading, setUploading] = useState(false)
  const [showPlanTypeDropdown, setShowPlanTypeDropdown] = useState(false)
  const [showFilePreview, setShowFilePreview] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [previewPlanId, setPreviewPlanId] = useState(null)
  const planTypes = [
    { value: 'architectural', label: 'Architectural' },
    { value: 'structural', label: 'Structural' },
    { value: 'services', label: 'Services' },
    { value: 'execution', label: 'Execution' },
    { value: 'shop_drawing', label: 'Shop Drawing' },
  ]
  const annotationCategories = [
    'design_issue',
    'site_condition',
    'clarification',
    'change_request',
    'execution_note',
    'quality_issue',
  ]
  const annotationSeverities = [
    'low',
    'medium',
    'high',
    'critical',
  ]
  const annotationStatuses = [
    'open',
    'in_progress',
    'resolved',
    'closed',
  ]
  const CLOUDINARY_CONFIG = {
    cloudName: 'dmlsgazvr',
    apiKey: '353369352647425',
    apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI',
  }
  useEffect(() => {
    console.log("Project = ", project)
    if (project?._id) {
      console.log("Project ID in PlansTab:", project._id)
    } else {
      console.log("No projectId available in PlansTab")
    }
  }, [project])
  useEffect(() => {
    const projectId = project?._id
    if (!projectId) {
      setError('Project ID is required')
      setLoading(false)
      return
    }
    refreshPlans(projectId)
  }, [project])
  const refreshPlans = async (projectId) => {
    setLoading(true)
    try {
      const refreshedPlans = await fetchLatestPlans(projectId)
      setPlans(refreshedPlans)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  const fetchLatestPlans = async (projectId) => {
    const token = await AsyncStorage.getItem('userToken')
    const response = await fetch(`${process.env.BASE_API_URL}/api/plan/latest?projectId=${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    const data = await response.json()
    if (data.success) {
      return data.data.sort((a, b) => {
        if (a.planType !== b.planType) return a.planType.localeCompare(b.planType)
        if (a.floor !== b.floor) return (a.floor || '').localeCompare(b.floor || '')
        if (a.area !== b.area) return (a.area || '').localeCompare(b.area || '')
        return b.version - a.version
      })
    }
    throw new Error(data.message || 'Failed to fetch latest plans')
  }
  const fetchPlanById = async (planId) => {
    const token = await AsyncStorage.getItem('userToken')
    const response = await fetch(`${process.env.BASE_API_URL}/api/plan/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    const data = await response.json()
    if (data.success) {
      return data.data
    }
    throw new Error(data.message || 'Failed to fetch plan')
  }
  const fetchPlanHistory = async (currentPlan) => {
    setHistoryLoading(true)
    const history = []
    let plan = currentPlan
    while (plan.previousPlanId) {
      try {
        const prevPlan = await fetchPlanById(plan.previousPlanId)
        history.push(prevPlan)
        plan = prevPlan
      } catch (err) {
        console.error('Failed to fetch previous plan:', err)
        break
      }
    }
    setPlanHistory(history)
    setHistoryLoading(false)
  }
  const fetchAnnotations = async (planId) => {
    setAnnotationsLoading(true)
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`${process.env.BASE_API_URL}/api/annotation?planId=${planId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      const data = await response.json()
      if (data.success) {
        setAnnotations(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch annotations')
      }
    } catch (err) {
      Alert.alert('Error', err.message)
      setAnnotations([])
    } finally {
      setAnnotationsLoading(false)
    }
  }
  const generateSignature = async (timestamp) => {
    try {
      const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`
      const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA1,
        stringToSign
      )
      return signature
    } catch (error) {
      console.error('Error generating signature:', error)
      throw new Error('Failed to generate signature')
    }
  }
  const uploadToCloudinary = async (uri, fileType = 'image') => {
    try {
      const timestamp = Math.round(Date.now() / 1000)
      const signature = await generateSignature(timestamp)
     
      const formData = new FormData()
      const filename = uri.split('/').pop()
      const match = /\.(\w+)$/.exec(filename || '')
      const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`
      formData.append('file', {
        uri: uri,
        type: type,
        name: filename || `${fileType}_${Date.now()}.${fileType === 'image' ? 'jpg' : 'pdf'}`,
      })
     
      formData.append('timestamp', timestamp.toString())
      formData.append('signature', signature)
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const data = await response.json()
     
      if (response.ok && data.secure_url) {
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
        }
      } else {
        return {
          success: false,
          error: data.error?.message || `Upload failed with status ${response.status}`,
        }
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }
  const handleFileSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Need camera roll permissions')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.7,
    })
    if (!result.canceled && result.assets && result.assets[0]) {
      setFormData(prev => ({ ...prev, file: result.assets[0] }))
    }
  }
  const handleAddOrUpdatePlan = async () => {
    const projectId = project?._id
    if (!projectId || !formData.title || !formData.planType) {
      Alert.alert('Missing Fields', 'Please fill all required fields.')
      return
    }
    setUploading(true)
    try {
      let fileMetadata = null
      if (formData.file) {
        const asset = formData.file
        const fileType = asset.type === 'image' ? 'image' : 'raw'
        const uploadResult = await uploadToCloudinary(asset.uri, fileType)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Upload failed')
        }
        fileMetadata = {
          url: uploadResult.url,
          fileType: asset.type === 'image' ? (asset.mimeType || 'jpg') : 'pdf',
          fileSize: asset.fileSize || 0,
          originalName: asset.fileName || 'plan_file',
        }
      } else if (isUpdateMode && selectedPlan.file) {
        fileMetadata = selectedPlan.file
      }
      if (!fileMetadata) {
        throw new Error('No file selected')
      }
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(`${process.env.BASE_API_URL}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          projectId,
          title: formData.title,
          planType: formData.planType,
          floor: formData.floor,
          area: formData.area,
          file: fileMetadata,
          remarks: formData.remarks,
        }),
      })
      const data = await response.json()
      if (data.success) {
        Alert.alert('Success', `Plan ${isUpdateMode ? 'updated' : 'added'} successfully`)
        setShowAddModal(false)
        refreshPlans(projectId)
        setFormData({
          title: '',
          planType: '',
          floor: '',
          area: '',
          remarks: '',
          file: null,
        })
        setIsUpdateMode(false)
      } else {
        throw new Error(data.message || `Failed to ${isUpdateMode ? 'update' : 'add'} plan`)
      }
    } catch (err) {
      Alert.alert('Error', err.message)
    } finally {
      setUploading(false)
    }
  }
  const handleViewDetails = async (planId) => {
    setDetailsLoading(true)
    setHistoryLoading(true)
    setAnnotationsLoading(true)
    setShowDetailsModal(true)
    setPlanHistory([])
    setAnnotations([])
    try {
      const currentPlan = await fetchPlanById(planId)
      setSelectedPlan(currentPlan)
      await fetchPlanHistory(currentPlan)
      await fetchAnnotations(planId)
    } catch (err) {
      Alert.alert('Error', err.message)
      setShowDetailsModal(false)
    } finally {
      setDetailsLoading(false)
    }
  }
  const handleUpdatePlan = () => {
    setFormData({
      title: selectedPlan.title,
      planType: selectedPlan.planType,
      floor: selectedPlan.floor || '',
      area: selectedPlan.area || '',
      remarks: selectedPlan.remarks || '',
      file: null,
    })
    setIsUpdateMode(true)
    setShowDetailsModal(false)
    setShowAddModal(true)
  }
  const handleDeletePlan = async (planId) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this plan?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken')
            const response = await fetch(`${process.env.BASE_API_URL}/api/plan/${planId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            })
            const data = await response.json()
            if (data.success) {
              Alert.alert('Success', 'Plan deleted successfully')
              setShowDetailsModal(false)
              refreshPlans(project._id)
            } else {
              throw new Error(data.message || 'Failed to delete plan')
            }
          } catch (err) {
            Alert.alert('Error', err.message)
          }
        },
      },
    ])
  }
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleAnnotationInput = (field, value) => {
    setAnnotationForm(prev => ({ ...prev, [field]: value }))
  }
  const handlePositionChange = (subField, value) => {
    setAnnotationForm(prev => ({
      ...prev,
      position: { ...prev.position, [subField]: parseFloat(value) || 0 }
    }))
  }
  const handleAddAnnotationAttachment = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Need camera roll permissions')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.7,
    })
    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0]
      const fileType = asset.type === 'image' ? 'image' : 'raw'
      const uploadResult = await uploadToCloudinary(asset.uri, fileType)
      if (uploadResult.success) {
        const attachment = {
          url: uploadResult.url,
          fileType: asset.type === 'image' ? (asset.mimeType || 'jpg') : 'pdf',
          fileSize: asset.fileSize || 0,
          uploadedAt: new Date(),
          originalName: asset.fileName || `attachment_${Date.now()}`,
        }
        setAnnotationForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachment]
        }))
      } else {
        Alert.alert('Upload Failed', uploadResult.error)
      }
    }
  }
  const handleRemoveAnnotationAttachment = (index) => {
    setAnnotationForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }
  const handleAddOrUpdateAnnotation = async () => {
    if (!annotationForm.title || !annotationForm.category) {
      Alert.alert('Missing Fields', 'Please fill required fields')
      return
    }
    try {
      const token = await AsyncStorage.getItem('userToken')
      const method = isAnnotationUpdate ? 'PATCH' : 'POST'
      const url = isAnnotationUpdate
        ? `${process.env.BASE_API_URL}/api/annotation/${selectedAnnotation._id}`
        : `${process.env.BASE_API_URL}/api/annotation`
      const body = {
        projectId: selectedPlan.projectId,
        planId: selectedPlan._id,
        planVersion: selectedPlan.version,
        position: annotationForm.position,
        title: annotationForm.title,
        description: annotationForm.description,
        category: annotationForm.category,
        severity: annotationForm.severity,
        attachments: annotationForm.attachments,
        status: annotationForm.status,
        resolutionNote: annotationForm.resolutionNote,
        assignedTo: annotationForm.assignedTo,
      }
      if (body.status === "resolved" && !isAnnotationUpdate) {
        body.resolvedAt = new Date()
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (data.success) {
        Alert.alert('Success', `Annotation ${isAnnotationUpdate ? 'updated' : 'added'}`)
        setShowAnnotationModal(false)
        fetchAnnotations(selectedPlan._id)
        setAnnotationForm({
          title: '',
          description: '',
          category: '',
          severity: 'medium',
          position: { x: 0, y: 0, page: 1 },
          attachments: [],
          status: 'open',
          resolutionNote: '',
          assignedTo: null,
        })
        setIsAnnotationUpdate(false)
      } else {
        throw new Error(data.message || 'Operation failed')
      }
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }
  const handleEditAnnotation = (annotation) => {
    setAnnotationForm({
      title: annotation.title,
      description: annotation.description || '',
      category: annotation.category,
      severity: annotation.severity,
      position: annotation.position,
      attachments: annotation.attachments || [],
      status: annotation.status,
      resolutionNote: annotation.resolutionNote || '',
      assignedTo: annotation.assignedTo?._id || null,
    })
    setSelectedAnnotation(annotation)
    setIsAnnotationUpdate(true)
    setShowAnnotationModal(true)
  }
  const handleDeleteAnnotation = async (annotationId) => {
    Alert.alert('Confirm Delete', 'Delete this annotation?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken')
            const response = await fetch(`${process.env.BASE_API_URL}/api/annotation/${annotationId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            })
            const data = await response.json()
            if (data.success) {
              Alert.alert('Success', 'Annotation deleted')
              fetchAnnotations(selectedPlan._id)
            } else {
              throw new Error(data.message || 'Failed to delete')
            }
          } catch (err) {
            Alert.alert('Error', err.message)
          }
        }
      }
    ])
  }
  const handleAddAnnotationFromPreview = (position) => {
    setAnnotationForm(prev => ({
      ...prev,
      position,
    }))
    setIsAnnotationUpdate(false)
    setShowAnnotationModal(true)
    setShowFilePreview(false) // Close preview to open form, or keep open if needed
  }
  const renderPlanItem = ({ item }) => (
    
    <TouchableOpacity className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-urbanist-bold text-gray-900 mb-1">{item.title}</Text>
          <View className="flex-row items-center">
            <View className="bg-blue-50 px-2 py-1 rounded">
              <Text className="text-xs font-urbanist-semibold text-[#0066FF]">{item.planType}</Text>
            </View>
            {item.isLatest && (
              <View className="bg-green-50 px-2 py-1 rounded ml-2">
                <Text className="text-xs font-urbanist-semibold text-green-600">Latest</Text>
              </View>
            )}
          </View>
        </View>
        <Text className="text-sm font-urbanist-semibold text-gray-500">v{item.version}</Text>
      </View>
      <View className="space-y-2 mb-3">
        {item.floor && (
          <View className="flex-row">
            <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Floor:</Text>
            <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.floor}</Text>
          </View>
        )}
        {item.area && (
          <View className="flex-row">
            <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Area:</Text>
            <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.area}</Text>
          </View>
        )}
        <View className="flex-row">
          <Text className="text-sm font-urbanist-medium text-gray-500 w-20">By:</Text>
          <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.uploadedBy?.name || 'Unknown'}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Date:</Text>
          <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        {item.remarks && (
          <View className="flex-row">
            <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Notes:</Text>
            <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.remarks}</Text>
          </View>
        )}
      </View>
      <View className="flex-row space-x-2">
        <TouchableOpacity
          className="flex-1 bg-[#0066FF] py-3 rounded-lg flex-row items-center justify-center"
          onPress={() => {
            setPreviewFile(item.file)
            setPreviewPlanId(item._id)
            setShowFilePreview(true)
          }}
          disabled={!item.file || !item.file.url}
        >
          <Feather name="eye" size={16} color="#fff" />
          <Text className="text-sm font-urbanist-semibold text-white ml-2">View File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center"
          onPress={() => handleViewDetails(item._id)}
        >
          <Feather name="info" size={16} color="#374151" />
          <Text className="text-sm font-urbanist-semibold text-gray-700 ml-2">Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
  const renderHistoryItem = ({ item }) => (
    <View className="bg-gray-50 rounded-lg p-4 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-urbanist-bold text-gray-900">Version {item.version}</Text>
        <Text className="text-xs font-urbanist-regular text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
     
      <View className="space-y-2 mb-3">
        <View className="flex-row">
          <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Title:</Text>
          <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.title}</Text>
        </View>
        {item.remarks && (
          <View className="flex-row">
            <Text className="text-sm font-urbanist-medium text-gray-500 w-20">Notes:</Text>
            <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.remarks}</Text>
          </View>
        )}
      </View>
      <View className="flex-row space-x-2">
        <TouchableOpacity
          className="flex-1 bg-[#0066FF] py-2.5 rounded-lg"
          onPress={() => {
            setPreviewFile(item.file)
            setShowFilePreview(true)
          }}
          disabled={!item.file || !item.file.url}
        >
          <Text className="text-sm font-urbanist-semibold text-white text-center">View File</Text>
        </TouchableOpacity>
        {!item.isLatest && (
          <TouchableOpacity
            className="flex-1 bg-red-50 py-2.5 rounded-lg"
            onPress={() => handleDeletePlan(item._id)}
          >
            <Text className="text-sm font-urbanist-semibold text-red-600 text-center">Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
  const renderAnnotationItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-urbanist-bold text-gray-900 mb-1">{item.title}</Text>
          <View className="flex-row items-center">
            <View className={`px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
              <Text className="text-xs font-urbanist-semibold text-white">{item.category}</Text>
            </View>
            <View className={`ml-2 px-2 py-1 rounded ${getSeverityColor(item.severity)}`}>
              <Text className="text-xs font-urbanist-semibold text-white">{item.severity}</Text>
            </View>
          </View>
        </View>
        <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
          <Text className="text-xs font-urbanist-semibold text-white">{item.status}</Text>
        </View>
      </View>
      {item.description && (
        <Text className="text-sm font-urbanist-regular text-gray-600 mb-3">{item.description}</Text>
      )}
      <View className="space-y-2 mb-3">
        <View className="flex-row">
          <Text className="text-sm font-urbanist-medium text-gray-500 w-28">Created By:</Text>
          <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.createdBy?.name || 'Unknown'}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-sm font-urbanist-medium text-gray-500 w-28">Position:</Text>
          <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">Page {item.position.page} (x: {item.position.x.toFixed(2)}, y: {item.position.y.toFixed(2)})</Text>
        </View>
        {item.assignedTo && (
          <View className="flex-row">
            <Text className="text-sm font-urbanist-medium text-gray-500 w-28">Assigned To:</Text>
            <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{item.assignedTo?.name || 'Unknown'}</Text>
          </View>
        )}
      </View>
      {item.attachments && item.attachments.length > 0 && (
        <View className="mb-3">
          <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Attachments</Text>
          {item.attachments.map((att, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-50 p-3 rounded-lg mb-2 flex-row items-center"
              onPress={() => Linking.openURL(att.url)}
            >
              <Feather name="paperclip" size={16} color="#9CA3AF" />
              <Text className="text-sm font-urbanist-regular text-gray-700 ml-2 flex-1">{att.originalName || `Attachment ${index + 1}`}</Text>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {item.resolutionNote && (
        <View className="bg-green-50 p-3 rounded-lg mb-3">
          <Text className="text-sm font-urbanist-medium text-green-700">Resolution Note: {item.resolutionNote}</Text>
        </View>
      )}
      <View className="flex-row space-x-2">
        <TouchableOpacity
          className="flex-1 bg-gray-100 py-3 rounded-lg"
          onPress={() => handleEditAnnotation(item)}
        >
          <Text className="text-sm font-urbanist-semibold text-gray-700 text-center">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-red-50 py-3 rounded-lg"
          onPress={() => handleDeleteAnnotation(item._id)}
        >
          <Text className="text-sm font-urbanist-semibold text-red-600 text-center">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const getCategoryColor = (category) => {
    const colors = {
      design_issue: 'bg-red-500',
      site_condition: 'bg-yellow-500',
      clarification: 'bg-blue-500',
      change_request: 'bg-purple-500',
      execution_note: 'bg-indigo-500',
      quality_issue: 'bg-orange-500',
    }
    return colors[category] || 'bg-gray-500'
  }
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    }
    return colors[severity] || 'bg-gray-500'
  }
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500',
    }
    return colors[status] || 'bg-gray-500'
  }
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0066FF" />
        <Text className="text-sm font-urbanist-medium text-gray-600 mt-4">Loading plans...</Text>
      </View>
    )
  }
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Feather name="alert-circle" size={48} color="#EF4444" />
        <Text className="text-base font-urbanist-semibold text-gray-900 mt-4">Error</Text>
        <Text className="text-sm font-urbanist-regular text-gray-600 text-center mt-2">{error}</Text>
      </View>
    )
  }
  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <TouchableOpacity
          className="bg-[#0066FF] py-4 rounded-xl flex-row items-center justify-center mb-4"
          onPress={() => {
            setIsUpdateMode(false)
            setFormData({
              title: '',
              planType: '',
              floor: '',
              area: '',
              remarks: '',
              file: null,
            })
            setShowAddModal(true)
          }}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text className="text-base font-urbanist-bold text-white ml-2">Add New Plan</Text>
        </TouchableOpacity>
        {plans.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Feather name="folder" size={48} color="#D1D5DB" />
            <Text className="text-base font-urbanist-semibold text-gray-900 mt-4">No Plans Yet</Text>
            <Text className="text-sm font-urbanist-regular text-gray-500 text-center mt-2">Add your first plan to get started</Text>
          </View>
        ) : (
          <FlatList
            data={plans}
            renderItem={renderPlanItem}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {/* Add/Update Plan Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="bg-white border-b border-gray-100 px-4 pt-12 pb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-urbanist-bold text-gray-900">
                {isUpdateMode ? 'Update Plan' : 'Add New Plan'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Feather name="x" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView className="flex-1 px-4 py-6">
            <View className="mb-4">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Title *</Text>
              <TextInput
                className="bg-gray-50 rounded-lg px-4 py-3 text-base font-urbanist-regular text-gray-900"
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                placeholder="Enter plan title"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Plan Type *</Text>
              <TouchableOpacity
                className="bg-gray-50 rounded-lg px-4 py-3 flex-row items-center justify-between"
                onPress={() => setShowPlanTypeDropdown(!showPlanTypeDropdown)}
              >
                <Text className={`text-base font-urbanist-regular ${formData.planType ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formData.planType ? planTypes.find(t => t.value === formData.planType)?.label : 'Select plan type'}
                </Text>
                <Feather name={showPlanTypeDropdown ? "chevron-up" : "chevron-down"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {showPlanTypeDropdown && (
                <View className="bg-white rounded-lg mt-2 border border-gray-200">
                  {planTypes.map((type, index) => (
                    <TouchableOpacity
                      key={type.value}
                      className={`px-4 py-3 ${index !== planTypes.length - 1 ? 'border-b border-gray-100' : ''}`}
                      onPress={() => {
                        handleInputChange('planType', type.value)
                        setShowPlanTypeDropdown(false)
                      }}
                    >
                      <Text className="text-base font-urbanist-regular text-gray-900">{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View className="mb-4">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Floor</Text>
              <TextInput
                className="bg-gray-50 rounded-lg px-4 py-3 text-base font-urbanist-regular text-gray-900"
                value={formData.floor}
                onChangeText={(text) => handleInputChange('floor', text)}
                placeholder="Enter floor"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Area</Text>
              <TextInput
                className="bg-gray-50 rounded-lg px-4 py-3 text-base font-urbanist-regular text-gray-900"
                value={formData.area}
                onChangeText={(text) => handleInputChange('area', text)}
                placeholder="Enter area"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">Remarks</Text>
              <TextInput
                className="bg-gray-50 rounded-lg px-4 py-3 text-base font-urbanist-regular text-gray-900"
                value={formData.remarks}
                onChangeText={(text) => handleInputChange('remarks', text)}
                placeholder="Add any notes or remarks"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <View className="mb-6">
              <Text className="text-sm font-urbanist-semibold text-gray-900 mb-2">
                {isUpdateMode ? 'Replace File (Optional)' : 'File *'}
              </Text>
              <TouchableOpacity
                className={`rounded-lg px-4 py-4 flex-row items-center justify-center ${formData.file ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-dashed border-gray-300'}`}
                onPress={handleFileSelect}
                disabled={uploading}
              >
                <Feather name={formData.file ? "check-circle" : "upload"} size={20} color={formData.file ? "#10B981" : "#9CA3AF"} />
                <Text className={`text-base font-urbanist-semibold ml-2 ${formData.file ? 'text-green-700' : 'text-gray-600'}`}>
                  {formData.file ? 'File Selected' : 'Select File'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className={`py-4 rounded-xl ${uploading ? 'bg-gray-300' : 'bg-[#0066FF]'}`}
              onPress={handleAddOrUpdatePlan}
              disabled={uploading}
            >
              <Text className="text-base font-urbanist-bold text-white text-center">
                {uploading ? 'Uploading...' : (isUpdateMode ? 'Update Plan' : 'Add Plan')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-4 rounded-xl bg-gray-100 mt-3"
              onPress={() => setShowAddModal(false)}
            >
              <Text className="text-base font-urbanist-bold text-gray-700 text-center">Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      {/* View Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="bg-white border-b border-gray-100 px-4 pt-12 pb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-urbanist-bold text-gray-900">Plan Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Feather name="x" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView className="flex-1 px-4 py-6">
            {detailsLoading ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#0066FF" />
                <Text className="text-sm font-urbanist-medium text-gray-600 mt-4">Loading details...</Text>
              </View>
            ) : selectedPlan ? (
              <>
                <View className="bg-blue-50 rounded-xl p-4 mb-6">
                  <Text className="text-lg font-urbanist-bold text-gray-900 mb-4">Current Version</Text>
                 
                  <View className="space-y-3">
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Title:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.title}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Type:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.planType}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Floor:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.floor || 'N/A'}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Area:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.area || 'N/A'}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Version:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.version} {selectedPlan.isLatest ? '(Latest)' : ''}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Uploaded By:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.uploadedBy?.name || 'Unknown'}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Created:</Text>
                      <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{new Date(selectedPlan.createdAt).toLocaleString()}</Text>
                    </View>
                    {selectedPlan.remarks && (
                      <View className="flex-row">
                        <Text className="text-sm font-urbanist-semibold text-gray-500 w-28">Remarks:</Text>
                        <Text className="text-sm font-urbanist-regular text-gray-900 flex-1">{selectedPlan.remarks}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="flex-row space-x-2 mb-6">
                  <TouchableOpacity
                    className="flex-1 bg-[#0066FF] py-4 rounded-xl"
                    onPress={() => {
                      setPreviewFile(selectedPlan.file)
                      setShowFilePreview(true)
                    }}
                    disabled={!selectedPlan.file || !selectedPlan.file.url}
                  >
                    <Text className="text-base font-urbanist-bold text-white text-center">View File</Text>
                  </TouchableOpacity>
                  {selectedPlan.isLatest && (
                    <TouchableOpacity
                      className="flex-1 bg-gray-100 py-4 rounded-xl"
                      onPress={handleUpdatePlan}
                    >
                      <Text className="text-base font-urbanist-bold text-gray-700 text-center">Update</Text>
                    </TouchableOpacity>
                  )}
                  {!selectedPlan.isLatest && (
                    <TouchableOpacity
                      className="flex-1 bg-red-50 py-4 rounded-xl"
                      onPress={() => handleDeletePlan(selectedPlan._id)}
                    >
                      <Text className="text-base font-urbanist-bold text-red-600 text-center">Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-urbanist-bold text-gray-900">Annotations</Text>
                    <TouchableOpacity
                      className="bg-[#0066FF] px-3 py-2 rounded-lg flex-row items-center"
                      onPress={() => {
                        setAnnotationForm({
                          title: '',
                          description: '',
                          category: '',
                          severity: 'medium',
                          position: { x: 0, y: 0, page: 1 },
                          attachments: [],
                        })
                        setIsAnnotationUpdate(false)
                        setShowAnnotationModal(true)
                      }}
                    >
                      <Feather name="plus" size={16} color="#fff" />
                      <Text className="text-sm font-urbanist-semibold text-white ml-1">Add Annotation</Text>
                    </TouchableOpacity>
                  </View>
                  {annotationsLoading ? (
                    <View className="items-center py-6">
                      <ActivityIndicator size="small" color="#0066FF" />
                    </View>
                  ) : annotations.length === 0 ? (
                    <View className="bg-gray-50 rounded-xl p-6 items-center">
                      <Feather name="bookmark" size={32} color="#D1D5DB" />
                      <Text className="text-sm font-urbanist-medium text-gray-500 mt-2">No annotations yet</Text>
                    </View>
                  ) : (
                    <FlatList
                      data={annotations}
                      renderItem={renderAnnotationItem}
                      keyExtractor={(item) => item._id.toString()}
                      scrollEnabled={false}
                    />
                  )}
                </View>
                <Text className="text-lg font-urbanist-bold text-gray-900 mb-4">Previous Versions</Text>
                {historyLoading ? (
                  <View className="items-center py-6">
                    <ActivityIndicator size="small" color="#0066FF" />
                  </View>
                ) : planHistory.length === 0 ? (
                  <View className="bg-gray-50 rounded-xl p-6 items-center">
                    <Feather name="clock" size={32} color="#D1D5DB" />
                    <Text className="text-sm font-urbanist-medium text-gray-500 mt-2">No previous versions</Text>
                  </View>
                ) : (
                  <FlatList
                    data={planHistory}
                    renderItem={renderHistoryItem}
                    keyExtractor={(item) => item._id.toString()}
                    scrollEnabled={false}
                  />
                )}
              </>
            ) : (
              <View className="items-center justify-center py-12">
                <Text className="text-base font-urbanist-medium text-gray-500">No details available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* File Preview Modal */}
      <Modal
        visible={showFilePreview}
        animationType="slide"
        onRequestClose={() => setShowFilePreview(false)}
      >
        <View className="flex-1 bg-white">
          <View className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 flex-row items-center justify-between">
            <Text className="text-xl font-urbanist-bold text-gray-900">File Preview</Text>
            <TouchableOpacity onPress={() => setShowFilePreview(false)}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          {previewFile ? (
            previewFile.fileType.startsWith('image') ? (
              <Image
                source={{ uri: previewFile.url }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />
            ) : (
              <WebView
                source={{ uri: previewFile.url }}
                style={{ flex: 1 }}
              />
            )
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base font-urbanist-medium text-gray-500">No file to preview</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}

export default PlansTab