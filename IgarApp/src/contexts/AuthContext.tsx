import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/src/services/firebase/config';
import {
  User as FirebaseUser,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

// Tipos para o contexto
type User = FirebaseUser | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

// Criar contexto com valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Monitorar estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de cadastro
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  // Atualizar perfil do usuário
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (!user) throw new Error('Nenhum usuário autenticado');

      await updateProfile(user, {
        displayName,
        photoURL: photoURL || null,
      });

      // Atualizar estado local
      setUser({ ...user, displayName, photoURL: photoURL || null });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};