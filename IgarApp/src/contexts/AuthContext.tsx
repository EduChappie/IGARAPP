import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { auth, db } from "@/src/services/firebase/config";

import {
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  tipo?: string;
  bio?: string;
  insta?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ── Helper: busca dados do Firestore para um authUser ─────────────────────────

async function buscarDadosFirestore(uid: string): Promise<Record<string, any> | null> {
  const ongSnap = await getDoc(doc(db, "ongs", uid));
  if (ongSnap.exists()) return ongSnap.data();

  const userSnap = await getDoc(doc(db, "users", uid));
  if (userSnap.exists()) return userSnap.data();

  return null;
}

// ── Contexto ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitora mudanças de autenticação (login, logout, troca de conta)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          const firestoreData = await buscarDadosFirestore(authUser.uid);
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            ...firestoreData,
          });
        } else {
          // Limpa o usuário imediatamente ao deslogar
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged cuida de atualizar o estado automaticamente
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<UserCredential> => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Limpa o estado local ANTES de deslogar para evitar flickering
      setUser(null);
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (!auth.currentUser) throw new Error("Nenhum usuário autenticado");

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || null,
      });

      setUser((prev) =>
        prev ? { ...prev, displayName, photoURL: photoURL || null } : prev
      );
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  // Reutiliza o helper para evitar duplicação de lógica
  const refreshUser = useCallback(async () => {
    try {
      const authUser = auth.currentUser;
      if (!authUser) return;

      const firestoreData = await buscarDadosFirestore(authUser.uid);
      setUser({
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        ...firestoreData,
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateUserProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};