import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  price: string;
  barcode: string[]; // Códigos de barras disponibles
  soldBarcodes: string[]; // codigos de barras vendidos
  createdAt: Date | Timestamp;
}

export interface Category {
  id: string;
  category: string;
}

export interface Report {
  id: string;
  reportType: "sales" | "products" | "customers";
  generatedAt: Date;
  details: string[];
}
