import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { theme } from '../theme';

export interface ModalField {
    key: string;
    label: string;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}

interface InputModalProps {
    visible: boolean;
    title: string;
    description?: string;
    fields: ModalField[];
    onSubmit: (values: Record<string, string>) => void;
    onCancel: () => void;
}

export default function InputModal({
    visible,
    title,
    description,
    fields,
    onSubmit,
    onCancel,
}: InputModalProps) {
    const [values, setValues] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        onSubmit(values);
        setValues({});
    };

    const handleCancel = () => {
        setValues({});
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.card}>
                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Description */}
                    {description && (
                        <Text style={styles.description}>{description}</Text>
                    )}

                    {/* Fields */}
                    {fields.map((field) => (
                        <View key={field.key} style={styles.fieldContainer}>
                            <Text style={styles.label}>{field.label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType={field.keyboardType ?? 'decimal-pad'}
                                value={values[field.key] ?? ''}
                                onChangeText={(text) =>
                                    setValues((prev) => ({ ...prev, [field.key]: text }))
                                }
                                selectionColor={theme.colors.accent}
                            />
                        </View>
                    ))}

                    {/* Buttons */}
                    <View style={styles.btnRow}>
                        <Pressable
                            style={[styles.btn, styles.btnCancel]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.btnCancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.btn, styles.btnSubmit]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.btnSubmitText}>Calculate</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.card,
        padding: theme.spacing.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.borderStrong,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.accent,
        marginBottom: theme.spacing.sm,
    },
    description: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        lineHeight: 18,
    },
    fieldContainer: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    input: {
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.radius.btn,
        borderWidth: 1,
        borderColor: theme.colors.border,
        color: theme.colors.textPrimary,
        fontSize: 18,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    btnRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    btn: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.btn,
        alignItems: 'center',
    },
    btnCancel: {
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    btnSubmit: {
        backgroundColor: theme.colors.accent,
    },
    btnCancelText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 16,
    },
    btnSubmitText: {
        color: theme.colors.background,
        fontWeight: '800',
        fontSize: 16,
    },
});