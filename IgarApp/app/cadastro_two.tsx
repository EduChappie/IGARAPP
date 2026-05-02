import React, { useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroTwoExtra } from "@/styles/cadastro_two_extra_styles";
import { router } from "expo-router";

export default function cadastro_two() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [data, setData] = useState('');
    const [telefone, setTelefone] = useState('');

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
                    <LinearGradient colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']} locations={[0, 0.40, 0.65]} style={styles.backgroundGradientOverlay} />

                    <View style={[extra.topContentContainer, { paddingTop: 170 }]}>
                        <Image source={require('@/assets/images/logo.png')} style={styles.applicationLogoImage} />
                        <Text style={extra.mainTitleText}>Vamos começar agora!</Text>
                        <Text style={extra.subtitleDescriptionText}>
                            Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                        </Text>
                    </View>

                    <View style={extra.bottomActionContainer}>
                        <View>
                            <View style={cadastroExtra.stepContainer}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                            </View>

                            <View style={cadastroExtra.rowInputContainer}>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Data de Fundação</Text>
                                    <TextInput
                                        placeholder="DD/MM/AAAA"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        keyboardType="numeric"
                                        value={data}
                                        onChangeText={(t) => setData(formatData(t))}
                                        style={[cadastroExtra.inputField, isFocused1 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused1(true)} onBlur={() => setIsFocused1(false)}
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
                                        style={[cadastroExtra.inputField, isFocused2 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused2(true)} onBlur={() => setIsFocused2(false)}
                                    />
                                </View>
                            </View>

                            <Text style={cadastroExtra.labelSmall}>Sobre a Empresa</Text>
                            <TextInput
                                placeholder="Conte-nos um pouco mais sobre a empresa..."
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                multiline numberOfLines={5} textAlignVertical="top"
                                style={[cadastroTwoExtra.textArea, isFocused3 && cadastroTwoExtra.textAreaFocused]}
                                onFocus={() => setIsFocused3(true)} onBlur={() => setIsFocused3(false)}
                            />

                            <TouchableOpacity onPress={() => router.push('/cadastro_three')} style={cadastroExtra.buttonProximaEtapa}>
                                <Text style={cadastroExtra.buttonProximaEtapaText}>Próxima etapa</Text>
                                <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={extra.termsAndPrivacyText}>
                            Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                            com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}