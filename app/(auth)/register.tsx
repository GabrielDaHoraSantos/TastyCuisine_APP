'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { authAPI } from './api';

export default function RegisterScreen() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBirthDate(selectedDate);
    } 
  };

  const getDateString = () => {
    if (birthDate) {
      return birthDate.toLocaleDateString('pt-BR');
    }
    return '';
  };


  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeUsuario: '',
    idade: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !formData.nomeCompleto ||
      !formData.nomeUsuario ||
      !birthDate ||
      !formData.email ||
      !formData.senha 
    ) {
      setError('Please fill in all required fields');
      return;
    }

    // Calcula idade a partir da data de nascimento
    const today = new Date();
    let idade = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      idade--;
    }

    if (idade < 14 || idade > 100) {
      setError('You must be between 14 and 100 years old');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        nomeCompleto: formData.nomeCompleto.trim(),
        nomeDeUsuario: formData.nomeUsuario.trim(),
        idade,
        gmail: formData.email.trim(),
        senha: formData.senha,
      });

      if (!response.data) {
        setError(response.error || 'Could not create your account');
        return;
      }

      router.replace('/preferences');
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Erro ao cadastrar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Skip without saving - go directly to preferences or home
    router.replace('/preferences');
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <LinearGradient colors={['#FCEAD2', '#F3A973']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/T.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Cadastro</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#A0A0A0"
          value={formData.nomeCompleto}
          onChangeText={(v) => handleChange('nomeCompleto', v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome de Usuario"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.nomeUsuario}
          onChangeText={(v) => handleChange('nomeUsuario', v)}
        />

            <View style={styles.dateInputWrapper}>
            <TextInput
            style={styles.dateInput}
            placeholder="xx/xx/xxxx"
            placeholderTextColor="#A0A0A0"
            value={getDateString()}
            editable={false}
  />

           <TouchableOpacity
  style={styles.calendarButton}
 onPress={() => {
  console.log(showDatePicker);
  setShowDatePicker(true);
}}
>
  <Ionicons name="calendar-outline" size={22} color="#BA531B" />
</TouchableOpacity>
            </View>

        {showDatePicker && (
  <View>
    <Text>TESTE</Text>

    <DateTimePicker
      value={birthDate || new Date()}
      mode="date"
display="calendar"      onChange={handleDateChange}
    />
  </View>
)}

       
        <TextInput
          style={styles.input}
          placeholder="test@exemplo.com"
          keyboardType="email-address"
          placeholderTextColor="#A0A0A0"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />

        <TextInput
          style={styles.input}
          placeholder="12345678"
          secureTextEntry
          placeholderTextColor="#A0A0A0"
          value={formData.senha}
          onChangeText={(v) => handleChange('senha', v)}
        />


      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ou logar com</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLinkContainer}>
        <Text style={styles.link}>
          Já tem uma conta? <Text style={styles.linkBold}>Logar</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/home')} style={styles.skipContainer}>
        <Text style={styles.skipText}>pular</Text>
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
    marginBottom: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 190,
    height: 62,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#BA531B',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
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
    height: 44,
    backgroundColor: '#FFF2E4',
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 10,
    fontSize: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#BA531B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
    marginBottom: 16,
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
    marginBottom: 40,
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
  dateInputWrapper: {
  width: '100%',
  height: 44,
  backgroundColor: '#FFF2E4',
  borderRadius: 10,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  paddingLeft: 20,
},

dateInput: {
  flex: 1,
  height: '100%',
  color: '#5C3818',
  fontSize: 15,
},

calendarButton: {
  width: 50,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

calendarIcon: {
  fontSize: 22,
},

});