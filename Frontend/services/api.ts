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

/*
############################
#####  AUTENTICAZIONE ######
############################
*/

// REGISTRAZIONE ✅
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

// LOGIN ✅
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


/*
############################
### GESTIONE DISPENSE ####
############################
*/

// CREA DISPENSA ✅
export async function createNewPantry(nomeNuovaDispensa: string) {

    const res = await fetch(`${API}/pantry/pantries`, {
        method: "POST",
        headers: await auth(),
        body: JSON.stringify({ name: nomeNuovaDispensa })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante la creazione della nuova dispensa")

    return data
}


// ACCETTA MEMBRO NELLA DISPENSA ✅
export async function acceptMember(
    pantryId: number,
    memberId: number) {

    const authHeaders = await auth();

    const res = await fetch(`${API}/pantry/pantries/${pantryId}/members/${memberId}/accept`, {
        method: "PATCH",
        headers: {
            ...authHeaders,
            "Content-Type": "application/json"
        },
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante l'accettazione di un nuovo membro")

    return data
}

// RICHIESTA UNIONE A DISPENSA ✅
export async function joinPantry(inviteCode: string) {

    const res = await fetch(`${API}/pantry/pantries/join`, {
        method: "POST",
        headers: await auth(),
        body: JSON.stringify({ invite_code: inviteCode })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante la richiesta di unione alla dispensa")

    return data
}

// RECUPERA MEMBRI DISPENSA  ✅
export async function pantryMembers(pantryId: number) {

    const res = await fetch(`${API}/pantry/pantries/${pantryId}/members`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || `Errore nel recuperare i membri della dispensa`)

    return data
}


// GESTIONE RIMOZIONE MEMBRI DISPENSA ✅
export async function deleteMember(
    pantryId: number,
    memberId: number) {

    const res = await fetch(`${API}/pantry/pantries/${pantryId}/members/${memberId}`, {
        method: "DELETE",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante l'eliminazione di un membro")

    return data
}

// ELIMINA DISPENSA (elimina prodotti e membri al suo interno) ✅
export async function deletePantry(
    pantryId: number) {

    const res = await fetch(`${API}/pantry/pantries/${pantryId}/leave`, {
        method: "DELETE",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante l'abbandono della dispensa")

    return data
}


/*
############################
### AZIONI SUI PRODOTTI ####
############################
*/

// AGGIUNGI PRODOTTO ALLA DISPENSA ❌

// PRODOTTI DISPENSA SPECIFICA ✅
export async function pantryProducts(pantryId: number) {

    const res = await fetch(`${API}/pantry-items/pantries/${pantryId}/items`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || `Errore nel recuperare i prodotti della dispensa numero ${pantryId}`)

    return data
}

// LISTA DISPENSE ✅
export async function allPantries() {

    const res = await fetch(`${API}/pantry/pantries`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore nel recuperare le dispense")

    return data
}

// TUTTE LE SCADENZE ✅
export async function allExpiringProducts() {

    const res = await fetch(`${API}/pantry-items/products/expiring`, {
        method: "GET",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore nel recuperare i prodotti in scadenza")

    return data
}

// MODIFICA QUANTITA/SCADENZE PRODOTTO  ✅
export async function updateProduct(
    pantryId: number,
    itemId: number,
    quantityProduct: number,
    expirationProduct: string) {

    const authHeaders = await auth();

    const res = await fetch(`${API}/pantry-items/pantries/${pantryId}/items/${itemId}`, {
        method: "PATCH",
        headers: {
            ...authHeaders,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ quantity: quantityProduct, expiration_date: expirationProduct })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante la modifica del prodotto")

    return data
}

// CONSUMO PRODOTTO ❌

// ELIMINA PRODOTTO ✅
export async function deleteProduct(
    pantryId: number,
    itemId: number) {

    const res = await fetch(`${API}/pantry-items/pantries/${pantryId}/items/${itemId}`, {
        method: "DELETE",
        headers: await auth()
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || "Errore durante l'eliminazione del prodotto")

    return data
}