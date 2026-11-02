import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

import { style } from "../styles/generics";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { DataPantries, usePantry } from "../contexts/pantryContext";

type PantryMembersModalProps = {
  isOpenModal: boolean;
  onCloseModal: () => void;
  pantry: DataPantries;
};

export default function PantryMembersModal({
  isOpenModal,
  onCloseModal,
  pantry,
}: PantryMembersModalProps) {
  const { id, name, invite_code } = pantry;

  const { pantryMembersDetails, handleAcceptMember, handleRemoveMember, handleDeletePantry } = usePantry();
  const members = pantryMembersDetails[id] || [];

  const pendingMembers = members.filter((m) => m.status === "pending");
  const acceptedMembers = members.filter((m) => m.status === "accepted");

  // funzione elimina dispensa e chiude modale
  function deletePantry(id: number) {
    handleDeletePantry(id)
    onCloseModal()
  }

  return (
    <Modal visible={isOpenModal} transparent={true} animationType="fade" onRequestClose={onCloseModal}>
      <View style={styles.manageModal}>
        <View style={styles.modalContent}>

          {/* nome */}
          <Text style={styles.title}>Gestione{" "}
            <Text style={styles.pantryName}>{name}</Text>
          </Text>

          <View style={styles.modalSeparatorTop}></View>

          {/* codice invito */}
          <View style={styles.inviteCodeContainer}>
            <Text style={styles.label}>Codice d'invito</Text>
            <Text style={styles.code}>{invite_code}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* richieste */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Richieste</Text>

              {pendingMembers.length > 0 ? (
                pendingMembers.map((m) => (
                  <View key={m.id} style={styles.sectionRow}>
                    <Text style={styles.users}>{m.email}</Text>

                    <View style={styles.actionButtons}>
                      <Pressable onPress={() => handleAcceptMember(pantry.id, m.id)} style={styles.acceptBtn}>
                        <MaterialIcons name="check" size={16} color={style.colors.surface} />
                      </Pressable>

                      <Pressable onPress={() => handleRemoveMember(pantry.id, m.id)} style={styles.rejectBtn}>
                        <MaterialIcons name="close" size={16} color={style.colors.surface} />
                      </Pressable>
                    </View>

                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Nessuna richiesta in attesa
                </Text>
              )}
            </View>

            {/* membri */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Membri</Text>

              {acceptedMembers.map((m) => (
                <View key={m.id} style={styles.sectionRow}>
                  <Text style={styles.users}>{m.email}</Text>
                  <Pressable onPress={() => handleRemoveMember(pantry.id, m.id)} style={styles.trashButton}>
                    <MaterialIcons name="delete-outline" size={16} color={style.colors.surface} />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalSeparatorBottom} />

          {/* azioni */}
          <View style={styles.footerButtons}>
            <Pressable onPress={() => deletePantry(pantry.id)} style={styles.deleteButton}>
              <Text style={styles.textButton}>Elimina Dispensa</Text>
            </Pressable>
            <Pressable onPress={onCloseModal} style={styles.nullButton}>
              <Text style={styles.textButton}>Annulla</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  manageModal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: style.spacing.lg,
    justifyContent: "center",
    flex: 1,
  },
  modalContent: {
    width: "100%",
    maxWidth: 450,
    maxHeight: "80%",
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
  pantryName: {
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
  inviteCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: style.spacing.xs,
  },
  label: {
    fontSize: style.fontSize.sm,
    fontWeight: "600",
    color: style.colors.text,
  },
  code: {
    fontWeight: "600",
    color: style.colors.green,
  },
  scrollContent: {
    gap: style.spacing.md,
  },
  sectionContainer: {
    marginVertical: style.spacing.xs,
  },
  sectionTitle: {
    fontSize: style.fontSize.md,
    fontWeight: "600",
    color: style.colors.text,
    marginBottom: style.spacing.xs,
  },
  sectionRow: {
    height: style.controls.inputHeight,
    backgroundColor: style.colors.bgInput,
    paddingHorizontal: style.spacing.md,
    paddingVertical: style.spacing.sm,
    borderRadius: style.radius.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  users: {
    fontSize: style.fontSize.sm,
    color: style.colors.text,
    flex: 1,
  },
  emptyText: {
    fontSize: style.fontSize.sm,
    color: style.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: style.spacing.sm,
  },
  acceptBtn: {
    backgroundColor: style.colors.green,
    borderRadius: style.radius.control,
    padding: style.spacing.xs,
    justifyContent: "center",
    alignItems: "center"
  },
  rejectBtn: {
    backgroundColor: style.colors.error,
    borderRadius: style.radius.control,
    padding: style.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  trashButton: {
    backgroundColor: style.colors.error,
    borderRadius: style.radius.control,
    padding: style.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtons: {
    flexDirection: "row",
    gap: style.spacing.sm,
  },
  deleteButton: {
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.error,
    borderRadius: style.radius.card,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  nullButton: {
    height: style.controls.buttonHeight,
    backgroundColor: style.colors.border,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.card,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  textButton: {
    fontSize: style.fontSize.sm,
    fontWeight: "600",
    color: style.colors.surface,
  },
});
