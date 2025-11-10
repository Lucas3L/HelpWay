import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from '../screens/login/login';
import SearchDonation from '../screens/SearchDonation';
import DonationDetail from '../screens/DonationDetail';
import AddDonation from '../screens/AddDonation';
import Conta from '../screens/Conta';
import Register from '../screens/Register/Register';
import Map from '../screens/Map';
import DonationPay from '../screens/DonationPay';
import DonationPix from '../screens/DonationPix';
import AlterarDados from '../screens/AlterarDados/AlterarDados';


import MinhasDoacoesTela from '../screens/MinhasDoacoes';
import EditarDoacaoTela from '../screens/EditarDoacao';
import HistoricoDoacoesTela from '../screens/HistoricoDoacao';
import CertificadoDoacaoTela from '../screens/CertificadoDoacao';

import { LocationObjectCoords } from 'expo-location';
import { Donation } from '../context/DonationsContext';
import { DoacaoFeita } from '../screens/HistoricoDoacao'; 

export type DonationType = {
  id: string;
  imageUri: string;
  title: string;
  subtitle?: string;
  raised: number;
  goal: number;
};

export type RootStackParamList = {
  Login: undefined;
  SearchDonation: undefined;
  DonationDetail: { donation: Donation };
  Conta: undefined;
  AddDonation: undefined;
  Register: undefined;
  Map: { isSelectionMode?: boolean };
  AlterarDados: undefined;
  DonationPix: { donationAmount: string; donationName?: string; donationId: string };
  DonationPay: { campaign: Donation };
  MinhasDoacoes: undefined;
  EditarDoacao: { donationId: string };
  HistoricoDoacoes: { campaignId: string | undefined };
  CertificadoDoacao: { donationInfo: DoacaoFeita };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SearchDonation" component={SearchDonation} />
      <Stack.Screen name="DonationDetail" component={DonationDetail} />
      <Stack.Screen name="Conta" component={Conta} />
      <Stack.Screen name="AddDonation" component={AddDonation} />
      <Stack.Screen name="DonationPix" component={DonationPix} />
      <Stack.Screen name="DonationPay" component={DonationPay} />
      <Stack.Screen name="AlterarDados" component={AlterarDados} />
      <Stack.Screen name="MinhasDoacoes" component={MinhasDoacoesTela} />
      <Stack.Screen name="EditarDoacao" component={EditarDoacaoTela} />
      <Stack.Screen name="HistoricoDoacoes" component={HistoricoDoacoesTela} />
      <Stack.Screen name="CertificadoDoacao" component={CertificadoDoacaoTela} />
    </Stack.Navigator>
  );
}