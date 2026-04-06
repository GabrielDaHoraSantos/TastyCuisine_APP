'use client';

import LGContainer from '../../src/components/LGContainer';
import { useRouter } from 'expo-router';
import { authAPI } from './api';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome_de_usuario: '',
    senha: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.nome_de_usuario || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(formData);
      
      if (response.data) {
        const { token, user } = response.data as any;
        
        // Salvar dados de forma segura para mobile
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('isLogged', 'true');
        await AsyncStorage.setItem('userId', String(user.id || user.cod_user));
        await AsyncStorage.setItem('userName', user.nome_de_usuario);
        
        router.replace('/home');
      } else {
        setError(response.error || 'Usuário ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao fazer login:', err);
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
    <LGContainer liquidColor="#f5913fff" fillLevel={0.6}>
      <Image source={require('../../assets/images/T.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput 
        value={formData.nome_de_usuario}
        onChangeText={(value) => handleChange('nome_de_usuario', value)}
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#DDD"
        autoCapitalize="none"
      />

      <TextInput 
        value={formData.senha} 
        onChangeText={(value) => handleChange('senha', value)}
        style={styles.input} 
        placeholder="Senha" 
        placeholderTextColor="#DDD"
        secureTextEntry 
      />

      <TouchableOpacity 
        onPress={handleSubmit} 
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </LGContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 77,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
  },
  errorText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    color: '#FFF',
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  button: {
    width: '80%',
    height: 55,
    marginTop: 10,
    backgroundColor: '#f7b773ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  link: {
    marginTop: 20,
    color: '#FFF',
    fontSize: 16
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#86dfe5ff',
    textDecorationLine: 'underline'
  }
});
