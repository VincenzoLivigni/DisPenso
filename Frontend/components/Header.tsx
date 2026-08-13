import { View, Image, Text, Pressable, StyleSheet } from "react-native"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react"
import { AuthContext } from "../contexts/authContext"

export default function Header() {
    const router = useRouter();
    const auth = useContext(AuthContext)

    // Gestione del Logout
    const handleLogout = async () => {
        await auth?.logout()
        router.replace("/Login")
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <Image
                    source={require("../assets/DisPenso_logo.svg")}
                    resizeMode="contain"
                    style={styles.logo}>
                </Image>

                <Text style={styles.firstPartLogo}>is</Text>
                <Text style={styles.secondPartLogo}>Penso</Text>
            </View>

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

        </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: "black",
        shadowOpacity: 0.075,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
    logo: {
        width: 50,
        height: 50,
        marginBottom: 2.5
    },
    firstPartLogo: {
        fontSize: 32,
        fontWeight: 400,
        color: "#3bafcb",
        marginLeft: -1,
    },
    secondPartLogo: {
        fontSize: 32,
        fontWeight: 600,
        color: "#63be3f",
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
})