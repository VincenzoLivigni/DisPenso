import { useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../contexts/authContext';
import { AuthForm } from '../components/AuthForm';

export default function Login() {
    const router = useRouter();
    const auth = useContext(AuthContext);

    // Validazione form accesso prima dell'invio
    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
        if (!auth) return

        try {
            await auth.login(email, password)
            Alert.alert("Accesso effettuato con successo")
            router.replace("/")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante l'accesso"
            Alert.alert("Errore", errorMessage)
        }
    }

    return (
        <AuthForm
            title="Accedi a DisPenso"
            onSubmit={handleLogin}
            submitButtonText="Accedi"
            secondaryButtonText="Non hai un account? Registrati"
            onSecondaryPress={() => router.push("/Register")}
        />
    )
}