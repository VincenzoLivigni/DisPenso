import { View, Text, StyleSheet } from "react-native"

export default function IA_Recipe() {

    return (
        <>
            <View style={styles.containerSectionIA}>
                <Text style={styles.content}>Ricette con l'IA</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerSectionIA: {
        height: 80,
        backgroundColor: "white",
        marginHorizontal: 15,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        fontWeight: 600,
    }
})