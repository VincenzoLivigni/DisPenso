import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { getStorageItem, saveStorageItem } from "../services/storage";
import { Platform } from "react-native";

interface TokenContextType {
  token: number;
  setToken: Dispatch<SetStateAction<number>>;
  carToken: number;
  setCarToken: Dispatch<SetStateAction<number>>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem("app_token_count");
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  const [carToken, setCarToken] = useState<number>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem("app_car_token_count");
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    async function loadTokens() {
      try {
        if (Platform.OS !== 'web') {
          const storedToken = await getStorageItem("app_token_count");
          if (storedToken) setToken(Number(storedToken));

          const storedCarToken = await getStorageItem("app_car_token_count");
          if (storedCarToken) setCarToken(Number(storedCarToken));
        }
      } catch (err) {
        console.log("Errore caricamento token da storage:", err);
      }
    }
    loadTokens();
  }, []);

  // slavo token spoonacular nello storage ogni volta che cambiano
  useEffect(() => {
    saveStorageItem("app_token_count", token.toString());
  }, [token]);

  // salvo caratteri tradotti nello storage ogni volta che cambiano
  useEffect(() => {
    saveStorageItem("app_car_token_count", carToken.toString());
  }, [carToken]);

  return (
    <TokenContext.Provider value={{ token, setToken, carToken, setCarToken }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);

  if (context === undefined) {
    throw new Error("useToken deve essere usato dentro TokenProvider");
  }

  return context;
}
