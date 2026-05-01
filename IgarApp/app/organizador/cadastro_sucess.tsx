import React from "react";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";

export default function cadastro_success() {
    return (
        <View style={styles.mainContainer}>

            {/* Imagem de fundo */}
            <ImageBackground
                source={require('@/assets/images/floresta.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
                imageStyle={styles.backgroundImageStyle}
            >

                {/* Overlay de escurecimento + degradê */}
                <LinearGradient
                    colors={[
                        '#001A23',
                        '#001A23',
                        'transparent'
                    ]}
                    locations={[1, 0.5, 0]}
                    style={styles.backgroundGradientOverlay}
                />

                {/* Conteúdo central */}
                <View style={cadastroSuccessExtra.contentWrapper}>

                    {/* Logo */}
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.applicationLogoImage}
                    />

                    {/* Título de sucesso */}
                    <Text style={cadastroSuccessExtra.successTitle}>
                        Parabéns! Sua conta foi{'\n'}criada com sucesso
                    </Text>

                    {/* Subtítulo */}
                    <Text style={extra.subtitleDescriptionText}>
                        Um app para aqueles que querem ajudar a amazônia
                        {'\n'}
                        a se tornar um lugar mais limpo e digno
                    </Text>

                    {/* Step indicator — todos os 3 ativos */}
                    <View style={[cadastroExtra.stepContainer, cadastroSuccessExtra.stepSpacing]}>
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLineActive} />
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLineActive} />
                        <View style={cadastroExtra.stepDot} />
                    </View>

                    {/* Botão Próxima etapa */}
                    <TouchableOpacity style={cadastroExtra.buttonProximaEtapa}>
                        <Text style={cadastroExtra.buttonProximaEtapaText}>
                            Próxima etapa
                        </Text>
                        <Ionicons
                            name={'arrow-forward-outline'}
                            size={18}
                            color={'black'}
                        />
                    </TouchableOpacity>

                </View>

            </ImageBackground>
        </View>
    );
}