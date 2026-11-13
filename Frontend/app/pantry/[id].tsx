// compnenti React Native
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

// navigazione app
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

// hooks
import { useState } from "react";

// componenti app
import Filters from "../../components/FIlters";
import ProductCard from "../../components/ProductCard";
import EditProductModal from "../../components/EditProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";
import PantryMembersModal from "../../components/PantryMembersModal";
import ProductActionsModal from "../../components/ProductActionsModal";

// stili
import { style } from "../../styles/generics";

// icone
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

// tipi
import { usePantry } from "../../contexts/pantryContext";
import type { DataPantryItems } from "../../contexts/pantryContext";

export type SortOption = "none" | "name-asc" | "name-desc" | "qty-asc" | "qty-desc";

export default function DettaglioDispensa() {
    // estraggo l'ID dall'URL della rotta
    const { id } = useLocalSearchParams<{ id: string }>()
    const paramsId = Number(id)

    const { pantries, products, pantryMembersDetails, handleUpdateProduct, handleDeleteProduct } = usePantry()
    const router = useRouter()

    // recupero dispensa selezionata
    const actualPantry = pantries.find((p) => p.id === paramsId)

    // recupero prodotti usando l'ID della dispensa selezionata
    const actualProducts = products?.[paramsId] ?? []
    // verifico che i prodotti recuuperati siano contenuti in un array
    const pantryProducts = Array.isArray(actualProducts) ? actualProducts : []
    const countProducts = pantryProducts.length

    // recupero membri aggiunti alla dispensa selezionata
    const actualMembers = pantryMembersDetails?.[paramsId] ?? []
    // recupero numero dei membri che fanno effettivamente parte della dispensa
    const countMembers = actualMembers.filter((m) => m.status === "accepted").length

    // rotta per dettaglio prdototto
    const handleOpenDetail = (itemId: number) => {
        router.push(`/product/${itemId}?pantryId=${paramsId}`);
    };

    // FILTRI
    const [searchProduct, setSearchProduct] = useState("");
    const [sortName, setSortName] = useState<"none" | "name-asc" | "name-desc">("none");
    const [sortQuantity, setSortQuantity] = useState<"none" | "qty-asc" | "qty-desc">("none");

    const cleanSearch = searchProduct.toLowerCase().trim();

    const filteredProducts = pantryProducts.filter((p) => p.name.toLocaleLowerCase().includes(cleanSearch))

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let primaryComparison = 0;

        if (sortQuantity === "qty-desc") {
            primaryComparison = b.quantity - a.quantity;
        } else if (sortQuantity === "qty-asc") {
            primaryComparison = a.quantity - b.quantity;
        }

        if (primaryComparison !== 0) {
            return primaryComparison;
        }

        if (sortName === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortName === "name-desc") {
            return b.name.localeCompare(a.name);
        }

        return 0;
    })

    // MODALI
    // stati per menu delle azioni del prodotto
    const [selectedProductForMenu, setSelectedProductForMenu] = useState<DataPantryItems | null>(null);
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    // menu delle azioni del prodotto.
    const handleOpenMenu = (itemId: number) => {
        const product = pantryProducts.find(
            (p) => p.item_id === itemId
        );

        if (product) {
            setSelectedProductForMenu(product);
            setIsOpenMenu(true);
        }
    };

    // stati modifica prodotto
    const [selectedProduct, setSelectedProduct] = useState<DataPantryItems | null>(null);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    // salvataggio modifiche
    const handleSave = async (
        newQuantity: number,
        newExpiration: string
    ): Promise<void> => {
        if (!selectedProduct) return;

        await handleUpdateProduct(
            paramsId,
            selectedProduct.item_id,
            newQuantity,
            newExpiration
        );

        setIsOpenEditModal(false);
        setSelectedProduct(null);
    };

    // stati elimina prodotto
    const [selectedProductToDelete, setSelectedProductToDelete] = useState<DataPantryItems | null>(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    // conferma eliminazione
    const handleConfirmDelete = async (): Promise<void> => {
        if (!selectedProductToDelete) return;

        await handleDeleteProduct(
            paramsId,
            selectedProductToDelete.item_id
        );

        setIsOpenDeleteModal(false);
        setSelectedProductToDelete(null);
    };

    //stati per la modale gestione membri
    const [isOpenManageMemberModal, setIsOpenManageMemberModals] = useState(false)

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                style={styles.mainContainer}
                contentContainerStyle={{ paddingBottom: style.spacing.xl }}>
                {/* azioni pagina*/}
                <View style={styles.headerActions}>
                    <Pressable
                        onPress={() => router.replace("/(tabs)/Dispense")}
                        style={styles.actionButtons}>
                        <FontAwesome6 name="chevron-left" size={20} color={style.colors.primary} />
                    </Pressable>

                    <Pressable
                        onPress={() => setIsOpenManageMemberModals(true)}
                        style={styles.actionButtons}>
                        <FontAwesome5 name="user-friends" size={20} color={style.colors.primary} />
                    </Pressable>
                </View>

                {/* intestazione dispensa */}
                <View style={styles.pantryHeader}>
                    <Text style={styles.pantryName}>{actualPantry?.name}</Text>

                    <View style={styles.membersInfo}>

                        <FontAwesome5 name="user-friends" size={16} color={style.colors.primary} />
                        <Text style={styles.membersText}>
                            {countMembers} {countMembers === 1 ? "membro" : "membri"}
                        </Text>
                    </View>

                    <View style={styles.separator}></View>

                    <View style={styles.productsHeader}>
                        <View style={styles.productsTitleContainer}>
                            <Feather name="package" size={23} color={style.colors.primary} />

                            <Text style={styles.productsTitle}>Prodotti presenti</Text>
                        </View>

                        <Text style={styles.productsCount}>
                            {countProducts} {countProducts === 1 ? "prodotto" : "prodotti"}
                        </Text>
                    </View>

                    {/* FILTRI */}
                    <Filters
                        search={searchProduct}
                        onChangeSearch={setSearchProduct}
                        sortName={sortName}
                        onSortNameChange={setSortName}
                        sortQuantity={sortQuantity}
                        onSortQuantityChange={setSortQuantity}
                    />

                    {pantryProducts.length > 0 ? (
                        sortedProducts.length > 0 ? (
                            sortedProducts.map((p) => (
                                <ProductCard
                                    key={p.item_id}
                                    product={p}
                                    onPress={() => handleOpenDetail(p.item_id)}
                                    onPressMenu={() => handleOpenMenu(p.item_id)}
                                />
                            ))
                        ) : (
                            <Text>Nessun prodotto trovatp</Text>
                        )) : (
                        <Text>Nessun prodotto presente</Text>
                    )}

                    <Pressable
                        onPress={() => setIsOpenManageMemberModals(true)}
                        style={styles.membersButton}>
                        <FontAwesome5 name="user-friends" size={18} color={style.colors.surface} />
                        <Text style={styles.memberButtonText}>Gestisci membri</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* modale gestione membri */}
            {actualPantry && (
                <PantryMembersModal
                    isOpenModal={isOpenManageMemberModal}
                    onCloseModal={() => setIsOpenManageMemberModals(false)}
                    pantry={actualPantry}
                />
            )}

            {/* modale azioni del prodotto */}
            <ProductActionsModal
                visible={isOpenMenu}
                product={selectedProductForMenu}

                onClose={() => setIsOpenMenu(false)}

                onEdit={() => {
                    if (!selectedProductForMenu) return;

                    setSelectedProduct(selectedProductForMenu);
                    setIsOpenMenu(false);
                    setSelectedProductForMenu(null);
                    setIsOpenEditModal(true);
                }}

                onDelete={() => {
                    if (!selectedProductForMenu) return;

                    setSelectedProductToDelete(selectedProductForMenu);
                    setIsOpenMenu(false);
                    setSelectedProductForMenu(null);
                    setIsOpenDeleteModal(true);
                }}
            />

            {/* modale modifica prodotto */}
            <EditProductModal
                isOpenEditModal={isOpenEditModal}
                product={selectedProduct}
                onClose={() => setIsOpenEditModal(false)}
                onSave={handleSave}
            />

            {/* modale eliminazione prodotto */}
            <DeleteProductModal
                isOpenDeleteModal={isOpenDeleteModal}
                product={selectedProductToDelete}
                onClose={() => setIsOpenDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: style.colors.background,
        flex: 1
    },
    headerActions: {
        padding: style.spacing.md,
        marginBottom: style.spacing.sm,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    actionButtons: {
        width: 45,
        height: 45,
        backgroundColor: style.colors.surface,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.circle,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: style.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    pantryHeader: {
        padding: style.spacing.md,
        gap: style.spacing.xs,
    },
    pantryName: {
        fontSize: style.fontSize.title,
        fontWeight: style.fontWeight.bolder,
        color: style.colors.text,
        marginBottom: style.spacing.xs
    },
    membersInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: style.spacing.xs,
    },
    membersText: {
        fontSize: style.fontSize.sm,
        fontWeight: style.fontWeight.semibold,
        letterSpacing: 0.1,
        color: style.colors.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: style.colors.separatorDark,
        marginVertical: style.spacing.lg,
    },
    productsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productsTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: style.spacing.sm,
    },
    productsTitle: {
        fontSize: style.fontSize.xl,
        fontWeight: style.fontWeight.bold,
        color: style.colors.text,
        letterSpacing: -0.2,
    },
    productsCount: {
        fontSize: style.fontSize.sm,
        fontWeight: style.fontWeight.semibold,
        backgroundColor: style.colors.cyanLight,
        color: style.colors.primary,
        paddingVertical: style.spacing.xs,
        paddingHorizontal: style.spacing.md,
        borderRadius: style.radius.stats,
    },
    membersButton: {
        backgroundColor: style.colors.primary,
        borderRadius: style.radius.stats,
        marginTop: style.spacing.md,
        paddingVertical: style.spacing.md,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: style.spacing.md,
    },
    memberButtonText: {
        color: style.colors.surface,
        fontWeight: style.fontWeight.semibold
    }
});
