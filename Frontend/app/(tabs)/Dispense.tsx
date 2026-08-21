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

    const [searchPantry, setSearchPantry] = useState("")//filtro per cercare le dispense per nome


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

    const filteredPantries = pantries.filter(p => p.name.toLowerCase().includes(searchPantry.toLowerCase().trim()))



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
            <View style={styles.mainContainer}>

                <View style={styles.createdContainer}>
                    <TextInput
                        placeholder="Aggiungi una nuova dispensa"
                        value={newPantry}
                        onChangeText={setNewPantry}
                        style={styles.input}
                    />

                    <Pressable style={styles.button} onPress={createPantry}>
                        <Text style={styles.textButton}>Aggiungi</Text>
                    </Pressable>
                </View>

                {/* //SEARCH BAR PER FILTRARE*/}


                <Filters
                search = {searchPantry}
                onChangeSearch = {setSearchPantry}
                />

                {/* ACCORDION CHE VIENE STAMPATO */}
                <View style={styles.pantriesContainer}>

                    <FlatList
                        data={pantries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Accordions
                                nomeDispensa={item.name}
                                pantryId={item.id}
                                search= {searchPantry}
                            />
                        )}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ccc",
    },
    createdContainer: {
        marginHorizontal: 13,
        marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#6e6e6e",
        borderRadius: 10
    },
    button: {
        backgroundColor: "#3baecb",
        borderWidth: 1,
        borderColor: "#6e6e6e",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        color: "white",
        fontWeight: "600"
    },


    pantriesContainer: {
        flex: 1,
        marginHorizontal: 13,
        marginVertical: 15,
    },
})