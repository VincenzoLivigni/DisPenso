import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DettaglioProdotto() {
  // Estraiamo l'ID dall'URL della rotta
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.testo}>Stai guardando i dettagli del prodotto numero:</Text>
      <Text style={styles.id}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  testo: { fontSize: 18 },
  id: { fontSize: 40, fontWeight: 'bold', color: '#FF3B30', marginTop: 10 }
});