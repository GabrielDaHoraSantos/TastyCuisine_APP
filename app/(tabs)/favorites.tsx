import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAVORITES = [
  { id: '1', name: 'Lasanha à Bolonhesa', chef: 'Chef Luigi', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Hambúrguer Artesanal', chef: 'Chef Marco', image: 'https://via.placeholder.com/150' },
];

export default function FavoritesScreen( ) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      
      <FlatList
        data={FAVORITES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.chef}>{item.chef}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Você ainda não salvou nenhum prato.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F8D775', marginBottom: 20 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#1E1E1E', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  chef: { fontSize: 14, color: '#AAA' },
  empty: { color: '#888', textAlign: 'center', marginTop: 50 }
});
