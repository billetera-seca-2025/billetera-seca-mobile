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

interface AddMoneyScreenProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const AddMoneyScreen: React.FC<AddMoneyScreenProps> = ({onSuccess, onCancel}) => {
    const [amount, setAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [cbu, setCbu] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleAddMoney = async () => {
        if (!amount || !bankName || !cbu) {
            setError('Por favor completa todos los campos');
            return;
        }

        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError('El monto debe ser un número positivo');
            return;
        }

        if (cbu.length !== 22) {
            setError('El CBU debe tener 22 dígitos');
            return;
        }

        setLoading(true);
        await authService.addMoney(amountNumber, bankName, cbu)
            .then((success) => {
                if (success) {
                    setShowSuccessModal(true);
                } else {
                    setError('No se pudo cargar el dinero');
                }
            })
            .catch((error) => {
                setError('No se pudo cargar el dinero');
            })
            .finally(() => {
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
                        style={styles.backButton} onPress={onCancel}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text}/>
                    </TouchableOpacity>

                    <Text
                        testID="add-money-title"
                        accessibilityLabel="add-money-title"
                        style={styles.title}>Cargar Dinero</Text>
                    <Text style={styles.subtitle}>Ingresa los datos de la transferencia</Text>

                    {error && <AlertMessage message={error} onClose={() => setError(null)}/>}

                    <FormContainer>
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons name="cash-outline" size={24} color={theme.colors.textSecondary}/>
                                </View>
                                <TextInput
                                    testID="add-money-amount"
                                    accessibilityLabel="add-money-amount"
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
                                    <Ionicons name="business-outline" size={24} color={theme.colors.textSecondary}/>
                                </View>
                                <TextInput
                                    testID="add-money-bank-name"
                                    accessibilityLabel="add-money-bank-name"
                                    style={styles.input}
                                    placeholder="Nombre del banco"
                                    value={bankName}
                                    onChangeText={setBankName}
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={styles.inputIconContainer}>
                                    <Ionicons name="card-outline" size={24} color={theme.colors.textSecondary}/>
                                </View>
                                <TextInput
                                    testID="add-money-cbu"
                                    accessibilityLabel="add-money-cbu"
                                    style={styles.input}
                                    placeholder="CBU (22 dígitos)"
                                    value={cbu}
                                    onChangeText={setCbu}
                                    keyboardType="numeric"
                                    maxLength={22}
                                    placeholderTextColor={theme.colors.textSecondary}
                                />
                            </View>

                            <TouchableOpacity
                                testID="add-money-button"
                                accessibilityLabel="add-money-button"
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleAddMoney}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[theme.colors.success, theme.colors.successDark]}
                                    style={styles.buttonGradient}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 0, y: 1}}
                                >
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Cargando...' : 'Cargar Dinero'}
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
                title="¡Carga exitosa!"
                message="El dinero se ha cargado correctamente"
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