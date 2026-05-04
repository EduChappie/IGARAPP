import React, { useState } from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";
import { router } from "expo-router";

export default function cadastropf() {
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");

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

  return (
    <View style={{ flex: 1, backgroundColor: "#012A36" }}>
      <View style={styles.mainContainer}>
        
        {/* IMAGEM FIXA NO FUNDO */}
        <Image
          source={require("@/assets/images/floresta.png")}
          style={[styles.backgroundImageStyle, { position: 'absolute', width: '100%', height: '60%', resizeMode: 'cover' }]}
        />

        {/* OVERLAY DE DEGRADÊ DINÂMICO */}
        <LinearGradient
          colors={["transparent", "rgba(1, 42, 54, 0.95)", "#012A36"]}
          locations={step === 2 ? [0, 0.65, 0.85] : [0, 0.4, 0.65]}
          style={styles.backgroundGradientOverlay}
        />

        {/* --- CONTEÚDO SUPERIOR --- */}
        {step === 1 && (
          // Reduzido para 170 para puxar o cabeçalho para cima
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
            // paddingBottom ajustado para manter os termos no fundo
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 60 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('@/assets/images/logo.png')} style={styles.applicationLogoImage} />

                    <Text style={cadastroSuccessExtra.successTitle}>
                        Parabéns! Sua conta foi{'\n'}criada com sucesso
                    </Text>

                    <Text style={extra.subtitleDescriptionText}>
                        Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                    </Text>

                    <View style={[cadastroExtra.stepContainer, cadastroSuccessExtra.stepSpacing, { marginBottom: 20 }]}>
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLineActive} />
                        <View style={cadastroExtra.stepDot} />
                    </View>

                    <TouchableOpacity onPress={() => router.push('/')} style={cadastroExtra.buttonProximaEtapa}>
                        <Text style={cadastroExtra.buttonProximaEtapaText}>Próxima etapa</Text>
                        <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                    </TouchableOpacity>
                </View>

                {/* marginTop: 80 joga as infos de sucesso para cima e os termos para baixo */}
                <View style={{ marginTop: 80 }}>
                    <Text style={extra.termsAndPrivacyText}>
                        Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                        com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
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
                            focused === "username" && cadastroExtra.inputFieldFullWidthFocused,
                        ]}
                        onFocus={() => setFocused("username")}
                        onBlur={() => setFocused("")}
                    />

                    <View style={cadastroExtra.rowInputContainer}>
                        <View style={cadastroExtra.halfInputWrapper}>
                        <Text style={cadastroExtra.labelSmall}>Seu melhor e-mail</Text>
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
                                focused === "senha" && cadastroExtra.passwordWrapperFocused,
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
                                name={isPasswordHidden ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#A6FF00"
                            />
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>

                    <View style={cadastroExtra.rowInputContainer}>
                        <View style={cadastroExtra.halfInputWrapper}>
                        <Text style={cadastroExtra.labelSmall}>Data de Nascimento</Text>
                        <TextInput
                            placeholder="DD/MM/AAAA"
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            keyboardType="numeric"
                            value={dataNascimento}
                            onChangeText={(t) => setDataNascimento(formatData(t))}
                            style={[
                                cadastroExtra.inputField,
                                focused === "dataNascimento" && cadastroExtra.inputFieldFocused,
                            ]}
                            onFocus={() => setFocused("dataNascimento")}
                            onBlur={() => setFocused("")}
                        />
                        </View>
                        <View style={cadastroExtra.halfInputWrapper}>
                        <Text style={cadastroExtra.labelSmall}>Número de telefone</Text>
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

                    <TouchableOpacity
                        onPress={() => setStep(2)}
                        style={[
                            cadastroExtra.buttonProximaEtapa,
                            { marginTop: 25, marginBottom: 15 },
                        ]}
                    >
                        <Text style={cadastroExtra.buttonProximaEtapaText}>Enviar respostas</Text>
                        <Ionicons
                            name={"arrow-forward"}
                            style={{ transform: [{ rotate: "-45deg" }] }}
                            size={18}
                            color={"black"}
                        />
                    </TouchableOpacity>
                </View>

                {/* marginTop: 40 afasta os termos do botão de prosseguir */}
                <Text style={[extra.termsAndPrivacyText, { marginTop: 40 }]}>
                    Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{"\n"}
                    com os{" "}
                    <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text>{" "}
                    e{" "}
                    <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                </Text>
            </View>
        )}
      </View>
    </View>
  );
}