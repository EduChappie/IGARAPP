import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

// Mock de imagens para o carrossel
const EVENT_IMAGES = [
  require("../src/assets/image_card_1.png"),
  require("../src/assets/image_card_1.png"),
  require("../src/assets/image_card_1.png"),
];

export default function DetalhesEventoScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = 327; // 310 (width) + 17 (gap)
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
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
            style={styles.participateButton}
            activeOpacity={0.8}
          >
            <HandHeartIcon />
            <Text style={styles.participateButtonText}>Quero Participar</Text>
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

const HandHeartIcon = () => (
  <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <Path
      d="M7.09729 19H3.16667C2.32681 19 1.52136 18.6664 0.927495 18.0725C0.33363 17.4786 0 16.6732 0 15.8333V11.875C0 11.0351 0.33363 10.2297 0.927495 9.63583C1.52136 9.04196 2.32681 8.70833 3.16667 8.70833H10.1785C10.6069 8.70854 11.0281 8.81933 11.4011 9.03001C11.7742 9.24068 12.0866 9.54409 12.308 9.91088L14.8548 7.11233C15.0655 6.88068 15.3197 6.69282 15.603 6.55948C15.8863 6.42614 16.1931 6.34994 16.5059 6.33524C16.8187 6.32053 17.1313 6.36761 17.4258 6.47378C17.7204 6.57995 17.9911 6.74314 18.2226 6.954C18.6844 7.37828 18.9612 7.96693 18.9933 8.59324C19.0254 9.21955 18.8104 9.83344 18.3944 10.3028L13.011 16.3487C12.2678 17.1823 11.3567 17.8495 10.3375 18.3064C9.31838 18.7633 8.21418 18.9997 7.09729 19ZM3.16667 10.2917C2.74674 10.2917 2.34401 10.4585 2.04708 10.7554C1.75015 11.0523 1.58333 11.4551 1.58333 11.875V15.8333C1.58333 16.2533 1.75015 16.656 2.04708 16.9529C2.34401 17.2499 2.74674 17.4167 3.16667 17.4167H7.09729C7.99023 17.4163 8.87301 17.2273 9.68778 16.8619C10.5026 16.4965 11.2309 15.9631 11.8251 15.2966L17.2124 9.24983C17.3523 9.09228 17.4247 8.8861 17.414 8.6757C17.4034 8.46529 17.3105 8.26748 17.1554 8.12488C16.9977 7.98311 16.791 7.90841 16.5791 7.91667C16.474 7.92111 16.3709 7.94643 16.2758 7.99115C16.1807 8.03587 16.0954 8.09909 16.0249 8.17713L12.521 12.0333C12.3672 12.4591 12.1006 12.835 11.7498 13.1212C11.399 13.4073 10.9771 13.5927 10.5292 13.6578L6.44338 14.2421C6.23551 14.2719 6.02432 14.2179 5.85625 14.092C5.68819 13.9661 5.57702 13.7786 5.54721 13.5708C5.51739 13.3629 5.57137 13.1517 5.69727 12.9836C5.82317 12.8156 6.01068 12.7044 6.21854 12.6746L10.3051 12.0911C10.532 12.0594 10.7383 11.9428 10.8825 11.7648C11.0266 11.5868 11.0979 11.3607 11.0818 11.1323C11.0657 10.9038 10.9635 10.6899 10.7958 10.5339C10.6282 10.3779 10.4075 10.2913 10.1785 10.2917H3.16667ZM8.70833 7.18358C8.34952 7.18455 8.00117 7.06275 7.72113 6.83842C6.36579 5.75067 4.75 4.11667 4.75 2.53333C4.73056 1.88287 4.96951 1.25119 5.41459 0.776438C5.85967 0.301691 6.47464 0.0225247 7.125 0C7.71665 0.0023044 8.2843 0.234189 8.70833 0.646792C9.13237 0.234189 9.70002 0.0023044 10.2917 0C10.942 0.0225247 11.557 0.301691 12.0021 0.776438C12.4472 1.25119 12.6861 1.88287 12.6667 2.53333C12.6667 4.11667 11.0509 5.75067 9.69475 6.83921C9.41481 7.06309 9.06678 7.18459 8.70833 7.18358ZM7.125 1.58333C6.8949 1.60642 6.68305 1.71888 6.53501 1.89654C6.38696 2.07419 6.31455 2.30284 6.33333 2.53333C6.33333 3.24583 7.24454 4.42542 8.71308 5.60421C10.1721 4.42542 11.0833 3.24583 11.0833 2.53333C11.1021 2.30284 11.0297 2.07419 10.8817 1.89654C10.7336 1.71888 10.5218 1.60642 10.2917 1.58333C10.0616 1.60642 9.84972 1.71888 9.70168 1.89654C9.55363 2.07419 9.48122 2.30284 9.5 2.53333C9.5 2.7433 9.41659 2.94466 9.26813 3.09313C9.11966 3.24159 8.9183 3.325 8.70833 3.325C8.49837 3.325 8.29701 3.24159 8.14854 3.09313C8.00007 2.94466 7.91667 2.7433 7.91667 2.53333C7.93545 2.30284 7.86304 2.07419 7.71499 1.89654C7.56695 1.71888 7.3551 1.60642 7.125 1.58333Z"
      fill="#001A23"
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
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
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
    paddingBottom: 150,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 24,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    marginBottom: 20,
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  guidelineCard: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  guidelineText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 20,
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
    backgroundColor: "rgba(0, 44, 59, 0.4)",
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  participateButton: {
    width: 340,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE82C",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 35, 0.4)",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 2,
  },
  participateButtonText: {
    color: "#001A23",
    fontSize: 14,
    fontWeight: "300",
  },
});
