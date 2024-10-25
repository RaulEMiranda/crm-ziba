import { db } from "@/firebase/config";
import { Sale } from "@/types/sale";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  console.log(params);
  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { error: "No se proporcionó clientId" },
      { status: 400 }
    );
  }

  try {
    const salesRef = collection(db, "sales");
    const q = query(salesRef, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "No se encontraron ventas para el clientId proporcionado" },
        { status: 404 }
      );
    }

    const sales: Sale[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Sale, "id">;
      sales.push({ id: doc.id, ...data });
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas" },
      { status: 500 }
    );
  }
}
