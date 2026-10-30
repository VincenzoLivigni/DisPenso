import { View, Text, StyleSheet } from "react-native"

import { style } from "../styles/generics";

import ProgressBar from "../components/ProgressBar";

import { usePantry } from "../contexts/pantryContext";
import { useToken } from "../contexts/tokenContext";
import { useFavorites } from "../contexts/favoritesContext";

import { expirationBadge } from "../services/utils"

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Stats() {
    // STATS
    const { pantries, products } = usePantry();
    const { favorites } = useFavorites();

    // totale dispense
    const totalPantries = pantries.length

    // totale prodotti 
    const totalProducts = Object.values(products)
        .reduce((total, pantryProductsList) => total + pantryProductsList.length, 0)

    // totale prodotti in scadenza
    const totalExpiringProducts = Object.values(products).flat().filter((p) => {
        return expirationBadge(p.expiration_date).color === "#ff4800";
    }).length;

    // ricette preferte
    const totalFavorites = favorites.length;


    // PROGRESS BAR
    const { token, carToken } = useToken();

    // limiti
    const tokenMax = 50;
    const carMax = 5000;

    // percentuali utilizzo delle API
    const percetualeToken = Math.round((token / tokenMax) * 100);
    const traduzionePercentuale = Math.round((carToken / carMax) * 100);

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Un riepilogo delle tue scorte</Text>

            <View style={styles.statsContainer}>

                {/* dispense */}
                <View style={[styles.card, { backgroundColor: "#3baecb25" }]}>
                    <View style={styles.cardContent}>
                        <Feather name="box" size={34} color={style.colors.primary} />
                        <Text style={styles.statsTitle}>Dispense</Text>
                    </View>
                    <Text style={styles.statsNumber}>{totalPantries}</Text>
                </View>

                {/* prodotti */}
                <View style={[styles.card, { backgroundColor: "#63be3f25" }]}>
                    <View style={styles.cardContent}>
                        <MaterialCommunityIcons name="food-variant" size={34} color={style.colors.green} />
                        <Text style={styles.statsTitle}>Prodotti</Text>
                    </View>
                    <Text style={styles.statsNumber}>{totalProducts}</Text>
                </View>

                {/* prodotti in scadenza */}
                <View style={[styles.card, { backgroundColor: "#cb3b3b25" }]}>
                    <View style={styles.cardContent}>
                        <AntDesign name="warning" size={34} color={style.colors.error} />
                        <Text style={styles.statsTitle}>In scadenza</Text>
                    </View>
                    <Text style={styles.statsNumber}>{totalExpiringProducts}</Text>
                </View>

                {/* ricette preferite */}
                <View style={[styles.card, { backgroundColor: "#cbba3b25" }]}>
                    <View style={styles.cardContent}>
                        <Feather name="star" size={34} color={style.colors.warning} />
                        <Text style={styles.statsTitle}>Ricette preferite</Text>
                    </View>
                    <Text style={styles.statsNumber}>{totalFavorites}</Text>
                </View>
            </View>

            {/* progressbar */}
            <Text style={styles.title}>Monitoraggio API</Text>

            <View style={styles.section}>
                <View style={styles.progressBarContainer}>

                    {/* spoonacular progressBar */}
                    <View style={styles.progressBarItem}>
                        <Text style={styles.apiLabel}>Spoonacular</Text>

                        <ProgressBar value={percetualeToken} size={100} />
                    </View>

                    {/* traduzioni progressBar */}
                    <View style={styles.progressBarItem}>
                        <Text style={styles.apiLabel}>Traduzioni</Text>

                        <ProgressBar value={traduzionePercentuale} size={100} />
                    </View>

                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        marginTop: style.spacing.md,
        marginHorizontal: style.spacing.lg,
    },
    title: {
        fontSize: style.fontSize.xl,
        fontWeight: "600",
        color: style.colors.text,
        marginBottom: style.spacing.md,
    },
    statsContainer: {
        marginBottom: style.spacing.xl,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "stretch",
        gap: style.spacing.xs,
    },
    card: {
        minWidth: 140,
        maxWidth: 260,
        minHeight: 150,
        backgroundColor: style.colors.surface,
        padding: style.spacing.lg,
        borderRadius: style.radius.stats,
        justifyContent: "space-evenly",
        flexBasis: "45%",
        flexGrow: 1,
        flexShrink: 1,
    },
    cardContent: {
        flexDirection: "column",
        alignItems: "center",
        gap: style.spacing.sm,
    },
    statsTitle: {
        fontSize: style.fontSize.md,
        fontWeight: "600",
        color: style.colors.text,
        flexShrink: 1,
    },
    statsNumber: {
        fontSize: style.fontSize.xl,
        fontWeight: "600",
        textAlign: "center",
        color: style.colors.text,
    },


    section: {
        backgroundColor: style.colors.surface,
        marginBottom: style.spacing.md,
        padding: style.spacing.lg,
        borderRadius: style.radius.stats,
        shadowColor: style.colors.text,
        shadowOpacity: 0.05,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: style.fontSize.md,
        fontWeight: "600",
        color: style.colors.text,
        marginBottom: style.spacing.md,
    },
    apiLabel: {
        fontSize: style.fontSize.md,
        fontWeight: "600",
        color: style.colors.text,
        marginBottom: style.spacing.xs,
    },
    progressBarContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    progressBarItem: {
        flex: 1,
        alignItems: "center",
        gap: 10,
    },
})