import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import FishIcon from "../src/components/icons/FishIcon";

export default function RecuperarSenhaEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const isValidEmail = email.includes("@") && email.includes(".");

  return (
    <View style={{ flex: 1, backgroundColor: "#001A23" }}>
      {/* CAMADA 1 */}
      <ImageBackground
        source={require("../src/assets/imagem_tree_fundo.jpeg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        imageStyle={{ transform: [{ scale: 1.0 }, { translateY: -230 }] }}
      />

      {/* CAMADA 2 */}
      <MaskedView
        style={StyleSheet.absoluteFillObject}
        maskElement={
          <LinearGradient
            colors={["transparent", "#FFFFFF"]}
            locations={[0, 1.0]}
            style={StyleSheet.absoluteFillObject}
          />
        }
      >
        <ImageBackground
          source={require("../src/assets/imagem_tree_fundo.jpeg")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          blurRadius={Platform.OS === "web" ? 5 : 15}
          imageStyle={{ transform: [{ scale: 1.0 }, { translateY: -230 }] }}
        />
      </MaskedView>

      {/* CAMADA 3 */}
      <LinearGradient
        colors={["transparent", "rgba(0, 26, 35, 0.7)", "#001A23", "#001A23"]}
        locations={[0.1, 0.4, 0.65, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* CAMADA 4: Proteção contra o teclado */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : -130}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
              />

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <BackArrowIcon />
              </TouchableOpacity>

              <View style={styles.content}>
                <View style={styles.headerContainer}>
                  <View style={styles.logoContainer}>
                    <FishIcon width={50} height={50} />
                  </View>

                  <Text style={styles.title}>Recuperar senha...</Text>
                  <Text style={styles.subtitle}>
                    Você se esqueceu da sua senha, mas nós{"\n"}vamos nos ajudar
                    a recuperá-la!
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Endereço de E-mail</Text>
                  <View style={styles.inputContainer}>
                    <EmailOutlineIcon />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Digite o seu e-mail (seuemail@dominio.com)"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <CheckIcon />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !isValidEmail && { opacity: 0.7 },
                  ]}
                  disabled={!isValidEmail}
                  onPress={() => router.push("/confirmar-codigo")}
                >
                  <View style={styles.buttonContentRow}>
                    <Text style={styles.primaryButtonText}>
                      Criar nova senha
                    </Text>
                    <ArrowIcon color="#001A23" />
                  </View>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

// ==========================================
// ÍCONES SVG INLINE
// ==========================================
const BackArrowIcon = () => (
  <Svg width="20" height="17" viewBox="0 0 20 17" fill="none">
    <Path
      d="M8.25 15.75L0.75 8.25M0.75 8.25L8.25 0.75M0.75 8.25H18.75"
      stroke="#F8F9FA"
      strokeOpacity="0.8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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

const EmailOutlineIcon = () => (
  <Svg width="17" height="13" viewBox="0 0 17 13" fill="none">
    <Path
      d="M15.9375 2.28125V10.5938C15.9375 11.5775 15.14 12.375 14.1562 12.375H2.28125C1.29749 12.375 0.5 11.5775 0.5 10.5938V2.28125M15.9375 2.28125C15.9375 1.29749 15.14 0.5 14.1562 0.5H2.28125C1.29749 0.5 0.5 1.29749 0.5 2.28125M15.9375 2.28125V2.4734C15.9375 3.09195 15.6166 3.66623 15.0898 3.99041L9.1523 7.64426C8.57979 7.99657 7.85771 7.99657 7.2852 7.64426L1.3477 3.99041C0.820901 3.66623 0.5 3.09195 0.5 2.4734V2.28125"
      stroke="white"
      strokeOpacity="0.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M15.2858 7.78565C15.2858 11.9278 11.9279 15.2856 7.78577 15.2856C3.64363 15.2856 0.285767 11.9278 0.285767 7.78565C0.285767 3.64351 3.64363 0.285645 7.78577 0.285645C11.9279 0.285645 15.2858 3.64351 15.2858 7.78565Z"
      fill="#002C3B"
    />
    <Path
      d="M5.28577 8.41065L7.16077 10.2856L10.2858 5.91065M15.2858 7.78565C15.2858 11.9278 11.9279 15.2856 7.78577 15.2856C3.64363 15.2856 0.285767 11.9278 0.285767 7.78565C0.285767 3.64351 3.64363 0.285645 7.78577 0.285645C11.9279 0.285645 15.2858 3.64351 15.2858 7.78565Z"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="0.571429"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    paddingBottom: 150,
  },
  headerContainer: { alignItems: "center", marginBottom: 20 },
  logoContainer: { marginBottom: 20 },
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
  inputGroup: { marginBottom: 10 },
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
    marginHorizontal: 10,
  },
  primaryButton: {
    flexDirection: "row",
    height: 53,
    backgroundColor: "#DBE4E5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0, 40, 45, 0.25)",
  },
  buttonContentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  primaryButtonText: { fontSize: 12, fontWeight: "300", color: "#001A23" },
});
