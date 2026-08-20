import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { pantryProducts } from "../services/api"

const placeholder = require("../assets/placeholder.png");

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
type AccordionProps = {
    nomeDispensa: string;
    pantryId: number;
}

export default function Accordions({ nomeDispensa, pantryId }: AccordionProps) {


    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<dataPantryItems[]>([])

    async function loadProducts() {
        try {
            setLoading(true)
            const data = await pantryProducts(pantryId)
            setProducts(data)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen && products.length === 0) {
            loadProducts()
        }
    }, [isOpen])


    return (
        <>
            <View>
                <Pressable style={styles.toggle} onPress={() => setIsOpen(!isOpen)}>
                    <Text style={styles.titlePantry}>{nomeDispensa}</Text>
                    <Text>
                        {!isOpen ? "⬇️" : "⬆️"}
                    </Text>
                </Pressable>
            </View>
            {isOpen && (
                <View style={styles.accordionContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.item_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image
                                    source={
                                        item.image_url
                                            ? { uri: item.image_url }
                                            : placeholder
                                    }
                                    style={styles.image}
                                />
                                <Text style={styles.info}>{item.name}</Text>
                                <Text style={styles.info}>{item.quantity}</Text>
                                <Text style={styles.info}>{item.expiration_date}</Text>

                                <View style={styles.actions}>
                                    <Text>✏️{/* modale modifica */}</Text>
                                    <Text>🗑️{/* modale elimina */}</Text>
                                </View>

                            </View>
                        )}
                    />
                </View>
            )}
        </>
    )
}


const styles = StyleSheet.create({
    toggle: {
        flexDirection: "row",
        alignItems: "center"
    },
    accordionContainer: {
        marginTop: 20
    },
    titlePantry: {

    },
    card: {
        width: 100,
        height: 100,
        flexDirection: "row",
    },
    image: {
        width: 80,
        height: 80
    },
    info: {
        margin: 4
    },
    actions: {
        flexDirection: "row",
        alignItems: "center"
    }
})