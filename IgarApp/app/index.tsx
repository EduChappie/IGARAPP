import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/index_style'

const { height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  return (
    <View style={styles.mainContainer}>

      {/* Imagem de fundo */}
      <ImageBackground
        source={require('../assets/background/floresta.png')}
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
        <View style={styles.topContentContainer}>
          <Image
            source={require('@/assets/logo/logo.png')}
            style={styles.applicationLogoImage}
          />

          <Text style={styles.mainTitleText}>
            Cada igarapé limpo é{'\n'}Manaus 
            <Text style={styles.highlightedText}> respirando melhor</Text>
          </Text>

          <Text style={styles.subtitleDescriptionText}>
            Um app para aqueles que querem ajudar a amazônia
            {'\n'}
            a se tornar um lugar mais limpo e digno
          </Text>
        </View>

        {/* Card inferior */}
        <View style={styles.bottomActionContainer}>

          {/* Botão voluntário */}
          <TouchableOpacity style={styles.primaryActionButton}>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonSmallLabelText}>Feito para o público</Text>
              <Text style={styles.buttonMainText}>Sou um voluntário</Text>
            </View>

            <Image
              source={require('@/assets/geral/terra.png')}
              style={styles.buttonIconImage}
            />
          </TouchableOpacity>

          {/* Botão organizador */}
          <TouchableOpacity style={styles.secondaryActionButton}>
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonSmallLabelText}>Feito para ONG's</Text>
              <Text style={styles.buttonMainText}>Sou um organizador</Text>
            </View>

            <Image
              source={require('@/assets/geral/globo.png')}
              style={styles.buttonIconImage}
            />
          </TouchableOpacity>

          {/* Links */}
          <Text style={styles.forgotPasswordText}>
            Esqueceu sua senha? <Text style={ styles.underline } >Redefinir Senha</Text>
          </Text>

          <Text style={styles.termsAndPrivacyText}>
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
  );
}