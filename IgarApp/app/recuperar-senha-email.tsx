import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, {
  Defs,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon"; // Ajuste o caminho se necessário

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function RecuperarSenhaEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // --- TRANSIÇÃO RÁPIDA (50ms) ---
  const handleNavigation = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  const isValidEmail = email.includes("@") && email.includes(".");

  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: isValidEmail ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isValidEmail]);

  const buttonBackgroundColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#EEE82C"],
  });

  return (
    // TouchableWithoutFeedback envolvendo tudo para fechar o teclado ao clicar fora
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#001A23" }}>
        {/* FUNDO COM GRADIENTE RADIAL */}
        <View style={StyleSheet.absoluteFillObject}>
          <Svg height="100%" width="100%">
            <Defs>
              <RadialGradient
                id="grad"
                cx="50%"
                cy="0%"
                r="70%"
                fx="50%"
                fy="0%"
              >
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

          {/* BOTÃO VOLTAR FIXO */}
          <TouchableOpacity
            style={styles.backButtonWrapper}
            onPress={() => router.back()}
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
                <Rect
                  x="2.5"
                  y="2.5"
                  width="39"
                  height="39"
                  rx="15"
                  fill="#EEE82C"
                />
                <Rect
                  x="3"
                  y="3"
                  width="38"
                  height="38"
                  rx="14.5"
                  stroke="#001A23"
                  strokeOpacity="0.4"
                />
                <Path
                  d="M25 15 L 18 22 L 25 29"
                  stroke="#001A23"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </G>
            </Svg>
          </TouchableOpacity>

          {/* CONTEÚDO TRAVADO (Imóvel quando o teclado sobe) */}
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <FishIcon width={50} height={50} />
              </View>

              <Text style={styles.title}>Recuperar senha...</Text>
              <Text style={styles.subtitle}>
                Você se esqueceu da sua senha, mas nós{"\n"}vamos te ajudar a
                recuperá-la!
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço de E-mail</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="seuemail@dominio.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <AnimatedTouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: buttonBackgroundColor },
              ]}
              disabled={!isValidEmail}
              activeOpacity={0.6}
              onPress={() => handleNavigation("../confirmar-codigo")}
            >
              <View style={styles.buttonContentRow}>
                <Text
                  style={[
                    styles.primaryButtonText,
                    !isValidEmail
                      ? { color: "rgba(0, 26, 35, 0.4)" }
                      : { color: "#001A23" },
                  ]}
                >
                  Criar nova senha
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={!isValidEmail ? "rgba(0, 26, 35, 0.4)" : "#001A23"}
                  style={{ transform: [{ rotate: "-45deg" }] }}
                />
              </View>
            </AnimatedTouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backButtonWrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 60,
    left: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 24,
    // A MÁGICA ESTÁ AQUI: Fixamos a margem do topo, assim o encolhimento da tela não afeta a posição
    marginTop: Platform.OS === "ios" ? 140 : 240,
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
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#002C3B",
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "300",
  },
  primaryButton: {
    flexDirection: "row",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  primaryButtonText: { fontSize: 16, fontWeight: "bold" },
});
