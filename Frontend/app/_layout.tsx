// app/_layout.tsx
import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/authContext";
import { PantryProvider } from "../contexts/pantryContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* per adattare il layout dell'app allo schermo su mobile */}
      <SafeAreaProvider>
        <AuthProvider>
          <PantryProvider>
            <Stack>
              {/* Gruppo Tabs (contiene la navbar in basso) */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Rotte autonome senza bottom tab */}
              <Stack.Screen
                name="Login"
                options={{ title: "Accesso", headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                options={{ title: "Registrazione", headerShown: false }}
              />
            </Stack>
          </PantryProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
