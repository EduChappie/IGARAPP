import React, { useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { router } from "expo-router";

export default function cadastro_one() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isFocused3, setIsFocused3] = useState(false);
    const [isFocused4, setIsFocused4] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [cnpj, setCnpj] = useState('');

    function passwordVisibility() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    function formatCnpj(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 14);
        return digits
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    function handleCnpjChange(text: string) {
        setCnpj(formatCnpj(text));
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            <View style={styles.mainContainer}>
                <ImageBackground
                    source={require('@/assets/images/floresta.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                    imageStyle={styles.backgroundImageStyle}
                >
                    {/* Degradê começando mais embaixo (0.40 a 0.65) */}
                    <LinearGradient
                        colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']}
                        locations={[0, 0.40, 0.65]}
                        style={styles.backgroundGradientOverlay}
                    />

                    {/* Empurramos o conteúdo mais pra baixo com paddingTop: 110 */}
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
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                                <View style={cadastroExtra.stepLine} />
                                <View style={cadastroExtra.stepDotInactive} />
                            </View>

                            <View style={cadastroExtra.rowInputContainer}>
                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Seu melhor e-mail</Text>
                                    <TextInput
                                        placeholder="Digite o seu e-mail"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={[cadastroExtra.inputField, isFocused1 && cadastroExtra.inputFieldFocused]}
                                        onFocus={() => setIsFocused1(true)}
                                        onBlur={() => setIsFocused1(false)}
                                    />
                                </View>

                                <View style={cadastroExtra.halfInputWrapper}>
                                    <Text style={cadastroExtra.labelSmall}>Sua senha</Text>
                                    <View style={[cadastroExtra.passwordWrapper, isFocused2 && cadastroExtra.passwordWrapperFocused]}>
                                        <TextInput
                                            placeholder="Crie uma senha forte"
                                            placeholderTextColor="rgba(255,255,255,0.35)"
                                            autoCapitalize="none"
                                            secureTextEntry={isPasswordHidden}
                                            style={cadastroExtra.passwordInput}
                                            onFocus={() => setIsFocused2(true)}
                                            onBlur={() => setIsFocused2(false)}
                                        />
                                        <TouchableOpacity style={cadastroExtra.eyeIcon} onPress={passwordVisibility}>
                                            <Ionicons name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'} size={20} color="#A6FF00" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <Text style={cadastroExtra.labelSmall}>Razão Social/Nome Fantasia</Text>
                            <TextInput
                                placeholder="Digite o nome da sua empresa como consta no documento"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                style={[cadastroExtra.inputFieldFullWidth, isFocused3 && cadastroExtra.inputFieldFullWidthFocused]}
                                onFocus={() => setIsFocused3(true)}
                                onBlur={() => setIsFocused3(false)}
                            />

                            <Text style={cadastroExtra.labelSmall}>CNPJ</Text>
                            <TextInput
                                placeholder="XX.XXX.XXX/XXXX-XX"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                keyboardType="numeric"
                                value={cnpj}
                                onChangeText={handleCnpjChange}
                                style={[cadastroExtra.inputFieldFullWidth, isFocused4 && cadastroExtra.inputFieldFullWidthFocused]}
                                onFocus={() => setIsFocused4(true)}
                                onBlur={() => setIsFocused4(false)}
                            />

                            <TouchableOpacity onPress={() => router.push('/cadastro_two')} style={cadastroExtra.buttonProximaEtapa}>
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