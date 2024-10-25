import { db } from "@/firebase/config";
import { Client } from "@/types/client"; 
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("hola 1");
    
    const { address, email, name, phone, dni, purchaseHistory } = body;

    if (!address || !email || !name || !phone || !dni) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }
    console.log("hola 2");
    const clientsRef = collection(db, "clients");

    // Agregar cliente a Firestore
    const newClient: Omit<Client, "id"> = {
      address,
      email,
      name,
      phone,
      dni,
      purchaseHistory: purchaseHistory || [], // Si no se envía, será un array vacío
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log("hola 3");
    const docRef = await addDoc(clientsRef, newClient);

    return NextResponse.json({ id: docRef.id, ...newClient }, { status: 201 });
  } catch (error) {
    console.error("Error al agregar cliente:", error);
    return NextResponse.json(
      { error: "Error al agregar cliente" },
      { status: 500 }
    );
  }
}