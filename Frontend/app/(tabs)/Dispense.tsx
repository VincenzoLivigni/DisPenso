import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Accordions from "../../components/Accordions";
import { useEffect, useState } from "react";
import Filters from "../../components/FIlters";

import { usePantry } from "../../contexts/pantryContext";
import PantryFormsSection from "../../components/PantryForms";

export type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "qty-asc"
  | "qty-desc";
// export type NameSortOption = "none" | "name-asc" | "name-desc";
// export type QtySortOption = "none" | "qty-asc" | "qty-desc";

export default function Dispense() {
  const { pantries, products } = usePantry();

  const [searchPantry, setSearchPantry] = useState("");

  const [sort, setSort] = useState<SortOption>("none");
  // const [nameSort, setNameSort] = useState<NameSortOption>("none");
  // const [qtySort, setQtySort] = useState<QtySortOption>("none");


  const cleanSearch = searchPantry.toLowerCase().trim();

  // Filtriamo i prodotti per ogni dispensa
  const filteredProductsForPantry = (pantryId: number) => {
    const prods = products[pantryId] || [];

    let result = prods;
    if (cleanSearch) {
      result = prods.filter((p) =>
        p.name.toLocaleLowerCase().includes(cleanSearch),
      );
    }

    if (sort === "none") return result;

    return [...result].sort((a, b) => {
      let primaryComparison = 0;

      if (sort === "qty-desc") {
        primaryComparison = b.quantity - a.quantity;
      } else if (sort === "qty-asc") {
        primaryComparison = a.quantity - b.quantity;
      }

      if (primaryComparison !== 0) {
        return primaryComparison;
      }

      if (sort === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sort === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });
  };

  // Filtriamo le dispense: teniamo quelle che hanno prodotti che matchano
  const visiblePantries = pantries.filter((pantry) => {
    if (!cleanSearch) return true;
    const matchesPantryName = pantry.name.toLowerCase().includes(cleanSearch);
    const matchesProducts = filteredProductsForPantry(pantry.id).length > 0;
    return matchesPantryName || matchesProducts;
  });

  // Se stiamo cercando ma visiblePantries è vuoto, non c'è nulla da mostrare in assoluto
  const isSearchEmpty = cleanSearch !== "" && visiblePantries.length === 0;

  return (
    <View style={styles.mainContainer}>

      <PantryFormsSection />

      {/* SEARCH BAR PER FILTRARE */}
      <Filters
        search={searchPantry}
        onChangeSearch={setSearchPantry}
        sort={sort}
        onSortChange={setSort}
      />

      {/* ACCORDION CHE VIENE STAMPATO */}
      <View style={styles.pantriesContainer}>
        {isSearchEmpty ? (
          <Text style={styles.notFoundText}>
            Nessun prodotto trovato con questo nome
          </Text>
        ) : (
          <FlatList
            data={visiblePantries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const pantryProds = filteredProductsForPantry(item.id);

              return (
                <Accordions
                  products={pantryProds}
                  pantry={item}
                  search={searchPantry}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ccc",
  },
  pantriesContainer: {
    flex: 1,
    marginHorizontal: 13,
    marginVertical: 15,
  },
  notFoundText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6e6e6e",
  },
});
