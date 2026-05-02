import React from "react";
import { Image, ImageBackground, TouchableOpacity, View, Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";
import { router } from "expo-router";

export default function cadastro_sucess() {
    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            <View style={styles.mainContainer}>
                <ImageBackground 
                    source={require('@/assets/images/floresta.png')} 
                    style={styles.backgroundImage} 
                    resizeMode="cover" 
                    imageStyle={styles.backgroundImageStyle}
                >
                    {/* Degradê começa bem mais embaixo agora (0.65) */}
                    <LinearGradient 
                        colors={['transparent', 'rgba(1, 42, 54, 0.9)', '#012A36']} 
                        locations={[0, 0.65, 0.85]} 
                        style={styles.backgroundGradientOverlay} 
                    />

                    {/* Container que joga tudo pro final da tela */}
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 60 }}>
                        
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('@/assets/images/logo.png')} style={styles.applicationLogoImage} />

                            <Text style={cadastroSuccessExtra.successTitle}>
                                Parabéns! Sua conta foi{'\n'}criada com sucesso
                            </Text>

                            <Text style={extra.subtitleDescriptionText}>
                                Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                            </Text>

                            {/* Step indicator — todos os 4 ativos */}
                            <View style={[cadastroExtra.stepContainer, cadastroSuccessExtra.stepSpacing]}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                            </View>

                            <TouchableOpacity onPress={() => router.push('/')} style={cadastroExtra.buttonProximaEtapa}>
                                <Text style={cadastroExtra.buttonProximaEtapaText}>Próxima etapa</Text>
                                <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                            </TouchableOpacity>
                        </View>

                        {/* Termos de Uso fixados no final */}
                        <View style={{ marginTop: 20 }}>
                            <Text style={extra.termsAndPrivacyText}>
                                Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                                com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                            </Text>
                        </View>
                        
                    </View>

                </ImageBackground>
            </View>
        </View>
    );
}