import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, fonts } from '../styles';

// 1. Interface atualizada para os nomes da API
interface Props {
  imageUri: string;
  titulo: string;
  subtitulo?: string; // Este campo é o "Nome do Usuário que Solicitou"
  valor_levantado: number;
  meta_doacoes: number;
  types: string[];
}

export default function DonationCard({ imageUri, titulo, subtitulo, valor_levantado, meta_doacoes, types }: Props) {
  
  const metaNumerica = meta_doacoes || 0;
  const arrecadadoNumerico = valor_levantado || 0;

  let percentageValue = 0;
  // 2. CORREÇÃO DO BUG "0%":
  // Se o valor arrecadado for maior que 0 e a meta for maior que 0, calcula
  if (arrecadadoNumerico > 0 && metaNumerica > 0) {
    percentageValue = (arrecadadoNumerico / metaNumerica) * 100;
  }

  const percentage = Math.min(percentageValue, 100);
  // Usar Math.floor() garante que 0.26% (R$ 130 / R$ 50.000) seja exibido como 0%
  const percentageExibida = Math.floor(percentage);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{titulo}</Text>
        
        {/* 3. CORREÇÃO DO TÍTULO: Mostra o "Solicitador" */}
        {subtitulo && <Text style={styles.subtitle}>{subtitulo}</Text>}

        <View style={styles.progressContainer}>
          <Slider
            value={percentage}
            minimumValue={0}
            maximumValue={100}
            disabled
            style={styles.slider}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#ccc"
            thumbTintColor={colors.primary}
          />
          <Text style={styles.percentage}>{isNaN(percentageExibida) ? 0 : percentageExibida}%</Text>
        </View>
        <Text style={styles.values}>
          R$ {arrecadadoNumerico.toLocaleString('pt-BR')} / R$ {metaNumerica.toLocaleString('pt-BR')}
        </Text>

        <View style={styles.typesContainer}>
          {types.map((type, idx) => (
            <View key={idx} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 25,
    marginVertical: 12, 
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6, 
  },
  image: {
    width: '100%',
    height: 80, 
  },
  content: {
    padding: 10, 
  },
  title: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  slider: {
    flex: 1,
    height: 16,
  },
  percentage: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  values: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textLight,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    marginRight: 4,
    marginTop: 4,
  },
  typeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});