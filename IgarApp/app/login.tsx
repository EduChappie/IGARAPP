import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export default function LoginScreen() {
    return (
        <View style={{ alignItems: "center" }}>
            <View style={ styles.container }>
            <br />
            <Text>
                Segunda Tela: 'Cadastro de login'
            </Text>
            <br />
            <Text>
                Aqui vai ficar a tela cadastro, entrada de usuário normal.
                Email, senha e botão de criar conta.
            </Text>
            </View>
        </View>
    );
}

// Observação, caso vá começar a desenvolver, pode apagar o estilo básico e o body 
// só é exemplo de organização de telas, caso vá criar outras páginas, seja minimalista
// e o mais importante DEIXA ORGANIZADO 
// to falando contigo EDUARDO 

// css básico
const styles = StyleSheet.create({
  container: {
    width: '50%'
  }
})