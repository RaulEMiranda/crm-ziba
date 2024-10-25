  import { Timestamp, FieldValue } from 'firebase/firestore';

  export interface Client {
    id: string;
    address: string;
    createdAt: Date | Timestamp | FieldValue;
    email: string;
    name: string;
    phone: string;
    dni: string;
    purchaseHistory: string[];
    updatedAt: Date | Timestamp | FieldValue;
  }
