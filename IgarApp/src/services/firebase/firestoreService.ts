// Serviço para operações do Firestore do IgarApp usando Firebase v9 modular API
import { onSnapshot } from 'firebase/firestore';
import { firestore, FieldValue, serverTimestamp } from './config';
import {
  collection,
  Timestamp,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  setDoc
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

export interface VoluntarioPresenca {
  participacaoId: string;
  userId: string;
  nome: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

export interface Acao {
  id?: string;
  titulo: string;
  descricao: string;
  cidade: string;
  estado: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  voluntariosNecessarios: number;
  voluntariosInscritos: number;
  ongId: string;
  imagens: string[];
  metas: string[];
  orientacoes: string;
  lixoRecolhido?: string;
  metasConcluidas?: number[];
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

  // Buscar todos os voluntários inscritos em uma ação com nome do usuário
  async getVoluntariosDaAcao(acaoId: string): Promise<VoluntarioPresenca[]> {
    try {
      // 1. Buscar participações da ação
      const participacoesRef = collection(firestore, 'participacoes');
      const q = query(participacoesRef, where('acaoId', '==', acaoId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      // 2. Para cada participação, buscar o nome do usuário em 'users'
      const voluntarios: VoluntarioPresenca[] = [];

      const promises = snapshot.docs.map(async (participacaoDoc) => {
        const data = participacaoDoc.data();
        const userRef = doc(firestore, 'users', data.userId);
        const userSnap = await getDoc(userRef);
        const nome = userSnap.exists()
          ? (userSnap.data()?.nome || userSnap.data()?.razaoSocial || 'Usuário')
          : 'Usuário';

        voluntarios.push({
          participacaoId: participacaoDoc.id,
          userId: data.userId,
          nome,
          status: data.status || 'confirmado',
        });
      });

      await Promise.all(promises);
      return voluntarios;
    } catch (error: any) {
      console.error('Erro ao buscar voluntários da ação:', error);
      throw error;
    }
  },

  // Alternar presença do voluntário (confirmado ↔ cancelado)
  async togglePresenca(participacaoId: string, statusAtual: 'confirmado' | 'pendente' | 'cancelado'): Promise<'confirmado' | 'cancelado'> {
    try {
      const novoStatus = statusAtual === 'confirmado' ? 'cancelado' : 'confirmado';
      const participacaoRef = doc(firestore, 'participacoes', participacaoId);
      await updateDoc(participacaoRef, {
        status: novoStatus,
        updatedAt: serverTimestamp(),
      });

      console.log('Presença atualizada:', participacaoId, novoStatus);
      return novoStatus;
    } catch (error: any) {
      console.error('Erro ao atualizar presença:', error);
      throw error;
    }
  },
};

// Serviço de ações
export const acaoService = {

  // Função para mover evento para histórico
  async moverParaHistorico(eventoId: string) {
    try {
      const eventoRef = doc(firestore, 'acoes', eventoId);

      // Pega os dados do evento
      const eventoSnap = await getDoc(eventoRef);

      if (!eventoSnap.exists()) {
        throw new Error('Evento não encontrado');
      }

      const dadosEvento = eventoSnap.data();

      // Referência da nova coleção
      const historicoRef = doc(collection(firestore, 'historico'));

      // Cria batch
      const batch = writeBatch(firestore);

      // Adiciona no histórico
      batch.set(historicoRef, {
        ...dadosEvento,
        movidoEm: new Date(),
      });

      // Remove de eventos
      batch.delete(eventoRef);

      // Executa tudo junto
      await batch.commit();

      console.log('Evento movido para histórico!');
    } catch (error) {
      console.error('Erro ao mover evento:', error);
    }
  },


  // Criar nova ação
  async criarAcao(acao: Omit<Acao, 'id' | 'createdAt'>): Promise<string> {
    try {
      const acoesRef = collection(firestore, 'acoes');
      const docRef = await addDoc(acoesRef, {
        ...acao,

        // Converte Date para Timestamp do Firebase
        data: Timestamp.fromDate(new Date(acao.data)),

        createdAt: serverTimestamp(),
      });

      console.log('Ação criada com sucesso:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Erro ao criar ação:', error);
      throw error;
    }
  },

  // Editar ação existente (usado ao finalizar)
  async editarAcao(acaoId: string, campos: Partial<Omit<Acao, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const acaoRef = doc(firestore, 'acoes', acaoId);
      await updateDoc(acaoRef, {
        ...campos,
        updatedAt: serverTimestamp(),
      });

      console.log('Ação editada com sucesso:', acaoId);
    } catch (error: any) {
      console.error('Erro ao editar ação:', error);
      throw error;
    }
  },

  // Buscar ação por ID
  async getAcaoById(acaoId: string): Promise<Acao | null> {
    try {
      const acaoRef = doc(firestore, 'acoes', acaoId);
      const acaoDoc = await getDoc(acaoRef);

      if (!acaoDoc.exists()) {
        return null;
      }

      const info = acaoDoc.data();
      return {
        id: acaoDoc.id,
        titulo: info?.titulo || '',
        descricao: info?.descricao || '',
        cidade: info?.cidade || '',
        estado: info?.estado || '',
        data: info?.data instanceof Date
            ? info.data
            : info?.data?.toDate
            ? info.data.toDate()
            : new Date(info.data),
        horaInicio: info?.horaInicio || '',
        horaFim: info?.horaFim || '',
        voluntariosNecessarios: info?.voluntariosNecessarios || 0,
        voluntariosInscritos: info?.voluntariosInscritos || 0,
        ongId: info?.organizadorId || '',
        imagens: info?.imagens || [],
        metas: info?.metas || [],
        orientacoes: info?.orientacoes || '',
        lixoRecolhido: info?.lixoRecolhido || '',
        metasConcluidas: info?.metasConcluidas || [],
        createdAt: info?.createdAt,
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
            data: data?.data instanceof Date
            ? data.data
            : data?.data?.toDate
            ? data.data.toDate()
            : new Date(data.data),
            horaInicio: data?.horaInicio || '',
            horaFim: data?.horaFim || '',
            voluntariosNecessarios: data?.voluntariosNecessarios || 0,
            voluntariosInscritos: data?.voluntariosInscritos || 0,
            ongId: data?.organizadorId || '',
            imagens: data?.imagens || [],
            metas: data?.metas || [],
            orientacoes: data?.orientacoes || '',
            lixoRecolhido: data?.lixoRecolhido || '',
            metasConcluidas: data?.metasConcluidas || [],
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
        orderBy('data', 'asc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      console.log("Total de docs retornados:", snapshot.size);
      snapshot.forEach((doc) => {
        console.log("Doc encontrado:", doc.id, doc.data());
      }); 
      const acoes: Acao[] = [];

      snapshot.forEach((doc) => {
        const info = doc.data();
        acoes.push({
          id: doc.id,
          titulo: info?.titulo || '',
          descricao: info?.descricao || '',
          cidade: info?.cidade || '',
          estado: info?.estado || '',
          data: info?.data instanceof Date
            ? info.data
            : info?.data?.toDate
            ? info.data.toDate()
            : new Date(info.data),
          horaInicio: info?.horaInicio || '',
          horaFim: info?.horaFim || '',
          voluntariosNecessarios: info?.voluntariosNecessarios || 0,
          voluntariosInscritos: info?.voluntariosInscritos || 0,
          ongId: info?.organizadorId || '',
          imagens: info?.imagens || [],
          metas: info?.metas || [],
          orientacoes: info?.orientacoes || '',
          lixoRecolhido: info?.lixoRecolhido || '',
          metasConcluidas: info?.metasConcluidas || [],
          createdAt: info?.createdAt,
        });
      });

      return acoes;
    } catch (error: any) {
      console.error('Erro ao buscar ações ativas:', error);
      throw error;
    }
  },
};

export interface Usuario {
  id?: string;
  nome?: string;
  bio?: string;
  insta?: string;
  razaoSocial?: string;
  createdAt?: any;
}

// Serviço de usuário
export const userService = {

  // Salvar perfil: verifica em 'ongs' e 'users', atualiza onde existir
  async salvarPerfil(userId: string, campos: Partial<Omit<Usuario, 'id' | 'createdAt'>>): Promise<void> {
    try {
      // Verifica nas duas coleções, igual ao AuthContext faz no login
      const ongRef = doc(firestore, 'ongs', userId);
      const ongSnap = await getDoc(ongRef);

      if (ongSnap.exists()) {
        // Usuário é uma ONG → atualiza em 'ongs'
        await updateDoc(ongRef, {
          ...campos,
          updatedAt: serverTimestamp(),
        });
        console.log('Perfil ONG atualizado:', userId);
        return;
      }

      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Usuário comum → atualiza em 'users'
        await updateDoc(userRef, {
          ...campos,
          updatedAt: serverTimestamp(),
        });
        console.log('Perfil user atualizado:', userId);
        return;
      }

      // Não existe em nenhuma → cria em 'users'
      await setDoc(userRef, {
        ...campos,
        createdAt: serverTimestamp(),
      });
      console.log('Perfil criado em users:', userId);
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
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