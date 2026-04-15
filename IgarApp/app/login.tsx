import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, TextInput, View } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

export default function LoginScreen() {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
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
                    isFocused && extra.topContentContainerFocus
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
                    styles.bottomActionContainer,
                    isFocused && extra.bottomActionContainerFocus
                    ]}>

                  <View>
                    <TextInput
                        placeholder="Email"
                        style={[
                            extra.inputFiled,
                            isFocused && extra.inputFocused
                        ]}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <TextInput
                        placeholder="Senha"
                        style={[
                            extra.inputFiled,
                            isFocused && extra.inputFocused
                        ]}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        secureTextEntry={true}
                    />
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