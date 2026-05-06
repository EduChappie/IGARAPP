import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { StatusBar } from "react-native";

// Força o fundo do sistema a ser escuro imediatamente
SystemUI.setBackgroundColorAsync("#001A23");

export default function RootLayout() {
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#001A23",
    },
  };

  return (
    <ThemeProvider value={CustomDarkTheme}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade", // Transição padrão para o resto do app
          contentStyle: { backgroundColor: "#001A23" },
        }}
      >
        {/* REGRAS ESPECÍFICAS DE DESLIZAR PARA AS ABAS DA NAVBAR */}
        <Stack.Screen
          name="home_user"
          options={{ animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="home_ong"
          options={{ animation: "slide_from_left" }}
        />
        <Stack.Screen
          name="historico"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
