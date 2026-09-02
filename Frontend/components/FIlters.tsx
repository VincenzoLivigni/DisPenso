import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SortOption } from "../app/(tabs)/Dispense";

type FiltersProps = {
  search: string;
  onChangeSearch: (text: string) => void;
  sort: SortOption;
  // nameSort: NameSortOption;
  // quantitySort: QtySortOption;
  onSortChange: (sort: SortOption) => void;
  // onSortNameChange: (sort: NameSortOption) => void;
  // onSortQuantityChange: (sort: QtySortOption) => void;
};

export default function Filters({
  search,
  onChangeSearch,
  sort,
  onSortChange,
  // nameSort,
  // quantitySort,
  // onSortNameChange,
  // onSortQuantityChange,
}: FiltersProps) {
  function reset() {
    onChangeSearch("");
    onSortChange("none");
    // onSortNameChange("none");
    // onSortQuantityChange("none");
  }

  return (
    <>
      <View style={styles.filteredContainer}>
        <View style={styles.topFilter}>
          <View style={styles.search}>
            <Text style={styles.label}>Cerca prodotto</Text>
            <TextInput
              placeholder="nome prodotto"
              value={search}
              onChangeText={onChangeSearch}
              style={styles.input}
            />
          </View>

          <View style={styles.resetContainer}>
            <Pressable style={[styles.resetButton]} onPress={reset}>
              <Text style={styles.textButton}>RESET</Text>
            </Pressable>
          </View>
        </View>

        {/* BOTTONI PER IL SORT */}
        <View style={styles.actionContainer}>
          <Pressable
            style={[styles.button, sort === "name-asc" && styles.activeButton]}
            onPress={() =>
              onSortChange(sort === "name-asc" ? "none" : "name-asc")
            }
          >
            <Text style={styles.textButton}>A - Z</Text>
          </Pressable>
          <Pressable
            style={[styles.button, sort === "name-desc" && styles.activeButton]}
            onPress={() =>
              onSortChange(sort === "name-desc" ? "none" : "name-desc")
            }
          >
            <Text style={styles.textButton}>Z - A</Text>
          </Pressable>

          <Pressable
            style={[styles.button, sort === "qty-desc" && styles.activeButton]}
            onPress={() =>
              onSortChange(sort === "qty-desc" ? "none" : "qty-desc")
            }
          >
            <Text style={styles.textButton}>Quantità +</Text>
          </Pressable>
          <Pressable
            style={[styles.button, sort === "qty-asc" && styles.activeButton]}
            onPress={() =>
              onSortChange(sort === "qty-asc" ? "none" : "qty-asc")
            }
          >
            <Text style={styles.textButton}>Quantità -</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filteredContainer: {
    marginHorizontal: 13,
    marginVertical: 15,
    gap: 10,
  },
  topFilter: {
    marginVertical: 15,
    gap: 8,
    flexDirection: "row",
  },
  search: {
    width: "75%",
    alignContent: "flex-end",
  },
  label: {
    marginBottom: 8,
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
  actionContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  button: {
    height: 40,
    backgroundColor: "#63be3f96",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: "#63be3f",
  },
  resetButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#cb3b3b",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "flex-end",
  },
  resetContainer: {
    width: "23%",
    height: 66.4,
    borderRadius: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "flex-end",
  },
  textButton: {
    color: "white",
    fontWeight: 600,
  },
});
