import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface TokenContextType {
  token: number;
  setToken: Dispatch<SetStateAction<number>>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<number>(0);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
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
