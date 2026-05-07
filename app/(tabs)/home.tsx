// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../themeContext';
import { FEATURED_DISHES } from '../../src/data/recipes';

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  const handlePressDish = (id: string) => {
    router.push({
      pathname: "/dish/[id]",
      params: { id }
    });
  };

  const featuredRecipes = FEATURED_DISHES.slice(0, 6);
  const quickRecipes = FEATURED_DISHES.filter(dish => parseInt(dish.prepareTime) <= 30);
  const desserts = FEATURED_DISHES.filter(dish => 
    dish.name.toLowerCase().includes('bolo') || 
    dish.name.toLowerCase().includes('brigadeiro') ||
    dish.name.toLowerCase().includes('mousse') ||
    dish.name.toLowerCase().includes('brownie') ||
    dish.name.toLowerCase().includes('torta')
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    scrollContent: { paddingBottom: 30 },
    header: { 
      paddingHorizontal: 20, 
      paddingTop: 60,
      paddingBottom: 30,
      backgroundColor: theme.background.primary
    },
    greeting: { 
      fontSize: 32, 
      fontWeight: 'bold', 
      color: theme.text.primary,
      marginBottom: 8
    },
    subtitle: { 
      fontSize: 18, 
      color: theme.text.secondary,
      fontWeight: '400'
    },
    section: { marginBottom: 30 },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 15
    },
    sectionTitle: { 
      fontSize: 22, 
      fontWeight: 'bold', 
      color: theme.text.primary
    },
    seeAll: { 
      fontSize: 14, 
      color: theme.primary,
      fontWeight: '600'
    },
    dishCard: {
      width: 160,
      backgroundColor: theme.background.secondary,
      borderRadius: 16,
      marginLeft: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3
    },
    dishImage: { 
      width: '100%', 
      height: 110,
      backgroundColor: isDarkMode ? '#333' : '#F5F5F5'
    },
    dishInfo: { padding: 12 },
    dishName: { 
      fontSize: 15, 
      fontWeight: 'bold', 
      color: theme.text.primary,
      marginBottom: 4
    },
    dishChef: { 
      fontSize: 12, 
      color: theme.text.secondary,
      marginBottom: 8
    },
    dishMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#333' : '#F5F5F5',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
    },
    timeText: {
      fontSize: 12,
      color: theme.text.secondary,
      marginLeft: 4,
      fontWeight: '500'
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    ratingText: {
      fontSize: 13,
      color: theme.text.primary,
      marginLeft: 4,
      fontWeight: '600'
    },
    emptySection: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      alignItems: 'center'
    },
    emptyText: {
      fontSize: 14,
      color: theme.text.secondary,
      textAlign: 'center'
    }
  });

  const renderDishCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.dishCard} 
      onPress={() => handlePressDish(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.dishImage} />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.dishChef} numberOfLines={1}>{item.chef}</Text>
        <View style={styles.dishMeta}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color={theme.text.secondary} />
            <Text style={styles.timeText}>{item.prepareTime}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>
              {item.comments && item.comments.length > 0 
                ? item.comments[0].rating.toFixed(1) 
                : '5.0'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Gourmet!</Text>
        <Text style={styles.subtitle}>Descubra receitas incríveis</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
          </View>
          <FlatList
            data={featuredRecipes}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderDishCard}
            contentContainerStyle={{ paddingRight: 20 }}
          />
        </View>

        {quickRecipes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Receitas Rápidas</Text>
            </View>
            <FlatList
              data={quickRecipes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderDishCard}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}

        {desserts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sobremesas</Text>
            </View>
            <FlatList
              data={desserts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderDishCard}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}