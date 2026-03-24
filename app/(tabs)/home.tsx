// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../themeContext';
import { FEATURED_DISHES } from '../../src/data/recipes'; // Importe os dados centralizados

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handlePressDish = (id: string) => {
    router.push({
      pathname: "/dish/[id]",
      params: { id } // Passamos apenas o ID
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary, padding: 20, paddingTop: 50 },
    header: { marginBottom: 20 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: theme.primary },
    subtitle: { fontSize: 16, color: theme.text.secondary },
    searchBar: {
      backgroundColor: theme.background.secondary,
      borderRadius: 12,
      paddingHorizontal: 15,
      height: 50,
      justifyContent: 'center',
      marginBottom: 25,
      borderWidth: 1,
      borderColor: theme.background.secondary === '#FFFFFF' ? '#EEE' : '#333'
    },
    searchInput: { color: theme.text.primary, fontSize: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary, marginBottom: 15 },
    dishCard: {
      width: 200,
      backgroundColor: theme.background.secondary,
      borderRadius: 15,
      marginRight: 15,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.background.secondary === '#FFFFFF' ? '#EEE' : '#333'
    },
    dishImage: { width: '100%', height: 120 },
    dishInfo: { padding: 12 },
    dishName: { fontSize: 16, fontWeight: 'bold', color: theme.text.primary },
    dishChef: { fontSize: 12, color: theme.text.secondary, marginVertical: 4 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Gourmet!</Text>
        <Text style={styles.subtitle}>O que vamos saborear hoje?</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar pratos ou chefs..."
          placeholderTextColor={theme.text.secondary}
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Destaques da Semana</Text>
        <FlatList
          data={FEATURED_DISHES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.dishCard} 
              onPress={() => handlePressDish(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.dishImage} />
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishChef}>{item.chef}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Categorias Populares</Text>
      </ScrollView>
    </View>
  );
}