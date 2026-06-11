
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#F7E4CF', '#637231ff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      {/* Parte escura atrás da imagem */}
      <View style={styles.imageBackground} />

      {/* Imagem */}
      <Image
        source={require('../../assets/images/T.png')}
        style={styles.image}
        resizeMode="cover"
      />


      {/* Logo */}
      <Text style={styles.title}>TastyCuisine</Text>
      <Text style={styles.subtitle}>Todas as receitas à sua mão</Text>

      {/* Botão Login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.loginText}>Logar</Text>
      </TouchableOpacity>

      {/* Botão Cadastro */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={styles.signupText}>Cadastrar-se</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipContainer}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.skipText}>pular</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  /* Parte mais escura atrás */
  imageBackground: {
    position: 'absolute',
    top: -100,
    width: '72%',
    height: 375,
    backgroundColor: '#ffbb6e',
    borderRadius: 28,
  },

  image: {
    top: -100,
    width: '72%',
    height: 255,
    borderRadius: 28,
    marginTop: -40,
  },

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 25,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 20,
    backgroundColor: 'rgb(255, 3, 3)',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#8D4B24',
    width: 6,
    height: 6,
  },

  title: {
    fontSize: 48,
    color: '#9D4F23',
    fontStyle: 'italic',
    fontWeight: '300',
    marginBottom: -6,
  },

  subtitle: {
    fontSize: 11,
    color: '#9D4F23',
    letterSpacing: 1,
    marginBottom: 55,
  },

  loginButton: {
    width: '68%',
    backgroundColor: '#C45E20',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },

  loginText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },

  signupButton: {
    width: '68%',
    backgroundColor: '#FFF5EC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  signupText: {
    color: '#8D4B24',
    fontWeight: '600',
    fontSize: 13,
  },

  skipContainer: {
    position: 'absolute',
    bottom: 28,
  },

  skipText: {
    color: '#FFF',
    fontSize: 11,
    opacity: 0.9,
  },
});