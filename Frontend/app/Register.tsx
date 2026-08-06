import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../contexts/authContext";

export default function Register() {
    const router = useRouter();
    const auth = useContext(AuthContext);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<{ email?: string; password?: string }>({})

    // Validazione form registrazione prima dell'invio
    const validationForm = () => {
        const newError: { email?: string; password?: string; confirmPassword?: string } = {}

        if (!email.trim()) newError.email = "L'email è obbligatoria"
        if (!password.trim()) {
            newError.password = "La password è obbligatoria"
        } else if (password.length < 6) {
            newError.password = "La password deve contenere almeno 6 caratteri"
        }
        setError(newError);
        return Object.keys(newError).length === 0
    }

    // Invio dati al backend
    const handleRegister = async () => {
        if (!validationForm()) return
        if (!auth) return

        try {
            await auth.register(email, password)

            // feedback per l'utente 
            Alert.alert("Registrazione avvenuta con successo")

            setEmail("")
            setPassword("")
            setError({})

            router.replace("/Login")
        }
        catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante la registrazione. Riprova"
            Alert.alert("Errore", errorMessage)
        }
    }

    return (
        <View>

            <View>
                <Text>Registrati per iniziare a gestire la tua dispensa</Text>
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

            <Pressable onPress={handleRegister}>
                <Text>Registrati</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/Login")}>
                <Text>Sei già registrato? Accedi</Text>
            </Pressable>
        </View>
    )
}