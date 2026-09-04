import { Alert } from "react-native";
import {
  allPantries,
  createNewPantry,
  pantryProducts,
  updateProduct,
  deleteProduct,
  pantryMembers,
  joinPantry,
  acceptMember,
  deleteMember,
  deletePantry
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

//dettaglio del membro dentro la dispensa
export type DataPantryMembers = {
  id: number;
  email: string;
  role: string;
  status: string;
};

type PantryContextType = {
  pantries: DataPantries[];
  products: { [pantryId: number]: DataPantryItems[] };
  pantryMembersDetails: { [pantryId: number]: DataPantryMembers[] };
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
  handleJoinPantry: (inviteCode: string) => Promise<void>;
  handleAcceptMember: (pantryId: number, memberId: number) => Promise<void>;
  handleRemoveMember: (pantryId: number, memberId: number) => Promise<void>;
  handleDeletePantry: (pantryId: number) => Promise<void>;
};

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const PantryProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [pantries, setPantries] = useState<DataPantries[]>([]);
  const [products, setProducts] = useState<{
    [pantryId: number]: DataPantryItems[];
  }>({});

  const [pantryMembersDetails, setPantryMembersDetails] = useState<{
    [pantryId: number]: DataPantryMembers[];
  }>({});

  // RECUPERA TUTTE LE DISPENSE E TUTTI I PRODOTTI
  async function loadPantries() {
    try {
      setLoading(true);
      const data: DataPantries[] = await allPantries();
      setPantries(data);

      const productsMap: { [key: number]: DataPantryItems[] } = {};
      const memberMap: { [key: number]: DataPantryMembers[] } = {};
      await Promise.all(
        data.map(async (pantry) => {
          try {
            const prods = await pantryProducts(pantry.id);
            productsMap[pantry.id] = prods || [];
          } catch (err) {
            productsMap[pantry.id] = [];
          }

          try {
            const dataMembers = await pantryMembers(pantry.id);
            memberMap[pantry.id] = dataMembers || [];
          } catch (err) {
            memberMap[pantry.id] = [];
          }
        }),
      );
      setProducts(productsMap);
      setPantryMembersDetails(memberMap);
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

  // AGGIUNGI MEMBRO A DISPENSA
  const handleJoinPantry = async (inviteCode: string) => {
    try {
      if (!inviteCode.trim()) {
        Alert.alert("Codice d'invito non valido");
        return;
      }

      await joinPantry(inviteCode.trim())
      Alert.alert(
        "Richiesta Inviata",
        "La tua richiesta è in attesa di approvazione da parte del proprietario."
      );
      await loadPantries();
    }
    catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile unirsi alla dispensa");
    }
  }

  //ACCETTA MEMBRO
  const handleAcceptMember = async (pantryId: number, memberId: number) => {
    try {
      await acceptMember(pantryId, memberId);

      // aggiunta nuovo membro alla dispensa
      setPantryMembersDetails((prevDetails) => ({
        ...prevDetails,
        [pantryId]: (prevDetails[pantryId] || []).map((member) => member.id === memberId
          ? { ...member, status: "accepted" }
          : member
        ),
      }))

    } catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile accettare il membro nella dispensa");
    }
  }


  //RIMUOVI MEMBRO DALLA DISPENSA
  const handleRemoveMember = async (pantryId: number, memberId: number) => {
    try {
      await deleteMember(pantryId, memberId);

      // elimina membro dalla dispensa
      setPantryMembersDetails((prevDetails) => ({
        ...prevDetails,
        [pantryId]: (prevDetails[pantryId] || []).filter((member) => member.id !== memberId
        ),
      }))

    } catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile rimuovere il membro dalla dispensa");
    }
  }

  //ELIMINA DISPENSA
  const handleDeletePantry = async (pantryId: number) => {
    try {
      await deletePantry(pantryId);

      // elimina la dispensa dalla lista
      setPantries((prev) => prev.filter((p) => p.id !== pantryId))

      // rimozione dei membri appartenenti alla dispensa
      setPantryMembersDetails((prev) => {
        const updated = { ...prev }
        delete updated[pantryId]
        return updated
      })

      // rimozione dei prodotti dalla dispensa
      setProducts((prev) => {
        const updated = { ...prev }
        delete updated[pantryId]
        return updated
      })

    } catch (err) {
      console.log("Errore", err);
      Alert.alert("Errore", "Impossibile eliminare la dispensa");
    }
  }

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
        pantryMembersDetails,
        handleJoinPantry,
        handleAcceptMember,
        handleRemoveMember,
        handleDeletePantry
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
