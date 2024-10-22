export interface Sale {
  id: string;
  clientId: string;
  createdAt: Date | FirebaseFirestore.Timestamp;
  priceTotal: number;
  products: {
    productId: string;
    quantity: number;
  }[];
}
