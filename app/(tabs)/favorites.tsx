import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';
import { useTheme } from '../themeContext';

export default function FavoritesScreen() {
  const { theme, isDarkMode } = useTheme();
  const {  loading, recipes,userId,favoritos,toggleFavorito} = useAuth();
  const router = useRouter();
  
      
    useEffect(() => {
      if (!userId && !loading) {
        router.push('/login')}
    }, [loading])
    

  const getName = (f: any) => f.receita?.nomeReceita ?? '';
  const getChef = (f: any) => f.receita?.chefe?.nomeCompleto ?? '';
  const getImage = (f: any) => f.receita?.fotoReceita ?? '';
  const getreceitaId = (f: any) => String(f.receita?.codReceitas ?? '');
  const getFavId = (f: any) => String(f.codFavoritos ?? '');

  const handleDesfavoritar =  async (item: any) => {
  await toggleFavorito(getreceitaId(item), item.receita?.codreceitas)
};

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary, padding: 20, paddingTop: 60 },
    container2: { flex: 1, backgroundColor: theme.background.primary, padding: 0 },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.text.primary, marginBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: theme.background.secondary, borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: isDarkMode ? '#333' :'#fcad45' },
    image: { width: 70, height: 70, borderRadius: 8, backgroundColor: isDarkMode ? '#333' : '#EEE', borderWidth: 0.5,borderColor: '#fabf72' },
    info: { flex: 1, marginLeft: 15 },
    name: { fontSize: 16, fontWeight: 'bold', color: theme.text.primary },
    chef: { fontSize: 14, color: theme.text.secondary, marginTop: 2 },
    empty: { color: theme.text.secondary, textAlign: 'center', marginTop: 50, fontSize: 16 },
  });

  return (
    loading ? (
              <BolinhaqGira/>
        ) : 
    <View style={styles.container2}>
      <View style={styles.container}>
      {!loading &&<Text style={styles.title}>Favoritadas</Text>}
      {loading ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 40, flex: 1, justifyContent: 'center', alignItems: 'center'}} />
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={getFavId}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/Sobpo/[id]', params: { id: getreceitaId(item) } })}>
              <Image source={{ uri: getImage(item) || 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg' }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{getName(item)}</Text>
                <Text style={styles.chef}>{getChef(item)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDesfavoritar(item  )}>
                <Ionicons name="heart" size={24} color="#e68a00" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Você ainda não favoritou nenhuma recipe.</Text>}
        />
      )}
      </View>
        <BottomNavigation />
    </View>
  );
}
