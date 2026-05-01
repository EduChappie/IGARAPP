import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }}/>
      <Stack.Screen name="login" options={{ title: "LoginScreen", headerShown: false }}/>

      <Stack.Screen name="organizador/cadastro" options={{ title: "Organizador_Cadastro", headerShown: false }}/>
      <Stack.Screen name="organizador/cadastro_step" options={{ title: "Organizador_Cadastro_Step", headerShown: false }}/>
      <Stack.Screen name="organizador/cadastro_sucess" options={{ title: "Organizador_Cadastro_Sucess", headerShown: false }}/>

      <Stack.Screen name="voluntario/cadastro" options={{ title: "Voluntario_Cadastro", headerShown: false }}/>
      <Stack.Screen name="voluntario/cadastro_sucess" options={{ title: "Voluntario_Cadastro_Sucess", headerShown: false }}/>
    
    </Stack>
  );
}
