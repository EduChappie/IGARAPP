import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#012A36', 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.8, 
  },
  backgroundGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topContentContainer: {
    paddingHorizontal: 18,
    paddingTop: height * 0.26, 
    alignItems: 'flex-start',
  },
  applicationLogoImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginBottom: 24,
  },
  mainTitleText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700', 
    lineHeight: 28,
    marginBottom: 12,
  },
  highlightedText: {
    color: '#A6FF00', 
    fontStyle: 'italic',
    fontWeight: '700',
  },
  subtitleDescriptionText: {
    color: '#A0B3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  bottomActionContainer: {
    paddingHorizontal: 14,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60, 
  },
  primaryActionButton: {
    backgroundColor: 'rgba(1, 42, 54, 0.8)', 
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 100, 130, 0.8)', 
  },
  secondaryActionButton: {
    backgroundColor: 'rgba(1, 42, 54, 0.8)',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 100, 130, 0.8)',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonSmallLabelText: {
    color: '#A6FF00', 
    fontSize: 13, 
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonMainText: {
    color: '#FFFFFF',
    fontSize: 24, 
    fontWeight: '800',
  },
  buttonIconImage: {
    width: 65, 
    height: 65,
    resizeMode: 'contain',
  },
  forgotPasswordText: {
    color: '#A0B3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  termsAndPrivacyText: {
    color: '#A0B3B8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },
  destaque: {
    color: '#A6FF00',
    fontWeight: 'bold',
  }
});

// Estilos extras para Login e as telas de Cadastro
export const extra = StyleSheet.create({
  topContentContainer: {
    paddingHorizontal: 24,
    paddingTop: height * 0.26, // Subimos as informações para caber tudo sem scroll
    alignItems: 'center', 
  },
  topContentContainerFocus: {
    paddingTop: height * 0.10, 
  },
  mainTitleText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleDescriptionText: {
    color: '#A0B3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  bottomActionContainer: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 20, // Ajustado para dar um respiro no fim sem sumir da tela
  },
  bottomActionContainerFocus: {
  },
  label: {
    color: '#FFFFFF', 
    fontSize: 12,
    marginBottom: 8,
    marginTop: 12,
    opacity: 0.8,
  },
  inputFiled: { 
    backgroundColor: 'rgba(1, 42, 54, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 100, 130, 0.6)',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 42, 54, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 100, 130, 0.6)',
    marginBottom: 24,
  },
  inputFiledInside: {
    flex: 1,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
  },
  inputFocused1: {
    borderColor: '#A6FF00',
  },
  inputFocused2: {
    borderColor: '#A6FF00',
  },
  eye: {
    paddingHorizontal: 16,
  },
  buttonSubmit: {
    backgroundColor: '#E8ECEE', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonSubmitText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  forgotPasswordText: {
    color: '#A0B3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  termsAndPrivacyText: {
    color: '#A0B3B8',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  }
});