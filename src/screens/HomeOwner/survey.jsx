import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Section = ({ title, icon, children, expanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(expanded);

    return (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            marginBottom: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#E5E7EB',
        }}>
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: '#F9FAFB',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#EFF6FF',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}>
                        <Ionicons name={icon} size={18} color="#2563EB" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>{title}</Text>
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </TouchableOpacity>

            {isExpanded && (
                <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                    {children}
                </View>
            )}
        </View>
    );
};

const InfoRow = ({ label, value, fullWidth = false }) => (
    <View style={{
        width: fullWidth ? '100%' : '48%',
        marginBottom: 16,
    }}>
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
            {value || 'Not provided'}
        </Text>
    </View>
);

const Survey = ({ project }) => {
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSurveyDetails();
    }, [project]);

    const fetchSurveyDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem("userToken");

            // Use the project ID directly to fetch the survey
            const projectId = project?._id || project?.id;

            if (!projectId) {
                console.warn("No Project ID found.");
                setLoading(false);
                return;
            }

            // console.log(`Fetching survey details from: ${process.env.BASE_API_URL}/api/surveys/projectid/${projectId}`);
            const response = await fetch(`${process.env.BASE_API_URL}/api/surveys/projectid/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("Survey Fetch Response Status:", response.status);
            const json = await response.json();
            // console.log("Survey Fetch Response JSON:", JSON.stringify(json, null, 2));

            if (response.ok) {
                // Handle different response structures based on logs
                if (json.success && json.survey) {
                    setSurvey(json.survey);
                } else if (json.success && json.data) {
                    setSurvey(json.data);
                } else if (json.location) {
                    // If the response is the survey object itself
                    setSurvey(json);
                } else {
                    // Fallback, though likely json.survey is the correct one based on user log
                    setSurvey(json.survey || json);
                }
            } else {
                if (response.status === 404) {
                    setSurvey(null);
                } else {
                    setError(json.message || "Failed to fetch survey details");
                }
            }
        } catch (err) {
            console.error("Error fetching survey:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0066FF" />
                <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading survey details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text style={{ marginTop: 10, color: '#EF4444', textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity
                    onPress={fetchSurveyDetails}
                    style={{
                        marginTop: 16,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: '#EFF6FF',
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: '#0066FF', fontWeight: '500' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!survey) {
        return (
            <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#F3F4F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                }}>
                    <Ionicons name="clipboard-outline" size={40} color="#9CA3AF" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                    No Survey Found
                </Text>
                <Text style={{ textAlign: 'center', color: '#6B7280', lineHeight: 22 }}>
                    A site survey has not been conducted or linked to this project yet. Please contact your administrator.
                </Text>
            </View>
        );
    }

    // Helper to safely access nested data
    const data = survey || {};
    const location = data.location || {};
    const plot = data.plotDetails || {};
    const setbacks = data.setbacks || {};
    const topo = data.topography || {};
    const utilities = data.utilities || {};
    const access = data.access || {};
    const structures = data.existingStructures || {};

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header Status Card */}
            <View style={{
                backgroundColor: '#EFF6FF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#DBEAFE',
            }}>
                <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
                <View style={{ marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E3A8A' }}>
                        Survey Completed
                    </Text>
                    <Text style={{ fontSize: 13, color: '#1D4ED8' }}>
                        Last updated: {new Date(data.updatedAt || Date.now()).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <Section title="Location Details" icon="location-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Site Name" value={location.siteName} fullWidth />
                    <InfoRow label="Address" value={`${location.addressLine1 || ''} ${location.addressLine2 || ''}`} fullWidth />
                    <InfoRow label="City" value={location.city} />
                    <InfoRow label="State" value={location.state} />
                    <InfoRow label="Pincode" value={location.pincode} />
                    <InfoRow label="Coordinates" value={`${location.latitude || ''}, ${location.longitude || ''}`} />
                </View>
            </Section>

            <Section title="Plot Details" icon="scan-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Plot Shape" value={plot.plotShape} />
                    <InfoRow label="Area" value={`${plot.plotArea || ''} ${plot.areaUnit || ''}`} />
                    <InfoRow label="Dimensions" value={`${plot.plotLength || '0'} x ${plot.plotWidth || '0'}`} />
                    <InfoRow label="Frontage" value={plot.frontageWidth} />
                    <InfoRow label="Road Width" value={plot.roadWidthFront} />
                    <InfoRow label="FSI" value={plot.permissibleFSI} />
                </View>
            </Section>

            <Section title="Setbacks" icon="resize-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Front" value={`${setbacks.setbackFront || ''} ${setbacks.setbackUnit || ''}`} />
                    <InfoRow label="Back" value={`${setbacks.setbackBack || ''} ${setbacks.setbackUnit || ''}`} />
                    <InfoRow label="Left" value={`${setbacks.setbackLeft || ''} ${setbacks.setbackUnit || ''}`} />
                    <InfoRow label="Right" value={`${setbacks.setbackRight || ''} ${setbacks.setbackUnit || ''}`} />
                </View>
            </Section>

            <Section title="Utilities" icon="flash-outline">
                <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={utilities.electricity?.available ? "checkmark-circle" : "close-circle"} size={20} color={utilities.electricity?.available ? "#10B981" : "#9CA3AF"} />
                        <Text style={{ marginLeft: 8, fontSize: 14 }}>Electricity: {utilities.electricity?.phase || 'Unavailable'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={utilities.water?.available ? "checkmark-circle" : "close-circle"} size={20} color={utilities.water?.available ? "#10B981" : "#9CA3AF"} />
                        <Text style={{ marginLeft: 8, fontSize: 14 }}>Water Source: {utilities.water?.source || 'Unavailable'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={utilities.sewage?.available ? "checkmark-circle" : "close-circle"} size={20} color={utilities.sewage?.available ? "#10B981" : "#9CA3AF"} />
                        <Text style={{ marginLeft: 8, fontSize: 14 }}>Sewage: {utilities.sewage?.type || 'Unavailable'}</Text>
                    </View>
                </View>
            </Section>

            <Section title="Topography" icon="file-tray-stacked-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Slope Direction" value={topo.slopeDirection} />
                    <InfoRow label="Gradient" value={topo.slopeGradient} />
                    <InfoRow label="Flooding History" value={topo.floodingHistory ? "Yes" : "No"} />
                    <InfoRow label="Remarks" value={topo.floodingRemarks} fullWidth />
                </View>
            </Section>

            <Section title="Soil Details" icon="leaf-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Soil Type" value={data.soil?.soilType} />
                    <InfoRow label="Rock Presence" value={data.soil?.rockPresence ? "Yes" : "No"} />
                    <InfoRow label="Water Table Depth" value={data.soil?.waterTableDepthApprox} />
                    <InfoRow label="Contamination" value={data.soil?.contaminationSigns ? "Yes" : "No"} />
                    <InfoRow label="Remarks" value={data.soil?.soilRemark} fullWidth />
                </View>
            </Section>

            <Section title="Surroundings" icon="compass-outline">
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 8, color: '#374151' }}>Neighbors</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <InfoRow label="North" value={`${data.surroundings?.north?.type || ''} - ${data.surroundings?.north?.description || ''}`} fullWidth />
                        <InfoRow label="South" value={`${data.surroundings?.south?.type || ''} - ${data.surroundings?.south?.description || ''}`} fullWidth />
                        <InfoRow label="East" value={`${data.surroundings?.east?.type || ''} - ${data.surroundings?.east?.description || ''}`} fullWidth />
                        <InfoRow label="West" value={`${data.surroundings?.west?.type || ''} - ${data.surroundings?.west?.description || ''}`} fullWidth />
                    </View>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <InfoRow label="Neighborhood" value={data.surroundings?.neighborhoodType} />
                        <InfoRow label="Noise Level" value={data.surroundings?.noiseLevel} />
                        <InfoRow label="Dust/Pollution" value={data.surroundings?.dustPollutionLevel} />
                        <InfoRow label="Dist. to Main Road" value={data.surroundings?.distanceToMainRoad} />
                    </View>
                </View>
            </Section>

            <Section title="Access & Approach" icon="car-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Entry Width" value={access.mainEntryWidth} />
                    <InfoRow label="Road Type" value={access.accessRoadType} />
                    <InfoRow label="Road Condition" value={access.accessRoadCondition} />
                    <InfoRow label="Heavy Vehicle Access" value={access.heavyVehicleAccess ? "Yes" : "No"} />
                    <InfoRow label="Crane Access" value={access.craneAccess ? "Yes" : "No"} />
                    <InfoRow label="Material Storage" value={access.materialStorageAvailable ? "Yes" : "No"} />
                </View>
            </Section>

            <Section title="Existing Structures" icon="home-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Existing Structure" value={structures.hasExistingStructure ? "Yes" : "No"} />
                    {structures.hasExistingStructure && (
                        <>
                            <InfoRow label="Type" value={structures.structureType} />
                            <InfoRow label="Floors" value={structures.noOfFloors} />
                            <InfoRow label="Condition" value={structures.structuralCondition} />
                            <InfoRow label="Demolition Req." value={structures.demolitionRequired ? "Yes" : "No"} />
                        </>
                    )}
                </View>
            </Section>

            <Section title="Risks & Regulatory" icon="alert-triangle-outline">
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <InfoRow label="Legal Dispute" value={data.risks?.legalDispute ? "Yes" : "No"} />
                    <InfoRow label="Encroachment" value={data.risks?.encroachment ? "Yes" : "No"} />
                    <InfoRow label="Heritage Zone" value={data.risks?.heritageZone ? "Yes" : "No"} />
                    <InfoRow label="Height Restriction" value={data.risks?.restrictedHeight ? "Yes" : "No"} />
                    <InfoRow label="Risk Remarks" value={data.risks?.remarks} fullWidth />
                </View>
            </Section>

            <Section title="Observations & measurements" icon="eye-outline">
                {data.observations && data.observations.length > 0 ? (
                    data.observations.map((obs, index) => (
                        <View key={index} style={{ marginBottom: 12, borderBottomWidth: index < data.observations.length - 1 ? 1 : 0, borderBottomColor: '#F3F4F6', paddingBottom: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontWeight: '600', color: '#374151' }}>{obs.title || 'Observation ' + (index + 1)}</Text>
                                <View style={{ backgroundColor: obs.severity === 'High' || obs.severity === 'Critical' ? '#FEF2F2' : '#EFF6FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                    <Text style={{ fontSize: 10, color: obs.severity === 'High' || obs.severity === 'Critical' ? '#EF4444' : '#2563EB' }}>{obs.severity}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 13, color: '#6B7280' }}>{obs.description}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No specific observations recorded.</Text>
                )}

                {/* Measurements */}
                <View style={{ marginTop: 16 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 8, color: '#374151' }}>Measurements</Text>
                    {data.measurements && data.measurements.length > 0 ? (
                        data.measurements.map((m, i) => (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 13, color: '#4B5563' }}>{m.label || 'Measurement ' + (i + 1)}</Text>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: '#111827' }}>{m.value} {m.unit}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No additional measurements.</Text>
                    )}
                </View>
            </Section>

            <Section title="Site Photos" icon="images-outline">
                {data.photos && data.photos.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {data.photos.map((photo, index) => (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(photo)}>
                                <Image
                                    source={{ uri: photo }}
                                    style={{ width: 120, height: 120, borderRadius: 8, marginRight: 10, backgroundColor: '#E5E7EB' }}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={{ color: '#6B7280', fontStyle: 'italic' }}>No photos available</Text>
                )}
            </Section>

            {/* Add more sections as needed based on viewSiteSurvey.jsx structure */}

        </ScrollView>
    );
};

export default Survey;
