import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DishDetailScreen() {
  const { id, name, chef } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Imagem */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/400' }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={( ) => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favButton}>
            <Ionicons name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Informações do Prato */}
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.title}>{name || 'Prato Especial'}</Text>
              <Text style={styles.chef}>Por {chef || 'Chef Tasty'}</Text>
            </View>
           
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#F8D775" />
            <Text style={styles.ratingText}>4.8 (120 avaliações)</Text>
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>
            Uma explosão de sabores cuidadosamente preparada com ingredientes frescos e selecionados. 
            Este prato combina técnicas tradicionais com um toque moderno do nosso chef.
          </Text>

          <Text style={styles.sectionTitle}>Ingredientes Principais</Text>
          <View style={styles.ingredientsList}>
            {['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'].map((item, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  imageContainer: { width: '100%', height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
  favButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
  content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#121212', marginTop: -30 },
  headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', flex: 1 },
  chef: { fontSize: 16, color: '#AAA', marginTop: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  ratingText: { color: '#F8D775', marginLeft: 5, fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10, marginTop: 10 },
  description: { fontSize: 15, color: '#BBB', lineHeight: 22, marginBottom: 20 },
  ingredientsList: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 50 },
  ingredientTag: { backgroundColor: '#1E1E1E', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  ingredientText: { color: '#DDD', fontSize: 13 },
  orderButton: { backgroundColor: '#E74C3C', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  orderButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
