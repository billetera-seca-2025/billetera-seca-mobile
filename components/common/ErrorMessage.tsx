import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message: string;
  testID?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, testID }) => {
  const shakeAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [message]);

  return (
    <Animated.View 
      testID={testID}
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeAnimation }],
        },
      ]}
    >
      <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginVertical: theme.spacing.xs,
    ...theme.shadows.small,
  } as ViewStyle,
  text: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  } as TextStyle,
}); 