import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from "react-native"
import Accordions from "../../components/Accordions"
import { allPantries, createNewPantry, pantryProducts } from "../../services/api"
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

    type dataPantryItems = {
        "item_id": number,
        "quantity": number,
        "expiration_date": string,
        "added_at": string,
        "product_id": number,
        "barcode": string,
        "name": string,
        "brand": string | null,
        "image_url": string | null,
        "category": string | null
    }

    const [loading, setLoading] = useState(false)
    const [pantries, setPantries] = useState<dataPantries[]>([])
    const [products, setProducts] = useState<{ [pantryId: number]: dataPantryItems[] }>({})

    const [newPantry, setNewPantry] = useState("")
    const [searchPantry, setSearchPantry] = useState("")

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

    // RECUPERA TUTTE LE DISPENSE E TUTTI I PRODOTTI
    async function loadPantries() {
        try {
            setLoading(true)
            const data: dataPantries[] = await allPantries()
            setPantries(data)

            const productsMap: { [key: number]: dataPantryItems[] } = {}
            await Promise.all(
                data.map(async (pantry) => {
                    try {
                        const prods = await pantryProducts(pantry.id)
                        productsMap[pantry.id] = prods || []
                    } catch (err) {
                        productsMap[pantry.id] = []
                    }
                })
            )
            setProducts(productsMap)
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

    const cleanSearch = searchPantry.toLowerCase().trim()

    // Filtriamo i prodotti per ogni dispensa
    const filteredProductsForPantry = (pantryId: number) => {
        const prods = products[pantryId] || []
        if (!cleanSearch) return prods
        return prods.filter((p) => p.name.toLowerCase().includes(cleanSearch))
    }

    // Filtriamo le dispense: teniamo quelle che hanno prodotti che matchano
    const visiblePantries = pantries.filter(pantry => {
        if (!cleanSearch) return true;
        const matchesPantryName = pantry.name.toLowerCase().includes(cleanSearch);
        const matchesProducts = filteredProductsForPantry(pantry.id).length > 0;
        return matchesPantryName || matchesProducts;
    });

    // Se stiamo cercando ma visiblePantries è vuoto, non c'è nulla da mostrare in assoluto
    const isSearchEmpty = cleanSearch !== "" && visiblePantries.length === 0;

    return (
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

            {/* SEARCH BAR PER FILTRARE */}
            <Filters
                search={searchPantry}
                onChangeSearch={setSearchPantry}
            />

            {/* ACCORDION CHE VIENE STAMPATO */}
            <View style={styles.pantriesContainer}>
                {isSearchEmpty ? (
                    <Text style={styles.notFoundText}>Nessun prodotto trovato con questo nome</Text>
                ) : (
                    <FlatList
                        data={visiblePantries} 
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const pantryProds = filteredProductsForPantry(item.id)

                            return (
                                <Accordions
                                    nomeDispensa={item.name}
                                    products={pantryProds}
                                    pantryId={item.id}
                                    search={searchPantry}
                                />
                            )
                        }}
                    />
                )}
            </View>
        </View>
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
    notFoundText: {
        textAlign: "center",
        marginTop: 20,
        color: "#6e6e6e"
    }
})