import React, { useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { router } from "expo-router";

export default function cadastropf() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');

    function passwordVisibility() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    function formatData(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        return digits.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    function formatTelefone(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/\) (\d{5})(\d)/, ') $1-$2');
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            <View style={styles.mainContainer}>
                <ImageBackground source={require('@/assets/images/floresta.png')} style={styles.backgroundImage} resizeMode="cover" imageStyle={styles.backgroundImageStyle}>
                    {/* Fade idêntico ao do organizador */}
                    <LinearGradient colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']} locations={[0, 0.40, 0.65]} style={styles.backgroundGradientOverlay} />

                    {/* Empurrado para baixo com paddingTop: 110 */}
                    <View style={[extra.topContentContainer, { paddingTop: 190 }]}>
                        <Image source={require('@/assets/images/logo.png')} style={styles.applicationLogoImage} />
                        <Text style={extra.mainTitleText}>Vamos começar agora!</Text>
                        <Text style={extra.subtitleDescriptionText}>
                            Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                        </Text>
                    </View>

                    <View style={extra.bottomActionContainer}>
                        <View>
                            <View style={[cadastroExtra.stepContainer, { marginBottom: 10 }]}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                            </View>

                            <Text style={cadastroExtra.labelSmall}>Nome de usuário</Text>
                            <TextInput
                                placeholder="Digite o seu nome de usuário"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                style={[cadastroExtra.inputFieldFullWidth, isFocused1 && cadastroExtra.inputFieldFullWidthFocused]}
                                onFocus={() => setIsFocused1(true)} onBlur={() => setIsFocused1(false)}
                            />

                            <View style={cadastroExtra.rowInputContainer}>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Seu melhor e-mail</Text>
                                    <TextInput
                                        placeholder="Digite o seu e-mail"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={[cadastroExtra.inputField, isFocused2 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused2(true)} onBlur={() => setIsFocused2(false)}
                                    />
                                </View>

                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Sua senha</Text>
                                    <View style={[cadastroExtra.passwordWrapper, isFocused3 && cadastroExtra.passwordWrapperFocused]}>
                                        <TextInput
                                            placeholder="Crie uma senha forte"
                                            placeholderTextColor="rgba(255,255,255,0.35)"
                                            autoCapitalize="none"
                                            secureTextEntry={isPasswordHidden}
                                            style={cadastroExtra.passwordInput}
                                            onFocus={() => setIsFocused3(true)} onBlur={() => setIsFocused3(false)}
                                        />
                                        <TouchableOpacity style={cadastroExtra.eyeIcon} onPress={passwordVisibility}>
                                            <Ionicons name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'} size={20} color="#A6FF00" />
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
                                        style={[cadastroExtra.inputField, isFocused4 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused4(true)} onBlur={() => setIsFocused4(false)}
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
                                        style={[cadastroExtra.inputField, isFocused5 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused5(true)} onBlur={() => setIsFocused5(false)}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => router.push('/cadastropf_sucess')} style={[cadastroExtra.buttonProximaEtapa, { marginTop: 15, marginBottom: 10 }]}>
                                <Text style={cadastroExtra.buttonProximaEtapaText}>Próxima etapa</Text>
                                <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[extra.termsAndPrivacyText, { marginTop: 20 }]}>
                            Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                            com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}