import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import {theme} from '../../constants/theme';
import {authService} from '../../utils/authService';
import {AlertMessage} from '../common/AlertMessage';
import {FormContainer} from '../common/FormContainer';
import {ScreenLayout} from '../common/ScreenLayout';
import {SuccessModal} from '../common/SuccessModal';

interface TransferScreenProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({onSuccess, onCancel}) => {
    const [amount, setAmount] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleTransfer = async () => {
        if (!amount || !destination) {
            setError('Por favor completa todos los campos');
            return;
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError('Por favor ingresa un monto válido');
            return;
        }

        setLoading(true);
        await authService.transfer(amountNumber, destination)
            .then((success) => {
                if (success) {
                    setShowSuccessModal(true);
                } else {
                    setError('No se pudo realizar la transferencia');
                }
            }).catch((error) => {
                setError('No se pudo realizar la transferencia');
            }).finally(() => {
                setLoading(false);
            });
    };

    return (
        <ScreenLayout>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    <TouchableOpacity
                        testID="back-button"
                        accessibilityLabel="back-button"
                        style={styles.backButton}
                        onPress={onCancel}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text}/>
                    </TouchableOpacity>

                    <Text
                        testID="transfer-title"
                        accessibilityLabel="transfer-title"
                        style={styles.title}
                    >
                        Transferir
                    </Text>
                    <Text style={styles.subtitle}>Ingresa los datos de la transferencia</Text>

                    {error && <AlertMessage message={error} onClose={() => setError(null)}/>}

                    <FormContainer>
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons name="cash-outline" size={24} color={theme.colors.textSecondary}/>
                                </View>
                                <TextInput
                                    testID="transfer-amount"
                                    accessibilityLabel="transfer-amount"
                                    style={styles.input}
                                    placeholder="Monto"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons name="mail-outline" size={24} color={theme.colors.textSecondary}/>
                                </View>
                                <TextInput
                                    testID="transfer-destination"
                                    accessibilityLabel="transfer-destination"
                                    style={styles.input}
                                    placeholder="Email destino"
                                    value={destination}
                                    onChangeText={setDestination}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    autoComplete="email"
                                />
                            </View>

                            <TouchableOpacity
                                testID="transfer-button"
                                accessibilityLabel="transfer-button"
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleTransfer}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                                    style={styles.buttonGradient}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 0, y: 1}}
                                >
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Transferiendo...' : 'Transferir'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </FormContainer>
                </View>
            </KeyboardAvoidingView>

            <SuccessModal
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    onSuccess();
                }}
                title="¡Transferencia exitosa!"
                message="La transferencia se ha realizado correctamente"
            />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    content: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    } as ViewStyle,
    backButton: {
        position: 'absolute',
        top: theme.spacing.xl,
        left: theme.spacing.lg,
        zIndex: 1,
    } as ViewStyle,
    title: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    } as TextStyle,
    subtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
    } as TextStyle,
    form: {
        width: '100%',
    } as ViewStyle,
    inputContainer: {
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm,
        ...theme.shadows.small,
    } as ViewStyle,
    inputIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    input: {
        flex: 1,
        padding: theme.spacing.md,
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
    } as TextStyle,
    button: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginTop: theme.spacing.xl,
        ...theme.shadows.medium,
    } as ViewStyle,
    buttonGradient: {
        padding: theme.spacing.md,
        alignItems: 'center',
    } as ViewStyle,
    buttonDisabled: {
        opacity: 0.7,
    } as ViewStyle,
    buttonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
    } as TextStyle,
}); 