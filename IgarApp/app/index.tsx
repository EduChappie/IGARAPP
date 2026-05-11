import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  // Animações
  const translateY = useRef(new Animated.Value(height / 2 + 100)).current;
  const flip = useRef(new Animated.Value(0)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;

  // Flag para evitar recarregar animação se a pessoa voltar (back button)
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (animationStarted) return;
    setAnimationStarted(true);

    const checkMemoryAndAnimate = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem("hasSeenTutorial");
        let nextRoute = "/firstscreen";

        if (hasSeen !== "true") {
          await AsyncStorage.setItem("hasSeenTutorial", "true");
          nextRoute = "/tutorial";
        }

        // Roda as animações normais
        Animated.sequence([
          Animated.delay(500), // Delay reduzido
          Animated.spring(translateY, {
            toValue: 0,
            stiffness: 400,
            damping: 15,
            mass: 1,
            useNativeDriver: true,
          }),
          Animated.delay(100),
          Animated.timing(flip, {
            toValue: 1,
            duration: 350,
            easing: Easing.bezier(0.7, -0.4, 0.4, 1.4),
            useNativeDriver: true,
          }),
          Animated.delay(800), // Tempo que a tela fica parada mostrando o logo final
        ]).start(() => {
          // O TRUQUE MASTER:
          // Primeiro nós dizemos pro roteador colocar a próxima tela "por baixo".
          // Como usamos push() e a Splash está opaca, o usuário ainda vê a Splash.
          router.push(nextRoute as any);

          // Agora, damos um segundinho para a tela nova "renderizar a tinta" por trás...
          setTimeout(() => {
            // E então, esmaecemos a Splash Screen para revelar a tela pronta!
            Animated.timing(fadeOutOpacity, {
              toValue: 0,
              duration: 300, // Suave
              useNativeDriver: true,
            }).start(() => {
              // Somente quando ficou invisível, a gente joga a Splash no lixo de verdade.
              router.replace(nextRoute as any);
            });
          }, 100);
        });
      } catch (error) {
        console.log("Erro na memória:", error);
        router.replace("/firstscreen");
      }
    };

    checkMemoryAndAnimate();
  }, [animationStarted]);

  const frontRotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    // Essa View precisa cobrir absolutamente tudo, como uma cortina.
    <Animated.View style={[styles.container, { opacity: fadeOutOpacity }]}>
      <Animated.View
        style={[styles.centerWrapper, { transform: [{ translateY }] }]}
      >
        <Animated.View
          style={[
            styles.absoluteCenter,
            {
              transform: [{ perspective: 1000 }, { rotateY: frontRotateY }],
              backfaceVisibility: "hidden",
            },
          ]}
        >
          <BallSVG />
        </Animated.View>

        <Animated.View
          style={[
            styles.absoluteCenter,
            {
              transform: [{ perspective: 1000 }, { rotateY: backRotateY }],
              backfaceVisibility: "hidden",
            },
          ]}
        >
          <FishIcon width={50} height={50} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    // "absoluteFillObject" faz a tela virar uma cortina real
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#001A23",
    justifyContent: "center",
    alignItems: "center",
    // Elevações extremas para garantir que fica por cima na transição!
    zIndex: 9999,
    elevation: 9999,
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
