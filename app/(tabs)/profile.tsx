import { Ionicons } from '@expo/vector-icons';
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
import MenuButton from '../../components/MenuButton';
import SideMenu from '../../components/SideMenu';
import { useAuth } from '../authContext';
import BolinhaqGira from '../../components/BolinhaqGira';

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
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.hero} />

      <MenuButton onPress={() => setDrawerVisible(true)} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO HEADER ── */}
        {/* Troque <View style={s.hero}> por <LinearGradient colors={['#C4703A','#A0522D','#7A3B1E']} style={s.hero}> */}
        <View style={s.hero}>
          {/* Blobs decorativos */}
          <View style={s.blob1} />
          <View style={s.blob2} />
          <View style={s.blob3} />

          <Text style={s.pageLabel}>MEU PERFIL</Text>

          {/* Avatar */}
          <View style={s.avatarRing}>
            <Image source={avatar} style={s.avatarImg} />
            <View style={s.statusDot} />
          </View>

          <Text style={s.heroName}>{user?.nomeCompleto ?? 'Usuário'}</Text>
          <Text style={s.heroHandle}>@{user?.nomeDeUsuario ?? ''}</Text>
          <Text style={s.heroEmail}>{user?.gmail ?? ''}</Text>

          {/* Stats vindos do banco */}
          <View style={s.statsRow}>
            <StatBox
              value={loadingStats ? '…' : String(stats.favoritos)}
              label="Favoritos"
            />
            <View style={s.statsDivider} />
            <StatBox
              value={loadingStats ? '…' : String(stats.avaliacoes)}
              label="Avaliações"
            />
            <View style={s.statsDivider} />
            <StatBox
              value={loadingStats ? '…' : String(stats.comentarios)}
              label="Comentários"
            />
          </View>
        </View>

        {/* ── INFO CHIPS ── */}
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

        {/* Restrições alimentares (se houver) */}
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

        {/* ── ACTIONS ── */}
        <Text style={s.sectionLabel}>CONFIGURAÇÕES</Text>

        <View style={s.card}>
          <ActionRow
            icon="create-outline"
            label="Editar perfil"
            onPress={openEdit}
          />
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

      <SideMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

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
      </Modal>
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
  safeArea:     { flex: 1, backgroundColor: C.hero },   // hero cor no status bar area
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
  avatarRing: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.25,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatarImg:  { width: '100%', height: '100%', borderRadius: 45 },
  statusDot:  {
    position: 'absolute', bottom: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.green, borderWidth: 2.5, borderColor: C.hero,
  },

  heroName:   { color: C.textOnHero, fontSize: 22, fontWeight: '800', marginBottom: 3 },
  heroHandle: { color: C.textOnHeroSub, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  heroEmail:  { color: C.textOnHeroFaint, fontSize: 12, marginBottom: 20 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 18, overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statNum: { color: C.white, fontSize: 22, fontWeight: '800', lineHeight: 26 },
  statLbl: {
    color: 'rgba(255,230,200,0.75)', fontSize: 10,
    fontWeight: '600', letterSpacing: 0.5, marginTop: 2, textTransform: 'uppercase',
  },
  statsDivider: { width: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },

  // Chips
  chipsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 8, marginTop: 20, marginBottom: 4, paddingHorizontal: 20, flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.white,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
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

  // Section
  sectionLabel: {
    color: C.textSub, fontSize: 10, fontWeight: '700',
    letterSpacing: 2.5, marginLeft: 20, marginBottom: 10, marginTop: 20,
  },

  // Card
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
  iconBubble: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel:{ flex: 1, fontSize: 15, fontWeight: '600', color: C.textPrimary },
  divider:    { height: StyleSheet.hairlineWidth, backgroundColor: C.surfaceHi, marginHorizontal: 18 },

  versionText:{ color: C.textMuted, textAlign: 'center', fontSize: 12, marginTop: 32, letterSpacing: 0.5 },

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
  closeBtn: {
    backgroundColor: C.surfaceHi, borderRadius: 10, padding: 6,
  },

  // Fields
  fieldGroup: { marginBottom: 18 },
  fieldLabel: {
    color: C.textSub, fontSize: 12, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 8,
  },
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
  ghostBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  ghostBtnText: { color: C.textSub, fontSize: 15, fontWeight: '600' },

  // Alert modal
  alertSheet: { alignItems: 'center', paddingBottom: 32 },
  alertIcon: {
    backgroundColor: C.dangerSoft, width: 64, height: 64,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, marginTop: 8,
  },
  alertTitle: { color: C.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 10 },
  alertBody: {
    color: C.textSub, fontSize: 14, lineHeight: 22,
    textAlign: 'center', marginBottom: 24, paddingHorizontal: 8,
  },
});
