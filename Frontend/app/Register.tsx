import { useContext } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { AuthContext } from '../contexts/authContext'
import { AuthForm } from '../components/AuthForm'

export default function Register() {
    const router = useRouter();
    const auth = useContext(AuthContext);

    // Validazione form registrazione prima dell'invio
    const handleRegister = async ({ email, password }: { email: string; password: string }) => {
        if (!auth) return

        try {
            await auth.register(email, password)
            Alert.alert("Registrazione avvenuta con successo")
            router.replace("/Login")
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Errore durante la registrazione"
            Alert.alert("Errore", errorMessage)
        }
    }

    return (
        <AuthForm
            title="Registrati"
            onSubmit={handleRegister}
            submitButtonText="Registrati"
            secondaryButtonText="Accedi"
            onSecondaryPress={() => router.push('/Login')}
            isRegister={true}
            isLogin={false}
        />
    )
}