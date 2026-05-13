import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
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
  Alert,
  ActivityIndicator,
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
import { useAuth } from "@/src/contexts/AuthContext";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/src/services/firebase/config";

const EVENT_IMAGES = [
  require("../src/assets/image_card_1.png"),
  require("../src/assets/image_card_1.png"),
  require("../src/assets/image_card_1.png"),
];

// ID mockado do evento (em produção, viria dos parâmetros de navegação)
const MOCK_EVENT_ID = "evento_igarape_mindu_001";

export default function DetalhesEventoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alreadyParticipating, setAlreadyParticipating] = useState(false);

  // Verificar se usuário já está participando deste evento
  useEffect(() => {
    const checkParticipation = async () => {
      if (!user) return;

      try {
        const participacoesRef = collection(firestore, "participacoes");
        const q = query(
          participacoesRef,
          where("acaoId", "==", MOCK_EVENT_ID),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setAlreadyParticipating(!querySnapshot.empty);
      } catch (error) {
        console.error('Erro ao verificar participação:', error);
      }
    };

    checkParticipation();
  }, [user]);

  const handleScroll = (event: any) => {
    const slideSize = 327; // 310 (width) + 17 (gap)
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Função para participar do evento
  const handleParticipar = async () => {
    if (!user) {
      Alert.alert(
        'Login necessário',
        'Você precisa fazer login para participar deste evento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer Login', onPress: () => router.push('/login_pl') }
        ]
      );
      return;
    }

    if (alreadyParticipating) {
      Alert.alert(
        'Você já está participando',
        'Você já está inscrito neste evento.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setLoading(true);
    try {
      const participacoesRef = collection(firestore, "participacoes");
      const docRef = await addDoc(participacoesRef, {
        acaoId: MOCK_EVENT_ID,
        userId: user.uid,
        dataInscricao: new Date(),
        status: 'confirmado',
        createdAt: new Date()
      });
      
      Alert.alert(
        'Sucesso!',
        'Inscrição realizada com sucesso! Você agora está participando deste evento.',
        [{ text: 'OK', style: 'default' }]
      );
      setAlreadyParticipating(true);
      
      console.log('Participação registrada com ID:', docRef.id);
    } catch (error: any) {
      console.error('Erro ao participar do evento:', error);
      
      let errorMessage = 'Erro ao realizar inscrição. Tente novamente.';
      
      // Tratamento de erros específicos
      if (error.code === 'permission-denied') {
        errorMessage = 'Permissão negada. Verifique as regras de segurança do Firestore.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Serviço indisponível. Verifique sua conexão com a internet.';
      }
      
      Alert.alert(
        'Erro',
        errorMessage,
        [{ text: 'OK', style: 'cancel' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 1. FUNDO DA TELA COM A IMAGEM E BLUR */}
      <ImageBackground
        source={require("../src/assets/image_card_1.png")}
        style={StyleSheet.absoluteFillObject}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 80 : 100}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0, 26, 35, 0.6)" },
          ]}
        />
      </ImageBackground>

      {/* 2. BOTÕES DO TOPO (VOLTAR E COMPARTILHAR) */}
      <SafeAreaView style={styles.topButtonsContainer}>
        {/* BOTÃO VOLTAR */}
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
        {/* BOTÃO COMPARTILHAR VAZADO E CENTRALIZADO */}
        <TopGlassButton
          onPress={() => console.log("Compartilhar clicado!")}
          icon={
            <G>
              {/* Linhas de conexão */}
              <Path
                d="M16 22L28 15M16 22L28 29"
                stroke="#001A23"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Círculos vazados (com o interior amarelo para esconder a linha) */}
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
      </SafeAreaView>

      {/* 3. CONTEÚDO ROLÁVEL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView>
          {/* TAG MANAUS (Brasil) */}
          <View style={styles.tagContainer}>
            <BlurView
              intensity={20}
              tint="light"
              style={StyleSheet.absoluteFillObject}
            />
            <BrazilIcon />
            <Text style={styles.tagText}>Manaus</Text>
          </View>

          {/* CABEÇALHO DO EVENTO */}
          <Text style={styles.eventTitle}>Igarapé do Mindú</Text>

          <View style={styles.eventSubRow}>
            <MapsIcon />
            <Text style={styles.eventSubText}>Manaus, Amazonas •</Text>
            <PersonInfoIcon />
            <Text style={styles.eventSubText}>(16 de 25 Voluntários)</Text>
          </View>

          {/* DESCRIÇÃO */}
          <Text style={styles.descriptionText}>
            Crypto ipsum bitcoin ethereum dogecoin litecoin. Polkadot kava
            compound polygon cosmos solana ICON flow ren. Ox fantom livepeer
            hive waves waves harmony polkadot dash quant.{"\n\n"}
            Kusama zcash EOS terra PancakeSwap vechain algorand dogecoin
            BitTorrent. Enjin siacoin TRON avalanche zcash THETA enjin THETA
            EOS.
          </Text>

          {/* INFORMAÇÕES DO EVENTO */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Informações do evento</Text>
            <View style={styles.yellowUnderline} />

            <View style={styles.infoPillsRow}>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <ClockIcon />
                <Text style={styles.glassPillText}>14:25 - 17:00</Text>
              </View>

              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <CalendarIcon />
                <Text style={styles.glassPillText}>28/05/2026</Text>
              </View>
            </View>
          </View>

          {/* CARROSSEL DE IMAGENS DO LUGAR */}
          <View style={styles.carouselSection}>
            <FlatList
              data={EVENT_IMAGES}
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
                    <Image
                      source={item}
                      style={styles.carouselImage}
                      blurRadius={isActive ? 0 : 3}
                    />
                  </View>
                );
              }}
            />

            {/* TRACINHOS PAGINAÇÃO */}
            <View style={styles.pagination}>
              {EVENT_IMAGES.map((_, i) => (
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

          {/* METAS DO EVENTO */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Metas do evento</Text>

            <View style={styles.goalsWrap}>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillText}>
                  Encher 30 sacos de lixo
                </Text>
              </View>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillText}>Separar lixo</Text>
              </View>
              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillText}>
                  Recolher todo o lixo ao redor
                </Text>
              </View>
            </View>
          </View>

          {/* ORIENTAÇÕES DO EVENTO */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Orientações do evento</Text>

            <View style={styles.guidelineCard}>
              <BlurView
                intensity={20}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.guidelineText}>
                Levar Botas, Luvas, repelente e 5 sacos de lixo de 2 Litros.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* 4. BARRA INFERIOR FLUTUANTE (QUERO PARTICIPAR) */}
      <View style={styles.bottomBarWrapper}>
        <LinearGradient
          colors={["rgba(0, 26, 35, 0)", "#001A23"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Container Glass centralizado e Botão corrigido */}
        <View style={styles.bottomGlassContainer}>
          <BlurView
            intensity={30}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />

          <TouchableOpacity
            style={[
              styles.participateButton,
              alreadyParticipating && styles.participateButtonDisabled
            ]}
            activeOpacity={0.8}
            onPress={handleParticipar}
            disabled={loading || alreadyParticipating}
          >
            {loading ? (
              <ActivityIndicator color="#001A23" size="small" />
            ) : (
              <>
                <HandHeartIcon />
                <Text style={styles.participateButtonText}>
                  {alreadyParticipating ? 'Já está Participando' : 'Quero Participar'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ==========================================
// COMPONENTES AUXILIARES E ÍCONES SVG
// ==========================================

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
      <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#00D358" />
        <Stop offset="1" stopColor="#005B26" />
      </SvgLinearGradient>
    </Defs>
    <Rect width="21" height="15" rx="3" fill="url(#grad)" />
    <Path d="M10.5 1.5L18.5 7.5L10.5 13.5L2.5 7.5L10.5 1.5Z" fill="#EEE82C" />
    <Circle cx="10.5" cy="7.5" r="3.5" fill="#002776" />
    <Path
      d="M7.2 7.8 Q 10.5 6 13.8 8.2"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  </Svg>
);

const MapsIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1C5.2 1 3 3.2 3 6C3 9.5 8 15 8 15C8 15 13 9.5 13 6C13 3.2 10.8 1 8 1ZM8 8C7.1 8 6.3 7.3 6.3 6.3C6.3 5.3 7.1 4.5 8 4.5C8.9 4.5 9.7 5.3 9.7 6.3C9.7 7.3 8.9 8 8 8Z"
      fill="#A6FF00"
    />
  </Svg>
);

const PersonInfoIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 8C9.7 8 11 6.7 11 5C11 3.3 9.7 2 8 2C6.3 2 5 3.3 5 5C5 6.7 6.3 8 8 8ZM8 9C6 9 2 10.1 2 12V13H14V12C14 10.1 10 9 8 9Z"
      fill="#A6FF00"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14ZM8.5 4H7V9L11.2 11.2L12 10L8.5 8.2V4Z"
      fill="#A6FF00"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M13 2H12V1H10V2H6V1H4V2H3C1.9 2 1 2.9 1 4V13C1 14.1 1.9 15 3 15H13C14.1 15 15 14.1 15 13V4C15 2.9 14.1 2 13 2ZM13 13H3V6H13V13ZM3 4H13V5H3V4Z"
      fill="#A6FF00"
    />
  </Svg>
);

const HandHeartIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill="#001A23"
    />
  </Svg>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#001A23",
  },
  topButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 140,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignSelf: "flex-start",
    marginLeft: 24,
    marginBottom: 16,
    overflow: "hidden",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginHorizontal: 24,
    marginBottom: 8,
  },
  eventSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 24,
  },
  eventSubText: {
    fontSize: 14,
    color: "#A6FF00",
    marginLeft: 6,
    marginRight: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#E8F1F2",
    lineHeight: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  yellowUnderline: {
    height: 3,
    width: 40,
    backgroundColor: "#EEE82C",
    borderRadius: 2,
    marginBottom: 16,
  },
  infoPillsRow: {
    flexDirection: "row",
    gap: 12,
  },
  glassPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  glassPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  carouselSection: {
    marginBottom: 32,
  },
  carouselImageWrapper: {
    width: 310,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  carouselImageInactive: {
    opacity: 0.7,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#EEE82C",
  },
  dotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  goalsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  guidelineCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  guidelineText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  bottomBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  bottomGlassContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 72,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  participateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE82C",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    width: "90%",
  },
  participateButtonDisabled: {
    backgroundColor: "#A0B3B8",
    opacity: 0.7,
  },
  participateButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#001A23",
  },
});

// Estilo adicional para o botão de participar quando desabilitado
const additionalStyles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#A0B3B8',
  },
});