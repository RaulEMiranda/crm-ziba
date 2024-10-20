// lib/validators/barcode.ts
import { z } from "zod";

export const barcodeSchema = z.object({
  barcode: z
    .string()
    .min(1, "El código de barras es obligatorio") // Asegúrate de que no esté vacío
    .max(20, "El código de barras no puede tener más de 20 caracteres"), // Limita la longitud si es necesario
});

export type BarcodeFormValues = z.infer<typeof barcodeSchema>;