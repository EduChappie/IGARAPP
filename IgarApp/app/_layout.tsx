import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }}/>
      <Stack.Screen name="login" options={{ title: "LoginScreen", headerShown: false }}/>
      <Stack.Screen name="organizador/cadastro" options={{ title: "Cadastro", headerShown: false }}/>
      <Stack.Screen name="organizador/cadastro_step" options={{ title: "CadastroTwo", headerShown: false }}/>
      <Stack.Screen name="organizador/cadastro_sucess" options={{ title: "CadastroTree", headerShown: false }}/>
    </Stack>
  );
}
