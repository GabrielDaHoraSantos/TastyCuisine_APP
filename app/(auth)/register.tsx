'use client';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../authContext';

// Paleta de cores (mesma do Perfil)
const C = {
  bg: '#F5EDE3',
  surface: '#FFFFFF',
  hero: '#C4703A',
  accent: '#C4703A',
  accentSoft: '#FFF0E8',
  accentBorder: '#F0C8A0',
  white: '#FFFFFF',
  textPrimary: '#3D2010',
  textSub: '#B8906A',
  textMuted: '#D4B89A',
  textOnHero: '#FFFFFF',
  textOnHeroSub: 'rgba(255,230,200,0.85)',
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');

    if (numbers.length <= 2) return numbers;

    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const calculateAge = (dateString: string) => {
    const parts = dateString.split('/');

    if (parts.length !== 3) return null;

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900
    ) {
      return null;
    }

    const birth = new Date(year, month - 1, day);

    if (
      birth.getDate() !== day ||
      birth.getMonth() !== month - 1 ||
      birth.getFullYear() !== year
    ) {
      return null;
    }

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const [birthDate, setBirthDate] = useState('');

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeUsuario: '',
    idade: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    funcao: 'Usuario',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !formData.nomeCompleto ||
      !formData.nomeUsuario ||
      !birthDate.trim() ||
      !formData.email ||
      !formData.senha ||
      !formData.funcao
    ) {
      setError('Preencha todos os campos.');
      return;
    }

    const idade = calculateAge(birthDate);

    if (idade === null) {
      setError('Data de nascimento inválida.');
      return;
    }

    if (idade < 14 || idade > 100) {
      setError('Você deve ter entre 14 e 100 anos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await register(
        formData.nomeCompleto.trim(),
        formData.nomeUsuario.trim(),
        idade,
        formData.email.trim(),
        formData.senha
      );

      if (!response.ok) {
        setError(response.error || 'Erro ao criar conta.');
        return;
      }

      router.replace('/home');
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: C.hero }}>
    <StatusBar barStyle="light-content" />

    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <LinearGradient
        colors={['#C4703A', '#A95C2C', '#7A3B1E']}
        style={styles.hero}
      >
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />

        <Image
          source={require('../../assets/images/T.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.heroTitle}>Criar Conta</Text>

        <Text style={styles.heroSubtitle}>
          Cadastre-se e descubra milhares de receitas.
        </Text>
      </LinearGradient>

      {/* CARD */}
      <View style={styles.card}>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Nome Completo</Text>

        <TextInput
          style={styles.input}
          placeholder="Gabriel da Hora Santos"
          placeholderTextColor={C.textMuted}
          value={formData.nomeCompleto}
          onChangeText={(v) => handleChange('nomeCompleto', v)}
        />

        <Text style={styles.label}>Nome de Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="gabs"
          placeholderTextColor={C.textMuted}
          autoCapitalize="none"
          value={formData.nomeUsuario}
          onChangeText={(v) => handleChange('nomeUsuario', v)}
        />

        <Text style={styles.label}>Data de Nascimento</Text>

        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={C.textMuted}
          keyboardType="number-pad"
          maxLength={10}
          value={birthDate}
          onChangeText={(text) =>
            setBirthDate(formatBirthDate(text))
          }
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="teste@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={C.textMuted}
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />

        <Text style={styles.label}>Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          placeholderTextColor={C.textMuted}
          value={formData.senha}
          onChangeText={(v) => handleChange('senha', v)}
        />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            loading && { opacity: 0.6 },
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Criar Conta
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>
            ou continue com
          </Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.googleIcon}
          />

          <Text style={styles.googleText}>
            Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.loginLinkContainer}
        >
          <Text style={styles.link}>
            Já possui uma conta?{' '}
            <Text style={styles.linkBold}>
              Entrar
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  hero: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },

  blob1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -70,
    left: -60,
  },

  blob2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: -40,
    top: 40,
  },

  blob3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: 100,
  },

  logo: {
    width: 170,
    height: 70,
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
  },

  heroSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontSize: 15,
    paddingHorizontal: 35,
  },

  card: {
    marginHorizontal: 18,
    marginTop: -35,
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  errorContainer: {
    backgroundColor: '#FDECEC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },

  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontWeight: '600',
  },

  label: {
    color: C.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#F8F2EC',
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 54,
    fontSize: 16,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: '#EFE3D8',
  },

  primaryButton: {
    backgroundColor: C.accent,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5D5C6',
  },

  dividerText: {
    marginHorizontal: 12,
    color: C.textSub,
    fontSize: 13,
  },

  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5D5C6',
    borderRadius: 16,
    height: 54,
    backgroundColor: '#FFF',
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },

  googleText: {
    fontWeight: '600',
    color: C.textPrimary,
    fontSize: 16,
  },

  loginLinkContainer: {
    marginTop: 26,
    alignItems: 'center',
  },

  link: {
    color: C.textSub,
    fontSize: 15,
  },

  linkBold: {
    color: C.accent,
    fontWeight: '700',
  },
});