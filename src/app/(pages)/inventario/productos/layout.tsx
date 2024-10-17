import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description: "Sistema de Gestión Comercial Ziba",
};

export default function RootLayoutProducts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
