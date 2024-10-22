import { db } from "@/firebase/config";
import { Product } from "@/types/product";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productsRef = collection(db, "products");

    const querySnapshot = await getDocs(productsRef);

    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Product, "id">;
      products.push({ id: doc.id, ...data });
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
