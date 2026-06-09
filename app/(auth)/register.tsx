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
  View,
} from 'react-native';

import { authAPI } from './api';

export default function RegisterScreen() {
  const router = useRouter();

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
      !formData.idade ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmarSenha
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('Passwords do not match');
      return;
    }

    const idade = Number(formData.idade);
    if (!Number.isInteger(idade) || idade < 14 || idade > 100) {
      setError('idade must be between 14 and 100');
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

      const user = response.data as any;
      await AsyncStorage.setItem('userToken', `usuario-${user.codUser}`);
      await AsyncStorage.setItem('isLogged', 'true');
      await AsyncStorage.setItem('userId', String(user.codUser));
      await AsyncStorage.setItem('nomeUsuario', user.nomeCompleto || user.nomeDeUsuario);
      await AsyncStorage.setItem('userEmail', user.gmail);

      router.replace('/preferences');
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Erro ao cadastrar:', err);
    } finally {
      setLoading(false);
    }
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

      <Text style={styles.title}>Sign up</Text>

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
          placeholder="idade"
          keyboardType="number-pad"
          placeholderTextColor="#A0A0A0"
          value={formData.idade}
          onChangeText={(v) => handleChange('idade', v)}
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

        <TextInput
          style={styles.input}
          placeholder="12345678"
          secureTextEntry
          placeholderTextColor="#A0A0A0"
          value={formData.confirmarSenha}
          onChangeText={(v) => handleChange('confirmarSenha', v)}
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
        <Text style={styles.dividerText}>Or Sign up with</Text>
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

      <TouchableOpacity onPress={() => router.push('/home')} style={styles.skipContainer}>
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
