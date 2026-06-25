import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - 12) / 2;

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#F5EDE3',
  surface:      '#FFFFFF',
  surfaceHi:    '#F0E6DA',
  hero:         '#C4703A',
  accent:       '#C4703A',
  accentSoft:   '#FFF0E8',
  accentBorder: '#F0C8A0',
  textPrimary:  '#3D2010',
  textSub:      '#B8906A',
  textMuted:    '#D4B89A',
  textOnHero:   '#FFFFFF',
  white:        '#FFFFFF',
};

const CATEGORIES = [
  { key: 'todos',     label: 'Todos',         icon: 'restaurant-outline' },
  { key: 'doces',     label: 'Doces',         icon: 'ice-cream-outline' },
  { key: 'salgadas',  label: 'Salgadas',      icon: 'pizza-outline' },
  { key: 'massas',    label: 'Massas',        icon: 'nutrition-outline' },
  { key: 'veganas',   label: 'Veganas',       icon: 'leaf-outline' },
  { key: 'almoco',    label: 'Almoço',        icon: 'sunny-outline' },
  { key: 'jantar',    label: 'Jantar',        icon: 'moon-outline' },
  { key: 'cafe',      label: 'Café da manhã', icon: 'cafe-outline' },
  { key: 'semgluten', label: 'Sem Glúten',    icon: 'ban-outline' },
  { key: 'semlactose',label: 'Sem Lactose',   icon: 'water-outline' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getRecipeName   = (r: any) => r.nomeReceita ?? r.name ?? '';
const getRecipeChef   = (r: any) => r.nome_completo
 ?? r.chefe?.nomeCompleto ?? r.chef ?? '';
const getRecipeImage  = (r: any) => r.fotoReceita || 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg';
const getRecipeTime   = (r: any) => r.prepareTime ?? r.tempoPreparo ?? '';
const getRecipeId     = (r: any) => String(r.codReceitas ?? r.id ?? '');
const getRecipeRating = (r: any) => parseFloat(r.avaliacao ?? r.rating ?? '0').toFixed(1);

// ─── Grid card (2 colunas) ───────────────────────────────────────────────────
function GridCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={g.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: getRecipeImage(item) }} style={g.img} resizeMode="cover" />
      <View style={g.ratingPill}>
        <Ionicons name="star" size={10} color="#FFD700" />
        <Text style={g.ratingText}>{getRecipeRating(item)}</Text>
      </View>
      <View style={g.info}>
        <Text style={g.name} numberOfLines={2}>{getRecipeName(item)}</Text>
        <Text style={g.chef} numberOfLines={1}>por {getRecipeChef(item)}</Text>
        <View style={g.timePill}>
          <Ionicons name="time-outline" size={11} color={C.textSub} />
          <Text style={g.timeText}>{getRecipeTime(item)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Wide card (1 coluna, horizontal) ────────────────────────────────────────
function WideCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={w.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: getRecipeImage(item) }} style={w.img} resizeMode="cover" />
      <View style={w.info}>
        <Text style={w.name} numberOfLines={2}>{getRecipeName(item)}</Text>
        <Text style={w.chef} numberOfLines={1}>por {getRecipeChef(item)}</Text>
        <View style={w.row}>
          <View style={w.pill}>
            <Ionicons name="time-outline" size={11} color={C.textSub} />
            <Text style={w.pillText}>{getRecipeTime(item)}</Text>
          </View>
          <View style={[w.pill, { backgroundColor: '#FFF8E8' }]}>
            <Ionicons name="star" size={11} color="#FFD700" />
            <Text style={w.pillText}>{getRecipeRating(item)}</Text>
          </View>
        </View>
      </View>
      <View style={w.arrow}>
        <Ionicons name="chevron-forward" size={18} color={C.accent} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { userName, userId, recipes, loading } = useAuth();
  const router = useRouter();

  const [activeIndex, setActiveIndex]       = useState(0);
  const [activeCategory, setActiveCategory] = useState('todos');

  useEffect(() => {
    if (!userId && !loading) router.push('/login');
  }, [loading]);

  // Top 5 mais bem avaliadas para o carousel
  const featuredRecipes = [...recipes]
    .sort((a, b) => parseFloat(b.avaliacao ?? b.rating ?? '0') - parseFloat(a.avaliacao ?? a.rating ?? '0'))
    .slice(0, 5);

  // Rápidas (≤ 30 min)
  const quickRecipes = recipes.filter(r => {
    const min = parseInt((r.prepareTime ?? r.tempoPreparo ?? '0').toString().replace(/\D/g, ''), 10);
    return min <= 30;
  });

  // Filtradas por categoria para o grid
  const filteredRecipes = activeCategory === 'todos'
    ? recipes
    : recipes.filter(r => {
        const cat = (r.categoria ?? r.category ?? '').toLowerCase();
        const label = CATEGORIES.find(c => c.key === activeCategory)?.label.toLowerCase() ?? '';
        return cat.includes(activeCategory) || cat.includes(label);
      });

  const handlePressDish = (id: string | number) =>
    router.push({ pathname: '/Sobpo/[id]', params: { id: String(id) } });

  if (loading) return <BolinhaqGira />;

  // Divide filteredRecipes em pares para o grid 2 colunas
  const gridPairs: any[][] = [];
  for (let i = 0; i < filteredRecipes.length; i += 2) {
    gridPairs.push(filteredRecipes.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Olá, {(userName || 'Gourmet').split(' ')[0]} </Text>
          <Text style={s.subtitle}>O que vamos cozinhar hoje?</Text>
        </View>
        <View style={s.avatarCircle}>
          <TouchableOpacity style={w.perfil} onPress={() => router.push('/profile')}>         
             <Text style={s.avatarInitial}>{(userName || 'G').charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* ── DESTAQUES DA SEMANA ── */}
        <View style={s.sectionHeaderRow}>
          <Text style={s.eyebrow}>DESTAQUES DA SEMANA</Text>
          <View style={s.badge}>
            <Ionicons name="star" size={11} color={C.hero} />
            <Text style={s.badgeText}>Mais bem avaliadas</Text>
          </View>
        </View>

        {featuredRecipes.length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Card principal */}
            <TouchableOpacity
              style={s.carouselCard}
              onPress={() => handlePressDish(getRecipeId(featuredRecipes[activeIndex]))}
              activeOpacity={0.92}
            >
              <Image
                source={{ uri: getRecipeImage(featuredRecipes[activeIndex]) }}
                style={s.carouselImage}
                resizeMode="cover"
              />
              <View style={s.carouselGradient} />
              <View style={s.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={s.ratingBadgeText}>{getRecipeRating(featuredRecipes[activeIndex])}</Text>
              </View>
              <View style={s.carouselInfo}>
                <Text style={s.carouselTitle} numberOfLines={2}>
                  {getRecipeName(featuredRecipes[activeIndex])}
                </Text>
                <View style={s.carouselMeta}>
                  <View style={s.carouselMetaItem}>
                    <Ionicons name="person-outline" size={13} color="rgba(255,230,200,0.85)" />
                    <Text style={s.carouselMetaText}>{getRecipeChef(featuredRecipes[activeIndex])}</Text>
                  </View>
                  <View style={s.carouselMetaItem}>
                    <Ionicons name="time-outline" size={13} color="rgba(255,230,200,0.85)" />
                    <Text style={s.carouselMetaText}>{getRecipeTime(featuredRecipes[activeIndex])}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Controles */}
            <View style={s.carouselControls}>
              <TouchableOpacity style={s.navBtn} onPress={() => setActiveIndex(Math.max(0, activeIndex - 1))} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={18} color={C.hero} />
              </TouchableOpacity>
              <View style={s.dotsRow}>
                {featuredRecipes.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveIndex(i)}>
                    <View style={[s.dot, i === activeIndex && s.dotActive]} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={s.navBtn} onPress={() => setActiveIndex(Math.min(featuredRecipes.length - 1, activeIndex + 1))} activeOpacity={0.7}>
                <Ionicons name="chevron-forward" size={18} color={C.hero} />
              </TouchableOpacity>
            </View>

            {/* Thumbnails */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingTop: 12 }}>
              {featuredRecipes.map((item, i) => (
                <TouchableOpacity
                  key={getRecipeId(item)}
                  onPress={() => setActiveIndex(i)}
                  activeOpacity={0.8}
                  style={[s.thumb, i === activeIndex && s.thumbActive]}
                >
                  <Image source={{ uri: getRecipeImage(item) }} style={s.thumbImg} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── CATEGORIAS ── */}
        <Text style={[s.eyebrow, { paddingHorizontal: 20, marginTop: 28, marginBottom: 12 }]}>CATEGORIAS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setActiveCategory(cat.key)}
                activeOpacity={0.75}
              >
                <Ionicons name={cat.icon as any} size={14} color={active ? C.white : C.accent} />
                <Text style={[s.chipText, active && s.chipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── GRID 2 COLUNAS ── */}
        <View style={s.sectionHeaderRow2}>
          <Text style={s.sectionTitle}>
            {activeCategory === 'todos' ? 'Para você' : CATEGORIES.find(c => c.key === activeCategory)?.label}
          </Text>
          <Text style={s.recipeCount}>{filteredRecipes.length} receitas</Text>
        </View>

        {filteredRecipes.length > 0 ? (
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {gridPairs.map((pair, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                {pair.map(item => (
                  <GridCard
                    key={getRecipeId(item)}
                    item={item}
                    onPress={() => handlePressDish(getRecipeId(item))}
                  />
                ))}
                {/* Preenche espaço vazio se número ímpar */}
                {pair.length === 1 && <View style={{ width: CARD_WIDTH }} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={s.emptyState}>
            <Ionicons name="search-outline" size={36} color={C.textMuted} />
            <Text style={s.emptyText}>Nenhuma receita nessa categoria ainda</Text>
          </View>
        )}

        {/* ── RÁPIDAS DE FAZER (só na aba "Todos") ── */}
        {activeCategory === 'todos' && quickRecipes.length > 0 && (
          <>
            <View style={s.sectionHeaderRow2}>
              <Text style={s.sectionTitle}>Rápidas de fazer</Text>
              <View style={s.badge}>
                <Ionicons name="flash-outline" size={11} color={C.hero} />
                <Text style={s.badgeText}>até 30 min</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, gap: 10 }}>
              {quickRecipes.slice(0, 5).map(item => (
                <WideCard
                  key={getRecipeId(item)}
                  item={item}
                  onPress={() => handlePressDish(getRecipeId(item))}
                />
              ))}
            </View>
          </>
        )}

      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

// ─── Grid card styles ─────────────────────────────────────────────────────────
const g = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#EDE0D4',
    shadowColor: '#3D2010',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  img:        { width: '100%', height: 120, backgroundColor: C.surfaceHi },
  ratingPill: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  ratingText: { color: C.white, fontSize: 11, fontWeight: '700' },
  info:       { padding: 12, gap: 3 },
  name:       { fontSize: 14, fontWeight: '700', color: C.textPrimary, lineHeight: 19 },
  chef:       { fontSize: 11, color: C.textSub },
  timePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accentSoft,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 10, alignSelf: 'flex-start', marginTop: 4,
  },
  timeText: { fontSize: 11, color: C.textSub, fontWeight: '600' },
});

// ─── Wide card styles ─────────────────────────────────────────────────────────
const w = StyleSheet.create({

  perfil:{
    opacity: 100,
    backgroundColor: 'transparent',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#EDE0D4',
    shadowColor: '#3D2010',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
  },
  img:   { width: 90, height: 90, backgroundColor: C.surfaceHi, borderRadius: 10,marginLeft:5 },
  info:  { flex: 1, padding: 14, gap: 4 },
  name:  { fontSize: 15, fontWeight: '700', color: C.textPrimary, lineHeight: 20 },
  chef:  { fontSize: 12, color: C.textSub },
  row:   { flexDirection: 'row', gap: 8, marginTop: 4 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accentSoft,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  pillText: { fontSize: 11, color: C.textSub, fontWeight: '600' },
  arrow: { paddingRight: 14 },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 100 },


  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 20,
    backgroundColor: C.bg,
  },
  greeting:      { fontSize: 22, fontWeight: '800', color: C.textPrimary, marginBottom: 2 },
  subtitle:      { fontSize: 14, color: C.textSub, fontWeight: '500' },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: C.hero, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.hero, shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
  avatarInitial: { color: C.white, fontSize: 18, fontWeight: '800' },

  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: C.textSub },

  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 14, marginTop: 4,
  },
  sectionHeaderRow2: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingHorizontal: 20, marginTop: 28, marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: C.textPrimary },
  recipeCount:  { fontSize: 12, color: C.textMuted, fontWeight: '600' },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accentSoft,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 0.5, borderColor: C.accentBorder,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: C.hero },

  // Carousel
  carouselCard: {
    width: '100%', height: 240, borderRadius: 22, overflow: 'hidden',
    backgroundColor: C.surfaceHi,
    shadowColor: '#3D2010', shadowOpacity: 0.18, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  carouselImage:    { width: '100%', height: '100%', position: 'absolute' },
  carouselGradient: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: '65%',
    backgroundColor: 'rgba(61,32,16,0.72)',
  },
  ratingBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  ratingBadgeText: { color: C.white, fontSize: 12, fontWeight: '700' },
  carouselInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 },
  carouselTitle: { fontSize: 22, fontWeight: '800', color: C.white, marginBottom: 8, lineHeight: 28 },
  carouselMeta:     { flexDirection: 'row', gap: 16 },
  carouselMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  carouselMetaText: { fontSize: 12, color: 'rgba(255,230,200,0.85)', fontWeight: '500' },

  carouselControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 14, paddingHorizontal: 4,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: C.accentBorder,
  },
  dotsRow:  { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: C.accentBorder },
  dotActive:{ width: 22, height: 7, borderRadius: 4, backgroundColor: C.hero },

  thumb: {
    width: 58, height: 58, borderRadius: 14, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent', opacity: 0.65,
  },
  thumbActive: { borderColor: C.hero, opacity: 1 },
  thumbImg:    { width: '100%', height: '100%' },

  // Chips
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.accentSoft, paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 22, borderWidth: 0.5, borderColor: C.accentBorder,
  },
  chipActive: {
    backgroundColor: C.hero, borderColor: C.hero,
    shadowColor: C.hero, shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  chipText:       { fontSize: 13, fontWeight: '600', color: C.accent },
  chipTextActive: { color: C.white },

  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText:  { color: C.textMuted, fontSize: 14, fontWeight: '500' },
});
