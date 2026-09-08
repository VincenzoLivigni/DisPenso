import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addProductToPantry } from '../../services/api';

export default function Barcode() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) return <View />
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>Serve il permesso per usare la fotocamera</Text>
                <Button onPress={requestPermission} title="Concedi permesso" />
            </View>
        );
    }

    const currentPantryId = 25

    const handleBarCodeScanned = async ({ data: barcode }: { data: string }) => {
        setScanned(true);
        console.log(`Codice a barre: ${barcode}`)
        try {
            const qty = 1
            const expirationDate = new Date().toISOString().split('T')[0]

            const data = await addProductToPantry(currentPantryId, barcode, qty, expirationDate)

        }
        catch (err) {
            console.log("Errore nell'aggiunta del prodotto:", err)
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={{ width: "100%", height: "100%" }}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["ean13", "ean8"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && (
                <Button title={'Scansiona un altro prodotto'} onPress={() => setScanned(false)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});