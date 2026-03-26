import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Comment, FEATURED_DISHES, Recipe } from '../../src/data/recipes';
import { useTheme } from '../themeContext';

// 1. PROTEÇÃO DE VÍDEO (Fora da função principal)
let Video: any;
let ResizeMode: any;
try {
  const ExpoAV = require('expo-av');
  Video = ExpoAV.Video;
  ResizeMode = ExpoAV.ResizeMode;
} catch (e) {
  console.warn("Módulo expo-av não encontrado.");
}

export default function DishDetailScreen() {
  // 2. HOOKS E ESTADOS (Sempre no topo)
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  
  const [servings, setServings] = useState(1);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  // 3. DEFINIÇÃO DOS ESTILOS (Criado aqui para estar disponível em todo o código abaixo)
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    header: { position: 'absolute', top: 50, left: 20, zIndex: 10, flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingRight: 40 },
    backButton: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
    image: { width: '100%', height: 300 },
    content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: theme.background.primary },
    title: { fontSize: 26, fontWeight: 'bold', color: theme.text.primary, marginBottom: 5 },
    chef: { fontSize: 16, color: theme.text.secondary, marginBottom: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#eee', marginBottom: 20 },
    infoItem: { alignItems: 'center' },
    infoLabel: { fontSize: 12, color: theme.text.secondary, marginTop: 4 },
    infoValue: { fontSize: 14, fontWeight: 'bold', color: theme.text.primary },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text.primary, marginTop: 20, marginBottom: 15 },
    servingSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDarkMode ? '#222' : '#f5f5f5', padding: 10, borderRadius: 15, alignSelf: 'flex-start', marginBottom: 10 },
    servingBtn: { padding: 5 },
    servingText: { marginHorizontal: 15, fontSize: 16, fontWeight: 'bold', color: theme.text.primary },
    ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', padding: 12, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    ingredientText: { color: theme.text.primary, marginLeft: 10, fontSize: 15 },
    stepItem: { flexDirection: 'row', marginBottom: 20 },
    stepNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.accent, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    stepNumberText: { color: '#fff', fontWeight: 'bold' },
    stepText: { flex: 1, color: theme.text.primary, fontSize: 15, lineHeight: 22 },
    videoPlayer: { width: '100%', height: 200, borderRadius: 15, marginTop: 10 },
    ratingBox: { backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9', padding: 20, borderRadius: 20, marginTop: 20 },
    starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
    input: { backgroundColor: isDarkMode ? '#333' : '#fff', borderRadius: 12, padding: 15, color: theme.text.primary, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: isDarkMode ? '#444' : '#ddd' },
    sendBtn: { backgroundColor: theme.accent, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    sendBtnDisabled: { backgroundColor: isDarkMode ? '#444' : '#ccc' },
    sendBtnText: { color: '#fff', fontWeight: 'bold' },
    commentItem: { borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333' : '#eee', paddingVertical: 15 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    commentUser: { fontWeight: 'bold', color: theme.text.primary },
    commentDate: { fontSize: 12, color: theme.text.secondary },
    commentText: { color: theme.text.secondary, fontSize: 14, marginTop: 5 }
  });

  // 4. BUSCA DA RECEITA
  const recipe = FEATURED_DISHES.find(d => d.id === id) as Recipe | undefined;

  // 5. LÓGICA DE CÁLCULO (useMemo)
  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map(ing => {
      const match = ing.match(/^(\d+[\/\d\.]*)\s*(.*)$/);
      if (match) {
        const amountStr = match[1];
        const rest = match[2];
        let amount: number;
        if (amountStr.includes('/')) {
          const [num, den] = amountStr.split('/').map(Number);
          amount = num / den;
        } else {
          amount = parseFloat(amountStr);
        }
        const newAmount = (amount * servings) / recipe.baseServings;
        const formattedAmount = newAmount % 1 === 0 ? newAmount.toString() : newAmount.toFixed(1);
        return `${formattedAmount} ${rest}`;
      }
      return ing;
    });
  }, [recipe, servings]);

  // 6. VERIFICAÇÃO DE ERRO (Agora o 'styles' já existe aqui!)
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

  // 7. FUNÇÕES DE AÇÃO
  const allComments = [...(recipe.comments || []), ...localComments];

  const handleAddComment = () => {
    if (rating === 0 || commentText.trim() === '') return;
    const newComment: Comment = {
      id: Date.now().toString(),
      user: 'Você',
      rating: rating,
      text: commentText,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setLocalComments([newComment, ...localComments]);
    setCommentText('');
    setRating(0);
  };

  // 8. O VISUAL (Return)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.chef}>por {recipe.chef}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={theme.accent} />
              <Text style={styles.infoLabel}>Preparo</Text>
              <Text style={styles.infoValue}>{recipe.prepareTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={20} color={theme.accent} />
              <Text style={styles.infoLabel}>Dificuldade</Text>
              <Text style={styles.infoValue}>Média</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flame-outline" size={20} color={theme.accent} />
              <Text style={styles.infoLabel}>Calorias</Text>
              <Text style={styles.infoValue}>320 kcal</Text>
            </View>
          </View>

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

          {scaledIngredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
              <Text style={styles.ingredientText}>{item}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Modo de Preparo</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {recipe.videoUrl.length > 0 && Video && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Vídeo Tutorial</Text>
              <Video source={{ uri: recipe.videoUrl }} rate={1.0} volume={1.0} isMuted={false} resizeMode={ResizeMode?.CONTAIN || 'contain'} useNativeControls style={styles.videoPlayer} />
            </View>
          )}

          <Text style={styles.sectionTitle}>Avaliações</Text>
          <View style={styles.ratingBox}>
            <Text style={{ color: theme.text.primary, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }}>O que achou da receita?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons name={s <= rating ? "star" : "star-outline"} size={32} color={s <= rating ? "#FFD700" : theme.text.secondary} style={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TextInput style={styles.input} placeholder="Escreva seu comentário..." placeholderTextColor={theme.text.secondary} multiline value={commentText} onChangeText={setCommentText} />
                <TouchableOpacity style={[styles.sendBtn, commentText.trim() === '' && styles.sendBtnDisabled]} onPress={handleAddComment} disabled={commentText.trim() === ''}>
                  <Text style={styles.sendBtnText}>Enviar Comentário</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            )}
          </View>

          <View style={{ marginTop: 20, marginBottom: 50 }}>
            {allComments.length === 0 ? (
              <Text style={{ color: theme.text.secondary, textAlign: 'center', marginTop: 20 }}>Nenhum comentário ainda. Seja o primeiro!</Text>
            ) : (
              allComments.map((c) => (
                <View key={c.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{c.user}</Text>
                    <Text style={styles.commentDate}>{c.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons key={s} name="star" size={12} color={s <= c.rating ? "#FFD700" : "#ccc"} />
                    ))}
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
