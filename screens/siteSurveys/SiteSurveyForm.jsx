import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'

const SiteSurveyForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    // Location
    siteName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    landmark: '',
    
    // Plot
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
    
    // Setbacks
    setbackFront: '',
    setbackBack: '',
    setbackLeft: '',
    setbackRight: '',
    setbackUnit: 'ft',
    
    // Topography
    slopeDirection: '',
    slopeGradient: '',
    floodingHistory: false,
    floodingRemarks: '',
    
    // Soil
    soilType: '',
    soilRemark: '',
    rockPresence: false,
    rockDepthApprox: '',
    waterTableDepthApprox: '',
    contaminationSigns: false,
    contaminationRemarks: '',
    
    // Surroundings
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
    
    // Utilities
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
    
    // Access
    mainEntryWidth: '',
    accessRoadType: '',
    accessRoadCondition: '',
    heavyVehicleAccess: false,
    craneAccess: false,
    materialStorageAvailable: false,
    materialStorageArea: '',
    accessRemarks: '',
    
    // Existing Structures
    hasExistingStructure: false,
    structureType: '',
    noOfFloors: '',
    approximateAge: '',
    structuralCondition: '',
    demolitionRequired: false,
    partialDemolition: false,
    demolitionRemarks: '',
    
    // Risks
    legalDispute: false,
    legalDisputeRemarks: '',
    encroachment: false,
    encroachmentRemarks: '',
    heritageZone: false,
    restrictedHeight: false,
    risksRemarks: '',
    
    // Photos
    photos: [],
    
    // Observations
    observations: [],
    
    // Review
    reviewStatus: 'draft',
    reviewRemarks: ''
  })

  const [measurements, setMeasurements] = useState([])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addMeasurement = () => {
    setMeasurements([...measurements, { key: '', label: '', value: '', unit: '', notes: '' }])
  }

  const updateMeasurement = (index, field, value) => {
    const updated = [...measurements]
    updated[index][field] = value
    setMeasurements(updated)
  }

  const removeMeasurement = (index) => {
    setMeasurements(measurements.filter((_, i) => i !== index))
  }

  const addObservation = () => {
    setFormData(prev => ({
      ...prev,
      observations: [...prev.observations, {
        title: '',
        description: '',
        category: '',
        severity: '',
        affectsProposal: false,
        recommendedAction: ''
      }]
    }))
  }

  const updateObservation = (index, field, value) => {
    const updated = [...formData.observations]
    updated[index][field] = value
    updateField('observations', updated)
  }

  const removeObservation = (index) => {
    const updated = formData.observations.filter((_, i) => i !== index)
    updateField('observations', updated)
  }

  const addPhoto = () => {
    // Placeholder for photo upload logic
    console.log('Add photo')
  }

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData)
  }

  const handleSubmit = () => {
    console.log('Survey submitted:', formData)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between" style={{ borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 20 }}>
            Site Survey Form
          </Text>
        </View>
        <TouchableOpacity onPress={handleSaveDraft}>
          <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
            Save Draft
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: LOCATION DETAILS */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="map-pin" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Location Details
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Site Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.siteName}
              onChangeText={(val) => updateField('siteName', val)}
              placeholder="e.g., Villa Construction - Aundh"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Address Line 1 <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.addressLine1}
              onChangeText={(val) => updateField('addressLine1', val)}
              placeholder="Street address, Plot number"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Address Line 2
            </Text>
            <TextInput
              value={formData.addressLine2}
              onChangeText={(val) => updateField('addressLine2', val)}
              placeholder="Area, Locality"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                City <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.city}
                onChangeText={(val) => updateField('city', val)}
                placeholder="Pune"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                State <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.state}
                onChangeText={(val) => updateField('state', val)}
                placeholder="Maharashtra"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Pincode <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.pincode}
              onChangeText={(val) => updateField('pincode', val)}
              placeholder="411007"
              keyboardType="numeric"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Landmark
            </Text>
            <TextInput
              value={formData.landmark}
              onChangeText={(val) => updateField('landmark', val)}
              placeholder="Near XYZ Hospital"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="bg-blue-50 p-4 rounded-xl mb-4" style={{ borderWidth: 1, borderColor: '#DBEAFE' }}>
            <View className="flex-row items-center mb-3">
              <Feather name="navigation" size={16} color="#0066FF" />
              <Text className="text-blue-900 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
                GPS Coordinates
              </Text>
            </View>
            
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                  Latitude
                </Text>
                <TextInput
                  value={formData.latitude}
                  onChangeText={(val) => updateField('latitude', val)}
                  placeholder="18.5204"
                  keyboardType="decimal-pad"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                  Longitude
                </Text>
                <TextInput
                  value={formData.longitude}
                  onChangeText={(val) => updateField('longitude', val)}
                  placeholder="73.8567"
                  keyboardType="decimal-pad"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <TouchableOpacity className="flex-row items-center justify-center">
              <Feather name="crosshair" size={14} color="#0066FF" />
              <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13 }}>
                Use Current Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: PLOT DETAILS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="square" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Plot Details
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Plot Shape <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.plotShape ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.plotShape || 'Select plot shape'}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Length (ft) <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.plotLength}
                onChangeText={(val) => updateField('plotLength', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Width (ft) <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.plotWidth}
                onChangeText={(val) => updateField('plotWidth', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Plot Area <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={formData.plotArea}
                onChangeText={(val) => updateField('plotArea', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Unit
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                  {formData.areaUnit}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Frontage Width (ft)
              </Text>
              <TextInput
                value={formData.frontageWidth}
                onChangeText={(val) => updateField('frontageWidth', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Road Width (ft)
              </Text>
              <TextInput
                value={formData.roadWidthFront}
                onChangeText={(val) => updateField('roadWidthFront', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('cornerPlot', !formData.cornerPlot)}
            className="flex-row items-center mb-4"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.cornerPlot ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.cornerPlot ? '#0066FF' : 'transparent'
              }}
            >
              {formData.cornerPlot && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Is this a corner plot?
            </Text>
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Permissible FSI
            </Text>
            <TextInput
              value={formData.permissibleFSI}
              onChangeText={(val) => updateField('permissibleFSI', val)}
              placeholder="e.g., 1.5"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Max Permissible Height (ft)
            </Text>
            <TextInput
              value={formData.maxPermissibleHeight}
              onChangeText={(val) => updateField('maxPermissibleHeight', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* SECTION 3: SETBACKS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="minimize-2" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Setbacks
            </Text>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Front
              </Text>
              <TextInput
                value={formData.setbackFront}
                onChangeText={(val) => updateField('setbackFront', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Back
              </Text>
              <TextInput
                value={formData.setbackBack}
                onChangeText={(val) => updateField('setbackBack', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Left
              </Text>
              <TextInput
                value={formData.setbackLeft}
                onChangeText={(val) => updateField('setbackLeft', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Right
              </Text>
              <TextInput
                value={formData.setbackRight}
                onChangeText={(val) => updateField('setbackRight', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* SECTION 4: TOPOGRAPHY & SOIL */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="activity" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Topography & Soil
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Slope Direction
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.slopeDirection ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.slopeDirection || 'Select slope direction'}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Slope Gradient
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.slopeGradient ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.slopeGradient || 'Select gradient'}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('floodingHistory', !formData.floodingHistory)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.floodingHistory ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.floodingHistory ? '#0066FF' : 'transparent'
              }}
            >
              {formData.floodingHistory && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              History of flooding?
            </Text>
          </TouchableOpacity>

          {formData.floodingHistory && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Flooding Remarks
              </Text>
              <TextInput
                value={formData.floodingRemarks}
                onChangeText={(val) => updateField('floodingRemarks', val)}
                placeholder="Describe flooding history"
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Soil Type
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.soilType ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.soilType || 'Select soil type'}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Soil Remarks
            </Text>
            <TextInput
              value={formData.soilRemark}
              onChangeText={(val) => updateField('soilRemark', val)}
              placeholder="Additional soil observations"
              multiline
              numberOfLines={2}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity 
            onPress={() => updateField('rockPresence', !formData.rockPresence)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.rockPresence ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.rockPresence ? '#0066FF' : 'transparent'
              }}
            >
              {formData.rockPresence && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Rock presence detected?
            </Text>
          </TouchableOpacity>

          {formData.rockPresence && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Approx. Rock Depth (ft)
              </Text>
              <TextInput
                value={formData.rockDepthApprox}
                onChangeText={(val) => updateField('rockDepthApprox', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Water Table Depth (ft)
            </Text>
            <TextInput
              value={formData.waterTableDepthApprox}
              onChangeText={(val) => updateField('waterTableDepthApprox', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity 
            onPress={() => updateField('contaminationSigns', !formData.contaminationSigns)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.contaminationSigns ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.contaminationSigns ? '#0066FF' : 'transparent'
              }}
            >
              {formData.contaminationSigns && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Signs of contamination?
            </Text>
          </TouchableOpacity>

          {formData.contaminationSigns && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Contamination Remarks
              </Text>
              <TextInput
                value={formData.contaminationRemarks}
                onChangeText={(val) => updateField('contaminationRemarks', val)}
                placeholder="Describe contamination signs"
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}
        </View>

        {/* SECTION 5: SURROUNDINGS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="compass" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Surroundings
            </Text>
          </View>

          {/* North Side */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              North Side
            </Text>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Type
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.northType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.northType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.northDescription}
              onChangeText={(val) => updateField('northDescription', val)}
              placeholder="Description"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* South Side */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              South Side
            </Text>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Type
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.southType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.southType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.southDescription}
              onChangeText={(val) => updateField('southDescription', val)}
              placeholder="Description"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* East Side */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              East Side
            </Text>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Type
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.eastType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.eastType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.eastDescription}
              onChangeText={(val) => updateField('eastDescription', val)}
              placeholder="Description"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* West Side */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              West Side
            </Text>
            <View className="mb-3">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Type
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.westType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.westType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.westDescription}
              onChangeText={(val) => updateField('westDescription', val)}
              placeholder="Description"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="h-px bg-gray-200 my-4" />

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Neighborhood Type
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.neighborhoodType ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.neighborhoodType || 'Select type'}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Noise Level
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.noiseLevel ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.noiseLevel || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Dust Pollution
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.dustPollutionLevel ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.dustPollutionLevel || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Distance to Main Road (m)
              </Text>
              <TextInput
                value={formData.distanceToMainRoad}
                onChangeText={(val) => updateField('distanceToMainRoad', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Distance to Transformer (m)
              </Text>
              <TextInput
                value={formData.distanceToTransformer}
                onChangeText={(val) => updateField('distanceToTransformer', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('highTensionLine', !formData.highTensionLine)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.highTensionLine ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.highTensionLine ? '#0066FF' : 'transparent'
              }}
            >
              {formData.highTensionLine && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              High tension line present?
            </Text>
          </TouchableOpacity>

          {formData.highTensionLine && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                High Tension Line Remarks
              </Text>
              <TextInput
                value={formData.highTensionRemarks}
                onChangeText={(val) => updateField('highTensionRemarks', val)}
                placeholder="Distance, location details"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}
        </View>

        {/* SECTION 6: UTILITIES & ACCESS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="tool" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Utilities & Access
            </Text>
          </View>

          {/* Water Supply */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
                Water Supply
              </Text>
              <TouchableOpacity 
                onPress={() => updateField('waterAvailable', !formData.waterAvailable)}
                className="w-12 h-7 rounded-full p-1"
                style={{ backgroundColor: formData.waterAvailable ? '#0066FF' : '#D1D5DB' }}
              >
                <View 
                  className="w-5 h-5 rounded-full bg-white"
                  style={{ 
                    transform: [{ translateX: formData.waterAvailable ? 20 : 0 }]
                  }}
                />
              </TouchableOpacity>
            </View>
            {formData.waterAvailable && (
              <>
                <View className="mb-3">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Source
                  </Text>
                  <TouchableOpacity 
                    className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={formData.waterSource ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {formData.waterSource || 'Select source'}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={formData.waterRemarks}
                  onChangeText={(val) => updateField('waterRemarks', val)}
                  placeholder="Additional remarks"
                  className="bg-gray-50 px-4 h-11 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}
          </View>

          {/* Electricity */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
                Electricity
              </Text>
              <TouchableOpacity 
                onPress={() => updateField('electricityAvailable', !formData.electricityAvailable)}
                className="w-12 h-7 rounded-full p-1"
                style={{ backgroundColor: formData.electricityAvailable ? '#0066FF' : '#D1D5DB' }}
              >
                <View 
                  className="w-5 h-5 rounded-full bg-white"
                  style={{ 
                    transform: [{ translateX: formData.electricityAvailable ? 20 : 0 }]
                  }}
                />
              </TouchableOpacity>
            </View>
            {formData.electricityAvailable && (
              <>
                <View className="mb-3">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Phase
                  </Text>
                  <TouchableOpacity 
                    className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={formData.electricityPhase ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {formData.electricityPhase || 'Select phase'}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  onPress={() => updateField('meterInstalled', !formData.meterInstalled)}
                  className="flex-row items-center mb-3"
                >
                  <View 
                    className="w-5 h-5 rounded items-center justify-center mr-3"
                    style={{ 
                      borderWidth: 2, 
                      borderColor: formData.meterInstalled ? '#0066FF' : '#D1D5DB',
                      backgroundColor: formData.meterInstalled ? '#0066FF' : 'transparent'
                    }}
                  >
                    {formData.meterInstalled && <Feather name="check" size={14} color="white" />}
                  </View>
                  <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                    Meter installed
                  </Text>
                </TouchableOpacity>
                <TextInput
                  value={formData.electricityRemarks}
                  onChangeText={(val) => updateField('electricityRemarks', val)}
                  placeholder="Additional remarks"
                  className="bg-gray-50 px-4 h-11 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}
          </View>

          {/* Sewage */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
                Sewage Connection
              </Text>
              <TouchableOpacity 
                onPress={() => updateField('sewageAvailable', !formData.sewageAvailable)}
                className="w-12 h-7 rounded-full p-1"
                style={{ backgroundColor: formData.sewageAvailable ? '#0066FF' : '#D1D5DB' }}
              >
                <View 
                  className="w-5 h-5 rounded-full bg-white"
                  style={{ 
                    transform: [{ translateX: formData.sewageAvailable ? 20 : 0 }]
                  }}
                />
              </TouchableOpacity>
            </View>
            {formData.sewageAvailable && (
              <>
                <View className="mb-3">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Type
                  </Text>
                  <TouchableOpacity 
                    className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={formData.sewageType ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {formData.sewageType || 'Select type'}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={formData.sewageRemarks}
                  onChangeText={(val) => updateField('sewageRemarks', val)}
                  placeholder="Additional remarks"
                  className="bg-gray-50 px-4 h-11 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}
          </View>

          {/* Storm Water Drain */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
                Storm Water Drain
              </Text>
              <TouchableOpacity 
                onPress={() => updateField('drainAvailable', !formData.drainAvailable)}
                className="w-12 h-7 rounded-full p-1"
                style={{ backgroundColor: formData.drainAvailable ? '#0066FF' : '#D1D5DB' }}
              >
                <View 
                  className="w-5 h-5 rounded-full bg-white"
                  style={{ 
                    transform: [{ translateX: formData.drainAvailable ? 20 : 0 }]
                  }}
                />
              </TouchableOpacity>
            </View>
            {formData.drainAvailable && (
              <>
                <View className="mb-3">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Condition
                  </Text>
                  <TouchableOpacity 
                    className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={formData.drainCondition ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {formData.drainCondition || 'Select condition'}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={formData.drainRemarks}
                  onChangeText={(val) => updateField('drainRemarks', val)}
                  placeholder="Additional remarks"
                  className="bg-gray-50 px-4 h-11 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}
          </View>

          {/* Internet */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
                Internet
              </Text>
              <TouchableOpacity 
                onPress={() => updateField('internetAvailable', !formData.internetAvailable)}
                className="w-12 h-7 rounded-full p-1"
                style={{ backgroundColor: formData.internetAvailable ? '#0066FF' : '#D1D5DB' }}
              >
                <View 
                  className="w-5 h-5 rounded-full bg-white"
                  style={{ 
                    transform: [{ translateX: formData.internetAvailable ? 20 : 0 }]
                  }}
                />
              </TouchableOpacity>
            </View>
            {formData.internetAvailable && (
              <>
                <View className="mb-3">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Type
                  </Text>
                  <TouchableOpacity 
                    className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={formData.internetType ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {formData.internetType || 'Select type'}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={formData.internetRemarks}
                  onChangeText={(val) => updateField('internetRemarks', val)}
                  placeholder="Additional remarks"
                  className="bg-gray-50 px-4 h-11 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </>
            )}
          </View>

          <View className="h-px bg-gray-200 my-4" />

          <Text className="text-gray-900 mb-4" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Access & Logistics
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Main Entry Width (ft)
            </Text>
            <TextInput
              value={formData.mainEntryWidth}
              onChangeText={(val) => updateField('mainEntryWidth', val)}
              placeholder="0"
              keyboardType="decimal-pad"
              className="bg-gray-50 px-4 h-12 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Access Road Type
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.accessRoadType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.accessRoadType || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Road Condition
              </Text>
              <TouchableOpacity 
                className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
              >
                <Text 
                  className={formData.accessRoadCondition ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                >
                  {formData.accessRoadCondition || 'Select'}
                </Text>
                <Feather name="chevron-down" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('heavyVehicleAccess', !formData.heavyVehicleAccess)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.heavyVehicleAccess ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.heavyVehicleAccess ? '#0066FF' : 'transparent'
              }}
            >
              {formData.heavyVehicleAccess && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Heavy vehicle access possible
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => updateField('craneAccess', !formData.craneAccess)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.craneAccess ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.craneAccess ? '#0066FF' : 'transparent'
              }}
            >
              {formData.craneAccess && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Crane access possible
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => updateField('materialStorageAvailable', !formData.materialStorageAvailable)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.materialStorageAvailable ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.materialStorageAvailable ? '#0066FF' : 'transparent'
              }}
            >
              {formData.materialStorageAvailable && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Material storage space available
            </Text>
          </TouchableOpacity>

          {formData.materialStorageAvailable && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Approx. Storage Area (sq.ft)
              </Text>
              <TextInput
                value={formData.materialStorageArea}
                onChangeText={(val) => updateField('materialStorageArea', val)}
                placeholder="0"
                keyboardType="decimal-pad"
                className="bg-gray-50 px-4 h-12 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Access Remarks
            </Text>
            <TextInput
              value={formData.accessRemarks}
              onChangeText={(val) => updateField('accessRemarks', val)}
              placeholder="Additional access information"
              multiline
              numberOfLines={2}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* SECTION 7: EXISTING STRUCTURES */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="home" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Existing Structures
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('hasExistingStructure', !formData.hasExistingStructure)}
            className="flex-row items-center mb-4"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.hasExistingStructure ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.hasExistingStructure ? '#0066FF' : 'transparent'
              }}
            >
              {formData.hasExistingStructure && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Existing structure on site
            </Text>
          </TouchableOpacity>

          {formData.hasExistingStructure && (
            <>
              <View className="mb-4">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                  Structure Type
                </Text>
                <TouchableOpacity 
                  className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                >
                  <Text 
                    className={formData.structureType ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                  >
                    {formData.structureType || 'Select type'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Number of Floors
                  </Text>
                  <TextInput
                    value={formData.noOfFloors}
                    onChangeText={(val) => updateField('noOfFloors', val)}
                    placeholder="0"
                    keyboardType="numeric"
                    className="bg-gray-50 px-4 h-12 rounded-xl"
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                    Approx. Age (years)
                  </Text>
                  <TextInput
                    value={formData.approximateAge}
                    onChangeText={(val) => updateField('approximateAge', val)}
                    placeholder="0"
                    keyboardType="numeric"
                    className="bg-gray-50 px-4 h-12 rounded-xl"
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB' }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                  Structural Condition
                </Text>
                <TouchableOpacity 
                  className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
                  style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                >
                  <Text 
                    className={formData.structuralCondition ? 'text-gray-900' : 'text-gray-400'}
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
                  >
                    {formData.structuralCondition || 'Select condition'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => updateField('demolitionRequired', !formData.demolitionRequired)}
                className="flex-row items-center mb-3"
              >
                <View 
                  className="w-5 h-5 rounded items-center justify-center mr-3"
                  style={{ 
                    borderWidth: 2, 
                    borderColor: formData.demolitionRequired ? '#0066FF' : '#D1D5DB',
                    backgroundColor: formData.demolitionRequired ? '#0066FF' : 'transparent'
                  }}
                >
                  {formData.demolitionRequired && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                  Demolition required
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => updateField('partialDemolition', !formData.partialDemolition)}
                className="flex-row items-center mb-4"
              >
                <View 
                  className="w-5 h-5 rounded items-center justify-center mr-3"
                  style={{ 
                    borderWidth: 2, 
                    borderColor: formData.partialDemolition ? '#0066FF' : '#D1D5DB',
                    backgroundColor: formData.partialDemolition ? '#0066FF' : 'transparent'
                  }}
                >
                  {formData.partialDemolition && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                  Partial demolition only
                </Text>
              </TouchableOpacity>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                  Demolition Remarks
                </Text>
                <TextInput
                  value={formData.demolitionRemarks}
                  onChangeText={(val) => updateField('demolitionRemarks', val)}
                  placeholder="Details about demolition requirements"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 px-4 py-3 rounded-xl"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          )}
        </View>

        {/* SECTION 8: RISKS & CONSTRAINTS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="alert-triangle" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Risks & Constraints
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => updateField('legalDispute', !formData.legalDispute)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.legalDispute ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.legalDispute ? '#0066FF' : 'transparent'
              }}
            >
              {formData.legalDispute && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Known legal disputes
            </Text>
          </TouchableOpacity>

          {formData.legalDispute && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Legal Dispute Details
              </Text>
              <TextInput
                value={formData.legalDisputeRemarks}
                onChangeText={(val) => updateField('legalDisputeRemarks', val)}
                placeholder="Describe the legal disputes"
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <TouchableOpacity 
            onPress={() => updateField('encroachment', !formData.encroachment)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.encroachment ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.encroachment ? '#0066FF' : 'transparent'
              }}
            >
              {formData.encroachment && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Encroachment observed
            </Text>
          </TouchableOpacity>

          {formData.encroachment && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
                Encroachment Details
              </Text>
              <TextInput
                value={formData.encroachmentRemarks}
                onChangeText={(val) => updateField('encroachmentRemarks', val)}
                placeholder="Describe the encroachment"
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-xl"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <TouchableOpacity 
            onPress={() => updateField('heritageZone', !formData.heritageZone)}
            className="flex-row items-center mb-3"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.heritageZone ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.heritageZone ? '#0066FF' : 'transparent'
              }}
            >
              {formData.heritageZone && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Heritage or green zone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => updateField('restrictedHeight', !formData.restrictedHeight)}
            className="flex-row items-center mb-4"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.restrictedHeight ? '#0066FF' : '#D1D5DB',
                backgroundColor: formData.restrictedHeight ? '#0066FF' : 'transparent'
              }}
            >
              {formData.restrictedHeight && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Restricted height zone
            </Text>
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Additional Risks Remarks
            </Text>
            <TextInput
              value={formData.risksRemarks}
              onChangeText={(val) => updateField('risksRemarks', val)}
              placeholder="Any other risks or constraints"
              multiline
              numberOfLines={3}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* SECTION 9: CUSTOM MEASUREMENTS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
                <Feather name="ruler" size={18} color="#0066FF" />
              </View>
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
                Custom Measurements
              </Text>
            </View>
            <TouchableOpacity onPress={addMeasurement}>
              <Feather name="plus-circle" size={24} color="#0066FF" />
            </TouchableOpacity>
          </View>

          {measurements.map((measurement, index) => (
            <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
                  Measurement {index + 1}
                </Text>
                <TouchableOpacity onPress={() => removeMeasurement(index)}>
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                  Label
                </Text>
                <TextInput
                  value={measurement.label}
                  onChangeText={(val) => updateMeasurement(index, 'label', val)}
                  placeholder="e.g., Door Height"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                    Value
                  </Text>
                  <TextInput
                    value={measurement.value}
                    onChangeText={(val) => updateMeasurement(index, 'value', val)}
                    placeholder="0"
                    keyboardType="decimal-pad"
                    className="bg-white px-3 h-10 rounded-lg"
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                    Unit
                  </Text>
                  <TextInput
                    value={measurement.unit}
                    onChangeText={(val) => updateMeasurement(index, 'unit', val)}
                    placeholder="ft"
                    className="bg-white px-3 h-10 rounded-lg"
                    style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <TextInput
                value={measurement.notes}
                onChangeText={(val) => updateMeasurement(index, 'notes', val)}
                placeholder="Notes (optional)"
                className="bg-white px-3 h-10 rounded-lg"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}

          {measurements.length === 0 && (
            <View className="items-center py-8">
              <Feather name="ruler" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
                No custom measurements added
              </Text>
            </View>
          )}
        </View>

        {/* SECTION 10: PHOTOS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="camera" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Site Photos
            </Text>
          </View>

          <TouchableOpacity 
            className="bg-blue-50 p-4 rounded-xl flex-row items-center justify-center mb-4"
            style={{ borderWidth: 1, borderColor: '#DBEAFE', borderStyle: 'dashed' }}
            onPress={addPhoto}
          >
            <Feather name="upload" size={20} color="#0066FF" />
            <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Add Photo
            </Text>
          </TouchableOpacity>

          {formData.photos.length === 0 && (
            <View className="items-center py-8">
              <Feather name="image" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
                No photos uploaded yet
              </Text>
            </View>
          )}

          {formData.photos.map((photo, index) => (
            <View key={index} className="mb-2">
              <Image source={{ uri: photo }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
            </View>
          ))}
        </View>

        {/* SECTION 11: OBSERVATIONS */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
                <Feather name="eye" size={18} color="#0066FF" />
              </View>
              <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
                Observations
              </Text>
            </View>
            <TouchableOpacity onPress={addObservation}>
              <Feather name="plus-circle" size={24} color="#0066FF" />
            </TouchableOpacity>
          </View>

          {formData.observations.map((observation, index) => (
            <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: '#E5E7EB' }}>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
                  Observation {index + 1}
                </Text>
                <TouchableOpacity onPress={() => removeObservation(index)}>
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View className="mb-3">
                <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                  Title
                </Text>
                <TextInput
                  value={observation.title}
                  onChangeText={(val) => updateObservation(index, 'title', val)}
                  placeholder="Observation title"
                  className="bg-white px-3 h-10 rounded-lg"
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB' }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TextInput
                value={observation.description}
                onChangeText={(val) => updateObservation(index, 'description', val)}
                placeholder="Description"
                multiline
                numberOfLines={3}
                className="bg-white px-3 h-20 rounded-lg mb-3"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                    Category
                  </Text>
                  <TouchableOpacity 
                    className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={observation.category ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {observation.category || 'Select category'}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                    Severity
                  </Text>
                  <TouchableOpacity 
                    className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
                  >
                    <Text 
                      className={observation.severity ? 'text-gray-900' : 'text-gray-400'}
                      style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                    >
                      {observation.severity || 'Select severity'}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => updateObservation(index, 'affectsProposal', !observation.affectsProposal)}
                className="flex-row items-center mb-3"
              >
                <View 
                  className="w-5 h-5 rounded items-center justify-center mr-3"
                  style={{ 
                    borderWidth: 2, 
                    borderColor: observation.affectsProposal ? '#0066FF' : '#D1D5DB',
                    backgroundColor: observation.affectsProposal ? '#0066FF' : 'transparent'
                  }}
                >
                  {observation.affectsProposal && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
                  Affects proposal
                </Text>
              </TouchableOpacity>

              <TextInput
                value={observation.recommendedAction}
                onChangeText={(val) => updateObservation(index, 'recommendedAction', val)}
                placeholder="Recommended action"
                multiline
                numberOfLines={2}
                className="bg-white px-3 h-12 rounded-lg"
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 14, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}

          {formData.observations.length === 0 && (
            <View className="items-center py-8">
              <Feather name="eye" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
                No observations added
              </Text>
            </View>
          )}
        </View>

        {/* SECTION 12: FINAL REVIEW */}
        <View className="h-px bg-gray-200 my-2" />
        
        <View className="mb-6 mt-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mr-3">
              <Feather name="check-circle" size={18} color="#0066FF" />
            </View>
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Bold', fontSize: 18 }}>
              Final Review
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Review Status
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: '#E5E7EB' }}
            >
              <Text 
                className={formData.reviewStatus ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.reviewStatus === 'draft' ? 'Draft' : formData.reviewStatus}
              </Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Review Remarks
            </Text>
            <TextInput
              value={formData.reviewRemarks}
              onChangeText={(val) => updateField('reviewRemarks', val)}
              placeholder="Final comments or notes about the survey"
              multiline
              numberOfLines={4}
              className="bg-gray-50 px-4 py-3 rounded-xl"
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15, borderWidth: 1, borderColor: '#E5E7EB', textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="px-5 py-4 bg-white" style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-600 h-12 rounded-xl items-center justify-center mb-3"
        >
          <Text className="text-white" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Submit Survey
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSaveDraft}
          className="bg-gray-100 h-12 rounded-xl items-center justify-center"
        >
          <Text className="text-gray-700" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Save as Draft
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SiteSurveyForm