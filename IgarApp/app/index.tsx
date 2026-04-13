import React from 'react';
import { Text  } from 'react-native'; 
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    
    <View style={{ alignItems: "center" }}>
      <View style={ styles.container }>
        <br />
        <Text>
          Primeira Tela: 'Tela de Login'
        </Text>
        <br />
        <Text>
          Aqui vai ficar a tela inicial, de escolher se o usuário vai entrar como voluntário ou como organizador de uma ONG.
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

