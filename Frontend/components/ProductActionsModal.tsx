// compnenti React Native
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";

// stili
import { style } from "../styles/generics";

// icone
import Feather from '@expo/vector-icons/Feather';

// tipi
import type { DataPantryItems } from "../contexts/pantryContext";

type ProductActionsModalProps = {
    visible: boolean;
    product: DataPantryItems | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function ProductActionsModal({
    visible,
    product,
    onClose,
    onEdit,
    onDelete,
}: ProductActionsModalProps) {
    if (!product) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>

                <View style={styles.menuModal}>
                    <View style={styles.menuHeader}>
                        <View style={styles.circle}>
                            <Feather name="box" size={28} color={style.colors.textSecondary} />
                        </View>

                        <Text style={styles.menuTitle}>Gestisci{" "}
                            <Text style={styles.menuSubtitle}>{product.name}</Text>
                        </Text>
                    </View>

                    <Pressable
                        style={styles.menuOption}
                        onPress={onEdit}>
                        <Text style={styles.editText}>Modifica</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.menuOption, styles.deleteOption]}
                        onPress={onDelete}>
                        <Text style={styles.deleteText}>Elimina</Text>
                    </Pressable>

                    <Pressable
                        style={styles.cancelButton}
                        onPress={onClose}>
                        <Text style={styles.cancelText}>Annulla</Text>
                    </Pressable>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
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
    circle: {
        width: 50,
        height: 50,
        backgroundColor: "#66666625",
        borderRadius: style.radius.circle,
        justifyContent: "center",
        alignItems: "center",
    },
    menuTitle: {
        fontSize: style.fontSize.xl,
        fontWeight: style.fontWeight.bold,
        color: style.colors.text,
    },
    menuSubtitle: {
        color: style.colors.textSecondary,
    },
    menuOption: {
        minHeight: style.controls.minimumTouchTarget,
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
        minHeight: style.controls.minimumTouchTarget,
        backgroundColor: style.colors.background
    },
    deleteText: {
        color: style.colors.error,
        fontSize: style.fontSize.md,
        fontWeight: style.fontWeight.bold,
        letterSpacing: 0.2
    },
    cancelButton: {
        minHeight: style.controls.minimumTouchTarget,
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
})