import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';

WebBrowser.maybeCompleteAuthSession();
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function useLoginViewModel() {
  const navigation = useNavigation<NavigationProps>();
  const { login, setUser } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

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
      Alert.alert('Login realizado com sucesso!');
      navigation.navigate('SearchDonation');
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
           navigation.navigate('SearchDonation');
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
           navigation.navigate('SearchDonation');
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
    handleLoginPress: validarLogin,
    handleGoogleLoginPress: handleGoogleLogin,
    handleGoToRegister: goToRegister,
    handleSendRecovery,
  };
}