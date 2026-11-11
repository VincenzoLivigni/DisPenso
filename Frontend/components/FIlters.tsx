import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView
} from "react-native";

import { style } from "../styles/generics";

import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type FiltersProps = {
  search: string;
  onChangeSearch: (text: string) => void
  sortName: "none" | "name-asc" | "name-desc"
  onSortNameChange: (sort: "none" | "name-asc" | "name-desc") => void
  sortQuantity: "none" | "qty-asc" | "qty-desc"
  onSortQuantityChange: (sort: "none" | "qty-asc" | "qty-desc") => void
};

export default function Filters({
  search,
  onChangeSearch,
  sortName,
  onSortNameChange,
  sortQuantity,
  onSortQuantityChange,
}: FiltersProps) {
  function reset() {
    onChangeSearch("");
    onSortNameChange("none");
    onSortQuantityChange("none");
  }

  const hasActibeFilters = search.trim() !== "" || sortName !== "none" || sortQuantity !== "none"

  return (
    <View style={styles.filteredContainer}>

      <View style={styles.search}>
        <Feather name="search" size={20} color={style.colors.textSecondary} />

        <TextInput
          placeholder="Cerca prodotto..."
          value={search}
          onChangeText={onChangeSearch}
          placeholderTextColor={style.colors.textSecondary}
          style={styles.input}
        />
      </View>

      {/* BOTTONI PER IL SORT */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionContainer}
      >
        {!hasActibeFilters ? (
          <Pressable style={[styles.button, sortName === "none" && sortQuantity === "none" && styles.activeButton]}
            onPress={() => {
              onSortNameChange("none");
              onSortQuantityChange("none");
            }}>
            <Text style={[styles.textButton, sortName === "none" && sortQuantity === "none" && styles.activeTextButton]}>Tutti</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.resetButton}
            onPress={reset}>
            <MaterialIcons name="refresh" size={18} color={style.colors.error} />
            <Text style={styles.resetTextButton}>Reset</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button, sortName === "name-asc" && styles.activeButton]}
          onPress={() =>
            onSortNameChange(sortName === "name-asc" ? "none" : "name-asc")
          }>
          <Text style={[styles.textButton, sortName === "name-asc" && styles.activeTextButton]}>A - Z</Text>
        </Pressable>

        <Pressable
          style={[styles.button, sortName === "name-desc" && styles.activeButton]}
          onPress={() =>
            onSortNameChange(sortName === "name-desc" ? "none" : "name-desc")
          }>
          <Text style={[styles.textButton, sortName === "name-desc" && styles.activeTextButton]}>Z - A</Text>
        </Pressable>

        <Pressable
          style={[styles.button, sortQuantity === "qty-asc" && styles.activeButton]}
          onPress={() =>
            onSortQuantityChange(sortQuantity === "qty-asc" ? "none" : "qty-asc")
          }>
          <Text style={[styles.textButton, sortQuantity === "qty-asc" && styles.activeTextButton]}>Quantità +</Text>
        </Pressable>

        <Pressable
          style={[styles.button, sortQuantity === "qty-desc" && styles.activeButton]}
          onPress={() =>
            onSortQuantityChange(sortQuantity === "qty-desc" ? "none" : "qty-desc")
          }>
          <Text style={[styles.textButton, sortQuantity === "qty-desc" && styles.activeTextButton]}>Quantità -</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filteredContainer: {
    marginVertical: style.spacing.md,
    gap: style.spacing.md,
  },
  search: {
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.stats,
    paddingHorizontal: style.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  input: {
    height: "100%",
    fontSize: style.fontSize.md,
    color: style.colors.text,
    flex: 1,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: style.spacing.sm,
  },
  button: {
    minWidth: 70,
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.circle,
    paddingHorizontal: style.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: style.colors.primary,
  },
  textButton: {
    fontSize: style.fontSize.sm,
    fontWeight: style.fontWeight.semibold,
    textAlign: "center",
    color: style.colors.textSecondary,
  },
  activeTextButton: {
    color: style.colors.surface,
  },
  resetButton: {
    minWidth: 70,
    height: style.controls.buttonHeight,
    backgroundColor: "#f3626220",
    borderRadius: style.radius.circle,
    paddingHorizontal: style.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: style.spacing.xs,
  },
  resetTextButton: {
    fontSize: style.fontSize.sm,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.error,
  },
});
