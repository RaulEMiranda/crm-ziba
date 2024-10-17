"use client";

import React, { useState } from "react";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { CategoryFormValues, categorySchema } from "@/lib/validators/category";
import { LoaderAddCategoryModal } from "@/components/Loaders";

interface CategoryModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddCategoryModal({
  open,
  handleClose,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError, // Para establecer errores personalizados
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(false); // Error de servidor
  const [loaderOpen, setLoaderOpen] = useState(false);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    setServerError(false); // Resetea el error de servidor
    setLoaderOpen(true);

    try {
      const q = query(
        collection(db, "categories"),
        where("category", "==", data.category)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoaderOpen(false);
        setError("category", {
          type: "manual",
          message: "La categoría ya existe",
        });
        throw new Error("category_exists");
      }

      // Si no existe, agregar categoría
      await addDoc(collection(db, "categories"), { category: data.category });

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setLoaderOpen(false);
        reset();
        setSuccess(false);
        handleClose();
      }, 1500);
    } catch (error) {
      if (error instanceof Error && error.message === "category_exists") {
        // Si el error es de tipo `Error` y es "category_exists"
        setLoading(false);
        return;
      }

      // Si ocurre un error de servidor diferente, lo manejamos
      setServerError(true);
      setLoading(false);
      setTimeout(() => {
        setLoaderOpen(false);
        setServerError(false);
      }, 1500);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Agregar Categoría
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Nombre de la Categoría"
              {...register("category")}
              fullWidth
              margin="normal"
              error={!!errors.category}
              helperText={errors.category ? errors.category.message : null}
            />
            <Box
              mt={2}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <LoaderAddCategoryModal
        open={loaderOpen}
        loading={loading}
        success={success}
        error={serverError} // Mostrar solo si es un error de servidor
      />
    </>
  );
}
