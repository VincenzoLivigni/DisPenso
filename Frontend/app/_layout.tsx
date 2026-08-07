import "../global.css";
import { Stack } from 'expo-router';
import { AuthProvider } from "../contexts/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="Login"
          options={{ title: 'Accesso', headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          options={{ title: 'Registrazione', headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ title: 'DisPenso Dashboard' }}
        />
        <Stack.Screen
          name="prodotto/[id]"
          options={{ title: 'Dettaglio Prodotto' }}
        />
      </Stack>
    </AuthProvider>
  );
}