export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dni?: string;
  ruc?: string;
  registeredAt: Date;
}