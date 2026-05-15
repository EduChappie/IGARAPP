import { Audio, ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  GestureResponderEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ⚠️ Troque pelo caminho do seu vídeo do Tamba
const TAMBA_VIDEO = require("../assets/videos/tamba.mp4");

const MISSOES = [
  { label: "Ações nos últimos 30 dias", atual: 0, meta: 4 },
  { label: "Lixo recolhido (kg) nos últimos 3 dias", atual: 0, meta: 50 },
  { label: "Ações com metas totalmente batidas", atual: 0, meta: 2 },
];

const INSET = 14;
const BORDER_RADIUS = 30;
const CORNER_SIZE = 28;
const CORNER_THICKNESS = 2.5;
const CORNER_COLOR = "rgba(238, 232, 44, 0.55)";

// ==========================================
// SPLASH INDIVIDUAL
// ==========================================
const SplashEffect = ({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) => {
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0.7)).current;

  const drops = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      dist: new Animated.Value(0),
      dropOpacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ringScale, { toValue: 1, duration: 480, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(ringOpacity, { toValue: 0, duration: 480, delay: 100, useNativeDriver: true }),
      Animated.timing(ring2Scale, { toValue: 1, duration: 360, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(ring2Opacity, { toValue: 0, duration: 360, delay: 80, useNativeDriver: true }),
      ...drops.flatMap(({ dist, dropOpacity }) => [
        Animated.timing(dist, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(dropOpacity, { toValue: 0, duration: 400, delay: 120, useNativeDriver: true }),
      ]),
    ]).start();

    const t = setTimeout(onDone, 600);
    return () => clearTimeout(t);
  }, []);

  const DROP_DIST = 42;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Animated.View
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: 34,
          borderWidth: 2,
          borderColor: "rgba(100, 210, 255, 0.9)",
          opacity: ringOpacity,
          transform: [{ scale: ringScale }],
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          left: x - 18,
          top: y - 18,
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: "rgba(180, 235, 255, 0.75)",
          opacity: ring2Opacity,
          transform: [{ scale: ring2Scale }],
        }}
      />
      {drops.map(({ angle, dist, dropOpacity }, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: x - 4,
            top: y - 4,
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: "rgba(130, 215, 255, 0.95)",
            opacity: dropOpacity,
            transform: [
              {
                translateX: dist.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.cos(angle) * DROP_DIST],
                }),
              },
              {
                translateY: dist.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.sin(angle) * DROP_DIST - 14],
                }),
              },
              {
                scale: dist.interpolate({
                  inputRange: [0, 0.4, 1],
                  outputRange: [1, 1.3, 0.2],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};



// ==========================================
// TELA PRINCIPAL
// ==========================================
export default function TambaScreen() {
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const splashId = useRef(0);

  // Animações de entrada do vídeo
  const videoOpacity = useRef(new Animated.Value(0)).current;
  const videoScale = useRef(new Animated.Value(1.04)).current;

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    // Fade-in suave + leve zoom-out ao entrar
    Animated.parallel([
      Animated.timing(videoOpacity, {
        toValue: 1,
        duration: 1100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(videoScale, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://www.soundjay.com/nature/sounds/water-splash-1.mp3" },
        { shouldPlay: true, volume: 1.0 }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
      });
    } catch (_) {}
  };

  const shakeScreen = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 9, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -9, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 3, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    const id = splashId.current++;
    setSplashes((prev) => [...prev, { id, x: pageX, y: pageY }]);
    shakeScreen();
    playSound();
  };

  const removeSplash = (id: number) =>
    setSplashes((prev) => prev.filter((s) => s.id !== id));

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}
    >
      <StatusBar hidden />

      {/* VÍDEO com fade-in e zoom suave */}
      <Animated.View
        style={[
          styles.videoWrapper,
          {
            opacity: videoOpacity,
            transform: [{ scale: videoScale }],
          },
        ]}
      >
        <Video
          source={TAMBA_VIDEO}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay
        />
      </Animated.View>

      {/* ÁREA DE TOQUE */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>

      {/* FADES topo/base — mais sutis */}
      <View style={styles.fadeTop} pointerEvents="none" />
      <View style={styles.fadeBottom} pointerEvents="none" />

      {/* BORDA INTERNA */}
      <View style={styles.innerBorder} pointerEvents="none" />

      {/* CANTOS */}
      <View style={[styles.corner, styles.cornerTL]} pointerEvents="none" />
      <View style={[styles.corner, styles.cornerTR]} pointerEvents="none" />
      <View style={[styles.corner, styles.cornerBL]} pointerEvents="none" />
      <View style={[styles.corner, styles.cornerBR]} pointerEvents="none" />

      {/* SPLASHES */}
      {splashes.map((s) => (
        <SplashEffect key={s.id} x={s.x} y={s.y} onDone={() => removeSplash(s.id)} />
      ))}

      {/* HINT */}
      <View style={styles.hintContainer} pointerEvents="none">
        <Text style={styles.hintText}>toque na tela 🐟</Text>
      </View>

      {/* CARD DE MISSÕES */}
      <View style={styles.missoesCard} pointerEvents="none">
        <View style={styles.missoesHeader}>
          <FishMiniIcon />
          <Text style={styles.missoesTitle}>Missões do Tamba</Text>
        </View>
        {MISSOES.map((m, i) => {
          const pct = Math.min(m.atual / m.meta, 1);
          return (
            <View key={i} style={styles.missaoItem}>
              <View style={styles.missaoLabelRow}>
                <Text style={styles.missaoLabel} numberOfLines={2}>{m.label}</Text>
                <Text style={styles.missaoValor}>{m.atual}/{m.meta}</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

// ── Ícone de peixe pequeno ──
const FishMiniIcon = () => (
  <Svg width="13" height="13" viewBox="0 0 20 20" fill="none">
    <Path
      d="M13.0121 0.047019C14.6454 -0.156607 16.7134 0.324674 18.1888 1.03657C18.875 1.34862 19.1452 2.29373 19.3883 2.98817C20.3374 5.69948 20.1715 8.5195 18.9637 11.1296C17.8607 13.4992 15.9077 15.3153 13.5311 16.1813C11.0277 17.1156 8.26993 16.9484 5.88605 15.7179C5.88163 15.8367 5.86442 15.9614 5.84833 16.0793C5.70853 17.1049 5.65187 18.1405 5.52906 19.1677C5.51506 19.2847 5.47217 19.4741 5.42081 19.5742C5.32184 19.7638 5.15424 19.9036 4.95577 19.9623C4.70396 20.0384 4.56267 19.9951 4.3488 19.8698C4.13128 19.6953 3.87336 19.4109 3.67497 19.2031L2.61816 18.0963L0.979161 16.3822C0.737662 16.1262 0.354518 15.7815 0.163908 15.4973C-0.248379 14.8825 0.171496 14.2912 0.819234 14.2345C2.00826 14.1305 3.16814 13.9828 4.34022 13.8192C4.21351 12.9204 4.0483 11.9451 3.99123 11.0369C3.88684 9.37522 4.16009 7.59675 4.80079 6.07254C4.91835 5.79286 5.1634 5.41589 5.31043 5.10522C4.8095 5.0027 4.32675 4.85234 3.81307 4.80199C2.94613 4.71698 2.33141 5.04398 2.01598 3.94206C2.06577 3.70971 2.1411 3.57646 2.29146 3.40095C3.49363 1.99761 5.65222 1.06062 7.46122 1.12921C7.76089 1.15329 8.2252 1.14344 8.50343 1.21355C9.01062 1.34139 8.84561 1.38659 9.30153 1.10346C9.62636 0.901734 10.0603 0.726712 10.425 0.595244C11.2619 0.299038 12.1311 0.114856 13.0121 0.047019Z"
      fill="#EEE82C"
    />
  </Svg>
);

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001A23",
  },
  videoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "#001A23",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width,
    height,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0, 26, 35, 0.28)",
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    backgroundColor: "rgba(0, 26, 35, 0.35)",
  },
  innerBorder: {
    position: "absolute",
    top: INSET,
    left: INSET,
    right: INSET,
    bottom: INSET,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: INSET, left: INSET,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
  },
  cornerTR: {
    top: INSET, right: INSET,
    borderTopRightRadius: BORDER_RADIUS,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
  },
  cornerBL: {
    bottom: INSET, left: INSET,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
  },
  cornerBR: {
    bottom: INSET, right: INSET,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
  },
  hintContainer: {
    position: "absolute",
    bottom: 105,
    alignSelf: "center",
  },
  hintText: {
    fontSize: 13,
    color: "rgba(232, 241, 242, 0.3)",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  missoesCard: {
    position: "absolute",
    top: Platform.OS === "ios" ? 62 : 52,
    right: 28,
    width: 182,
    backgroundColor: "rgba(0, 26, 35, 0.72)",
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.13)",
    padding: 14,
    gap: 10,
  },
  missoesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  missoesTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#EEE82C",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  missaoItem: { gap: 5 },
  missaoLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 4,
  },
  missaoLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.8)",
    lineHeight: 13,
  },
  missaoValor: {
    fontSize: 10,
    fontWeight: "600",
    color: "#EEE82C",
    marginTop: 1,
  },
  progressBg: {
    height: 3,
    borderRadius: 99,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#EEE82C",
  },
});