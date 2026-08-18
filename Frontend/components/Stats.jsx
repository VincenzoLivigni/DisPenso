import { View, Text, StyleSheet } from "react-native"

export default function Stats() {

    return (
        <>
            <View style={styles.statsContainer}>

                <View style={styles.stats}>
                    <Text>Totale dispense: </Text>
                </View>

                <View style={styles.stats}>
                    <Text style={styles.title}>Totale prodotti: </Text>
                </View>

                <View style={styles.stats}>
                    <Text>Prodotti in scadenza: </Text>
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

    }
})