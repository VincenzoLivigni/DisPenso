import { View, Text, StyleSheet, Pressable } from "react-native";
import { usePantry } from "../contexts/pantryContext";
import {
  getRecipesByExpiringProducts,
  getRecipeInformation,
} from "../services/spoonaculat";
import { useEffect, useState } from "react";

export default function IA_Recipe() {
  const [recipesList, setRecipesList] = useState<any[]>([]);

  const { expiringProducts } = usePantry(); //prendo tutti gli ingredienti in scadenza
  const ingredientsArray = expiringProducts.map((p) => p.name); //tengo solo il nome degli ingredienti

  async function fetchRecipes() {
    try {
      const recipes = await getRecipesByExpiringProducts(ingredientsArray); //cerco ricette con il nome degli ingredienti in scadenza

      setRecipesList(recipes); //salvo le ricette dentro lo state
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, [expiringProducts]);

  console.log(recipesList);
  return (
    <>
      <View style={styles.containerSectionIA}>
        <Text>ricette</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerSectionIA: {
    height: 80,
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontWeight: 600,
  },
});
