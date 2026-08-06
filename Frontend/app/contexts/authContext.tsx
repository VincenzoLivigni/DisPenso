import { createContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser } from "../services/api";
import { saveStorageItem, getStorageItem, deleteStorageItem } from "../services/storage";

interface AuthContextType {
    token: string | null,
    loading: boolean,
    register: (email: string, password: string) => Promise<any>,
    login: (email: string, password: string) => Promise<void>,
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadToken = async () => {
            try {
                const savedToken = await getStorageItem("token");
                if (savedToken) setToken(savedToken);
            } catch (err) {
                console.log("Errore lettura token:", err);
            } finally {
                setLoading(false);
            }
        };

        loadToken();
    }, []);


    // REGISTRAZIONE
    const register = async (email: string, password: string) => {
        try {
            const data = await registerUser(email, password)

            return data
        }
        catch (err) {
            console.log("Error:", err)
            throw err
        }
    }


    // LO>GIN
    const login = async (email: string, password: string) => {
        try {
            const data = await loginUser(email, password)

            // salvataggio token 
            if (data.token) {
                await saveStorageItem("token", data.token)
                setToken(data.token)
            }
        }
        catch (err) {
            console.log("Error:", err)
            throw err
        }
    }

    // LOGOUT
    const logout = async () => {
        await deleteStorageItem("token")
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}