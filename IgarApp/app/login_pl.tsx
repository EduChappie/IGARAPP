import { extra, styles } from "@/styles/_style";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { use, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/services/firebase/config';
import { useAuth } from "@/src/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- PADRÃO DE NAVEGAÇÃO SUAVE (50ms) ---
  const handleNavigation = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  function passwordVisibility() {
    setIsPasswordHidden(!isPasswordHidden);
  }

  // --- VALIDAÇÃO DO FORMULÁRIO ---
  const isFormValid = email.trim().includes("@") && senha.length >= 6;

  // --- LOGIN COM FIREBASE AUTH ---
  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Login bem-sucedido:", userCredential.user.uid);

      // Redireciona para home_user após login bem-sucedido
      setTimeout(() => {
        if (user?.tipo == "voluntário") {
          router.replace("/home_user");

        } else if (user?.tipo == "ong") {
          router.replace("/home_ong");
        }
        
      }, 50);
    } catch (error: any) {
      console.error("Erro no login:", error);

      // Tratamento de erros específicos do Firebase
      let message = "Erro ao fazer login. Tente novamente.";

      switch (error.code) {
        case 'auth/invalid-email':
          message = "Email inválido. Verifique o formato.";
          break;
        case 'auth/user-disabled':
          message = "Esta conta foi desativada.";
          break;
        case 'auth/user-not-found':
          message = "Usuário não encontrado. Verifique o email.";
          break;
        case 'auth/wrong-password':
          message = "Senha incorreta. Tente novamente.";
          break;
        case 'auth/too-many-requests':
          message = "Muitas tentativas. Tente mais tarde.";
          break;
        case 'auth/network-request-failed':
          message = "Erro de conexão. Verifique sua internet.";
          break;
      }

      setErrorMessage(message);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#012A36" }}>
      {/* BOTÃO VOLTAR - CORRIGIDO PARA SEMPRE IR PARA FIRSTSCREEN */}
      <View style={{ position: "absolute", top: 60, left: 24, zIndex: 10 }}>
        <TopGlassButton onPress={() => handleNavigation("/firstscreen")} />
      </View>

      <View style={styles.mainContainer}>
        <Image
          source={require("@/assets/images/floresta.png")}
          style={[
            styles.backgroundImageStyle,
            {
              position: "absolute",
              width: "100%",
              height: "45%",
              resizeMode: "cover",
            },
          ]}
        />

        <LinearGradient
          colors={["transparent", "rgba(1, 42, 54, 0.9)", "#012A36"]}
          locations={[0, 0.35, 0.6]}
          style={styles.backgroundGradientOverlay}
        />

        <View style={extra.topContentContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.applicationLogoImage}
          />
          <Text style={extra.mainTitleText}>Bem-vindo de volta!</Text>
          <Text style={extra.subtitleDescriptionText}>
            Acesse sua conta para continuar ajudando{"\n"}a preservar nossa
            Amazônia.
          </Text>
        </View>

        <View style={extra.bottomActionContainer}>
          <View>
            <Text style={extra.label}>Seu e-mail</Text>
            <TextInput
              placeholder="seuemail@dominio.com"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={[extra.inputFiled, isFocused1 && extra.inputFocused1]}
              onFocus={() => setIsFocused1(true)}
              onBlur={() => setIsFocused1(false)}
            />

            <Text style={extra.label}>Sua senha</Text>
            <View
              style={[extra.inputContainer, isFocused2 && extra.inputFocused2]}
            >
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                autoCapitalize="none"
                secureTextEntry={isPasswordHidden}
                value={senha}
                onChangeText={setSenha}
                style={extra.inputFiledInside}
                onFocus={() => setIsFocused2(true)}
                onBlur={() => setIsFocused2(false)}
              />
              <TouchableOpacity style={extra.eye} onPress={passwordVisibility}>
                <Ionicons
                  name={isPasswordHidden ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#A0B3B8"
                />
              </TouchableOpacity>
            </View>

            {/* BOTÃO ACESSAR COM FIREBASE AUTH */}
            <TouchableOpacity
              disabled={!isFormValid || loading}
              activeOpacity={0.6}
              onPress={handleLogin}
              style={[
                extra.buttonSubmit,
                !isFormValid
                  ? { backgroundColor: "#FFFFFF" }
                  : { backgroundColor: "#EEE82C" },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <>
                  <Text style={extra.buttonSubmitText}>Acessar Conta</Text>
                  <Ionicons
                    name={"arrow-forward"}
                    style={{ transform: [{ rotate: "-45deg" }] }}
                    size={20}
                    color={"#000000"}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={extra.forgotPasswordText}>
            Esqueceu sua senha?{" "}
            <Text
              style={styles.underline}
              onPress={() => handleNavigation("/recuperar-senha-email")}
            >
              Redefinir Senha
            </Text>
          </Text>
        </View>
      </View>

      {/* MODAL DE ERRO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeErrorModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalHeader}>
              <Text style={modalStyles.modalTitle}>Erro no Login</Text>
              <TouchableOpacity onPress={closeErrorModal}>
                <Ionicons name="close" size={24} color="#E8F1F2" />
              </TouchableOpacity>
            </View>
            <Text style={modalStyles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={modalStyles.modalButton}
              onPress={closeErrorModal}
            >
              <Text style={modalStyles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const TopGlassButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={{
      width: 44,
      height: 44,
      borderRadius: 15,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
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
        <Rect x="2.5" y="2.5" width="39" height="39" rx="15" fill="#EEE82C" />
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
);

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 26, 35, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#002C3B",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E8F1F2",
  },
  modalMessage: {
    fontSize: 16,
    color: "#A0B3B8",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#EEE82C",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001A23",
  },
});