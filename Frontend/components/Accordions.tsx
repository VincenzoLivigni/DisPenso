import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import {
  DataPantries,
  DataPantryItems,
  usePantry,
} from "../contexts/pantryContext";
import { expirationBadge } from "../services/utils";
import Swipeable from "react-native-gesture-handler/Swipeable";
import PantryMembersModal from "./PantryMembersModal";

import { style } from "../styles/generics";

const placeholder = require("../assets/placeholder.png");

type AccordionProps = {
  pantry: DataPantries;
  search: string;
  products: DataPantryItems[];
};

export default function Accordions({
  search,
  products,
  pantry,
}: AccordionProps) {
  const router = useRouter();
  //Prendiamo dal context le funzioni per salvare ed eliminare il prodotto
  const { handleUpdateProduct, handleDeleteProduct } = usePantry();

  const [isOpen, setIsOpen] = useState(false);
  // stati modifica prodotto
  const [selectedProduct, setSelectedProduct] =
    useState<DataPantryItems | null>(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  // stati elimina prodotto
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<DataPantryItems | null>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  //stati per la modale delle dispense
  const [isOpenManageMemberModal, setIsOpenManageMemberModals] =
    useState(false);

  const cleanSearch = search.toLowerCase().trim();
  const productMatch = products.length > 0;
  const autoOpen = isOpen || (cleanSearch !== "" && productMatch);

  const handleSave = async (newQuantity: number, newExpiring: string) => {
    if (!selectedProduct) return;
    //prendo la funzione dal context
    await handleUpdateProduct(
      pantry.id,
      selectedProduct.item_id,
      newQuantity,
      newExpiring,
    );
  };

  const handleConfirmDelete = async () => {
    if (selectedProductToDelete) {
      //prendo la funzione dal context
      await handleDeleteProduct(pantry.id, selectedProductToDelete.item_id);
      setIsOpenDeleteModal(false);
      setSelectedProductToDelete(null);
    }
  };

  const handleOpenDetail = (itemId: number) => {
    router.push(`/product/${itemId}`);
  };

  // scorri a destra per modificare prodotto
  const dragLeft = (p: DataPantryItems) => {
    return (
      <Pressable
        style={styles.editAction}
        onPress={() => {
          // evita conflittti tra l'animazione dello swipe e l'apertura della modale
          setTimeout(() => {
            setSelectedProduct(p);
            setIsOpenEditModal(true);
          }, 100);
        }}
      >
        <Octicons name="pencil" size={16} color="white" />
        <Text style={styles.actionText}>Modifica</Text>
      </Pressable>
    );
  };

  // scorri a sinistra per eliminare prodotto
  const dragRight = (p: DataPantryItems) => {
    return (
      <Pressable
        style={styles.deleteAction}
        onPress={() => {
          setTimeout(() => {
            setSelectedProductToDelete(p);
            setIsOpenDeleteModal(true);
          }, 100);
        }}
      >
        <MaterialIcons name="delete" size={18} color="white" />
        <Text style={styles.actionText}>Elimina</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.toggle} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.titlePantry}>{pantry.name}</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => setIsOpenManageMemberModals(true)}>
            <FontAwesome5 name="user-alt" size={16} color="black" />
          </Pressable>
          <MaterialIcons name={autoOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6e6e6e" />
        </View>
      </Pressable>

      {autoOpen && (
        <View style={styles.accordionContainer}>
          {products.map((p) => {
            const badge = expirationBadge(p.expiration_date);

            return (
              <Swipeable
                key={p.item_id}
                renderLeftActions={() => dragLeft(p)}
                renderRightActions={() => dragRight(p)}
                // resistenza dello swipe
                friction={2}
                // soglia oltre la quale l'utente deve trascinare la card affinchÃ© l'azione si attivi
                leftThreshold={40}
                rightThreshold={40}
              >
                <View style={styles.card}>
                  <Image
                    source={p.image_url ? { uri: p.image_url } : placeholder}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <View style={styles.infoContainer}>
                    <Pressable onPress={() => handleOpenDetail(p.item_id)}>
                      <Text style={styles.productName}>{p.name}</Text>
                    </Pressable>

                    <Text style={styles.info}>{p.quantity} pz</Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: badge.bg,
                          borderLeftColor: badge.border,
                          borderRightColor: badge.border,
                        },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: badge.color }]}>
                        {badge.text}
                      </Text>
                    </View>
                  </View>
                </View>
              </Swipeable>
            );
          })}
        </View>
      )}

      <PantryMembersModal
        isOpenModal={isOpenManageMemberModal}
        onCloseModal={() => setIsOpenManageMemberModals(false)}
        pantry={pantry}
      />

      <EditProductModal
        isOpenEditModal={isOpenEditModal}
        product={selectedProduct}
        onClose={() => setIsOpenEditModal(false)}
        onSave={handleSave}
      />

      {/* Modale di Cancellazione */}
      <DeleteProductModal
        isOpenDeleteModal={isOpenDeleteModal}
        product={selectedProductToDelete}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsOpenDeleteModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: style.colors.surface,
    borderRadius: style.radius.modal,
    borderWidth: 1,
    borderColor: style.colors.border,
    padding: style.spacing.md,
  },
  titlePantry: {
    fontSize: style.fontSize.md,
    fontWeight: "600",
    color: style.colors.text,
    marginVertical: 2
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: style.spacing.sm,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionContainer: {
    borderTopWidth: 1,
    borderTopColor: style.colors.border,
    marginTop: style.spacing.md,
    paddingTop: style.spacing.md,
    gap: style.spacing.md,
  },
  card: {
    minHeight: 80,
    backgroundColor: style.colors.surface,
    borderWidth: 1,
    borderColor: style.colors.border,
    borderRadius: style.radius.card,
    padding: style.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: style.radius.card,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: style.spacing.xs,
    gap: style.spacing.xs,
  },
  productName: {
    fontSize: style.fontSize.sm,
    fontWeight: "600",
    color: style.colors.text,
  },
  info: {
    fontSize: style.fontSize.sm,
    fontWeight: "600",
    color: style.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: style.spacing.sm,
    paddingVertical: 2,
    borderRadius: style.radius.control,
    alignSelf: "flex-start",
    borderLeftWidth: 3,
    borderRightWidth: 3,
  },
  badgeText: {
    fontSize: style.fontSize.xs,
    fontWeight: "700",
  },
  editAction: {
    width: 60,
    backgroundColor: style.colors.primary,
    borderTopLeftRadius: style.radius.card,
    borderBottomLeftRadius: style.radius.card,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAction: {
    width: 60,
    backgroundColor: style.colors.error,
    borderTopRightRadius: style.radius.card,
    borderBottomRightRadius: style.radius.card,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: style.fontSize.xs,
    fontWeight: "600",
    textAlign: "center",
    color: style.colors.surface,
    marginTop: style.spacing.xs,
  },
});
