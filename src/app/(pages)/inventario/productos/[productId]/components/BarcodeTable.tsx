"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  TablePagination,
} from "@mui/material";
import { Product } from "@/types/product";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "@/firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import FullScreenLoader from "@/components/Loader";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import EditBarcodeModal from "./EditeBarcode";
import ConfirmDialog from "@/components/ConfirmDialog";

const BarcodeTable: React.FC<{ productId: string }> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingBarcode, setEditingBarcode] = useState<string | null>(null);
  const [barcodeFilter, setBarcodeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const { control, handleSubmit, reset } = useForm<{ barcode: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [barcodeToDelete, setBarcodeToDelete] = useState<string | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const productRef = doc(db, "products", productId);
    const unsubscribe = onSnapshot(productRef, (productSnapshot) => {
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;
        setProduct({
          ...productData,
          id: productSnapshot.id,
        });
      }
    });
    return () => unsubscribe();
  }, [productId]);

  const handleEditBarcode = (barcode: string) => {
    setEditingBarcode(barcode);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingBarcode(null);
  };

  const openConfirmDialog = (barcode: string) => {
    setBarcodeToDelete(barcode);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setBarcodeToDelete(null);
  };

  // Función de eliminación que se ejecuta tras confirmar
  const handleDeleteBarcode = async () => {
    closeConfirmDialog();
    setLoading(true);
    if (product && barcodeToDelete) {
      const updatedBarcodes = product.barcode.filter(
        (code) => code !== barcodeToDelete
      );
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { barcode: updatedBarcodes });
      setProduct({ ...product, barcode: updatedBarcodes });
      setLoading(false);
    }
  };

  const filteredBarcodes = product?.barcode.filter((code) =>
    code.includes(barcodeFilter)
  );

  const paginatedBarcodes = filteredBarcodes?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddBarcode = async (data: { barcode: string }) => {
    if (product && data.barcode.trim()) {
      setLoading(true);

      const updatedBarcodes = editingBarcode
        ? product.barcode.map((code) =>
            code === editingBarcode ? data.barcode.trim() : code
          )
        : [...product.barcode, data.barcode.trim()];

      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { barcode: updatedBarcodes });

      setProduct({ ...product, barcode: updatedBarcodes });
      reset();
      setEditingBarcode(null);
      setLoading(false);

      // Enfocar el input después de enviar el formulario
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }
  };

  if (!product) return <FullScreenLoader loading={loading} />;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <TextField
            label="Buscar código de barra..."
            variant="outlined"
            value={barcodeFilter}
            onChange={(e) => setBarcodeFilter(e.target.value)}
            sx={{
              width: "300px",
              marginBottom: "16px",
              backgroundColor: "white",
            }}
          />
        </Box>

        <TableContainer component={Paper} className="border-[1px]">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Código de Barras</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBarcodes && paginatedBarcodes.length > 0 ? (
                paginatedBarcodes.map((code, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {code}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditBarcode(code)}
                        sx={{ marginRight: "10px" }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => openConfirmDialog(code)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No hay códigos de barras</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredBarcodes ? filteredBarcodes.length : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box
          component="form"
          onSubmit={handleSubmit(handleAddBarcode)}
          className="my-4 flex justify-center"
        >
          <Controller
            name="barcode"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                inputRef={barcodeInputRef}
                label="Nuevo Código de Barras"
                variant="outlined"
                sx={{ marginRight: "10px", backgroundColor: "white" }}
              />
            )}
          />
          <Button variant="contained" color="primary" type="submit">
            Agregar Código de Barras
          </Button>
        </Box>
        <Box
          component="div"
          className="flex justify-center items-center z-50 relative"
          sx={{ height: "50vh" }}
        >
          {paginatedBarcodes && paginatedBarcodes.length === 0 ? (
            <Image
              src="/images/without-stock.png"
              alt="Imagen de inventario"
              width={250}
              height={250}
              priority
            />
          ) : (
            <Image
              src="/images/with-stock.png"
              alt="Imagen de inventario"
              width={250}
              height={250}
              priority
            />
          )}
        </Box>
      </Box>
      {editingBarcode && (
        <EditBarcodeModal
          open={isEditModalOpen}
          handleClose={handleCloseEditModal}
          barcode={editingBarcode}
          productId={productId}
        />
      )}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleDeleteBarcode}
        title="Eliminar código de barras"
        description="¿Estás seguro de que deseas eliminar este código de barras?"
      />
      <FullScreenLoader loading={loading} />
    </>
  );
};

export default BarcodeTable;
