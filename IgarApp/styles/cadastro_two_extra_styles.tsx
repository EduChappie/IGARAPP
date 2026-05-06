import { StyleSheet } from "react-native";

export const cadastroTwoExtra = StyleSheet.create({

    // --- Textarea "Sobre a Empresa" ---
    textArea: {
        backgroundColor: 'rgba(0, 50, 70, 0.85)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 100, 130, 0.6)',
        color: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 13,
        width: '100%',
        minHeight: 130,
        textAlignVertical: 'top',
    },
    textAreaFocused: {
        borderColor: '#A6FF00',
    },
});