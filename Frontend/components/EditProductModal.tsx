// compnenti React Native
import { View, Text, Pressable, StyleSheet, TextInput, Modal } from 'react-native';

// hooks
import { useEffect, useState } from 'react';

// stili
import { style } from "../styles/generics";

// icone
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

// tipi
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

                        <View style={styles.headerEditModal}>
                            <View style={styles.circle}>
                                <FontAwesome6 name="pencil" size={25} color={style.colors.green} />
                            </View>

                            {/* nome prodotto */}
                            <Text style={styles.title}>Modifica prodotto</Text>

                            <Text style={styles.subtitle}>Aggiorna le informazioni di{" "}
                                <Text style={styles.productName}>{product.name}</Text>
                            </Text>
                        </View>

                        {/* quantità */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>
                                {/* <Feather name="box" size={18} color={style.colors.text} />{" "} */}
                                Quantità
                            </Text>

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
                            <Text style={styles.label}>
                                <Ionicons name="calendar-outline" size={18} color={style.colors.text} />{" "}
                                Scadenza
                            </Text>
                            <TextInput
                                placeholder="Modifica la data di scadenza del prodotto"
                                value={newExpiration}
                                onChangeText={setNewExpiration}
                                style={styles.input}
                                placeholderTextColor={style.colors.textSecondary}
                            />
                        </View>

                        {/* azioni */}
                        <View style={styles.actionsContainer}>
                            <Pressable onPress={onClose} style={styles.nullButton}>
                                <Text style={styles.textButton}>Annulla</Text>
                            </Pressable>

                            <Pressable onPress={handleSaveModal} style={styles.saveButton}>
                                <Text style={styles.textButton}>Salva</Text>
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
    headerEditModal: {
        alignItems: "center",
        gap: style.spacing.xs,
        marginBottom: style.spacing.lg,
    },
    circle: {
        width: 50,
        height: 50,
        backgroundColor: style.colors.backgroundGreen,
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
        color: style.colors.green,
    },
    inputContainer: {
        gap: style.spacing.xs,
    },
    label: {
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.semibold,
        color: style.colors.text,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    input: {
        height: style.controls.inputHeight,
        fontSize: style.fontSize.md,
        backgroundColor: style.colors.background,
        color: style.colors.text,
        borderWidth: 1,
        borderColor: style.colors.border,
        borderRadius: style.radius.card,
        paddingHorizontal: style.spacing.md,
    },
    actionsContainer: {
        marginTop: style.spacing.lg,
        flexDirection: "row",
        gap: style.spacing.sm,
    },
    saveButton: {
        minHeight: style.controls.minimumTouchTarget,
        backgroundColor: style.colors.green,
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