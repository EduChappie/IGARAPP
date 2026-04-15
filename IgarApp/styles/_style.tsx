import { Background } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';

const extra = StyleSheet.create({
  mainTitleText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 30,
    textAlign: "center"
  },
  subtitleDescriptionText: {
    marginTop: 12,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 18,
    textAlign: 'center'
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#BBBBBB',
    marginBottom: 10,
    textAlign: 'center'
  },
  termsAndPrivacyText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 16,
    textAlign: 'center'
  },
  topContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 290,
    alignItems: 'center'
  },
  inputFiled: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: '#A6FF00',
  },

  topContentContainerFocus: {
    paddingHorizontal: 24,
    paddingTop: 90,
  },
  bottomActionContainerFocus: {
    height: '70%',
    backgroundColor: '#012A36',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
})

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
  },

  backgroundImageStyle: {
    transform: [{
        translateY: -300
    }]
  },

  backgroundGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  topContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 290,
  },

  applicationLogoImage: {
    width: 48,
    height: 48,
    marginBottom: 20,
  },

  mainTitleText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 30,
  },

  highlightedText: {
    color: '#A6FF00',
    fontFamily: 'Times New Roman',
    fontStyle: 'italic',
  },

  subtitleDescriptionText: {
    marginTop: 12,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 18,
  },

  bottomActionContainer: {
    height: '41%',
    backgroundColor: '#012A36',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },

  primaryActionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A3D4A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  secondaryActionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A3D4A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  buttonTextContainer: {
    flexDirection: 'column',
    paddingLeft: '5%'
  },

  buttonSmallLabelText: {
    fontSize: 14,
    color: '#A6FF00',
    marginBottom: 4,
  },

  buttonMainText: {
    fontSize: 21,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  buttonIconImage: {
    width: 50,
    height: 50,
    marginRight: '5%',
    transform: [{
        scale: 1.5
    }]
  },

  forgotPasswordText: {
    fontSize: 13,
    color: '#BBBBBB',
    marginBottom: 10,
  },

  termsAndPrivacyText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 16,
  },

  destaque: {
    color: '#EEE82C'
  },
  underline: {
    textDecorationLine: 'underline'
  }
});

export { styles, extra }