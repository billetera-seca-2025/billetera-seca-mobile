import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface FormContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FormContainer: React.FC<FormContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
    elevation: 8,
  } as ViewStyle,
}); 