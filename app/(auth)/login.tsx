import LGContainer from '../../src/components/LGContainer';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LGContainer liquidColor="#E74C3C" fillLevel={0.4}>
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
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#E74C3C', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  link: { marginTop: 15 }
});
