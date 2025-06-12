import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ScreenLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  isAuthScreen?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  onBack,
  showBackButton = true,
  isAuthScreen = false,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, isAuthScreen ? styles.authSafeArea : styles.mainSafeArea]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={isAuthScreen ? theme.colors.white : theme.colors.background}
      />
      <View style={[styles.container, isAuthScreen ? styles.authContainer : styles.mainContainer]}>
        {showBackButton && onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  authSafeArea: {
    backgroundColor: theme.colors.white,
  },
  mainSafeArea: {
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  } as ViewStyle,
  authContainer: {
    backgroundColor: theme.colors.white,
  } as ViewStyle,
  mainContainer: {
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? theme.layout.safeArea.top : StatusBar.currentHeight || theme.layout.safeArea.top,
    left: theme.layout.safeArea.horizontal,
    zIndex: 1,
    padding: theme.spacing.sm,
  } as ViewStyle,
  content: {
    flex: 1,
    marginTop: theme.layout.header.height,
  } as ViewStyle,
}); 