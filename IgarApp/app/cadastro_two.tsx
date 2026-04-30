import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
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
                    (isFocused1 || isFocused2 || isFocused3) && extra.topContentContainerFocus
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
                    (isFocused1 || isFocused2 || isFocused3) && extra.bottomActionContainerFocus
                    ]}>

                  <View>

                    {/* Step indicator — passo 2 ativo */}
                    <View style={cadastroExtra.stepContainer}>
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLineActive} />
                        <View style={cadastroExtra.stepDot} />
                        <View style={cadastroExtra.stepLine} />
                        <View style={cadastroExtra.stepDotInactive} />
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
                                    isFocused1 && cadastroExtra.inputFieldFocused
                                ]}
                                onFocus={() => setIsFocused1(true)}
                                onBlur={() => setIsFocused1(false)}
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
                                    isFocused2 && cadastroExtra.inputFieldFocused
                                ]}
                                onFocus={() => setIsFocused2(true)}
                                onBlur={() => setIsFocused2(false)}
                            />
                        </View>

                    </View>

                    {/* Sobre a Empresa */}
                    <Text style={cadastroExtra.labelSmall}>
                        Sobre a Empresa
                    </Text>
                    <TextInput
                        placeholder="Conte-nos um pouco mais sobre a empresa. Forneça o máximo de informações possíveis para colaborar com a ativação da sua conta Empresarial"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        style={[
                            cadastroTwoExtra.textArea,
                            isFocused3 && cadastroTwoExtra.textAreaFocused
                        ]}
                        onFocus={() => setIsFocused3(true)}
                        onBlur={() => setIsFocused3(false)}
                    />

                    {/* Botão Enviar respostas */}
                    <TouchableOpacity onPress={() => {
                        router.push('/cadastro_tree')
                    }} style={cadastroExtra.buttonProximaEtapa}>
                        <Text style={cadastroExtra.buttonProximaEtapaText}>
                            Enviar respostas
                        </Text>
                        <Ionicons
                            name={'arrow-forward-outline'}
                            size={18}
                            color={'black'}
                        />
                    </TouchableOpacity>

                  </View>

                  {/* Links */}
                  <Text style={extra.forgotPasswordText}>
                    Esqueceu sua senha? <Text style={ styles.underline } >Redefinir Senha</Text>
                  </Text>
        
                  <Text style={extra.termsAndPrivacyText}>
                    Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando
                    {'\n'}
                    com os <Text style={styles.destaque}>
                        <Text style={ styles.underline } >
                          Termos de Uso
                        </Text>
                      </Text> e <Text style={styles.destaque}>
                        <Text style={ styles.underline } >Política de Privacidade
                        </Text>
                      </Text>
                  </Text>
        
                </View>
        
              </ImageBackground>
            </View>
        </ScrollView>
    );
}