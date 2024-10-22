"use client"
// components/ProductList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        setError("Error al obtener los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography color="text.secondary">Categoría: {product.category}</Typography>
              <Typography color="text.secondary">Color: {product.color}</Typography>
              <Typography variant="body2">Precio: ${product.price}</Typography>
              <Typography variant="body2">Códigos de Barras:</Typography>
              {product.barcode.map((b) => (
                <Typography key={b.barcode}>{b.barcode}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
