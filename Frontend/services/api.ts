import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


const API = process.env.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.trim()
    : "http://localhost:3000/api"

//funzione di supporto per avere il token    
export async function getToken() {

    if (Platform.OS === 'web') { //condizione per testare dal web
        return localStorage.getItem("token");
    } else { //secureStore funziona solo da mobile
        return await SecureStore.getItemAsync("token");
    }
}

//funzione di supporto per autenticazione
const auth = async function () {
    let token: unknown = await getToken()
    if (typeof token === 'string') {

        return { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` }
    }
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

// TUTTE LE DISPENSE
export async function allPantries() {

    const res = await fetch(`${API}/pantry/pantries`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore nel recuperare le dispense")

    return data
}

// TUTTI I PRODOTTI
export async function pantryProducts() {

    const res = await fetch(`${API}/pantry-items/pantries/1/items`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || `Errore nel recuperare i prodotti della dispensa numero 1`)

    return data
}

// TUTTE LE SCADENZE
export async function allExpiringProducts() {

    const res = await fetch(`${API}/pantry-items/products/expiring`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore nel recuperare i prodotti in scadenza")

    return data
}