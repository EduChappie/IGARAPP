import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
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
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");

// ==========================================
// DADOS DOS 6 CARDS
// ==========================================
const FEED_DATA = [
  {
    id: "1",
    orgName: "Igarape S.P.",
    title: "Igarapé do Mindú",
    subtitle: "Manaus, Amazonas",
    volunteers: "25 Voluntários",
    date: "28/05/2026",
    time: "14:25H - 17:00H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
  {
    id: "2",
    orgName: "Igarape S.P.",
    title: "Limpeza Praia da Lua",
    subtitle: "Manaus, Amazonas",
    volunteers: "50 Voluntários",
    date: "30/05/2026",
    time: "08:00H - 12:00H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
  {
    id: "3",
    orgName: "Igarape S.P.",
    title: "Plantio Muda Tarumã",
    subtitle: "Manaus, Amazonas",
    volunteers: "15 Voluntários",
    date: "12/06/2026",
    time: "07:30H - 10:00H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
  {
    id: "4",
    orgName: "Igarape S.P.",
    title: "Coleta Seletiva Centro",
    subtitle: "Manaus, Amazonas",
    volunteers: "40 Voluntários",
    date: "20/06/2026",
    time: "09:00H - 14:00H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
  {
    id: "5",
    orgName: "Igarape S.P.",
    title: "Revitalização Parque Dez",
    subtitle: "Manaus, Amazonas",
    volunteers: "35 Voluntários",
    date: "02/07/2026",
    time: "15:00H - 18:00H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
  {
    id: "6",
    orgName: "Igarape S.P.",
    title: "Ação Social Educativa",
    subtitle: "Manaus, Amazonas",
    volunteers: "20 Voluntários",
    date: "15/07/2026",
    time: "13:00H - 16:30H",
    images: [
      require("../src/assets/image_card_1.png"),
      require("../src/assets/image_card_1.png"),
    ],
  },
];

export default function HomeUserScreen() {
  const router = useRouter();

  // Função dedicada para a NavBar (usa replace para não acumular memória)
  const handleTabNav = (rota: string) => {
    setTimeout(() => {
      router.replace(rota as any);
    }, 50);
  };

  // Função para botões normais que empilham tela
  const handleNav = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#001A23" />

      {/* CONTEÚDO PRINCIPAL ROLÁVEL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <SafeAreaView>
          {/* HEADER (BOM DIA E LOGO OFICIAL) */}
          <View style={styles.header}>
            <View style={styles.headerTextRow}>
              <View style={styles.headerLogoContainer}>
                <LogoTelaInicialSVG />
              </View>

              <View>
                <Text style={styles.greetingText}>Bom dia</Text>
                <Text style={styles.userNameText}>Olá, Usuário</Text>
              </View>
            </View>
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

          {/* LISTA DE CARDS (FEED) */}
          <View style={styles.feedContainer}>
            {FEED_DATA.map((item) => (
              <ProjectCard key={item.id} data={item} handleNav={handleNav} />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* BOTTOM TAB BAR (FLUTUANTE COM BLUR E GRADIENTE) */}
      <View style={styles.tabBarWrapper}>
        <LinearGradient
          colors={["rgba(0, 26, 35, 0)", "#001A23"]}
          style={StyleSheet.absoluteFillObject}
        />
        <BlurView intensity={20} tint="dark" style={styles.tabBarContainer}>
          <TouchableOpacity style={styles.tabIconActive} activeOpacity={1}>
            <HomeIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabIcon}
            activeOpacity={0.6}
            onPress={() => handleTabNav("/perfil_pf")}
          >
            <UserIcon />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabIcon} activeOpacity={0.6}>
            <FishNavIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabIcon}
            activeOpacity={0.6}
            onPress={() => handleTabNav("/historico")}
          >
            <RefreshIcon />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

// ==========================================
// COMPONENTE DO CARD COM CARROSSEL ANIMADO
// ==========================================
const ProjectCard = ({
  data,
  handleNav,
}: {
  data: any;
  handleNav: (rota: string) => void;
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

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndexRef.current) {
      activeIndexRef.current = roundIndex;
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* CABEÇALHO DO CARD */}
      <View style={styles.cardHeader}>
        <View style={styles.orgInfo}>
          {/* AVATAR DO Igarapé */}
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

      {/* CORPO DO CARD VERDE (AGORA CLICÁVEL COM ROTA) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleNav("/detalhes-evento")}
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
                <Image source={item} style={styles.cardImage} />
              </View>
            )}
          />
        </View>

        {/* TRACINHOS (PAGINAÇÃO) */}
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

// ==========================================
// ÍCONES SVG INLINE RESTAURADOS
// ==========================================

const LogoTelaInicialSVG = () => (
  <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <G filter="url(#filter0_ii_14_443)">
      <Path
        d="M35.7139 0C43.6036 0 50 6.39635 50 14.2861V35.7139C50 43.6036 43.6036 50 35.7139 50H14.2861C6.39635 50 0 43.6036 0 35.7139V14.2861C0 6.39635 6.39635 0 14.2861 0H35.7139ZM28.2266 23.7783C17.781 12.5312 14.5498 14.0113 4.26074 24.8105C5.52978 26.1425 6.69235 27.3352 7.77344 28.3828L8.05371 28.6689C8.05651 28.6662 8.05873 28.6629 8.06152 28.6602C15.7928 36.0624 19.416 35.7765 29.125 25.083L29.2852 24.9316L29.2744 24.9209C35.4714 19.1301 38.3453 17.965 40.3418 17.9648C44.5475 17.9648 45.7654 23.2645 41.7812 25.0312C45.7656 27.6813 44.9903 32.3193 40.3418 32.3193C35.5604 32.319 31.2917 27.7088 31.2666 27.6816C31.2562 27.6905 30.6081 28.247 30.2705 28.6748C31.2666 29.7789 36.1838 34.3772 40.3418 33.9756C43.6621 34.3068 48.3114 29.6687 43.9951 25.0312C47.7577 20.6147 43.4407 16.1982 40.3418 16.1982C36.1363 16.64 33.4283 18.6993 28.2266 23.7783ZM15.0898 18.4023C16.2169 18.1294 17.3059 18.1327 18.4326 18.4131C18.2988 18.7582 18.2191 19.3059 18.1133 20.0176C17.6603 23.1206 17.6817 26.585 18.1855 29.8447C18.2868 30.5065 18.3815 30.9801 18.5 31.3281C17.3739 31.6011 16.2873 31.5987 15.1641 31.3203C15.3081 30.9576 15.4061 30.4361 15.5088 29.6523C15.9423 26.3826 15.8889 22.9188 15.3691 19.8262C15.2603 19.1889 15.1954 18.7223 15.0898 18.4023ZM21.6582 19.8662C22.5978 20.4532 23.5947 21.1973 24.6836 22.0947C24.5529 22.3057 24.4367 22.526 24.3359 22.7539C24.0494 23.4021 23.8931 24.1003 23.877 24.8086C23.8608 25.517 23.9853 26.2221 24.2422 26.8828C24.3589 27.183 24.5034 27.4707 24.6709 27.7441C23.5847 28.6322 22.5901 29.3649 21.6523 29.9395C21.5361 29.7407 21.3514 29.4647 21.1611 29.2178C19.8383 27.4963 19.4335 26.569 19.4111 25.1377C19.3892 23.7369 19.7357 22.7851 20.7959 21.3408C21.3423 20.5996 21.5683 20.2187 21.6582 19.8662ZM11.8496 19.8408C11.9617 20.1676 12.2023 20.5386 12.7168 21.2061C13.8079 22.6273 14.1744 23.5717 14.1826 24.9727C14.1912 26.4042 13.807 27.3403 12.5215 29.0898C12.3078 29.3798 12.1012 29.7076 11.998 29.9092C11.0319 29.3137 10.0057 28.5534 8.88184 27.6328C9.01962 27.4089 9.14204 27.1753 9.24609 26.9326C9.52543 26.2811 9.67349 25.5806 9.68164 24.8721C9.68979 24.1636 9.55813 23.4604 9.29395 22.8027C9.18117 22.5221 9.04313 22.2529 8.88574 21.9961C9.95075 21.1304 10.9278 20.4105 11.8496 19.8408ZM23.126 24.3916C22.5624 23.2177 21.0358 23.1503 20.3906 24.2588C20.1547 24.6672 20.0993 25.0212 20.208 25.3994C20.2564 25.5652 20.3817 25.806 20.4902 25.9473C20.7269 26.2434 21.2747 26.5479 21.5986 26.5566C22.7223 26.587 23.5962 25.346 23.126 24.3916ZM12.0273 23.3408C10.9606 23.299 10.17 24.3349 10.4668 25.374C10.5032 25.5005 10.6684 25.7494 10.8359 25.9258C11.4615 26.5838 12.3434 26.601 13.0107 25.9648C13.2899 25.7014 13.4233 25.4603 13.4863 25.0918C13.6291 24.2232 12.9218 23.3782 12.0273 23.3408Z"
        fill="url(#paint0_radial_14_443)"
      />
    </G>
    <Defs>
      <Filter
        id="filter0_ii_14_443"
        x="0"
        y="-1"
        width="50"
        height="52"
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
        <FeOffset dy="1" />
        <FeGaussianBlur stdDeviation="0.5" />
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <FeColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
        />
        <FeBlend in2="shape" result="effect1_innerShadow_14_443" />
        <FeColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <FeOffset dy="-1" />
        <FeGaussianBlur stdDeviation="0.5" />
        <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <FeColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <FeBlend
          mode="normal"
          in2="effect1_innerShadow_14_443"
          result="effect2_innerShadow_14_443"
        />
      </Filter>
      <RadialGradient
        id="paint0_radial_14_443"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(25 12.0968) rotate(90) scale(37.9032)"
      >
        <Stop stopColor="#EEE82C" />
        <Stop offset="1" stopColor="#91CB3E" />
      </RadialGradient>
    </Defs>
  </Svg>
);

const VerifiedPeixinhoBadge = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.59277 0.466797C7.24872 -0.155604 8.27765 -0.155604 8.93359 0.466797L9.52637 1.0293C9.86833 1.35377 10.3303 1.52192 10.8008 1.49316L11.6172 1.44336C12.5194 1.38848 13.3066 2.04924 13.4092 2.94727L13.502 3.76074C13.5554 4.22896 13.8009 4.65423 14.1797 4.93457L14.8369 5.4209C15.5637 5.95876 15.743 6.97155 15.2441 7.72559L14.792 8.40723C14.5319 8.80021 14.4468 9.28393 14.5566 9.74219L14.748 10.5381C14.9589 11.4171 14.4448 12.3074 13.5781 12.5645L12.7939 12.7969C12.342 12.9308 11.9653 13.2462 11.7549 13.668L11.3896 14.4004C10.9861 15.2093 10.0205 15.5605 9.19141 15.2002L8.44043 14.875C8.00817 14.6871 7.5172 14.6871 7.08496 14.875L6.33496 15.2002C5.50571 15.5607 4.53925 15.2096 4.13574 14.4004L3.77148 13.668C3.56111 13.2462 3.18436 12.9308 2.73242 12.7969L1.94824 12.5645C1.08148 12.3075 0.567422 11.4172 0.77832 10.5381L0.96875 9.74219C1.07867 9.28388 0.993511 8.80026 0.733398 8.40723L0.282227 7.72559C-0.216688 6.97163 -0.0381256 5.95883 0.688477 5.4209L1.34668 4.93457C1.72543 4.65422 1.97095 4.22891 2.02441 3.76074L2.11621 2.94727C2.21879 2.04913 3.00687 1.38836 3.90918 1.44336L4.72559 1.49316C5.19611 1.52192 5.65804 1.35377 6 1.0293L6.59277 0.466797ZM9.27832 4.63672C9.15421 4.62553 9.02944 4.64938 8.91797 4.70508C8.80665 4.76074 8.71299 4.84635 8.64746 4.95215C8.58192 5.0582 8.54688 5.181 8.54688 5.30566V6.51855C8.26255 6.52392 7.99091 6.53551 7.74121 6.55859C7.73996 6.43433 7.71217 6.31163 7.65918 6.19922C7.60606 6.08663 7.5289 5.98633 7.43359 5.90625C7.34052 5.8275 7.2309 5.77041 7.11328 5.73828C6.99564 5.70617 6.87216 5.70017 6.75195 5.7207C6.27712 5.80788 5.84779 6.05837 5.53809 6.42871C5.22832 6.79913 5.05739 7.26616 5.05566 7.74902V7.89258C4.71874 8.52181 4.53581 9.22193 4.52148 9.93555C4.51207 10.0817 4.5327 10.2283 4.58203 10.3662C4.6314 10.5042 4.70853 10.6312 4.80859 10.7383C4.90861 10.8452 5.02984 10.9307 5.16406 10.9893C5.2983 11.0478 5.44341 11.0786 5.58984 11.0791C6.66735 11.079 8.17096 10.5119 8.6543 9.46777H9.01074C9.22186 9.46666 9.42556 9.3894 9.58496 9.25098C9.74429 9.11253 9.84923 8.92172 9.87988 8.71289C9.89731 8.60618 9.89082 8.4966 9.86133 8.39258C9.83183 8.28855 9.77983 8.19204 9.70898 8.11035C9.63817 8.02877 9.54989 7.96379 9.45117 7.91992C9.35253 7.87615 9.24559 7.85432 9.1377 7.85645H9.03906C9.06215 7.607 9.07373 7.33567 9.0791 7.05078H10.292C10.4163 7.05121 10.5387 7.01739 10.6445 6.95215C10.7503 6.88692 10.8352 6.79284 10.8906 6.68164C10.947 6.57005 10.9709 6.44485 10.96 6.32031C10.949 6.19584 10.904 6.0766 10.8291 5.97656C10.6538 5.73528 10.4012 5.56115 10.1133 5.4834C10.0356 5.19599 9.8618 4.94375 9.62109 4.76855C9.52136 4.69375 9.40248 4.64792 9.27832 4.63672ZM5.27051 8.72168C5.66103 8.81348 6.01895 9.01235 6.30273 9.2959C6.58637 9.5794 6.78485 9.93683 6.87695 10.3271C6.46968 10.4479 6.04923 10.5201 5.625 10.542C5.54922 10.5467 5.47337 10.5346 5.40234 10.5078C5.33115 10.4809 5.26574 10.4396 5.21191 10.3857C5.15808 10.3319 5.11678 10.2665 5.08984 10.1953C5.06301 10.1243 5.05101 10.0484 5.05566 9.97266C5.07773 9.54878 5.14989 9.12863 5.27051 8.72168ZM8.54492 7.05273C8.51619 8.72788 8.20519 9.64082 7.37402 10.1143C7.25037 9.66229 7.01098 9.25031 6.67969 8.91895C6.3482 8.58751 5.93556 8.34823 5.4834 8.22461C5.95626 7.39274 6.86963 7.08147 8.54492 7.05273ZM5.86133 9.46777C5.79031 9.46783 5.72216 9.49575 5.67188 9.5459C5.62152 9.59626 5.59277 9.66511 5.59277 9.73633C5.59284 9.80745 5.62158 9.87548 5.67188 9.92578C5.72218 9.97607 5.7902 10.0048 5.86133 10.0049C5.93254 10.0049 6.0014 9.97614 6.05176 9.92578C6.10189 9.87551 6.12982 9.80733 6.12988 9.73633C6.12988 9.66512 6.1021 9.59625 6.05176 9.5459C6.0014 9.49554 5.93254 9.46777 5.86133 9.46777ZM9.1377 8.39355C9.1687 8.39145 9.19979 8.39637 9.22852 8.4082C9.25741 8.42016 9.28316 8.43932 9.30371 8.46289C9.32416 8.48638 9.33975 8.51382 9.34766 8.54395C9.35557 8.57418 9.35598 8.60612 9.34961 8.63672C9.33761 8.71808 9.29649 8.79279 9.23438 8.84668C9.17231 8.90038 9.09283 8.93026 9.01074 8.93066H8.84863C8.89823 8.75399 8.93778 8.57459 8.96777 8.39355H9.1377ZM6.97461 6.25586C7.01623 6.26763 7.05437 6.28889 7.08691 6.31738C7.12349 6.34808 7.15365 6.38641 7.17383 6.42969C7.19386 6.4728 7.20408 6.51984 7.2041 6.56738V6.62988C6.66482 6.70078 6.1489 6.89463 5.69629 7.19629C5.7894 6.95264 5.94429 6.73725 6.14551 6.57129C6.34696 6.40528 6.58854 6.29389 6.8457 6.24902C6.88848 6.24163 6.93282 6.24411 6.97461 6.25586ZM9.2334 5.17285C9.25895 5.17518 9.28345 5.18445 9.30371 5.2002C9.39251 5.26534 9.46703 5.34819 9.52246 5.44336C9.57779 5.53837 9.61307 5.64375 9.62598 5.75293C9.63521 5.80801 9.66169 5.85893 9.70117 5.89844C9.74069 5.93795 9.79156 5.9644 9.84668 5.97363C9.95584 5.98655 10.0612 6.02185 10.1562 6.07715C10.2514 6.13255 10.3343 6.20719 10.3994 6.2959C10.415 6.31621 10.4246 6.34072 10.4268 6.36621C10.4289 6.39182 10.4232 6.41772 10.4111 6.44043C10.4005 6.46291 10.3835 6.48211 10.3623 6.49512C10.3412 6.50798 10.3167 6.51438 10.292 6.51367H9.08398V5.30566C9.08369 5.28087 9.09024 5.25629 9.10352 5.23535C9.11689 5.21443 9.13656 5.19772 9.15918 5.1875C9.18194 5.17569 9.20787 5.17054 9.2334 5.17285Z"
      fill="url(#paint0_radial_295_774)"
    />
    <Defs>
      <RadialGradient
        id="paint0_radial_295_774"
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
      d="M5 10C4.0111 10 3.0444 9.70676 2.22215 9.15735C1.39991 8.60794 0.759043 7.82705 0.380605 6.91342C0.00216643 5.99979 -0.0968503 4.99446 0.0960758 4.02455C0.289002 3.05465 0.765206 2.16373 1.46447 1.46447C2.16373 0.765206 3.05465 0.289002 4.02455 0.0960758C4.99446 -0.0968503 5.99979 0.00216643 6.91342 0.380605C7.82705 0.759043 8.60794 1.39991 9.15735 2.22215C9.70676 3.0444 10 4.0111 10 5C9.99857 6.32564 9.47132 7.59658 8.53395 8.53395C7.59658 9.47132 6.32564 9.99857 5 10V10ZM5 0.833336C4.17591 0.833336 3.37033 1.07771 2.68513 1.53555C1.99992 1.99338 1.46587 2.64413 1.1505 3.40549C0.835139 4.16685 0.752625 5.00462 0.913397 5.81288C1.07417 6.62113 1.47101 7.36356 2.05372 7.94628C2.63644 8.529 3.37887 8.92584 4.18713 9.08661C4.99538 9.24738 5.83316 9.16487 6.59452 8.8495C7.35588 8.53414 8.00662 8.00008 8.46446 7.31488C8.9223 6.62967 9.16667 5.82409 9.16667 5C9.16546 3.89531 8.72608 2.8362 7.94494 2.05506C7.1638 1.27393 6.1047 0.834549 5 0.833336V0.833336ZM7.36084 6.56084C7.44338 6.48735 7.49336 6.38408 7.49977 6.27375C7.50617 6.16341 7.46849 6.05505 7.395 5.9725C7.32151 5.88995 7.21825 5.83998 7.10791 5.83357C6.99758 5.82716 6.88922 5.86485 6.80667 5.93834C6.29731 6.3672 5.66439 6.62235 5 6.66667C4.33601 6.62239 3.70343 6.36754 3.19417 5.93917C3.11173 5.86557 3.00343 5.82774 2.8931 5.83399C2.78276 5.84024 2.67943 5.89006 2.60584 5.9725C2.53224 6.05494 2.4944 6.16324 2.50065 6.27357C2.50691 6.38391 2.55673 6.48724 2.63917 6.56084C3.30078 7.12606 4.13093 7.4563 5 7.5C5.86908 7.4563 6.69922 7.12606 7.36084 6.56084ZM2.5 4.16667C2.5 4.58334 2.87292 4.58334 3.33334 4.58334C3.79375 4.58334 4.16667 4.58334 4.16667 4.16667C4.16667 3.94566 4.07887 3.73369 3.92259 3.57741C3.76631 3.42113 3.55435 3.33334 3.33334 3.33334C3.11232 3.33334 2.90036 3.42113 2.74408 3.57741C2.5878 3.73369 2.5 3.94566 2.5 4.16667V4.16667ZM5.83334 4.16667C5.83334 4.58334 6.20625 4.58334 6.66667 4.58334C7.12709 4.58334 7.5 4.58334 7.5 4.16667C7.5 3.94566 7.4122 3.73369 7.25592 3.57741C7.09964 3.42113 6.88768 3.33334 6.66667 3.33334C6.44566 3.33334 6.23369 3.42113 6.07741 3.57741C5.92113 3.73369 5.83334 3.94566 5.83334 4.16667Z"
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

const HomeIcon = () => (
  <Svg width="54" height="55" viewBox="0 0 54 55" fill="none">
    <Path
      d="M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27V28C54 42.9117 41.9117 55 27 55C12.0883 55 0 42.9117 0 28V27Z"
      fill="#EEE82C"
    />
    <Path
      d="M27 0.5C41.6355 0.5 53.5 12.3645 53.5 27V28C53.5 42.6355 41.6355 54.5 27 54.5C12.3645 54.5 0.5 42.6355 0.5 28V27C0.5 12.3645 12.3645 0.5 27 0.5Z"
      stroke="#001A23"
      strokeOpacity="0.4"
    />
    <Path
      d="M26.4951 29.4937C25.1144 29.4937 23.9951 30.6129 23.9951 31.9937V36.9937H28.9951V31.9937C28.9951 30.6129 27.8758 29.4937 26.4951 29.4937Z"
      fill="#001A23"
    />
    <Path
      d="M30.6618 31.994V36.994H33.9951C35.3758 36.994 36.4951 35.8747 36.4951 34.494V26.8932C36.4953 26.4603 36.3271 26.0443 36.0259 25.7332L28.9443 18.0773C27.6948 16.7254 25.5859 16.6424 24.2339 17.8919C24.1697 17.9513 24.1078 18.0131 24.0485 18.0773L16.9793 25.7307C16.6691 26.043 16.495 26.4655 16.4951 26.9057V34.494C16.4951 35.8747 17.6144 36.994 18.9951 36.994H22.3284V31.994C22.344 29.7217 24.1787 27.866 26.3938 27.8126C28.683 27.7574 30.6443 29.6446 30.6618 31.994Z"
      fill="#001A23"
    />
  </Svg>
);

const UserIcon = () => (
  <Svg width="15" height="20" viewBox="0 0 15 20" fill="none">
    <Path
      d="M7.5 10C10.2614 10 12.5 7.76142 12.5 5C12.5 2.23858 10.2614 0 7.5 0C4.73858 0 2.5 2.23858 2.5 5C2.5 7.76142 4.73858 10 7.5 10Z"
      fill="#E8F1F2"
    />
    <Path
      d="M7.5 11.6659C3.35977 11.6705 0.00460937 15.0257 0 19.1659C0 19.6261 0.373086 19.9992 0.83332 19.9992H14.1666C14.6269 19.9992 15 19.6261 15 19.1659C14.9954 15.0257 11.6402 11.6705 7.5 11.6659Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const FishNavIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M13.0121 0.047019C14.6454 -0.156607 16.7134 0.324674 18.1888 1.03657C18.875 1.34862 19.1452 2.29373 19.3883 2.98817C20.3374 5.69948 20.1715 8.5195 18.9637 11.1296C17.8607 13.4992 15.9077 15.3153 13.5311 16.1813C11.0277 17.1156 8.26993 16.9484 5.88605 15.7179C5.88163 15.8367 5.86442 15.9614 5.84833 16.0793C5.70853 17.1049 5.65187 18.1405 5.52906 19.1677C5.51506 19.2847 5.47217 19.4741 5.42081 19.5742C5.32184 19.7638 5.15424 19.9036 4.95577 19.9623C4.70396 20.0384 4.56267 19.9951 4.3488 19.8698C4.13128 19.6953 3.87336 19.4109 3.67497 19.2031L2.61816 18.0963L0.979161 16.3822C0.737662 16.1262 0.354518 15.7815 0.163908 15.4973C-0.248379 14.8825 0.171496 14.2912 0.819234 14.2345C2.00826 14.1305 3.16814 13.9828 4.34022 13.8192C4.21351 12.9204 4.0483 11.9451 3.99123 11.0369C3.88684 9.37522 4.16009 7.59675 4.80079 6.07254C4.91835 5.79286 5.1634 5.41589 5.31043 5.10522C4.8095 5.0027 4.32675 4.85234 3.81307 4.80199C2.94613 4.71698 2.33141 5.04398 2.01598 3.94206C2.06577 3.70971 2.1411 3.57646 2.29146 3.40095C3.49363 1.99761 5.65222 1.06062 7.46122 1.12921C7.76089 1.15329 8.2252 1.14344 8.50343 1.21355C9.01062 1.34139 8.84561 1.38659 9.30153 1.10346C9.62636 0.901734 10.0603 0.726712 10.425 0.595244C11.2619 0.299038 12.1311 0.114856 13.0121 0.047019Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const RefreshIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M19.1567 9.16667C18.9357 9.16667 18.7237 9.25447 18.5674 9.41074C18.4111 9.56703 18.3233 9.77899 18.3233 10C18.3301 11.9377 17.6637 13.8177 16.4379 15.3185C15.2122 16.8193 13.5033 17.8478 11.6032 18.2282C9.70321 18.6086 7.73004 18.3173 6.02099 17.4041C4.31194 16.4908 2.97312 15.0124 2.23336 13.2214C1.49361 11.4304 1.39884 9.43811 1.96527 7.58501C2.53169 5.7319 3.72414 4.13305 5.33879 3.06173C6.95345 1.9904 8.89006 1.51313 10.8176 1.71148C12.7452 1.90982 14.544 2.77148 15.9067 4.14917C15.8793 4.15664 15.8514 4.16249 15.8233 4.16667H13.3233C13.1023 4.16667 12.8904 4.25446 12.7341 4.41074C12.5778 4.56703 12.49 4.77899 12.49 5C12.49 5.22101 12.5778 5.43298 12.7341 5.58926C12.8904 5.74554 13.1023 5.83333 13.3233 5.83333H15.8233C16.4864 5.83333 17.1223 5.56994 17.5911 5.1011C18.0599 4.63226 18.3233 3.99637 18.3233 3.33333V0.833333C18.3233 0.61232 18.2355 0.400358 18.0793 0.244078C17.923 0.0877974 17.711 0 17.49 0C17.269 0 17.057 0.0877974 16.9007 0.244078C16.7445 0.400358 16.6567 0.61232 16.6567 0.833333V2.55417C14.9505 1.02878 12.7724 0.135139 10.4865 0.0225855C8.20065 -0.0899677 5.94538 0.585381 4.09757 1.93578C2.24976 3.28618 0.921366 5.22982 0.334358 7.44192C-0.25265 9.65402 -0.0627097 12.0006 0.87244 14.0895C1.80759 16.1784 3.4313 17.883 5.47224 18.9187C7.51318 19.9543 9.84772 20.2581 12.0857 19.7794C14.3238 19.3006 16.3297 18.0683 17.7684 16.2884C19.207 14.5084 19.9913 12.2887 19.99 10C19.99 9.77899 19.9022 9.56703 19.7459 9.41074C19.5896 9.25447 19.3777 9.16667 19.1567 9.16667Z"
      fill="#E8F1F2"
    />
    <Path
      d="M8.7377 6C8.54205 6 8.35442 6.07772 8.21607 6.21607C8.07772 6.35442 8 6.54205 8 6.73771V10.4262C8.00004 10.6219 8.07779 10.8095 8.21615 10.9478L10.4293 13.1609C10.5684 13.2953 10.7547 13.3696 10.9482 13.368C11.1416 13.3663 11.3266 13.2887 11.4634 13.1519C11.6002 13.0151 11.6778 12.8301 11.6794 12.6367C11.6811 12.4433 11.6068 12.2569 11.4724 12.1178L9.47541 10.1208V6.73771C9.47541 6.54205 9.39769 6.35442 9.25934 6.21607C9.12099 6.07772 8.93336 6 8.7377 6Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#001A23",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    marginBottom: 25,
    marginTop: 25,
  },
  headerTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogoContainer: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.4)",
    lineHeight: 22,
  },
  userNameText: {
    fontSize: 19,
    fontWeight: "300",
    color: "#E8F1F2",
    lineHeight: 22,
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
    backgroundColor: "#6DA544",
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
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 44, 59, 0.4)",
    borderRadius: 999,
    height: 63,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: 258,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  tabIcon: {
    width: 54,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconActive: {
    width: 54,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "rgba(0, 0, 0, 0.25)",
  },
});
