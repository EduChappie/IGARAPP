import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon";

// Criando o componente animado para o botão
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function SenhaRecuperadaScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // --- VALIDAÇÃO E ANIMAÇÃO ---
  // O botão ativa se as duas senhas tiverem pelo menos 6 caracteres e forem IGUAIS
  const isButtonActive = oldPassword.length >= 6 && oldPassword === newPassword;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: isButtonActive ? 1 : 0,
      duration: 300, // Transição suave de 300ms
      useNativeDriver: false,
    }).start();
  }, [isButtonActive]);

  // Transição do Fundo: Branco/Gelo -> Amarelo Destaque (Conforme você pediu)
  const buttonBackgroundColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#DBE4E5", "#EEE82C"],
  });

  // Transição do Texto e Ícone: Como o fundo é sempre claro (branco ou amarelo), o texto fica sempre escuro
  const buttonContentColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#001A23", "#001A23"],
  });

  return (
    <ImageBackground
      source={require("../src/assets/imagem_fundo.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{
        top: -10,
        left: -2,
        transform: [{ scale: 1.03 }],
      }}
    >
      <LinearGradient
        colors={["transparent", "rgba(0, 26, 35, 0.7)", "#001A23", "#001A23"]}
        locations={[0, 0.4, 0.8, 1]}
        style={styles.overlay}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <FishIcon width={50} height={50} />
            </View>

            {/* --- TEXTOS ATUALIZADOS PARA SUCESSO --- */}
            <Text style={styles.title}>Recuperada com sucesso!</Text>
            <Text style={styles.subtitle}>
              Isso aí! Sua senha foi recuperada com sucesso!
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Sua nova senha"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry={!isPasswordVisible}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <EyeIcon />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Repetir senha</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Repita sua nova senha"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry={!isPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <EyeIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão com Animação Aplicada e Texto de Login */}
          <AnimatedTouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: buttonBackgroundColor },
              isButtonActive && styles.primaryButtonActive, // Aplica a sombra quando ativo
            ]}
            disabled={!isButtonActive}
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
              {/* O ArrowIcon é sempre escuro nessa tela porque o botão é claro */}
              <ArrowIcon color="#001A23" />
            </View>
          </AnimatedTouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ==========================================
// ÍCONES SVG INLINE
// ==========================================

const ArrowIcon = ({ color }: { color: string }) => (
  <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <Path
      d="M4.49127 13.448C4.19838 13.7409 4.19838 14.2157 4.49127 14.5086C4.78416 14.8015 5.25904 14.8015 5.55193 14.5086L5.0216 13.9783L4.49127 13.448ZM14.5086 5.55195C14.8015 5.25906 14.8015 4.78418 14.5086 4.49129C14.2157 4.1984 13.7408 4.1984 13.448 4.49129L13.9783 5.02162L14.5086 5.55195ZM8.9368 3.71184C8.52259 3.71368 8.18831 4.05096 8.19016 4.46517C8.19201 4.87938 8.52929 5.21367 8.9435 5.21182L8.94015 4.46183L8.9368 3.71184ZM10.9052 4.45306L10.9018 3.70307V3.70307L10.9052 4.45306ZM14.5468 8.09473L13.7969 8.09138V8.09138L14.5468 8.09473ZM13.7881 10.0564C13.7862 10.4706 14.1205 10.8079 14.5347 10.8097C14.9489 10.8116 15.2862 10.4773 15.2881 10.0631L14.5381 10.0598L13.7881 10.0564ZM13.7917 4.85735L14.2508 4.26423L14.2508 4.26422L13.7917 4.85735ZM14.1426 5.20816L14.7357 4.74914L14.7357 4.74914L14.1426 5.20816ZM5.0216 13.9783L5.55193 14.5086L14.5086 5.55195L13.9783 5.02162L13.448 4.49129L4.49127 13.448L5.0216 13.9783ZM8.94015 4.46183L8.9435 5.21182L10.9085 5.20305L10.9052 4.45306L10.9018 3.70307L8.9368 3.71184L8.94015 4.46183ZM14.5468 8.09473L13.7969 8.09138L13.7881 10.0564L14.5381 10.0598L15.2881 10.0631L15.2968 8.09807L14.5468 8.09473ZM10.9052 4.45306L10.9085 5.20305C11.7097 5.19948 12.2472 5.19822 12.6537 5.24261C13.0451 5.28536 13.219 5.36249 13.3327 5.45048L13.7917 4.85735L14.2508 4.26422C13.8285 3.93744 13.3427 3.80893 12.8165 3.75148C12.3055 3.69567 11.6677 3.69965 10.9018 3.70307L10.9052 4.45306ZM14.5468 8.09473L15.2968 8.09807C15.3003 7.33217 15.3042 6.69437 15.2484 6.18336C15.191 5.65725 15.0625 5.1714 14.7357 4.74914L14.1426 5.20816L13.5494 5.66718C13.6374 5.78088 13.7146 5.95477 13.7573 6.3462C13.8017 6.75271 13.8004 7.29021 13.7969 8.09138L14.5468 8.09473ZM13.7917 4.85735L13.3327 5.45048C13.4138 5.51326 13.4866 5.58606 13.5494 5.66718L14.1426 5.20816L14.7357 4.74914C14.5952 4.56762 14.4323 4.4047 14.2508 4.26423L13.7917 4.85735Z"
      fill={color}
    />
  </Svg>
);

const EyeIcon = () => (
  <Svg width="13" height="11" viewBox="0 0 13 11" fill="none">
    <Path
      d="M11.8766 6.52172L12.1609 6.72584L11.8766 6.52172ZM11.8766 4.17847L11.5923 4.38259V4.38259L11.8766 4.17847ZM0.902448 6.52172L1.18677 6.31761V6.31761L0.902448 6.52172ZM0.902447 4.17847L0.618127 3.97436L0.902447 4.17847ZM0.350098 5.3501H9.76622e-05V5.3501H0.350098ZM0.902448 6.52172L0.618128 6.72584C1.15767 7.4774 1.95824 8.46148 2.93459 9.2609C3.90694 10.057 5.09063 10.7001 6.38953 10.7001V10.3501V10.0001C5.32172 10.0001 4.29234 9.46788 3.37805 8.71928C2.46777 7.97396 1.70814 7.04386 1.18677 6.31761L0.902448 6.52172ZM6.38953 10.3501V10.7001C7.68843 10.7001 8.87212 10.057 9.84447 9.26089C10.8208 8.46148 11.6214 7.4774 12.1609 6.72584L11.8766 6.52172L11.5923 6.31761C11.0709 7.04386 10.3113 7.97396 9.40101 8.71928C8.48672 9.46788 7.45734 10.0001 6.38953 10.0001V10.3501ZM11.8766 4.17847L12.1609 3.97436C11.6214 3.2228 10.8208 2.23872 9.84447 1.4393C8.87212 0.643163 7.68843 9.76622e-05 6.38953 9.76622e-05V0.350098V0.700098C7.45734 0.700098 8.48672 1.23231 9.40101 1.98091C10.3113 2.72623 11.0709 3.65633 11.5923 4.38259L11.8766 4.17847ZM6.38953 0.350098V9.76622e-05C5.09063 9.76622e-05 3.90694 0.643163 2.93459 1.4393C1.95824 2.23872 1.15767 3.2228 0.618127 3.97436L0.902447 4.17847L1.18677 4.38259C1.70814 3.65633 2.46777 2.72623 3.37805 1.98091C4.29234 1.23231 5.32172 0.700098 6.38953 0.700098V0.350098ZM11.8766 6.52172L12.1609 6.72584C12.5129 6.23552 12.779 5.88534 12.779 5.3501H12.429H12.079C12.079 5.61931 11.9768 5.78206 11.5923 6.31761L11.8766 6.52172ZM11.8766 4.17847L11.5923 4.38259C11.9768 4.91813 12.079 5.08089 12.079 5.3501H12.429H12.779C12.779 4.81485 12.5129 4.46467 12.1609 3.97436L11.8766 4.17847ZM0.902448 6.52172L1.18677 6.31761C0.802299 5.78206 0.700098 5.61931 0.700098 5.3501H0.350098H9.76622e-05C9.76622e-05 5.88535 0.26613 6.23552 0.618128 6.72584L0.902448 6.52172ZM0.902447 4.17847L0.618127 3.97436C0.26613 4.46468 9.76622e-05 4.81485 9.76622e-05 5.3501H0.350098H0.700098C0.700098 5.08089 0.802299 4.91813 1.18677 4.38259L0.902447 4.17847ZM4.51453 5.3501H4.16453C4.16453 6.57893 5.1607 7.5751 6.38953 7.5751V7.2251V6.8751C5.5473 6.8751 4.86453 6.19233 4.86453 5.3501H4.51453ZM6.38953 7.2251V7.5751C7.61836 7.5751 8.61453 6.57893 8.61453 5.3501H8.26453H7.91453C7.91453 6.19233 7.23176 6.8751 6.38953 6.8751V7.2251ZM8.26453 5.3501H8.61453C8.61453 4.12126 7.61836 3.1251 6.38953 3.1251V3.4751V3.8251C7.23176 3.8251 7.91453 4.50786 7.91453 5.3501H8.26453ZM6.38953 3.4751V3.1251C5.1607 3.1251 4.16453 4.12126 4.16453 5.3501H4.51453H4.86453C4.86453 4.50786 5.5473 3.8251 6.38953 3.8251V3.4751Z"
      fill="white"
      fillOpacity="0.7"
    />
  </Svg>
);

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#E8F1F2",
    marginBottom: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "300",
    color: "rgba(232, 241, 242, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 10,
  },
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
    height: 47,
    backgroundColor: "#002C3B",
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "300",
  },
  eyeButton: {
    padding: 8,
    marginRight: -6,
  },
  primaryButton: {
    flexDirection: "row",
    height: 53,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonActive: {
    elevation: 3, // Sombra nativa do Android
    shadowColor: "#00282D", // Sombra nativa do iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  buttonContentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: "300",
  },
});
