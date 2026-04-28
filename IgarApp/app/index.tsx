import { Redirect } from "expo-router";

export default function Index() {
  // Redireciona o usuário automaticamente para a rota "/login-email"
  return <Redirect href="/senha-recuperada" />;
}
