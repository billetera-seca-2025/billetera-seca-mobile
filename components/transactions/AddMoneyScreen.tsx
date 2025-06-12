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

interface AddMoneyScreenProps {
  onBack: () => void;
}

export const AddMoneyScreen: React.FC<AddMoneyScreenProps> = ({ onBack }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMoney = async () => {
    if (!amount) {
      Alert.alert('Error', 'Por favor ingresa un monto');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'El monto debe ser un número positivo');
      return;
    }

    setLoading(true);
    try {
      await authService.addMoney(amountNumber);
      Alert.alert('Éxito', 'Dinero cargado con éxito', [
        { text: 'OK', onPress: onBack },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el dinero');
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
          colors={[theme.colors.success, theme.colors.successDark]}
          style={styles.header}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Cargar Dinero</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Monto a Cargar</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMoney}
            disabled={loading}
          >
            <LinearGradient
              colors={[theme.colors.success, theme.colors.successDark]}
              style={styles.addGradient}
            >
              <Text style={styles.addButtonText}>
                {loading ? 'Cargando...' : 'Cargar Dinero'}
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
  addButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addGradient: {
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 