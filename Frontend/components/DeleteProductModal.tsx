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

                        <Text>Sei sicuro di voler eliminare {product.name}?</Text>

                        <View>
                            <Pressable onPress={onConfirm}>
                                <Text>Elimina</Text>
                            </Pressable>

                            <Pressable onPress={onClose}>
                                <Text>Annulla</Text>
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
});