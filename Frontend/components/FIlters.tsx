import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";

import { style } from "../styles/generics";

import { SortOption } from "../app/(tabs)/Dispense";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type FiltersProps = {
  search: string;
  onChangeSearch: (text: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export default function Filters({
  search,
  onChangeSearch,
  sort,
  onSortChange,
}: FiltersProps) {
  function reset() {
    onChangeSearch("");
    onSortChange("none");
  }

  return (
    <>
      <View style={styles.filteredContainer}>
        <View style={styles.filterTop}>
          <View style={styles.filterTopLeft}>
            <MaterialCommunityIcons name="tune-variant" size={20} color={style.colors.primary} style={{ marginTop: 4 }} />

            <Text style={styles.title}>Filtra prodotti</Text>
          </View>

          <Pressable style={styles.resetButton} onPress={reset}>
            <MaterialIcons name="refresh" size={20} color={style.colors.error} />
            <Text style={styles.resetTextButton}>RESET</Text>
          </Pressable>
        </View>

        <View style={styles.search}>
          <Text style={styles.label}>Cerca prodotto</Text>

          <TextInput
            placeholder="nome prodotto"
            value={search}
            onChangeText={onChangeSearch}
            placeholderTextColor={style.colors.textSecondary}
            style={styles.input}
          />
        </View>

        {/* BOTTONI PER IL SORT */}
        <View style={styles.sortSection}>
          <Text style={styles.label}>Ordina per</Text>

          <View style={styles.actionContainer}>

            <Pressable
              style={[styles.button, sort === "name-asc" && styles.activeButton]}
              onPress={() =>
                onSortChange(sort === "name-asc" ? "none" : "name-asc")
              }>
              <Text style={[styles.textButton, sort === "name-asc" && styles.activeTextButton]}>A - Z</Text>
            </Pressable>

            <Pressable
              style={[styles.button, sort === "name-desc" && styles.activeButton]}
              onPress={() =>
                onSortChange(sort === "name-desc" ? "none" : "name-desc")
              }>
              <Text style={[styles.textButton, sort === "name-desc" && styles.activeTextButton]}>Z - A</Text>
            </Pressable>

            <Pressable
              style={[styles.button, sort === "qty-desc" && styles.activeButton]}
              onPress={() =>
                onSortChange(sort === "qty-desc" ? "none" : "qty-desc")
              }>
              <Text style={[styles.textButton, sort === "qty-desc" && styles.activeTextButton]}>Quantità +</Text>
            </Pressable>

            <Pressable
              style={[styles.button, sort === "qty-asc" && styles.activeButton]}
              onPress={() =>
                onSortChange(sort === "qty-asc" ? "none" : "qty-asc")
              }>
              <Text style={[styles.textButton, sort === "qty-asc" && styles.activeTextButton]}>Quantità -</Text>
            </Pressable>
          </View>

        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filteredContainer: {
    marginHorizontal: style.spacing.md,
    marginVertical: style.spacing.md,
    padding: style.spacing.md,
    paddingBottom: style.spacing.lg,
    backgroundColor: style.colors.surface,
    borderRadius: style.radius.stats,
    borderWidth: 1,
    borderColor: style.colors.border,
    gap: style.spacing.md,
  },
  filterTop: {
    borderBottomWidth: 2,
    borderBottomColor: style.colors.bgInput,
    paddingBottom: style.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTopLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm
  },
  title: {
    fontSize: style.fontSize.lg,
    fontWeight: "600",
    color: style.colors.text,
  },
  resetButton: {
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.card,
    paddingHorizontal: style.spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: style.spacing.xs,
  },
  resetTextButton: {
    fontWeight: "600",
    color: style.colors.error,
  },
  search: {
    gap: style.spacing.sm,
  },
  label: {
    fontSize: style.fontSize.sm,
    color: style.colors.text,
  },
  input: {
    height: style.controls.inputHeight,
    backgroundColor: style.colors.bgInput,
    color: style.colors.text,
    paddingVertical: style.spacing.sm,
    paddingHorizontal: style.spacing.md,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.card,
  },
  sortSection: {
    gap: style.spacing.sm,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: style.spacing.xs,
  },
  button: {
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.greenLight,
    borderRadius: style.radius.card,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: style.colors.green,
  },
  textButton: {
    fontSize: style.fontSize.xs,
    fontWeight: "600",
    textAlign: "center",
    color: style.colors.textSecondary,
  },
  activeTextButton: {
    color: style.colors.surface,
  }
});
