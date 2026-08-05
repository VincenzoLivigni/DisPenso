import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';



export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.titolo}>Le tue ricette in Dispenso</Text>

      {/* Il Link ci porta alla pagina dinamica passandogli un ID */}
      <Link href="/prodotto/1" style={styles.bottone}>
        Apri Ricetta 1 (Pasta al pomodoro)
      </Link>

      <Link href="/prodotto/42" style={styles.bottone}>
        Apri Ricetta 42 (Tiramisù)
      </Link>

      <Link href="Register" style={styles.bottone}>
        fai la registrazione
      </Link>

      <Link href="Login" style={styles.bottone}>
        Accedi
      </Link>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  titolo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  bottone: { backgroundColor: '#007AFF', color: 'white', padding: 15, margin: 10, borderRadius: 8, overflow: 'hidden' }
});