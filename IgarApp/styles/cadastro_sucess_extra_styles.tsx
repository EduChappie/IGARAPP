import { StyleSheet } from "react-native";

export const cadastroSuccessExtra = StyleSheet.create({

    // --- Wrapper do conteúdo central ---
    contentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 80,
    },

    // --- Título de sucesso (maior e em duas linhas) ---
    successTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 10,
        lineHeight: 34,
    },

    // --- Espaçamento do step indicator nessa tela ---
    stepSpacing: {
        marginTop: 24,
        marginBottom: 10,
    },

    // --- Links fixos no rodapé ---
    footerLinks: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
});