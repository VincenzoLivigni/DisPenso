import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Carosello from '../../components/Carosello';
import IA_Recipe from '../../components/IA_Recipe';
import Stats from '../../components/Stats';

export default function Dashboard() {

  return (
    <View style={styles.container}>

      <Carosello />

      <IA_Recipe />

      <Stats />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});