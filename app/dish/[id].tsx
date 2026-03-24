import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../themeContext';
import { FEATURED_DISHES } from '../../src/data/recipes';

// Proteção contra erro de módulo não encontrado (ExponentAV)
let Video: any;
let ResizeMode: any;
try {
  const ExpoAV = require('expo-av');
  Video = ExpoAV.Video;
  ResizeMode = ExpoAV.ResizeMode;
} catch (e) {
  console.warn("Módulo expo-av não encontrado. O vídeo não será exibido.");
}

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  // Busca a receita pelo ID nos dados centralizados
  const recipe = FEATURED_DISHES.find(d => d.id === id);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    imageContainer: { width: '100%', height: 350, position: 'relative' },
    image: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
    backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
    favButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
    content: { 
      padding: 25, borderTopLeftRadius: 35, borderTopRightRadius: 35, 
      backgroundColor: theme.background.primary, marginTop: -40, elevation: 5
    },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.text.primary, marginBottom: 5 },
    chef: { fontSize: 16, color: theme.text.secondary, marginBottom: 15 },
    ratingContainer: { 
      flexDirection: 'row', alignItems: 'center', marginBottom: 25, 
      backgroundColor: theme.background.secondary, alignSelf: 'flex-start', 
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 
    },
    ratingText: { color: theme.text.primary, marginLeft: 5, fontSize: 14, fontWeight: '600' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary, marginBottom: 15, marginTop: 10 },
    description: { fontSize: 16, color: theme.text.secondary, lineHeight: 24, marginBottom: 25 },
    ingredientsList: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    ingredientTag: { 
      backgroundColor: theme.background.secondary, paddingHorizontal: 16, paddingVertical: 10, 
      borderRadius: 25, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' 
    },
    ingredientText: { color: theme.text.primary, fontSize: 14, fontWeight: '500' },
    stepsList: { marginBottom: 30 },
    stepItem: { flexDirection: 'row', marginBottom: 15 },
    stepNumber: { 
      width: 28, height: 28, borderRadius: 14, backgroundColor: theme.primary, 
      justifyContent: 'center', alignItems: 'center', marginRight: 15, marginTop: 2 
    },
    stepNumberText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    stepText: { flex: 1, fontSize: 16, color: theme.text.secondary, lineHeight: 24 },
    videoPlayer: { width: '100%', height: 220, backgroundColor: '#000', borderRadius: 15, marginTop: 10 },
    errorContainer: { flex: 1, backgroundColor: theme.background.primary, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: theme.text.primary, fontSize: 18 },
    backLink: { marginTop: 20, padding: 10, backgroundColor: theme.primary, borderRadius: 8 }
  });

  if (!recipe) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Receita não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={{ color: '#FFF' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.overlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favButton}>
            <Ionicons name="heart-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.chef}>Por {recipe.chef}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>4.8 (120 avaliações)</Text>
          </View>

          <Text style={styles.sectionTitle}>Sobre a Receita</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          {recipe.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((item, index) => (
                  <View key={index} style={styles.ingredientTag}>
                    <Text style={styles.ingredientText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {recipe.steps.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Modo de Preparo</Text>
              <View style={styles.stepsList}>
                {recipe.steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* O vídeo só aparece se o módulo carregar corretamente */}
          {recipe.videoUrl.length > 0 && Video && (
            <View style={{ marginBottom: 40 }}>
              <Text style={styles.sectionTitle}>Vídeo Tutorial</Text>
              <Video 
                source={{ uri: recipe.videoUrl }} 
                rate={1.0} 
                volume={1.0} 
                isMuted={false} 
                resizeMode={ResizeMode?.CONTAIN || 'contain'} 
                useNativeControls 
                style={styles.videoPlayer} 
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
