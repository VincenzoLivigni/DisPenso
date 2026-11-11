// compnenti React Native
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

// stili
import { style } from "../styles/generics";

// icone
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from '@expo/vector-icons/Feather';

// tipi
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

          <View style={styles.headerManageModal}>
            <View style={styles.circle}>
              <FontAwesome5 name="user-friends" size={25} color={style.colors.primary} />
            </View>

            {/* nome */}
            <Text style={styles.title}>Gestione dispensa</Text>

            <Text style={styles.subtitle}>Visualizza e gestisci i membri della tua dispensa</Text>
          </View>

          {/* codice invito */}
          <View style={styles.inviteCodeContainer}>
            <Text style={styles.label}>
              <Ionicons name="ticket-outline" size={18} color={style.colors.primary} />{" "}
              Codice d'invito
            </Text>
            <Text style={styles.code}>{invite_code}</Text>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={styles.scrollContent}>
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
                    <Feather name="trash-2" size={15} color={style.colors.surface} />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* azioni */}
          <View style={styles.footerButtons}>
            <Pressable onPress={onCloseModal} style={styles.nullButton}>
              <Text style={styles.textButton}>Annulla</Text>
            </Pressable>

            <Pressable onPress={() => deletePantry(pantry.id)} style={styles.deleteButton}>
              <Text style={styles.textButton}>Elimina Dispensa</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  manageModal: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: style.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
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
    gap: style.spacing.md,
  },
  headerManageModal: {
    alignItems: "center",
    gap: style.spacing.xs,
    marginBottom: style.spacing.sm,
  },
  circle: {
    width: 50,
    height: 50,
    backgroundColor: style.colors.backgroundPrimary,
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

  inviteCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: style.spacing.xs,
  },
  label: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.semibold,
    color: style.colors.text,
  },
  code: {
    fontSize: style.fontSize.md,
    fontWeight: style.fontWeight.bold,
    color: style.colors.primary,
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
    backgroundColor: style.colors.background,
    paddingHorizontal: style.spacing.md,
    paddingVertical: style.spacing.md,
    borderRadius: style.radius.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  users: {
    fontSize: style.fontSize.md,
    color: style.colors.text,
    flex: 1,
  },
  emptyText: {
    fontSize: style.fontSize.md,
    color: style.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: style.spacing.sm,
  },
  acceptBtn: {
    width: 26,
    height: 26,
    backgroundColor: style.colors.green,
    borderRadius: style.radius.circle,
    justifyContent: "center",
    alignItems: "center"
  },
  rejectBtn: {
    width: 26,
    height: 26,
    backgroundColor: style.colors.error,
    borderRadius: style.radius.circle,
    justifyContent: "center",
    alignItems: "center",
  },
  trashButton: {
    width: 26,
    height: 26,
    backgroundColor: style.colors.error,
    borderRadius: style.radius.circle,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtons: {
    marginTop: style.spacing.lg,
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
  },
});
