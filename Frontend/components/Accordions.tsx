import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";

import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { DataPantryItems, usePantry } from "../contexts/pantryContext";

const placeholder = require("../assets/placeholder.png");

type AccordionProps = {
  nomeDispensa: string;
  pantryId: number;
  search: string;
  products: DataPantryItems[];
};

export default function Accordions({
  nomeDispensa,
  search,
  products,
  pantryId,
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

  const cleanSearch = search.toLowerCase().trim();
  const productMatch = products.length > 0;
  const autoOpen = isOpen || (cleanSearch !== "" && productMatch);

  const handleSave = async (newQuantity: number, newExpiring: string) => {
    if (!selectedProduct) return;
    //prendo la funzione dal context
    await handleUpdateProduct(
      pantryId,
      selectedProduct.item_id,
      newQuantity,
      newExpiring,
    );
  };

  const handleConfirmDelete = async () => {
    if (selectedProductToDelete) {
      //prendo la funzione dal context
      await handleDeleteProduct(pantryId, selectedProductToDelete.item_id);
      setIsOpenDeleteModal(false);
      setSelectedProductToDelete(null);
    }
  };

  const handleOpenDetail = (itemId: number) => {
    router.push(`/product/${itemId}`);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.toggle} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.titlePantry}>{nomeDispensa}</Text>
        {!autoOpen ? (
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#6e6e6e" />
        ) : (
          <MaterialIcons name="keyboard-arrow-up" size={20} color="#6e6e6e" />
        )}
      </Pressable>

      {autoOpen && (
        <View style={styles.accordionContainer}>
          {products.map((p) => (
            <View key={p.item_id} style={styles.card}>
              <Image
                source={p.image_url ? { uri: p.image_url } : placeholder}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Pressable onPress={() => handleOpenDetail(p.item_id)}>
                  <Text style={styles.productName}>{p.name}</Text>
                </Pressable>

                <Text style={styles.info}>{p.quantity}</Text>
                <Text style={styles.info}>
                  {p.expiration_date
                    ? p.expiration_date
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")
                    : ""}
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => {
                    setSelectedProduct(p);
                    setIsOpenEditModal(true);
                  }}
                >
                  <Octicons name="pencil" size={20} color="black" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSelectedProductToDelete(p);
                    setIsOpenDeleteModal(true);
                  }}
                >
                  <MaterialIcons name="delete" size={22} color="black" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

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
    padding: 8,
    borderWidth: 1,
    borderColor: "#6e6e6e",
    borderRadius: 8,
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
    gap: 10,
  },
});
