export interface SaleProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerId: string;
  products: SaleProduct[];
  totalAmount: number;
  saleDate: Date;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
}
