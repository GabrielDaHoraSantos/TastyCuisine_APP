import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, Modal,
  SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { usuariosAPI } from '../(auth)/api';
import BolinhaqGira from '../../components/BolinhaqGira';
import BottomNavigation from '../../components/BottomNavigation';
import { useAuth } from '../authContext';


const avatar = require('../../assets/images/profile.png');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userId, login, logout, loading } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nomeCompleto: user?.nomeCompleto ?? '',
    nomeDeUsuario: user?.nomeDeUsuario ?? '',
    idade: String(user?.idade ?? ''),
    gmail: user?.gmail ?? '',
    senha: '',
  });
      

  const openEdit = () => {
    setForm({
      nomeCompleto: user?.nomeCompleto ?? '',
      nomeDeUsuario: user?.nomeDeUsuario ?? '',
      idade: String(user?.idade ?? ''),
      gmail: user?.gmail ?? '',
      senha: '',
    });
    setEditModalVisible(true);
  };
      useEffect(() => {
        if (!userId && !loading) {
          router.push('/login')}
      }, [loading])

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const payload: any = {
      nomeCompleto: form.nomeCompleto,
      nomeDeUsuario: form.nomeDeUsuario,
      idade: parseInt(form.idade, 10),
      gmail: form.gmail,
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
      // mostra erro no modal de edição reaproveitando o estado de erro
      console.error('Erro ao inativar:', res.error);
    }
  };

  return (
    
    loading ? (
              <BolinhaqGira/>
        ) : 
    <SafeAreaView style={styles.safeArea}>
      {loading && 
        <ActivityIndicator color="#ffbb6e" style={{marginTop: 40, flex: 1, justifyContent: 'center', alignItems: 'center' }}/>}
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
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
          </View>}

          <View style={styles.actionsCard}>
            {!loading && <TouchableOpacity style={styles.actionRow} onPress={openEdit} activeOpacity={0.75}>
              <View style={styles.iconSlot}><Ionicons name="create-outline" size={24} color="#2B2B2B" /></View>
              <Text style={styles.rowLabel}>Editar perfil</Text>
              <Ionicons name="arrow-forward" size={20} color="#2B2B2B" />
            </TouchableOpacity>}

            <View style={styles.separator} />

            {!loading && <TouchableOpacity style={styles.actionRow} onPress={() => { logout(); router.replace('/(auth)/login'); }} activeOpacity={0.75}>
              <View style={styles.iconSlot}><Ionicons name="log-out-outline" size={24} color="#BA531B" /></View>
              <Text style={[styles.rowLabel, { color: '#BA531B' }]}>Sair</Text>
              <Ionicons name="arrow-forward" size={20} color="#BA531B" />
            </TouchableOpacity>}

            <View style={styles.separator} />

            {!loading && <TouchableOpacity style={styles.actionRow} onPress={() => setDeleteModalVisible(true)} activeOpacity={0.75}>
              <View style={styles.iconSlot}><Ionicons name="trash-outline" size={24} color="#D32F2F" /></View>
              <Text style={[styles.rowLabel, { color: '#D32F2F' }]}>Inativar conta</Text>
              <Ionicons name="arrow-forward" size={20} color="#D32F2F" />
            </TouchableOpacity>}
          </View>
        </ScrollView>
      </View>
      
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
        {!loading &&<View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: 'Nome completo', key: 'nomeCompleto', placeholder: 'Seu nome completo' },
                { label: 'Nome de usuário', key: 'nomeDeUsuario', placeholder: 'Nome de usuário' },
                { label: 'Idade', key: 'idade', placeholder: 'Sua idade', keyboardType: 'numeric' as const },
                { label: 'Email', key: 'gmail', placeholder: 'Seu email', keyboardType: 'email-address' as const },
                { label: 'Nova senha', key: 'senha', placeholder: 'Deixe em branco para manter', secureTextEntry: true },
              ].map(field => (
                <View key={field.key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={(form as any)[field.key]}
                    onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor="#AAAAAA"
                    keyboardType={field.keyboardType}
                    secureTextEntry={field.secureTextEntry}
                    autoCapitalize="none"
                  />
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Salvar alterações</Text>}
            </TouchableOpacity>
          </View>
        </View>}
      </Modal>
      {!loading && <Modal visible={deleteModalVisible} transparent animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderRadius: 24, padding: 28 }]}>
            <Text style={[styles.modalTitle, { textAlign: 'center', marginBottom: 10 }]}>Inativar conta</Text>
            <Text style={{ color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Tem certeza que deseja inativar sua conta? Você será desconectado.
            </Text>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: '#D32F2F' }, deleting && { opacity: 0.6 }]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Inativar</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 14, alignItems: 'center' }}
              onPress={() => setDeleteModalVisible(false)}
              disabled={deleting}
            >
              <Text style={{ color: '#BA531B', fontWeight: '600', fontSize: 15 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
    
        </View>
      </Modal>}
        <BottomNavigation />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F6F6' },
  screen: { flex: 1, backgroundColor: '#F6F6F6' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 , paddingBottom: 40 },
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
