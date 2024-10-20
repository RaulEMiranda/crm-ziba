import type { Metadata } from "next";
import "./globals.css";
import ProtectedLayout from "@/components/ProtectedLayout";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "Gestion Ziba",
  description: "Sistema de Gestión Comercial Ziba",
  icons: {
    icon:"/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
