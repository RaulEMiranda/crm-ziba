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
import { ProductFormValues, productSchema } from "@/lib/validators/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { LoaderAddProductModal } from "@/components/Loaders";
import { Category } from "@/types/product";

interface ProductModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddProductModal({
  open,
  handleClose,
}: ProductModalProps) {
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
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoryList: Category[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        category: doc.data().category, // Asegúrate de incluir la propiedad category
      }));
      setCategories(categoryList);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    setError(false);
    setLoaderOpen(true);

    // Agregar campos adicionales
    const newData = {
      ...data,
      barcode: [], 
      createdAt: serverTimestamp(), 
    };

    try {
      await addDoc(collection(db, "products"), newData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setLoaderOpen(false);
        reset();
        setSuccess(false);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error al añadir producto: ", error);
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
          <Typography variant="h6" gutterBottom>
            Agregar Producto
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" spacing={2} mb={2} mt={1}>
              <TextField
                label="Nombre"
                {...register("name")}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : null}
              />
              <TextField
                label="Precio"
                type="number" // Cambiar a tipo number
                {...register("price", {
                  required: "Precio es requerido",
                  valueAsNumber: true, // Asegúrate de que el valor se maneje como número
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
      <LoaderAddProductModal
        open={loaderOpen}
        loading={loading}
        success={success}
        error={error}
      />
    </>
  );
}
