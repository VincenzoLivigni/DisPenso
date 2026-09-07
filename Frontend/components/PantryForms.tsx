import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
} from "react-native"

import { usePantry } from "../contexts/pantryContext"

export default function PantryForms() {
    const { createPantry, handleJoinPantry } = usePantry()

    const [newPantry, setNewPantry] = useState("");
    const [joinCode, setJoinCode] = useState("");

    // crea nuova dispensa
    const handleCreatePantry = async () => {
        if (newPantry.trim().length < 3) {
            return Alert.alert("Nome dipensa non valido");
        }
        await createPantry(newPantry.trim());
        setNewPantry("");
    };

    // aggiungi membro a dispensa
    const onJoinSubmit = async () => {
        if (!joinCode) return
        await handleJoinPantry(joinCode)
        setJoinCode("")
    }

    const [isOpen, setIsOpen] = useState(false);

    // toggle per la tendina
    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <View style={styles.container}>
            {isOpen && (
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
            <Pressable style={[styles.toggleButton, !isOpen && styles.toggleButtonClosed]} onPress={toggleOpen}>
                <Text style={styles.toggleButtonText}>Gestione dispensa</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
    },
    formsWrapper: {
        backgroundColor: "#cdcdcd",
        paddingTop: 0,
        paddingBottom: 14,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: "#3baecb",
        gap: 10,
    },
    form: {
        gap: 8
    },
    label: {
        marginStart: 4,
        marginTop: 10
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        borderWidth: 1,
        borderColor: "#6e6e6e",
        borderRadius: 10,
        flex: 1,
    },
    button: {
        backgroundColor: "#3baecb",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        fontWeight: 600,
        color: "white",
    },
    toggleButton: {
        backgroundColor: "#3baecb",
        padding: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        alignSelf: "center",
    },
    toggleButtonClosed: {
    },
    toggleButtonText: {
        fontSize: 15,
        fontWeight: 600,
        color: "white",
    },
})