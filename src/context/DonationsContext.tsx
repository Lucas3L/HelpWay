import React, { createContext, useContext, useState } from 'react';
import { Image } from 'react-native';
import doctorsImage from '../../assets/doctors1.png';
import ajudeRsImage from '../../assets/AjudeRs.jpg';
import {api} from '../services/api';

export type Donation = {
  id: string;
  titulo: string;
  subtitulo?: string;
  valor_levantado: number;
  meta_doacoes: number;
  imagem_base64: string;
  descricao: string;
  fg_dinheiro: boolean;
  fg_alimentacao: boolean;
  fg_vestuario: boolean;
  localizacao?: { latitude: number; longitude: number };
  chave_pix?: string; // ADICIONADA ESTA LINHA
  types?: string[]; 
};

type DonationsContextType = {
  donations: Donation[];
  addDonation: (donation: any) => Promise<void>; 
  updateDonation: (id: string, amount: number) => void;
};

const DonationsContext = createContext<DonationsContextType>({
  donations: [],
  addDonation: async () => {},
  updateDonation: () => {},
});

export const DonationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      titulo: 'Ajude o RS',
      subtitulo: 'Enchentes no Sul do Brasil',
      valor_levantado: 3000,
      meta_doacoes: 10000,
      imagem_base64: Image.resolveAssetSource(ajudeRsImage).uri,
      descricao: 'Estamos arrecadando agasalhos para doar neste inverno.',
      fg_dinheiro: false,
      fg_alimentacao: true,
      fg_vestuario: true,
      chave_pix: 'doe@ajuders.org', // Exemplo
      localizacao: {
        latitude: -30.0346,
        longitude: -51.2177,
      },
    },
    {
      id: '2',
      titulo: 'Ajuda Médica',
      subtitulo: 'Médicos sem Fronteiras',
      valor_levantado: 5000,
      meta_doacoes: 15000,
      imagem_base64: Image.resolveAssetSource(doctorsImage).uri,
      descricao: 'Estamos comprando medicamentos.',
      fg_dinheiro: true,
      fg_alimentacao: false,
      fg_vestuario: false,
      chave_pix: '123.456.789-00', // Exemplo
      localizacao: {
        latitude: -23.5505,
        longitude: -46.6333,
      },
    },
  ]);

  const addDonation = async (donationData: any) => {
    
    const donationPayload = {
      titulo: donationData.titulo,
      subtitulo: donationData.subtitulo,
      descricao: donationData.descricao,
      imagem_base64: donationData.imagem_base64,
      meta_doacoes: donationData.meta_doacoes,
      valor_levantado: 0,
      fg_dinheiro: donationData.types.includes('Dinheiro'),
      fg_alimentacao: donationData.types.includes('Alimentação'),
      fg_vestuario: donationData.types.includes('Utensílio'),
      chave_pix: donationData.chave_pix, // Adicionado
      localizacao: {
        latitude: donationData.location.latitude,
        longitude: donationData.location.longitude,
      },
      id_organizador: donationData.id_organizador,
    };

    try {
      const newDonationFromApi = await api.criarCampanha(donationPayload);
      
      const newDonationForState: Donation = {
        ...newDonationFromApi,
        id: newDonationFromApi.id,
        titulo: newDonationFromApi.titulo,
        subtitulo: newDonationFromApi.subtitulo,
        valor_levantado: newDonationFromApi.valor_levantado,
        meta_doacoes: newDonationFromApi.meta_doacoes,
        imagem_base64: newDonationFromApi.imagem_base64,
        descricao: newDonationFromApi.descricao,
        fg_dinheiro: newDonationFromApi.fg_dinheiro,
        fg_alimentacao: newDonationFromApi.fg_alimentacao,
        fg_vestuario: newDonationFromApi.fg_vestuario,
        localizacao: newDonationFromApi.localizacao,
        chave_pix: newDonationFromApi.chave_pix,
      };
      
      setDonations(prev => [...prev, newDonationForState]);

    } catch (error) {
      console.error('Erro ao criar doação:', error);
      throw error;
    }
  };

  const updateDonation = (id: string, amount: number) => {
    setDonations(prev =>
      prev.map(donation =>
        donation.id === id
          ? { ...donation, valor_levantado: donation.valor_levantado + amount }
          : donation
      )
    );
  };

  return (
    <DonationsContext.Provider value={{ donations, addDonation, updateDonation }}>
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = () => useContext(DonationsContext);