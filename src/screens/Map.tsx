import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Region, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '../components/TabBar';
import { styles } from '../styles/map';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { LocationObjectCoords } from 'expo-location';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { Donation as Campanha } from '../context/DonationsContext'; // Importa o tipo Campanha

// O tipo de dado que o mapa vai usar
type CampanhaNoMapa = {
  id: string;
  titulo: string;
  localizacao: { latitude: number; longitude: number };
  distance?: string;
};

const getDistanceFromLatLonInKm = (
  lat1: number, lon1: number, lat2: number, lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Map() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Map'>>();
  const insets = useSafeAreaInsets();

  const { setSelectedLocation } = useLocation();
  const isSelectionMode = route.params?.isSelectionMode;
  const [selectedPin, setSelectedPin] = useState<LocationObjectCoords | null>(null);

  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [apiCampaigns, setApiCampaigns] = useState<CampanhaNoMapa[]>([]);
  const [campaignsWithDistance, setCampaignsWithDistance] = useState<CampanhaNoMapa[]>([]);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [activeRouteDonationId, setActiveRouteDonationId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da permissão para acessar sua localização.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(loc.coords);
      setRegion(coords);
    })();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // 1. CHAMA A NOVA FUNÇÃO DA API
        const dataFromApi = await api.getCampanhas();
        
        // 2. Filtra apenas as que têm localização
        const campaignsWithLocation = dataFromApi.filter((c: Campanha) => c.localizacao);
        
        // 3. Formata para o tipo que o mapa espera
        const formattedData: CampanhaNoMapa[] = campaignsWithLocation.map((c: Campanha) => ({
          id: String(c.id),
          titulo: c.titulo,
          localizacao: {
            latitude: c.localizacao!.latitude,
            longitude: c.localizacao!.longitude,
          },
        }));
        
        setApiCampaigns(formattedData);
      } catch (err: any) {
        console.error(err);
        Alert.alert('Erro', 'Não foi possível carregar as campanhas no mapa.');
      }
    };
    if (!isSelectionMode) {
      fetchCampaigns();
    }
  }, [isSelectionMode]);

  useEffect(() => {
    if (location && apiCampaigns.length) {
      const updated = apiCampaigns.map(c => {
        // 4. Usa o campo 'localizacao'
        const distKm = getDistanceFromLatLonInKm(
          location.latitude, location.longitude,
          c.localizacao.latitude, c.localizacao.longitude
        );
        return { ...c, distance: `${distKm.toFixed(2)} km` };
      });
      setCampaignsWithDistance(updated.sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!)));
    }
  }, [location, apiCampaigns]);

  const handleDrawRoute = async (c: CampanhaNoMapa) => {
    if (!location) return;
    if (activeRouteDonationId === c.id) {
      setRouteCoords([]);
      setActiveRouteDonationId(null);
      return;
    }
    try {
        // 5. Usa o campo 'localizacao'
        const url = `http://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${c.localizacao.longitude},${c.localizacao.latitude}?overview=full&geometries=geojson`;
        const resp = await fetch(url);
        const json = await resp.json();
        
        if (json.routes && json.routes.length > 0) {
            const coords = json.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({
                latitude: lat, longitude: lng
            }));
            setRouteCoords(coords);
            setActiveRouteDonationId(c.id);
            mapRef.current?.fitToCoordinates(coords, {
                edgePadding: { top: 100, bottom: 250, left: 50, right: 50 },
                animated: true,
            });
        } else {
            Alert.alert('Erro de Rota', 'Não foi possível calcular a rota para este destino.');
        }
    } catch(error) {
        Alert.alert('Erro de Rota', 'Não foi possível conectar ao serviço de rotas.');
        console.error(error);
    }
  };

  const handleGoToLocation = (loc: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion({ ...loc, latitudeDelta: 0.005, longitudeDelta: 0.005 });
  };
  
  const handleRecenter = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMapPress = (e: any) => {
    if (isSelectionMode) {
      const coords = e.nativeEvent.coordinate;
      setSelectedPin(coords);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedPin) {
      setSelectedLocation(selectedPin);
      navigation.goBack();
    }
  };

  if (!region) {
    return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando mapa e localização...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        onPress={handleMapPress}
      >
        {/* 6. Renderiza os markers com os dados da Campanha */}
        {!isSelectionMode && campaignsWithDistance.map(c => (
          <Marker
            key={c.id}
            coordinate={c.localizacao}
            title={c.titulo}
            pinColor={activeRouteDonationId === c.id ? 'tomato' : 'indigo'}
          />
        ))}

        {isSelectionMode && selectedPin && (
          <Marker coordinate={selectedPin} pinColor="green" title="Local Selecionado" />
        )}

        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#4B4DED" />}
      </MapView>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {isSelectionMode ? (
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, !selectedPin && styles.disabledButton]}
            onPress={handleConfirmSelection}
            disabled={!selectedPin}
          >
            <Text style={styles.confirmButtonText}>
              {selectedPin ? 'Confirmar Localização' : 'Toque no mapa para selecionar'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.cardsScrollView, { bottom: insets.bottom + 90 }]}
            contentContainerStyle={styles.cardsContainer}
          >
            {/* 7. Renderiza os cards com os dados da Campanha */}
            {campaignsWithDistance.map(c => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.cardTitle} numberOfLines={2}>{c.titulo}</Text>
                <Text style={styles.cardSubtitle}>{c.distance}</Text>
                <View style={styles.cardButtonsContainer}>
                  <TouchableOpacity style={styles.cardButton} onPress={() => handleDrawRoute(c)}>
                    <Text style={styles.cardButtonText}>
                      {activeRouteDonationId === c.id ? 'Limpar Rota' : 'Ver Rota'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#4B4DED' }]}
                    onPress={() => handleGoToLocation(c.localizacao)}
                  >
                    <Text style={[styles.cardButtonText, { color: '#4B4DED' }]}>Ir ao Local</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
            <TabBar
              tabs={[
                { icon: 'search', label: 'DESCUBRA', onPress: () => navigation.navigate('SearchDonation') },
                { icon: 'map-pin', label: 'MAPA', onPress: () => {} },
                { icon: 'user', label: 'CONTA', onPress: () => navigation.navigate('Conta') },
              ]}
            />
          </View>
        </>
      )}
    </View>
  );
}