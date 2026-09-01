import { allExpiringProducts } from "../services/api"
import { useEffect, useState } from "react"
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Image
} from "react-native";
import { useRouter } from "expo-router";
import { expirationBadge } from "../services/utils";

const placeholder = require("../assets/placeholder.png");

type product = {
    id: string | number;
    name: string;
    image_url: string | null;
    quantity: number;
    expiration_date: string;
    pantry: {
        id: string | number;
        name: string;
    }
}

export default function Carosello() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<product[]>([]);

    async function loadExpiring() {
        try {
            setLoading(true)
            const data = await allExpiringProducts()

            // prodotti nel carosello ordinati per scadenza
            const sortedData = data.sort((a: product, b: product) => {
                return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime();
            })

            setProducts(sortedData)
        }
        catch (err) {
            console.log(err, 'errore nel recupero delle scadenze');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadExpiring()
    }, []);

    return (
        <View style={styles.carosello}>
            <FlatList
                horizontal
                data={products}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={true}
                renderItem={({ item }) => {

                    const badge = expirationBadge(item.expiration_date);


                    return (
                        <View style={styles.card}>
                            <Pressable
                                style={styles.cardContent}
                                onPress={() => router.push("/Dispense")}
                            >
                                <Image source={item.image_url ? { uri: item.image_url } : placeholder}
                                    style={styles.image}
                                    resizeMode="cover"
                                />

                                <View style={styles.cardRight}>
                                    <Text numberOfLines={1} style={styles.title}>{item.name}</Text>

                                    <Text style={styles.info}>{item.quantity} pz</Text>

                                    <View style={[styles.badge, {
                                        backgroundColor: badge.bg,
                                        borderLeftColor: badge.border,
                                        borderRightColor: badge.border
                                    }]}>
                                        <Text style={[styles.badgeText, { color: badge.color }]}>
                                            {badge.text}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    carosello: {
        margin: 14,
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
        width: 61,
        height: 61,
        backgroundColor: "#f3f3f3",
        borderRadius: 8,
    },
    cardRight: {
        marginLeft: 8,
        gap: 2,
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 12,
        fontWeight: 600,
        color: "#3baecb",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    info: {
        fontSize: 11,
        color: "#6e6e6e",
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: "flex-start",
        borderLeftWidth: 2,
        borderRightWidth: 2,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
    },
});