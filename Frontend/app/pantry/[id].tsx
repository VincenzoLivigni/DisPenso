// compnenti React Native
import { View, Text, Pressable, StyleSheet, Modal, ScrollView } from "react-native";

// navigazione app
import { useLocalSearchParams, Stack, useRouter } from "expo-router";

// hooks
import { useState } from "react";

// componenti app
import ProductCard from "../../components/ProductCard";
import EditProductModal from "../../components/EditProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";
import PantryMembersModal from "../../components/PantryMembersModal";

// stili
import { style } from "../../styles/generics";

// icone
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

// tipi
import { usePantry } from "../../contexts/pantryContext";
import type { DataPantryItems } from "../../contexts/pantryContext";

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
        router.push(`/product/${itemId}`);
    };

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
                        onPress={() => router.back()}
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

                        <FontAwesome5 name="user-friends" size={14} color={style.colors.primary} />
                        <Text style={styles.membersText}>
                            {countMembers} {countMembers === 1 ? "membro" : "membri"}
                        </Text>
                    </View>

                    <View style={styles.separator}></View>

                    <View style={styles.productsHeader}>
                        <Text style={styles.productsTitle}>
                            <Feather name="box" size={20} color={style.colors.primary} />{" "}
                            Prodotti presenti
                        </Text>

                        <Text style={styles.productsCount}>
                            {countProducts} {countProducts === 1 ? "prodotto" : "prodotti"}
                        </Text>
                    </View>


                    {pantryProducts.length > 0 ? (
                        pantryProducts.map((p) => (
                            <ProductCard
                                key={p.item_id}
                                product={p}
                                onPress={() => handleOpenDetail(p.item_id)}
                                onPressMenu={() => handleOpenMenu(p.item_id)}
                            />
                        ))
                    ) : (
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
            <Modal
                visible={isOpenMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpenMenu(false)}
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.menuModal}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Gestisci{" "}
                                <Text style={styles.menuSubtitle}>{selectedProductForMenu?.name}</Text>
                            </Text>
                        </View>

                        <Pressable
                            style={styles.menuOption}
                            onPress={() => {
                                if (selectedProductForMenu) {
                                    setSelectedProduct(selectedProductForMenu);
                                    setIsOpenMenu(false);
                                    setIsOpenEditModal(true);
                                }
                            }}>
                            <Text style={styles.editText}>Modifica</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.menuOption, styles.deleteOption]}
                            onPress={() => {
                                if (selectedProductForMenu) {
                                    setSelectedProductToDelete(selectedProductForMenu);
                                    setIsOpenMenu(false);
                                    setIsOpenDeleteModal(true);
                                }
                            }}>
                            <Text style={styles.deleteText}>Elimina</Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => {
                                setIsOpenMenu(false);
                                setSelectedProductForMenu(null);
                            }}>
                            <Text style={styles.cancelText}>Annulla</Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>

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
        marginBottom: style.spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productsTitle: {
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.bold,
        color: style.colors.text,
        letterSpacing: -0.2,
    },
    productsCount: {
        fontSize: style.fontSize.xs,
        fontWeight: style.fontWeight.bold,
        backgroundColor: style.colors.cyanLight,
        color: style.colors.primary,
        paddingVertical: style.spacing.xs,
        paddingHorizontal: style.spacing.md,
        borderRadius: style.radius.stats,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        justifyContent: "flex-end",
    },
    menuModal: {
        width: "100%",
        backgroundColor: style.colors.surface,
        paddingHorizontal: style.spacing.lg,
        paddingTop: style.spacing.xl,
        paddingBottom: style.spacing.xxl,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderColor: style.colors.border,
        gap: style.spacing.sm,
    },
    menuHeader: {
        alignItems: "center",
        gap: style.spacing.xs,
        marginBottom: style.spacing.lg,
    },
    menuTitle: {
        fontSize: style.fontSize.lg,
        fontWeight: style.fontWeight.bold,
        color: style.colors.text,
    },
    menuSubtitle: {
        color: style.colors.primary,
    },
    menuOption: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: style.radius.modal,
        backgroundColor: style.colors.background
    },
    editText: {
        color: style.colors.green,
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.bold,
        letterSpacing: 0.1
    },
    deleteOption: {
        backgroundColor: style.colors.background
    },
    deleteText: {
        color: style.colors.error,
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.bold,
        letterSpacing: 0.2
    },
    cancelButton: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: style.radius.modal,
        backgroundColor: style.colors.background,
    },
    cancelText: {
        color: style.colors.textSecondary,
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.bold,
        letterSpacing: 0.2
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
