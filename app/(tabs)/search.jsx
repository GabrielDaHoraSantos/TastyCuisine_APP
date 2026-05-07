import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../themeContext';
import { FEATURED_DISHES } from '../../src/data/recipes';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedTime, setSelectedTime] = useState('Todos');
  const [selectedChef, setSelectedChef] = useState('Todos');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempChef, setTempChef] = useState('Todos');
  const [tempTime, setTempTime] = useState('Todos');
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  const categories = ['Todos', 'Doce', 'Salgado', 'Café da Manhã'];
  const timeRanges = ['Todos', 'Rápido (<30min)', 'Médio (30-60min)'];
  const chefs = ['Todos', ...new Set(FEATURED_DISHES.map(dish => dish.chef))];

  const filteredDishes = useMemo(() => {
    return FEATURED_DISHES.filter(dish => {
      const matchesSearch = searchQuery === '' || 
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesChef = selectedChef === 'Todos' || dish.chef === selectedChef;
      
      const matchesTime = selectedTime === 'Todos' || 
        (selectedTime === 'Rápido (<30min)' && parseInt(dish.prepareTime) < 30) ||
        (selectedTime === 'Médio (30-60min)' && parseInt(dish.prepareTime) >= 30);

      return matchesSearch && matchesChef && matchesTime;
    });
  }, [searchQuery, selectedCategory, selectedTime, selectedChef]);

  const handlePressDish = (id) => {
    router.push({
      pathname: "/dish/[id]",
      params: { id }
    });
  };

  const applyFilters = () => {
    setSelectedChef(tempChef);
    setSelectedTime(tempTime);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setTempChef('Todos');
    setTempTime('Todos');
    setSelectedChef('Todos');
    setSelectedTime('Todos');
  };

  const openFilterModal = () => {
    setTempChef(selectedChef);
    setTempTime(selectedTime);
    setFilterModalVisible(true);
  };

  const hasActiveFilters = selectedChef !== 'Todos' || selectedTime !== 'Todos';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary, paddingTop: 60 },
    header: { paddingHorizontal: 20, marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.primary, marginBottom: 15 },
    searchContainer: { flexDirection: 'row', gap: 10 },
    searchBar: {
      flex: 1,
      backgroundColor: theme.background.secondary,
      borderRadius: 12,
      paddingHorizontal: 15,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#EEE'
    },
    searchInput: { flex: 1, color: theme.text.primary, fontSize: 16, marginLeft: 10 },
    filterButton: {
      width: 50,
      height: 50,
      backgroundColor: theme.background.secondary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#EEE'
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end'
    },
    modalContent: {
      backgroundColor: theme.background.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: 40,
      maxHeight: '80%'
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary },
    clearButton: { padding: 5 },
    clearButtonText: { color: theme.primary, fontSize: 16 },
    filterSection: { paddingHorizontal: 20, marginBottom: 25 },
    filterTitle: { fontSize: 16, fontWeight: '600', color: theme.text.primary, marginBottom: 12 },
    filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 25,
      backgroundColor: theme.background.secondary,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#EEE'
    },
    chipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary
    },
    chipText: { fontSize: 14, color: theme.text.primary },
    chipTextSelected: { color: '#FFF', fontWeight: '600' },
    applyButton: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10
    },
    applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    resultSection: { flex: 1, paddingHorizontal: 20 },
    resultCount: { fontSize: 14, color: theme.text.secondary, marginBottom: 15 },
    card: {
      flexDirection: 'row',
      backgroundColor: theme.background.secondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 15,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#EEE'
    },
    image: { width: 80, height: 80, borderRadius: 8 },
    info: { flex: 1, marginLeft: 15 },
    name: { fontSize: 16, fontWeight: 'bold', color: theme.text.primary, marginBottom: 4 },
    chef: { fontSize: 14, color: theme.text.secondary, marginBottom: 4 },
    time: { fontSize: 12, color: theme.primary },
    empty: { color: theme.text.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pesquisar Receitas</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.text.secondary} />
            <TextInput
              placeholder="Buscar por nome ou ingrediente..."
              placeholderTextColor={theme.text.secondary}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]} 
            onPress={openFilterModal}
          >
            <Ionicons 
              name="funnel" 
              size={22} 
              color={hasActiveFilters ? '#FFF' : theme.text.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setFilterModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filtros</Text>
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                  <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterTitle}>Chef</Text>
                  <View style={styles.filterChips}>
                    {chefs.map(chef => (
                      <TouchableOpacity
                        key={chef}
                        style={[styles.chip, tempChef === chef && styles.chipSelected]}
                        onPress={() => setTempChef(chef)}
                      >
                        <Text style={[styles.chipText, tempChef === chef && styles.chipTextSelected]}>
                          {chef}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterSection}>
                  <Text style={styles.filterTitle}>Tempo de Preparo</Text>
                  <View style={styles.filterChips}>
                    {timeRanges.map(time => (
                      <TouchableOpacity
                        key={time}
                        style={[styles.chip, tempTime === time && styles.chipSelected]}
                        onPress={() => setTempTime(time)}
                      >
                        <Text style={[styles.chipText, tempTime === time && styles.chipTextSelected]}>
                          {time}
                        </Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.resultSection}>
          <Text style={styles.resultCount}>
            {filteredDishes.length} {filteredDishes.length === 1 ? 'receita encontrada' : 'receitas encontradas'}
          </Text>
          <FlatList
            data={filteredDishes}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handlePressDish(item.id)}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.chef}>{item.chef}</Text>
                  <Text style={styles.time}>⏱️ {item.prepareTime}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.text.secondary} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {searchQuery ? 'Nenhuma receita encontrada' : 'Digite algo para pesquisar'}
              </Text>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
