import { View, Text, StyleSheet } from "react-native"
import Carosello from "../../components/Carosello";
import IA_Recipe from "../../components/IA_Recipe";

export default function Ricette() {

    return (
        <>
            <View>
                <Carosello />

                <IA_Recipe />
            </View>
        </>
    )
}