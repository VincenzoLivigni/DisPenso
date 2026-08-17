import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Carosello from '../../components/Carosello';

export default function Dashboard() {

  return (
    <View style={styles.container}>

      <Carosello/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});