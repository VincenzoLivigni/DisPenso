import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { usePantry } from "../../contexts/pantryContext";
import { useRouter } from "expo-router"
import { useState } from "react";
import { addProductToPantry } from "../../services/api";

export default function Barcode() {
  // per reindirizzare l'utente nella pagina Dispense dopo aver confermato l'aggiunta del prodotto
  const router = useRouter();

  //stati per usare la camera con i relativi permessi
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  //stati con i dettagli del prodotto
  const [pantryId, setPantryId] = useState<number>(25);
  const [barcodeScan, setBarcodeScan] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [expiring, setExpiring] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const { pantries, loadPantries } = usePantry();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionLabel}>Serve il permesso per usare la fotocamera</Text>
        <Pressable onPress={requestPermission}>
          <Text style={styles.permissionText}>Concedi permesso</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data: barcode }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setBarcodeScan(barcode);
  };

  const createProduct = async () => {
    try {
      await addProductToPantry(
        pantryId,
        barcodeScan,
        parseInt(quantity) || 1,
        expiring,
      );

      if (loadPantries) {
        await loadPantries()
      }

      Alert.alert("prodotto aggiunto con successo");
      setBarcodeScan("");
      setScanned(false);

      router.replace("/Dispense")
    } catch (err) {
      console.log("Errore nell'aggiunta del prodotto:", err);
      Alert.alert("impossibile aggiungere il prodotto");
    }
  };

  return (
    <>
      {/* SEZIONE PER LO SCAN DEL BARCODE */}
      <View style={styles.container}>
        {!barcodeScan && (
          <CameraView
            style={{ width: "100%", height: "100%" }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        )}

        {/* MODALE PER CONFERMARE L'AGGIUNTA DEL PRODOTTO */}
        <Modal visible={!!barcodeScan} transparent={true}>
          <View style={styles.addProductModal}>
            {/* SEZIONE PER PASSARE PANTRY ID */}
            <View style={styles.modalContent}>
              <Text style={styles.productTitle}>Aggiungi le info del prodotto</Text>

              <ScrollView>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>In quale dispensa vuoi aggiungere il prodotto?</Text>

                  <View style={styles.pantryRowContainer}>
                    {pantries.map((p) => {
                      const isSelected = pantryId === p.id

                      return (
                        <Pressable
                          key={p.id}
                          onPress={() => setPantryId(p.id)}
                          style={[
                            styles.sectionRow,
                            isSelected && styles.selectedRow
                          ]}>
                          <Text style={[styles.pantries, isSelected && styles.selectedText]}>{p.name}</Text>
                        </Pressable>
                      )
                    })}
                  </View>
                </View>

                {/* SEZIONE PER LA QUANTITA' */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.label}>Quantità</Text>
                  <TextInput
                    placeholder="inserisci la quantità"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    style={styles.input}
                  />
                </View>

                {/* SEZIONE PER LA SCADENZA' */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.label}>Data di scadenza</Text>
                  <TextInput
                    placeholder="inserisci la scadenza"
                    value={expiring}
                    onChangeText={setExpiring}
                    style={styles.input}
                  />
                </View>
              </ScrollView>

              {/* CONFERMA CREAZIONE PRODOTTO' */}
              <View style={styles.actionsContainer}>
                <Pressable style={styles.confirmButton} onPress={createProduct}>
                  <Text style={styles.textButton}>Conferma</Text>
                </Pressable>

                <Pressable style={styles.nullButton}
                  onPress={() => {
                    setBarcodeScan("");
                    setScanned(false);
                  }}
                >
                  <Text style={styles.textButton}>Annulla</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  permissionLabel: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  permissionText: {
    fontWeight: 600
  },
  addProductModal: {
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
  productTitle: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pantryRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  sectionRow: {
    backgroundColor: "#f2f2f2",
    marginBottom: 6,
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRow: {
    backgroundColor: "#63be3f"
  },
  selectedText: {
    color: "white",
    fontWeight: 600
  },
  pantries: {
    fontSize: 14,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2a2a2a',
    marginBottom: 8
  },
  input: {
    height: 40,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: 'black'
  },
  actionsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f3f3",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  confirmButton: {
    height: 40,
    backgroundColor: "#63be3f",
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  nullButton: {
    height: 40,
    backgroundColor: "#959595",
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  textButton: {
    color: "white",
    fontWeight: 600,
  },
})
