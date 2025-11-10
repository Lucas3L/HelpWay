import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import InputText from '../components/InputText';
import Input from '../components/Input';
import { RootStackParamList } from '../navigation';
import { colors } from '../styles';
import styles from '../styles/addDonation';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AddDonation'>;

export default function AddDonationScreen() {
  const navigation = useNavigation<NavProp>();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [need, setNeed] = useState('');
  const [responsible, setResponsible] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [chavePix, setChavePix] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedLocation) {
      setLocation({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      setSelectedLocation(null);
    }
  }, [selectedLocation, setSelectedLocation]);

  function toggleType(type: string) {
    setTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      base64: true,
      allowsEditing: true,
      aspect: [1,1]
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  }

  function handleLocationSelect() {
   navigation.navigate('Map', { isSelectionMode: true });
  }

  async function handleSubmit() {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar uma campanha.');
      navigation.navigate('Login');
      return;
    }

    if (!title || !need || !responsible || !types.length || !description) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    if (types.includes('Dinheiro') && !chavePix) {
      Alert.alert('Atenção', 'Se a doação aceita dinheiro, a chave PIX é obrigatória.');
      return;
    }

    const campaignData = {
      id_organizador: user.id,
      titulo: title,
      subtitulo: responsible,
      descricao: description,
      imagem_base64: imageBase64 || '',
      chave_pix: types.includes('Dinheiro') ? chavePix : null,
      meta_doacoes: Number(need),
      fg_dinheiro: types.includes('Dinheiro'),
      fg_alimentacao: types.includes('Alimentação'),
      fg_vestuario: types.includes('Utensílios/Vestimenta'),
      localizacao: location ? { latitude: location.latitude, longitude: location.longitude } : null,
    };

    try {
      await api.criarCampanha(campaignData);
      Alert.alert('Sucesso!', 'Campanha criada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', error.message || 'Não foi possível criar a campanha.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Solicitar Doação</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.imagePickerText}>Selecionar imagem</Text>
              )}
            </TouchableOpacity>

            <Input
              icon="pen"
              placeholder="Título da Doação"
              value={title}
              onChangeText={setTitle}
            />
            <Input
              icon="money-bill-wave"
              placeholder="Valor Necessario (Meta)"
              keyboardType="numeric"
              value={need}
              onChangeText={setNeed}
            />
            <Input
              icon="user-tie"
              placeholder="Nome do Responsável"
              value={responsible}
              onChangeText={setResponsible}
            />
            <InputText
              icon="file-alt"
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Tipo de doação</Text>
            <View style={styles.typeContainer}>
              {['Dinheiro', 'Alimentação', 'Utensílios/Vestimenta'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    types.includes(type) && styles.typeButtonActive,
                  ]}
                  onPress={() => toggleType(type)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      types.includes(type) && { color: colors.card },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {types.includes('Dinheiro') && (
              <Input
                icon="key"
                placeholder="Chave PIX (Email, CNPJ, Celular, etc.)"
                value={chavePix}
                onChangeText={setChavePix}
                autoCapitalize="none"
              />
            )}

            <TouchableOpacity onPress={handleLocationSelect} style={styles.locationButton}>
              <Text style={styles.locationButtonText}>
                {location ? 'Localização selecionada' : 'Selecionar Localização no Mapa'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Criar Campanha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}