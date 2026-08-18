import { allExpiringProducts } from "../services/api"
import { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image
} from "react-native";



type product = {
    id: string | number;
    name: string;
    image_url: string | null;
}

export default function Carosello() {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<product[]>([])

    type dataExpiring = {
        "id": String,
        "name": String,
        "brand": String | null,
        "image_url": String | null,
        "quantity": Number,
        "expiration_date": String,
        "daysLeft": Number,
        "pantry": {
            "id": String,
            "name": String
        }
    }

    async function loadExpiring() {
        try {
            setLoading(true)
            const data = await allExpiringProducts()
            setProducts(data)

        }
        catch (err) {
            console.log(err, 'errore nel recupero delle scadenze');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        allExpiringProducts().then(setProducts).catch(console.log);
    }, []);

    return (
        <FlatList
            horizontal
            data={products}
            keyExtractor={(item) => item.id.toString()}
            style={styles.carosello}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: item.image_url || "" }} style={styles.image} />

                    <View style={styles.cardRight}>
                        <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    carosello: {
        margin: 15
    },
    card: {
        width: 150,
        backgroundColor: "white",
        marginRight: 10,
        padding: 8,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 50,
        height: 50,
        backgroundColor: "#f3f3f3",
        marginBottom: 5,
        borderRadius: 8,
    },
    cardRight: {
        marginLeft: 8,
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 12,
        fontWeight: 600,
        color: "#3baecb",
        textAlign: "center",
    },
});