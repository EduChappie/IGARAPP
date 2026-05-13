import { extra, styles } from "@/styles/_style";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";
import { cadastroTwoExtra } from "@/styles/cadastro_two_extra_styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

// NOME DA FUNÇÃO CORRIGIDO PARA MAIÚSCULA
export default function CadastroOngScreen() {
  const router = useRouter();

  // Estado principal que controla em qual etapa o usuário está
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- ESTADOS DA ETAPA 1 ---
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  // --- ESTADOS DA ETAPA 2 ---
  const [dataFundacao, setDataFundacao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sobre, setSobre] = useState("");

  // --- ESTADOS DA ETAPA 3 ---
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [semNumero, setSemNumero] = useState(false);
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // --- FUNÇÃO PARA TRANSIÇÃO SUAVE ---
  const handleNavigation = (rota: string) => {
    setTimeout(() => {
      router.replace(rota as any);
    }, 150);
  };

  // --- FUNÇÕES DE FORMATAÇÃO ---
  function formatCnpj(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
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

  // --- LÓGICA DE VALIDAÇÃO POR ETAPA ---
  const isStep1Valid =
    email.includes("@") &&
    senha.length >= 6 &&
    razaoSocial.trim().length > 2 &&
    cnpj.length >= 14;

  const isStep2Valid =
    dataFundacao.length === 10 &&
    telefone.length >= 14 &&
    sobre.trim().length > 5;

  const isStep3Valid =
    cep.length >= 8 &&
    rua.trim().length > 2 &&
    (semNumero || numero.trim().length > 0) &&
    bairro.trim().length > 2 &&
    cidade.trim().length > 2 &&
    estado.trim().length >= 2;

  // Decide se o botão atual está liberado dependendo do step
  let isCurrentStepValid = false;
  if (step === 1) isCurrentStepValid = isStep1Valid;
  if (step === 2) isCurrentStepValid = isStep2Valid;
  if (step === 3) isCurrentStepValid = isStep3Valid;

  // --- CADASTRO DA ONG COM FIREBASE ---
  const handleCadastroOng = async () => {
    if (!isStep3Valid) return;

    setLoading(true);
    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      console.log("ONG criada no Auth:", userId);

      // 2. Preparar dados para o Firestore
      const ongData = {
        razaoSocial: razaoSocial.trim(),
        cnpj: cnpj.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        dataFundacao: dataFundacao.trim(),
        sobre: sobre.trim(),
        endereco: {
          cep: cep.trim(),
          rua: rua.trim(),
          numero: semNumero ? "S/N" : numero.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim(),
        },
        tipo: "ong",
        dataCriacao: serverTimestamp(),
        uid: userId,
      };

      // 3. Salvar dados da ONG no Firestore (collection "ongs")
      const ongDocRef = doc(firestore, "ongs", userId);

      try {
        await setDoc(ongDocRef, ongData);
      } catch (firestoreError: any) {
        throw firestoreError; // Re-lançar o erro para ser capturado pelo catch externo
      }

      // 4. Avançar para tela de sucesso
      setStep(4);

    } catch (error: any) {

      // Tratamento de erros específicos do Firebase
      let message = "Erro ao criar conta da ONG. Tente novamente.";

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
        {step === 4 ? (
          /* TELA DE SUCESSO (ETAPA 4) */
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
                Parabéns! Sua ONG foi{"\n"}cadastrada com sucesso
              </Text>

              <Text style={extra.subtitleDescriptionText}>
                Agora você pode criar ações e mobilizar voluntários{"\n"}para
                preservar a Amazônia.
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
          /* FORMULÁRIO (ETAPAS 1-3) */
          <View style={extra.bottomActionContainer}>
            <View style={{ paddingTop: 5 }}>
              {/* INDICADOR DE ETAPAS */}
              <View style={[cadastroExtra.stepContainer, { marginBottom: 15 }]}>
                <View style={cadastroExtra.stepDot} />
                <View style={cadastroExtra.stepLine} />
                <View style={step >= 2 ? cadastroExtra.stepDot : cadastroExtra.stepDotInactive} />
                <View style={cadastroExtra.stepLine} />
                <View style={step >= 3 ? cadastroExtra.stepDot : cadastroExtra.stepDotInactive} />
              </View>

              {/* ETAPA 1: DADOS BÁSICOS */}
              {step === 1 && (
                <>
                  <Text style={cadastroExtra.labelSmall}>Razão Social</Text>
                  <TextInput
                    placeholder="Nome oficial da ONG"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={razaoSocial}
                    onChangeText={setRazaoSocial}
                    style={[
                      cadastroExtra.inputFieldFullWidth,
                      focused === "razaoSocial" &&
                      cadastroExtra.inputFieldFullWidthFocused,
                    ]}
                    onFocus={() => setFocused("razaoSocial")}
                    onBlur={() => setFocused("")}
                  />

                  <View style={cadastroExtra.rowInputContainer}>
                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>CNPJ</Text>
                      <TextInput
                        placeholder="00.000.000/0000-00"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        keyboardType="numeric"
                        value={cnpj}
                        onChangeText={(t) => setCnpj(formatCnpj(t))}
                        style={[
                          cadastroExtra.inputField,
                          focused === "cnpj" && cadastroExtra.inputFieldFocused,
                        ]}
                        onFocus={() => setFocused("cnpj")}
                        onBlur={() => setFocused("")}
                      />
                    </View>

                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>E-mail</Text>
                      <TextInput
                        placeholder="email@ong.org"
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
                  </View>

                  <Text style={cadastroExtra.labelSmall}>Senha</Text>
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
                      onPress={() => setIsPasswordHidden(!isPasswordHidden)}
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

                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    disabled={!isStep1Valid}
                    style={[
                      cadastroExtra.buttonProximaEtapa,
                      !isStep1Valid && { backgroundColor: "#FFFFFF" },
                    ]}
                  >
                    <Text style={cadastroExtra.buttonProximaEtapaText}>
                      Próxima Etapa
                    </Text>
                    <Ionicons
                      name={"arrow-forward"}
                      style={{ transform: [{ rotate: "-45deg" }] }}
                      size={18}
                      color={"black"}
                    />
                  </TouchableOpacity>
                </>
              )}

              {/* ETAPA 2: INFORMAÇÕES ADICIONAIS */}
              {step === 2 && (
                <>
                  <Text style={cadastroExtra.labelSmall}>Data de Fundação</Text>
                  <TextInput
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="numeric"
                    value={dataFundacao}
                    onChangeText={(t) => setDataFundacao(formatData(t))}
                    style={[
                      cadastroExtra.inputFieldFullWidth,
                      focused === "dataFundacao" &&
                      cadastroExtra.inputFieldFullWidthFocused,
                    ]}
                    onFocus={() => setFocused("dataFundacao")}
                    onBlur={() => setFocused("")}
                  />

                  <Text style={cadastroExtra.labelSmall}>Telefone</Text>
                  <TextInput
                    placeholder="(XX) 9XXXX-XXXX"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="phone-pad"
                    value={telefone}
                    onChangeText={(t) => setTelefone(formatTelefone(t))}
                    style={[
                      cadastroExtra.inputFieldFullWidth,
                      focused === "telefone" &&
                      cadastroExtra.inputFieldFullWidthFocused,
                    ]}
                    onFocus={() => setFocused("telefone")}
                    onBlur={() => setFocused("")}
                  />

                  <Text style={cadastroExtra.labelSmall}>Sobre a ONG</Text>
                  <TextInput
                    placeholder="Descreva os objetivos e atividades da sua ONG"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={sobre}
                    onChangeText={setSobre}
                    multiline
                    numberOfLines={4}
                    style={[
                      cadastroExtra.textArea,
                      focused === "sobre" && cadastroExtra.textAreaFocused,
                    ]}
                    onFocus={() => setFocused("sobre")}
                    onBlur={() => setFocused("")}
                  />

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => setStep(1)}
                      style={cadastroExtra.buttonVoltar}
                    >
                      <Text style={cadastroExtra.buttonVoltarText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setStep(3)}
                      disabled={!isStep2Valid}
                      style={[
                        cadastroExtra.buttonProximaEtapa,
                        { flex: 1 },
                        !isStep2Valid && { backgroundColor: "#FFFFFF" },
                      ]}
                    >
                      <Text style={cadastroExtra.buttonProximaEtapaText}>
                        Próxima Etapa
                      </Text>
                      <Ionicons
                        name={"arrow-forward"}
                        style={{ transform: [{ rotate: "-45deg" }] }}
                        size={18}
                        color={"black"}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* ETAPA 3: ENDEREÇO */}
              {step === 3 && (
                <>
                  <Text style={cadastroExtra.labelSmall}>CEP</Text>
                  <TextInput
                    placeholder="00000-000"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    keyboardType="numeric"
                    value={cep}
                    onChangeText={setCep}
                    style={[
                      cadastroExtra.inputFieldFullWidth,
                      focused === "cep" &&
                      cadastroExtra.inputFieldFullWidthFocused,
                    ]}
                    onFocus={() => setFocused("cep")}
                    onBlur={() => setFocused("")}
                  />

                  <Text style={cadastroExtra.labelSmall}>Rua</Text>
                  <TextInput
                    placeholder="Nome da rua"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={rua}
                    onChangeText={setRua}
                    style={[
                      cadastroExtra.inputFieldFullWidth,
                      focused === "rua" &&
                      cadastroExtra.inputFieldFullWidthFocused,
                    ]}
                    onFocus={() => setFocused("rua")}
                    onBlur={() => setFocused("")}
                  />

                  <View style={cadastroExtra.rowInputContainer}>
                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>Número</Text>
                      <TextInput
                        placeholder="123"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        keyboardType="numeric"
                        value={numero}
                        onChangeText={setNumero}
                        editable={!semNumero}
                        style={[
                          cadastroExtra.inputField,
                          focused === "numero" && cadastroExtra.inputFieldFocused,
                          semNumero && { opacity: 0.5 },
                        ]}
                        onFocus={() => setFocused("numero")}
                        onBlur={() => setFocused("")}
                      />
                    </View>

                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>Bairro</Text>
                      <TextInput
                        placeholder="Nome do bairro"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={bairro}
                        onChangeText={setBairro}
                        style={[
                          cadastroExtra.inputField,
                          focused === "bairro" && cadastroExtra.inputFieldFocused,
                        ]}
                        onFocus={() => setFocused("bairro")}
                        onBlur={() => setFocused("")}
                      />
                    </View>
                  </View>

                  <View style={cadastroExtra.rowInputContainer}>
                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>Cidade</Text>
                      <TextInput
                        placeholder="Nome da cidade"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={cidade}
                        onChangeText={setCidade}
                        style={[
                          cadastroExtra.inputField,
                          focused === "cidade" && cadastroExtra.inputFieldFocused,
                        ]}
                        onFocus={() => setFocused("cidade")}
                        onBlur={() => setFocused("")}
                      />
                    </View>

                    <View style={cadastroExtra.halfInputWrapper}>
                      <Text style={cadastroExtra.labelSmall}>Estado</Text>
                      <TextInput
                        placeholder="UF"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={estado}
                        onChangeText={setEstado}
                        style={[
                          cadastroExtra.inputField,
                          focused === "estado" && cadastroExtra.inputFieldFocused,
                        ]}
                        onFocus={() => setFocused("estado")}
                        onBlur={() => setFocused("")}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <TouchableOpacity
                      style={cadastroExtra.checkbox}
                      onPress={() => setSemNumero(!semNumero)}
                    >
                      {semNumero && (
                        <Ionicons name="checkmark" size={16} color="#EEE82C" />
                      )}
                    </TouchableOpacity>
                    <Text style={cadastroExtra.checkboxLabel}>
                      Endereço sem número
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => setStep(2)}
                      style={cadastroExtra.buttonVoltar}
                    >
                      <Text style={cadastroExtra.buttonVoltarText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleCadastroOng}
                      disabled={!isStep3Valid || loading}
                      style={[
                        cadastroExtra.buttonProximaEtapa,
                        { flex: 1 },
                        !isStep3Valid && { backgroundColor: "#FFFFFF" },
                      ]}
                    >
                      {loading ? (
                        <ActivityIndicator color="#000000" size="small" />
                      ) : (
                        <>
                          <Text style={cadastroExtra.buttonProximaEtapaText}>
                            Finalizar Cadastro
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
                </>
              )}
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