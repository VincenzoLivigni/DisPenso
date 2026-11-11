// compnenti React Native
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

// stili
import { style } from "../styles/generics";

// icone
import Feather from '@expo/vector-icons/Feather';

// tipi
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

                        <View style={styles.headerDeleteModal}>
                            <View style={styles.circle}>
                                <Feather name="trash-2" size={25} color={style.colors.error} />
                            </View>

                            {/* conferna eliminazione */}
                            <Text style={styles.title}>Elimina Prodotto</Text>

                            <Text style={styles.subtitle}>Sei sicuro di voler eliminare{" "}
                                <Text style={styles.productName}>{product.name}</Text>?
                            </Text>
                        </View>

                        {/* azioni */}
                        <View style={styles.actionsContainer}>
                            <Pressable onPress={onClose} style={styles.nullButton}>
                                <Text style={styles.textButton}>Annulla</Text>
                            </Pressable>

                            <Pressable onPress={onConfirm} style={styles.deleteButton}>
                                <Text style={styles.textButton}>Elimina</Text>
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
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: style.spacing.lg,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    modalContent: {
        width: "100%",
        backgroundColor: style.colors.surface,
        padding: style.spacing.lg,
        borderRadius: style.radius.stats,
        borderWidth: 1,
        borderColor: style.colors.border,
        gap: style.spacing.md,
    },
    headerDeleteModal: {
        alignItems: "center",
        gap: style.spacing.xs,
        marginBottom: style.spacing.lg,
    },
    circle: {
        width: 50,
        height: 50,
        backgroundColor: style.colors.backgroundError,
        borderRadius: style.radius.circle,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: style.fontSize.xl,
        fontWeight: style.fontWeight.bold,
        textAlign: "center",
        color: style.colors.text,
    },
    subtitle: {
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.medium,
        textAlign: "center",
        color: style.colors.textSecondary,
        paddingHorizontal: style.spacing.sm
    },
    productName: {
        fontWeight: style.fontWeight.bold,
        color: style.colors.error,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: style.spacing.sm,
    },
    deleteButton: {
        minHeight: style.controls.minimumTouchTarget,
        backgroundColor: style.colors.error,
        borderRadius: style.radius.modal,
        justifyContent: "center",
        alignItems: 'center',
        flex: 1,
    },
    nullButton: {
        minHeight: style.controls.minimumTouchTarget,
        backgroundColor: style.colors.null,
        borderRadius: style.radius.modal,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    textButton: {
        color: style.colors.surface,
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.semibold,
    }
});