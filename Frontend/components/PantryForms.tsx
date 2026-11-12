// compnenti React Native
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native"

// hooks 
import { useState } from "react";

// stili
import { style } from "../styles/generics";

// tipi 
import { usePantry } from "../contexts/pantryContext"

type PantryFormsProps = {
    isOpen: boolean
    onClose: () => void
}

export default function PantryForms({ isOpen, onClose }: PantryFormsProps) {
    const { createPantry } = usePantry()

    const [newPantry, setNewPantry] = useState("");
    // const [joinCode, setJoinCode] = useState("");

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
            onClose()
        } catch {
            Alert.alert(
                "Errore",
                "Impossibile creare la dispensa. Riprova.",
            )
        }
    }

    if (!isOpen) return null

    return (
        <View style={styles.container}>

            <Text style={styles.label}>Nome della nuova dispensa</Text>

            <View style={styles.form}>
                <TextInput
                    placeholder="Inserisci il nome della dispensa..."
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

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: style.colors.surface,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.stats,
        marginHorizontal: style.spacing.md,
        marginBottom: style.spacing.md,
        padding: style.spacing.md,
        gap: style.spacing.sm,
    },
    form: {
        flexDirection: "row",
        alignItems: "center",
        gap: style.spacing.sm,

    },
    label: {
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.semibold,
        color: style.colors.text,
        paddingHorizontal: style.spacing.xs,
    },
    input: {
        height: style.controls.inputHeight,
        backgroundColor: style.colors.background,
        color: style.colors.text,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.stats,
        paddingHorizontal: style.spacing.md,
        flex: 1,
    },
    button: {
        minHeight: style.controls.inputHeight,
        backgroundColor: style.colors.primary,
        paddingHorizontal: style.spacing.lg,
        borderRadius: style.radius.stats,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        fontSize: style.fontSize.sm,
        color: style.colors.surface,
        fontWeight: style.fontWeight.semibold,
    },

})