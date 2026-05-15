import { extra, styles } from "@/styles/_style";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { useAuth } from "@/src/contexts/AuthContext";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { firestore } from "@/src/services/firebase/config";

// Tipos para os dados do histórico
interface HistoricoItem {
  participacao: {
    id: string;
    acaoId: string;
    userId: string;
    dataInscricao: Date;
    status: string;
  };
  acao: {
    id: string;
    titulo: string;
    cidade: string;
    estado: string;
    dataEvento: Date;
    horaInicio: string;
    horaFim: string;
    voluntariosNecessarios: number;
    voluntariosInscritos: number;
    organizadorId: string;
  } | null;
}

export default function HistoricoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar histórico do usuário
  const fetchHistorico = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // 1. Buscar todas as participações do usuário
      const participacoesRef = collection(firestore, "participacoes");
      const participacoesQuery = query(
        participacoesRef,
        where("userId", "==", user.uid)
      );
      const participacoesSnapshot = await getDocs(participacoesQuery);

      const historicoData: HistoricoItem[] = [];

      // 2. Para cada participação, buscar informações da ação correspondente
      for (const participacaoDoc of participacoesSnapshot.docs) {
        const participacaoData = participacaoDoc.data();

        // 3. Buscar ação correspondente
        let acaoData = null;
        try {
          const acaoDocRef = doc(firestore, "acoes", participacaoData.acaoId);
          const acaoDoc = await getDoc(acaoDocRef);

          if (acaoDoc.exists()) {
            acaoData = acaoDoc.data();
          }
        } catch (acaoError) {
          console.error('Erro ao buscar ação:', acaoError);
        }

        historicoData.push({
          participacao: {
            id: participacaoDoc.id,
            acaoId: participacaoData.acaoId,
            userId: participacaoData.userId,
            dataInscricao: participacaoData.dataInscricao?.toDate() || new Date(),
            status: participacaoData.status || 'confirmado',
          },
          acao: acaoData ? {
            id: participacaoData.acaoId,
            titulo: acaoData.titulo || '',
            cidade: acaoData.cidade || '',
            estado: acaoData.estado || '',
            dataEvento: acaoData.dataEvento?.toDate() || new Date(),
            horaInicio: acaoData.horaInicio || '',
            horaFim: acaoData.horaFim || '',
            voluntariosNecessarios: acaoData.voluntariosNecessarios || 0,
            voluntariosInscritos: acaoData.voluntariosInscritos || 0,
            organizadorId: acaoData.organizadorId || '',
          } : null
        });
      }

      setHistorico(historicoData);
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error);
      setError('Erro ao carregar histórico. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect para buscar histórico quando a tela carrega
  useEffect(() => {
    fetchHistorico();
  }, [user]);

  // Função para atualizar os dados (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchHistorico();
  };

  // Função para formatar data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para navegar para detalhes do evento
  const handleNavigateToEvent = (acaoId: string) => {
    // Em produção, você passaria o ID do evento como parâmetro
    router.push(`/detalhes-evento?id=${acaoId}`);
  };

  // Renderizar item do histórico
  const renderHistoricoItem = ({ item }: { item: HistoricoItem }) => {
    if (!item.acao) return null;

    return (
      <TouchableOpacity
        style={localStyles.historicoCard}
        activeOpacity={0.7}
        onPress={() => handleNavigateToEvent(item.acao!.id)}
      >
        <View style={localStyles.cardHeader}>
          <View style={localStyles.tagContainer}>
            <Text style={localStyles.tagText}>{item.acao.cidade}, {item.acao.estado}</Text>
          </View>
          <View style={[
            localStyles.statusBadge,
            item.participacao.status === 'confirmado' ? localStyles.statusConfirmed : localStyles.statusPending
          ]}>
            <Text style={localStyles.statusText}>
              {item.participacao.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
            </Text>
          </View>
        </View>

        <Text style={localStyles.eventTitle}>{item.acao.titulo}</Text>

        <View style={localStyles.eventInfoRow}>
          <View style={localStyles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#A6FF00" />
            <Text style={localStyles.infoText}>
              {formatDate(item.acao.dataEvento)}
            </Text>
          </View>
          <View style={localStyles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#A6FF00" />
            <Text style={localStyles.infoText}>
              {item.acao.horaInicio} - {item.acao.horaFim}
            </Text>
          </View>
        </View>

        <View style={localStyles.volunteersInfo}>
          <Ionicons name="people-outline" size={16} color="#A6FF00" />
          <Text style={localStyles.volunteersText}>
            {item.acao.voluntariosInscritos} de {item.acao.voluntariosNecessarios} voluntários
          </Text>
        </View>

        <View style={localStyles.cardFooter}>
          <Text style={localStyles.inscriptionDate}>
            Inscrito em: {formatDate(item.participacao.dataInscricao)}
          </Text>
          <TouchableOpacity
            style={localStyles.detailsButton}
            onPress={() => handleNavigateToEvent(item.acao!.id)}
          >
            <Text style={localStyles.detailsButtonText}>Ver detalhes</Text>
            <Ionicons name="arrow-forward" size={16} color="#EEE82C" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Renderizar lista vazia
  const renderEmptyList = () => {
    if (loading) return null;

    return (
      <View style={localStyles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color="#A0B3B8" />
        <Text style={localStyles.emptyTitle}>Nenhuma participação encontrada</Text>
        <Text style={localStyles.emptyText}>
          Você ainda não se inscreveu em nenhum evento de voluntariado.
        </Text>
        <TouchableOpacity
          style={localStyles.exploreButton}
          onPress={() => {
            
            if (user?.tipo == "voluntário") {
              router.push('/home_user')

            } else if (user?.tipo == "ong")
              router.push('/home_ong')            
          }}
        >
          <Text style={localStyles.exploreButtonText}>Explorar eventos</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#012A36" }}>
      {/* BOTÃO VOLTAR */}
      <View style={{ position: "absolute", top: 60, left: 24, zIndex: 10 }}>
        <TopGlassButton onPress={() => router.back()} />
      </View>

      <View style={styles.mainContainer}>
        <Image
          source={require("@/assets/images/floresta.png")}
          style={[
            styles.backgroundImageStyle,
            {
              position: "absolute",
              width: "100%",
              height: "45%",
              resizeMode: "cover",
            },
          ]}
        />

        <LinearGradient
          colors={["transparent", "rgba(1, 42, 54, 0.9)", "#012A36"]}
          locations={[0, 0.35, 0.6]}
          style={styles.backgroundGradientOverlay}
        />

        <View style={extra.topContentContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.applicationLogoImage}
          />
          <Text style={extra.mainTitleText}>Meu Histórico</Text>
          <Text style={extra.subtitleDescriptionText}>
            Veja todas as ações de voluntariado{"\n"}que você participou ou está inscrito.
          </Text>
        </View>

        <View style={localStyles.contentContainer}>
          {loading ? (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#EEE82C" />
              <Text style={localStyles.loadingText}>Carregando histórico...</Text>
            </View>
          ) : error ? (
            <View style={localStyles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
              <Text style={localStyles.errorText}>{error}</Text>
              <TouchableOpacity
                style={localStyles.retryButton}
                onPress={fetchHistorico}
              >
                <Text style={localStyles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={historico}
              renderItem={renderHistoricoItem}
              keyExtractor={(item) => item.participacao.id}
              contentContainerStyle={localStyles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#EEE82C"
                  colors={["#EEE82C"]}
                />
              }
              ListEmptyComponent={renderEmptyList}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const TopGlassButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={{
      width: 44,
      height: 44,
      borderRadius: 15,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 44, 59, 0.4)",
      }}
    />
    <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <Rect
        x="0.35"
        y="0.35"
        width="43.3"
        height="43.3"
        rx="14.65"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
      />
      <G>
        <Rect x="2.5" y="2.5" width="39" height="39" rx="15" fill="#EEE82C" />
        <Rect
          x="3"
          y="3"
          width="38"
          height="38"
          rx="14.5"
          stroke="#001A23"
          strokeOpacity="0.4"
        />
        <Path
          d="M25 15 L 18 22 L 25 29"
          stroke="#001A23"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  </TouchableOpacity>
);

const localStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E8F1F2',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#EEE82C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001A23',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historicoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: 'rgba(166, 255, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(166, 255, 0, 0.3)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A6FF00',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(0, 208, 88, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 88, 0.3)',
  },
  statusPending: {
    backgroundColor: 'rgba(238, 232, 44, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(238, 232, 44, 0.3)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E8F1F2',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 26,
  },
  eventInfoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#A0B3B8',
  },
  volunteersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  volunteersText: {
    fontSize: 14,
    color: '#A6FF00',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  inscriptionDate: {
    fontSize: 12,
    color: '#A0B3B8',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EEE82C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#A0B3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#EEE82C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001A23',
  },
});