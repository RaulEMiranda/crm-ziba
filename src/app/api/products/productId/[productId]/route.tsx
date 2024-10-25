import { db } from "@/firebase/config";
import { Product } from "@/types/product";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { error: "No se proporcionó ID de producto" },
      { status: 400 }
    );
  }

  try {
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const productData = productDoc.data();
    const product = { id: productDoc.id, ...productData };
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  const body = await req.json();
  const { barcodes } = body;

  if (!productId || !barcodes || !Array.isArray(barcodes)) {
    return NextResponse.json(
      { error: "Datos insuficientes o inválidos" },
      { status: 400 }
    );
  }

  try {
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const productData = productDoc.data() as Product;
    const { barcode, soldBarcodes = [] } = productData;

    // Mover códigos de barras vendidos
    const updatedBarcodes = barcode.filter((code) => !barcodes.includes(code));
    const updatedSoldBarcodes = [...soldBarcodes, ...barcodes];

    // Actualizar el producto en Firestore
    await updateDoc(productRef, {
      barcode: updatedBarcodes,
      soldBarcodes: updatedSoldBarcodes,
    });

    return NextResponse.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}
