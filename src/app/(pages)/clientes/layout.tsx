import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clientes",
    description: "Sistema de Gestión Comercial Ziba",
}

export default function RootLayoutClients(
    {children} : Readonly<{
        children: React.ReactNode;
      }>
){
    return <>
        {children}
    </>
}