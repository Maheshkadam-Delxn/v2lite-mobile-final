import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { AUDIT_CONSTRAINTS } from "./auditConstants";

const CreateAuditModal = ({ visible, onClose, onSubmit }) => {
    const [selectedConstraints, setSelectedConstraints] = useState([]);

    const toggleConstraint = (key) => {
        setSelectedConstraints((prev) =>
            prev.includes(key)
                ? prev.filter((c) => c !== key)
                : [...prev, key]
        );
    };

    const handleSubmit = () => {
        if (selectedConstraints.length === 0) {
            alert("Select at least one constraint");
            return;
        }
        onSubmit({ constraints: selectedConstraints });
        setSelectedConstraints([]);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Create Audit</Text>

                    <ScrollView>
                        {AUDIT_CONSTRAINTS.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={styles.checkboxRow}
                                onPress={() => toggleConstraint(item.key)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        selectedConstraints.includes(item.key) &&
                                        styles.checkboxChecked,
                                    ]}
                                />
                                <Text style={styles.checkboxLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={styles.submit}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateAuditModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: "#555",
        borderRadius: 4,
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: "#1976d2",
    },
    checkboxLabel: { fontSize: 16 },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cancel: { color: "red", fontWeight: "bold" },
    submit: { color: "#1976d2", fontWeight: "bold" },
});
