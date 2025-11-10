import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import Input from '../components/Input';
import InputText from '../components/InputText';
import { RootStackParamList } from '../navigation';
import { api } from '../services/api';
import styles from '../styles/EditarDoacao'; 

type Props = NativeStackScreenProps<RootStackParamList, 'EditarDoacao'>;

export default function EditarDoacaoTela({ route, navigation }: Props) {
  const { donationId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [tipos, setTipos] = useState<string[]>([]);
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [descricao, setDescricao] = useState('');
  
  const [arrecadado, setArrecadado] = useState(0);
  const [meta, setMeta] = useState(0);

  useEffect(() => {
    const buscarDadosDoacao = async () => {
      try {
        const data = await api.getCampanhaById(Number(donationId));
        setTitulo(data.titulo);
        setResponsavel(data.subtitulo);
        setDescricao(data.descricao);
        setArrecadado(data.valor_levantado);
        setMeta(data.meta_doacoes);
        if (data.imagem_base64) {
          setImagemUri(`data:image/jpeg;base64,${data.imagem_base64}`);
        }
        const tiposAtuais = [];
        if (data.fg_dinheiro) tiposAtuais.push('Dinheiro');
        if (data.fg_alimentacao) tiposAtuais.push('Alimentação');
        if (data.fg_vestuario) tiposAtuais.push('Utensílios/Vestimenta');
        setTipos(tiposAtuais);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados da doação.');
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosDoacao();
  }, [donationId]);

  function alternarTipo(type: string) {
    setTipos(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  async function escolherImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
      setImagemBase64(result.assets[0].base64 ?? null);
    }
  }

  async function handleSalvar() {
    if (!titulo || !responsavel || !tipos.length || !descricao) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    // Objeto de dados (aqui estava o provável erro de sintaxe)
    const dadosDoacao: any = {
      titulo: titulo,
      subtitulo: responsavel,
      descricao: descricao,
      fg_dinheiro: tipos.includes('Dinheiro'),
      fg_alimentacao: tipos.includes('Alimentação'),
      fg_vestuario: tipos.includes('Utensílios/Vestimenta'),
    }; // <-- O '}' estava faltando ou havia um erro antes daqui

    if (imagemBase64) {
      dadosDoacao.imagem_base64 = imagemBase64;
    }
    
    try {
      await api.updateCampanha(Number(donationId), dadosDoacao);
      Alert.alert('Sucesso!', 'Doação atualizada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível atualizar a doação.');
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#2D4BFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.titulo}>Editar Doação</Text>
            
            <TouchableOpacity onPress={escolherImagem} style={styles.imagePicker}>
              {imagemUri ? ( <Image source={{ uri: imagemUri }} style={styles.imagePreview} /> ) : ( <Text style={styles.imagePickerText}>Selecionar imagem</Text> )}
            </TouchableOpacity>

            <Input icon="pen" placeholder="Título da Doação" value={titulo} onChangeText={setTitulo} />
            <Input icon="user-tie" placeholder="Nome do Responsável" value={responsavel} onChangeText={setResponsavel} />
            <InputText icon="file-alt" placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
            
            <View style={styles.valuesContainer}>
                <Text style={styles.valueText}>Arrecadado: R$ {arrecadado.toFixed(2)}</Text>
                <Text style={styles.valueText}>Meta: R$ {meta.toFixed(2)}</Text>
            </View>

            <Text style={styles.label}>Tipo de doação</Text>
            <View style={styles.typeContainer}>
              {['Dinheiro', 'Alimentação', 'Utensílios/Vestimenta'].map(type => (
                <TouchableOpacity key={type} style={[styles.typeButton, tipos.includes(type) && styles.typeButtonActive]} onPress={() => alternarTipo(type)}>
                  <Text style={[styles.typeText, tipos.includes(type) && { color: '#fff' }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity onPress={handleSalvar} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}