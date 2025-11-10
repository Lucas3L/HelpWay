import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import InputDate from '../../components/InputDate';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import styles from '../../styles/register';
import useAlterarDadosViewModel from './useAlterarDadosViewModel'; // <-- IMPORTA O VIEWMODEL

export default function AlterarDados() { // <-- EXPORTA UM COMPONENTE DE UI
  const vm = useAlterarDadosViewModel(); // <-- CONSOME O VIEWMODEL

  if (!vm.user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4B4DED" />
      </View>
    );
  }

  return ( // <-- RETORNA JSX
    <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={vm.tecladoAtivo}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={() => vm.navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Alterar Dados</Text>
            <TouchableOpacity onPress={vm.selecionarImagem} style={{ alignSelf: 'center', marginBottom: 20 }}>
              {vm.imagemUri ? (
                <Image source={{ uri: vm.imagemUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="person-circle-outline" size={80} color="#ccc" />
                </View>
              )}
            </TouchableOpacity>
            
            <Input icon="user" placeholder="Nome Completo" value={vm.nome} onChangeText={vm.setNome} />
            <InputDate
              icon="calendar"
              placeholder="Data de Nascimento"
              value={vm.nascimento}
              onChange={vm.setNascimento}
            />
            <Input
              icon="envelope"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={vm.email}
              onChangeText={vm.setEmail}
            />
            
            <TouchableOpacity
              onPress={() => vm.setMostrarCamposSenha(!vm.mostrarCamposSenha)}
              style={{ marginBottom: 15, paddingVertical: 5 }}
            >
              <Text style={{ color: '#007AFF', textAlign: 'center' }}>
                {vm.mostrarCamposSenha ? 'Cancelar Troca de Senha' : 'Trocar Senha'}
              </Text>
            </TouchableOpacity>

            {vm.mostrarCamposSenha && (
              <>
                <InputPassword
                  placeholder="Senha Atual"
                  value={vm.senhaAtualParaTroca}
                  onChangeText={vm.setSenhaAtualParaTroca}
                />
                <InputPassword
                  placeholder="Nova Senha"
                  value={vm.novaSenha}
                  onChangeText={vm.setNovaSenha}
                />
                <InputPassword
                  placeholder="Confirmar Nova Senha"
                  value={vm.confirmarNovaSenha}
                  onChangeText={vm.setConfirmarNovaSenha}
                />
              </>
            )}

            {vm.erroSenha ? <Text style={styles.error}>{vm.erroSenha}</Text> : null}
            
            <Text style={styles.subTitle}>Você deseja?</Text>
            <TouchableOpacity
              style={styles.toggleUniqueButton}
              onPress={() =>
                vm.setTipoUsuario((prev) => (prev === 'doar' ? 'receber' : 'doar'))
              }
            >
              <Text style={styles.toggleUniqueButtonText}>
                {vm.tipoUsuario === 'doar' ? 'Ajudar Pessoas' : 'Receber Ajuda'}
              </Text>
            </TouchableOpacity>
            
            <Button title="Salvar Alterações" onPress={vm.handleSalvar} disabled={vm.isLoading} />
            {vm.isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}