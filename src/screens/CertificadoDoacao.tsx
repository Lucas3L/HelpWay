import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Feather, Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation';
import styles from '../styles/CertificadoDoacao';

type Props = NativeStackScreenProps<RootStackParamList, 'CertificadoDoacao'>;

const VALOR_POR_HORA = 20;

export default function CertificadoDoacaoTela({ route, navigation }: Props) {
  const { donationInfo } = route.params;

  const valorDoado = donationInfo.valor || 0;
  const horasCertificadas = Math.floor(valorDoado / VALOR_POR_HORA);

  const createPdf = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { border: 10px solid #eee; padding: 30px; text-align: center; }
            h1 { color: #2D4BFF; border-bottom: 2px solid #2D4BFF; padding-bottom: 10px; }
            h2 { font-size: 28px; margin: 10px 0; }
            p { font-size: 16px; line-height: 1.6; }
            .highlight { font-size: 20px; font-weight: bold; color: #198754; }
            .details { text-align: left; margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; }
            .brand { font-size: 24px; color: #2D4BFF; margin-top: 40px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>CERTIFICADO DE ATIVIDADE COMPLEMENTAR</h1>
            <p style="margin-top: 40px;">Certificamos que</p>
            <h2>${donationInfo.donorName || 'Anônimo'}</h2>
            <p>
              Realizou uma contribuição filantrópica para a campanha 
              <strong>"${donationInfo.donationName}"</strong>, organizada por 
              <strong>${donationInfo.organizerName}</strong>,
              na data de ${new Date(donationInfo.date).toLocaleDateString('pt-BR')}.
            </p>
            
            <div class="details">
              <p><strong>ID da Transação:</strong> ${donationInfo.id}</p>
              <p><strong>Valor Doado:</strong> <span class="highlight">R$ ${valorDoado.toFixed(2)}</span></p>
              <p><strong>Equivalência de Carga Horária (Regra 1h/${VALOR_POR_HORA.toFixed(2)}):</strong> 
                 <span class="highlight">${horasCertificadas} horas</span>
              </p>
            </div>

            <p class="brand">HelpWay</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      return uri;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
      return null;
    }
  };

  const handleShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
      return;
    }
    const pdfUri = await createPdf();
    if (pdfUri) {
      await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar Certificado' });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Certificado de Doação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.certificado}>
          <Text style={styles.text}>Certificamos que</Text>
          <Text style={styles.name}>{donationInfo.donorName || 'Doador Anônimo'}</Text>
          <Text style={styles.text}>realizou uma doação no valor de</Text>
          <Text style={styles.amount}>R$ {valorDoado.toFixed(2)}</Text>
          <Text style={styles.text}>para a campanha</Text>
          <Text style={styles.campaign}>"{donationInfo.donationName}"</Text>
          <Text style={styles.date}>Em {new Date(donationInfo.date).toLocaleDateString('pt-BR')}.</Text>

          <View style={styles.divider} />
          
          <Text style={styles.horasTitle}>Horas Complementares</Text>
          <Text style={styles.horasValor}>{horasCertificadas} horas</Text>
          <Text style={styles.horasSubtext}>(Base de cálculo: 1 hora a cada R$ {VALOR_POR_HORA.toFixed(2)} doados)</Text>

          <Text style={styles.brand}>HelpWay</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Feather name="share-2" size={20} color="#fff" />
          <Text style={styles.buttonText}>Compartilhar PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}