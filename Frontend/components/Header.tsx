import { View, Image, Text, Pressable } from "react-native"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'

export default function Header() {
    const router = useRouter();
    const auth = useContext(AuthContext)

    // Gestione del Logout
    const handleLogout = async () => {
        await auth?.logout()
        router.replace("/Login")
    }


    return (
        <View
            style={{ padding: 20, backgroundColor: "white", justifyContent: "space-between", flexDirection: "row" }} >
            <View
                style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Image
                    source={require('../assets/DisPenso_logo.svg')}
                    resizeMode="contain"
                    style={{ width: 60, height: 60, marginBottom: 2.5 }}>
                </Image>

                <Text style={{ marginLeft: -1, color: '#3BAFCB', fontSize: 36, fontWeight: 400 }}>is</Text>
                <Text style={{ color: '#63BE3F', fontSize: 36, fontWeight: 600 }}>Penso</Text>
            </View>

            <View
                style={{ flexDirection: "row", alignItems: "center" }}>

                <Pressable onPress={handleLogout}>
                    <LinearGradient
                        colors={['rgba(59, 175, 203, 1)', 'rgba(71, 179, 161, 1)', 'rgba(99, 190, 63, 1)']}

                        locations={[0, 0.5, 1]}

                        start={{ x: 0.2, y: 1 }}
                        end={{ x: 0.8, y: 0 }}

                        style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', }}
                    >

                        <SimpleLineIcons name="logout" size={26} color="white" style={{ marginRight: 7 }} />
                    </LinearGradient>
                </Pressable>

            </View>


        </View>
    )
}