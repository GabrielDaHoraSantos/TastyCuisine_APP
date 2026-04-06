'use client';

import LGContainer from '../../src/components/LGContainer';
import { useRouter } from 'expo-router';
import { authAPI } from './api';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validações básicas
    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Por favor, preencha os campos obrigatórios');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        senha: formData.senha,
        nome_de_usuario: formData.email.split('@')[0] // Exemplo de geração de username
      });

      if (response.data) {
        const { token, user } = response.data as any;
        
        // Salvar dados e token
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('isLogged', 'true');
        await AsyncStorage.setItem('userId', String(user.id || user.cod_user));
        
        // Navegar para preferências após registro bem-sucedido
        router.replace('/preferences');
      } else {
        setError(response.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
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
    <LGContainer liquidColor="#f5913fff" fillLevel={0.6}>
      <Image
        source={require('../../assets/images/profile.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se à TastyCuisine e descubra novos sabores!</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Primeiro Nome" 
          placeholderTextColor="#DDD"
          value={formData.nome}
          onChangeText={(v) => handleChange('nome', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Sobrenome" 
          placeholderTextColor="#DDD"
          value={formData.sobrenome}
          onChangeText={(v) => handleChange('sobrenome', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address" 
          placeholderTextColor="#DDD"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Senha" 
          secureTextEntry 
          placeholderTextColor="#DDD"
          value={formData.senha}
          onChangeText={(v) => handleChange('senha', v)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirmar Senha" 
          secureTextEntry 
          placeholderTextColor="#DDD"
          value={formData.confirmarSenha}
          onChangeText={(v) => handleChange('confirmarSenha', v)}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Já tem uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
      </TouchableOpacity>
    </LGContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius: 77,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#EEE',
    marginBottom: 30,
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: '85%',
  },
  errorText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    width: '85%',
  },
  input: {
    width: '100%',
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
    width: '85%',
    height: 55,
    backgroundColor: '#f7b773ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18
  },
  link: {
    marginTop: 20,
    color: '#FFF',
    fontSize: 15
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#86dfe5ff',
    textDecorationLine: 'underline'
  }
});
