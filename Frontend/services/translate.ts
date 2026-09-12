export async function translateText(text: string): Promise<string> {
    // se il titolo della ricetta è vuoto
    if (!text) return ""

    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|it`)

        const data = await res.json()

        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText
        }
    }
    catch (err) {
        console.log("Errore di traduzione:", err)
    }

    // se la traduzione non avviene con successo restituisce il testo in inglese
    return text
}