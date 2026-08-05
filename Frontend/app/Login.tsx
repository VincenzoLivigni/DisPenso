import { useState } from "react";
import { TextInput, Text, View, Pressable, Alert, ActivityIndicator, Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";

const API = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.trim() : "";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState<{ [key: string]: string }>({});

    // Validazione form accesso prima dell'invio
    const validationForm = () => {
        const newErrors: { [key: string]: string } = {};
        let valid = true;

        if (!email.trim()) {
            newErrors.email = "L'email è obbligatoria";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "La password è obbligatoria";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Invio dati al backend
    const handleLogin = async () => {
        if (!validationForm()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Errore durante l'accesso");
            }

            // salvataggio token 
            if (data.token) {
                if (Platform.OS === 'web') {
                    localStorage.setItem("user.token", data.token);
                } else {
                    await SecureStore.setItemAsync("user.token", data.token);
                }
            }

            setEmail("");
            setPassword("");
            setErrors({});

            // feedback per l'utente 
            if (typeof window !== "undefined" && window.alert) {
                window.alert("Accesso effettuato con successo");
            } else {
                Alert.alert("Successo", "Accesso effettuato con successo");
            }

            // reindirizzamento alla attuale home
            router.replace("/");
        }
        catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante il login";

            if (typeof window !== "undefined" && window.alert) {
                window.alert(errorMessage);
            } else {
                Alert.alert("Errore", errorMessage);
            }
        }
        finally {
            setLoading(false);
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

            <Pressable
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Text>Accedi</Text>
                )}
            </Pressable>

            <Pressable onPress={() => router.push("/Register")}>
                <Text>Non hai un account? Registrati</Text>
            </Pressable>
        </View>
    );
}