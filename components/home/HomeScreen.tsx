import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';
import { authService } from '../../utils/authService';
import { ScreenLayout } from '../common/ScreenLayout';

interface HomeScreenProps {
  onTransfer: () => void;
  onAddMoney: () => void;
  onDebin: () => void;
  onTransactions: () => void;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onTransfer,
  onAddMoney,
  onDebin,
  onTransactions,
  onLogout,
}) => {
  const [balance, setBalance] = useState<number>(0);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const currentBalance = await authService.getBalance();
        setBalance(currentBalance);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el balance');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>BilleteraSeca</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Saldo disponible</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? `$${balance.toLocaleString('es-AR')}` : '****'}
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Acciones rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onTransfer}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="swap-horizontal-outline" size={24} color={theme.colors.white} />
                <Text style={styles.actionText}>Transferir</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onAddMoney}
            >
              <LinearGradient
                colors={[theme.colors.success, theme.colors.successDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="add-circle-outline" size={24} color={theme.colors.white} />
                <Text style={styles.actionText}>Cargar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDebin}
            >
              <LinearGradient
                colors={[theme.colors.warning, theme.colors.warningDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="card-outline" size={24} color={theme.colors.white} />
                <Text style={styles.actionText}>DEBIN</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onTransactions}
            >
              <LinearGradient
                colors={[theme.colors.info, theme.colors.infoDark]}
                style={styles.actionGradient}
              >
                <Ionicons name="list-outline" size={24} color={theme.colors.white} />
                <Text style={styles.actionText}>Historial</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logoutButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  actionsSection: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    height: 80,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
}); 