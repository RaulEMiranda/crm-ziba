"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { ProductFormValues, productSchema } from "@/lib/validators/product";
import { Category } from "@/types/product";
import { LoaderEditProductModal } from "@/components/Loaders";

interface EditProductProps {
  open: boolean;
  handleClose: () => void;
  productId: string | null;
}

export default function EditProduct({
  open,
  handleClose,
  productId,
}: EditProductProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          const productData = productDoc.data() as ProductFormValues;
          setValue("name", productData.name);
          setValue("price", productData.price);
          setValue("category", productData.category);
          setValue("color", productData.color);
        }
      }
    };

    fetchProduct();
  }, [productId, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const categoryList: Category[] = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        category: doc.data().category,
      }));
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    setError(false);
    setLoaderOpen(true);

    // Agregar campos adicionales
    const updatedData = {
      ...data,
      updatedAt: serverTimestamp(), // Campo de timestamp de actualización
    };

    try {
      if (productId) {
        await updateDoc(doc(db, "products", productId), updatedData);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setLoaderOpen(false);
          reset();
          setSuccess(false);
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setLoading(false);
      setError(true);
      setTimeout(() => {
        setLoaderOpen(false);
        setError(false);
      }, 3000);
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
            width: 600,
          }}
        >
          <Typography variant="h6" gutterBottom >
            Editar Producto
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" >
            <Stack direction="row" spacing={2} mb={2} mt={1}>
              <TextField
                label="Nombre"
                {...register("name")}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : null}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Precio"
                type="number"
                {...register("price", {
                  required: "Precio es requerido",
                  valueAsNumber: true,
                  validate: {
                    positive: (value) =>
                      value >= 0 || "El precio debe ser un número positivo",
                    maxDecimals: (value) => {
                      const decimalPart = value.toString().split(".")[1];
                      return (
                        !decimalPart ||
                        decimalPart.length <= 2 ||
                        "Solo se permiten hasta 2 decimales"
                      );
                    },
                  },
                })}
                fullWidth
                margin="normal"
                error={!!errors.price}
                helperText={errors.price ? errors.price.message : null}
                inputProps={{
                  step: "0.01",
                  min: "0",
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-label"
                  {...register("category")}
                  defaultValue=""
                  label="Categoría"
                  onChange={(e) => setValue("category", e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
              <TextField
                label="Color"
                {...register("color")}
                fullWidth
                margin="normal"
                error={!!errors.color}
                helperText={errors.color ? errors.color.message : null}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Stack>
            <Box
              mt={2}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <LoaderEditProductModal
        open={loaderOpen}
        loading={loading}
        success={success}
        error={error}
      />
    </>
  );
}
