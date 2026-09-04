import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
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

  const { pantryMembersDetails } = usePantry();
  const members = pantryMembersDetails[id] || [];

  const pendingMembers = members.filter((m) => m.status === "pending");
  const acceptedMembers = members.filter((m) => m.status === "accepted");

  return (
    <Modal visible={isOpenModal} transparent={true}>
      <View style={styles.manageModal}>
        <View style={styles.modalContent}>
          {/* nome + codice */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>
              {name} - <Text style={styles.code}>{invite_code}</Text>
            </Text>
          </View>

          <ScrollView>
            {/* richieste */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Richieste</Text>
              {pendingMembers.map((m) => (
                <View key={m.id} style={styles.sectionRow}>
                  <Text style={styles.users}>{m.email}</Text>
                  <View style={styles.actionButtons}>
                    <Pressable style={styles.acceptBtn}>
                      <MaterialIcons name="check" size={16} color="white" />
                    </Pressable>
                    <Pressable style={styles.rejectBtn}>
                      <MaterialIcons name="close" size={16} color="white" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            {/* membri */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Membri</Text>
              {acceptedMembers.map((m) => (
                <View key={m.id} style={styles.sectionRow}>
                  <Text style={styles.users}>{m.email}</Text>
                  <Pressable style={{ marginLeft: 10 }}>
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color="#e74c3c"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* azioni */}
          <View style={styles.footerButtons}>
            <Pressable style={styles.deleteButton}>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },
  titleRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
  code: {
    fontWeight: "600",
    color: "#bebebe",
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionRow: {
    backgroundColor: "#f2f2f2",
    marginBottom: 6,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  users: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: "#2ecc71",
    padding: 4,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: "#e74c3c",
    padding: 4,
    borderRadius: 8,
  },
  footerButtons: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  nullButton: {
    flex: 1,
    backgroundColor: "#bebebe",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "600",
  },
});
