import { db } from "@/firebase/config";
import { Client } from "@/types/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
  { params }: { params: { dni: string } }
) {
  console.log(params);
  const { dni } = params;
  

  if (!dni) {
    return NextResponse.json(
      { error: "No se proporcionó DNI" },
      { status: 400 }
    );
  }

  try {
    const clientsRef = collection(db, "clients");
    const q = query(clientsRef, where("dni", "==", dni));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const clientDoc = querySnapshot.docs[0];
    const client = { id: clientDoc.id, ...clientDoc.data() } as Client;
    return NextResponse.json(client);
  } catch (error) {
    console.error("Error al obtener cliente por DNI:", error);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}
