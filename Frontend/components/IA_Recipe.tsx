import { View, Text, StyleSheet, Pressable, FlatList, Image } from "react-native";
import { usePantry } from "../contexts/pantryContext";
import { getRecipesByExpiringProducts, } from "../services/spoonacular";
import { useState } from "react";

export default function IA_Recipe() {
    const [recipesList, setRecipesList] = useState<any[]>([]);
    const [generatedRecipes, setGeneratedRecipes] = useState(false)

    const { expiringProducts } = usePantry(); //prendo tutti gli ingredienti in scadenza
    const ingredientsArray = expiringProducts.map((p) => p.name); //tengo solo il nome degli ingredienti

    async function fetchRecipes() {
        try {
            const recipes = await getRecipesByExpiringProducts(ingredientsArray); //cerco ricette con il nome degli ingredienti in scadenza

            setRecipesList(recipes); //salvo le ricette dentro lo state
            setGeneratedRecipes(true)
        } catch (error) {
            console.log(error);
        }
    }

    console.log(recipesList);
    return (
        <View style={styles.container}>
            {/* titolo dinamico */}
            <Text style={styles.sectionTitle}>
                {!generatedRecipes ? "Ricette contro lo spreco" : "Lasciati ispirare"}
            </Text>

            {
                !generatedRecipes ? (
                    <Pressable style={styles.button} onPress={fetchRecipes}>
                        <Text style={styles.buttonText}>Genera ricette con l'AI</Text>
                    </Pressable>
                ) : (

                    // se la lista è vuota
                    recipesList.length === 0 ? (
                        <View style={styles.containerSectionIA}>
                            <Text style={styles.emptyText}>Nessuna ricetta trovata con gli ingredienti in scadenza</Text>
                        </View>
                    ) : (

                        // lista di ricette generata
                        <FlatList
                            data={recipesList}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            contentContainerStyle={styles.listContainer}
                            columnWrapperStyle={styles.rowContainer}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Pressable style={styles.recipeCard}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.recipeImage}
                                        resizeMode="contain"
                                    />

                                    <View style={styles.recipeInfo}>
                                        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>

                                        <Text style={styles.recipeDetails}>
                                            Usati: {item.usedIngredientCount} |
                                            Mancanti: {item.missedIngredientCount}
                                        </Text>
                                    </View>
                                </Pressable>
                            )}
                        />
                    )
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: "black",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#63be3f",
        marginVertical: 5,
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 600,
        color: "white",
    },
    containerSectionIA: {
        height: 80,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#6e6e6e",
    },
    listContainer: {
        gap: 12,
    },
    rowContainer: {
        justifyContent: "space-between",
        marginBottom: 15,
    },
    recipeCard: {
        width: "48%",
        backgroundColor: "white",
        borderRadius: 10,
    },
    recipeImage: {
        width: "100%",
        height: 118,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    recipeInfo: {
        padding: 8,
    },
    recipeTitle: {
        fontSize: 14,
        fontWeight: 600,
        color: "#3baecb",
        height: 38
    },
    recipeDetails: {
        fontSize: 12,
        color: "#6e6e6e",
        marginTop: 8,
    },
})
