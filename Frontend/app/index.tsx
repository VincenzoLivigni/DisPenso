import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controllo autenticazione
    const checkAuth = async () => {
      let token = null;

      if (Platform.OS === 'web') {
        token = localStorage.getItem("user.token");
      } else {
        token = await SecureStore.getItemAsync("user.token");
      }

      // Se l'utente non è autenticato viene reindirizzato alla pagina di accesso
      if (!token) {
        router.replace('/Login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Gestione del Logout
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem("user.token");
    } else {
      await SecureStore.deleteItemAsync("user.token");
    }
    router.replace('/Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titolo}>Dashboard DisPenso</Text>

      <Link href="/prodotto/1" style={styles.bottone}>
        Apri Ricetta 1 (Pasta al pomodoro)
      </Link>

      <Link href="/prodotto/42" style={styles.bottone}>
        Apri Ricetta 42 (Tiramisù)
      </Link>

      <Pressable onPress={handleLogout} style={styles.bottoneLogout}>
        <Text style={styles.testoLogout}>Disconnetti</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  titolo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  bottone: { backgroundColor: '#007AFF', color: 'white', padding: 15, margin: 10, borderRadius: 8, overflow: 'hidden' },
  bottoneLogout: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, marginTop: 20 },
  testoLogout: { color: 'white', fontWeight: 'bold' }
});