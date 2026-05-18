import { extra, styles } from "@/styles/_style";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '@/src/services/firebase/config';

// AQUI ESTAVA O ERRO! A função DEVE começar com letra Maiúscula no React.
export default function CadastroPFScreen() {
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function passwordVisibility() {
    setIsPasswordHidden(!isPasswordHidden);
  }

  function formatData(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  }

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/\) (\d{5})(\d)/, ") $1-$2");
  }

  // LÓGICA DE VALIDAÇÃO DO FORMULÁRIO (Libera o botão amarelo)
  const isFormValid =
    username.trim().length > 2 &&
    email.trim().includes("@") &&
    senha.length >= 6 &&
    dataNascimento.length === 10 && // Espera DD/MM/AAAA
    telefone.length >= 14; // Espera (XX) 9XXXX-XXXX

  // --- CADASTRO COM FIREBASE AUTH E FIRESTORE ---
  const handleCadastro = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      console.log("Usuário criado no Auth:", userId);

      // 2. Preparar dados para o Firestore
      const userData = {
        nome: username.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        dataNascimento: dataNascimento.trim(),
        tipo: "voluntário",
        fotoCapa: "",
        fotoPerfil: "",
        dataCriacao: serverTimestamp(),
        uid: userId,
      };

      // 3. Salvar dados adicionais no Firestore (collection "users")
      console.log("Tentando salvar no Firestore - collection: users, userId:", userId);
      const userDocRef = doc(firestore, "users", userId);

      try {
        await setDoc(userDocRef, userData);
        console.log("✅ Dados salvos com SUCESSO no Firestore:", userData);
      } catch (firestoreError: any) {
        console.error("❌ Erro ao salvar no Firestore:", firestoreError);
        console.error("Código do erro:", firestoreError.code);
        console.error("Mensagem do erro:", firestoreError.message);
        throw firestoreError; // Re-lançar o erro para ser capturado pelo catch externo
      }

      // 4. Avançar para tela de sucesso
      setStep(2);

    } catch (error: any) {
      console.error("❌❌❌ ERRO COMPLETO no cadastro:", error);
      console.error("Código:", error.code);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);

      // Tratamento de erros específicos do Firebase
      let message = "Erro ao criar conta. Tente novamente.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "Este email já está em uso. Tente fazer login.";
          break;
        case 'auth/invalid-email':
          message = "Email inválido. Verifique o formato.";
          break;
        case 'auth/weak-password':
          message = "Senha muito fraca. Use pelo menos 6 caracteres.";
          break;
        case 'auth/operation-not-allowed':
          message = "Operação não permitida. Contate o suporte.";
          break;
        case 'auth/network-request-failed':
          message = "Erro de conexão. Verifique sua internet.";
          break;
        case 'auth/too-many-requests':
          message = "Muitas tentativas. Tente mais tarde.";
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
      {/* BOTÃO QUADRADO DE VOLTAR */}
      {step === 1 && (
        <View style={{ position: "absolute", top: 60, left: 24, zIndex: 10 }}>
          <TopGlassButton onPress={() => router.back()} />
        </View>
      )}

      <View style={styles.mainContainer}>
        {/* IMAGEM FIXA NO FUNDO */}
        <Image
          source={require("@/assets/images/floresta.png")}
          style={[
            styles.backgroundImageStyle,
            {
              position: "absolute",
              width: "100%",
              height: "60%",
              resizeMode: "cover",
            },
          ]}
        />

        {/* OVERLAY DE DEGRADÊ DINÂMICO */}
        <LinearGradient
          colors={["transparent", "rgba(1, 42, 54, 0.95)", "#012A36"]}
          locations={step === 2 ? [0, 0.65, 0.85] : [0, 0.4, 0.65]}
          style={styles.backgroundGradientOverlay}
        />

        {/* --- CONTEÚDO SUPERIOR --- */}
        {step === 1 && (
          <View style={[extra.topContentContainer, { paddingTop: 170 }]}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.applicationLogoImage}
            />
            <Text style={extra.mainTitleText}>Vamos começar agora!</Text>
            <Text style={extra.subtitleDescriptionText}>
              Um app para aqueles que querem ajudar a amazônia{"\n"}a se tornar
              um lugar mais limpo e digno
            </Text>
          </View>
        )}

        {/* --- CONTEÚDO INFERIOR --- */}
        {step === 2 ? (
          /* TELA DE SUCESSO (ETAPA 2) */
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingHorizontal: 24,
              paddingBottom: 60,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.applicationLogoImage}
              />

              <Text style={cadastroSuccessExtra.successTitle}>
                Parabéns! Sua conta foi{"\n"}criada com sucesso
              </Text>

              <Text style={extra.subtitleDescriptionText}>
                Um app para aqueles que querem ajudar a amazônia{"\n"}a se
                tornar um lugar mais limpo e digno
              </Text>

              <View
                style={[
                  cadastroExtra.stepContainer,
                  cadastroSuccessExtra.stepSpacing,
                  { marginBottom: 20 },
                ]}
              >
                <View style={cadastroExtra.stepDot} />
                <View style={cadastroExtra.stepLineActive} />
                <View style={cadastroExtra.stepDot} />
              </View>

              {/* REDIRECIONA PARA O LOGIN APÓS CRIAR CONTA */}
              <TouchableOpacity
                onPress={() => router.replace("/login_pl")}
                style={cadastroExtra.buttonProximaEtapa}
              >
                <Text style={cadastroExtra.buttonProximaEtapaText}>
                  Fazer Login
                </Text>
                <Ionicons
                  name={"arrow-forward"}
                  style={{ transform: [{ rotate: "-45deg" }] }}
                  size={18}
                  color={"black"}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 80 }}>
              <Text style={extra.termsAndPrivacyText}>
                Ao criar sua conta no{" "}
                <Text style={styles.destaque}>IgarApp</Text>, você estará
                concordando{"\n"}
                com os{" "}
                <Text style={styles.destaque}>
                  <Text style={styles.underline}>Termos de Uso</Text>
                </Text>{" "}
                e{" "}
                <Text style={styles.destaque}>
                  <Text style={styles.underline}>Política de Privacidade</Text>
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          /* FORMULÁRIO (ETAPA 1) */
          <View style={extra.bottomActionContainer}>
            <View style={{ paddingTop: 5 }}>
              <View style={[cadastroExtra.stepContainer, { marginBottom: 15 }]}>
                <View style={cadastroExtra.stepDot} />
                <View style={cadastroExtra.stepLine} />
                <View style={cadastroExtra.stepDotInactive} />
              </View>

              <Text style={cadastroExtra.labelSmall}>Nome de usuário</Text>
              <TextInput
                placeholder="Digite o seu nome de usuário"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={username}
                onChangeText={setUsername}
                style={[
                  cadastroExtra.inputFieldFullWidth,
                  focused === "username" &&
                  cadastroExtra.inputFieldFullWidthFocused,
                ]}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
              />

              <View style={cadastroExtra.rowInputContainer}>
                <View style={cadastroExtra.halfInputWrapper}>
                  <Text style={cadastroExtra.labelSmall}>
                    Seu melhor e-mail
                  </Text>
                  <TextInput
                    placeholder="Digite o seu e-mail"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={[
                      cadastroExtra.inputField,
                      focused === "email" && cadastroExtra.inputFieldFocused,
                    ]}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                  />
                </View>

                <View style={cadastroExtra.halfInputWrapper}>
                  <Text style={cadastroExtra.labelSmall}>Sua senha</Text>
                  <View
                    style={[
                      cadastroExtra.passwordWrapper,
                      focused === "senha" &&
                      cadastroExtra.passwordWrapperFocused,
                    ]}
                  >
                    <TextInput
                      placeholder="Crie uma senha forte"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      autoCapitalize="none"
                      secureTextEntry={isPasswordHidden}
                      value={senha}
                      onChangeText={setSenha}
                      style={cadastroExtra.passwordInput}
                      onFocus={() => setFocused("senha")}
                      onBlur={() => setFocused("")}
                    />
                    <TouchableOpacity
                      style={cadastroExtra.eyeIcon}
                      onPress={passwordVisibility}
                    >
                      <Ionicons
                        name={
                          isPasswordHidden ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color="#A6FF00"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={cadastroExtra.rowInputContainer}>
                <View style={cadastroExtra.halfInputWrapper}>
                  <Text style={cadastroExtra.labelSmall}>
                    Data de Nascimento
                  </Text>
                  <TextInput
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="numeric"
                    value={dataNascimento}
                    onChangeText={(t) => setDataNascimento(formatData(t))}
                    style={[
                      cadastroExtra.inputField,
                      focused === "dataNascimento" &&
                      cadastroExtra.inputFieldFocused,
                    ]}
                    onFocus={() => setFocused("dataNascimento")}
                    onBlur={() => setFocused("")}
                  />
                </View>
                <View style={cadastroExtra.halfInputWrapper}>
                  <Text style={cadastroExtra.labelSmall}>
                    Número de telefone
                  </Text>
                  <TextInput
                    placeholder="(XX) 9XXXX-XXXX"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="phone-pad"
                    value={telefone}
                    onChangeText={(t) => setTelefone(formatTelefone(t))}
                    style={[
                      cadastroExtra.inputField,
                      focused === "telefone" && cadastroExtra.inputFieldFocused,
                    ]}
                    onFocus={() => setFocused("telefone")}
                    onBlur={() => setFocused("")}
                  />
                </View>
              </View>

              {/* BOTÃO CADASTRAR COM FIREBASE */}
              <TouchableOpacity
                onPress={handleCadastro}
                disabled={!isFormValid || loading}
                style={[
                  cadastroExtra.buttonProximaEtapa,
                  !isFormValid && { backgroundColor: "#FFFFFF" },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" size="small" />
                ) : (
                  <>
                    <Text style={cadastroExtra.buttonProximaEtapaText}>
                      Criar Conta
                    </Text>
                    <Ionicons
                      name={"arrow-forward"}
                      style={{ transform: [{ rotate: "-45deg" }] }}
                      size={18}
                      color={"black"}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 80 }}>
              <Text style={extra.termsAndPrivacyText}>
                Ao criar sua conta no{" "}
                <Text style={styles.destaque}>IgarApp</Text>, você estará
                concordando{"\n"}
                com os{" "}
                <Text style={styles.destaque}>
                  <Text style={styles.underline}>Termos de Uso</Text>
                </Text>{" "}
                e{" "}
                <Text style={styles.destaque}>
                  <Text style={styles.underline}>Política de Privacidade</Text>
                </Text>
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* MODAL DE ERRO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeErrorModal}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContainer}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Erro no Cadastro</Text>
              <TouchableOpacity onPress={closeErrorModal}>
                <Ionicons name="close" size={24} color="#E8F1F2" />
              </TouchableOpacity>
            </View>
            <Text style={localStyles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={localStyles.modalButton}
              onPress={closeErrorModal}
            >
              <Text style={localStyles.modalButtonText}>Entendi</Text>
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

const localStyles = StyleSheet.create({
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