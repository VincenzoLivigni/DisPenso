// app/_layout.tsx
import "../global.css";
import { Stack } from 'expo-router';
import { AuthProvider } from "../contexts/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Gruppo Tabs (contiene la navbar in basso) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Rotte autonome senza bottom tab */}
        <Stack.Screen name="Login" options={{ title: 'Accesso', headerShown: false }} />
        <Stack.Screen name="Register" options={{ title: 'Registrazione', headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}