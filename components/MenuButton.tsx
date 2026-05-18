// components/MenuButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/themeContext';

interface MenuButtonProps {
  onPress: () => void;
}

export default function MenuButton({ onPress }: MenuButtonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    menuButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 100
    }
  });

  return (
    <TouchableOpacity 
      style={styles.menuButton} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="menu" size={24} color="#FFF" />
    </TouchableOpacity>
  );
}
