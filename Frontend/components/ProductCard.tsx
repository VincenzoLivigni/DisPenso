// compnenti React Native
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

// stili
import { style } from "../styles/generics";
const placeholder = require("../assets/placeholder.png");

// icone
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from '@expo/vector-icons/Ionicons';

// utils
import { expirationBadge } from "../services/utils";

// tipi
import type { DataPantryItems } from "../contexts/pantryContext";

type ProductCardProps = {
    product: DataPantryItems;
    onPress: () => void;
    onPressMenu: () => void;
}

export default function ProductCard({
    product,
    onPress,
    onPressMenu,
}: ProductCardProps) {

    const badge = expirationBadge(product.expiration_date);

    return (
        <View style={styles.card}>
            {/* Immagine prodotto */}
            <Image
                source={product.image_url ? { uri: product.image_url } : placeholder}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.infoContainer}>
                <Pressable onPress={onPress}>
                    <Text style={styles.productName}>{product.name}</Text>
                </Pressable>

                <Text style={styles.productQuantity}>{product.quantity} pz</Text>


                <Text style={[styles.badgeText, { color: badge.color }]}>
                    <Ionicons name="calendar-outline" size={16} color={badge.color} /> {badge.text}
                </Text>
            </View>

            {/* Menu azioni prodotto */}
            <Pressable onPress={onPressMenu} style={styles.buttonMenu}>
                <Entypo name="dots-three-vertical" size={18} color={style.colors.textSecondary} />
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        minHeight: 85,
        backgroundColor: style.colors.surface,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.stats,
        padding: style.spacing.sm,
        flexDirection: "row",
        alignItems: "center",

        shadowColor: style.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    image: {
        width: 65,
        height: 65,
        backgroundColor: "#f0e5d7",
        borderRadius: style.radius.card,
    },
    infoContainer: {
        marginHorizontal: style.spacing.md,
        flex: 1,
        gap: style.spacing.xs,
    },
    productName: {
        fontSize: style.fontSize.sm,
        fontWeight: style.fontWeight.semibold,
        color: style.colors.text,
    },
    productQuantity: {
        fontSize: style.fontSize.sm,
        fontWeight: style.fontWeight.semibold,
        color: style.colors.textSecondary,
    },
    badgeText: {
        fontSize: style.fontSize.sm,
        fontWeight: style.fontWeight.semibold,
    },
    buttonMenu: {
        width: 32,
        height: 32,
        backgroundColor: style.colors.background,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.circle,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-start",

        shadowColor: style.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
});