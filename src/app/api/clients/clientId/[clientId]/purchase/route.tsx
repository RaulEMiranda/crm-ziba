import { db } from "@/firebase/config";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;
  const { purchaseId } = await req.json(); // Esperamos recibir purchaseId en el cuerpo de la solicitud

  if (!clientId || !purchaseId) {
    return NextResponse.json(
      { error: "No se proporcionó clientId o purchaseId" },
      { status: 400 }
    );
  }

  try {
    const clientDocRef = doc(db, "clients", clientId);

    // Actualizar el campo purchaseHistory agregando el nuevo purchaseId
    await updateDoc(clientDocRef, {
      purchaseHistory: arrayUnion(purchaseId),
    });

    return NextResponse.json({ message: "Compra agregada con éxito" });
  } catch (error) {
    console.error("Error al actualizar el historial de compras:", error);
    return NextResponse.json(
      { error: "Error al actualizar el historial de compras" },
      { status: 500 }
    );
  }
}
