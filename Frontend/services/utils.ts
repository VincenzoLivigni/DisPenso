export const expirationBadge = (expirationDate?: string | null) => {
    // se il prodotto non ha una scadenza specificata
    if (!expirationDate) return { text: "Senza scadenza", bg: "#f0f0f0", color: "#555", border: "#555" }

    // data attuale
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // data di scadenza del prodott
    const expDate = new Date(expirationDate)
    expDate.setHours(0, 0, 0, 0)

    // differenza convertita in giorni => data scadenza - data attuale
    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
        // se il prodotto è scaduto
        return { text: "Scaduto", bg: "#f3f4f6", color: "#6b7280", border: "#6b7280" }
    } else if (diffDays <= 3 && diffDays && diffDays >= 0) {
        // se mancano 3 giorni alla scadenza
        return { text: `Scade tra ${diffDays} giorni`, bg: "#fcdcdc", color: "#ff4800", border: "#ff4800" }
    } else if (diffDays > 3 && diffDays <= 7) {
        // se mancano 4/7 giorni alla scadenza
        return {
            text: `Scade tra ${diffDays} giorni`, bg: "#ffedd5", color: "#ffa646", border: "#ffa646"
        }
    } else {
        // se mancano più di 7 giorni alla scadenza
        return { text: `Scade tra ${diffDays} giorni`, bg: "#dcfce7", color: "#15803d", border: "#15803d" }
    }
}