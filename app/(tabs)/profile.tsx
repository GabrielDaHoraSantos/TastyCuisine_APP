import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../themeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, toggleDarkMode, isDarkMode, setTheme, currentThemeName } = useTheme();

  const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Editar Perfil' },
    { icon: 'notifications-outline', label: 'Notificações' },
    { icon: 'help-circle-outline', label: 'Ajuda' },
  ];

  const THEMES = [
    { id: 'purple', label: 'Roxo', color: '#8A2BE2' },
    { id: 'blue', label: 'Azul', color: '#3498DB' },
    { id: 'modern', label: 'Moderno', color: '#FF6347' },
  ] as const;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    header: { alignItems: 'center', paddingVertical: 50, backgroundColor: theme.background.secondary },
    avatarContainer: { marginBottom: 15 },
    userName: { fontSize: 22, fontWeight: 'bold', color: theme.text.primary },
    userEmail: { fontSize: 14, color: theme.text.secondary, marginTop: 5 },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      color: theme.text.primary, 
      marginHorizontal: 20, 
      marginTop: 20, 
      marginBottom: 10 
    },
    menu: { paddingHorizontal: 20 },
    menuItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingVertical: 15, 
      borderBottomWidth: 1, 
      borderBottomColor: isDarkMode ? '#333' : '#EEE' 
    },
    menuLabel: { flex: 1, marginLeft: 15, fontSize: 16, color: theme.text.primary },
    
    // Estilos do Seletor de Temas
    themeSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      marginHorizontal: 20,
      backgroundColor: theme.background.secondary,
      borderRadius: 15,
      marginBottom: 10,
    },
    themeOption: {
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeOptionSelected: {
      borderColor: theme.primary,
      backgroundColor: isDarkMode ? '#ffffff10' : '#00000005',
    },
    themeCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginBottom: 5,
    },
    themeLabel: { fontSize: 12, fontWeight: '600', color: theme.text.primary },

    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      marginHorizontal: 20,
      backgroundColor: theme.background.secondary,
      borderRadius: 15,
      marginBottom: 20,
    },
    themeToggleText: { fontSize: 16, fontWeight: '600', color: theme.text.primary },
    
    logoutButton: { 
      margin: 20, 
      height: 50, 
      backgroundColor: theme.error + '22', 
      borderRadius: 10, 
      justifyContent: 'center', 
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.error
    },
    logoutText: { color: theme.error, fontWeight: 'bold', fontSize: 16 }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color={theme.accent} />
        </View>
        <Text style={styles.userName}>Lucas Silva</Text>
        <Text style={styles.userEmail}>lucas.silva@email.com</Text>
      </View>

      <Text style={styles.sectionTitle}>Configurações</Text>
      <View style={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color={theme.accent} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Personalização</Text>
      
      {/* Seletor de Cores do Tema */}
      <View style={styles.themeSelector}>
        {THEMES.map((t) => (
          <TouchableOpacity 
            key={t.id} 
            style={[
              styles.themeOption, 
              currentThemeName === t.id && styles.themeOptionSelected
            ]}
            onPress={() => setTheme(t.id as 'blue')}
          >
            <View style={[styles.themeCircle, { backgroundColor: t.color }]} />
            <Text style={styles.themeLabel}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão para alternar entre Modo Claro e Escuro */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleDarkMode}>
        <Text style={styles.themeToggleText}>
          Modo {isDarkMode ? 'Claro' : 'Escuro'}
        </Text>
        <Ionicons 
          name={isDarkMode ? 'sunny-outline' : 'moon-outline'} 
          size={24} 
          color={theme.primary} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
