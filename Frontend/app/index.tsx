import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useContext } from 'react'
import { AuthContext } from './contexts/authContext'

export default function Home() {
  const router = useRouter();
  const auth = useContext(AuthContext)

  useEffect(() => {
    // Se l'utente non è autenticato viene reindirizzato alla pagina di accesso
    if (auth && !auth.loading && !auth.token) {
      router.replace('/Login');
    };
  }, [auth?.loading, auth?.token]);

  // Gestione del Logout
  const handleLogout = async () => {
    await auth?.logout()
    router.replace("/Login")
  }

  if (!auth || auth.loading) {
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