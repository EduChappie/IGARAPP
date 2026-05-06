import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function SenhaRecuperadaScreen() {
  const router = useRouter();

  // --- TRANSIÇÃO RÁPIDA (50ms) ---
  const handleNavigation = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  // Botão começa liberado porque é só uma tela de sucesso
  const isButtonActive = true;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: isButtonActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isButtonActive]);

  const buttonBackgroundColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#EEE82C"],
  });

  const buttonContentColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 26, 35, 0.4)", "#001A23"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#001A23" }}>
      {/* FUNDO COM GRADIENTE RADIAL */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="0%" r="70%" fx="50%" fy="0%">
              <Stop offset="0" stopColor="#00374A" stopOpacity="1" />
              <Stop offset="1" stopColor="#001A23" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* CONTEÚDO TRAVADO NO MEIO DA TELA */}
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <FishIcon width={50} height={50} />
            </View>

            <Text style={styles.title}>Recuperada com sucesso!</Text>
            <Text style={styles.subtitle}>
              Isso aí! Sua senha foi recuperada com sucesso!{"\n"}Agora você
              pode acessar sua conta.
            </Text>
          </View>

          <AnimatedTouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: buttonBackgroundColor },
            ]}
            disabled={!isButtonActive}
            activeOpacity={0.6}
            onPress={() => handleNavigation("../login_pl")} // Volta para o login!
          >
            <View style={styles.buttonContentRow}>
              <Animated.Text
                style={[
                  styles.primaryButtonText,
                  { color: buttonContentColor },
                ]}
              >
                Realizar Login
              </Animated.Text>
              <ArrowIcon
                color={isButtonActive ? "#001A23" : "rgba(0, 26, 35, 0.4)"}
              />
            </View>
          </AnimatedTouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const ArrowIcon = ({ color }: { color: string }) => (
  <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <Path
      d="M4.49127 13.448C4.19838 13.7409 4.19838 14.2157 4.49127 14.5086C4.78416 14.8015 5.25904 14.8015 5.55193 14.5086L5.0216 13.9783L4.49127 13.448ZM14.5086 5.55195C14.8015 5.25906 14.8015 4.78418 14.5086 4.49129C14.2157 4.1984 13.7408 4.1984 13.448 4.49129L13.9783 5.02162L14.5086 5.55195ZM8.9368 3.71184C8.52259 3.71368 8.18831 4.05096 8.19016 4.46517C8.19201 4.87938 8.52929 5.21367 8.9435 5.21182L8.94015 4.46183L8.9368 3.71184ZM10.9052 4.45306L10.9018 3.70307V3.70307L10.9052 4.45306ZM14.5468 8.09473L13.7969 8.09138V8.09138L14.5468 8.09473ZM13.7881 10.0564C13.7862 10.4706 14.1205 10.8079 14.5347 10.8097C14.9489 10.8116 15.2862 10.4773 15.2881 10.0631L14.5381 10.0598L13.7881 10.0564ZM13.7917 4.85735L14.2508 4.26423L14.2508 4.26422L13.7917 4.85735ZM14.1426 5.20816L14.7357 4.74914L14.7357 4.74914L14.1426 5.20816ZM5.0216 13.9783L5.55193 14.5086L14.5086 5.55195L13.9783 5.02162L13.448 4.49129L4.49127 13.448L5.0216 13.9783ZM8.94015 4.46183L8.9435 5.21182L10.9085 5.20305L10.9052 4.45306L10.9018 3.70307L8.9368 3.71184L8.94015 4.46183ZM14.5468 8.09473L13.7969 8.09138L13.7881 10.0564L14.5381 10.0598L15.2881 10.0631L15.2968 8.09807L14.5468 8.09473ZM10.9052 4.45306L10.9085 5.20305C11.7097 5.19948 12.2472 5.19822 12.6537 5.24261C13.0451 5.28536 13.219 5.36249 13.3327 5.45048L13.7917 4.85735L14.2508 4.26422C13.8285 3.93744 13.3427 3.80893 12.8165 3.75148C12.3055 3.69567 11.6677 3.69965 10.9018 3.70307L10.9052 4.45306ZM14.5468 8.09473L15.2968 8.09807C15.3003 7.33217 15.3042 6.69437 15.2484 6.18336C15.191 5.65725 15.0625 5.1714 14.7357 4.74914L14.1426 5.20816L13.5494 5.66718C13.6374 5.78088 13.7146 5.95477 13.7573 6.3462C13.8017 6.75271 13.8004 7.29021 13.7969 8.09138L14.5468 8.09473ZM13.7917 4.85735L13.3327 5.45048C13.4138 5.51326 13.4866 5.58606 13.5494 5.66718L14.1426 5.20816L14.7357 4.74914C14.5952 4.56762 14.4323 4.4047 14.2508 4.26423L13.7917 4.85735Z"
      fill={color}
    />
  </Svg>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    // Tela de sucesso centralizada fixamente!
    marginTop: Platform.OS === "ios" ? 220 : 260,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  headerContainer: { alignItems: "center", marginBottom: 30 },
  logoContainer: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#E8F1F2",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  primaryButton: {
    flexDirection: "row",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonContentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  primaryButtonText: { fontSize: 16, fontWeight: "bold" },
});
