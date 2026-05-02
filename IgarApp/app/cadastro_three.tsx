import React, { useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { router } from "expo-router";

export default function cadastro_three() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isFocused5, setIsFocused5] = useState(false);
    const [isFocused6, setIsFocused6] = useState(false);
    const [semNumero, setSemNumero] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            <View style={styles.mainContainer}>
                <ImageBackground source={require('@/assets/images/floresta.png')} style={styles.backgroundImage} resizeMode="cover" imageStyle={styles.backgroundImageStyle}>
                    <LinearGradient colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']} locations={[0, 0.35, 0.60]} style={styles.backgroundGradientOverlay} />

                    <View style={[extra.topContentContainer, { paddingTop: 170 }]}>
                        <Image source={require('@/assets/images/logo.png')} style={[styles.applicationLogoImage, { marginBottom: 16 }]} />
                        <Text style={[extra.mainTitleText, { marginBottom: 4 }]}>Vamos começar agora!</Text>
                        <Text style={[extra.subtitleDescriptionText, { marginBottom: 10 }]}>
                            Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                        </Text>
                    </View>

                    <View style={extra.bottomActionContainer}>
                        <View>
                            <View style={[cadastroExtra.stepContainer, { marginBottom: 10 }]}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                            </View>

                            <Text style={[cadastroExtra.labelSmall, { marginTop: 4 }]}>CEP</Text>
                            <TextInput
                                placeholder="XXXXX-XXX"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                style={[cadastroExtra.inputFieldFullWidth, isFocused1 && cadastroExtra.inputFieldFullWidthFocused]}
                                onFocus={() => setIsFocused1(true)} onBlur={() => setIsFocused1(false)}
                            />

                            <Text style={cadastroExtra.labelSmall}>Rua*</Text>
                            <TextInput
                                placeholder="Coloque o nome da sua rua"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                style={[cadastroExtra.inputFieldFullWidth, isFocused2 && cadastroExtra.inputFieldFullWidthFocused]}
                                onFocus={() => setIsFocused2(true)} onBlur={() => setIsFocused2(false)}
                            />

                            <View style={cadastroExtra.rowInputContainer}>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Text style={cadastroExtra.labelSmall}>Número da rua*</Text>
                                        <TouchableOpacity 
                                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }} 
                                            onPress={() => setSemNumero(!semNumero)}
                                        >
                                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginRight: 4 }}>Sem número</Text>
                                            <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: semNumero ? '#A6FF00' : 'rgba(255,255,255,0.5)', borderRadius: 2, backgroundColor: semNumero ? '#A6FF00' : 'transparent' }} />
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        placeholder="Número rua"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        editable={!semNumero}
                                        style={[cadastroExtra.inputField, isFocused3 && cadastroExtra.inputFieldFocused, semNumero && {opacity: 0.5}]}
                                        onFocus={() => setIsFocused3(true)} onBlur={() => setIsFocused3(false)}
                                    />
                                </View>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Bairro*</Text>
                                    <TextInput
                                        placeholder="Nome do seu bairro"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        style={[cadastroExtra.inputField, isFocused4 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused4(true)} onBlur={() => setIsFocused4(false)}
                                    />
                                </View>
                            </View>

                            <View style={cadastroExtra.rowInputContainer}>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Cidade</Text>
                                    <TextInput
                                        placeholder="Selecionar Cidade"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        style={[cadastroExtra.inputField, isFocused5 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused5(true)} onBlur={() => setIsFocused5(false)}
                                    />
                                </View>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Estado</Text>
                                    <TextInput
                                        placeholder="Selecionar Estado"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        style={[cadastroExtra.inputField, isFocused6 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused6(true)} onBlur={() => setIsFocused6(false)}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => router.push('/cadastro_success')} style={[cadastroExtra.buttonProximaEtapa, { marginTop: 10, marginBottom: 10 }]}>
                                <Text style={cadastroExtra.buttonProximaEtapaText}>Enviar respostas</Text>
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