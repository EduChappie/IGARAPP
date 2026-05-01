import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
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
    const [isFocused5, setIsFocused5] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    
    const [data, setData] = useState('');
    const [telefone, setTelefone] = useState('');

    function formatData(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        return digits
            .replace(/^(\d{2})(\d)/, '$1/$2')
            .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    function formatTelefone(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        return digits
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/\) (\d{5})(\d)/, ') $1-$2');
    }

    function handleDataChange(text: string) {
        setData(formatData(text));
    }

    function handleTelefoneChange(text: string) {
        setTelefone(formatTelefone(text));
    }

    function passwordVisibility() {
        setIsPasswordHidden(!isPasswordHidden);
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{
              backgroundColor: '#012A36',
            }}
            keyboardShouldPersistTaps="handled"
        >
        <View style={styles.mainContainer}>
        
              {/* Imagem de fundo */}
              <ImageBackground
                source={require('@/assets/images/floresta.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
                imageStyle={ styles.backgroundImageStyle }
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
        
                {/* Conteúdo superior */}
                <View style={[
                    extra.topContentContainer,
                    (isFocused1 || isFocused2 || isFocused3 || isFocused4 || isFocused5) && extra.topContentContainerFocus
                    ]}>
                  <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.applicationLogoImage}
                  />
        
                  <Text style={extra.mainTitleText}>
                    Vamos começar agora!
                  </Text>
        
                  <Text style={extra.subtitleDescriptionText}>
                    Um app para aqueles que querem ajudar a amazônia
                    {'\n'}
                    a se tornar um lugar mais limpo e digno
                  </Text>
                </View>
        
                {/* Card inferior */}
                <View style={[
                    extra.bottomActionContainer,
                    (isFocused1 || isFocused2 || isFocused3 || isFocused4 || isFocused5) && extra.bottomActionContainerFocus
                    ]}>

                  <View>

                    {/* Step indicator */}
                    <View style={cadastroExtra.stepContainer}>
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLineActive} />
                        <View style={cadastroExtra.stepDotInactive} />
                    </View>

                    {/* Nome do Usuário*/}
                    <Text style={cadastroExtra.labelSmall}>
                        Nome do usuário
                    </Text>
                    <TextInput
                        placeholder="Digite o seu nome de usuário"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        style={[
                            cadastroExtra.inputFieldFullWidth,
                            isFocused3 && cadastroExtra.inputFieldFullWidthFocused
                        ]}
                        onFocus={() => setIsFocused3(true)}
                        onBlur={() => setIsFocused3(false)}
                    />

                    {/* Linha dupla: Email + Senha */}
                    <View style={cadastroExtra.rowInputContainer}>

                        {/* Email */}
                        <View style={cadastroExtra.halfInputWrapper}>
                            <Text style={cadastroExtra.labelSmall}>
                                Seu melhor e-mail
                            </Text>
                            <TextInput
                                placeholder="Digite o seu e-mail"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={[
                                    cadastroExtra.inputField,
                                    isFocused1 && cadastroExtra.inputFieldFocused
                                ]}
                                onFocus={() => setIsFocused1(true)}
                                onBlur={() => setIsFocused1(false)}
                            />
                        </View>

                        {/* Senha */}
                        <View style={cadastroExtra.halfInputWrapper}>
                            <Text style={cadastroExtra.labelSmall}>
                                Sua senha
                            </Text>
                            <View style={[
                                cadastroExtra.passwordWrapper,
                                isFocused2 && cadastroExtra.passwordWrapperFocused
                            ]}>
                                <TextInput
                                    placeholder="Crie uma senha forte"
                                    placeholderTextColor="rgba(255,255,255,0.35)"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="none"
                                    autoComplete="off"
                                    style={cadastroExtra.passwordInput}
                                    onFocus={() => setIsFocused2(true)}
                                    onBlur={() => setIsFocused2(false)}
                                    secureTextEntry={isPasswordHidden}
                                />
                                <TouchableOpacity style={cadastroExtra.eyeIcon} onPress={passwordVisibility}>
                                    <Ionicons
                                        name={isPasswordHidden ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#A6FF00"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                    {/* Linha dupla: Data de Fundação + Número de telefone */}
                    <View style={cadastroExtra.rowInputContainer}>

                        {/* Data de Fundação */}
                        <View style={cadastroExtra.halfInputWrapper}>
                            <Text style={cadastroExtra.labelSmall}>
                                Data de Fundação
                            </Text>
                            <TextInput
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                keyboardType="numeric"
                                value={data}
                                onChangeText={handleDataChange}
                                style={[
                                    cadastroExtra.inputField,
                                    isFocused4 && cadastroExtra.inputFieldFocused
                                ]}
                                onFocus={() => setIsFocused4(true)}
                                onBlur={() => setIsFocused4(false)}
                            />
                        </View>

                        {/* Número de telefone */}
                        <View style={cadastroExtra.halfInputWrapper}>
                            <Text style={cadastroExtra.labelSmall}>
                                Número de telefone
                            </Text>
                            <TextInput
                                placeholder="(XX) 9XXXX-XXXX"
                                placeholderTextColor="rgba(255,255,255,0.35)"
                                keyboardType="phone-pad"
                                value={telefone}
                                onChangeText={handleTelefoneChange}
                                style={[
                                    cadastroExtra.inputField,
                                    isFocused5 && cadastroExtra.inputFieldFocused
                                ]}
                                onFocus={() => setIsFocused5(true)}
                                onBlur={() => setIsFocused5(false)}
                            />
                        </View>

                    </View>                  
                    

                    {/* Botão Próxima etapa */}
                    <TouchableOpacity onPress={() => {
                        router.push('/voluntario/cadastro_sucess')
                    }} style={cadastroExtra.buttonProximaEtapa}>
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
        
                </View>
        
              </ImageBackground>
            </View>
        </ScrollView>
    );
}