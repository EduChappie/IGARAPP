import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons"

export default function LoginScreen() {
    const [isFocused1, setIsFocused1] = useState(false);
    const [isFocused2, setIsFocused2] = useState(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)


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
                    (isFocused1 || isFocused2) && extra.topContentContainerFocus
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
                    (isFocused1 || isFocused2) && extra.bottomActionContainerFocus
                    ]}>

                  <View>
                    <Text style={ extra.label }>
                        Seu melhor e-mail
                    </Text>
                    <TextInput
                        placeholder="Email"
                        style={[
                            extra.inputFiled,
                            isFocused1 && extra.inputFocused1
                        ]}
                        onFocus={() => setIsFocused1(true)}
                        onBlur={() => setIsFocused1(false)}
                    />

                    <Text style={ extra.label }>
                        Sua senha
                    </Text>

                    <View style={ extra.inputContainer }>
                        <TextInput
                            placeholder="Senha"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="none"
                            autoComplete="off"
                            style={[
                                extra.inputFiled,
                                isFocused2 && extra.inputFocused2
                            ]}
                            onFocus={() => setIsFocused2(true)}
                            onBlur={() => setIsFocused2(false)}
                            secureTextEntry={isPasswordHidden}
                        />
                        <TouchableOpacity style={ extra.eye } onPress={passwordVisibility}>

                            <Ionicons
                                name={isPasswordHidden ? 'eye-off' : 'eye'}
                                size={24}
                                color="#A6FF00"/>

                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(219, 228, 229, 1)',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%',
                            padding: 15,
                            borderRadius: 10,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={ extra.buttonSubmit }>
                            Criar conta </Text>
                        <Ionicons
                            name={'return-down-forward-outline'}
                            size={20}
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