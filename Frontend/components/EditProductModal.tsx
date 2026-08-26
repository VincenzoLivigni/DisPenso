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
                        <Text style={styles.title}>Modifica
                            <Text style={styles.productName}>{product.name}</Text>
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Modifica quantità</Text>
                            <TextInput
                                keyboardType="number-pad"
                                placeholder="Modifica la quantità del prodotto"
                                value={newQuantity}
                                onChangeText={setNewQuantity}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Modifica data di scadenza</Text>
                            <TextInput
                                placeholder="Modifica la data di scadenza del prodotto"
                                value={newExpiration}
                                onChangeText={setNewExpiration}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.actionsContainer}>
                            <Pressable onPress={handleSaveModal} style={styles.saveButton}>
                                <Text style={styles.textButton}>Salva</Text>
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
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2a2a2a',
        marginBottom: 8,
    },
    input: {
        height: 40,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 15,
        color: 'black',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 15,
    },
    saveButton: {
        height: 40,
        backgroundColor: "#63be3f",
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