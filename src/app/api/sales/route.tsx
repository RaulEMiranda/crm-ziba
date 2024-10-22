import { db } from "@/firebase/config";
import { Sale } from "@/types/sale";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const salesRef = collection(db, "sales");

    const querySnapshot = await getDocs(salesRef);

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.clientId ||
      !body.priceTotal ||
      !body.products ||
      !Array.isArray(body.products) ||
      body.products.length === 0
    ) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    for (const product of body.products) {
      if (!product.productId || !product.quantity) {
        return NextResponse.json(
          { error: "Todos los campos de productos son obligatorios" },
          { status: 400 }
        );
      }
    }

    const newSale: Omit<Sale, "id" | "createdAt"> & { createdAt: Timestamp } = {
      ...body,
      createdAt: Timestamp.now(),
    };

    const salesRef = collection(db, "sales");
    const docRef = await addDoc(salesRef, newSale);

    return NextResponse.json({ id: docRef.id, ...newSale }, { status: 201 });
  } catch (error) {
    console.error("Error al agregar venta:", error);
    return NextResponse.json(
      { error: "Error al agregar venta" },
      { status: 500 }
    );
  }
}
