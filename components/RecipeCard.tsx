import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { favoritosAPI } from '../app/(auth)/api';
import { useAuth } from '../app/authContext';
import { useTheme } from '../app/themeContext';

type Props = {
  item: any;
  onPress: () => void;
  width?: number;
};


export default function RecipeCard({ item, onPress, width = 160 }: Props) {
  const { theme, isDarkMode } = useTheme();
  const { userId } = useAuth();
  const [favoritoId, setFavoritoId] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState(false);

  const nome = item.nomeReceita ?? item.name ?? '';
  const descricao = typeof item.descricao === 'string' ? item.descricao : '';
  const imagem = item.fotoReceita ?? item.image ?? 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg';
  const receitaId = item.codReceitas ?? item.id;

  useEffect(() => {
    if (!userId) return;
    favoritosAPI.getAll().then(res => {
      if (res.data) {
        const todos = res.data as any[];
        const fav = todos.find(f =>
          String(f.usuario?.codUser) === String(userId) &&
          String(f.receita?.codReceitas) === String(receitaId)
        );
        if (fav) setFavoritoId(String(fav.codFavoritos));
      }
    });
  }, [userId, receitaId]);

  const handleToggle = async () => {
    if (!userId) return;
    setFavLoading(true);
    if (favoritoId) {
      await favoritosAPI.delete(favoritoId);
      setFavoritoId(null);
    } else {
      const res = await favoritosAPI.create({
        usuario: { codUser: Number(userId) },
        receita: { codReceitas: receitaId },
      });
      if (res.data) setFavoritoId(String((res.data as any).codFavoritos));
    }
    setFavLoading(false);
  };

  const styles = StyleSheet.create({
    card: { width, backgroundColor: theme.background.secondary, borderRadius: 16, marginLeft: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    image: { width: '100%', height: 110, backgroundColor: isDarkMode ? '#333' : '#F5F5F5' },
    info: { padding: 12 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    name: { fontSize: 15, fontWeight: 'bold', color: theme.text.primary, flex: 1, marginRight: 6 },
    desc: { fontSize: 12, color: theme.text.secondary, lineHeight: 16 },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imagem }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{nome}</Text>
          <TouchableOpacity onPress={handleToggle} disabled={favLoading} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {favLoading
              ? <ActivityIndicator size="small" color={theme.accent} />
              : <Ionicons name={favoritoId ? 'heart' : 'heart-outline'} size={18} color={favoritoId ? '#E53935' : theme.text.secondary} />
            }
          </TouchableOpacity>
        </View>
        {descricao ? <Text style={styles.desc} numberOfLines={2}>{descricao}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}
