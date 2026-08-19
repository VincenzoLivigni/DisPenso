import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { pantryProducts } from "../services/api"

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
    pantryId: number;}

export default function Accordions({ nomeDispensa, pantryId }: AccordionProps) {


    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<dataPantryItems[]>([])

    async function loadProducts() {
        try {
            setLoading(true)
            const data = await pantryProducts()
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
        loadProducts()
    }, [])


    return (
        <>

            <Pressable onPress={()=> setIsOpen(!isOpen)}>
            <Text>{nomeDispensa}</Text>
            </Pressable>
            {isOpen && (
                <View style={styles.accordionContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.product_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: item.image_url }}
                                    style={styles.image}
                                />
                            </View>
                        )}
                    />
                </View>
            )}
        </>
    )
}


const styles = StyleSheet.create({
    accordionContainer: {
        height: 400
    },
    card: {
        width: 100,
        height: 100
    },
    image: {
        width: 80,
        height: 80
    }
})