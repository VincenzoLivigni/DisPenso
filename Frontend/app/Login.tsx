import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "./contexts/authContext";

export default function Login() {
    const router = useRouter();
    const auth = useContext(AuthContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{ email?: string; password?: string }>({})

    // Validazione form accesso prima dell'invio
    const validationForm = () => {
        const newError: { email?: string; password?: string } = {}
        if (!email.trim()) newError.email = "L'email è obbligatoria"
        if (!password.trim()) newError.password = "La password è obbligatoria"

        setError(newError)
        return Object.keys(newError).length === 0
    };

    // Invio dati al backend
    const handleLogin = async () => {
        if (!validationForm()) return
        if (!auth) return

        try {
            // reindirizzamento alla attuale home
            await auth.login(email, password)

            // feedback per l'utente 
            Alert.alert("Accesso effettuato con successo")

            setEmail("");
            setPassword("")
            setError({})

            router.replace("/");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante il login"
            Alert.alert("Errore", errorMessage)
        }
    };

    return (
        <View>
            <View>
                <Text>Accedi a DisPenso</Text>
            </View>

            <View>
                <Text>Email</Text>
                <TextInput
                    placeholder="Inserisci la tua email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {error.email && <Text>{error.email}</Text>}
            </View>

            <View>
                <Text>Password</Text>
                <TextInput
                    placeholder="Inserisci la tua password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error.password && <Text>{error.password}</Text>}
            </View>

            <Pressable onPress={handleLogin}>
                <Text>Accedi</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/Register")}>
                <Text>Non hai un account? Registrati</Text>
            </Pressable>
        </View>
    );
}