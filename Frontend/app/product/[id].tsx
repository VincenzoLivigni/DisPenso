// compnenti React Native
import { ScrollView, View, Text, Image, StyleSheet, Pressable } from "react-native";

// navigazione app
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

// stili
import { style } from "../../styles/generics";

// icone
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// componenti app
const placeholder = require("../../assets/placeholder.png");
import { expirationBadge } from "../../services/utils";

// tipi 
import { usePantry } from "../../contexts/pantryContext";

export default function DettaglioProdotto() {
  // Estraiamo l'ID dall'URL della rotta
  const { id, pantryId } = useLocalSearchParams<{ id: string, pantryId: string }>();
  const { getProductById } = usePantry();
  const router = useRouter();

  const product = getProductById(Number(id));

  const badge = expirationBadge(product?.expiration_date);

  // testo formattato per ingredienti
  function formattedIngredients(text: string): string {
    if (!text) return "";

    let formattedText = text.replace(/[^a-zA-Z0-9àèéìòù\s,]/g, "");

    // testo formattato in minuscolo
    return formattedText.toLowerCase().split(" ").join(" ");
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.replace(`/pantry/${pantryId}`)}
            style={styles.actionButtons}>
            <FontAwesome6 name="chevron-left" size={20} color={style.colors.primary} />
          </Pressable>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={
              product?.image_url ? { uri: product?.image_url } : placeholder
            }
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productDetails}>

          <View style={styles.separator} />

          <Text style={styles.title}>{product?.name}</Text>

          <View style={styles.mainInfoContainer}>
            <Text style={styles.mainInfoTitle}>Informazioni principali</Text>

            <View style={styles.mainInfo}>
              <View style={styles.infoProduct}>
                <Text style={styles.label}>Scadenza:</Text>

                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
              </View>

              <View style={styles.infoSeparator} />

              <View style={styles.infoProduct}>
                <Text style={styles.label}>Quantità:</Text>
                <Text style={styles.value}>{product?.quantity}</Text>
              </View>

              <View style={styles.infoSeparator} />

              <View style={styles.infoProduct}>
                <Text style={styles.label}>Aggiunto il:</Text>
                <Text style={styles.value}>
                  {product?.added_at
                    ? product.added_at.split("T")[0].split("-").reverse().join("/")
                    : "-"}
                </Text>
              </View>

              <View style={styles.infoSeparator} />

              <View style={styles.infoProduct}>
                <Text style={styles.label}>Marca:</Text>
                <Text style={styles.value}>{product?.brand ?? "0"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Ingredienti:</Text>
            <Text style={styles.ingredientsText}>
              {formattedIngredients(product?.ingredients || "") || "Non disponibili"}
            </Text>
          </View>


          {product?.nutrition && (
            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionHeader}>
                <Text style={styles.nutritionTitle}>Valori Nutrizionali</Text>
                <Text style={styles.nutritionSubtitle}>(per 100g)</Text>
              </View>

              <View style={styles.nutritionCard}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Energia</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.energy_kcal ?? "0"} kcal</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Grassi</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.fat ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>
                    Di cui acidi grassi saturi
                  </Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.saturated_fat ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Carboidrati</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.carbohydrates ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Di cui zuccheri</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.sugars ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Fibre</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.fiber ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Proteine</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.proteins ?? "0"} g</Text>
                </View>

                <View style={styles.infoSeparator} />

                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionLabel}>Sale</Text>
                  <Text style={styles.nutritionValue}>{product.nutrition.salt ?? "0"} g</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: style.spacing.xxl
  },
  container: {
    backgroundColor: style.colors.background,
    flex: 1
  },
  headerActions: {
    padding: style.spacing.md,
    marginBottom: style.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButtons: {
    width: 45,
    height: 45,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.circle,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: style.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: style.spacing.lg,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: style.radius.stats,
  },
  productDetails: {
    marginHorizontal: style.spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: style.colors.separatorDark,
    marginVertical: style.spacing.lg,
  },
  title: {
    fontSize: style.fontSize.xxl,
    fontWeight: style.fontWeight.bold,
    color: style.colors.text,
    marginBottom: style.spacing.md,
  },
  mainInfoContainer: {
    backgroundColor: style.colors.surface,
    borderRadius: style.radius.stats,
    borderWidth: 1,
    borderColor: style.colors.border,
    padding: style.spacing.md,
    gap: style.spacing.lg,
  },
  mainInfo: {
    gap: style.spacing.md,
  },
  mainInfoTitle: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.bold,
    color: style.colors.text,
  },
  infoProduct: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.textSecondary,
  },
  value: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.text,
  },
  infoSeparator: {
    height: 1,
    backgroundColor: style.colors.separatorLight,
  },
  ingredientsContainer: {
    backgroundColor: style.colors.surface,
    borderRadius: style.radius.stats,
    borderWidth: 1,
    borderColor: style.colors.border,
    marginTop: style.spacing.lg,
    padding: style.spacing.md,
    gap: style.spacing.xs,
  },
  ingredientsTitle: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.bold,
    color: style.colors.text,
  },
  ingredientsText: {
    fontSize: style.fontSize.md,
    color: style.colors.textSecondary,
    lineHeight: 24
  },
  nutritionContainer: {
    backgroundColor: style.colors.surface,
    borderRadius: style.radius.stats,
    borderWidth: 1,
    borderColor: style.colors.border,
    marginTop: style.spacing.lg,
    padding: style.spacing.md,
    gap: style.spacing.lg,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nutritionTitle: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.bold,
    color: style.colors.text,
  },
  nutritionSubtitle: {
    fontSize: style.fontSize.sm,
    color: style.colors.textSecondary,
  },
  nutritionCard: {
    gap: style.spacing.sm,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: style.spacing.xs,
  },
  nutritionLabel: {
    fontSize: style.fontSize.md,
    color: style.colors.textSecondary,
    flex: 1,
  },
  nutritionValue: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.text,
  },
  badgeText: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.semibold,
  },
});
