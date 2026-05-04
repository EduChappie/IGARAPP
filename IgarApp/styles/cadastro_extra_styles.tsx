import { StyleSheet } from "react-native";

export const cadastroExtra = StyleSheet.create({
  // --- Step indicator (progress bar) ---
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#A6FF00",
  },
  stepDotInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 4,
  },
  stepLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: "#A6FF00",
    marginHorizontal: 4,
  },

  // --- Linha dupla (email + senha lado a lado) ---
  rowInputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 0,
  },
  halfInputWrapper: {
    flex: 1,
  },

  // --- Label menor para os campos ---
  labelSmall: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginBottom: 4,
    marginTop: 10,
  },

  // --- Input com borda azul escura (padrão da tela) ---
  inputField: {
    backgroundColor: "rgba(0, 50, 70, 0.85)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 100, 130, 0.6)",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
    width: "100%",
  },
  inputFieldFocused: {
    borderColor: "#A6FF00",
  },
  inputFieldFullWidth: {
    backgroundColor: "rgba(0, 50, 70, 0.85)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 100, 130, 0.6)",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
    width: "100%",
    marginBottom: 0,
  },
  inputFieldFullWidthFocused: {
    borderColor: "#A6FF00",
  },

  // --- Wrapper do input de senha (para o ícone olho) ---
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 50, 70, 0.85)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 100, 130, 0.6)",
  },
  passwordWrapperFocused: {
    borderColor: "#A6FF00",
  },
  passwordInput: {
    flex: 1,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },

  // --- Botão "Próxima etapa" ---
  buttonProximaEtapa: {
    backgroundColor: "rgba(219, 228, 229, 1)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonProximaEtapaText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 6,
  },
});
