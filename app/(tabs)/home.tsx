import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../themeContext';
import { useAuth } from '../authContext';
import { receitasAPI } from '../(auth)/api';
import SideMenu from '../../components/SideMenu';
import MenuButton from '../../components/MenuButton';
import RecipeCard from '../../components/RecipeCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const { userName } = useAuth();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    receitasAPI.getAll().then(res => {
      if (res.data) setRecipes(res.data as any[]);
    }).finally(() => setLoading(false));
  }, []);

  const featuredRecipes = recipes.slice(0, 5);
  const quickRecipes = recipes.filter(r => {
    const min = parseInt((r.prepareTime ?? r.tempoPreparo ?? '0').toString().replace(/\D/g, ''), 10);
    return min <= 30;
  });

  const handlePressDish = (id: string | number) => {
    router.push({ pathname: '/Sobpo/[id]', params: { id: String(id) } });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    scrollContent: { paddingBottom: 30 },
    header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30, backgroundColor: theme.background.primary },
    greeting: { fontSize: 32, fontWeight: 'bold', color: theme.text.primary, marginBottom: 8 },
    subtitle: { fontSize: 18, color: theme.text.secondary, fontWeight: '400' },
    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.text.primary },
    dishCard: { width: 160, backgroundColor: theme.background.secondary, borderRadius: 16, marginLeft: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    dishImage: { width: '100%', height: 110, backgroundColor: isDarkMode ? '#333' : '#F5F5F5' },
    dishInfo: { padding: 12 },
    dishName: { fontSize: 15, fontWeight: 'bold', color: theme.text.primary, marginBottom: 4 },
    dishChef: { fontSize: 12, color: theme.text.secondary, marginBottom: 8 },
    dishMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    timeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDarkMode ? '#333' : '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    timeText: { fontSize: 12, color: theme.text.secondary, marginLeft: 4, fontWeight: '500' },
    carouselCard: { width: SCREEN_WIDTH * 0.85, height: 220, borderRadius: 16, overflow: 'hidden', position: 'relative', alignSelf: 'center' },
    carouselImage: { width: '100%', height: '100%', position: 'absolute' },
    carouselOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
    carouselLeftContent: { flex: 1, justifyContent: 'center' },
    carouselRightContent: { alignItems: 'flex-end', justifyContent: 'center', gap: 8 },
    carouselTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35', textTransform: 'capitalize', maxWidth: '90%' },
    carouselChef: { fontSize: 13, color: '#FFFFFF', marginTop: 4, opacity: 0.9 },
    carouselInfoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    carouselInfoText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
    navigationContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, pointerEvents: 'box-none' },
    navButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto' },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 8 },
    paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: isDarkMode ? '#666' : '#ccc' },
    paginationDotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B35' },
    carouselWrapper: { position: 'relative', alignItems: 'center' },
    waveTopContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 40, zIndex: 10, pointerEvents: 'none' },
    waveBottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, zIndex: 10, pointerEvents: 'none' },
    waveMask: { width: '100%', height: '100%' },
    loadingContainer: { height: 220, justifyContent: 'center', alignItems: 'center' },
  });

  const getRecipeName = (r: any) => r.nomeReceita ?? r.name ?? '';
  const getRecipeChef = (r: any) => r.chefe?.nomeChefe ?? r.chefe?.nome ?? r.chef ?? '';
  const getRecipeImage = (r: any) => r.fotoReceita ?? r.image ?? '';
  const getRecipeTime = (r: any) => r.prepareTime ?? r.tempoPreparo ?? '';
  const getRecipeId = (r: any) => String(r.codReceitas ?? r.id ?? '');

  const renderCarouselCard = (item: any) => (
    <TouchableOpacity style={styles.carouselCard} onPress={() => handlePressDish(getRecipeId(item))} activeOpacity={0.9}>
      <Image source={{ uri: getRecipeImage(item) }} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.carouselOverlay}>
        <View style={styles.carouselLeftContent}>
          <Text style={styles.carouselTitle} numberOfLines={2}>{getRecipeName(item)}</Text>
          <Text style={styles.carouselChef} numberOfLines={1}>por {getRecipeChef(item)}</Text>
        </View>
        <View style={styles.carouselRightContent}>
          <View style={styles.carouselInfoBadge}>
            <Ionicons name="time-outline" size={16} color="#FFF" />
            <Text style={styles.carouselInfoText}>{getRecipeTime(item)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDishCard = ({ item }: any) => (
    <RecipeCard item={item} onPress={() => handlePressDish(getRecipeId(item))} />
  );

  return (
    <View style={styles.container}>
      <MenuButton onPress={() => setDrawerVisible(!drawerVisible)} />
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userName || 'Gourmet'}!</Text>
        <Text style={styles.subtitle}>Descubra receitas incríveis</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Em Destaque</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}><ActivityIndicator color="#FF6B35" size="large" /></View>
          ) : featuredRecipes.length > 0 ? (
            <>
              <View style={styles.carouselWrapper}>
                <View style={styles.waveTopContainer}>
                  <Svg height="40" width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 40`} style={styles.waveMask}>
                    <Path d={`M0,0 L${SCREEN_WIDTH},0 L${SCREEN_WIDTH},20 Q${SCREEN_WIDTH * 0.75},30 ${SCREEN_WIDTH * 0.5},20 T0,20 Z`} fill={isDarkMode ? '#121212' : '#FFFFFF'} />
                  </Svg>
                </View>
                <View style={{ width: SCREEN_WIDTH, height: 220 }}>
                  {renderCarouselCard(featuredRecipes[activeIndex])}
                </View>
                <View style={styles.waveBottomContainer}>
                  <Svg height="40" width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 40`} style={styles.waveMask}>
                    <Path d={`M0,20 Q${SCREEN_WIDTH * 0.25},10 ${SCREEN_WIDTH * 0.5},20 T${SCREEN_WIDTH},20 L${SCREEN_WIDTH},40 L0,40 Z`} fill={isDarkMode ? '#121212' : '#FFFFFF'} />
                  </Svg>
                </View>
                <View style={styles.navigationContainer}>
                  <TouchableOpacity style={styles.navButton} onPress={() => setActiveIndex(Math.max(0, activeIndex - 1))} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navButton} onPress={() => setActiveIndex(Math.min(featuredRecipes.length - 1, activeIndex + 1))} activeOpacity={0.7}>
                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.paginationContainer}>
                {featuredRecipes.map((_, i) => (
                  <View key={i} style={i === activeIndex ? styles.paginationDotActive : styles.paginationDot} />
                ))}
              </View>
            </>
          ) : null}
        </View>

        {quickRecipes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Receitas Rápidas</Text>
            </View>
            <FlatList data={quickRecipes} horizontal showsHorizontalScrollIndicator={false} keyExtractor={getRecipeId} renderItem={renderDishCard} contentContainerStyle={{ paddingRight: 20 }} />
          </View>
        )}
      </ScrollView>

      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
