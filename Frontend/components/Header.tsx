import { View, Image, Text, Pressable, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("../assets/DisPenso_logo.png");

export default function Header() {


    return (
        // per adattare l'header a schermi mobile
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Image
                        source={logo}
                        resizeMode="contain"
                        style={styles.logo}>
                    </Image>

                    <Text style={styles.firstPartLogo}>is</Text>
                    <Text style={styles.secondPartLogo}>Penso</Text>
                </View>

            </View>
        </SafeAreaView>
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
})