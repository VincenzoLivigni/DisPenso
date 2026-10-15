import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface TokenContextType {
  token: number;
  setToken: Dispatch<SetStateAction<number>>;
  carToken: number;
  setCarToken: Dispatch<SetStateAction<number>>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number>(0);

  const [carToken, setCarToken] = useState<number>(0);

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
