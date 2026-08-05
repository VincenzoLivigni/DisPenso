import { useState } from "react";
import { TextInput, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.trim() : ""

export default function Register() {
    const router = useRouter();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setErrors] = useState<{ [key: string]: string }>({})

    // Validazione form registrazione prima dell'invio
    const validationForm = () => {
        const newErrors: { [key: string]: string } = {};
        let valid = true;

        if (!email.trim()) {
            newErrors.email = "L'email è obbligatoria"
            valid = false
        }

        if (!password.trim()) {
            newErrors.password = "La password è obbligatoria"
            valid = false
        } else if (password.length < 6) {
            newErrors.password = "La password deve contenere almeno 6 caratteri"
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    // Invio dati al backend
    const handleRegister = async () => {
        if (!validationForm()) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Errore durante la registrazione")
            }

            setEmail("");
            setPassword("");
            setErrors({});

            Alert.alert("Registrazione completata correttamente!");
        }
        catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante la registrazione";
            Alert.alert(errorMessage)
        }
        finally {
            setLoading(false)
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

            <Pressable
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Text>Registrati</Text>
                )}
            </Pressable>

            <Pressable onPress={() => router.push("/Login")}>
                <Text>Sei già registrato? Accedi</Text>
            </Pressable>
        </View>
    )
}