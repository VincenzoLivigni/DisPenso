import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface PropsAuthForm {
    title: string,
    submitButtonText: string,
    secondaryButtonText: string,
    onSecondaryPress: () => void,
    onSubmit: (data: { email: string; password: string }) => Promise<void>,
    isRegister?: boolean
}
export function AuthForm({
    title,
    submitButtonText,
    secondaryButtonText,
    onSecondaryPress,
    onSubmit,
    isRegister = false,
}: PropsAuthForm) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<{ email?: string; password?: string }>({})

    // Validazione form accesso prima dell'invio
    const validationForm = () => {
        const newError: { email?: string; password?: string } = {}

        if (!email.trim()) newError.email = "L'email è obbligatoria"

        if (!password.trim()) {
            newError.password = "La password è obbligatoria"
        } else if (isRegister && password.length < 6) {
            newError.password = "La password deve contenere almeno 6 caratteri"
        }

        setError(newError)
        return Object.keys(newError).length === 0
    }

    const handleSubmit = async () => {
        if (!validationForm()) return

        await onSubmit({ email, password })

        // Reset dei campi dopo l'invio con successo
        setEmail('')
        setPassword('')
        setError({})
    }

    return (
        <View>
            <Text>{title}</Text>

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

            <Pressable onPress={handleSubmit}>
                <Text>{submitButtonText}</Text>
            </Pressable>

            <Pressable onPress={onSecondaryPress}>
                <Text>{secondaryButtonText}</Text>
            </Pressable>
        </View>
    );
}