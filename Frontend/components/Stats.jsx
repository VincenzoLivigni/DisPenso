import { View, Text, StyleSheet } from "react-native"
import { usePantry } from "../contexts/pantryContext";
import { expirationBadge } from "../services/utils"

export default function Stats() {
    const { pantries, products } = usePantry();

    // totale dispense
    const totalPantries = pantries.length

    // totale prodotti 
    const totalProducts = Object.values(products)
        .reduce((total, pantryProductsList) => total + pantryProductsList.length, 0)

    // totale prodotti in scadenza
    const totalExpiringProducts = Object.values(products).flat().filter((p) => {
        return expirationBadge(p.expiration_date).color === "#ff4800";
    }).length;

    return (
        <>
            <View style={styles.statsContainer}>

                <View style={styles.stats}>
                    <Text>Totale dispense:
                        <Text style={styles.numbersStats}> {totalPantries}</Text>
                    </Text>
                </View>

                <View style={styles.stats}>
                    <Text style={styles.title}>Totale prodotti:
                        <Text style={styles.numbersStats}> {totalProducts}</Text>
                    </Text>
                </View>

                <View style={styles.stats}>
                    <Text style={styles.title}>In scadenza:
                        <Text style={styles.numbersStats}> {totalExpiringProducts}</Text>
                    </Text>
                </View>

                <View style={styles.stats}>
                    <Text>???: </Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    statsContainer: {
        margin: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 25,
    },
    stats: {
        width: 160,
        height: 160,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {

    },
    numbersStats: {
        fontWeight: 600
    }
})