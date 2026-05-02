import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function ConfirmarCodigoScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(49);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formattedTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;

  const isComplete = code.length === 6;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: isComplete ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isComplete]);

  const buttonBackgroundColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#203422", "#EEE82C"],
  });

  const buttonTextColor = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#3D523B", "#001A23"],
  });

  const handleCodeChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCode(numericValue);
  };

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
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : -99}
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

              <View style={styles.content}>
                <View style={styles.headerContainer}>
                  <View style={styles.logoContainer}>
                    <FishIcon width={50} height={50} />
                  </View>
                  <Text style={styles.title}>Recuperar senha...</Text>
                </View>

                <View style={styles.navigationRow}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.back()}
                  >
                    <BackArrowIcon />
                  </TouchableOpacity>

                  <Text style={styles.subtitleTitle}>Confirmar código</Text>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push("/login-email")}
                  >
                    <CloseIcon />
                  </TouchableOpacity>
                </View>

                <View style={styles.otpContainer}>
                  <TextInput
                    ref={inputRef}
                    value={code}
                    onChangeText={handleCodeChange}
                    maxLength={6}
                    keyboardType="number-pad"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={styles.hiddenInput}
                    caretHidden={true}
                    autoFocus={Platform.OS !== "web"}
                  />

                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const char = code[index];
                    const isFilled = !!char;
                    const isCurrentBox = isFocused && code.length === index;

                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => inputRef.current?.focus()}
                        style={[
                          styles.codeBox,
                          isFilled && styles.codeBoxFilled,
                        ]}
                      >
                        {isFilled ? (
                          <Text style={styles.codeText}>{char}</Text>
                        ) : isCurrentBox ? (
                          <View style={styles.cursor} />
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.instructionText}>
                  Um código de 6 dígitos foi enviado para{"\n"}
                  <Text style={styles.emailText}>seuemail@dominio.com</Text>
                </Text>

                <AnimatedTouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: buttonBackgroundColor },
                  ]}
                  disabled={!isComplete}
                  onPress={() => {
                    Keyboard.dismiss();
                    router.push("/recuperar-senha");
                  }}
                >
                  <View style={styles.buttonContentRow}>
                    <Animated.Text
                      style={[
                        styles.primaryButtonText,
                        { color: buttonTextColor },
                      ]}
                    >
                      Continuar
                    </Animated.Text>
                    <ArrowIcon color={isComplete ? "#001A23" : "#3D523B"} />
                  </View>
                </AnimatedTouchableOpacity>

                <TouchableOpacity
                  style={styles.resendContainer}
                  disabled={timeLeft > 0}
                >
                  <Text style={styles.resendText}>
                    Reenviar código{" "}
                    <Text style={styles.timerText}>({formattedTime})</Text>
                  </Text>
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
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <Path
      d="M0.75 12.75L12.75 0.750001M0.75 0.75L12.75 12.75"
      stroke="#F8F9FA"
      strokeOpacity="0.5"
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

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  headerContainer: { alignItems: "center", marginBottom: 0 },
  logoContainer: { marginBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#E8F1F2",
    marginBottom: 10,
    textAlign: "center",
  },
  navigationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitleTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#E8F1F2",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    position: "relative",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    zIndex: 999,
  },
  codeBox: {
    width: 49,
    height: 50,
    backgroundColor: "#002C3B",
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  codeBoxFilled: {
    backgroundColor: "#EEE82C",
    borderColor: "#EEE82C",
    elevation: 3,
    shadowColor: "#00282D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  codeText: { fontSize: 20, fontWeight: "400", color: "#001A23" },
  cursor: { width: 2, height: 17, backgroundColor: "#EEE82C" },
  instructionText: {
    fontSize: 12,
    fontWeight: "300",
    color: "#E8F1F2",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 18,
  },
  emailText: { fontWeight: "400", color: "#FFFFFF" },
  primaryButton: {
    flexDirection: "row",
    height: 53,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonContentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  primaryButtonText: { fontSize: 12, fontWeight: "300" },
  resendContainer: { alignItems: "center", marginBottom: 50 },
  resendText: { fontSize: 12, fontWeight: "400", color: "#E8F1F2" },
  timerText: { fontWeight: "300", color: "rgba(232, 241, 242, 0.7)" },
});
