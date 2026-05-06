import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // <-- Importado para o botão voltar
import Svg, { Rect, G, Path } from "react-native-svg"; // <-- Importado para desenhar o botão quadrado

export default function LoginScreen() {
    const router = useRouter(); // <-- Instanciando o router
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    function passwordVisibility() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            
            {/* BOTÃO QUADRADO DE VOLTAR (Flutuando no topo) */}
            <View style={{ position: 'absolute', top: 60, left: 24, zIndex: 10 }}>
                <TopGlassButton onPress={() => router.back()} />
            </View>

            <View style={styles.mainContainer}>
                
                {/* 1. IMAGEM FIXA NO FUNDO (Sem ImageBackground para evitar zoom forçado) */}
                <Image
                    source={require('@/assets/images/floresta.png')}
                    style={[styles.backgroundImageStyle, { position: 'absolute', width: '100%', height: '45%', resizeMode: 'cover' }]}
                />

                {/* 2. OVERLAY DE DEGRADÊ (Acompanhando o corte da imagem nos 60%) */}
                <LinearGradient
                    colors={['transparent', 'rgba(1, 42, 54, 0.9)', '#012A36']}
                    locations={[0, 0.35, 0.60]} 
                    style={styles.backgroundGradientOverlay}
                />

                {/* 3. CONTEÚDO SUPERIOR */}
                <View style={extra.topContentContainer}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.applicationLogoImage}
                    />

                    <Text style={extra.mainTitleText}>
                        Vamos começar agora!
                    </Text>

                    <Text style={extra.subtitleDescriptionText}>
                        Um app para aqueles que querem ajudar a amazônia{'\n'}
                        a se tornar um lugar mais limpo e digno
                    </Text>
                </View>

                {/* 4. CONTEÚDO INFERIOR (Formulário) */}
                <View style={extra.bottomActionContainer}>
                    <View>
                        <Text style={extra.label}>Seu melhor e-mail</Text>
                        <TextInput
                            placeholder="Digite o seu e-mail (seuemail@dominio.com)"
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={[extra.inputFiled, isFocused1 && extra.inputFocused1]}
                            onFocus={() => setIsFocused1(true)}
                            onBlur={() => setIsFocused1(false)}
                        />

                        <Text style={extra.label}>Sua senha</Text>
                        <View style={[extra.inputContainer, isFocused2 && extra.inputFocused2]}>
                            <TextInput
                                placeholder="Crie uma senha forte e memorável"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="none"
                                autoComplete="off"
                                style={extra.inputFiledInside}
                                onFocus={() => setIsFocused2(true)}
                                onBlur={() => setIsFocused2(false)}
                                secureTextEntry={isPasswordHidden}
                            />
                            <TouchableOpacity style={extra.eye} onPress={passwordVisibility}>
                                <Ionicons
                                    name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#A0B3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={extra.buttonSubmit}>
                            <Text style={extra.buttonSubmitText}>Criar conta</Text>
                            <Ionicons
                                name={'arrow-forward'}
                                style={{ transform: [{ rotate: '-45deg' }] }}
                                size={20}
                                color={'#000000'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Links de Rodapé */}
                    <Text style={extra.forgotPasswordText}>
                        Esqueceu sua senha? <Text style={styles.underline}>Redefinir Senha</Text>
                    </Text>

                </View>

            </View>
        </View>
    );
}

// ==========================================
// COMPONENTE DO BOTÃO DE VOLTAR
// ==========================================
const TopGlassButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        borderRadius: 15,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
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