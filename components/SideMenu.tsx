// components/SideMenu.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../app/themeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const navigateTo = (screen: string) => {
    onClose();
    setTimeout(() => {
      router.push(`/(tabs)/${screen}`);
    }, 300);
  };

  const isActive = (screen: string) => {
    return pathname.includes(screen);
  };

  const styles = StyleSheet.create({
    drawerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    drawerContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 280,
      backgroundColor: theme.background.secondary,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10
    },
    drawerHeader: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 30,
      backgroundColor: theme.primary,
      borderBottomLeftRadius: 20
    },
    drawerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4
    },
    drawerSubtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9
    },
    drawerMenu: {
      paddingTop: 20
    },
    drawerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 16
    },
    drawerItemActive: {
      backgroundColor: isDarkMode ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.1)',
      borderRightWidth: 4,
      borderRightColor: theme.primary
    },
    drawerItemText: {
      fontSize: 16,
      color: theme.text.primary,
      fontWeight: '500'
    },
    drawerItemTextActive: {
      color: theme.primary,
      fontWeight: '600'
    }
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.drawerOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <Text style={styles.drawerSubtitle}>Navegue pelo app</Text>
            </View>

            <View style={styles.drawerMenu}>
              <TouchableOpacity 
                style={[styles.drawerItem, isActive('home') && styles.drawerItemActive]}
                onPress={() => navigateTo('home')}
              >
                <Ionicons 
                  name="home" 
                  size={24} 
                  color={isActive('home') ? theme.primary : theme.text.primary} 
                />
                <Text style={[
                  styles.drawerItemText, 
                  isActive('home') && styles.drawerItemTextActive
                ]}>
                  Início
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.drawerItem, isActive('favorites') && styles.drawerItemActive]}
                onPress={() => navigateTo('favorites')}
              >
                <Ionicons 
                  name="heart" 
                  size={24} 
                  color={isActive('favorites') ? theme.primary : theme.text.primary} 
                />
                <Text style={[
                  styles.drawerItemText, 
                  isActive('favorites') && styles.drawerItemTextActive
                ]}>
                  Favoritos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.drawerItem, isActive('search') && styles.drawerItemActive]}
                onPress={() => navigateTo('search')}
              >
                <Ionicons 
                  name="search-outline" 
                  size={24} 
                  color={isActive('search') ? theme.primary : theme.text.primary} 
                />
                <Text style={[
                  styles.drawerItemText, 
                  isActive('search') && styles.drawerItemTextActive
                ]}>
                  Pesquisar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.drawerItem, isActive('profile') && styles.drawerItemActive]}
                onPress={() => navigateTo('profile')}
              >
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={isActive('profile') ? theme.primary : theme.text.primary} 
                />
                <Text style={[
                  styles.drawerItemText, 
                  isActive('profile') && styles.drawerItemTextActive
                ]}>
                  Perfil
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
