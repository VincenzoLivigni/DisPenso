import "../global.css";
import { Stack } from 'expo-router';
import { AuthProvider } from "../contexts/authContext";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
      screenOptions={{
        header: (props) => <Header/>
      }}>
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