// components/BottomNavigation.tsx
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../app/themeContext';

interface NavItem {
  name: string;
  label: string;
  icon: string;
  screen: string;
}

const navItems: NavItem[] = [
  { name: 'home', label: 'Início', icon: 'home', screen: 'home' },
  { name: 'favorites', label: 'Favoritos', icon: 'heart', screen: 'favorites' },
  { name: 'search', label: 'Pesquisar', icon: 'search-outline', screen: 'search' },
  { name: 'profile', label: 'Perfil', icon: 'person', screen: 'profile' },
];

export default function BottomNavigation() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (screen: string) => {
    return pathname.includes(screen);
  };

  const handleNavigate = (screen: string) => {
    router.push(`/(tabs)/${screen}` as any);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.background.secondary,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333333' : '#E5E5E5',
      paddingVertical: 12,
      paddingHorizontal: 8,
      paddingBottom: Platform.OS === 'ios' ? 20 : 12,
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 0,
    },
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 12,
      gap: 4,
    },
    navItemActive: {
      backgroundColor: isDarkMode ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.1)',
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.text.secondary,
    },
    labelActive: {
      color: theme.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.screen);
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.navItem, active && styles.navItemActive]}
            onPress={() => handleNavigate(item.screen)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={active ? theme.primary : theme.text.primary}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
