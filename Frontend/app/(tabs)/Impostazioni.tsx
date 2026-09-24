import { View, Text, StyleSheet, Modal, Pressable } from "react-native"
import { useState, useContext } from "react"
import { useRouter } from "expo-router";

import { clearPantries } from "../../services/api"
import { saveStorageItem } from "../../services/storage"
import { AuthContext } from "../../contexts/authContext"

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function Impostazioni() {

    const router = useRouter();
    const auth = useContext(AuthContext)

    // Gestione del Logout
    const handleLogout = async () => {
        await auth?.logout()
        router.replace("/Login")
    }

    // modali
    const [openModalPantries, setOpenModalPantries] = useState<boolean>(false)
    const [openModalFavorites, setOpenModalFavorites] = useState<boolean>(false)

    // pulizia dispense
    const clearAllPantries = async () => {
        try {
            await clearPantries()
            setOpenModalPantries(false)
        }
        catch (err) {
            console.log("Errore durante la pulizia dei preferiti: ", err)
        }
    }

    // pulizia preferiti
    const clearFavorites = async () => {
        try {
            await saveStorageItem("favorite_recipes", JSON.stringify([]))
            setOpenModalFavorites(false)
        }
        catch (err) {
            console.log("Errore durante la pulizia dei preferiti: ", err)
        }
    }

    return (
        <>
            <View>
                <Pressable onPress={() => setOpenModalPantries(true)}>
                    <Text>Svuota tutte le dispense</Text>
                </Pressable>

                {/* prodotti */}
                <Modal visible={openModalPantries} transparent={true}>
                    <View style={styles.deleteModal}>
                        <View style={styles.modalContent}>

                            <Text style={styles.title}>Sei sicuro di voler svuotare tutte le dispense?</Text>

                            <View style={styles.actionsContainer}>
                                <Pressable onPress={() => clearAllPantries()} style={styles.deleteButton}>
                                    <Text style={styles.textButton}>Elimina</Text>
                                </Pressable>

                                <Pressable onPress={() => setOpenModalPantries(false)} style={styles.nullButton}>
                                    <Text style={styles.textButton}>Annulla</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>

            {/* preferiti */}
            <View>
                <Pressable onPress={() => setOpenModalFavorites(true)}>
                    <Text>Svuota prefreriti</Text>
                </Pressable>

                <Modal visible={openModalFavorites} transparent={true}>
                    <View style={styles.deleteModal}>
                        <View style={styles.modalContent}>

                            <Text style={styles.title}>Sei sicuro di voler svuotare i preferiti?</Text>

                            <View style={styles.actionsContainer}>
                                <Pressable onPress={() => clearFavorites()} style={styles.deleteButton}>
                                    <Text style={styles.textButton}>Elimina</Text>
                                </Pressable>

                                <Pressable onPress={() => setOpenModalFavorites(false)} style={styles.nullButton}>
                                    <Text style={styles.textButton}>Annulla</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>


            {/*  logout */}
            <View style={styles.headerRight}>
                <Pressable onPress={handleLogout}>
                    <LinearGradient
                        colors={["rgba(59, 175, 203, 1)", "rgba(71, 179, 161, 1)", "rgba(99, 190, 63, 1)"]}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0.2, y: 1 }}
                        end={{ x: 0.8, y: 0 }}
                        style={styles.containerButtonLogout}
                    >
                        <SimpleLineIcons name="logout" size={24} color="white" style={{ marginRight: 7 }} />
                    </LinearGradient>
                </Pressable>
            </View>

            <View>
                <Text style={styles.sectionTitle}>Info sull'app</Text>
                <Text>Versione: 0.0.1</Text>
            </View>



        </>
    )
}


const styles = StyleSheet.create({
    container: {},
    sectionTitle: {
        fontSize: 22
    },
    deleteModal: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 25,
        flex: 1,
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 600,
        textAlign: "center",
        marginBottom: 25,
    },
    productName: {
        color: "#3bafcb",
        marginLeft: 5
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 15,
    },
    deleteButton: {
        height: 40,
        backgroundColor: "#cb3b3b",
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
    headerRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    containerButtonLogout: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#3baecb",
        shadowOpacity: 0.25,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 3
        }
    }
});