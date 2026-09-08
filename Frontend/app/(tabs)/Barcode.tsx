import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { usePantry } from "../../contexts/pantryContext";
import { useState } from "react";
import { addProductToPantry } from "../../services/api";

export default function Formcode() {
  //stati per usare la camera con i relativi permessi
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  //stati con i dettagli del prodotto
  const [pantryId, setPantryId] = useState<number>(1);
  const [barcodeScan, setBarcodeScan] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [expiring, setExpiring] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const { pantries } = usePantry();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View>
        <Text>Serve il permesso per usare la fotocamera</Text>
        <Button onPress={requestPermission} title="Concedi permesso" />
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

      Alert.alert("prodotto aggiunto con successo");
      setBarcodeScan("");
      setScanned(false);
    } catch (err) {
      console.log("Errore nell'aggiunta del prodotto:", err);
      Alert.alert("impossibile aggiungere il prodotto");
    }
  };

  return (
    <>
      {/* SEZIONE PER LO SCAN DEL BARCODE */}
      <View style={styles.container}>
        {!barcodeScan ? (
          <CameraView
            style={{ width: "100%", height: "100%" }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
        ) : (
          <ScrollView>
            {/* SEZIONE PER PASSARE PANTRY ID */}
            {pantries.map((p) => (
              <Pressable key={p.id} onPress={() => setPantryId(p.id)}>
                <Text>{p.name}</Text>
              </Pressable>
            ))}

            {/* SEZIONE PER LA QUANTITA' */}
            <View>
              <Text style={styles.label}>Quantità:</Text>
              <TextInput
                placeholder="inserisci la quantitÃ "
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            {/* SEZIONE PER LA SCADENZA' */}
            <View>
              <Text style={styles.label}>Data di scadenza:</Text>
              <TextInput
                placeholder="inserisci la scadenza"
                value={expiring}
                onChangeText={setExpiring}
              />
            </View>

            {/* CONFERMA CREAZIONE PRODOTTO' */}
            <View>
              <Button title="crea prodotto" onPress={createProduct} />
              <Button
                title="annula"
                onPress={() => {
                  setBarcodeScan("");
                  setScanned(false);
                }}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    color: "red",
  },
});
