import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { auth, db } from '@/src/services/firebase/config';

import {
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

import {
  doc,
  getDoc
} from 'firebase/firestore';

// Tipo do usuário completo
interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;

  tipo?: string;

  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<void>;

  signUp: (
    email: string,
    password: string
  ) => Promise<UserCredential>;

  signOut: () => Promise<void>;

  updateUserProfile: (
    displayName: string,
    photoURL?: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider'
    );
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // MONITORAR LOGIN
  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(
      async (authUser) => {

        try {

          if (authUser) {

            // Primeiro tenta buscar em "ongs"
            const ongRef = doc(
              db,
              'ongs',
              authUser.uid
            );

            const ongSnap = await getDoc(ongRef);

            // Depois tenta buscar em "users"
            const userRef = doc(
              db,
              'users',
              authUser.uid
            );

            const userSnap = await getDoc(userRef);

            let firestoreData = null;

            // SE EXISTE EM ONGS
            if (ongSnap.exists()) {

              firestoreData = ongSnap.data();

            }

            // SE EXISTE EM USERS
            else if (userSnap.exists()) {

              firestoreData = userSnap.data();

            }

            // MONTA O USUÁRIO COMPLETO
            setUser({
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,

              ...firestoreData,
            });

          } else {

            setUser(null);

          }

        } catch (error) {

          console.error(
            'Erro ao carregar usuário:',
            error
          );

        } finally {

          setLoading(false);

        }

      }
    );

    return unsubscribe;

  }, []);

  // LOGIN
  const signIn = async (
    email: string,
    password: string
  ) => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    } catch (error: any) {

      console.error('Erro no login:', error);

      throw error;
    }
  };

  // CADASTRO
  const signUp = async (
    email: string,
    password: string
  ) => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      return userCredential;

    } catch (error: any) {

      console.error(
        'Erro no cadastro:',
        error
      );

      throw error;
    }
  };

  // LOGOUT
  const signOut = async () => {

    try {

      await firebaseSignOut(auth);

    } catch (error: any) {

      console.error(
        'Erro no logout:',
        error
      );

      throw error;
    }
  };

  // ATUALIZAR PERFIL
  const updateUserProfile = async (
    displayName: string,
    photoURL?: string
  ) => {

    try {

      if (!auth.currentUser) {
        throw new Error(
          'Nenhum usuário autenticado'
        );
      }

      await updateProfile(
        auth.currentUser,
        {
          displayName,
          photoURL: photoURL || null,
        }
      );

      setUser((prev) => {

        if (!prev) return prev;

        return {
          ...prev,
          displayName,
          photoURL: photoURL || null,
        };

      });

    } catch (error: any) {

      console.error(
        'Erro ao atualizar perfil:',
        error
      );

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