import { useState, useEffect } from 'react';
import { Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../../navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AlterarDados'>;

export default function useAlterarDadosViewModel() {
  const navigation = useNavigation<NavProp>();
  const { user, passwordAuth, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      Alert.alert("Sessão Inválida", "Por favor, faça o login para acessar esta tela.");
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const [email, setEmail] = useState(user?.email || '');
  const [nome, setNome] = useState(user?.nome || '');
  const [nascimento, setNascimento] = useState(
    user?.dt_nascimento ? new Date(user.dt_nascimento).toISOString().split('T')[0] : ''
  );
  const [imagemUri, setImagemUri] = useState<string | null>(
    user?.img_usuario ? `data:image/jpeg;base64,${user.img_usuario}` : null
  );
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<'doar' | 'receber'>(
    user?.tp_usuario === 1 ? 'doar' : 'receber'
  );
  const [tecladoAtivo, setTecladoAtivo] = useState(false);
  const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);
  const [senhaAtualParaTroca, setSenhaAtualParaTroca] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setTecladoAtivo(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setTecladoAtivo(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  async function selecionarImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Atenção', 'Permissão para acessar a galeria de imagens é necessária.');
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

  async function handleSalvar() {
    if (!user) return;
    setIsLoading(true);

    let senhaParaValidacao = '';
    if (mostrarCamposSenha) {
      if (!senhaAtualParaTroca) {
        Alert.alert('Atenção', 'Para trocar a senha, você precisa digitar sua senha atual.');
        setIsLoading(false);
        return;
      }
      if (novaSenha.length < 6) {
        setErroSenha('A nova senha precisa ter no mínimo 6 caracteres.');
        setIsLoading(false);
        return;
      }
      if (novaSenha !== confirmarNovaSenha) {
        setErroSenha('As novas senhas não coincidem.');
        setIsLoading(false);
        return;
      }
      senhaParaValidacao = senhaAtualParaTroca;
    } else {
      senhaParaValidacao = passwordAuth || '';
    }
    
    if (!senhaParaValidacao) {
      Alert.alert('Erro de Autenticação', 'Sua sessão é inválida. Por favor, faça o login novamente.');
      setIsLoading(false);
      return;
    }
    setErroSenha('');
    
    const dadosParaAtualizar: any = {
      nome,
      email,
      dt_nascimento: new Date(nascimento).toISOString(),
      tp_usuario: tipoUsuario === 'doar' ? 1 : 2,
      senha_atual: senhaParaValidacao,
    };

    if (imagemBase64) {
      dadosParaAtualizar.img_usuario = imagemBase64;
    }
    if (mostrarCamposSenha && novaSenha) {
      dadosParaAtualizar.nova_senha = novaSenha;
    }

    try {
      await api.updateUser(user.id, dadosParaAtualizar);
      
      const finalUserObject = {
          ...user, 
          nome,
          email,
          dt_nascimento: dadosParaAtualizar.dt_nascimento,
          tp_usuario: dadosParaAtualizar.tp_usuario,
          img_usuario: imagemBase64 ?? user.img_usuario,
      };
      setUser(finalUserObject);
      
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao atualizar dados:', error);
      Alert.alert('Erro', error.message || 'Não foi possível atualizar os dados.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    user,
    navigation,
    email, setEmail,
    nome, setNome,
    nascimento, setNascimento,
    imagemUri,
    imagemBase64,
    tipoUsuario, setTipoUsuario,
    tecladoAtivo,
    mostrarCamposSenha, setMostrarCamposSenha,
    senhaAtualParaTroca, setSenhaAtualParaTroca,
    novaSenha, setNovaSenha,
    confirmarNovaSenha, setConfirmarNovaSenha,
    erroSenha,
    isLoading,
    selecionarImagem,
    handleSalvar,
  };
}