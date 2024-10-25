import { Timestamp } from 'firebase/firestore';

export interface Sale {
  id: string;
  clientId: string;
  createdAt: Date | Timestamp;
  priceTotal: number;
  products: {
    productId: string;
    quantity: number;
    barcodes: string[];
  }[];
}
