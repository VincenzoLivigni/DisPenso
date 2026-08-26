import { View, Text, Pressable, StyleSheet, TextInput, Modal } from 'react-native';
import { useEffect, useState } from 'react';

type dataProduct = {
    "item_id": number,
    "quantity": number,
    "expiration_date": string,
    "name": string,
}

type editProductModalProps = {
    isOpenEditModal: boolean,
    product: dataProduct | null,
    onSave: (newQuantity: number, newExpiration: string) => Promise<void>, // funzione asincrona
    onClose: () => void, //funzione sincrona
}

export default function EditProductModal({ isOpenEditModal, product, onSave, onClose }: editProductModalProps) {
    const [newQuantity, setNewQuantity] = useState<string>("1")
    const [newExpiration, setNewExpiration] = useState<string>("")

    useEffect(() => {
        if (product) {
            setNewQuantity(product.quantity.toString())
            setNewExpiration(product.expiration_date)
        }
    }, [product])

    const handleSaveModal = async () => {
        const convertQuantity = parseInt(newQuantity) || 1 // converto la stringa in numero
        await onSave(convertQuantity, newExpiration)
        onClose()
    }

    if (!product) return null

    return (
        <>
            <Modal visible={isOpenEditModal} transparent={true}>
                <View style={styles.editModal}>
                    <View style={styles.modalContent}>
                        <Text>Modifica {product.name}</Text>

                        <View>
                            <Text>Modifica quantità</Text>
                            <TextInput
                                keyboardType="number-pad"
                                placeholder="Modifica la quantità del prodotto"
                                value={newQuantity}
                                onChangeText={setNewQuantity}
                            />
                        </View>

                        <View>
                            <Text>Modifica data di scadenza</Text>
                            <TextInput
                                placeholder="Modifica la data di scadenza del prodotto"
                                value={newExpiration}
                                onChangeText={setNewExpiration}
                            />
                        </View>

                        <View>
                            <Pressable onPress={handleSaveModal}>
                                <Text>Salva</Text>
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
    editModal: {
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