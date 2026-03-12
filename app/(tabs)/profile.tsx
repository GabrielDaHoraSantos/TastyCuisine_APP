import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Editar Perfil' },
    { icon: 'notifications-outline', label: 'Notificações' },
    { icon: 'card-outline', label: 'Pagamentos' },
    { icon: 'help-circle-outline', label: 'Ajuda' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#F8D775" />
        </View>
        <Text style={styles.userName}>Lucas Silva</Text>
        <Text style={styles.userEmail}>lucas.silva@email.com</Text>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color="#F8D775" />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#444" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { alignItems: 'center', paddingVertical: 50, backgroundColor: '#1A1A1A' },
  avatarContainer: { marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  userEmail: { fontSize: 14, color: '#888', marginTop: 5 },
  menu: { padding: 20 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#222' 
  },
  menuLabel: { flex: 1, marginLeft: 15, fontSize: 16, color: '#DDD' },
  logoutButton: { 
    margin: 20, 
    height: 50, 
    backgroundColor: '#E74C3C22', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E74C3C'
  },
  logoutText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 }
});
