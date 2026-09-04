import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
            <FontAwesome name="user" size={18} color="black" />
          </Pressable>
          {!autoOpen ? (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color="#6e6e6e"
            />
          ) : (
            <MaterialIcons name="keyboard-arrow-up" size={20} color="#6e6e6e" />
          )}
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
                <View key={p.item_id} style={styles.card}>
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
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6e6e6e",
  },
  toggle: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titlePantry: {
    fontWeight: "600",
  },
  accordionContainer: {
    gap: 8,
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: "#ccc",
  },
  card: {
    backgroundColor: "white",
    padding: 8,
    borderWidth: 1,
    borderColor: "#6e6e6e",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  productName: {
    fontWeight: "600",
  },
  info: {},
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderLeftWidth: 3,
    borderRightWidth: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  editAction: {
    backgroundColor: "#3baecb",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 80.5,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
  },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 80.5,
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
  },
  actionText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
});
