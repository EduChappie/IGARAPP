import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '@/styles/_style';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#012A36' }}>
      <View style={styles.mainContainer}>
        {/* Imagem de fundo */}
        <ImageBackground
          source={require('@/assets/images/floresta.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={styles.backgroundImageStyle}
        >
          {/* Overlay de degradê ajustado para cobrir melhor os textos que subiram */}
          <LinearGradient
            colors={['transparent', 'rgba(1, 42, 54, 0.9)', '#012A36']}
            locations={[0, 0.30, 0.55]} 
            style={styles.backgroundGradientOverlay}
          />

          {/* Conteúdo superior */}
          <View style={styles.topContentContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.applicationLogoImage}
            />

            <Text style={styles.mainTitleText}>
              Cada igarapé limpo é{'\n'}Manaus{' '}
              <Text style={styles.highlightedText}>respirando melhor</Text>
            </Text>

            <Text style={styles.subtitleDescriptionText}>
              Um app para aqueles que querem ajudar a amazônia{'\n'}
              a se tornar um lugar mais limpo e digno
            </Text>
          </View>

          {/* Card inferior */}
          <View style={styles.bottomActionContainer}>
            {/* Botão voluntário */}
            <TouchableOpacity
              onPress={() => router.push('/login')}
              style={styles.primaryActionButton}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonSmallLabelText}>Feito para o público</Text>
                <Text style={styles.buttonMainText}>Sou um voluntário</Text>
              </View>

              <Image
                source={require('@/assets/images/terra.png')}
                style={styles.buttonIconImage}
              />
            </TouchableOpacity>

            {/* Botão organizador */}
            <TouchableOpacity
              onPress={() => router.push('/cadastro_one')}
              style={styles.secondaryActionButton}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonSmallLabelText}>Feito para ONG's</Text>
                <Text style={styles.buttonMainText}>Sou um organizador</Text>
              </View>

              <Image
                source={require('@/assets/images/globo.png')}
                style={styles.buttonIconImage}
              />
            </TouchableOpacity>

            {/* Links */}
            <Text style={styles.forgotPasswordText}>
              Esqueceu sua senha? <Text style={styles.underline}>Redefinir Senha</Text>
            </Text>

            <Text style={styles.termsAndPrivacyText}>
              Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
              com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text>{' '}
              e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
            </Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}