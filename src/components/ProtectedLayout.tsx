"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext"; // Contexto de autenticación
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";

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
    return <div>Cargando</div>;
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
