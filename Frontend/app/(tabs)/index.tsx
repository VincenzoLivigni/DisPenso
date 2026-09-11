import { View, StyleSheet } from "react-native";
import Stats from "../../components/Stats";
import { PantryProvider } from "../../contexts/pantryContext";

export default function Dashboard() {
  return (
    <PantryProvider>
      <View style={styles.container}>

        <Stats />

      </View>
    </PantryProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
});
