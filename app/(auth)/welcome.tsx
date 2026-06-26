import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const C = {
  bg: '#F5EDE3',
  surface: '#FFFFFF',
  hero: '#C4703A',
  accent: '#C4703A',
  accentSoft: '#FFF0E8',
  accentBorder: '#F0C8A0',
  textPrimary: '#3D2010',
  textSub: '#B8906A',
  white: '#FFFFFF',
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <LinearGradient
        colors={['#C4703A', '#A0522D', '#7A3B1E']}
        style={styles.hero}
      >
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />

        <Image
          source={require('../../assets/images/T.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* CARD */}
      <View style={styles.card}>

        <Text style={styles.label}>
          BEM-VINDO
        </Text>

        <Text style={styles.title}>
          TastyCuisine
        </Text>

        <Text style={styles.subtitle}>
          Todas as receitas na palma da sua mão.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginText}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          activeOpacity={0.8}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.signupText}>
            Criar Conta
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  hero: {
    height: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },

  blob1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    right: -40,
  },

  blob2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,180,100,0.12)',
    bottom: -50,
    left: -30,
  },

  blob3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 70,
    left: 50,
  },

  image: {
    width: 270,
    height: 270,
    borderRadius: 30,

    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 12,
  },

  card: {
    flex: 1,
    marginTop: -35,
    backgroundColor: C.surface,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 35,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: -4,
    },

    elevation: 10,
  },

  label: {
    color: C.textSub,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: C.textSub,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 45,
    paddingHorizontal: 10,
  },

  loginButton: {
    width: '100%',
    backgroundColor: C.accent,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  loginText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 16,
  },

  signupButton: {
    width: '100%',
    marginTop: 18,
    backgroundColor: C.accentSoft,
    borderWidth: 1,
    borderColor: C.accentBorder,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
  },

  signupText: {
    color: C.accent,
    fontWeight: '700',
    fontSize: 16,
  },
});