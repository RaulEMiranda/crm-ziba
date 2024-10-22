"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext"; // Contexto de autenticación
import Sidebar from "@/components/Sidebar";
import { Backdrop, Box, CircularProgress } from "@mui/material";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth(); // Verifica el estado de autenticación y carga
  const isLoginPage = pathname === "/iniciar-sesion";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/iniciar-sesion");
    }
  }, [user, loading, router, isLoginPage]);

  if (loading || (!user && !isLoginPage)) {
    return <Backdrop
    open={true} 
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 1300, // asegúrate de que esté en el frente
      backgroundColor: "rgba(0, 0, 0, 0.7)", // color semi-transparente
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress size={60} thickness={5} color="primary" />
  </Backdrop>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      {!isLoginPage && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",

          mx: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
