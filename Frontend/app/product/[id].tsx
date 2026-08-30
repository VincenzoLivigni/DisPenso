import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { usePantry } from "../../contexts/pantryContext";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View, Text, Image, StyleSheet, Pressable } from "react-native";
import Header from "../../components/Header";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const placeholder = require("../../assets/placeholder.png");

export default function DettaglioProdotto() {
  // Estraiamo l'ID dall'URL della rotta
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById } = usePantry();
  const router = useRouter()

  const product = getProductById(Number(id));

  return (
    <>
      <Header />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={
              product?.image_url ? { uri: product?.image_url } : placeholder
            }
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.separator}></View>

        <Text style={styles.title}>{product?.name}</Text>

        <View style={styles.infoProduct}>
          <Text style={styles.label}>Scadenza:</Text>
          <Text style={styles.value}>
            {product?.expiration_date
              ? product.expiration_date
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")
              : "-"}
          </Text>
        </View>

        <View style={styles.infoProduct}>
          <Text style={styles.label}>Quantità:</Text>
          <Text style={styles.value}>{product?.quantity}</Text>
        </View>

        <View style={styles.infoProduct}>
          <Text style={styles.label}>Aggiunto il:</Text>
          <Text style={styles.value}>
            {product?.added_at
              ? product.added_at.split("T")[0].split("-").reverse().join("/")
              : "-"}
          </Text>
        </View>

        <View style={styles.infoProduct}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.value}>{product?.brand ?? "0"}</Text>
        </View>

        <View style={styles.infoProduct}>
          <Text style={styles.label}>Ingredienti:</Text>
          <Text style={styles.longText}>{product?.ingredients ?? "0"}</Text>
        </View>

        {product?.nutrition && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Valori Nutrizionali (per 100g)</Text>
            <View style={styles.nutritionCard}>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Energia</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.energy_kcal ?? "0"} kcal</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Grassi</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.fat ?? "0"} g</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Di cui acidi grassi saturi</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.saturated_fat ?? "0"} g</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Carboidrati</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.carbohydrates ?? "0"} g</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Di cui zuccheri</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.sugars ?? "0"} g</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fibre</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.fiber ?? "0"} g</Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Proteine</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.proteins ?? "0"} g</Text>
              </View>

              <View style={[styles.nutritionRow, styles.lastNutritionRow]}>
                <Text style={styles.nutritionLabel}>Sale</Text>
                <Text style={styles.nutritionValue}>{product.nutrition.salt ?? "0"} g</Text>
              </View>

            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <Pressable onPress={() => router.replace("/Dispense")}>
          <LinearGradient
            colors={["rgba(59, 175, 203, 1)", "rgba(71, 179, 161, 1)", "rgba(99, 190, 63, 1)"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.2, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text style={styles.backText}>Torna alle dispense</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 70,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16
  },
  image: {
    width: 200, height: 200,
    borderRadius: 12
  },
  separator: {
    height: 1, backgroundColor: "#ccc",
    marginVertical: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16
  },
  infoProduct: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555"
  },
  value: {
    fontSize: 16,
    color: "#333"
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  longText: {
    width: 150
  },
  nutritionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lastNutritionRow: {
    borderBottomWidth: 0,
  },
  nutritionLabel: {
    color: "#555",
    fontSize: 16
  },
  nutritionValue: {
    fontWeight: "600",
    color: "#333",
    fontSize: 16
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 10
  },
  backButton: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    marginLeft: 8,
  },
});
