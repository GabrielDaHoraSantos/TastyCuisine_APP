import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../themeContext';
import { useAuth } from '../authContext';
import SideMenu from '../../components/SideMenu';
import MenuButton from '../../components/MenuButton';
import { favoritosAPI } from '../(auth)/api';

export default function FavoritesScreen() {
  const { theme, isDarkMode } = useTheme();
  const { userId } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    setLoading(true);
    favoritosAPI.getAll().then(res => {
      if (res.data) {
        const todos = res.data as any[];
        const doUsuario = todos.filter(f => String(f.usuario?.codUser) === String(userId));
        setFavoritos(doUsuario);
      }
    }).finally(() => setLoading(false));
  }, [userId]));

  const getName = (f: any) => f.receita?.nomeReceita ?? '';
  const getChef = (f: any) => f.receita?.chefe?.nomeCompleto ?? '';
  const getImage = (f: any) => f.receita?.fotoReceita ?? '';
  const getReceitaId = (f: any) => String(f.receita?.codReceitas ?? '');
  const getFavId = (f: any) => String(f.codFavoritos ?? '');

  const handleDesfavoritar = async (favId: string) => {
    await favoritosAPI.delete(favId);
    setFavoritos(prev => prev.filter(f => getFavId(f) !== favId));
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary, padding: 20, paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.text.primary, marginBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: theme.background.secondary, borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: isDarkMode ? '#333' : '#EEE' },
    image: { width: 70, height: 70, borderRadius: 8, backgroundColor: isDarkMode ? '#333' : '#EEE' },
    info: { flex: 1, marginLeft: 15 },
    name: { fontSize: 16, fontWeight: 'bold', color: theme.text.primary },
    chef: { fontSize: 14, color: theme.text.secondary, marginTop: 2 },
    empty: { color: theme.text.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 },
  });

  return (
    <View style={styles.container}>
      <MenuButton onPress={() => setDrawerVisible(true)} />
      <Text style={styles.title}>Receitas Favoritadas</Text>
      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={getFavId}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/Sobpo/[id]', params: { id: getReceitaId(item) } })}>
              <Image source={{ uri: getImage(item) }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{getName(item)}</Text>
                <Text style={styles.chef}>{getChef(item)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDesfavoritar(getFavId(item))}>
                <Ionicons name="heart" size={24} color="#e68a00" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Você ainda não favoritou nenhuma receita.</Text>}
        />
      )}
      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
