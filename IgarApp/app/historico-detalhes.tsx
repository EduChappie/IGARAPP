import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const { width } = Dimensions.get("window");

// Mocks de imagens para os carrosséis
const IMAGENS_ANTES = [
  require("../src/assets/image_card_1.png"), // Coloque fotos do ANTES aqui
  require("../src/assets/image_card_1.png"),
];

const IMAGENS_DEPOIS = [
  require("../src/assets/image_card_1.png"), // Coloque fotos do DEPOIS aqui
  require("../src/assets/image_card_1.png"),
  require("../src/assets/image_card_1.png"),
];

export default function HistoricoDetalhesScreen() {
  const router = useRouter();

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

      {/* 2. CONTEÚDO PRINCIPAL (Agora os botões de voltar rolam com a tela) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView>
          {/* BOTÕES DO TOPO (Livres do "position: absolute") */}
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

          {/* TAGS (Local e Status) */}
          <View style={styles.tagsRow}>
            <View style={styles.tagContainer}>
              <BlurView
                intensity={20}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
              <BrazilIcon />
              <Text style={styles.tagText}>Manaus</Text>
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
          <Text style={styles.eventTitle}>Limpeza Igarapé do Franco</Text>

          <View style={styles.eventSubRow}>
            <MapsIcon />
            <Text style={styles.eventSubText}>Manaus, Amazonas •</Text>
            <PersonInfoIcon />
            <Text style={styles.eventSubText}>
              (25 Voluntários participaram)
            </Text>
          </View>

          {/* DESCRIÇÃO DA AÇÃO FINALIZADA */}
          <Text style={styles.descriptionText}>
            A ação foi um sucesso absoluto! Nossa equipe, juntamente com a
            comunidade local, conseguiu revitalizar uma grande parte do igarapé.
            Agradecemos a todos que dedicaram seu tempo para preservar a nossa
            Amazônia.
          </Text>

          {/* DETALHES DA AÇÃO */}
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
                  Ocorreu das 08:00 às 12:00
                </Text>
              </View>

              <View style={styles.glassPill}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <CalendarIcon />
                <Text style={styles.glassPillText}>10/02/2026</Text>
              </View>
            </View>
          </View>

          {/* IMPACTO GERADO (O QUE ERAM AS METAS) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Impacto Gerado</Text>

            <View style={styles.goalsWrap}>
              <View style={styles.glassPillSuccess}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillSuccessText}>
                  ✔️ 320kg de lixo recolhidos
                </Text>
              </View>
              <View style={styles.glassPillSuccess}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillSuccessText}>
                  ✔️ Mais de 45 sacos cheios
                </Text>
              </View>
              <View style={styles.glassPillSuccess}>
                <BlurView
                  intensity={20}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.glassPillSuccessText}>
                  ✔️ Nascente desobstruída
                </Text>
              </View>
            </View>
          </View>

          {/* CARROSSÉIS PADRONIZADOS - ANTES E DEPOIS */}
          <CarouselBlock title="O antes da ação" images={IMAGENS_ANTES} />

          <CarouselBlock title="O depois da ação" images={IMAGENS_DEPOIS} />
        </SafeAreaView>
      </ScrollView>

      {/* 3. BARRA INFERIOR FLUTUANTE (ENCERRADO) */}
      <View style={styles.bottomBarWrapper}>
        <LinearGradient
          colors={["rgba(0, 26, 35, 0)", "#001A23"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Container Glass indicando Encerrado */}
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

// ==========================================
// COMPONENTE DO CARROSSEL REUTILIZÁVEL (ANTES E DEPOIS)
// ==========================================
const CarouselBlock = ({ title, images }: { title: string; images: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeIndexRef = useRef(0);

  // Rolagem automática independente para cada carrossel
  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndexRef.current + 1;
      if (nextIndex >= images.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [images]);

  const handleScroll = (event: any) => {
    const slideSize = 327; // 310 (width) + 17 (gap)
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
              <Image
                source={item}
                style={styles.carouselImage}
                blurRadius={isActive ? 0 : 3}
              />
            </View>
          );
        }}
      />

      {/* TRACINHOS DE PAGINAÇÃO */}
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
      d="M5.95837 8.66671C6.2106 8.66719 6.45945 8.60897 6.68528 8.49662L7.76862 7.95496C8.32079 7.68079 8.6691 7.11653 8.66671 6.50005V4.89292C8.66862 4.27697 8.32036 3.71345 7.76862 3.43964L6.68528 2.89798C6.22756 2.67048 5.68971 2.67048 5.23199 2.89798L4.14865 3.43964C3.59671 3.7133 3.24823 4.27687 3.25003 4.89292V6.50005C3.24805 7.11615 3.59628 7.67988 4.14812 7.95389L5.23146 8.49555C5.45718 8.60826 5.70606 8.66686 5.95837 8.66671ZM4.33337 6.50005V4.89292C4.33423 4.83767 4.34355 4.78286 4.36099 4.73042L5.54184 5.32083C5.80407 5.4519 6.11269 5.4519 6.37493 5.32083L7.55577 4.73042C7.57321 4.78286 7.58253 4.83767 7.5834 4.89292V6.50005C7.58426 6.70556 7.46805 6.89365 7.28386 6.98483L6.20052 7.52649C6.04777 7.60208 5.86849 7.60208 5.71574 7.52649L4.6324 6.98483C4.44839 6.8935 4.33241 6.70546 4.33337 6.50005ZM9.75003 11.9167H8.28265L10.1714 10.1715C12.4984 7.84461 12.4984 4.07202 10.1716 1.7451C7.84472 -0.581828 4.07215 -0.581853 1.74523 1.74497C-0.581696 4.07179 -0.581747 7.84443 1.7451 10.1713C1.7502 10.1764 3.63409 11.9167 3.63409 11.9167H2.16671C1.86756 11.9167 1.62505 12.1592 1.62505 12.4584C1.62505 12.7575 1.86756 13 2.16671 13H9.75005C10.0492 13 10.2917 12.7575 10.2917 12.4584C10.2917 12.1592 10.0492 11.9167 9.75003 11.9167ZM2.51121 2.51121C4.41084 0.603051 7.49765 0.596145 9.40581 2.49577C11.314 4.3954 11.3209 7.48221 9.42124 9.39037L7.26271 11.3842C6.52598 12.0786 5.37451 12.0746 4.64268 11.375L2.51121 9.40552C0.610343 7.50049 0.610368 4.41627 2.51121 2.51121Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const PersonInfoIcon = () => (
  <Svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <Path
      d="M6.5 6.49994C7.14279 6.49994 7.77114 6.30933 8.3056 5.95222C8.84006 5.5951 9.25662 5.08752 9.50261 4.49366C9.74859 3.8998 9.81295 3.24634 9.68755 2.6159C9.56215 1.98546 9.25262 1.40636 8.7981 0.951843C8.34358 0.497323 7.76448 0.18779 7.13404 0.0623883C6.50361 -0.0630137 5.85014 0.00134714 5.25628 0.247332C4.66242 0.493317 4.15484 0.909877 3.79772 1.44434C3.44061 1.9788 3.25 2.60715 3.25 3.24994C3.25086 4.11163 3.59355 4.93778 4.20285 5.54709C4.81216 6.15639 5.63831 6.49908 6.5 6.49994ZM6.5 1.08327C6.92853 1.08327 7.34743 1.21035 7.70374 1.44842C8.06004 1.6865 8.33775 2.02489 8.50174 2.42079C8.66573 2.8167 8.70864 3.25234 8.62504 3.67264C8.54143 4.09293 8.33508 4.47899 8.03206 4.78201C7.72905 5.08502 7.34299 5.29137 6.9227 5.37498C6.5024 5.45858 6.06676 5.41567 5.67085 5.25168C5.27495 5.08769 4.93656 4.80998 4.69848 4.45368C4.46041 4.09737 4.33333 3.67847 4.33333 3.24994C4.33333 2.6753 4.56161 2.1242 4.96794 1.71788C5.37426 1.31155 5.92536 1.08327 6.5 1.08327V1.08327Z"
      fill="#E8F1F2"
    />
    <Path
      d="M6.5 7.58368C5.20751 7.58511 3.96837 8.09919 3.05444 9.01312C2.14051 9.92705 1.62643 11.1662 1.625 12.4587C1.625 12.6023 1.68207 12.7401 1.78365 12.8417C1.88523 12.9433 2.02301 13.0003 2.16667 13.0003C2.31033 13.0003 2.4481 12.9433 2.54968 12.8417C2.65126 12.7401 2.70833 12.6023 2.70833 12.4587C2.70833 11.4531 3.10781 10.4886 3.81889 9.77757C4.52996 9.06649 5.49439 8.66701 6.5 8.66701C7.50561 8.66701 8.47004 9.06649 9.18111 9.77757C9.89219 10.4886 10.2917 11.4531 10.2917 12.4587C10.2917 12.6023 10.3487 12.7401 10.4503 12.8417C10.5519 12.9433 10.6897 13.0003 10.8333 13.0003C10.977 13.0003 11.1148 12.9433 11.2164 12.8417C11.3179 12.7401 11.375 12.6023 11.375 12.4587C11.3736 11.1662 10.8595 9.92705 9.94556 9.01312C9.03163 8.09919 7.79249 7.58511 6.5 7.58368V7.58368Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00888 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87897 15.1541 3.84547 13.6543 2.34568C12.1545 0.845886 10.121 0.00229405 8 0V0ZM8 14.6667C6.68146 14.6667 5.39253 14.2757 4.2962 13.5431C3.19987 12.8106 2.34539 11.7694 1.84081 10.5512C1.33622 9.33305 1.2042 7.99261 1.46144 6.6994C1.71867 5.40619 2.35361 4.21831 3.28596 3.28596C4.21831 2.3536 5.4062 1.71867 6.6994 1.46143C7.99261 1.2042 9.33305 1.33622 10.5512 1.8408C11.7694 2.34539 12.8106 3.19987 13.5431 4.2962C14.2757 5.39253 14.6667 6.68146 14.6667 8C14.6647 9.76752 13.9617 11.4621 12.7119 12.7119C11.4621 13.9617 9.76752 14.6647 8 14.6667V14.6667Z"
      fill="#E8F1F2"
    />
    <Path
      d="M8.00013 4C7.82332 4 7.65375 4.07024 7.52872 4.19526C7.4037 4.32029 7.33346 4.48985 7.33346 4.66667V7.54999L5.08613 8.95799C4.93584 9.05188 4.829 9.20162 4.78912 9.37428C4.74923 9.54694 4.77957 9.72837 4.87346 9.87866C4.96735 10.0289 5.11709 10.1358 5.28975 10.1757C5.46241 10.2155 5.64384 10.1852 5.79413 10.0913L8.35413 8.49133C8.45085 8.43072 8.53039 8.3463 8.58514 8.24615C8.63989 8.14599 8.668 8.03346 8.66679 7.91933V4.66667C8.66679 4.48985 8.59656 4.32029 8.47153 4.19526C8.34651 4.07024 8.17694 4 8.00013 4Z"
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

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginTop: Platform.OS === "ios" ? 10 : 30, // Margin em vez de position absolute
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
  scrollContent: {
    paddingTop: 10, // Diminuído porque os botões não são mais absolutos
    paddingBottom: 150,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 24,
    marginBottom: 20,
  },
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
  tagText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "300",
  },
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
  eventSubText: {
    color: "#E8F1F2",
    fontSize: 13,
    fontWeight: "300",
  },
  descriptionText: {
    color: "#E8F1F2",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 20,
    marginHorizontal: 24,
    marginBottom: 30,
  },
  sectionContainer: {
    marginHorizontal: 24,
    marginBottom: 30,
  },
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
  infoPillsRow: {
    flexDirection: "row",
    gap: 10,
  },
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
  glassPillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "300",
  },
  carouselSection: {
    marginBottom: 30,
  },
  carouselImageWrapper: {
    width: 310,
    height: 181,
    borderRadius: 18,
    borderWidth: 2.7,
    borderColor: "rgba(0,0,0,0.4)",
    overflow: "hidden",
  },
  carouselImageInactive: {
    width: 281,
    height: 164,
    alignSelf: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  dot: {
    height: 4,
    borderRadius: 6,
    marginHorizontal: 2.5,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#EEE82C",
  },
  dotInactive: {
    width: 17,
    backgroundColor: "rgba(232, 241, 242, 0.3)",
  },
  goalsWrap: {
    flexDirection: "column",
    gap: 10,
  },
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
  glassPillSuccessText: {
    color: "#E8F1F2",
    fontSize: 14,
    fontWeight: "300",
  },
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
  finishedButtonText: {
    color: "#E8F1F2",
    fontSize: 16,
    fontWeight: "400",
  },
});
