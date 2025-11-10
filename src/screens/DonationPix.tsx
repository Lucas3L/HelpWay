import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  StatusBar, Clipboard, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/DonationPix';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-native-qrcode-svg'; // 1. Importar o gerador de QR Code
import { Donation as Campanha } from '../context/DonationsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DonationPix'>;

const DonationPix: React.FC<Props> = ({ route, navigation }) => {
  const { donationId, donationAmount, donationName } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campanha | null>(null);

  // 2. Buscar os dados da campanha (incluindo a chave pix) ao carregar
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const data = await api.getCampanhaById(Number(donationId));
        setCampaign(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados de pagamento.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaignData();
  }, [donationId]);

  const pixKey = campaign?.chave_pix || ''; // 3. Obter a chave PIX real

  const handleCopyCode = () => {
    Clipboard.setString(pixKey);
    Alert.alert('Código Copiado!', 'A chave PIX foi copiada para sua área de transferência.');
  };

  const handleConfirmDonation = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para registrar uma doação.');
      navigation.navigate('Login');
      return;
    }
    setIsSubmitting(true);
    const parsedAmount = parseFloat(donationAmount);

    try {
      const transacaoData = {
        id_campanha: Number(donationId),
        id_doador: user.id,
        valor: parsedAmount,
        fg_dinheiro: true,
        fg_alimentacao: false,
        fg_vestuario: false,
      };

      await api.registrarDoacao(transacaoData);

      Alert.alert(
        'Doação Registrada!',
        'Muito obrigado pela sua contribuição. Sua ajuda faz a diferença.',
        [{ text: 'OK', onPress: () => navigation.navigate('SearchDonation') }]
      );

    } catch (error: any) {
      console.error('Erro ao confirmar doação:', error);
      Alert.alert('Erro', error.message || 'Não foi possível registrar a doação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedAmount = (parseFloat(donationAmount) || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2D4BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F5FA" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pague com Pix para ajudar</Text>
        <Text style={styles.subtitle}>{donationName}</Text>
        <Text style={styles.amountText}>R$ {formattedAmount}</Text>
        
        <View style={styles.card}>
          {/* 4. Gerar o QR Code real (sem valor embutido) */}
          <QRCode
            value={pixKey}
            size={200}
            logoBackgroundColor="transparent"
          />

          <Text style={styles.instructionsTitle}>Ou use o Copia e Cola</Text>
          <Text style={styles.pixKeyText}>{pixKey}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Ionicons name="copy-outline" size={18} color="#475569" />
            <Text style={styles.copyButtonText}>COPIAR CHAVE PIX</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructionsTitle}>Instruções</Text>
        <Text style={styles.instructionText}>1. Abra o app do seu banco e acesse a área Pix.</Text>
        <Text style={styles.instructionText}>2. Escaneie o QR Code ou use o "Pix Copia e Cola".</Text>
        <Text style={styles.instructionText}>3. **Digite o valor de R$ {formattedAmount}** no app do seu banco.</Text>
        <Text style={styles.instructionText}>4. Após pagar, clique no botão abaixo para confirmar.</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]} 
          onPress={handleConfirmDonation}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>JÁ FIZ O PAGAMENTO</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DonationPix;