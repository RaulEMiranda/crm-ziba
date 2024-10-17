"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ProductModal from "./components/product/AddProductModal";
import ProductTable from "./components/product/ProductTable";
import AddCategoryModal from "./components/category/AddCategoryModal";
import CategoryTable from "./components/category/CategoryTable";

export default function Inventario() {
  const [modals, setModals] = useState({
    product: false,
    category: false,
  });

  const handleOpenModal = (modal: "product" | "category") => {
    setModals({ ...modals, [modal]: true });
  };

  const handleCloseModal = (modal: "product" | "category") => {
    setModals({ ...modals, [modal]: false });
  };

  return (
    <Box sx={{ p: 3 }} mt={10}>
      {/* Contenedor para productos */}
      <Box sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("product")}
          >
            Añadir Producto
          </Button>
        </Box>
        <ProductTable />
        <ProductModal
          open={modals.product}
          handleClose={() => handleCloseModal("product")}
        />
      </Box>

      {/* Contenedor para categorías */}
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("category")}
          >
            Añadir Categoria
          </Button>
        </Box>
        <CategoryTable />
        <AddCategoryModal
          open={modals.category}
          handleClose={() => handleCloseModal("category")}
        />
      </Box>
    </Box>
  );
}
