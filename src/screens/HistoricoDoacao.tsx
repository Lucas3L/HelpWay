import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RootStackParamList } from '../navigation';
import styles from '../styles/HistoricoDoacoes';
import Input from '../components/Input';
import InputDate from '../components/InputDate';
import { colors } from '../styles';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'HistoricoDoacoes'>;
type HistRouteProp = RouteProp<RootStackParamList, 'HistoricoDoacoes'>;

export type DoacaoFeita = {
  id: string;
  titulo_campanha: string;
  nome_organizador: string;
  donorName?: string;
  valor: number;
  date: string;
};

type DoacaoRecebida = {
  id: string;
  donorName: string;
  valor: number;
  date: string;
};

const formatarDataSegura = (dateString: string | null | undefined): string => {
  if (!dateString) { return 'Data Indefinida'; }
  const data = new Date(dateString);
  if (isNaN(data.getTime())) { return 'Data Inválida'; }
  return data.toLocaleDateString('pt-BR');
};

const formatarDataISO = (dateString: string | null | undefined): string => {
  if (!dateString) { return ''; }
  const data = new Date(dateString);
  if (isNaN(data.getTime())) { return ''; }
  return data.toISOString().split('T')[0];
};

export default function HistoricoDoacoesTela() {
  const navigation = useNavigation<NavProp>();
  const isFocused = useIsFocused();
  const route = useRoute<HistRouteProp>();
  const { user } = useAuth();

  const campaignId = route.params?.campaignId;

  const [historico, setHistorico] = useState<(DoacaoFeita | DoacaoRecebida)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buscaNome, setBuscaNome] = useState('');
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        let data;
        if (user.tp_usuario === 1) { 
          data = await api.getDoacoesFeitasByUserId(user.id);
        } else { 
          if (campaignId) {
            data = await api.getDoacoesRecebidasByCampaignId(campaignId); 
          } else {
            data = await api.getDoacoesRecebidasByUserId(user.id);
          }
        }
        setHistorico(data || []);
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Não foi possível carregar o histórico.');
        setHistorico([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      buscarHistorico();
    }
  }, [isFocused, user, campaignId]);

  const historicoFiltrado = useMemo(() => {
    const nomeLower = buscaNome.toLowerCase();
    
    if (!Array.isArray(historico)) {
      return [];
    }
    
    return historico.filter(item => {
      const dataItemISO = formatarDataISO(item.date);
      if (!dataItemISO) return false; 

      const matchDataDe = !dataDe || dataItemISO >= dataDe;
      const matchDataAte = !dataAte || dataItemISO <= dataAte;

      let nomeDoItem = '';
      if ('donorName' in item) {
        nomeDoItem = (item.donorName || '');
      } else if ('titulo_campanha' in item) {
        nomeDoItem = (item.titulo_campanha || '') + ' ' + (item.nome_organizador || '');
      }
      const matchNome = !buscaNome || nomeDoItem.toLowerCase().includes(nomeLower);

      return matchDataDe && matchDataAte && matchNome;
    });
  }, [buscaNome, dataDe, dataAte, historico]);

  const renderItemDoador = ({ item }: { item: DoacaoFeita }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('CertificadoDoacao', { 
          donationInfo: {
            id: item.id,
            donationName: item.titulo_campanha,
            organizerName: item.nome_organizador,
            donorName: user?.nome,
            valor: item.valor,
            date: item.date
          } 
        })}
    >
      <View style={styles.cardIcon}>
        <Feather name="award" size={24} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo_campanha}</Text>
        <Text style={styles.cardInfo}>
          Para: {item.nome_organizador} | {formatarDataSegura(item.date)}
        </Text>
      </View>
      <View style={styles.cardValue}>
        <Text style={styles.cardAmount}>R$ {(item.valor || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemOrganizador = ({ item }: { item: DoacaoRecebida }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Feather name="user" size={24} color="#555" />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.donorName || 'Doador Anônimo'}</Text>
        <Text style={styles.cardInfo}>
          Data: {formatarDataSegura(item.date)}
        </Text>
      </View>
      <View style={styles.cardValue}>
        <Text style={styles.cardAmount}>+ R$ {(item.valor || 0).toFixed(2)}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titulo}>
          {campaignId ? 'Doações Recebidas' : 'Histórico de Doações'}
        </Text>
        <View style={{ width: 40 }} /> 
      </View>
      
      <View style={styles.filterContainer}>
        <Input
          style={{ marginBottom: 0 }}
          icon="search"
          placeholder={user?.tp_usuario === 1 ? 'Buscar por nome ou data...' : 'Buscar por doador ou data...'}
          value={buscaNome}
          onChangeText={setBuscaNome}
        />
        
        <View style={styles.dateRangeContainer}>
          <InputDate
            style={styles.dateInput}
            icon="calendar"
            placeholder="Data Inicial"
            value={dataDe}
            onChange={setDataDe}
          />
          <InputDate
            style={styles.dateInput}
            icon="calendar"
            placeholder="Data Final"
            value={dataAte}
            onChange={setDataAte}
          />
        </View>
      </View>
      
      <FlatList
        data={historicoFiltrado}
        keyExtractor={(item) => item.id}
        renderItem={user?.tp_usuario === 1 ? renderItemDoador as any : renderItemOrganizador as any}
        ListEmptyComponent={
          <View style={styles.centralizado}>
             <Feather name="inbox" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              {(buscaNome || dataDe || dataAte) ? 'Nenhum resultado encontrado.' : 'Nenhuma doação no seu histórico.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}