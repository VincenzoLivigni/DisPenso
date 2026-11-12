// compnenti React Native
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Alert } from "react-native";

// hooks
import { useState } from "react";

// navigazione app
import { useRouter } from "expo-router";

// icone
import PantryFormsSection from "../../components/PantryForms";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

// stili
import { style } from "../../styles/generics";

// tipi 
import { usePantry } from "../../contexts/pantryContext";

export default function Dispense() {
  const { pantries, products, pantryMembersDetails, handleJoinPantry } = usePantry();

  const [searchPantry, setSearchPantry] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [joinCode, setJoinCode] = useState("")

  const cleanSearch = searchPantry.toLowerCase().trim();

  const visiblePantries = pantries.filter((pantry) => pantry.name.toLowerCase().includes(cleanSearch))

  // Se stiamo cercando ma visiblePantries è vuoto, non c'è nulla da mostrare in assoluto
  const isSearchEmpty = cleanSearch !== "" && visiblePantries.length === 0;

  const router = useRouter();

  const handleOpenDetail = (pantryId: number) => {
    router.push(`/pantry/${pantryId}`);
  };

  // aggiungi membro a dispensa
  const onJoinSubmit = async () => {
    const code = joinCode.trim()

    if (!code) {
      Alert.alert("Codice mancante", "Inserisci un codice d'invito.")
      return;
    }

    try {
      await handleJoinPantry(code)
      setJoinCode("")
    } catch {
      Alert.alert(
        "Errore",
        "L'invito non è stato mandato. Riprova.",
      )
    }
  }

  return (
    <View style={styles.mainContainer}>

      <View style={styles.pantriesHeader}>

        <View style={styles.pantriesHeaderLeft}>
          <Text style={styles.title}>Le mie dispense</Text>
        </View>

        <Pressable
          onPress={() => setIsCreateOpen((prev) => !prev)}
          style={styles.addButton}
        >
          <Feather name={isCreateOpen ? "x" : "plus"} size={22} color={style.colors.surface} />
        </Pressable>
      </View>

      <PantryFormsSection
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* SEARCH BAR PER FILTRARE */}
      <View style={styles.search}>
        <Feather name="search" size={18} color={style.colors.textSecondary} />

        <TextInput
          placeholder="Cerca dispensa..."
          value={searchPantry}
          onChangeText={setSearchPantry}
          placeholderTextColor={style.colors.textSecondary}
          style={styles.input}
        />
      </View>


      <View style={styles.pantriesContainer}>

        <View style={styles.pantriesContent}>
          {isSearchEmpty ? (
            <Text style={styles.notFoundText}>Nessuna dispensa trovata</Text>
          ) : (
            <FlatList
              data={visiblePantries}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={{ height: style.spacing.md }} />
              )}
              renderItem={({ item }) => (
                <Pressable style={styles.pantryCard} onPress={() => handleOpenDetail(item.id)}>
                  <Text style={styles.pantriesTitle}>{item.name}</Text>

                  <View style={styles.pantryInfo}>
                    <View style={styles.pantryInfoItem}>
                      <Feather name="box" size={16} color={style.colors.primary} />
                      <Text style={styles.pantryInfoText}>
                        {products[item.id].length || 0} prodotti
                      </Text>
                    </View>

                    <View style={styles.pantryInfoItem}>
                      <FontAwesome5 name="user-friends" size={16} color={style.colors.primary} />
                      <Text style={styles.pantryInfoText}>
                        {pantryMembersDetails[item.id].length} membri
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>

      </View>

      <View style={styles.joinContainer}>
        <View style={styles.joinHeader}>
          <FontAwesome5 name="user-friends" size={36} color={style.colors.primary} style={{ paddingHorizontal: style.spacing.xl }} />

          <View style={styles.joinHeaderText}>
            <Text style={styles.joinTitle}>Unisciti a una dispensa</Text>
            <Text style={styles.joinSubtitle}>Inserisci il codice di una dispensa esistente per accedere</Text>
          </View>
        </View>

        <View style={styles.joinForm}>
          <View style={styles.joinInputContainer}>
            <AntDesign name="link" size={18} color={style.colors.textSecondary} />

            <TextInput
              placeholder="Inserisci il codice d'invio..."
              value={joinCode}
              onChangeText={setJoinCode}
              style={styles.joinInput}
              placeholderTextColor={style.colors.textSecondary}
            />
          </View>

          <Pressable
            style={styles.joinButton}
            onPress={onJoinSubmit}
          >
            <Text style={styles.joinButtonText}>Invia</Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: style.colors.background,
    flex: 1
  },
  pantriesHeader: {
    height: 80,
    marginHorizontal: style.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  pantriesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  title: {
    fontSize: style.fontSize.title,
    fontWeight: style.fontWeight.bolder,
    color: style.colors.text,
  },
  addButton: {
    width: 45,
    height: 45,
    backgroundColor: style.colors.primary,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.circle,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: style.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  search: {
    height: style.controls.inputHeight,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.stats,
    marginHorizontal: style.spacing.md,
    paddingHorizontal: style.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,

    shadowColor: style.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  input: {
    height: "100%",
    fontSize: style.fontSize.md,
    color: style.colors.text,
    flex: 1,
  },
  pantriesContainer: {
  },
  pantriesContent: {
    flex: 1,
    padding: style.spacing.md,
  },
  pantryCard: {
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.stats,
    padding: style.spacing.md,

    shadowColor: style.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  pantriesTitle: {
    fontSize: style.fontSize.xl,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.text,
  },
  pantryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.lg,
    marginTop: style.spacing.sm,
  },
  pantryInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.xs,
  },
  pantryInfoText: {
    fontSize: style.fontSize.sm,
    color: style.colors.textSecondary,
  },
  notFoundText: {
    fontSize: style.fontSize.sm,
    textAlign: "center",
    color: style.colors.textSecondary,
    marginTop: style.spacing.lg,
  },
  joinContainer: {
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.stats,
    marginHorizontal: style.spacing.md,
    marginBottom: style.spacing.md,
    padding: style.spacing.md,
    gap: style.spacing.sm,
  },
  joinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: style.spacing.sm,
  },
  joinHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  joinTitle: {
    fontSize: style.fontSize.lg,
    fontWeight: style.fontWeight.bold,
    color: style.colors.text,
  },
  joinSubtitle: {
    fontSize: style.fontSize.sm,
    color: style.colors.textSecondary,
    flexShrink: 1,
  },
  joinForm: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  joinInputContainer: {
    height: style.controls.inputHeight,
    flex: 1,
    backgroundColor: style.colors.background,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.stats,
    paddingHorizontal: style.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  joinInput: {
    flex: 1,
    height: "100%",
    color: style.colors.text,
  },
  joinButton: {
    minHeight: style.controls.inputHeight,
    backgroundColor: style.colors.primary,
    paddingHorizontal: style.spacing.lg,
    borderRadius: style.radius.stats,
    justifyContent: "center",
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: style.fontSize.sm,
    color: style.colors.surface,
    fontWeight: style.fontWeight.semibold,

  },
});