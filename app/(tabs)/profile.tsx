import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, Modal, Platform, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { usuariosAPI } from '../(auth)/api';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';

// NOTE: Install expo-linear-gradient and replace hero View with:
// import { LinearGradient } from 'expo-linear-gradient';
// <LinearGradient colors={['#C4703A', '#A0522D', '#7A3B1E']} style={s.hero}>

const avatar = require('../../assets/images/profile.png');

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#F5EDE3',   // creme aconchegante
  surface:      '#FFFFFF',   // cards brancos
  surfaceHi:    '#F0E6DA',   // separadores / inputs
  hero:         '#C4703A',   // terracota principal
  heroDark:     '#7A3B1E',   // terracota escuro (gradiente)
  heroMid:      '#A0522D',
  accent:       '#C4703A',
  accentSoft:   '#FFF0E8',
  accentBorder: '#F0C8A0',
  danger:       '#D94F4F',
  dangerSoft:   '#FFF0F0',
  textPrimary:  '#3D2010',
  textSub:      '#B8906A',
  textMuted:    '#D4B89A',
  textOnHero:   '#FFFFFF',
  textOnHeroSub:'rgba(255,230,200,0.85)',
  textOnHeroFaint:'rgba(255,220,180,0.65)',
  white:        '#FFFFFF',
  green:        '#6DB86D',
};

// ─── Stats type ───────────────────────────────────────────────────────────────
interface UserStats {
  favoritos: number;
  avaliacoes: number;
  comentarios: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userId, login, logout, loading } = useAuth();
  const [editModalVisible, setEditModalVisible]     = useState(false);
  const [drawerVisible, setDrawerVisible]           = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [stats, setStats] = useState<UserStats>({ favoritos: 0, avaliacoes: 0, comentarios: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [form, setForm] = useState({
    nomeCompleto:  user?.nomeCompleto  ?? '',
    nomeDeUsuario: user?.nomeDeUsuario ?? '',
    idade:         String(user?.idade  ?? ''),
    gmail:         user?.gmail         ?? '',
    senha: '',
  });

  useEffect(() => {
    if (!userId && !loading) router.push('/login');
  }, [loading]);

  // Busca os stats do usuário (favoritos, avaliações, comentários)
  // Adapte as chamadas abaixo para os endpoints reais da sua API
  useEffect(() => {
    if (!userId) return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // TODO: substitua pelos endpoints reais da sua API
        // Exemplo: GET /usuarios/:id/stats retornando { favoritos, avaliacoes, comentarios }
        const res = await fetch(`/usuarios/${userId}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            favoritos:  data.favoritos  ?? 0,
            avaliacoes: data.avaliacoes ?? 0,
            comentarios:data.comentarios ?? 0,
          });
        }
      } catch {
        // silently fail — stats ficam zerados
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [userId]);

  const openEdit = () => {
    setForm({
      nomeCompleto:  user?.nomeCompleto  ?? '',
      nomeDeUsuario: user?.nomeDeUsuario ?? '',
      idade:         String(user?.idade  ?? ''),
      gmail:         user?.gmail         ?? '',
      senha: '',
    });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const payload: any = {
      nomeCompleto:  form.nomeCompleto,
      nomeDeUsuario: form.nomeDeUsuario,
      idade:         parseInt(form.idade, 10),
      gmail:         form.gmail,
    };
    if (form.senha.trim()) payload.senha = form.senha;
    const res = await usuariosAPI.update(userId, payload);
    setSaving(false);
    if (res.data) {
      login(res.data);
      setEditModalVisible(false);
    } else {
      Alert.alert('Erro', res.error ?? 'Não foi possível salvar as alterações.');
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    setDeleting(true);
    const res = await usuariosAPI.inativar(userId);
    setDeleting(false);
    if (!res.error) {
      setDeleteModalVisible(false);
      logout();
      router.replace('/(auth)/login');
    } else {
      setDeleteModalVisible(false);
      console.error('Erro ao inativar:', res.error);
    }
  };

  if (loading) return <BolinhaqGira />;

  const initials = (user?.nomeCompleto ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const restricoes = user?.restricoesAlimentares
    ? (user.restricoesAlimentares as string)
        .split(',')
        .map((r: string) => r.trim())
        .filter(Boolean)
    : [];

  return (
    
    loading ? (
              <BolinhaqGira/>
        ) : 
    <SafeAreaView style={styles.safeArea}>
      {loading && 
        <ActivityIndicator color="#ffbb6e" style={{marginTop: 40, flex: 1, justifyContent: 'center', alignItems: 'center' }}/>}
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      {!loading &&<MenuButton onPress={() => setDrawerVisible(true)} />}
      <View style={styles.screen}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {!loading && <View style={styles.header}>
            <Text style={styles.title}>Perfil</Text>
          </View>}

          {!loading && <View style={styles.profileCard}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={styles.name}>{user?.nomeCompleto ?? 'Usuário'}</Text>
              <Text style={styles.email}>{user?.gmail ?? ''}</Text>
              <Text style={styles.username}>@{user?.nomeDeUsuario ?? ''}</Text>
            </View>
          ) : null}
          <View style={s.chip}>
            <View style={[s.chipDot, { backgroundColor: C.green }]} />
            <Text style={s.chipText}>Conta ativa</Text>
          </View>
        </ScrollView>
      </View>
      
      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
        {!loading &&<View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {[
                { label: 'Nome completo',        key: 'nomeCompleto',  placeholder: 'Seu nome completo' },
                { label: 'Nome de usuário',       key: 'nomeDeUsuario', placeholder: 'nome_de_usuario' },
                { label: 'Idade',                 key: 'idade',         placeholder: '0', keyboardType: 'numeric' as const },
                { label: 'Email',                 key: 'gmail',         placeholder: 'voce@email.com', keyboardType: 'email-address' as const },
                { label: 'Nova senha',            key: 'senha',         placeholder: 'Deixe em branco para manter', secureTextEntry: true },
              ].map(field => (
                <View key={field.key} style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={s.fieldInput}
                    value={(form as any)[field.key]}
                    onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={C.textMuted}
                    keyboardType={field.keyboardType}
                    secureTextEntry={field.secureTextEntry}
                    autoCapitalize="none"
                  />
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[s.primaryBtn, saving && { opacity: 0.55 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={C.white} />
                : <Text style={s.primaryBtnText}>Salvar alterações</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── DELETE MODAL ── */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, s.alertSheet]}>
            <View style={s.alertIcon}>
              <Ionicons name="warning-outline" size={32} color={C.danger} />
            </View>
            <Text style={s.alertTitle}>Inativar conta</Text>
            <Text style={s.alertBody}>
              Tem certeza que deseja inativar sua conta? Você será desconectado e não poderá acessar suas informações.
            </Text>
            <TouchableOpacity
              style={[s.primaryBtn, { backgroundColor: C.danger }, deleting && { opacity: 0.55 }]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? <ActivityIndicator color={C.white} />
                : <Text style={s.primaryBtnText}>Sim, inativar</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={s.ghostBtn}
              onPress={() => setDeleteModalVisible(false)}
              disabled={deleting}
            >
              <Text style={s.ghostBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
    
        </View>
      </Modal>}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F6F6' },
  screen: { flex: 1, backgroundColor: '#F6F6F6' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 64 : 54, paddingBottom: 40 },
  header: { alignItems: 'center', justifyContent: 'center', height: 84 },
  title: { color: '#111111', fontSize: 25, fontWeight: '800' },
  profileCard: { minHeight: 118, borderRadius: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 28, shadowColor: '#D8D8D8', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 3 },
  avatar: { width: 76, height: 76, borderRadius: 38, marginRight: 22, backgroundColor: '#E8E8E8' },
  profileText: { flex: 1 },
  name: { color: '#141414', fontSize: 22, fontWeight: '800' },
  email: { color: '#C3C3C3', fontSize: 15, fontWeight: '600', marginTop: 4 },
  username: { color: '#BA531B', fontSize: 14, fontWeight: '600', marginTop: 2 },
  actionsCard: { borderRadius: 18, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: '#E1E1E1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 14, elevation: 2 },
  actionRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#EFEFEF', marginHorizontal: 18 },
  iconSlot: { width: 36, alignItems: 'center', marginRight: 12 },
  rowLabel: { flex: 1, color: '#232323', fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 6 },
  fieldInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#111', backgroundColor: '#FAFAFA' },
  saveBtn: { backgroundColor: '#BA531B', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
