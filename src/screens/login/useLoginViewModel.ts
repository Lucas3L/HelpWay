import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as LocalAuthentication from 'expo-local-authentication';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

WebBrowser.maybeCompleteAuthSession();
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function useLoginViewModel() {
  const navigation = useNavigation<NavigationProps>();
  // CORREÇÃO: O ViewModel não precisa "ouvir" o 'user', só precisa das FUNÇÕES.
  const { login, setUser, tryBiometricLogin, isBiometricsEnabled } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const hasEnrolled = await LocalAuthentication.isEnrolledAsync();
      setCanUseBiometrics(hasHardware && hasEnrolled && isBiometricsEnabled);
    })();
  }, [isBiometricsEnabled]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'SEU_WEB_CLIENT_ID_DO_GOOGLE_AQUI',
  });

  const validarLogin = async () => {
    if (!loginInput || !senha) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await login(loginInput, senha);
    setIsLoading(false);
    
    if (result.success) {
      // NAVEGAÇÃO MANUAL REMOVIDA (O App.tsx faz isso.)
    } else {
      setError(result.message || 'Erro desconhecido');
    }
  };

  const handleGoogleLogin = async () => {
     try {
       const result = await promptAsync();
       if (result?.type === 'success' && result.authentication?.accessToken) {
         const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
           headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
         });
         const userInfo = await userInfoResponse.json();
        
         try {
           const usuarioExistente = await api.getUserByEmail(userInfo.email);
           setUser(usuarioExistente);
           Alert.alert('Login com Google realizado!');
           // NAVEGAÇÃO MANUAL REMOVIDA
         } catch (e) {
           console.log('Usuário não encontrado, cadastrando com Google...');
           const novoUsuario = {
             nome: userInfo.name,
             email: userInfo.email,
             senha: Math.random().toString(36).slice(-10),
             dt_nascimento: '1990-01-01',
             img_usuario: userInfo.picture,
             tp_usuario: 2, 
           };

           const usuarioCriado = await api.createUser(novoUsuario);
           setUser(usuarioCriado);
           Alert.alert('Bem-vindo!', 'Sua conta foi criada com o Google.');
           // NAVEGAÇÃO MANUAL REMOVIDA
         }
       } else {
           if (result?.type === 'error') throw new Error(result.error?.message);
           if (result?.type === 'cancel') Alert.alert('Aviso', 'Login com Google cancelado.');
       }
     } catch (error: any) {
       Alert.alert('Erro no Login com Google', error.message || 'Não foi possível autenticar.');
       console.error("Erro Google:", error);
     }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    const success = await tryBiometricLogin();
    setIsLoading(false);
    
    if (!success) {
      console.log('Falha na biometria ou credenciais inválidas');
      // NAVEGAÇÃO MANUAL REMOVIDA
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const handleSendRecovery = () => {
    if (!recoveryEmail.includes('@')) {
      Alert.alert('Erro', 'Digite um e-mail válido.');
      return;
    }
    Alert.alert('Recuperação enviada', `Enviamos um e-mail para ${recoveryEmail}.`);
    setModalVisible(false);
    setRecoveryEmail('');
  };

  return {
    loginInput,
    setLoginInput,
    senha,
    setSenha,
    error,
    isLoading,
    modalVisible,
    setModalVisible,
    recoveryEmail,
    setRecoveryEmail,
    googleAuthRequest: request,
    canUseBiometrics,
    handleLoginPress: validarLogin,
    handleGoogleLoginPress: handleGoogleLogin,
    handleBiometricLoginPress: handleBiometricLogin,
    handleGoToRegister: goToRegister,
    handleSendRecovery,
  };
}