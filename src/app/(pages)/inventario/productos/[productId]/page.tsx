"use client";
import React from "react";

import { Button, Box } from "@mui/material";

import { useRouter } from "next/navigation";

import BarcodeTable from "./components/BarcodeTable";

export default function ProductId({
  params,
}: {
  params: { productId: string };
}) {
  const id = params.productId;

  const router = useRouter();

  return (
    <Box sx={{ p: 3, minWidth: "1000px" }} mt={10} >
      <Box sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/inventario/productos")}
        >
          &larr; Regresar
        </Button>

        <BarcodeTable productId={id} />
      </Box>
    </Box>
  );
}
