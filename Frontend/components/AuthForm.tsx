import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
interface PropsAuthForm {
    title: string;
    submitButtonText: string;
    secondaryButtonText: string;
    onSecondaryPress: () => void;
    onSubmit: (data: { email: string; password: string }) => Promise<void>;
    isRegister?: boolean;
    isLogin?: boolean;
}
export function AuthForm({
    title,
    submitButtonText,
    secondaryButtonText,
    onSecondaryPress,
    onSubmit,
    isRegister = false,
    isLogin = false
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
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Inserisci la tua email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, error.email ? styles.inputError : null]}
                    />
                    {error.email && <Text style={styles.error}>{error.email}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Inserisci la tua password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={[styles.input, error.password ? styles.inputError : null]}
                    />
                    {error.password && <Text style={styles.error}>{error.password}</Text>}
                </View>

                <LinearGradient
                    colors={['rgba(59, 175, 203, 1)', 'rgba(71, 179, 161, 1)', 'rgba(99, 190, 63, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryButton}>
                    <Pressable
                        onPress={handleSubmit}
                        style={styles.primaryButtonContent}>
                        <Text style={styles.primaryButtonText}>{submitButtonText}</Text>
                    </Pressable>
                </LinearGradient>

                <View style={styles.linkContainer}>
                    <Text style={styles.secondaryText}>
                        {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
                    </Text>
                    <Text style={styles.linkText} onPress={onSecondaryPress}>
                        {secondaryButtonText}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#2a2a2a',
        marginBottom: 30,
    },
    form: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#2a2a2a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10
    },
    inputContainer: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2a2a2a',
        marginBottom: 8,
        marginLeft: 3
    },
    input: {
        height: 50,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 15,
        color: 'black',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    error: {
        color: '#ef4444',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '500',
    },
    primaryButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    primaryButtonContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    linkContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    secondaryText: {
        fontSize: 14,
        color: '#2a2a2a',
    },
    linkText: {
        fontSize: 14,
        color: '#3bafcb',
        fontWeight: '700',
    }
})