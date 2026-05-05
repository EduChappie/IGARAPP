import { useRouter } from "expo-router"; // <-- Importação do roteador adicionada
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function LoginScreen() {
  const router = useRouter(); // <-- Ativando o roteador
  const [phoneNumber, setPhoneNumber] = useState("");

  const isButtonActive = phoneNumber.replace(/\D/g, "").length >= 11;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: isButtonActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isButtonActive]);

  const backgroundColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#203422", "#EEE82C"],
  });

  const textColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#3D523B", "#001A23"],
  });

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
    }
    if (cleaned.length > 7) {
      formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
    }
    setPhoneNumber(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001A23" />

      <View style={styles.content}>
        <View style={{ marginBottom: 24, marginTop: 20 }}>
          <FishIcon width={50} height={50} />
        </View>

        <Text style={styles.title}>Bem vindo de volta</Text>
        <Text style={styles.subtitle}>
          Coloque o seu número de telefone associado a sua conta{" "}
          <Text style={{ fontWeight: "500", color: "#E8F1F2" }}>IgarApp</Text>
        </Text>

        <View style={styles.inputRow}>
          <View style={styles.countryCodeContainer}>
            <BrazilFlag />
            <Text style={styles.countryCodeText}>+55</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o seu número de telefone"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={15}
            />
          </View>
        </View>

        <AnimatedTouchableOpacity
          style={[styles.continueButton, { backgroundColor }]}
          disabled={!isButtonActive}
          onPress={() => router.replace("../home_ong")}
        >
          <Animated.Text
            style={[styles.continueButtonText, { color: textColor }]}
          >
            Continuar
          </Animated.Text>
          <View style={styles.arrowIconContainer}>
            <ArrowIcon color="#001A23" />
          </View>
        </AnimatedTouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* --- NAVEGAÇÃO ADICIONADA AQUI --- */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => router.push("/login-email")} // Leva para a tela de email
        >
          <Text style={styles.socialButtonText}>Continuar com o E-mail</Text>
          <EmailIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// ÍCONES SVG INLINE
// ==========================================

// ==========================================
// ÍCONES SVG INLINE
// ==========================================

const BrazilFlag = () => (
  <Svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <G clipPath="url(#clip0_20_542)">
      <Path
        d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26Z"
        fill="#6DA544"
      />
      <Path
        d="M13 5.08691L23.7391 13L13 20.913L2.26086 13L13 5.08691Z"
        fill="#FFDA44"
      />
      <Path
        d="M13 17.5217C15.4973 17.5217 17.5217 15.4973 17.5217 13C17.5217 10.5027 15.4973 8.47827 13 8.47827C10.5027 8.47827 8.47827 10.5027 8.47827 13C8.47827 15.4973 10.5027 17.5217 13 17.5217Z"
        fill="#F0F0F0"
      />
      <Path
        d="M10.7391 12.7174C9.95285 12.7174 9.19403 12.837 8.47974 13.0589C8.51137 15.5289 10.5225 17.5218 13 17.5218C14.532 17.5218 15.885 16.7592 16.7029 15.5937C15.3036 13.8419 13.1504 12.7174 10.7391 12.7174Z"
        fill="#0052B4"
      />
      <Path
        d="M17.438 13.8663C17.4924 13.5858 17.5218 13.2964 17.5218 13C17.5218 10.5027 15.4973 8.47827 13.0001 8.47827C11.1367 8.47827 9.5371 9.60567 8.84485 11.2153C9.45676 11.0885 10.0903 11.0218 10.7392 11.0218C13.3655 11.0217 15.7413 12.1134 17.438 13.8663Z"
        fill="#0052B4"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_20_542">
        <Rect width="26" height="26" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const ArrowIcon = ({ color }: { color: string }) => (
  <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <Path
      d="M4.49127 13.448C4.19838 13.7409 4.19838 14.2157 4.49127 14.5086C4.78416 14.8015 5.25904 14.8015 5.55193 14.5086L5.0216 13.9783L4.49127 13.448ZM14.5086 5.55195C14.8015 5.25906 14.8015 4.78418 14.5086 4.49129C14.2157 4.1984 13.7408 4.1984 13.448 4.49129L13.9783 5.02162L14.5086 5.55195ZM8.9368 3.71184C8.52259 3.71368 8.18831 4.05096 8.19016 4.46517C8.19201 4.87938 8.52929 5.21367 8.9435 5.21182L8.94015 4.46183L8.9368 3.71184ZM10.9052 4.45306L10.9018 3.70307V3.70307L10.9052 4.45306ZM14.5468 8.09473L13.7969 8.09138V8.09138L14.5468 8.09473ZM13.7881 10.0564C13.7862 10.4706 14.1205 10.8079 14.5347 10.8097C14.9489 10.8116 15.2862 10.4773 15.2881 10.0631L14.5381 10.0598L13.7881 10.0564ZM13.7917 4.85735L14.2508 4.26423L14.2508 4.26422L13.7917 4.85735ZM14.1426 5.20816L14.7357 4.74914L14.7357 4.74914L14.1426 5.20816ZM5.0216 13.9783L5.55193 14.5086L14.5086 5.55195L13.9783 5.02162L13.448 4.49129L4.49127 13.448L5.0216 13.9783ZM8.94015 4.46183L8.9435 5.21182L10.9085 5.20305L10.9052 4.45306L10.9018 3.70307L8.9368 3.71184L8.94015 4.46183ZM14.5468 8.09473L13.7969 8.09138L13.7881 10.0564L14.5381 10.0598L15.2881 10.0631L15.2968 8.09807L14.5468 8.09473ZM10.9052 4.45306L10.9085 5.20305C11.7097 5.19948 12.2472 5.19822 12.6537 5.24261C13.0451 5.28536 13.219 5.36249 13.3327 5.45048L13.7917 4.85735L14.2508 4.26422C13.8285 3.93744 13.3427 3.80893 12.8165 3.75148C12.3055 3.69567 11.6677 3.69965 10.9018 3.70307L10.9052 4.45306ZM14.5468 8.09473L15.2968 8.09807C15.3003 7.33217 15.3042 6.69437 15.2484 6.18336C15.191 5.65725 15.0625 5.1714 14.7357 4.74914L14.1426 5.20816L13.5494 5.66718C13.6374 5.78088 13.7146 5.95477 13.7573 6.3462C13.8017 6.75271 13.8004 7.29021 13.7969 8.09138L14.5468 8.09473ZM13.7917 4.85735L13.3327 5.45048C13.4138 5.51326 13.4866 5.58606 13.5494 5.66718L14.1426 5.20816L14.7357 4.74914C14.5952 4.56762 14.4323 4.4047 14.2508 4.26423L13.7917 4.85735Z"
      fill={color}
    />
  </Svg>
);

const EmailIcon = () => (
  <Svg width="16" height="14" viewBox="0 0 16 14" fill="none">
    <Path
      d="M14.0204 2.70886C14.3293 3.40007 14.4602 4.34228 14.6851 5.96207C15.0304 8.44826 15.2031 9.69135 14.8235 10.6568C14.4902 11.5044 13.8748 12.2111 13.0812 12.6578C12.1771 13.1667 10.9221 13.1667 8.41202 13.1667H7.12621C4.61615 13.1667 3.36112 13.1667 2.45706 12.6578C1.66339 12.2111 1.04803 11.5044 0.714759 10.6568C0.335132 9.69135 0.507784 8.44826 0.853088 5.96207C1.06373 4.44542 1.19187 3.52281 1.4609 2.84407M14.0204 2.70886C13.9601 2.57389 13.893 2.44849 13.8171 2.32948C13.4076 1.68756 12.8216 1.17737 12.1295 0.860076C11.344 0.5 10.3667 0.5 8.41202 0.5H7.12621C5.17154 0.5 4.1942 0.5 3.40874 0.860076C2.71659 1.17737 2.13064 1.68756 1.72115 2.32948C1.62047 2.4873 1.5353 2.65636 1.4609 2.84407M14.0204 2.70886L13.9503 2.77895L13.271 3.4583C10.6321 6.09719 9.31265 7.41663 7.67306 7.41663C6.03346 7.41663 4.71402 6.09719 2.07513 3.4583L1.4609 2.84407"
      stroke="#FAFAFA"
    />
  </Svg>
);

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001A23",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#E8F1F2",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 32,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 10,
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002C3B",
    paddingVertical: 14,
    paddingHorizontal: 10,
    height: 47,
    width: 79,
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: 8,
  },
  countryCodeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "400",
  },
  inputContainer: {
    flex: 1,
    height: 47,
    backgroundColor: "#002C3B",
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  textInput: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "300",
  },
  continueButton: {
    flexDirection: "row",
    height: 53,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: "300",
  },
  arrowIconContainer: {
    marginLeft: 4,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: "300",
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#002C3B",
    height: 53,
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "300",
  },
});
