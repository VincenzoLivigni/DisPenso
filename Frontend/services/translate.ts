import { getStorageItem, saveStorageItem } from "./storage"
import { RecipeDetails } from "./spoonacular"

// traduzione del titolo della ricetta
export async function translateText(text: string): Promise<string> {
    // se il titolo della ricetta è vuoto
    if (!text) return ""

    const cache = `translation_${text.trim().toLowerCase()}`

    try {
        // controllo se la traduzione è già salvata nello storage
        const cachedTranslation = await getStorageItem(cache)
        if (cachedTranslation) {
            return cachedTranslation
        }

        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|it`)

        const data = await res.json()

        // traduzione del titolo
        if (data && data.responseData && data.responseData.translatedText) {
            const translatedText = data.responseData.translatedText

            // salvataggio della traduzione nello storage per risparmiare chiamate API
            await saveStorageItem(cache, translatedText)

            return translatedText
        }

        // se la traduzione non avviene con successo restituisce il testo in inglese
        return text
    }
    catch (err) {
        console.log("Errore di traduzione:", err)

        // se dovessero esserci problemi di rete restituisce il testo in inglese
        return text
    }
}

// traduzione dell'intera ricetta
export async function translateRecipeDetails(recipe: RecipeDetails): Promise<RecipeDetails> {
    // se non ho accesso alla ricetta
    if (!recipe) return recipe

    // traduzione del titolo
    const translatedTitle = await translateText(recipe.title)

    // traduzione degli ingredienti
    const translatedIngredients = await Promise.all(
        // map degli ingredienti
        recipe.extendedIngredients.map(async (ing) => {
            const cleanOriginalText = sanitizeIngredientText(ing.original)
            const cleanName = ing.name ? sanitizeIngredientText(ing.name) : ing.name

            return {
                ...ing,
                original: await translateText(cleanOriginalText),
                name: ing.name ? await translateText(cleanName) : cleanName
            }
        })
    )

    // traduzione dei passaggi della preparazione con pulizia testo
    const translatedInstructions = await Promise.all(
        // map dei blocchi di istruzioni
        recipe.analyzedInstructions.map(async (block) => ({
            ...block,

            // traduzione del nome del blocco
            name: block.name ? await translateText(block.name) : block.name,
            // map dei passaggi
            steps: await Promise.all(
                block.steps.map(async (step) => {
                    // pulizia testo originale
                    const cleanStepText = sanitizeStepText(step.step)

                    // traduzione passaggi
                    const translatedStep = await translateText(cleanStepText)

                    return {
                        ...step,
                        step: translatedStep
                    }

                })
            )
        }))
    )

    return {
        ...recipe,
        title: translatedTitle,
        extendedIngredients: translatedIngredients,
        analyzedInstructions: translatedInstructions
    }
}

function sanitizeIngredientText(text: string): string {
    if (!text) return ""

    let cleaned = text

    // Rimuove pattern come "/ 7 oz.", "or 5 once", ecc.
    cleaned = cleaned.replace(/\/[\d\.\s]+(oz|once|lb|libbre|g|grammi)\b/gi, '')
    cleaned = cleaned.replace(/\b(or|oppure)\s+[\d\.\s]+(oz|once|lb|libbre)\b/gi, '')

    // Rimuove parentesi con unità imperiali (es. 7 oz)
    cleaned = cleaned.replace(/\([^)]*(oz|once|lb|libbre)[^)]*\)/gi, '')

    // Pulizia spazi
    cleaned = cleaned.replace(/\s+/g, ' ').trim()

    return cleaned
}

// funzione di supporto per rimuovere equivalenze in US e sintesi del testo originale
function sanitizeStepText(text: string): string {
    if (!text) return ""

    let cleaned = text

    // rimozione di equivalenze in US
    cleaned = cleaned.replace(/(\/|\bor\b|\boppure\b)?\s*[\d\.\s]+°?\s*[fF]\b/gi, '')
    cleaned = cleaned.replace(/\([^)]*\)/g, '')

    // rimozione dei numeri iniziali attaccati
    cleaned = cleaned.replace(/^\s*\d+[\.\)]\s*/, '') // Numeri a inizio stringa assoluta
    cleaned = cleaned.replace(/(?<=\.|\?|\!)\s*\d+[\.\)]\s*/g, '') // Numeri dopo la fine di una frase precedente
    cleaned = cleaned.replace(/([a-zA-Z])\d+[\.\)]\s*/g, '$1 ') // Lettera attaccata a numero e punto (es. "testo3.Testo")

    // pulizia degli spazi post rimozione
    cleaned = cleaned.replace(/\s+/g, ' ').trim()

    return cleaned
}