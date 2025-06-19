import {theme} from '@/constants/theme';
import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface SuccessModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
                                                              visible,
                                                              title,
                                                              message,
                                                              onClose,
                                                          }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="checkmark-circle"
                            size={64}
                            color={theme.colors.success}
                        />
                    </View>
                    <Text
                        testID="success-modal-title"
                        accessibilityLabel="success-modal-title"
                        style={styles.title}
                    >
                        {title}
                    </Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity
                        testID="success-modal-close-button"
                        accessibilityLabel="success-modal-close-button"
                        style={styles.button}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    modalContainer: {
        width: width * 0.85,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.large,
    } as ViewStyle,
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.successLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    } as ViewStyle,
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    } as TextStyle,
    message: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    } as TextStyle,
    button: {
        backgroundColor: theme.colors.success,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.medium,
    } as ViewStyle,
    buttonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
    } as TextStyle,
}); 