import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HandoverScreen = ({ project }) => {
    const navigation = useNavigation();
    const [status, setStatus] = useState('idle'); // idle, checking, sent
    const [checklist, setChecklist] = useState([
        { id: 1, label: 'Checking Milestones Completion', status: 'pending' },
        { id: 2, label: 'Verifying Snag Closures', status: 'pending' },
        { id: 3, label: 'Validating Work Progress', status: 'pending' },
        { id: 4, label: 'Preparing Handover Documents', status: 'pending' },
    ]);

    const startHandoverProcess = () => {
        setStatus('checking');
        runChecks(0);
    };

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

                    <TouchableOpacity
                        style={styles.outlineBtn}
                        onPress={() => setStatus('idle')} // Reset for demo purposes
                    >
                        <Text style={styles.outlineBtnText}>View Handover Status</Text>
                    </TouchableOpacity>
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
