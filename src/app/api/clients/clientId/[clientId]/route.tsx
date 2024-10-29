import { db } from "@/firebase/config";
import { Client } from "@/types/client";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
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

export async function PUT(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const body = await req.json();

    // Referencia al cliente que se quiere actualizar
    const clientRef = doc(db, "clients", params.clientId);

    // Crear el objeto de actualización solo con los campos que están presentes en el cuerpo
    const updatedClient: Partial<Client> = {
      updatedAt: serverTimestamp(), // Marca la fecha de actualización
    };

    // Añadir solo los campos que han sido enviados en la solicitud
    if (body.address) updatedClient.address = body.address;
    if (body.email) updatedClient.email = body.email;
    if (body.name) updatedClient.name = body.name;
    if (body.phone) updatedClient.phone = body.phone;
    if (body.dni) updatedClient.dni = body.dni;

    // Actualizar el cliente en Firestore
    await updateDoc(clientRef, updatedClient);

    return NextResponse.json(
      { id: params.clientId, ...updatedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}
