import React from 'react';
import {
  View, Text, TouchableOpacity, Pressable, Modal, TextInput, 
  Image, ActivityIndicator 
} from 'react-native';

import styles from '../../styles/login';
import Input from '../../components/Input';
import InputPassword from '../../components/InputPassword';
import useLoginViewModel from './useLoginViewModel';

export default function LoginScreen() {
  const vm = useLoginViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HelpWay</Text>

      <Input
        icon="user"
        placeholder="Seu login ou e-mail"
        value={vm.loginInput}
        onChangeText={vm.setLoginInput}
      />

      <InputPassword
        placeholder="Sua senha"
        value={vm.senha}
        onChangeText={vm.setSenha}
      />
      {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}

      <TouchableOpacity onPress={() => vm.setModalVisible(true)}>
        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={vm.handleLoginPress} 
        disabled={vm.isLoading}
      >
        {vm.isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.or}>ou</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={vm.handleGoogleLoginPress}
        disabled={!vm.googleAuthRequest || vm.isLoading}
      >
        <Image
          source={require('../../../assets/google-logo.png')}
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Não tem login ainda? </Text>
        <Pressable onPress={vm.handleGoToRegister}>
          <Text style={styles.register}>Registrar</Text>
        </Pressable>
      </View>
      
      <Modal
        visible={vm.modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => vm.setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <TextInput
              placeholder="Digite seu e-mail"
              style={styles.input}
              value={vm.recoveryEmail}
              onChangeText={vm.setRecoveryEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={vm.handleSendRecovery}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => vm.setModalVisible(false)} style={{marginTop: 15}}>
              <Text style={[styles.forgot, { textAlign: 'center' }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}