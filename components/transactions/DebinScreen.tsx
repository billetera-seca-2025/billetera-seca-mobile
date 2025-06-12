import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { authService } from '../../utils/authService';

interface DebinScreenProps {
  onBack: () => void;
}

export const DebinScreen: React.FC<DebinScreenProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [cbu, setCbu] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDebin = async () => {
    if (!amount || !payerEmail || !bankName || !cbu) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'El monto debe ser un número positivo');
      return;
    }

    setLoading(true);
    try {
      await authService.requestDebin(amountNumber, payerEmail, bankName, cbu);
      Alert.alert('Éxito', 'DEBIN solicitado con éxito', [
        { text: 'OK', onPress: onBack },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo solicitar el DEBIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[theme.colors.warning, theme.colors.warningDark]}
          style={styles.header}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Solicitar DEBIN</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email del Pagador</Text>
            <TextInput
              style={styles.input}
              value={payerEmail}
              onChangeText={setPayerEmail}
              placeholder="ejemplo@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Banco</Text>
            <TextInput
              style={styles.input}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Nombre del banco"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CBU</Text>
            <TextInput
              style={styles.input}
              value={cbu}
              onChangeText={setCbu}
              placeholder="CBU del pagador"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={styles.debinButton}
            onPress={handleDebin}
            disabled={loading}
          >
            <LinearGradient
              colors={[theme.colors.warning, theme.colors.warningDark]}
              style={styles.debinGradient}
            >
              <Text style={styles.debinButtonText}>
                {loading ? 'Solicitando...' : 'Solicitar DEBIN'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  debinButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  debinGradient: {
    padding: 16,
    alignItems: 'center',
  },
  debinButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 