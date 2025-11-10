import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/Input';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import InputDate from '../../components/InputDate';
import styles from '../../styles/register';
import useRegisterViewModel from './useRegisterViewModel'; // Importa o ViewModel

export default function Register() {
  const vm = useRegisterViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={vm.tecladoAtivo}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={() => vm.navigation.navigate('Login')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Cadastrar</Text>
              <TouchableOpacity onPress={vm.selecionarImagem}>
                {vm.imagemUri ? (
                  <Image source={{ uri: vm.imagemUri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="person-circle-outline" size={64} color="#ccc" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Input icon="user" placeholder="Nome Completo" value={vm.nome} onChangeText={vm.setNome} />
            <InputDate icon="calendar" placeholder="Data de Nascimento" value={vm.nascimento} onChange={vm.setNascimento} />
            <Input icon="envelope" placeholder="Seu Email" value={vm.email} onChangeText={vm.setEmail} keyboardType="email-address" autoCapitalize="none" />
            {vm.emailErro ? <Text style={styles.error}>{vm.emailErro}</Text> : null}
            <InputPassword placeholder="Sua Senha" value={vm.senha} onChangeText={vm.setSenha} />
            <InputPassword placeholder="Confirmar Senha" value={vm.confirmarSenha} onChangeText={vm.setConfirmarSenha} />
            {vm.senhaErro ? <Text style={styles.error}>{vm.senhaErro}</Text> : null}
            <Text style={styles.subTitle}>Você deseja?</Text>
            <TouchableOpacity
              style={styles.toggleUniqueButton}
              onPress={() => vm.setTipoUsuario(prev => (prev === 'doar' ? 'receber' : 'doar'))}
            >
              <Text style={styles.toggleUniqueButtonText}>
                {vm.tipoUsuario === 'doar' ? 'Ajudar Pessoas' : 'Receber Ajuda'}
              </Text>
            </TouchableOpacity>
            <Button title="Cadastrar" onPress={vm.handleCadastro} disabled={vm.isLoading} />
            {vm.isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}