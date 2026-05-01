import React, { useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    function passwordVisibility() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            <View style={styles.mainContainer}>
                {/* Imagem de fundo */}
                <ImageBackground
                    source={require('@/assets/images/igarape.jpeg')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                    imageStyle={styles.backgroundImageStyle}
                >
                    {/* Overlay de degradê ajustado para a floresta aparecer bem no topo */}
                    <LinearGradient
                        colors={['transparent', 'rgba(1, 42, 54, 0.9)', '#012A36']}
                        locations={[0, 0.28, 0.55]}
                        style={styles.backgroundGradientOverlay}
                    />

                    {/* Conteúdo superior travado na posição original */}
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

                    {/* Card inferior travado na posição original */}
                    <View style={extra.bottomActionContainer}>
                        <View>
                            <Text style={extra.label}>
                                Seu melhor e-mail
                            </Text>
                            <TextInput
                                placeholder="Digite o seu e-mail (seuemail@dominio.com)"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={[
                                    extra.inputFiled,
                                    isFocused1 && extra.inputFocused1
                                ]}
                                onFocus={() => setIsFocused1(true)}
                                onBlur={() => setIsFocused1(false)}
                            />

                            <Text style={extra.label}>
                                Sua senha
                            </Text>

                            <View style={[
                                extra.inputContainer,
                                isFocused2 && extra.inputFocused2
                            ]}>
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
                                <Text style={extra.buttonSubmitText}>
                                    Criar conta
                                </Text>
                                {/* Ícone de flecha apontando para a diagonal */}
                                <Ionicons
                                    name={'arrow-forward'}
                                    style={{ transform: [{ rotate: '-45deg' }] }}
                                    size={20}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Links */}
                        <Text style={extra.forgotPasswordText}>
                            Esqueceu sua senha? <Text style={styles.underline}>Redefinir Senha</Text>
                        </Text>

                        <Text style={extra.termsAndPrivacyText}>
                            Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                            com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text>{' '}
                            e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                        </Text>
                    </View>

                </ImageBackground>
            </View>
        </View>
    );
}