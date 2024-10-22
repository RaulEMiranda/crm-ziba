export interface Client {
  id: string;
  address: string;
  createdAt: Date | FirebaseFirestore.Timestamp;
  email: string;
  name: string;
  phone: string;
  purchaseHistory: string[];
  updatedAt: Date | FirebaseFirestore.Timestamp;
}
