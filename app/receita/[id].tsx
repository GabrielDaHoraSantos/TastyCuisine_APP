import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { receitasAPI } from '../(auth)/api';
import { useTheme } from '../themeContext';

export default function EditarReceitaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nomeReceita: '',
    descricao: '',
    modoPreparo: '',
    ingredientes: '',
    fotoReceita: '',
  });

  useEffect(() => {
    receitasAPI.getById(id as string).then(res => {
      if (res.data) {
        const r = res.data as any;
        setForm({
          nomeReceita: r.nomeReceita ?? '',
          descricao: r.descricao ?? '',
          modoPreparo: r.modoPreparo ?? '',
          ingredientes: r.ingredientes ?? '',
          fotoReceita: r.fotoReceita ?? '',
        });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!form.nomeReceita.trim() || !form.descricao.trim() || !form.modoPreparo.trim()) {
      Alert.alert('Atenção', 'Nome, descrição e modo de preparo são obrigatórios.');
      return;
    }
    setSaving(true);
    const res = await receitasAPI.update(id as string, form);
    setSaving(false);
    if (res.data) {
      Alert.alert('Sucesso', 'Receita atualizada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Erro', res.error ?? 'Não foi possível salvar.');
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 54, paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: theme.text.primary },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    fieldGroup: { marginBottom: 18 },
    label: { fontSize: 13, fontWeight: '600', color: theme.text.secondary, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: theme.background.secondary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: theme.text.primary, backgroundColor: theme.background.secondary },
    textArea: { minHeight: 120, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#BA531B', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#BA531B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Receita</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {[
          { label: 'Nome da receita', key: 'nomeReceita', placeholder: 'Ex: Bolo de cenoura' },
          { label: 'Descrição', key: 'descricao', placeholder: 'Breve descrição...', multiline: true },
          { label: 'Ingredientes', key: 'ingredientes', placeholder: 'Um por linha...', multiline: true },
          { label: 'Modo de preparo', key: 'modoPreparo', placeholder: 'Passo a passo...', multiline: true },
          { label: 'URL da foto', key: 'fotoReceita', placeholder: 'https://...' },
        ].map(field => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={[styles.input, field.multiline && styles.textArea]}
              value={(form as any)[field.key]}
              onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
              placeholder={field.placeholder}
              placeholderTextColor={theme.text.secondary}
              multiline={field.multiline}
              autoCapitalize="sentences"
            />
          </View>
        ))}

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Salvar alterações</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
