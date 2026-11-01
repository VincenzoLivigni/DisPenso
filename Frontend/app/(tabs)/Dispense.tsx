import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

import { useState } from "react";

import Accordions from "../../components/Accordions";
import Filters from "../../components/FIlters";
import PantryFormsSection from "../../components/PantryForms";

import { usePantry } from "../../contexts/pantryContext";
import { style } from "../../styles/generics";

import Feather from '@expo/vector-icons/Feather';

export type SortOption =
  | "none"
  | "name-asc"
  | "name-desc"
  | "qty-asc"
  | "qty-desc";

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
    <>
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

        <View style={styles.pantriesHeader}>
          <View style={styles.pantriesHeaderLeft}>
            <Feather name="box" size={22} color={style.colors.primary} style={{ marginTop: 2 }} />
            <Text style={styles.pantriesTitle}>Le mie dispense</Text>
          </View>
        </View>

        <View style={styles.pantriesContent}>
          {isSearchEmpty ? (
            <Text style={styles.notFoundText}>Nessun prodotto trovato con questo nome</Text>
          ) : (
            <FlatList
              data={visiblePantries}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={{ height: style.spacing.md }} />
              )}
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
    </>
  );
}

const styles = StyleSheet.create({
  pantriesContainer: {
    marginHorizontal: style.spacing.md,
    marginVertical: style.spacing.md,
  },
  pantriesHeader: {
    height: 60,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderTopLeftRadius: style.radius.stats,
    borderTopRightRadius: style.radius.stats,
    padding: style.spacing.md,
    justifyContent: "center"
  },
  pantriesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  pantriesTitle: {
    fontSize: style.fontSize.lg,
    fontWeight: "600",
    color: style.colors.text,
  },
  pantriesContent: {
    backgroundColor: style.colors.bgDark,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: style.colors.border,
    borderBottomLeftRadius: style.radius.stats,
    borderBottomRightRadius: style.radius.stats,
    padding: style.spacing.md,
    flex: 1
  },
  notFoundText: {
    fontSize: style.fontSize.sm,
    textAlign: "center",
    color: style.colors.textSecondary,
    marginTop: style.spacing.lg,
  },
});
