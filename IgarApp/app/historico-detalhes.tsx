// app/historico-detalhes.tsx
// MUDANÇA: Carrega a ação do Firestore usando o parâmetro `id` da rota.
// Exibe `acao.imagens` no carrossel "O antes" e
//        `acao.imagensFinalizacao` no carrossel "O depois".
// Se não houver imagens, usa a imagem padrão local como fallback.

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { acaoService, Acao } from "@/src/services/firebase/firestoreService";

const { width } = Dimensions.get("window");

// Imagem padrão usada como fallback quando não há fotos cadastradas
const IMAGEM_PADRAO = require("../src/assets/image_card_1.png");

export default function HistoricoDetalhesScreen() {
  const router = useRouter();
  // Pega o `id` enviado pela rota: router.push(`/historico-detalhes?id=${acao.id}`)
  const { id } = useLocalSearchParams<{ id: string }>();

  const [acao, setAcao] = useState<Acao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }

    // Tenta buscar no histórico; se não achar, tenta em acoes
    // (moverParaHistorico copia para 'historico', mas getAcaoById busca em 'acoes')
    // Aqui usamos getAcaoById para simplificar — ajuste se necessário.
    acaoService
      .getAcaoById(id)
      .then((dados) => setAcao(dados))
      .catch((err) => console.error("Erro ao carregar ação:", err))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#001A23",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#EEE82C" />
      </View>
    );
  }

  // ── Resolve imagens "antes" ────────────────────────────────────────────────
  // Usa as imagens originais da ação. Se não houver, usa a imagem padrão.
  const imagensAntes: any[] =
    acao?.imagens && acao.imagens.length > 0
      ? acao.imagens.map((url) => ({ uri: url }))
      : [IMAGEM_PADRAO];

  // ── Resolve imagens "depois" ───────────────────────────────────────────────
  // Usa imagensFinalizacao, salvo ao finalizar a ação no home_ong.
  // (campo novo no Firestore: imagensFinalizacao: string[])
  const imagensDepois: any[] =
    (acao as any)?.imagensFinalizacao &&
    (acao as any).imagensFinalizacao.length > 0
      ? (acao as any).imagensFinalizacao.map((url: string) => ({ uri: url }))
      : [IMAGEM_PADRAO];

  // ── Imagem de fundo do topo (usa primeira imagem "depois" se disponível) ──
  const imagemFundoTopo = (acao as any)?.imagensFinalizacao?.[0]
    ? { uri: (acao as any).imagensFinalizacao[0] }
    : acao?.imagens?.[0]
      ? { uri: acao.imagens[0] }
      : IMAGEM_PADRAO;

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* FUNDO COM BLUR */}
      <ImageBackground
        source={imagemFundoTopo}
        style={StyleSheet.absoluteFillObject}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 90 : 100}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0, 26, 35, 0.7)" },
          ]}
        />
      </ImageBackground>

      {/* CONTEÚDO */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView>
          {/* BOTÕES DO TOPO */}
          <View style={styles.topButtonsContainer}>
            <TopGlassButton
              onPress={() => router.back()}
              icon={
                <Path
                  d="M25 15 L 18 22 L 25 29"
                  stroke="#001A23"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              }
            />
            <TopGlassButton
              onPress={() => console.log("Compartilhar clicado!")}
              icon={
                <G>
                  <Path
                    d="M16 22L28 15M16 22L28 29"
                    stroke="#001A23"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <Circle
                    cx="15"
                    cy="22"
                    r="3.5"
                    fill="#EEE82C"
                    stroke="#001A23"
                    strokeWidth="2.5"
                  />
                  <Circle
                    cx="29"
                    cy="15"
                    r="3.5"
                    fill="#EEE82C"
                    stroke="#001A23"
                    strokeWidth="2.5"
                  />
                  <Circle
                    cx="29"
                    cy="29"
                    r="3.5"
                    fill="#EEE82C"
                    stroke="#001A23"
                    strokeWidth="2.5"
                  />
                </G>
              }
            />
          </View>

          {/* TAGS */}
          <View style={styles.tagsRow}>
            <View style={styles.tagContainer}>
              <BlurView
                intensity={20}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
              <BrazilIcon />
              <Text style={styles.tagText}>{acao?.cidade || "Manaus"}</Text>
            </View>
            <View
              style={[
                styles.tagContainer,
                { borderColor: "#FF4D4D", borderWidth: 1 },
              ]}
            >
              <BlurView
                intensity={20}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
              <Text
                style={[
                  styles.tagText,
                  { color: "#FF4D4D", fontWeight: "bold" },
                ]}
              >
                Finalizado
              </Text>
            </View>
          </View>

          {/* CABEÇALHO DA AÇÃO */}
          <Text style={styles.eventTitle}>
            {acao?.titulo || "Ação Finalizada"}
          </Text>

          <View style={styles.eventSubRow}>
            <MapsIcon />
            <Text style={styles.eventSubText}>
              {acao ? `${acao.cidade}, ${acao.estado}` : ""} •
            </Text>
            <PersonInfoIcon />
            <Text style={styles.eventSubText}>
              ({acao?.voluntariosInscritos || 0} Voluntários participaram)
            </Text>
          </View>

          {/* DESCRIÇÃO */}
          <Text style={styles.descriptionText}>
            {acao?.descricao ||
              "A ação foi um sucesso absoluto! Agradecemos a todos que dedicaram seu tempo para preservar a nossa Amazônia."}
          </Text>

          {/* DETALHES */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Detalhes da Ação</Text>
            <View style={styles.yellowUnderline} />
            <View style={styles.infoPillsRow}>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <ClockIcon />
                <Text style={styles.glassPillText}>
                  {acao ? `Das ${acao.horaInicio} às ${acao.horaFim}` : ""}
                </Text>
              </View>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <CalendarIcon />
                <Text style={styles.glassPillText}>
                  {acao ? acao.data.toLocaleDateString("pt-BR") : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* IMPACTO GERADO */}
          {((acao as any)?.lixoRecolhido ||
            (acao as any)?.metasConcluidas?.length > 0) && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Impacto Gerado</Text>
              <View style={styles.goalsWrap}>
                {(acao as any)?.lixoRecolhido ? (
                  <View style={styles.glassPillSuccess}>
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Text style={styles.glassPillSuccessText}>
                      ♻️ {(acao as any).lixoRecolhido} recolhidos
                    </Text>
                  </View>
                ) : null}

                {((acao as any)?.metasConcluidas || []).map(
                  (indexMeta: number) => {
                    const meta = acao?.metas?.[indexMeta];
                    if (!meta) return null;
                    return (
                      <View key={indexMeta} style={styles.glassPillSuccess}>
                        <BlurView
                          intensity={20}
                          tint="light"
                          style={StyleSheet.absoluteFillObject}
                        />
                        <Text style={styles.glassPillSuccessText}>
                          ✔️ {meta}
                        </Text>
                      </View>
                    );
                  },
                )}
              </View>
            </View>
          )}

          {/* CARROSSEL "O ANTES" — imagens originais da ação */}
          <CarouselBlock title="O antes da ação" images={imagensAntes} />

          {/* CARROSSEL "O DEPOIS" — fotos enviadas ao finalizar */}
          <CarouselBlock title="O depois da ação" images={imagensDepois} />
        </SafeAreaView>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <View style={styles.bottomBarWrapper}>
        <LinearGradient
          colors={["rgba(0, 26, 35, 0)", "#001A23"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.bottomGlassContainer}>
          <BlurView
            intensity={30}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.finishedButton}>
            <CheckCircleIcon />
            <Text style={styles.finishedButtonText}>Ação Encerrada</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Carrossel reutilizável ─────────────────────────────────────────────────────

const CarouselBlock = ({ title, images }: { title: string; images: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= images.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  const handleScroll = (event: any) => {
    const slideSize = 327;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.carouselSection}>
      <View style={{ marginLeft: 24, marginBottom: 15 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.yellowUnderline} />
      </View>

      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={327}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 17 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isActive = activeIndex === index;
          return (
            <View
              style={[
                styles.carouselImageWrapper,
                !isActive && styles.carouselImageInactive,
              ]}
            >
              {/* item é { uri: "https://..." } ou require(...) — ambos funcionam */}
              <Image
                source={item}
                style={styles.carouselImage}
                blurRadius={isActive ? 0 : 3}
              />
            </View>
          );
        }}
      />

      <View style={styles.pagination}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// ── Componentes auxiliares ─────────────────────────────────────────────────────

const TopGlassButton = ({
  icon,
  onPress,
}: {
  icon: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.topGlassButton}
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
        {icon}
      </G>
    </Svg>
  </TouchableOpacity>
);

const BrazilIcon = () => (
  <Svg
    width="21"
    height="15"
    viewBox="0 0 21 15"
    fill="none"
    style={{
      borderRadius: 3,
      borderWidth: 0.4,
      borderColor: "rgba(255,255,255,0.2)",
    }}
  >
    <Defs>
      <SvgLinearGradient id="gradBr" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#00D358" />
        <Stop offset="1" stopColor="#005B26" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="21" height="15" rx="3" fill="url(#gradBr)" />
    <Path d="M10.5 1.5L18.5 7.5L10.5 13.5L2.5 7.5L10.5 1.5Z" fill="#EEE82C" />
    <Circle cx="10.5" cy="7.5" r="3.5" fill="#002776" />
    <Path
      d="M7.2 7.8 Q 10.5 6 13.8 8.2"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      fill="none"
    />
  </Svg>
);

const MapsIcon = () => (
  <Svg width="12" height="13" viewBox="0 0 12 13" fill="none">
    <Path
      d="M5.95837 8.66671C6.2106 8.66719 6.45945 8.60897 6.68528 8.49662L7.76862 7.95496C8.32079 7.68079 8.6691 7.11653 8.66671 6.50005V4.89292C8.66862 4.27697 8.32036 3.71345 7.76862 3.43964L6.68528 2.89798C6.22756 2.67048 5.68971 2.67048 5.23199 2.89798L4.14865 3.43964C3.59671 3.7133 3.24823 4.27687 3.25003 4.89292V6.50005C3.24805 7.11615 3.59628 7.67988 4.14812 7.95389L5.23146 8.49555C5.45718 8.60826 5.70606 8.66686 5.95837 8.66671Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const PersonInfoIcon = () => (
  <Svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <Path
      d="M6.5 6.49994C7.14279 6.49994 7.77114 6.30933 8.3056 5.95222C8.84006 5.5951 9.25662 5.08752 9.50261 4.49366C9.74859 3.8998 9.81295 3.24634 9.68755 2.6159C9.56215 1.98546 9.25262 1.40636 8.7981 0.951843C8.34358 0.497323 7.76448 0.18779 7.13404 0.0623883C6.50361 -0.0630137 5.85014 0.00134714 5.25628 0.247332C4.66242 0.493317 4.15484 0.909877 3.79772 1.44434C3.44061 1.9788 3.25 2.60715 3.25 3.24994C3.25086 4.11163 3.59355 4.93778 4.20285 5.54709C4.81216 6.15639 5.63831 6.49908 6.5 6.49994Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00888 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="13.5" height="13.5" viewBox="0 0 12 12" fill="none">
    <Path
      d="M3.375 1.5V2.625M8.625 1.5V2.625M1.5 9.375V3.75C1.5 3.12868 2.00368 2.625 2.625 2.625H9.375C9.99632 2.625 10.5 3.12868 10.5 3.75V9.375M1.5 9.375C1.5 9.99632 2.00368 10.5 2.625 10.5H9.375C9.99632 10.5 10.5 9.99632 10.5 9.375M1.5 9.375V5.625C1.5 5.00368 2.00368 4.5 2.625 4.5H9.375C9.99632 4.5 10.5 5.00368 10.5 5.625V9.375"
      stroke="#E8F1F2"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 11.08V12C21.9988 14.1564 21.3001 16.2547 20.0093 17.9818C18.7185 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.08 2.86"
      stroke="#E8F1F2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 4L12 14.01L9 11.01"
      stroke="#EEE82C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ── Estilos ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginTop: Platform.OS === "ios" ? 10 : 30,
    marginBottom: 30,
    zIndex: 10,
  },
  topGlassButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingTop: 10, paddingBottom: 150 },
  tagsRow: { flexDirection: "row", gap: 10, marginLeft: 24, marginBottom: 20 },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    gap: 7,
  },
  tagText: { color: "#FFFFFF", fontSize: 14, fontWeight: "300" },
  eventTitle: {
    color: "#E8F1F2",
    fontSize: 23,
    fontWeight: "400",
    marginLeft: 24,
    marginBottom: 10,
  },
  eventSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 24,
    marginBottom: 20,
    gap: 5,
  },
  eventSubText: { color: "#E8F1F2", fontSize: 13, fontWeight: "300" },
  descriptionText: {
    color: "#E8F1F2",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 20,
    marginHorizontal: 24,
    marginBottom: 30,
  },
  sectionContainer: { marginHorizontal: 24, marginBottom: 30 },
  sectionTitle: {
    color: "#E8F1F2",
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 10,
  },
  yellowUnderline: {
    width: 84,
    height: 2,
    backgroundColor: "#EEE82C",
    marginBottom: 15,
  },
  infoPillsRow: { flexDirection: "row", gap: 10 },
  glassPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 9999,
    borderWidth: 0.5,
    borderColor: "rgba(232, 241, 242, 0.25)",
    backgroundColor: "rgba(232, 241, 242, 0.1)",
    overflow: "hidden",
    gap: 7,
  },
  glassPillText: { color: "#FFFFFF", fontSize: 14, fontWeight: "300" },
  carouselSection: { marginBottom: 30 },
  carouselImageWrapper: {
    width: 310,
    height: 181,
    borderRadius: 18,
    borderWidth: 2.7,
    borderColor: "rgba(0,0,0,0.4)",
    overflow: "hidden",
  },
  carouselImageInactive: { width: 281, height: 164, alignSelf: "center" },
  carouselImage: { width: "100%", height: "100%", resizeMode: "cover" },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  dot: { height: 4, borderRadius: 6, marginHorizontal: 2.5 },
  dotActive: { width: 24, backgroundColor: "#EEE82C" },
  dotInactive: { width: 17, backgroundColor: "rgba(232, 241, 242, 0.3)" },
  goalsWrap: { flexDirection: "column", gap: 10 },
  glassPillSuccess: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(109, 165, 68, 0.4)",
    backgroundColor: "rgba(109, 165, 68, 0.1)",
    overflow: "hidden",
  },
  glassPillSuccessText: { color: "#E8F1F2", fontSize: 14, fontWeight: "300" },
  bottomBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 186,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 25,
  },
  bottomGlassContainer: {
    width: 345,
    height: 63,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 77, 77, 0.15)",
    borderWidth: 0.7,
    borderColor: "rgba(255, 77, 77, 0.4)",
    overflow: "hidden",
  },
  finishedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  finishedButtonText: { color: "#E8F1F2", fontSize: 16, fontWeight: "400" },
});
