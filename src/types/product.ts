export interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  price: string;
  barcode: Barcode[];
  createdAt: Date | FirebaseFirestore.Timestamp;
}

export interface Barcode {
  barcode: string;
  createdAt: Date | FirebaseFirestore.Timestamp;
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
