const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

//dettagli della singola ricetta
export interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  extendedIngredients: Array<{
    id: number;
    original: string;
    amount: number;
    unit: string;
    name: string;
  }>;
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  instructions: string;
  dishTypes: string[];
  diets: string[];
}


// Funzione per cercare ricette basate sugli ingredienti in scadenza
export async function getRecipesByExpiringProducts(ingredientsArray: string[]) {
  if (!ingredientsArray || ingredientsArray.length === 0) {
    throw new Error("Nessun ingrediente disponibile per la ricerca.");
  }

  const ingredientsQuery = ingredientsArray.join(",");

  const url = `${SPOONACULAR_BASE_URL}/findByIngredients?ingredients=${encodeURIComponent(ingredientsQuery)}&number=5&ranking=1&apiKey=${SPOONACULAR_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message ?? "Errore durante il recupero delle ricette da Spoonacular");
    }

    return data; // Restituisce un array di ricette con immagini e informazioni sugli ingredienti mancanti/usati
  } catch (err) {
    console.error("Errore Spoonacular:", err);
    throw err;
  }
}

//chiamata api con i dettagli della singola ricetta e i suoi procedimenti
export async function getRecipeInformation(recipeId: number | string): Promise<RecipeDetails> {
  if (!recipeId) {
    throw new Error("ID ricetta mancante.");
  }

  const url = `${SPOONACULAR_BASE_URL}/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message ?? "Errore durante il recupero dei dettagli della ricetta");
    }

    return data as RecipeDetails;
  } catch (err) {
    console.error(`Errore Spoonacular (ID ${recipeId}):`, err);
    throw err;
  }
}