import { db } from "@/firebase/config";
import { Product } from "@/types/product";
import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const { barcode } = params;
  console.log(barcode);
  if (!barcode) {
    return NextResponse.json(
      { error: "No se proporcionó código de barras" },
      { status: 400 }
    );
  }

  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    let foundProduct: Product | null = null;

    querySnapshot.forEach((doc) => {
      const product = doc.data() as Product;
      if (product.barcode) {
        product.barcode.forEach((code) => {
          if (code === barcode) { // Compara directamente con el string
            foundProduct = { ...product, id: doc.id }; // Solo asigna id una vez
          }
        });
      }
    });

    if (!foundProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(foundProduct);
  } catch (error) {
    console.error("Error al obtener producto por código de barras:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}
