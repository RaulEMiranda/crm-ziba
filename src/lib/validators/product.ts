import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  color: z.string().min(1, "El color es requerido"),
  price: z.number()
    .min(0, "El precio debe ser un número positivo")
    .refine(value => {
      const decimalPart = value.toString().split(".")[1];
      return !decimalPart || decimalPart.length <= 2;
    }, {
      message: "Solo se permiten hasta 2 decimales",
    }),

});

export type ProductFormValues = z.infer<typeof productSchema>;
