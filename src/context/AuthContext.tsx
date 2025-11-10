import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '../services/api';

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
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (
    emailOuId: string,
    senha: string
  ) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [passwordAuth, setPasswordAuth] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
    setPasswordAuth(null);
  };

  // --- FUNÇÃO DE LOGIN ATUALIZADA ---
  // Ela não faz mais validação de senha. Ela confia na api.login()
  // para fazer isso no backend.
  const login = async (loginInput: string, senha: string) => {
    try {
      // Agora a lógica de negócio está no backend
      // A API vai validar a senha e:
      // 1. Retornar o usuário se o login for válido.
      // 2. Disparar um erro se o login for inválido.
      const usuario = await api.login(loginInput, senha);

      setUser(usuario);
      setPasswordAuth(senha); // Ainda guardamos a senha para a tela "AlterarDados"
      return { success: true };

    } catch (error: any) {
      console.error("Erro no login:", error);
      // A mensagem de erro vem direto da api.login
      return { success: false, message: error.message || 'Email ou senha incorretos' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, passwordAuth, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);