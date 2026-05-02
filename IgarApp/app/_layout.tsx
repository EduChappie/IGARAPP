import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="login" options={{ headerShown: false }}/>
      
      {/* Telas ONG (Pessoa Jurídica) */}
      <Stack.Screen name="cadastro_one" options={{ headerShown: false }}/>
      <Stack.Screen name="cadastro_two" options={{ headerShown: false }}/>
      <Stack.Screen name="cadastro_three" options={{ headerShown: false }}/>
      <Stack.Screen name="cadastro_success" options={{ headerShown: false }}/>

      {/* Telas Voluntário (Pessoa Física) - Adicionadas aqui! */}
      <Stack.Screen name="cadastropf" options={{ headerShown: false }}/>
      <Stack.Screen name="cadastropf_sucess" options={{ headerShown: false }}/>
    </Stack>
  );
}