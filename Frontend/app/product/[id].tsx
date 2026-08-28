import { useLocalSearchParams, Stack } from "expo-router";
import { usePantry } from "../../contexts/pantryContext";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

const placeholder = require("../../assets/placeholder.png");

export default function DettaglioProdotto() {
  // Estraiamo l'ID dall'URL della rotta
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById } = usePantry();

  const product = getProductById(Number(id));

  return (
    <>
      <Stack.Screen options={{ title: product?.name }} />

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
          <Text style={styles.label}>Marca:</Text>

          <Text style={styles.value}>{product?.brand}</Text>
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
          <Text style={styles.value}>{product?.brand ?? "-"}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageContainer: { alignItems: "center", marginBottom: 16 },
  image: { width: 200, height: 200, borderRadius: 12 },
  separator: { height: 1, backgroundColor: "#ccc", marginVertical: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  infoProduct: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: { fontWeight: "600", color: "#555" },
  value: { color: "#333" },
});
