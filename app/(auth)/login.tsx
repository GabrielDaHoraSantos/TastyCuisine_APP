import LGContainer from '../../src/components/LGContainer';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LGContainer liquidColor="#FF6347" fillLevel={0.4}>
      <Image source={require('../../assets/images/TastiLogo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
      <TouchableOpacity onPress={() => router.push('/home')} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
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
    backgroundColor: '#38110aff',
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
    textDecorationLine: 'underline',
    fontSize: 16
  },
});
