import { db } from "@/firebase/config";
import { Client } from "@/types/client"; 
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientsRef = collection(db, "clients");

    const querySnapshot = await getDocs(clientsRef);

    const clients: Client[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Client, "id">; 
      clients.push({ id: doc.id, ...data });
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}
