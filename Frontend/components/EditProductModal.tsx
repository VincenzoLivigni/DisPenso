import { View, Text, Pressable, StyleSheet, TextInput, Modal } from 'react-native';
import { useEffect, useState } from 'react';

import { style } from "../styles/generics";

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

            const formattedDate = product.expiration_date ? product.expiration_date.split('T')[0] : ""

            setNewExpiration(formattedDate)
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
            <Modal visible={isOpenEditModal} transparent={true} animationType="fade" onRequestClose={onClose}>
                <View style={styles.editModal}>
                    <View style={styles.modalContent}>

                        {/* nome prodotto */}
                        <Text style={styles.title}>Modifica{" "}
                            <Text style={styles.productName}>{product.name}</Text>
                        </Text>

                        <View style={styles.modalSeparatorTop}></View>

                        {/* quantità */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Modifica quantità</Text>
                            <TextInput
                                keyboardType="number-pad"
                                placeholder="Modifica la quantità del prodotto"
                                value={newQuantity}
                                onChangeText={setNewQuantity}
                                style={styles.input}
                                placeholderTextColor={style.colors.textSecondary}
                            />
                        </View>

                        {/* scadenza */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Modifica data di scadenza</Text>
                            <TextInput
                                placeholder="Modifica la data di scadenza del prodotto"
                                value={newExpiration}
                                onChangeText={setNewExpiration}
                                style={styles.input}
                                placeholderTextColor={style.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.modalSeparatorBottom}></View>

                        {/* azioni */}
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
        gap: style.spacing.lg
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
    modalSeparatorTop: {
        borderWidth: 1,
        borderColor: style.colors.bgInput,
    },
    modalSeparatorBottom: {
        borderWidth: 1,
        borderColor: style.colors.bgInput,
        marginVertical: style.spacing.xs,
    },
    inputContainer: {
        gap: 6,
    },
    label: {
        fontSize: style.fontSize.md,
        fontWeight: '600',
        color: style.colors.text
    },
    input: {
        height: style.controls.inputHeight,
        fontSize: style.fontSize.md,
        backgroundColor: style.colors.bgInput,
        color: style.colors.text,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.card,
        paddingHorizontal: style.spacing.md,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: style.spacing.sm,
    },
    saveButton: {
        height: style.controls.buttonHeight,
        backgroundColor: style.colors.green,
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