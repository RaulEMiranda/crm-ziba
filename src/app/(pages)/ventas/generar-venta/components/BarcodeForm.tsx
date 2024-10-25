"use client";
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { api } from "@/lib/utils"; // Asegúrate de importar esto correctamente
import { Product } from "@/types/product"; // Importa tu tipo Product

interface BarcodeFormProps {
  onProductAdd: (newProduct: Product, barcode: string) => void;
  products: Product[];
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({ onProductAdd, products }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ barcode: string }>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: { barcode: string }) => {
    const { barcode } = data;
  
    try {
      const response = await api.get(`/products/barcode/${barcode}`);
      const product: Product = response.data;
  
      // Verificar si el producto ya existe en la tabla, no por el barcode, sino por el id
      const existingProduct = products.find((p) => p.id === product.id);
  
      if (existingProduct) {
        // Si el producto ya existe, llamamos al método para sumar la cantidad de ese modelo
        onProductAdd(product, barcode);
        setValue("barcode", "");
        setErrorMessage("");
      } else {
        // Si es un producto nuevo, lo añadimos normalmente
        onProductAdd(product, barcode);
        setValue("barcode", "");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setErrorMessage("Error al agregar el producto.");
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
      <TextField
        {...register("barcode", {
          required: "El código de barras es requerido",
        })}
        label="Escanéa aquí el código de Barras"
        variant="outlined"
        fullWidth
        margin="normal"
        className="bg-white"
        error={!!errorMessage || !!errors.barcode}
        helperText={errorMessage || errors.barcode?.message}
      />
      <Button variant="contained" color="primary" type="submit" className="mt-3">
        Añadir Producto
      </Button>
    </Box>
  );
};

export default BarcodeForm;
