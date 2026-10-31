import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
} from "react-native"

import { style } from "../styles/generics";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { usePantry } from "../contexts/pantryContext"

export default function PantryForms() {
    const { createPantry, handleJoinPantry } = usePantry()

    const [newPantry, setNewPantry] = useState("");
    const [joinCode, setJoinCode] = useState("");

    // crea nuova dispensa
    const handleCreatePantry = async () => {
        const pantryName = newPantry.trim()

        if (pantryName.length < 3) {
            Alert.alert("Nome dispensa non valido")
            return;
        }

        try {
            await createPantry(pantryName)
            setNewPantry("")
        } catch {
            Alert.alert(
                "Errore",
                "Impossibile creare la dispensa. Riprova.",
            )
        }
    }

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

    const [isOpen, setIsOpen] = useState(false);

    // toggle per la tendina
    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <View style={styles.container}>
            {/* Intestazione */}
            <Pressable
                style={styles.header}
                onPress={toggleOpen}
                accessibilityState={{ expanded: isOpen }}>

                <View style={styles.headerLeft}>
                    <FontAwesome5 name="users" size={20} color={style.colors.primary} />

                    <Text style={styles.title}>Gestione dispense</Text>
                </View>

                <MaterialIcons
                    name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={26}
                    color={style.colors.textSecondary}
                    style={{ marginTop: 2 }}
                />
            </Pressable>

            {isOpen && (
                <>
                    <View style={styles.separator} />

                    <View style={styles.formsWrapper}>

                        <View style={styles.form}>
                            {/* crea nuova dispensa */}
                            <Text style={styles.label}>Aggiungi una nuova dispensa</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Inserisci il nome della dispensa"
                                    value={newPantry}
                                    onChangeText={setNewPantry}
                                    style={styles.input}
                                    placeholderTextColor={style.colors.textSecondary}
                                />

                                <Pressable style={styles.button} onPress={handleCreatePantry}>
                                    <Text style={styles.textButton}>Aggiungi</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* entra in una dispensa */}
                        <View style={styles.form}>
                            <Text style={styles.label}>Entra in una dispensa già esistente</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="inserisci codice d'invito"
                                    value={joinCode}
                                    onChangeText={setJoinCode}
                                    style={styles.input}
                                    placeholderTextColor={style.colors.textSecondary}
                                />

                                <Pressable style={styles.button} onPress={onJoinSubmit}>
                                    <Text style={styles.textButton}>Unisciti</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </>
            )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: style.colors.surface,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.stats,
        marginHorizontal: style.spacing.md,
        marginVertical: style.spacing.md,
    },
    header: {
        height: 60,
        paddingHorizontal: style.spacing.lg,
        paddingVertical: style.spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: style.spacing.sm,
        flex: 1,
    },
    separator: {
        height: 2,
        borderTopColor: style.colors.bgInput,
        marginHorizontal: style.spacing.md
    },
    formsWrapper: {
        paddingTop: style.spacing.xs,
        paddingBottom: style.spacing.lg,
        paddingHorizontal: style.spacing.md,
        gap: style.spacing.md,
    },
    title: {
        fontSize: style.fontSize.lg,
        fontWeight: "600",
        color: style.colors.text,
    },
    form: {
        gap: style.spacing.sm,
    },
    label: {
        fontSize: style.fontSize.sm,
        color: style.colors.text,
        marginTop: style.spacing.sm,
        marginStart: style.spacing.xs,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: style.spacing.sm,
    },
    input: {
        height: style.controls.inputHeight,
        backgroundColor: style.colors.bgInput,
        color: style.colors.text,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.card,
        paddingVertical: style.spacing.sm,
        paddingHorizontal: style.spacing.md,
        flex: 1,
    },
    button: {
        height: style.controls.buttonHeight,
        backgroundColor: style.colors.primary,
        paddingVertical: style.spacing.sm,
        paddingHorizontal: style.spacing.lg,
        borderRadius: style.radius.card,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        fontSize: style.fontSize.sm,
        color: style.colors.surface,
        fontWeight: "600"
    },

})