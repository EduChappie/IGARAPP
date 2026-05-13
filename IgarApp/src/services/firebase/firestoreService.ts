// Serviço para operações do Firestore do IgarApp usando Firebase v9 modular API

import { firestore, FieldValue, serverTimestamp } from './config';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { Alert } from 'react-native';

// Tipos de dados
export interface Participacao {
  id?: string;
  acaoId: string;
  userId: string;
  dataInscricao: Date;
  status: 'confirmado' | 'pendente' | 'cancelado';
  createdAt?: any; // Firestore timestamp
}

export interface Acao {
  id?: string;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  dataEvento: Date;
  horaInicio: string;
  horaFim: string;
  voluntariosNecessarios: number;
  voluntariosInscritos: number;
  organizadorId: string;
  imagens: string[];
  metas: string[];
  orientacoes: string;
  createdAt?: any; // Firestore timestamp
}

// Serviço de participações
export const participacaoService = {
  // Inscrever usuário em uma ação
  async inscreverEmAcao(acaoId: string, userId: string): Promise<string> {
    try {
      const participacaoData: Omit<Participacao, 'id'> = {
        acaoId,
        userId,
        dataInscricao: new Date(),
        status: 'confirmado',
      };

      const participacoesRef = collection(firestore, 'participacoes');
      const docRef = await addDoc(participacoesRef, {
        ...participacaoData,
        createdAt: serverTimestamp(),
      });

      console.log('Inscrição realizada com sucesso:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Erro ao inscrever em ação:', error);
      throw error;
    }
  },

  // Verificar se usuário já está inscrito em uma ação
  async verificarInscricao(acaoId: string, userId: string): Promise<boolean> {
    try {
      const participacoesRef = collection(firestore, 'participacoes');
      const q = query(
        participacoesRef,
        where('acaoId', '==', acaoId),
        where('userId', '==', userId),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error: any) {
      console.error('Erro ao verificar inscrição:', error);
      throw error;
    }
  },

  // Buscar todas as participações de um usuário
  async getParticipacoesUsuario(userId: string): Promise<Participacao[]> {
    try {
      const participacoesRef = collection(firestore, 'participacoes');
      const q = query(
        participacoesRef,
        where('userId', '==', userId),
        orderBy('dataInscricao', 'desc')
      );

      const snapshot = await getDocs(q);
      const participacoes: Participacao[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        participacoes.push({
          id: doc.id,
          acaoId: data.acaoId,
          userId: data.userId,
          dataInscricao: data.dataInscricao?.toDate() || new Date(),
          status: data.status || 'confirmado',
          createdAt: data.createdAt,
        });
      });

      return participacoes;
    } catch (error: any) {
      console.error('Erro ao buscar participações:', error);
      throw error;
    }
  },

  // Cancelar participação
  async cancelarParticipacao(participacaoId: string): Promise<void> {
    try {
      const participacaoRef = doc(firestore, 'participacoes', participacaoId);
      await updateDoc(participacaoRef, {
        status: 'cancelado',
        updatedAt: serverTimestamp(),
      });

      console.log('Participação cancelada:', participacaoId);
    } catch (error: any) {
      console.error('Erro ao cancelar participação:', error);
      throw error;
    }
  },
};

// Serviço de ações
export const acaoService = {
  // Buscar ação por ID
  async getAcaoById(acaoId: string): Promise<Acao | null> {
    try {
      const acaoRef = doc(firestore, 'acoes', acaoId);
      const acaoDoc = await getDoc(acaoRef);

      if (!acaoDoc.exists()) {
        return null;
      }

      const data = acaoDoc.data();
      return {
        id: acaoDoc.id,
        titulo: data?.titulo || '',
        descricao: data?.descricao || '',
        cidade: data?.cidade || '',
        estado: data?.estado || '',
        dataEvento: data?.dataEvento?.toDate() || new Date(),
        horaInicio: data?.horaInicio || '',
        horaFim: data?.horaFim || '',
        voluntariosNecessarios: data?.voluntariosNecessarios || 0,
        voluntariosInscritos: data?.voluntariosInscritos || 0,
        organizadorId: data?.organizadorId || '',
        imagens: data?.imagens || [],
        metas: data?.metas || [],
        orientacoes: data?.orientacoes || '',
        createdAt: data?.createdAt,
      };
    } catch (error: any) {
      console.error('Erro ao buscar ação:', error);
      throw error;
    }
  },

  // Buscar múltiplas ações por IDs
  async getAcoesByIds(acaoIds: string[]): Promise<Acao[]> {
    try {
      if (acaoIds.length === 0) return [];

      // Para buscar múltiplos documentos por ID, podemos fazer queries individuais
      const promises = acaoIds.slice(0, 10).map(id => {
        const acaoRef = doc(firestore, 'acoes', id);
        return getDoc(acaoRef);
      });

      const docs = await Promise.all(promises);

      const acoes: Acao[] = [];
      docs.forEach((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          acoes.push({
            id: doc.id,
            titulo: data?.titulo || '',
            descricao: data?.descricao || '',
            cidade: data?.cidade || '',
            estado: data?.estado || '',
            dataEvento: data?.dataEvento?.toDate() || new Date(),
            horaInicio: data?.horaInicio || '',
            horaFim: data?.horaFim || '',
            voluntariosNecessarios: data?.voluntariosNecessarios || 0,
            voluntariosInscritos: data?.voluntariosInscritos || 0,
            organizadorId: data?.organizadorId || '',
            imagens: data?.imagens || [],
            metas: data?.metas || [],
            orientacoes: data?.orientacoes || '',
            createdAt: data?.createdAt,
          });
        }
      });

      return acoes;
    } catch (error: any) {
      console.error('Erro ao buscar ações:', error);
      throw error;
    }
  },

  // Buscar ações ativas (para home)
  async getAcoesAtivas(limitCount: number = 10): Promise<Acao[]> {
    try {
      const acoesRef = collection(firestore, 'acoes');
      const q = query(
        acoesRef,
        where('dataEvento', '>=', new Date()),
        orderBy('dataEvento', 'asc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const acoes: Acao[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        acoes.push({
          id: doc.id,
          titulo: data?.titulo || '',
          descricao: data?.descricao || '',
          cidade: data?.cidade || '',
          estado: data?.estado || '',
          dataEvento: data?.dataEvento?.toDate() || new Date(),
          horaInicio: data?.horaInicio || '',
          horaFim: data?.horaFim || '',
          voluntariosNecessarios: data?.voluntariosNecessarios || 0,
          voluntariosInscritos: data?.voluntariosInscritos || 0,
          organizadorId: data?.organizadorId || '',
          imagens: data?.imagens || [],
          metas: data?.metas || [],
          orientacoes: data?.orientacoes || '',
          createdAt: data?.createdAt,
        });
      });

      return acoes;
    } catch (error: any) {
      console.error('Erro ao buscar ações ativas:', error);
      throw error;
    }
  },
};

// Função auxiliar para buscar histórico do usuário com join manual
export const getHistoricoUsuario = async (userId: string) => {
  try {
    // 1. Buscar todas as participações do usuário
    const participacoes = await participacaoService.getParticipacoesUsuario(userId);

    if (participacoes.length === 0) {
      return [];
    }

    // 2. Extrair IDs das ações únicas
    const acaoIds = [...new Set(participacoes.map(p => p.acaoId))];

    // 3. Buscar informações das ações correspondentes
    const acoes = await acaoService.getAcoesByIds(acaoIds);

    // 4. Criar mapa de ações para acesso rápido
    const acoesMap = new Map(acoes.map(acao => [acao.id, acao]));

    // 5. Combinar dados (join manual)
    const historicoCompleto = participacoes.map(participacao => {
      const acao = acoesMap.get(participacao.acaoId);
      return {
        participacao,
        acao: acao || null,
      };
    });

    return historicoCompleto;
  } catch (error: any) {
    console.error('Erro ao buscar histórico do usuário:', error);
    throw error;
  }
};

// Função para mostrar alerta de sucesso
export const showSuccessAlert = (message: string) => {
  Alert.alert(
    'Sucesso!',
    message,
    [{ text: 'OK', style: 'default' }]
  );
};

// Função para mostrar alerta de erro
export const showErrorAlert = (message: string) => {
  Alert.alert(
    'Erro',
    message,
    [{ text: 'OK', style: 'cancel' }]
  );
};