import { View, Text, StyleSheet, Pressable, Image } from "react-native";

type RecipePropsProps = {
    item: {
        id: number;
        title: string;
        image: string;
        usedIngredientCount: number;
        missedIngredientCount: number;
    },
    isFavorite: boolean,
    toggleFavorites: (recipe: any) => void,
};

export default function RecipeCard({ item, isFavorite, toggleFavorites }: RecipePropsProps) {
    return (
        <View style={styles.recipeCard}>
            <Image
                source={{ uri: item.image }}
                style={styles.recipeImage}
                resizeMode="contain"
            />

            {/* bottone preferiti */}
            <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorites(item)}
            >
                <Text style={{ fontSize: 16 }}>{isFavorite ? "❤️" : "🤍"}</Text>
            </Pressable>

            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>

                <Text style={styles.recipeDetails}>
                    Usati: {item.usedIngredientCount} |
                    Mancanti: {item.missedIngredientCount}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    recipeCard: {
        width: "48%",
        backgroundColor: "white",
        borderRadius: 10,
        position: "relative"
    },
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "white",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
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