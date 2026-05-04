import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack 
      // Essa linha mágica arranca a barra branca de TODAS as telas do seu app
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastropf" />
      
      {/* Coloquei cadastro_ong aqui baseado no print, se o nome do seu arquivo for cadastro_pj, é só alterar aqui! */}
      <Stack.Screen name="cadastro_ong" /> 
      
      <Stack.Screen name="detalhes_ativa" />
    </Stack>
  );
}