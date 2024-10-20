"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/config";

// Define la estructura del contexto, incluyendo tipos para el usuario y el estado de carga
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Establece el valor inicial del contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode; // Define el tipo de children
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null); // Permitir que sea de tipo User o null
  const [loading, setLoading] = useState(true); // Añadir estado de loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null); // Aceptar tanto usuario como null
      setLoading(false); // Cuando se completa la verificación de autenticación
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
