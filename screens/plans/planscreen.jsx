import { View, Text, FlatList, Linking, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import * as Crypto from 'expo-crypto'
import { Feather } from '@expo/vector-icons'
import WebView from 'react-native-webview'

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
  })
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false)
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
      }
      if (isAnnotationUpdate) {
        // For update, only send changed fields, but for simplicity send all
        if (body.status === 'resolved') {
          body.resolvedAt = new Date()
        }
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
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900 mb-0.5">{doc.name}</Text>
        <Text className="text-xs text-slate-500">{doc.type}</Text>
      </View>
      <MaterialCommunityIcons name="arrow-right" size={20} color="#0066FF" />
    </TouchableOpacity>
  );
}

function ApprovalBadge({ approved, label }) {
  return (
    <View className="flex-row items-center py-3 border-b border-slate-100">
      <View className={`w-3 h-3 rounded-full mr-3 ${approved ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900 mb-0.5">{label}</Text>
        <Text className={`text-xs ${approved ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
          {approved ? "Approved" : "Pending"}
        </Text>
      </View>
      {approved && (
        <MaterialCommunityIcons name="check-circle" size={18} color="#10b981" />
      )}
    </View>
  );
}

// ---------- Main Screen ----------
// function PlansTab({ route }) {
//   const [data] = useState(sampleData);
//   const [clientApproved, setClientApproved] = useState(data.approvalStatus.clientApproved);

//   const totalBoqAmount = useMemo(() => data.boqSnapshot.totalAmount, [data]);
//   const budgetDelta = totalBoqAmount - data.budget.baseline;
//   const budgetVariancePercent = ((budgetDelta / data.budget.baseline) * 100).toFixed(1);

//   const onApproveByClient = () => {
//     setClientApproved(true);
//     Alert.alert("Approved", "Client approval recorded successfully.");
//   };

//   const onRequestChanges = () => {
//     Alert.prompt
//       ? Alert.prompt("Request Changes", "Type the changes you want to request:", (text) => {
//           Alert.alert("Requested", "Change request submitted: " + (text || "—"));
//         })
//       : Alert.alert("Request Changes", "Change request submitted (simulated).");
//   };

//   return (
//     <View className="flex-1 bg-slate-50 mt-2">
//       {/* <Header title="Project Plans" /> */}
//       <ScrollView 
//         className="flex-1"
//         contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 16, paddingBottom: 40 }}  // Further reduced top padding to 4 for minimal gap
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Hero Header */}
//         <View className="bg-white rounded-3xl overflow-hidden mb-6 shadow-lg shadow-black/10">
//           <View style={{ backgroundColor: '#0066FF' }} className="p-6">
//             <Text className="text-2xl font-extrabold text-white mb-3">{data.name}</Text>
//             <View className="flex-row items-center">
//               <MaterialCommunityIcons name="calendar" size={16} color="rgba(255,255,255,0.9)" />
//               <Text className="text-sm text-white/90 ml-1.5">{data.finalizedBy.date}</Text>
//               <Text className="mx-2 text-white/60">•</Text>
//               <MaterialCommunityIcons name="account" size={16} color="rgba(255,255,255,0.9)" />
//               <Text className="text-sm text-white/90 ml-1.5">{data.finalizedBy.consultant}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Measurements Grid */}
//         <SectionTitle title="Site Measurements" />
//         <View className="space-y-2">
//           {data.measurements.map((m) => (
//             <MeasurementRow key={m.label} item={m} />
//           ))}
//         </View>

//         {/* Photos Gallery */}
//         <SectionTitle title="Site Photos" />
//         <FlatList
//           className="my-1"
//           data={data.photos}
//           keyExtractor={(p) => p.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View className="w-64 mr-3 rounded-2xl overflow-hidden bg-white shadow-md shadow-black/10">
//               <Image source={item.source} className="w-full h-48" />
//               <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
//                 <Text className="text-sm font-semibold text-white">{item.caption}</Text>
//               </View>
//             </View>
//           )}
//         />

//         {/* BOQ Snapshot */}
//         <SectionTitle
//           title="BOQ Breakdown"
//           right={
//             <View className="bg-slate-100 px-3 py-1.5 rounded-full">
//               <Text className="text-xs font-semibold text-slate-600">{data.boqSnapshot.totalItems} items</Text>
//             </View>
//           }
//         />
//         <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/5">
//           {data.boqSnapshot.categories.map((c, idx) => (
//             <BOQItem key={c.id} item={c} isLast={idx === data.boqSnapshot.categories.length - 1} />
//           ))}
//           <View className=" pt-4 border-t-2 border-slate-200 flex-row justify-between items-center">
//             <Text className="text-base font-bold text-slate-900">Total Amount</Text>
//             <Text style={{ color: '#0066FF' }} className="text-xl font-extrabold">{currencyFormatter(totalBoqAmount)}</Text>
//           </View>
//         </View>

//         {/* Budget Summary */}
//         <SectionTitle title="Budget Analysis" />
//         <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
//           <View className="flex-row mb-4">
//             <View className="flex-1">
//               <Text className="text-sm text-slate-500 mb-1.5">Baseline</Text>
//               <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.baseline)}</Text>
//             </View>
//             <View className="w-0.5 bg-slate-200 mx-4" />
//             <View className="flex-1">
//               <Text className="text-sm text-slate-500 mb-1.5">Revised</Text>
//               <Text className="text-lg font-bold text-slate-900">{currencyFormatter(data.budget.revised)}</Text>
//             </View>
//           </View>
//           <View className="bg-slate-50 rounded-xl p-4">
//             <Text className="text-sm text-slate-500 mb-2">Variance</Text>
//             <View className="flex-row items-center justify-between">
//               <Text className={`text-xl font-extrabold ${budgetDelta > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
//                 {budgetDelta >= 0 ? '+' : ''}{currencyFormatter(Math.abs(budgetDelta))}
//               </Text>
//               <View className={`px-3 py-1.5 rounded-full ${budgetDelta > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
//                 <Text className={`text-xs font-bold ${budgetDelta > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
//                   {budgetDelta >= 0 ? '+' : ''}{budgetVariancePercent}%
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Documents */}
//         <SectionTitle title="Documents" />
//         <View className="space-y-2">
//           {data.documents.map((doc) => (
//             <DocumentRow key={doc.id} doc={doc} />
//           ))}
//         </View>

//         {/* Approvals */}
//         <SectionTitle title="Approval Status" />
//         <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5">
//           <ApprovalBadge approved={data.approvalStatus.consultantApproved} label="Consultant" />
//           <ApprovalBadge approved={data.approvalStatus.siteManagerApproved} label="Site Manager" />
//           <ApprovalBadge approved={clientApproved} label="Client" />

//           {/* Action Buttons */}
//           {!clientApproved ? (
//             <View className=" space-y-2.5">
//               <TouchableOpacity 
//                 style={{ backgroundColor: '#0066FF' }}
//                 className="rounded-xl py-4 items-center shadow-lg flex-row justify-center"
//                 onPress={onApproveByClient}
//               >
//                 <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
//                 <Text className="text-white text-base font-bold ml-2">Approve Plan</Text>
//               </TouchableOpacity>

//             </View>
//           ) : (
//             <View className=" bg-emerald-100 rounded-xl p-4 flex-row items-center">
//               <MaterialCommunityIcons name="check-circle" size={28} color="#047857" />
//               <Text className="flex-1 text-sm font-semibold text-emerald-800 ml-3">
//                 Plan approved! Ready for task allocation.
//               </Text>
//             </View>
//           )}
//         </View>

//         <View className="h-10" />
//       </ScrollView>
//     </View>
//   );
// }

export default PlansTab;