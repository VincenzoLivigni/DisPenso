import "../global.css"
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // Stack gestisce automaticamente le transizioni native tra le pagine
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Dispenso Home' }} 
      />
      <Stack.Screen 
        name="prodotto/[id]" 
        options={{ title: 'Dettaglio Prodotto' }} 
      />
      <Stack.Screen
      name="Register"
      options={{title: 'Pagina Di Registrazione'}}
      />
    </Stack>
  );
}