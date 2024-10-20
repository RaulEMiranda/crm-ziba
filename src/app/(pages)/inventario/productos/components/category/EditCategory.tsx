"use client";

import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { CategoryFormValues, categorySchema } from "@/lib/validators/category";
import FullScreenLoader from "@/components/Loader";

interface EditCategoryProps {
  open: boolean;
  handleClose: () => void;
  categoryId: string | null;
}

export default function EditCategory({
  open,
  handleClose,
  categoryId,
}: EditCategoryProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        const categoryDoc = await getDoc(doc(db, "categories", categoryId));
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data() as CategoryFormValues;
          setValue("category", categoryData.category);
        }
      }
    };

    fetchCategory();
  }, [categoryId, setValue]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      if (categoryId) {
        await updateDoc(doc(db, "categories", categoryId), {
          category: data.category,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    } finally {
      setLoading(false);
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
            Editar Categoría
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Categoría"
              {...register("category")}
              fullWidth
              margin="normal"
              error={!!errors.category}
              helperText={errors.category ? errors.category.message : null}
              slotProps={{
                inputLabel: { shrink: true },
              }}
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
      <FullScreenLoader loading={loading} />
    </>
  );
}
