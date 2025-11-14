import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AUTH_KEY = 'helpway_auth';
const BIOMETRICS_KEY = 'helpway_biometrics_enabled';

type User = {
  id: number;
  nome: string;
  email: string;
  dt_nascimento: string;
  senha?: string;
  img_usuario: string;
  tp_usuario: number;
};

type AuthContextData = {
  user: User | null;
  passwordAuth: string | null;
  isLoading: boolean; 
  isBiometricsEnabled: boolean;
  loginFoiManual: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (emailOuId: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  tryBiometricLogin: () => Promise<boolean>;
  habilitarBiometria: () => Promise<void>;
  clearLoginManualFlag: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [passwordAuth, setPasswordAuth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [loginFoiManual, setLoginFoiManual] = useState(false);

  useEffect(() => {
    async function loadAuthData() {
      try {
        const authDataString = await SecureStore.getItemAsync(AUTH_KEY);
        const biometricsPref = await AsyncStorage.getItem(BIOMETRICS_KEY);
        
        if (biometricsPref === 'true') {
          setIsBiometricsEnabled(true);
        }

        if (authDataString) {
          const authData = JSON.parse(authDataString);
          setUser(authData.user);
          setPasswordAuth(authData.passwordAuth);
        }
      } catch (e) {
        console.error("Falha ao carregar dados de autenticação", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthData();
  }, []);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_KEY);
      await AsyncStorage.setItem(BIOMETRICS_KEY, 'false');
    } catch (e) {
      console.error("Falha ao limpar dados de autenticação", e);
    } finally {
      setUser(null);
      setPasswordAuth(null);
      setIsBiometricsEnabled(false);
      setLoginFoiManual(false);
    }
  };

  const login = async (loginInput: string, senha: string) => {
    try {
      const usuario = await api.login(loginInput, senha);
      
      const authData = { user: usuario, passwordAuth: senha };
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(authData));

      setUser(usuario);
      setPasswordAuth(senha);
      
      if (!isBiometricsEnabled) {
        setLoginFoiManual(true);
      }
      
      return { success: true };

    } catch (error: any) {
      console.error("Erro no login:", error);
      return { success: false, message: error.message || 'Email ou senha incorretos' };
    }
  };

  const tryBiometricLogin = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) return false;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticar com Biometria',
      });

      if (result.success) {
        const authDataString = await SecureStore.getItemAsync(AUTH_KEY);
        if (!authDataString) {
           Alert.alert('Erro', 'Nenhuma credencial salva. Faça login com senha primeiro.');
           return false;
        }
        
        const authData = JSON.parse(authDataString);
        
        const usuario = await api.login(authData.user.email, authData.passwordAuth);
        
        setUser(usuario);
        setPasswordAuth(authData.passwordAuth);
        setLoginFoiManual(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const habilitarBiometria = async () => {
    await AsyncStorage.setItem(BIOMETRICS_KEY, 'true');
    setIsBiometricsEnabled(true);
  };

  const clearLoginManualFlag = () => {
    setLoginFoiManual(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      passwordAuth, 
      isLoading, 
      isBiometricsEnabled, 
      loginFoiManual,
      setUser, 
      logout, 
      login, 
      tryBiometricLogin,
      habilitarBiometria,
      clearLoginManualFlag 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);