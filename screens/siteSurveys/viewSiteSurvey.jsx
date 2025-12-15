
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal, FlatList } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import Header from 'components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SiteSurveyForm = ({ navigation, route }) => {
  const dataofpropopsal = route?.params
  console.log("Project Name:", dataofpropopsal?.survey._id)

  // Main form state
  const [formData, setFormData] = useState({
    siteName: dataofpropopsal?.survey?.projectId?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    landmark: '',
    plotShape: '',
    plotLength: '',
    plotWidth: '',
    plotArea: '',
    areaUnit: 'sq.ft',
    frontageWidth: '',
    roadWidthFront: '',
    cornerPlot: false,
    permissibleFSI: '',
    maxPermissibleHeight: '',
    setbackFront: '',
    setbackBack: '',
    setbackLeft: '',
    setbackRight: '',
    setbackUnit: 'ft',
    slopeDirection: '',
    slopeGradient: '',
    floodingHistory: false,
    floodingRemarks: '',
    soilType: '',
    soilRemark: '',
    rockPresence: false,
    rockDepthApprox: '',
    waterTableDepthApprox: '',
    contaminationSigns: false,
    contaminationRemarks: '',
    northType: '',
    northDescription: '',
    southType: '',
    southDescription: '',
    eastType: '',
    eastDescription: '',
    westType: '',
    westDescription: '',
    neighborhoodType: '',
    noiseLevel: '',
    dustPollutionLevel: '',
    distanceToMainRoad: '',
    distanceToTransformer: '',
    highTensionLine: false,
    highTensionRemarks: '',
    waterAvailable: false,
    waterSource: '',
    waterRemarks: '',
    electricityAvailable: false,
    electricityPhase: '',
    meterInstalled: false,
    electricityRemarks: '',
    sewageAvailable: false,
    sewageType: '',
    sewageRemarks: '',
    drainAvailable: false,
    drainCondition: '',
    drainRemarks: '',
    internetAvailable: false,
    internetType: '',
    internetRemarks: '',
    mainEntryWidth: '',
    accessRoadType: '',
    accessRoadCondition: '',
    heavyVehicleAccess: false,
    craneAccess: false,
    materialStorageAvailable: false,
    materialStorageArea: '',
    accessRemarks: '',
    hasExistingStructure: false,
    structureType: '',
    noOfFloors: '',
    approximateAge: '',
    structuralCondition: '',
    demolitionRequired: false,
    partialDemolition: false,
    demolitionRemarks: '',
    legalDispute: false,
    legalDisputeRemarks: '',
    encroachment: false,
    encroachmentRemarks: '',
    heritageZone: false,
    restrictedHeight: false,
    risksRemarks: '',
    photos: [],
    observations: [],
    reviewStatus: dataofpropopsal?.survey?.status || '',
    reviewRemarks: '',
  })

  // Multi-step form state
  const [surveyId, setId] = useState(dataofpropopsal?.survey._id)
  const [currentStep, setCurrentStep] = useState(1)
  const [measurements, setMeasurements] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [modalOptions, setModalOptions] = useState([])
  const [modalField, setModalField] = useState('')

  // Check if the form is read-only
  const isReadOnly = formData.reviewStatus === 'completed'

  // Form steps configuration
  const formSteps = [
    { id: 1, title: 'Location', icon: 'map-pin', completed: false },
    { id: 2, title: 'Plot Details', icon: 'square', completed: false },
    { id: 3, title: 'Setbacks', icon: 'minimize-2', completed: false },
    { id: 4, title: 'Topography', icon: 'activity', completed: false },
    { id: 5, title: 'Surroundings', icon: 'compass', completed: false },
    { id: 6, title: 'Utilities', icon: 'tool', completed: false },
    { id: 7, title: 'Structures', icon: 'home', completed: false },
    { id: 8, title: 'Risks', icon: 'alert-triangle', completed: false },
    { id: 9, title: 'Measurements', icon: 'ruler', completed: false },
    { id: 10, title: 'Photos', icon: 'camera', completed: false },
    { id: 11, title: 'Observations', icon: 'eye', completed: false },
    { id: 12, title: 'Review', icon: 'check-circle', completed: false },
  ]

  // Color theme
  const themeColors = {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryLighter: '#EFF6FF',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  }

  // Dropdown options
  const dropdownOptions = {
    plotShape: ['Rectangular', 'Square', 'Irregular', 'L-Shaped', 'T-Shaped', 'Triangular'],
    areaUnit: ['sq.ft', 'sq.m', 'acre', 'hectare'],
    slopeDirection: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West', 'Flat'],
    slopeGradient: ['Flat (0-1%)', 'Gentle (1-3%)', 'Moderate (3-8%)', 'Steep (8-15%)', 'Very Steep (>15%)'],
    soilType: ['Clay', 'Sand', 'Silt', 'Loam', 'Rocky', 'Gravel', 'Peat', 'Chalk'],
    surroundingType: ['Vacant Plot', 'Residential Building', 'Commercial Building', 'Industrial', 'Park/Garden', 'Water Body', 'Road', 'Public Facility'],
    neighborhoodType: ['Residential', 'Commercial', 'Mixed', 'Industrial', 'Rural', 'Urban'],
    noiseLevel: ['Low', 'Moderate', 'High', 'Very High'],
    dustPollutionLevel: ['Low', 'Moderate', 'High', 'Very High'],
    waterSource: ['Municipal', 'Borewell', 'Well', 'Tank Water', 'River/Lake'],
    electricityPhase: ['Single Phase', 'Three Phase'],
    sewageType: ['Underground', 'Septic Tank', 'None'],
    drainCondition: ['Good', 'Moderate', 'Poor', 'Blocked'],
    internetType: ['Broadband', 'Fiber', 'Wireless', 'Mobile Data'],
    accessRoadType: ['Concrete', 'Asphalt', 'Gravel', 'Mud', 'Paved'],
    accessRoadCondition: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
    structureType: ['Residential', 'Commercial', 'Industrial', 'Temporary', 'Heritage'],
    structuralCondition: ['Excellent', 'Good', 'Fair', 'Poor', 'Dilapidated'],
    observationCategory: ['Safety', 'Quality', 'Environmental', 'Structural', 'Accessibility', 'Regulatory'],
    observationSeverity: ['Low', 'Medium', 'High', 'Critical'],
    reviewStatus: ['draft', 'pending review', 'completed', 'cancelled'],
  }

  // Update form field
  const updateField = (field, value) => {
    if (!isReadOnly) {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Show dropdown modal
  const showDropdown = (type, field) => {
    if (!isReadOnly) {
      setModalType(type)
      setModalField(field)
      setModalOptions(dropdownOptions[type] || [])
      setShowModal(true)
    }
  }

  // Handle dropdown selection
  const handleDropdownSelect = (value) => {
    if (!isReadOnly) {
      updateField(modalField, value)
      setShowModal(false)
    }
  }

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < formSteps.length) {
      const updatedSteps = [...formSteps]
      updatedSteps[currentStep - 1].completed = true
      setCurrentStep(currentStep + 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const goToStep = (step) => {
    setCurrentStep(step)
    scrollViewRef.current?.scrollTo({ y: 0, animated: true })
  }

  // Measurements management
  const addMeasurement = () => {
    if (!isReadOnly) {
      setMeasurements([...measurements, { key: '', label: '', value: '', unit: '', notes: '' }])
    }
  }

  const updateMeasurement = (index, field, value) => {
    if (!isReadOnly) {
      const updated = [...measurements]
      updated[index][field] = value
      setMeasurements(updated)
    }
  }

  const removeMeasurement = (index) => {
    if (!isReadOnly) {
      setMeasurements(measurements.filter((_, i) => i !== index))
    }
  }

  // Observations management
  const addObservation = () => {
    if (!isReadOnly) {
      setFormData(prev => ({
        ...prev,
        observations: [...prev.observations, {
          title: '',
          description: '',
          category: '',
          severity: '',
          affectsProposal: false,
          recommendedAction: '',
        }],
      }))
    }
  }

  const updateObservation = (index, field, value) => {
    if (!isReadOnly) {
      const updated = [...formData.observations]
      updated[index][field] = value
      updateField('observations', updated)
    }
  }

  const removeObservation = (index) => {
    if (!isReadOnly) {
      const updated = formData.observations.filter((_, i) => i !== index)
      updateField('observations', updated)
    }
  }

  // Photo upload placeholder
  const addPhoto = () => {
    if (!isReadOnly) {
      console.log('Add photo')
      const newPhotos = [...formData.photos, 'https://via.placeholder.com/300x200?text=Site+Photo']
      updateField('photos', newPhotos)
    }
  }

  // Form submission
  const handleSaveDraft = async () => {
    if (isReadOnly) return
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!surveyId) {
        alert("Survey ID missing!")
        return
      }
      const transformedData = {
        status: "draft",
        location: {
          siteName: formData.siteName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          landmark: formData.landmark,
        },
        plotDetails: {
          plotShape: formData.plotShape,
          plotLength: formData.plotLength,
          plotWidth: formData.plotWidth,
          plotArea: formData.plotArea,
          areaUnit: formData.areaUnit,
          frontageWidth: formData.frontageWidth,
          roadWidthFront: formData.roadWidthFront,
          cornerPlot: formData.cornerPlot,
          permissibleFSI: formData.permissibleFSI,
          maxPermissibleHeight: formData.maxPermissibleHeight,
        },
        setbacks: {
          setbackFront: formData.setbackFront,
          setbackBack: formData.setbackBack,
          setbackLeft: formData.setbackLeft,
          setbackRight: formData.setbackRight,
          setbackUnit: formData.setbackUnit,
        },
        topography: {
          slopeDirection: formData.slopeDirection,
          slopeGradient: formData.slopeGradient,
          floodingHistory: formData.floodingHistory,
          floodingRemarks: formData.floodingRemarks,
        },
        soil: {
          soilType: formData.soilType,
          soilRemark: formData.soilRemark,
          rockPresence: formData.rockPresence,
          rockDepthApprox: formData.rockDepthApprox,
          waterTableDepthApprox: formData.waterTableDepthApprox,
          contaminationSigns: formData.contaminationSigns,
          contaminationRemarks: formData.contaminationRemarks,
        },
        surroundings: {
          north: {
            type: formData.northType,
            description: formData.northDescription,
          },
          south: {
            type: formData.southType,
            description: formData.southDescription,
          },
          east: {
            type: formData.eastType,
            description: formData.eastDescription,
          },
          west: {
            type: formData.westType,
            description: formData.westDescription,
          },
          neighborhoodType: formData.neighborhoodType,
          noiseLevel: formData.noiseLevel,
          dustPollutionLevel: formData.dustPollutionLevel,
          distanceToMainRoad: formData.distanceToMainRoad,
          distanceToTransformer: formData.distanceToTransformer,
          highTensionLine: formData.highTensionLine,
          highTensionRemarks: formData.highTensionRemarks,
        },
        utilities: {
          water: {
            available: formData.waterAvailable,
            source: formData.waterSource,
            remarks: formData.waterRemarks,
          },
          electricity: {
            available: formData.electricityAvailable,
            phase: formData.electricityPhase,
            meterInstalled: formData.meterInstalled,
            remarks: formData.electricityRemarks,
          },
          sewage: {
            available: formData.sewageAvailable,
            type: formData.sewageType,
            remarks: formData.sewageRemarks,
          },
          drain: {
            available: formData.drainAvailable,
            condition: formData.drainCondition,
            remarks: formData.drainRemarks,
          },
          internet: {
            available: formData.internetAvailable,
            type: formData.internetType,
            remarks: formData.internetRemarks,
          },
        },
        access: {
          mainEntryWidth: formData.mainEntryWidth,
          accessRoadType: formData.accessRoadType,
          accessRoadCondition: formData.accessRoadCondition,
          heavyVehicleAccess: formData.heavyVehicleAccess,
          craneAccess: formData.craneAccess,
          materialStorageAvailable: formData.materialStorageAvailable,
          materialStorageArea: formData.materialStorageArea,
          remarks: formData.accessRemarks,
        },
        existingStructures: {
          hasExistingStructure: formData.hasExistingStructure,
          structureType: formData.structureType,
          noOfFloors: formData.noOfFloors,
          approximateAge: formData.approximateAge,
          structuralCondition: formData.structuralCondition,
          demolitionRequired: formData.demolitionRequired,
          partialDemolition: formData.partialDemolition,
          demolitionRemarks: formData.demolitionRemarks,
        },
        risks: {
          legalDispute: formData.legalDispute,
          legalDisputeRemarks: formData.legalDisputeRemarks,
          encroachment: formData.encroachment,
          encroachmentRemarks: formData.encroachmentRemarks,
          heritageZone: formData.heritageZone,
          restrictedHeight: formData.restrictedHeight,
          remarks: formData.risksRemarks,
        },
        photos: formData.photos,
        measurements: measurements,
        observations: formData.observations,
        review: {
          status: formData.reviewStatus,
          remarks: formData.reviewRemarks,
        },
      }

      console.log('Draft saved:', transformedData)
      const response = await fetch(`${process.env.BASE_API_URL}/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(transformedData),
      })
      const json = await response.json()
      if (!response.ok) {
        console.log("Draft save failed:", json)
        alert(json.message || "Failed to save draft")
        return
      }
      alert('Survey saved as draft')
      navigation.goBack()
    } catch (error) {
      console.error("Draft Save Error:", error)
      alert("Something went wrong")
    }
  }

  const handleSubmit = async () => {
    if (isReadOnly) return
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (!surveyId) {
        alert("Survey ID missing!")
        return
      }
      const transformedData = {
        status: formData.reviewStatus,
        location: {
          siteName: formData.siteName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state, // Fixed: Use formData.state instead of reviewStatus
          pincode: formData.pincode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          landmark: formData.landmark,
        },
        plotDetails: {
          plotShape: formData.plotShape,
          plotLength: formData.plotLength,
          plotWidth: formData.plotWidth,
          plotArea: formData.plotArea,
          areaUnit: formData.areaUnit,
          frontageWidth: formData.frontageWidth,
          roadWidthFront: formData.roadWidthFront,
          cornerPlot: formData.cornerPlot,
          permissibleFSI: formData.permissibleFSI,
          maxPermissibleHeight: formData.maxPermissibleHeight,
        },
        setbacks: {
          setbackFront: formData.setbackFront,
          setbackBack: formData.setbackBack,
          setbackLeft: formData.setbackLeft,
          setbackRight: formData.setbackRight,
          setbackUnit: formData.setbackUnit,
        },
        topography: {
          slopeDirection: formData.slopeDirection,
          slopeGradient: formData.slopeGradient,
          floodingHistory: formData.floodingHistory,
          floodingRemarks: formData.floodingRemarks,
        },
        soil: {
          soilType: formData.soilType,
          soilRemark: formData.soilRemark,
          rockPresence: formData.rockPresence,
          rockDepthApprox: formData.rockDepthApprox,
          waterTableDepthApprox: formData.waterTableDepthApprox,
          contaminationSigns: formData.contaminationSigns,
          contaminationRemarks: formData.contaminationRemarks,
        },
        surroundings: {
          north: {
            type: formData.northType,
            description: formData.northDescription,
          },
          south: {
            type: formData.southType,
            description: formData.southDescription,
          },
          east: {
            type: formData.eastType,
            description: formData.eastDescription,
          },
          west: {
            type: formData.westType,
            description: formData.westDescription,
          },
          neighborhoodType: formData.neighborhoodType,
          noiseLevel: formData.noiseLevel,
          dustPollutionLevel: formData.dustPollutionLevel,
          distanceToMainRoad: formData.distanceToMainRoad,
          distanceToTransformer: formData.distanceToTransformer,
          highTensionLine: formData.highTensionLine,
          highTensionRemarks: formData.highTensionRemarks,
        },
        utilities: {
          water: {
            available: formData.waterAvailable,
            source: formData.waterSource,
            remarks: formData.waterRemarks,
          },
          electricity: {
            available: formData.electricityAvailable,
            phase: formData.electricityPhase,
            meterInstalled: formData.meterInstalled,
            remarks: formData.electricityRemarks,
          },
          sewage: {
            available: formData.sewageAvailable,
            type: formData.sewageType,
            remarks: formData.sewageRemarks,
          },
          drain: {
            available: formData.drainAvailable,
            condition: formData.drainCondition,
            remarks: formData.drainRemarks,
          },
          internet: {
            available: formData.internetAvailable,
            type: formData.internetType,
            remarks: formData.internetRemarks,
          },
        },
        access: {
          mainEntryWidth: formData.mainEntryWidth,
          accessRoadType: formData.accessRoadType,
          accessRoadCondition: formData.accessRoadCondition,
          heavyVehicleAccess: formData.heavyVehicleAccess,
          craneAccess: formData.craneAccess,
          materialStorageAvailable: formData.materialStorageAvailable,
          materialStorageArea: formData.materialStorageArea,
          remarks: formData.accessRemarks,
        },
        existingStructures: {
          hasExistingStructure: formData.hasExistingStructure,
          structureType: formData.structureType,
          noOfFloors: formData.noOfFloors,
          approximateAge: formData.approximateAge,
          structuralCondition: formData.structuralCondition,
          demolitionRequired: formData.demolitionRequired,
          partialDemolition: formData.partialDemolition,
          demolitionRemarks: formData.demolitionRemarks,
        },
        risks: {
          legalDispute: formData.legalDispute,
          legalDisputeRemarks: formData.legalDisputeRemarks,
          encroachment: formData.encroachment,
          encroachmentRemarks: formData.encroachmentRemarks,
          heritageZone: formData.heritageZone,
          restrictedHeight: formData.restrictedHeight,
          remarks: formData.risksRemarks,
        },
        photos: formData.photos,
        measurements: measurements,
        observations: formData.observations,
        review: {
          status: formData.reviewStatus,
          remarks: formData.reviewRemarks,
        },
      }
      console.log("Submitting Survey:", JSON.stringify(transformedData, null, 2))
      const response = await fetch(`${process.env.BASE_API_URL}/api/surveys/${surveyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(transformedData),
      })
      const json = await response.json()
      if (!response.ok) {
        console.log("Update failed:", json)
        alert(json.message || "Survey update failed")
        return
      }
      alert("Survey submitted successfully!")
      navigation.goBack()
    } catch (error) {
      console.error("Submit Error:", error)
      alert("Something went wrong")
    }
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      'siteName', 'addressLine1', 'city', 'state', 'pincode',
      'plotShape', 'plotLength', 'plotWidth', 'plotArea',
    ]
    const filled = requiredFields.filter(field => formData[field]).length
    return Math.round((filled / requiredFields.length) * 100)
  }

  const scrollViewRef = useRef()

  // Get step icon
  const getStepIcon = (stepId) => {
    const step = formSteps.find(s => s.id === stepId)
    return step ? step.icon : 'edit'
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderLocationStep()
      case 2: return renderPlotStep()
      case 3: return renderSetbacksStep()
      case 4: return renderTopographyStep()
      case 5: return renderSurroundingsStep()
      case 6: return renderUtilitiesStep()
      case 7: return renderStructuresStep()
      case 8: return renderRisksStep()
      case 9: return renderMeasurementsStep()
      case 10: return renderPhotosStep()
      case 11: return renderObservationsStep()
      case 12: return renderReviewStep()
      default: return renderLocationStep()
    }
  }

  // STEP 1: Location Details
  const renderLocationStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Site Name <Text className="text-red-500">*</Text>
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.siteName || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.siteName}
            onChangeText={(val) => updateField('siteName', val)}
            placeholder="e.g., Villa Construction - Aundh"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: formData.siteName ? themeColors.primary : themeColors.gray[300],
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Address Line 1 <Text className="text-red-500">*</Text>
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.addressLine1 || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.addressLine1}
            onChangeText={(val) => updateField('addressLine1', val)}
            placeholder="Street address, Plot number"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: formData.addressLine1 ? themeColors.primary : themeColors.gray[300],
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Address Line 2
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.addressLine2 || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.addressLine2}
            onChangeText={(val) => updateField('addressLine2', val)}
            placeholder="Area, Locality"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            City <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.city || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.city}
              onChangeText={(val) => updateField('city', val)}
              placeholder="Pune"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.city ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            State <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.state || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.state}
              onChangeText={(val) => updateField('state', val)}
              placeholder="Maharashtra"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.state ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-2">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Pincode <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.pincode || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.pincode}
              onChangeText={(val) => updateField('pincode', val)}
              placeholder="411007"
              keyboardType="numeric"
              maxLength={6}
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.pincode ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Landmark
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.landmark || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.landmark}
              onChangeText={(val) => updateField('landmark', val)}
              placeholder="Near XYZ Hospital"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      </View>
      <View className="bg-blue-50 p-4 rounded-xl mb-4" style={{ borderWidth: 1, borderColor: themeColors.primaryLight }}>
        <View className="flex-row items-center mb-3">
          <Feather name="navigation" size={16} color={themeColors.primary} />
          <Text className="text-blue-900 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
            GPS Coordinates (Optional)
          </Text>
        </View>
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
              Latitude
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                {formData.latitude || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.latitude}
                onChangeText={(val) => updateField('latitude', val)}
                placeholder="18.5204"
                keyboardType="decimal-pad"
                className="bg-white px-3 h-10 rounded-lg"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
              Longitude
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                {formData.longitude || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.longitude}
                onChangeText={(val) => updateField('longitude', val)}
                placeholder="73.8567"
                keyboardType="decimal-pad"
                className="bg-white px-3 h-10 rounded-lg"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
        </View>
        {!isReadOnly && (
          <TouchableOpacity
            className="flex-row items-center justify-center py-2"
            onPress={() => {
              updateField('latitude', '18.5204')
              updateField('longitude', '73.8567')
            }}
            disabled={isReadOnly}
          >
            <Feather name="crosshair" size={14} color={themeColors.primary} />
            <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13 }}>
              Use Current Location
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  // STEP 2: Plot Details
  const renderPlotStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Plot Shape <Text className="text-red-500">*</Text>
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.plotShape || 'Not provided'}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor: formData.plotShape ? themeColors.primary : themeColors.gray[300],
            }}
            onPress={() => showDropdown('plotShape', 'plotShape')}
            disabled={isReadOnly}
          >
            <Text
              className={formData.plotShape ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.plotShape || 'Select plot shape'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Length (ft) <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.plotLength || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.plotLength}
              onChangeText={(val) => updateField('plotLength', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.plotLength ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Width (ft) <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.plotWidth || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.plotWidth}
              onChangeText={(val) => updateField('plotWidth', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.plotWidth ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Plot Area <Text className="text-red-500">*</Text>
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.plotArea || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.plotArea}
              onChangeText={(val) => updateField('plotArea', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: formData.plotArea ? themeColors.primary : themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Unit
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.areaUnit || 'Not provided'}
            </Text>
          ) : (
            <TouchableOpacity
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
              onPress={() => showDropdown('areaUnit', 'areaUnit')}
              disabled={isReadOnly}
            >
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                {formData.areaUnit}
              </Text>
              <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Frontage Width (ft)
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.frontageWidth || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.frontageWidth}
              onChangeText={(val) => updateField('frontageWidth', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Road Width (ft)
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.roadWidthFront || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.roadWidthFront}
              onChangeText={(val) => updateField('roadWidthFront', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.cornerPlot ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.cornerPlot ? themeColors.primary : 'transparent',
          }}
        >
          {formData.cornerPlot && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Is this a corner plot? {isReadOnly ? (formData.cornerPlot ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('cornerPlot', !formData.cornerPlot)} disabled={isReadOnly}>
            <Feather name={formData.cornerPlot ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Permissible FSI
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.permissibleFSI || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.permissibleFSI}
              onChangeText={(val) => updateField('permissibleFSI', val)}
              placeholder="e.g., 1.5"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Max Height (ft)
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.maxPermissibleHeight || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.maxPermissibleHeight}
              onChangeText={(val) => updateField('maxPermissibleHeight', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      </View>
    </View>
  )

  // STEP 3: Setbacks
  const renderSetbacksStep = () => (
    <View className="mb-6">
      <View className="bg-gray-50 p-4 rounded-xl mb-5">
        <Text className="text-gray-600 mb-3" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
          Setbacks from boundary walls in feet
        </Text>
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Front
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.setbackFront || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.setbackFront}
                onChangeText={(val) => updateField('setbackFront', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-white px-4 h-12 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Back
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.setbackBack || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.setbackBack}
                onChangeText={(val) => updateField('setbackBack', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-white px-4 h-12 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Left
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.setbackLeft || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.setbackLeft}
                onChangeText={(val) => updateField('setbackLeft', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-white px-4 h-12 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Right
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.setbackRight || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.setbackRight}
                onChangeText={(val) => updateField('setbackRight', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-white px-4 h-12 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
        </View>
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Setback Unit
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.setbackUnit || 'Not provided'}
          </Text>
        ) : (
          <View className="flex-row">
            {['ft', 'm'].map((unit) => (
              <TouchableOpacity
                key={unit}
                onPress={() => updateField('setbackUnit', unit)}
                className={`px-4 py-2 mr-3 rounded-lg ${formData.setbackUnit === unit ? 'bg-blue-100' : 'bg-gray-100'}`}
                style={{
                  borderWidth: 1,
                  borderColor: formData.setbackUnit === unit ? themeColors.primary : themeColors.gray[300],
                }}
                disabled={isReadOnly}
              >
                <Text
                  className={formData.setbackUnit === unit ? 'text-blue-700' : 'text-gray-600'}
                  style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}
                >
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  )

  // STEP 4: Topography & Soil
  const renderTopographyStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Slope Direction
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.slopeDirection || 'Not provided'}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('slopeDirection', 'slopeDirection')}
            disabled={isReadOnly}
          >
            <Text
              className={formData.slopeDirection ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.slopeDirection || 'Select slope direction'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Slope Gradient
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.slopeGradient || 'Not provided'}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('slopeGradient', 'slopeGradient')}
            disabled={isReadOnly}
          >
            <Text
              className={formData.slopeGradient ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.slopeGradient || 'Select gradient'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.floodingHistory ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.floodingHistory ? themeColors.primary : 'transparent',
          }}
        >
          {formData.floodingHistory && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          History of flooding? {isReadOnly ? (formData.floodingHistory ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('floodingHistory', !formData.floodingHistory)} disabled={isReadOnly}>
            <Feather name={formData.floodingHistory ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.floodingHistory && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Flooding Remarks
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
              {formData.floodingRemarks || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.floodingRemarks}
              onChangeText={(val) => updateField('floodingRemarks', val)}
              placeholder="Describe flooding history"
              multiline
              numberOfLines={3}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top',
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Soil Type
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.soilType || 'Not provided'}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('soilType', 'soilType')}
            disabled={isReadOnly}
          >
            <Text
              className={formData.soilType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.soilType || 'Select soil type'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Soil Remarks
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
            {formData.soilRemark || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.soilRemark}
            onChangeText={(val) => updateField('soilRemark', val)}
            placeholder="Additional soil observations"
            multiline
            numberOfLines={2}
            className="bg-gray-50 px-4 py-3 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top',
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.rockPresence ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.rockPresence ? themeColors.primary : 'transparent',
          }}
        >
          {formData.rockPresence && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Rock presence detected? {isReadOnly ? (formData.rockPresence ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('rockPresence', !formData.rockPresence)} disabled={isReadOnly}>
            <Feather name={formData.rockPresence ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.rockPresence && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Approx. Rock Depth (ft)
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.rockDepthApprox || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.rockDepthApprox}
              onChangeText={(val) => updateField('rockDepthApprox', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Water Table Depth (ft)
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.waterTableDepthApprox || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.waterTableDepthApprox}
            onChangeText={(val) => updateField('waterTableDepthApprox', val)}
            placeholder="0"
            keyboardType="decimal-pad"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.contaminationSigns ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.contaminationSigns ? themeColors.primary : 'transparent',
          }}
        >
          {formData.contaminationSigns && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Signs of contamination? {isReadOnly ? (formData.contaminationSigns ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('contaminationSigns', !formData.contaminationSigns)} disabled={isReadOnly}>
            <Feather name={formData.contaminationSigns ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.contaminationSigns && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Contamination Remarks
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
              {formData.contaminationRemarks || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.contaminationRemarks}
              onChangeText={(val) => updateField('contaminationRemarks', val)}
              placeholder="Describe contamination signs"
              multiline
              numberOfLines={3}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top',
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
    </View>
  )

  // STEP 5: Surroundings
 const renderSurroundingsStep = () => (
  <View className="mb-6">

    {/* ---------------- NORTH ---------------- */}
    <View className="mb-5">
      <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
        North Side
      </Text>

      {/* Type */}
      <View className="mb-3">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
          Type
        </Text>

        {isReadOnly ? (
          <Text
            className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}
          >
            {formData.northType || "Not provided"}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown("surroundingType", "northType")}
          >
            <Text
              className={formData.northType ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Urbanist-Regular", fontSize: 14 }}
            >
              {formData.northType || "Select type"}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
        Description
      </Text>

      {isReadOnly ? (
        <Text
          className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
          style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
        >
          {formData.northDescription || "Not provided"}
        </Text>
      ) : (
        <TextInput
          value={formData.northDescription}
          onChangeText={(val) => updateField("northDescription", val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            borderWidth: 1,
            borderColor: themeColors.gray[300],
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      )}
    </View>

    {/* ------------ SOUTH SIDE ------------ */}
    <View className="mb-5">
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-SemiBold", fontSize: 15 }}>
        South Side
      </Text>

      <View className="mb-3">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
          Type
        </Text>

        {isReadOnly ? (
          <Text
            className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
            style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
          >
            {formData.southType || "Not provided"}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown("surroundingType", "southType")}
          >
            <Text
              className={formData.southType ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Urbanist-Regular", fontSize: 14 }}
            >
              {formData.southType || "Select type"}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
        Description
      </Text>

      {isReadOnly ? (
        <Text
          className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
          style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
        >
          {formData.southDescription || "Not provided"}
        </Text>
      ) : (
        <TextInput
          value={formData.southDescription}
          onChangeText={(val) => updateField("southDescription", val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            borderWidth: 1,
            borderColor: themeColors.gray[300],
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      )}
    </View>

    {/* -------------- EAST --------------- */}
    <View className="mb-5">
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-SemiBold", fontSize: 15 }}>
        East Side
      </Text>

      <View className="mb-3">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
          Type
        </Text>

        {isReadOnly ? (
          <Text
            className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
            style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
          >
            {formData.eastType || "Not provided"}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown("surroundingType", "eastType")}
          >
            <Text
              className={formData.eastType ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Urbanist-Regular", fontSize: 14 }}
            >
              {formData.eastType || "Select type"}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
        Description
      </Text>

      {isReadOnly ? (
        <Text
          className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
          style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
        >
          {formData.eastDescription || "Not provided"}
        </Text>
      ) : (
        <TextInput
          value={formData.eastDescription}
          onChangeText={(val) => updateField("eastDescription", val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            borderWidth: 1,
            borderColor: themeColors.gray[300],
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      )}
    </View>

    {/* -------- WEST -------- */}
    <View className="mb-5">
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-SemiBold", fontSize: 15 }}>
        West Side
      </Text>

      <View className="mb-3">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
          Type
        </Text>

        {isReadOnly ? (
          <Text
            className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
            style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
          >
            {formData.westType || "Not provided"}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown("surroundingType", "westType")}
          >
            <Text
              className={formData.westType ? "text-gray-900" : "text-gray-400"}
              style={{ fontFamily: "Urbanist-Regular", fontSize: 14 }}
            >
              {formData.westType || "Select type"}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* West description */}
      <Text className="text-gray-700 mb-2" style={{ fontFamily: "Urbanist-Medium", fontSize: 13 }}>
        Description
      </Text>

      {isReadOnly ? (
        <Text
          className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900"
          style={{ fontFamily: "Urbanist-Regular", fontSize: 14, lineHeight: 44 }}
        >
          {formData.westDescription || "Not provided"}
        </Text>
      ) : (
        <TextInput
          value={formData.westDescription}
          onChangeText={(val) => updateField("westDescription", val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{
            fontFamily: "Urbanist-Regular",
            fontSize: 14,
            borderWidth: 1,
            borderColor: themeColors.gray[300],
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      )}
    </View>

    {/* Continue with Neighborhood, Noise Level, etc. */}
  </View>
);


  // STEP 6: Utilities & Access
  const renderUtilitiesStep = () => (
    <View className="mb-6">
      {/* Water Supply */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Water Supply
          </Text>
          <View
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.waterAvailable ? themeColors.primary : themeColors.gray[300] }}
          >
            <View
              className="w-5 h-5 rounded-full bg-white"
              style={{ transform: [{ translateX: formData.waterAvailable ? 20 : 0 }] }}
            />
          </View>
        </View>
        {formData.waterAvailable && (
          <>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Source
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                  {formData.waterSource || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('waterSource', 'waterSource')}
                  disabled={isReadOnly}
                >
                  <Text
                    className={formData.waterSource ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {formData.waterSource || 'Select source'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                {formData.waterRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.waterRemarks}
                onChangeText={(val) => updateField('waterRemarks', val)}
                placeholder="Additional remarks"
                className="bg-gray-50 px-4 h-11 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </>
        )}
      </View>
      {/* Electricity */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Electricity
          </Text>
          <View
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.electricityAvailable ? themeColors.primary : themeColors.gray[300] }}
          >
            <View
              className="w-5 h-5 rounded-full bg-white"
              style={{ transform: [{ translateX: formData.electricityAvailable ? 20 : 0 }] }}
            />
          </View>
        </View>
        {formData.electricityAvailable && (
          <>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Phase
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                  {formData.electricityPhase || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('electricityPhase', 'electricityPhase')}
                  disabled={isReadOnly}
                >
                  <Text
                    className={formData.electricityPhase ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {formData.electricityPhase || 'Select phase'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row items-center mb-3">
              <View
                className="w-5 h-5 rounded items-center justify-center mr-3"
                style={{
                  borderWidth: 2,
                  borderColor: formData.meterInstalled ? themeColors.primary : themeColors.gray[300],
                  backgroundColor: formData.meterInstalled ? themeColors.primary : 'transparent',
                }}
              >
                {formData.meterInstalled && <Feather name="check" size={14} color="white" />}
              </View>
              <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                Meter installed {isReadOnly ? (formData.meterInstalled ? 'Yes' : 'No') : ''}
              </Text>
              {!isReadOnly && (
                <TouchableOpacity onPress={() => updateField('meterInstalled', !formData.meterInstalled)} disabled={isReadOnly}>
                  <Feather name={formData.meterInstalled ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                {formData.electricityRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.electricityRemarks}
                onChangeText={(val) => updateField('electricityRemarks', val)}
                placeholder="Additional remarks"
                className="bg-gray-50 px-4 h-11 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </>
        )}
      </View>
      {/* Sewage */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Sewage Connection
          </Text>
          <View
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.sewageAvailable ? themeColors.primary : themeColors.gray[300] }}
          >
            <View
              className="w-5 h-5 rounded-full bg-white"
              style={{ transform: [{ translateX: formData.sewageAvailable ? 20 : 0 }] }}
            />
          </View>
        </View>
        {formData.sewageAvailable && (
          <>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Type
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                  {formData.sewageType || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('sewageType', 'sewageType')}
                  disabled={isReadOnly}
                >
                  <Text
                    className={formData.sewageType ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {formData.sewageType || 'Select type'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                {formData.sewageRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.sewageRemarks}
                onChangeText={(val) => updateField('sewageRemarks', val)}
                placeholder="Additional remarks"
                className="bg-gray-50 px-4 h-11 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </>
        )}
      </View>
      {/* Storm Water Drain */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Storm Water Drain
          </Text>
          <View
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.drainAvailable ? themeColors.primary : themeColors.gray[300] }}
          >
            <View
              className="w-5 h-5 rounded-full bg-white"
              style={{ transform: [{ translateX: formData.drainAvailable ? 20 : 0 }] }}
            />
          </View>
        </View>
        {formData.drainAvailable && (
          <>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Condition
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                  {formData.drainCondition || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('drainCondition', 'drainCondition')}
                  disabled={isReadOnly}
                >
                  <Text
                    className={formData.drainCondition ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {formData.drainCondition || 'Select condition'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                {formData.drainRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.drainRemarks}
                onChangeText={(val) => updateField('drainRemarks', val)}
                placeholder="Additional remarks"
                className="bg-gray-50 px-4 h-11 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </>
        )}
      </View>
      {/* Internet */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Internet
          </Text>
          <View
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.internetAvailable ? themeColors.primary : themeColors.gray[300] }}
          >
            <View
              className="w-5 h-5 rounded-full bg-white"
              style={{ transform: [{ translateX: formData.internetAvailable ? 20 : 0 }] }}
            />
          </View>
        </View>
        {formData.internetAvailable && (
          <>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Type
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                  {formData.internetType || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('internetType', 'internetType')}
                  disabled={isReadOnly}
                >
                  <Text
                    className={formData.internetType ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {formData.internetType || 'Select type'}
                  </Text>
                  <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-11 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 44 }}>
                {formData.internetRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.internetRemarks}
                onChangeText={(val) => updateField('internetRemarks', val)}
                placeholder="Additional remarks"
                className="bg-gray-50 px-4 h-11 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </>
        )}
      </View>
      <View className="h-px bg-gray-200 my-4" />
      <Text className="text-gray-900 mb-4" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
        Access & Logistics
      </Text>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Main Entry Width (ft)
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.mainEntryWidth || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.mainEntryWidth}
            onChangeText={(val) => updateField('mainEntryWidth', val)}
            placeholder="0"
            keyboardType="decimal-pad"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Access Road Type
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.accessRoadType || 'Not provided'}
            </Text>
          ) : (
            <TouchableOpacity
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
              onPress={() => showDropdown('accessRoadType', 'accessRoadType')}
              disabled={isReadOnly}
            >
              <Text
                className={formData.accessRoadType ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.accessRoadType || 'Select'}
              </Text>
              <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Road Condition
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.accessRoadCondition || 'Not provided'}
            </Text>
          ) : (
            <TouchableOpacity
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
              onPress={() => showDropdown('accessRoadCondition', 'accessRoadCondition')}
              disabled={isReadOnly}
            >
              <Text
                className={formData.accessRoadCondition ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.accessRoadCondition || 'Select'}
              </Text>
              <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="flex-row items-center mb-3">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.heavyVehicleAccess ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.heavyVehicleAccess ? themeColors.primary : 'transparent',
          }}
        >
          {formData.heavyVehicleAccess && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Heavy vehicle access possible {isReadOnly ? (formData.heavyVehicleAccess ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('heavyVehicleAccess', !formData.heavyVehicleAccess)} disabled={isReadOnly}>
            <Feather name={formData.heavyVehicleAccess ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.craneAccess ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.craneAccess ? themeColors.primary : 'transparent',
          }}
        >
          {formData.craneAccess && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Crane access possible {isReadOnly ? (formData.craneAccess ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('craneAccess', !formData.craneAccess)} disabled={isReadOnly}>
            <Feather name={formData.craneAccess ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.materialStorageAvailable ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.materialStorageAvailable ? themeColors.primary : 'transparent',
          }}
        >
          {formData.materialStorageAvailable && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Material storage space available {isReadOnly ? (formData.materialStorageAvailable ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('materialStorageAvailable', !formData.materialStorageAvailable)} disabled={isReadOnly}>
            <Feather name={formData.materialStorageAvailable ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.materialStorageAvailable && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Approx. Storage Area (sq.ft)
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
              {formData.materialStorageArea || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.materialStorageArea}
              onChangeText={(val) => updateField('materialStorageArea', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Access Remarks
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
            {formData.accessRemarks || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.accessRemarks}
            onChangeText={(val) => updateField('accessRemarks', val)}
            placeholder="Additional access information"
            multiline
            numberOfLines={2}
            className="bg-gray-50 px-4 py-3 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top',
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
    </View>
  )

  // STEP 7: Existing Structures
  const renderStructuresStep = () => (
    <View className="mb-6">
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.hasExistingStructure ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.hasExistingStructure ? themeColors.primary : 'transparent',
          }}
        >
          {formData.hasExistingStructure && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Existing structure on site {isReadOnly ? (formData.hasExistingStructure ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('hasExistingStructure', !formData.hasExistingStructure)} disabled={isReadOnly}>
            <Feather name={formData.hasExistingStructure ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.hasExistingStructure && (
        <>
          <View className="mb-5">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Structure Type
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.structureType || 'Not provided'}
              </Text>
            ) : (
              <TouchableOpacity
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('structureType', 'structureType')}
                disabled={isReadOnly}
              >
                <Text
                  className={formData.structureType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.structureType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row gap-3 mb-5">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Number of Floors
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                  {formData.noOfFloors || 'Not provided'}
                </Text>
              ) : (
                <TextInput
                  value={formData.noOfFloors}
                  onChangeText={(val) => updateField('noOfFloors', val)}
                  placeholder="0"
                  keyboardType="numeric"
                  className="bg-gray-50 px-4 h-12 rounded-xl"
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: themeColors.gray[300],
                  }}
                  placeholderTextColor={themeColors.gray[400]}
                  editable={!isReadOnly}
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Approx. Age (years)
              </Text>
              {isReadOnly ? (
                <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                  {formData.approximateAge || 'Not provided'}
                </Text>
              ) : (
                <TextInput
                  value={formData.approximateAge}
                  onChangeText={(val) => updateField('approximateAge', val)}
                  placeholder="0"
                  keyboardType="numeric"
                  className="bg-gray-50 px-4 h-12 rounded-xl"
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: themeColors.gray[300],
                  }}
                  placeholderTextColor={themeColors.gray[400]}
                  editable={!isReadOnly}
                />
              )}
            </View>
          </View>
          <View className="mb-5">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Structural Condition
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
                {formData.structuralCondition || 'Not provided'}
              </Text>
            ) : (
              <TouchableOpacity
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('structuralCondition', 'structuralCondition')}
                disabled={isReadOnly}
              >
                <Text
                  className={formData.structuralCondition ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.structuralCondition || 'Select condition'}
                </Text>
                <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row items-center mb-3">
            <View
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{
                borderWidth: 2,
                borderColor: formData.demolitionRequired ? themeColors.primary : themeColors.gray[300],
                backgroundColor: formData.demolitionRequired ? themeColors.primary : 'transparent',
              }}
            >
              {formData.demolitionRequired && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Demolition required {isReadOnly ? (formData.demolitionRequired ? 'Yes' : 'No') : ''}
            </Text>
            {!isReadOnly && (
              <TouchableOpacity onPress={() => updateField('demolitionRequired', !formData.demolitionRequired)} disabled={isReadOnly}>
                <Feather name={formData.demolitionRequired ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row items-center mb-5">
            <View
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{
                borderWidth: 2,
                borderColor: formData.partialDemolition ? themeColors.primary : themeColors.gray[300],
                backgroundColor: formData.partialDemolition ? themeColors.primary : 'transparent',
              }}
            >
              {formData.partialDemolition && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Partial demolition only {isReadOnly ? (formData.partialDemolition ? 'Yes' : 'No') : ''}
            </Text>
            {!isReadOnly && (
              <TouchableOpacity onPress={() => updateField('partialDemolition', !formData.partialDemolition)} disabled={isReadOnly}>
                <Feather name={formData.partialDemolition ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
              </TouchableOpacity>
            )}
          </View>
          <View className="mb-5">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Demolition Remarks
            </Text>
            {isReadOnly ? (
              <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
                {formData.demolitionRemarks || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={formData.demolitionRemarks}
                onChangeText={(val) => updateField('demolitionRemarks', val)}
                placeholder="Details about demolition requirements"
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-xl"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
        </>
      )}
    </View>
  )

  // STEP 8: Risks & Constraints
  const renderRisksStep = () => (
    <View className="mb-6">
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.legalDispute ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.legalDispute ? themeColors.primary : 'transparent',
          }}
        >
          {formData.legalDispute && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Known legal disputes {isReadOnly ? (formData.legalDispute ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('legalDispute', !formData.legalDispute)} disabled={isReadOnly}>
            <Feather name={formData.legalDispute ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.legalDispute && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Legal Dispute Details
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
              {formData.legalDisputeRemarks || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.legalDisputeRemarks}
              onChangeText={(val) => updateField('legalDisputeRemarks', val)}
              placeholder="Describe the legal disputes"
              multiline
              numberOfLines={3}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top',
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.encroachment ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.encroachment ? themeColors.primary : 'transparent',
          }}
        >
          {formData.encroachment && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Encroachment observed {isReadOnly ? (formData.encroachment ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('encroachment', !formData.encroachment)} disabled={isReadOnly}>
            <Feather name={formData.encroachment ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      {formData.encroachment && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Encroachment Details
          </Text>
          {isReadOnly ? (
            <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
              {formData.encroachmentRemarks || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={formData.encroachmentRemarks}
              onChangeText={(val) => updateField('encroachmentRemarks', val)}
              placeholder="Describe the encroachment"
              multiline
              numberOfLines={3}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 15,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top',
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      )}
      <View className="flex-row items-center mb-3">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.heritageZone ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.heritageZone ? themeColors.primary : 'transparent',
          }}
        >
          {formData.heritageZone && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Heritage or green zone {isReadOnly ? (formData.heritageZone ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('heritageZone', !formData.heritageZone)} disabled={isReadOnly}>
            <Feather name={formData.heritageZone ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-row items-center mb-5">
        <View
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{
            borderWidth: 2,
            borderColor: formData.restrictedHeight ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.restrictedHeight ? themeColors.primary : 'transparent',
          }}
        >
          {formData.restrictedHeight && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Restricted height zone {isReadOnly ? (formData.restrictedHeight ? 'Yes' : 'No') : ''}
        </Text>
        {!isReadOnly && (
          <TouchableOpacity onPress={() => updateField('restrictedHeight', !formData.restrictedHeight)} disabled={isReadOnly}>
            <Feather name={formData.restrictedHeight ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Additional Risks Remarks
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 72 }}>
            {formData.risksRemarks || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.risksRemarks}
            onChangeText={(val) => updateField('risksRemarks', val)}
            placeholder="Any other risks or constraints"
            multiline
            numberOfLines={3}
            className="bg-gray-50 px-4 py-3 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top',
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
    </View>
  )

  // STEP 9: Custom Measurements
  const renderMeasurementsStep = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Feather name="ruler" size={18} color={themeColors.primary} />
          </View>
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
            Custom Measurements
          </Text>
        </View>
        {!isReadOnly && (
          <TouchableOpacity onPress={addMeasurement} disabled={isReadOnly}>
            <Feather name="plus-circle" size={24} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {measurements.map((measurement, index) => (
        <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Measurement {index + 1}
            </Text>
            {!isReadOnly && (
              <TouchableOpacity onPress={() => removeMeasurement(index)} disabled={isReadOnly}>
                <Feather name="trash-2" size={18} color={themeColors.danger} />
              </TouchableOpacity>
            )}
          </View>
          <View className="mb-3">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
              Label
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                {measurement.label || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={measurement.label}
                onChangeText={(val) => updateMeasurement(index, 'label', val)}
                placeholder="e.g., Door Height"
                className="bg-white px-3 h-10 rounded-lg"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Value
              </Text>
              {isReadOnly ? (
                <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                  {measurement.value || 'Not provided'}
                </Text>
              ) : (
                <TextInput
                  value={measurement.value}
                  onChangeText={(val) => updateMeasurement(index, 'value', val)}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: themeColors.gray[300],
                  }}
                  placeholderTextColor={themeColors.gray[400]}
                  editable={!isReadOnly}
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Unit
              </Text>
              {isReadOnly ? (
                <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                  {measurement.unit || 'Not provided'}
                </Text>
              ) : (
                <TextInput
                  value={measurement.unit}
                  onChangeText={(val) => updateMeasurement(index, 'unit', val)}
                  placeholder="ft"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{
                    fontFamily: 'Urbanist-Regular',
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: themeColors.gray[300],
                  }}
                  placeholderTextColor={themeColors.gray[400]}
                  editable={!isReadOnly}
                />
              )}
            </View>
          </View>
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Notes
          </Text>
          {isReadOnly ? (
            <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
              {measurement.notes || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={measurement.notes}
              onChangeText={(val) => updateMeasurement(index, 'notes', val)}
              placeholder="Notes (optional)"
              className="bg-white px-3 h-10 rounded-lg"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      ))}
      {measurements.length === 0 && (
        <View className="items-center py-8">
          <Feather name="ruler" size={40} color={themeColors.gray[300]} />
          <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
            No custom measurements added
          </Text>
          {!isReadOnly && (
            <TouchableOpacity
              onPress={addMeasurement}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{ backgroundColor: themeColors.primaryLight }}
            >
              <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
                Add First Measurement
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  // STEP 10: Photos
  const renderPhotosStep = () => (
    <View className="mb-6">
      <View className="flex-row items-center mb-4">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: themeColors.primaryLight }}
        >
          <Feather name="camera" size={18} color={themeColors.primary} />
        </View>
        <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
          Site Photos
        </Text>
      </View>
      {!isReadOnly && (
        <TouchableOpacity
          className="bg-blue-50 p-4 rounded-xl flex-row items-center justify-center mb-4"
          style={{ borderWidth: 1, borderColor: themeColors.primaryLight, borderStyle: 'dashed' }}
          onPress={addPhoto}
          disabled={isReadOnly}
        >
          <Feather name="upload" size={20} color={themeColors.primary} />
          <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
            Add Photo
          </Text>
        </TouchableOpacity>
      )}
      {formData.photos.length === 0 && (
        <View className="items-center py-8">
          <Feather name="image" size={40} color={themeColors.gray[300]} />
          <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
            No photos uploaded yet
          </Text>
          <Text className="text-gray-400 text-center mt-2 px-8" style={{ fontFamily: 'Urbanist-Regular', fontSize: 13 }}>
            Add photos of the site location, surroundings, and any relevant details
          </Text>
        </View>
      )}
      {formData.photos.map((photo, index) => (
        <View key={index} className="mb-3">
          <Image
            source={{ uri: photo }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 8,
              backgroundColor: themeColors.gray[100],
            }}
          />
          {!isReadOnly && (
            <View className="absolute top-2 right-2">
              <TouchableOpacity
                onPress={() => {
                  const newPhotos = formData.photos.filter((_, i) => i !== index)
                  updateField('photos', newPhotos)
                }}
                className="bg-red-500 w-8 h-8 rounded-full items-center justify-center"
                disabled={isReadOnly}
              >
                <Feather name="trash-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  )

  // STEP 11: Observations
  const renderObservationsStep = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Feather name="eye" size={18} color={themeColors.primary} />
          </View>
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
            Observations
          </Text>
        </View>
        {!isReadOnly && (
          <TouchableOpacity onPress={addObservation} disabled={isReadOnly}>
            <Feather name="plus-circle" size={24} color={themeColors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {formData.observations.map((observation, index) => (
        <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Observation {index + 1}
            </Text>
            {!isReadOnly && (
              <TouchableOpacity onPress={() => removeObservation(index)} disabled={isReadOnly}>
                <Feather name="trash-2" size={18} color={themeColors.danger} />
              </TouchableOpacity>
            )}
          </View>
          <View className="mb-3">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
              Title
            </Text>
            {isReadOnly ? (
              <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                {observation.title || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={observation.title}
                onChangeText={(val) => updateObservation(index, 'title', val)}
                placeholder="Observation title"
                className="bg-white px-3 h-10 rounded-lg"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
          </View>
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Description
          </Text>
          {isReadOnly ? (
            <Text className="bg-white px-3 h-20 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 20, paddingTop: 8 }}>
                {observation.description || 'Not provided'}
              </Text>
            ) : (
              <TextInput
                value={observation.description}
                onChangeText={(val) => updateObservation(index, 'description', val)}
                placeholder="Description"
                multiline
                numberOfLines={3}
                className="bg-white px-3 h-20 rounded-lg"
                style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: themeColors.gray[300],
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={themeColors.gray[400]}
                editable={!isReadOnly}
              />
            )}
         
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Category
              </Text>
              {isReadOnly ? (
                <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                  {observation.category || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('observationCategory', `observations[${index}].category`)}
                  disabled={isReadOnly}
                >
                  <Text
                    className={observation.category ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {observation.category || 'Select category'}
                  </Text>
                  <Feather name="chevron-down" size={16} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Severity
              </Text>
              {isReadOnly ? (
                <Text className="bg-white px-3 h-10 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 40 }}>
                  {observation.severity || 'Not provided'}
                </Text>
              ) : (
                <TouchableOpacity
                  className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                  onPress={() => showDropdown('observationSeverity', `observations[${index}].severity`)}
                  disabled={isReadOnly}
                >
                  <Text
                    className={observation.severity ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                  >
                    {observation.severity || 'Select severity'}
                  </Text>
                  <Feather name="chevron-down" size={16} color={themeColors.gray[400]} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View className="flex-row items-center mb-3">
            <View
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{
                borderWidth: 2,
                borderColor: observation.affectsProposal ? themeColors.primary : themeColors.gray[300],
                backgroundColor: observation.affectsProposal ? themeColors.primary : 'transparent',
              }}
            >
              {observation.affectsProposal && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Affects proposal {isReadOnly ? (observation.affectsProposal ? 'Yes' : 'No') : ''}
            </Text>
            {!isReadOnly && (
              <TouchableOpacity
                onPress={() => updateObservation(index, 'affectsProposal', !observation.affectsProposal)}
                disabled={isReadOnly}
              >
                <Feather name={observation.affectsProposal ? 'check-square' : 'square'} size={20} color={themeColors.gray[600]} />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Recommended Action
          </Text>
          {isReadOnly ? (
            <Text className="bg-white px-3 h-12 rounded-lg text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, lineHeight: 20, paddingTop: 8 }}>
              {observation.recommendedAction || 'Not provided'}
            </Text>
          ) : (
            <TextInput
              value={observation.recommendedAction}
              onChangeText={(val) => updateObservation(index, 'recommendedAction', val)}
              placeholder="Recommended action"
              multiline
              numberOfLines={2}
              className="bg-white px-3 h-12 rounded-lg"
              style={{
                fontFamily: 'Urbanist-Regular',
                fontSize: 14,
                borderWidth: 1,
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top',
              }}
              placeholderTextColor={themeColors.gray[400]}
              editable={!isReadOnly}
            />
          )}
        </View>
      ))}
      {formData.observations.length === 0 && (
        <View className="items-center py-8">
          <Feather name="eye" size={40} color={themeColors.gray[300]} />
          <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
            No observations added
          </Text>
          {!isReadOnly && (
            <TouchableOpacity
              onPress={addObservation}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{ backgroundColor: themeColors.primaryLight }}
            >
              <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
                Add First Observation
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  // STEP 12: Final Review
  const renderReviewStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Review Status
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 h-12 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, lineHeight: 48 }}>
            {formData.reviewStatus ? formData.reviewStatus.charAt(0).toUpperCase() + formData.reviewStatus.slice(1) : 'Not provided'}
          </Text>
        ) : (
          <TouchableOpacity
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('reviewStatus', 'reviewStatus')}
            disabled={isReadOnly}
          >
            <Text
              className={formData.reviewStatus ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.reviewStatus ? formData.reviewStatus.charAt(0).toUpperCase() + formData.reviewStatus.slice(1) : 'Select status'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Review Remarks
        </Text>
        {isReadOnly ? (
          <Text className="bg-gray-50 px-4 py-3 rounded-xl text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, minHeight: 96, lineHeight: 20, paddingTop: 8 }}>
            {formData.reviewRemarks || 'Not provided'}
          </Text>
        ) : (
          <TextInput
            value={formData.reviewRemarks}
            onChangeText={(val) => updateField('reviewRemarks', val)}
            placeholder="Final comments or notes about the survey"
            multiline
            numberOfLines={4}
            className="bg-gray-50 px-4 py-3 rounded-xl"
            style={{
              fontFamily: 'Urbanist-Regular',
              fontSize: 15,
              borderWidth: 1,
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top',
            }}
            placeholderTextColor={themeColors.gray[400]}
            editable={!isReadOnly}
          />
        )}
      </View>
      {/* Summary Section */}
      <View className="bg-blue-50 p-4 rounded-xl mb-5" style={{ borderWidth: 1, borderColor: themeColors.primaryLight }}>
        <Text className="text-blue-900 mb-3" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
          Survey Summary
        </Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
              Site Name
            </Text>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              {formData.siteName || 'Not provided'}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
              Plot Area
            </Text>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              {formData.plotArea ? `${formData.plotArea} ${formData.areaUnit}` : 'Not provided'}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
              Photos
            </Text>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              {formData.photos.length} uploaded
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
              Observations
            </Text>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              {formData.observations.length} added
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
              Completion
            </Text>
            <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              {calculateCompletion()}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  )

  // Fetch and populate survey data for editing
  React.useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) return
      try {
        const token = await AsyncStorage.getItem("userToken")
        const response = await fetch(`${process.env.BASE_API_URL}/api/surveys/${surveyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const survey = await response.json()
        if (survey.data) {
          setFormData({
            siteName: survey.data.location?.siteName || '',
            addressLine1: survey.data.location?.addressLine1 || '',
            addressLine2: survey.data.location?.addressLine2 || '',
            city: survey.data.location?.city || '',
            state: survey.data.location?.state || '',
            pincode: survey.data.location?.pincode || '',
            latitude: survey.data.location?.latitude || '',
            longitude: survey.data.location?.longitude || '',
            landmark: survey.data.location?.landmark || '',
            plotShape: survey.data.plotDetails?.plotShape || '',
            plotLength: survey.data.plotDetails?.plotLength || '',
            plotWidth: survey.data.plotDetails?.plotWidth || '',
            plotArea: survey.data.plotDetails?.plotArea || '',
            areaUnit: survey.data.plotDetails?.areaUnit || 'sq.ft',
            frontageWidth: survey.data.plotDetails?.frontageWidth || '',
            roadWidthFront: survey.data.plotDetails?.roadWidthFront || '',
            cornerPlot: survey.data.plotDetails?.cornerPlot || false,
            permissibleFSI: survey.data.plotDetails?.permissibleFSI || '',
            maxPermissibleHeight: survey.data.plotDetails?.maxPermissibleHeight || '',
            setbackFront: survey.data.setbacks?.setbackFront || '',
            setbackBack: survey.data.setbacks?.setbackBack || '',
            setbackLeft: survey.data.setbacks?.setbackLeft || '',
            setbackRight: survey.data.setbacks?.setbackRight || '',
            setbackUnit: survey.data.setbacks?.setbackUnit || 'ft',
            slopeDirection: survey.data.topography?.slopeDirection || '',
            slopeGradient: survey.data.topography?.slopeGradient || '',
            floodingHistory: survey.data.topography?.floodingHistory || false,
            floodingRemarks: survey.data.topography?.floodingRemarks || '',
            soilType: survey.data.soil?.soilType || '',
            soilRemark: survey.data.soil?.soilRemark || '',
            rockPresence: survey.data.soil?.rockPresence || false,
            rockDepthApprox: survey.data.soil?.rockDepthApprox || '',
            waterTableDepthApprox: survey.data.soil?.waterTableDepthApprox || '',
            contaminationSigns: survey.data.soil?.contaminationSigns || false,
            contaminationRemarks: survey.data.soil?.contaminationRemarks || '',
            northType: survey.data.surroundings?.north?.type || '',
            northDescription: survey.data.surroundings?.north?.description || '',
            southType: survey.data.surroundings?.south?.type || '',
            southDescription: survey.data.surroundings?.south?.description || '',
            eastType: survey.data.surroundings?.east?.type || '',
            eastDescription: survey.data.surroundings?.east?.description || '',
            westType: survey.data.surroundings?.west?.type || '',
            westDescription: survey.data.surroundings?.west?.description || '',
            neighborhoodType: survey.data.surroundings?.neighborhoodType || '',
            noiseLevel: survey.data.surroundings?.noiseLevel || '',
            dustPollutionLevel: survey.data.surroundings?.dustPollutionLevel || '',
            distanceToMainRoad: survey.data.surroundings?.distanceToMainRoad || '',
            distanceToTransformer: survey.data.surroundings?.distanceToTransformer || '',
            highTensionLine: survey.data.surroundings?.highTensionLine || false,
            highTensionRemarks: survey.data.surroundings?.highTensionRemarks || '',
            waterAvailable: survey.data.utilities?.water?.available || false,
            waterSource: survey.data.utilities?.water?.source || '',
            waterRemarks: survey.data.utilities?.water?.remarks || '',
            electricityAvailable: survey.data.utilities?.electricity?.available || false,
            electricityPhase: survey.data.utilities?.electricity?.phase || '',
            meterInstalled: survey.data.utilities?.electricity?.meterInstalled || false,
            electricityRemarks: survey.data.utilities?.electricity?.remarks || '',
            sewageAvailable: survey.data.utilities?.sewage?.available || false,
            sewageType: survey.data.utilities?.sewage?.type || '',
            sewageRemarks: survey.data.utilities?.sewage?.remarks || '',
            drainAvailable: survey.data.utilities?.drain?.available || false,
            drainCondition: survey.data.utilities?.drain?.condition || '',
            drainRemarks: survey.data.utilities?.drain?.remarks || '',
            internetAvailable: survey.data.utilities?.internet?.available || false,
            internetType: survey.data.utilities?.internet?.type || '',
            internetRemarks: survey.data.utilities?.internet?.remarks || '',
            mainEntryWidth: survey.data.access?.mainEntryWidth || '',
            accessRoadType: survey.data.access?.accessRoadType || '',
            accessRoadCondition: survey.data.access?.accessRoadCondition || '',
            heavyVehicleAccess: survey.data.access?.heavyVehicleAccess || false,
            craneAccess: survey.data.access?.craneAccess || false,
            materialStorageAvailable: survey.data.access?.materialStorageAvailable || false,
            materialStorageArea: survey.data.access?.materialStorageArea || '',
            accessRemarks: survey.data.access?.remarks || '',
            hasExistingStructure: survey.data.existingStructures?.hasExistingStructure || false,
            structureType: survey.data.existingStructures?.structureType || '',
            noOfFloors: survey.data.existingStructures?.noOfFloors || '',
            approximateAge: survey.data.existingStructures?.approximateAge || '',
            structuralCondition: survey.data.existingStructures?.structuralCondition || '',
            demolitionRequired: survey.data.existingStructures?.demolitionRequired || false,
            partialDemolition: survey.data.existingStructures?.partialDemolition || false,
            demolitionRemarks: survey.data.existingStructures?.demolitionRemarks || '',
            legalDispute: survey.data.risks?.legalDispute || false,
            legalDisputeRemarks: survey.data.risks?.legalDisputeRemarks || '',
            encroachment: survey.data.risks?.encroachment || false,
            encroachmentRemarks: survey.data.risks?.encroachmentRemarks || '',
            heritageZone: survey.data.risks?.heritageZone || false,
            restrictedHeight: survey.data.risks?.restrictedHeight || false,
            risksRemarks: survey.data.risks?.remarks || '',
            photos: survey.data.photos || [],
            observations: survey.data.observations || [],
            reviewStatus: survey.data.review?.status || '',
            reviewRemarks: survey.data.review?.remarks || '',
          })
          setMeasurements(survey.data.measurements || [])
        }
      } catch (error) {
        console.error("Fetch Survey Error:", error)
        alert("Failed to load survey data")
      }
    }
    fetchSurveyData()
  }, [surveyId])

  return (
    <View className="flex-1 bg-white">
      <Header title="Site Survey Form" />
      {/* Header with Progress Bar and Steps */}
      <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: themeColors.gray[200] }}>
        <View className="px-5 pb-3">
          <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${calculateCompletion()}%`,
                backgroundColor: themeColors.primary,
              }}
            />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-4">
          {formSteps.map((step) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => goToStep(step.id)}
              className={`mr-4 px-4 py-2 rounded-lg flex-row items-center ${
                currentStep === step.id ? 'bg-blue-100' : step.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
              style={{
                borderWidth: 1,
                borderColor: currentStep === step.id ? themeColors.primary : step.completed ? themeColors.success : themeColors.gray[200],
              }}
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
                  currentStep === step.id ? 'bg-blue-600' : step.completed ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                {step.completed ? (
                  <Feather name="check" size={14} color="white" />
                ) : (
                  <Text className="text-white" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 12 }}>
                    {step.id}
                  </Text>
                )}
              </View>
              <Text
                className={`${currentStep === step.id ? 'text-blue-700' : step.completed ? 'text-green-700' : 'text-gray-600'}`}
                style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}
              >
                {step.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Current Step Indicator */}
      <View className="px-5 py-3 bg-blue-50">
        <View className="flex-row items-center">
          <View
            className="w-8 h-8 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Feather name={getStepIcon(currentStep)} size={18} color={themeColors.primary} />
          </View>
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 16 }}>
            {formSteps[currentStep - 1]?.title}
          </Text>
          <View className="ml-auto">
            <Text className="text-gray-500" style={{ fontFamily: 'Urbanist-Regular', fontSize: 12 }}>
              Step {currentStep} of {formSteps.length}
            </Text>
          </View>
        </View>
      </View>
      {/* Main Form Content */}
      <ScrollView ref={scrollViewRef} className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        {renderStepContent()}
        {/* Navigation Buttons */}
        <View className="flex-row justify-between mb-20 mt-8">
          <TouchableOpacity
            onPress={prevStep}
            className={`px-6 py-3 rounded-lg flex-row items-center ${currentStep === 1 ? 'opacity-50' : ''}`}
            style={{ backgroundColor: themeColors.gray[100] }}
            disabled={currentStep === 1}
          >
            <Feather name="arrow-left" size={18} color={themeColors.gray[700]} />
            <Text className="text-gray-700 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Previous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextStep}
            className="px-6 py-3 rounded-lg flex-row items-center"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Text className="text-white mr-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              {currentStep === formSteps.length ? 'Complete' : 'Next Step'}
            </Text>
            {currentStep < formSteps.length && <Feather name="arrow-right" size={18} color="white" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Bottom Fixed Action Buttons (Show on last step, hide if read-only) */}
      {currentStep === formSteps.length && !isReadOnly && (
        <View className="px-5 py-4 bg-white" style={{ borderTopWidth: 1, borderTopColor: themeColors.gray[200] }}>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-600 h-12 rounded-xl items-center justify-center mb-3"
            disabled={isReadOnly}
          >
            <Text className="text-white" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
              Submit Survey
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveDraft}
            className="bg-gray-100 h-12 rounded-xl items-center justify-center"
            disabled={isReadOnly}
          >
            <Text className="text-gray-700" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
              Save as Draft
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Dropdown Modal */}
      <Modal visible={showModal && !isReadOnly} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-3/4">
            <View className="px-5 py-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
                Select Option
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={24} color={themeColors.gray[500]} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-5 py-4 border-b border-gray-100"
                  onPress={() => handleDropdownSelect(item)}
                >
                  <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 16 }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="py-10 items-center">
                  <Text className="text-gray-400">No options available</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SiteSurveyForm;