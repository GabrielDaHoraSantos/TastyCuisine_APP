import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Italiana' },
  { id: '2', name: 'Japonesa' },
  { id: '3', name: 'Mexicana' },
  { id: '4', name: 'Brasileira' },
  { id: '5', name: 'Vegana' },
  { id: '6', name: 'Sobremesas' },
  { id: '7', name: 'Árabe' },
  { id: '8', name: 'Francesa' },
];

export default function PreferencesScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleCategory = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleContinue = () => {
    // Navega para a Home (que está dentro do grupo (tabs))
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>O que você gosta de comer?</Text>
        <Text style={styles.subtitle}>Selecione pelo menos 3 categorias para personalizarmos sua experiência.</Text>

        <FlatList
          data={CATEGORIES}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                selected.includes(item.id) && styles.cardSelected
              ]}
              onPress={() => toggleCategory(item.id)}
            >
              <Text style={[
                styles.cardText,
                selected.includes(item.id) && styles.cardTextSelected
              ]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity 
          style={[styles.button, selected.length < 3 && styles.buttonDisabled]}
          disabled={selected.length < 3}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8D775' },
  content: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  list: { paddingBottom: 20 },
  card: {
    flex: 1,
    height: 100,
    backgroundColor: '#FFF',
    margin: 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardSelected: { backgroundColor: '#E74C3C' },
  cardText: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardTextSelected: { color: '#FFF' },
  button: {
    backgroundColor: '#E74C3C',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
