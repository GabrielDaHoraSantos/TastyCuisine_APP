import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { JSX, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOOK_SIZE = (SCREEN_WIDTH - 20 * 2 - 12) / 2 * 0.82;

// ─── Configuração da API ──────────────────────────────────────────────────────
// Troque pelo IP/URL do seu servidor Spring Boot
const API_BASE = 'http://10.0.2.2:8080/api/recipebooks'; // Android emulator
// const API_BASE = 'http://localhost:8080/api/recipebooks'; // iOS simulator
// const API_BASE = 'https://seudominio.com/api/recipebooks'; // produção

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
  white:        '#FFFFFF',
  danger:       '#D94F4F',
};

const BOOK_COLORS = [
  '#C4703A', '#D94F4F', '#6DB86D', '#4F8ED9',
  '#9B59B6', '#E67E22', '#1ABC9C', '#2C3E50',
  '#E91E8C', '#607D8B',
];

const PLACEHOLDER = 'https://worldfoodtour.co.uk/wp-content/uploads/2013/06/neptune-placeholder-48.jpg';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecipeBook {
  id: string;           // vem como number do banco, convertemos para string
  name: string;
  color: string;
  recipeIds: string[];  // string[] no front, Long[] no back (convertido)
  createdAt: number;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return null; // DELETE sem corpo
  return res.json();
}

// Converte a resposta do backend para o formato usado no front
function toFrontBook(b: any): RecipeBook {
  return {
    id:        String(b.id),
    name:      b.name,
    color:     b.color,
    recipeIds: (b.recipeIds ?? []).map(String),
    createdAt: b.createdAt ? new Date(b.createdAt).getTime() : Date.now(),
  };
}

// ─── Helpers de receita ───────────────────────────────────────────────────────
const getName      = (f: any) => f.receita?.nomeReceita ?? '';
const getImage     = (f: any) => f.receita?.fotoReceita ?? '';
const getReceitaId = (f: any) => String(f.receita?.codReceitas ?? '');
const getFavId     = (f: any) => String(f.codFavoritos ?? '');
const getTime      = (f: any) => f.receita?.prepareTime ?? f.receita?.tempoPreparo ?? '';

// ─── Componente: capa do livro ────────────────────────────────────────────────
function BookCover({ book, favoritos, size }: { book: RecipeBook; favoritos: any[]; size: number }) {
  const recipes = favoritos.filter(f => book.recipeIds.includes(getReceitaId(f)));
  const photos  = recipes.slice(0, 4).map(f => getImage(f)).filter(Boolean);

  return (
    <View style={[bc.wrap, { width: size, height: size, backgroundColor: book.color }]}>
      {photos.length === 0 ? (
        <Ionicons name="book-outline" size={size * 0.35} color="rgba(255,255,255,0.5)" />
      ) : photos.length < 4 ? (
        <Image source={{ uri: photos[0] }} style={bc.singleImg} resizeMode="cover" />
      ) : (
        <View style={bc.grid}>
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={bc.gridImg} resizeMode="cover" />
          ))}
        </View>
      )}
      <View style={bc.overlay} />
    </View>
  );
}

const bc = StyleSheet.create({
  wrap:      { borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  singleImg: { width: '100%', height: '100%', position: 'absolute' },
  grid:      { width: '100%', height: '100%', flexDirection: 'row', flexWrap: 'wrap' },
  gridImg:   { width: '50%', height: '50%' },
  overlay:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: 'rgba(0,0,0,0.25)' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FavoritesScreen() {
  const { loading, userId, favoritos } = useAuth();
  const router = useRouter();

  const [books,        setBooks]        = useState<RecipeBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [saving,       setSaving]       = useState(false); // feedback de operações

  const [createVisible, setCreateVisible] = useState(false);
  const [newName,       setNewName]       = useState('');
  const [newColor,      setNewColor]      = useState(BOOK_COLORS[0]);

  const [openBook,    setOpenBook]    = useState<RecipeBook | null>(null);
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [addVisible,   setAddVisible]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RecipeBook | null>(null);

  useEffect(() => {
    if (!userId && !loading) router.push('/login');
  }, [loading]);

  // Carrega livros do backend ao montar a tela
  useEffect(() => {
    if (!userId) return;
    loadBooks();
  }, [userId]);

  // ── Carrega livros da API ──────────────────────────────────────────────────
  const loadBooks = async () => {
    try {
      setBooksLoading(true);
      const data = await apiFetch(`?userId=${userId}`);
      setBooks((data ?? []).map(toFrontBook));
    } catch (e) {
      console.error('Erro ao carregar livros:', e);
    } finally {
      setBooksLoading(false);
    }
  };

  // ── Animação do bottom sheet ───────────────────────────────────────────────
  const openSheet = (book: RecipeBook) => {
    setOpenBook(book);
    Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };
  const closeSheet = () => {
    Animated.timing(sheetAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true })
      .start(() => setOpenBook(null));
  };

  // ── Criar livro ────────────────────────────────────────────────────────────
  const handleCreateBook = async () => {
    if (!newName.trim() || !userId) return;
    try {
      setSaving(true);
      const data = await apiFetch('', {
        method: 'POST',
        body: JSON.stringify({ userId: Number(userId), name: newName.trim(), color: newColor, recipeIds: [] }),
      });
      setBooks(prev => [toFrontBook(data), ...prev]);
      setNewName('');
      setNewColor(BOOK_COLORS[0]);
      setCreateVisible(false);
    } catch (e) {
      console.error('Erro ao criar livro:', e);
    } finally {
      setSaving(false);
    }
  };

  // ── Deletar livro ──────────────────────────────────────────────────────────
  const handleDeleteBook = async (book: RecipeBook) => {
    try {
      setSaving(true);
      await apiFetch(`/${book.id}?userId=${userId}`, { method: 'DELETE' });
      setBooks(prev => prev.filter(b => b.id !== book.id));
      setDeleteTarget(null);
      if (openBook?.id === book.id) closeSheet();
    } catch (e) {
      console.error('Erro ao deletar livro:', e);
    } finally {
      setSaving(false);
    }
  };

  // ── Adicionar/remover receita do livro (toggle) ────────────────────────────
  const handleAddToBook = async (recipeId: string) => {
    if (!openBook || !userId) return;
    const already    = openBook.recipeIds.includes(recipeId);
    const updatedIds = already
      ? openBook.recipeIds.filter(id => id !== recipeId)
      : [...openBook.recipeIds, recipeId];

    // Atualiza UI imediatamente (otimista) e depois sincroniza com API
    const updatedBook  = { ...openBook, recipeIds: updatedIds };
    const updatedBooks = books.map(b => b.id === openBook.id ? updatedBook : b);
    setOpenBook(updatedBook);
    setBooks(updatedBooks);

    try {
      const data = await apiFetch(`/${openBook.id}/recipes?userId=${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ recipeIds: updatedIds.map(Number) }),
      });
      // Confirma com resposta do servidor
      const confirmed = toFrontBook(data);
      setOpenBook(confirmed);
      setBooks(prev => prev.map(b => b.id === confirmed.id ? confirmed : b));
    } catch (e) {
      // Reverte em caso de erro
      console.error('Erro ao atualizar receitas:', e);
      setOpenBook(openBook);
      setBooks(books);
    }
  };

  // ── Remover receita pelo botão X no sheet ──────────────────────────────────
  const handleRemoveFromBook = (recipeId: string) => handleAddToBook(recipeId);

  if (loading || booksLoading) return <BolinhaqGira />;

  const openBookRecipes = openBook
    ? favoritos.filter(f => openBook.recipeIds.includes(getReceitaId(f)))
    : [];

  const sheetPairs: any[][] = [];
  for (let i = 0; i < openBookRecipes.length; i += 2)
    sheetPairs.push(openBookRecipes.slice(i, i + 2));

  const favPairs: any[][] = [];
  for (let i = 0; i < favoritos.length; i += 2)
    favPairs.push(favoritos.slice(i, i + 2));

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>MINHA COLEÇÃO</Text>
          <Text style={s.title}>Recipe Books</Text>
        </View>
        <View style={s.countBadge}>
          <Ionicons name="book-outline" size={14} color={C.hero} />
          <Text style={s.countText}>{books.length}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* ── GRID DE LIVROS ── */}
        <View style={s.grid}>
          {((): JSX.Element[] => {
            const items = [...books, null];
            const rows: JSX.Element[] = [];
            for (let i = 0; i < items.length; i += 2) {
              const pair = items.slice(i, i + 2);
              rows.push(
                <View key={i} style={s.gridRow}>
                  {pair.map((book) =>
                    book === null ? (
                      <TouchableOpacity
                        key="add"
                        style={s.addBookBtn}
                        onPress={() => setCreateVisible(true)}
                        activeOpacity={0.75}
                      >
                        <View style={s.addBookIcon}>
                          <Ionicons name="add" size={28} color={C.accent} />
                        </View>
                        <Text style={s.addBookText}>Novo livro</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={(book as RecipeBook).id}
                        style={s.bookCard}
                        onPress={() => openSheet(book as RecipeBook)}
                        onLongPress={() => setDeleteTarget(book as RecipeBook)}
                        activeOpacity={0.88}
                      >
                        <BookCover book={book as RecipeBook} favoritos={favoritos} size={BOOK_SIZE} />
                        <View style={s.bookMeta}>
                          <Text style={s.bookName} numberOfLines={1}>{(book as RecipeBook).name}</Text>
                          <Text style={s.bookCount}>
                            {(book as RecipeBook).recipeIds.length} receita{(book as RecipeBook).recipeIds.length !== 1 ? 's' : ''}
                          </Text>
                        </View>
                        <View style={[s.colorDot, { backgroundColor: (book as RecipeBook).color }]} />
                      </TouchableOpacity>
                    )
                  )}
                  {pair.length === 1 && pair[0] !== null && <View style={{ width: BOOK_SIZE }} />}
                </View>
              );
            }
            return rows;
          })()}
        </View>

        {books.length === 0 && (
          <View style={s.emptyHint}>
            <Ionicons name="arrow-up-outline" size={18} color={C.textMuted} style={{ transform: [{ rotate: '45deg' }] }} />
            <Text style={s.emptyHintText}>Crie seu primeiro livro de receitas!</Text>
          </View>
        )}

        <Text style={s.longPressHint}>Segure um livro para excluí-lo</Text>
      </ScrollView>

      {/* ════════ BOTTOM SHEET — livro aberto ════════ */}
      {openBook && (
        <Modal visible transparent animationType="none" onRequestClose={closeSheet}>
          <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={closeSheet} />

          <Animated.View style={[s.sheet, { transform: [{ translateY: sheetAnim }] }]}>
            <View style={s.sheetHandle} />

            <View style={s.sheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[s.sheetColorDot, { backgroundColor: openBook.color }]} />
                <View>
                  <Text style={s.sheetTitle}>{openBook.name}</Text>
                  <Text style={s.sheetSubtitle}>{openBookRecipes.length} receita{openBookRecipes.length !== 1 ? 's' : ''}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={s.sheetAddBtn} onPress={() => setAddVisible(true)} activeOpacity={0.8}>
                  <Ionicons name="add" size={18} color={C.white} />
                  <Text style={s.sheetAddText}>Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.sheetCloseBtn} onPress={closeSheet}>
                  <Ionicons name="close" size={20} color={C.textSub} />
                </TouchableOpacity>
              </View>
            </View>

            {openBookRecipes.length === 0 ? (
              <View style={s.sheetEmpty}>
                <Ionicons name="book-outline" size={40} color={C.accentBorder} />
                <Text style={s.sheetEmptyTitle}>Livro vazio</Text>
                <Text style={s.sheetEmptyText}>Adicione receitas das suas favoritas.</Text>
                <TouchableOpacity style={[s.sheetAddBtn, { paddingHorizontal: 24, marginTop: 8 }]} onPress={() => setAddVisible(true)}>
                  <Ionicons name="add" size={16} color={C.white} />
                  <Text style={s.sheetAddText}>Adicionar receita</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
                {sheetPairs.map((pair, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                    {pair.map(item => {
                      const rid   = getReceitaId(item);
                      const cardW = (SCREEN_WIDTH - 32 - 12) / 2;
                      return (
                        <TouchableOpacity
                          key={getFavId(item)}
                          style={[s.miniCard, { width: cardW }]}
                          onPress={() => { closeSheet(); setTimeout(() => router.push({ pathname: '/Sobpo/[id]', params: { id: rid } }), 320); }}
                          activeOpacity={0.88}
                        >
                          <Image source={{ uri: getImage(item) || PLACEHOLDER }} style={s.miniCardImg} resizeMode="cover" />
                          <TouchableOpacity style={s.miniRemoveBtn} onPress={() => handleRemoveFromBook(rid)}>
                            <Ionicons name="close" size={12} color={C.white} />
                          </TouchableOpacity>
                          <View style={s.miniCardInfo}>
                            <Text style={s.miniCardName} numberOfLines={2}>{getName(item)}</Text>
                            {!!getTime(item) && (
                              <View style={s.miniTimePill}>
                                <Ionicons name="time-outline" size={10} color={C.textSub} />
                                <Text style={s.miniTimeText}>{getTime(item)}</Text>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                    {pair.length === 1 && <View style={{ width: (SCREEN_WIDTH - 32 - 12) / 2 }} />}
                  </View>
                ))}
              </ScrollView>
            )}
          </Animated.View>

          {/* Modal de adicionar receita — DENTRO do modal do sheet */}
          <Modal visible={addVisible} transparent animationType="slide" onRequestClose={() => setAddVisible(false)}>
            <View style={[s.modalOverlay, { justifyContent: 'flex-end' }]}>
              <View style={[s.modalSheet, { maxHeight: SCREEN_HEIGHT * 0.85 }]}>
                <View style={s.dragPill} />
                <Text style={s.modalTitle}>Adicionar ao livro</Text>
                <Text style={s.modalSubtitle}>Toque para adicionar ou remover do livro</Text>

                {favoritos.length === 0 ? (
                  <View style={s.sheetEmpty}>
                    <Text style={s.sheetEmptyText}>Você não tem receitas favoritas ainda.</Text>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
                    {favPairs.map((pair, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                        {pair.map(item => {
                          const rid    = getReceitaId(item);
                          const inBook = openBook?.recipeIds.includes(rid) ?? false;
                          const cardW  = (SCREEN_WIDTH - 48 - 10) / 2;
                          return (
                            <TouchableOpacity
                              key={getFavId(item)}
                              style={[s.selectCard, { width: cardW }, inBook && s.selectCardActive]}
                              onPress={() => handleAddToBook(rid)}
                              activeOpacity={0.85}
                            >
                              <Image source={{ uri: getImage(item) || PLACEHOLDER }} style={s.selectCardImg} resizeMode="cover" />
                              {inBook && (
                                <View style={s.selectCheck}>
                                  <Ionicons name="checkmark-circle" size={22} color={C.hero} />
                                </View>
                              )}
                              <View style={s.miniCardInfo}>
                                <Text style={s.miniCardName} numberOfLines={2}>{getName(item)}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                        {pair.length === 1 && <View style={{ width: (SCREEN_WIDTH - 48 - 10) / 2 }} />}
                      </View>
                    ))}
                  </ScrollView>
                )}

                <TouchableOpacity style={s.primaryBtn} onPress={() => setAddVisible(false)}>
                  <Text style={s.primaryBtnText}>Concluído</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
      )}

      {/* ════════ MODAL — criar novo livro ════════ */}
      <Modal visible={createVisible} transparent animationType="fade" onRequestClose={() => setCreateVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.dragPill} />
            <Text style={s.modalTitle}>Novo Recipe Book</Text>

            <Text style={s.fieldLabel}>NOME DO LIVRO</Text>
            <TextInput
              style={s.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Ex: Almoço da semana, Doces..."
              placeholderTextColor={C.textMuted}
              autoFocus
              maxLength={30}
            />

            <Text style={[s.fieldLabel, { marginTop: 20 }]}>COR DO LIVRO</Text>
            <View style={s.colorPicker}>
              {BOOK_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[s.colorSwatch, { backgroundColor: color }, newColor === color && s.colorSwatchActive]}
                  onPress={() => setNewColor(color)}
                  activeOpacity={0.8}
                >
                  {newColor === color && <Ionicons name="checkmark" size={16} color={C.white} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.previewRow}>
              <View style={[s.previewBook, { backgroundColor: newColor }]}>
                <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.previewName}>{newName || 'Nome do livro'}</Text>
                <Text style={s.previewSub}>0 receitas</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, (!newName.trim() || saving) && { opacity: 0.45 }]}
              onPress={handleCreateBook}
              disabled={!newName.trim() || saving}
              activeOpacity={0.8}
            >
              {saving
                ? <ActivityIndicator color={C.white} />
                : <><Ionicons name="book" size={18} color={C.white} /><Text style={s.primaryBtnText}>Criar livro</Text></>
              }
            </TouchableOpacity>

            <TouchableOpacity style={s.ghostBtn} onPress={() => setCreateVisible(false)}>
              <Text style={s.ghostBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ════════ MODAL — confirmar exclusão ════════ */}
      <Modal visible={!!deleteTarget} transparent animationType="fade" onRequestClose={() => setDeleteTarget(null)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { alignItems: 'center' }]}>
            <View style={[s.deleteIcon, { backgroundColor: (deleteTarget?.color ?? C.danger) + '22' }]}>
              <Ionicons name="trash-outline" size={30} color={deleteTarget?.color ?? C.danger} />
            </View>
            <Text style={s.modalTitle}>Excluir livro</Text>
            <Text style={[s.modalSubtitle, { textAlign: 'center', marginBottom: 24 }]}>
              "{deleteTarget?.name}" será excluído. As receitas favoritas não serão afetadas.
            </Text>
            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: C.danger, width: '100%' }, saving && { opacity: 0.6 }]}
              onPress={() => deleteTarget && handleDeleteBook(deleteTarget)}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={C.white} />
                : <Text style={s.primaryBtnText}>Excluir livro</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={s.ghostBtn} onPress={() => setDeleteTarget(null)}>
              <Text style={s.ghostBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 4 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 12,
    paddingBottom: 20,
    backgroundColor: C.bg,
  },
  eyebrow:   { fontSize: 10, fontWeight: '700', letterSpacing: 2.5, color: C.textSub, marginBottom: 4 },
  title:     { fontSize: 28, fontWeight: '800', color: C.textPrimary },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.accentSoft, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 0.5, borderColor: C.accentBorder,
  },
  countText: { fontSize: 15, fontWeight: '800', color: C.hero },

  grid:    { gap: 12, alignItems: 'center' },
  gridRow: { flexDirection: 'row', gap: 12 },

  bookCard: { width: BOOK_SIZE },
  bookMeta: { paddingTop: 8, paddingHorizontal: 2 },
  bookName: { fontSize: 13, fontWeight: '700', color: C.textPrimary },
  bookCount:{ fontSize: 11, color: C.textSub, marginTop: 2 },
  colorDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 5 },

  addBookBtn: {
    width: BOOK_SIZE, height: BOOK_SIZE,
    borderRadius: 16, borderWidth: 2,
    borderColor: C.accentBorder, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.accentSoft, gap: 6,
  },
  addBookIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  addBookText: { fontSize: 12, fontWeight: '700', color: C.accent },

  longPressHint: { textAlign: 'center', color: C.textMuted, fontSize: 11, marginTop: 20 },
  emptyHint:     { alignItems: 'center', gap: 8, marginTop: 16 },
  emptyHintText: { color: C.textSub, fontSize: 14, fontWeight: '500' },

  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(61,32,16,0.45)' },

  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: SCREEN_HEIGHT * 0.82,
    backgroundColor: C.bg,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 }, elevation: 20,
  },
  sheetHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: C.accentBorder, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader:   {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 0.5, borderBottomColor: C.accentBorder,
  },
  sheetColorDot: { width: 14, height: 14, borderRadius: 7 },
  sheetTitle:    { fontSize: 18, fontWeight: '800', color: C.textPrimary },
  sheetSubtitle: { fontSize: 12, color: C.textSub, marginTop: 2 },
  sheetAddBtn:   {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.hero, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14,
  },
  sheetAddText:  { color: C.white, fontSize: 13, fontWeight: '700' },
  sheetCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surfaceHi, alignItems: 'center', justifyContent: 'center' },

  sheetEmpty:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 60 },
  sheetEmptyTitle: { fontSize: 18, fontWeight: '700', color: C.textPrimary },
  sheetEmptyText:  { fontSize: 13, color: C.textSub },

  miniCard: {
    backgroundColor: C.surface, borderRadius: 16, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#EDE0D4',
    shadowColor: '#3D2010', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  miniCardImg:    { width: '100%', height: 100, backgroundColor: C.surfaceHi },
  miniRemoveBtn:  {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  miniCardInfo: { padding: 10, gap: 4 },
  miniCardName: { fontSize: 13, fontWeight: '700', color: C.textPrimary, lineHeight: 17 },
  miniTimePill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  miniTimeText: { fontSize: 11, color: C.textSub },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(61,32,16,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalSheet:   { backgroundColor: C.surface, borderRadius: 28, padding: 24 },
  dragPill:     { width: 40, height: 4, borderRadius: 2, backgroundColor: C.surfaceHi, alignSelf: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 20, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  modalSubtitle:{ fontSize: 13, color: C.textSub, marginBottom: 16 },

  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: C.textSub, marginBottom: 10 },
  input: {
    backgroundColor: '#FBF5EF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: C.textPrimary,
    borderWidth: 1, borderColor: C.accentBorder,
  },

  colorPicker:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  colorSwatch:       { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorSwatchActive: { borderWidth: 3, borderColor: C.white, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },

  previewRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.surfaceHi, borderRadius: 16, padding: 14, marginBottom: 20,
  },
  previewBook: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  previewName: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  previewSub:  { fontSize: 12, color: C.textSub, marginTop: 3 },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.hero, paddingVertical: 16, borderRadius: 16, marginTop: 4,
    shadowColor: C.hero, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  primaryBtnText: { color: C.white, fontSize: 16, fontWeight: '800' },
  ghostBtn:       { alignItems: 'center', paddingVertical: 14 },
  ghostBtnText:   { color: C.textSub, fontSize: 15, fontWeight: '600' },

  selectCard:       { backgroundColor: C.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: 'transparent' },
  selectCardActive: { borderColor: C.hero },
  selectCardImg:    { width: '100%', height: 90, backgroundColor: C.surfaceHi },
  selectCheck:      { position: 'absolute', top: 8, right: 8, backgroundColor: C.white, borderRadius: 12 },

  deleteIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
});
