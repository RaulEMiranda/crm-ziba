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
  TextField,
  Alert,
  Stack,
  TableContainer,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Product } from "@/types/product";
import FullScreenLoader from "@/components/Loader";
import BarcodeForm from "./BarcodeForm";
import { api, handleDownloadPDF } from "@/lib/utils";

interface BoletaProduct extends Product {
  quantity: number;
  priceTotal: number;
  skus: string[];
}

const GenBoletaForm: React.FC = () => {
  const [products, setProducts] = useState<BoletaProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<{
    dni: string;
    name: string;
    phone: string;
  }>({
    dni: "",
    name: "",
    phone: "",
  });
  const [clientError, setClientError] = useState<string>("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      dni: "",
    },
  });

  const handleProductAdd = (product: Product, barcode: string) => {
    const existingBoletaProduct = products.find((p) => p.id === product.id);
    if (existingBoletaProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                priceTotal: (p.quantity + 1) * parseFloat(product.price),
                skus: [...p.skus, barcode],
              }
            : p
        )
      );
    } else {
      const newProduct = {
        ...product,
        quantity: 1,
        priceTotal: parseFloat(product.price),
        skus: [barcode],
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    }
  };

  const handleSearchClient = async (data: { dni: string }) => {
    try {
      const response = await api.get(`/clients/${data.dni}`);
      const existingClient = response.data;
      setClient({
        dni: data.dni,
        name: existingClient.name,
        phone: existingClient.phone,
      });
      setClientError("");
    } catch (error) {
      console.log(error);
      setClient({
        dni: data.dni,
        name: "",
        phone: "",
      });
      setClientError("El cliente aún no ha sido registrado.");
    }
  };

  const handleGenerateBoleta = async () => {
    if (!client.name || !client.phone) {
      setClientError("Debes completar todos los datos del cliente.");
      return;
    }
    try {
      setLoading(true);
      let clientId;
      let ClientResponse;

      if (clientError) {
        ClientResponse = await api.post("/clients", {
          dni: client.dni,
          name: client.name,
          phone: client.phone,
          address: "sin direccion",
          purchaseHistory: [],
          email: "sin email",
        });
        clientId = ClientResponse.data.id;
      } else {
        ClientResponse = await api.get(`/clients/${client.dni}`);
        clientId = ClientResponse.data.id;
      }

      const saleData = {
        clientId,
        priceTotal: products.reduce(
          (total, product) => total + product.priceTotal,
          0
        ),
        products: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          barcodes: product.skus,
        })),
      };
      console.log(products);
      console.log(saleData);
      console.log(ClientResponse.data);

      const sale = await api.post("/sales", saleData);
      await api.put(`/clients/clientId/${ClientResponse.data.id}/purchase`, {
        purchaseId: sale.data.id,
      });
      for (const product of saleData.products) {
        await api.put(`/products/productId/${product.productId}`, {
          barcodes: product.barcodes,
        });
      }
      console.log(sale.data);
      const productsPDF = products.map((product) => ({
        barcode: product.skus,
        quantity: product.quantity,
        name: product.name,
        price: product.price.toString(),
        priceTotal: product.priceTotal.toString(),
      }));
      reset();
      setClient({ dni: "", name: "", phone: "" });
      setProducts([]);
      setClientError("");
      await handleDownloadPDF({
        name: ClientResponse.data.name,
        address: ClientResponse.data.address,
        dni: ClientResponse.data.dni,
        priceTotal: sale.data.priceTotal,
        createdAt: new Date(
          sale.data.createdAt.seconds * 1000
        ).toLocaleDateString("es-ES"),
        phone: ClientResponse.data.phone,
        products: productsPDF,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error al generar la boleta:", error);
      setLoading(false);
    }
  };

  const priceTotal = products.reduce(
    (total, product) => total + product.priceTotal,
    0
  );

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(handleSearchClient)}>
          <Controller
            name="dni"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="DNI"
                variant="outlined"
                fullWidth
                className="bg-white"
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="mt-4"
          >
            Buscar Cliente
          </Button>
        </form>

        {clientError && (
          <Alert severity="warning" className="mt-3">
            {clientError}
          </Alert>
        )}

        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              disabled={!clientError}
              className="bg-white"
            />
          </Box>
          <Box flex={1}>
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              disabled={!clientError}
              className="bg-white"
            />
          </Box>
        </Stack>

        <BarcodeForm onProductAdd={handleProductAdd} products={products} />
        <TableContainer
          component={Paper}
          className="max-w-[1500px] mx-auto mt-5 border-[1px]"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>SKU (Barcodes)</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Precio Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.skus.join(", ")}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.priceTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={4}>
          <Typography variant="h6">Total: {priceTotal.toFixed(2)}</Typography>
        </Box>

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
