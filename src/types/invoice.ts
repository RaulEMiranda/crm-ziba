export interface Invoice {
  id: string; // Invoice ID, could match the sale ID
  saleId: string; // Reference to the sale ID
  customerId: string; // Reference to the customer ID
  type: "receipt" | "invoice"; // Type of document issued
  totalAmount: number; // Total amount of the document
  issuedAt: Date; // Date when the document was issued
  status: "issued" | "cancelled"; // Status of the document
  pdfUrl?: string; // URL of the PDF document if stored in Firebase Storage
}
