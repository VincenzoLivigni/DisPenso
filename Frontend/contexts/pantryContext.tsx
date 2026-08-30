import { Alert } from "react-native";
import {
  allPantries,
  createNewPantry,
  pantryProducts,
  updateProduct,
  deleteProduct,
} from "../services/api";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

//info dispensa singola
export type DataPantries = {
  id: number;
  name: string;
  invite_code: string;
  created_at: string;
  role: string;
  status: string;
};

//prodotti dentro la dispensa
export type DataPantryItems = {
  item_id: number;
  quantity: number;
  expiration_date: string;
  added_at: string;
  product_id: number;
  barcode: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  category: string | null;
  ingredients: string | null;
  nutrition: {
    energy_kcal: number | null;
    fat: number | null;
    saturated_fat: number | null;
    carbohydrates: number | null;
    sugars: number | null;
    fiber: number | null;
    proteins: number | null;
    salt: number | null;
  } | null;
};

type PantryContextType = {
  pantries: DataPantries[];
  products: { [pantryId: number]: DataPantryItems[] };
  loading: boolean;
  loadPantries: () => Promise<void>;
  createPantry: (name: string) => Promise<void>;
  handleUpdateProduct: (
    pantryId: number,
    itemId: number,
    quantity: number,
    expiring_date: string,
  ) => Promise<void>;
  handleDeleteProduct: (pantryId: number, itemId: number) => Promise<void>;
  getProductById: (itemId: number) => DataPantryItems | undefined;
};

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const PantryProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [pantries, setPantries] = useState<DataPantries[]>([]);
  const [products, setProducts] = useState<{
    [pantryId: number]: DataPantryItems[];
  }>({});

  // RECUPERA TUTTE LE DISPENSE E TUTTI I PRODOTTI
  async function loadPantries() {
    try {
      setLoading(true);
      const data: DataPantries[] = await allPantries();
      setPantries(data);

      const productsMap: { [key: number]: DataPantryItems[] } = {};
      await Promise.all(
        data.map(async (pantry) => {
          try {
            const prods = await pantryProducts(pantry.id);
            productsMap[pantry.id] = prods || [];
          } catch (err) {
            productsMap[pantry.id] = [];
          }
        }),
      );
      setProducts(productsMap);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // CREAZIONE NUOVA DISPENSA
  const createPantry = async (name: string) => {
    try {
      const dataNewPantry = await createNewPantry(name);
      if (dataNewPantry && dataNewPantry.id) {
        setPantries((prev) => [...prev, dataNewPantry]);
      } else {
        await loadPantries();
      }
    } catch (err) {
      Alert.alert("Errore", "Impossibile creare la dispensa");
    }
  };

  // AGGIORNAMENTO PRODOTTO BACKEND E IN LOCALE
  const handleUpdateProduct = async (
    pantryId: number,
    itemId: number,
    quantity: number,
    expiring_date: string,
  ) => {
    try {
      // chiamata api per salvare la modifica nel db
      await updateProduct(pantryId, itemId, quantity, expiring_date);

      // modifiche in tempo reale
      setProducts((prevProducts) => ({
        ...prevProducts,
        [pantryId]: (prevProducts[pantryId] || []).map((p) =>
          p.item_id === itemId
            ? { ...p, quantity, expiration_date: expiring_date }
            : p,
        ),
      }));
    } catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile aggiornare il prodotto");
    }
  };

  // ELIMINA PRODOTTO
  const handleDeleteProduct = async (pantryId: number, itemId: number) => {
    try {
      await deleteProduct(pantryId, itemId);

      setProducts((prevProducts) => ({
        ...prevProducts,
        [pantryId]: (prevProducts[pantryId] || []).filter(
          (p) => p.item_id !== itemId,
        ),
      }));
    } catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile eliminare il prodotto");
    }
  };

  //FUNZIONE CON IL FIND PER TROVARE DIRETTAMENTE UN PRODOTTO TRAMITE ID
  const getProductById = (itemId: number): DataPantryItems | undefined => {
    for (const pantryId in products) {
      const found = products[pantryId].find((p) => p.item_id === itemId);
      if (found) return found;
    }
    return undefined;
  };

  //CHIAMO TUTTE LE DISPENSE CON I PRODOTTI
  useEffect(() => {
    loadPantries();
  }, []);

  return (
    <PantryContext.Provider
      value={{
        pantries,
        products,
        loading,
        loadPantries,
        createPantry,
        handleUpdateProduct,
        handleDeleteProduct,
        getProductById,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

//CUSTOM HOOK PER FACILITARE L'USO DEL CONTEXT
export const usePantry = () => {
  const context = useContext(PantryContext);

  if (!context) {
    throw new Error(
      "per usare usePantry devi essere dentro il pantry provider",
    );
  }

  return context;
};
