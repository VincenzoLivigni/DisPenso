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

export type NameSortOption = "none" | "name-asc" | "name-desc";
export type QtySortOption = "none" | "qty-asc" | "qty-desc";

export default function Dispense() {
  const { pantries, products, createPantry } = usePantry();

  const [newPantry, setNewPantry] = useState("");
  const [searchPantry, setSearchPantry] = useState("");

  const [nameSort, setNameSort] = useState<NameSortOption>("none");
  const [qtySort, setQtySort] = useState<QtySortOption>("none");

  const handleCreatePantry = async () => {
    if (newPantry.trim().length < 3) {
      return Alert.alert("Nome dipensa non valido");
    }
    await createPantry(newPantry.trim());
    setNewPantry("");
  };

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

    if (nameSort === "none" && qtySort === "none") return result;

    return [...result].sort((a, b) => {
      let primaryComparison = 0;

      if (qtySort === "qty-desc") {
        primaryComparison = b.quantity - a.quantity;
      } else if (qtySort === "qty-asc") {
        primaryComparison = a.quantity - b.quantity;
      }

      if (primaryComparison !== 0) {
        return primaryComparison;
      }

      if (nameSort === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (nameSort === "name-desc") {
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
      <View style={styles.createdContainer}>
        <TextInput
          placeholder="Aggiungi una nuova dispensa"
          value={newPantry}
          onChangeText={setNewPantry}
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleCreatePantry}>
          <Text style={styles.textButton}>Aggiungi</Text>
        </Pressable>
      </View>

      {/* SEARCH BAR PER FILTRARE */}
      <Filters
        search={searchPantry}
        onChangeSearch={setSearchPantry}
        nameSort={nameSort}
        onSortNameChange={setNameSort}
        quantitySort={qtySort}
        onSortQuantityChange={setQtySort}
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
                  nomeDispensa={item.name}
                  products={pantryProds}
                  pantryId={item.id}
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
  createdContainer: {
    marginHorizontal: 13,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#6e6e6e",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#3baecb",
    borderWidth: 1,
    borderColor: "#6e6e6e",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "600",
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
