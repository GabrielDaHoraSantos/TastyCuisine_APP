'use client';

import LGContainer from '../../src/components/LGContainer';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = () => {
    // Aqui entraria a lógica de salvar no banco de dados futuramente
    // Por enquanto, apenas navegamos para a próxima etapa:
    router.replace('/preferences');
  };

  return (
    <LGContainer liquidColor="#FF6347" fillLevel={0.4}>
      <Image
        source={require('../../assets/images/profile.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Junte-se à TastyCuisine e descubra novos sabores!</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Primeiro Nome" placeholderTextColor="#DDD" />
        <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="#DDD" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" placeholderTextColor="#DDD" />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#DDD" />
        <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry placeholderTextColor="#DDD" />


      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/preferences')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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
    borderBlockColor: 'rgba(255, 255, 255, 1)',
    width: '85%',
    height: 55,
    backgroundColor: '#38110aff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,

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
    color: '#FFD700',
    textDecorationLine: 'underline'
  }
});
