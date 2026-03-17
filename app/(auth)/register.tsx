import LGContainer from '../../src/components/LGContainer';

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = () => {
    // Aqui entraria a lógica de salvar no banco de dados futuramente
    // Por enquanto, apenas navegamos para a próxima etapa:
    router.replace('../(onboarding)/preferences');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../../assets/images/TastiLogo.png')} 
        style={styles.logo} 
      />
      
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se à TastyCuisine e descubra novos sabores!</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor="#666" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#666" />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#666" />
        <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry placeholderTextColor="#666" />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/preferences' as any)}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Já tem uma conta? <Text style={styles.linkBold}>Faça Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#F8D775', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  logo: { 
    width: 100, 
    height: 100, 
    marginBottom: 20,
    resizeMode: 'contain'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333',
    marginBottom: 5 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
  },
  input: { 
    width: '100%', 
    height: 55, 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EBC44F'
  },
  button: { 
    width: '100%', 
    height: 55, 
    backgroundColor: '#E74C3C', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  link: { 
    marginTop: 20, 
    color: '#333',
    fontSize: 15
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#E74C3C'
  }
});
