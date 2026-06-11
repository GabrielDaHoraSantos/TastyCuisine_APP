import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { favoritosAPI, receitasAPI } from '../(auth)/api';
import MenuButton from '../../components/MenuButton';
import SideMenu from '../../components/SideMenu';
import { useAuth } from '../authContext';
import { useTheme } from '../themeContext';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTime, setSelectedTime] = useState('Todos');
  const [selectedChef, setSelectedChef] = useState('Todos');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempChef, setTempChef] = useState('Todos');
  const [tempTime, setTempTime] = useState('Todos');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { userId } = useAuth();

  useEffect(() => {
    receitasAPI.getAll().then(res => {
      if (res.data) setRecipes(res.data);
    }).finally(() => setLoading(false));
    if (userId) {
      favoritosAPI.getAll().then(res => {
        if (res.data) setFavoritos(res.data.filter(f => String(f.usuario?.codUser) === String(userId)));
      });
    }
  }, []);

  const getName = (r) => r.nomeReceita ?? r.name ?? '';
  const getChef = (r) => r.chefe?.nomeCompleto ?? r.chefe?.nome ?? r.chef ?? '';
  const getImage = (r) => r.fotoReceita ?? r.image ?? '';
  const getDesc = (r) => typeof r.descricao === 'string' ? r.descricao : '';
  const getId = (r) => String(r.codReceitas ?? r.id ?? '');
  const getFavId = (r) => {
    const f = favoritos.find(fav => String(fav.receita?.codReceitas) === String(getId(r)));
    return f ? String(f.codFavoritos) : null;
  };

  const handleToggleFav = async (item) => {
    const favId = getFavId(item);
    if (favId) {
      await favoritosAPI.delete(favId);
      setFavoritos(prev => prev.filter(f => String(f.codFavoritos) !== favId));
    } else {
      const res = await favoritosAPI.create({
        usuario: { codUser: Number(userId) },
        receita: { codReceitas: item.codReceitas ?? item.id },
      });
      if (res.data) setFavoritos(prev => [...prev, res.data]);
    }
  };

  const timeRanges = ['Todos', 'Rápido (<30min)', 'Médio (30-60min)'];
  const chefs = ['Todos', ...new Set(recipes.map(getChef).filter(Boolean))];

  const filteredDishes = useMemo(() => {
    return recipes.filter(dish => {
      const matchesSearch = searchQuery === '' || getName(dish).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChef = selectedChef === 'Todos' || getChef(dish) === selectedChef;
      const prep = parseInt((dish.prepareTime ?? dish.tempoPreparo ?? '0').toString().replace(/\D/g, ''), 10) || 0;
      const matchesTime = selectedTime === 'Todos' ||
        (selectedTime === 'Rápido (<30min)' && prep < 30) ||
        (selectedTime === 'Médio (30-60min)' && prep >= 30 && prep <= 60);
      return matchesSearch && matchesChef && matchesTime;
    });
  }, [recipes, searchQuery, selectedTime, selectedChef]);

  const applyFilters = () => { setSelectedChef(tempChef); setSelectedTime(tempTime); setFilterModalVisible(false); };
  const clearFilters = () => { setTempChef('Todos'); setTempTime('Todos'); setSelectedChef('Todos'); setSelectedTime('Todos'); };
  const hasActiveFilters = selectedChef !== 'Todos' || selectedTime !== 'Todos';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.primary, marginBottom: 15 },
    searchContainer: { flexDirection: 'row', gap: 10 },
    searchBar: { flex: 1, backgroundColor: theme.background.secondary, borderRadius: 12, paddingHorizontal: 15, height: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' },
    searchInput: { flex: 1, color: theme.text.primary, fontSize: 16, marginLeft: 10 },
    filterButton: { width: 50, height: 50, backgroundColor: theme.background.secondary, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' },
    filterButtonActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: theme.background.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary },
    clearButton: { padding: 5 },
    clearButtonText: { color: theme.primary, fontSize: 16 },
    filterSection: { paddingHorizontal: 20, marginBottom: 25 },
    filterTitle: { fontSize: 16, fontWeight: '600', color: theme.text.primary, marginBottom: 12 },
    filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: theme.background.secondary, borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' },
    chipSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText: { fontSize: 14, color: theme.text.primary },
    chipTextSelected: { color: '#FFF', fontWeight: '600' },
    applyButton: { backgroundColor: theme.primary, marginHorizontal: 20, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    resultSection: { flex: 1, paddingHorizontal: 20 },
    resultCount: { fontSize: 14, color: theme.text.secondary, marginBottom: 15 },
    card: { flexDirection: 'row', backgroundColor: theme.background.secondary, borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' },
    image: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 15 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    name: { fontSize: 16, fontWeight: 'bold', color: theme.text.primary, marginBottom: 2, flex: 1, marginRight: 6 },
    chef: { fontSize: 13, color: theme.text.secondary, marginBottom: 3 },
    desc: { fontSize: 12, color: theme.text.secondary },
    empty: { color: theme.text.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 },
  });

  return (
    <View style={styles.container}>
      <MenuButton onPress={() => setDrawerVisible(true)} />
      <View style={styles.header}>
        <Text style={styles.title}>Pesquisar Receitas</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.text.secondary} />
            <TextInput style={styles.searchInput} placeholder="Buscar receita..." placeholderTextColor={theme.text.secondary} value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]} onPress={() => { setTempChef(selectedChef); setTempTime(selectedTime); setFilterModalVisible(true); }}>
            <Ionicons name="options-outline" size={22} color={hasActiveFilters ? '#FFF' : theme.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultSection}>
        {loading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={styles.resultCount}>{filteredDishes.length} {filteredDishes.length === 1 ? 'receita encontrada' : 'receitas encontradas'}</Text>
            <FlatList
              data={filteredDishes}
              keyExtractor={getId}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 120 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/Sobpo/[id]', params: { id: getId(item) } })}>
                  <Image source={{ uri: getImage(item) }} style={styles.image} />
                  <View style={styles.info}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{getName(item)}</Text>
                      <TouchableOpacity onPress={() => handleToggleFav(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name={getFavId(item) ? 'heart' : 'heart-outline'} size={18} color={getFavId(item) ? '#E53935' : theme.text.secondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.chef} numberOfLines={1}>{getChef(item)}</Text>
                    <Text style={styles.desc} numberOfLines={2}>{getDesc(item)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.empty}>{searchQuery ? 'Nenhuma receita encontrada' : 'Nenhuma receita disponível'}</Text>}
            />
          </>
        )}
      </View>

      <Modal visible={filterModalVisible} transparent animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtros</Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}><Text style={styles.clearButtonText}>Limpar</Text></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterTitle}>Chef</Text>
                  <View style={styles.filterChips}>
                    {chefs.map(chef => (
                      <TouchableOpacity key={chef} style={[styles.chip, tempChef === chef && styles.chipSelected]} onPress={() => setTempChef(chef)}>
                        <Text style={[styles.chipText, tempChef === chef && styles.chipTextSelected]}>{chef}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.filterSection}>
                  <Text style={styles.filterTitle}>Tempo de Preparo</Text>
                  <View style={styles.filterChips}>
                    {timeRanges.map(time => (
                      <TouchableOpacity key={time} style={[styles.chip, tempTime === time && styles.chipSelected]} onPress={() => setTempTime(time)}>
                        <Text style={[styles.chipText, tempTime === time && styles.chipTextSelected]}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
