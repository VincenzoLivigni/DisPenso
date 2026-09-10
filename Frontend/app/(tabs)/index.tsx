import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Carosello from "../../components/Carosello";
import IA_Recipe from "../../components/IA_Recipe";
import Stats from "../../components/Stats";
import { PantryProvider } from "../../contexts/pantryContext";

export default function Dashboard() {
  return (
    <PantryProvider>
      <View style={styles.container}>
        <Carosello />

        <IA_Recipe />

        <Stats />
      </View>
    </PantryProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
});
