import React, { createContext, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

// Define el tipo del contexto
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define el tipo de las props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Crea el contexto con el tipo definido
export const AuthContext = createContext({} as AuthContextType);

// Crea el proveedor del contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  React.useEffect(() => {
    const checkToken = async () => {
      const savedToken = await SecureStore.getItemAsync("userToken");
      if (savedToken) {
        setIsAuthenticated(true);
      }
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
