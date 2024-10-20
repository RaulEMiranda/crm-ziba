import { z } from "zod";

export const categorySchema = z.object({
  category: z
    .string()
    .min(1, { message: "El nombre de la categoría es requerido" })
    .max(50, { message: "El nombre de la categoría no puede exceder los 50 caracteres" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
