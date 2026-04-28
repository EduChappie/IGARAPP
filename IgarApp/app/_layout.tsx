import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { Colors } from "../src/constants/Colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* O Slot é onde o Expo injeta as nossas telas (como a de login) */}
      <Slot />
    </>
  );
}
