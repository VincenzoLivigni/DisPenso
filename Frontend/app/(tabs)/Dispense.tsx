import { View, Text, StyleSheet, FlatList } from "react-native"
import Accordions from "../../components/Accordions"
import { allPantries } from "../../services/api"
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

                <Filters></Filters>

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