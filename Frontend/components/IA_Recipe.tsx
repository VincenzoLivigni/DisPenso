import { View, Text, StyleSheet, Pressable, FlatList, ScrollView } from "react-native";
import { usePantry } from "../contexts/pantryContext";
import { getRecipesByExpiringProducts, } from "../services/spoonacular";
import { translateText } from "../services/translate"
import { useEffect, useState } from "react";
import { getStorageItem, saveStorageItem } from "../services/storage"
import RecipeCard from "./RecipeCard";

export default function IA_Recipe() {
    const [recipesList, setRecipesList] = useState<any[]>([]);
    const [generatedRecipes, setGeneratedRecipes] = useState(false)

    const { expiringProducts } = usePantry(); //prendo tutti gli ingredienti in scadenza
    const ingredientsArray = expiringProducts.map((p) => p.name); //tengo solo il nome degli ingredienti

    async function fetchRecipes() {
        try {
            const recipes = await getRecipesByExpiringProducts(ingredientsArray); //cerco ricette con il nome degli ingredienti in scadenza

            // traduzione dei titoli delle ricette in italiano
            const translatedRecipesTitle = await Promise.all(
                recipes.map(async (recipe: any) => {

                    const translatedTitle = await translateText(recipe.title)
                    return {
                        ...recipe,
                        title: translatedTitle
                    }
                })
            )

            setRecipesList(translatedRecipesTitle); //salvo le ricette dentro lo state
            setGeneratedRecipes(true)
        } catch (error) {
            console.log(error);
        }
    }

    // preferiti
    const [favorites, setFavorites] = useState<number[]>([])

    // le ricette preferite vengono caricate all'avvio
    useEffect(() => {
        loadFavorites()
    }, [])

    // caricamento delle ricette preferite
    async function loadFavorites() {
        try {
            const storedFavorites = await getStorageItem("favorite_recipes")

            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites))
            }
        }
        catch (err) {
            console.log("Errore nel caricamento delle ricette preferite:", err)
        }
    }

    // toggle
    async function toggleFavorites(recipe: any) {
        try {
            let updatedFavorites

            if (favorites.includes(recipe.id)) {
                // se la ricetta è già nei preferiti, viene rimossa
                updatedFavorites = favorites.filter((id) => id !== recipe.id)
            } else {
                // se la ricetta non è nei preferiti, viene aggiunta
                updatedFavorites = [...favorites, recipe.id]
            }


            setFavorites(updatedFavorites);
            await saveStorageItem("favorite_recipes", JSON.stringify(updatedFavorites))
        }
        catch (err) {
            console.log("Errore nel salvataggio della dispensa preferita: ", err)
        }
    }

    // lista ricette preferite
    const favoriteRecipes = recipesList.filter((r) => favorites.includes(r.id))

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* titolo dinamico */}
            <Text style={styles.sectionTitle}>
                {!generatedRecipes ? "Lasciati ispirare" : "Ricette contro lo spreco"}
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
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            contentContainerStyle={styles.listContainer}
                            columnWrapperStyle={styles.rowContainer}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (

                                // card ricette
                                <RecipeCard
                                    item={item}
                                    isFavorite={favorites.includes(item.id)}
                                    toggleFavorites={toggleFavorites}
                                />

                            )}
                        />
                    )
                )}

            {/* preferti */}
            <View style={styles.sectionFavorites}>
                <Text style={styles.sectionTitle}>Le tue ricette preferite</Text>

                {favoriteRecipes.length === 0 ? (
                    <Text style={styles.emptyText}>Non hai ancora salvato nessuna ricetta tra i preferiti</Text>
                ) : (
                    <FlatList
                        data={favoriteRecipes}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        contentContainerStyle={styles.listContainer}
                        columnWrapperStyle={styles.rowContainer}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (

                            // card ricette preferite
                            <RecipeCard
                                item={item}
                                isFavorite={favorites.includes(item.id)}
                                toggleFavorites={toggleFavorites}
                            />
                        )}
                    />
                )
                }
            </View>
        </ScrollView>
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
    sectionFavorites: {
        marginTop: 30,
        paddingBottom: 130
    }
})
