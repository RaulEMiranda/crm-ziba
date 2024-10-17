"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FullScreenLoader from "@/components/Loader";
import ConfirmDialog from "@/components/ConfirmDialog";

export interface Category {
  id: string;
  category: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Category>("category");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (property: keyof Category) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleOpenConfirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      setOpenConfirmDelete(false); // Close the confirm dialog
      setLoading(true);
      try {
        await deleteDoc(doc(db, "categories", categoryToDelete));
        setCategories(
          categories.filter((category) => category.id !== categoryToDelete)
        );
        setCategoryToDelete(null); // Reset the category to delete
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    console.log("Editar categoría con id:", id);
  };

  const sortedCategories = categories.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (orderDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedCategories = sortedCategories.slice(
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

  return (
    <>
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Listado de Categorías
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 600, // Reduce el ancho máximo
          margin: "auto", // Centra la tabla
          mt: 4, // Margen superior
          border: "1px solid rgba(0, 0, 0, 0.12)", // Agrega un borde para estilo
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? orderDirection : "asc"}
                  onClick={() => handleSort("category")}
                >
                  Categoría
                </TableSortLabel>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(category.id)}
                    sx={{ marginRight: "10px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenConfirmDelete(category.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={categories.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[8]}
        labelRowsPerPage="Categorías por página"
        sx={{ maxWidth: 600, margin: "auto", mt: 2 }}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        description="¿Estás seguro de que deseas eliminar esta categoría?"
      />

      {/* FullScreenLoader */}
      <FullScreenLoader loading={loading} />
    </>
  );
}
