'use client';

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../themeContext';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.background.secondary,
          borderTopColor: theme.text.primary,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5
        },
        tabBarActiveTintColor: theme.primary, 
        tabBarInactiveTintColor: theme.text.primary,
      }} 
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ 
          title: 'Pesquisar',
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
