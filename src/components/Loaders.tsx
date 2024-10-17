"use client";

import React from "react";
import { Box, Modal, Typography, CircularProgress } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

interface LoaderModalProps {
  open: boolean;
  loading: boolean;
  success: boolean;
  error: boolean;
}

export function LoaderAddProductModal({
  open,
  loading,
  success,
  error,
}: LoaderModalProps) {
  return (
    <Modal open={open}>
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <>
            <CircularProgress />
            <Typography mt={2}>Añadiendo nuevo producto...</Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle color="success" sx={{ fontSize: 40 }} />
            <Typography mt={2}>Producto añadido</Typography>
          </>
        ) : error ? (
          <>
            <Error color="error" sx={{ fontSize: 40 }} />
            <Typography mt={2} color="error">
              Error al añadir el producto
            </Typography>
          </>
        ) : null}
      </Box>
    </Modal>
  );
}

export function LoaderAddCategoryModal({
  open,
  loading,
  success,
  error,
}: LoaderModalProps) {
  return (
    <Modal open={open}>
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <>
            <CircularProgress />
            <Typography mt={2}>Añadiendo nueva categoría...</Typography>
          </>
        ) : success ? (
          <>
            <CheckCircle color="success" sx={{ fontSize: 40 }} />
            <Typography mt={2}>Categoría añadida</Typography>
          </>
        ) : error ? (
          <>
            <Error color="error" sx={{ fontSize: 40 }} />
            <Typography mt={2} color="error">
              Error al añadir la categoría
            </Typography>
          </>
        ) : null}
      </Box>
    </Modal>
  );
}
