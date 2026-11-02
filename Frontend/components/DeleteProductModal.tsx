import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

import { style } from "../styles/generics";

type dataProduct = {
    "item_id": number,
    "quantity": number,
    "expiration_date": string,
    "name": string,
}

type deleteProductModalProps = {
    isOpenDeleteModal: boolean,
    product: dataProduct | null,
    onConfirm: () => Promise<void>,
    onClose: () => void
}

export default function DeleteProductModal({ isOpenDeleteModal, product, onConfirm, onClose }: deleteProductModalProps) {

    if (!product) return null

    return (
        <>
            <Modal visible={isOpenDeleteModal} transparent={true} animationType="fade" onRequestClose={onClose}>
                <View style={styles.deleteModal}>
                    <View style={styles.modalContent}>

                        {/* conferna eliminazione */}
                        <Text style={styles.title}>Vuoi eliminare{" "}
                            <Text style={styles.productName}>{product.name}</Text>?
                        </Text>

                        {/* azioni */}
                        <View style={styles.actionsContainer}>
                            <Pressable onPress={onConfirm} style={styles.deleteButton}>
                                <Text style={styles.textButton}>Elimina</Text>
                            </Pressable>

                            <Pressable onPress={onClose} style={styles.nullButton}>
                                <Text style={styles.textButton}>Annulla</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    deleteModal: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: style.spacing.lg,
        justifyContent: "center",
        flex: 1,
    },
    modalContent: {
        backgroundColor: style.colors.surface,
        padding: style.spacing.lg,
        borderRadius: style.radius.stats,
        borderWidth: 1,
        borderColor: style.colors.border,
        gap: style.spacing.xxl
    },
    title: {
        fontSize: style.fontSize.xl,
        fontWeight: "600",
        textAlign: "center",
        color: style.colors.text,
    },
    productName: {
        color: style.colors.primary,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: style.spacing.sm,
    },
    deleteButton: {
        height: style.controls.buttonHeight,
        backgroundColor: style.colors.error,
        borderRadius: style.radius.card,
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
    },
    nullButton: {
        height: style.controls.buttonHeight,
        backgroundColor: style.colors.border,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.card,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    textButton: {
        color: style.colors.surface,
        fontSize: style.fontSize.sm,
        fontWeight: "600"
    }
});