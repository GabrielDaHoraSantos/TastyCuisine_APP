import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BolinhaqGira from '../../components/BolinhaqGira';
import { useAuth } from '../authContext';
import { useTheme } from '../themeContext';

const str = (v: any): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return '';
};



type Ingrediente = { quantidade: string; unidade: string; nome: string };

const parseIngredientes = (raw: any): Ingrediente[] => {
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(arr)) {
      return arr.map((item: any) => ({
        quantidade: str(item?.quantidade),
        unidade: str(item?.unidade),
        nome: str(item?.nome),
      }));
    }
  } catch {}
  return [];
};

const parsePassos = (raw: any): string[] => {
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(arr)) return arr.map((item: any) => str(item));
  } catch {}
  if (typeof raw === 'string') return raw.split('\n').filter(Boolean);
  return [];
};

const formatDate = (raw: any): string => {
  if (!raw) return '';
  try { return new Date(raw).toLocaleDateString('pt-BR'); } catch { return str(raw); }
};

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { userId, recipes, loading, favoritos, toggleFavorito,getComentarios, enviarAvaliacao  } = useAuth();

  const [servings, setServings] = useState(1);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [comentarios, setComentarios] = useState<any[]>([]);

  const recipe = recipes.find(r => String(r.codReceitas ?? r.id) === String(id))
  const fav = favoritos.find(f => String(f.receita?.codReceitas) === String(id))
  const favoritoId = fav ? String(fav.codFavoritos) : null
  
    
    useEffect(() => {
    if (!userId && !loading) router.push('/login')
  }, [loading])

  useEffect(() => {
  getComentarios(String(id)).then(setComentarios)
}, [id]);
  const handleToggleFavorito = async () => {
    await toggleFavorito(String(id), Number(id))
  }

  const handleEnviarAvaliacao = async () => {
  if (!userId) { Alert.alert('Atenção', 'Você precisa estar logado para avaliar.'); return; }
  if (rating === 0) { Alert.alert('Atenção', 'Selecione uma nota de 1 a 5.'); return; }
  if (commentText.trim() === '') { Alert.alert('Atenção', 'Escreva um comentário.'); return; }
  setSending(true);
  await enviarAvaliacao(Number(id), rating, commentText.trim())
  setSending(false);
  const atualizados = await getComentarios(String(id))
  setComentarios(atualizados)
  Alert.alert('Obrigado!', 'Avaliação enviada com sucesso.');
  setRating(0);
  setCommentText('');
}
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    header: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between' },
    headerBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
    image: { width: '100%', height: 300 },
    content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: theme.background.primary },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text.primary, flex: 1, marginRight: 10 },
    chef: { fontSize: 16, color: theme.text.secondary, marginBottom: 15 },
    descricao: { color: theme.text.secondary, marginBottom: 10, fontSize: 15, lineHeight: 22 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary, marginTop: 20, marginBottom: 15 },
    servingSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDarkMode ? '#222' : '#f5f5f5', padding: 10, borderRadius: 15, alignSelf: 'flex-start', marginBottom: 10 },
    servingBtn: { padding: 5 },
    servingText: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold', color: theme.text.primary },
    ingredientItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
    ingredientBullet: { fontSize: 15, color: theme.accent, fontWeight: 'bold', marginRight: 8, lineHeight: 22 },
    ingredientText: { flex: 1, color: theme.text.primary, fontSize: 15, lineHeight: 22 },
    stepItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
    stepNumber: { minWidth: 28, height: 28, borderRadius: 14, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 1 },
    stepNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    stepText: { flex: 1, color: theme.text.primary, fontSize: 15, lineHeight: 24 },
    ratingBox: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9', padding: 20, borderRadius: 20, marginTop: 20 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
    input: { backgroundColor: isDarkMode ? '#333' : '#fff', borderRadius: 12, padding: 15, color: theme.text.primary, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: isDarkMode ? '#444' : '#ddd', marginBottom: 10 },
    sendBtn: { backgroundColor: theme.accent, padding: 15, borderRadius: 12, alignItems: 'center' },
    sendBtnDisabled: { backgroundColor: isDarkMode ? '#444' : '#ccc' },
    sendBtnText: { color: '#fff', fontWeight: 'bold' },
    commentItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#eee' },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    commentUser: { fontWeight: 'bold', color: theme.text.primary, fontSize: 14 },
    commentDate: { fontSize: 12, color: theme.text.secondary },
    commentText: { color: theme.text.secondary, fontSize: 14, lineHeight: 20 },
  });

  if (!recipe) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text.primary }}>Receita não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.accent }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const nomeReceita = str(recipe.nomeReceita ?? recipe.name);
  const nomeChefe = str(recipe.chefe?.nomeCompleto);
  const descricao = str(recipe.descricao);
  const fotoReceita = str(recipe.fotoReceita ?? recipe.image);
  const ingredientes = parseIngredientes(recipe.ingredientes);
  const passos = parsePassos(recipe.modoPreparo);


  const scaledIngredients = ingredientes.map(ing => {
    const qty = parseFloat(ing.quantidade);
    const scaled = isNaN(qty)
      ? ing.quantidade
      : (qty * servings) % 1 === 0 ? String(qty * servings) : (qty * servings).toFixed(1);
    return { quantidade: scaled, unidade: ing.unidade, nome: ing.nome };
  });

  return (
    loading ? (
              <BolinhaqGira/>
        ) : 
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {fotoReceita ? (
          <Image source={{ uri: fotoReceita }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: isDarkMode ? '#333' : '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="image-outline" size={48} color={isDarkMode ? '#666' : '#AAA'} />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{nomeReceita}</Text>
            <TouchableOpacity onPress={handleToggleFavorito} style={{ paddingTop: 4 }}>
                <Ionicons name={favoritoId ? 'heart' : 'heart-outline'} size={28} color={favoritoId ? '#E53935' : theme.text.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.chef}>por {nomeChefe}</Text>
          {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <View style={styles.servingSelector}>
              <TouchableOpacity onPress={() => setServings(Math.max(1, servings - 1))} style={styles.servingBtn}>
                <Ionicons name="remove" size={20} color={theme.accent} />
              </TouchableOpacity>
              <Text style={styles.servingText}>{servings} {servings === 1 ? 'pessoa' : 'pessoas'}</Text>
              <TouchableOpacity onPress={() => setServings(Math.min(10, servings + 1))} style={styles.servingBtn}>
                <Ionicons name="add" size={20} color={theme.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {scaledIngredients.map((item, i) => (
            <View key={i} style={styles.ingredientItem}>
              <Text style={styles.ingredientBullet}>•</Text>
              <Text style={styles.ingredientText}>{item.quantidade} {item.unidade} {item.nome}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          {passos.map((step, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Avalie esta receita</Text>
          <View style={styles.ratingBox}>
            <Text style={{ color: theme.text.primary, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>O que achou?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={32} color={s <= rating ? '#FFD700' : theme.text.secondary} style={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
              ))}
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <TextInput
                style={styles.input}
                placeholder="Escreva seu comentário..."
                placeholderTextColor={theme.text.secondary}
                multiline
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (rating === 0 || commentText.trim() === '' || sending) && styles.sendBtnDisabled]}
                onPress={handleEnviarAvaliacao}
                disabled={rating === 0 || commentText.trim() === '' || sending}
              >
                {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>Enviar Avaliação</Text>}
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>

          <Text style={styles.sectionTitle}>Comentários</Text>
          {comentarios.length === 0 ? (
            <Text style={{ color: theme.text.secondary, marginBottom: 20 }}>Nenhum comentário ainda. Seja o primeiro!</Text>
          ) : (
            comentarios.map((c, i) => (
              <View key={i} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{str(c.usuario?.nomeCompleto ?? c.usuario?.nomeDeUsuario)}</Text>
                  <Text style={styles.commentDate}>{formatDate(c.dataComentario)}</Text>
                </View>
                <Text style={styles.commentText}>{str(c.texto)}</Text>
              </View>
            ))
          )}

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </View>
  );
}
