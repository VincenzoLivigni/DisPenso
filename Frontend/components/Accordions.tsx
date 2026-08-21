import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { pantryProducts } from "../services/api"

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

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
    search: string
}

export default function Accordions({ nomeDispensa, pantryId, search }: AccordionProps) {


    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<dataPantryItems[]>([])

    const cleanSearch = search.toLowerCase().trim()//la nostra ricerca

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
        if ((isOpen || cleanSearch !== "")&& products.length === 0) {
            loadProducts()
        }
    }, [isOpen, cleanSearch])

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(cleanSearch))
    
    const productMatch = filteredProducts.length > 0

    
    const autoOpen = isOpen || (cleanSearch !== '' && productMatch)
    
    return (

        cleanSearch !== '' && !productMatch ? (
     <Text>Nessun prodotto trovato con questo nome</Text>
    ) : (

        <View style={styles.container}>

            <Pressable style={styles.toggle} onPress={() => setIsOpen(!isOpen)}>
                <Text style={styles.titlePantry}>{nomeDispensa}</Text>
                {
                    !autoOpen ? (
                        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6e6e6e" />
                    ) : (
                        <MaterialIcons name="keyboard-arrow-up" size={20} color="#6e6e6e" />
                    )}
            </Pressable>


            {autoOpen && (
                <View style={styles.accordionContainer}>
                    {
                        filteredProducts.map((p) => (
                            <View key={p.item_id} style={styles.card}>
                                <Image
                                    source={
                                        p.image_url
                                            ? { uri: p.image_url }
                                            : placeholder
                                    }
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.productName}>{p.name}</Text>
                                    <Text style={styles.info}>{p.quantity}</Text>
                                    <Text style={styles.info}>{p.expiration_date}</Text>
                                </View>

                                <View style={styles.actions}>
                                    <Octicons name="pencil" size={20} color="black" />{/* modale modifica */}
                                    <MaterialIcons name="delete" size={22} color="black" />{/* modale elimina */}
                                </View>

                            </View>
                        ))}
                </View>
            )}
        </View>
    ))
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 8,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#6e6e6e",
        overflow: "hidden"
    },
    toggle: {
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    titlePantry: {
        fontWeight: "600"
    },
    accordionContainer: {
        gap: 8,
        marginTop: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 2,
        borderTopColor: "#ccc"
    },
    card: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#6e6e6e",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",

    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 10
    },
    productName: {
        fontWeight: "600",
    },
    info: {

    },
    actions: {
        flexDirection: "row",
        gap: 10
    },
})