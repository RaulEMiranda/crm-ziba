"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { api } from "@/lib/utils";
import BarcodeForm from "./BarcodeForm"; // Importamos el nuevo componente
import FullScreenLoader from "@/components/Loader";

interface BoletaProduct extends Product {
  quantity: number;
  totalPrice: number;
  skus: string[]; // Agregamos un campo para almacenar los barcodes (SKU)
}

const GenBoletaForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ barcode: string }>();
  const [products, setProducts] = useState<BoletaProduct[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { barcode: string }) => {
    const { barcode } = data;

    // Verificar si el barcode ya existe en los productos
    const existingProduct = products.find((p) => p.skus.includes(barcode));

    if (existingProduct) {
      setError("Este producto ya se agregó al comprobante");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/products/${barcode}`);
      const product: Product = response.data;

      const newProduct = {
        ...product,
        quantity: 1,
        totalPrice: parseFloat(product.price),
        skus: [barcode], // Inicializamos la lista de skus con el primer barcode
      };

      // Verificar si el producto ya está en la boleta
      const existingBoletaProduct = products.find((p) => p.id === product.id);
      if (existingBoletaProduct) {
        // Actualizar la cantidad y el total si ya existe en la boleta
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                  totalPrice: (p.quantity + 1) * parseFloat(product.price),
                  skus: [...p.skus, barcode], // Agregar el nuevo barcode (SKU)
                }
              : p
          )
        );
      } else {
        // Si el producto no existe, lo añadimos
        setProducts((prevProducts) => [...prevProducts, newProduct]);
      }

      // Resetear el input y el error
      setValue("barcode", "");
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error al agregar el producto:", error);
      setError("Error al agregar el producto.");
    }
  };

  const handleGenerateBoleta = async () => {
    try {
      setLoading(true);

      // Suponiendo que ya tienes el ID del cliente (puedes modificar esta parte)
      const clientId = "client-id"; // Asigna el ID real del cliente

      const saleData = {
        clientId,
        priceTotal: products.reduce(
          (total, product) => total + product.totalPrice,
          0
        ),
        products: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })),
      };

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error("Error al generar la boleta");
      }

      const data = await response.json();
      console.log("Boleta generada exitosamente", data);

      // Aquí puedes hacer algo con los datos retornados, como limpiar el formulario o mostrar un mensaje de éxito

      setLoading(false);
    } catch (error) {
      console.error("Error al generar la boleta:", error);
      setLoading(false);
    }
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.totalPrice,
    0
  );

  return (
    <>
      <Box>
        <BarcodeForm
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          errorMessage={error}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="min-w-[200px] max-w-[300px]">
                Nombre
              </TableCell>
              <TableCell className="min-w-[200px] max-w-[250px]">
                SKU (Barcodes)
              </TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Precio Final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="min-w-[200px] max-w-[300px]">
                  {product.name}
                </TableCell>
                <TableCell className="min-w-[200px] max-w-[250px]">
                  {product.skus.join(", ")}
                </TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={4}>
          <Typography variant="h6">Total: {totalPrice.toFixed(2)}</Typography>
        </Box>

        {/* Botón para generar la boleta */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateBoleta}
          disabled={products.length === 0 || loading}
        >
          Generar Boleta
        </Button>
      </Box>
      <FullScreenLoader loading={loading} />
    </>
  );
};

export default GenBoletaForm;
