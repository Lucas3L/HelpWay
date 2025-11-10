import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/DonationPay';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Donation as Campanha } from '../context/DonationsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DonationPay'>;

const DonationPay: React.FC<Props> = ({ navigation, route }) => {
  const { campaign } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('25');
  const [donationData, setDonationData] = useState<Campanha | null>(null);
  const [loading, setLoading] = useState(true);

  const suggestedAmounts = ['10', '25', '50'];

  useEffect(() => {
    if (user) {
      setFullName(user.nome);
      setEmail(user.email);
    }

    const fetchDonation = async () => {
      try {
        const data = await api.getCampanhaById(Number(campaign.id));
        setDonationData(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os dados da campanha.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [campaign.id, user]);

  const handleAmountChange = (text: string) => {
    const formattedText = text.replace(/[^0-9,]/g, '');
    setAmount(formattedText);
  };

  const handleDonate = () => {
    const valorNumerico = parseFloat(amount.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico < 5) {
      Alert.alert('Valor inválido', 'A doação mínima é de R$ 5,00.');
      return;
    }

    navigation.navigate('DonationPix', {
      donationId: campaign.id,
      donationAmount: valorNumerico.toString(),
      donationName: donationData?.titulo || '',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F6AF6" />
      </View>
    );
  }

  if (!donationData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F5FA' }}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 40, left: 20 }}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>Dados da campanha indisponíveis.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F5FA' }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingTop: 0, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.logoWrapper}>
                <View style={styles.redLogo}>
                  <Text style={styles.logoSymbol}>♥</Text>
                </View>
                <Text style={styles.organizationName}>{donationData.titulo}</Text>
              </View>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>

          <Text style={styles.campaignSubtitle}>{donationData.subtitulo}</Text>

          <Text style={styles.sectionTitle}>Escolha um valor</Text>
          <View style={styles.suggestionContainer}>
            {suggestedAmounts.map(value => (
                <TouchableOpacity 
                    key={value} 
                    style={[
                        styles.suggestionButton,
                        amount === value && styles.suggestionButtonSelected
                    ]} 
                    onPress={() => setAmount(value)}
                >
                    <Text style={styles.suggestionText}>R$ {value}</Text>
                </TouchableOpacity>
            ))}
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>R$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor="#CBD5E1"
            />
          </View>
          <Text style={styles.minimumDonation}>Doação mínima de R$ 5,00</Text>

          <Text style={styles.sectionTitle}>Seus Dados</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CPF</Text>
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
            <Text style={styles.donateButtonText}>DOAR R$ {amount}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DonationPay;