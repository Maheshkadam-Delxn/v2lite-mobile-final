import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { uploadToCloudinary } from '../../utils/cloudinary';

const HandoverScreen = ({ project }) => {
    const navigation = useNavigation();
    const [status, setStatus] = useState(() => {
        if (project.handover?.handoverAccepted) return 'accepted';
        if (project.handover?.handoverRequested) return 'sent';
        return 'idle';
    });
    // idle, checking, sent, accepted
    const [checklist, setChecklist] = useState([
        { id: 1, key: 'milestones.completed', label: 'Checking Milestones Completion', status: 'pending' },
        { id: 2, key: 'snags.closed', label: 'Verifying Snag Closures', status: 'pending' },
        { id: 3, key: 'handoverReady', label: 'Validating Work Progress', status: 'pending' },
        { id: 4, key: 'handoverReady', label: 'Preparing Handover Documents', status: 'pending' },
    ]);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [handoverDocs, setHandoverDocs] = useState(project.handoverDocuments || []);

    useEffect(() => {
        if (project.handoverDocuments) {
            setHandoverDocs(project.handoverDocuments);
        }
    }, [project.handoverDocuments]);

    const getValueByPath = (obj, path) => {
        return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                // Determine if result.assets exists (new Expo SDK) or result directly (old)
                // Expo SDK 48+ uses result.assets
                const newFiles = result.assets || [result];
                setSelectedFiles(prev => [...prev, ...newFiles]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to select documents");
        }
    };


    const handleSubmitDocument = async () => {
        if (selectedFiles.length === 0) return;

        try {
            setUploading(true);
            const token = await AsyncStorage.getItem("userToken");

            /* ==========================
               1️⃣ Upload ALL files
            ========================== */
            const uploadPromises = selectedFiles.map(async (file) => {
                const uploadResult = await uploadToCloudinary(file);
                console.log("uploadResult", uploadResult);
                if (!uploadResult.success) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                return uploadResult.url; // ✅ URL ONLY
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            console.log("Uploaded URLs:", uploadedUrls);

            /* ==========================
               2️⃣ Send URLs ARRAY once
            ========================== */
            const res = await fetch(
                `${process.env.BASE_API_URL}/api/projects/${project._id}/handover-documents`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentUrls: uploadedUrls, // ✅ ARRAY
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to submit documents");
            }

            Alert.alert("Success", "All handover documents uploaded successfully!");
            setSelectedFiles([]);
            setHandoverDocs(prev => [...prev, ...uploadedUrls]); // ✅ Update local list immediately

        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message || "Failed to upload documents");
        } finally {
            setUploading(false);
        }
    };


    // ... (existing code for sendHandoverRequest etc)

    // ... (existing renderCheckItem)

    // Duplicate block disabled - REMOVING this dead code while I am here? 
    // No, matching exactly what is there to avoid "target not found".
    // I will just replace the rendering logic in the ACTIVE block.

    // Wait, the "Duplicate block disabled" is lines 215-244. 
    // The ACTIVE block is 246-305.
    // I will replace lines 24-91 (state + handlers) AND lines 246-305 (rendering).
    // I should do this in chunks or correct order.

    // Let's replace state + handlers first.



    const sendHandoverRequest = async () => {
        // ... (existing code)
        try {
            const token = await AsyncStorage.getItem("userToken");
            const res = await fetch(
                `${process.env.BASE_API_URL}/api/projects/${project._id}/handover-request`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to send handover request');
            }

            setStatus('sent');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to send handover request');
            setStatus('idle');
        }
    };

    const startHandoverProcess = async () => {
        // ... (existing code)
        try {
            setStatus("checking");

            const res = await fetch(
                `${process.env.BASE_API_URL}/api/projects/${project._id}/handover`
            );

            const data = await res.json();
            console.log("Handover API:", data);

            for (let i = 0; i < checklist.length; i++) {
                const item = checklist[i];

                await new Promise(resolve => setTimeout(resolve, 700)); // smooth UI

                const result = getValueByPath(data, item.key);

                if (result) {
                    setChecklist(prev =>
                        prev.map((c, index) =>
                            index === i ? { ...c, status: "completed" } : c
                        )
                    );
                } else {
                    Alert.alert(
                        "Handover Blocked",
                        `${item.label} failed.\nPlease resolve before handover.`
                    );
                    setStatus("idle");
                    return;
                }
            }

            // ✅ All system checks passed
            await sendHandoverRequest();

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to perform system checks");
            setStatus("idle");
        }
    };

    // ... (runChecks and renderCheckItem)

    // START MODIFIED SECTION FOR RENDER
    const runChecks = (index) => {
        if (index >= checklist.length) {
            setTimeout(() => {
                setStatus('sent');
            }, 1000);
            return;
        }

        setTimeout(() => {
            setChecklist(prev => prev.map((item, i) =>
                i === index ? { ...item, status: 'completed' } : item
            ));
            runChecks(index + 1);
        }, 1500); // Simulate check delay
    };




    const renderCheckItem = (item, index) => {
        let iconName = 'ellipse-outline';
        let iconColor = '#CBD5E1';

        // Animated expansion or just simple conditional rendering logic
        if (checklist[index].status === 'completed') {
            iconName = 'checkmark-circle';
            iconColor = '#10B981';
        } else if (status === 'checking' && checklist[index].status === 'pending' && (index === 0 || checklist[index - 1].status === 'completed')) {
            return (
                <View key={item.id} style={styles.checkItem}>
                    <ActivityIndicator size="small" color="#3B82F6" style={{ marginRight: 12 }} />
                    <Text style={[styles.checkLabel, { color: '#3B82F6', fontWeight: '600' }]}>{item.label}...</Text>
                </View>
            )
        }

        return (
            <View key={item.id} style={styles.checkItem}>
                <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 12 }} />
                <Text style={[
                    styles.checkLabel,
                    checklist[index].status === 'completed' && styles.completedText
                ]}>{item.label}</Text>
            </View>
        );
    };

    if (status === 'accepted') {
        return (
            <View style={styles.container}>
                <View style={[styles.successCard, { padding: 24 }]}>
                    <View style={[styles.successIconBubble, { backgroundColor: '#DBEAFE' }]}>
                        <Ionicons name="document-text" size={40} color="#2563EB" />
                    </View>
                    <Text style={styles.successTitle}>Client Approved!</Text>
                    <Text style={styles.successDesc}>
                        The client has accepted the handover request. Please select and upload the final handover documents.
                    </Text>

                    {/* Existing Documents Section */}
                    {handoverDocs && handoverDocs.length > 0 && (
                        <View style={{ width: '100%', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Previously Uploaded
                            </Text>
                            {handoverDocs.map((docItem, index) => {
                                // Handle both simple string URLs and object structure { documentUrl: '...', documentName: '...' }
                                const url = typeof docItem === 'string' ? docItem : docItem?.documentUrl;
                                const name = typeof docItem === 'object' && docItem?.documentName
                                    ? docItem.documentName
                                    : `Document ${index + 1}`;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#BBF7D0' }}
                                        onPress={() => {
                                            if (url) {
                                                console.log("Opening URL:", url);
                                                Linking.openURL(url).catch(err => Alert.alert("Error", "Could not open document"));
                                            } else {
                                                Alert.alert("Error", "Invalid document URL");
                                            }
                                        }}
                                    >
                                        <Ionicons name="cloud-done" size={20} color="#16A34A" />
                                        <Text style={{ flex: 1, marginLeft: 10, color: '#166534', fontSize: 14, fontWeight: '500' }} numberOfLines={1}>
                                            {name}
                                        </Text>
                                        <Ionicons name="open-outline" size={18} color="#16A34A" />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {selectedFiles.length > 0 && (
                        <View style={{ width: '100%', marginBottom: 20 }}>
                            {selectedFiles.map((file, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                                    <Ionicons name="document-text-outline" size={24} color="#64748B" />
                                    <Text style={{ flex: 1, marginLeft: 10, color: '#334155', fontSize: 14 }} numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <TouchableOpacity onPress={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}>
                                        <Ionicons name="close-circle" size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {selectedFiles.length > 0 ? (
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={handleSubmitDocument}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <Text style={styles.primaryBtnText}>Submit {selectedFiles.length} Documents</Text>
                                        <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginLeft: 8 }} />
                                    </>
                                )}
                            </TouchableOpacity>

                            {!uploading && (
                                <TouchableOpacity
                                    style={{ marginTop: 12, alignItems: 'center' }}
                                    onPress={handlePickDocument}
                                >
                                    <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600' }}>+ Add More Files</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.outlineBtn}
                            onPress={handlePickDocument}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#475569" style={{ marginRight: 8 }} />
                            <Text style={styles.outlineBtnText}>Select Documents (PDF)</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    if (status === 'sent') {
        return (
            <View style={styles.container}>
                <View style={styles.successCard}>
                    <View style={styles.successIconBubble}>
                        <Ionicons name="checkmark" size={40} color="white" />
                    </View>
                    <Text style={styles.successTitle}>Handover Requested!</Text>
                    <Text style={styles.successDesc}>
                        Your handover request has been successfully sent to the admin.
                        You will be notified once the final review is complete.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconBg}>
                        <Ionicons name="key-outline" size={28} color="#F59E0B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Project Handover</Text>
                        <Text style={styles.subtitle}>Initiate official handover process</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {status === 'idle' ? (
                    <View style={styles.idleState}>
                        <Text style={styles.infoText}>
                            Please ensure all site work is completed and validated before initiating the handover request.
                            This will trigger a final system audit.
                        </Text>

                        <TouchableOpacity style={styles.primaryBtn} onPress={startHandoverProcess}>
                            <Text style={styles.primaryBtnText}>Send Handover Request</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.checklistContainer}>
                        <Text style={styles.processingTitle}>Performning System Checks</Text>
                        <View style={{ height: 16 }} />
                        {checklist.map((item, index) => renderCheckItem(item, index))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F8FAFC',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        fontFamily: 'Urbanist-Bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        fontFamily: 'Urbanist-Medium',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 20,
    },
    idleState: {
        alignItems: 'center',
    },
    infoText: {
        fontSize: 15,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        fontFamily: 'Urbanist-Regular',
    },
    primaryBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: '100%',
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Urbanist-SemiBold',
    },
    checklistContainer: {
        paddingVertical: 10,
    },
    processingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        height: 30, // Fixed height for alignment
    },
    checkLabel: {
        fontSize: 15,
        color: '#334155',
        fontFamily: 'Urbanist-Medium',
    },
    completedText: {
        color: '#1E293B',
        fontWeight: '500',
    },
    successCard: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginTop: 40,
    },
    successIconBubble: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'Urbanist-Bold',
    },
    successDesc: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        fontFamily: 'Urbanist-Regular',
    },
    outlineBtn: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
    },
    outlineBtnText: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'Urbanist-SemiBold',
    }
});

export default HandoverScreen;
