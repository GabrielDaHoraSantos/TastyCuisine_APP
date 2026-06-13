'use client';
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
 
import { authAPI } from './api';
 
export default function RegisterScreen() {
  const router = useRouter();
  const formatBirthDate = (text: string) => {
    const numbers = text.replace(/\D/g, '');
 
    if (numbers.length <= 2) return numbers;
 
    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
 
    return `${numbers.slice(0, 2)}/${numbers.slice(
      2,
      4
    )}/${numbers.slice(4, 8)}`;
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
    isNaN(year)
  ) {
    return null;
  }
 
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900
  ) {
    return null;
  }
 
  const birth = new Date(year, month - 1, day);
 
  // Verifica se a data realmente existe
  if (
    birth.getDate() !== day ||
    birth.getMonth() !== month - 1 ||
    birth.getFullYear() !== year
  ) {
    return null;
  }
 
  const today = new Date();
 
  let age =
    today.getFullYear() -
    birth.getFullYear();
 
  const monthDiff =
    today.getMonth() -
    birth.getMonth();
 
  if (
    monthDiff < 0 ||
    (monthDiff === 0 &&
      today.getDate() < birth.getDate())
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
  });
 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
 
  const handleRegister = async () => {
    if (
      !formData.nomeCompleto ||
      !formData.nomeUsuario ||
      !birthDate.trim() ||
      !formData.email ||
      !formData.senha
    ) {
      setError('Please fill in all required fields');
      return;
    }
 
    // Calcula idade a partir da data de nascimento
    const idade = calculateAge(birthDate);
 
if (idade === null) {
  setError('Data de nascimento inválida');
  return;
}
 
    if (idade < 14 || idade > 100) {
      setError('You must be between 14 and 100 years old');
      return;
    }
 
    setLoading(true);
    setError(null);
 
    try {
      const response = await authAPI.register({
        nomeCompleto: formData.nomeCompleto.trim(),
        nomeDeUsuario: formData.nomeUsuario.trim(),
        idade,
        gmail: formData.email.trim(),
        senha: formData.senha,
      });
 
      if (!response.data) {
        setError(response.error || 'Could not create your account');
        return;
      }
 
      router.replace('/preferences');
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Erro ao cadastrar:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSkip = async () => {
    // Skip without saving - go directly to preferences or home
    router.replace('/preferences');
  };
 
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  return (
    <LinearGradient colors={['#FCEAD2', '#F3A973']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/T.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
 
      <Text style={styles.title}>Cadastro</Text>
 
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
 
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#A0A0A0"
          value={formData.nomeCompleto}
          onChangeText={(v) => handleChange('nomeCompleto', v)}
        />
 
        <TextInput
          style={styles.input}
          placeholder="Nome de Usuario"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.nomeUsuario}
          onChangeText={(v) => handleChange('nomeUsuario', v)}
        />
 
        <TextInput
  style={styles.input}
  placeholder="Data de nascimento (DD/MM/AAAA)"
  placeholderTextColor="#A0A0A0"
  keyboardType="number-pad"
  maxLength={10}
  value={birthDate}
  onChangeText={(text) =>
    setBirthDate(formatBirthDate(text))
  }
/>
 
 
        <TextInput
          style={styles.input}
          placeholder="test@exemplo.com"
          keyboardType="email-address"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />
 
        <TextInput
          style={styles.input}
          placeholder="12345678"
          secureTextEntry
          placeholderTextColor="#A0A0A0"
          value={formData.senha}
          onChangeText={(v) => handleChange('senha', v)}
        />
 
 
      </View>
 
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign up</Text>}
      </TouchableOpacity>
 
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ou logar com</Text>
        <View style={styles.line} />
      </View>
 
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.image}
            resizeMode="contain"
          />
 
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>
 
      <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLinkContainer}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
 
      <TouchableOpacity onPress={handleSkip} style={styles.skipContainer}>
        <Text style={styles.skipText}>Skip now</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 190,
    height: 62,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#BA531B',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#FFF2E4',
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 10,
    fontSize: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#BA531B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(107, 64, 27, 0.2)',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#6B401B',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  socialButton: {
    flex: 0.47,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  loginLinkContainer: {
    marginBottom: 40,
  },
  link: {
    color: '#6B401B',
    fontSize: 13,
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#BA531B',
  },
  skipContainer: {
    position: 'absolute',
    bottom: 25,
  },
  skipText: {
    fontSize: 13,
    color: '#6B401B',
    fontWeight: '500',
  },
});
 