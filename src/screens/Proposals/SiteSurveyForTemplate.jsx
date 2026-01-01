

import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal, FlatList, Alert, StyleSheet } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import Header from '../../components/Header'
import { ActivityIndicator } from "react-native"
import { useSurvey } from '../../context/StoreProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';

const CLOUDINARY_CONFIG = {
  cloudName: 'dmlsgazvr',
  apiKey: '353369352647425',
  apiSecret: '8qcz7uAdftDVFNd6IqaDOytg_HI', 
};

const SiteSurveyTemplateForm = ({ navigation, route }) => {
  // Zustand store
  const {
    surveyData,
    templateFormData,
    setSurveyData,
    clearStore,
  } = useSurvey();
  
  // Main form state - initialize from store if available
  const [formData, setFormData] = useState(() => {
    // Default form structure
    const defaultForm = {
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
    };
    
    // Merge with stored survey data if available
    if (surveyData) {
      return { ...defaultForm, ...surveyData };
    }
    
    return defaultForm;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const isReadOnly = formData.reviewStatus === 'completed';
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [measurements, setMeasurements] = useState(surveyData?.measurements || []);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalOptions, setModalOptions] = useState([]);
  const [modalField, setModalField] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
    }
  }

  // Options for dropdowns
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
    reviewStatus: ['draft', 'pending review', 'completed', 'cancelled']
  }

  // Initialize from store and route params
//   useEffect(() => {
//     console.log("🔄 Initializing SiteSurveyForm from store:", surveyData);
    
//     // Check for route params (for backward compatibility)
//     if (route.params?.siteSurveyData) {
//       console.log("📥 Got survey data from route params");
//       const dataToSet = { ...formData, ...route.params.siteSurveyData };
//       setFormData(dataToSet);
//       if (route.params.siteSurveyData.measurements) {
//         setMeasurements(route.params.siteSurveyData.measurements);
//       }
//       // Save to store
//       setSurveyData(dataToSet);
//     } else if (surveyData) {
//       // Load from store
//       setFormData(prev => ({ ...prev, ...surveyData }));
//       if (surveyData.measurements) {
//         setMeasurements(surveyData.measurements);
//       }
//     }
//   }, []);
// Update the useEffect that loads data
useEffect(() => {
  console.log("🔄 Initializing SiteSurveyForm from store:", surveyData);
  
  // Check for route params (for backward compatibility)
  if (route.params?.siteSurveyData) {
    console.log("📥 Got survey data from route params");
    const flatData = transformSchemaToFormData(route.params.siteSurveyData);
    const dataToSet = { ...formData, ...flatData };
    setFormData(dataToSet);
    if (route.params.siteSurveyData.measurements) {
      setMeasurements(route.params.siteSurveyData.measurements);
    }
    // Save transformed data to store
    setSurveyData(transformDataForSchema(dataToSet, route.params.siteSurveyData.measurements || []));
  } else if (surveyData) {
    // Load from store (already in schema format, transform to flat)
    const flatData = transformSchemaToFormData(surveyData);
    setFormData(prev => ({ ...prev, ...flatData }));
    if (surveyData.measurements) {
      setMeasurements(surveyData.measurements);
    }
  }
}, []);
  // Auto-save to store with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const dataToSave = {
        ...formData,
        measurements,
        lastModified: new Date().toISOString(),
      };
      
      setIsSaving(true);
      setSurveyData(dataToSave);
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [formData, measurements]);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // Show dropdown modal
  const showDropdown = (type, field) => {
    setModalType(type);
    setModalField(field);
    setModalOptions(dropdownOptions[type] || []);
    setShowModal(true);
  }

  // Handle dropdown selection
  const handleDropdownSelect = (value) => {
    updateField(modalField, value);
    setShowModal(false);
  }

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < formSteps.length) {
      // Mark current step as completed
      const updatedSteps = [...formSteps];
      updatedSteps[currentStep - 1].completed = true;
      
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }

  const goToStep = (step) => {
    setCurrentStep(step);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  // Measurements management
  const addMeasurement = () => {
    setMeasurements([...measurements, { key: '', label: '', value: '', unit: '', notes: '' }]);
  }

  const updateMeasurement = (index, field, value) => {
    const updated = [...measurements];
    updated[index][field] = value;
    setMeasurements(updated);
  }

  const removeMeasurement = (index) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  }

  // Observations management
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
    }));
  }

  const updateObservation = (index, field, value) => {
    const updated = [...formData.observations];
    updated[index][field] = value;
    updateField('observations', updated);
  }

  const removeObservation = (index) => {
    const updated = formData.observations.filter((_, i) => i !== index);
    updateField('observations', updated);
  }

  // Cloudinary functions
  const generateSignature = async (timestamp) => {
    try {
      const stringToSign = `timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
      const signature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA1,
        stringToSign
      );
      return signature;
    } catch (error) {
      console.error('Error generating signature:', error);
      throw new Error('Failed to generate signature');
    }
  };

  const uploadToCloudinary = async (imageUri, fileType = 'image') => {
    try {
      console.log('Starting Cloudinary signed upload...');
      const timestamp = Math.round(Date.now() / 1000);
      const signature = await generateSignature(timestamp);
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `${fileType}/${match[1]}` : `${fileType}/jpeg`;
      
      formData.append('file', {
        uri: imageUri,
        type: type,
        name: filename || `photo_${Date.now()}.jpg`,
      });
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
      
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${fileType}/upload`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Cloudinary response:', e);
        return {
          success: false,
          error: 'Invalid response from Cloudinary',
          details: responseText,
        };
      }
      
      if (response.ok && data.secure_url) {
        console.log('✅ Cloudinary upload successful:', data.secure_url);
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
        };
      } else {
        console.error('❌ Cloudinary upload failed:', data);
        return {
          success: false,
          error: data.error?.message || `Upload failed with status ${response.status}`,
          details: data,
        };
      }
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const addPhoto = async () => {
    if (isReadOnly) return;

    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photo library.');
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('Image selection cancelled');
        return;
      }

      setIsUploading(true);
      const uploadResult = await uploadToCloudinary(result.assets[0].uri, 'image');

      if (uploadResult.success) {
        const newPhotos = [...formData.photos, uploadResult.url];
        updateField('photos', newPhotos);
        Alert.alert('Success', 'Photo uploaded to Cloudinary successfully!');
      } else {
        Alert.alert('Upload Failed', uploadResult.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Photo Upload Error:', error);
      Alert.alert('Error', 'Error uploading photo');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    const finalData = {
      ...formData,
      measurements,
      reviewStatus: 'draft',
      lastModified: new Date().toISOString(),
    };
    
    // Save to store
    setSurveyData(finalData);
    
    Alert.alert(
      'Draft Saved',
      'Your survey has been saved as a draft. You can continue editing later.',
      [{ 
        text: 'OK', 
        onPress: () => navigation.navigate('CreateTemplate', {
          draftSaved: true,
        })
      }]
    );
  };
// Add this transformation function to your component
const transformDataForSchema = (formData, measurements) => {
  // Map flat form fields to nested schema structure
  const transformedData = {
    // Basic fields
    surveyDate: new Date().toISOString().split('T')[0], // Current date
    description: formData.siteName ? `Survey for ${formData.siteName}` : '',
    documents: [],
    comments: [],
    status: 'pending',
    photos: formData.photos || [],

    // Location
    location: {
      siteName: formData.siteName || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      state: formData.state || '',
      pincode: formData.pincode || '',
      latitude: formData.latitude || '',
      longitude: formData.longitude || '',
      landmark: formData.landmark || ''
    },

    // Plot Details
    plotDetails: {
      plotShape: formData.plotShape || '',
      plotLength: formData.plotLength || '',
      plotWidth: formData.plotWidth || '',
      plotArea: formData.plotArea || '',
      areaUnit: formData.areaUnit || 'sq.ft',
      frontageWidth: formData.frontageWidth || '',
      roadWidthFront: formData.roadWidthFront || '',
      cornerPlot: formData.cornerPlot || false,
      permissibleFSI: formData.permissibleFSI || '',
      maxPermissibleHeight: formData.maxPermissibleHeight || ''
    },

    // Setbacks
    setbacks: {
      setbackFront: formData.setbackFront || '',
      setbackBack: formData.setbackBack || '',
      setbackLeft: formData.setbackLeft || '',
      setbackRight: formData.setbackRight || '',
      setbackUnit: formData.setbackUnit || 'ft'
    },

    // Topography
    topography: {
      slopeDirection: formData.slopeDirection || '',
      slopeGradient: formData.slopeGradient || '',
      floodingHistory: formData.floodingHistory || false,
      floodingRemarks: formData.floodingRemarks || ''
    },

    // Soil
    soil: {
      soilType: formData.soilType || '',
      soilRemark: formData.soilRemark || '',
      rockPresence: formData.rockPresence || false,
      rockDepthApprox: formData.rockDepthApprox || '',
      waterTableDepthApprox: formData.waterTableDepthApprox || '',
      contaminationSigns: formData.contaminationSigns || false,
      contaminationRemarks: formData.contaminationRemarks || ''
    },

    // Surroundings
    surroundings: {
      north: {
        type: formData.northType || '',
        description: formData.northDescription || ''
      },
      south: {
        type: formData.southType || '',
        description: formData.southDescription || ''
      },
      east: {
        type: formData.eastType || '',
        description: formData.eastDescription || ''
      },
      west: {
        type: formData.westType || '',
        description: formData.westDescription || ''
      },
      neighborhoodType: formData.neighborhoodType || '',
      noiseLevel: formData.noiseLevel || '',
      dustPollutionLevel: formData.dustPollutionLevel || '',
      distanceToMainRoad: formData.distanceToMainRoad || '',
      distanceToTransformer: formData.distanceToTransformer || '',
      highTensionLine: formData.highTensionLine || false,
      highTensionRemarks: formData.highTensionRemarks || ''
    },

    // Utilities
    utilities: {
      water: {
        available: formData.waterAvailable || false,
        source: formData.waterSource || '',
        remarks: formData.waterRemarks || ''
      },
      electricity: {
        available: formData.electricityAvailable || false,
        phase: formData.electricityPhase || '',
        meterInstalled: formData.meterInstalled || false,
        remarks: formData.electricityRemarks || ''
      },
      sewage: {
        available: formData.sewageAvailable || false,
        type: formData.sewageType || '',
        remarks: formData.sewageRemarks || ''
      },
      drain: {
        available: formData.drainAvailable || false,
        condition: formData.drainCondition || '',
        remarks: formData.drainRemarks || ''
      },
      internet: {
        available: formData.internetAvailable || false,
        type: formData.internetType || '',
        remarks: formData.internetRemarks || ''
      }
    },

    // Access
    access: {
      mainEntryWidth: formData.mainEntryWidth || '',
      accessRoadType: formData.accessRoadType || '',
      accessRoadCondition: formData.accessRoadCondition || '',
      heavyVehicleAccess: formData.heavyVehicleAccess || false,
      craneAccess: formData.craneAccess || false,
      materialStorageAvailable: formData.materialStorageAvailable || false,
      materialStorageArea: formData.materialStorageArea || '',
      remarks: formData.accessRemarks || ''
    },

    // Existing Structures
    existingStructures: {
      hasExistingStructure: formData.hasExistingStructure || false,
      structureType: formData.structureType || '',
      noOfFloors: formData.noOfFloors || '',
      approximateAge: formData.approximateAge || '',
      structuralCondition: formData.structuralCondition || '',
      demolitionRequired: formData.demolitionRequired || false,
      partialDemolition: formData.partialDemolition || false,
      demolitionRemarks: formData.demolitionRemarks || ''
    },

    // Risks
    risks: {
      legalDispute: formData.legalDispute || false,
      legalDisputeRemarks: formData.legalDisputeRemarks || '',
      encroachment: formData.encroachment || false,
      encroachmentRemarks: formData.encroachmentRemarks || '',
      heritageZone: formData.heritageZone || false,
      restrictedHeight: formData.restrictedHeight || false,
      remarks: formData.risksRemarks || ''
    },

    // Measurements (from separate state)
    measurements: measurements.map(m => ({
      key: m.key || m.label || '',
      label: m.label || '',
      value: m.value || '',
      unit: m.unit || '',
      notes: m.notes || ''
    })),

    // Observations
    observations: formData.observations || [],

    // Review
    review: {
      status: formData.reviewStatus || 'draft',
      remarks: formData.reviewRemarks || ''
    }
  };

  return transformedData;
};

// Also create a function to transform from schema to flat form data
const transformSchemaToFormData = (surveySchema) => {
  if (!surveySchema) return null;
  
  return {
    // Location
    siteName: surveySchema.location?.siteName || '',
    addressLine1: surveySchema.location?.addressLine1 || '',
    addressLine2: surveySchema.location?.addressLine2 || '',
    city: surveySchema.location?.city || '',
    state: surveySchema.location?.state || '',
    pincode: surveySchema.location?.pincode || '',
    latitude: surveySchema.location?.latitude || '',
    longitude: surveySchema.location?.longitude || '',
    landmark: surveySchema.location?.landmark || '',
    
    // Plot Details
    plotShape: surveySchema.plotDetails?.plotShape || '',
    plotLength: surveySchema.plotDetails?.plotLength || '',
    plotWidth: surveySchema.plotDetails?.plotWidth || '',
    plotArea: surveySchema.plotDetails?.plotArea || '',
    areaUnit: surveySchema.plotDetails?.areaUnit || 'sq.ft',
    frontageWidth: surveySchema.plotDetails?.frontageWidth || '',
    roadWidthFront: surveySchema.plotDetails?.roadWidthFront || '',
    cornerPlot: surveySchema.plotDetails?.cornerPlot || false,
    permissibleFSI: surveySchema.plotDetails?.permissibleFSI || '',
    maxPermissibleHeight: surveySchema.plotDetails?.maxPermissibleHeight || '',
    
    // Setbacks
    setbackFront: surveySchema.setbacks?.setbackFront || '',
    setbackBack: surveySchema.setbacks?.setbackBack || '',
    setbackLeft: surveySchema.setbacks?.setbackLeft || '',
    setbackRight: surveySchema.setbacks?.setbackRight || '',
    setbackUnit: surveySchema.setbacks?.setbackUnit || 'ft',
    
    // Topography
    slopeDirection: surveySchema.topography?.slopeDirection || '',
    slopeGradient: surveySchema.topography?.slopeGradient || '',
    floodingHistory: surveySchema.topography?.floodingHistory || false,
    floodingRemarks: surveySchema.topography?.floodingRemarks || '',
    
    // Soil
    soilType: surveySchema.soil?.soilType || '',
    soilRemark: surveySchema.soil?.soilRemark || '',
    rockPresence: surveySchema.soil?.rockPresence || false,
    rockDepthApprox: surveySchema.soil?.rockDepthApprox || '',
    waterTableDepthApprox: surveySchema.soil?.waterTableDepthApprox || '',
    contaminationSigns: surveySchema.soil?.contaminationSigns || false,
    contaminationRemarks: surveySchema.soil?.contaminationRemarks || '',
    
    // Surroundings
    northType: surveySchema.surroundings?.north?.type || '',
    northDescription: surveySchema.surroundings?.north?.description || '',
    southType: surveySchema.surroundings?.south?.type || '',
    southDescription: surveySchema.surroundings?.south?.description || '',
    eastType: surveySchema.surroundings?.east?.type || '',
    eastDescription: surveySchema.surroundings?.east?.description || '',
    westType: surveySchema.surroundings?.west?.type || '',
    westDescription: surveySchema.surroundings?.west?.description || '',
    neighborhoodType: surveySchema.surroundings?.neighborhoodType || '',
    noiseLevel: surveySchema.surroundings?.noiseLevel || '',
    dustPollutionLevel: surveySchema.surroundings?.dustPollutionLevel || '',
    distanceToMainRoad: surveySchema.surroundings?.distanceToMainRoad || '',
    distanceToTransformer: surveySchema.surroundings?.distanceToTransformer || '',
    highTensionLine: surveySchema.surroundings?.highTensionLine || false,
    highTensionRemarks: surveySchema.surroundings?.highTensionRemarks || '',
    
    // Utilities
    waterAvailable: surveySchema.utilities?.water?.available || false,
    waterSource: surveySchema.utilities?.water?.source || '',
    waterRemarks: surveySchema.utilities?.water?.remarks || '',
    electricityAvailable: surveySchema.utilities?.electricity?.available || false,
    electricityPhase: surveySchema.utilities?.electricity?.phase || '',
    meterInstalled: surveySchema.utilities?.electricity?.meterInstalled || false,
    electricityRemarks: surveySchema.utilities?.electricity?.remarks || '',
    sewageAvailable: surveySchema.utilities?.sewage?.available || false,
    sewageType: surveySchema.utilities?.sewage?.type || '',
    sewageRemarks: surveySchema.utilities?.sewage?.remarks || '',
    drainAvailable: surveySchema.utilities?.drain?.available || false,
    drainCondition: surveySchema.utilities?.drain?.condition || '',
    drainRemarks: surveySchema.utilities?.drain?.remarks || '',
    internetAvailable: surveySchema.utilities?.internet?.available || false,
    internetType: surveySchema.utilities?.internet?.type || '',
    internetRemarks: surveySchema.utilities?.internet?.remarks || '',
    
    // Access
    mainEntryWidth: surveySchema.access?.mainEntryWidth || '',
    accessRoadType: surveySchema.access?.accessRoadType || '',
    accessRoadCondition: surveySchema.access?.accessRoadCondition || '',
    heavyVehicleAccess: surveySchema.access?.heavyVehicleAccess || false,
    craneAccess: surveySchema.access?.craneAccess || false,
    materialStorageAvailable: surveySchema.access?.materialStorageAvailable || false,
    materialStorageArea: surveySchema.access?.materialStorageArea || '',
    accessRemarks: surveySchema.access?.remarks || '',
    
    // Existing Structures
    hasExistingStructure: surveySchema.existingStructures?.hasExistingStructure || false,
    structureType: surveySchema.existingStructures?.structureType || '',
    noOfFloors: surveySchema.existingStructures?.noOfFloors || '',
    approximateAge: surveySchema.existingStructures?.approximateAge || '',
    structuralCondition: surveySchema.existingStructures?.structuralCondition || '',
    demolitionRequired: surveySchema.existingStructures?.demolitionRequired || false,
    partialDemolition: surveySchema.existingStructures?.partialDemolition || false,
    demolitionRemarks: surveySchema.existingStructures?.demolitionRemarks || '',
    
    // Risks
    legalDispute: surveySchema.risks?.legalDispute || false,
    legalDisputeRemarks: surveySchema.risks?.legalDisputeRemarks || '',
    encroachment: surveySchema.risks?.encroachment || false,
    encroachmentRemarks: surveySchema.risks?.encroachmentRemarks || '',
    heritageZone: surveySchema.risks?.heritageZone || false,
    restrictedHeight: surveySchema.risks?.restrictedHeight || false,
    risksRemarks: surveySchema.risks?.remarks || '',
    
    // Arrays
    photos: surveySchema.photos || [],
    observations: surveySchema.observations || [],
    
    // Review
    reviewStatus: surveySchema.review?.status || 'draft',
    reviewRemarks: surveySchema.review?.remarks || ''
  };
};
  // Handle Submit
  const handleSubmit = async () => {

     const transformedData = transformDataForSchema(formData, measurements);
 const finalData = {
    ...transformedData,
    projectId: route.params?.projectId, // You'll need to pass this
    requestedBy: route.params?.userId,  // You'll need to pass this
    status: formData.reviewStatus === 'completed' ? 'approved' : 'pending',
    rejectionReason: '',
    approvedAt: formData.reviewStatus === 'completed' ? new Date() : null,
    surveyDate: new Date().toISOString().split('T')[0],
    submittedAt: new Date().toISOString(),
  };
  
  // Save to store
  setSurveyData(finalData);
    
    Alert.alert(
      'Survey Submitted',
      'Your site survey has been submitted successfully!',
      [{ 
        text: 'OK', 
        onPress: () => navigation.navigate('CreateTemplate', {
          surveySubmitted: true,
        })
      }]
    );
  };

  // Handle back navigation
  const handleBack = () => {
    // Auto-save before leaving
    const currentData = {
      ...formData,
      measurements,
      reviewStatus: formData.reviewStatus || 'draft',
      lastModified: new Date().toISOString(),
    };
    
    setSurveyData(currentData);
    
    navigation.goBack();
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      'siteName', 'addressLine1', 'city', 'state', 'pincode',
      'plotShape', 'plotLength', 'plotWidth', 'plotArea'
    ];
    
    const filled = requiredFields.filter(field => formData[field]).length;
    return Math.round((filled / requiredFields.length) * 100);
  }

  const scrollViewRef = useRef();

  // Get step icon
  const getStepIcon = (stepId) => {
    const step = formSteps.find(s => s.id === stepId);
    return step ? step.icon : 'edit';
  }

  // Save indicator component
  const renderSaveIndicator = () => (
    <View style={styles.saveIndicator}>
      {isSaving ? (
        <View style={[styles.indicatorBox, { backgroundColor: '#FFA500' }]}>
          <ActivityIndicator size={12} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.indicatorText}>Saving...</Text>
        </View>
      ) : lastSaved ? (
        <View style={[styles.indicatorBox, { backgroundColor: '#4CAF50' }]}>
          <Feather name="check" size={12} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.indicatorText}>Saved {lastSaved}</Text>
        </View>
      ) : null}
    </View>
  );

  // Render step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1: // Location Details
        return renderLocationStep();
      case 2: // Plot Details
        return renderPlotStep();
      case 3: // Setbacks
        return renderSetbacksStep();
      case 4: // Topography & Soil
        return renderTopographyStep();
      case 5: // Surroundings
        return renderSurroundingsStep();
      case 6: // Utilities & Access
        return renderUtilitiesStep();
      case 7: // Existing Structures
        return renderStructuresStep();
      case 8: // Risks & Constraints
        return renderRisksStep();
      case 9: // Custom Measurements
        return renderMeasurementsStep();
      case 10: // Photos
        return renderPhotosStep();
      case 11: // Observations
        return renderObservationsStep();
      case 12: // Final Review
        return renderReviewStep();
      default:
        return renderLocationStep();
    }
  }

  // STEP 1: Location Details
  const renderLocationStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Site Name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={formData.siteName}
          onChangeText={(val) => updateField('siteName', val)}
          placeholder="e.g., Villa Construction - Aundh"
          className="bg-gray-50 px-4 h-12 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: formData.siteName ? themeColors.primary : themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Address Line 1 <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={formData.addressLine1}
          onChangeText={(val) => updateField('addressLine1', val)}
          placeholder="Street address, Plot number"
          className="bg-gray-50 px-4 h-12 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: formData.addressLine1 ? themeColors.primary : themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Address Line 2
        </Text>
        <TextInput
          value={formData.addressLine2}
          onChangeText={(val) => updateField('addressLine2', val)}
          placeholder="Area, Locality"
          className="bg-gray-50 px-4 h-12 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            City <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={formData.city}
            onChangeText={(val) => updateField('city', val)}
            placeholder="Pune"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: formData.city ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: formData.state ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-2">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Pincode <Text className="text-red-500">*</Text>
          </Text>
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
              borderColor: formData.pincode ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Landmark
          </Text>
          <TextInput
            value={formData.landmark}
            onChangeText={(val) => updateField('landmark', val)}
            placeholder="Near XYZ Hospital"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
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
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center justify-center py-2"
          onPress={() => {
            // Here you would integrate with geolocation API
            updateField('latitude', '18.5204');
            updateField('longitude', '73.8567');
          }}
        >
          <Feather name="crosshair" size={14} color={themeColors.primary} />
          <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 13 }}>
            Use Current Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // STEP 2: Plot Details
  const renderPlotStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          Plot Shape <Text className="text-red-500">*</Text>
        </Text>
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ 
            borderWidth: 1, 
            borderColor: formData.plotShape ? themeColors.primary : themeColors.gray[300]
          }}
          onPress={() => showDropdown('plotShape', 'plotShape')}
        >
          <Text 
            className={formData.plotShape ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.plotShape || 'Select plot shape'}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: formData.plotLength ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: formData.plotWidth ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: formData.plotArea ? themeColors.primary : themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Unit
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('areaUnit', 'areaUnit')}
          >
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              {formData.areaUnit}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => updateField('cornerPlot', !formData.cornerPlot)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.cornerPlot ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.cornerPlot ? themeColors.primary : 'transparent'
          }}
        >
          {formData.cornerPlot && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Is this a corner plot?
        </Text>
      </TouchableOpacity>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Permissible FSI
          </Text>
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
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Max Height (ft)
          </Text>
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
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      </View>
    </View>
  );

  // ... (rest of the render functions remain the same as your original code)
  // I'm omitting them here for brevity, but they should stay exactly as you have them

  // STEP 3: Setbacks
  const renderSetbacksStep = () => (
    <View className="mb-6">
      <View className="bg-gray-50 p-4 rounded-xl mb-5">
        <Text className="text-gray-600 mb-3" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
          Enter setbacks from boundary walls in feet
        </Text>
        
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
              className="bg-white px-4 h-12 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 15, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
              className="bg-white px-4 h-12 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 15, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Left
            </Text>
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
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
              className="bg-white px-4 h-12 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 15, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
          </View>
        </View>
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Setback Unit
        </Text>
        <View className="flex-row">
          {['ft', 'm'].map((unit) => (
            <TouchableOpacity
              key={unit}
              onPress={() => updateField('setbackUnit', unit)}
              className={`px-4 py-2 mr-3 rounded-lg ${formData.setbackUnit === unit ? 'bg-blue-100' : 'bg-gray-100'}`}
              style={{ 
                borderWidth: 1,
                borderColor: formData.setbackUnit === unit ? themeColors.primary : themeColors.gray[300]
              }}
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
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
          onPress={() => showDropdown('slopeDirection', 'slopeDirection')}
        >
          <Text 
            className={formData.slopeDirection ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.slopeDirection || 'Select slope direction'}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Slope Gradient
        </Text>
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
          onPress={() => showDropdown('slopeGradient', 'slopeGradient')}
        >
          <Text 
            className={formData.slopeGradient ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.slopeGradient || 'Select gradient'}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => updateField('floodingHistory', !formData.floodingHistory)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.floodingHistory ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.floodingHistory ? themeColors.primary : 'transparent'
          }}
        >
          {formData.floodingHistory && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          History of flooding?
        </Text>
      </TouchableOpacity>

      {formData.floodingHistory && (
        <View className="mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Soil Type
        </Text>
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
          onPress={() => showDropdown('soilType', 'soilType')}
        >
          <Text 
            className={formData.soilType ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.soilType || 'Select soil type'}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View className="mb-5">
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
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300],
            textAlignVertical: 'top'
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <TouchableOpacity 
        onPress={() => updateField('rockPresence', !formData.rockPresence)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.rockPresence ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.rockPresence ? themeColors.primary : 'transparent'
          }}
        >
          {formData.rockPresence && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Rock presence detected?
        </Text>
      </TouchableOpacity>

      {formData.rockPresence && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Approx. Rock Depth (ft)
          </Text>
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
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Water Table Depth (ft)
        </Text>
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
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <TouchableOpacity 
        onPress={() => updateField('contaminationSigns', !formData.contaminationSigns)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.contaminationSigns ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.contaminationSigns ? themeColors.primary : 'transparent'
          }}
        >
          {formData.contaminationSigns && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Signs of contamination?
        </Text>
      </TouchableOpacity>

      {formData.contaminationSigns && (
        <View className="mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}
    </View>
  )

  // STEP 5: Surroundings
  const renderSurroundingsStep = () => (
    <View className="mb-6">
      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          North Side
        </Text>
        <View className="mb-3">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Type
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('surroundingType', 'northType')}
          >
            <Text 
              className={formData.northType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
            >
              {formData.northType || 'Select type'}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <TextInput
          value={formData.northDescription}
          onChangeText={(val) => updateField('northDescription', val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 14, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          South Side
        </Text>
        <View className="mb-3">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Type
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('surroundingType', 'southType')}
          >
            <Text 
              className={formData.southType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
            >
              {formData.southType || 'Select type'}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <TextInput
          value={formData.southDescription}
          onChangeText={(val) => updateField('southDescription', val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 14, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          East Side
        </Text>
        <View className="mb-3">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Type
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('surroundingType', 'eastType')}
          >
            <Text 
              className={formData.eastType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
            >
              {formData.eastType || 'Select type'}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <TextInput
          value={formData.eastDescription}
          onChangeText={(val) => updateField('eastDescription', val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 14, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
          West Side
        </Text>
        <View className="mb-3">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
            Type
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-11 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('surroundingType', 'westType')}
          >
            <Text 
              className={formData.westType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
            >
              {formData.westType || 'Select type'}
            </Text>
            <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <TextInput
          value={formData.westDescription}
          onChangeText={(val) => updateField('westDescription', val)}
          placeholder="Description"
          className="bg-gray-50 px-4 h-11 rounded-xl"
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 14, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="h-px bg-gray-200 my-4" />

      <View className="mb-5">
        <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
          Neighborhood Type
        </Text>
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
          onPress={() => showDropdown('neighborhoodType', 'neighborhoodType')}
        >
          <Text 
            className={formData.neighborhoodType ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.neighborhoodType || 'Select type'}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Noise Level
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('noiseLevel', 'noiseLevel')}
          >
            <Text 
              className={formData.noiseLevel ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.noiseLevel || 'Select'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Dust Pollution
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('dustPollutionLevel', 'dustPollutionLevel')}
          >
            <Text 
              className={formData.dustPollutionLevel ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.dustPollutionLevel || 'Select'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => updateField('highTensionLine', !formData.highTensionLine)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.highTensionLine ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.highTensionLine ? themeColors.primary : 'transparent'
          }}
        >
          {formData.highTensionLine && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          High tension line present?
        </Text>
      </TouchableOpacity>

      {formData.highTensionLine && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            High Tension Line Remarks
          </Text>
          <TextInput
            value={formData.highTensionRemarks}
            onChangeText={(val) => updateField('highTensionRemarks', val)}
            placeholder="Distance, location details"
            className="bg-gray-50 px-4 h-12 rounded-xl"
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}
    </View>
  )

  // STEP 6: Utilities & Access
  const renderUtilitiesStep = () => (
    <View className="mb-6">
      {/* Water Supply */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16 }}>
            Water Supply
          </Text>
          <TouchableOpacity 
            onPress={() => updateField('waterAvailable', !formData.waterAvailable)}
            className="w-12 h-7 rounded-full p-1"
            style={{ backgroundColor: formData.waterAvailable ? themeColors.primary : themeColors.gray[300] }}
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
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('waterSource', 'waterSource')}
              >
                <Text 
                  className={formData.waterSource ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.waterSource || 'Select source'}
                </Text>
                <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.waterRemarks}
              onChangeText={(val) => updateField('waterRemarks', val)}
              placeholder="Additional remarks"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
            style={{ backgroundColor: formData.electricityAvailable ? themeColors.primary : themeColors.gray[300] }}
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
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('electricityPhase', 'electricityPhase')}
              >
                <Text 
                  className={formData.electricityPhase ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.electricityPhase || 'Select phase'}
                </Text>
                <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
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
                  borderColor: formData.meterInstalled ? themeColors.primary : themeColors.gray[300],
                  backgroundColor: formData.meterInstalled ? themeColors.primary : 'transparent'
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
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
            style={{ backgroundColor: formData.sewageAvailable ? themeColors.primary : themeColors.gray[300] }}
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
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('sewageType', 'sewageType')}
              >
                <Text 
                  className={formData.sewageType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.sewageType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.sewageRemarks}
              onChangeText={(val) => updateField('sewageRemarks', val)}
              placeholder="Additional remarks"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
            style={{ backgroundColor: formData.drainAvailable ? themeColors.primary : themeColors.gray[300] }}
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
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('drainCondition', 'drainCondition')}
              >
                <Text 
                  className={formData.drainCondition ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.drainCondition || 'Select condition'}
                </Text>
                <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.drainRemarks}
              onChangeText={(val) => updateField('drainRemarks', val)}
              placeholder="Additional remarks"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
            style={{ backgroundColor: formData.internetAvailable ? themeColors.primary : themeColors.gray[300] }}
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
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('internetType', 'internetType')}
              >
                <Text 
                  className={formData.internetType ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {formData.internetType || 'Select type'}
                </Text>
                <Feather name="chevron-down" size={18} color={themeColors.gray[400]} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={formData.internetRemarks}
              onChangeText={(val) => updateField('internetRemarks', val)}
              placeholder="Additional remarks"
              className="bg-gray-50 px-4 h-11 rounded-xl"
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
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
            borderColor: themeColors.gray[300]
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Access Road Type
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('accessRoadType', 'accessRoadType')}
          >
            <Text 
              className={formData.accessRoadType ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.accessRoadType || 'Select'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Road Condition
          </Text>
          <TouchableOpacity 
            className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
            style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
            onPress={() => showDropdown('accessRoadCondition', 'accessRoadCondition')}
          >
            <Text 
              className={formData.accessRoadCondition ? 'text-gray-900' : 'text-gray-400'}
              style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
            >
              {formData.accessRoadCondition || 'Select'}
            </Text>
            <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
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
            borderColor: formData.heavyVehicleAccess ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.heavyVehicleAccess ? themeColors.primary : 'transparent'
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
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.craneAccess ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.craneAccess ? themeColors.primary : 'transparent'
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
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.materialStorageAvailable ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.materialStorageAvailable ? themeColors.primary : 'transparent'
          }}
        >
          {formData.materialStorageAvailable && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Material storage space available
        </Text>
      </TouchableOpacity>

      {formData.materialStorageAvailable && (
        <View className="mb-5">
          <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
            Approx. Storage Area (sq.ft)
          </Text>
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
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}

      <View className="mb-5">
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
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300],
            textAlignVertical: 'top'
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
      </View>
    </View>
  )

  // STEP 7: Existing Structures
  const renderStructuresStep = () => (
    <View className="mb-6">
      <TouchableOpacity 
        onPress={() => updateField('hasExistingStructure', !formData.hasExistingStructure)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.hasExistingStructure ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.hasExistingStructure ? themeColors.primary : 'transparent'
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
          <View className="mb-5">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Structure Type
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
              onPress={() => showDropdown('structureType', 'structureType')}
            >
              <Text 
                className={formData.structureType ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.structureType || 'Select type'}
              </Text>
              <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mb-5">
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
                style={{ 
                  fontFamily: 'Urbanist-Regular', 
                  fontSize: 15, 
                  borderWidth: 1, 
                  borderColor: themeColors.gray[300]
                }}
                placeholderTextColor={themeColors.gray[400]}
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
                style={{ 
                  fontFamily: 'Urbanist-Regular', 
                  fontSize: 15, 
                  borderWidth: 1, 
                  borderColor: themeColors.gray[300]
                }}
                placeholderTextColor={themeColors.gray[400]}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 14 }}>
              Structural Condition
            </Text>
            <TouchableOpacity 
              className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
              style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
              onPress={() => showDropdown('structuralCondition', 'structuralCondition')}
            >
              <Text 
                className={formData.structuralCondition ? 'text-gray-900' : 'text-gray-400'}
                style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
              >
                {formData.structuralCondition || 'Select condition'}
              </Text>
              <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
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
                borderColor: formData.demolitionRequired ? themeColors.primary : themeColors.gray[300],
                backgroundColor: formData.demolitionRequired ? themeColors.primary : 'transparent'
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
            className="flex-row items-center mb-5"
          >
            <View 
              className="w-5 h-5 rounded items-center justify-center mr-3"
              style={{ 
                borderWidth: 2, 
                borderColor: formData.partialDemolition ? themeColors.primary : themeColors.gray[300],
                backgroundColor: formData.partialDemolition ? themeColors.primary : 'transparent'
              }}
            >
              {formData.partialDemolition && <Feather name="check" size={14} color="white" />}
            </View>
            <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
              Partial demolition only
            </Text>
          </TouchableOpacity>

          <View className="mb-5">
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
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 15, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300],
                textAlignVertical: 'top'
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
          </View>
        </>
      )}
    </View>
  )

  // STEP 8: Risks & Constraints
  const renderRisksStep = () => (
    <View className="mb-6">
      <TouchableOpacity 
        onPress={() => updateField('legalDispute', !formData.legalDispute)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.legalDispute ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.legalDispute ? themeColors.primary : 'transparent'
          }}
        >
          {formData.legalDispute && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Known legal disputes
        </Text>
      </TouchableOpacity>

      {formData.legalDispute && (
        <View className="mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      )}

      <TouchableOpacity 
        onPress={() => updateField('encroachment', !formData.encroachment)}
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.encroachment ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.encroachment ? themeColors.primary : 'transparent'
          }}
        >
          {formData.encroachment && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Encroachment observed
        </Text>
      </TouchableOpacity>

      {formData.encroachment && (
        <View className="mb-5">
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 15, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
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
            borderColor: formData.heritageZone ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.heritageZone ? themeColors.primary : 'transparent'
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
        className="flex-row items-center mb-5"
      >
        <View 
          className="w-5 h-5 rounded items-center justify-center mr-3"
          style={{ 
            borderWidth: 2, 
            borderColor: formData.restrictedHeight ? themeColors.primary : themeColors.gray[300],
            backgroundColor: formData.restrictedHeight ? themeColors.primary : 'transparent'
          }}
        >
          {formData.restrictedHeight && <Feather name="check" size={14} color="white" />}
        </View>
        <Text className="text-gray-700 flex-1" style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}>
          Restricted height zone
        </Text>
      </TouchableOpacity>

      <View className="mb-5">
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
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300],
            textAlignVertical: 'top'
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
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
        <TouchableOpacity onPress={addMeasurement}>
          <Feather name="plus-circle" size={24} color={themeColors.primary} />
        </TouchableOpacity>
      </View>

      {measurements.map((measurement, index) => (
        <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Measurement {index + 1}
            </Text>
            <TouchableOpacity onPress={() => removeMeasurement(index)}>
              <Feather name="trash-2" size={18} color={themeColors.danger} />
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
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
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
                style={{ 
                  fontFamily: 'Urbanist-Regular', 
                  fontSize: 14, 
                  borderWidth: 1, 
                  borderColor: themeColors.gray[300]
                }}
                placeholderTextColor={themeColors.gray[400]}
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
                style={{ 
                  fontFamily: 'Urbanist-Regular', 
                  fontSize: 14, 
                  borderWidth: 1, 
                  borderColor: themeColors.gray[300]
                }}
                placeholderTextColor={themeColors.gray[400]}
              />
            </View>
          </View>

          <TextInput
            value={measurement.notes}
            onChangeText={(val) => updateMeasurement(index, 'notes', val)}
            placeholder="Notes (optional)"
            className="bg-white px-3 h-10 rounded-lg"
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 14, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300]
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      ))}

      {measurements.length === 0 && (
        <View className="items-center py-8">
          <Feather name="ruler" size={40} color={themeColors.gray[300]} />
          <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
            No custom measurements added
          </Text>
          <TouchableOpacity 
            onPress={addMeasurement}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
              Add First Measurement
            </Text>
          </TouchableOpacity>
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
        disabled={isReadOnly || isUploading}
      >
        {isUploading ? (
          <>
            <ActivityIndicator size="small" color={themeColors.primary} />
            <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Uploading...
            </Text>
          </>
        ) : (
          <>
            <Feather name="upload" size={20} color={themeColors.primary} />
            <Text className="text-blue-600 ml-2" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Add Photo
            </Text>
          </>
        )}
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
                const newPhotos = formData.photos.filter((_, i) => i !== index);
                updateField('photos', newPhotos);
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
);
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
        <TouchableOpacity onPress={addObservation}>
          <Feather name="plus-circle" size={24} color={themeColors.primary} />
        </TouchableOpacity>
      </View>

      {formData.observations.map((observation, index) => (
        <View key={index} className="mb-4 p-4 bg-gray-50 rounded-xl" style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 15 }}>
              Observation {index + 1}
            </Text>
            <TouchableOpacity onPress={() => removeObservation(index)}>
              <Feather name="trash-2" size={18} color={themeColors.danger} />
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
              style={{ 
                fontFamily: 'Urbanist-Regular', 
                fontSize: 14, 
                borderWidth: 1, 
                borderColor: themeColors.gray[300]
              }}
              placeholderTextColor={themeColors.gray[400]}
            />
          </View>

          <TextInput
            value={observation.description}
            onChangeText={(val) => updateObservation(index, 'description', val)}
            placeholder="Description"
            multiline
            numberOfLines={3}
            className="bg-white px-3 h-20 rounded-lg mb-3"
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 14, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
          />

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Category
              </Text>
              <TouchableOpacity 
                className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('observationCategory', `observations[${index}].category`)}
              >
                <Text 
                  className={observation.category ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {observation.category || 'Select category'}
                </Text>
                <Feather name="chevron-down" size={16} color={themeColors.gray[400]} />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2" style={{ fontFamily: 'Urbanist-Medium', fontSize: 13 }}>
                Severity
              </Text>
              <TouchableOpacity 
                className="bg-white px-3 h-10 rounded-lg flex-row items-center justify-between"
                style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
                onPress={() => showDropdown('observationSeverity', `observations[${index}].severity`)}
              >
                <Text 
                  className={observation.severity ? 'text-gray-900' : 'text-gray-400'}
                  style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}
                >
                  {observation.severity || 'Select severity'}
                </Text>
                <Feather name="chevron-down" size={16} color={themeColors.gray[400]} />
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
                borderColor: observation.affectsProposal ? themeColors.primary : themeColors.gray[300],
                backgroundColor: observation.affectsProposal ? themeColors.primary : 'transparent'
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
            style={{ 
              fontFamily: 'Urbanist-Regular', 
              fontSize: 14, 
              borderWidth: 1, 
              borderColor: themeColors.gray[300],
              textAlignVertical: 'top'
            }}
            placeholderTextColor={themeColors.gray[400]}
          />
        </View>
      ))}

      {formData.observations.length === 0 && (
        <View className="items-center py-8">
          <Feather name="eye" size={40} color={themeColors.gray[300]} />
          <Text className="text-gray-400 mt-2" style={{ fontFamily: 'Urbanist-Regular', fontSize: 14 }}>
            No observations added
          </Text>
          <TouchableOpacity 
            onPress={addObservation}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: themeColors.primaryLight }}
          >
            <Text className="text-blue-600" style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 14 }}>
              Add First Observation
            </Text>
          </TouchableOpacity>
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
        <TouchableOpacity 
          className="bg-gray-50 px-4 h-12 rounded-xl flex-row items-center justify-between"
          style={{ borderWidth: 1, borderColor: themeColors.gray[300] }}
          onPress={() => showDropdown('reviewStatus', 'reviewStatus')}
        >
          <Text 
            className={formData.reviewStatus ? 'text-gray-900' : 'text-gray-400'}
            style={{ fontFamily: 'Urbanist-Regular', fontSize: 15 }}
          >
            {formData.reviewStatus === 'draft' ? 'Draft' : formData.reviewStatus}
          </Text>
          <Feather name="chevron-down" size={20} color={themeColors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View className="mb-5">
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
          style={{ 
            fontFamily: 'Urbanist-Regular', 
            fontSize: 15, 
            borderWidth: 1, 
            borderColor: themeColors.gray[300],
            textAlignVertical: 'top'
          }}
          placeholderTextColor={themeColors.gray[400]}
        />
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
  return (
    <View className="flex-1 bg-white">
      <Header 
        title="Site Survey Form"
        leftIcon="arrow-left"
        onLeftIconPress={handleBack}
      />
      
      {renderSaveIndicator()}
      
      {/* Enhanced Header matching your SiteSurveysTab */}
      <View className="bg-white" style={{ borderBottomWidth: 1, borderBottomColor: themeColors.gray[200] }}>
        {/* Progress Bar */}
        <View className="px-5 pb-3">
          <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: `${calculateCompletion()}%`,
                backgroundColor: themeColors.primary 
              }}
            />
          </View>
        </View>

        {/* Steps Indicator */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-5 pb-4"
        >
          {formSteps.map((step) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => goToStep(step.id)}
              className={`mr-4 px-4 py-2 rounded-lg flex-row items-center ${
                currentStep === step.id 
                  ? 'bg-blue-100' 
                  : step.completed 
                  ? 'bg-green-50' 
                  : 'bg-gray-50'
              }`}
              style={{ 
                borderWidth: 1,
                borderColor: currentStep === step.id 
                  ? themeColors.primary 
                  : step.completed 
                  ? themeColors.success 
                  : themeColors.gray[200]
              }}
            >
              <View 
                className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${
                  currentStep === step.id 
                    ? 'bg-blue-600' 
                    : step.completed 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
                }`}
              >
                {step.completed ? (
                  <Feather name="check" size={14} color="white" />
                ) : (
                  <Text 
                    className="text-white" 
                    style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 12 }}
                  >
                    {step.id}
                  </Text>
                )}
              </View>
              <Text 
                className={`${
                  currentStep === step.id 
                    ? 'text-blue-700' 
                    : step.completed 
                    ? 'text-green-700' 
                    : 'text-gray-600'
                }`}
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
            <Feather 
              name={getStepIcon(currentStep)} 
              size={18} 
              color={themeColors.primary} 
            />
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
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-5 pt-5" 
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mb-20 mt-8">
          <TouchableOpacity
            onPress={prevStep}
            className={`px-6 py-3 rounded-lg flex-row items-center ${
              currentStep === 1 ? 'opacity-50' : ''
            }`}
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
            {currentStep < formSteps.length && (
              <Feather name="arrow-right" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Buttons (Show on last step) */}
      {currentStep === formSteps.length && (
        <View className="px-5 py-4 bg-white" style={{ borderTopWidth: 1, borderTopColor: themeColors.gray[200] }}>
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
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
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
  );
};

const styles = StyleSheet.create({
  saveIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  indicatorBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Urbanist-Medium',
  },
});

export default SiteSurveyTemplateForm;