// app/(auth)/register.tsx

'use client';

import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    // validação básica frontend
    if (
      !formData.username ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmarSenha
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('Passwords do not match');
      return;
    }

    setError(null);

    // redireciona direto para preferences
    router.replace('/preferences');
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <LinearGradient
      colors={['#FCEAD2', '#F3A973']}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/T.png')}
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

      {/* Inputs */}
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

      {/* Botão cadastro */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or Sign up with</Text>
        <View style={styles.line} />
      </View>

      {/* Google */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.socialButtonText}>
            Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login */}
      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={styles.loginLinkContainer}
      >
        <Text style={styles.link}>
          Already have an account?{' '}
          <Text style={styles.linkBold}>
            Log in
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity
        onPress={() => router.push('/home')}
        style={styles.skipContainer}
      >
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
    color: '#BA531B',
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
    backgroundColor: '#FFF2E4',
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#BA531B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
    justifyContent: 'center',
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },

  image: {
    width: 20,
    height: 20,
    marginRight: 8,
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