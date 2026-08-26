import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

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
            <Modal visible={isOpenDeleteModal} transparent={true}>
                <View style={styles.deleteModal}>
                    <View style={styles.modalContent}>

                        <Text style={styles.title}>Vuoi eliminare
                            <Text style={styles.productName}>{product.name}</Text>?
                        </Text>

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
        padding: 25,
        flex: 1,
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 600,
        textAlign: "center",
        marginBottom: 25,
    },
    productName: {
        color: "#3bafcb",
        marginLeft: 5
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 15,
    },
    deleteButton: {
        height: 40,
        backgroundColor: "#cb3b3b",
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    nullButton: {
        height: 40,
        backgroundColor: "#959595",
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    textButton: {
        color: "white",
        fontWeight: 600,
    }
});