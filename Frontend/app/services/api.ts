import * as SecureStore from 'expo-secure-store';

const API = process.env.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.trim()
    : "http://localhost:3000/api"

export async function getToken() {
    return await SecureStore.getItemAsync("token")
}

// REGISTRAZIONE
export async function registerUser(email: string, password: string) {

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante la registrazione")

    return data
}

// LOGIN
export async function loginUser(email: string, password: string) {

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante la login")

    return data
}