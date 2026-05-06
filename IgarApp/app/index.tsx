import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon"; // Ajuste o caminho se necessário

// Pegamos a altura da tela para fazer a bola vir lá de baixo
const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  // 1. Animação de subida (Começa fora da tela/no rodapé)
  const translateY = useRef(new Animated.Value(height / 2 + 100)).current;

  // 2. Animação de giro 3D (Vai de 0 até 1)
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequência de animações exatamente como no Figma
    Animated.sequence([
      // 1º Passo: Delay inicial antes de começar a subir
      Animated.delay(800),

      // 2º Passo: Sobe para o centro com efeito Spring (Massa 1, Stiffness 400, Damping 15)
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 400,
        damping: 15,
        mass: 1,
        useNativeDriver: true,
      }),

      // 3º Passo: Pequena pausa no meio da tela
      Animated.delay(150),

      // 4º Passo: Gira a bola revelando o ícone (Curva Cubic-Bezier do Figma)
      Animated.timing(flip, {
        toValue: 1,
        duration: 350, // Tempo de duração do flip
        easing: Easing.bezier(0.7, -0.4, 0.4, 1.4), // O efeitinho de elástico
        useNativeDriver: true,
      }),

      // 5º Passo: Mantém o ícone na tela por um tempo
      Animated.delay(800),
    ]).start(() => {
      // Quando toda a animação terminar, redireciona para a tela de Login!
      // Usamos 'replace' para que o usuário não consiga voltar para essa tela de animação.
      router.replace("/tutorial");
    });
  }, []);

  // --- MATEMÁTICA DO GIRO 3D ---
  // A frente vai de 0º até 180º (e some na metade)
  const frontRotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // O verso começa invertido (180º) e gira até 360º para ficar de frente
  const backRotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#001A23"
        translucent
      />

      {/* Este é o "elevador" que move tudo de baixo para o centro */}
      <Animated.View
        style={[styles.centerWrapper, { transform: [{ translateY }] }]}
      >
        {/* --- FRENTE: A Bola Redonda --- */}
        <Animated.View
          style={[
            styles.absoluteCenter,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontRotateY }],
              backfaceVisibility: "hidden", // Esconde quando vira de costas
            },
          ]}
        >
          <BallSVG />
        </Animated.View>

        {/* --- VERSO: O Ícone do Aplicativo --- */}
        <Animated.View
          style={[
            styles.absoluteCenter,
            {
              transform: [{ perspective: 1000 }, { rotateY: backRotateY }],
              backfaceVisibility: "hidden", // Esconde quando vira de costas
            },
          ]}
        >
          <FishIcon width={50} height={50} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ==========================================
// SVG DA BOLA (Extraído do Figma)
// ==========================================
const BallSVG = () => (
  <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <Defs>
      <RadialGradient
        id="paint0_radial_22_1028"
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
    <Rect width="50" height="50" rx="25" fill="url(#paint0_radial_22_1028)" />
  </Svg>
);

// ==========================================
// ESTILOS
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001A23",
    justifyContent: "center",
    alignItems: "center",
  },
  centerWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteCenter: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});