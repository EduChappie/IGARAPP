import { firestore, serverTimestamp } from "./config";
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
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { Alert } from "react-native";

type ParticipacaoStatus =
  | "confirmado"
  | "pendente"
  | "cancelado"
  | "participando";

export interface Participacao {
  id?: string;
  acaoId: string;
  userId: string;
  dataInscricao: Date;
  status: ParticipacaoStatus;
  createdAt?: any;
}

export interface VoluntarioPresenca {
  participacaoId: string;
  userId: string;
  nome: string;
  status: ParticipacaoStatus;
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
  imagensFinalizacao?: string[];
  metas: string[];
  orientacoes: string;
  lixoRecolhido?: string;
  metasConcluidas?: number[];
  status?: "ativa" | "finalizada";
  finalizadoEm?: any;
  acaoOriginalId?: string;
  createdAt?: any;
}

export interface Usuario {
  id?: string;
  nome?: string;
  bio?: string;
  insta?: string;
  razaoSocial?: string;
  createdAt?: any;
}

const normalizarData = (valor: any): Date => {
  if (valor instanceof Date) return valor;
  if (valor?.toDate) return valor.toDate();
  if (valor) return new Date(valor);
  return new Date();
};

const montarAcao = (
  id: string,
  info: any,
  statusPadrao: "ativa" | "finalizada" = "ativa"
): Acao => {
  return {
    id,
    titulo: info?.titulo || "",
    descricao: info?.descricao || "",
    cidade: info?.cidade || "",
    estado: info?.estado || "",
    data: normalizarData(info?.data),
    horaInicio: info?.horaInicio || "",
    horaFim: info?.horaFim || "",
    voluntariosNecessarios: info?.voluntariosNecessarios || 0,
    voluntariosInscritos: info?.voluntariosInscritos || 0,
    ongId: info?.ongId || info?.organizadorId || "",
    imagens: info?.imagens || [],
    imagensFinalizacao: info?.imagensFinalizacao || [],
    metas: info?.metas || [],
    orientacoes: info?.orientacoes || "",
    lixoRecolhido: info?.lixoRecolhido || "",
    metasConcluidas: info?.metasConcluidas || [],
    status: info?.status || statusPadrao,
    finalizadoEm: info?.finalizadoEm,
    acaoOriginalId: info?.acaoOriginalId,
    createdAt: info?.createdAt,
  };
};

export const participacaoService = {
  async inscreverEmAcao(acaoId: string, userId: string): Promise<string> {
    try {
      const participacoesRef = collection(firestore, "participacoes");

      const docRef = await addDoc(participacoesRef, {
        acaoId,
        userId,
        dataInscricao: new Date(),
        status: "confirmado",
        createdAt: serverTimestamp(),
      });

      console.log("Inscrição realizada com sucesso:", docRef.id);

      return docRef.id;
    } catch (error: any) {
      console.error("Erro ao inscrever em ação:", error);
      throw error;
    }
  },

  async verificarInscricao(acaoId: string, userId: string): Promise<boolean> {
    try {
      const participacoesRef = collection(firestore, "participacoes");

      const q = query(
        participacoesRef,
        where("acaoId", "==", acaoId),
        where("userId", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(q);

      return !snapshot.empty;
    } catch (error: any) {
      console.error("Erro ao verificar inscrição:", error);
      throw error;
    }
  },

  async getParticipacoesUsuario(userId: string): Promise<Participacao[]> {
    try {
      const participacoesRef = collection(firestore, "participacoes");

      // ALTERADO: removido orderBy para evitar índice composto obrigatório no Firebase.
      const q = query(participacoesRef, where("userId", "==", userId));

      const snapshot = await getDocs(q);
      const participacoes: Participacao[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        participacoes.push({
          id: docSnap.id,
          acaoId: data.acaoId,
          userId: data.userId,
          dataInscricao: data.dataInscricao?.toDate?.() || new Date(),
          status: data.status || "confirmado",
          createdAt: data.createdAt,
        });
      });

      return participacoes.sort(
        (a, b) => b.dataInscricao.getTime() - a.dataInscricao.getTime()
      );
    } catch (error: any) {
      console.error("Erro ao buscar participações:", error);
      throw error;
    }
  },

  async cancelarParticipacao(participacaoId: string): Promise<void> {
    try {
      const participacaoRef = doc(firestore, "participacoes", participacaoId);

      await updateDoc(participacaoRef, {
        status: "cancelado",
        updatedAt: serverTimestamp(),
      });

      console.log("Participação cancelada:", participacaoId);
    } catch (error: any) {
      console.error("Erro ao cancelar participação:", error);
      throw error;
    }
  },

  async getVoluntariosDaAcao(acaoId: string): Promise<VoluntarioPresenca[]> {
    try {
      const participacoesRef = collection(firestore, "participacoes");
      const q = query(participacoesRef, where("acaoId", "==", acaoId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return [];

      const voluntarios: VoluntarioPresenca[] = [];

      const promises = snapshot.docs.map(async (participacaoDoc) => {
        const data = participacaoDoc.data();

        const userRef = doc(firestore, "users", data.userId);
        const userSnap = await getDoc(userRef);

        const nome = userSnap.exists()
          ? userSnap.data()?.nome || userSnap.data()?.razaoSocial || "Usuário"
          : "Usuário";

        voluntarios.push({
          participacaoId: participacaoDoc.id,
          userId: data.userId,
          nome,
          status: data.status || "confirmado",
        });
      });

      await Promise.all(promises);

      return voluntarios;
    } catch (error: any) {
      console.error("Erro ao buscar voluntários da ação:", error);
      throw error;
    }
  },

  async togglePresenca(
    participacaoId: string,
    statusAtual: ParticipacaoStatus
  ): Promise<"confirmado" | "cancelado"> {
    try {
      const novoStatus =
        statusAtual === "confirmado" ? "cancelado" : "confirmado";

      const participacaoRef = doc(firestore, "participacoes", participacaoId);

      await updateDoc(participacaoRef, {
        status: novoStatus,
        updatedAt: serverTimestamp(),
      });

      console.log("Presença atualizada:", participacaoId, novoStatus);

      return novoStatus;
    } catch (error: any) {
      console.error("Erro ao atualizar presença:", error);
      throw error;
    }
  },
};

export const acaoService = {
  async moverParaHistorico(eventoId: string): Promise<void> {
    try {
      const eventoRef = doc(firestore, "acoes", eventoId);

      // ALTERADO: histórico agora usa o mesmo ID da ação original.
      const historicoRef = doc(firestore, "historico", eventoId);

      const eventoSnap = await getDoc(eventoRef);

      if (!eventoSnap.exists()) {
        throw new Error("Evento não encontrado");
      }

      const dadosEvento = eventoSnap.data();
      const batch = writeBatch(firestore);

      batch.set(historicoRef, {
        ...dadosEvento,
        acaoOriginalId: eventoId,
        status: "finalizada",
        finalizadoEm: serverTimestamp(),
        movidoEm: serverTimestamp(),
      });

      batch.delete(eventoRef);

      await batch.commit();

      console.log("Evento movido para histórico:", eventoId);
    } catch (error) {
      console.error("Erro ao mover evento:", error);
      throw error;
    }
  },

  async criarAcao(acao: Omit<Acao, "id" | "createdAt">): Promise<string> {
    try {
      const acoesRef = collection(firestore, "acoes");

      const docRef = await addDoc(acoesRef, {
        ...acao,
        status: acao.status || "ativa",
        data: Timestamp.fromDate(new Date(acao.data)),
        createdAt: serverTimestamp(),
      });

      console.log("Ação criada com sucesso:", docRef.id);

      return docRef.id;
    } catch (error: any) {
      console.error("Erro ao criar ação:", error);
      throw error;
    }
  },

  async editarAcao(
    acaoId: string,
    campos: Partial<Omit<Acao, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const acaoRef = doc(firestore, "acoes", acaoId);

      await updateDoc(acaoRef, {
        ...campos,
        updatedAt: serverTimestamp(),
      });

      console.log("Ação editada com sucesso:", acaoId);
    } catch (error: any) {
      console.error("Erro ao editar ação:", error);
      throw error;
    }
  },

  async getAcaoById(acaoId: string): Promise<Acao | null> {
    try {
      const acaoRef = doc(firestore, "acoes", acaoId);
      const acaoDoc = await getDoc(acaoRef);

      if (!acaoDoc.exists()) {
        return null;
      }

      return montarAcao(acaoDoc.id, acaoDoc.data(), "ativa");
    } catch (error: any) {
      console.error("Erro ao buscar ação:", error);
      throw error;
    }
  },

  // ALTERADO: busca ação finalizada na collection historico.
  async getHistoricoById(acaoId: string): Promise<Acao | null> {
    try {
      const historicoRef = doc(firestore, "historico", acaoId);
      const historicoDoc = await getDoc(historicoRef);

      if (!historicoDoc.exists()) {
        return null;
      }

      return montarAcao(historicoDoc.id, historicoDoc.data(), "finalizada");
    } catch (error: any) {
      console.error("Erro ao buscar histórico:", error);
      throw error;
    }
  },

  async getAcoesByIds(acaoIds: string[]): Promise<Acao[]> {
    try {
      if (acaoIds.length === 0) return [];

      const promises = acaoIds.slice(0, 10).map(async (id) => {
        const acaoRef = doc(firestore, "acoes", id);
        const acaoSnap = await getDoc(acaoRef);

        if (acaoSnap.exists()) {
          return montarAcao(acaoSnap.id, acaoSnap.data(), "ativa");
        }

        const historicoRef = doc(firestore, "historico", id);
        const historicoSnap = await getDoc(historicoRef);

        if (historicoSnap.exists()) {
          return montarAcao(historicoSnap.id, historicoSnap.data(), "finalizada");
        }

        return null;
      });

      const resultados = await Promise.all(promises);

      return resultados.filter((acao): acao is Acao => acao !== null);
    } catch (error: any) {
      console.error("Erro ao buscar ações:", error);
      throw error;
    }
  },

  async getAcoesAtivas(limitCount: number = 10): Promise<Acao[]> {
    try {
      const acoesRef = collection(firestore, "acoes");
      const q = query(acoesRef, orderBy("data", "asc"), limit(limitCount));

      const snapshot = await getDocs(q);
      const acoes: Acao[] = [];

      snapshot.forEach((docSnap) => {
        acoes.push(montarAcao(docSnap.id, docSnap.data(), "ativa"));
      });

      return acoes;
    } catch (error: any) {
      console.error("Erro ao buscar ações ativas:", error);
      throw error;
    }
  },
};

export const userService = {
  async salvarPerfil(
    userId: string,
    campos: Partial<Omit<Usuario, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const ongRef = doc(firestore, "ongs", userId);
      const ongSnap = await getDoc(ongRef);

      if (ongSnap.exists()) {
        await updateDoc(ongRef, {
          ...campos,
          updatedAt: serverTimestamp(),
        });

        console.log("Perfil ONG atualizado:", userId);

        return;
      }

      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          ...campos,
          updatedAt: serverTimestamp(),
        });

        console.log("Perfil user atualizado:", userId);

        return;
      }

      await setDoc(userRef, {
        ...campos,
        createdAt: serverTimestamp(),
      });

      console.log("Perfil criado em users:", userId);
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      throw error;
    }
  },
};

export const getHistoricoUsuario = async (userId: string) => {
  try {
    const participacoes = await participacaoService.getParticipacoesUsuario(
      userId
    );

    if (participacoes.length === 0) {
      return [];
    }

    const acaoIds = [...new Set(participacoes.map((p) => p.acaoId))];
    const acoes = await acaoService.getAcoesByIds(acaoIds);
    const acoesMap = new Map(acoes.map((acao) => [acao.id, acao]));

    return participacoes.map((participacao) => {
      const acao = acoesMap.get(participacao.acaoId);

      return {
        participacao,
        acao: acao || null,
      };
    });
  } catch (error: any) {
    console.error("Erro ao buscar histórico do usuário:", error);
    throw error;
  }
};

export const showSuccessAlert = (message: string) => {
  Alert.alert("Sucesso!", message, [{ text: "OK", style: "default" }]);
};

export const showErrorAlert = (message: string) => {
  Alert.alert("Erro", message, [{ text: "OK", style: "cancel" }]);
};