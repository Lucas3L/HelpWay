import { useState, useEffect } from 'react';
import { Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function useRegisterViewModel() {
  const navigation = useNavigation<NavProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<'doar' | 'receber'>('doar');
  const [emailErro, setEmailErro] = useState('');
  const [senhaErro, setSenhaErro] = useState('');
  const [tecladoAtivo, setTecladoAtivo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mostrar = Keyboard.addListener('keyboardDidShow', () => setTecladoAtivo(true));
    const esconder = Keyboard.addListener('keyboardDidHide', () => setTecladoAtivo(false));
    return () => {
      mostrar.remove();
      esconder.remove();
    };
  }, []);

  function validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function selecionarImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Atenção', 'Permissão para acessar imagens é necessária.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    });
    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
      setImagemBase64(result.assets[0].base64 ?? null);
    }
  }

  async function handleCadastro() {
    let valido = true;
    if (!validarEmail(email)) {
      setEmailErro('Digite um e-mail válido.');
      valido = false;
    } else {
      setEmailErro('');
    }
    if (senha !== confirmarSenha) {
      setSenhaErro('As senhas não coincidem.');
      valido = false;
    } else if (senha.length < 6) {
      setSenhaErro('A senha deve ter no mínimo 6 caracteres.');
      valido = false;
    } else {
      setSenhaErro('');
    }
    if (!nome || !nascimento || !email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      valido = false;
    }
    if (valido) {
      setIsLoading(true);
      try {
        const userData = {
          img_usuario: imagemBase64 || '',
          nome,
          email,
          senha,
          dt_nascimento: new Date(nascimento).toISOString(),
          tp_usuario: tipoUsuario === 'doar' ? 1 : 2,
        };
        await api.createUser(userData);
        
        const loginResult = await login(email, senha);
        setIsLoading(false); // CORRIGIDO AQUI

        if (loginResult.success) {
            Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
            // A navegação agora é automática pelo AuthContext
        } else {
            Alert.alert('Cadastro Realizado', 'Seu cadastro foi concluído. Por favor, faça o login.');
            navigation.navigate('Login');
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error('Erro ao cadastrar:', error);
        Alert.alert('Erro', error.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
      }
    }
  }

  return {
    navigation,
    email, setEmail,
    senha, setSenha,
    confirmarSenha, setConfirmarSenha,
    nome, setNome,
    nascimento, setNascimento,
    imagemUri,
    tipoUsuario, setTipoUsuario,
    emailErro,
    senhaErro,
    tecladoAtivo,
    isLoading,
    selecionarImagem,
    handleCadastro,
  };
}