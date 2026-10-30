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
            {isOpen && (
                <View style={styles.formsWrapper}>
                    <Text style={styles.title}>Gestione dispense</Text>

                    <View style={styles.form}>
                        {/* crea nuova dispensa */}
                        <Text style={styles.label}>Aggiungi una nuova dispensa</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Inserisci il nome della dispensa"
                                value={newPantry}
                                onChangeText={setNewPantry}
                                style={styles.input}
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
                            />

                            <Pressable style={styles.button} onPress={onJoinSubmit}>
                                <Text style={styles.textButton}>Unisciti</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )
            }
            {/* bottone per aprire/chiudere la tendina */}
            <Pressable style={styles.toggleButton} onPress={toggleOpen}>
                <MaterialIcons
                    name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                    color={style.colors.surface}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: style.spacing.md,
    },
    formsWrapper: {
        backgroundColor: style.colors.surface,
        borderWidth: 2,
        borderTopWidth: 0,
        borderBottomLeftRadius: style.radius.stats,
        borderBottomRightRadius: style.radius.stats,
        borderColor: style.colors.primary,
        paddingTop: 0,
        paddingBottom: style.spacing.lg,
        paddingHorizontal: style.spacing.md,
        gap: style.spacing.md,
    },
    title: {
        fontSize: style.fontSize.lg,
        fontWeight: "600",
        textAlign: "center",
        color: style.colors.text,
        marginTop: style.spacing.md
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
    toggleButton: {
        backgroundColor: style.colors.primary,
        padding: style.spacing.sm,
        borderBottomRightRadius: style.radius.modal,
        borderBottomLeftRadius: style.radius.modal,
        alignSelf: "center",
    }
})