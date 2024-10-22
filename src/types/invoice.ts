export interface Invoice {
  id: string;
  saleId: string;
  customerId: string;
  type: "receipt" | "invoice";
  totalAmount: number; 
  issuedAt: Date; 
  status: "issued" | "cancelled"; 
  pdfUrl?: string; 
}
