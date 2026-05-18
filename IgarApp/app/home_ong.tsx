// home_ong.tsx
// MERGE: Base visual do CÓDIGO 2 + Lógica Firebase/Cloudinary do CÓDIGO 1

import { useAuth } from "@/src/contexts/AuthContext";
import {
  acaoService,
  participacaoService,
  Acao,
  VoluntarioPresenca,
  showSuccessAlert,
  showErrorAlert,
} from "@/src/services/firebase/firestoreService";
import { uploadMultiplasImagens } from "@/src/services/cloudnaryService";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeOffset,
  Filter,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function HomeOngScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // ── Feed ──────────────────────────────────────────────────────────────────
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAcoes = async () => {
      try {
        const dados = await acaoService.getAcoesAtivas();
        setAcoes(dados);
      } catch (error) {
        console.error("Erro ao carregar ações:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarAcoes();
  }, []);

  // ── Modal de finalizar ────────────────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<any>(null);
  const [lixoRecolhido, setLixoRecolhido] = useState("");
  const [metasConcluidas, setMetasConcluidas] = useState<number[]>([]);
  const [buscaVoluntario, setBuscaVoluntario] = useState("");
  const [loadingFinalizar, setLoadingFinalizar] = useState(false);

  // ── Voluntários ───────────────────────────────────────────────────────────
  const [voluntarios, setVoluntarios] = useState<VoluntarioPresenca[]>([]);
  const [loadingVoluntarios, setLoadingVoluntarios] = useState(false);

  // ── Fotos da ação finalizada ("depois") ───────────────────────────────────
  const [fotosFinalizacaoUri, setFotosFinalizacaoUri] = useState<string[]>([]);
  const [uploadandoFotos, setUploadandoFotos] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Selecionar fotos da ação finalizada (máx 5)
  // ─────────────────────────────────────────────────────────────────────────
  const selecionarFotosFinalizacao = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos acessar sua galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((a) => a.uri);
      setFotosFinalizacaoUri((prev) => [...prev, ...uris].slice(0, 5));
    }
  };

  const removerFotoFinalizacao = (index: number) => {
    setFotosFinalizacaoUri((prev) => prev.filter((_, i) => i !== index));
  };

  // ─────────────────────────────────────────────────────────────────────────
  const abrirModalFinalizar = (cardData: any, acaoOriginal: Acao) => {
    setAcaoSelecionada({ ...cardData, metas: acaoOriginal.metas });
    setLixoRecolhido("");
    setMetasConcluidas([]);
    setBuscaVoluntario("");
    setVoluntarios([]);
    setFotosFinalizacaoUri([]);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setTimeout(() => setAcaoSelecionada(null), 300);
  };

  useEffect(() => {
    if (!modalVisible || !acaoSelecionada?.id) return;

    acaoService.getAcaoById(acaoSelecionada.id).then((acao) => {
      if (!acao) return;
      setLixoRecolhido(acao.lixoRecolhido || "");
      setMetasConcluidas(acao.metasConcluidas || []);
    });

    setLoadingVoluntarios(true);
    participacaoService
      .getVoluntariosDaAcao(acaoSelecionada.id)
      .then(setVoluntarios)
      .catch(() => showErrorAlert("Erro ao carregar lista de voluntários."))
      .finally(() => setLoadingVoluntarios(false));
  }, [modalVisible, acaoSelecionada?.id]);

  // ─────────────────────────────────────────────────────────────────────────
  // Finalizar ação
  // ─────────────────────────────────────────────────────────────────────────
  const handleFinalizarAcao = async () => {
    if (!acaoSelecionada?.id) {
      showErrorAlert("Ação inválida. Tente novamente.");
      return;
    }

    try {
      setLoadingFinalizar(true);

      let urlsFotosFinalizacao: string[] = [];
      if (fotosFinalizacaoUri.length > 0) {
        setUploadandoFotos(true);
        urlsFotosFinalizacao = await uploadMultiplasImagens(
          fotosFinalizacaoUri,
          "acao",
        );
        setUploadandoFotos(false);
      }

      await acaoService.editarAcao(acaoSelecionada.id, {
        lixoRecolhido: lixoRecolhido.trim(),
        metasConcluidas,
        ...(urlsFotosFinalizacao.length > 0 && {
          imagensFinalizacao: urlsFotosFinalizacao,
        }),
      });

      acaoService.moverParaHistorico(acaoSelecionada.id);

      showSuccessAlert("Ação finalizada com sucesso!");
      fecharModal();
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      showErrorAlert("Não foi possível finalizar a ação. Tente novamente.");
    } finally {
      setLoadingFinalizar(false);
      setUploadandoFotos(false);
    }
  };

  const toggleMeta = (index: number) => {
    if (metasConcluidas.includes(index)) {
      setMetasConcluidas(metasConcluidas.filter((i) => i !== index));
    } else {
      setMetasConcluidas([...metasConcluidas, index]);
    }
  };

  const handleTogglePresenca = async (voluntario: VoluntarioPresenca) => {
    try {
      const novoStatus = await participacaoService.togglePresenca(
        voluntario.participacaoId,
        voluntario.status,
      );
      setVoluntarios((prev) =>
        prev.map((v) =>
          v.participacaoId === voluntario.participacaoId
            ? { ...v, status: novoStatus }
            : v,
        ),
      );
    } catch {
      showErrorAlert("Erro ao atualizar presença.");
    }
  };

  const voluntariadosFiltrados = voluntarios.filter((v) =>
    v.nome.toLowerCase().includes(buscaVoluntario.toLowerCase()),
  );

  return (
    <LinearGradient
      colors={["#044A60", "#012A36", "#012A36"]}
      locations={[0, 0.3, 1]}
      style={styles.mainContainer}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* CONTEÚDO PRINCIPAL ROLÁVEL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <SafeAreaView>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTextRow}>
              <View style={styles.headerLogoContainer}>
                <LogoTelaInicialSVG />
              </View>
              <View>
                <Text style={styles.greetingText}>
                  Olá, {user?.razaoSocial}
                </Text>
                <Text style={styles.userNameText}>
                  Pronto para salvar a amazônia hoje?
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.adicionarButton}
              activeOpacity={0.8}
              onPress={() => router.push("../criar-acao")}
            >
              <PositiveIconYellowSVG />
            </TouchableOpacity>
          </View>

          {/* BARRA DE PESQUISA */}
          <View style={styles.searchBarContainer}>
            <SearchIcon />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar..."
              placeholderTextColor="rgba(232, 241, 242, 0.7)"
            />
          </View>

          {/* FEED */}
          <View style={styles.feedContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#91CB3E"
                style={{ marginTop: 40 }}
              />
            ) : (
              acoes.map((acao) => {
                const cardData = {
                  id: acao.id!,
                  ongId: acao.ongId,
                  orgName: `${acao.cidade}, ${acao.estado}`,
                  title: acao.titulo,
                  subtitle: `${acao.cidade}, ${acao.estado}`,
                  volunteers: `${acao.voluntariosInscritos} Voluntários`,
                  date: acao.data.toLocaleDateString("pt-BR"),
                  time: `${acao.horaInicio} - ${acao.horaFim}`,
                  images:
                    acao.imagens && acao.imagens.length > 0
                      ? acao.imagens.map((url) => ({ uri: url }))
                      : [require("../src/assets/image_card_1.png")],
                };

                const isProprietaria = user?.uid === acao.ongId;

                return (
                  <ProjectCard
                    key={cardData.id}
                    data={cardData}
                    isProprietaria={isProprietaria}
                    onPressCard={() => {
                      if (isProprietaria) {
                        abrirModalFinalizar(cardData, acao);
                      } else {
                        router.push(`./detalhes-evento?id=${acao.id}`);
                      }
                    }}
                    onPressEditar={() =>
                      router.push(`./editar_acao?id=${acao.id}`)
                    }
                  />
                );
              })
            )}
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* ── MODAL ─────────────────────────────────────────────────────────── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CloseGlassButton onPress={fecharModal} />
              <Text style={styles.modalTitle}>Finalizar Ação</Text>
              <View style={{ width: 44 }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.modalSubTitle}>{acaoSelecionada?.title}</Text>
              <Text style={styles.modalInfoText}>
                {acaoSelecionada
                  ? acaoSelecionada.date + " • " + acaoSelecionada.time
                  : ""}
              </Text>

              {/* Quantidade de Lixo */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Quantidade de Lixo Recolhido
                </Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ex: 300kg ou 40 sacos..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={lixoRecolhido}
                    onChangeText={setLixoRecolhido}
                    keyboardType="default"
                  />
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="rgba(255,255,255,0.5)"
                    style={{ marginRight: 15 }}
                  />
                </View>
              </View>

              {/* Checklist de Metas */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Checklist de Metas</Text>
                {(acaoSelecionada?.metas || []).map(
                  (meta: string, index: number) => {
                    const isChecked = metasConcluidas.includes(index);
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        style={[
                          styles.checkboxRow,
                          isChecked ? styles.checkboxRowActive : null,
                        ]}
                        onPress={() => toggleMeta(index)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            isChecked ? styles.checkboxActive : null,
                          ]}
                        >
                          {isChecked ? (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color="#001A23"
                            />
                          ) : null}
                        </View>
                        <Text
                          style={[
                            styles.checkboxText,
                            isChecked ? styles.checkboxTextActive : null,
                          ]}
                        >
                          {meta}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>

              {/* ── FOTOS DA AÇÃO FINALIZADA ─────────────────────────────── */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Fotos da Ação Finalizada
                </Text>

                {/* Preview das fotos selecionadas */}
                {fotosFinalizacaoUri.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 12 }}
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 2 }}
                  >
                    {fotosFinalizacaoUri.map((uri, index) => (
                      <View key={index} style={styles.previewImageWrapper}>
                        <Image source={{ uri }} style={styles.previewImage} />
                        <TouchableOpacity
                          style={styles.previewRemoveBtn}
                          onPress={() => removerFotoFinalizacao(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#FFF"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {/* Botão de seleção / área de upload */}
                <TouchableOpacity
                  style={styles.uploadMainContainer}
                  activeOpacity={0.8}
                  onPress={selecionarFotosFinalizacao}
                  disabled={uploadandoFotos}
                >
                  <View style={styles.uploadDashedArea}>
                    <LinearGradient
                      colors={["#004E69", "#003446"]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.uploadContent}>
                      {uploadandoFotos ? (
                        <>
                          <ActivityIndicator color="#EEE82C" size="large" />
                          <Text style={styles.uploadTitle}>
                            Enviando fotos...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.uploadTitle}>
                            {fotosFinalizacaoUri.length > 0
                              ? `${fotosFinalizacaoUri.length} foto(s) — toque para adicionar mais`
                              : "Adicionar fotos do evento"}
                          </Text>
                          <View style={styles.uploadIconCircle}>
                            <UploadIconSVG />
                          </View>
                          <Text style={styles.uploadSub}>
                            Toque para fazer upload · Máx 5 imagens
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Lista de Presença */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Lista de Presença</Text>
                <View style={styles.modalSearchContainer}>
                  <Ionicons
                    name="search"
                    size={18}
                    color="rgba(255,255,255,0.5)"
                  />
                  <TextInput
                    style={styles.modalSearchInput}
                    placeholder="Buscar voluntário..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={buscaVoluntario}
                    onChangeText={setBuscaVoluntario}
                  />
                </View>

                {loadingVoluntarios ? (
                  <ActivityIndicator
                    color="#EEE82C"
                    style={{ marginTop: 16 }}
                  />
                ) : voluntariadosFiltrados.length === 0 ? (
                  <Text style={styles.semVoluntariosText}>
                    Nenhum voluntário inscrito.
                  </Text>
                ) : (
                  <View style={styles.voluntariosList}>
                    {voluntariadosFiltrados.map((voluntario) => (
                      <View
                        key={voluntario.participacaoId}
                        style={styles.voluntarioRow}
                      >
                        <View style={styles.voluntarioInfo}>
                          <View style={styles.voluntarioAvatar}>
                            <Text style={styles.voluntarioAvatarText}>
                              {voluntario.nome.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.voluntarioNome}>
                            {voluntario.nome}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.presencaBtn,
                            voluntario.status === "cancelado" &&
                              styles.presencaBtnAusente,
                          ]}
                          onPress={() => handleTogglePresenca(voluntario)}
                        >
                          <Text
                            style={[
                              styles.presencaBtnText,
                              voluntario.status === "cancelado" &&
                                styles.presencaBtnTextAusente,
                            ]}
                          >
                            {voluntario.status === "confirmado"
                              ? "Presente"
                              : "Ausente"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Rodapé com botões */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButtonVoltar}
                onPress={fecharModal}
              >
                <Text style={styles.modalButtonVoltarText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButtonFinalizar,
                  (loadingFinalizar || uploadandoFotos) && { opacity: 0.7 },
                ]}
                onPress={handleFinalizarAcao}
                disabled={loadingFinalizar || uploadandoFotos}
              >
                {loadingFinalizar ? (
                  <ActivityIndicator color="#001A23" />
                ) : (
                  <Text style={styles.modalButtonFinalizarText}>
                    Finalizar Ação
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

// ── Card com carrossel animado ─────────────────────────────────────────────────

const ProjectCard = ({
  data,
  isProprietaria,
  onPressCard,
  onPressEditar,
}: {
  data: any;
  isProprietaria: boolean;
  onPressCard: () => void;
  onPressEditar: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= data.images.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* CABEÇALHO DO CARD */}
      <View style={styles.cardHeader}>
        <View style={styles.orgInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../src/assets/globo.png")}
              style={{ width: 28, height: 28, borderRadius: 14 }}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.orgName}>{data.orgName}</Text>
          <VerifiedPeixinhoBadge />
        </View>
      </View>

      {/* CORPO DO CARD (CLICÁVEL → abre modal ou navega para eventos) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPressCard}
        style={styles.cardBody}
      >
        {/* CARROSSEL DE IMAGENS */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={data.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                {/* item pode ser { uri: "..." } (Cloudinary) ou require(...) (local) */}
                <Image source={item} style={styles.cardImage} />
              </View>
            )}
          />

          {/* DEPOIS — correto, usa a prop recebida */}
          {isProprietaria && (
            <TouchableOpacity
              style={styles.editarAcaoButton}
              onPress={(e) => {
                e.stopPropagation();
                onPressEditar();
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="pencil" size={11} color="#FFFFFF" />
              <Text style={styles.editarAcaoText}>Editar ação</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PAGINAÇÃO */}
        <View style={styles.pagination}>
          {data.images.map((_: any, i: number) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.projectTitle}>{data.title}</Text>
        <Text style={styles.projectSubtitle}>{data.subtitle}</Text>

        {/* PILL (RODAPÉ DO CARD) */}
        <View style={styles.pillContainer}>
          <View style={styles.pillItem}>
            <HappyFaceIcon />
            <Text style={styles.pillText}>{data.volunteers}</Text>
          </View>
          <View style={styles.pillItem}>
            <CalendarIcon />
            <Text style={styles.pillText}>{data.date}</Text>
          </View>
          <View style={styles.pillItem}>
            <ClockIcon />
            <Text style={styles.pillText}>{data.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ── Ícones SVG inline ──────────────────────────────────────────────────────────

const UploadIconSVG = () => (
  <Svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <Path
      d="M12.98 0.81C12.73 0.55 12.42 0.34 12.09 0.21C11.75 0.07 11.39 0 11.03 0C10.66 0 10.3 0.07 9.97 0.21C9.63 0.34 9.33 0.55 9.07 0.81L6.11 3.77C5.95 3.94 5.87 4.17 5.87 4.41C5.88 4.64 5.97 4.87 6.14 5.04C6.31 5.2 6.54 5.3 6.77 5.31C7.01 5.31 7.24 5.23 7.41 5.07L10.11 2.37L10.1 16.59C10.1 16.84 10.2 17.07 10.37 17.24C10.55 17.42 10.78 17.51 11.03 17.51C11.27 17.51 11.51 17.42 11.68 17.24C11.85 17.07 11.95 16.84 11.95 16.59L11.96 2.39L14.64 5.07C14.81 5.24 15.05 5.34 15.29 5.34C15.54 5.34 15.77 5.24 15.94 5.07C16.12 4.89 16.21 4.66 16.21 4.41C16.21 4.17 16.12 3.94 15.94 3.76L12.98 0.81Z"
      fill="#E8F1F2"
    />
    <Path
      d="M21.2 14.75C20.96 14.75 20.72 14.84 20.55 15.02C20.38 15.19 20.28 15.42 20.28 15.67V19.36C20.28 19.6 20.18 19.84 20.01 20.01C19.84 20.18 19.6 20.28 19.36 20.28H2.76C2.52 20.28 2.28 20.18 2.11 20.01C1.94 19.84 1.84 19.6 1.84 19.36V15.67C1.84 15.42 1.74 15.19 1.57 15.02C1.4 14.84 1.16 14.75 0.92 14.75C0.67 14.75 0.44 14.84 0.27 15.02C0.09 15.19 0 15.42 0 15.67V19.36C0 20.09 0.29 20.79 0.81 21.31C1.32 21.83 2.03 22.12 2.76 22.12H19.36C20.09 22.12 20.79 21.83 21.31 21.31C21.83 20.79 22.12 20.09 22.12 19.36V15.67C22.12 15.42 22.03 15.19 21.85 15.02C21.68 14.84 21.45 14.75 21.2 14.75Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const CloseGlassButton = ({ onPress }: { onPress: () => void }) => (
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
      <G filter="url(#filter1_close_btn)">
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
          d="M16 28L28 16M16 16L28 28"
          stroke="#001A23"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <Filter
          id="filter1_close_btn"
          x="2.5"
          y="2.5"
          width="39"
          height="39"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="-3" />
          <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <FeBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_close"
          />
        </Filter>
      </Defs>
    </Svg>
  </TouchableOpacity>
);

const PositiveIconYellowSVG = () => (
  <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <Path
      d="M10.5417 5.04167H5.95833V0.458333C5.95833 0.336776 5.91004 0.220197 5.82409 0.134243C5.73814 0.0482886 5.62156 0 5.5 0V0C5.37844 0 5.26186 0.0482886 5.17591 0.134243C5.08996 0.220197 5.04167 0.336776 5.04167 0.458333V5.04167H0.458333C0.336776 5.04167 0.220197 5.08996 0.134243 5.17591C0.0482886 5.26186 0 5.37844 0 5.5H0C0 5.62156 0.0482886 5.73814 0.134243 5.82409C0.220197 5.91004 0.336776 5.95833 0.458333 5.95833H5.04167V10.5417C5.04167 10.6632 5.08996 10.7798 5.17591 10.8658C5.26186 10.9517 5.37844 11 5.5 11C5.62156 11 5.73814 10.9517 5.82409 10.8658C5.91004 10.7798 5.95833 10.6632 5.95833 10.5417V5.95833H10.5417C10.6632 5.95833 10.7798 5.08996 10.8658 5.82409C10.9517 5.73814 11 5.62156 11 5.5C11 5.37844 10.9517 5.26186 10.8658 5.17591C10.7798 5.08996 10.6632 5.04167 10.5417 5.04167Z"
      fill="#EEE82C"
    />
  </Svg>
);

const LogoTelaInicialSVG = () => (
  <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <Path
      d="M35.7139 0C43.6036 0 50 6.39635 50 14.2861V35.7139C50 43.6036 43.6036 50 35.7139 50H14.2861C6.39635 50 0 43.6036 0 35.7139V14.2861C0 6.39635 6.39635 0 14.2861 0H35.7139ZM28.2266 23.7783C17.781 12.5312 14.5498 14.0113 4.26074 24.8105C5.52978 26.1425 6.69235 27.3352 7.77344 28.3828L8.05371 28.6689C8.05651 28.6662 8.05873 28.6629 8.06152 28.6602C15.7928 36.0624 19.416 35.7765 29.125 25.083L29.2852 24.9316L29.2744 24.9209C35.4714 19.1301 38.3453 17.965 40.3418 17.9648C44.5475 17.9648 45.7654 23.2645 41.7812 25.0312C45.7656 27.6813 44.9903 32.3193 40.3418 32.3193C35.5604 32.319 31.2917 27.7088 31.2666 27.6816C31.2562 27.6905 30.6081 28.247 30.2705 28.6748C31.2666 29.7789 36.1838 34.3772 40.3418 33.9756C43.6621 34.3068 48.3114 29.6687 43.9951 25.0312C47.7577 20.6147 43.4407 16.1982 40.3418 16.1982C36.1363 16.64 33.4283 18.6993 28.2266 23.7783ZM15.0898 18.4023C16.2169 18.1294 17.3059 18.1327 18.4326 18.4131C18.2988 18.7582 18.2191 19.3059 18.1133 20.0176C17.6603 23.1206 17.6817 26.585 18.1855 29.8447C18.2868 30.5065 18.3815 30.9801 18.5 31.3281C17.3739 31.6011 16.2873 31.5987 15.1641 31.3203C15.3081 30.9576 15.4061 30.4361 15.5088 29.6523C15.9423 26.3826 15.8889 22.9188 15.3691 19.8262C15.2603 19.1889 15.1954 18.7223 15.0898 18.4023ZM21.6582 19.8662C22.5978 20.4532 23.5947 21.1973 24.6836 22.0947C24.5529 22.3057 24.4367 22.526 24.3359 22.7539C24.0494 23.4021 23.8931 24.1003 23.877 24.8086C23.8608 25.517 23.9853 26.2221 24.2422 26.8828C24.3589 27.183 24.5034 27.4707 24.6709 27.7441C23.5847 28.6322 22.5901 29.3649 21.6523 29.9395C21.5361 29.7407 21.3514 29.4647 21.1611 29.2178C19.8383 27.4963 19.4335 26.569 19.4111 25.1377C19.3892 23.7369 19.7357 22.7851 20.7959 21.3408C21.3423 20.5996 21.5683 20.2187 21.6582 19.8662ZM11.8496 19.8408C11.9617 20.1676 12.2023 20.5386 12.7168 21.2061C13.8079 22.6273 14.1744 23.5717 14.1826 24.9727C14.1912 26.4042 13.807 27.3403 12.5215 29.0898C12.3078 29.3798 12.1012 29.7076 11.998 29.9092C11.0319 29.3137 10.0057 28.5534 8.88184 27.6328C9.01962 27.4089 9.14204 27.1753 9.24609 26.9326C9.52543 26.2811 9.67349 25.5806 9.68164 24.8721C9.68979 24.1636 9.55813 23.4604 9.29395 22.8027C9.18117 22.5221 9.04313 22.2529 8.88574 21.9961C9.95075 21.1304 10.9278 20.4105 11.8496 19.8408ZM23.126 24.3916C22.5624 23.2177 21.0358 23.1503 20.3906 24.2588C20.1547 24.6672 20.0993 25.0212 20.208 25.3994C20.2564 25.5652 20.3817 25.806 20.4902 25.9473C20.7269 26.2434 21.2747 26.5479 21.5986 26.5566C22.7223 26.587 23.5962 25.346 23.126 24.3916ZM12.0273 23.3408C10.9606 23.299 10.17 24.3349 10.4668 25.374C10.5032 25.5005 10.6684 25.7494 10.8359 25.9258C11.4615 26.5838 12.3434 26.601 13.0107 25.9648C13.2899 25.7014 13.4233 25.4603 13.4863 25.0918C13.6291 24.2232 12.9218 23.3782 12.0273 23.3408Z"
      fill="#EEE82C"
    />
  </Svg>
);

const VerifiedPeixinhoBadge = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.59277 0.466797C7.24872 -0.155604 8.27765 -0.155604 8.93359 0.466797L9.52637 1.0293C9.86833 1.35377 10.3303 1.52192 10.8008 1.49316L11.6172 1.44336C12.5194 1.38848 13.3066 2.04924 13.4092 2.94727L13.502 3.76074C13.5554 4.22896 13.8009 4.65423 14.1797 4.93457L14.8369 5.4209C15.5637 5.95876 15.743 6.97155 15.2441 7.72559L14.792 8.40723C14.5319 8.80021 14.4468 9.28393 14.5566 9.74219L14.748 10.5381C14.9589 11.4171 14.4448 12.3074 13.5781 12.5645L12.7939 12.7969C12.342 12.9308 11.9653 13.2462 11.7549 13.668L11.3896 14.4004C10.9861 15.2093 10.0205 15.5605 9.19141 15.2002L8.44043 14.875C8.00817 14.6871 7.5172 14.6871 7.08496 14.875L6.33496 15.2002C5.50571 15.5607 4.53925 15.2096 4.13574 14.4004L3.77148 13.668C3.56111 13.2462 3.18436 12.9308 2.73242 12.7969L1.94824 12.5645C1.08148 12.3075 0.567422 11.4172 0.77832 10.5381L0.96875 9.74219C1.07867 9.28388 0.993511 8.80026 0.733398 8.40723L0.282227 7.72559C-0.216688 6.97163 -0.0381256 5.95883 0.688477 5.4209L1.34668 4.93457C1.72543 4.65422 1.97095 4.22891 2.02441 3.76074L2.11621 2.94727C2.21879 2.04913 3.00687 1.38836 3.90918 1.44336L4.72559 1.49316C5.19611 1.52192 5.65804 1.35377 6 1.0293L6.59277 0.466797Z"
      fill="url(#paint0_radial_home_ong)"
    />
    <Defs>
      <RadialGradient
        id="paint0_radial_home_ong"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(7.76321 3.71168) rotate(90) scale(11.6299 11.77)"
      >
        <Stop stopColor="#EEE82C" />
        <Stop offset="1" stopColor="#91CB3E" />
      </RadialGradient>
    </Defs>
  </Svg>
);

const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.71875 0C3.4558 0 0 3.4558 0 7.71875C0 11.9817 3.4558 15.4375 7.71875 15.4375C11.9817 15.4375 15.4375 11.9817 15.4375 7.71875C15.4375 3.4558 11.9817 0 7.71875 0ZM1.1875 7.71875C1.1875 4.11164 4.11164 1.1875 7.71875 1.1875C11.3259 1.1875 14.25 4.11164 14.25 7.71875C14.25 11.3259 11.3259 14.25 7.71875 14.25C4.11164 14.25 1.1875 11.3259 1.1875 7.71875Z"
      fill="#E8F1F2"
      fillOpacity="0.7"
    />
    <Path
      d="M14.472 13.6323C14.2401 13.4004 13.8642 13.4004 13.6323 13.6323C13.4004 13.8642 13.4004 14.2401 13.6323 14.472L16.7989 17.6386C17.0307 17.8705 17.4067 17.8705 17.6386 17.6386C17.8704 17.4068 17.8704 17.0308 17.6386 16.7989L14.472 13.6323Z"
      fill="#E8F1F2"
      fillOpacity="0.7"
    />
  </Svg>
);

const HappyFaceIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <Path
      d="M5 10C4.0111 10 3.0444 9.70676 2.22215 9.15735C1.39991 8.60794 0.759043 7.82705 0.380605 6.91342C0.00216643 5.99979 -0.0968503 4.99446 0.0960758 4.02455C0.289002 3.05465 0.765206 2.16373 1.46447 1.46447C2.16373 0.765206 3.05465 0.289002 4.02455 0.0960758C4.99446 -0.0968503 5.99979 0.00216643 6.91342 0.380605C7.82705 0.759043 8.60794 1.39991 9.15735 2.22215C9.70676 3.0444 10 4.0111 10 5C9.99857 6.32564 9.47132 7.59658 8.53395 8.53395C7.59658 9.47132 6.32564 9.99857 5 10V10Z"
      fill="#001A23"
      fillOpacity="0.5"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <Path
      d="M3.375 1.5V2.625M8.625 1.5V2.625M1.5 9.375V3.75C1.5 3.12868 2.00368 2.625 2.625 2.625H9.375C9.99632 2.625 10.5 3.12868 10.5 3.75V9.375M1.5 9.375C1.5 9.99632 2.00368 10.5 2.625 10.5H9.375C9.99632 10.5 10.5 9.99632 10.5 9.375M1.5 9.375V5.625C1.5 5.00368 2.00368 4.5 2.625 4.5H9.375C9.99632 4.5 10.5 5.00368 10.5 5.625V9.375"
      stroke="#001A23"
      strokeOpacity="0.5"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <Path
      d="M5.41681 0.854583V0.416667C5.41681 0.30616 5.37291 0.200179 5.29477 0.122039C5.21663 0.0438987 5.11065 0 5.00014 0C4.88964 0 4.78366 0.0438987 4.70552 0.122039C4.62738 0.200179 4.58348 0.30616 4.58348 0.416667V0.854583C3.74463 0.929787 2.94282 1.23509 2.26639 1.73684C1.58996 2.2386 1.06516 2.91734 0.749805 3.69828C0.434454 4.47923 0.340793 5.33207 0.479142 6.16284C0.617491 6.99361 0.982479 7.77007 1.53389 8.40667C1.31613 8.51439 1.13416 8.68278 1.00989 8.89155C0.88562 9.10031 0.824357 9.34055 0.833478 9.58333C0.833478 9.69384 0.877377 9.79982 0.955517 9.87796C1.03366 9.9561 1.13964 10 1.25014 10C1.36065 10 1.46663 9.9561 1.54477 9.87796C1.62291 9.79982 1.66681 9.69384 1.66681 9.58333C1.66335 9.4549 1.70946 9.33007 1.79557 9.23472C1.88168 9.13938 2.00119 9.08084 2.12931 9.07125C2.15797 9.0658 2.18593 9.05713 2.21264 9.04542C3.01078 9.66446 3.99216 10.0004 5.00223 10.0004C6.0123 10.0004 6.99367 9.66446 7.79181 9.04542C7.8162 9.05665 7.84159 9.06558 7.86764 9.07208C7.99621 9.08085 8.11643 9.13892 8.20322 9.23417C8.29001 9.32942 8.33668 9.45451 8.33348 9.58333C8.33348 9.69384 8.37738 9.79982 8.45552 9.87796C8.53366 9.9561 8.63964 10 8.75014 10C8.86065 10 8.96663 9.9561 9.04477 9.87796C9.12291 9.79982 9.16681 9.69384 9.16681 9.58333C9.17593 9.34055 9.11467 9.10031 8.9904 8.89155C8.86613 8.68278 8.68416 8.51439 8.46639 8.40667C9.01781 7.77007 9.3828 6.99361 9.52115 6.16284C9.6595 5.33207 9.56583 4.47923 9.25048 3.69828C8.93513 2.91734 8.41033 2.2386 7.7339 1.73684C7.05747 1.23509 6.25566 0.929787 5.41681 0.854583ZM1.25014 5.41667C1.25014 4.67499 1.47008 3.94996 1.88213 3.33328C2.29419 2.71659 2.87986 2.23595 3.56508 1.95212C4.2503 1.66829 5.0043 1.59403 5.73173 1.73872C6.45916 1.88342 7.12735 2.24057 7.65179 2.76502C8.17624 3.28946 8.53339 3.95765 8.67809 4.68508C8.82278 5.41251 8.74852 6.16651 8.46469 6.85173C8.18086 7.53695 7.70022 8.12262 7.08353 8.53468C6.46685 8.94673 5.74182 9.16667 5.00014 9.16667C4.00595 9.16545 3.05283 8.76998 2.34983 8.06698C1.64684 7.36398 1.25136 6.41086 1.25014 5.41667Z"
      fill="#001A23"
      fillOpacity="0.5"
    />
  </Svg>
);

// ── Estilos (base do CÓDIGO 2, completo) ──────────────────────────────────────

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 20 : 50,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerLogoContainer: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 19,
    fontWeight: "300",
    color: "#E8F1F2",
    lineHeight: 22,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.4)",
    lineHeight: 22,
    maxWidth: 212,
  },
  adicionarButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "#002C3B",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002C3B",
    marginHorizontal: 24,
    height: 53,
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#E8F1F2",
    fontSize: 16,
    fontWeight: "300",
  },
  feedContainer: {
    paddingHorizontal: 24,
    gap: 30,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orgInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 8,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  orgName: {
    fontSize: 15,
    fontWeight: "300",
    color: "rgba(0, 146, 162, 0.85)",
    marginRight: 5,
  },
  cardBody: {
    width: "100%",
    backgroundColor: "#115161d9",
    borderRadius: 35,
    paddingBottom: 25,
    paddingTop: 7,
    paddingHorizontal: 7,
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0, 0, 0, 0.25)",
  },
  carouselContainer: {
    height: 230,
    borderRadius: 30,
    overflow: "hidden",
  },
  imageWrapper: {
    width: width - 48 - 14,
    height: 230,
    borderRadius: 30,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
  },
  editarAcaoButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  editarAcaoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  dot: {
    height: 2,
    borderRadius: 1,
    marginHorizontal: 2,
  },
  dotActive: {
    width: 20,
    backgroundColor: "#001A23",
  },
  dotInactive: {
    width: 10,
    backgroundColor: "rgba(0, 26, 35, 0.3)",
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: "300",
    color: "#E8F1F2",
    textAlign: "center",
    marginBottom: 4,
  },
  projectSubtitle: {
    fontSize: 13,
    fontWeight: "300",
    color: "rgba(255, 250, 250, 0.7)",
    textAlign: "center",
    marginBottom: 20,
  },
  pillContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B8C5C5",
    height: 36,
    borderRadius: 999,
    marginHorizontal: 13,
    gap: 12,
    borderTopWidth: 1.5,
    borderTopColor: "rgba(0, 0, 0, 0.15)",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.4)",
  },
  pillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "300",
    color: "rgba(0, 26, 35, 0.5)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#012A36",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
    height: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E8F1F2",
  },
  modalSubTitle: {
    fontSize: 18,
    color: "#EEE82C",
    fontWeight: "600",
    marginBottom: 5,
  },
  modalInfoText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 25,
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 10,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#001A23",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    height: 50,
  },
  modalInput: {
    flex: 1,
    color: "#FFF",
    paddingHorizontal: 15,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  checkboxRowActive: {
    backgroundColor: "rgba(238, 232, 44, 0.1)",
    borderColor: "rgba(238, 232, 44, 0.3)",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#EEE82C",
    borderColor: "#EEE82C",
  },
  checkboxText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    flex: 1,
  },
  checkboxTextActive: {
    color: "#EEE82C",
  },
  // Preview de fotos da finalização
  previewImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewRemoveBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  uploadMainContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
  },
  uploadDashedArea: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  uploadContent: {
    alignItems: "center",
    gap: 12,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#E8F1F2",
    textAlign: "center",
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
  },
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#001A23",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
  },
  semVoluntariosText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  voluntariosList: {
    gap: 8,
  },
  voluntarioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  voluntarioInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  voluntarioAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#004E69",
    justifyContent: "center",
    alignItems: "center",
  },
  voluntarioAvatarText: {
    color: "#EEE82C",
    fontWeight: "600",
    fontSize: 14,
  },
  voluntarioNome: {
    color: "#E8F1F2",
    fontSize: 14,
  },
  presencaBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(238, 232, 44, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(238, 232, 44, 0.3)",
  },
  presencaBtnAusente: {
    backgroundColor: "rgba(255, 80, 80, 0.12)",
    borderColor: "rgba(255, 80, 80, 0.3)",
  },
  presencaBtnText: {
    color: "#EEE82C",
    fontSize: 12,
    fontWeight: "500",
  },
  presencaBtnTextAusente: {
    color: "#FF6B6B",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  modalButtonVoltar: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  modalButtonVoltarText: {
    color: "#E8F1F2",
    fontSize: 15,
    fontWeight: "500",
  },
  modalButtonFinalizar: {
    flex: 2,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE82C",
  },
  modalButtonFinalizarText: {
    color: "#001A23",
    fontSize: 15,
    fontWeight: "700",
  },
});