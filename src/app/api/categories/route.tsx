import { db } from "@/firebase/config";
import { Category } from "@/types/product";

import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoriesRef = collection(db, "categories");

    const querySnapshot = await getDocs(categoriesRef);

    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Category, "id">;
      categories.push({ id: doc.id, ...data });
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}
