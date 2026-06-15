import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const { favoritos, toggleFavorito } = useAuth()

  const nome = item.nomeReceita ?? item.name ?? '';
  const descricao = typeof item.descricao === 'string' ? item.descricao : '';
  const imagem = item.fotoReceita || 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg';
  const receitaId = item.codReceitas ?? item.id;
  const fav = favoritos.find(f => String(f.receita?.codReceitas) === String(receitaId))
  const favoritoId = fav ? String(fav.codFavoritos) : null


  const handleToggle = async () => {
  if (!userId) return
  await toggleFavorito(String(receitaId), receitaId)
}

  const styles = StyleSheet.create({
    card: {borderWidth: 1,borderColor: '#72fa89' , padding:20, width, backgroundColor: theme.background.secondary, borderRadius: 16, marginLeft: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
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
          <TouchableOpacity onPress={handleToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
               <Ionicons name={favoritoId ? 'heart' : 'heart-outline'} size={18} color={favoritoId ? '#fcad45' : theme.text.secondary} />
            
          </TouchableOpacity>
        </View>
        {descricao ? <Text style={styles.desc} numberOfLines={2}>{descricao}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}
