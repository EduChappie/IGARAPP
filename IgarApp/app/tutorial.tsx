import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ==========================================
// DADOS DO TUTORIAL (COPIE E COLE DIRETO!)
// ==========================================
const TUTORIAL_DATA = [
  {
    id: "1",
    title: "Bem-vindo ao IgarApp",
    description:
      "A ponte perfeita entre a vontade de ajudar e as organizações que precisam de você. Conecte-se, encontre ações sociais e gere impacto real na nossa região.",
    Icon: () => <WelcomeArt />,
  },
  {
    id: "2",
    title: "Conheça o Tamba!",
    description:
      "Ele é o nosso mascote e companheiro de jornada! Conforme você avança e participa dos projetos, o Tamba evolui, desbloqueando novas animações e recompensas exclusivas.",
    Icon: () => <TambaArt />,
  },
  {
    id: "3",
    title: "Nosso Propósito",
    description:
      "Queremos motivar pessoas, criar conexões duradouras e fortalecer projetos que transformam. Seja voluntário ou organização, o seu impacto começa aqui.",
    Icon: () => <PurposeArt />,
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < TUTORIAL_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Quando finalizar o tutorial, manda para o Login!
      router.replace("/login_fl");
    }
  };

  const renderItem = ({ item }: { item: (typeof TUTORIAL_DATA)[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.artContainer}>
          <item.Icon />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001A23" />

      {/* Fundo com leve degradê para dar profundidade */}
      <LinearGradient
        colors={["#001A23", "#002C3B", "#001A23"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.flatListContainer}>
          <Animated.FlatList
            ref={flatListRef}
            data={TUTORIAL_DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false },
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
          />
        </View>

        <View style={styles.footer}>
          {/* Paginador (Bolinhas) */}
          <View style={styles.paginator}>
            {TUTORIAL_DATA.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 24, 10], // Estica a bolinha ativa
                extrapolate: "clamp",
              });

              const backgroundColor = scrollX.interpolate({
                inputRange,
                outputRange: [
                  "rgba(255,255,255,0.2)",
                  "#EEE82C",
                  "rgba(255,255,255,0.2)",
                ],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i.toString()}
                  style={[styles.dot, { width: dotWidth, backgroundColor }]}
                />
              );
            })}
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            style={styles.button}
            onPress={scrollToNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {currentIndex === TUTORIAL_DATA.length - 1
                ? "Começar Jornada"
                : "Próximo"}
            </Text>
            {currentIndex === TUTORIAL_DATA.length - 1 && <SettingsIcon />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ==========================================
// ARTES ABSTRATAS TEMPORÁRIAS (PLACEHOLDERS)
// ==========================================

const WelcomeArt = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
    <Defs>
      <SvgLinearGradient id="grad1" x1="0" y1="0" x2="200" y2="200">
        <Stop offset="0" stopColor="#EEE82C" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#91CB3E" stopOpacity="0.2" />
      </SvgLinearGradient>
    </Defs>
    <Rect x="20" y="40" width="120" height="140" rx="20" fill="url(#grad1)" />
    <Rect
      x="60"
      y="20"
      width="120"
      height="140"
      rx="20"
      fill="#002C3B"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <Circle cx="120" cy="90" r="30" fill="#EEE82C" fillOpacity="0.9" />
  </Svg>
);

const TambaArt = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
    <Defs>
      <SvgLinearGradient id="grad2" x1="0" y1="200" x2="200" y2="0">
        <Stop offset="0" stopColor="#91CB3E" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#001A23" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    <Circle cx="100" cy="100" r="80" fill="url(#grad2)" />
    <Circle cx="100" cy="100" r="40" fill="#EEE82C" />
    <Path
      d="M85 95 Q 100 115 115 95"
      stroke="#001A23"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </Svg>
);

const PurposeArt = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
    <Defs>
      <SvgLinearGradient id="grad3" x1="200" y1="0" x2="0" y2="200">
        <Stop offset="0" stopColor="#EEE82C" stopOpacity="0.6" />
        <Stop offset="1" stopColor="#91CB3E" stopOpacity="0.1" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M 100 20 L 180 80 L 150 180 L 50 180 L 20 80 Z"
      fill="url(#grad3)"
    />
    <Circle
      cx="100"
      cy="110"
      r="25"
      fill="#002C3B"
      stroke="#EEE82C"
      strokeWidth="4"
    />
    <Circle cx="100" cy="110" r="10" fill="#EEE82C" />
  </Svg>
);

const SettingsIcon = () => (
  <View style={{ marginLeft: 8 }}>
    <Svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#001A23"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  </View>
);

// ==========================================
// ESTILOS
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001A23",
  },
  flatListContainer: {
    flex: 3,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  artContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // Adiciona um efeitinho de sombra/glow nas artes
    shadowColor: "#EEE82C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    flex: 0.4,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#E8F1F2",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.7)",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  paginator: {
    flexDirection: "row",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "#DBE4E5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0, 40, 45, 0.2)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#001A23",
  },
});
