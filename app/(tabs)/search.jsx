import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';
import { useTheme } from '../themeContext';

// ─── Design tokens (idênticos ao HomeScreen) ──────────────────────────────────
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
  white:        '#FFFFFF',
};

const PLACEHOLDER_IMG = 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg';
const RECENT_SEARCHES_KEY = 'recentSearches';
const RECENT_VIEWS_KEY    = 'recentViews';
const MAX_RECENT_SEARCHES = 6;
const MAX_RECENT_VIEWS    = 6;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getName  = (r: any): string => r.nomeReceita ?? r.name ?? '';
const getChef  = (r: any): string => r.chefe?.nomeCompleto ?? r.chefe?.nomeChefe ?? r.chef ?? '';
const getImage = (r: any): string => r.fotoReceita || PLACEHOLDER_IMG;
const getDesc  = (r: any): string => typeof r.descricao === 'string' ? r.descricao : '';
const getId    = (r: any): string => String(r.codReceitas ?? r.id ?? '');
const getTime  = (r: any): string => r.prepareTime ?? r.tempoPreparo ?? '';
const getRating = (r: any): string => parseFloat(r.avaliacao ?? r.rating ?? '0').toFixed(1);

// ─── Wide Recipe Card (mesmo estilo do WideCard do Home) ─────────────────────
function RecipeCard({
  item,
  onPress,
  isFav,
  onToggleFav,
}: {
  item: any;
  onPress: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  return (
    <TouchableOpacity style={rc.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: getImage(item) }} style={rc.img} resizeMode="cover" />
      <View style={rc.info}>
        <Text style={rc.name} numberOfLines={2}>{getName(item)}</Text>
        <Text style={rc.chef} numberOfLines={1}>por {getChef(item)}</Text>
        <View style={rc.meta}>
          {!!getTime(item) && (
            <View style={rc.pill}>
              <Ionicons name="time-outline" size={11} color={C.textSub} />
              <Text style={rc.pillText}>{getTime(item)}</Text>
            </View>
          )}
          <View style={[rc.pill, { backgroundColor: '#FFF8E8' }]}>
            <Ionicons name="star" size={11} color="#FFD700" />
            <Text style={rc.pillText}>{getRating(item)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={rc.favBtn}
        onPress={onToggleFav}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={20}
          color={isFav ? C.hero : C.textMuted}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function SearchScreen() {
  const { theme, isDarkMode } = useTheme();
  const { userId, favoritos, toggleFavorito, recipes, loading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery]           = useState('');
  const [isFocused, setIsFocused]               = useState(false);
  const [recentSearches, setRecentSearches]     = useState<string[]>([]);
  const [recentViews, setRecentViews]           = useState<any[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedChef, setSelectedChef]         = useState('Todos');
  const [selectedTime, setSelectedTime]         = useState('Todos');
  const [tempChef, setTempChef]                 = useState('Todos');
  const [tempTime, setTempTime]                 = useState('Todos');

  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!userId && !loading) router.push('/login');
  }, [loading]);

  // Carregar histórico
  useEffect(() => {
    (async () => {
      try {
        const rs = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (rs) setRecentSearches(JSON.parse(rs));
        const rv = await AsyncStorage.getItem(RECENT_VIEWS_KEY);
        if (rv) setRecentViews(JSON.parse(rv));
      } catch (_) {}
    })();
  }, []);

  // Fade in ao focar
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFocused || searchQuery.length > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isFocused, searchQuery]);

  // ── Persistência ──────────────────────────────────────────────────────────
  const saveRecentSearches = async (list: string[]) => {
    setRecentSearches(list);
    try { await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list)); } catch (_) {}
  };

  const addRecentView = async (item: any) => {
    const id = getId(item);
    const filtered = recentViews.filter(r => getId(r) !== id);
    const next = [item, ...filtered].slice(0, MAX_RECENT_VIEWS);
    setRecentViews(next);
    try { await AsyncStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(next)); } catch (_) {}
  };

  const commitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const filtered = recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
    saveRecentSearches([trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES));
  };

  const removeRecentSearch = (term: string) => {
    saveRecentSearches(recentSearches.filter(s => s !== term));
  };

  const clearRecentSearches = () => saveRecentSearches([]);

  // ── Navegação ──────────────────────────────────────────────────────────────
  const handlePressRecipe = (item: any) => {
    addRecentView(item);
    commitSearch(searchQuery);
    router.push({ pathname: '/Sobpo/[id]', params: { id: getId(item) } });
  };

  const handlePressRecentSearch = (term: string) => {
    setSearchQuery(term);
    inputRef.current?.blur();
  };

  // ── Favorito ──────────────────────────────────────────────────────────────
  const getFavId = (r: any) => {
    const f = favoritos.find(fav => String(fav.receita?.codReceitas) === getId(r));
    return f ? String(f.codFavoritos) : null;
  };
  const handleToggleFav = async (item: any) => {
    await toggleFavorito(getId(item), item.codReceitas ?? item.id);
  };

  // ── Filtros ───────────────────────────────────────────────────────────────
  const timeRanges = ['Todos', 'Rápido (<30min)', 'Médio (30-60min)'];
  const chefs = ['Todos', ...Array.from(new Set(recipes.map(getChef).filter(Boolean)))];
  const hasActiveFilters = selectedChef !== 'Todos' || selectedTime !== 'Todos';

  const applyFilters = () => { setSelectedChef(tempChef); setSelectedTime(tempTime); setFilterModalVisible(false); };
  const clearFilters = () => { setTempChef('Todos'); setTempTime('Todos'); setSelectedChef('Todos'); setSelectedTime('Todos'); };

  // ── Resultados ────────────────────────────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    return recipes.filter(dish => {
      const matchesSearch = !searchQuery.trim() ||
        getName(dish).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getChef(dish).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChef = selectedChef === 'Todos' || getChef(dish) === selectedChef;
      const prep = parseInt((dish.prepareTime ?? dish.tempoPreparo ?? '0').toString().replace(/\D/g, ''), 10) || 0;
      const matchesTime = selectedTime === 'Todos' ||
        (selectedTime === 'Rápido (<30min)' && prep < 30) ||
        (selectedTime === 'Médio (30-60min)' && prep >= 30 && prep <= 60);
      return matchesSearch && matchesChef && matchesTime;
    });
  }, [recipes, searchQuery, selectedChef, selectedTime]);

  const showResults   = searchQuery.trim().length > 0 || hasActiveFilters;
  const showHomepage  = !showResults;

  if (loading) return <BolinhaqGira />;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <Text style={s.title}>Pesquisar</Text>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={s.searchRow}>
        <View style={[s.searchBar, isFocused && s.searchBarFocused]}>
          <Ionicons name="search-outline" size={20} color={isFocused ? C.hero : C.textMuted} />
          <TextInput
            ref={inputRef}
            style={s.searchInput}
            placeholder="Buscar receita ou chef..."
            placeholderTextColor={C.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            onSubmitEditing={() => commitSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Botão filtro */}
        <TouchableOpacity
          style={[s.filterBtn, hasActiveFilters && s.filterBtnActive]}
          onPress={() => { setTempChef(selectedChef); setTempTime(selectedTime); setFilterModalVisible(true); }}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={20} color={hasActiveFilters ? C.white : C.textPrimary} />
          {hasActiveFilters && <View style={s.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* ── CONTEÚDO ── */}
      {showHomepage ? (
        /* ── ESTADO INICIAL: Buscas recentes + Vistos recentemente ── */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.homepageContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Buscas recentes */}
          {recentSearches.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Busca Recente</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={s.sectionAction}>Limpar</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.recentRow}
                  onPress={() => handlePressRecentSearch(term)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="time-outline" size={17} color={C.textMuted} style={{ marginRight: 12 }} />
                  <Text style={s.recentTerm} numberOfLines={1}>{term}</Text>
                  <TouchableOpacity
                    onPress={() => removeRecentSearch(term)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={16} color={C.textMuted} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Vistos recentemente */}
          {recentViews.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Vistos Recentemente</Text>
              </View>
              {recentViews.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={rv.card}
                  onPress={() => handlePressRecipe(item)}
                  activeOpacity={0.85}
                >
                  <View style={rv.imgWrap}>
                    <Image source={{ uri: getImage(item) }} style={rv.img} resizeMode="cover" />
                    <View style={rv.ratingPill}>
                      <Ionicons name="star" size={9} color="#FFD700" />
                      <Text style={rv.ratingText}>{getRating(item)}</Text>
                    </View>
                  </View>
                  <View style={rv.info}>
                    <Text style={rv.name} numberOfLines={1}>{getName(item)}</Text>
                    <View style={rv.meta}>
                      {!!getTime(item) && (
                        <>
                          <Ionicons name="time-outline" size={12} color={C.hero} />
                          <Text style={rv.metaText}>{getTime(item)}</Text>
                          <Text style={rv.dot}>·</Text>
                        </>
                      )}
                      <Text style={rv.metaText}>por {getChef(item)}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Estado vazio total */}
          {recentSearches.length === 0 && recentViews.length === 0 && (
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={48} color={C.textMuted} />
              <Text style={s.emptyTitle}>Explore receitas</Text>
              <Text style={s.emptySubtitle}>Digite o nome de uma receita ou chef para começar</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        /* ── RESULTADOS DA BUSCA ── */
        <>
          <View style={s.resultsHeader}>
            <Text style={s.resultsCount}>
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={s.sectionAction}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredRecipes}
            keyExtractor={getId}
            contentContainerStyle={s.resultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RecipeCard
                item={item}
                onPress={() => handlePressRecipe(item)}
                isFav={!!getFavId(item)}
                onToggleFav={() => handleToggleFav(item)}
              />
            )}
            ListEmptyComponent={
              <View style={s.emptyState}>
                <Ionicons name="search-outline" size={40} color={C.textMuted} />
                <Text style={s.emptyTitle}>Nenhuma receita encontrada</Text>
                <Text style={s.emptySubtitle}>Tente outro termo ou ajuste os filtros</Text>
              </View>
            }
          />
        </>
      )}

      {!filterModalVisible && <BottomNavigation />}

      {/* ════ MODAL DE FILTROS ════ */}
      <Modal visible={filterModalVisible} transparent animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
        <View style={fm.overlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setFilterModalVisible(false)} />
          <View style={fm.sheet}>
            <View style={fm.handle} />
            <View style={fm.header}>
              <Text style={fm.title}>Filtros</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={fm.clear}>Limpar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={fm.section}>
                <Text style={fm.sectionLabel}>Chef</Text>
                <View style={fm.chips}>
                  {chefs.map(chef => (
                    <TouchableOpacity
                      key={chef}
                      style={[fm.chip, tempChef === chef && fm.chipActive]}
                      onPress={() => setTempChef(chef)}
                    >
                      <Text style={[fm.chipText, tempChef === chef && fm.chipTextActive]}>{chef}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={fm.section}>
                <Text style={fm.sectionLabel}>Tempo de Preparo</Text>
                <View style={fm.chips}>
                  {timeRanges.map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[fm.chip, tempTime === t && fm.chipActive]}
                      onPress={() => setTempTime(t)}
                    >
                      <Text style={[fm.chipText, tempTime === t && fm.chipTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={fm.applyBtn} onPress={applyFilters} activeOpacity={0.85}>
              <Text style={fm.applyText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Recipe card ──────────────────────────────────────────────────────────────
const rc = StyleSheet.create({
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
    marginBottom: 12,
  },
  img: {
    width: 90,
    height: 90,
    backgroundColor: C.surfaceHi,
    borderRadius: 10,
    margin: 10,
  },
  info:  { flex: 1, paddingVertical: 10, paddingRight: 4, gap: 3 },
  name:  { fontSize: 15, fontWeight: '700', color: C.textPrimary, lineHeight: 20 },
  chef:  { fontSize: 12, color: C.textSub },
  meta:  { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.accentSoft,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  pillText: { fontSize: 11, color: C.textSub, fontWeight: '600' },
  favBtn:   { paddingRight: 16, paddingLeft: 6 },
});

// ─── Recently viewed card ─────────────────────────────────────────────────────
const rv = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#EDE0D4',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#3D2010',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  imgWrap: { position: 'relative' },
  img: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: C.surfaceHi,
  },
  ratingPill: {
    position: 'absolute', bottom: 4, right: 4,
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 8,
  },
  ratingText: { color: C.white, fontSize: 10, fontWeight: '700' },
  info:       { flex: 1, gap: 4 },
  name:       { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  meta:       { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText:   { fontSize: 12, color: C.textSub },
  dot:        { fontSize: 12, color: C.textMuted },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 8,
  },
  title: { fontSize: 26, fontWeight: '800', color: C.textPrimary },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    borderWidth: 1,
    borderColor: '#EDE0D4',
    shadowColor: '#3D2010',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchBarFocused: {
    borderColor: C.hero,
    shadowOpacity: 0.1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: C.textPrimary,
    padding: 0,
  },
  filterBtn: {
    width: 48, height: 48,
    backgroundColor: C.surface,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE0D4',
    shadowColor: '#3D2010',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  filterBtnActive: {
    backgroundColor: C.hero,
    borderColor: C.hero,
  },
  filterDot: {
    position: 'absolute',
    top: 8, right: 8,
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: C.white,
  },

  // Homepage (estado inicial)
  homepageContent: { paddingHorizontal: 20, paddingBottom: 120 },
  section:         { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle:  { fontSize: 18, fontWeight: '800', color: C.textPrimary },
  sectionAction: { fontSize: 14, color: C.hero, fontWeight: '600' },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EDE0D4',
  },
  recentTerm: { flex: 1, fontSize: 15, color: C.textPrimary, fontWeight: '500' },

  // Results
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsCount: { fontSize: 13, color: C.textSub, fontWeight: '600' },
  resultsList:  { paddingHorizontal: 20, paddingBottom: 120 },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyTitle:    { fontSize: 17, fontWeight: '700', color: C.textSub },
  emptySubtitle: { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20 },
});

// ─── Filter modal styles ──────────────────────────────────────────────────────
const fm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '80%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.accentBorder,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title:   { fontSize: 20, fontWeight: '800', color: C.textPrimary },
  clear:   { fontSize: 15, color: C.hero, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 12 },
  chips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: C.accentSoft,
    borderWidth: 0.5, borderColor: C.accentBorder,
  },
  chipActive: { backgroundColor: C.hero, borderColor: C.hero },
  chipText:       { fontSize: 14, color: C.accent, fontWeight: '600' },
  chipTextActive: { color: C.white },
  applyBtn: {
    backgroundColor: C.hero,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: C.hero,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  applyText: { color: C.white, fontSize: 16, fontWeight: '800' },
});