import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { getRecipeInformation, RecipeDetails } from "../../services/spoonacular";
import { translateRecipeDetails } from "../../services/translate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RecipeDetailScreen() {
    const router = useRouter()

    const { id } = useLocalSearchParams<{ id: string }>() // Prende l'[id] dalla rotta dinamica
    const [recipe, setRecipe] = useState<RecipeDetails | null>(null)

    useEffect(() => {
        if (id) {
            fetchDetails()
        }
    }, [id]);

    async function fetchDetails() {
        try {
            const data = await getRecipeInformation(Number(id))

            // traduzione della ricetta
            if (data) {
                const translatedRecipe = await translateRecipeDetails(data);
                setRecipe(translatedRecipe);
            }
        } catch (error) {
            console.log("Errore caricamento dettagli ricetta:", error);
        }
    }

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Errore nel caricamento dei dettagli della ricetta</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                <Image
                    source={{ uri: recipe.image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* informazioni rricetta */}
                <View style={styles.content}>

                    <Text style={styles.title}>{recipe.title}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.badge}>
                            <Text style={styles.infoText}>⏲️ {recipe.readyInMinutes} min</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.infoText}>🍽️ {recipe.servings} porzioni</Text>
                        </View>
                    </View>

                    {/* ingredienti */}
                    <Text style={styles.sectionTitle}>Ingredienti necessari</Text>

                    <View style={styles.card}>
                        {recipe.extendedIngredients.map((ing, index) => (
                            <Text key={index.toString()} style={styles.ingredients}>
                                • {ing.original}
                            </Text>
                        ))}
                    </View>

                    {/* preparazione */}
                    <Text style={styles.sectionTitle}>Preparazione</Text>
                    <View style={styles.card}>
                        {recipe.analyzedInstructions.length > 0 ? (
                            <>
                                {
                                    recipe.analyzedInstructions[0].name ? (
                                        <Text style={styles.titleInstructions}>
                                            {recipe.analyzedInstructions[0].name}
                                        </Text>
                                    ) : null
                                }

                                {recipe.analyzedInstructions[0].steps.map((step, index) => (
                                    <View key={index.toString()} style={styles.stepRow}>
                                        <Text style={styles.stepNumber}>{step.number}.</Text>
                                        <Text style={styles.stepText}>{step.step}</Text>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <Text style={styles.stepText}>Non ci sono istruzioni sulla preparazione disponibili</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.floatingButtonContainer}>
                <Pressable onPress={() => router.replace("/Ricette")}>
                    <LinearGradient
                        colors={[
                            "rgba(59, 175, 203, 1)",
                            "rgba(71, 179, 161, 1)",
                            "rgba(99, 190, 63, 1)",
                        ]}
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
        backgroundColor: "#f9f9f9",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    loadingText: {
        marginTop: 10,
        color: "#6e6e6e",
        fontSize: 14,
    },
    emptyText: {
        fontSize: 14,
        color: "#6e6e6e",
    },
    image: {
        width: "100%",
        height: 250,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#3baecb",
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    badge: {
        backgroundColor: "white",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },
    infoText: {
        fontSize: 13,
        color: "#444",
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "black",
        marginTop: 15,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        gap: 8,
    },
    titleInstructions: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555",
        marginBottom: 10,

    },
    ingredients: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
        marginBottom: 10
    },
    stepRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    stepNumber: {
        fontWeight: "600",
        color: "#3baecb",
        marginRight: 8,
        width: 20,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
    },
    floatingButtonContainer: {
        position: "absolute",
        bottom: 40,
        right: 20,
        zIndex: 10,
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
})
