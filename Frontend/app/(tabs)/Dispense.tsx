import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from "react-native"
import Accordions from "../../components/Accordions"
import { allPantries, createNewPantry } from "../../services/api"
import { useEffect, useState } from "react"
import Filters from "../../components/FIlters"

export default function Dispense() {

    type dataPantries = {
        "id": number,
        "name": string,
        "invite_code": string,
        "created_at": string,
        "role": string,
        "status": string,
    }

    const [loading, setLoading] = useState(false)
    const [pantries, setPantries] = useState<dataPantries[]>([])

    const [newPantry, setNewPantry] = useState("")


    // CREAZIONE NUOVA DISPENSA
    const createPantry = async () => {
        if (newPantry.trim().length < 3) {
            return Alert.alert("Nome dispensa non valido")
        }

        try {
            const dataNewPantry = await createNewPantry(newPantry.trim())
            if (dataNewPantry && dataNewPantry.id) {
                setPantries((prev) => [...prev, dataNewPantry])
            } else {
                await loadPantries()
            }
        }
        catch (err: unknown) {
            Alert.alert("Impossibile creare la dispensa")
        }
        finally {
            setNewPantry("")
        }
    }

    // RECUPERA TUTTE LE DISPENSE
    async function loadPantries() {
        try {
            setLoading(true)
            const data = await allPantries()
            setPantries(data)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPantries()
    }, [])


    return (
        <>
            <View>

                <View>
                    <TextInput
                        placeholder="Aggiungi una nuova dispensa"
                        value={newPantry}
                        onChangeText={setNewPantry}
                    />

                    <Pressable onPress={createPantry}>
                        <Text>Aggiungi</Text>
                    </Pressable>
                </View>

                <Filters />

                <View style={styles.pantriesContainer}>

                    <FlatList
                        data={pantries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Accordions
                                nomeDispensa={item.name}
                                pantryId={item.id}
                            />
                        )}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pantriesContainer: {
        height: 400
    }
})