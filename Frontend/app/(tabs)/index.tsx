import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Dashboard() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.titolo}>Dashboard DisPenso</Text>

      <Link href="/prodotto/1" style={styles.bottone}>
        Apri Ricetta 1 (Pasta al pomodoro)
      </Link>

      <Link href="/prodotto/42" style={styles.bottone}>
        Apri Ricetta 42 (Tiramisù)
      </Link>

     
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