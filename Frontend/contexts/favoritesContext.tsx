
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    getStorageItem,
    saveStorageItem,
} from "../services/storage";

type FavoritesContextType = {
    favorites: any[];
    toggleFavorite: (recipe: any) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
    undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function loadFavorites() {
            try {
                const saved = await getStorageItem("favorite_recipes");

                if (saved) {
                    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
                    setFavorites(Array.isArray(parsed) ? parsed : []);
                }
            } catch (error) {
                console.error("Errore nel caricamento dei preferiti:", error);
            } finally {
                setLoaded(true);
            }
        }

        loadFavorites();
    }, []);

    const toggleFavorite = (recipe: any) => {
        setFavorites((current) => {
            const exists = current.some((item) => item.id === recipe.id);

            const updated = exists
                ? current.filter((item) => item.id !== recipe.id)
                : [...current, recipe];

            void saveStorageItem("favorite_recipes", JSON.stringify(updated));
            return updated;
        });
    };

    if (!loaded) return null;

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            "useFavorites deve essere usato dentro FavoritesProvider",
        );
    }

    return context;
}
