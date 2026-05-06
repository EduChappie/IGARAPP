import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '@/styles/_style';
import { useRouter } from 'expo-router';

export default function index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#012A36' }}>
      <View style={styles.mainContainer}>
        
        {/* 1. IMAGEM FIXA NO FUNDO */}
        <Image
          source={require('@/assets/images/floresta.png')}
          style={[styles.backgroundImageStyle, { position: 'absolute', width: '100%', height: '45%', resizeMode: 'cover' }]}
        />

        {/* 2. OVERLAY DE DEGRADÊ */}
        <LinearGradient
          colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']}
          locations={[0, 0.30, 0.50]} 
          style={styles.backgroundGradientOverlay}
        />

        {/* 3. CONTEÚDO SUPERIOR */}
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

        {/* 4. CONTEÚDO INFERIOR */}
        {/* Reduzido o paddingBottom de 40 para 20 para deixar os botões descerem mais */}
        <View style={[styles.bottomActionContainer, { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }]}>
          
          {/* Botão Voluntário */}
          <TouchableOpacity
            onPress={() => router.push('../cadastropf')}
            style={[styles.primaryActionButton, { marginBottom: 16 }]}
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

          {/* Botão Organizador (ONG) */}
          <TouchableOpacity
            onPress={() => router.push('../cadastro_ong')}
            style={[styles.secondaryActionButton, { marginBottom: 20 }]}
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

          {/* Link para Login */}
          <Text style={styles.forgotPasswordText}>
            Já possui conta?{' '}
            <Text 
              style={styles.underline} 
              onPress={() => router.push('/login_pl')}
            >
              Efetuar Login.
            </Text>
          </Text>

          {/* Termos de Uso (Margem superior reduzida de 40 para 30 para acompanhar a descida) */}
          <Text style={[styles.termsAndPrivacyText, { marginTop: 30 }]}>
            Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
            com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text>{' '}
            e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
          </Text>
          
        </View>

      </View>
    </View>
  );
}