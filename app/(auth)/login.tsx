import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../authContext';
 
export default function LoginScreen() {
  const router = useRouter();
  const { login, reativar } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [contaInativa, setContaInativa] = useState(false);
  const [contaBloqueada, setContaBloqueada] = useState(false); // 💡 Novo estado para controle do modal de bloqueio
  const [reativando, setReativando] = useState(false);
  const [confirmarSenha, setConfirmarSenha] = useState('');
 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async () => {
    if (!formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
 
    setLoading(true);
    setError(null);
 
    try {
      const result = await login(formData.email, formData.senha);
 
      if (result.ok) {
        router.replace('/home');
      } else if (result.error === 'CONTA_BLOQUEADA') {
        // 💡 Verificação prioritária disparada antes do status de inatividade comum
        setContaBloqueada(true);
      } else if (result.error === 'CONTA_INATIVA') {
        setContaInativa(true);
      } else if (result.error === 'ACESSO_NEGADO') {
        setError('Apenas usuários podem acessar o app mobile.');
      } else {
        setError(result.error || 'Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao fazer login:', err);
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
 
  const handleReativar = async () => {
    if (confirmarSenha !== formData.senha) {
      setError('As senhas não coincidem.');
      setContaInativa(false);
      return;
    }
    setReativando(true);
    const res = await reativar(formData.email, formData.senha);
    setReativando(false);
    if (res) {
      setContaInativa(false);
      setConfirmarSenha('');
      router.replace('/home');
    } else {
      setError('Email ou senha incorretos.');
      setContaInativa(false);
      setConfirmarSenha('');
    }
  };
 
  return (
    <LinearGradient colors={['#FCEAD2', '#F3A973']} style={styles.container}>
       
      {/* Logotipo Sanremo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/T.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
 
      <Text style={styles.title}>Logar</Text>
 
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.text}> Email </Text>
      <TextInput
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        style={styles.input}
        placeholder="test@exemplo.com"
        placeholderTextColor="#A0A0A0"
        autoCapitalize="none"
      />

      <Text style={styles.text}> Senha </Text>
      <TextInput
        value={formData.senha}
        onChangeText={(value) => handleChange('senha', value)}
        style={styles.input}
        placeholder="12345678"
        placeholderTextColor="#A0A0A0"
        secureTextEntry={!rememberMe}
      />
 
      {/* Remember me & Forgot Password */}
      <View style={styles.rowOptions}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.optionText}>mostrar senha</Text>
        </TouchableOpacity>
 
        <TouchableOpacity onPress={() => Linking.openURL('https://accounts.google.com/signin/recovery')}>
          <Text style={styles.optionText}>esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
 
      {/* Botão de Entrar Principal */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
 
      {/* Divisor "Or Sign in with" */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Ou entre com</Text>
        <View style={styles.line} />
      </View>
 
      {/* Botões Sociais */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>
 
      {/* Link de Cadastro */}
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerContainer}>
        <Text style={styles.link}>Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
      </TouchableOpacity>
 
      {/* 💡 MODAL DE CONTA BLOQUEADA PELO ADMINISTRADOR */}
      <Modal visible={contaBloqueada} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: '#D32F2F' }]}>Acesso Suspenso</Text>
            <Text style={styles.modalDesc}>
              Esta conta foi bloqueada por um administrador do sistema devido à violação dos termos de uso da nossa comunidade.
            </Text>
            
            <TouchableOpacity
              style={[styles.buttonIna, { width: 180, backgroundColor: '#D32F2F' }]}
              onPress={() => setContaBloqueada(false)}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
      {/* Modal conta inativa */}
      <Modal visible={contaInativa} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Conta Inativa</Text>
            <Text style={styles.modalDesc}>Sua conta está inativa. Confirme sua senha para reativá-la.</Text>
            <TextInput
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme sua senha"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              style={[styles.inputIna, { marginBottom: 16 }]}
            />
            <TouchableOpacity
              style={[styles.buttonIna, (reativando || !confirmarSenha) && styles.buttonDisabled]}
              onPress={handleReativar}
              disabled={reativando || !confirmarSenha}
            >
              {reativando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reativar conta</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setContaInativa(false)} style={{ marginTop: 14 }}>
              <Text style={{ color: '#BA531B', fontWeight: '600' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
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
    marginBottom: 30,
    marginTop: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 7,
        color: '#BA531B',
 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#BA531B', // Marrom/Laranja escuro da foto
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
  input: {
    width: 320,
    height: 50,
    backgroundColor: '#FFF2E4', // Fundo off-white/bege clarinho dos inputs
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 15,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIna: {
    width: 200,
    height: 50,
    backgroundColor: '#FFF2E4', // Fundo off-white/bege clarinho dos inputs
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#5C3818',
    marginBottom: 15,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rowOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    marginBottom: 25,
    paddingHorizontal: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#BA531B',
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#BA531B',
  },
  optionText: {
    fontSize: 12,
    color: '#6B401B',
  },
  button: {
    width: 320,
    height: 50,
    backgroundColor: '#BA531B', // Laranja terroso escuro do botão principal
    borderRadius: 20, // Cantos bem arredondados como na foto
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
   buttonIna: {
    width: 150,
    height: 50,
    backgroundColor: '#BA531B', // Laranja terroso escuro do botão principal
    borderRadius: 20, // Cantos bem arredondados como na foto
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
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
  image:{
    width: 20,
    height: 20,
    marginRight: 8,
    },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 320,
    marginBottom: 25,
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
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  registerContainer: {
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
    bottom: 30,
  },
  skipText: {
    fontSize: 13,
    color: '#6B401B',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#BA531B',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#6B401B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});
 
 