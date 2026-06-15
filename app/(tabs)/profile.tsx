import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { usuariosAPI } from '../(auth)/api';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';

// NOTE: Install expo-linear-gradient and replace hero View with:
// import { LinearGradient } from 'expo-linear-gradient';
// <LinearGradient colors={['#C4703A', '#A0522D', '#7A3B1E']} style={s.hero}>

// NOTE: Instale expo-image-picker:
//   npx expo install expo-image-picker

const avatarDefault = require('../../assets/images/profile.png');

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:              '#F5EDE3',
  surface:         '#FFFFFF',
  surfaceHi:       '#F0E6DA',
  hero:            '#C4703A',
  accent:          '#C4703A',
  accentSoft:      '#FFF0E8',
  accentBorder:    '#F0C8A0',
  danger:          '#D94F4F',
  dangerSoft:      '#FFF0F0',
  textPrimary:     '#3D2010',
  textSub:         '#B8906A',
  textMuted:       '#D4B89A',
  textOnHero:      '#FFFFFF',
  textOnHeroSub:   'rgba(255,230,200,0.85)',
  textOnHeroFaint: 'rgba(255,220,180,0.65)',
  white:           '#FFFFFF',
  green:           '#6DB86D',
};

interface UserStats {
  favoritos: number;
  avaliacoes: number;
  comentarios: number;
}

// ─── URL base da API ──────────────────────────────────────────────────────────
// Ajuste conforme o seu ambiente

const API_BASE = 'http://192.168.1.100:8080';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userId, login, logout, loading, favoritos, rating,getComentarios } = useAuth();

  const [editModalVisible,   setEditModalVisible]   = useState(false);
  const [drawerVisible,      setDrawerVisible]      = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [savingPhoto,  setSavingPhoto]  = useState(false);
  const [stats,        setStats]        = useState<UserStats>({ favoritos: 0, avaliacoes: 0, comentarios: 0 });
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

  // Busca stats do usuário
  useEffect(() => {
  if (!userId) return;
  
  async function fetchStats() {
    setLoadingStats(true);
    try {
      const comentarios = await getComentarios(userId!)
      // busca avaliações se tiver endpoint
      setStats({
        favoritos: favoritos.length,
        avaliacoes: 0, // ajusta quando tiver endpoint
        comentarios: comentarios.length,
      });
    } finally {
      setLoadingStats(false);
    }
  }
  fetchStats();
}, [userId, favoritos]);

  // ── Seleciona foto da galeria e envia ao backend ──────────────────────────
  const handlePickPhoto = async () => {
    // 1. Pede permissão

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à sua galeria para trocar a foto de perfil.'
      );
      return;
    }

    // 2. Abre o picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // permite recorte
      allowsEditing: true,   // permite recorte
      aspect: [1, 1],        // recorte quadrado (igual ao avatar circular)
      quality: 0.6,          // reduz tamanho sem perder qualidade visível
      base64: true,          // retorna string base64
    });

    if (result.canceled || !result.assets?.[0]?.base64) return;

    const asset = result.assets[0];
    // Monta o data URI — o backend salva essa string inteira no campo foto_perfil
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const base64String = `data:${mimeType};base64,${asset.base64}`;

    // 3. Envia ao backend: PATCH /usuario/:id/foto
    setSavingPhoto(true);
    try {
      const res = await fetch(`${API_BASE}/usuario/${userId}/foto`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fotoPerfil: base64String }),
      });

      if (!res.ok) throw new Error('Falha ao salvar foto');
  const usuarioAtualizado = await res.json();
  console.log('fotoPerfil recebida:', usuarioAtualizado?.fotoPerfil?.slice(0, 50)); // ✅ aqui
  login(usuarioAtualizado);
     
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a foto. Tente novamente.');
    } finally {
      setSavingPhoto(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

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

  const restricoes = user?.restricoesAlimentares
    ? (user.restricoesAlimentares as string)
        .split(',')
        .map((r: string) => r.trim())
        .filter(Boolean)
    : [];

  // Fonte da imagem: base64 do banco ou asset local padrão
const avatarSource = user?.fotoPerfil
  ? { uri: user.fotoPerfil }
  : { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nomeCompleto ?? 'U')}&background=C4703A&color=fff&size=200` };
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.hero} />



      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO ── */}
        <View style={s.hero}>
          <View style={s.blob1} />
          <View style={s.blob2} />
          <View style={s.blob3} />

          <Text style={s.pageLabel}>MEU PERFIL</Text>

          {/* Avatar clicável */}
          <TouchableOpacity
            style={s.avatarWrap}
            onPress={handlePickPhoto}
            activeOpacity={0.85}
            disabled={savingPhoto}
          >
            <Image source={avatarSource} style={s.avatarImg} />

            {/* Overlay de troca de foto */}
            <View style={s.avatarOverlay}>
              {savingPhoto
                ? <ActivityIndicator color={C.white} size="small" />
                : <Ionicons name="camera" size={20} color={C.white} />}
            </View>

            {/* Ponto de status online */}
            {!savingPhoto && <View style={s.statusDot} />}
          </TouchableOpacity>

          <Text style={s.heroName}>{user?.nomeCompleto ?? 'Usuário'}</Text>
          <Text style={s.heroHandle}>@{user?.nomeDeUsuario ?? ''}</Text>
          <Text style={s.heroEmail}>{user?.gmail ?? ''}</Text>

          {/* Stats */}
          <View style={s.statsRow}>
            <StatBox value={!loadingStats ? String(stats.favoritos) : '…'} label="Favoritos" />
            <View style={s.statsDivider} />
            <StatBox value={!loadingStats ? String(stats.avaliacoes) : '…'} label="Avaliações" />
            <View style={s.statsDivider} />
            <StatBox value={!loadingStats ? String(stats.comentarios) : '…'} label="Comentários" />
          </View>
        </View>

        {/* ── CHIPS ── */}
        <View style={s.chipsRow}>
          {user?.idade ? (
            <View style={s.chip}>
              <View style={[s.chipDot, { backgroundColor: C.accent }]} />
              <Text style={s.chipText}>{user.idade} anos</Text>
            </View>
          ) : null}
          <View style={s.chip}>
            <View style={[s.chipDot, { backgroundColor: C.green }]} />
            <Text style={s.chipText}>Conta ativa</Text>
          </View>
        </View>

        {/* ── RESTRIÇÕES ── */}
        {restricoes.length > 0 && (
          <>
            <Text style={s.sectionLabel}>RESTRIÇÕES ALIMENTARES</Text>
            <View style={s.restricoesWrap}>
              {restricoes.map((r, i) => (
                <View key={i} style={s.restricaoTag}>
                  <Ionicons name="alert-circle-outline" size={13} color={C.accent} />
                  <Text style={s.restricaoText}>{r}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── AÇÕES ── */}
        <Text style={s.sectionLabel}>CONFIGURAÇÕES</Text>

        <View style={s.card}>
          <ActionRow icon="create-outline" label="Editar perfil" onPress={openEdit} />
          <Divider />
          <ActionRow
            icon="log-out-outline"
            label="Sair da conta"
            color={C.accent}
            onPress={() => { logout(); router.replace('/(auth)/login'); }}
          />
          <Divider />
          <ActionRow
            icon="trash-outline"
            label="Inativar conta"
            color={C.danger}
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>

        <Text style={s.versionText}>v1.0.0</Text>

        
      </ScrollView>

     
      {/* ── EDIT MODAL ── */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.dragPill} />

            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={s.closeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color={C.textSub} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 8 }}>
              {([
                { label: 'Nome completo',   key: 'nomeCompleto',  placeholder: 'Seu nome completo' },
                { label: 'Nome de usuário', key: 'nomeDeUsuario', placeholder: 'nome_de_usuario' },
                { label: 'Idade',           key: 'idade',         placeholder: '0', keyboardType: 'numeric' as const },
                { label: 'Email',           key: 'gmail',         placeholder: 'voce@email.com', keyboardType: 'email-address' as const },
                { label: 'Nova senha',      key: 'senha',         placeholder: 'Deixe em branco para manter', secureTextEntry: true },
              ] as const).map(field => (
                <View key={field.key} style={s.fieldGroup}>
                  <Text style={s.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={s.fieldInput}
                    value={(form as any)[field.key]}
                    onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={C.textMuted}
                    keyboardType={(field as any).keyboardType}
                    secureTextEntry={(field as any).secureTextEntry}
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
      </Modal>
      <BottomNavigation />
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statNum}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function ActionRow({
  icon, label, color = C.textPrimary, onPress,
}: {
  icon: string; label: string; color?: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.iconBubble, { backgroundColor: color === C.danger ? C.dangerSoft : C.accentSoft }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={[s.actionLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={color + '66'} />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safeArea:     { flex: 1, backgroundColor: C.hero },
  scroll:       { flex: 1, backgroundColor: C.bg },
  scrollContent:{ paddingBottom: 48 },

  // Hero
  hero: {
    backgroundColor: C.hero,
    paddingTop: Platform.OS === 'android' ? 72 : 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blob1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -70, right: -50,
  },
  blob2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,180,100,0.10)', bottom: -40, left: -30,
  },
  blob3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)', top: 40, left: 70,
  },
  pageLabel: {
    color: 'rgba(255,230,200,0.75)', fontSize: 10, fontWeight: '700',
    letterSpacing: 3, marginBottom: 18,
  },

  // Avatar
  avatarWrap: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.25,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatarImg: {
    width: '100%', height: '100%', borderRadius: 45,
  },
  // Overlay escuro com ícone de câmera que aparece sobre a foto
  avatarOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 32, borderBottomLeftRadius: 45, borderBottomRightRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center', justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.green, borderWidth: 2.5, borderColor: C.hero,
  },

  heroName:   { color: C.textOnHero,      fontSize: 22, fontWeight: '800', marginBottom: 3 },
  heroHandle: { color: C.textOnHeroSub,   fontSize: 14, fontWeight: '600', marginBottom: 2 },
  heroEmail:  { color: C.textOnHeroFaint, fontSize: 12, marginBottom: 20 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 18, overflow: 'hidden',
  },
  statBox:      { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statNum:      { color: C.white, fontSize: 22, fontWeight: '800', lineHeight: 26 },
  statLbl:      { color: 'rgba(255,230,200,0.75)', fontSize: 10, fontWeight: '600', letterSpacing: 0.5, marginTop: 2, textTransform: 'uppercase' },
  statsDivider: { width: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },

  // Chips
  chipsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 8, marginTop: 20, marginBottom: 4,
    paddingHorizontal: 20, flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.white, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 0.5, borderColor: C.accentBorder,
  },
  chipDot:  { width: 7, height: 7, borderRadius: 4 },
  chipText: { color: C.textPrimary, fontSize: 12, fontWeight: '600' },

  // Restrições
  restricoesWrap: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, paddingHorizontal: 16, marginBottom: 4,
  },
  restricaoTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.accentSoft, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 0.5, borderColor: C.accentBorder,
  },
  restricaoText: { color: C.accent, fontSize: 12, fontWeight: '600' },

  // Section label
  sectionLabel: {
    color: C.textSub, fontSize: 10, fontWeight: '700',
    letterSpacing: 2.5, marginLeft: 20, marginBottom: 10, marginTop: 20,
  },

  // Card de ações
  card: {
    backgroundColor: C.surface,
    marginHorizontal: 16, borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#EDE0D4',
    shadowColor: '#8B5028', shadowOpacity: 0.08,
    shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16, gap: 14,
  },
  iconBubble: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: C.textPrimary },
  divider:     { height: StyleSheet.hairlineWidth, backgroundColor: C.surfaceHi, marginHorizontal: 18 },

  versionText: { color: C.textMuted, textAlign: 'center', fontSize: 12, marginTop: 32, letterSpacing: 0.5 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(61,32,16,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: '92%',
  },
  dragPill: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.surfaceHi, alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 22,
  },
  modalTitle: { color: C.textPrimary, fontSize: 20, fontWeight: '800' },
  closeBtn:   { backgroundColor: C.surfaceHi, borderRadius: 10, padding: 6 },

  // Fields
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { color: C.textSub, fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  fieldInput: {
    backgroundColor: '#FBF5EF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: C.textPrimary,
    borderWidth: 1, borderColor: C.accentBorder,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: C.accent,
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: C.accent, shadowOpacity: 0.3,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryBtnText: { color: C.white, fontSize: 16, fontWeight: '800' },
  ghostBtn:       { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  ghostBtnText:   { color: C.textSub, fontSize: 15, fontWeight: '600' },

  // Alert modal
  alertSheet: { alignItems: 'center', paddingBottom: 32 },
  alertIcon: {
    backgroundColor: C.dangerSoft, width: 64, height: 64,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, marginTop: 8,
  },
  alertTitle: { color: C.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 10 },
  alertBody:  {
    color: C.textSub, fontSize: 14, lineHeight: 22,
    textAlign: 'center', marginBottom: 24, paddingHorizontal: 8,
  },
});
