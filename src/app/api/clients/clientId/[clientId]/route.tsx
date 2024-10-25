import { db } from "@/firebase/config";
import { Client } from "@/types/client";
import { collection, doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { error: "No se proporcionó clientId" },
      { status: 400 }
    );
  }

  try {
    const clientDocRef = doc(collection(db, "clients"), clientId);
    const clientDoc = await getDoc(clientDocRef);

    if (!clientDoc.exists()) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const client = { id: clientDoc.id, ...clientDoc.data() } as Client;
    return NextResponse.json(client);
  } catch (error) {
    console.error("Error al obtener cliente por clientId:", error);
    return NextResponse.json(
      { error: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}
