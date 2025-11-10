import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, KeyboardAvoidingView, Platform,
  StatusBar, TouchableOpacity, Modal, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';

import SearchBar from '../components/SearchBar';
import FilterButton from '../components/FilterButton';
import SegmentControl from '../components/SegmentControl';
import DonationCard from '../components/DonationCard';
import TabBar from '../components/TabBar';

import { styles } from '../styles/searchDonation';
import { RootStackParamList } from '../navigation';
import { api } from '../services/api';
import { Donation as Campanha } from '../context/DonationsContext'; 

type NavProp = NativeStackNavigationProp<RootStackParamList, 'SearchDonation'>;
type FilterType = 'REGIONAL' | 'NACIONAL' | 'MUNDIAL';

type CardDataType = {
  id: string;
  title: string;
  subtitle?: string;
  raised: number;
  goal: number;
  imageUri: string;
  types: string[];
  apiData: Campanha; 
};

export default function SearchDonationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const isFocused = useIsFocused();

  const [allCampaigns, setAllCampaigns] = useState<Campanha[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('MUNDIAL');
  const [modalVisible, setModalVisible] = useState(false);

  const [distanceFilter, setDistanceFilter] = useState(5000);
  const [sliderMaximumValue, setSliderMaximumValue] = useState(5000);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const donationTypes = ['Dinheiro', 'Alimentação', 'Utensílio'];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation(location.coords);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const campaignsFromApi = await api.getCampanhas(); 
        
        // --- CORREÇÃO APLICADA AQUI ---
        // Trata meta_doacoes e valor_levantado nulos como 0
        const activeCampaigns = campaignsFromApi.filter(
          (c: Campanha) => (c.meta_doacoes || 0) > (c.valor_levantado || 0)
        );
        
        setAllCampaigns(activeCampaigns);
      } catch (error: any) {
        Alert.alert('Erro', 'Não foi possível carregar as campanhas.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchCampaigns();
    }
  }, [isFocused]);

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (allCampaigns.length > 0 && userLocation) {
      const distances = allCampaigns
        .filter(c => c.localizacao && c.localizacao.latitude !== 0)
        .map(c => getDistanceKm(userLocation.latitude, userLocation.longitude, c.localizacao!.latitude, c.localizacao!.longitude));

      if (distances.length > 0) {
        const furthestDonation = Math.max(...distances);
        const newMax = Math.ceil(furthestDonation / 100) * 100;
        const finalMax = newMax > 50 ? newMax : 50;
        setSliderMaximumValue(finalMax);
        setDistanceFilter(finalMax);
      }
    }
  }, [allCampaigns, userLocation]);

  const handleFilterChange = (value: FilterType) => {
    setActiveFilter(value);
    if (value === 'REGIONAL') setDistanceFilter(50);
    else if (value === 'NACIONAL') setDistanceFilter(2000);
    else if (value === 'MUNDIAL') setDistanceFilter(sliderMaximumValue);
  };

  const filteredCampaigns = useMemo((): CardDataType[] => {
    return allCampaigns
      .map((campaign) => {
        const types = [
          campaign.fg_dinheiro && 'Dinheiro',
          campaign.fg_alimentacao && 'Alimentação',
          campaign.fg_vestuario && 'Utensílio',
        ].filter(Boolean) as string[];
        
        return {
          id: campaign.id,
          title: campaign.titulo,
          subtitle: campaign.subtitulo,
          raised: campaign.valor_levantado,
          goal: campaign.meta_doacoes,
          imageUri: campaign.imagem_base64,
          types: types,
          apiData: campaign,
        };
      })
      .filter((campaign) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          campaign.title.toLowerCase().includes(searchLower) ||
          (campaign.subtitle?.toLowerCase() ?? '').includes(searchLower);

        const distance =
          userLocation && campaign.apiData.localizacao?.latitude !== 0
            ? getDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                campaign.apiData.localizacao!.latitude,
                campaign.apiData.localizacao!.longitude
              )
            : Infinity;

        const withinDistance = distance <= distanceFilter;

        const matchesType =
          selectedTypes.length === 0 ||
          selectedTypes.some((type) => campaign.types.includes(type));

        return matchesSearch && withinDistance && matchesType;
      });
  }, [allCampaigns, search, distanceFilter, selectedTypes, userLocation]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.searchRow}>
          <SearchBar value={search} onChangeText={setSearch} />
          <FilterButton onPress={() => setModalVisible(true)} />
        </View>

        <SegmentControl
          options={['REGIONAL', 'NACIONAL', 'MUNDIAL']}
          selected={activeFilter}
          onSelect={(value) => handleFilterChange(value as FilterType)}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#4F6AF6" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={filteredCampaigns}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('DonationDetail', { 
                donation: item.apiData
                })}>
                <DonationCard
                  imageUri={item.imageUri ? `data:image/jpeg;base64,${item.imageUri}` : ''}
                  title={item.title}
                  subtitle={item.subtitle}
                  raised={item.raised}
                  goal={item.goal}
                  types={item.types}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>Nenhuma campanha encontrada para os filtros.</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>

      <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
        <TabBar
          tabs={[
            { icon: 'search', label: 'DESCUBRA', onPress: () => { } },
            { icon: 'map-pin', label: 'MAPA', onPress: () => navigation.navigate('Map' as never) },
            { icon: 'user', label: 'CONTA', onPress: () => navigation.navigate('Conta') },
          ]}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Filtrar por Distância</Text>
            <Slider
              minimumValue={0}
              maximumValue={sliderMaximumValue}
              value={distanceFilter}
              onValueChange={setDistanceFilter}
              step={50}
              style={styles.slider}
              minimumTrackTintColor="#4F6AF6"
              maximumTrackTintColor="#CBD5E1"
              thumbTintColor="#4F6AF6"
            />
            <Text style={styles.distanceLabel}>Até {Math.round(distanceFilter)} km</Text>

            <Text style={styles.modalTitle}>Tipo de Doação</Text>
            <View style={styles.typeContainer}>
              {donationTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() =>
                    setSelectedTypes((prev) =>
                      prev.includes(type)
                        ? prev.filter((t) => t !== type)
                        : [...prev, type]
                    )
                  }
                  style={[
                    styles.typeButton,
                    selectedTypes.includes(type) && styles.typeButtonSelected,
                  ]}
                >
                  <Text style={[styles.typeButtonText, selectedTypes.includes(type) && styles.typeButtonTextSelected]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}