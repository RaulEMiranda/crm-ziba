"use client";
import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
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
import { Barcode, Product } from "@/types/product";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/Loader";
import Image from "next/image";

export default function ProductId({
  params,
}: {
  params: { productId: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingBarcode, setEditingBarcode] = useState<string | null>(null);
  const [barcodeFilter, setBarcodeFilter] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const id = params.productId;
  const { control, handleSubmit, reset, setValue } = useForm<{
    barcode: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    const productRef = doc(db, "products", id);
    const unsubscribe = onSnapshot(productRef, (productSnapshot) => {
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data() as Product;
        setProduct({
          ...productData,
          id: productSnapshot.id,
          createdAt:
            productData.createdAt instanceof Date
              ? productData.createdAt
              : productData.createdAt.toDate(),
        });
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleAddBarcode = async (data: { barcode: string }) => {
    if (product && data.barcode.trim()) {
      setLoading(true);
      const newBarcodeObject: Barcode = {
        barcode: data.barcode,
        createdAt: new Date(),
      };

      const updatedBarcodes = editingBarcode
        ? product.barcode.map((code) =>
            code.barcode === editingBarcode ? newBarcodeObject : code
          )
        : [...product.barcode, newBarcodeObject];

      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { barcode: updatedBarcodes });

      setProduct({ ...product, barcode: updatedBarcodes });
      reset();
      setEditingBarcode(null);
      setLoading(false);
    }
  };

  const handleEditBarcode = (barcode: string) => {
    setEditingBarcode(barcode);
    setValue("barcode", barcode);
  };

  const handleDeleteBarcode = async (barcodeToDelete: string) => {
    if (product) {
      const updatedBarcodes = product.barcode.filter(
        (code) => code.barcode !== barcodeToDelete
      );
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { barcode: updatedBarcodes });
      setProduct({ ...product, barcode: updatedBarcodes });
    }
  };

  // Filtrar códigos de barra
  const filteredBarcodes = product?.barcode.filter((code) => {
    const createdAtDate =
      code.createdAt instanceof Date ? code.createdAt : code.createdAt.toDate();

    const matchesBarcode = code.barcode.includes(barcodeFilter);
    const matchesStartDate =
      !startDate || createdAtDate.toISOString() >= startDate;
    const matchesEndDate = !endDate || createdAtDate.toISOString() <= endDate;

    return matchesBarcode && matchesStartDate && matchesEndDate;
  });

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

  if (!product) return <div>Cargando producto...</div>;

  return (
    <Box sx={{ p: 3 }} mt={10}>
      <FullScreenLoader loading={loading} />

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/inventario/productos")}
      >
        &larr; Regresar
      </Button>

      <Box className="flex justify-between my-6 max-w-[1500px] mx-auto ">
        <TextField
          label="Buscar código de barra..."
          variant="outlined"
          value={barcodeFilter}
          onChange={(e) => setBarcodeFilter(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Box className="flex">
          <TextField
            type="date"
            label="Fecha de inicio"
            variant="outlined"
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ marginRight: "10px" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="date"
            label="Fecha de fin"
            variant="outlined"
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        className="max-w-[1500px] mx-auto my-4 border-[1px] mt-6"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Código de Barras</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBarcodes && paginatedBarcodes.length > 0 ? (
              paginatedBarcodes.map((code, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: "200px" }}>
                    {product.name}
                  </TableCell>
                  <TableCell>{product.color}</TableCell>
                  <TableCell>{code.barcode}</TableCell>
                  <TableCell sx={{ minWidth: "200px" }}>
                    {code.createdAt instanceof Date
                      ? code.createdAt.toLocaleString()
                      : code.createdAt.toDate().toLocaleString()}
                  </TableCell>

                  <TableCell sx={{ minWidth: "300px" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditBarcode(code.barcode)}
                      sx={{ marginRight: "10px" }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteBarcode(code.barcode)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Producto sin stock</TableCell>
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
        rowsPerPageOptions={[8]}
        labelRowsPerPage="Códigos por página"
        className="max-w-[1500px] mx-auto mt-3"
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
              label="Nuevo Código de Barras"
              variant="outlined"
              sx={{ marginRight: "10px" }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          type="submit"
        >
          {editingBarcode
            ? "Actualizar Código de Barras"
            : "Agregar Código de Barras"}
        </Button>
      </Box>
      <Box
      component="div"
      className="flex justify-center items-center z-50 relative"
      sx={{ height: "50vh" }}
      >
      {paginatedBarcodes && paginatedBarcodes.length == 0 ? 
        <Image
          src="/images/without-stock.png"
          alt="Imagen de inventario"
          width={250}
          height={250}
          />
          : <Image
          src="/images/with-stock.png"
          alt="Imagen de inventario"
          width={250}
          height={250}
          />}
      </Box>
    </Box>
  );
}
