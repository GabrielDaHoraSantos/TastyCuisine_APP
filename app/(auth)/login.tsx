'use client';

import LGContainer from '../../src/components/LGContainer';
import { useRouter,  } from 'expo-router';
import { usuariosAPI } from './api';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, TextInputChangeEvent } from 'react-native';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const router = useRouter();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_de_usuario: '',
    senha: ''
  });

  const [error, setError] = useState <string | null>(null);
  const [loading, setLoading] = useState (false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

  try {
      if (true) {
        // Login de usuário comum
        const response = await usuariosAPI.getAll();
        if (response.data) {
          const usuarios = response.data as any[];
          const user = usuarios.find((u: any) =>
            u.nome_de_usuario === formData.nome_de_usuario && u.senha === formData.senha
          );
 
          if (user) {
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('userId', user.cod_user || user.codUser);
            localStorage.setItem('userType', 'usuario');
            localStorage.setItem('userName', user.nome_de_usuario);
            localStorage.setItem('userEmail', user.gmail);
            navigate('/home');
          } else {
            setError('Usuário ou senha incorretos');
          }
        } else {
          setError('Erro ao conectar com o servidor');
        }
      } 
    } catch (error) {
      setError('Erro ao fazer login: ' + (error instanceof Error ? error.message : 'Desconhecido'));
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
       
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


      <TextInput 
      value={formData.nome_de_usuario}
       onChangeText={(value) => handleChange('nome_de_usuario', value)}
        style={styles.input}
         placeholder="Usuario" />

      <TextInput 
      value={formData.nome_de_usuario} 
       onChangeText={(value) => handleChange('senha', value)}
        style={styles.input} 
        placeholder="Senha" secureTextEntry />


      <TouchableOpacity onPress={() => router.push('/home')} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
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
}

)};
