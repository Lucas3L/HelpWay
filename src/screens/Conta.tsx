import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import styles from '../styles/conta';
import { colors } from '../styles';
import TabBar from '../components/TabBar';
import { useAuth } from '../context/AuthContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Conta'>;

export default function ContaScreen() {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  
  const { user, logout, loginFoiManual, habilitarBiometria, clearLoginManualFlag } = useAuth();

  // ESTE useEffect NÃO é para navegação.
  // Ele é o "guarda" que pergunta sobre biometria.
 

  const handleLogout = () => {
    logout();
    // navigation.replace('Login'); // <-- NAVEGAÇÃO MANUAL REMOVIDA
    // O App.tsx vai cuidar disso automaticamente
  };

  if (!user) {
    // Este 'if' é uma proteção caso a navegação automática demore.
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { marginTop: 24 }]}>
          {user.img_usuario ? (
            <Image source={{ uri: `data:image/jpeg;base64,${user.img_usuario}` }} style={styles.profileImage} />
          ) : (
            <Feather name="user" size={48} color="#fff" />
          )}
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{user.nome}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AlterarDados')}
          >
            <Feather name="user" size={24} color={colors.primary} />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Minha Conta</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>

          {user.tp_usuario === 1 && (
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('HistoricoDoacoes', { campaignId: undefined })}
            >
              <Feather name="clock" size={24} color={colors.primary} />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Histórico de Doações</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {user.tp_usuario === 2 && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('AddDonation')}
              >
                <Feather name="plus-circle" size={24} color={colors.primary} />
                <Text style={[styles.menuTitle, { marginLeft: 12, flex: 1 }]}>
                  Solicitar Nova Doação
                </Text>
                <Feather name="chevron-right" size={20} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('MinhasDoacoes')}
              >
                <Feather name="list" size={24} color={colors.primary} />
                <Text style={[styles.menuTitle, { marginLeft: 12, flex: 1 }]}>
                  Histórico de Doações
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={24} color={colors.primary} />
            <Text style={[styles.menuTitle, { flex: 1 }, { marginHorizontal: 12 }]}>
              Sair da Conta
            </Text>
            <Feather name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
      </ScrollView>

      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom 
      }}>
        <TabBar
          tabs={[
            {
              icon: 'search',
              label: 'DESCUBRA',
              onPress: () => navigation.navigate('SearchDonation'),
            },
            {
              icon: 'map-pin',
              label: 'MAPA',
              onPress: () => navigation.navigate('Map' as never),
            },
            {
              icon: 'user',
              label: 'CONTA',
              onPress: () => {},
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}