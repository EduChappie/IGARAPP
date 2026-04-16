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
    paddingTop: 250,
    alignItems: 'center'
  },
  bottomActionContainer: {
    height: '50%',
    backgroundColor: '#012A36',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
  inputFiled: {
    backgroundColor: 'rgba(0, 44, 59, 1)',
    color: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 12,
    fontSize: 18,
    width: '100%',
  },
  eye: {
    position: 'relative',
    top: 20,
    right: '12%'
  },
  inputFocused1: {
    borderColor: '#A6FF00',
    borderWidth: 2,
  },
  inputFocused2: {
    borderColor: '#A6FF00',
    borderWidth: 2,
  },
  inputContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },

  buttonSubmit: {
    color: 'black',
    fontSize: 15,
  },

  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    marginLeft: 10,
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
    height: '42%',
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