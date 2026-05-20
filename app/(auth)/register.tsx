'use client';

import { useRouter } from 'expo-router';
import { authAPI } from './api';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Certifique-se de ter instalado: npx expo install expo-linear-gradient

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        nome: formData.username, // Ajuste os parâmetros conforme a sua API espera
        sobrenome: '', 
        email: formData.email,
        senha: formData.senha,
        nome_de_usuario: formData.username
      });

      if (response.data) {
        const { token, user } = response.data as any;
        
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('isLogged', 'true');
        await AsyncStorage.setItem('userId', String(user.id || user.cod_user));
        
        router.replace('/preferences');
      } else {
        setError(response.error || 'Error creating account');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Erro ao registrar:', err);
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
      
      {/* Logotipo Sanremo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/T.png')} // Alinhado ao logo "Sanremo" da imagem
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

      {/* Inputs baseados na nova imagem */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.username}
          onChangeText={(v) => handleChange('username', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address" 
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          placeholderTextColor="#A0A0A0"
          value={formData.senha}
          onChangeText={(v) => handleChange('senha', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password" 
          secureTextEntry 
          placeholderTextColor="#A0A0A0"
          value={formData.confirmarSenha}
          onChangeText={(v) => handleChange('confirmarSenha', v)}
        />
      </View>

      {/* Botão Principal de Cadastro */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      {/* Divisor "Or Sign up with" */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or Sign up with</Text>
        <View style={styles.line} />
      </View>

      {/* Botões Sociais */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Link para voltar ao Login */}
      <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLinkContainer}>
        <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Log in</Text></Text>
      </TouchableOpacity>

      {/* Pular/Skip no final da tela */}
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
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#BA531B', // Marrom terroso característico
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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
    height: 48,
    backgroundColor: '#FFF2E4', // Off-white suave dos inputs
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 12,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#BA531B', // Cor marrom/laranja do botão redondo
    borderRadius: 20, // Cantos bem arredondados (estilo pílula)
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    marginVertical: 20,
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
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    flex: 0.47,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  loginLinkContainer: {
    marginBottom: 50,
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