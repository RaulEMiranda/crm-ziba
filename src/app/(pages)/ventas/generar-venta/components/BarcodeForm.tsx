"use client";
import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface BarcodeFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: UseFormRegister<{ barcode: string }>;
  errors: FieldErrors<{ barcode: string }>;
  errorMessage: string;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({
  onSubmit,
  register,
  errors,
  errorMessage,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit} mb={4}>
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
      <Button variant="contained" color="primary" type="submit">
        Añadir Producto
      </Button>
    </Box>
  );
};

export default BarcodeForm;
