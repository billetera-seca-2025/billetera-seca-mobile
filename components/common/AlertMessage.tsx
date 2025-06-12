import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/theme';

interface AlertMessageProps {
  message: string;
  onClose: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ message, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity
        testID="error-message"
        accessibilityLabel="error-message"
        style={styles.closeButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.errorLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  message: {
    color: theme.colors.error,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
}); 