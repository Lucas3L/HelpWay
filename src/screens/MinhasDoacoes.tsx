import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Donation } from '../context/DonationsContext';
import styles from '../styles/MinhasDoacoes'; 
import { colors } from '../styles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'MinhasDoacoes'>;

export default function MinhasDoacoesTela() {
  const navigation = useNavigation<NavProp>();
  const isFocused = useIsFocused();
  const { user } = useAuth();

  const [minhasDoacoes, setMinhasDoacoes] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscarMinhasDoacoes = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const doacoesDaApi = await api.getCampanhasByUserId(user.id);
        setMinhasDoacoes(doacoesDaApi);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar suas campanhas.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      buscarMinhasDoacoes();
    }
  }, [isFocused, user]);

  const renderItemCampanha = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      {/* Informações da Campanha */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>
          Meta: R$ {(item.meta_doacoes || 0).toFixed(2)}
        </Text>
        <Text style={styles.cardSubtitle}>
          Arrecadado: R$ {(item.valor_levantado || 0).toFixed(2)}
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditarDoacao', { donationId: item.id })}
        >
          <Feather name="edit-2" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('HistoricoDoacoes', { campaignId: item.id })}
        >
          <Feather name="eye" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Ver Doações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Histórico de Doações</Text>
      <FlatList
        data={minhasDoacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItemCampanha}
        ListEmptyComponent={
          <View style={styles.centralizado}>
            <Text>Você ainda não solicitou nenhuma doação.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}